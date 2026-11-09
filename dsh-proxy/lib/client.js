window.__ModuleLoader__.load({ id: '@stack-brain/dsh-proxy', factory: (require) => { var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/SettingsSection.tsx
var import_react3 = require("react");

// src/contract.ts
var LAN_PROXY_PATH = "/api/dsh-proxy";
var ENDPOINT_STATUS = "status";
var ENDPOINT_UPDATE = "update";
var ENDPOINT_START = "start";
var ENDPOINT_STOP = "stop";
var ENDPOINT_AUTH = "auth";
var ENDPOINT_AUDIT = "audit";
var ENDPOINT_AUTH_REVOKE = "auth-revoke";
var ENDPOINT_SECURITY = "security";
var ENDPOINT_OAUTH_STATUS = "oauth-status";
var ENDPOINT_OAUTH_UPDATE = "oauth-update";
var ENDPOINT_OAUTH_BINDING_START = "oauth-binding-start";
var ENDPOINT_OAUTH_BINDING_REMOVE = "oauth-binding-remove";
var OAUTH_CHANNEL = "dsh-proxy-oauth";
var OAUTH_MESSAGE_SOURCE = "dsh-proxy-oauth";
var OAUTH_POPUP_TIMEOUT_MS = 3 * 60 * 1e3;

// src/client/OAuthCard.tsx
var import_react = require("react");

// src/client/OAuthIcons.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var COLORS = {
  github: "#6e7681",
  google: "#4285f4",
  feishu: "#3370ff",
  casdoor: "#7c6bf3"
};
var LETTERS = {
  github: "G",
  google: "G",
  feishu: "\u98DE",
  casdoor: "C"
};
function OAuthIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { viewBox: "0 0 24 24", width: "20", height: "20", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "11", fill: COLORS[props.id] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "text",
      {
        x: "12",
        y: "16",
        textAnchor: "middle",
        fontSize: "12",
        fontFamily: "sans-serif",
        fontWeight: "600",
        fill: "#ffffff",
        children: LETTERS[props.id]
      }
    )
  ] });
}

