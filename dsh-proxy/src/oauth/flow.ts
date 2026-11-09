/**
 * OAuth 2.0 authorization-code primitives: one-shot server-side state, PKCE,
 * the authorize redirect and the two upstream calls (token + userinfo).
 *
 * State lives in memory like the login sessions — a restart invalidates every
 * in-flight flow, which is the safe default. No SDK: Node 22's fetch is enough.
 */
import { createHash, randomBytes } from 'node:crypto'
import type { OAuthEndpoints, OAuthProviderId } from './providers.ts'

/** Why a flow was started: sign in, or bind an account from the settings page. */
export type OAuthIntent = 'login' | 'bind'

/** One in-flight authorization-code flow. */
export interface OAuthFlowState {
  provider: OAuthProviderId
  intent: OAuthIntent
  codeVerifier: string
  /** The origin used in `redirect_uri`; reused verbatim at the token exchange. */
  publicOrigin: string
  source: string
  /** Present only for bind flows; consumed by the callback. */
  ticket?: string
  createdAt: number
}

/** In-memory one-shot state store with a TTL. */
export class OAuthStateStore {
  private readonly flows = new Map<string, OAuthFlowState>()
  private readonly now: () => number
  private readonly ttlMs: number

  constructor(options: { now?: () => number; ttlMs?: number } = {}) {
    this.now = options.now ?? (() => Date.now())
    this.ttlMs = options.ttlMs ?? 600000
  }

  /** Register one flow and return its opaque `state` value. */
  issue(input: Omit<OAuthFlowState, 'createdAt'>): string {
    const state = randomBytes(24).toString('base64url')
    this.flows.set(state, { ...input, createdAt: this.now() })
    return state
  }

  /** Consume a flow exactly once, checking its TTL and provider binding. */
  consume(state: string | undefined, provider: OAuthProviderId): OAuthFlowState | null {
    if (state === undefined || state === '') return null
    const flow = this.flows.get(state)
    if (flow === undefined) return null
    this.flows.delete(state)
    if (this.now() - flow.createdAt >= this.ttlMs || flow.provider !== provider) return null
    return flow
  }
}

/** PKCE S256 verifier + challenge pair. */
export function pkcePair(): { verifier: string; challenge: string } {
  const verifier = randomBytes(32).toString('base64url')
  const challenge = createHash('sha256').update(verifier).digest('base64url')
  return { verifier, challenge }
}

/** Build the IdP authorize URL with all required query parameters. */
export function buildAuthorizeUrl(input: {
  endpoint: string
  clientId: string
  redirectUri: string
  scopes: string
  state: string
  challenge: string
  /** Optional Casdoor-style hint; only sent when non-blank. */
  providerHint?: string
}): string {
  const url = new URL(input.endpoint)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', input.clientId)
  url.searchParams.set('redirect_uri', input.redirectUri)
  url.searchParams.set('scope', input.scopes)
  url.searchParams.set('state', input.state)
  url.searchParams.set('code_challenge', input.challenge)
  url.searchParams.set('code_challenge_method', 'S256')
  const hint = input.providerHint?.trim() ?? ''
  if (hint !== '') url.searchParams.set('provider_hint', hint)
  return url.toString()
}

/** The subset of fetch used by the two upstream calls (injectable in tests). */
export type FetchImpl = typeof globalThis.fetch

/** A successful token exchange carries only the access token, never credentials. */
export type TokenResult = { ok: true; accessToken: string } | { ok: false; message: string }

/** Exchange an authorization code for an access token. */
export async function exchangeCode(input: {
  endpoint: string
  clientId: string
  clientSecret: string
  code: string
  redirectUri: string
  codeVerifier: string
  fetchImpl?: FetchImpl
}): Promise<TokenResult> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: input.clientId,
    client_secret: input.clientSecret,
    code: input.code,
    redirect_uri: input.redirectUri,
    code_verifier: input.codeVerifier,
  })
  let response: Response
  try {
    response = await (input.fetchImpl ?? globalThis.fetch)(input.endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
      },
      body: body.toString(),
    })
  } catch (err) {
    return { ok: false, message: `令牌交换请求失败：${err instanceof Error ? err.message : String(err)}` }
  }
  if (!response.ok) return { ok: false, message: `令牌交换失败（HTTP ${response.status}）` }
  let text: string
  try {
    text = await response.text()
  } catch {
    return { ok: false, message: '令牌交换响应无法读取' }
  }
  let token: unknown
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('json')) {
    try {
      const parsed = JSON.parse(text) as Record<string, unknown>
      token = parsed.access_token ?? (parsed.data as Record<string, unknown> | undefined)?.access_token
    } catch {
      return { ok: false, message: '令牌交换响应不是有效的 JSON' }
    }
  } else {
    token = new URLSearchParams(text).get('access_token')
  }
  if (typeof token !== 'string' || token === '') return { ok: false, message: '令牌交换响应缺少 access_token' }
  return { ok: true, accessToken: token }
}

/** Fetch the userinfo document with the access token as a Bearer credential. */
export async function fetchUserInfo(input: {
  endpoint: string
  accessToken: string
  fetchImpl?: FetchImpl
}): Promise<{ ok: true; info: unknown } | { ok: false; message: string }> {
  let response: Response
  try {
    response = await (input.fetchImpl ?? globalThis.fetch)(input.endpoint, {
      headers: { authorization: `Bearer ${input.accessToken}`, accept: 'application/json' },
    })
  } catch (err) {
    return { ok: false, message: `用户信息请求失败：${err instanceof Error ? err.message : String(err)}` }
  }
  if (!response.ok) return { ok: false, message: `用户信息请求失败（HTTP ${response.status}）` }
  try {
    return { ok: true, info: await response.json() as unknown }
  } catch {
    return { ok: false, message: '用户信息响应不是有效的 JSON' }
  }
}

/** The three endpoints a flow needs, already resolved by providers.ts. */
export type FlowEndpoints = Pick<OAuthEndpoints, 'authorizationEndpoint' | 'tokenEndpoint' | 'userInfoEndpoint'>
