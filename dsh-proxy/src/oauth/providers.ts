/**
 * Built-in third-party login providers and their endpoints.
 *
 * Deliberately pure and side-effect free: the official endpoint table, the
 * auth-center override precedence, subject extraction and the login-page icons
 * are all unit-testable without a socket or a config file.
 */
import { randomBytes } from 'node:crypto'

/** The four built-in providers; there is no arbitrary provider registry. */
export type OAuthProviderId = 'github' | 'google' | 'feishu' | 'casdoor'

/** Stable iteration order (also the login-page button order). */
export const OAUTH_PROVIDER_IDS = ['github', 'google', 'feishu', 'casdoor'] as const satisfies readonly OAuthProviderId[]

/** Reserved path for every OAuth route inside the proxied origin. */
export const OAUTH_BASE_PATH = '/__dsh-proxy/oauth'

/** One OAuth flow's endpoints; blank fields are filled by the resolver. */
export interface OAuthEndpoints {
  authorizationEndpoint: string
  tokenEndpoint: string
  userInfoEndpoint: string
  /** OIDC signature verification is out of scope, but the field is configurable. */
  jwksEndpoint?: string
  issuer?: string
}

/** Per-provider deployment overrides. */
export interface OAuthProviderConfig {
  enabled: boolean
  clientId: string
  clientSecret: string
  scopes?: string[]
  /** Replace this provider's endpoints with an auth-center template. */
  baseUrl?: string
  /** Fine-grained override; wins over `baseUrl` and the shared auth center. */
  endpoints?: Partial<OAuthEndpoints>
  /** Explicit redirect URI; omit to derive it from the browser's own origin. */
  redirectUri?: string
  /** Login-page button text; omit for the built-in label. */
  label?: string
  /**
   * Optional `provider_hint` query value sent with the authorize request.
   * A Casdoor-style auth center needs it to select the underlying provider
   * when a channel's endpoints are replaced by a custom/self-hosted center
   * (e.g. the github channel pointed at Casdoor usually sets `github`).
   * Blank or omitted = the parameter is NOT sent, so official endpoints keep
   * their exact existing behavior.
   */
  providerHint?: string
}

/** Top-level unified auth center (e.g. a self-hosted Casdoor). */
export interface OAuthAuthCenter {
  baseUrl?: string
  endpoints?: Partial<OAuthEndpoints>
}

/** The deployment-layer shape of a bootstrap binding. */
export interface OAuthBootstrapBinding {
  provider: OAuthProviderId
  subject: string
  email?: string
}

/** Full OAuth configuration (cordis base merged with the persisted overlay). */
export interface OAuthConfig {
  enabled: boolean
  providers: Record<OAuthProviderId, OAuthProviderConfig>
  authCenter?: OAuthAuthCenter
  stateTtlMs?: number
  /** Written once, only while the binding table is empty (bootstrap path). */
  bootstrapBindings?: OAuthBootstrapBinding[]
  /** Optional externally reachable proxy origin, used for binding links. */
  publicOrigin?: string
}

/** Resolved endpoints and the reasons a provider cannot be used. */
export interface ResolvedProvider {
  endpoints: OAuthEndpoints
  issues: string[]
  source: 'official' | 'auth-center' | 'provider-override'
}

/** Login-page button copy; `icon` is an inline SVG string (no external asset). */
export interface OAuthLoginButton {
  id: OAuthProviderId
  label: string
  startUrl: string
  icon: string
}

/** Default labels shown on the login page. */
export const DEFAULT_PROVIDER_LABELS: Readonly<Record<OAuthProviderId, string>> = {
  github: 'GitHub',
  google: 'Google',
  feishu: '飞书',
  casdoor: 'Casdoor',
}

/** Default scopes per provider. */
export const DEFAULT_SCOPES: Readonly<Record<OAuthProviderId, string>> = {
  github: 'read:user user:email',
  google: 'openid email profile',
  feishu: 'contact:user.base:readonly',
  casdoor: 'openid profile email',
}

/** Casdoor-style paths used both by the built-in provider and by overrides. */
export const CASDOOR_ENDPOINT_TEMPLATES: Readonly<OAuthEndpoints> = {
  authorizationEndpoint: '{baseUrl}/login/oauth/authorize',
  tokenEndpoint: '{baseUrl}/api/login/oauth/access_token',
  userInfoEndpoint: '{baseUrl}/api/userinfo',
  jwksEndpoint: '{baseUrl}/.well-known/jwks',
}

/** Official endpoints; the Casdoor entries are templates requiring `baseUrl`. */
export const OFFICIAL_ENDPOINTS: Readonly<Record<OAuthProviderId, OAuthEndpoints>> = {
  github: {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    userInfoEndpoint: 'https://api.github.com/user',
  },
  google: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    userInfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
    jwksEndpoint: 'https://www.googleapis.com/oauth2/v3/certs',
    issuer: 'https://accounts.google.com',
  },
  feishu: {
    authorizationEndpoint: 'https://accounts.feishu.cn/open-apis/authen/v1/authorize',
    tokenEndpoint: 'https://open.feishu.cn/open-apis/authen/v2/oauth/token',
    userInfoEndpoint: 'https://open.feishu.cn/open-apis/authen/v1/user_info',
  },
  casdoor: { ...CASDOOR_ENDPOINT_TEMPLATES },
}