// src/client/OAuthCard.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var PROVIDER_IDS = ["github", "google", "feishu", "casdoor"];
var DEFAULT_AUTHORIZE_PLACEHOLDERS = {
  github: "https://github.com/login/oauth/authorize",
  google: "https://accounts.google.com/o/oauth2/v2/auth",
  feishu: "https://accounts.feishu.cn/open-apis/authen/v1/authorize",
  casdoor: "https://door.your-domain.com"
};
function draftFromView(view) {
  const channels = {};
  for (const id of PROVIDER_IDS) {
    const provider = view.providers[id];
    const overrides = provider.endpointOverrides ?? {};
    channels[id] = {
      enabled: provider.enabled,
      clientId: provider.clientId,
      clientSecret: provider.clientSecret,
      scopes: provider.scopes,
      baseUrl: provider.baseUrl ?? "",
      label: provider.label,
      providerHint: provider.providerHint ?? "",
      authorizationEndpoint: overrides.authorizationEndpoint ?? "",
      tokenEndpoint: overrides.tokenEndpoint ?? "",
      userInfoEndpoint: overrides.userInfoEndpoint ?? ""
    };
  }
  return {
    enabled: view.enabled,
    authCenterBaseUrl: view.authCenter.baseUrl,
    publicOrigin: view.publicOrigin,
    channels
  };
}
function sourceLabel(source, t) {
  if (source === "auth-center") return t("oauth.sourceCenter");
  if (source === "provider-override") return t("oauth.sourceOverride");
  return t("oauth.sourceOfficial");
}
function OAuthCard({ call, t }) {
  const [view, setView] = (0, import_react.useState)(null);
  const [draft, setDraft] = (0, import_react.useState)(null);
  const [expanded, setExpanded] = (0, import_react.useState)({});
  const [saving, setSaving] = (0, import_react.useState)(false);
  const [busy, setBusy] = (0, import_react.useState)(null);
  const [pending, setPending] = (0, import_react.useState)(null);
  const [confirmUnbind, setConfirmUnbind] = (0, import_react.useState)(null);
  const [error, setError] = (0, import_react.useState)(null);
  const [message, setMessage] = (0, import_react.useState)(null);
  const pollRef = (0, import_react.useRef)(null);
  const pendingRef = (0, import_react.useRef)(null);
  const load = (0, import_react.useCallback)(async () => {
    try {
      const result = await call(ENDPOINT_OAUTH_STATUS, {});
      if (result.ok) {
        const next = result.value;
        setView(next);
        setDraft(draftFromView(next));
        setError(null);
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [call]);
  (0, import_react.useEffect)(() => {
    void load();
  }, [load]);
  const stopPolling = (0, import_react.useCallback)(() => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);
  const clearPending = (0, import_react.useCallback)((closePopup) => {
    const state = pendingRef.current;
    pendingRef.current = null;
    if (state !== null) window.clearTimeout(state.timeout);
    if (closePopup) {
      try {
        state?.popup?.close();
      } catch {
      }
    }
    stopPolling();
    setPending(null);
  }, [stopPolling]);
  const cancelPending = () => {
    clearPending(true);
    setError(t("oauth.authCancelled"));
  };
  const receiveOAuthMessage = (0, import_react.useCallback)((data) => {
    if (pendingRef.current === null) return;
    if (typeof data !== "object" || data === null) return;
    const payload = data;
    if (payload.source !== OAUTH_MESSAGE_SOURCE || payload.intent !== "bind") return;
    clearPending(false);
    if (payload.status === "bound") {
      void load();
      setMessage(t("oauth.bound"));
    } else if (payload.message !== void 0) {
      setError(payload.message);
    }
  }, [clearPending, load, t]);
  (0, import_react.useEffect)(() => {
    let channel = null;
    try {
      channel = new BroadcastChannel(OAUTH_CHANNEL);
      channel.onmessage = (event) => {
        receiveOAuthMessage(event.data);
      };
    } catch {
    }
    const allowedOrigins = /* @__PURE__ */ new Set([window.location.origin]);
    if (view?.publicOrigin !== void 0 && view.publicOrigin !== "") {
      try {
        allowedOrigins.add(new URL(view.publicOrigin).origin);
      } catch {
      }
    }
    const onMessage = (event) => {
      if (!allowedOrigins.has(event.origin)) return;
      receiveOAuthMessage(event.data);
    };
    window.addEventListener("message", onMessage);
    return () => {
      channel?.close();
      window.removeEventListener("message", onMessage);
    };
  }, [receiveOAuthMessage, view?.publicOrigin]);
  (0, import_react.useEffect)(() => () => {
    const state = pendingRef.current;
    if (state !== null) window.clearTimeout(state.timeout);
    try {
      state?.popup?.close();
    } catch {
    }
    pendingRef.current = null;
    stopPolling();
  }, [stopPolling]);
  const startBindingPolling = (baseline) => {
    stopPolling();
    const known = new Set(baseline);
    const deadline = Date.now() + OAUTH_POPUP_TIMEOUT_MS;
    pollRef.current = window.setInterval(() => {
      if (Date.now() >= deadline) {
        stopPolling();
        return;
      }
      void (async () => {
        const result = await call(ENDPOINT_OAUTH_STATUS, {});
        if (!result.ok) return;
        const next = result.value;
        if (next.bindings.some((binding) => !known.has(binding.id))) {
          clearPending(false);
          setView(next);
          setDraft(draftFromView(next));
          setMessage(t("oauth.bound"));
        }
      })();
    }, 1500);
  };
  const patchChannel = (id, patch) => {
    setDraft((previous) => previous === null ? previous : {
      ...previous,
      channels: {
        ...previous.channels,
        [id]: { ...previous.channels[id], ...patch }
      }
    });
  };
  const submit = async (event) => {
    event.preventDefault();
    if (draft === null || view === null) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const providers = {};
      for (const id of PROVIDER_IDS) {
        const channel = draft.channels[id];
        const existing = view.providers[id].endpointOverrides ?? {};
        const endpoints = {
          ...existing,
          authorizationEndpoint: channel.authorizationEndpoint.trim(),
          tokenEndpoint: channel.tokenEndpoint.trim(),
          userInfoEndpoint: channel.userInfoEndpoint.trim()
        };
        providers[id] = {
          enabled: channel.enabled,
          clientId: channel.clientId.trim(),
          clientSecret: channel.clientSecret,
          scopes: channel.scopes.trim().split(/\s+/).filter((value) => value !== ""),
          baseUrl: channel.baseUrl.trim(),
          label: channel.label.trim(),
          providerHint: channel.providerHint.trim(),
          endpoints
        };
      }
      const payload = {
        enabled: draft.enabled,
        authCenter: { baseUrl: draft.authCenterBaseUrl.trim() },
        publicOrigin: draft.publicOrigin.trim(),
        providers
      };
      const result = await call(ENDPOINT_OAUTH_UPDATE, payload);
      if (result.ok) {
        const next = result.value;
        setView(next);
        const refreshed = draftFromView(next);
        for (const id of PROVIDER_IDS) {
          if (next.providers[id].providerHint === void 0) {
            refreshed.channels[id].providerHint = draft.channels[id].providerHint;
          }
        }
        setDraft(refreshed);
        setMessage(t("oauth.saved"));
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError(`${t("oauth.failed")}\uFF1A${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSaving(false);
    }
  };
  const startBinding = async (id) => {
    setBusy(id);
    setError(null);
    setMessage(null);
    let popup = null;
    try {
      popup = window.open("about:blank", "dsh-proxy-oauth-bind", "popup,width=520,height=700");
    } catch {
      popup = null;
    }
    if (popup === null) {
      setError(t("oauth.popupBlocked"));
      setBusy(null);
      return;
    }
    try {
      popup.opener = null;
    } catch {
    }
    try {
      const result = await call(ENDPOINT_OAUTH_BINDING_START, { provider: id });
      if (result.ok) {
        popup.location.href = result.value.startUrl;
        setPending(id);
        const timeout = window.setTimeout(() => {
          clearPending(true);
          setError(t("oauth.authTimeout"));
        }, OAUTH_POPUP_TIMEOUT_MS);
        pendingRef.current = { popup, timeout };
        startBindingPolling((view?.bindings ?? []).map((binding) => binding.id));
      } else {
        setError(result.error.message);
        try {
          popup.close();
        } catch {
        }
      }
    } catch (err) {
      setError(`${t("oauth.bindFailed")}\uFF1A${err instanceof Error ? err.message : String(err)}`);
      try {
        popup.close();
      } catch {
      }
    } finally {
      setBusy(null);
    }
  };
  const removeBinding = async (id) => {
    setBusy(id);
    setError(null);
    setMessage(null);
    try {
      const result = await call(ENDPOINT_OAUTH_BINDING_REMOVE, { id });
      if (result.ok) {
        const next = result.value;
        setView(next);
        setDraft(draftFromView(next));
        setMessage(t("oauth.saved"));
      } else {
        setError(`${t("oauth.bindRemoveFailed")}\uFF1A${result.error.message}`);
      }
    } catch (err) {
      setError(`${t("oauth.bindRemoveFailed")}\uFF1A${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setConfirmUnbind(null);
      setBusy(null);
    }
  };
  if (view === null || draft === null) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dsh_lanproxy_cardTitle", children: t("oauth.title") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_hint", children: error ?? t("oauth.loading") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "dsh_lanproxy_button", onClick: () => {
        void load();
      }, children: t("oauth.refresh") })
    ] });
  }
  const readyChannels = PROVIDER_IDS.filter((id) => view.providers[id].displayOnLogin);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_cardHeader", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dsh_lanproxy_cardTitle", children: t("oauth.title") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "dsh_lanproxy_button", onClick: () => {
        void load();
      }, children: t("oauth.refresh") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_hint", children: t("oauth.subtitle") }),
    view.cleartextAuth === "basic" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_warn", role: "alert", children: t("oauth.basicHint") }) : null,
    !view.hasAnyAuth ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_warn", role: "alert", children: t("oauth.noAuthHint") }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("form", { className: "dsh_lanproxy_card dsh_lanproxy_form", onSubmit: (event) => {
      void submit(event);
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "dsh_lanproxy_checkboxLabel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "input",
          {
            type: "checkbox",
            checked: draft.enabled,
            onChange: (event) => {
              setDraft((previous) => previous === null ? previous : { ...previous, enabled: event.target.checked });
            }
          }
        ),
        t("oauth.enable")
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: "dsh_lanproxy_fieldLabel", htmlFor: "oauth-auth-center", children: t("oauth.authCenter") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "input",
          {
            id: "oauth-auth-center",
            className: "dsh_lanproxy_input",
            type: "url",
            placeholder: "https://sso.example.com",
            value: draft.authCenterBaseUrl,
            onChange: (event) => {
              setDraft((previous) => previous === null ? previous : { ...previous, authCenterBaseUrl: event.target.value });
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_hint", children: t("oauth.authCenterHint") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: "dsh_lanproxy_fieldLabel", htmlFor: "oauth-public-origin", children: t("oauth.publicOrigin") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "input",
          {
            id: "oauth-public-origin",
            className: "dsh_lanproxy_input",
            type: "url",
            placeholder: "https://dsh.example.com",
            value: draft.publicOrigin,
            onChange: (event) => {
              setDraft((previous) => previous === null ? previous : { ...previous, publicOrigin: event.target.value });
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_hint", children: t("oauth.publicOriginHint") })
      ] }),
      PROVIDER_IDS.map((id) => {
        const current = view.providers[id];
        const channel = draft.channels[id];
        const advanced = expanded[id] === true;
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_oauthChannel", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_oauthHeader", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_oauthBrand", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(OAuthIcon, { id }),
              " ",
              current.label
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "dsh_lanproxy_checkboxLabel", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "input",
                {
                  type: "checkbox",
                  checked: channel.enabled,
                  onChange: (event) => {
                    patchChannel(id, { enabled: event.target.checked });
                  }
                }
              ),
              t("oauth.providerEnable")
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: "dsh_lanproxy_fieldLabel", htmlFor: `oauth-client-${id}`, children: t("oauth.clientId") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "input",
              {
                id: `oauth-client-${id}`,
                className: "dsh_lanproxy_input",
                type: "text",
                autoComplete: "off",
                value: channel.clientId,
                onChange: (event) => {
                  patchChannel(id, { clientId: event.target.value });
                }
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: "dsh_lanproxy_fieldLabel", htmlFor: `oauth-secret-${id}`, children: t("oauth.clientSecret") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "input",
              {
                id: `oauth-secret-${id}`,
                className: "dsh_lanproxy_input",
                type: "password",
                autoComplete: "new-password",
                value: channel.clientSecret,
                onChange: (event) => {
                  patchChannel(id, { clientSecret: event.target.value });
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_hint", children: t("oauth.clientSecretHint") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: "dsh_lanproxy_fieldLabel", htmlFor: `oauth-scopes-${id}`, children: t("oauth.scopes") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "input",
              {
                id: `oauth-scopes-${id}`,
                className: "dsh_lanproxy_input",
                type: "text",
                value: channel.scopes,
                onChange: (event) => {
                  patchChannel(id, { scopes: event.target.value });
                }
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: "dsh_lanproxy_fieldLabel", htmlFor: `oauth-base-${id}`, children: t("oauth.baseUrl") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "input",
              {
                id: `oauth-base-${id}`,
                className: "dsh_lanproxy_input",
                type: "url",
                placeholder: DEFAULT_AUTHORIZE_PLACEHOLDERS[id],
                value: channel.baseUrl,
                onChange: (event) => {
                  patchChannel(id, { baseUrl: event.target.value });
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_hint", children: t("oauth.baseUrlHint") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: "dsh_lanproxy_fieldLabel", htmlFor: `oauth-hint-${id}`, children: t("oauth.providerHint") }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "input",
              {
                id: `oauth-hint-${id}`,
                className: "dsh_lanproxy_input",
                type: "text",
                autoComplete: "off",
                placeholder: "github",
                value: channel.providerHint,
                onChange: (event) => {
                  patchChannel(id, { providerHint: event.target.value });
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_hint", children: t("oauth.providerHintHint") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              type: "button",
              className: "dsh_lanproxy_button",
              onClick: () => {
                setExpanded((previous) => ({ ...previous, [id]: !advanced }));
              },
              children: advanced ? t("oauth.advancedHide") : t("oauth.advanced")
            }
          ),
          advanced ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_field", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: "dsh_lanproxy_fieldLabel", htmlFor: `oauth-label-${id}`, children: t("oauth.label") }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "input",
                {
                  id: `oauth-label-${id}`,
                  className: "dsh_lanproxy_input",
                  type: "text",
                  value: channel.label,
                  onChange: (event) => {
                    patchChannel(id, { label: event.target.value });
                  }
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_field", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: "dsh_lanproxy_fieldLabel", htmlFor: `oauth-authorize-${id}`, children: t("oauth.endpointAuthorization") }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "input",
                {
                  id: `oauth-authorize-${id}`,
                  className: "dsh_lanproxy_input",
                  type: "url",
                  value: channel.authorizationEndpoint,
                  onChange: (event) => {
                    patchChannel(id, { authorizationEndpoint: event.target.value });
                  }
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_field", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: "dsh_lanproxy_fieldLabel", htmlFor: `oauth-token-${id}`, children: t("oauth.endpointToken") }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "input",
                {
                  id: `oauth-token-${id}`,
                  className: "dsh_lanproxy_input",
                  type: "url",
                  value: channel.tokenEndpoint,
                  onChange: (event) => {
                    patchChannel(id, { tokenEndpoint: event.target.value });
                  }
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_field", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: "dsh_lanproxy_fieldLabel", htmlFor: `oauth-userinfo-${id}`, children: t("oauth.endpointUserInfo") }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "input",
                {
                  id: `oauth-userinfo-${id}`,
                  className: "dsh_lanproxy_input",
                  type: "url",
                  value: channel.userInfoEndpoint,
                  onChange: (event) => {
                    patchChannel(id, { userInfoEndpoint: event.target.value });
                  }
                }
              )
            ] })
          ] }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "dsh_lanproxy_mono", children: [
            t("oauth.effectiveSource"),
            ": ",
            sourceLabel(current.effectiveSource, t),
            " \xB7 ",
            t("oauth.displayOnLogin"),
            ": ",
            current.displayOnLogin ? "\u2713" : "\u2014"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_mono", children: current.endpoints.authorizationEndpoint || "\u2014" }),
          current.providerHint !== void 0 && current.providerHint.trim() !== "" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "dsh_lanproxy_mono", children: [
            "provider_hint=",
            current.providerHint.trim()
          ] }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "dsh_lanproxy_mono", children: [
            t("oauth.redirectUri"),
            ": ",
            current.redirectUri
          ] }),
          current.issues.map((issue, index) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "dsh_lanproxy_error", role: "alert", children: [
            t("oauth.issuePrefix"),
            ": ",
            issue
          ] }, index))
        ] }, id);
      }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "submit", className: "dsh_lanproxy_button", disabled: saving, children: saving ? t("oauth.saving") : t("oauth.save") }),
        message !== null ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_message", children: message }) : null,
        error !== null ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_error", role: "alert", children: error }) : null
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_oauthChannel", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dsh_lanproxy_cardTitle", children: t("oauth.bindings") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_hint", children: t("oauth.bindingsHint") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_hint", children: t("oauth.bindStartHint") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_hint", children: t("oauth.popupHint") }),
      view.bindings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_hint", children: t("oauth.noBindings") }) : view.bindings.map((binding) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_bindingRow", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_oauthBrand", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(OAuthIcon, { id: binding.provider }),
              view.providers[binding.provider].label,
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_lanproxy_tag", children: binding.boundVia })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_mono", children: binding.displayName ?? binding.email ?? binding.subject }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "dsh_lanproxy_mono", children: [
              t("oauth.subject"),
              ": ",
              binding.subject,
              " \xB7 ",
              t("oauth.localSubject"),
              ": ",
              binding.localSubject,
              " \xB7 ",
              t("oauth.boundAt"),
              ": ",
              new Date(binding.boundAt).toLocaleString()
            ] })
          ] }),
          confirmUnbind === binding.id ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_controls", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "button",
              {
                type: "button",
                className: "dsh_lanproxy_button dsh_lanproxy_buttonStop",
                disabled: busy !== null,
                onClick: () => {
                  const id = binding.id;
                  setConfirmUnbind(null);
                  void removeBinding(id);
                },
                children: t("oauth.unbindConfirmAction")
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "button",
              {
                type: "button",
                className: "dsh_lanproxy_button",
                disabled: busy !== null,
                onClick: () => {
                  setConfirmUnbind(null);
                },
                children: t("oauth.unbindCancel")
              }
            )
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              type: "button",
              className: "dsh_lanproxy_button dsh_lanproxy_buttonStop",
              disabled: busy !== null,
              onClick: () => {
                setConfirmUnbind(binding.id);
              },
              children: t("oauth.unbind")
            }
          )
        ] }),
        confirmUnbind === binding.id ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_warn", role: "alert", children: t("oauth.unbindConfirm", { name: binding.displayName ?? binding.email ?? binding.subject }) }) : null
      ] }, binding.id)),
      pending !== null ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_lanproxy_controls", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_hint", role: "status", children: t("oauth.pending") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            type: "button",
            className: "dsh_lanproxy_button dsh_lanproxy_buttonStop",
            onClick: cancelPending,
            children: t("oauth.cancelAuth")
          }
        )
      ] }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dsh_lanproxy_controls", children: readyChannels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh_lanproxy_hint", children: t("oauth.notReady") }) : readyChannels.map((id) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "button",
        {
          type: "button",
          className: "dsh_lanproxy_button",
          disabled: busy !== null || pending !== null,
          onClick: () => {
            void startBinding(id);
          },
          children: [
            t("oauth.bind"),
            " ",
            view.providers[id].label
          ]
        },
        id
      )) })
    ] })
  ] });
}

// src/client/SecurityCard.tsx
var import_react2 = require("react");

