/**
 * End-to-end coverage of the OAuth runtime (no real sockets): the settings
 * view, config updates, the login-page button set, D2′'s refusal posture, the
 * authorization-code flow, manual binding, unbound rejection and audit hygiene.
 */
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { afterEach, describe, expect, it } from 'vitest'
import { AuthState, type AuditEntry } from '../src/auth.ts'
import { OAuthStateFile, normalizeOAuthConfig } from '../src/oauth/config.ts'
import { OAuthRuntime } from '../src/oauth/runtime.ts'
import {
  oauthBindStartPath,
  oauthCallbackPath,
  oauthStartPath,
} from '../src/oauth/providers.ts'
import { resolveGate, type GateDecision } from '../src/netaccess.ts'
import { resolveOAuthOrigin } from '../src/oauth/origin.ts'

const dirs: string[] = []
afterEach(() => {
  while (dirs.length > 0) rmSync(dirs.pop() as string, { recursive: true, force: true })
})

/** A fake Response capture for the runtime's raw node-style writes. */
interface Captured {
  status: number
  headers: Record<string, unknown>
  body: string
}

function capture(): { res: ServerResponse; read: () => Captured } {
  const out: Captured = { status: 0, headers: {}, body: '' }
  const res = {
    writeHead(status: number, headers: Record<string, unknown>) {
      out.status = status
      out.headers = headers
      return res
    },
    end(body?: string) {
      out.body = body ?? ''
      return res
    },
  } as unknown as ServerResponse
  return { res, read: () => out }
}

const request = (url: string, method = 'GET'): IncomingMessage => ({
  url,
  method,
  headers: { 'user-agent': 'vitest' },
}) as unknown as IncomingMessage

const gate: GateDecision = {
  mode: 'session',
  secure: true,
  cookieName: '__Host-dsh-proxy-session',
  origin: 'https://dsh.example.com',
}

/** The IdP always answers with a token and a stable GitHub subject (id 42). */
const fakeFetch = (async (input: unknown) => {
  const url = String(input)
  const body = url.includes('access_token') || url.endsWith('/token')
    ? { access_token: 'access-1' }
    : { id: 42, login: 'octocat', email: 'a@b.c', sub: 'sub-1', open_id: 'ou-1' }
  return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } })
}) as unknown as typeof fetch

/** A self-hosted auth center answers userinfo with OIDC claims and no `id`. */
const casdoorFetch = (async (input: unknown) => {
  const url = String(input)
  const body = url.includes('access_token') || url.endsWith('/token')
    ? { access_token: 'access-1' }
    : { sub: 'casdoor-user-1', name: 'Ada', preferred_username: 'ada', email: 'a@b.c' }
  return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } })
}) as unknown as typeof fetch

interface Harness {
  runtime: OAuthRuntime
  stateFile: OAuthStateFile
  audits: AuditEntry[]
  setPassword: (on: boolean) => void
  setMode: (mode: 'login' | 'basic') => void
  setGateMode: (mode: GateDecision['mode']) => void
  gateFor: () => GateDecision
}

function harness(oauthInput: unknown = {}, options: { gateDecision?: GateDecision; fetchImpl?: typeof fetch } = {}): Harness {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-oauth-runtime-'))
  dirs.push(dir)
  const stateFile = new OAuthStateFile(join(dir, 'dsh-proxy-oauth.yaml'))
  const audits: AuditEntry[] = []
  const state = { password: false, mode: 'login' as 'login' | 'basic', gateMode: 'session' as GateDecision['mode'] }
  const auth = new AuthState({ audit: (entry) => audits.push(entry) })
  const configured = normalizeOAuthConfig(oauthInput)
  const runtime = new OAuthRuntime({
    base: configured,
    stateFile,
    auth,
    getLocalSubject: () => 'admin',
    hasPassword: () => state.password,
    cleartextAuth: () => state.mode,
    // Mirror ProxyController: read the LIVE override (the controller reads
    // `oauth.effective`), not the config snapshot captured at construction —
    // otherwise clearing publicOrigin would still resolve to the old value.
    publicOrigin: (requestOrigin?: string) => resolveOAuthOrigin({
      configured: stateFile.read().overlay?.publicOrigin ?? configured.publicOrigin,
      requestOrigin,
      listenPort: 3081,
      inferred: 'http://127.0.0.1:3081',
    }).origin,
    audit: (entry) => audits.push(entry),
    log: () => {},
    fetchImpl: options.fetchImpl ?? fakeFetch,
  })
  const chosenGate = options.gateDecision ?? gate
  return {
    runtime,
    stateFile,
    audits,
    setPassword: (on) => { state.password = on },
    setMode: (mode) => { state.mode = mode },
    setGateMode: (mode) => { state.gateMode = mode },
    gateFor: () => ({ ...chosenGate, mode: state.gateMode }),
  }
}

