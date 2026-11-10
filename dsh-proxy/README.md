# dsh-proxy

A DeepSeek Harness plugin that exposes the local DSH web app (default `127.0.0.1:3080`) on a **second, authenticated port** for LAN access.

- **HTTP + WebSocket reverse proxy** — real-time streams keep working.
- **A choice of gates** — by default a **self-contained login page + session cookie**, optionally with **third-party sign-in** (GitHub / Google / Feishu / Casdoor); set `cleartextAuth: 'basic'` to use the browser's native Basic Auth dialog instead. Username and password default to empty (open LAN access: anyone who can reach the port is in, with a prominent warning); password login turns on **only when both are set**.
- **A popup on every page load while it is open** — when the proxy is actually listening on a network address with no password, the browser half raises a frame-wide notice ("⚠️ The LAN proxy is open without a password") naming the exposed address and the consequence; startup logs a SECURITY WARNING and the settings page flags password login in red as well. Behavior is unchanged; the open state just stops being silent. The notice keeps **no memory at all** — "Got it" closes only the current one, and the next open/refresh warns again, because an unauthenticated network listener is a standing risk rather than a one-off event.
- **Login page + sessions (HTTPS)** — behind a TLS reverse proxy, an unauthenticated visitor gets a self-contained login form; a successful login issues a session cookie (`__Host-` + `Secure` + `HttpOnly` + `SameSite=Strict`) with **logout, idle/absolute expiry, and a live session list you can revoke**
- **One gate, including cleartext** — an `http://` LAN-IP visitor gets the **same login page** by default; because a `Secure`/`__Host-` cookie is never stored over http, that session uses a weaker cookie variant and both the settings page and the startup log say so. Set `cleartextAuth: 'basic'` to restore the native Basic dialog, or `requireTls: true` to refuse cleartext outright
- **Login throttling + audit** — failures are counted per source IP (5 tries, 15-minute lockout; the correct password is refused while locked) and every login/failure/lockout/logout is appended to `dsh-proxy-audit.jsonl` in **the current profile's private state directory** with **no credentials**
- **Settings page** — DSH settings → "LAN Proxy": shows the running ports and whether password login is enabled, **starts/stops the proxy**, and edits the proxy listen port, username, and password; saving persists the patch to `dsh-proxy.yaml` in **the current profile's private state directory** and immediately restarts the forwarding service.
- **Isolated per profile** — each profile keeps its own state files under `$DSH_HOME/profiles/<profile>/dsh-proxy/`, so changing the port or credentials in one profile never affects another; `stateScope: home` restores the legacy shared files.
- **Out-of-the-box compatibility fixes** — `Host`/`Origin` rewriting (passes the DSH `/api` same-origin trust fence from the LAN) and a `crypto.randomUUID` polyfill injected into proxied HTML (non-secure LAN contexts lack it, which would break every RPC).
- **In-browser directory picker** — DSH mounts the OS chooser whenever the web app is loopback-bound (`dsh-host-directory-picker-auto`'s rule), so "add workspace" would open a dialog on the HOST screen that a remote visitor cannot see. The bundle disables the `auto` row so the in-app browse interaction is what renders on any device; the carrier supplies the browse backend itself (DSH Desktop injects `desktop-directory-picker-browse-host` on Windows). The plugin deliberately does **not** mount the browse pair, because a second row providing `directoryPicker` aborts the boot.
- **Lives inside `dsh web`** — no separate process; configured through the profile's `cordis.patch.yml`.

> Why: the DSH web server deliberately refuses `--host 0.0.0.0` (it would expose remote code execution to the network). This plugin is the sanctioned way out: a separate authenticated listener that proxies back to loopback.
>

## Install

**Online install (recommended)** — directly from GitHub, no need to download the repository:

```bash
dsh plugin --profile web add github:stack-brain/dsh-proxy#master
```

**Local install** (repository cloned/downloaded on this machine):

```bash
dsh plugin --profile web add file:C:/mydata/codes/dsh-proxy
```

The installed package is **`@stack-brain/dsh-proxy`** (scoped, with the username prefix) and shows up as `@stack-brain/dsh-proxy@1.0.1` in `dsh plugin ls`.

Then **restart `dsh web`**. If port 3081 is taken (e.g. another dsh-proxy instance is still running), stop it first or change `listenPort` below.

## Configuration

All knobs have schema defaults; override them in the **profile's `cordis.patch.yml`** (a patch replaces the row's whole config, so restate every key you change):