/** A fresh default configuration; a new object each time avoids shared mutation. */
export function defaultOAuthConfig(): OAuthConfig {
  const providers = {} as Record<OAuthProviderId, OAuthProviderConfig>
  for (const id of OAUTH_PROVIDER_IDS) {
    providers[id] = { enabled: false, clientId: '', clientSecret: '' }
  }
  return { enabled: false, providers, stateTtlMs: 600000 }
}

/** Whether an unknown value names one of the built-in providers. */
export function isOAuthProviderId(value: unknown): value is OAuthProviderId {
  return typeof value === 'string' && (OAUTH_PROVIDER_IDS as readonly string[]).includes(value)
}

/** Route helpers; all of them live under the proxy's reserved prefix. */
export function oauthStartPath(id: OAuthProviderId): string {
  return `${OAUTH_BASE_PATH}/${id}/start`
}
export function oauthBindStartPath(id: OAuthProviderId): string {
  return `${OAUTH_BASE_PATH}/${id}/bind/start`
}
export function oauthCallbackPath(id: OAuthProviderId): string {
  return `${OAUTH_BASE_PATH}/${id}/callback`
}

/** Trim a base URL without ever producing a trailing-slash double path. */
function normalizeBaseUrl(value: string | undefined): string {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/\/+$/, '')
}

/**
 * Validate one endpoint URL. Custom endpoints must be https; plain http is
 * tolerated only for loopback development so an operator cannot silently point
 * the login flow at a cleartext third party.
 */
export function validateEndpointUrl(value: string, label: string): string | null {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return `${label} 不是有效的 URL：${value}`
  }
  if (url.protocol === 'https:') return null
  const host = url.hostname.toLowerCase()
  if (url.protocol === 'http:' && (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost'))) {
    return null
  }
  return `${label} 必须使用 https（仅本机开发可用 http）：${value}`
}

/** Expand the Casdoor-style template against one base URL. */
function fromTemplate(base: string): OAuthEndpoints {
  const expand = (template: string): string => template.replace('{baseUrl}', base)
  return {
    authorizationEndpoint: expand(CASDOOR_ENDPOINT_TEMPLATES.authorizationEndpoint),
    tokenEndpoint: expand(CASDOOR_ENDPOINT_TEMPLATES.tokenEndpoint),
    userInfoEndpoint: expand(CASDOOR_ENDPOINT_TEMPLATES.userInfoEndpoint),
    ...(CASDOOR_ENDPOINT_TEMPLATES.jwksEndpoint === undefined
      ? {}
      : { jwksEndpoint: expand(CASDOOR_ENDPOINT_TEMPLATES.jwksEndpoint) }),
  }
}

/** Apply only the non-blank fields of an explicit endpoint override. */
function applyExplicit(base: OAuthEndpoints, patch: Partial<OAuthEndpoints>): OAuthEndpoints {
  const next = { ...base }
  for (const key of Object.keys(base) as Array<keyof OAuthEndpoints>) {
    const candidate = patch[key]
    if (typeof candidate === 'string' && candidate.trim() !== '') next[key] = candidate.trim()
  }
  return next
}

/**
 * Resolve the effective endpoints for one provider.
 *
 * Precedence: official table (or Casdoor template) → `authCenter.baseUrl`
 * template → `authCenter.endpoints` → `provider.baseUrl` template →
 * `provider.endpoints`. Blank values always fall back to the previous level.
 */
export function resolveProviderEndpoints(
  id: OAuthProviderId,
  provider: OAuthProviderConfig,
  center?: OAuthAuthCenter,
): ResolvedProvider {
  const issues: string[] = []
  let endpoints: OAuthEndpoints = { ...OFFICIAL_ENDPOINTS[id] }
  let source: ResolvedProvider['source'] = 'official'

  const centerBase = normalizeBaseUrl(center?.baseUrl)
  const providerBase = normalizeBaseUrl(provider.baseUrl)
  const chosenBase = providerBase !== '' ? providerBase : centerBase

  if (centerBase !== '' && providerBase === '') {
    endpoints = fromTemplate(centerBase)
    source = 'auth-center'
  }
  if (center?.endpoints !== undefined) {
    endpoints = applyExplicit(endpoints, center.endpoints)
    if (Object.values(center.endpoints).some(value => typeof value === 'string' && value.trim() !== '')) {
      source = 'auth-center'
    }
  }
  if (providerBase !== '') {
    endpoints = fromTemplate(providerBase)
    source = 'provider-override'
  }
  if (provider.endpoints !== undefined) {
    endpoints = applyExplicit(endpoints, provider.endpoints)
    if (Object.values(provider.endpoints).some(value => typeof value === 'string' && value.trim() !== '')) {
      source = 'provider-override'
    }
  }

  // Casdoor has no public official host: a base URL is mandatory.
  if (chosenBase === '' && id === 'casdoor' && endpoints.authorizationEndpoint.includes('{baseUrl}')) {
    issues.push('未配置统一认证中心地址，无法启用 Casdoor 登录')
    endpoints = { authorizationEndpoint: '', tokenEndpoint: '', userInfoEndpoint: '' }
    return { endpoints, issues, source }
  }

  for (const key of ['authorizationEndpoint', 'tokenEndpoint', 'userInfoEndpoint', 'jwksEndpoint'] as const) {
    const value = endpoints[key]
    if (value === undefined || value === '') continue
    const error = validateEndpointUrl(value, `${id}.${key}`)
    if (error !== null) issues.push(error)
  }
  return { endpoints, issues, source }
}

