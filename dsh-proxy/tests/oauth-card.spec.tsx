// @vitest-environment jsdom
/**
 * The third-party login settings card: masked secret, per-channel config,
 * binding list/hints, the full update payload, and zh/en key parity.
 */
import type { ReactElement } from 'react'
import { flushSync } from 'react-dom'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { OAuthCard } from '../src/client/OAuthCard.tsx'
import { en, zh, type LanProxyKey } from '../src/client/locales.ts'
import {
  ENDPOINT_OAUTH_BINDING_REMOVE,
  ENDPOINT_OAUTH_BINDING_START,
  ENDPOINT_OAUTH_STATUS,
  ENDPOINT_OAUTH_UPDATE,
  type LanProxyOAuthProviderView,
  type LanProxyOAuthView,
} from '../src/contract.ts'
import type { LanProxyCall } from '../src/client/transport.ts'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = false
const t = (key: LanProxyKey, params?: Record<string, unknown>): string => {
  const template = zh[key] ?? key
  if (params === undefined) return template
  return template.replace(/\{(\w+)\}/g, (_m, name: string) => String(params[name] ?? ''))
}

const channel = (label: string, enabled: boolean, id: string): LanProxyOAuthProviderView => ({
  enabled,
  label,
  clientId: enabled ? 'app' : '',
  clientSecret: enabled ? 'top-secret' : '',
  baseUrl: '',
  scopes: 'scope:read',
  endpoints: {
    authorizationEndpoint: 'https://example.com/authorize',
    tokenEndpoint: 'https://example.com/token',
    userInfoEndpoint: 'https://example.com/userinfo',
  },
  redirectUri: `http://127.0.0.1:3081/__dsh-proxy/oauth/${id}/callback`,
  effectiveSource: 'official',
  issues: [],
  displayOnLogin: enabled,
})

const view = (overrides: Partial<LanProxyOAuthView> = {}): LanProxyOAuthView => ({
  enabled: true,
  publicOrigin: 'http://127.0.0.1:3081',
  authCenter: { baseUrl: '', endpoints: {} },
  providers: {
    github: channel('GitHub', true, 'github'),
    google: channel('Google', false, 'google'),
    feishu: channel('飞书', false, 'feishu'),
    casdoor: channel('Casdoor', false, 'casdoor'),
  },
  bindings: [{
    id: 'b1', provider: 'github', subject: '42', displayName: 'octocat',
    localSubject: 'admin', boundAt: Date.UTC(2026, 0, 1), boundVia: 'settings',
  }],
  hasAnyAuth: true,
  cleartextAuth: 'login',
  ...overrides,
})

interface CallLog { endpoint: string; payload: unknown }
function makeCall(current: LanProxyOAuthView = view()): { call: LanProxyCall; calls: CallLog[] } {
  const calls: CallLog[] = []
  const call = vi.fn((endpoint: string, payload: unknown) => {
    calls.push({ endpoint, payload })
    if (endpoint === ENDPOINT_OAUTH_STATUS) return Promise.resolve({ ok: true, value: current })
    if (endpoint === ENDPOINT_OAUTH_UPDATE) return Promise.resolve({ ok: true, value: current })
    if (endpoint === ENDPOINT_OAUTH_BINDING_START) {
      return Promise.resolve({ ok: true, value: { startUrl: 'http://127.0.0.1:3081/__dsh-proxy/oauth/github/bind/start?ticket=t' } })
    }
    if (endpoint === ENDPOINT_OAUTH_BINDING_REMOVE) {
      return Promise.resolve({ ok: true, value: { ...current, bindings: [] } })
    }
    return Promise.resolve({ ok: false, error: { code: 'bad-request', message: 'unknown', details: { issues: [] } } })
  }) as unknown as LanProxyCall
  return { call, calls }
}

function mount(element: ReactElement): { root: Root; container: HTMLDivElement } {
  const container = document.createElement('div')
  const root = createRoot(container)
  flushSync(() => { root.render(element) })
  return { root, container }
}

const flush = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 0))
let mounted: { root: Root; container: HTMLDivElement } | null = null
beforeEach(() => { document.head.innerHTML = '' })
afterEach(() => { mounted?.root.unmount(); mounted = null })

async function render(current: LanProxyOAuthView = view()): Promise<{
  container: HTMLDivElement
  calls: CallLog[]
}> {
  const { call, calls } = makeCall(current)
  mounted = mount(<OAuthCard call={call} t={t} />)
  await flush()
  await flush()
  return { container: mounted.container, calls }
}

