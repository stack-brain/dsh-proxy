/**
 * Gate integration (real HTTP listener, fake OAuth runtime):
 * - D2′: with NEITHER method configured, open access stays and every OAuth
 *   route is handed to the runtime (which refuses it);
 * - D2: with OAuth as the only method the gate turns on, the login page shows
 *   the channel buttons, and Basic credentials can no longer bypass it;
 * - existing password+Basic behaviour is unchanged.
 */
import http from 'node:http'
import type { AddressInfo } from 'node:net'
import { afterEach, describe, expect, it } from 'vitest'
import { AuthState } from '../src/auth.ts'
import type { OAuthGateLike } from '../src/oauth/runtime.ts'
import { providerIconSvg } from '../src/oauth/providers.ts'
import { startLanProxy, type LanProxyHandle } from '../src/proxy.ts'

interface Answer { status: number; headers: http.IncomingHttpHeaders; body: string }

function get(port: number, path: string, headers: Record<string, string> = {}): Promise<Answer> {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, path, method: 'GET', headers }, (res) => {
      const chunks: Buffer[] = []
      res.on('data', (chunk: Buffer) => chunks.push(chunk))
      res.on('end', () => resolve({
        status: res.statusCode ?? 0,
        headers: res.headers,
        body: Buffer.concat(chunks).toString('utf8'),
      }))
    })
    req.on('error', reject)
    req.end()
  })
}

const oauthGate = (authEnabled: boolean): OAuthGateLike => ({
  authEnabled,
  loginProviders: () => authEnabled
    ? [{ id: 'github', label: 'GitHub', startUrl: '/__dsh-proxy/oauth/github/start', icon: providerIconSvg('github') }]
    : [],
  handle: async (_req, res, pathname) => {
    if (!pathname.startsWith('/__dsh-proxy/oauth/')) return false
    res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' })
    res.end('第三方登录当前不可用')
    return true
  },
})

const active: Array<() => Promise<void>> = []
afterEach(async () => {
  while (active.length > 0) await (active.pop() as () => Promise<void>)()
})

async function world(input: {
  oauth: OAuthGateLike
  username?: string
  password?: string
}): Promise<number> {
  const upstream = http.createServer((_req, res) => {
    res.writeHead(200, { 'content-type': 'text/plain' })
    res.end('UPSTREAM_MARKER')
  })
  await new Promise<void>(resolve => upstream.listen(0, '127.0.0.1', resolve))
  const upstreamPort = (upstream.address() as AddressInfo).port
  const proxy: LanProxyHandle = startLanProxy({
    listenHost: '127.0.0.1',
    listenPort: 0,
    upstreamHost: '127.0.0.1',
    upstreamPort,
    username: input.username ?? '',
    password: input.password ?? '',
    auth: new AuthState({}),
    oauth: input.oauth,
  })
  const port = await proxy.ready
  active.push(async () => {
    await proxy.close()
    await new Promise<void>(resolve => upstream.close(() => resolve()))
  })
  return port
}

const basic = (user: string, pass: string): string =>
  `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`

describe('gate with third-party login', () => {
  it('keeps open access with NO auth method (D2′) but refuses OAuth routes', async () => {
    const port = await world({ oauth: oauthGate(false) })
    const open = await get(port, '/')
    expect(open.status).toBe(200)
    expect(open.body).toContain('UPSTREAM_MARKER')
    const refused = await get(port, '/__dsh-proxy/oauth/github/start')
    expect(refused.status).toBe(403)
    expect(refused.body).toContain('第三方登录当前不可用')
  })

  it('turns the gate on when OAuth is the ONLY method and shows its buttons', async () => {
    const port = await world({ oauth: oauthGate(true) })
    const gated = await get(port, '/')
    expect(gated.status).toBe(303)
    expect(String(gated.headers.location)).toContain('/__dsh-proxy/login')
    const page = await get(port, '/__dsh-proxy/login')
    expect(page.status).toBe(200)
    expect(page.body).toContain('GitHub')
    expect(page.body).toContain('oauthBtn')
    expect(page.body).not.toContain('<script src')

    // No local password: Basic credentials must NOT bypass the gate.
    const withBasic = await get(port, '/', { authorization: basic('admin', 'whatever') })
    expect(withBasic.status).toBe(303)
  })

  it('keeps accepting Basic when a local password pair is configured', async () => {
    const port = await world({ oauth: oauthGate(false), username: 'admin', password: 's3cret' })
    const withBasic = await get(port, '/', { authorization: basic('admin', 's3cret') })
    expect(withBasic.status).toBe(200)
    expect(withBasic.body).toContain('UPSTREAM_MARKER')
  })
})
