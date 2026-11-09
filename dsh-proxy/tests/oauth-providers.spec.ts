/**
 * Official defaults, the auth-center override precedence, subject extraction
 * and the login-page icons: all pure functions, no sockets or state files.
 */
import { describe, expect, it } from 'vitest'
import {
  OFFICIAL_ENDPOINTS,
  OAUTH_PROVIDER_IDS,
  defaultOAuthConfig,
  effectiveProviderHint,
  effectiveScopes,
  extractProfile,
  extractSubject,
  isProviderReady,
  providerIconSvg,
  readyProviders,
  resolveProviderEndpoints,
  validateEndpointUrl,
} from '../src/oauth/providers.ts'

describe('official endpoints', () => {
  it('uses each channel\'s official URLs when nothing overrides them', () => {
    const config = defaultOAuthConfig()
    for (const id of OAUTH_PROVIDER_IDS) {
      const resolved = resolveProviderEndpoints(id, config.providers[id])
      expect(resolved.source).toBe('official')
      if (id === 'casdoor') continue
      expect(resolved.endpoints.authorizationEndpoint).toBe(OFFICIAL_ENDPOINTS[id].authorizationEndpoint)
      expect(resolved.endpoints.tokenEndpoint).toBe(OFFICIAL_ENDPOINTS[id].tokenEndpoint)
      expect(resolved.endpoints.userInfoEndpoint).toBe(OFFICIAL_ENDPOINTS[id].userInfoEndpoint)
      expect(resolved.issues).toEqual([])
    }
  })

  it('defaults every channel OFF', () => {
    const config = defaultOAuthConfig()
    expect(config.enabled).toBe(false)
    expect(readyProviders(config)).toEqual([])
    expect(OAUTH_PROVIDER_IDS).toEqual(['github', 'google', 'feishu', 'casdoor'])
  })

  it('requires a base URL for the built-in Casdoor provider', () => {
    const config = defaultOAuthConfig()
    config.enabled = true
    config.providers.casdoor = { enabled: true, clientId: 'app', clientSecret: 'secret' }
    const resolved = resolveProviderEndpoints('casdoor', config.providers.casdoor)
    expect(resolved.issues.join(' ')).toContain('未配置统一认证中心地址')
    expect(resolved.endpoints.authorizationEndpoint).toBe('')
    expect(readyProviders(config)).toEqual([])
  })

  it('expands the Casdoor template from a provider or shared base URL', () => {
    const config = defaultOAuthConfig()
    config.providers.casdoor = {
      enabled: true, clientId: 'app', clientSecret: 'secret',
      baseUrl: 'https://door.example.com/',
    }
    const resolved = resolveProviderEndpoints('casdoor', config.providers.casdoor)
    expect(resolved.endpoints.authorizationEndpoint).toBe('https://door.example.com/login/oauth/authorize')
    expect(resolved.endpoints.tokenEndpoint).toBe('https://door.example.com/api/login/oauth/access_token')
    expect(resolved.endpoints.userInfoEndpoint).toBe('https://door.example.com/api/userinfo')
    expect(resolved.issues).toEqual([])

    const shared = resolveProviderEndpoints(
      'casdoor',
      { enabled: true, clientId: 'app', clientSecret: 'secret' },
      { baseUrl: 'https://casdoor.internal.example.com' },
    )
    expect(shared.endpoints.authorizationEndpoint).toBe('https://casdoor.internal.example.com/login/oauth/authorize')
    expect(shared.source).toBe('auth-center')
  })
})

describe('endpoint override precedence', () => {
  const provider = { enabled: true, clientId: 'app', clientSecret: 'secret' }

  it('replaces all three endpoints of the official channels with an auth center', () => {
    for (const id of ['github', 'google', 'feishu'] as const) {
      const resolved = resolveProviderEndpoints(id, provider, { baseUrl: 'https://casdoor.internal.example.com' })
      expect(resolved.source).toBe('auth-center')
      expect(resolved.endpoints.authorizationEndpoint).toBe('https://casdoor.internal.example.com/login/oauth/authorize')
      expect(resolved.endpoints.tokenEndpoint).toBe('https://casdoor.internal.example.com/api/login/oauth/access_token')
      expect(resolved.endpoints.userInfoEndpoint).toBe('https://casdoor.internal.example.com/api/userinfo')
    }
  })

  it('lets a per-provider baseUrl beat the shared one', () => {
    const resolved = resolveProviderEndpoints(
      'github', provider,
      { baseUrl: 'https://shared.example.com' },
    )
    const perProvider = resolveProviderEndpoints(
      'github', { ...provider, baseUrl: 'https://own.example.com' },
      { baseUrl: 'https://shared.example.com' },
    )
    expect(resolved.endpoints.authorizationEndpoint).toContain('shared.example.com')
    expect(perProvider.endpoints.authorizationEndpoint).toContain('own.example.com')
    expect(perProvider.source).toBe('provider-override')
  })

  it('lets an explicit endpoint field beat everything and ignores blanks', () => {
    const resolved = resolveProviderEndpoints(
      'google',
      {
        ...provider,
        baseUrl: 'https://own.example.com',
        endpoints: {
          tokenEndpoint: 'https://own.example.com/custom/token',
          userInfoEndpoint: '   ',
        },
      },
      { baseUrl: 'https://shared.example.com' },
    )
    expect(resolved.endpoints.tokenEndpoint).toBe('https://own.example.com/custom/token')
    expect(resolved.endpoints.userInfoEndpoint).toBe('https://own.example.com/api/userinfo')
    expect(resolved.source).toBe('provider-override')
  })
})

