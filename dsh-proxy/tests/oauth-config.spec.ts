/**
 * Config normalization, atomic state-file IO and settings-patch validation.
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  OAuthStateFile,
  emptyOAuthState,
  mergeOAuthConfig,
  normalizeOAuthConfig,
  validateOAuthPatch,
} from '../src/oauth/config.ts'
import { OAUTH_PROVIDER_IDS, defaultOAuthConfig } from '../src/oauth/providers.ts'

const dirs: string[] = []
const tempFile = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-oauth-config-'))
  dirs.push(dir)
  return join(dir, 'dsh-proxy-oauth.yaml')
}
afterEach(() => {
  while (dirs.length > 0) rmSync(dirs.pop() as string, { recursive: true, force: true })
})

describe('normalizeOAuthConfig', () => {
  it('returns a complete default config for garbage input', () => {
    for (const raw of [undefined, null, 42, 'oops', {}, { providers: 'bad' }]) {
      const config = normalizeOAuthConfig(raw)
      expect(config.enabled).toBe(false)
      expect(OAUTH_PROVIDER_IDS.every(id => config.providers[id] !== undefined)).toBe(true)
      expect(config.providers.github.clientSecret).toBe('')
    }
  })

  it('overlays a partial patch without dropping existing credentials', () => {
    const current = normalizeOAuthConfig({
      enabled: true,
      providers: {
        github: { enabled: true, clientId: 'app', clientSecret: 's3cret' },
      },
    })
    const next = normalizeOAuthConfig({
      providers: { github: { scopes: ['read:user'] } },
      authCenter: { baseUrl: 'https://door.example.com' },
    }, current)
    expect(next.providers.github.clientSecret).toBe('s3cret')
    expect(next.providers.github.clientId).toBe('app')
    expect(next.providers.github.scopes).toEqual(['read:user'])
    expect(next.authCenter?.baseUrl).toBe('https://door.example.com')
    expect(next.providers.google.clientSecret).toBe('')
  })

  it('tolerates unknown provider ids and non-string endpoint values', () => {
    const config = normalizeOAuthConfig({
      providers: {
        github: { enabled: 'yes', clientId: 123, endpoints: { tokenEndpoint: 9, issuer: '  ' } },
        evil: { enabled: true },
      },
    })
    expect(config.providers.github.enabled).toBe(false)
    expect(config.providers.github.clientId).toBe('')
    expect(config.providers.github.endpoints).toEqual({})
  })

  it('round-trips a providerHint through normalization and the state file', () => {
    const config = normalizeOAuthConfig({
      enabled: true,
      providers: { github: { enabled: true, clientId: 'app', clientSecret: 'secret', providerHint: 'github' } },
    })
    expect(config.providers.github.providerHint).toBe('github')
    expect(config.providers.google.providerHint).toBeUndefined()
    const file = new OAuthStateFile(tempFile())
    file.write({ overlay: config, bindings: [] })
    expect(file.read().overlay?.providers.github.providerHint).toBe('github')
    const cleared = normalizeOAuthConfig({ providers: { github: { providerHint: '' } } }, config)
    expect(cleared.providers.github.providerHint).toBe('')
  })
})

describe('OAuthStateFile', () => {
  it('round-trips overlay and bindings through an atomic write', () => {
    const file = new OAuthStateFile(tempFile())
    expect(file.read()).toEqual(emptyOAuthState())
    const config = normalizeOAuthConfig({ enabled: true })
    file.write({
      overlay: config,
      bindings: [{
        id: 'b1', provider: 'github', subject: '42', localSubject: 'admin',
        boundAt: 1000, boundVia: 'settings',
      }],
    })
    const state = file.read()
    expect(state.overlay?.enabled).toBe(true)
    expect(state.bindings[0].subject).toBe('42')
    const text = readFileSync(join(dirs[0] as string, 'dsh-proxy-oauth.yaml'), 'utf8')
    expect(text).toContain('bindings:')
    expect(text).toContain('overlay:')
    expect(text).not.toContain('"bindings"')
  })

  it('survives missing and corrupt files', () => {
    const missing = new OAuthStateFile(join(dirs.length > 0 ? dirs[0] as string : tempFile(), 'absent.json'))
    expect(missing.read()).toEqual(emptyOAuthState())
    const path = tempFile()
    writeFileSync(path, '{not json')
    expect(new OAuthStateFile(path).read()).toEqual(emptyOAuthState())
  })

  it('merges base with the persisted overlay', () => {
    const base = normalizeOAuthConfig({ enabled: false })
    const overlay = normalizeOAuthConfig({ enabled: true, providers: { github: { enabled: true, clientId: 'app', clientSecret: 'secret' } } })
    expect(mergeOAuthConfig(base, emptyOAuthState()).enabled).toBe(false)
    expect(mergeOAuthConfig(base, { overlay, bindings: [] }).providers.github.clientId).toBe('app')
  })
})

describe('validateOAuthPatch', () => {
  const current = defaultOAuthConfig()

  it('rejects a non-object payload', () => {
    expect(validateOAuthPatch(null, current)).toEqual({ ok: false, message: '请求体必须是对象' })
  })

  it('rejects an enabled channel without credentials', () => {
    const result = validateOAuthPatch({
      enabled: true,
      providers: { github: { enabled: true, clientId: 'app', clientSecret: '' } },
    }, current)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toContain('Client ID 或 Client Secret')
  })

  it('rejects Casdoor without a base URL and accepts it with one', () => {
    const missing = validateOAuthPatch({
      enabled: true,
      providers: { casdoor: { enabled: true, clientId: 'app', clientSecret: 'secret' } },
    }, current)
    expect(missing.ok).toBe(false)
    if (!missing.ok) expect(missing.message).toContain('未配置统一认证中心地址')

    const good = validateOAuthPatch({
      enabled: true,
      providers: { casdoor: { enabled: true, clientId: 'app', clientSecret: 'secret' } },
      authCenter: { baseUrl: 'https://door.example.com' },
    }, current)
    expect(good.ok).toBe(true)
  })

  it('rejects an insecure custom endpoint and an out-of-range TTL', () => {
    const insecure = validateOAuthPatch({
      enabled: true,
      providers: {
        github: {
          enabled: true, clientId: 'app', clientSecret: 'secret',
          endpoints: { authorizationEndpoint: 'http://attacker.example.com/authorize' },
        },
      },
    }, current)
    expect(insecure.ok).toBe(false)
    if (!insecure.ok) expect(insecure.message).toContain('必须使用 https')

    expect(validateOAuthPatch({ stateTtlMs: 10 }, current).ok).toBe(false)
    expect(validateOAuthPatch({ publicOrigin: 'ftp://example.com' }, current).ok).toBe(false)
  })

  it('accepts a valid https auth-center patch and keeps other channels off', () => {
    const result = validateOAuthPatch({
      enabled: true,
      authCenter: { baseUrl: 'https://door.example.com' },
      providers: { github: { enabled: true, clientId: 'app', clientSecret: 'secret' } },
    }, current)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.config.providers.google.enabled).toBe(false)
      expect(result.config.providers.github.clientSecret).toBe('secret')
    }
  })
})
