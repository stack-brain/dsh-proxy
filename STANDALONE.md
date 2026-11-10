# dsh-proxy 独立可执行版本（go/ 与 node/）

[回到总览](../README.md) · [English](STANDALONE.en.md)

不使用 DSH、或需要独立进程时的备选方案：两个等价的单文件版本（交互式启动、配置记忆、CLI 免交互参数）。**仅支持 Basic Auth，不含 DSH 插件版（`dsh-proxy/`）的三方认证登录。**

> 说明：独立版与 DSH 插件版共用同一套代理核心，但**不包含第三方认证登录**——那是 DSH 插件版的专属能力（依赖 DSH 设置页进行渠道配置与账号绑定）。独立版只提供浏览器原生 Basic Auth 闸门。

## 下载安装

从 [GitHub Releases](https://github.com/stack-brain/dsh-proxy/releases) 下载对应平台的单个可执行文件（Go 版约 6-7 MB / Node 版约 80-120 MB），放到任意目录直接运行；macOS/Linux 先 `chmod +x`。

| 目录 | 语言 | 单文件体积 | 说明 |
|---|---|---|---|
| [`go/`](../go/) | Go（静态编译） | 6-7 MB | 轻量版；Go 标准库实现，体积小 95%，推荐 |
| [`node/`](../node/) | Node.js（SEA 打包） | 83-119 MB | 原版；用 Node 官方 SEA 打包，无需安装 Node |

## 功能

- HTTP + WebSocket 反向代理（Go 版用标准库 `httputil.ReverseProxy`，原生支持 WS 升级）
- Basic Auth（默认 `admin/admin`，HTTP 与 WS 握手统一校验；公开静态资源如 `/manifest.webmanifest` 免认证，避免浏览器抓取 manifest 时报 401）
- Origin 对齐 + Host 改写（通过 DSH `/api` 同源校验，LAN 访问 WS 不 403）
- HTML 注入 `crypto.randomUUID` polyfill（LAN 非安全上下文下实时通道可用）
- dsh 0.1.1+ 客户端 loopback 信任补丁：重写所服务的 JS，使设置页模型列表等在 LAN 访问下不再报 "settings are unavailable in this browser"（与插件版行为一致）
- 交互式启动：4 项配置预填可编辑（源端口 3080 / 目标端口 3081 / admin / admin），**端口与账号密码均可手动修改**
- 配置记忆：`config.json` 存于可执行文件同目录，下次启动自动预填
- CLI 免交互参数（供计划任务/自动化）：`dsh-proxy --source-port 3080 --target-port 3081 --user admin --pass admin`

## 构建

```bash
# Node 版（产物在 node/dist/）
cd node
npm install
npm run build          # 全部 5 个平台（首次需下载 Node 二进制，之后缓存于 .sea-cache/）
npm run build:win      # 只构建 Windows

# Go 版（产物在 go/dist/，无需安装 Go 运行时）
cd go
./build.ps1            # 全部 5 个平台
./build.ps1 -Target win-x64
```

产物清单（两个版本各 5 个平台：`win-x64`、`linux-x64`、`linux-arm64`、`macos-x64`、`macos-arm64`）：
- Node 版：`dsh-proxy-<平台>`（如 `dsh-proxy-win-x64.exe`）
- Go 版：`dsh-proxy-go-<平台>`（如 `dsh-proxy-go-win-x64.exe`，避免与 Node 版同名）

macOS/Linux 版传到对应系统后先 `chmod +x`。

启动横幅显示的版本号在打包时注入：CI 自动取标签版本（如 `v1.1.0`）；本地构建可用 `-Version`（Go）或 `--version`（Node）指定，缺省取最近 git 标签。

## 验证

```bash
# 免交互启动（示例端口 3091）
./dsh-proxy-win-x64.exe --source-port 3080 --target-port 3091 --user admin --pass admin

# 无凭据 → 401；带凭据 → 200
curl -i http://127.0.0.1:3091/
curl -u admin:admin http://127.0.0.1:3091/

# WebSocket 握手 → OPEN
node -e "const ws=new WebSocket('ws://127.0.0.1:3091/api/events.mux',{headers:{Authorization:'Basic '+Buffer.from('admin:admin').toString('base64')}});ws.onopen=()=>{console.log('OPEN');ws.close()}"
```