/** Run one OAuth route and return what the runtime wrote. */
async function handle(h: Harness, url: string, method = 'GET'): Promise<Captured> {
  const pathname = new URL(url, 'http://proxy.local').pathname
  const { res, read } = capture()
  const handled = await h.runtime.handle(request(url, method), res, pathname, h.gateFor(), '127.0.0.1')
  expect(handled).toBe(true)
  return read()
}

const githubEnabled = (extra: unknown = {}) => ({
  enabled: true,
  providers: { github: { enabled: true, clientId: 'app', clientSecret: 'top-secret' } },
  ...(extra as object),
})

describe('status view', () => {
  it('reports the raw override separately from the resolved origin', () => {
    const configured = harness(githubEnabled({ publicOrigin: 'https://sso.example.com' }))
    expect(configured.runtime.statusView().publicOriginOverride).toBe('https://sso.example.com')
    expect(configured.runtime.statusView().publicOrigin).toBe('https://sso.example.com')

    const auto = harness(githubEnabled())
    const view = auto.runtime.statusView('http://127.0.0.1:3080')
    expect(view.publicOriginOverride).toBe('')
    expect(view.publicOrigin).toBe('http://127.0.0.1:3081')
  })

  it('persists a cleared override and falls back to the settings page origin', () => {
    const h = harness(githubEnabled({ publicOrigin: 'https://sso.example.com' }))
    const result = h.runtime.updateConfig({ publicOrigin: '' }, 'http://localhost:3080')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.view.publicOriginOverride).toBe('')
      expect(result.view.publicOrigin).toBe('http://localhost:3081')
    }
    expect(h.stateFile.read().overlay?.publicOrigin).toBe('')
  })

  it('defaults to all channels OFF with official endpoints', () => {
    const h = harness()
    const view = h.runtime.statusView()
    expect(view.hasAnyAuth).toBe(false)
    expect(view.bindings).toEqual([])
    expect(view.providers.github.endpoints.authorizationEndpoint).toBe('https://github.com/login/oauth/authorize')
    expect(view.providers.google.effectiveSource).toBe('official')
    expect(view.providers.casdoor.issues.join(' ')).toContain('未配置统一认证中心地址')
    expect(view.providers.github.displayOnLogin).toBe(false)
  })

  it('masks nothing from the authorized view but exposes the secret for the masked input', () => {
    const h = harness(githubEnabled())
    const view = h.runtime.statusView()
    expect(view.providers.github.clientSecret).toBe('top-secret')
    expect(view.providers.github.displayOnLogin).toBe(true)
    expect(view.hasAnyAuth).toBe(true)
  })

  it('shows auth-center endpoints and their source', () => {
    const h = harness(githubEnabled({ authCenter: { baseUrl: 'https://door.example.com' } }))
    const view = h.runtime.statusView()
    expect(view.providers.github.effectiveSource).toBe('auth-center')
    expect(view.providers.github.endpoints.tokenEndpoint).toBe('https://door.example.com/api/login/oauth/access_token')
    expect(view.providers.github.redirectUri).toContain('/__dsh-proxy/oauth/github/callback')
  })

  it('renders only enabled channels, never in Basic mode, never without any auth', () => {
    const h = harness(githubEnabled())
    expect(h.runtime.loginProviders('session').map(p => p.id)).toEqual(['github'])
    h.setMode('basic')
    expect(h.runtime.loginProviders('session')).toEqual([])
    h.setMode('login')
    expect(h.runtime.loginProviders('basic')).toEqual([])

    const empty = harness()
    expect(empty.runtime.loginProviders('session')).toEqual([])
    expect(empty.runtime.authEnabled).toBe(false)
    empty.setPassword(true)
    expect(empty.runtime.loginProviders('session')).toEqual([])
    expect(empty.runtime.authEnabled).toBe(true)
  })
})

