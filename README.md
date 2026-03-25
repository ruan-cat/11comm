# 11comm 智慧社区 · 前端 Monorepo

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ruan-cat/11comm)

基于 `pnpm workspace` + `Turbo` 管理应用与共享类型包；根目录接入 **Relizy** 做子包 **independent** 版本与聚合 Changelog。

**文档入口（请点击）**

- [前端技术文档](https://01s-10wms-frontend-docs.ruancat6312.top/)
- [本项目技术文档](./apps/admin/src/docs/technical-doc.md)

## 部署项目

生产部署、环境变量与构建产物说明不在根 README 展开，请阅读 **[admin 项目的文档](./apps/admin/README.md)**。

## 项目结构

```plain
01s-11comm/
├─ apps/
│  ├─ admin/              # 管理端（Vue 3 + Vite + Nitro 等）
│  └─ type/               # 共享类型与 DB schema（workspace 包）
├─ examples/              # 示例（pnpm-workspace 中排除，非工作区子包）
├─ apps/admin/src/docs/  # 技术说明、报告与 prompts
├─ scripts/
│  └─ relizy-runner.ts    # Relizy 发版兼容层（Windows GNU、基线 tag）
├─ pnpm-workspace.yaml
├─ turbo.json
├─ relizy.config.ts
└─ package.json
```

## 环境要求

- **Node.js**：`>=22.14.0`（见根 [package.json](./package.json) 的 `engines`）
- **pnpm**：`10.32.1`（见 `packageManager`）
- **系统**：推荐 Windows PowerShell / macOS / Linux

## 快速开始

```bash
# 1) 在 monorepo 根目录安装依赖
pnpm install

# 2) 启动管理端开发（工作区包名见 apps/*/package.json）
pnpm --filter @01s-11comm/admin dev
```

## 常用命令（根目录）

- `pnpm build`：Turbo 构建工作区
- `pnpm test`：Vitest（默认带 UI，见脚本）
- `pnpm format`：Prettier 写入
- `pnpm format:changelog`：格式化根目录与各工作区包的 `CHANGELOG.md`
- `pnpm clear` / `pnpm clear:deps` / `pnpm clear:cache`：清理依赖或构建缓存
- `pnpm ci`：等价于 `pnpm run build`
- `pnpm release`：经 [`scripts/relizy-runner.ts`](./scripts/relizy-runner.ts) 调用 relizy（与下方 `release:relizy` 相同，见「Relizy 发版」）
- `pnpm release:relizy`：显式走兼容层（推荐在文档、CI 中引用此名称）

日常开发时的构建与部署入口也可直接查看 [apps/admin/README.md](./apps/admin/README.md)。

## Relizy 发版

根工作区已接入 `relizy`，采用 **independent** 模式管理 `apps/*` 下子包版本。`monorepo.packages` 与 [`pnpm-workspace.yaml`](./pnpm-workspace.yaml) 中的 `packages` 字段保持一致（由配置解析，无需重复手写 glob）。当前工作区正项为 `apps/*`：各子包独立维护版本号，并生成根目录总 `CHANGELOG.md` 与各包 `CHANGELOG.md`。

配置与实现细节如下：

- [`relizy.config.ts`](./relizy.config.ts) 使用 [`pnpm-workspace-yaml`](https://github.com/antfu/pnpm-workspace-utils/tree/main/packages/pnpm-workspace-yaml) 解析工作区清单（`monorepo.packages`），并对 `!` 开头的排除项做过滤；changelog 生成后的格式化由根脚本 **`pnpm run format:changelog`** 执行（定义在 [package.json](./package.json) 的 `format:changelog`）。
- [`scripts/relizy-runner.ts`](./scripts/relizy-runner.ts) 同样用该库解析 `pnpm-workspace.yaml`，枚举 `apps/*` 下一级子包，用于 **基线 tag** 检查（仅 **`release` / `bump`** 会触发）。

这里额外包一层 `tsx scripts/relizy-runner.ts`，**不是为了改 relizy 的发版逻辑**，而是为了补两类前置约束：**Windows** 下给 relizy 补齐 `grep` / `head` / `sed` 依赖；**首次接入 independent** 时先检查子包基线 tag。包装层通过后，才等价于执行（与根目录 `package.json` 中 `release` / `release:relizy` 脚本一致）：

```bash
relizy release --no-publish --no-provider-release --yes
```

发版入口仍应统一走 **relizy-runner**：在 Windows 上为 relizy 补齐 Git 自带的 `grep` / `head` / `sed` 路径；在 `release` / `bump` 前校验 independent 基线 tag（首次发版前需按提示补打 tag）。**不要绕过 runner** 直接调用 `relizy`，以免在 PowerShell 下踩上游 shell 依赖问题。

**兼容处理摘要**

- Windows 下自动补齐 **Git for Windows** 的 `usr\bin` 等路径，避免 `relizy` 内部调用 `grep`、`head`、`sed` 失败。
- 首次接入时检查每个子包是否已有 **`@scope/pkg@x.y.z`** 形式的 package tag；若没有，会直接打印需要补打的基线 tag 命令，而不是等 `relizy` 进入内部流程后再报错。

### `--yes` 是做什么的？

`relizy release` 在真正 bump 前会弹出交互确认：**「Do you want to proceed with these version updates?」**。本地用终端跑、或在 CI / 自动化里没有附加输入时，进程会一直等 `(Y/n)`，表现为**卡住不动**。

根脚本里的 **`--yes`** 是 relizy 官方选项（帮助文案：_Skip confirmation prompt about bumping packages_），用来**跳过这一步确认**，不改变版本计算、changelog 或 commit/tag 逻辑。若你需要人工过目计划再确认，可自行去掉 `--yes`，改用交互式终端执行 `pnpm exec tsx scripts/relizy-runner.ts release ...`（不加 `--yes`）。

### 常用命令

```bash
# 正式发版（与 package.json 中 release 脚本一致）
pnpm release

# 等价写法
pnpm run release:relizy

# 等价于实际执行的（便于对照参数；含非交互确认）
pnpm exec tsx scripts/relizy-runner.ts release --no-publish --no-provider-release --yes
```

**执行效果（`pnpm release` / `pnpm release:relizy` 默认）**

- 基于 **Conventional Commits** 分析 `apps/admin` 与 `apps/type` 的变更。
- 仅对有变更的子包生成独立版本号，并同步更新依赖它们的工作区包版本引用。
- 在根目录生成聚合 `CHANGELOG.md`，同时为每个参与发版的子包生成各自的 `CHANGELOG.md`（生成后由 `format:changelog` 统一格式化）。
- 创建并推送对应的 **git commit** 与 **package tag**。
- **不**执行 `npm publish`，**不**创建 GitHub / GitLab **provider release**（由 `--no-publish`、`--no-provider-release` 与配置共同保证）。

**常用 semver 升级示例（通过 pnpm 把参数传给 relizy）**

```bash
pnpm release:relizy -- --patch
pnpm release:relizy -- --minor
pnpm release:relizy -- --patch --dry-run --no-clean
```

仅本地生成提交与 tag、**不 push**：

```bash
pnpm exec tsx scripts/relizy-runner.ts release --no-publish --no-provider-release --yes --no-push
```

**注意事项**

- `relizy` **不会**扫描 `private: true` 的 workspace 包，因此 `apps/admin` 和 `apps/type` 已改为可参与版本管理的包。
- 这意味着两个子包**不再**享有 `private: true` 的「禁止发布」语义保护；当前仅通过 `relizy` 命令参数和配置显式禁用了 **publish** / **provider release**。
- 若后续要**真的**接入 npm 发布，请先评估私有 registry、`publishConfig` 和权限策略，再移除 `--no-publish`。
- 接入背景、`private` 调整与迁移注意点见 [relizy 独立发版破坏性变更说明](./apps/admin/src/docs/reports/2026-03-23-relizy-independent-release-breaking-change.md)。

### 预览（dry-run）

relizy 支持全局 `--dry-run`：**不写入文件、不创建 tag/commit、不 publish**，用于预览将执行的操作。通过 runner 传入时，参数写在子命令之后即可。

```bash
# 仅预览 changelog 生成（不写盘、不改仓库）
pnpm exec tsx scripts/relizy-runner.ts changelog --dry-run

# 预览完整 release（仍会先经过 runner 的基线 tag 检查）
pnpm exec tsx scripts/relizy-runner.ts release --dry-run --no-publish --no-provider-release --yes
```

若尚未为各包打过 `@scope/pkg@version` 形式的 tag，runner 会先报错并给出 `git tag` 命令；应先补基线 tag，或在已具备 tag 的分支再试。

**仅验证 runner 与 relizy CLI（不触发基线 tag 校验）**

`release` / `bump` 才会做基线 tag 检查；子命令 **`changelog`** 不会。可在仓库根目录执行：

```bash
pnpm exec tsx scripts/relizy-runner.ts changelog --help
```

应能打印 relizy 的 `changelog` 子命令帮助；若缺少 `node_modules`，或 Windows 下 GNU 工具不可用，会在此阶段暴露。

通过 **pnpm 脚本** 向 relizy 追加参数时，使用 `--` 分隔：

```bash
pnpm release:relizy -- --patch --dry-run --no-clean
```

查看 relizy 选项与子命令：

```bash
pnpm exec relizy --help
pnpm exec relizy release --help
pnpm exec tsx scripts/relizy-runner.ts changelog --help
```

**自动化测试**（基线 tag 提示与命令过滤逻辑）：

```bash
pnpm exec vitest run tests/relizy-runner.test.ts
```

常用 `release` 子命令参数（节选，完整列表见 `relizy release --help`）：

| 参数                                 | 含义                                         |
| ------------------------------------ | -------------------------------------------- |
| `--dry-run`                          | 预览，不写文件、不打 tag、不提交、不 publish |
| `--no-push`                          | 不 push 到远端                               |
| `--no-publish`                       | 不执行 npm publish                           |
| `--no-provider-release`              | 不在 GitHub/GitLab 创建 Release              |
| `--no-commit`                        | 不创建提交与 tag（与其它跳过项组合使用）     |
| `--no-changelog`                     | 不生成 changelog 文件                        |
| `--no-verify`                        | 提交时跳过 git hooks                         |
| `--major` / `--minor` / `--patch` 等 | 指定 semver 升级策略                         |

首次接入 **independent** 前需补基线 tag（版本号以当前 `package.json` 为准）：

```bash
git tag "@01s-11comm/admin@6.0.0"
git tag "@01s-11comm/type@1.0.0"
git push origin "@01s-11comm/admin@6.0.0" "@01s-11comm/type@1.0.0"
```

### 为什么需要 `relizy-runner` 兼容层？

不是所有接入 `relizy` 的项目都必须额外包一层脚本：若项目已运行在 **Linux / macOS / CI**，且每个子包都已有完整的独立 **package tag** 历史，可以直接执行 `relizy release ...`。

但只要命中下面**任一**条件，就建议与本项目一样，在根命令前增加兼容层：

- 需要在 **Windows 本地**直接执行发版命令。当前 **`relizy@1.2.1`** 在 independent 模式下会直接调用 `grep` / `head` / `sed` 处理 git tag；Git Bash 或 CI 通常无妨，但 **PowerShell / cmd** 下不一定天然可用。
- **首次接入** independent，仓库里还没有每个子包各自的**基线 tag**。此时 `relizy` 需要先知道每个包从哪个 `@scope/pkg@x.y.z` tag 起算后续变更，否则第一次发版基线不清晰，上游报错也不够直观。

本项目**同时满足**上述两点，因此 [package.json](./package.json) 没有直接写成裸 `relizy release ...`（标准发版脚本为 `release --no-publish --no-provider-release --yes`，另见上文「`--yes`」），而是先通过 **`tsx scripts/relizy-runner.ts`** 做前置处理：

- 在 Windows 下自动补齐 Git for Windows 的 GNU 工具路径，确保 `grep` / `head` / `sed` 可用。
- 在真正调用 `relizy` 前，先检查 `apps/*` 子包是否已有基线 package tag；若没有，直接打印应补的 `git tag` / `git push` 命令，而不是等 `relizy` 内部再抛出不友好的错误。

**不改变** relizy 自身的发版与版本计算逻辑；兼容层只补齐**运行环境**与**首次接入约束**。

若其他仓库也使用 independent、需要照顾 Windows 本地发版、且子包尚无历史基线 tag，可复用同一类脚本；这与「改 relizy 行为」无关，而是工程化上的前置条件。

## 工作区子包

| 路径         | 包名                | 说明              |
| ------------ | ------------------- | ----------------- |
| `apps/admin` | `@01s-11comm/admin` | 管理端主应用      |
| `apps/type`  | `@01s-11comm/type`  | 共享类型与 schema |

## README 约定

本仓库采用「根 README + 子包 README」双层文档：

- **根 README**：单仓全局信息、环境、发版与协作入口
- **子包 README**：该包用途、脚本与本地开发方式（例如 [apps/admin/README.md](./apps/admin/README.md)）

请优先阅读你将要修改的目标子包 README。
