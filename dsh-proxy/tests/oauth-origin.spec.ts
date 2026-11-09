/**
 * Callback/binding origins must follow the page the operator is actually on,
 * without a hardcoded host, while keeping a reverse-proxy override and the
 * legacy LAN-IP guess as fallbacks.
 */
import { describe, expect, it } from 'vitest'
import {
  originFromRequest,
  requestOriginOf,
  resolveOAuthOrigin,
} from '../src/oauth/origin.ts'
import {
  PLAINTEXT_COOKIE_NAME,
  SECURE_COOKIE_NAME,
  resolveGate,
} from '../src/netaccess.ts'
import type { GateDecision } from '../src/netaccess.ts'

describe('resolveGate: URL scheme is NOT the secure-context flag', () => {
  it('keeps http:// for a loopback plain-HTTP browser but still stores a Secure cookie', () => {
    const gate = resolveGate({
      secure: false, host: '127.0.0.1:3081', socketEncrypted: false, requireTls: false,
    })
    // This is the regression: it used to be https://127.0.0.1:3081, which made
    // Casdoor redirect to a plain-HTTP port and Chrome reported
    // ERR_SSL_PROTOCOL_ERROR.
    expect(gate.origin).toBe('http://127.0.0.1:3081')
    expect(gate.secure).toBe(true)
    expect(gate.cookieName).toBe(SECURE_COOKIE_NAME)
    expect(gate.mode).toBe('session')
  })

  it('does the same for http://localhost', () => {
    const gate = resolveGate({
      secure: false, host: 'localhost:3081', socketEncrypted: false, requireTls: false,
    })
    expect(gate.origin).toBe('http://localhost:3081')
    expect(gate.cookieName).toBe(SECURE_COOKIE_NAME)
  })

  it('uses https for a trusted TLS reverse proxy front door', () => {
    const gate = resolveGate({
      secure: true, host: 'dsh.example.com', socketEncrypted: false, requireTls: false,
    })
    expect(gate.origin).toBe('https://dsh.example.com')
    expect(gate.secure).toBe(true)
    expect(gate.cookieName).toBe(SECURE_COOKIE_NAME)
  })

  it('uses http for a cleartext LAN request with the weaker cookie', () => {
    const gate = resolveGate({
      secure: false, host: '192.168.1.5:3081', socketEncrypted: false, requireTls: false,
    })
    expect(gate.origin).toBe('http://192.168.1.5:3081')
    expect(gate.secure).toBe(false)
    expect(gate.cookieName).toBe(PLAINTEXT_COOKIE_NAME)
    expect(gate.mode).toBe('session')
  })

  it('still blocks cleartext under requireTls', () => {
    const gate = resolveGate({
      secure: false, host: '192.168.1.5:3081', socketEncrypted: false, requireTls: true,
    })
    expect(gate.origin).toBe('http://192.168.1.5:3081')
    expect(gate.mode).toBe('plaintext-blocked')
  })

  it('provides a usable loopback gate for the OAuth runtime', () => {
    const gate: GateDecision = resolveGate({
      secure: false, host: '127.0.0.1:3081', socketEncrypted: false, requireTls: false,
    })
    expect(gate.mode).toBe('session')
  })
})

describe('requestOriginOf', () => {
  it('prefers the browser Origin header over an internal request URL', () => {
    expect(requestOriginOf({
      url: 'http://127.0.0.1:3080/api/dsh-proxy',
      originHeader: 'http://192.168.1.5:3080',
      host: '127.0.0.1:3080',
    })).toBe('http://192.168.1.5:3080')
  })

  it('falls back to Referer then request.url then Host', () => {
    expect(requestOriginOf({
      url: 'http://127.0.0.1:3080/api/dsh-proxy',
      originHeader: 'null',
      referer: 'https://dsh.example.com/settings?tab=proxy',
    })).toBe('https://dsh.example.com')
    expect(requestOriginOf({
      url: 'http://127.0.0.1:3080/api/dsh-proxy', originHeader: null,
    })).toBe('http://127.0.0.1:3080')
    expect(requestOriginOf({ url: '/api/dsh-proxy', host: 'dsh.example.com' }))
      .toBe('http://dsh.example.com')
  })

  it('rejects non-http schemes, credentials and paths', () => {
    expect(requestOriginOf({ originHeader: 'javascript:alert(1)', url: 'http://a' })).toBe('http://a')
    expect(requestOriginOf({ originHeader: 'http://user:pass@evil.example', url: 'http://a' })).toBe('http://a')
    expect(requestOriginOf({ originHeader: 'http://evil.example/steal', url: 'http://a' })).toBe('http://a')
    expect(requestOriginOf({})).toBeUndefined()
  })
})

describe('originFromRequest', () => {
  it('swaps the settings-page port for the real proxy port, keeping the domain', () => {
    expect(originFromRequest('http://127.0.0.1:3080', 3081)).toBe('http://127.0.0.1:3081')
    expect(originFromRequest('http://my-pc.local:3080', 3081)).toBe('http://my-pc.local:3081')
  })

  it('keeps an origin already on the proxy port or a portless front door', () => {
    expect(originFromRequest('http://127.0.0.1:3081', 3081)).toBe('http://127.0.0.1:3081')
    expect(originFromRequest('https://dsh.example.com', 3081)).toBe('https://dsh.example.com')
  })

  it('handles IPv6 without losing brackets', () => {
    expect(originFromRequest('http://[::1]:3080', 3081)).toBe('http://[::1]:3081')
  })

  it('ignores invalid or unsafe origins', () => {
    expect(originFromRequest('ftp://example.com', 3081)).toBeUndefined()
    expect(originFromRequest('http://evil.example/steal', 3081)).toBeUndefined()
    expect(originFromRequest(undefined, 3081)).toBeUndefined()
  })
})

describe('resolveOAuthOrigin', () => {
  const inferred = 'http://192.168.1.99:3081'

  it('prefers an explicit operator override', () => {
    expect(resolveOAuthOrigin({
      configured: ' https://sso.example.com/ ', requestOrigin: 'http://127.0.0.1:3080',
      listenPort: 3081, inferred,
    })).toEqual({ origin: 'https://sso.example.com', source: 'configured' })
  })

  it('uses the current page domain with the proxy port when no override exists', () => {
    expect(resolveOAuthOrigin({
      requestOrigin: 'http://127.0.0.1:3080', listenPort: 3081, inferred,
    })).toEqual({ origin: 'http://127.0.0.1:3081', source: 'request' })
  })

  it('falls back to the legacy inference only when nothing better is known', () => {
    expect(resolveOAuthOrigin({ listenPort: 3081, inferred }))
      .toEqual({ origin: inferred, source: 'inferred' })
    expect(resolveOAuthOrigin({ requestOrigin: 'ftp://bad', listenPort: 3081, inferred }))
      .toEqual({ origin: inferred, source: 'inferred' })
  })
})