describe('config updates', () => {
  it('rejects a half-configured channel with a Chinese reason', () => {
    const h = harness()
    const result = h.runtime.updateConfig({ enabled: true, providers: { github: { enabled: true, clientId: 'app' } } })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toContain('Client ID 或 Client Secret')
  })

  it('persists a valid patch and keeps official endpoints official', () => {
    const h = harness()
    const result = h.runtime.updateConfig({
      enabled: true,
      providers: {
        github: {
          enabled: true, clientId: 'app', clientSecret: 'top-secret',
          endpoints: { authorizationEndpoint: '', tokenEndpoint: '', userInfoEndpoint: '' },
        },
      },
    })
    expect(result.ok).toBe(true)
    expect(h.stateFile.read().overlay?.enabled).toBe(true)
    expect(h.runtime.statusView().providers.github.effectiveSource).toBe('official')
    expect(h.runtime.authEnabled).toBe(true)
  })
})

describe('callback origin follows the current page', () => {
  const redirectUriOf = async (h: Harness): Promise<string> => {
    const answer = await handle(h, oauthStartPath('github'))
    expect(answer.status).toBe(302)
    return new URL(String(answer.headers.location)).searchParams.get('redirect_uri') ?? ''
  }

  it('builds a plain-HTTP callback from a loopback browser request', async () => {
    const h = harness(githubEnabled(), {
      gateDecision: resolveGate({
        secure: false, host: '127.0.0.1:3081', socketEncrypted: false, requireTls: false,
      }),
    })
    // Regression for ERR_SSL_PROTOCOL_ERROR: this used to be https://127.0.0.1:3081.
    expect(await redirectUriOf(h)).toBe('http://127.0.0.1:3081/__dsh-proxy/oauth/github/callback')
  })

  it('follows whatever domain and port the browser used', async () => {
    const h = harness(githubEnabled(), {
      gateDecision: resolveGate({
        secure: false, host: 'my-pc.local:3091', socketEncrypted: false, requireTls: false,
      }),
    })
    expect(await redirectUriOf(h)).toBe('http://my-pc.local:3091/__dsh-proxy/oauth/github/callback')
  })

  it('uses https only when the request really arrived over TLS', async () => {
    const h = harness(githubEnabled(), {
      gateDecision: resolveGate({
        secure: true, host: 'dsh.example.com', socketEncrypted: true, requireTls: false,
      }),
    })
    expect(await redirectUriOf(h)).toBe('https://dsh.example.com/__dsh-proxy/oauth/github/callback')
  })

  it('lets an explicit publicOrigin override win for a reverse proxy', async () => {
    const h = harness(githubEnabled({ publicOrigin: 'https://sso.example.com/' }), {
      gateDecision: resolveGate({
        secure: false, host: '127.0.0.1:3081', socketEncrypted: false, requireTls: false,
      }),
    })
    expect(await redirectUriOf(h)).toBe('https://sso.example.com/__dsh-proxy/oauth/github/callback')
  })

  it('shows the callback URI and binding link derived from the settings page request', () => {
    const h = harness(githubEnabled())
    const view = h.runtime.statusView('http://127.0.0.1:3080')
    expect(view.publicOrigin).toBe('http://127.0.0.1:3081')
    expect(view.providers.github.redirectUri)
      .toBe('http://127.0.0.1:3081/__dsh-proxy/oauth/github/callback')
    const bound = h.runtime.startBinding({ provider: 'github' }, 'http://127.0.0.1:3080')
    expect(bound.ok).toBe(true)
    if (bound.ok) expect(bound.startUrl).toContain('http://127.0.0.1:3081/__dsh-proxy/oauth/github/bind/start?ticket=')
  })
})

