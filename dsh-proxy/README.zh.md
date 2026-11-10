# dsh-proxy

DSH 插件：把 DeepSeek Harness Web 界面（默认 `127.0.0.1:3080`）转发到**另一个带认证的端口**，让同一局域网内的其他设备也能安全访问。

- **HTTP + WebSocket 全协议转发**：任务状态、日志等实时推送不失效
- **认证闸门可选**：默认走**自带登录页 + 会话 Cookie**，并可同时启用**第三方登录**（GitHub / Google / 飞书 / Casdoor）；把 `cleartextAuth` 设为 `basic` 可改用浏览器原生 Basic Auth 弹窗。默认用户名与密码均为空 = 局域网**开放访问**（能连上就直接进，并给出显著风险提示）；只有**同时设置**用户名和密码才启用密码登录
- **未设密码的风险提示**：当代理真的对外监听、又没有密码时，插件的浏览器端会在**每次打开/刷新页面时弹出醒目浮层**（标题「⚠️ 局域网代理当前无密码对外开放」，写明暴露地址与后果），同时在启动日志打印 SECURITY WARNING，设置页把「密码登录」标记为红色「未启用（局域网开放访问）」并给出风险说明——行为不变，但不会再"悄悄地"开放。**浮层不做任何持久化记忆**："我知道了"只关闭当前这一次，下次刷新照样提醒——未认证的对外监听属于持续存在的安全风险，不应该被一次性关掉就永远静默
- **登录页 + 会话（HTTPS 场景）**：经反向代理走 HTTPS 时，未登录访客看到自带登录页；登录后签发会话 Cookie（`__Host-` + `Secure` + `HttpOnly` + `SameSite=Strict`），支持**登出、空闲/绝对过期、查看并踢出活动会话**
- **明文也能用登录页（默认统一）**：`http://局域网IP` 默认同样走登录页；明文下会话 Cookie 无法带 `Secure`/`__Host-`（浏览器不存），因此会下发较弱的一个变体，设置页与启动日志都会明确提示；想换回原来的 Basic 弹窗，把 `cleartextAuth` 设为 `basic` 即可，`requireTls: true` 则可彻底拒绝明文
- **登录限流与审计**：按来源 IP 计失败次数（默认 5 次锁 15 分钟），锁定期间即使密码正确也拒绝；登录/失败/锁定/登出/踢出等事件写入**当前 profile 私有目录**的 `dsh-proxy-audit.jsonl`（不含任何密码）
- **设置页面**：DSH 设置 → 「局域网代理」，显示监听端口/默认服务端口/**密码登录是否启用**，可修改代理监听端口、用户名、密码，可**启动/停止**代理，保存后自动重启转发服务（持久化到**当前 profile 私有目录**的 `dsh-proxy.yaml`）
- **多 profile 互不影响**：每个 profile 各存一份状态文件（`$DSH_HOME/profiles/<profile>/dsh-proxy/`），在一个 profile 改端口或账号密码不会波及其它 profile；可用 `stateScope: home` 回到旧的全局共享模式
- **开箱即通的兼容修复**：`Host`/`Origin` 改写（通过 DSH `/api` 同源信任篱笆，LAN 访问不 403）、`crypto.randomUUID` polyfill 注入（LAN 非安全上下文下前端 RPC 可用）
- **浏览器内的目录选择器**：DSH 默认会在「Web 只绑 loopback」时选用**宿主屏幕上的原生目录对话框**（`dsh-host-directory-picker-auto` 的判定），远程访问者看不到那个窗口。本 bundle 关闭 `auto` 行，让**应用内浏览选择器**在任何设备上生效；browse 后端由载体自行提供（DSH Desktop 在 Windows 下注入 `desktop-directory-picker-browse-host`）。插件**刻意不挂载** browse 组合——第二个提供 `directoryPicker` 的行会让启动直接报错失败
- **随 `dsh web` 启停**：无需单独进程，配置改在 profile 的 `cordis.patch.yml`

> 为什么需要它：DSH Web 服务端**故意拒绝** `--host 0.0.0.0`（避免把 RCE 直接暴露到网络），本插件是官方认可的"出网"方式——独立监听端口 + 认证 + 反代回 loopback。
>

## 安装

**在线安装（推荐）**——直接从 GitHub 安装（无需下载仓库）：

```bash
dsh plugin --profile web add github:stack-brain/dsh-proxy#master
```

**本地安装**（仓库已克隆/下载到本机）：

```bash
dsh plugin --profile web add file:C:/mydata/codes/dsh-proxy
```

安装后包名为 **`@stack-brain/dsh-proxy`**（scoped，带用户名前缀），`dsh plugin ls` 中显示为 `@stack-brain/dsh-proxy@1.0.1`。

安装后**重启 `dsh web`**（Ctrl+C 后重新运行）即生效。若 3081 被占用（例如另一个 dsh-proxy 实例还在运行），先停掉它，或在配置里换一个端口。

## 配置

所有配置项都有 schema 默认值；在 **profile 的 `cordis.patch.yml`** 里按行 id 覆盖（patch 会整体替换该行 config，因此要写全你要改的键）：

```yaml
# C:\Users\cc\.dsh\profiles\web\cordis.patch.yml
- id: dsh-proxy
  config:
    listenHost: '0.0.0.0'      # 监听网卡；0.0.0.0 = 局域网可访问
    listenPort: 3081            # 代理对外端口（默认 3081）
    upstreamHost: '127.0.0.1'   # 上游 DSH 地址
    upstreamPort: 0             # 0 = 跟随 web app 实际绑定的端口（默认）
    username: ''                # 登录用户名（默认空 = 密码登录关闭）
    password: ''                # 登录密码（默认空 = 密码登录关闭）
    stateScope: 'profile'       # 状态文件作用域：profile（默认，各 profile 独立）| home（旧的全局共享）
```

- 默认 `username` 与 `password` 均为空 = **密码登录关闭**，此时任何能连到代理端口的人都可以直接进入 DSH（局域网开放访问，谨慎）。**只有同时设置两者**才会启用密码登录（只设置其一仍保持关闭）。
- 监听行为**不会**因为没密码而改变：`listenHost: '0.0.0.0'` 依然照常对外监听，方便你先连上本机设置页再填账号密码；但插件会把这种"对外开放且无密码"的状态**显著标注出来**（浏览器端一次性弹层 + 启动日志 SECURITY WARNING + 设置页红色提示 + 状态接口的 `lanExposed` 字段）。
- 弹层使用框架预留的 `shell.overlay` 席位：**不是阻塞式弹窗**，不遮挡操作，只在卡片自身接受点击；每个页面加载最多查询一次状态。
- 提醒频率：**每次页面加载（打开/刷新）都提醒**，不写 `localStorage`、不做"已读"记忆；"我知道了"仅关闭本次。同一页面内组件重挂载不会重复请求状态（每次页面加载最多查一次接口）。
- 想验证"没被静音"：连点几次「我知道了」再刷新，浮层应照常出现。

## 第三方登录（GitHub / Google / 飞书 / Casdoor）

除本地用户名密码外，可启用第三方认证登录。**默认所有渠道关闭**，不配置时插件行为与旧版完全一致。

- **默认官方端点**：GitHub / Google / 飞书只需填 `clientId` + `clientSecret`，授权、令牌、用户信息地址自动取各平台官方地址，无需填 URL。设置页每个渠道的「该渠道认证中心地址」占位提示显示的是**该平台自己的官方默认授权地址**，不再统一显示示例域名。
- **统一认证中心替换**：`oauth.authCenter.baseUrl` 指向自建 Casdoor 后，三个渠道的地址整体改走该服务；某渠道路径不同可用 `providers.<id>.endpoints` 单独覆盖，或用 `providers.<id>.baseUrl` 只替换该渠道。优先级：渠道显式端点 > 渠道 `baseUrl` > 统一中心 > 官方默认。
- **自定义端点的 `provider_hint`**：把 GitHub 等渠道指向自建 Casdoor 时，在 `providers.<id>.providerHint` 填上 Casdoor 侧的 provider 名（GitHub 通常填 `github`），授权请求会附带 `provider_hint=<值>`，让 Casdoor 直接跳到对应渠道、不显示渠道选择页；留空则**不发送**该参数，官方端点行为完全不变。该输入框位于设置页**渠道配置主区域**，生效地址下方会回显 `provider_hint=<值>`，登录与绑定流程都生效。
- **Casdoor 独立渠道**：内置第四个 provider `casdoor`，可直接用 Casdoor 账号登录；必须配置 `baseUrl`（或回落到 `authCenter.baseUrl`）。
- **账号标识按端点来源解析**：官方渠道用各平台自己的稳定 ID（GitHub `id`、Google `sub`、飞书 `open_id` 等）；渠道指向自建认证中心时，按 OIDC 文档读取 `sub`（兼容 `id` / `open_id` 等）。邮箱、昵称等可变字段永远不会作为绑定键。
- **登录页只显示已启用的渠道**：开启 GitHub + 飞书就只出现这两个内联 SVG 图标按钮，未启用的渠道完全不展示。授权与绑定都在**新弹窗**中完成，原页面不跳转；`cleartextAuth: 'basic'`（原生 Basic 弹窗）下不显示，设置页会提示。
- **弹窗生命周期**：只有**成功**（登录 `ok` / 绑定 `bound`）才自动关闭弹窗，失败保持打开以便查看原因；成功后主页面跳转到默认页面 `/`（已持有有效会话再访问登录页也会 303 到 `/`）。等待期间主页面显示「正在等待第三方认证…」并提供**取消认证**；取消或 **3 分钟超时**都会关闭弹窗、结束状态轮询，并丢弃之后迟到的成功结果，不会误跳转。
- **只有手动绑定的账号能登录**：三方账号通过 IdP 认证后，还必须在「账号绑定」表中存在才会签发会话；未绑定一律拒绝并写审计。三方登录成功签发的是与密码登录**相同的会话 Cookie**，同样支持登出、过期与活动会话列表。绑定从设置页发起，走一次性票据；**解绑需要二次确认**，解绑后立即失效。
- **无认证方式时（方案 A）**：密码与 OAuth 都没配置时保持原有开放访问与警告姿态，但不渲染任何登录入口、所有三方登录/绑定路由一律 403 拒绝。

### 配置示例（profile 的 `cordis.patch.yml`）

形态 A · 只启用 GitHub（官方默认地址）：

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

形态 B · 三个渠道地址统一替换为自建 Casdoor（凭据不变）：

```yaml
    oauth:
      enabled: true
      authCenter:
        baseUrl: 'https://casdoor.internal.example.com'
      providers:
        # providerHint 让 Casdoor 直接跳到对应渠道，不显示渠道选择页
        github: { enabled: true, clientId: 'Iv1.xxxxxxxx', clientSecret: 'xxxxxxxx', providerHint: 'github' }
        feishu: { enabled: true, clientId: 'cli_xxxx', clientSecret: 'xxxx', providerHint: 'feishu' }
```

形态 C · 直接用 Casdoor 账号登录：

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

> `cordis.patch.yml` 的 patch 会**整体替换**该行 config，请写全你已有的键（如 `username` / `password` / `stateScope`）。未写出的渠道字段都走 schema 默认值（关闭、空凭据）。

### 部署检查清单

1. 在 IdP / Casdoor 创建 OAuth 应用，注册回调地址 `<代理外部地址>/__dsh-proxy/oauth/<github|google|feishu|casdoor>/callback`。**回调的域名和端口默认自动跟随浏览器当前访问代理时使用的地址**（如 `http://127.0.0.1:3081/...`、`http://192.168.1.5:3081/...`），无需写死 host；直连本机时是 `http://` 而不是 `https://`。设置页显示的回调地址来自当前设置页域名 + 代理实际监听端口，可直接复制注册。仅当 TLS 反向代理的外部域名无法从请求推断时，才用 `oauth.publicOrigin` 或 `providers.<id>.redirectUri` 固定外部地址。
2. 自定义端点要求 `https`（仅本机开发允许 `http://localhost`）；前面有 TLS 反代时把反代地址加入 `trustedProxies`，反代需透传 `X-Forwarded-Proto`，插件据此决定回调是 `https` 还是 `http`。
3. 重启 `dsh web`；启动日志打印生效渠道与状态目录，**不会**打印 `clientSecret`。
4. DSH 设置 → 「局域网代理」→「第三方登录」可查看/修改配置、生效端点与回调地址；`clientSecret` 与密码一样是掩码输入（值会预填、不显式展示），不写入审计日志。自定义端点走 Casdoor 时，在某渠道**配置主区域**填写 Provider Hint；生效地址下方会显示 `provider_hint=<值>` 便于核对，留空则不发送该参数。
5. **先绑定再登录**：在「账号绑定」点「绑定 GitHub」等按钮完成一次授权，此后只有这些账号能登录；解绑需二次确认。完全无本地密码且设置页不可达时，可用 `oauth.bootstrapBindings` 声明初始绑定（只在绑定表为空时写入一次）。
6. 配置与绑定表持久化到当前 profile 私有目录 `dsh-proxy-oauth.yaml`，重启仍生效，各 profile 互不影响。
7. **常见故障**：令牌交换报 `invalid_client`（HTTP 401）通常是 Client ID / Client Secret 与该 Casdoor 应用不一致；提示「无法识别该三方账号的稳定标识」通常是自定义端点的 userinfo 文档不含预期的 `sub` / `id`；注册回调时务必使用设置页显示的**当前实际地址**（直连本机是 `http://127.0.0.1:3081/...`）。

### 按 profile 隔离（多 profile 互不影响）

插件的四个运行时状态文件（设置覆盖层 / 登录审计 / 传输策略 / 第三方登录配置与账号绑定）默认写在**当前 profile 的私有目录**，每个 profile 各一份。三个**配置文件**是 YAML（可直接查看、手工编辑）；审计日志是 append-only 的 JSON Lines 事件流，不是配置，保持 `.jsonl` 以便逐行追加、跳过撕裂的尾行：

```
~/.dsh/
├── dsh-proxy.json                  ← 旧版共享 JSON：仅作首次迁移来源，保留不删
├── dsh-proxy-audit.jsonl
├── dsh-proxy-security.json
└── profiles/
    ├── web/dsh-proxy/             ← web 私有（旧 JSON 已转成 YAML）
    │   ├── dsh-proxy.yaml
    │   ├── dsh-proxy-audit.jsonl
    │   ├── dsh-proxy-security.yaml
    │   └── dsh-proxy-oauth.yaml
    └── desktop/dsh-proxy/         ← desktop 私有，与 web 互不读写
        └── ...
```

- 新版首次启动某个 profile 时，会把根目录下的旧文件**迁移**进该 profile 的私有目录（仅当私有目录里还没有任何状态文件），旧的 `.json` 配置在迁移时自动转成可读的 `.yaml`；之后在设置页改端口 / 账号密码只影响当前 profile，审计日志也各记各的。旧文件原样保留，方便回滚。
- 旧版 JSON 配置会被自动读取一次并写成同名 `.yaml`（旧文件不删），所以升级不会丢端口、密码或第三方登录配置与绑定表；YAML 1.2 兼容 JSON，手工在 `.yaml` 里写 JSON 也能正常解析。
- 想回到「所有 profile 共用一份」的旧行为：在该 profile 的 `cordis.patch.yml` 里把 `dsh-proxy` 行设为 `stateScope: home`。
- `DSH_HOME` 环境变量照常生效；若宿主的 `ctx.baseUrl` 无法解析出 profile 目录，插件会**自动回退**到共享目录并在启动日志打 warn，不会导致加载失败。启动日志里的「状态目录」一行可确认当前生效路径。
- ⚠️ **端口不会自动错开**：`listenPort` 默认仍是 3081。两个 profile 同时运行 `dsh web` 时，第二个会绑定失败（controller 已优雅降级，不会拖垮 web app，日志会给出原因）。需要并行时，在各自 `cordis.patch.yml` 里配不同的 `listenPort`，或各自在设置页改端口。

### 暴露的接口

所有认证相关接口都挂在代理前的统一前缀 `/__dsh-proxy/` 下，无需额外开放端口；其中 OAuth 回调由 IdP 直接访问，需在外网/局域网可达的地址上注册：

| 接口 | 方法 | 用途 |
|---|---|---|
| `/__dsh-proxy/login` | GET | 登录页（未认证访问任意路径也会呈现同一登录页） |
| `/__dsh-proxy/logout` | GET | 登出，清除当前会话 Cookie |
| `/__dsh-proxy/oauth/<id>/start` | GET | 发起**登录**授权：302 跳转到 IdP 授权页（带 PKCE + state） |
| `/__dsh-proxy/oauth/<id>/bind/start` | GET | 发起**绑定**授权：需设置页下发的一次性 `ticket`（`?ticket=`） |
| `/__dsh-proxy/oauth/<id>/callback` | GET | **回调接口**：IdP 授权后回跳此处，`code` 换 token、取用户信息、签发/绑定会话 |

`<id>` 为渠道：`github` / `google` / `feishu` / `casdoor`。需注册到 IdP 的回调地址即 `<代理外部地址>/__dsh-proxy/oauth/<id>/callback`——该地址默认**自动跟随浏览器当前访问代理的域名与端口**（如 `http://192.168.1.5:3081/...`，直连本机为 `http://127.0.0.1:3081/...`），无需写死；只有当 TLS 反代的外域名无法从请求推断时，才用 `oauth.publicOrigin` 固定。

### 授权流程

1. **在 IdP 创建应用**：于 GitHub / Google / 飞书 / Casdoor 新建 OAuth 应用，把回调地址填为上面那一条（设置页「第三方登录」会直接给出当前域名 + 代理真实端口的可复制地址）。
2. **启用并配置渠道**：DSH 设置页 → 局域网代理 → 第三方登录，填入对应 `clientId` / `clientSecret`（官方端点仅需这两项），开启渠道；自建 Casdoor 再填 `baseUrl`（或 `authCenter.baseUrl`）。
3. **先绑定再登录**：在「账号绑定」点「绑定 GitHub」等按钮 → 弹窗走 `/oauth/<id>/bind/start` + `callback`，把 `(渠道, 稳定标识)` 写入绑定表。未绑定的账号即使通过 IdP 也会被拒绝。
4. **登录**：访问 `http://<LAN-IP>:3081/`，登录页只显示已启用的渠道按钮；点击后弹窗访问 `/oauth/<id>/start` → 跳转 IdP 授权 → 回跳 `callback` 完成 `code` 换 token、读取用户信息、校验绑定 → 签发与密码登录相同的会话 Cookie，弹窗关闭、主页面跳转到 `/`。
5. **会话管理**：登录后在设置页可查看活动会话、登出或踢出；`cleartextAuth: 'basic'` 模式下无会话/登出概念。

## 设置页面（改端口 / 账号密码 / 启停）

重启 `dsh web` 后，打开 DSH 设置（左下角齿轮）→ 「局域网代理」：

- **运行状态**：两个红绿灯指示 —— **代理服务端口**（监听地址:端口，绿灯=代理实际在监听，红灯=端口被占用等绑定失败）与**默认服务端口**（DSH 服务端口，绿灯=可探测到默认服务，红灯=不可达）；另有当前用户名、**密码登录是否启用**；右上角有 **启动 / 停止** 按钮（运行中时「启动」置灰，未运行时「停止」置灰）。
- **修改设置**：可改 **代理服务端口（监听端口）**、**用户名**、**密码**（留空 = 设为空）。点「应用」后，配置写入**当前 profile 私有目录**的 `dsh-proxy.yaml`（`$DSH_HOME/profiles/<profile>/dsh-proxy/`）并**立即重启转发服务**；改监听端口后局域网访问地址随之变化。

设置页的修改会**持久化**到当前 profile 的私有目录（各 profile 互不影响）并优先于 profile 的 `cordis.patch.yml`；`listenHost` / `listenPort` 等仍只能通过 `cordis.patch.yml` 修改。插件通过 Connection 共享 `/api` 通道上的精确路由 `POST /api/dsh-proxy`（`status` / `update` / `start` / `stop` 四个端点）提供该能力；信任边界与浏览器会话校验由 Connection 统一负责（经代理改写 Host 后 LAN 端同样可访问）。

## 使用

1. 重启 `dsh web`，启动日志会打印访问地址：
   ```
   dsh-proxy: listening on 0.0.0.0:3081 -> http://127.0.0.1:3080
   dsh-proxy: 局域网访问 http://192.168.1.100:3081
   ```
2. 浏览器访问 `http://<本机局域网IP>:3081` → **自带登录页**：输入用户名密码，或点击已启用的第三方渠道按钮在新弹窗中完成授权 → 成功后跳回默认页面 `/`。若把 `cleartextAuth` 设为 `basic`，才会改为浏览器原生 Basic Auth 登录框。
3. 局域网内其他设备用同一地址访问；登录成功后持有会话 Cookie，有效期内无需重复登录。

> DSH 自身的浏览器会话：Web 界面还要求一个随进程启动令牌签发的会话 cookie，而 `dsh web` 打印的 `?token=...` 地址是 loopback 的，局域网设备用不了。插件会用**你实际访问的地址**自动补上这一步（首次 `GET /` 未带会话时 302 到 `http://<你的地址>:<端口>/?token=...`，换成 cookie 后再跳回干净的 `/`），所以局域网首次访问**不需要手动复制令牌**；直接打开上面的地址即可。

> Windows 防火墙：若局域网设备连不上，为本机放行该端口（管理员 PowerShell）：
> `netsh advfirewall firewall add rule name="dsh-proxy" dir=in action=allow protocol=TCP localport=3081`

## 开发

```bash
pnpm install
pnpm run check   # typecheck + test + build
pnpm run smoke   # 对正在运行的 DSH（127.0.0.1:3080）做全流程冒烟测试
```

- `src/` — TypeScript 源码；`src/proxy.ts` 是纯 node 代理核心（无 cordis 依赖，可独立测试），`src/state-dir.ts` 负责从 `ctx.baseUrl` 解析 profile 私有状态目录与旧配置一次性迁移，`src/controller.ts` 是代理控制器（启动/停止/重启/状态/更新，负责配置持久化），`src/index.ts` 是 cordis 插件入口（含 `/api/dsh-proxy` 精确路由），`src/client/transport.ts` 是浏览器侧的调用封装，`src/client/` 是浏览器设置页。
- `lib/` — 提交构建产物（`lib/index.cjs` 为完全自包含单文件：schemastery、http-proxy、dsh-home-paths 均已内联；`lib/client.js` 为浏览器端单文件，仅 external react）。
- `tests/` — vitest：认证原语、polyfill 纯函数、代理集成测试（HTTP + WebSocket）、控制器（真实上游 + 临时配置文件）、设置页 jsdom 渲染。
- 宿主编排测试（跑在真实 DSH 进程里的插件生命周期）见 `scripts/smoke.mjs` 思路 + 手动重启验证。

## 故障排查

插件树加载失败（例如 `service "directoryPicker" has been registered`、装进别的环境后启动即挂）的原因、确认方法与修复，见 [`docs/troubleshooting.md`](docs/troubleshooting.md)。

## 认证细节

- **启用条件**：`username` 与 `password` **同时非空**才启用密码登录（默认均为空 = 开放访问）；只设置其一仍保持关闭。启用任一第三方渠道同样会开启闸门。
- **暴露状态**：`status.lanExposed` 为 `true` 表示"代理正在监听对外地址、且密码登录未启用"，即局域网内任何人都能直接访问。设置页据此显示红色徽标与风险说明，浏览器端浮层与启动日志 SECURITY WARNING 也来自同一字段；该字段只描述风险，不影响监听行为。
- **闸门与 Cookie**：TLS（可信反代透传 `X-Forwarded-Proto: https`）或 loopback 浏览器走登录页，签发 `__Host-` + `Secure` + `HttpOnly` + `SameSite=Strict` 会话 Cookie；明文 LAN IP 走**同一个登录页**但使用不含 `Secure` 的较弱变体（设置页与启动日志会提示）；`cleartextAuth: 'basic'` 才改用浏览器原生 Basic 弹窗，`requireTls: true` 则拒绝明文。
- **会话**：令牌由服务端保存（重启即失效），支持登出、空闲/绝对过期、活动会话列表与踢出。**第三方登录成功后签发的是同一套会话 Cookie**；密码与第三方渠道都未启用时保持开放访问姿态。
- **公开静态文件**：`/manifest.webmanifest` 与 `/favicon.svg` 免认证——浏览器会在不带凭据的上下文（PWA 清单、图标）拉取它们，强制认证会 401。
- **登录页与 CSP**：服务端渲染的自包含 HTML，响应带 `no-store`、`no-referrer`、`X-Frame-Options: DENY` 与 `default-src 'none'` 的严格 CSP（禁止一切外部资源）。**仅在启用第三方渠道时**附带一段静态内联脚本，用于打开可被脚本关闭的授权弹窗、接收同 origin 的 `BroadcastChannel` 结果、提供取消与 3 分钟超时；CSP 为此放行内联脚本，所有插值都经服务端转义，登录/登出的同源校验不变。未启用第三方渠道时登录页仍是零 JavaScript。
- 凭据比较用常量时间（`timingSafeEqual`）。

## 安全提示

- 默认**开放访问**（用户名密码为空）——启用密码登录前，局域网内任何人都可访问。设置页会用红色「未启用（局域网开放访问）」和风险说明提醒你，请尽快**同时设置用户名和密码**。
- 判断依据是"**真的在对外监听**"：只绑 `127.0.0.1` 时不会报风险（本机访问没有暴露面），代理处于停止状态时也不会报。
- 该代理通过后，DSH 的 `/api` 信任篱笆看到的是改写后的 loopback `Host`，因此**设置/凭据等特权 RPC 也会对局域网开放**——登录页会话、第三方登录或 Basic Auth 三者中至少启用一个，才是有效闸门。
- 第三方登录是**白名单制**：通过 IdP 认证后还必须存在手动绑定，未绑定账号一律拒绝；解绑需二次确认，请定期核对绑定表。
- 仅在 `cleartextAuth: 'basic'` 模式下，浏览器缓存的 Basic 凭据在**修改密码后不会自动失效**：旧凭据会 401 并重新弹窗，输入新密码即可；如需彻底清除，可在浏览器"已保存的密码"里删除该站点条目。
