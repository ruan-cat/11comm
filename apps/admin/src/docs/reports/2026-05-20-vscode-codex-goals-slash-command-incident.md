# 2026-05-20 VSCode Codex goals 斜杠命令不可见事故报告

## 背景

本次排查的现象是：在 VSCode 的 Codex 插件中，用户尝试寻找 `goals` 相关斜杠命令，但无法调出预期命令。

排查对象是本机已安装的 VSCode Codex 插件与本机 Codex CLI 配置：

- VSCode 插件目录：`C:\Users\pc\.vscode\extensions\openai.chatgpt-26.513.21555-win32-x64`
- Codex 配置文件：`C:\Users\pc\.codex\config.toml`
- 工作区：`d:\code\ruan-cat\01s-11comm`

## 结论

无法看到 `/goals` 的直接原因是：当前 VSCode Codex 插件并没有注册复数形式的 `/goals` 斜杠命令，实际注册的命令 ID 是单数 `goal`，在输入框内应输入 `/goal`。

这不是 VSCode 命令面板里的命令，因此在 Command Palette 中搜索 `goals` 也不会找到它。VSCode 插件 `package.json` 暴露的是 `chatgpt.openSidebar`、`chatgpt.openCommandMenu`、`chatgpt.newCodexPanel` 等命令，而不是 `goals`。

如果输入 `/goal` 后仍然不可见，那么问题不在本机 CLI feature 没开启，而在 VSCode webview 的额外显示门控没有满足。该门控包含远端实验开关、host config、当前 composer 模式以及 UI 上下文条件。

后续补充验证表明：API key 按量计费模式可以使用本地 CLI 的 `/goal`，但不能使用 Codex Cloud / 发送至云端。用户已实测 `codex --enable goals` 后，本地 CLI 能看到 `/goal` 命令。这说明 `/goal` 不是必须依赖远端模式的功能；当前问题更准确地说，是 VSCode Codex 插件没有在当前 UI 上下文中暴露这个入口。

因此最终结论应拆成两层：

1. 本地 CLI：已验证可用，API key 模式可以使用 `/goal`。
2. VSCode 插件：插件包内存在 `/goal` 注册和 thread goal bridge，但 UI 显示受额外门控控制；当前看不到并不能证明 Codex 本地 goal 功能不可用。

## 关键证据

### 1. 插件实际注册的是 `/goal`

在 `webview/assets/composer-BjlSupmj.js` 中，goal 斜杠命令的注册片段显示命令 ID 为 `goal`：

```log
formatMessage({id:`composer.goalSlashCommand.title`,defaultMessage:`Goal`})
formatMessage({id:`composer.goalSlashCommand.setDescription`,defaultMessage:`Set a goal that Codex will keep working towards`})
l={id:`goal`,title:a,description:o,requiresEmptyComposer:!1,Icon:OT,enabled:n,onSelect:s,dependencies:c}
```

这说明用户预期的 `/goals` 并不是当前插件注册的命令名。当前插件显示标题为 `Goal`，实际斜杠命令应按 ID 输入 `/goal`。

### 2. `goals` 不是 VSCode 命令面板命令

插件 `package.json` 中贡献的 VSCode 命令如下：

```log
chatgpt.implementTodo     Implement with Codex
chatgpt.openSidebar       Open Codex Sidebar
chatgpt.openCommandMenu   Open Codex Command Menu
chatgpt.newCodexPanel     New Codex Agent
chatgpt.addToThread       Add to Codex Thread
chatgpt.addFileToThread   Add File to Codex Thread
chatgpt.newChat           New Thread in Codex Sidebar
chatgpt.showLspMcpCliArgs Copy Codex CLI args for LSP MCP
chatgpt.dumpNuxState      Debug: print NUX state to console
chatgpt.resetNuxState     Debug: reset NUX state
```

列表中没有 `goals` 或 `goal` 形式的 VSCode contributed command。因此不能用 VSCode Command Palette 是否能搜到 `goals` 来判断该功能是否存在。

### 3. 本机 CLI 侧已经开启 goals feature

本机 `codex.exe features list` 输出包含：

```log
goals                                   experimental       true
multi_agent                             stable             true
terminal_resize_reflow                  experimental       true
```

`C:\Users\pc\.codex\config.toml` 中也已经配置：

```log
[features]
multi_agent = true
goals = true
```

因此，这次问题不能简单归因为本机 Codex CLI 未开启 `goals` feature。

### 4. VSCode webview 仍然有额外显示门控

同一个 `composer-BjlSupmj.js` 中，goal UI 是否启用受以下条件控制：

```log
kr=ga(`3074100722`)&&A(Or?.config,`goals`)===!0&&Zn!==`cloud`&&!W
```

这个条件可以拆解为：

- `ga("3074100722")`：远端实验或灰度开关必须命中。
- `A(Or?.config, "goals") === true`：当前 host config 必须认为 `goals` 已开启。
- `Zn !== "cloud"`：当前 composer 不能处于 cloud 模式。
- `!W`：当前 UI 上下文还必须满足另一个插件内部条件。

