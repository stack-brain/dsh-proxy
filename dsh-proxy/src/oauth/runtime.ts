/**
 * OAuthRuntime: the single object shared by the controller (settings RPCs),
 * the proxy gate (login-page buttons + gate state) and the HTTP auth routes.
 *
 * It owns the effective config, the manual binding table, the one-shot flow
 * state and tickets. Everything is in memory or in one profile-private file;
 * no cordis dependency so the whole feature stays unit-testable.
 */
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { GateDecision } from '../netaccess.ts'
import type { AuthState } from '../auth.ts'
import { sessionCookie } from '../auth.ts'
import type { AuditEntry } from '../auth.ts'
import { renderOAuthFinishPage, type OAuthFinishStatus } from './finish.ts'
import type {
  LanProxyOAuthBindingView,
  LanProxyOAuthProviderView,
  LanProxyOAuthView,
} from '../contract.ts'
import { OAuthStateFile, mergeOAuthConfig, validateOAuthPatch } from './config.ts'
import {
  BindingTicketStore,
  addBinding,
  findBinding,
  normalizeBindings,
  removeBinding,
  type OAuthBinding,
} from './bindings.ts'
import {
  OAuthStateStore,
  buildAuthorizeUrl,
  exchangeCode,
  fetchUserInfo,
  pkcePair,
  type FetchImpl,
} from './flow.ts'
import {
  DEFAULT_PROVIDER_LABELS,
  OAUTH_PROVIDER_IDS,
  effectiveProviderHint,
  effectiveScopes,
  extractProfile,
  extractSubject,
  isOAuthProviderId,
  isProviderReady,
  oauthBindStartPath,
  oauthCallbackPath,
  oauthStartPath,
  providerIconSvg,
  readyProviders,
  resolveProviderEndpoints,
  type OAuthConfig,
  type OAuthLoginButton,
  type OAuthProviderId,
} from './providers.ts'


/** Shared response headers: never cached, never a referrer, no external assets. */
const OAUTH_HEADERS: Record<string, string> = {
  'cache-control': 'no-store, must-revalidate',
  'referrer-policy': 'no-referrer',
  // The finish page's inline script notifies the opener and closes the popup
  // ONLY on success. default-src 'none' still forbids all external resources.
  'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
}

/** The face the proxy gate needs (kept small so proxy.ts stays decoupled). */
export interface OAuthGateLike {
  /** Whether ANY authentication method is configured. */
  readonly authEnabled: boolean
  /** Channel buttons for the current access mode (empty in Basic mode). */
  loginProviders(mode: GateDecision['mode']): OAuthLoginButton[]
  /** Answer one OAuth route; false when the pathname is not ours. */
  handle(
    req: IncomingMessage,
    res: ServerResponse,
    pathname: string,
    gate: GateDecision,
    source: string,
  ): Promise<boolean>
}

export interface OAuthRuntimeOptions {
  /** Fully resolved cordis configuration (schema defaults applied). */
  base: OAuthConfig
  /** Profile-private overlay + binding table. */
  stateFile: OAuthStateFile
  /** The proxy's session store; external sign-ins reuse it. */
  auth: AuthState
  /** Current local account name (or 'default' when no password is set). */
  getLocalSubject: () => string
  /** Whether the local username/password pair is complete. */
  hasPassword: () => boolean
  /** Active cleartext mode, used to hide channel buttons in Basic mode. */
  cleartextAuth: () => 'login' | 'basic'
  /**
   * Externally reachable proxy origin for binding links and displayed callback
   * hints. Takes the settings RPC's request origin so the hint follows the
   * page the operator is actually on; the live login flow uses `gate.origin`.
   */
  publicOrigin: (requestOrigin?: string) => string
  audit: (entry: AuditEntry) => void
  log: (level: 'info' | 'warn' | 'error', message: string) => void
  now?: () => number
  fetchImpl?: FetchImpl
}

/** Result shapes returned to the settings RPC dispatcher. */
export type OAuthViewResult =
  | { ok: true; view: LanProxyOAuthView }
  | { ok: false; message: string }