describe('D2′ — no authentication method configured', () => {
  it('refuses every OAuth route with 403 and audits oauth-unavailable', async () => {
    const h = harness()
    expect(h.runtime.authEnabled).toBe(false)
    const answer = await handle(h, oauthStartPath('github'))
    expect(answer.status).toBe(403)
    expect(answer.body).toContain('第三方登录当前不可用')
    expect(h.audits.map(entry => entry.event)).toContain('oauth-unavailable')
  })

  it('still allows a real (password) or OAuth-only gate to start a flow', async () => {
    const h = harness(githubEnabled())
    const answer = await handle(h, oauthStartPath('github'))
    expect(answer.status).toBe(302)
    const location = String(answer.headers.location)
    expect(location).toContain('https://github.com/login/oauth/authorize')
    const authorize = new URL(location)
    expect(authorize.searchParams.get('code_challenge_method')).toBe('S256')
    expect(authorize.searchParams.get('redirect_uri')).toBe('https://dsh.example.com/__dsh-proxy/oauth/github/callback')
    expect(authorize.searchParams.get('state')).not.toBe('')
  })
})

/** Start a login flow and return its state value. */
async function startFlow(h: Harness, kind: 'login' | 'bind' = 'login'): Promise<string> {
  let url = oauthStartPath('github')
  if (kind === 'bind') {
    const ticket = h.runtime.startBinding({ provider: 'github' })
    expect(ticket.ok).toBe(true)
    if (!ticket.ok) return ''
    const bindUrl = new URL(ticket.startUrl)
    url = `${oauthBindStartPath('github')}?ticket=${bindUrl.searchParams.get('ticket') ?? ''}`
  }
  const answer = await handle(h, url)
  expect(answer.status).toBe(302)
  return new URL(String(answer.headers.location)).searchParams.get('state') ?? ''
}