所以即使 CLI 配置里已经有 `[features].goals = true`，VSCode 插件界面仍可能因为远端实验、host config 刷新、cloud 模式或上下文条件而隐藏 goal 入口。

### 5. 插件 bridge 支持设置和清除 thread goal

`webview/assets/app-main-BmVboifi.js` 中存在 thread goal 的后端请求：

```log
"set-thread-goal": ... sendRequest(`thread/goal/set`,{threadId:n,objective:r})
"clear-thread-goal": ... sendRequest(`thread/goal/clear`,{threadId:t})
```

这说明当前插件包并不是完全没有 goal 能力，而是 UI 入口使用 `/goal`，并且显示受门控条件控制。

### 6. API key 认证形态只影响 cloud，不否定本地 goal

本机 `C:\Users\pc\.codex\auth.json` 只检查了字段名和认证形态，没有输出任何密钥值。该文件包含：

```log
auth_mode
OPENAI_API_KEY
```

这说明当前 Codex 使用 API key 认证，而不是 ChatGPT 账号 OAuth 登录。官方资料显示，Codex 支持 API key 与 ChatGPT managed 两种认证方式；API key 模式使用 OpenAI Platform 按量计费，ChatGPT 登录则关联 ChatGPT 账号能力。

这带来的影响是：

- 本地 CLI / IDE 本地执行：API key 模式可用。
- Codex Cloud / Codex Web / 发送至云端：需要 ChatGPT 登录或对应账号能力。
- `/goal`：官方 slash command 资料将其描述为本地 slash command，要求是 `features.goals`，不是 cloud mode。

因此，截图中“发送至云端”为灰色是符合预期的；这和本地 CLI 是否能使用 `/goal` 是两个问题。

### 7. 本地 CLI 已实测能看到 `/goal`

用户后续在仓库根目录执行：

```log
codex --enable goals
```

进入 TUI 后能输入并看到：

```log
/goal
```

这条证据非常关键。它证明了：

1. API key 认证模式不是 `/goal` 的阻断条件。
2. 本机 Codex CLI 支持 `features.goals`。
3. `~\.codex\config.toml` 或 `--enable goals` 能让本地 CLI 暴露 goal 命令。
4. VSCode 插件看不到 `/goal` 时，根因应继续落在插件 UI 层或插件 host config 层，而不是继续怀疑本地 CLI feature。

### 8. VSCode 插件和终端 CLI 不是同一个运行面

本机存在两个 Codex CLI 入口：

```log
C:\Users\pc\AppData\Local\pnpm\codex
C:\Users\pc\AppData\Local\pnpm\codex.CMD
c:\Users\pc\.vscode\extensions\openai.chatgpt-26.513.21555-win32-x64\bin\windows-x86_64\codex.exe
```

版本输出显示：

```log
pnpm/global codex: codex-cli 0.131.0
VSCode bundled codex: codex-cli 0.131.0-alpha.9
```

这说明用户在终端里运行的 `codex --enable goals`，和 VSCode 插件内部自带的 `codex.exe` 不是完全同一个入口。即使二者共享 `~\.codex\config.toml`，VSCode 插件还会经过 webview、app-server、host config、Statsig 实验开关等中间层。

VSCode 插件配置中确实有 `chatgpt.cliExecutable`，但描述为开发用途：

```log
DEVELOPMENT ONLY: Path to the Codex CLI executable.
You do NOT need to set this unless you are actively developing the Codex CLI.
If set this manually, parts of the extension may not work as expected.
```

因此，不建议把“终端 CLI 能显示 `/goal`”直接等同为“VSCode 插件必然能显示 `/goal`”。这两者共享 Codex 能力，但不是同一个 UI 注册路径。

### 9. 官方资料与本地证据的对应关系

本次通过 Context7 与联网查询核对了 OpenAI Codex 官方资料，结论如下：

```log
Codex auth:
支持 API key 登录与 ChatGPT managed 登录。
API key 模式按 OpenAI Platform 标准费率计费。
Cloud / Codex Web / cloud threads 依赖 ChatGPT 登录或对应账号能力。

Codex slash commands:
/goal 是内置 slash command。
/goal 用于设置、暂停、恢复、查看或清除任务目标。
/goal 需要 features.goals。
```

这与本机验证结果一致：API key 模式不能发送至云端，但可以在本地 CLI 使用 `/goal`。

## 根因分析

### 直接根因

用户查找的是 `/goals`，但当前 VSCode Codex 插件注册的是 `/goal`。

这是一个命令命名认知偏差：功能名和 CLI feature 叫 `goals`，但 composer 内部 slash command ID 是单数 `goal`。

### 二级根因

即使改为输入 `/goal`，该命令也不保证在所有上下文都显示。插件代码明确要求满足：

```log
远端实验开关命中 && host config goals 为 true && 当前不是 cloud 模式 && 当前 UI 上下文允许
```