export class OAuthRuntime implements OAuthGateLike {
  private config: OAuthConfig
  private bindings: OAuthBinding[]
  private readonly flows: OAuthStateStore
  private readonly tickets: BindingTicketStore
  private readonly now: () => number
  private readonly opts: OAuthRuntimeOptions

  constructor(options: OAuthRuntimeOptions) {
    this.opts = options
    this.now = options.now ?? (() => Date.now())
    const ttl = options.base.stateTtlMs ?? 600000
    this.flows = new OAuthStateStore({ now: this.now, ttlMs: ttl })
    this.tickets = new BindingTicketStore({ now: this.now, ttlMs: ttl })
    const state = options.stateFile.read()
    this.config = mergeOAuthConfig(options.base, state)
    this.bindings = normalizeBindings(state.bindings)
    this.applyBootstrap()
  }

  /** Effective config (used by the controller for status/log decisions). */
  get effective(): OAuthConfig {
    return this.config
  }

  /** Providers that are enabled, fully configured and have valid endpoints. */
  private ready(): OAuthProviderId[] {
    return readyProviders(this.config)
  }

  /** D2: password login OR at least one usable OAuth provider. */
  get authEnabled(): boolean {
    return this.opts.hasPassword() || this.ready().length > 0
  }

  /** D7: only enabled channels appear; D5: never in Basic mode; D2′: none with no auth. */
  loginProviders(mode: GateDecision['mode']): OAuthLoginButton[] {
    if (mode !== 'session' || !this.authEnabled || !this.config.enabled) return []
    if (this.opts.cleartextAuth() === 'basic') return []
    return this.ready().map(id => ({
      id,
      label: this.config.providers[id].label?.trim() || DEFAULT_PROVIDER_LABELS[id],
      startUrl: oauthStartPath(id),
      icon: providerIconSvg(id),
    }))
  }

  /** A one-time bootstrap: deployment-declared bindings are written only once. */
  private applyBootstrap(): void {
    const seeds = this.config.bootstrapBindings ?? []
    if (seeds.length === 0 || this.bindings.length > 0) return
    let next: OAuthBinding[] = []
    for (const seed of seeds) {
      const result = addBinding(next, {
        provider: seed.provider,
        subject: seed.subject,
        localSubject: this.opts.getLocalSubject(),
        boundVia: 'bootstrap',
        ...(seed.email === undefined ? {} : { email: seed.email }),
      })
      if (result.ok) next = result.bindings
    }
    if (next.length === 0) return
    this.bindings = next
    this.persist()
    this.opts.audit({ at: this.now(), event: 'oauth-binding-added', source: 'bootstrap', detail: `${next.length} bootstrap bindings` })
    this.opts.log('info', `dsh-proxy: seeded ${next.length} bootstrap OAuth binding(s)`)
  }

  /** Write the overlay + binding table atomically. */
  private persist(): void {
    this.opts.stateFile.write({
      overlay: this.config,
      bindings: this.bindings,
    })
  }

  /** The redirect URI registered at the IdP (explicit override wins). */
  private redirectUri(id: OAuthProviderId, publicOrigin: string): string {
    const configured = this.config.providers[id].redirectUri?.trim()
    return configured !== undefined && configured !== '' ? configured : `${publicOrigin}${oauthCallbackPath(id)}`
  }