// src/client/transport.ts
var TRANSPORT_FAILURE = "transport";
function carrierFailure(message, details = {}) {
  return { ok: false, error: { code: TRANSPORT_FAILURE, message, details } };
}
async function readEnvelope(response) {
  try {
    const body = await response.json();
    if (typeof body === "object" && body !== null && typeof body.ok === "boolean") {
      return body;
    }
    return null;
  } catch {
    return null;
  }
}
async function fetchAuthView(call) {
  const result = await call(ENDPOINT_AUTH, {});
  return result.ok ? result.value : null;
}
async function fetchAudit(call) {
  const result = await call(ENDPOINT_AUDIT, {});
  return result.ok ? result.value : [];
}
var callLanProxy = async (endpoint, payload) => {
  const body = { endpoint, payload: payload ?? {} };
  let response;
  try {
    response = await fetch(LAN_PROXY_PATH, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
  } catch (error) {
    return carrierFailure(error instanceof Error ? error.message : String(error));
  }
  const envelope = await readEnvelope(response);
  if (envelope !== null) return envelope;
  if (!response.ok) {
    const detail = response.statusText.length > 0 ? `${response.status} ${response.statusText}` : String(response.status);
    return carrierFailure(detail, { status: response.status });
  }
  return carrierFailure("response body is not a result envelope");
};

// src/client/SecurityCard.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function minutes(ms) {
  return Math.max(1, Math.ceil(ms / 6e4));
}
function stamp(at) {
  try {
    return new Date(at).toLocaleString();
  } catch {
    return String(at);
  }
}
function SecurityCard({ call, t }) {
  const [auth, setAuth] = (0, import_react2.useState)(null);
  const [audit, setAudit] = (0, import_react2.useState)([]);
  const [loading, setLoading] = (0, import_react2.useState)(true);
  const [error, setError] = (0, import_react2.useState)(null);
  const [message, setMessage] = (0, import_react2.useState)(null);
  const [busy, setBusy] = (0, import_react2.useState)(false);
  const load = (0, import_react2.useCallback)(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextAuth, nextAudit] = await Promise.all([fetchAuthView(call), fetchAudit(call)]);
      setAuth(nextAuth);
      setAudit(nextAudit);
      if (nextAuth === null) setError(t("sec.failed"));
    } catch (err) {
      setError(`${t("sec.failed")}\uFF1A${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }, [call, t]);
  (0, import_react2.useEffect)(() => {
    void load();
  }, [load]);
  const revoke = (0, import_react2.useCallback)(async (id) => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const result = await call(ENDPOINT_AUTH_REVOKE, { id });
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setMessage(t("sec.revoked"));
      await load();
    } catch (err) {
      setError(`${t("sec.failed")}\uFF1A${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusy(false);
    }
  }, [call, load, t]);
  const patchSecurity = (0, import_react2.useCallback)(async (patch) => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const result = await call(ENDPOINT_SECURITY, patch);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      const restartRequired = result.value?.restartRequired === true;
      setMessage(restartRequired ? `${t("sec.saved")} \xB7 ${t("sec.restartHint")}` : t("sec.saved"));
      await load();
    } catch (err) {
      setError(`${t("sec.failed")}\uFF1A${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusy(false);
    }
  }, [call, load, t]);
  if (loading && auth === null) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "dsh_lanproxy_hint", children: t("sec.loading") });
  }
  const others = auth?.sessions.filter((session) => !session.current) ?? [];
  const policy = auth?.policy;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_lanproxy_card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_lanproxy_cardHeader", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_lanproxy_cardTitle", children: t("sec.title") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_lanproxy_controls", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "button",
        {
          type: "button",
          className: "dsh_lanproxy_button",
          disabled: busy,
          onClick: () => {
            void load();
          },
          children: t("sec.refresh")
        }
      ) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "dsh_lanproxy_hint", children: t("sec.subtitle") }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(StatusRow, { label: t("sec.loginEnabled"), value: auth?.loginEnabled === true ? t("sec.loginOn") : t("sec.loginOff") }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      StatusRow,
      {
        label: t("sec.requireTls"),
        value: auth?.requireTls === true ? t("sec.requireTlsOn") : t("sec.requireTlsOff")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_lanproxy_actions", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "button",
      {
        type: "button",
        className: "dsh_lanproxy_button",
        disabled: busy || auth === null,
        onClick: () => {
          void patchSecurity({ requireTls: !(auth?.requireTls === true) });
        },
        children: auth?.requireTls === true ? t("sec.disableRequireTls") : t("sec.enableRequireTls")
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      StatusRow,
      {
        label: t("sec.cleartextAuth"),
        value: auth?.cleartextAuth === "basic" ? t("sec.cleartextBasic") : t("sec.cleartextLogin")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_lanproxy_actions", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "button",
      {
        type: "button",
        className: "dsh_lanproxy_button",
        disabled: busy || auth === null,
        onClick: () => {
          void patchSecurity({ cleartextAuth: auth?.cleartextAuth === "basic" ? "login" : "basic" });
        },
        children: auth?.cleartextAuth === "basic" ? t("sec.useCleartextLogin") : t("sec.useCleartextBasic")
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: auth?.cleartextAuth === "basic" ? "dsh_lanproxy_hint" : "dsh_lanproxy_warn", children: auth?.cleartextAuth === "basic" ? t("sec.cleartextBasicHint") : t("sec.cleartextLoginHint") }),
    policy !== void 0 && policy.maxFailures !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "dsh_lanproxy_hint", children: t("sec.policy", {
      ttl: Math.round(policy.sessionTtlMs / 864e5),
      idle: Math.round(policy.sessionIdleMs / 36e5),
      max: policy.maxFailures,
      lockout: minutes(policy.lockoutMs)
    }) }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_lanproxy_cardTitle", children: t("sec.sessions") }),
    auth !== null && auth.sessions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("table", { className: "dsh_lanproxy_table", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("th", { children: t("sec.source") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("th", { children: t("sec.createdAt") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("th", { children: t("sec.lastSeen") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("th", {})
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("tbody", { children: auth.sessions.map((session) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("td", { children: [
          session.source,
          session.current ? ` \xB7 ${t("sec.current")}` : ""
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { children: stamp(session.createdAt) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { children: stamp(session.lastSeenAt) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "button",
          {
            type: "button",
            className: "dsh_lanproxy_button dsh_lanproxy_buttonSmall",
            disabled: busy,
            onClick: () => {
              void revoke(session.id);
            },
            children: t("sec.revoke")
          }
        ) })
      ] }, session.id)) })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "dsh_lanproxy_hint", children: t("sec.noSessions") }),
    others.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_lanproxy_actions", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "button",
      {
        type: "button",
        className: "dsh_lanproxy_button dsh_lanproxy_buttonStop",
        disabled: busy,
        onClick: () => {
          void revoke("all");
        },
        children: t("sec.revokeAll")
      }
    ) }) : null,
    auth !== null && auth.lockouts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_lanproxy_cardTitle", children: t("sec.lockouts") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ul", { className: "dsh_lanproxy_list", children: auth.lockouts.map((lock) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("li", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("code", { children: lock.source }),
        " ",
        t("sec.lockoutRow", { failures: lock.failures, minutes: minutes(lock.retryAfterMs) })
      ] }, lock.source)) })
    ] }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_lanproxy_cardTitle", children: t("sec.audit", { count: audit.length }) }),
    audit.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("table", { className: "dsh_lanproxy_table", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("th", { children: t("sec.createdAt") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("th", { children: t("sec.source") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("th", { children: "event" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("tbody", { children: audit.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { children: stamp(entry.at) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { children: entry.source }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("td", { children: [
          entry.event,
          entry.detail !== void 0 ? ` \xB7 ${entry.detail}` : ""
        ] })
      ] }, `${entry.at}-${index}`)) })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "dsh_lanproxy_hint", children: t("sec.noAudit") }),
    message !== null ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "dsh_lanproxy_message", children: message }) : null,
    error !== null ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "dsh_lanproxy_error", children: error }) : null
  ] });
}
function StatusRow(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_lanproxy_row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_lanproxy_rowLabel", children: props.label }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_lanproxy_rowValue", children: props.value })
  ] });
}

// src/client/SettingsSection.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function StatusRow2(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_lanproxy_row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dsh_lanproxy_rowLabel", children: props.label }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dsh_lanproxy_rowValue", children: props.value })
  ] });
}
function PortStatus(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "dsh_lanproxy_portStatus", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: props.ok ? "dsh_lanproxy_dot dsh_lanproxy_dotOn" : "dsh_lanproxy_dot dsh_lanproxy_dotOff" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dsh_lanproxy_portValue", children: props.port }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: props.ok ? "dsh_lanproxy_statusText dsh_lanproxy_statusTextOn" : "dsh_lanproxy_statusText dsh_lanproxy_statusTextOff", children: props.ok ? props.okText : props.failText })
  ] });
}
function EyeIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("circle", { cx: "12", cy: "12", r: "3" })
  ] });
}
function EyeOffIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M9.88 9.88a3 3 0 1 0 4.24 4.24" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("line", { x1: "2", x2: "22", y1: "2", y2: "22" })
  ] });
}
function SettingsSection({ call, t }) {
  const [phase, setPhase] = (0, import_react3.useState)("loading");
  const phaseRef = (0, import_react3.useRef)("loading");
  const [status, setStatus] = (0, import_react3.useState)(null);
  const [statusError, setStatusError] = (0, import_react3.useState)(null);
  const [saving, setSaving] = (0, import_react3.useState)(false);
  const [controlling, setControlling] = (0, import_react3.useState)(false);
  const [error, setError] = (0, import_react3.useState)(null);
  const [message, setMessage] = (0, import_react3.useState)(null);
  const [controlError, setControlError] = (0, import_react3.useState)(null);
  const [controlMessage, setControlMessage] = (0, import_react3.useState)(null);
  const [showPassword, setShowPassword] = (0, import_react3.useState)(false);
  const [listenPort, setListenPort] = (0, import_react3.useState)("");
  const [username, setUsername] = (0, import_react3.useState)("");
  const [password, setPassword] = (0, import_react3.useState)("");
  const formSeededRef = (0, import_react3.useRef)(false);
  const applyPhase = (0, import_react3.useCallback)((next) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);
  const applyStatusToForm = (0, import_react3.useCallback)((next) => {
    setListenPort(String(next.listenPort));
    setUsername(next.username);
    setPassword(next.password ?? "");
  }, []);
  const loadStatus = (0, import_react3.useCallback)(async () => {
    applyPhase("loading");
    setStatusError(null);
    try {
      const result = await call(ENDPOINT_STATUS, {});
      if (result.ok) {
        const next = result.value;
        setStatus(next);
        applyPhase("ok");
        if (!formSeededRef.current) {
          applyStatusToForm(next);
          formSeededRef.current = true;
        }
      } else {
        setStatusError(result.error.message);
        applyPhase("error");
      }
    } catch (err) {
      console.error("[dsh-proxy] status call failed:", err);
      setStatusError(err instanceof Error ? err.message : String(err));
      applyPhase("error");
    }
  }, [call, applyPhase, applyStatusToForm]);
  (0, import_react3.useEffect)(() => {
    void loadStatus();
    const timer = window.setTimeout(() => {
      if (phaseRef.current === "error") void loadStatus();
    }, 2e3);
    return () => window.clearTimeout(timer);
  }, [loadStatus]);
  const runControl = (0, import_react3.useCallback)(async (action) => {
    setControlling(true);
    setControlError(null);
    setControlMessage(null);
    try {
      const result = await call(action === "start" ? ENDPOINT_START : ENDPOINT_STOP, {});
      if (result.ok) {
        const next = result.value;
        setStatus(next);
        if (action === "start" && !next.proxyListening) {
          setControlError(t("control.startHintPort"));
        } else {
          setControlMessage(action === "start" ? t("control.started") : t("control.stopped"));
        }
      } else {
        setControlError(result.error.message);
      }
    } catch (err) {
      console.error(`[dsh-proxy] ${action} RPC failed:`, err);
      setControlError(`${t("control.failed")}\uFF1A${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setControlling(false);
    }
  }, [call, t]);
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const port = Number(listenPort.trim());
      if (!Number.isInteger(port) || port < 1 || port > 65535) {
        setError(t("form.invalidPort"));
        return;
      }
      if (status !== null && port === status.upstreamPort) {
        setError(t("form.portConflict"));
        return;
      }
      const payload = {
        listenPort: port,
        username: username.trim(),
        password
      };
      const result = await call(ENDPOINT_UPDATE, payload);
      if (result.ok) {
        const value = result.value;
        setStatus(value.status);
        applyPhase("ok");
        const noticeText = {
          "saved": t("form.updatedSaved"),
          "saved-restarted": t("form.updated"),
          "saved-restart-failed": `${t("form.updatedListenFailed")}\uFF1A${value.message}`,
          "credentials-partial-saved": t("form.updatedSavedPartial"),
          "credentials-partial-restarted": t("form.updatedPartial")
        };
        setMessage(noticeText[value.notice]);
        applyStatusToForm(value.status);
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      console.error("[dsh-proxy] update RPC failed:", err);
      setError(`${t("form.failed")}\uFF1A${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSaving(false);
    }
  };
  const authBadge = status !== null && status.lanExposed ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dsh_lanproxy_badge dsh_lanproxy_badgeOff", children: t("status.lanOpen") }) : status !== null && status.authEnabled ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dsh_lanproxy_badge dsh_lanproxy_badgeOn", children: t("status.authOn") }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dsh_lanproxy_badge dsh_lanproxy_badgeOff", children: t("status.authOff") });
  const securityWarning = status !== null && status.lanExposed ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "dsh_lanproxy_warn", role: "alert", children: t("status.lanExposedHint") }) : status !== null && !status.authEnabled ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "dsh_lanproxy_hint", children: t("status.authOffHint") }) : null;
  const statusCard = phase === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "dsh_lanproxy_hint", children: t("status.loading") }) : phase === "error" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_lanproxy_statusError", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "dsh_lanproxy_error", children: t("status.unreachable") }),
    statusError !== null ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "dsh_lanproxy_hint", children: statusError }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "dsh_lanproxy_button", onClick: () => {
      void loadStatus();
    }, children: t("status.retry") })
  ] }) : status !== null ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      StatusRow2,
      {
        label: t("status.proxyPort"),
        value: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortStatus, { port: `${status.listenHost}:${status.listenPort}`, ok: status.proxyListening, okText: t("status.proxyRunning"), failText: t("status.proxyStopped") })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      StatusRow2,
      {
        label: t("status.targetPort"),
        value: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PortStatus, { port: `${status.upstreamHost}:${status.upstreamPort}`, ok: status.upstreamReachable, okText: t("status.targetReachable"), failText: t("status.targetUnreachable") })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatusRow2, { label: t("status.username"), value: status.username }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatusRow2, { label: t("status.auth"), value: authBadge }),
    securityWarning,
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "dsh_lanproxy_hint", children: status.persisted ? t("status.persistedOn") : t("status.persistedOff") })
  ] }) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "dsh_lanproxy_section", "aria-labelledby": "dsh-lanproxy-settings-title", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_lanproxy_heading", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { id: "dsh-lanproxy-settings-title", className: "dsh_lanproxy_title", children: t("nav") }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "dsh_lanproxy_subtitle", children: t("form.subtitle") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_lanproxy_card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_lanproxy_cardHeader", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dsh_lanproxy_cardTitle", children: t("status.title") }),
        phase === "ok" && status !== null ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_lanproxy_controls", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "button",
            {
              type: "button",
              className: "dsh_lanproxy_button",
              disabled: controlling || status.proxyListening,
              onClick: () => {
                void runControl("start");
              },
              children: t("control.start")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "button",
            {
              type: "button",
              className: "dsh_lanproxy_button dsh_lanproxy_buttonStop",
              disabled: controlling || !status.proxyListening,
              onClick: () => {
                void runControl("stop");
              },
              children: t("control.stop")
            }
          )
        ] }) : null
      ] }),
      statusCard,
      controlMessage !== null ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "dsh_lanproxy_message", children: controlMessage }) : null,
      controlError !== null ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "dsh_lanproxy_error", children: controlError }) : null
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("form", { className: "dsh_lanproxy_card dsh_lanproxy_form", onSubmit: (event) => {
      void submit(event);
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dsh_lanproxy_cardTitle", children: t("form.title") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_lanproxy_field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { className: "dsh_lanproxy_fieldLabel", htmlFor: "dsh-lanproxy-listen-port", children: t("form.listenPort") }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "input",
          {
            id: "dsh-lanproxy-listen-port",
            className: "dsh_lanproxy_input",
            type: "number",
            min: 1,
            max: 65535,
            inputMode: "numeric",
            placeholder: t("form.listenPortHint"),
            value: listenPort,
            onChange: (event) => {
              setListenPort(event.target.value);
            }
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_lanproxy_field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { className: "dsh_lanproxy_fieldLabel", htmlFor: "dsh-lanproxy-username", children: t("form.username") }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "input",
          {
            id: "dsh-lanproxy-username",
            className: "dsh_lanproxy_input",
            type: "text",
            autoComplete: "username",
            placeholder: t("form.usernameHint"),
            value: username,
            onChange: (event) => {
              setUsername(event.target.value);
            }
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_lanproxy_field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { className: "dsh_lanproxy_fieldLabel", htmlFor: "dsh-lanproxy-password", children: t("form.password") }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_lanproxy_passwordWrap", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "input",
            {
              id: "dsh-lanproxy-password",
              className: "dsh_lanproxy_input dsh_lanproxy_passwordInput",
              type: showPassword ? "text" : "password",
              autoComplete: "new-password",
              placeholder: t("form.passwordHint"),
              value: password,
              onChange: (event) => {
                setPassword(event.target.value);
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "button",
            {
              type: "button",
              className: "dsh_lanproxy_eye",
              "aria-label": showPassword ? t("form.hidePassword") : t("form.showPassword"),
              title: showPassword ? t("form.hidePassword") : t("form.showPassword"),
              onClick: () => {
                setShowPassword((visible) => !visible);
              },
              children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(EyeOffIcon, {}) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(EyeIcon, {})
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_lanproxy_actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "submit", className: "dsh_lanproxy_button", disabled: saving, children: saving ? t("form.saving") : t("form.save") }),
        message !== null ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "dsh_lanproxy_message", children: message }) : null,
        error !== null ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "dsh_lanproxy_error", children: error }) : null
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SecurityCard, { call, t }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(OAuthCard, { call, t })
  ] });
}

// src/client/LanExposureNotice.tsx
var import_react4 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
function decideExposure(status) {
  if (status === null || !status.lanExposed) return { kind: "silent" };
  return { kind: "show" };
}
var checkedThisPageLoad = false;
function LanExposureNotice({ t }) {
  const [exposed, setExposed] = (0, import_react4.useState)(null);
  (0, import_react4.useEffect)(() => {
    if (checkedThisPageLoad) return;
    checkedThisPageLoad = true;
    void (async () => {
      const result = await callLanProxy(ENDPOINT_STATUS, {});
      const status = result.ok ? result.value : null;
      if (decideExposure(status).kind !== "show" || status === null) return;
      setExposed({ listenHost: status.listenHost, listenPort: status.listenPort });
    })();
  }, []);
  if (exposed === null) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dsh_lanproxy_notice", role: "alert", "aria-live": "assertive", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "dsh_lanproxy_noticeTitle", children: t("notice.title") }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "dsh_lanproxy_noticeBody", children: t("notice.body", { address: `${exposed.listenHost}:${exposed.listenPort}` }) }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "dsh_lanproxy_noticeHint", children: t("notice.hint") }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "button",
      {
        type: "button",
        className: "dsh_lanproxy_noticeButton",
        onClick: () => {
          setExposed(null);
        },
        children: t("notice.dismiss")
      }
    )
  ] });
}

// src/client/locales.ts
var NS = "dsh-proxy";
var zh = {
  "nav": "\u5C40\u57DF\u7F51\u4EE3\u7406",
  "status.title": "\u8FD0\u884C\u72B6\u6001",
  "status.proxyPort": "\u4EE3\u7406\u670D\u52A1\u7AEF\u53E3",
  "status.proxyRunning": "\u8FD0\u884C\u4E2D",
  "status.proxyStopped": "\u672A\u8FD0\u884C",
  "status.targetPort": "\u9ED8\u8BA4\u670D\u52A1\u7AEF\u53E3",
  "status.targetReachable": "\u53EF\u8BBF\u95EE",
  "status.targetUnreachable": "\u4E0D\u53EF\u8BBF\u95EE",
  "status.username": "\u5F53\u524D\u7528\u6237\u540D",
  "status.auth": "\u5BC6\u7801\u767B\u5F55",
  "status.authOn": "\u5DF2\u542F\u7528",
  "status.authOff": "\u672A\u542F\u7528",
  "status.lanOpen": "\u672A\u542F\u7528\uFF08\u5C40\u57DF\u7F51\u5F00\u653E\u8BBF\u95EE\uFF09",
  "status.lanExposedHint": "\u26A0\uFE0F \u5B89\u5168\u98CE\u9669\uFF1A\u4EE3\u7406\u6B63\u5728\u76D1\u542C\u5BF9\u5916\u5730\u5740\uFF0C\u4E14\u672A\u8BBE\u7F6E\u5BC6\u7801\u767B\u5F55\u2014\u2014\u5C40\u57DF\u7F51\u5185\u4EFB\u4F55\u4EBA\u90FD\u80FD\u76F4\u63A5\u8BBF\u95EE DSH\uFF08\u542B\u8BBE\u7F6E\u3001\u51ED\u636E\u7B49\u7279\u6743\u63A5\u53E3\uFF09\u3002\u8BF7\u5728\u4E0B\u65B9\u540C\u65F6\u586B\u5199\u7528\u6237\u540D\u548C\u5BC6\u7801\u5E76\u300C\u5E94\u7528\u300D\uFF0C\u6216\u5C06 listenHost \u6539\u4E3A 127.0.0.1\u3002",
  "status.authOffHint": "\u672A\u8BBE\u7F6E\u5BC6\u7801\u767B\u5F55\u3002\u5F53\u524D\u4EC5\u672C\u673A\u53EF\u8BBF\u95EE\uFF0C\u6682\u4E0D\u6784\u6210\u98CE\u9669\uFF1B\u82E5\u8981\u5F00\u653E\u5C40\u57DF\u7F51\u8BBF\u95EE\uFF0C\u8BF7\u540C\u65F6\u8BBE\u7F6E\u7528\u6237\u540D\u548C\u5BC6\u7801\u3002",
  "status.persistedOn": "\u5B58\u5728\u5DF2\u4FDD\u5B58\u7684\u8FD0\u884C\u914D\u7F6E\uFF08\u4F18\u5148\u4E8E cordis \u914D\u7F6E\uFF09",
  "status.persistedOff": "\u4F7F\u7528 cordis \u914D\u7F6E",
  "status.loading": "\u52A0\u8F7D\u4E2D\u2026",
  "status.unreachable": "\u65E0\u6CD5\u8FDE\u63A5\u4EE3\u7406\u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4\u63D2\u4EF6\u5DF2\u542F\u7528\u5E76\u91CD\u542F\u8FC7 dsh web\u3002",
  "status.retry": "\u91CD\u8BD5",
  "notice.title": "\u26A0\uFE0F \u5C40\u57DF\u7F51\u4EE3\u7406\u5F53\u524D\u65E0\u5BC6\u7801\u5BF9\u5916\u5F00\u653E",
  "notice.body": "{address} \u6B63\u5728\u5BF9\u5C40\u57DF\u7F51\u76D1\u542C\uFF0C\u4E14\u6CA1\u6709\u8BBE\u7F6E\u5BC6\u7801\u767B\u5F55\uFF1A\u5C40\u57DF\u7F51\u5185\u4EFB\u4F55\u4EBA\u90FD\u80FD\u76F4\u63A5\u6253\u5F00 DSH\uFF0C\u5305\u62EC\u8BBE\u7F6E\u3001\u51ED\u636E\u7B49\u7279\u6743\u63A5\u53E3\u3002",
  "notice.hint": "\u4FEE\u590D\u65B9\u5F0F\uFF1A\u6253\u5F00 DSH \u8BBE\u7F6E \u2192\u300C\u5C40\u57DF\u7F51\u4EE3\u7406\u300D\uFF0C\u540C\u65F6\u586B\u5199\u7528\u6237\u540D\u548C\u5BC6\u7801\u5E76\u300C\u5E94\u7528\u300D\uFF1B\u82E5\u53EA\u9700\u672C\u673A\u4F7F\u7528\uFF0C\u53EF\u5728 profile \u7684 cordis.patch.yml \u4E2D\u628A listenHost \u6539\u4E3A 127.0.0.1\u3002",
  "notice.dismiss": "\u6211\u77E5\u9053\u4E86",
  "sec.title": "\u767B\u5F55\u4E0E\u5B89\u5168",
  "sec.subtitle": "\u767B\u5F55\u9875\u53D1\u4F1A\u8BDD Cookie\uFF08\u53EF\u901A\u8FC7\u53CD\u4EE3 HTTPS \u751F\u6548\uFF09\uFF1B\u5C40\u57DF\u7F51\u660E\u6587\u8BBF\u95EE\u4ECD\u4F7F\u7528\u6D4F\u89C8\u5668 Basic \u8BA4\u8BC1\u3002",
  "sec.loading": "\u52A0\u8F7D\u4E2D\u2026",
  "sec.loginEnabled": "\u5BC6\u7801\u767B\u5F55",
  "sec.loginOn": "\u5DF2\u542F\u7528\uFF08\u767B\u5F55\u9875 / Basic\uFF09",
  "sec.loginOff": "\u672A\u8BBE\u7F6E\uFF08\u65E0\u95E8\u7981\uFF09",
  "sec.requireTls": "\u5F3A\u5236 HTTPS",
  "sec.requireTlsOn": "\u5DF2\u5F00\u542F\uFF1A\u660E\u6587\u8BF7\u6C42\u4E00\u5F8B\u62D2\u7EDD",
  "sec.requireTlsOff": "\u672A\u5F00\u542F\uFF1A\u660E\u6587\u6309\u4E0B\u9762\u7684\u65B9\u5F0F\u8BA4\u8BC1",
  "sec.cleartextAuth": "\u660E\u6587\u8BBF\u95EE\u7684\u8BA4\u8BC1\u65B9\u5F0F",
  "sec.cleartextLogin": "\u767B\u5F55\u9875\uFF08\u9ED8\u8BA4\uFF0C\u7EDF\u4E00\uFF09",
  "sec.cleartextBasic": "\u6D4F\u89C8\u5668 Basic \u5F39\u7A97",
  "sec.useCleartextLogin": "\u660E\u6587\u4E5F\u7528\u767B\u5F55\u9875",
  "sec.useCleartextBasic": "\u660E\u6587\u6539\u7528 Basic \u5F39\u7A97",
  "sec.cleartextLoginHint": "\u660E\u6587\u4E0B\u4F1A\u8BDD Cookie \u65E0\u6CD5\u5E26 Secure/__Host-\uFF0C\u8F83 TLS \u4E0B\u66F4\u5F31\uFF08\u540C\u7F51\u6BB5\u53EF\u80FD\u88AB\u4F2A\u9020\u6216\u55C5\u63A2\uFF09\uFF1B\u5F3A\u70C8\u5EFA\u8BAE\u653E\u5230\u53CD\u4EE3 TLS \u4E4B\u540E\u3002",
  "sec.cleartextBasicHint": "\u660E\u6587\u8BF7\u6C42\u4F7F\u7528\u6D4F\u89C8\u5668\u539F\u751F Basic \u5F39\u7A97\uFF0C\u5BC6\u7801\u968F\u6BCF\u4E2A\u8BF7\u6C42\u53D1\u9001\uFF1B\u65E0\u6CD5\u767B\u51FA\u6216\u8E22\u51FA\u4F1A\u8BDD\u3002",
  "sec.enableRequireTls": "\u5F00\u542F\u5F3A\u5236 HTTPS",
  "sec.disableRequireTls": "\u5173\u95ED\u5F3A\u5236 HTTPS",
  "sec.restartHint": "\u8BE5\u5F00\u5173\u6539\u52A8\u540E\u9700\u91CD\u542F dsh web \u624D\u4F1A\u751F\u6548\u3002",
  "sec.saved": "\u5DF2\u4FDD\u5B58",
  "sec.sessions": "\u6D3B\u52A8\u4F1A\u8BDD",
  "sec.noSessions": "\u5F53\u524D\u6CA1\u6709\u6D3B\u52A8\u4F1A\u8BDD\uFF08\u672A\u8D70\u767B\u5F55\u9875\u65F6\u4E3A\u6B63\u5E38\u73B0\u8C61\uFF09\u3002",
  "sec.current": "\u5F53\u524D",
  "sec.createdAt": "\u767B\u5F55\u65F6\u95F4",
  "sec.lastSeen": "\u6700\u540E\u6D3B\u52A8",
  "sec.source": "\u6765\u6E90",
  "sec.revoke": "\u8E22\u51FA",
  "sec.revokeAll": "\u8E22\u51FA\u5176\u4ED6\u6240\u6709\u4F1A\u8BDD",
  "sec.revoked": "\u5DF2\u8E22\u51FA",
  "sec.lockouts": "\u6B63\u5728\u9501\u5B9A\u7684\u6765\u6E90",
  "sec.lockoutRow": "\u5931\u8D25 {failures} \u6B21\uFF0C\u7EA6 {minutes} \u5206\u949F\u540E\u89E3\u9501",
  "sec.audit": "\u767B\u5F55\u5BA1\u8BA1\uFF08\u6700\u8FD1 {count} \u6761\uFF09",
  "sec.noAudit": "\u6682\u65E0\u5BA1\u8BA1\u8BB0\u5F55\u3002",
  "sec.refresh": "\u5237\u65B0",
  "sec.failed": "\u64CD\u4F5C\u5931\u8D25",
  "sec.policy": "\u7B56\u7565\uFF1A\u4F1A\u8BDD\u6700\u957F {ttl} \u5929 / \u7A7A\u95F2 {idle} \u5C0F\u65F6\uFF1B\u8FDE\u7EED\u5931\u8D25 {max} \u6B21\u9501\u5B9A {lockout} \u5206\u949F\u3002",
  "control.start": "\u542F\u52A8",
  "control.stop": "\u505C\u6B62",
  "control.started": "\u4EE3\u7406\u670D\u52A1\u5DF2\u542F\u52A8",
  "control.stopped": "\u4EE3\u7406\u670D\u52A1\u5DF2\u505C\u6B62",
  "control.failed": "\u64CD\u4F5C\u5931\u8D25",
  "control.startHintPort": "\u4EE3\u7406\u670D\u52A1\u672A\u80FD\u542F\u52A8\uFF0C\u8BF7\u5C1D\u8BD5\u66F4\u6362\u4EE3\u7406\u670D\u52A1\u7AEF\u53E3\uFF08\u5F53\u524D\u7AEF\u53E3\u53EF\u80FD\u5DF2\u88AB\u5360\u7528\uFF09\u3002",
  "form.title": "\u4FEE\u6539\u8BBE\u7F6E",
  "form.subtitle": "\u542F\u7528\u5BC6\u7801\u767B\u5F55\u540E\uFF0C\u6D4F\u89C8\u5668\u4F1A\u5F39\u51FA\u539F\u751F Basic Auth \u767B\u5F55\u6846\uFF1B\u4FDD\u5B58\u4FEE\u6539\u4F1A\u91CD\u542F\u8F6C\u53D1\u670D\u52A1\u3002",
  "form.listenPort": "\u4EE3\u7406\u670D\u52A1\u7AEF\u53E3\uFF08\u76D1\u542C\u7AEF\u53E3\uFF09",
  "form.listenPortHint": "1\u201365535",
  "form.username": "\u7528\u6237\u540D",
  "form.usernameHint": "\u6E05\u7A7A\u5373\u8BBE\u4E3A\u7A7A",
  "form.password": "\u5BC6\u7801",
  "form.passwordHint": "\u6E05\u7A7A\u5373\u8BBE\u4E3A\u7A7A\uFF1B\u7528\u6237\u540D\u4E0E\u5BC6\u7801\u9700\u540C\u65F6\u975E\u7A7A\u624D\u4F1A\u542F\u7528\u5BC6\u7801\u767B\u5F55",
  "form.showPassword": "\u663E\u793A\u5BC6\u7801",
  "form.hidePassword": "\u9690\u85CF\u5BC6\u7801",
  "form.save": "\u5E94\u7528",
  "form.saving": "\u5E94\u7528\u4E2D\u2026",
  "form.invalidPort": "\u7AEF\u53E3\u5FC5\u987B\u662F 1\u201365535 \u7684\u6574\u6570",
  "form.portConflict": "\u4EE3\u7406\u670D\u52A1\u7AEF\u53E3\u4E0D\u80FD\u4E0E\u9ED8\u8BA4\u670D\u52A1\u7AEF\u53E3\u76F8\u540C",
  "form.updated": "\u5DF2\u4FDD\u5B58\u5E76\u91CD\u542F\u8F6C\u53D1\u670D\u52A1",
  "form.updatedSaved": "\u5DF2\u4FDD\u5B58",
  "form.updatedPartial": "\u5DF2\u4FDD\u5B58\u5E76\u91CD\u542F\u8F6C\u53D1\u670D\u52A1\uFF08\u6CE8\u610F\uFF1A\u9700\u540C\u65F6\u8BBE\u7F6E\u7528\u6237\u540D\u548C\u5BC6\u7801\u624D\u4F1A\u542F\u7528\u5BC6\u7801\u767B\u5F55\uFF09",
  "form.updatedSavedPartial": "\u5DF2\u4FDD\u5B58\uFF08\u6CE8\u610F\uFF1A\u9700\u540C\u65F6\u8BBE\u7F6E\u7528\u6237\u540D\u548C\u5BC6\u7801\u624D\u4F1A\u542F\u7528\u5BC6\u7801\u767B\u5F55\uFF09",
  "form.updatedListenFailed": "\u5DF2\u4FDD\u5B58\uFF0C\u4F46\u8F6C\u53D1\u670D\u52A1\u672A\u80FD\u542F\u52A8",
  "form.failed": "\u4FDD\u5B58\u5931\u8D25",
  "oauth.title": "\u7B2C\u4E09\u65B9\u767B\u5F55",
  "oauth.subtitle": "\u914D\u7F6E GitHub / Google / \u98DE\u4E66 / Casdoor \u767B\u5F55\uFF1B\u4E0D\u586B\u6388\u6743\u5730\u5740\u65F6\u4F7F\u7528\u5404\u6E20\u9053\u5B98\u65B9\u5730\u5740\uFF0C\u4E5F\u53EF\u6307\u5411\u81EA\u5EFA\u7EDF\u4E00\u8BA4\u8BC1\u4E2D\u5FC3\u3002",
  "oauth.refresh": "\u5237\u65B0",
  "oauth.loading": "\u52A0\u8F7D\u4E2D\u2026",
  "oauth.enable": "\u542F\u7528\u7B2C\u4E09\u65B9\u767B\u5F55",
  "oauth.providerEnable": "\u542F\u7528\u8BE5\u6E20\u9053",
  "oauth.authCenter": "\u7EDF\u4E00\u8BA4\u8BC1\u4E2D\u5FC3\u5730\u5740\uFF08\u53EF\u9009\uFF09",
  "oauth.authCenterHint": "\u586B\u5199\u540E\u5404\u6E20\u9053\u7684\u6388\u6743 / \u4EE4\u724C / \u7528\u6237\u4FE1\u606F\u5730\u5740\u4F1A\u4E00\u8D77\u66FF\u6362\uFF1B\u81EA\u5EFA Casdoor \u4E5F\u53EF\u4F5C\u4E3A\u72EC\u7ACB\u6E20\u9053\u4F7F\u7528\u3002",
  "oauth.publicOrigin": "\u4EE3\u7406\u5916\u90E8\u8BBF\u95EE\u5730\u5740\uFF08\u53EF\u9009\uFF09",
  "oauth.publicOriginHint": "\u7559\u7A7A\u65F6\u56DE\u8C03\u5730\u5740\u81EA\u52A8\u4F7F\u7528\u5F53\u524D\u9875\u9762\u7684\u57DF\u540D + \u4EE3\u7406\u5B9E\u9645\u7AEF\u53E3\uFF08\u65E0\u9700\u5199\u6B7B host\uFF09\uFF1B\u4EC5\u5F53\u53CD\u5411\u4EE3\u7406\u7684\u5916\u90E8\u57DF\u540D\u65E0\u6CD5\u4ECE\u9875\u9762\u63A8\u65AD\u65F6\u624D\u9700\u586B\u5199\u3002",
  "oauth.clientId": "Client ID",
  "oauth.clientSecret": "Client Secret",
  "oauth.clientSecretHint": "\u4E0E\u5BC6\u7801\u4E00\u6837\u4EE5\u63A9\u7801\u8F93\u5165\uFF0C\u4E0D\u4F1A\u5199\u5165\u5BA1\u8BA1\u65E5\u5FD7\u3002",
  "oauth.scopes": "Scope\uFF08\u7A7A\u683C\u5206\u9694\uFF09",
  "oauth.baseUrl": "\u8BE5\u6E20\u9053\u8BA4\u8BC1\u4E2D\u5FC3\u5730\u5740\uFF08\u53EF\u9009\uFF09",
  "oauth.baseUrlHint": "\u4F18\u5148\u4E8E\u4E0A\u65B9\u7EDF\u4E00\u5730\u5740\uFF1B\u7070\u8272\u793A\u4F8B\u662F\u8BE5\u6E20\u9053\u7684\u5B98\u65B9\u9ED8\u8BA4\u6388\u6743\u5730\u5740\uFF0C\u7559\u7A7A\u5373\u4F7F\u7528\u5B83\u6216\u4E0A\u65B9\u7EDF\u4E00\u5730\u5740\u3002",
  "oauth.label": "\u767B\u5F55\u6309\u94AE\u6587\u5B57\uFF08\u53EF\u9009\uFF09",
  "oauth.providerHint": "Provider Hint\uFF08\u81EA\u5B9A\u4E49\u7AEF\u70B9\uFF0C\u53EF\u9009\uFF09",
  "oauth.providerHintHint": "\u6E20\u9053\u6307\u5411\u81EA\u5EFA\u7B49\u7EDF\u4E00\u8BA4\u8BC1\u4E2D\u5FC3\u65F6\u6BD4\u5982Casdoor\uFF0C\u6388\u6743\u8BF7\u6C42\u4F1A\u9644\u5E26 provider_hint=<\u6B64\u503C>\uFF1B\u4F8B\u5982 GitHub \u6E20\u9053\u901A\u5E38\u586B github\u3002\u7559\u7A7A\u5219\u4E0D\u53D1\u9001\u8BE5\u53C2\u6570\uFF0C\u5B98\u65B9\u7AEF\u70B9\u884C\u4E3A\u4E0D\u53D8\u3002",
  "oauth.redirectUri": "\u56DE\u8C03\u5730\u5740",
  "oauth.advanced": "\u9AD8\u7EA7\uFF1A\u81EA\u5B9A\u4E49\u7AEF\u70B9",
  "oauth.advancedHide": "\u6536\u8D77\u81EA\u5B9A\u4E49\u7AEF\u70B9",
  "oauth.endpointAuthorization": "\u6388\u6743\u5730\u5740",
  "oauth.endpointToken": "\u4EE4\u724C\u5730\u5740",
  "oauth.endpointUserInfo": "\u7528\u6237\u4FE1\u606F\u5730\u5740",
  "oauth.effectiveSource": "\u7AEF\u70B9\u6765\u6E90",
  "oauth.sourceOfficial": "\u5B98\u65B9\u9ED8\u8BA4\u5730\u5740",
  "oauth.sourceCenter": "\u7EDF\u4E00\u8BA4\u8BC1\u4E2D\u5FC3",
  "oauth.sourceOverride": "\u6E20\u9053\u81EA\u5B9A\u4E49",
  "oauth.displayOnLogin": "\u767B\u5F55\u9875\u663E\u793A",
  "oauth.issuePrefix": "\u914D\u7F6E\u63D0\u793A",
  "oauth.save": "\u4FDD\u5B58\u7B2C\u4E09\u65B9\u767B\u5F55\u914D\u7F6E",
  "oauth.saving": "\u4FDD\u5B58\u4E2D\u2026",
  "oauth.saved": "\u5DF2\u4FDD\u5B58\uFF0C\u914D\u7F6E\u7ACB\u5373\u751F\u6548",
  "oauth.failed": "\u4FDD\u5B58\u5931\u8D25",
  "oauth.bindings": "\u8D26\u53F7\u7ED1\u5B9A",
  "oauth.bindingsHint": "\u53EA\u6709\u5728\u8FD9\u91CC\u624B\u52A8\u7ED1\u5B9A\u7684\u4E09\u65B9\u8D26\u53F7\u624D\u80FD\u767B\u5F55\uFF1B\u672A\u7ED1\u5B9A\u7684\u8D26\u53F7\u5373\u4F7F\u901A\u8FC7\u8BA4\u8BC1\u4E5F\u4F1A\u88AB\u62D2\u7EDD\u3002",
  "oauth.noBindings": "\u5F53\u524D\u6CA1\u6709\u7ED1\u5B9A\u4EFB\u4F55\u4E09\u65B9\u8D26\u53F7\u3002",
  "oauth.bind": "\u7ED1\u5B9A",
  "oauth.unbind": "\u89E3\u7ED1",
  "oauth.boundAt": "\u7ED1\u5B9A\u65F6\u95F4",
  "oauth.boundVia": "\u6765\u6E90",
  "oauth.subject": "\u8D26\u53F7\u6807\u8BC6",
  "oauth.localSubject": "\u7ED1\u5B9A\u5230\u672C\u5730\u8D26\u53F7",
  "oauth.basicHint": "\u5F53\u524D\u4E3A\u6D4F\u89C8\u5668 Basic \u5F39\u7A97\u6A21\u5F0F\uFF1A\u767B\u5F55\u9875\u4E0D\u663E\u793A\u7B2C\u4E09\u65B9\u767B\u5F55\u6309\u94AE\uFF0C\u8BF7\u6539\u7528\u300C\u767B\u5F55\u9875\u300D\u6A21\u5F0F\u3002",
  "oauth.noAuthHint": "\u672A\u914D\u7F6E\u5BC6\u7801\u4E14\u672A\u542F\u7528\u4EFB\u4F55\u7B2C\u4E09\u65B9\u6E20\u9053\uFF1A\u5F53\u524D\u4FDD\u6301\u5F00\u653E\u8BBF\u95EE\uFF0C\u767B\u5F55\u5165\u53E3\u4E0E\u7B2C\u4E09\u65B9\u767B\u5F55\u5747\u4E0D\u53EF\u7528\u3002",
  "oauth.bindFailed": "\u53D1\u8D77\u7ED1\u5B9A\u5931\u8D25",
  "oauth.bindRemoveFailed": "\u89E3\u7ED1\u5931\u8D25",
  "oauth.bindStartHint": "\u70B9\u51FB\u540E\u4F1A\u5728\u65B0\u7A97\u53E3\u5B8C\u6210\u7B2C\u4E09\u65B9\u6388\u6743\uFF0C\u539F\u8BBE\u7F6E\u9875\u4E0D\u4F1A\u79BB\u5F00\uFF1B\u5B8C\u6210\u540E\u5F39\u7A97\u81EA\u52A8\u5173\u95ED\u3001\u5217\u8868\u81EA\u52A8\u5237\u65B0\u3002",
  "oauth.popupHint": "\u767B\u5F55\u4E0E\u7ED1\u5B9A\u90FD\u5728\u65B0\u5F39\u51FA\u7684\u7A97\u53E3\u4E2D\u5B8C\u6210\uFF0C\u539F\u9875\u9762\u4E0D\u4F1A\u8DF3\u8F6C\uFF1B\u82E5\u6D4F\u89C8\u5668\u62E6\u622A\u5F39\u7A97\uFF0C\u8BF7\u5141\u8BB8\u540E\u91CD\u8BD5\u3002",
  "oauth.popupBlocked": "\u65E0\u6CD5\u6253\u5F00\u6388\u6743\u5F39\u7A97\uFF0C\u8BF7\u68C0\u67E5\u6D4F\u89C8\u5668\u7684\u5F39\u7A97\u62E6\u622A\u8BBE\u7F6E\u540E\u91CD\u8BD5\u3002",
  "oauth.bound": "\u7ED1\u5B9A\u6210\u529F\uFF0C\u5217\u8868\u5DF2\u5237\u65B0",
  "oauth.unbindConfirm": "\u786E\u5B9A\u8981\u89E3\u9664 {name} \u7684\u7ED1\u5B9A\u5417\uFF1F\u89E3\u7ED1\u540E\u8BE5\u4E09\u65B9\u8D26\u53F7\u5C06\u65E0\u6CD5\u767B\u5F55\u3002",
  "oauth.unbindConfirmAction": "\u786E\u8BA4\u89E3\u7ED1",
  "oauth.unbindCancel": "\u53D6\u6D88",
  "oauth.pending": "\u6B63\u5728\u7B49\u5F85\u7B2C\u4E09\u65B9\u8BA4\u8BC1\u2026\uFF09",
  "oauth.cancelAuth": "\u53D6\u6D88\u8BA4\u8BC1",
  "oauth.authTimeout": "\u7B49\u5F85\u7B2C\u4E09\u65B9\u8BA4\u8BC1\u8D85\u65F6\uFF0C\u5F39\u7A97\u5DF2\u5173\u95ED\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  "oauth.authCancelled": "\u5DF2\u53D6\u6D88\u7B2C\u4E09\u65B9\u8BA4\u8BC1\uFF0C\u5F39\u7A97\u5DF2\u5173\u95ED\u3002",
  "oauth.notReady": "\u8BF7\u5148\u542F\u7528\u5E76\u4FDD\u5B58\u8BE5\u6E20\u9053\u914D\u7F6E\u540E\u518D\u7ED1\u5B9A\u3002"
};
var en = {
  "nav": "LAN Proxy",
  "status.title": "Status",
  "status.proxyPort": "Proxy port",
  "status.proxyRunning": "Running",
  "status.proxyStopped": "Not running",
  "status.targetPort": "Default service port",
  "status.targetReachable": "Reachable",
  "status.targetUnreachable": "Unreachable",
  "status.username": "Username",
  "status.auth": "Password login",
  "status.authOn": "Enabled",
  "status.authOff": "Not enabled",
  "status.lanOpen": "Not enabled (open LAN access)",
  "status.lanExposedHint": "\u26A0\uFE0F Security risk: the proxy is listening on a network address while password login is off \u2014 anyone on the LAN can reach DSH directly, including its privileged settings/credentials RPC. Set BOTH a username and a password below and Apply, or change listenHost to 127.0.0.1.",
  "status.authOffHint": "Password login is off. The listener is currently reachable from this machine only, so there is no exposure yet; set BOTH a username and a password before exposing it to the LAN.",
  "status.persistedOn": "A saved runtime config overrides the cordis config",
  "status.persistedOff": "Using the cordis config",
  "status.loading": "Loading\u2026",
  "status.unreachable": "Cannot reach the proxy service \u2014 make sure the plugin is enabled and dsh web was restarted.",
  "status.retry": "Retry",
  "notice.title": "\u26A0\uFE0F The LAN proxy is open without a password",
  "notice.body": "{address} is listening on the network with password login off: anyone on the LAN can open DSH directly, including its privileged settings and credentials RPC.",
  "notice.hint": `To fix it, open DSH settings \u2192 "LAN Proxy", set BOTH a username and a password, and Apply. If this machine is all you need, set listenHost to 127.0.0.1 in the profile's cordis.patch.yml.`,
  "notice.dismiss": "Got it",
  "sec.title": "Login & security",
  "sec.subtitle": "The login page issues a session cookie (effective behind a TLS reverse proxy); plain-HTTP LAN access keeps the browser Basic dialog.",
  "sec.loading": "Loading\u2026",
  "sec.loginEnabled": "Password login",
  "sec.loginOn": "Enabled (login page / Basic)",
  "sec.loginOff": "Not configured (no gate)",
  "sec.requireTls": "Require HTTPS",
  "sec.requireTlsOn": "On: cleartext requests are refused",
  "sec.requireTlsOff": "Off: cleartext authenticates as configured below",
  "sec.cleartextAuth": "Cleartext authentication",
  "sec.cleartextLogin": "Login page (default, unified)",
  "sec.cleartextBasic": "Browser Basic dialog",
  "sec.useCleartextLogin": "Use the login page for cleartext",
  "sec.useCleartextBasic": "Use the Basic dialog for cleartext",
  "sec.cleartextLoginHint": "On cleartext the session cookie cannot carry Secure/__Host-, so it is weaker than under TLS (a same-LAN attacker could plant or sniff it). Put a TLS reverse proxy in front.",
  "sec.cleartextBasicHint": "Cleartext requests use the browser native Basic dialog: the password rides every request and there is no logout or session revocation.",
  "sec.enableRequireTls": "Turn on Require HTTPS",
  "sec.disableRequireTls": "Turn off Require HTTPS",
  "sec.restartHint": "This switch takes effect after restarting dsh web.",
  "sec.saved": "Saved",
  "sec.sessions": "Active sessions",
  "sec.noSessions": "No active sessions (normal while the login page is unused).",
  "sec.current": "current",
  "sec.createdAt": "Signed in",
  "sec.lastSeen": "Last seen",
  "sec.source": "Source",
  "sec.revoke": "Revoke",
  "sec.revokeAll": "Revoke all other sessions",
  "sec.revoked": "Revoked",
  "sec.lockouts": "Locked-out sources",
  "sec.lockoutRow": "{failures} failures, unlocks in about {minutes} min",
  "sec.audit": "Login audit (latest {count})",
  "sec.noAudit": "No audit entries yet.",
  "sec.refresh": "Refresh",
  "sec.failed": "Action failed",
  "sec.policy": "Policy: session max {ttl} days / idle {idle} h; {max} consecutive failures lock a source for {lockout} min.",
  "control.start": "Start",
  "control.stop": "Stop",
  "control.started": "Proxy service started",
  "control.stopped": "Proxy service stopped",
  "control.failed": "Action failed",
  "control.startHintPort": "The proxy failed to start \u2014 try changing the proxy port (the current one may already be in use).",
  "form.title": "Edit settings",
  "form.subtitle": "With password login enabled, the browser shows its native Basic Auth dialog; saving restarts the forwarding service.",
  "form.listenPort": "Proxy port (listen)",
  "form.listenPortHint": "1\u201365535",
  "form.username": "Username",
  "form.usernameHint": "Empty to set blank",
  "form.password": "Password",
  "form.passwordHint": "Empty to set blank; password login requires BOTH username and password",
  "form.showPassword": "Show password",
  "form.hidePassword": "Hide password",
  "form.save": "Apply",
  "form.saving": "Applying\u2026",
  "form.invalidPort": "Port must be an integer between 1 and 65535",
  "form.portConflict": "Proxy port must differ from the default service port",
  "form.updated": "Saved and the forwarding service restarted",
  "form.updatedSaved": "Saved",
  "form.updatedPartial": "Saved and restarted (note: password login requires BOTH username and password)",
  "form.updatedSavedPartial": "Saved (note: password login requires BOTH username and password)",
  "form.updatedListenFailed": "Saved, but the forwarding service failed to start",
  "form.failed": "Save failed",
  "oauth.title": "Third-party login",
  "oauth.subtitle": "Configure GitHub / Google / Feishu / Casdoor sign-in. Leave the endpoint fields blank to use each provider's official URLs, or point them at your own auth center.",
  "oauth.refresh": "Refresh",
  "oauth.loading": "Loading\u2026",
  "oauth.enable": "Enable third-party login",
  "oauth.providerEnable": "Enable this provider",
  "oauth.authCenter": "Unified auth center URL (optional)",
  "oauth.authCenterHint": "Filling this replaces the authorize / token / userinfo URLs of every channel; a self-hosted Casdoor can also be used as its own channel.",
  "oauth.publicOrigin": "External proxy origin (optional)",
  "oauth.publicOriginHint": "Leave blank to build the callback URI from the current page domain + the proxy real port (no hardcoded host). Set it only when a reverse proxy front door cannot be inferred from the page.",
  "oauth.clientId": "Client ID",
  "oauth.clientSecret": "Client Secret",
  "oauth.clientSecretHint": "Masked like the password field and never written to the audit log.",
  "oauth.scopes": "Scopes (space separated)",
  "oauth.baseUrl": "Per-provider auth center URL (optional)",
  "oauth.baseUrlHint": "Overrides the shared URL above; the grey hint is this channel's official default authorize endpoint. Leave blank to use it or the shared URL.",
  "oauth.label": "Login button text (optional)",
  "oauth.providerHint": "Provider hint (custom endpoints, optional)",
  "oauth.providerHintHint": "When a channel points at a self-hosted Casdoor-style auth center, the authorize request carries provider_hint=<this value>; the github channel usually uses github. Leave blank to omit the parameter entirely \u2014 official endpoints are unchanged.",
  "oauth.redirectUri": "Redirect URI",
  "oauth.advanced": "Advanced: custom endpoints",
  "oauth.advancedHide": "Hide custom endpoints",
  "oauth.endpointAuthorization": "Authorize endpoint",
  "oauth.endpointToken": "Token endpoint",
  "oauth.endpointUserInfo": "Userinfo endpoint",
  "oauth.effectiveSource": "Endpoint source",
  "oauth.sourceOfficial": "Official defaults",
  "oauth.sourceCenter": "Unified auth center",
  "oauth.sourceOverride": "Per-provider override",
  "oauth.displayOnLogin": "Shown on login page",
  "oauth.issuePrefix": "Configuration issue",
  "oauth.save": "Save third-party login config",
  "oauth.saving": "Saving\u2026",
  "oauth.saved": "Saved; the new configuration is live",
  "oauth.failed": "Save failed",
  "oauth.bindings": "Account bindings",
  "oauth.bindingsHint": "Only manually bound accounts may sign in; an unbound account is refused even after a successful provider login.",
  "oauth.noBindings": "No third-party account is bound yet.",
  "oauth.bind": "Bind",
  "oauth.unbind": "Unbind",
  "oauth.boundAt": "Bound at",
  "oauth.boundVia": "Via",
  "oauth.subject": "Account subject",
  "oauth.localSubject": "Bound local account",
  "oauth.basicHint": "Browser Basic dialog is active: the login page shows no third-party buttons. Switch back to the login page mode.",
  "oauth.noAuthHint": "No password and no enabled provider: open access is kept, while login entries and third-party sign-in are unavailable.",
  "oauth.bindFailed": "Could not start binding",
  "oauth.bindRemoveFailed": "Could not remove binding",
  "oauth.bindStartHint": "Clicking opens a separate window for provider authorization; this settings page stays put, the popup closes and the list refreshes when done.",
  "oauth.popupHint": "Sign-in and binding both finish in a popup, never by navigating the current page. Allow popups if your browser blocks them.",
  "oauth.popupBlocked": "Could not open the authorization popup \u2014 check the browser popup blocker and retry.",
  "oauth.bound": "Account bound; the list is refreshed",
  "oauth.unbindConfirm": "Unbind {name}? This third-party account will no longer be able to sign in.",
  "oauth.unbindConfirmAction": "Confirm unbind",
  "oauth.unbindCancel": "Cancel",
  "oauth.pending": "Waiting for third-party authorization\u2026 (the popup closes after 3 minutes)",
  "oauth.cancelAuth": "Cancel authorization",
  "oauth.authTimeout": "Timed out waiting for third-party authorization (3 minutes); the popup was closed. Please retry.",
  "oauth.authCancelled": "Authorization cancelled; the popup was closed.",
  "oauth.notReady": "Enable and save this provider before binding an account."
};

// src/client/styles.ts
var STYLE_ID = "dsh-lanproxy-style";
var cssText = `
.dsh_lanproxy_section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
.dsh_lanproxy_heading {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.dsh_lanproxy_title {
  margin: 0;
  color: var(--dsw-alias-label-primary, #e6edf3);
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
}
.dsh_lanproxy_subtitle {
  margin: 0;
  color: var(--dsw-alias-label-tertiary, #8b949e);
  font-size: 13px;
  line-height: 20px;
}
.dsh_lanproxy_card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 14px 16px;
  border: 1px solid var(--dsw-alias-border-l2, #30363d);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1, #161b22);
}
.dsh_lanproxy_cardTitle {
  color: var(--dsw-alias-label-primary, #e6edf3);
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
}
.dsh_lanproxy_cardHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}
.dsh_lanproxy_controls {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dsh_lanproxy_cardDesc {
  margin: -4px 0 0;
  color: var(--dsw-alias-label-tertiary, #8b949e);
  font-size: 12px;
  line-height: 18px;
}
.dsh_lanproxy_row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}
.dsh_lanproxy_rowLabel {
  color: var(--dsw-alias-label-secondary, #c9d1d9);
  font-size: 13px;
  line-height: 20px;
}
.dsh_lanproxy_rowValue {
  color: var(--dsw-alias-label-primary, #e6edf3);
  font-size: 13px;
  line-height: 20px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.dsh_lanproxy_portStatus {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.dsh_lanproxy_dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
}
.dsh_lanproxy_dotOn {
  background: var(--dsw-alias-state-success-primary, #3fb950);
  box-shadow: 0 0 0 3px rgba(63, 185, 80, 0.2);
}
.dsh_lanproxy_dotOff {
  background: var(--dsw-alias-state-error-primary, #f85149);
  box-shadow: 0 0 0 3px rgba(248, 81, 73, 0.2);
}
.dsh_lanproxy_portValue {
  color: var(--dsw-alias-label-primary, #e6edf3);
  font-variant-numeric: tabular-nums;
}
.dsh_lanproxy_statusText {
  font-size: 12px;
  line-height: 18px;
}
.dsh_lanproxy_statusTextOn {
  color: var(--dsw-alias-state-success-primary, #3fb950);
}
.dsh_lanproxy_statusTextOff {
  color: var(--dsw-alias-state-error-primary, #f85149);
}
/* Badges: text color only, no tinted background (the user asked for the
   status text color without the red/green fill). */
.dsh_lanproxy_badge {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 18px;
  background: transparent;
}
.dsh_lanproxy_badgeOn {
  color: var(--dsw-alias-state-success-primary, #3fb950);
}
.dsh_lanproxy_badgeOff {
  color: var(--dsw-alias-state-error-primary, #f85149);
}
.dsh_lanproxy_form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}
.dsh_lanproxy_field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.dsh_lanproxy_fieldLabel {
  color: var(--dsw-alias-label-secondary, #c9d1d9);
  font-size: 13px;
  line-height: 20px;
}
.dsh_lanproxy_fieldHint {
  color: var(--dsw-alias-label-tertiary, #8b949e);
  font-size: 12px;
  line-height: 18px;
}
.dsh_lanproxy_input {
  box-sizing: border-box;
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--dsw-alias-border-l2, #30363d);
  border-radius: 8px;
  /* bg-layer-0 does not exist in the design platform; bg-layer-2 is the
     token the harness itself uses for inputs and raised surfaces. */
  background: var(--dsw-alias-bg-layer-2, #21262d);
  color: var(--dsw-alias-label-primary, #e6edf3);
  font-size: 13px;
  line-height: 20px;
}
.dsh_lanproxy_input:focus {
  outline: none;
  border-color: var(--dsw-alias-accent, #2f81f7);
}
.dsh_lanproxy_passwordWrap {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
}
.dsh_lanproxy_passwordInput {
  padding-right: 36px;
}
.dsh_lanproxy_eye {
  position: absolute;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-tertiary, #8b949e);
  cursor: pointer;
}
.dsh_lanproxy_eye:hover {
  color: var(--dsw-alias-label-primary, #e6edf3);
  background: var(--dsw-alias-bg-layer-2, #21262d);
}
.dsh_lanproxy_eye svg {
  width: 16px;
  height: 16px;
}
.dsh_lanproxy_statusError {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
}
.dsh_lanproxy_actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 2px;
}
/* Primary button (\u542F\u52A8 / \u5E94\u7528): filled accent with a visible border. */
.dsh_lanproxy_button {
  padding: 7px 14px;
  border: 1px solid var(--dsw-alias-accent, #2f81f7);
  border-radius: 8px;
  background: var(--dsw-alias-accent, #2f81f7);
  color: var(--dsw-alias-fg-on-accent, #ffffff);
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}
.dsh_lanproxy_button:hover:not(:disabled) {
  background: var(--dsw-alias-accent-hover, #388bfd);
  border-color: var(--dsw-alias-accent-hover, #388bfd);
}
.dsh_lanproxy_button:active:not(:disabled) {
  background: var(--dsw-alias-accent-active, #1f6feb);
  border-color: var(--dsw-alias-accent-active, #1f6feb);
}
.dsh_lanproxy_button:disabled {
  opacity: 0.5;
  cursor: default;
  border-color: var(--dsw-alias-border-l2, #30363d);
  background: var(--dsw-alias-bg-layer-2, #21262d);
  color: var(--dsw-alias-label-tertiary, #8b949e);
}
/* Secondary button (\u505C\u6B62): outline style with its own border. */
.dsh_lanproxy_buttonStop {
  background: var(--dsw-alias-bg-layer-1, #161b22);
  border: 1px solid var(--dsw-alias-border-l2, #30363d);
  color: var(--dsw-alias-label-primary, #e6edf3);
}
.dsh_lanproxy_buttonStop:hover:not(:disabled) {
  background: var(--dsw-alias-bg-layer-2, #21262d);
  border-color: var(--dsw-alias-label-tertiary, #8b949e);
}
.dsh_lanproxy_buttonStop:active:not(:disabled) {
  background: var(--dsw-alias-bg-layer-0, #0d1117);
}
.dsh_lanproxy_buttonStop:disabled {
  opacity: 0.5;
  cursor: default;
}
/* Session/audit tables in the security card: dense, scrollable, and legible on
   both themes (cell text uses the theme label, borders the theme border token). */
.dsh_lanproxy_table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-primary, #e6edf3);
  display: block;
  max-height: 260px;
  overflow: auto;
}
.dsh_lanproxy_table th,
.dsh_lanproxy_table td {
  padding: 4px 8px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, #30363d);
  text-align: left;
  white-space: nowrap;
}
.dsh_lanproxy_table th {
  color: var(--dsw-alias-label-tertiary, #8b949e);
  font-weight: 500;
}
.dsh_lanproxy_buttonSmall {
  padding: 2px 10px;
  font-size: 12px;
  line-height: 18px;
}
.dsh_lanproxy_list {
  margin: 0;
  padding-left: 18px;
  color: var(--dsw-alias-label-primary, #e6edf3);
  font-size: 12px;
  line-height: 18px;
}
.dsh_lanproxy_list code {
  font-family: var(--ds-font-family-code, monospace);
}
.dsh_lanproxy_message {
  margin: 0;
  color: var(--dsw-alias-state-success-primary, #3fb950);
  font-size: 13px;
  line-height: 20px;
}
.dsh_lanproxy_error {
  margin: 0;
  color: var(--dsw-alias-state-error-primary, #f85149);
  font-size: 13px;
  line-height: 20px;
}
.dsh_lanproxy_hint {
  margin: 0;
  color: var(--dsw-alias-label-tertiary, #8b949e);
  font-size: 12px;
  line-height: 18px;
}
/* Security notice: the surface is reachable from the network without a
   password. Distinct from .dsh_lanproxy_error (red, used for real failures) by
   its warning tint and a soft left rule, so a hard bind failure and a security
   warning never read as the same thing. */
.dsh_lanproxy_warn {
  margin: 0;
  padding: 8px 10px;
  border-left: 3px solid var(--dsw-alias-state-warn-primary, #d29922);
  border-radius: 4px;
  background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d29922) 10%, transparent);
  /* The accent stays in the rule and the tint; the text uses the theme's label
     so it stays legible on both the amber wash and a light theme. */
  color: var(--dsw-alias-label-primary, #e6edf3);
  font-size: 13px;
  line-height: 20px;
  overflow-wrap: anywhere;
}
/* The frame-wide popup (shell.overlay seat). The seat's layer is click-through
   and every child opts back into pointer events, so this card is the only thing
   that captures the mouse \u2014 the app underneath stays fully usable, which is why
   the notice is a card rather than a blocking modal dialog. Top-center keeps it
   clear of the sidebar and the conversation composer, and it owns no backdrop,
   so it reads as an alert that waits instead of a wall. */
.dsh_lanproxy_notice {
  position: fixed;
  top: 16px;
  left: 50%;
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  box-sizing: border-box;
  width: min(460px, calc(100vw - 32px));
  padding: 14px 16px;
  border: 1px solid var(--dsw-alias-state-error-primary, #f85149);
  border-radius: 12px;
  /* A hint of the error tint keeps the card alarming in a LIGHT theme too,
     where the border alone would read as an ordinary card. */
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #f85149) 8%, var(--dsw-alias-bg-layer-2, #161b22));
  box-shadow: var(--dsw-elevation-prominent, 0 8px 24px rgb(0 0 0 / 45%));
  color: var(--dsw-alias-label-primary, #e6edf3);
  transform: translateX(-50%);
  animation: dsh_lanproxy_noticeIn 160ms ease-out;
}
@keyframes dsh_lanproxy_noticeIn {
  from { opacity: 0; transform: translate(-50%, -8px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .dsh_lanproxy_notice { animation: none; }
}
.dsh_lanproxy_noticeTitle {
  margin: 0;
  /* The red lives in the card border and the body text: a red TITLE (this used
     to be error-colored) is the classic light-theme legibility trap. */
  color: var(--dsw-alias-label-primary, #e6edf3);
  font-size: 14px;
  line-height: 22px;
  font-weight: 600;
}
.dsh_lanproxy_noticeBody {
  margin: 0;
  font-size: 13px;
  line-height: 20px;
  overflow-wrap: anywhere;
}
.dsh_lanproxy_noticeHint {
  margin: 0;
  color: var(--dsw-alias-label-secondary, #c9d1d9);
  font-size: 12px;
  line-height: 18px;
  overflow-wrap: anywhere;
}
.dsh_lanproxy_noticeButton {
  align-self: flex-end;
  padding: 4px 14px;
  border: 1px solid var(--dsw-alias-accent, #2f81f7);
  border-radius: 8px;
  /* Same pair as the settings page's primary button: an accent FILL with the
     foreground token that belongs on it. The first cut used the theme's
     label-primary token over a hand-picked dark background, and since that
     label resolves to BLACK in the light theme the result was black-on-black. */
  background: var(--dsw-alias-accent, #2f81f7);
  color: var(--dsw-alias-fg-on-accent, #ffffff);
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  cursor: pointer;
}
.dsh_lanproxy_noticeButton:hover {
  background: var(--dsw-alias-accent-hover, #388bfd);
  border-color: var(--dsw-alias-accent-hover, #388bfd);
}
.dsh_lanproxy_noticeButton:active {
  background: var(--dsw-alias-accent-active, #1f6feb);
  border-color: var(--dsw-alias-accent-active, #1f6feb);
}
.dsh_lanproxy_noticeButton:focus-visible {
  outline: 2px solid var(--dsw-alias-state-error-primary, #f85149);
  outline-offset: 2px;
}
.dsh_lanproxy_oauthChannel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--dsw-alias-border-primary, #30363d);
  border-radius: 8px;
}
.dsh_lanproxy_oauthHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
}
.dsh_lanproxy_oauthBrand {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: var(--dsw-alias-label-primary, #e6edf3);
  font-size: 14px;
  font-weight: 600;
}
.dsh_lanproxy_checkboxLabel {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--dsw-alias-label-secondary, #c9d1d9);
  font-size: 13px;
  line-height: 20px;
  white-space: nowrap;
}
.dsh_lanproxy_checkboxLabel input {
  width: 15px;
  height: 15px;
  margin: 0;
  accent-color: var(--dsw-alias-accent, #2f81f7);
}
.dsh_lanproxy_mono {
  margin: 0;
  color: var(--dsw-alias-label-tertiary, #8b949e);
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 12px;
  line-height: 18px;
  overflow-wrap: anywhere;
}
.dsh_lanproxy_bindingRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  padding: 8px 0;
  border-top: 1px solid var(--dsw-alias-border-primary, #30363d);
}
.dsh_lanproxy_tag {
  display: inline-block;
  padding: 1px 6px;
  border: 1px solid var(--dsw-alias-border-primary, #30363d);
  border-radius: 10px;
  color: var(--dsw-alias-label-tertiary, #8b949e);
  font-size: 11px;
  line-height: 18px;
}
`;
function adoptStyles() {
  if (document.getElementById(STYLE_ID) !== null) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = cssText;
  document.head.appendChild(style);
}

// src/client/index.ts
var inject = ["slots", "locale"];
function apply(ctx) {
  adoptStyles();
  console.info("[dsh-proxy] bundle loaded");
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-proxy: dictionaries");
  const t = ctx.locale.bind(NS);
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "dsh-proxy",
    order: 70,
    label: () => t("nav"),
    locale: NS,
    inject: () => ({ call: callLanProxy })
  }, SettingsSection));
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "dsh-proxy-exposure-notice",
    order: 100,
    locale: NS
  }, LanExposureNotice));
}
return module.exports; } });
//# sourceMappingURL=client.js.map
