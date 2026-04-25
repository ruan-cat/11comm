<!-- 已完成 -->

# 2026-04-25 11comm App 迁入 Monorepo 第一阶段 Implementation Plan

> **状态：Phase1 已完成并通过快照/证据/测试门禁；Memorix canonical history retention gate 已拆分释放为 released-for-phase2-progress / pass-with-permanent-source-retention；旧源目录永久保留，不进入删除、移动、归档、重命名、清空或退休流程。**
>
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `D:\code\ruan-cat\01s-11comm-app` 以过滤快照方式迁入当前 monorepo 的 `apps/app`，并在不启动 `apps/api` 正式实现的前提下完成证据保全、清单生成、测试门禁和下一阶段入口判断。

**Architecture:** 第一阶段只做“过滤快照迁入 + 证据保全 + workspace 最小适配 + 红绿验证门禁”。`apps/app` 保留 app 业务结构、legacy server、mock 体系、项目自有 Markdown、app 作用域 AI 记忆与 app 专属非 OpenSpec skills；`apps/app/.agent` 已删除，`apps/app/.claude` 内 OpenSpec/OPSX 冗余副本已作为受控清理删除，根 OpenSpec commands/skills 为 canonical。根级 AI 记忆、根 skills、`apps/type` schema、`apps/admin/server` 和未来 `apps/api` 由后续阶段按单写者规则治理，不在本阶段混合修改。

**Tech Stack:** pnpm workspace, Turbo, Vue/uni-app, Nitro v3, Vitest, PowerShell, SHA256, UTF-8 strict checks, Memorix MCP/CLI

---

## 2026-04-25 Phase1 Completion Evidence

本轮 36 个 checkbox 均属于 Phase1 执行步骤，已有快照、证据文件和验证命令支撑，已全部标记为完成。Memorix canonical history retention gate 已拆分：对 Phase2 继续推进、准备和后续 `apps/api` 迁移不再阻断；旧源目录 `D:\code\ruan-cat\01s-11comm-app` 是完整独立 git 项目，永久保留，不允许删除、移动、归档、重命名、清空或废弃。本轮编辑任务不启动 `apps/api` 代码实现。

验证事实：

| check                                                                                   | result                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm -r list --depth -1`                                                               | PASS: root/admin/app/type 被识别。                                                                                                                                                                                                        |
| `pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/fee-endpoints.test.ts` | PASS: 1 文件、7 测试通过。                                                                                                                                                                                                                |
| `pnpm -F @01s-11comm/app exec vitest run src/tests/uno-config.test.ts`                  | PASS: 1 文件、2 测试通过。                                                                                                                                                                                                                |
| `pnpm -F @01s-11comm/app exec vitest run`                                               | PASS: 43 文件、126 测试通过。                                                                                                                                                                                                             |
| `pnpm -F @01s-11comm/app type-check`                                                    | PASS: 通过，且 `Test-Path apps/app/dist` 为 `False`。                                                                                                                                                                                     |
| `pnpm exec turbo run build:nitro:vercel --filter=@01s-11comm/app --dry=json`            | PASS: 显示 `@01s-11comm/app#build:nitro:vercel` 依赖 `@01s-11comm/app#build:h5:prod`，串行调度生效。                                                                                                                                      |
| `git diff --check`                                                                      | PASS: 对本轮相关文件无输出。                                                                                                                                                                                                              |
| Chrome DevTools MCP                                                                     | PASS: VitePress docs dev server 实际在 `http://localhost:5173/`；页面标题 `unibest 官方文档`，H1 `unibest最好的 uniapp 框架`，首页文档 GET 200；控制台没有 error/warn，仅 1 条 deprecated feature issue；按用户要求不再保留静态截图文件。 |

修复事实：

| area                                       | result                                                                                                                             |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `apps/app/package.json` / `pnpm-lock.yaml` | 新增 app 测试需要的 `@unocss/preset-legacy-compat@66.0.0` 和 `unocss-applet@0.12.2`，lockfile 已同步。                             |
| `apps/app/tsconfig.json`                   | 删除 `compilerOptions.composite`，避免 `vue-tsc --noEmit` 生成 `apps/app/dist/tsconfig.tsbuildinfo`。                              |
| excluded generated directories             | 已清理 `apps/app/node_modules`、`apps/app/docs/.vitepress/dist`、`apps/app/docs/.vitepress/cache`；最终 `Test-Path` 均为 `False`。 |

Codex 二次复核补充：

| area                       | result                                                                                                                     |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Chrome screenshot drift    | 用户确认截图文件曾被手动删除；当前仅保留 Chrome DevTools MCP 文字验收结论，不再保留静态截图文件。                          |
| app generated artifacts    | 本轮最终再次确认并清理 `apps/app/node_modules` 与 `apps/app/docs/.vitepress/cache`；二者 `Test-Path` 均为 `False`。        |
| Nitro H3 import constraint | `apps/app/server` 中直接从 `h3` 导入的 4 个文件已改为 `nitro/h3`；复查无剩余 `from 'h3'`。                                 |
| CI gate                    | 根级 app CI 已补充 app `type-check` 与全量 Vitest。                                                                        |
| admin/type gate            | `pnpm -F @01s-11comm/admin typecheck` 与 `pnpm -F @01s-11comm/type typecheck` 均已通过。                                   |
| final report               | 当前阅读入口已合并为 `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md`；旧过程报告不再保留独立归档副本。 |
| migration process docs     | `apps/app/docs/migration/*.md` 的有效结论已压缩进合并报告；该目录不再作为长期证据入口维护。                                |

配置清理与根级统一验收：