  /** The settings-page view: masked-in-UI secrets, resolved endpoints, bindings. */
  statusView(requestOrigin?: string): LanProxyOAuthView {
    const publicOrigin = this.opts.publicOrigin(requestOrigin).replace(/\/+$/, '')
    const providers = {} as Record<OAuthProviderId, LanProxyOAuthProviderView>
    const ready = new Set(this.ready())
    for (const id of OAUTH_PROVIDER_IDS) {
      const provider = this.config.providers[id]
      const resolved = resolveProviderEndpoints(id, provider, this.config.authCenter)
      const issues = [...resolved.issues]
      if (provider.enabled && (provider.clientId.trim() === '' || provider.clientSecret.trim() === '')) {
        issues.push('未配置 Client ID 或 Client Secret')
      }
      providers[id] = {
        enabled: provider.enabled,
        label: provider.label?.trim() || DEFAULT_PROVIDER_LABELS[id],
        clientId: provider.clientId,
        clientSecret: provider.clientSecret,
        scopes: effectiveScopes(id, provider),
        baseUrl: provider.baseUrl ?? '',
        endpoints: resolved.endpoints,
        endpointOverrides: provider.endpoints ?? {},
        providerHint: provider.providerHint ?? '',
        redirectUri: this.redirectUri(id, publicOrigin),
        effectiveSource: resolved.source,
        issues,
        displayOnLogin: ready.has(id) && this.opts.cleartextAuth() === 'login',
      }
    }
    const bindings: LanProxyOAuthBindingView[] = this.bindings.map(entry => ({
      id: entry.id,
      provider: entry.provider,
      subject: entry.subject,
      localSubject: entry.localSubject,
      boundAt: entry.boundAt,
      boundVia: entry.boundVia,
      ...(entry.email === undefined ? {} : { email: entry.email }),
      ...(entry.displayName === undefined ? {} : { displayName: entry.displayName }),
    }))
    return {
      enabled: this.config.enabled,
      publicOrigin,
      publicOriginOverride: this.config.publicOrigin?.trim() ?? '',
      authCenter: {
        baseUrl: this.config.authCenter?.baseUrl ?? '',
        endpoints: this.config.authCenter?.endpoints ?? {},
      },
      providers,
      bindings,
      hasAnyAuth: this.authEnabled,
      cleartextAuth: this.opts.cleartextAuth(),
    }
  }

  /** Validate and persist a settings patch; the running proxy sees it at once. */
  updateConfig(payload: unknown, requestOrigin?: string): OAuthViewResult {
    const check = validateOAuthPatch(payload, this.config)
    if (!check.ok) return { ok: false, message: check.message }
    this.config = check.config
    this.persist()
    const enabled = this.ready().join(', ') || 'none'
    this.opts.log('info', `dsh-proxy: OAuth config updated (enabled providers: ${enabled})`)
    return { ok: true, view: this.statusView(requestOrigin) }
  }

  /** Issue a one-shot binding ticket from the settings page. */
  startBinding(payload: unknown, requestOrigin?: string): { ok: true; startUrl: string } | { ok: false; message: string } {
    const provider = (payload as { provider?: unknown } | null)?.provider
    if (!isOAuthProviderId(provider)) return { ok: false, message: '未知的第三方登录渠道' }
    if (!this.config.enabled || !isProviderReady(provider, this.config)) {
      return { ok: false, message: '该渠道尚未启用或配置不完整，请先保存渠道配置' }
    }
    const ticket = this.tickets.issue({
      provider,
      source: 'settings',
      localSubject: this.opts.getLocalSubject(),
    })
    const origin = this.opts.publicOrigin(requestOrigin).replace(/\/+$/, '')
    return { ok: true, startUrl: `${origin}${oauthBindStartPath(provider)}?ticket=${encodeURIComponent(ticket)}` }
  }

  /** Remove one binding; the account loses access immediately. */
  removeBindingById(payload: unknown, requestOrigin?: string): OAuthViewResult {
    const id = (payload as { id?: unknown } | null)?.id
    if (typeof id !== 'string' || id === '') return { ok: false, message: '绑定 id 无效' }
    const next = removeBinding(this.bindings, id)
    if (next.length === this.bindings.length) return { ok: false, message: '该绑定不存在' }
    this.bindings = next
    this.persist()
    this.opts.audit({ at: this.now(), event: 'oauth-binding-removed', source: 'settings', detail: id })
    return { ok: true, view: this.statusView(requestOrigin) }
  }

