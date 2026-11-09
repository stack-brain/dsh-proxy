# 故障排查

这里记录的是插件树加载失败的**实战经验**——这些失败**不是**本插件的 bug。每条都说明：现象、真正原因、如何确认、如何修复。

对所有这些情况，最好用的工具是启动器的「只组合不启动」dry run：它会完整组合 profile 插件树，然后直接退出，不绑定任何端口：

```bash
dsh --profile web --dump-config
```

与其猜，不如直接在它的输出里搜关键字。下面的问题，用这个命令都能看出 profile 到底有没有组合成一棵正常的树。

---

## `service "directoryPicker" has been registered at <BrowseDirectoryPicker>`

**现象**：启动时整棵插件树加载失败：

```
dsh-plugin-desktop: plugin tree failed to load: failed to apply loader entry include (cordis:include):
failed to apply loader entry desktop-directory-picker-browse-host
(@deepseek-ai/dsh-host-directory-picker-browse): service "directoryPicker" has been registered at <BrowseDirectoryPicker>
```

其余部分可能看起来都正常——表现是**应用起来了但不可用**，而不是干脆拒绝启动。

**原因**：组合后的树里有两个行（row）挂载了同一个宿主包 `@deepseek-ai/dsh-host-directory-picker-browse`，于是两者都去 provide `directoryPicker` 这个服务。Cordis 把重复 `provide` 当作**硬错误**并中止整棵树，所以**一行无关的冲突会拖垮所有插件**。

最常见的冲突发生在插件 bundle 与它的**载体（carrier）**之间：

- DSH Desktop 在 Windows 下自己会注入 browse 组合（见 `lib/profile-*.js`）：它把 `directory-picker` 行设为 disabled，并插入 `desktop-directory-picker-browse-host`（即 `@deepseek-ai/dsh-host-directory-picker-browse`）以及 `desktop-directory-picker-browse-surface`。
- 而想要「应用内目录选择器」的插件，往往会用**自己的 id** 再插入同一个后端。

两行的 id 不同，所以不会有任何去重——loader 看到的是两个插件，Cordis 看到的是同一个服务名。

**确认**：dump 插件树，数一下挂载该包的行：

```bash
dsh --profile web --dump-config | grep -n "directory-picker"
```

如果出现一个以上的 `name: '@deepseek-ai/dsh-host-directory-picker-browse'`（或诸如 `*-browse` / `*-browse-host` 这类近似重复的 id），那就是这个问题。

**修复的总原则**：同一个后端必须**只有一个归属**，并且优先归**载体**——因为只有载体知道自己还会挂什么。下面按你的身份分三种情况。

### 情况 A：你是插件作者，重复行在你的 bundle patch 里

这是本项目的原始病因。删掉你 patch 里重复的 browse `insert` 行，只保留把 `directory-picker`（`auto` 行）设为 `disabled` 的那一行——正是它让应用内选择器胜过宿主屏幕上的原生对话框，**这一行必须留**，删了修复就白做（会退回宿主屏幕弹原生窗口）。

本项目 `dsh-proxy/cordis.patch.yml` 修复前后：

```yaml
# ❌ 修复前：与载体重复挂载同一个后端，装进 DSH Desktop(Windows) 启动即挂
- id: directory-picker
  disabled: true
- insert:
    - id: dsh-proxy
      name: "@stack-brain/dsh-proxy"
    - id: dsh-proxy-directory-picker-browse          # ← 删掉
      name: "@deepseek-ai/dsh-host-directory-picker-browse"
    - id: dsh-proxy-directory-picker-browse-client   # ← 删掉
      name: "@deepseek-ai/dsh-client-ui-directory-picker-browse"
```

```yaml
# ✅ 修复后：只保留 disable 与插件本体
- id: directory-picker
  disabled: true
- insert:
    - id: dsh-proxy
      name: "@stack-brain/dsh-proxy"
```

改完**必须重启**才生效（插件树在启动时组合）。如果该 bundle 已发布/已提交到别的环境，别人要重新安装或重新拉取才会拿到修复——`file:` 安装装的是副本，改完要重装。

### 情况 B：你是使用者，暂时改不了插件的包

在**自己 profile 的** `cordis.patch.yml`（即 `$DSH_HOME/profiles/<name>/cordis.patch.yml`）里，用**同一个 id** 把那两行覆盖成 `disabled: true`。同 id 覆盖发生在 bundle 层之后，而 loader 对 `disabled` 的行会直接跳过、不会去 provide 服务（`if (disabledOf(...)) return`），因此冲突消失：

