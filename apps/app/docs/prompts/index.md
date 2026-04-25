# 杂项提示词

各类杂七杂八的提示词，不一定和本项目有关。

## 001 <!-- 该任务迁移到monorepo项目处置了 --> 处理 cursor 无法识别读取 claude code 插件商城 sh 脚本并反复打开的问题

我在 cursor 每次实现对话时，每次都会自动打开 C:\Users\pc.claude\plugins\cache\ruan-cat-tools\common-tools\3.2.0\scripts\user-prompt-logger.sh 和 C:\Users\pc.claude\plugins\cache\ruan-cat-tools\common-tools\3.2.0\scripts\task-complete-notifier.sh 文件，我知道我在 cursor 内配置了读取是被 claude code 的插件商城，读取识别了全局的 hooks 并执行，但是我很不满意这个自动打开文件的做法。这导致页面不断的打开最新发布的 claude code 插件商城 sh 脚本，打断了我开发的心流状态。很影响我的开发状态；

是这个文件无法识别执行么？是里面的工作目录或者是环境变量写法，导致 cursor 无法执行 claude code 插件商城的 hooks sh 脚本么？

还是什么缘故？

我要修改的事 cursor 配置？还是去合理的修改这两个 .sh 的逻辑呢？

这两个 .sh 实际上来自于： D:\code\github-desktop-store\gh.ruancat.monorepo\ai-plugins\common-tools\scripts 项目提供的 sh 脚本。你看看是不是有写法不兼容的问题，导致 cursor 无法实现默认识别读取的故障？

## 002 <!--（canonical 已迁移） --> 全面重构项目的远程 github 链接

本项目的 GitHub 托管已由 `https://github.com/nwt-q/001-Smart-Community` 迁移至 **`https://github.com/ruan-cat/11comm-app`**（nwt-q 将权限移交给 ruan-cat）。

- **本地**：`origin` 应使用 `https://github.com/ruan-cat/11comm-app.git`（若仍为旧 URL，请执行 `git remote set-url origin https://github.com/ruan-cat/11comm-app.git`）。
- **说明**：GitHub 可能对旧仓库保留重定向，但文档、CI 与 Vercel 绑定的仓库\_slug 应以新地址为准。

## 003 <!-- 已完成 --> 优化项目对 `11commAppH5` 和 `11commAppNitroServer` 域名别名的使用

我们项目存在写死的域名地址，我希望现在全部改写，全部改成从 `@ruan-cat/domains` 内获取，从 `https://dm.ruancat6312.top/` 获取 `@ruan-cat/domains` 包的使用方式。

具体别名： https://github.com/ruan-cat/monorepo/pull/99

注意使用获取别名的方式，获取到具体的配置。

## 004 <!-- 已完成 --> 拓展增强 codex 通知能力

前置条件：本机已安装可执行 `claude-notifier`（例如全局安装 `@ruan-cat/claude-notifier`，并确保 Codex 拉起 PowerShell 时的 `PATH` 能解析到该命令；若通知无效果，可在脚本内改为 `claude-notifier` 的绝对路径）。脚本建议保存为 **UTF-8（含 BOM）**，以便中文 Windows 默认环境下的 Windows PowerShell 5.1 正确解析；拼接省略号请使用 **单引号** `'...'`，避免 `+ "..."` 在 5.1 下触发解析错误。

找到本机的全局 Codex 用户配置（Windows 通常为 `%USERPROFILE%\\.codex\\config.toml`），合并或新增以下片段；将 `你的用户名` 替换为实际账户目录名（即 `%USERPROFILE%` 末段）：

```toml
notify = ["powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "C:\\Users\\你的用户名\\.codex\\codex-notify-ccntf.ps1"]

[tui]
notifications = ["approval-requested", "agent-turn-complete"]
notification_method = "auto"
```

在 `C:\\Users\\你的用户名\\.codex\\` 目录下新建 `codex-notify-ccntf.ps1`，内容如下：

```powershell
param(
    [Parameter(Position = 0)]
    [string]$PayloadJson = ""
)

$ErrorActionPreference = "SilentlyContinue"

if ([string]::IsNullOrWhiteSpace($PayloadJson) -and $args.Count -gt 0) {
    $PayloadJson = [string]$args[0]
}

if ([string]::IsNullOrWhiteSpace($PayloadJson)) {
    exit 0
}

try {
    $payload = $PayloadJson | ConvertFrom-Json
} catch {
    exit 0
}

# Codex notify 当前明确支持的事件
if ($payload.type -ne "agent-turn-complete") {
    exit 0
}

# 取消息（带连字符的 JSON 字段用单引号属性名，兼容 Windows PowerShell 5.1）
$message = ""
$lam = $payload.'last-assistant-message'
$ims = $payload.'input-messages'
if ($lam) {
    $message = [string]$lam
} elseif ($ims) {
    $message = [string]::Join(' ', @($ims))
} else {
    $message = 'Codex 已完成当前处理，请回到终端查看。'
}

$message = $message.Trim()

# 取项目路径 / 工作目录
$taskDescription = ""
if ($payload.cwd) {
    $taskDescription = [string]$payload.cwd
}

# 截断过长内容；省略号用单引号，避免 5.1 下 + "..." 解析异常
$shortMessage = $message
if ($shortMessage.Length -gt 120) {
    $shortMessage = $shortMessage.Substring(0, 120) + '...'
}

# 启发式判断：这轮是否更像需要用户回来处理
$needsInteraction = $false

$interactionPatterns = @(
    '\?',
    '请确认',
    '请提供',
    '请回复',
    '请回答',
    '请选择',
    '需要你的',
    '需要您',
    '等待你的',
    '等待您',
    '还需要',
    '缺少',
    '无法继续',
    '需要审批',
    '需要批准',
    'approve',
    'approval',
    'confirm',
    'choose',
    'select',
    'please provide',
    'please confirm',
    'need your input',
    'waiting for your input',
    'cannot continue'
)

foreach ($pattern in $interactionPatterns) {
    if ($message -match $pattern) {
        $needsInteraction = $true
        break
    }
}

if ($needsInteraction) {
    claude-notifier interaction-needed `
      --title 'Codex - 需要你处理' `
      --message 'Codex 正在等你回来处理' `
      --interaction-details $shortMessage `
      --sound warning `
      --icon alice/timeout.gif
} else {
    claude-notifier task-complete `
      --title 'Codex' `
      --message $shortMessage `
      --task-description $taskDescription `
      --sound success `
      --icon success
}

exit 0
```

## 005 <!-- 已迁移到 ruan-cat/monorepo 项目内完成处理 --> 处理 codex 在 `approval-requested` 事件内，对 `codex-notify-ccntf.ps1` 的处理能细节不合适的情况

如图，我每次在 codex vscode plugin 新开启一个对话，并且开始实现对话时，就出现以下情况。claude-notifier 调用失败了。显示的效果不好。

![2026-03-30-15-27-48](https://gh-img-store.ruan-cat.com/img/2026-03-30-15-27-48.png)

请你解决 `codex-notify-ccntf.ps1` 的处理细节。