因此，若在 cloud 模式、未刷新配置的 webview、未命中远端实验的账号环境，或某些不支持的 composer 场景中查找，仍然可能看不到 goal 入口。

### 补充根因：CLI 可用不等于插件 UI 可见

用户实测本地 CLI 可见 `/goal` 后，问题边界进一步收窄：本地 Codex goal 功能没有坏，API key 认证也不是阻断条件。剩余问题在 VSCode 插件 UI 层。

VSCode 插件里存在 `/goal` 注册和 `thread/goal/set` bridge，但注册对象的 `enabled` 值来自插件内部条件，而不是直接等于 `codex features list` 的输出。当前最可能的链路是：

```log
本地 CLI features.goals = true
        ↓
终端 TUI 直接显示 /goal

VSCode 插件 webview
        ↓
还要经过 ga("3074100722")、host config、composer mode、UI context
        ↓
任一条件不满足则隐藏 /goal
```

这也是为什么“CLI 能用”和“VSCode 插件看不到”可以同时成立。

### 关键误导点

1. `codex features list` 显示 `goals experimental true`，容易让人误以为 VSCode UI 一定会显示 `/goals`。
2. feature 名称是 `goals`，容易让人自然输入 `/goals`，但 slash command ID 实际是 `goal`。
3. VSCode 插件命令面板没有 `goals`，容易误判为插件没有安装或功能缺失；实际上 slash command 是 Codex webview 内部注册的命令，不是 VSCode contributed command。
4. 插件 bundle 内同时存在 `thread/goal/set` 与 `thread/goal/clear`，说明后端能力存在，但 UI 入口仍会被门控隐藏。
5. API key 模式不能用 cloud，容易被误读成 API key 模式不能用 goal；用户的 CLI 实测已经证明这是两个不同问题。
6. 终端 CLI 与 VSCode 插件自带 CLI 版本不同，容易误以为同一个命令行结果必然映射到插件 UI。

## 操作建议

优先按下面顺序验证：

1. 在 VSCode Codex Sidebar 的本地或 worktree 模式中输入 `/goal`，不要输入 `/goals`。
2. 不要在 VSCode Command Palette 中搜索 `goals`；那里没有这个命令。
3. 如果 `/goal` 不出现，执行 `Developer: Reload Window` 或重启 VSCode，让插件重新读取 Codex 配置。
4. 确认当前不是 cloud 模式；插件代码中 `Zn !== "cloud"` 是明确条件。
5. 如果仍然不可见，按远端实验开关或账号灰度问题处理，而不是继续修改本机 `config.toml`。
6. 若需要验证功能本身，优先以终端 `codex --enable goals` 作为本地基线；该基线已经证明 `/goal` 可用。
7. 不建议优先修改 `chatgpt.cliExecutable` 指向全局 pnpm 的 `codex`，因为 VSCode 插件自己将该配置标记为开发用途，并提示手动设置后部分功能可能异常。

## 后续约束

- 后续排查 Codex VSCode 插件斜杠命令时，应先区分三层命令系统：VSCode contributed command、Codex webview slash command、Codex CLI feature。
- 不能用 Command Palette 搜不到来证明 slash command 不存在。
- 不能只看 `~\.codex\config.toml` 或 `codex features list` 就断言 VSCode webview 一定显示入口。
- 涉及实验功能时，需要同时检查插件 bundle 中的注册 ID、功能门控条件和当前运行模式。
- API key 模式下，先把“本地执行能力”和“Codex Cloud 能力”分开判断。不能把 cloud 灰色误判为本地 slash command 不可用。
- 如果终端 CLI 与 VSCode 插件行为不一致，应同时记录两者版本。当前案例中，全局 pnpm CLI 是 `0.131.0`，VSCode bundled CLI 是 `0.131.0-alpha.9`。
- 对 VSCode 插件实验功能，不能只用 CLI TUI 结果作最终 UI 结论；插件还有 webview 侧 Statsig/host config 门控。

## 本次验证记录

本次没有修改 Codex 插件和业务代码，只新增本事故报告。关键验证命令和结论如下：

```log
VSCode extension:
name      chatgpt
publisher openai
version   26.513.21555

Codex feature:
goals experimental true

Codex config:
[features]
multi_agent = true
goals = true

Slash command registration:
id:`goal`
defaultMessage:`Goal`
defaultMessage:`Set a goal that Codex will keep working towards`

Visibility gate:
ga(`3074100722`) && A(Or?.config, `goals`) === true && Zn !== `cloud` && !W

Auth shape:
auth.json contains auth_mode and OPENAI_API_KEY.
No token value was read or recorded.

User verification:
codex --enable goals opens local TUI and /goal is visible.

CLI version split:
global pnpm codex = codex-cli 0.131.0
VSCode bundled codex = codex-cli 0.131.0-alpha.9

Official docs summary:
API key mode supports local Codex usage and is billed through OpenAI Platform.
Codex Cloud / cloud threads require ChatGPT login or related account capability.
/goal is a slash command that requires features.goals, not cloud mode.
```