```yaml
# C:\Users\cc\.dsh\profiles\web\cordis.patch.yml
- id: dsh-proxy
  config:
    listenHost: '0.0.0.0'      # bind interface; 0.0.0.0 = LAN reachable
    listenPort: 3081            # proxy port (default 3081)
    upstreamHost: '127.0.0.1'   # upstream DSH host
    upstreamPort: 0             # 0 = follow the web app's actual bound port
    username: ''                # login username (default empty = password login off)
    password: ''                # login password (default empty = password login off)
    stateScope: 'profile'       # state files: profile (default, isolated) | home (legacy shared)
```

- Default `username` and `password` are both empty = **password login off**: anyone who can reach the port gets straight in (open LAN access — not recommended). Password login turns on **only when both are set**; setting just one keeps it off.
- Listening itself is unchanged by missing credentials: `listenHost: '0.0.0.0'` still binds the LAN, so you can reach the settings page from another device and set the credentials there. What changes is that this "network-reachable and password-free" state is now **stated loudly** — a one-time popup in the web UI, a startup SECURITY WARNING, a red banner in the settings page, and the `lanExposed` field on the status endpoint.
- The popup rides the framework's `shell.overlay` seat: it is **not a modal** (the app stays usable; only the card takes clicks) and it asks the status endpoint at most once per page load.
- Repeat policy: **every page load** (open or refresh) re-warns; nothing is written to `localStorage` and there is no "already seen" state, so the dismissal cannot silence it. Within one page load the status endpoint is still queried at most once (a remounting frame must not turn the alert into a poll).

## Third-party login (GitHub / Google / Feishu / Casdoor)

In addition to the local username/password, OAuth sign-in can be enabled. **Every channel is OFF by default**; with no `oauth` config the plugin behaves exactly as before.

- **Official endpoints by default**: GitHub / Google / Feishu need only `clientId` + `clientSecret` — authorize, token and userinfo URLs come from each platform's official defaults. In the settings page, each channel's "auth center URL" placeholder shows **that platform's own official default authorize endpoint** rather than a shared example domain.
- **Unified auth center**: setting `oauth.authCenter.baseUrl` to a self-hosted Casdoor replaces the endpoints of all three channels; `providers.<id>.baseUrl` replaces just one, and `providers.<id>.endpoints` overrides individual URLs. Precedence: explicit per-provider endpoints > per-provider baseUrl > shared center > official defaults.
- **`provider_hint` for custom endpoints**: when a channel such as GitHub points at a self-hosted Casdoor, set `providers.<id>.providerHint` to the Casdoor provider name (`github` is typical). The authorize request then carries `provider_hint=<value>` so Casdoor jumps straight to that provider instead of showing its chooser. Leave it blank and the parameter is **not sent at all** — official endpoints behave exactly as before. The field lives in the channel's **main configuration block**, the effective `provider_hint=<value>` is echoed below the resolved URL, and it applies to both sign-in and binding flows.
- **Built-in Casdoor channel**: the fourth provider signs in with Casdoor accounts directly; it requires a `baseUrl` (or falls back to `authCenter.baseUrl`).
- **Subject claims follow the endpoint source**: official channels use their own stable IDs (GitHub `id`, Google `sub`, Feishu `open_id`, …); a channel pointed at a self-hosted auth center is read as an OIDC document (`sub`, with `id` / `open_id` as fallbacks). Emails and display names are never used as binding keys.
- **Only enabled channels appear on the login page**: enable GitHub + Feishu and exactly those two inline-SVG icon buttons render; disabled channels never appear. Authorization and binding both finish in a **popup window** — the current page never navigates. They are hidden under `cleartextAuth: 'basic'` (the settings page explains why).
- **Popup lifecycle**: **only success** (sign-in `ok` / binding `bound`) auto-closes the popup; failures stay open so the reason can be read. On success the opener navigates to the default page `/` (a live session revisiting the login path is redirected there too). While waiting, the opener shows a pending state with a **Cancel authorization** action; cancellation or the **3-minute timeout** closes the popup, stops the status polling, and discards any late success result so it cannot navigate afterwards.
- **Only manually bound accounts may sign in**: passing the IdP is not enough — the `(provider, subject)` pair must exist in the binding table, otherwise the sign-in is refused and audited. A successful third-party sign-in issues the **same session cookie** as a password login, with logout, expiry and the live session list. Bindings are started from the settings page with a one-shot ticket; **unbinding requires a second confirmation** and takes effect immediately.
- **No authentication method (option A)**: with neither a password nor an enabled provider, the existing open-access + warning posture is kept, but no login entry is rendered and every OAuth/binding route is refused with 403.

