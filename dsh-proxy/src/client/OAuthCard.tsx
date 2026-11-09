/**
 * Settings card for third-party login.
 *
 * Two surfaces in one card: the per-channel config (official endpoints unless
 * the operator points a channel / all channels at a self-hosted auth center)
 * and the manual binding table (the only accounts allowed to sign in).
 *
 * All RPCs go through the plugin's own `/api/dsh-proxy` channel; every outcome
 * is rendered, never thrown to the shell. The client secret is a masked input
 * whose value is prefilled exactly like the password field (the host's view is
 * already behind the browser-session fence), and is never logged client-side.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import {
  ENDPOINT_OAUTH_BINDING_REMOVE,
  ENDPOINT_OAUTH_BINDING_START,
  ENDPOINT_OAUTH_STATUS,
  ENDPOINT_OAUTH_UPDATE,
  OAUTH_CHANNEL,
  OAUTH_MESSAGE_SOURCE,
  OAUTH_POPUP_TIMEOUT_MS,
  type LanProxyOAuthProviderId,
  type LanProxyOAuthProviderPatch,
  type LanProxyOAuthProviderView,
  type LanProxyOAuthUpdatePayload,
  type LanProxyOAuthView,
} from '../contract.ts'
import type { SettingsSectionProps } from './SettingsSection.tsx'
import type { LanProxyCall } from './transport.ts'
import { OAuthIcon } from './OAuthIcons.tsx'

/** The `t` seat, reusing the exact type the section receives. */
type Translate = SettingsSectionProps['t']

/** Props injected by the settings section. */
export interface OAuthCardProps {
  call: LanProxyCall
  t: Translate
}

/** Stable channel order (also the login-page button order). */
const PROVIDER_IDS: readonly LanProxyOAuthProviderId[] = ['github', 'google', 'feishu', 'casdoor']

/**
 * Placeholder for each channel's auth-center URL: that platform's own official
 * authorize endpoint, i.e. the default used when the field is left blank. Keep
 * in sync with OFFICIAL_ENDPOINTS (src/oauth/providers.ts) — this is display
 * only, the host remains the sole source of truth for the actual request.
 * Casdoor has no public official host, so it shows a neutral deployment hint.
 */
const DEFAULT_AUTHORIZE_PLACEHOLDERS: Readonly<Record<LanProxyOAuthProviderId, string>> = {
  github: 'https://github.com/login/oauth/authorize',
  google: 'https://accounts.google.com/o/oauth2/v2/auth',
  feishu: 'https://accounts.feishu.cn/open-apis/authen/v1/authorize',
  casdoor: 'https://door.your-domain.com',
}

/** Editable fields of one channel. */
interface ChannelDraft {
  enabled: boolean
  clientId: string
  clientSecret: string
  scopes: string
  baseUrl: string
  label: string
  providerHint: string
  authorizationEndpoint: string
  tokenEndpoint: string
  userInfoEndpoint: string
}

/** The whole editable form. */
interface Draft {
  enabled: boolean
  authCenterBaseUrl: string
  publicOrigin: string
  channels: Record<LanProxyOAuthProviderId, ChannelDraft>
}

/** Seed the form from a host view; resolved endpoints are display-only. */
function draftFromView(view: LanProxyOAuthView): Draft {
  const channels = {} as Record<LanProxyOAuthProviderId, ChannelDraft>
  for (const id of PROVIDER_IDS) {
    const provider = view.providers[id]
    const overrides = provider.endpointOverrides ?? {}
    channels[id] = {
      enabled: provider.enabled,
      clientId: provider.clientId,
      clientSecret: provider.clientSecret,
      scopes: provider.scopes,
      baseUrl: provider.baseUrl ?? '',
      label: provider.label,
      providerHint: provider.providerHint ?? '',
      authorizationEndpoint: overrides.authorizationEndpoint ?? '',
      tokenEndpoint: overrides.tokenEndpoint ?? '',
      userInfoEndpoint: overrides.userInfoEndpoint ?? '',
    }
  }
  return {
    enabled: view.enabled,
    authCenterBaseUrl: view.authCenter.baseUrl,
    publicOrigin: view.publicOrigin,
    channels,
  }
}