  /**
   * Send the popup result page. The opener never navigates: it listens on a
   * same-origin BroadcastChannel (see `finish.ts`) and reloads on success.
   * `headers` carries the session cookie for a successful login.
   */
  private finish(
    res: ServerResponse,
    status: OAuthFinishStatus,
    intent: 'login' | 'bind',
    message?: string,
    headers: Record<string, string> = {},
    httpStatus = 200,
  ): void {
    const html = renderOAuthFinishPage({
      status,
      intent,
      ...(message === undefined ? {} : { message }),
    })
    res.writeHead(httpStatus, {
      ...OAUTH_HEADERS,
      'content-type': 'text/html; charset=utf-8',
      ...headers,
    })
    res.end(html)
  }

  /** Audit helper: never record codes, tokens, secrets or state values. */
  private audit(event: AuditEntry['event'], source: string, detail?: string): void {
    this.opts.audit({
      at: this.now(),
      event,
      source,
      ...(detail === undefined ? {} : { detail }),
    })
  }

  /**
   * Answer every `/__dsh-proxy/oauth/...` route.
   *
   * D2′: with no authentication method configured (or a disabled channel) all
   * of them answer 403 and audit `oauth-unavailable`; the rest of the proxy
   * keeps its open-access, warning-only posture.
   */
  async handle(
    req: IncomingMessage,
    res: ServerResponse,
    pathname: string,
    gate: GateDecision,
    source: string,
  ): Promise<boolean> {
    const match = /^\/__dsh-proxy\/oauth\/([^/]+)\/(start|bind\/start|callback)$/.exec(pathname)
    if (match === null) return false
    const id = match[1]
    const action = match[2]
    if (!isOAuthProviderId(id)) {
      this.finish(res, 'invalid', 'login', '未知的第三方登录渠道', {}, 404)
      return true
    }
    if (gate.mode !== 'session' || !this.authEnabled || !this.config.enabled || !isProviderReady(id, this.config)) {
      this.audit('oauth-unavailable', source, `${id} ${action}`)
      this.finish(res, 'unavailable', 'login', '第三方登录当前不可用：请先配置密码或启用并配置该渠道，且使用登录页模式。', {}, 403)
      return true
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      this.finish(res, 'invalid', 'login', '405 Method Not Allowed', {}, 405)
      return true
    }

    const url = new URL(req.url ?? '/', 'http://proxy.local')
    const provider = this.config.providers[id]
    const resolved = resolveProviderEndpoints(id, provider, this.config.authCenter)
    // Follow the page the browser actually used. `gate.origin` is built from
    // this request's Host header + real transport scheme, so the callback host
    // is never hardcoded. An explicit operator override still wins for reverse
    // proxies whose external name cannot be inferred from the request.
    const configured = this.config.publicOrigin?.trim()
    const publicOrigin = configured !== undefined && configured !== ''
      ? configured.replace(/\/+$/, '')
      : gate.origin.replace(/\/+$/, '')
    const redirectUri = this.redirectUri(id, publicOrigin)
    const authorize = (state: string, challenge: string): string => buildAuthorizeUrl({
      endpoint: resolved.endpoints.authorizationEndpoint,
      clientId: provider.clientId,
      redirectUri,
      scopes: effectiveScopes(id, provider),
      state,
      challenge,
      providerHint: effectiveProviderHint(provider),
    })

    if (action === 'start' || action === 'bind/start') {
      let ticket: string | undefined
      let intent: 'login' | 'bind' = 'login'
      if (action === 'bind/start') {
        const candidate = url.searchParams.get('ticket') ?? undefined
        const record = this.tickets.peek(candidate, id)
        if (record === null) {
          this.audit('oauth-binding-rejected', source, `${id} invalid ticket`)
          this.finish(res, 'rejected', 'bind', '绑定票据无效或已过期，请从设置页重新发起绑定。', {}, 403)
          return true
        }
        ticket = candidate
        intent = 'bind'
      }
      const { verifier, challenge } = pkcePair()
      const state = this.flows.issue({
        provider: id,
        intent,
        codeVerifier: verifier,
        publicOrigin,
        source,
        ...(ticket === undefined ? {} : { ticket }),
      })
      res.writeHead(302, { ...OAUTH_HEADERS, location: authorize(state, challenge) })
      res.end()
      return true
    }

    // action === 'callback'
    const flow = this.flows.consume(url.searchParams.get('state') ?? undefined, id)
    if (flow === null) {
      this.audit('oauth-state-invalid', source, id)
      this.finish(res, 'invalid', 'login', '登录状态无效或已过期，请重新发起登录。', {}, 400)
      return true
    }
    const idpError = url.searchParams.get('error')
    if (idpError !== null) {
      this.audit('oauth-access-denied', source, id)
      this.finish(res, 'denied', flow.intent, '第三方登录已取消或未授权，请重试。')
      return true
    }
    const code = url.searchParams.get('code')
    if (code === null || code === '') {
      this.audit('oauth-login-failed', source, `${id} missing code`)
      this.finish(res, 'failed', flow.intent, '第三方登录未返回授权码，请重试。')
      return true
    }

    const token = await exchangeCode({
      endpoint: resolved.endpoints.tokenEndpoint,
      clientId: provider.clientId,
      clientSecret: provider.clientSecret,
      code,
      redirectUri: this.redirectUri(id, flow.publicOrigin),
      codeVerifier: flow.codeVerifier,
      ...(this.opts.fetchImpl === undefined ? {} : { fetchImpl: this.opts.fetchImpl }),
    })
    if (!token.ok) {
      this.audit('oauth-login-failed', source, `${id} token exchange failed`)
      this.finish(res, 'failed', flow.intent, `第三方登录失败：${token.message}`)
      return true
    }
    const info = await fetchUserInfo({
      endpoint: resolved.endpoints.userInfoEndpoint,
      accessToken: token.accessToken,
      ...(this.opts.fetchImpl === undefined ? {} : { fetchImpl: this.opts.fetchImpl }),
    })
    if (!info.ok) {
      this.audit('oauth-login-failed', source, `${id} userinfo failed`)
      this.finish(res, 'failed', flow.intent, `第三方登录失败：${info.message}`)
      return true
    }
    // Feishu wraps the profile in `data`; Google/GitHub/Casdoor return it flat.
    const container = typeof info.info === 'object' && info.info !== null
      ? info.info as Record<string, unknown>
      : {}
    const doc = typeof container.data === 'object' && container.data !== null ? container.data : info.info
    const subject = extractSubject(id, doc, resolved.source)
    if (subject === null) {
      this.audit('oauth-login-failed', source, `${id} missing subject`)
      this.finish(res, 'failed', flow.intent, '无法识别该三方账号的稳定标识，请联系管理员。')
      return true
    }

    if (flow.intent === 'bind') {
      const ticket = this.tickets.consume(flow.ticket, id)
      if (ticket === null) {
        this.audit('oauth-binding-rejected', source, `${id} ticket expired`)
        this.finish(res, 'rejected', 'bind', '绑定票据已失效，请从设置页重新发起绑定。')
        return true
      }
      const profile = extractProfile(doc)
      const added = addBinding(this.bindings, {
        provider: id,
        subject,
        localSubject: ticket.localSubject,
        ...profile,
      })
      if (!added.ok) {
        this.audit('oauth-binding-rejected', source, `${id} duplicate`)
        this.finish(res, 'rejected', 'bind', added.message)
        return true
      }
      this.bindings = added.bindings
      this.persist()
      this.audit('oauth-binding-added', source, id)
      this.finish(res, 'bound', 'bind')
      return true
    }

    // Login intent: the binding table is the ONLY authorization source.
    if (findBinding(this.bindings, id, subject) === undefined) {
      this.audit('oauth-login-unbound', source, id)
      this.finish(res, 'unbound', 'login', '该三方账号尚未绑定，请联系管理员在设置页绑定后再登录。')
      return true
    }
    const session = this.opts.auth.issueExternalSession({
      source: flow.source,
      userAgent: typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : '',
    })
    this.finish(res, 'ok', 'login', undefined, {
      'set-cookie': sessionCookie(
        session.token,
        Math.floor(this.opts.auth.authPolicy.sessionTtlMs / 1000),
        gate.cookieName,
      ),
    })
    return true
  }
}