### Configuration examples (profile's `cordis.patch.yml`)

Shape A · GitHub only, official endpoints:

```yaml
- id: dsh-proxy
  config:
    listenHost: '0.0.0.0'
    listenPort: 3081
    upstreamHost: '127.0.0.1'
    upstreamPort: 0
    username: 'admin'
    password: 'your-password'
    stateScope: 'profile'
    oauth:
      enabled: true
      providers:
        github:
          enabled: true
          clientId: 'Iv1.xxxxxxxx'
          clientSecret: 'xxxxxxxx'
```

Shape B · replace all three channels' endpoints with a self-hosted Casdoor:

```yaml
    oauth:
      enabled: true
      authCenter:
        baseUrl: 'https://casdoor.internal.example.com'
      providers:
        # providerHint makes Casdoor jump straight to that provider's chooser-free login
        github: { enabled: true, clientId: 'Iv1.xxxxxxxx', clientSecret: 'xxxxxxxx', providerHint: 'github' }
        feishu: { enabled: true, clientId: 'cli_xxxx', clientSecret: 'xxxx', providerHint: 'feishu' }
```

Shape C · sign in with Casdoor accounts directly:

```yaml
    oauth:
      enabled: true
      providers:
        casdoor:
          enabled: true
          clientId: 'xxxxxxxx'
          clientSecret: 'xxxxxxxx'
          baseUrl: 'https://casdoor.internal.example.com'
```

> A `cordis.patch.yml` patch replaces the row's WHOLE config, so restate every key you rely on (`username` / `password` / `stateScope`). Omitted channel fields fall back to the schema defaults (off, empty credentials).

### Deployment checklist

1. Create an OAuth app at each IdP / Casdoor and register `<external-proxy-origin>/__dsh-proxy/oauth/<github|google|feishu|casdoor>/callback`. **The callback host and port follow the address the browser actually used to reach the proxy** (e.g. `http://127.0.0.1:3081/...`, `http://192.168.1.5:3081/...`) — no hardcoded host. A direct loopback connection is plain `http://`, NOT `https://`. The settings page shows the callback URI derived from its own domain + the proxy's real listen port, ready to copy. Only pin `oauth.publicOrigin` / `providers.<id>.redirectUri` when a TLS reverse proxy's external name cannot be inferred from the request.
2. Custom endpoints must be `https` (plain `http` is allowed only for localhost development); add the TLS reverse proxy to `trustedProxies` and make it forward `X-Forwarded-Proto`, which decides whether the callback is `https` or `http`.
3. Restart `dsh web`; the startup log prints the live channels and state directory and **never** prints `clientSecret`.
4. DSH settings → "LAN Proxy" → "Third-party login" shows/edits the config, resolved endpoints and redirect URIs. `clientSecret` is a masked input prefilled exactly like the password field, and is never written to the audit log. For Casdoor-style custom endpoints, set the Provider Hint in the channel's **main configuration block**; the effective `provider_hint=<value>` is shown below the resolved URL, and a blank value sends no parameter at all.
5. **Bind before signing in**: use "Bind GitHub" (etc.) under "Account bindings" once; only those accounts can then sign in. Unbinding requires a second confirmation. For a deployment with no local password and no reachable settings page, `oauth.bootstrapBindings` can declare initial bindings (written once, only while the table is empty).
6. The config overlay and binding table persist in the current profile's private `dsh-proxy-oauth.yaml`; they survive restarts and stay isolated per profile.
7. **Common failures**: `invalid_client` (HTTP 401) at the token exchange almost always means the Client ID / Client Secret does not match that Casdoor application; "cannot identify a stable subject" means the custom userinfo document lacks the expected `sub` / `id`; always register the **actual current callback URI** shown in the settings page (a direct loopback visit is `http://127.0.0.1:3081/...`).