/** Localized label for where a channel's endpoints came from. */
function sourceLabel(source: LanProxyOAuthProviderView['effectiveSource'], t: Translate): string {
  if (source === 'auth-center') return t('oauth.sourceCenter')
  if (source === 'provider-override') return t('oauth.sourceOverride')
  return t('oauth.sourceOfficial')
}

/** Render the third-party login card. */
export function OAuthCard({ call, t }: OAuthCardProps): ReactNode {
  const [view, setView] = useState<LanProxyOAuthView | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [expanded, setExpanded] = useState<Partial<Record<LanProxyOAuthProviderId, boolean>>>({})
  const [saving, setSaving] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [pending, setPending] = useState<LanProxyOAuthProviderId | null>(null)
  const [confirmUnbind, setConfirmUnbind] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const pollRef = useRef<number | null>(null)
  const pendingRef = useRef<{ popup: Window | null; timeout: number } | null>(null)

  const load = useCallback(async (): Promise<void> => {
    try {
      const result = await call<LanProxyOAuthView>(ENDPOINT_OAUTH_STATUS, {})
      if (result.ok) {
        const next = result.value as LanProxyOAuthView
        setView(next)
        setDraft(draftFromView(next))
        setError(null)
      } else {
        setError(result.error.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }, [call])

  useEffect(() => {
    void load()
  }, [load])

  /** Stop polling for a binding result. */
  const stopPolling = useCallback((): void => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  /**
   * End the waiting phase: cancel the poll and the 3-minute timer, and
   * optionally close the popup. A terminal result passes `false` because the
   * finish page decides on its own whether to close (success only).
   */
  const clearPending = useCallback((closePopup: boolean): void => {
    const state = pendingRef.current
    pendingRef.current = null
    if (state !== null) window.clearTimeout(state.timeout)
    if (closePopup) {
      try { state?.popup?.close() } catch { /* already closed */ }
    }
    stopPolling()
    setPending(null)
  }, [stopPolling])

  const cancelPending = (): void => {
    clearPending(true)
    setError(t('oauth.authCancelled'))
  }

  /** Handle a popup result message: refresh the binding list, or show the error. */
  const receiveOAuthMessage = useCallback((data: unknown): void => {
    // A late result (the provider finished just as the visitor cancelled, the
    // 3-minute timer fired, or the popup was closed) must not report success.
    if (pendingRef.current === null) return
    if (typeof data !== 'object' || data === null) return
    const payload = data as { source?: string; intent?: string; status?: string; message?: string }
    if (payload.source !== OAUTH_MESSAGE_SOURCE || payload.intent !== 'bind') return
    clearPending(false)
    if (payload.status === 'bound') {
      void load()
      setMessage(t('oauth.bound'))
    } else if (payload.message !== undefined) {
      setError(payload.message)
    }
  }, [clearPending, load, t])

  useEffect(() => {
    let channel: BroadcastChannel | null = null
    try {
      channel = new BroadcastChannel(OAUTH_CHANNEL)
      channel.onmessage = (event: MessageEvent) => { receiveOAuthMessage(event.data) }
    } catch {
      // Older browsers: the poll below is the fallback.
    }
    const allowedOrigins = new Set([window.location.origin])
    if (view?.publicOrigin !== undefined && view.publicOrigin !== '') {
      try { allowedOrigins.add(new URL(view.publicOrigin).origin) } catch { /* ignore a bad origin */ }
    }
    const onMessage = (event: MessageEvent): void => {
      if (!allowedOrigins.has(event.origin)) return
      receiveOAuthMessage(event.data)
    }
    window.addEventListener('message', onMessage)
    return () => {
      channel?.close()
      window.removeEventListener('message', onMessage)
    }
  }, [receiveOAuthMessage, view?.publicOrigin])

  useEffect(() => () => {
    const state = pendingRef.current
    if (state !== null) window.clearTimeout(state.timeout)
    try { state?.popup?.close() } catch { /* already closed */ }
    pendingRef.current = null
    stopPolling()
  }, [stopPolling])

  /**
   * Poll the binding table as a cross-origin-safe fallback: the settings page
   * may be served on DSH's own origin while the popup finishes on the proxy's.
   */
  const startBindingPolling = (baseline: readonly string[]): void => {
    stopPolling()
    const known = new Set(baseline)
    const deadline = Date.now() + OAUTH_POPUP_TIMEOUT_MS
    pollRef.current = window.setInterval(() => {
      if (Date.now() >= deadline) {
        stopPolling()
        return
      }
      void (async () => {
        const result = await call<LanProxyOAuthView>(ENDPOINT_OAUTH_STATUS, {})
        if (!result.ok) return
        const next = result.value as LanProxyOAuthView
        if (next.bindings.some(binding => !known.has(binding.id))) {
          clearPending(false)
          setView(next)
          setDraft(draftFromView(next))
          setMessage(t('oauth.bound'))
        }
      })()
    }, 1500)
  }

  /** Patch one channel without touching the rest of the draft. */
  const patchChannel = (id: LanProxyOAuthProviderId, patch: Partial<ChannelDraft>): void => {
    setDraft(previous => previous === null ? previous : {
      ...previous,
      channels: {
        ...previous.channels,
        [id]: { ...previous.channels[id], ...patch },
      },
    })
  }

  /** Submit the FULL config; omitted endpoint overrides stay omitted. */
  const submit = async (event: FormEvent): Promise<void> => {
    event.preventDefault()
    if (draft === null || view === null) return
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      const providers: NonNullable<LanProxyOAuthUpdatePayload['providers']> = {}
      for (const id of PROVIDER_IDS) {
        const channel = draft.channels[id]
        const existing = view.providers[id].endpointOverrides ?? {}
        const endpoints: NonNullable<LanProxyOAuthProviderPatch['endpoints']> = {
          ...existing,
          authorizationEndpoint: channel.authorizationEndpoint.trim(),
          tokenEndpoint: channel.tokenEndpoint.trim(),
          userInfoEndpoint: channel.userInfoEndpoint.trim(),
        }
        providers[id] = {
          enabled: channel.enabled,
          clientId: channel.clientId.trim(),
          clientSecret: channel.clientSecret,
          scopes: channel.scopes.trim().split(/\s+/).filter(value => value !== ''),
          baseUrl: channel.baseUrl.trim(),
          label: channel.label.trim(),
          providerHint: channel.providerHint.trim(),
          endpoints,
        }
      }
      const payload: LanProxyOAuthUpdatePayload = {
        enabled: draft.enabled,
        authCenter: { baseUrl: draft.authCenterBaseUrl.trim() },
        publicOrigin: draft.publicOrigin.trim(),
        providers,
      }
      const result = await call<LanProxyOAuthView>(ENDPOINT_OAUTH_UPDATE, payload)
      if (result.ok) {
        const next = result.value as LanProxyOAuthView
        setView(next)
        const refreshed = draftFromView(next)
        // A host bundle that predates providerHint (or a partial response) does
        // not echo the field back. Keep what the operator just submitted instead
        // of silently wiping the input on a successful save.
        for (const id of PROVIDER_IDS) {
          if (next.providers[id].providerHint === undefined) {
            refreshed.channels[id].providerHint = draft.channels[id].providerHint
          }
        }
        setDraft(refreshed)
        setMessage(t('oauth.saved'))
      } else {
        setError(result.error.message)
      }
    } catch (err) {
      setError(`${t('oauth.failed')}：${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setSaving(false)
    }
  }

  /** Start a manual binding in a POPUP; this settings page never navigates. */
  const startBinding = async (id: LanProxyOAuthProviderId): Promise<void> => {
    setBusy(id)
    setError(null)
    setMessage(null)
    // Open synchronously inside the click handler so popup blockers allow it;
    // `about:blank` lets us detach the opener BEFORE the IdP ever loads.
    let popup: Window | null = null
    try {
      popup = window.open('about:blank', 'dsh-proxy-oauth-bind', 'popup,width=520,height=700')
    } catch {
      popup = null
    }
    if (popup === null) {
      setError(t('oauth.popupBlocked'))
      setBusy(null)
      return
    }
    try { popup.opener = null } catch { /* already detached */ }
    try {
      const result = await call<{ startUrl: string }>(ENDPOINT_OAUTH_BINDING_START, { provider: id })
      if (result.ok) {
        popup.location.href = (result.value as { startUrl: string }).startUrl
        setPending(id)
        const timeout = window.setTimeout(() => {
          clearPending(true)
          setError(t('oauth.authTimeout'))
        }, OAUTH_POPUP_TIMEOUT_MS)
        pendingRef.current = { popup, timeout }
        startBindingPolling((view?.bindings ?? []).map(binding => binding.id))
      } else {
        setError(result.error.message)
        try { popup.close() } catch { /* ignore */ }
      }
    } catch (err) {
      setError(`${t('oauth.bindFailed')}：${err instanceof Error ? err.message : String(err)}`)
      try { popup.close() } catch { /* ignore */ }
    } finally {
      setBusy(null)
    }
  }

  /** Remove one binding; the returned view refreshes both panels. */
  const removeBinding = async (id: string): Promise<void> => {
    setBusy(id)
    setError(null)
    setMessage(null)
    try {
      const result = await call<LanProxyOAuthView>(ENDPOINT_OAUTH_BINDING_REMOVE, { id })
      if (result.ok) {
        const next = result.value as LanProxyOAuthView
        setView(next)
        setDraft(draftFromView(next))
        setMessage(t('oauth.saved'))
      } else {
        setError(`${t('oauth.bindRemoveFailed')}：${result.error.message}`)
      }
    } catch (err) {
      setError(`${t('oauth.bindRemoveFailed')}：${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setConfirmUnbind(null)
      setBusy(null)
    }
  }

  if (view === null || draft === null) {
    return (
      <div className="dsh_lanproxy_card">
        <div className="dsh_lanproxy_cardTitle">{t('oauth.title')}</div>
        <p className="dsh_lanproxy_hint">{error ?? t('oauth.loading')}</p>
        <button type="button" className="dsh_lanproxy_button" onClick={() => { void load() }}>
          {t('oauth.refresh')}
        </button>
      </div>
    )
  }

  const readyChannels = PROVIDER_IDS.filter(id => view.providers[id].displayOnLogin)

  return (
    <div className="dsh_lanproxy_card">
      <div className="dsh_lanproxy_cardHeader">
        <div className="dsh_lanproxy_cardTitle">{t('oauth.title')}</div>
        <button type="button" className="dsh_lanproxy_button" onClick={() => { void load() }}>
          {t('oauth.refresh')}
        </button>
      </div>
      <p className="dsh_lanproxy_hint">{t('oauth.subtitle')}</p>
      {view.cleartextAuth === 'basic'
        ? <p className="dsh_lanproxy_warn" role="alert">{t('oauth.basicHint')}</p>
        : null}
      {!view.hasAnyAuth
        ? <p className="dsh_lanproxy_warn" role="alert">{t('oauth.noAuthHint')}</p>
        : null}

      <form className="dsh_lanproxy_card dsh_lanproxy_form" onSubmit={(event) => { void submit(event) }}>
        <label className="dsh_lanproxy_checkboxLabel">
          <input
            type="checkbox"
            checked={draft.enabled}
            onChange={(event) => { setDraft(previous => previous === null ? previous : { ...previous, enabled: event.target.checked }) }}
          />
          {t('oauth.enable')}
        </label>

        <div className="dsh_lanproxy_field">
          <label className="dsh_lanproxy_fieldLabel" htmlFor="oauth-auth-center">{t('oauth.authCenter')}</label>
          <input
            id="oauth-auth-center"
            className="dsh_lanproxy_input"
            type="url"
            placeholder="https://sso.example.com"
            value={draft.authCenterBaseUrl}
            onChange={(event) => { setDraft(previous => previous === null ? previous : { ...previous, authCenterBaseUrl: event.target.value }) }}
          />
          <p className="dsh_lanproxy_hint">{t('oauth.authCenterHint')}</p>
        </div>

        <div className="dsh_lanproxy_field">
          <label className="dsh_lanproxy_fieldLabel" htmlFor="oauth-public-origin">{t('oauth.publicOrigin')}</label>
          <input
            id="oauth-public-origin"
            className="dsh_lanproxy_input"
            type="url"
            placeholder="https://dsh.example.com"
            value={draft.publicOrigin}
            onChange={(event) => { setDraft(previous => previous === null ? previous : { ...previous, publicOrigin: event.target.value }) }}
          />
          <p className="dsh_lanproxy_hint">{t('oauth.publicOriginHint')}</p>
        </div>

        {PROVIDER_IDS.map(id => {
          const current = view.providers[id]
          const channel = draft.channels[id]
          const advanced = expanded[id] === true
          return (
            <div className="dsh_lanproxy_oauthChannel" key={id}>
              <div className="dsh_lanproxy_oauthHeader">
                <div className="dsh_lanproxy_oauthBrand"><OAuthIcon id={id} /> {current.label}</div>
                <label className="dsh_lanproxy_checkboxLabel">
                  <input
                    type="checkbox"
                    checked={channel.enabled}
                    onChange={(event) => { patchChannel(id, { enabled: event.target.checked }) }}
                  />
                  {t('oauth.providerEnable')}
                </label>
              </div>

              <div className="dsh_lanproxy_field">
                <label className="dsh_lanproxy_fieldLabel" htmlFor={`oauth-client-${id}`}>{t('oauth.clientId')}</label>
                <input
                  id={`oauth-client-${id}`}
                  className="dsh_lanproxy_input"
                  type="text"
                  autoComplete="off"
                  value={channel.clientId}
                  onChange={(event) => { patchChannel(id, { clientId: event.target.value }) }}
                />
              </div>

              <div className="dsh_lanproxy_field">
                <label className="dsh_lanproxy_fieldLabel" htmlFor={`oauth-secret-${id}`}>{t('oauth.clientSecret')}</label>
                <input
                  id={`oauth-secret-${id}`}
                  className="dsh_lanproxy_input"
                  type="password"
                  autoComplete="new-password"
                  value={channel.clientSecret}
                  onChange={(event) => { patchChannel(id, { clientSecret: event.target.value }) }}
                />
                <p className="dsh_lanproxy_hint">{t('oauth.clientSecretHint')}</p>
              </div>

              <div className="dsh_lanproxy_field">
                <label className="dsh_lanproxy_fieldLabel" htmlFor={`oauth-scopes-${id}`}>{t('oauth.scopes')}</label>
                <input
                  id={`oauth-scopes-${id}`}
                  className="dsh_lanproxy_input"
                  type="text"
                  value={channel.scopes}
                  onChange={(event) => { patchChannel(id, { scopes: event.target.value }) }}
                />
              </div>

              <div className="dsh_lanproxy_field">
                <label className="dsh_lanproxy_fieldLabel" htmlFor={`oauth-base-${id}`}>{t('oauth.baseUrl')}</label>
                <input
                  id={`oauth-base-${id}`}
                  className="dsh_lanproxy_input"
                  type="url"
                  placeholder={DEFAULT_AUTHORIZE_PLACEHOLDERS[id]}
                  value={channel.baseUrl}
                  onChange={(event) => { patchChannel(id, { baseUrl: event.target.value }) }}
                />
                <p className="dsh_lanproxy_hint">{t('oauth.baseUrlHint')}</p>
              </div>

              <div className="dsh_lanproxy_field">
                <label className="dsh_lanproxy_fieldLabel" htmlFor={`oauth-hint-${id}`}>{t('oauth.providerHint')}</label>
                <input
                  id={`oauth-hint-${id}`}
                  className="dsh_lanproxy_input"
                  type="text"
                  autoComplete="off"
                  placeholder="github"
                  value={channel.providerHint}
                  onChange={(event) => { patchChannel(id, { providerHint: event.target.value }) }}
                />
                <p className="dsh_lanproxy_hint">{t('oauth.providerHintHint')}</p>
              </div>

              <button
                type="button"
                className="dsh_lanproxy_button"
                onClick={() => { setExpanded(previous => ({ ...previous, [id]: !advanced })) }}
              >
                {advanced ? t('oauth.advancedHide') : t('oauth.advanced')}
              </button>

              {advanced ? (
                <>
                  <div className="dsh_lanproxy_field">
                    <label className="dsh_lanproxy_fieldLabel" htmlFor={`oauth-label-${id}`}>{t('oauth.label')}</label>
                    <input
                      id={`oauth-label-${id}`}
                      className="dsh_lanproxy_input"
                      type="text"
                      value={channel.label}
                      onChange={(event) => { patchChannel(id, { label: event.target.value }) }}
                    />
                  </div>
                  <div className="dsh_lanproxy_field">
                    <label className="dsh_lanproxy_fieldLabel" htmlFor={`oauth-authorize-${id}`}>{t('oauth.endpointAuthorization')}</label>
                    <input
                      id={`oauth-authorize-${id}`}
                      className="dsh_lanproxy_input"
                      type="url"
                      value={channel.authorizationEndpoint}
                      onChange={(event) => { patchChannel(id, { authorizationEndpoint: event.target.value }) }}
                    />
                  </div>
                  <div className="dsh_lanproxy_field">
                    <label className="dsh_lanproxy_fieldLabel" htmlFor={`oauth-token-${id}`}>{t('oauth.endpointToken')}</label>
                    <input
                      id={`oauth-token-${id}`}
                      className="dsh_lanproxy_input"
                      type="url"
                      value={channel.tokenEndpoint}
                      onChange={(event) => { patchChannel(id, { tokenEndpoint: event.target.value }) }}
                    />
                  </div>
                  <div className="dsh_lanproxy_field">
                    <label className="dsh_lanproxy_fieldLabel" htmlFor={`oauth-userinfo-${id}`}>{t('oauth.endpointUserInfo')}</label>
                    <input
                      id={`oauth-userinfo-${id}`}
                      className="dsh_lanproxy_input"
                      type="url"
                      value={channel.userInfoEndpoint}
                      onChange={(event) => { patchChannel(id, { userInfoEndpoint: event.target.value }) }}
                    />
                  </div>
                </>
              ) : null}

              <p className="dsh_lanproxy_mono">
                {t('oauth.effectiveSource')}: {sourceLabel(current.effectiveSource, t)} · {t('oauth.displayOnLogin')}: {current.displayOnLogin ? '✓' : '—'}
              </p>
              <p className="dsh_lanproxy_mono">{current.endpoints.authorizationEndpoint || '—'}</p>
              {current.providerHint !== undefined && current.providerHint.trim() !== ''
                ? <p className="dsh_lanproxy_mono">provider_hint={current.providerHint.trim()}</p>
                : null}
              <p className="dsh_lanproxy_mono">{t('oauth.redirectUri')}: {current.redirectUri}</p>
              {current.issues.map((issue, index) => (
                <p className="dsh_lanproxy_error" key={index} role="alert">{t('oauth.issuePrefix')}: {issue}</p>
              ))}
            </div>
          )
        })}

        <div className="dsh_lanproxy_actions">
          <button type="submit" className="dsh_lanproxy_button" disabled={saving}>
            {saving ? t('oauth.saving') : t('oauth.save')}
          </button>
          {message !== null ? <p className="dsh_lanproxy_message">{message}</p> : null}
          {error !== null ? <p className="dsh_lanproxy_error" role="alert">{error}</p> : null}
        </div>
      </form>

      <div className="dsh_lanproxy_oauthChannel">
        <div className="dsh_lanproxy_cardTitle">{t('oauth.bindings')}</div>
        <p className="dsh_lanproxy_hint">{t('oauth.bindingsHint')}</p>
        <p className="dsh_lanproxy_hint">{t('oauth.bindStartHint')}</p>
        <p className="dsh_lanproxy_hint">{t('oauth.popupHint')}</p>
        {view.bindings.length === 0
          ? <p className="dsh_lanproxy_hint">{t('oauth.noBindings')}</p>
          : view.bindings.map(binding => (
            <div key={binding.id}>
              <div className="dsh_lanproxy_bindingRow">
                <div style={{ minWidth: 0 }}>
                  <div className="dsh_lanproxy_oauthBrand">
                    <OAuthIcon id={binding.provider} />
                    {view.providers[binding.provider].label}
                    <span className="dsh_lanproxy_tag">{binding.boundVia}</span>
                  </div>
                  <p className="dsh_lanproxy_mono">{binding.displayName ?? binding.email ?? binding.subject}</p>
                  <p className="dsh_lanproxy_mono">
                    {t('oauth.subject')}: {binding.subject} · {t('oauth.localSubject')}: {binding.localSubject} · {t('oauth.boundAt')}: {new Date(binding.boundAt).toLocaleString()}
                  </p>
                </div>
                {confirmUnbind === binding.id
                  ? <div className="dsh_lanproxy_controls">
                      <button
                        type="button"
                        className="dsh_lanproxy_button dsh_lanproxy_buttonStop"
                        disabled={busy !== null}
                        onClick={() => {
                          const id = binding.id
                          setConfirmUnbind(null)
                          void removeBinding(id)
                        }}
                      >
                        {t('oauth.unbindConfirmAction')}
                      </button>
                      <button
                        type="button"
                        className="dsh_lanproxy_button"
                        disabled={busy !== null}
                        onClick={() => { setConfirmUnbind(null) }}
                      >
                        {t('oauth.unbindCancel')}
                      </button>
                    </div>
                  : <button
                      type="button"
                      className="dsh_lanproxy_button dsh_lanproxy_buttonStop"
                      disabled={busy !== null}
                      onClick={() => { setConfirmUnbind(binding.id) }}
                    >
                      {t('oauth.unbind')}
                    </button>}
              </div>
              {confirmUnbind === binding.id
                ? <p className="dsh_lanproxy_warn" role="alert">
                    {t('oauth.unbindConfirm', { name: binding.displayName ?? binding.email ?? binding.subject })}
                  </p>
                : null}
            </div>
          ))}
        {pending !== null
          ? <div className="dsh_lanproxy_controls">
              <p className="dsh_lanproxy_hint" role="status">{t('oauth.pending')}</p>
              <button
                type="button"
                className="dsh_lanproxy_button dsh_lanproxy_buttonStop"
                onClick={cancelPending}
              >
                {t('oauth.cancelAuth')}
              </button>
            </div>
          : null}
        <div className="dsh_lanproxy_controls">
          {readyChannels.length === 0
            ? <p className="dsh_lanproxy_hint">{t('oauth.notReady')}</p>
            : readyChannels.map(id => (
              <button
                key={id}
                type="button"
                className="dsh_lanproxy_button"
                disabled={busy !== null || pending !== null}
                onClick={() => { void startBinding(id) }}
              >
                {t('oauth.bind')} {view.providers[id].label}
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
