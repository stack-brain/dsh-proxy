/**
 * Persisted OAuth state: the runtime overlay (a complete OAuthConfig that wins
 * over the cordis base) plus the manual binding table. Both live in ONE
 * profile-private file and are written atomically, mirroring
 * `RuntimeSettingsFile` / `SecuritySettingsFile`.
 */
import { readStateYaml, writeStateYaml } from '../state-file.ts'
import {
  OAUTH_PROVIDER_IDS,
  defaultOAuthConfig,
  isOAuthProviderId,
  resolveProviderEndpoints,
  type OAuthBootstrapBinding,
  type OAuthConfig,
  type OAuthEndpoints,
  type OAuthProviderConfig,
  type OAuthProviderId,
} from './providers.ts'
import { normalizeBindings, type OAuthBinding } from './bindings.ts'

/** The on-disk shape. `overlay` is absent until the settings page saves once. */
export interface OAuthState {
  overlay?: OAuthConfig
  bindings: OAuthBinding[]
}

/** Empty state used when the file is missing or unreadable. */
export function emptyOAuthState(): OAuthState {
  return { bindings: [] }
}

/** Tolerant read of an unknown YAML/JSON value into the state shape. */
export function normalizeOAuthState(raw: unknown): OAuthState {
  if (typeof raw !== 'object' || raw === null) return emptyOAuthState()
  const record = raw as Record<string, unknown>
  const overlay = record.overlay === undefined || record.overlay === null
    ? undefined
    : normalizeOAuthConfig(record.overlay)
  return {
    bindings: normalizeBindings(record.bindings),
    ...(overlay === undefined ? {} : { overlay }),
  }
}

/** Read/write access to the OAuth state file (atomic temp + rename writes). */
export class OAuthStateFile {
  constructor(private readonly filePath: string) {}

  read(): OAuthState {
    return readStateYaml(this.filePath, normalizeOAuthState, emptyOAuthState)
  }

  write(state: OAuthState): void {
    writeStateYaml(this.filePath, state)
  }
}

/** Type-checked read of a partial endpoint override (blank strings skipped). */
function normalizeEndpoints(raw: unknown): Partial<OAuthEndpoints> | undefined {
  if (typeof raw !== 'object' || raw === null) return undefined
  const record = raw as Record<string, unknown>
  const out: Partial<OAuthEndpoints> = {}
  for (const key of ['authorizationEndpoint', 'tokenEndpoint', 'userInfoEndpoint', 'jwksEndpoint', 'issuer'] as const) {
    const value = record[key]
    if (typeof value === 'string' && value.trim() !== '') out[key] = value.trim()
  }
  return out
}

/** Type-checked read of one provider config, overlaid on `base`. */
function normalizeProvider(raw: unknown, base: OAuthProviderConfig): OAuthProviderConfig {
  if (typeof raw !== 'object' || raw === null) return { ...base }
  const record = raw as Record<string, unknown>
  const next: OAuthProviderConfig = {
    ...base,
    ...(record.endpoints === undefined ? {} : { endpoints: normalizeEndpoints(record.endpoints) }),
  }
  if (typeof record.enabled === 'boolean') next.enabled = record.enabled
  if (typeof record.clientId === 'string') next.clientId = record.clientId
  if (typeof record.clientSecret === 'string') next.clientSecret = record.clientSecret
  if (typeof record.baseUrl === 'string') next.baseUrl = record.baseUrl
  if (typeof record.redirectUri === 'string') next.redirectUri = record.redirectUri
  if (typeof record.label === 'string') next.label = record.label
  if (typeof record.providerHint === 'string') next.providerHint = record.providerHint
  if (Array.isArray(record.scopes)) {
    next.scopes = record.scopes.filter((value): value is string => typeof value === 'string')
  }
  return next
}

/** Type-checked read of bootstrap bindings. */
function normalizeBootstrap(raw: unknown): OAuthBootstrapBinding[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const out: OAuthBootstrapBinding[] = []
  for (const entry of raw) {
    if (typeof entry !== 'object' || entry === null) continue
    const record = entry as Record<string, unknown>
    if (!isOAuthProviderId(record.provider) || typeof record.subject !== 'string' || record.subject.trim() === '') continue
    const email = typeof record.email === 'string' ? record.email.slice(0, 120) : undefined
    out.push({ provider: record.provider, subject: record.subject.trim(), ...(email === undefined ? {} : { email }) })
  }
  return out
}