describe('authorization-code callback', () => {
  it('binds a custom auth-center account by its OIDC sub', async () => {
    const h = harness({
      enabled: true,
      providers: {
        github: {
          enabled: true, clientId: 'app', clientSecret: 'top-secret',
          baseUrl: 'https://door.example.com', providerHint: 'provider_oauth_github',
        },
      },
    }, { fetchImpl: casdoorFetch })
    expect(h.runtime.statusView().providers.github.effectiveSource).toBe('provider-override')
    const state = await startFlow(h, 'bind')
    const answer = await handle(h, `${oauthCallbackPath('github')}?state=${state}&code=code-1`)
    expect(answer.body).toContain('绑定成功')
    expect(h.runtime.statusView().bindings[0]?.subject).toBe('casdoor-user-1')
  })

  it('allows the popup inline script in the finish response CSP', async () => {
    const h = harness(githubEnabled())
    const state = await startFlow(h)
    const answer = await handle(h, `${oauthCallbackPath('github')}?state=${state}&code=code-1`)
    const csp = String(answer.headers['content-security-policy'])
    expect(csp).toContain("default-src 'none'")
    expect(csp).toContain("script-src 'unsafe-inline'")
  })

  it('refuses an unbound account and issues no session cookie', async () => {
    const h = harness(githubEnabled())
    const state = await startFlow(h)
    const answer = await handle(h, `${oauthCallbackPath('github')}?state=${state}&code=code-1`)
    expect(answer.status).toBe(200)
    expect(answer.body).toContain('尚未绑定')
    expect(answer.headers.location).toBeUndefined()
    expect(answer.body).toContain('BroadcastChannel')
    expect(answer.headers['set-cookie']).toBeUndefined()
    expect(h.audits.map(entry => entry.event)).toContain('oauth-login-unbound')
  })

  it('rejects a replayed/expired state and a denied authorization', async () => {
    const h = harness(githubEnabled())
    const state = await startFlow(h)
    const invalid = await handle(h, `${oauthCallbackPath('github')}?state=not-a-state&code=code-1`)
    expect(invalid.status).toBe(400)
    expect(h.audits.map(entry => entry.event)).toContain('oauth-state-invalid')

    const replay = await handle(h, `${oauthCallbackPath('github')}?state=${state}&error=access_denied`)
    expect(replay.status).toBe(200)
    expect(replay.body).toContain('已取消授权')
    expect(h.audits.map(entry => entry.event)).toContain('oauth-access-denied')
    const again = await handle(h, `${oauthCallbackPath('github')}?state=${state}&code=code-1`)
    expect(again.status).toBe(400)
  })

  it('signs in only after a manual binding, then refuses again after unbinding', async () => {
    const h = harness(githubEnabled())
    const state = await startFlow(h, 'bind')
    const bound = await handle(h, `${oauthCallbackPath('github')}?state=${state}&code=code-1`)
    expect(bound.status).toBe(200)
    expect(bound.body).toContain('绑定成功')
    expect(bound.headers.location).toBeUndefined()
    expect(h.stateFile.read().bindings).toHaveLength(1)
    expect(h.stateFile.read().bindings[0].subject).toBe('42')
    expect(h.audits.map(entry => entry.event)).toContain('oauth-binding-added')

    const loginState = await startFlow(h)
    const signedIn = await handle(h, `${oauthCallbackPath('github')}?state=${loginState}&code=code-1`)
    expect(signedIn.status).toBe(200)
    expect(signedIn.body).toContain('登录成功')
    expect(signedIn.headers.location).toBeUndefined()
    expect(String(signedIn.headers['set-cookie'])).toContain('__Host-dsh-proxy-session')
    expect(h.audits.map(entry => entry.event)).toContain('oauth-login')

    const id = h.stateFile.read().bindings[0].id
    expect(h.runtime.removeBindingById({ id }).ok).toBe(true)
    const afterUnbind = await startFlow(h)
    const refused = await handle(h, `${oauthCallbackPath('github')}?state=${afterUnbind}&code=code-1`)
    expect(refused.body).toContain('尚未绑定')
  })

  it('refuses a duplicate binding and an invalid bind ticket', async () => {
    const h = harness(githubEnabled())
    const first = await startFlow(h, 'bind')
    await handle(h, `${oauthCallbackPath('github')}?state=${first}&code=code-1`)
    const second = await startFlow(h, 'bind')
    const duplicate = await handle(h, `${oauthCallbackPath('github')}?state=${second}&code=code-1`)
    expect(duplicate.body).toContain('已经绑定')
    expect(h.audits.map(entry => entry.event)).toContain('oauth-binding-rejected')

    const noTicket = await handle(h, oauthBindStartPath('github'))
    expect(noTicket.status).toBe(403)
    expect(noTicket.body).toContain('绑定票据无效')
  })

  it('never writes credentials, codes or tokens to the audit trail', async () => {
    const h = harness(githubEnabled())
    const state = await startFlow(h, 'bind')
    await handle(h, `${oauthCallbackPath('github')}?state=${state}&code=code-1`)
    const serialized = JSON.stringify(h.audits)
    for (const secret of ['top-secret', 'access-1', 'code-1', state]) {
      expect(serialized).not.toContain(secret)
    }
  })
})

describe('bootstrap bindings', () => {
  it('writes deployment-declared bindings exactly once', () => {
    const config = githubEnabled({
      bootstrapBindings: [{ provider: 'github', subject: '42', email: 'a@b.c' }],
    })
    const h = harness(config)
    expect(h.stateFile.read().bindings).toHaveLength(1)
    expect(h.stateFile.read().bindings[0].boundVia).toBe('bootstrap')
    // A second runtime over the same file must not duplicate the seed.
    const second = new OAuthRuntime({
      base: normalizeOAuthConfig(config),
      stateFile: h.stateFile,
      auth: new AuthState({}),
      getLocalSubject: () => 'admin',
      hasPassword: () => false,
      cleartextAuth: () => 'login',
      publicOrigin: () => 'http://127.0.0.1:3081',
      audit: () => {},
      log: () => {},
      fetchImpl: fakeFetch,
    })
    expect(second.statusView().bindings).toHaveLength(1)
  })
})

describe('login page integration', () => {
  it('renders only enabled channel buttons and never a script tag', () => {
    const h = harness(githubEnabled())
    const state = h.runtime.loginProviders('session')
    expect(state).toHaveLength(1)
    expect(state[0].icon).toContain('<svg')
    expect(state[0].startUrl).toBe(oauthStartPath('github'))
  })
})