describe('endpoint validation', () => {
  it('accepts https and loopback http, rejects cleartext and non-http schemes', () => {
    expect(validateEndpointUrl('https://example.com/oauth', 'x')).toBeNull()
    expect(validateEndpointUrl('http://localhost:8080/oauth', 'x')).toBeNull()
    expect(validateEndpointUrl('http://lan.example.com/oauth', 'x')).toContain('必须使用 https')
    expect(validateEndpointUrl('javascript:alert(1)', 'x')).toContain('必须使用 https')
    expect(validateEndpointUrl('not a url', 'x')).toContain('不是有效的 URL')
  })

  it('reports an invalid override as an issue instead of using it', () => {
    const resolved = resolveProviderEndpoints('github', {
      enabled: true, clientId: 'app', clientSecret: 'secret',
      endpoints: { authorizationEndpoint: 'http://attacker.example.com/authorize' },
    })
    expect(resolved.issues.join(' ')).toContain('必须使用 https')
  })
})

describe('provider readiness and scopes', () => {
  it('requires enabled, credentials and valid endpoints', () => {
    const config = defaultOAuthConfig()
    expect(isProviderReady('github', config)).toBe(false)
    config.enabled = true
    config.providers.github = { enabled: true, clientId: 'app', clientSecret: '' }
    expect(isProviderReady('github', config)).toBe(false)
    config.providers.github.clientSecret = 'secret'
    expect(isProviderReady('github', config)).toBe(true)
    expect(readyProviders(config)).toEqual(['github'])
  })

  it('uses built-in scopes unless overridden', () => {
    expect(effectiveScopes('github', { enabled: true, clientId: '', clientSecret: '' })).toBe('read:user user:email')
    expect(effectiveScopes('google', { enabled: true, clientId: '', clientSecret: '', scopes: ['openid', 'email'] })).toBe('openid email')
    expect(effectiveScopes('casdoor', { enabled: true, clientId: '', clientSecret: '' })).toBe('openid profile email')
  })

  it('resolves a trimmed provider_hint, blank when unset or whitespace-only', () => {
    expect(effectiveProviderHint({ enabled: true, clientId: '', clientSecret: '' })).toBe('')
    expect(effectiveProviderHint({ enabled: true, clientId: '', clientSecret: '', providerHint: '   ' })).toBe('')
    expect(effectiveProviderHint({ enabled: true, clientId: '', clientSecret: '', providerHint: '  github ' })).toBe('github')
  })
})

describe('subject and profile extraction', () => {
  it('uses only stable ids', () => {
    expect(extractSubject('github', { id: 42, login: 'octocat' })).toBe('42')
    expect(extractSubject('google', { sub: 'sub-1', email: 'a@b.c' })).toBe('sub-1')
    expect(extractSubject('feishu', { data: { open_id: 'ou-1' } })).toBeNull()
    expect(extractSubject('feishu', { open_id: 'ou-1' })).toBe('ou-1')
    expect(extractSubject('casdoor', { sub: 'cas-1' })).toBe('cas-1')
  })

  it('reads OIDC sub when a channel is pointed at an auth center', () => {
    expect(extractSubject('github', { sub: 'cas-1', name: 'Ada' }, 'provider-override')).toBe('cas-1')
    expect(extractSubject('github', { id: 42 }, 'auth-center')).toBe('42')
    expect(extractSubject('feishu', { sub: 'cas-2' }, 'auth-center')).toBe('cas-2')
    expect(extractSubject('github', { sub: 'cas-1' })).toBeNull()
  })

  it('still refuses display names and emails on auth-center documents', () => {
    expect(extractSubject('github', { name: 'Ada', email: 'a@b.c', preferred_username: 'ada' }, 'provider-override')).toBeNull()
  })

  it('never falls back to an email as the binding key', () => {
    expect(extractSubject('github', { email: 'a@b.c', name: 'Some One' })).toBeNull()
    expect(extractSubject('google', null)).toBeNull()
  })

  it('extracts display-only fields', () => {
    expect(extractProfile({ email: 'a@b.c', login: 'octocat' })).toEqual({ email: 'a@b.c', displayName: 'octocat' })
    expect(extractProfile({})).toEqual({})
  })

  it('renders self-contained inline SVG icons', () => {
    for (const id of OAUTH_PROVIDER_IDS) {
      const svg = providerIconSvg(id)
      expect(svg).toContain('<svg')
      expect(svg).not.toContain('http')
      expect(svg).not.toContain('<script')
    }
  })
})