| 配置                     | Phase1 最终状态                                                      | 处理结论                                                                                  |
| ------------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `pnpm-workspace.yaml`    | 存在，包含 `apps/*`                                                  | 根 workspace 已覆盖 `apps/app`，无需 app 侧重复配置。                                     |
| 根 `package.json`        | 存在，包名 `@01s-11comm/root`，`packageManager = pnpm@10.32.1`       | 根级包管理入口保持 canonical。                                                            |
| 根 `turbo.json`          | 存在，定义 root tasks                                                | 根级 Turbo 编排保持 canonical。                                                           |
| `apps/app/package.json`  | 存在，包名 `@01s-11comm/app`，含 dev/build/test/lint/docs 脚本       | app 作为 workspace 子包保留自身脚本入口。                                                 |
| `apps/app/tsconfig.json` | 存在，含 `noEmit: true`、`allowImportingTsExtensions: true`          | 已删除 `composite`，避免 `vue-tsc --noEmit` 生成 `apps/app/dist/tsconfig.tsbuildinfo`。   |
| `apps/app/turbo.json`    | 存在，`extends: ["//"]`                                              | app 侧仅继承根级 Turbo 配置。                                                             |
| 根 Prettier              | `prettier.config.mjs` 存在                                           | 根级 Prettier 是 workspace canonical。                                                    |
| app Prettier             | 未发现独立 `.prettierrc` / `prettier.config.*`                       | 按用户要求和 T4 规则删除/不恢复；不是待补缺口。                                           |
| 根 ESLint                | `eslint.config.mjs` 存在                                             | 根级 ESLint 保留。                                                                        |
| app ESLint               | `apps/app/eslint.config.mjs` 存在                                    | app 特化语义检查保留，不代表 app Prettier canonical。                                     |
| 根 lint-staged           | `lint-staged.config.js` 存在                                         | 根级 lint-staged 保持 canonical。                                                         |
| app lint-staged          | 未发现独立 app lint-staged 配置                                      | 按根级统一要求删除/不恢复；不是待补缺口。                                                 |
| 根 `.npmrc`              | 存在                                                                 | 根级包管理配置保持 canonical。                                                            |
| app `.npmrc`             | 未发现                                                               | 按根级统一要求删除/不恢复；不是待补缺口。                                                 |
| 根 `.editorconfig`       | 存在                                                                 | 根级编辑器配置保持 canonical。                                                            |
| app `.editorconfig`      | 未发现                                                               | 按根级统一要求删除/不恢复；不是待补缺口。                                                 |
| 根 `.claude`             | 存在                                                                 | 根级 Claude/OpenSpec 规则保持 canonical。                                                 |
| app `.claude`            | 存在                                                                 | 仅保留 app 作用域历史上下文；app-local OpenSpec/OPSX 冗余副本以根规则为 canonical。       |
| app `.github`            | 当前不存在；根 `.github` 存在 app CI/docs workflow 与 issue template | app `.github` 已按用户要求清理，不要求恢复；根 `.github` 承载当前 monorepo 工作流与模板。 |

## Goal

第一阶段完成后必须能回答四个问题：

1. 哪些文件从 `D:\code\ruan-cat\01s-11comm-app` 进入了 `D:\code\ruan-cat\01s-11comm\apps\app`，哪些被排除，为什么。
2. 源目标文件是否 byte-for-byte 一致；如有有意改写，改写是否已单独记录并通过复核。
3. app 的 Markdown、AI 记忆、skills、Memorix 记忆、legacy endpoint、mock 文档是否都有可复核清单。
4. 是否满足进入第二阶段 `apps/api` 影子服务实现的入口条件。

本计划不要求直接实现 `apps/api`，也不把 app legacy Nitro 或 admin 现有 Nitro 定义为唯一后端。

## Architecture/Approach

### 阶段边界

- **阶段 1 执行内容**：基线检查、过滤快照迁入、workspace 最小适配、证据清单、迁移保护测试、阻断条件判断。
- **阶段 1 禁止内容**：正式实现 `apps/api`、迁移 admin/app 业务接口、重写 app 结构、删除旧 server、使用 `git subtree`、保留 app 源仓库 `.git` 历史、一次性补齐大量 CRUD、创建任何鉴权、从 `"h3"` 直接导入 H3 函数、合并根 AI 记忆、覆盖根 skills、并行修改根 `package.json`/`pnpm-lock.yaml`/`pnpm-workspace.yaml`/`turbo.json`、复制应排除的 AI 客户端目录、使用文本管道复制文件、把终端显示乱码写回源码、直接编辑 `C:\Users\pc\.memorix\data`、批量格式化、全局安装工具、未授权 `git commit`。
- **阶段 2 入口条件**：阶段 1 全部阻断条件解除，且 legacy endpoint 矩阵与 mock 文档同步清单能明确第一批 fee/payment/report endpoint 的迁移输入。

### 串并行边界

必须串行：

- `T1` 计划冻结
- `T2` 源/目标基线
- `T3` 过滤快照复制
- `T4` workspace 最小适配

`T3` 完成后可并行：

- `T5` 快照完整性与字符集验收
- `T6` Markdown/敏感信息清单
- `T7` AI 记忆、skills 与双项目 spec 合规矩阵
- `T8` Memorix 记忆保全
- `T9` legacy endpoint 与 mock 文档矩阵

最后串行：

- `T10` 第一阶段验收与第二阶段入口判定

### 单写热点

以下文件或目录必须由一个明确代理独占写入，其他代理只能读取或在清单中提建议：

- 根 `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `turbo.json`
- 根 `.gitignore`、`.gitattributes`、`.editorconfig`、`.vscode/settings.json`、`prettier.config.mjs`
- 根 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md`
- 根 `.claude/skills/**`、`.agents/skills/**`
- `apps/type/**`
- `apps/admin/server/**`

第一阶段默认写入目录是 `apps/app/**` 及其迁移证据文件；根 workspace 适配只允许由 `T4` 单写者执行。

## Locked File Responsibilities

### 本计划文件

- `docs/superpowers/plans/2026-04-25-11comm-app-monorepo-api-migration-phase1.md`
  - 记录第一阶段任务拆分、证据要求、阻断条件和验收命令。

### 后续执行阶段预期写入

- `apps/app/**`
  - 从源项目过滤快照迁入的 app 业务源码、server、docs、openspec、env、scripts、patches、项目自有 AI 记忆、app 作用域 skills 和 app 项目自有 `.github` Markdown/工作流证据。
  - `.github` 只能进入 `apps/app/.github/**` 作为 app 历史证据，不得覆盖目标 monorepo 根级 `.github/**`。
