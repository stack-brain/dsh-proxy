/**
 * The small self-contained page shown INSIDE the OAuth popup after the
 * provider redirects back to the proxy.
 *
 * The opener page must never navigate: the login page (or the settings page)
 * stays where it is while the popup does the third-party confirmation. This
 * page reports the result over a SAME-ORIGIN `BroadcastChannel`, with a
 * `postMessage` fallback for browsers that still keep an opener reference,
 * and then closes itself. A successful login has already had its session
 * cookie set on this origin by the runtime's response headers.
 *
 * No external asset, no dependency on the app bundle: the popup visitor is
 * unauthenticated until the cookie is set, exactly like the login page.
 */

import { OAUTH_CHANNEL, OAUTH_MESSAGE_SOURCE } from '../contract.ts'

/** All outcomes the popup can report. */
export type OAuthFinishStatus =
  | 'ok'
  | 'bound'
  | 'unbound'
  | 'denied'
  | 'invalid'
  | 'failed'
  | 'rejected'
  | 'unavailable'

/** Options for {@link renderOAuthFinishPage}. */
export interface OAuthFinishOptions {
  status: OAuthFinishStatus
  intent: 'login' | 'bind'
  /** Overrides the default detail copy (already localized by the caller). */
  message?: string
}

/** Default copy for each outcome. */
const COPY: Record<OAuthFinishStatus, { title: string; detail: string }> = {
  ok: { title: '登录成功', detail: '正在返回 DSH，此窗口即将关闭。' },
  bound: { title: '绑定成功', detail: '设置页会自动刷新，此窗口即将关闭。' },
  unbound: { title: '无法登录', detail: '该三方账号尚未绑定，请联系管理员在设置页绑定后再登录。' },
  denied: { title: '已取消授权', detail: '第三方授权已取消，可关闭此窗口后重试。' },
  invalid: { title: '登录状态无效', detail: '授权状态无效或已过期，请关闭此窗口后重新发起。' },
  failed: { title: '第三方登录失败', detail: '未能完成第三方认证，请关闭此窗口后重试。' },
  rejected: { title: '绑定未完成', detail: '绑定票据无效或该账号已绑定，请从设置页重新发起。' },
  unavailable: { title: '第三方登录不可用', detail: '请先配置密码或启用并配置该渠道，且使用登录页模式。' },
}

/** HTML-escape a value interpolated into the document. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** JSON-embed a value without allowing `</script>` to terminate the script. */
function scriptJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
}

/**
 * Render the popup result document.
 * @param options - outcome, intent and optional detail copy.
 * @returns a complete HTML document as a string.
 */
export function renderOAuthFinishPage(options: OAuthFinishOptions): string {
  const copy = COPY[options.status]
  const detail = options.message ?? copy.detail
  const success = options.status === 'ok' || options.status === 'bound'
  const payload = {
    source: OAUTH_MESSAGE_SOURCE,
    intent: options.intent,
    status: options.status,
    message: detail,
  }
  // Static script: only two module constants and the already-escaped payload
  // are interpolated. No operator input is ever emitted as executable code.
  const script = `(function () {
  var payload = ${scriptJson(payload)};
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      var channel = new BroadcastChannel(${scriptJson(OAUTH_CHANNEL)});
      channel.postMessage(payload);
      window.setTimeout(function () { channel.close(); }, 150);
    }
  } catch (error) {}
  try {
    if (window.opener && window.opener !== window) {
      window.opener.postMessage(payload, window.location.origin);
    }
  } catch (error) {}
  if (${scriptJson(success)}) {
    window.setTimeout(function () { try { window.close(); } catch (error) {} }, 400);
  }
})();`

  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(copy.title)}</title>
<style>
:root { color-scheme: light dark; }
* { box-sizing: border-box; }
body {
  margin: 0; min-height: 100vh; display: grid; place-items: center;
  background: #0f1115; color: #e6edf3;
  font: 14px/22px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}
main { width: min(380px, calc(100vw - 32px)); padding: 24px; border: 1px solid #30363d; border-radius: 12px; background: #161b22; }
h1 { margin: 0 0 8px; font-size: 18px; line-height: 26px; }
p { margin: 0 0 16px; color: #c9d1d9; font-size: 13px; line-height: 20px; }
p.hint { color: #8b949e; font-size: 12px; }
button {
  width: 100%; padding: 8px 14px; border: 1px solid #2f81f7; border-radius: 8px;
  background: #2f81f7; color: #fff; font: inherit; font-weight: 500; cursor: pointer;
}
button:hover { background: #388bfd; }
@media (prefers-color-scheme: light) {
  body { background: #f6f7f9; color: #0f1115; }
  main { background: #fff; border-color: #d7dbe0; }
  p { color: #3c4149; }
  p.hint { color: #61666b; }
}
</style>
</head>
<body>
<main>
  <h1>${escapeHtml(copy.title)}</h1>
  <p>${escapeHtml(detail)}</p>
  <p class="hint">${success ? '若窗口没有自动关闭，可点击下方按钮返回。' : '关闭此窗口即可回到原页面重试。'}</p>
  <button type="button" onclick="try { window.close(); } catch (error) {}">关闭窗口</button>
</main>
<script>
${script}
</script>
</body>
</html>
`
}
