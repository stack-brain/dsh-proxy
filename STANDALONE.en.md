# dsh-proxy standalone executables (go/ and node/)

[Back to overview](../README.md) · [中文](STANDALONE.md)

Alternative when you do not use DSH or need a separate process: two equivalent single-file builds (interactive start, config memory, non-interactive CLI flags). **Basic Auth only — the plugin edition's third-party sign-in is not included.**

> Note: the standalone builds share the same proxy core with the DSH plugin, but ship **without** third-party sign-in — that is exclusive to the DSH plugin (`dsh-proxy/`), which relies on the DSH settings page for channel configuration and account binding. The standalone builds provide only the browser's native Basic Auth gate.

## Download & install

Grab the single executable for your platform from [GitHub Releases](https://github.com/stack-brain/dsh-proxy/releases) (Go ~6-7 MB / Node ~80-120 MB), put it anywhere and run it; on macOS/Linux `chmod +x` first.

| Directory | Language | Single-file size | Notes |
|---|---|---|---|
| [`go/`](../go/) | Go (static) | 6-7 MB | Lightweight; Go standard library, ~95% smaller, recommended |
| [`node/`](../node/) | Node.js (SEA) | 83-119 MB | Original; packaged with Node's official SEA, no Node install needed |

## Features

- HTTP + WebSocket reverse proxy (Go uses stdlib `httputil.ReverseProxy`, native WS upgrade support)
- Basic Auth (default `admin/admin`, checked uniformly on HTTP and WS handshakes; public static assets such as `/manifest.webmanifest` bypass auth so the browser does not get a 401 when fetching the manifest)
- Origin alignment + Host rewrite (passes DSH's `/api` same-origin check, so LAN WebSocket is not 403)
- `crypto.randomUUID` polyfill injected into HTML (real-time channels work in non-secure LAN contexts)
- dsh 0.1.1+ client loopback-trust patch: rewrites served JavaScript so the settings Models page no longer reports "settings are unavailable in this browser" over the LAN (same behavior as the plugin variant)
- Interactive start: 4 pre-filled editable fields (source port 3080 / target port 3081 / admin / admin), **ports and credentials are editable**
- Config memory: `config.json` next to the executable, pre-filled on next start
- Non-interactive CLI flags (for scheduled tasks / automation): `dsh-proxy --source-port 3080 --target-port 3081 --user admin --pass admin`

## Build

```bash
# Node build (output in node/dist/)
cd node
npm install
npm run build          # all 5 platforms (downloads the Node binary on first run, cached in .sea-cache/)
npm run build:win      # Windows only

# Go build (output in go/dist/, no Go runtime needed)
cd go
./build.ps1            # all 5 platforms
./build.ps1 -Target win-x64
```

Artifacts (5 platforms each for both versions: `win-x64`, `linux-x64`, `linux-arm64`, `macos-x64`, `macos-arm64`):
- Node: `dsh-proxy-<platform>` (e.g. `dsh-proxy-win-x64.exe`)
- Go: `dsh-proxy-go-<platform>` (e.g. `dsh-proxy-go-win-x64.exe`, avoids colliding with the Node name)

On macOS/Linux, `chmod +x` the file first.

The version shown in the startup banner is injected at build time: CI takes the tagged version (e.g. `v1.1.0`); local builds may pass `-Version` (Go) or `--version` (Node), defaulting to the latest git tag.

## Verification

```bash
# Non-interactive start (example port 3091)
./dsh-proxy-win-x64.exe --source-port 3080 --target-port 3091 --user admin --pass admin

# No credentials → 401; with credentials → 200
curl -i http://127.0.0.1:3091/
curl -u admin:admin http://127.0.0.1:3091/

# WebSocket handshake → OPEN
node -e "const ws=new WebSocket('ws://127.0.0.1:3091/api/events.mux',{headers:{Authorization:'Basic '+Buffer.from('admin:admin').toString('base64')}});ws.onopen=()=>{console.log('OPEN');ws.close()}"
```
