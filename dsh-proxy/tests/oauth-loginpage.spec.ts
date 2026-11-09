// @vitest-environment jsdom
/**
 * The zero-JavaScript login page renders ONLY the channels handed to it, with
 * inline icons, escaped labels, and no external assets.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderLoginPage } from '../src/loginpage.ts'
import { providerIconSvg } from '../src/oauth/providers.ts'
import { OAUTH_MESSAGE_SOURCE } from '../src/contract.ts'

const base = { action: '/__dsh-proxy/login', secure: true }
const buttons = (labels: string[]) => labels.map((label, index) => ({
  id: (index === 0 ? 'github' : 'feishu') as 'github' | 'feishu',
  label,
  startUrl: `/__dsh-proxy/oauth/${index === 0 ? 'github' : 'feishu'}/start`,
  icon: providerIconSvg(index === 0 ? 'github' : 'feishu'),
}))

afterEach(() => { document.body.innerHTML = '' })

describe('login page with third-party channels', () => {
  it('keeps the original document unchanged when no channel is enabled', () => {
    const html = renderLoginPage(base)
    expect(html).toContain('<form method="post"')
    expect(html).toContain('请输入用户名和密码以访问 DSH。')
    expect(html).not.toContain('class="oauthBtn"')
    expect(html).not.toContain('<script')
    expect(html).not.toContain('id="oauth-pending"')
  })

  it('renders exactly the enabled channels as POPUP links with inline SVG', () => {
    const html = renderLoginPage({ ...base, providers: buttons(['GitHub', '飞书']) })
    expect(html.match(/class="oauthBtn"/g)).toHaveLength(2)
    expect(html).toContain('GitHub')
    expect(html).toContain('飞书')
    expect(html).toContain('<svg')
    expect(html).toContain('或使用第三方账号登录')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
    expect(html).toContain("window.open('about:blank'")
    expect(html).toContain('popup.opener = null')
    expect(html).toContain('BroadcastChannel')
    expect(html).toContain('dsh-proxy-oauth')
    expect(html).not.toContain('https://github.com')
    expect(html).not.toContain('<script src')
    // Waiting state: manual cancel, 3-minute timeout and success navigation.
    expect(html).toContain('id="oauth-pending"')
    expect(html).toContain('id="oauth-cancel"')
    expect(html).toContain('window.dshProxyOauthCancel')
    expect(html).toContain('180000')
    expect(html).toContain("window.location.replace('/')")
    expect(html).toContain('if (!active) return;')
  })

  it('escapes operator-supplied labels', () => {
    const html = renderLoginPage({ ...base, providers: buttons(['<script>alert(1)</script>', 'Feishu']) })
    expect(html).not.toContain('<script>alert(1)</script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('omits the password form when only third-party login is configured', () => {
    const html = renderLoginPage({ ...base, passwordForm: false, providers: buttons(['GitHub']) })
    expect(html).not.toContain('<form method="post"')
    expect(html).toContain('请使用已启用的第三方账号登录。')
    expect(html).toContain('class="oauthBtn"')
  })

  it('escapes the error and states the cleartext warning', () => {
    const html = renderLoginPage({ ...base, secure: false, error: '<b>失败</b>' })
    expect(html).toContain('&lt;b&gt;失败&lt;/b&gt;')
    expect(html).toContain('当前连接未加密')
  })

  it('ignores a late success result after the visitor cancels', () => {
    const html = renderLoginPage({ ...base, providers: buttons(['GitHub']) })
    const script = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1] ?? ''
    document.body.innerHTML = html.replace(/<script>[\s\S]*?<\/script>/g, '')

    let onMessage: ((event: { data: unknown }) => void) | null = null
    class ChannelStub {
      set onmessage(fn: (event: { data: unknown }) => void) { onMessage = fn }
      close() {}
      postMessage() {}
    }
    const popup = {
      closed: false,
      opener: null,
      location: { href: '' },
      close() { this.closed = true },
    }
    const replace = vi.fn()
    const fakeWindow = {
      open: () => popup,
      setTimeout: window.setTimeout.bind(window),
      clearTimeout: window.clearTimeout.bind(window),
      setInterval: window.setInterval.bind(window),
      clearInterval: window.clearInterval.bind(window),
      addEventListener: () => {},
      location: { origin: 'http://localhost', replace },
    }
    // The inline script is static; inject the browser seams so the real state
    // machine (not a reimplementation) is what the test exercises.
    new Function('window', 'document', 'BroadcastChannel', script)(fakeWindow, document, ChannelStub)

    const win = fakeWindow as unknown as {
      dshProxyOauthOpen: (anchor: unknown) => boolean
      dshProxyOauthCancel: () => void
    }
    expect(win.dshProxyOauthOpen({ href: '/__dsh-proxy/oauth/github/start' })).toBe(false)
    win.dshProxyOauthCancel()
    onMessage?.({ data: { source: OAUTH_MESSAGE_SOURCE, intent: 'login', status: 'ok' } })

    // Cancellation wins: no navigation, popup closed, cancel reason kept.
    expect(replace).not.toHaveBeenCalled()
    expect(popup.closed).toBe(true)
    expect(document.getElementById('oauth-error')?.textContent).toContain('已取消')
    expect(document.getElementById('oauth-pending')?.hidden).toBe(true)
  })
})