/**
 * Turn an unknown JSON value (cordis config or a settings patch) into a
 * COMPLETE OAuthConfig. `base` supplies every field the value omits, so a
 * partial patch never drops a configured client secret.
 */
export function normalizeOAuthConfig(raw: unknown, base: OAuthConfig = defaultOAuthConfig()): OAuthConfig {
  if (typeof raw !== 'object' || raw === null) {
    return { ...base, providers: { ...base.providers } }
  }
  const record = raw as Record<string, unknown>
  const providers = {} as Record<OAuthProviderId, OAuthProviderConfig>
  const rawProviders = typeof record.providers === 'object' && record.providers !== null
    ? record.providers as Record<string, unknown>
    : {}
  for (const id of OAUTH_PROVIDER_IDS) {
    providers[id] = normalizeProvider(rawProviders[id], base.providers[id])
  }
  const next: OAuthConfig = { ...base, providers }
  if (typeof record.enabled === 'boolean') next.enabled = record.enabled
  if (typeof record.stateTtlMs === 'number' && Number.isFinite(record.stateTtlMs)) next.stateTtlMs = record.stateTtlMs
  if (typeof record.publicOrigin === 'string') next.publicOrigin = record.publicOrigin
  if (typeof record.authCenter === 'object' && record.authCenter !== null) {
    const center = record.authCenter as Record<string, unknown>
    next.authCenter = {
      ...(base.authCenter ?? {}),
      ...(typeof center.baseUrl === 'string' ? { baseUrl: center.baseUrl } : {}),
      ...(center.endpoints === undefined ? {} : { endpoints: normalizeEndpoints(center.endpoints) }),
    }
  }
  const bootstrap = normalizeBootstrap(record.bootstrapBindings)
  if (bootstrap !== undefined) next.bootstrapBindings = bootstrap
  return next
}

/**
 * Effective config = cordis base + persisted overlay. The overlay stores a
 * COMPLETE config (the settings page always submits every field), so it wins
 * wholesale — exactly like the existing runtime-settings overlay.
 */
export function mergeOAuthConfig(base: OAuthConfig, state: OAuthState): OAuthConfig {
  return state.overlay === undefined ? base : normalizeOAuthConfig(state.overlay, base)
}

/** Validation outcome for a settings-page patch. */
export type OAuthPatchValidation =
  | { ok: true; config: OAuthConfig }
  | { ok: false; message: string }

/** Validate a public origin (http is allowed: cleartext LAN is supported). */
function validatePublicOrigin(value: string): string | null {
  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '代理外部地址必须是 http 或 https URL'
    return null
  } catch {
    return `代理外部地址不是有效的 URL：${value}`
  }
}

/**
 * Validate a settings patch, returning the complete next config.
 *
 * An ENABLED provider must have credentials and usable endpoints; otherwise the
 * save is rejected with a Chinese reason instead of leaving a half-configured
 * channel that cannot serve its callback.
 */
export function validateOAuthPatch(payload: unknown, current: OAuthConfig): OAuthPatchValidation {
  if (typeof payload !== 'object' || payload === null) return { ok: false, message: '请求体必须是对象' }
  const next = normalizeOAuthConfig(payload, current)
  if (next.stateTtlMs !== undefined && (!Number.isInteger(next.stateTtlMs) || next.stateTtlMs < 1000 || next.stateTtlMs > 3600000)) {
    return { ok: false, message: 'state 有效期无效（需要 1000–3600000 毫秒的整数）' }
  }
  if (next.publicOrigin !== undefined && next.publicOrigin.trim() !== '') {
    const error = validatePublicOrigin(next.publicOrigin.trim())
    if (error !== null) return { ok: false, message: error }
  }
  for (const id of OAUTH_PROVIDER_IDS) {
    const provider = next.providers[id]
    if (!provider.enabled) continue
    if (provider.clientId.trim() === '' || provider.clientSecret.trim() === '') {
      return { ok: false, message: `未配置 Client ID 或 Client Secret，无法启用 ${id} 登录` }
    }
    const resolved = resolveProviderEndpoints(id, provider, next.authCenter)
    if (resolved.issues.length > 0) return { ok: false, message: resolved.issues[0] }
  }
  return { ok: true, config: next }
}