### Per-profile isolation

The four persisted state files (runtime settings / login audit / transport policy / third-party login config + bindings) live in **the current profile's private directory**, so one profile's settings page never changes another's. The three **config files** are YAML (readable and hand-editable); the audit trail stays an append-only JSON Lines event stream, not a config — one self-contained line per event lets a torn tail be skipped:

```
~/.dsh/
├── dsh-proxy.json                  ← legacy shared JSON: migration source only, kept for rollback
├── dsh-proxy-audit.jsonl
├── dsh-proxy-security.json
└── profiles/
    ├── web/dsh-proxy/             ← private to web (legacy JSON converted to YAML)
    │   ├── dsh-proxy.yaml
    │   ├── dsh-proxy-audit.jsonl
    │   ├── dsh-proxy-security.yaml
    │   └── dsh-proxy-oauth.yaml
    └── desktop/dsh-proxy/         ← private to desktop, never read by web
        └── ...
```

- On the first start of a profile, the legacy home-root files are **migrated** into its private directory (only while that directory has no state files yet); old `.json` configs are converted to readable `.yaml` on the way. From then on, changing the port or credentials affects only that profile, and each profile keeps its own audit trail. The legacy files stay in place for rollback.
- A legacy JSON config is also read once in place and rewritten as its `.yaml` successor (the old file is not deleted), so an upgrade cannot lose ports, passwords, OAuth config or bindings. YAML 1.2 is a JSON superset, so hand-written JSON inside a `.yaml` file still parses.
- To restore the old "one shared set for every profile" behaviour, set `stateScope: home` on the `dsh-proxy` row in that profile's `cordis.patch.yml`.
- `$DSH_HOME` still applies. If the host's `ctx.baseUrl` cannot be resolved to a profile directory, the plugin **falls back** to the shared home and logs a warning instead of failing to load; the "state directory" startup log line shows the effective path.
- ⚠️ **Ports are not staggered automatically**: `listenPort` still defaults to 3081. Running two profiles' `dsh web` at the same time makes the second bind fail (the controller degrades gracefully and never takes the web app down; the log explains why). Give each profile a different `listenPort` in its `cordis.patch.yml`, or change it in each settings page.

### Exposed endpoints

All auth endpoints live under the proxy-fronting prefix `/__dsh-proxy/` and need no extra port; the OAuth callback is hit directly by the IdP, so it must be reachable at the external/LAN address you register:

| Endpoint | Method | Purpose |
|---|---|---|
| `/__dsh-proxy/login` | GET | The login page (any unauthenticated path also renders the same page) |
| `/__dsh-proxy/logout` | GET | Log out, clears the current session cookie |
| `/__dsh-proxy/oauth/<id>/start` | GET | Begin **sign-in**: 302 to the IdP authorize page (with PKCE + state) |
| `/__dsh-proxy/oauth/<id>/bind/start` | GET | Begin **binding**: requires the one-shot `ticket` from settings (`?ticket=`) |
| `/__dsh-proxy/oauth/<id>/callback` | GET | **Callback**: IdP redirects here; `code` → token → userinfo → issue/bind session |

`<id>` is the channel: `github` / `google` / `feishu` / `casdoor`. The redirect URI to register at the IdP is exactly `<proxy-external-origin>/__dsh-proxy/oauth/<id>/callback` — by default it **follows the domain and port the browser actually used to reach the proxy** (e.g. `http://192.168.1.5:3081/...`; a direct loopback is `http://127.0.0.1:3081/...`), so no hardcoded host is needed. Only pin `oauth.publicOrigin` when a TLS reverse proxy's external name cannot be inferred from the request.

### Authorization flow