- `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md`
  - 唯一长期 Phase1 迁移证据入口，压缩保留 Markdown 盘点、AI 记忆与 skill 冲突、双项目 spec 合规、Memorix 保全、SHA256/UTF-8/行尾验收、legacy endpoint 矩阵、mock 文档同步关系和后续 `apps/api` 迁移输入。

### 后续执行阶段禁止写入或只允许专项任务写入

- `apps/api/**`
  - 第一阶段不正式实现；只允许在计划和清单中记录第二阶段入口条件。
- 根 AI 记忆和根 skills
  - 第一阶段不覆盖、不拼接、不自动提升 app 规则。
- `apps/type/**`
  - 第一阶段不新增 schema，不把 app DTO 反向定义为 admin/schema 长期事实来源。
- `apps/admin/server/**`
  - 第一阶段不迁移 admin API，不删除旧服务。

## Implementation Steps

### Task T1: 冻结计划与执行约束

**Files:**

- Modify: `docs/superpowers/plans/2026-04-25-11comm-app-monorepo-api-migration-phase1.md`

- [x] **Step 1: 确认设计输入已批准**

Read:

```powershell
Get-Content -Raw -Encoding UTF8 docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md
```

Expected:

- 设计文档明确 `apps/app`、`apps/api`、`apps/type`、`apps/admin` 的目标关系。
- 第一阶段是过滤快照迁入、证据保全和测试门禁，不是 `apps/api` 正式实现。

- [x] **Step 2: 确认当前仓库结构**

Run:

```powershell
Test-Path apps/app
Test-Path apps/api
Get-Content -Raw -Encoding UTF8 pnpm-workspace.yaml
```

Expected:

- `apps/app` 当前不存在或为空目录。
- `apps/api` 当前不存在。
- `pnpm-workspace.yaml` 已包含 `apps/*`。

- [x] **Step 3: 记录本阶段总禁令**

执行代理必须在开始前记录：

```text
不运行格式化命令。
不提交 git。
不全局安装工具包。
不使用脚本批量改代码。
不使用 git subtree。
不保留 app 源仓库 .git 历史。
不一次性补齐大量 CRUD。
不创建 JWT、Token、Neon Auth 或任何鉴权。
不从 "h3" 直接导入 H3 函数。
不并行修改根 package/lock/workspace/turbo 文件。
不复制 .cursor、.gemini、.qoder、.trae、.kiro、.opencode 等 AI 客户端目录。
不使用 Get-Content | Set-Content、Out-File 或其他文本管道复制源码。
不把终端显示乱码写回 Markdown、Vue、TypeScript 或配置源码。
不直接编辑 C:\Users\pc\.memorix\data。
不覆盖根 AI 记忆或根 skills。
不启动 apps/api 正式实现。
不执行未获授权的 git commit。
```

### Task T2: 建立源/目标基线

**Files:**

- Modify: `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md`

- [x] **Step 1: 记录源项目身份**

Source root:

```text
D:\code\ruan-cat\01s-11comm-app
```

Target root:

```text
D:\code\ruan-cat\01s-11comm\apps\app
```

Expected:

- 源目录存在。
- 目标目录不存在或为空；如果目标目录已有内容，停止并由主代理判断是否为他人并行写入。

- [x] **Step 2: 固定候选迁入范围**

默认迁入：

```text
src
server
docs
openspec
.claude
.github
gitee-example
env
scripts
patches
package.json
vite.config.ts
nitro.config.ts
pages.config.ts
manifest.config.ts
README.md
CLAUDE.md
AGENTS.md
GEMINI.md
```

默认排除：

```text
.cursor
.gemini
.qoder
.trae
.kiro
.opencode
.git
node_modules
dist
build
.output
.vercel
docs/.vitepress/dist
.logs
.codex-temp
coverage
.turbo
.nuxt
.vite
临时日志文件
```

`.opencode` 默认按工具配置痕迹排除；如执行代理认为其中存在迁移价值，只能写入清单，不复制原目录。

`.github` 如需保留历史证据，迁入范围仅限 app 项目自有 Markdown、issue/PR 模板和工作流证据，并只能保留在 `apps/app/.github/**`；不得覆盖或合并到目标 monorepo 根级 `.github/**`。本轮最终验收中，`apps/app/.github` 已按用户要求清理，根 `.github` 承载当前 monorepo app CI/docs workflow 与 issue template，因此 `apps/app/.github` 缺失不是 Phase1 待补项。

- [x] **Step 3: 生成源文件 SHA256 基线**

使用系统内置命令生成清单，不编写仓库内脚本。清单必须至少包含：

PowerShell 清点思路：

```powershell
$sourceRoot = "D:\code\ruan-cat\01s-11comm-app"
$includeTop = @("src","server","docs","openspec",".claude",".github","gitee-example","env","scripts","patches","package.json","vite.config.ts","nitro.config.ts","pages.config.ts","manifest.config.ts","README.md","CLAUDE.md","AGENTS.md","GEMINI.md")
$excludeDirs = @(".cursor",".gemini",".qoder",".trae",".kiro",".opencode",".git","node_modules","dist","build",".output",".vercel",".logs",".codex-temp","coverage",".turbo",".nuxt",".vite")
Get-ChildItem -LiteralPath $sourceRoot -Force -Recurse -File |
  Where-Object {
    $relative = [System.IO.Path]::GetRelativePath($sourceRoot, $_.FullName)
    $top = $relative.Split([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar)[0]
    ($includeTop -contains $top) -and -not ($excludeDirs | Where-Object { $relative -eq $_ -or $relative.StartsWith("$($_)\") -or $relative.StartsWith("$($_)/") })
  } |
  ForEach-Object {
    $relative = [System.IO.Path]::GetRelativePath($sourceRoot, $_.FullName)
    $hash = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
    [pscustomobject]@{
      sourceRelativePath = $relative
      sizeBytes = $_.Length
      sha256 = $hash
      includeDecision = "include"
      excludeReason = ""
    }
  }
```

排除项也要清点原因，但只记录在基线 Markdown，不复制到目标：

```powershell
Get-ChildItem -LiteralPath $sourceRoot -Force |
  Where-Object { $excludeDirs -contains $_.Name } |
  ForEach-Object { "$($_.Name) -> exclude: 工具目录、构建产物、依赖目录或源仓库历史，不进入 apps/app 快照" }
```