describe('provider_hint on custom endpoints', () => {
  it('survives a full settings-page save and a runtime restart', () => {
    const dir = mkdtempSync(join(tmpdir(), 'dsh-oauth-hint-restart-'))
    dirs.push(dir)
    const path = join(dir, 'dsh-proxy-oauth.yaml')
    const make = (): OAuthRuntime => {
      const auth = new AuthState({ audit: () => {} })
      return new OAuthRuntime({
        base: normalizeOAuthConfig({}),
        stateFile: new OAuthStateFile(path),
        auth,
        getLocalSubject: () => 'admin',
        hasPassword: () => false,
        cleartextAuth: () => 'login',
        publicOrigin: () => 'http://127.0.0.1:3081',
        audit: () => {},
        log: () => {},
        fetchImpl: fakeFetch,
      })
    }
    // Exactly the shape OAuthCard.submit() sends: every channel, every field.
    const disabled = () => ({
      enabled: false, clientId: '', clientSecret: '', scopes: [], baseUrl: '', label: '',
      providerHint: '', endpoints: { authorizationEndpoint: '', tokenEndpoint: '', userInfoEndpoint: '' },
    })
    const payload = {
      enabled: true,
      authCenter: { baseUrl: '' },
      publicOrigin: '',
      providers: {
        github: {
          enabled: true, clientId: 'app', clientSecret: 'top-secret',
          scopes: ['openid', 'profile', 'email'], baseUrl: 'https://door.example.com',
          label: '', providerHint: 'github',
          endpoints: { authorizationEndpoint: '', tokenEndpoint: '', userInfoEndpoint: '' },
        },
        google: disabled(), feishu: disabled(), casdoor: disabled(),
      },
    }
    const first = make()
    const result = first.updateConfig(payload)
    expect(result.ok).toBe(true)
    expect(first.statusView().providers.github.providerHint).toBe('github')
    // Simulate `dsh web` restart: a brand new runtime reading the same file.
    const restarted = make()
    expect(restarted.statusView().providers.github.providerHint).toBe('github')
    expect(new OAuthStateFile(path).read().overlay?.providers.github.providerHint).toBe('github')
  })

  it('persists a providerHint submitted through the settings patch', () => {
    const h = harness()
    const result = h.runtime.updateConfig({
      enabled: true,
      providers: {
        github: {
          enabled: true, clientId: 'app', clientSecret: 'top-secret',
          providerHint: 'github',
        },
      },
    })
    expect(result.ok).toBe(true)
    expect(h.runtime.statusView().providers.github.providerHint).toBe('github')
    expect(h.stateFile.read().overlay?.providers.github.providerHint).toBe('github')
  })

  const hinted = githubEnabled({
    authCenter: { baseUrl: 'https://door.example.com' },
    providers: {
      github: { enabled: true, clientId: 'app', clientSecret: 'top-secret', providerHint: 'github' },
    },
  })

  it('is exposed in the status view and appended to the authorize URL', async () => {
    const h = harness(hinted)
    expect(h.runtime.statusView().providers.github.providerHint).toBe('github')
    const answer = await handle(h, oauthStartPath('github'))
    expect(answer.status).toBe(302)
    const authorize = new URL(String(answer.headers.location))
    expect(authorize.origin).toBe('https://door.example.com')
    expect(authorize.searchParams.get('provider_hint')).toBe('github')
  })

  it('omits provider_hint entirely when unset (official endpoints unchanged)', async () => {
    const h = harness(githubEnabled())
    expect(h.runtime.statusView().providers.github.providerHint).toBe('')
    const answer = await handle(h, oauthStartPath('github'))
    const authorize = new URL(String(answer.headers.location))
    expect(authorize.searchParams.has('provider_hint')).toBe(false)
  })

  it('carries the hint on bind flows too', async () => {
    const h = harness(hinted)
    const ticket = h.runtime.startBinding({ provider: 'github' })
    expect(ticket.ok).toBe(true)
    if (!ticket.ok) return
    const bindUrl = new URL(ticket.startUrl)
    const answer = await handle(h, `${oauthBindStartPath('github')}?ticket=${bindUrl.searchParams.get('ticket') ?? ''}`)
    const authorize = new URL(String(answer.headers.location))
    expect(authorize.searchParams.get('provider_hint')).toBe('github')
  })
})
