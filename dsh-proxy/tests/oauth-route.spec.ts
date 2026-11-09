/**
 * The four new `/api/dsh-proxy` endpoints: success envelopes, failure
 * envelopes, and the D3 rule (the secret is returned to the masked input only).
 */
import { describe, expect, it, vi } from 'vitest'
import { createLanProxyRoute } from '../src/index.ts'
import {
  ENDPOINT_OAUTH_BINDING_REMOVE,
  ENDPOINT_OAUTH_BINDING_START,
  ENDPOINT_OAUTH_STATUS,
  ENDPOINT_OAUTH_UPDATE,
  type LanProxyOAuthView,
  type LanProxyResult,
} from '../src/contract.ts'
import type { ProxyController } from '../src/controller.ts'

const view: LanProxyOAuthView = {
  enabled: true,
  publicOrigin: 'http://127.0.0.1:3081',
  authCenter: { baseUrl: '', endpoints: {} },
  providers: {
    github: {
      enabled: true, label: 'GitHub', clientId: 'app', clientSecret: 'top-secret',
      baseUrl: '', scopes: 'read:user user:email',
      endpoints: {
        authorizationEndpoint: 'https://github.com/login/oauth/authorize',
        tokenEndpoint: 'https://github.com/login/oauth/access_token',
        userInfoEndpoint: 'https://api.github.com/user',
      },
      redirectUri: 'http://127.0.0.1:3081/__dsh-proxy/oauth/github/callback',
      effectiveSource: 'official', issues: [], displayOnLogin: true,
    },
    google: {
      enabled: false, label: 'Google', clientId: '', clientSecret: '', baseUrl: '',
      scopes: 'openid email profile',
      endpoints: {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        userInfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
      },
      redirectUri: 'http://127.0.0.1:3081/__dsh-proxy/oauth/google/callback',
      effectiveSource: 'official', issues: [], displayOnLogin: false,
    },
    feishu: {
      enabled: false, label: '飞书', clientId: '', clientSecret: '', baseUrl: '',
      scopes: 'contact:user.base:readonly',
      endpoints: {
        authorizationEndpoint: 'https://accounts.feishu.cn/open-apis/authen/v1/authorize',
        tokenEndpoint: 'https://open.feishu.cn/open-apis/authen/v2/oauth/token',
        userInfoEndpoint: 'https://open.feishu.cn/open-apis/authen/v1/user_info',
      },
      redirectUri: 'http://127.0.0.1:3081/__dsh-proxy/oauth/feishu/callback',
      effectiveSource: 'official', issues: [], displayOnLogin: false,
    },
    casdoor: {
      enabled: false, label: 'Casdoor', clientId: '', clientSecret: '', baseUrl: '',
      scopes: 'openid profile email',
      endpoints: { authorizationEndpoint: '', tokenEndpoint: '', userInfoEndpoint: '' },
      redirectUri: 'http://127.0.0.1:3081/__dsh-proxy/oauth/casdoor/callback',
      effectiveSource: 'official', issues: ['未配置统一认证中心地址，无法启用 Casdoor 登录'], displayOnLogin: false,
    },
  },
  bindings: [],
  hasAnyAuth: true,
  cleartextAuth: 'login',
}

function controller(overrides: Record<string, unknown> = {}): ProxyController {
  return {
    oauthStatus: vi.fn(() => view),
    updateOAuth: vi.fn(() => ({ ok: true, view })),
    startOAuthBinding: vi.fn(() => ({ ok: true, startUrl: 'http://127.0.0.1:3081/__dsh-proxy/oauth/github/bind/start?ticket=t' })),
    removeOAuthBinding: vi.fn(() => ({ ok: true, view })),
    ...overrides,
  } as unknown as ProxyController
}

async function rpc(
  ctrl: ProxyController,
  endpoint: string,
  payload: unknown = {},
  headers: Record<string, string> = {},
): Promise<LanProxyResult<unknown>> {
  const route = createLanProxyRoute(ctrl)
  const response = await route(new Request('http://localhost/api/dsh-proxy', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify({ endpoint, payload }),
  }))
  return await response.json() as LanProxyResult<unknown>
}

describe('OAuth settings RPCs', () => {
  it('returns the masked-in-UI view from oauth-status', async () => {
    const result = await rpc(controller(), ENDPOINT_OAUTH_STATUS)
    expect(result.ok).toBe(true)
    if (result.ok) expect((result.value as LanProxyOAuthView).providers.github.clientSecret).toBe('top-secret')
  })

  it('passes the patch through and returns the refreshed view', async () => {
    const ctrl = controller()
    const result = await rpc(ctrl, ENDPOINT_OAUTH_UPDATE, { enabled: false })
    expect(result.ok).toBe(true)
    expect(ctrl.updateOAuth).toHaveBeenCalledWith({ enabled: false }, 'http://localhost')
  })

  it('passes the settings page origin through, preferring the browser Origin header', async () => {
    const ctrl = controller()
    await rpc(ctrl, ENDPOINT_OAUTH_STATUS, {}, { origin: 'http://192.168.1.5:3080' })
    expect(ctrl.oauthStatus).toHaveBeenCalledWith('http://192.168.1.5:3080')
    await rpc(ctrl, ENDPOINT_OAUTH_BINDING_START, { provider: 'github' }, { origin: 'https://dsh.example.com' })
    expect(ctrl.startOAuthBinding).toHaveBeenCalledWith({ provider: 'github' }, 'https://dsh.example.com')
  })

  it('falls back to Referer, then request.url, and never trusts a javascript: Origin', async () => {
    const ctrl = controller()
    await rpc(ctrl, ENDPOINT_OAUTH_STATUS, {}, { referer: 'https://dsh.example.com/settings' })
    expect(ctrl.oauthStatus).toHaveBeenLastCalledWith('https://dsh.example.com')
    await rpc(ctrl, ENDPOINT_OAUTH_STATUS, {}, { origin: 'javascript:alert(1)' })
    expect(ctrl.oauthStatus).toHaveBeenLastCalledWith('http://localhost')
  })

  it('returns an absolute bind start URL', async () => {
    const result = await rpc(controller(), ENDPOINT_OAUTH_BINDING_START, { provider: 'github' })
    expect(result.ok).toBe(true)
    if (result.ok) expect((result.value as { startUrl: string }).startUrl).toContain('/bind/start?ticket=')
  })

  it('returns a failure envelope for a rejected patch or an unknown binding', async () => {
    const rejected = await rpc(controller({
      updateOAuth: () => ({ ok: false, message: '未配置 Client ID 或 Client Secret，无法启用 github 登录' }),
      removeOAuthBinding: () => ({ ok: false, message: '该绑定不存在' }),
    }), ENDPOINT_OAUTH_UPDATE, { enabled: true })
    expect(rejected.ok).toBe(false)
    if (!rejected.ok) expect(rejected.error.message).toContain('Client ID')

    const missing = await rpc(controller({ removeOAuthBinding: () => ({ ok: false, message: '该绑定不存在' }) }), ENDPOINT_OAUTH_BINDING_REMOVE, { id: 'nope' })
    expect(missing.ok).toBe(false)
  })

  it('reports an uninitialized runtime as a failure, not a thrown error', async () => {
    const result = await rpc(controller({ oauthStatus: () => null }), ENDPOINT_OAUTH_STATUS)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toContain('未初始化')
  })
})