1. **Create the IdP app**: register a new OAuth app at GitHub / Google / Feishu / Casdoor, with the redirect URI above (the "Third-party login" settings page shows the copy-ready URI from the current domain + the proxy's real port).
2. **Enable and configure the channel**: DSH settings → LAN Proxy → Third-party login, enter the `clientId` / `clientSecret` (official endpoints need only these two), and turn the channel on; for a self-hosted Casdoor also set `baseUrl` (or `authCenter.baseUrl`).
3. **Bind before signing in**: under "Account bindings" click "Bind GitHub" (etc.) → a popup goes through `/oauth/<id>/bind/start` + `callback` and writes `(channel, stable subject)` into the binding table. An account that passes the IdP but is not bound is refused.
4. **Sign in**: visit `http://<LAN-IP>:3081/`; the login page shows inline buttons only for enabled channels. Clicking one opens a popup to `/oauth/<id>/start` → IdP authorize → back to `callback`, which exchanges `code` for a token, reads the user info, checks the binding, and issues the same session cookie as a password login; the popup closes and the opener navigates to `/`.
5. **Session management**: after sign-in, the settings page lists active sessions, and you can log out or revoke one; under `cleartextAuth: 'basic'` there is no session/logout concept.

## Settings page (port / credentials / start-stop)

After restarting `dsh web`, open DSH settings (gear icon) → "LAN Proxy":

- **Status**: two red/green running lights — the **proxy port** (listen address:port; green = the proxy is actually bound, red = bind failed e.g. port busy) and the **default service port** (DSH service port; green = the default service answers a probe, red = unreachable) — plus the current username and whether password login is enabled. A **Start/Stop** button pair sits in the card header: Start is grayed out while running, Stop is grayed out while stopped.
- **Edit settings**: change the **proxy listen port**, **username**, and **password** (leave empty to set blank). "Apply" writes `dsh-proxy.yaml` in **the current profile's private directory** (`$DSH_HOME/profiles/<profile>/dsh-proxy/`) and **immediately restarts the forwarding service**; changing the listen port moves the LAN access address.

Settings-page changes persist to the current profile's private directory (isolated from other profiles) and take precedence over the profile's `cordis.patch.yml`; `listenHost` / `listenPort` remain cordis-only. The page talks to the host through an exact `POST /api/dsh-proxy` route on Connection's shared `/api` channel (`status` / `update` / `start` / `stop` endpoints); Connection owns the request-trust fence and the browser session check (still reachable from the LAN via the proxy's Host rewrite).

## Usage

1. Restart `dsh web`; the startup log prints the URLs:
   ```
   dsh-proxy: listening on 0.0.0.0:3081 -> http://127.0.0.1:3080
   dsh-proxy: 局域网访问 http://192.168.1.100:3081
   ```
2. Browse to `http://<your-LAN-IP>:3081` → the **self-contained login page**: enter the username/password, or click an enabled third-party channel to authorize in a popup → on success the opener navigates to `/`. Only `cleartextAuth: 'basic'` switches back to the browser's native Basic Auth dialog.
3. Other LAN devices use the same address; a successful login holds a session cookie, so no repeat sign-in is needed until it expires.

> DSH's own browser session: the Web UI also requires a session cookie minted from the per-process launch token, and the `?token=...` URL `dsh web` prints points at loopback — useless for a LAN device. The plugin completes that exchange for the address you actually used (an unauthenticated `GET /` is answered with a 302 to `http://<your-address>:<port>/?token=...`, which sets the cookie and bounces back to a clean `/`), so a first LAN visit needs no manual token copying. Just open the URL above.

> Windows Firewall: if LAN devices cannot connect, allow the port (admin PowerShell):
> `netsh advfirewall firewall add rule name="dsh-proxy" dir=in action=allow protocol=TCP localport=3081`

## Development

```bash
pnpm install
pnpm run check   # typecheck + test + build
pnpm run smoke   # full live smoke test against a running DSH on 127.0.0.1:3080
```

