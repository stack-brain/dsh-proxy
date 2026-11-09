/**
 * One-shot flow state, PKCE, the authorize redirect and the two upstream calls.
 * `fetch` is injected so no test ever opens a socket.
 */
import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import {
  OAuthStateStore,
  buildAuthorizeUrl,
  exchangeCode,
  fetchUserInfo,
  pkcePair,
} from '../src/oauth/flow.ts'

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

describe('OAuthStateStore', () => {
  it('consumes a state exactly once and binds it to its provider', () => {
    const store = new OAuthStateStore({ now: () => 1000 })
    const input = {
      provider: 'github' as const, intent: 'login' as const, codeVerifier: 'v',
      publicOrigin: 'https://dsh.example.com', source: '127.0.0.1',
    }
    const state = store.issue(input)
    expect(state.length).toBeGreaterThan(10)
    expect(store.consume(state, 'github')?.intent).toBe('login')
    expect(store.consume(state, 'github')).toBeNull()
    expect(store.consume(undefined, 'github')).toBeNull()

    // A provider mismatch burns the state too (no replay with another channel).
    const mismatched = store.issue(input)
    expect(store.consume(mismatched, 'google')).toBeNull()
    expect(store.consume(mismatched, 'github')).toBeNull()
  })

  it('expires a state after its TTL', () => {
    let now = 1000
    const store = new OAuthStateStore({ now: () => now, ttlMs: 100 })
    const state = store.issue({
      provider: 'feishu', intent: 'login', codeVerifier: 'v',
      publicOrigin: 'http://localhost:3081', source: 'unknown',
    })
    now = 1101
    expect(store.consume(state, 'feishu')).toBeNull()
  })
})

describe('PKCE and authorize URL', () => {
  it('produces a verifier and its S256 challenge', () => {
    const { verifier, challenge } = pkcePair()
    expect(verifier).not.toBe(challenge)
    expect(challenge).toBe(createHash('sha256').update(verifier).digest('base64url'))
    expect(challenge).not.toContain('=')
  })

  it('carries every required parameter', () => {
    const url = new URL(buildAuthorizeUrl({
      endpoint: 'https://github.com/login/oauth/authorize',
      clientId: 'app',
      redirectUri: 'https://dsh.example.com/__dsh-proxy/oauth/github/callback',
      scopes: 'read:user user:email',
      state: 'state-1',
      challenge: 'challenge-1',
    }))
    expect(url.origin).toBe('https://github.com')
    expect(url.searchParams.get('response_type')).toBe('code')
    expect(url.searchParams.get('client_id')).toBe('app')
    expect(url.searchParams.get('redirect_uri')).toContain('/__dsh-proxy/oauth/github/callback')
    expect(url.searchParams.get('scope')).toBe('read:user user:email')
    expect(url.searchParams.get('state')).toBe('state-1')
    expect(url.searchParams.get('code_challenge')).toBe('challenge-1')
    expect(url.searchParams.get('code_challenge_method')).toBe('S256')
    expect(url.searchParams.has('provider_hint')).toBe(false)
  })

  it('sends provider_hint only when a non-blank hint is configured', () => {
    const input = {
      endpoint: 'https://door.example.com/login/oauth/authorize',
      clientId: 'app',
      redirectUri: 'https://dsh.example.com/__dsh-proxy/oauth/github/callback',
      scopes: 'read:user user:email',
      state: 'state-1',
      challenge: 'challenge-1',
    }
    const withHint = new URL(buildAuthorizeUrl({ ...input, providerHint: '  github  ' }))
    expect(withHint.searchParams.get('provider_hint')).toBe('github')
    const blank = new URL(buildAuthorizeUrl({ ...input, providerHint: '   ' }))
    expect(blank.searchParams.has('provider_hint')).toBe(false)
    expect(new URL(buildAuthorizeUrl(input)).searchParams.has('provider_hint')).toBe(false)
  })

  it('URL-encodes an arbitrary hint value', () => {
    const url = new URL(buildAuthorizeUrl({
      endpoint: 'https://door.example.com/login/oauth/authorize',
      clientId: 'app', redirectUri: 'https://dsh.example.com/cb', scopes: 'openid',
      state: 's', challenge: 'c', providerHint: 'google enterprise & more',
    }))
    expect(url.searchParams.get('provider_hint')).toBe('google enterprise & more')
  })
})

describe('upstream calls', () => {
  const base = {
    endpoint: 'https://example.com/token',
    clientId: 'app',
    clientSecret: 'top-secret',
    code: 'code-1',
    redirectUri: 'https://dsh.example.com/callback',
    codeVerifier: 'verifier-1',
  }

  it('exchanges a code for a JSON access token without leaking the secret in the result', async () => {
    let capturedBody = ''
    const fetchImpl = (async (_url: unknown, init?: RequestInit) => {
      capturedBody = String(init?.body ?? '')
      return jsonResponse({ access_token: 'access-1' })
    }) as unknown as typeof fetch
    const result = await exchangeCode({ ...base, fetchImpl })
    expect(result).toEqual({ ok: true, accessToken: 'access-1' })
    expect(capturedBody).toContain('code_verifier=verifier-1')
    expect(capturedBody).toContain('client_secret=top-secret')
    expect(JSON.stringify(result)).not.toContain('top-secret')
  })

  it('also understands a form-encoded token response', async () => {
    const fetchImpl = (async () => new Response('access_token=access-2&scope=read', {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })) as unknown as typeof fetch
    expect(await exchangeCode({ ...base, fetchImpl })).toEqual({ ok: true, accessToken: 'access-2' })
  })

  it('reports HTTP and malformed-JSON failures', async () => {
    const bad = (async () => jsonResponse({ error: 'denied' }, 400)) as unknown as typeof fetch
    expect((await exchangeCode({ ...base, fetchImpl: bad })).ok).toBe(false)
    const malformed = (async () => new Response('{', { headers: { 'content-type': 'application/json' } })) as unknown as typeof fetch
    expect((await exchangeCode({ ...base, fetchImpl: malformed })).ok).toBe(false)
  })

  it('fetches userinfo with a Bearer token', async () => {
    let authorization = ''
    const fetchImpl = (async (_url: unknown, init?: RequestInit) => {
      authorization = String((init?.headers as Record<string, string>)?.authorization ?? '')
      return jsonResponse({ id: 42, login: 'octocat' })
    }) as unknown as typeof fetch
    const result = await fetchUserInfo({ endpoint: 'https://api.github.com/user', accessToken: 'access-1', fetchImpl })
    expect(authorization).toBe('Bearer access-1')
    expect(result.ok).toBe(true)
    if (result.ok) expect((result.info as { id: number }).id).toBe(42)
  })
})
