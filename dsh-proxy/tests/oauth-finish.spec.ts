/**
 * The popup result document: same-origin notification, auto-close only on
 * success, and safe interpolation of operator-supplied failure messages.
 */
import { describe, expect, it } from 'vitest'
import { renderOAuthFinishPage } from '../src/oauth/finish.ts'
import { OAUTH_CHANNEL, OAUTH_MESSAGE_SOURCE } from '../src/contract.ts'

describe('OAuth popup finish page', () => {
  it('notifies the opener and auto-closes on success', () => {
    const html = renderOAuthFinishPage({ status: 'ok', intent: 'login' })
    expect(html).toContain('登录成功')
    expect(html).toContain('BroadcastChannel')
    expect(html).toContain(OAUTH_CHANNEL)
    expect(html).toContain(OAUTH_MESSAGE_SOURCE)
    expect(html).toContain('if (true) {')
    expect(html).toContain('window.close()')
    expect(html).not.toContain('<script src')
  })

  it('reports a binding result with its own intent', () => {
    const html = renderOAuthFinishPage({ status: 'bound', intent: 'bind' })
    expect(html).toContain('绑定成功')
    expect(html).toContain('"intent":"bind"')
  })

  it('keeps a failure open and shows the localized reason', () => {
    const html = renderOAuthFinishPage({ status: 'unbound', intent: 'login', message: '该三方账号尚未绑定' })
    expect(html).toContain('该三方账号尚未绑定')
    expect(html).toContain('"status":"unbound"')
    expect(html).toContain('if (false) {')
  })

  it('escapes injected markup and never lets a message break out of the script', () => {
    const html = renderOAuthFinishPage({
      status: 'failed',
      intent: 'bind',
      message: '</script><script>alert(1)</script>',
    })
    expect(html).toContain('&lt;/script&gt;')
    expect(html).not.toContain('</script><script>alert(1)</script>')
    expect(html.match(/<script>/g)).toHaveLength(1)
    expect(html).toContain('\\u003c/script\\u003e')
  })

  it('auto-closes only for ok/bound and keeps every failure open', () => {
    expect(renderOAuthFinishPage({ status: 'ok', intent: 'login' })).toContain('if (true) {')
    expect(renderOAuthFinishPage({ status: 'bound', intent: 'bind' })).toContain('if (true) {')
    for (const status of ['unbound', 'denied', 'invalid', 'failed', 'rejected', 'unavailable'] as const) {
      const html = renderOAuthFinishPage({ status, intent: 'login' })
      expect(html).toContain('if (false) {')
      expect(html).toContain('关闭窗口')
    }
  })

  it('never navigates the opener from the popup', () => {
    const html = renderOAuthFinishPage({ status: 'ok', intent: 'login' })
    expect(html).not.toContain('opener.location')
    expect(html).not.toContain('window.location =')
  })
})