describe('OAuthCard', () => {
  it('renders all four channels, the binding list and the effective endpoints', async () => {
    const { container } = await render()
    const text = container.textContent ?? ''
    expect(text).toContain('第三方登录')
    expect(text).toContain('GitHub')
    expect(text).toContain('Google')
    expect(text).toContain('飞书')
    expect(text).toContain('Casdoor')
    expect(text).toContain('账号绑定')
    expect(text).toContain('octocat')
    expect(text).toContain('https://example.com/authorize')
    expect(text).toContain('回调地址')
    expect(container.querySelector('#oauth-secret-github')?.getAttribute('type')).toBe('password')
  })

  it('prefills the client secret into a MASKED input (D3)', async () => {
    const { container } = await render()
    const input = container.querySelector('#oauth-secret-github') as HTMLInputElement
    expect(input.value).toBe('top-secret')
    expect(input.type).toBe('password')
    expect(container.querySelector('#oauth-client-github')?.getAttribute('type')).toBe('text')
  })

  it('submits a full config patch with all four channels', async () => {
    const { container, calls } = await render()
    const form = container.querySelector('form') as HTMLFormElement
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await flush()
    await flush()
    const update = calls.find(entry => entry.endpoint === ENDPOINT_OAUTH_UPDATE)
    expect(update).toBeDefined()
    const payload = update?.payload as { enabled: boolean; providers: Record<string, unknown> }
    expect(payload.enabled).toBe(true)
    expect(Object.keys(payload.providers).sort()).toEqual(['casdoor', 'feishu', 'github', 'google'])
    expect((payload.providers.github as { clientSecret: string }).clientSecret).toBe('top-secret')
  })

  it('shows the Basic-mode and no-authentication hints', async () => {
    const basic = await render(view({ cleartextAuth: 'basic' }))
    expect(basic.container.textContent).toContain('Basic 弹窗模式')
    const empty = await render(view({ hasAnyAuth: false }))
    expect(empty.container.textContent).toContain('开放访问')
  })

  it('shows each channel its own official default endpoint, not a made-up Casdoor host', async () => {
    const { container } = await render()
    const hints = Array.from(container.querySelectorAll('input[id^="oauth-base-"]'))
      .map(node => node.getAttribute('placeholder'))
    expect(hints).toContain('https://github.com/login/oauth/authorize')
    expect(hints).toContain('https://accounts.google.com/o/oauth2/v2/auth')
    expect(hints).toContain('https://accounts.feishu.cn/open-apis/authen/v1/authorize')
    expect(new Set(hints).size).toBe(4)
    expect(container.querySelector('#oauth-auth-center')?.getAttribute('placeholder')).toBe('https://sso.example.com')
  })

  it('keeps the zh and en key sets identical', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(zh).sort())
  })

  it('shows the bind action only for displayable channels', async () => {
    const { container } = await render()
    const buttons = Array.from(container.querySelectorAll('button')).map(node => node.textContent ?? '')
    expect(buttons.some(text => text.includes('绑定 GitHub'))).toBe(true)
    expect(buttons.some(text => text.includes('绑定 Google'))).toBe(false)
    expect(buttons.some(text => text.includes('解绑'))).toBe(true)
  })

  it('opens the binding flow in a POPUP and never navigates the settings page', async () => {
    const popup = { opener: null, location: { href: '' }, close: () => {} } as unknown as Window
    const open = vi.spyOn(window, 'open').mockReturnValue(popup)
    const { container } = await render()
    const button = Array.from(container.querySelectorAll('button'))
      .find(node => (node.textContent ?? '').includes('绑定 GitHub'))
    expect(button).toBeDefined()
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flush()
    await flush()
    expect(open).toHaveBeenCalledWith('about:blank', 'dsh-proxy-oauth-bind', expect.stringContaining('popup'))
    expect((popup as unknown as { location: { href: string } }).location.href).toContain('/bind/start?ticket=')
    expect(popup.opener).toBeNull()
    open.mockRestore()
  })

  it('requires a second click before unbinding an account', async () => {
    const { container, calls } = await render()
    const first = Array.from(container.querySelectorAll('button'))
      .find(node => (node.textContent ?? '').includes('解绑'))
    first?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flush()
    await flush()
    expect(calls.some(entry => entry.endpoint === ENDPOINT_OAUTH_BINDING_REMOVE)).toBe(false)
    expect(container.textContent).toContain('确定要解除')
    const confirm = Array.from(container.querySelectorAll('button'))
      .find(node => (node.textContent ?? '').includes('确认解绑'))
    expect(confirm).toBeDefined()
    confirm?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flush()
    await flush()
    expect(calls.some(entry => entry.endpoint === ENDPOINT_OAUTH_BINDING_REMOVE)).toBe(true)
  })

  it('cancels a pending unbind without calling the host', async () => {
    const { container, calls } = await render()
    const first = Array.from(container.querySelectorAll('button'))
      .find(node => (node.textContent ?? '').includes('解绑'))
    first?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flush()
    await flush()
    const cancel = Array.from(container.querySelectorAll('button'))
      .find(node => (node.textContent ?? '') === '取消')
    expect(cancel).toBeDefined()
    cancel?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flush()
    await flush()
    expect(calls.some(entry => entry.endpoint === ENDPOINT_OAUTH_BINDING_REMOVE)).toBe(false)
    expect(container.textContent).not.toContain('确定要解除')
  })

  it('shows a cancellable waiting state and closes the popup on cancel', async () => {
    const close = vi.fn()
    const popup = { opener: null, location: { href: '' }, close, closed: false } as unknown as Window
    const open = vi.spyOn(window, 'open').mockReturnValue(popup)
    const { container } = await render()
    const bindButton = Array.from(container.querySelectorAll('button'))
      .find(node => (node.textContent ?? '').includes('绑定 GitHub'))
    bindButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flush()
    await flush()
    expect(container.textContent).toContain('正在等待第三方认证')
    const cancel = Array.from(container.querySelectorAll('button'))
      .find(node => (node.textContent ?? '').includes('取消认证'))
    expect(cancel).toBeDefined()
    cancel?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flush()
    await flush()
    expect(close).toHaveBeenCalled()
    expect(container.textContent).toContain('已取消第三方认证')
    open.mockRestore()
  })

  it('ignores a late binding success after cancellation', async () => {
    const popup = { opener: null, location: { href: '' }, close: vi.fn(), closed: false } as unknown as Window
    const open = vi.spyOn(window, 'open').mockReturnValue(popup)
    const { container } = await render()
    const bindButton = Array.from(container.querySelectorAll('button'))
      .find(node => (node.textContent ?? '').includes('绑定 GitHub'))
    bindButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flush()
    await flush()
    const cancel = Array.from(container.querySelectorAll('button'))
      .find(node => (node.textContent ?? '').includes('取消认证'))
    cancel?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flush()
    await flush()
    window.dispatchEvent(new MessageEvent('message', {
      data: { source: 'dsh-proxy-oauth', intent: 'bind', status: 'bound' },
      origin: window.location.origin,
    }))
    await flush()
    await flush()
    expect(container.textContent).toContain('已取消第三方认证')
    expect(container.textContent).not.toContain('绑定成功，列表已刷新')
    open.mockRestore()
  })

  it('closes the popup when authorization takes longer than three minutes', async () => {
    const close = vi.fn()
    const popup = { opener: null, location: { href: '' }, close, closed: false } as unknown as Window
    const open = vi.spyOn(window, 'open').mockReturnValue(popup)
    const timeoutSpy = vi.spyOn(window, 'setTimeout')
    const { container } = await render()
    const bindButton = Array.from(container.querySelectorAll('button'))
      .find(node => (node.textContent ?? '').includes('绑定 GitHub'))
    bindButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flush()
    await flush()
    const timeoutCall = timeoutSpy.mock.calls.find(call => call[1] === 180000)
    expect(timeoutCall).toBeDefined()
    ;(timeoutCall?.[0] as () => void)()
    await flush()
    await flush()
    expect(close).toHaveBeenCalled()
    expect(container.textContent).toContain('等待第三方认证超时')
    timeoutSpy.mockRestore()
    open.mockRestore()
  })

  it('keeps a TYPED providerHint through save (not just a prefilled one)', async () => {
    const { container, calls } = await render()
    // The field lives in the main channel block: no "advanced" click needed.
    const input = container.querySelector('#oauth-hint-github') as HTMLInputElement
    expect(input).not.toBeNull()
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
    setter?.call(input, 'casdoor-github')
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await flush()
    const form = container.querySelector('form') as HTMLFormElement
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await flush()
    await flush()
    const update = calls.find(entry => entry.endpoint === ENDPOINT_OAUTH_UPDATE)
    const payload = update?.payload as { providers: Record<string, { providerHint: string }> }
    expect(payload.providers.github.providerHint).toBe('casdoor-github')
  })

  it('keeps the typed hint when the host view omits providerHint after a save', async () => {
    // `view()` has no providerHint at all, so the mock host response simulates
    // an older host bundle that does not echo the field back.
    const { container } = await render()
    const input = container.querySelector('#oauth-hint-github') as HTMLInputElement
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
    setter?.call(input, 'my-hint')
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await flush()
    const form = container.querySelector('form') as HTMLFormElement
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await flush()
    await flush()
    expect((container.querySelector('#oauth-hint-github') as HTMLInputElement).value).toBe('my-hint')
  })

  it('prefills and submits providerHint, and shows the effective parameter', async () => {
    const custom = view()
    custom.providers.github = { ...custom.providers.github, providerHint: 'github' }
    const { container, calls } = await render(custom)
    expect(container.textContent).toContain('provider_hint=github')

    const form = container.querySelector('form') as HTMLFormElement
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await flush()
    await flush()
    const update = calls.find(entry => entry.endpoint === ENDPOINT_OAUTH_UPDATE)
    const payload = update?.payload as { providers: Record<string, { providerHint: string }> }
    expect(payload.providers.github.providerHint).toBe('github')

    const input = container.querySelector('#oauth-hint-github') as HTMLInputElement
    expect(input.value).toBe('github')
  })
})