`sha256` 字段必须填写 `Get-FileHash -Algorithm SHA256` 实际输出的 64 位十六进制 SHA256 值。

```md
| sourceRelativePath | sizeBytes | sha256                                                 | includeDecision | excludeReason |
| ------------------ | --------: | ------------------------------------------------------ | --------------- | ------------- |
| src/main.ts        |      1234 | 由 Get-FileHash 实际输出填写的 64 位十六进制 SHA256 值 | include         | 业务源码      |
```

Expected:

- 每个候选文件都有 `includeDecision`。
- 排除目录下的文件不进入目标复制范围，但排除原因进入基线。

- [x] **Step 4: 生成 UTF-8 与行尾基线**

检查结果写入 `2026-04-25-phase1-consolidated-report.md`，必须记录：

PowerShell 检查思路：

```powershell
$utf8Strict = [System.Text.UTF8Encoding]::new($false, $true)
Get-ChildItem -LiteralPath $sourceRoot -Force -Recurse -File |
  Where-Object { $_.FullName -notmatch "\\(\.git|node_modules|dist|build|\.output|\.vercel|coverage|\.turbo|\.nuxt|\.vite)\\" } |
  ForEach-Object {
    $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
    $strictOk = $true
    try { $text = $utf8Strict.GetString($bytes) } catch { $strictOk = $false; $text = "" }
    $lineEnding =
      if ($bytes -contains 13) {
        if ($text.Contains("`r`n")) { "CRLF-or-mixed" } else { "CR-present" }
      } else { "LF-or-binary" }
    [pscustomobject]@{
      path = [System.IO.Path]::GetRelativePath($sourceRoot, $_.FullName)
      utf8Strict = $strictOk
      containsUfffd = $text.Contains([char]0xfffd)
      containsMojibake = $text.Contains("锟")
      suspiciousUnicodeEscape = [regex]::IsMatch($text, "\\u[0-9a-fA-F]{4}")
      lineEnding = $lineEnding
    }
  }
```

上述命令只读取字节并输出检查对象，不使用 `Get-Content | Set-Content` 或 `Out-File` 改写源码。

```md
| path | utf8Strict | containsUfffd | containsMojibake | suspiciousUnicodeEscape | lineEnding | decision |
| ---- | ---------- | ------------- | ---------------- | ----------------------- | ---------- | -------- |
```

Blocking:

- UTF-8 严格解码失败。
- 新增或未解释的 `U+FFFD`。
- 明显真实 `锟` 乱码。
- 未确认的异常 `\uXXXX` 转义。

### Task T3: 执行过滤快照复制

**Files:**

- Create: `apps/app/**`
- Modify only by assigned single writer: root workspace files if `T4` confirms necessity

- [x] **Step 1: 创建目标目录**

Run:

```powershell
New-Item -ItemType Directory -Force apps/app
New-Item -ItemType Directory -Force docs/superpowers/reports
```

Expected:

- 只创建 `apps/app` 和 `docs/superpowers/reports`。

- [x] **Step 2: 复制默认迁入范围**

允许复制业务目录和必要配置；禁止复制默认排除目录。复制完成后检查：

推荐使用 `robocopy` 做二进制安全复制，避免文本管道改变编码或行尾：

```powershell
$sourceRoot = "D:\code\ruan-cat\01s-11comm-app"
$targetRoot = "D:\code\ruan-cat\01s-11comm\apps\app"
$includeDirs = @("src","server","docs","openspec",".claude",".github","gitee-example","env","scripts","patches")
$includeFiles = @("package.json","vite.config.ts","nitro.config.ts","pages.config.ts","manifest.config.ts","README.md","CLAUDE.md","AGENTS.md","GEMINI.md")
$excludeDirs = @(".cursor",".gemini",".qoder",".trae",".kiro",".opencode",".git","node_modules","dist","build",".output",".vercel",".logs",".codex-temp","coverage",".turbo",".nuxt",".vite","docs\.vitepress\dist")
foreach ($dir in $includeDirs) {
  $src = Join-Path $sourceRoot $dir
  $dst = Join-Path $targetRoot $dir
  if (Test-Path -LiteralPath $src) {
    robocopy $src $dst /E /COPY:DAT /DCOPY:DAT /R:1 /W:1 /XD $excludeDirs
    if ($LASTEXITCODE -gt 7) { throw "robocopy failed for $dir with exit code $LASTEXITCODE" }
  }
}
foreach ($file in $includeFiles) {
  $src = Join-Path $sourceRoot $file
  if (Test-Path -LiteralPath $src) {
    Copy-Item -LiteralPath $src -Destination (Join-Path $targetRoot $file) -Force
  }
}
```

如果复制或保留 `.github`，只能落到 `apps/app/.github/**`，并在清单中标明它是 app 项目自有 Markdown/工作流证据；不得复制到目标仓库根 `.github/**`。最终状态允许 `apps/app/.github` 按用户要求删除，且该状态不阻断 Phase1 完成。

`robocopy` 排除目录必须包含：`.cursor`、`.gemini`、`.qoder`、`.trae`、`.kiro`、`.opencode`、`.git`、`node_modules`、`dist`、`build`、`.output`、`.vercel`、`.logs`、`.codex-temp`、`coverage`、`.turbo`、`.nuxt`、`.vite`、`docs\.vitepress\dist`。

```powershell
Test-Path apps/app/.git
Test-Path apps/app/node_modules
Test-Path apps/app/.cursor
Test-Path apps/app/.gemini
Test-Path apps/app/.qoder
Test-Path apps/app/.trae
Test-Path apps/app/.kiro
Test-Path apps/app/.opencode
```

Expected:

- 全部输出 `False`。

- [x] **Step 3: 保留 app 作用域历史上下文**

以下内容如果在源项目存在，应保留到 `apps/app` 对应路径：

```text
apps/app/CLAUDE.md
apps/app/AGENTS.md
apps/app/GEMINI.md
apps/app/.claude/skills/**
apps/app/docs/**
apps/app/openspec/**
```

Expected:

- 这些内容只属于 app 子项目作用域。
- app 专属非 OpenSpec skills 保留；app-local OpenSpec/OPSX 副本删除后以根 OpenSpec commands/skills 为 canonical。
- 不覆盖根 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md`。
- 不覆盖根 `.claude/skills/**` 或 `.agents/skills/**`。

### Task T4: workspace 最小适配

**Files:**

- Modify only if required: root `package.json`
- Modify only if required: `pnpm-lock.yaml`
- Modify only if required: `pnpm-workspace.yaml`
- Modify only if required: `turbo.json`
- Modify only if required: root `.gitignore`

- [x] **Step 1: 验证 `pnpm-workspace.yaml` 是否已经覆盖 `apps/app`**

Run:

```powershell
Get-Content -Raw -Encoding UTF8 pnpm-workspace.yaml
```

Expected:

- 已有 `apps/*` 时不修改 `pnpm-workspace.yaml`。
- 如果没有 `apps/*`，由 `T4` 单写者补充，不允许并行代理同时改。

- [x] **Step 2: 对齐 app Prettier 入口与 workspace canonical**

Rules:

- `apps/app` 不新增、不恢复本地 `prettier.config.mjs`、`.editorconfig`、`.npmrc`、`taze.config.ts`。
- `apps/app` 的 Prettier 行为必须通过 `--config=../../prettier.config.mjs` 显式指向根配置，并与 `apps/admin` 的 `lint:prettier` 行为保持一致。
- `format` 应只代理到 `pnpm lint:prettier`。
- ESLint/oxlint 保留 `apps/app` 特化语义检查，不作为跨项目 Prettier canonical。
- 本阶段不执行 `prettier --write` 批量格式化，不把格式化结果混入快照迁移验收。

验收结论：

- `apps/app` 未发现独立 `.prettierrc`、`prettier.config.*`、`.npmrc`、`.editorconfig`、app-local lint-staged 配置；这是按用户要求清理和根级统一后的预期状态，不需要补回。
- `apps/app/eslint.config.mjs` 保留为 app 特化 lint 入口，不与根 Prettier canonical 冲突。
- 根 `prettier.config.mjs`、`.editorconfig`、`.npmrc`、`lint-staged.config.js`、`eslint.config.mjs` 继续作为 monorepo 入口。
- `apps/app/.github` 当前不存在，视为用户确认删除后的最终状态；根 `.github` 已承载当前 app CI/docs workflow 与 issue template。

- [x] **Step 3: 检查 `apps/app/package.json` 包名和脚本**

Rules:

- 包名应避免与源项目或现有 workspace 冲突。
- 不新增全局安装脚本。
- 不在第一阶段批量改业务源码 import。
- 不把 app legacy server 删除或替换为 `apps/api`。

- [x] **Step 4: 最小安装与锁文件更新**

如果需要让 workspace 识别新包，执行：

```powershell
pnpm install
```

Expected:

- `pnpm-lock.yaml` 可由 `T4` 单写者更新。
- 不运行 `pnpm install -g`、`npm install -g`、`pnpm add -g`。

- [x] **Step 5: 记录 workspace 适配差异**

在 `2026-04-25-phase1-consolidated-report.md` 新增“有意改写”章节：

```md
## 有意改写

| path                  | reason                           | reviewer                                     | date       |
| --------------------- | -------------------------------- | -------------------------------------------- | ---------- |
| apps/app/package.json | workspace 包名和脚本入口最小适配 | 主代理或检查复核子代理在 reviewDate 当天签名 | 2026-04-25 |
```

### Task T5: 快照完整性、UTF-8 和行尾验收

**Files:**

- Modify: `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md`

- [x] **Step 1: 对未有意改写文件做源目标 SHA256 对账**

Record:

PowerShell 对账思路：

```powershell
$sourceRoot = "D:\code\ruan-cat\01s-11comm-app"
$targetRoot = "D:\code\ruan-cat\01s-11comm\apps\app"
$copiedFiles = Get-ChildItem -LiteralPath $targetRoot -Force -Recurse -File |
  Where-Object { $_.FullName -notmatch "\\(\.git|node_modules|dist|build|\.output|\.vercel|coverage|\.turbo|\.nuxt|\.vite)\\" }
foreach ($targetFile in $copiedFiles) {
  $relative = [System.IO.Path]::GetRelativePath($targetRoot, $targetFile.FullName)
  $sourceFile = Join-Path $sourceRoot $relative
  if (Test-Path -LiteralPath $sourceFile) {
    $sourceSha = (Get-FileHash -LiteralPath $sourceFile -Algorithm SHA256).Hash.ToLowerInvariant()
    $targetSha = (Get-FileHash -LiteralPath $targetFile.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
    [pscustomobject]@{
      sourceRelativePath = $relative
      targetRelativePath = $relative
      sourceSha256 = $sourceSha
      targetSha256 = $targetSha
      status = if ($sourceSha -eq $targetSha) { "match" } else { "mismatch" }
    }
  }
}
```

```md
| sourceRelativePath | targetRelativePath | sourceSha256 | targetSha256 | status |
| ------------------ | ------------------ | ------------ | ------------ | ------ |
```

Expected:

- 未有意改写文件必须 `status = match`。
- 任何 `mismatch` 都必须在继续前解释为有意改写并复核，或回滚该文件重复制。

- [x] **Step 2: 检查目标目录排除项**

Run:

```powershell
Get-ChildItem apps/app -Force | Where-Object { $_.Name -in @(".git","node_modules",".cursor",".gemini",".qoder",".trae",".kiro",".opencode",".output",".vercel",".logs",".codex-temp") }
```

Expected:

- 没有输出。

- [x] **Step 3: 检查显示乱码没有被写回**

`2026-04-25-phase1-consolidated-report.md` 必须明确记录：

```md
PowerShell 默认解码产生的显示乱码不是源码真实内容；任何 Markdown、Vue、TypeScript、配置文件不得因为终端显示乱码被写回。
```

- [x] **Step 4: 行尾检查**

PowerShell 行尾对账思路：

```powershell
function Get-LineEndingKind([byte[]]$bytes) {
  $hasCrLf = $false
  $hasLfOnly = $false
  for ($i = 0; $i -lt $bytes.Length; $i++) {
    if ($bytes[$i] -eq 10) {
      if ($i -gt 0 -and $bytes[$i - 1] -eq 13) { $hasCrLf = $true } else { $hasLfOnly = $true }
    }
  }
  if ($hasCrLf -and $hasLfOnly) { "mixed" } elseif ($hasCrLf) { "CRLF" } elseif ($hasLfOnly) { "LF" } else { "none-or-binary" }
}
$sourceBytes = [System.IO.File]::ReadAllBytes("D:\code\ruan-cat\01s-11comm-app\src\main.ts")
$targetBytes = [System.IO.File]::ReadAllBytes("D:\code\ruan-cat\01s-11comm\apps\app\src\main.ts")
Get-LineEndingKind $sourceBytes
Get-LineEndingKind $targetBytes
```

Expected:

- 如果源文件 CRLF、目标 LF，必须记录为有意规范化，不能混入 byte-for-byte 验收。
- 如果没有有意规范化，源目标行尾必须一致。

### Task T6: Markdown、重复文档和敏感信息清单

**Files:**

- Create: `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md`

- [x] **Step 1: 生成 Markdown 清单**

Required columns:

```md
| path | sourceArea | category | valueLevel | duplicateGroup | sensitiveStatus | migrationDecision | notes |
| ---- | ---------- | -------- | ---------- | -------------- | --------------- | ----------------- | ----- |
```

Allowed `valueLevel`:

```text
P0-migration-critical
P1-app-business-history
P2-template-or-third-party-reference
P3-duplicate-or-obsolete-candidate
```

Allowed `migrationDecision`:

```text
keep-app-scope
archive-reference
manual-extract-later
reject-or-redact
```

- [x] **Step 2: 标记第三方和参考资料**

These paths must not become monorepo canonical facts:

```text
src/uni_modules/**
gitee-example/**
模板文档
第三方文档
```

- [x] **Step 3: 扫描敏感信息**

至少覆盖：

```text
token
secret
password
passwd
api_key
apikey
access_key
private_key
DATABASE_URL
NEON
VERCEL
APP_SECRET
postgres://
postgresql://
mysql://
redis://
bearer
Bearer
authorization
私钥
密钥
口令
密码
```

Blocking:

- 真实 token、数据库连接串、API key、生产密码原样进入可共享文档。

### Task T7: AI 记忆、skills 与双项目 spec 合规矩阵

**Files:**

- Modify: `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md`

- [x] **Step 1: 生成 AI 记忆合并清单**

Required columns:

```md
| sourcePath | targetCandidate | topic | valueLevel | stillValid | scope | conflictStatus | sensitiveStatus | decision | canonicalReference | excerptSummary | reviewer | reviewDate |
| ---------- | --------------- | ----- | ---------- | ---------- | ----- | -------------- | --------------- | -------- | ------------------ | -------------- | -------- | ---------- |
```

Allowed `decision`:

```text
keep-app-scope
promote-root-memory
merge-canonical-skill
archive-reference
reject-or-redact
```

Rule:

- 第一阶段只记录 `promote-root-memory` 和 `merge-canonical-skill` 候选，不实际写入根 AI 记忆或根 skills。

- [x] **Step 2: 生成 skills 冲突矩阵**

In `2026-04-25-phase1-consolidated-report.md`, include:

```md
| source | appRuleOrSkill | rootCanonical | overlapType | conflictDescription | decision | verification |
| ------ | -------------- | ------------- | ----------- | ------------------- | -------- | ------------ |
```

Required coverage:

- app `.claude/skills/**` 中保留的 app 专属非 OpenSpec skills
- app `.claude/skills/openspec-*` 与 `.claude/commands/opsx/**` 的受控删除记录
- app `.agent` 已删除状态
- app `.agents/skills/**` 缺失状态
- app 根 `CLAUDE.md`
- app 根 `AGENTS.md`
- app 根 `GEMINI.md`
- app `openspec/**`
- 主项目根 `CLAUDE.md` / `AGENTS.md`
- 主项目 OpenSpec 和 Nitro/schema/testing 规范

- [x] **Step 3: 固定 canonical 规则**

Record:

```text
根级 01s-11comm 的 CLAUDE.md、AGENTS.md、GEMINI.md 是 monorepo canonical 入口。
apps/app/CLAUDE.md、apps/app/AGENTS.md、apps/app/GEMINI.md 只作为 app 作用域历史上下文。
app 同名 skill 不覆盖主项目 canonical skill。
```

### Task T8: Memorix 记忆保全

**Files:**

- Modify: `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md`

- [x] **Step 1: 记录已知项目身份**

`2026-04-25-phase1-consolidated-report.md` 必须包含：

```md
| key                  | value                                |
| -------------------- | ------------------------------------ |
| sourceCanonical      | nwt-q/001-Smart-Community            |
| sourceAlias          | ruan-cat/11comm-app                  |
| oldRootPath          | D:\code\ruan-cat\01s-11comm-app      |
| targetMonorepo       | ruan-cat/11comm                      |
| newAppRoot           | D:\code\ruan-cat\01s-11comm\apps\app |
| memorixDataDirectory | C:\Users\pc\.memorix\data            |
```

- [x] **Step 2: 使用 MCP 或 CLI 只读清点**

Preferred if MCP exposed:

```text
memorix_session_start(projectRoot = D:\code\ruan-cat\01s-11comm)
memorix_search(query = "11comm-app Nitro legacy mock endpoint z-paging fee", scope = project/global as needed)
```

如果需要从源 app 视角补充检索，使用独立会话上下文读取，不改内部数据文件：

```text
memorix_session_start(projectRoot = D:\code\ruan-cat\01s-11comm-app)
memorix_search(query = "Nitro legacy mock endpoint fee payment report", scope = project/global as needed)
```

Fallback if MCP unavailable:

```powershell
Push-Location D:\code\ruan-cat\01s-11comm-app
memorix status
memorix doctor
memorix recent
memorix search "Nitro legacy"
memorix search "mock endpoint"
memorix search "fee"
Pop-Location
```

Rules:

- `memorix_search` 只用于检索历史线索、observations、sessions 和项目 alias；结果写入 `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md`。
- `memorix_store` 只允许在迁移清点结束后写入本次会话摘要、已完成清单路径和后续入口判断，不得把未复核的源项目记忆提升为 monorepo canonical 事实。
- 只读清点 `C:\Users\pc\.memorix\data`；不得打开后手动改写、删除或重命名其中任何文件。
- 不直接编辑 `*.json`、`memorix.db` 或 Memorix 内部数据文件。

- [x] **Step 3: 生成 Memorix memory inventory**

Required columns:

```md
| memoryId | title | type | status | projectId | topicKey | tags | relatedConcepts | active | sensitiveStatus | decision | targetLocation | reviewConclusion |
| -------- | ----- | ---- | ------ | --------- | -------- | ---- | --------------- | ------ | --------------- | -------- | -------------- | ---------------- |
```

Allowed `decision`:

```text
keep-app-scope
promote-root-memory
merge-canonical-skill
archive-reference
reject-or-redact
```

- [x] **Step 4: 生成会话摘要**

`2026-04-25-phase1-consolidated-report.md` 至少记录：

```md
| sessionOrObservation | date | sourceIdentity | summary | migrationValue | decision |
| -------------------- | ---- | -------------- | ------- | -------------- | -------- |
```

Blocking:

- 没有 Memorix 记忆清单、项目 alias 映射和会话摘要前，不得删除或废弃旧源目录。
- 迁入后必须分别从 monorepo 根 `D:\code\ruan-cat\01s-11comm` 与 app 子目录 `D:\code\ruan-cat\01s-11comm\apps\app` 视角检索一次，确认 `11comm-app`、`Nitro legacy`、`mock endpoint`、`fee` 等历史线索可检索，并把检索命令、命中摘要和证据文件路径写入 `2026-04-25-phase1-consolidated-report.md`。

### Task T9: legacy endpoint 与 mock 文档同步矩阵

**Files:**

- Modify: `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md`

- [x] **Step 1: 建立 legacy endpoint 矩阵**

Required columns:

```md
| legacyPath | method | sourceFile | runtimeDispatcher | requestDto | responseDto | mockSource | adminCanonicalRoute | adminGap | apiMigrationPriority | testCoverage |
| ---------- | ------ | ---------- | ----------------- | ---------- | ----------- | ---------- | ------------------- | -------- | -------------------- | ------------ |
```

Must include at least:

```text
/app/fee.listFee
/app/feeApi/listOweFees
/app/payment.nativeQrcodePayment
/app/oweFeeCallable.listOweFeeCallable
/app/oweFeeCallable.writeOweFeeCallable
/app/fee.saveRoomCreateFee
/app/feeConfig.listFeeConfigs
/app/iot/**
/app/reportFeeMonthStatistics*
/app/dataReport.queryFeeDataReport
/app/machine/listMachineRecords
/callComponent/**
```

- [x] **Step 2: 标记 admin canonical 坐标或后台功能缺口**

Rules:

- fee/payment/owe-fee/report 优先映射到 `property-manage/expense-manage` 相关业务坐标。
- 充电桩、开门记录等当前缺少 admin 三级业务路径的能力记录为后台功能缺口。
- 不把缺口硬塞进费用模块。

- [x] **Step 3: 建立 mock 文档同步清单**

Required columns:

```md
| endpoint | mockCodePath | docPath | testPath | dataSourceState | syncRequirementForAppsApi |
| -------- | ------------ | ------- | -------- | --------------- | ------------------------- |
```

Must explicitly preserve as future `apps/api` migration input:

```text
src/api/fee.ts
server/modules/fee/endpoints.ts
src/tests/nitro-runtime/fee-endpoints.test.ts
```

### Task T10: 第一阶段最终验收与第二阶段入口判定

**Files:**

- Modify: `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md`

- [x] **Step 1: 运行 workspace 识别检查**

Run:

```powershell
pnpm list --depth -1
```

Expected:

- workspace 能识别 `apps/app` 对应包。
- `apps/admin` 与 `apps/type` 仍存在且未被迁入任务破坏。

- [x] **Step 2: 运行迁入范围测试**

Run the app tests that already exist after snapshot:

```powershell
$appPackageName = (Get-Content -Raw -Encoding UTF8 apps/app/package.json | ConvertFrom-Json).name
pnpm -F $appPackageName exec vitest run
```

Expected:

- app 原有与迁入范围相关的 Vitest 测试通过。
- 测试文件必须使用 `import { test, describe } from "vitest";`；如果源项目已有不合规测试，只记录，不在快照完整性验收前批量重写。

- [x] **Step 3: 运行 legacy endpoint 重点测试**

If the source app has a focused endpoint test, run:

```powershell
$appPackageName = (Get-Content -Raw -Encoding UTF8 apps/app/package.json | ConvertFrom-Json).name
pnpm -F $appPackageName exec vitest run src/tests/nitro-runtime/fee-endpoints.test.ts
```

Expected:

- app legacy endpoint registry、runtime dispatcher、mock adapter 契约仍能通过。
- 通过 app legacy 测试不等于 admin canonical 支撑已经完成。

- [x] **Step 4: 记录第二阶段入口条件**

只使用明确的 pass/fail 记录，不写模糊结论。每一项必须附证据文件路径：

```md
## 阶段 2 入口判定

| checkId | requirement                                                              | result    | evidencePath                                                      | ownerTask | notes                              |
| ------- | ------------------------------------------------------------------------ | --------- | ----------------------------------------------------------------- | --------- | ---------------------------------- |
| P2-01   | apps/app 存在并保留原 app 主体结构                                       | pass/fail | docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md | T3/T5     | 记录目录清单摘要                   |
| P2-02   | apps/app 不包含 .git、node_modules、排除的 AI 客户端目录或构建产物       | pass/fail | docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md | T3/T5     | 附 Test-Path 或 Get-ChildItem 结果 |
| P2-03   | 源目标 SHA256 对账通过，或所有 mismatch 都有有意改写记录                 | pass/fail | docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md | T2/T5     | 附 mismatch 行                     |
| P2-04   | UTF-8、乱码、行尾检查通过                                                | pass/fail | docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md | T2/T5     | 附阻断项                           |
| P2-05   | Markdown 清单已生成且有具体行                                            | pass/fail | docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md | T6        | 附行数或摘要                       |
| P2-06   | AI 记忆合并清单已生成且有具体行                                          | pass/fail | docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md | T7        | 附行数或摘要                       |
| P2-07   | 双项目 spec 合规矩阵已生成且有具体行                                     | pass/fail | docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md | T7        | 附冲突摘要                         |
| P2-08   | Memorix 记忆清单已生成且有具体行                                         | pass/fail | docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md | T8        | 附检索摘要                         |
| P2-09   | Memorix 项目 alias 映射已生成                                            | pass/fail | docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md | T8        | 附源/目标身份                      |
| P2-10   | Memorix 会话摘要已生成                                                   | pass/fail | docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md | T8        | 附根与 apps/app 视角检索结果       |
| P2-11   | legacy endpoint 矩阵已生成且覆盖 fee/payment/report 输入                 | pass/fail | docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md | T9        | 附优先级摘要                       |
| P2-12   | mock 文档同步清单已生成                                                  | pass/fail | docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md | T9        | 附同步输入摘要                     |
| P2-13   | app legacy fee/payment/report 测试输入已保全                             | pass/fail | docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md | T9/T10    | 附测试路径                         |
| P2-14   | 根 AI 记忆、根 skills、apps/type、apps/admin/server 未被第一阶段擅自改写 | pass/fail | git status --short 输出记录或主代理验收报告路径                   | T10       | 附异常说明                         |
```

全部 `result = pass` 时写入：

```md
**结论：pass，允许在单独 Phase2 授权和计划下启动 `apps/api` 影子服务设计与实现。**

**证据路径：**

- `docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md`

**原因：** 第一阶段证据已转绿，且 legacy endpoint 矩阵与 mock 文档同步清单已给出第一批迁移输入。
```

任一 `result = fail` 时写入：

```md
**结论：fail，禁止启动 `apps/api` 正式实现。**

**阻断项：**
| checkId | failedRequirement | evidencePath | ownerTask | requiredFix |
| --- | --- | --- | --- | --- |
| P2-03 | 源目标 SHA256 对账通过，或所有 mismatch 都有有意改写记录 | docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md | T2/T5 | 补齐 mismatch 的有意改写记录并由主代理或检查复核子代理签名，或重复制受影响文件后重新对账 |
```

## Testing and Verification

### 必跑验证

```powershell
Test-Path apps/app
Test-Path apps/api
pnpm list --depth -1
```

Expected:

- `apps/app` 为 `True`。
- `apps/api` 在第一阶段结束时仍可为 `False`；如果已存在，必须有单独阶段 2 授权。
- workspace 能识别 `apps/app`。

### 迁移证据完整性检查

Required files:

```text
docs/superpowers/reports/2026-04-25-phase1-consolidated-report.md
```

The consolidated report must have concrete rows or sections for each Phase1 evidence category. Empty headings are a failed verification.

### Vitest 要求

- 新增测试文件必须是 `*.test.ts`。
- 测试目录优先使用对应子包的 `tests/` 或 `src/tests/`。
- 测试导入必须使用：

```ts
import { test, describe } from "vitest";
```

- Nitro、endpoint registry、repository、adapter 测试必须使用 Node 环境。
- 页面组件或 uni-app DOM 行为测试才使用 jsdom 或组件测试环境。

### Nitro/API 约束检查

如果后续代理在阶段 1 后创建 `apps/api`，必须先开新阶段任务；本阶段只记录以下约束：

```text
H3 函数从 "nitro/h3" 导入。
不从 "h3" 直接导入。
不新增 JWT、Token、Neon Auth 或任何鉴权。
不在 apps/api 内私自定义数据库 schema 事实来源。
apps/type 仍是 schema SSOT。
```

## Rollback/Recovery

### 快照复制回滚

如果 `T3` 复制后发现排除目录进入 `apps/app`，并且目标目录尚未被其他代理继续修改：

1. 记录污染路径到 `2026-04-25-phase1-consolidated-report.md`。
2. 暂停后续任务。
3. 由主代理确认后删除污染文件或重建 `apps/app`。
4. 重新执行 `T3` 与 `T5`。

不得使用 `git reset --hard` 或 `git checkout --` 回滚用户或其他代理的变更。

### 编码与行尾恢复

如果发现乱码或行尾异常：

1. 先判断是否为终端显示乱码。
2. 对照源文件 SHA256 和目标 SHA256。
3. 只重复制受影响文件。
4. 在 `2026-04-25-phase1-consolidated-report.md` 记录根因和恢复结果。

禁止用 `Get-Content | Set-Content`、`Out-File`、编辑器批量另存为或格式化命令“修复”快照文件。

### Memorix 恢复

如果新路径无法检索 app 历史记忆：

1. 保留旧目录 `D:\code\ruan-cat\01s-11comm-app`。
2. 保留 `nwt-q/001-Smart-Community` 与 `ruan-cat/11comm-app` alias 线索。
3. 不直接编辑 `C:\Users\pc\.memorix\data`。
4. 通过 Memorix MCP 或 CLI 继续建立 alias/inventory 证据。

## Notes

- 第一阶段只允许把 app 根 `CLAUDE.md`、`AGENTS.md`、`GEMINI.md` 放在 `apps/app` 作用域内保留，不允许合并进主项目根 AI 记忆。
- 第一阶段只允许记录 app skills 与主项目 skills 的冲突，不允许覆盖根 `.claude/skills/**` 或 `.agents/skills/**`。
- `.cursor`、`.gemini`、`.qoder`、`.trae`、`.kiro` 默认排除；`.opencode` 默认排除或单独审查。
- `src/uni_modules/**`、`gitee-example/**` 可随 app 快照保留，但在清单中标记为第三方/参考资料。
- app legacy DTO 只约束兼容层，不反向定义 admin 长期 DTO。
- `apps/type` 是 schema、Zod、Drizzle table 和 TS 类型唯一事实来源。
- 第一阶段不得声称 admin/app 已统一消费 `apps/api`；这只能在后续阶段完成。