```yaml
# $DSH_HOME/profiles/web/cordis.patch.yml
- id: dsh-proxy-directory-picker-browse
  disabled: true
- id: dsh-proxy-directory-picker-browse-client
  disabled: true
```

id 要从报错信息和 `--dump-config` 输出里照抄（不同插件的 id 不一样）。覆盖是**同 id 合并**，所以被覆盖的行仍然出现在 dump 里，只是多了一行 `disabled: true`——用下面的命令确认，而不是靠数行数：

```bash
dsh --profile web --dump-config | grep -A2 "directory-picker"
```

每个 `host-directory-picker-browse` 行下面都应带 `disabled: true`，且只剩载体的那一行是启用的。

这是应急手段：插件升级后如果改了 id，覆盖会失效并重新冲突，所以要同步维护，或改用情况 A。

### 情况 C：载体确实没有提供 browse 后端

只有当 dump 出来的树里**一行** `host-directory-picker-browse` 都没有（也没有别的 browse 后端）时，才需要补挂。此时应由**需要它的那个部署方**在自己的 overlay 里添加，而**不要**写进共享 bundle——bundle 无法知道自己被哪个载体加载，写进去就是给所有别的载体埋一次冲突：

```yaml
# 部署方自己的 overlay，而不是插件的 bundle patch
- insert:
    - id: my-directory-picker-browse
      name: "@deepseek-ai/dsh-host-directory-picker-browse"
    - id: my-directory-picker-browse-client
      name: "@deepseek-ai/dsh-client-ui-directory-picker-browse"
```

补挂之前先确认载体包确实装在该 profile 的 `node_modules` 里，否则会从「服务重复」变成「包解析不到」。

### 修复后自检

1. `dsh --profile <name> --dump-config` 能正常输出，没有重复的 picker 后端；
2. 重启后启动日志不再出现 `plugin tree failed to load`；
3. 「添加工作区」在页面内弹出目录浏览框（而不是宿主屏幕上的原生窗口）——这一步验证 `auto` 行确实被 disable 了。

---

## 如何读懂 Cordis loader 报错

大多数「plugin tree failed to load」错误都是同一个形状：

```
failed to apply loader entry <row-id> (<package>): <underlying error>
    at ...
    at file:///<profile>/#<row-id>
    at file:///<profile>/#include
```

消息里的 row id 是**loader 抛出异常时正在应用的那一行**，但它**不一定是出错的那一行**——重复服务错误总是显示在**后注册**的那一行上。所以要把它读作「这一行抢输了」，然后去找另一个占用同一服务或同一 id 的行。

两个能解决大多数情况的手段：

1. **组合插件树并找重复**：`dsh --profile <name> --dump-config`，然后在输出里搜报错中出现的包名。两行、一个服务，就是它。
2. **与干净 profile 对比**：`--dump-default-config` 打印不含用户层和 `--patch` overlay 的树，把它和 `--dump-config` 对比即可隔离出你这一层加了什么：

   ```bash
   dsh --profile web --dump-default-config > /tmp/base.yml
   dsh --profile web --dump-config         > /tmp/full.yml
   diff /tmp/base.yml /tmp/full.yml
   ```

想在**不安装**的前提下测试某个 bundle patch，就用 overlay 方式传入——走的是同一条组合路径，无需安装，也不会写入 profile：

```bash
dsh --profile web --patch ./dsh-proxy/cordis.patch.yml --dump-config
```

---

## 装插件要用 `dsh plugin`，不要手写条目

`dsh plugin --profile <name> add <spec>` 才是注册某个包 bundle patch（其 manifest 里的 `dsh.bundle.patch`）的正确方式。手动往 `profiles/<name>/cordis.patch.yml` 里加行会跳过这一步，于是插件自带的 patch 层永远不会生效，它的包也可能解析不到；同时也绕过了 loader 本可以给出的重复检查错误。

改动在**下次启动** `dsh web` / DSH Desktop 时生效——插件树是启动时组合的，所以请**重启**，而不是刷新页面。

---

## 服务绑定了，但应用看不到它

插件包是通过 **profile 的** `node_modules` 解析的，不是仓库的。如果某行指向的包没有装进该 profile，loader 解析失败，该行（通常连带整棵树）就会掉出去。检查 `profiles/<name>/package.json` 及其 lockfile 里有没有这个包，然后用 `dsh plugin --profile <name> add` 重装。

用本地 checkout 开发时，`file:` spec 安装的是**一份副本**——工作区的改动不会出现，必须重装 profile 并重启应用才会生效。