/** Whether a provider may appear on the login page and serve an OAuth flow. */
export function isProviderReady(id: OAuthProviderId, config: OAuthConfig, center?: OAuthAuthCenter): boolean {
  if (!config.enabled) return false
  const provider = config.providers[id]
  if (!provider.enabled) return false
  if (provider.clientId.trim() === '' || provider.clientSecret.trim() === '') return false
  return resolveProviderEndpoints(id, provider, center ?? config.authCenter).issues.length === 0
}

/** Every provider that is enabled, configured and has valid endpoints. */
export function readyProviders(config: OAuthConfig): OAuthProviderId[] {
  return OAUTH_PROVIDER_IDS.filter(id => isProviderReady(id, config))
}

/** Trimmed `provider_hint` actually sent to a custom authorize endpoint. */
export function effectiveProviderHint(provider: OAuthProviderConfig): string {
  return typeof provider.providerHint === 'string' ? provider.providerHint.trim() : ''
}

/** Scope string actually sent to the provider. */
export function effectiveScopes(id: OAuthProviderId, provider: OAuthProviderConfig): string {
  if (provider.scopes !== undefined && provider.scopes.length > 0) return provider.scopes.join(' ')
  return DEFAULT_SCOPES[id]
}

/** Official endpoints keep their exact, provider-specific subject fields. */
const OFFICIAL_SUBJECT_KEYS: Readonly<Record<OAuthProviderId, readonly string[]>> = {
  github: ['id'],
  google: ['sub'],
  feishu: ['open_id', 'union_id', 'user_id'],
  casdoor: ['sub', 'id'],
}

/**
 * A channel pointed at a self-hosted auth center no longer returns that
 * channel's official document: a Casdoor-style center answers `/api/userinfo`
 * with OIDC claims (`sub`), not GitHub's numeric `id`. Only stable IDs belong
 * here — email, name and login can change and be reassigned.
 */
const AUTH_CENTER_SUBJECT_KEYS = ['sub', 'id', 'open_id', 'union_id', 'user_id'] as const

/**
 * Extract the STABLE subject id from a userinfo payload. Emails and display
 * names are deliberately refused as identifiers: they can change and be
 * reassigned, which would turn a binding into an account takeover.
 *
 * `source` decides which claims are trusted: official endpoints keep byte-for-
 * byte their existing behaviour, while auth-center / per-provider overrides are
 * read as the center's OIDC-shaped document.
 */
export function extractSubject(
  id: OAuthProviderId,
  userInfo: unknown,
  source: ResolvedProvider['source'] = 'official',
): string | null {
  if (typeof userInfo !== 'object' || userInfo === null) return null
  const record = userInfo as Record<string, unknown>
  const keys: readonly string[] = source === 'official' ? OFFICIAL_SUBJECT_KEYS[id] : AUTH_CENTER_SUBJECT_KEYS
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.trim() !== '') return value.trim()
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  }
  return null
}

/** Display-only profile fields; never used for authorization. */
export function extractProfile(userInfo: unknown): { email?: string; displayName?: string } {
  if (typeof userInfo !== 'object' || userInfo === null) return {}
  const record = userInfo as Record<string, unknown>
  const string = (...keys: string[]): string | undefined => {
    for (const key of keys) {
      const value = record[key]
      if (typeof value === 'string' && value.trim() !== '') return value.trim().slice(0, 120)
    }
    return undefined
  }
  const email = string('email', 'mail')
  const displayName = string('name', 'preferred_username', 'login', 'display_name', 'en_name')
  return { ...(email === undefined ? {} : { email }), ...(displayName === undefined ? {} : { displayName }) }
}

/** An inline SVG mark for the zero-JavaScript login page (no external assets). */
export function providerIconSvg(id: OAuthProviderId): string {
  const colors: Record<OAuthProviderId, string> = {
    github: '#6e7681',
    google: '#4285f4',
    feishu: '#3370ff',
    casdoor: '#7c6bf3',
  }
  const letters: Record<OAuthProviderId, string> = {
    github: 'G', google: 'G', feishu: '飞', casdoor: 'C',
  }
  return `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="${colors[id]}"/><text x="12" y="16" text-anchor="middle" font-size="12" font-family="sans-serif" font-weight="600" fill="#ffffff">${letters[id]}</text></svg>`
}

/** A short, non-secret id for a binding row. */
export function bindingId(): string {
  return randomBytes(12).toString('base64url').slice(0, 16)
}