- `src/` — TypeScript source. `src/proxy.ts` is the pure-node proxy core (no cordis, independently testable); `src/state-dir.ts` resolves the profile-private state directory from `ctx.baseUrl` and performs the one-time legacy migration; `src/controller.ts` is the proxy controller (start/stop/restart/status/update plus settings persistence); `src/index.ts` is the cordis plugin entry (including the `/api/dsh-proxy` exact route), `src/client/transport.ts` is the browser-side caller; `src/client/` is the browser settings section.
- `lib/` — committed build artifacts; `lib/index.cjs` is a fully self-contained host bundle (schemastery, http-proxy, dsh-home-paths inlined) and `lib/client.js` the browser bundle (react only external).
- `tests/` — vitest: auth primitives, pure functions, proxy integration (HTTP + WebSocket), the controller against a real in-process upstream with a temp settings file, and a jsdom render of the settings section.

## Troubleshooting

Why the plugin tree can fail to load in some environments (for example
`service "directoryPicker" has been registered`), how to confirm it, and how to
fix it: see [`docs/troubleshooting.md`](docs/troubleshooting.md) (written in Chinese).

## Authentication details

- **Enablement**: password login is active only when `username` AND `password` are both non-empty (defaults are empty = open access); setting just one keeps it off. Enabling any third-party provider also turns the gate on.
- **Exposure flag**: `status.lanExposed` is `true` exactly when the listener is up, bound to a non-loopback host, and password login is off — i.e. the LAN surface is open. The web popup, the settings page's red badge and warning, and the host's SECURITY WARNING all read this one flag. It describes risk only; it never changes what is bound.
- **One mechanism, two cookie strengths**: TLS (`X-Forwarded-Proto: https` from a trusted peer) or a loopback browser → login page with a `__Host-`+`Secure` cookie; a plain-HTTP LAN IP → the **same login page** with a non-`Secure` cookie (a `Secure` cookie would not be stored), or Basic when `cleartextAuth: 'basic'`. `X-Forwarded-Proto`/`X-Forwarded-For` are honored **only from a trusted peer** (loopback always, plus `trustedProxies`), so forged headers cannot bypass the throttle.
- **Sessions and third-party sign-in**: server-held 32-byte tokens, 7-day absolute and 12-hour idle expiry, dropped on restart; the settings page lists them and can revoke one or all others. The cookie is `__Host-dsh_proxy_session` in a secure context and `dsh_proxy_session` on cleartext (no `Secure`/`__Host-`, which http cannot store). A successful third-party sign-in issues **the same session cookie** as a password login. With neither a password nor an enabled provider, the open-access posture is kept.
- **Login page and CSP**: a server-rendered, self-contained HTML document with `no-store`, `no-referrer`, `X-Frame-Options: DENY` and a strict `default-src 'none'` CSP (all external resources blocked). **Only when third-party channels are enabled** does it carry one static inline script that opens a script-closable authorization popup, receives the same-origin `BroadcastChannel` result, and offers cancellation plus the 3-minute timeout; the CSP allows inline scripts for this, every interpolation is server-side escaped, and login/logout keep their same-origin checks. With no third-party channels the login page remains JavaScript-free.
- **Public static files**: `/manifest.webmanifest` and `/favicon.svg` bypass the gate — browsers fetch them in credential-less contexts (PWA manifest, favicon), so requiring authentication would 401 them. They carry no secrets.
- Credential comparison is constant-time (`timingSafeEqual`).

## Security notes

- **The LAN surface is OPEN by default** (empty username/password). Set **both** credentials in the settings page as soon as possible — the page marks this state in red and the startup log warns about it.
- The warning is deliberately tied to the real condition: a loopback-only bind is not flagged (no exposure), and neither is a stopped service.
- Once password login is enabled, DSH's `/api` trust fence sees the rewritten loopback `Host`, so **privileged RPCs (settings/credentials) are reachable from the LAN** — at least one of the login-page session, third-party sign-in, or Basic Auth must be enabled to be a real barrier.
- Third-party sign-in is a **whitelist**: passing the IdP is not enough, a manual binding must exist or the account is refused; unbinding needs a second confirmation, so review the binding table periodically.
- Only in `cleartextAuth: 'basic'` mode are browser-cached Basic credentials NOT invalidated by a password change: the old credentials get a 401 and the dialog reappears; enter the new password. To fully clear them, remove the site's saved password in the browser.
