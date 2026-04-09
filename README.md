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
├─ scripts/              # 仓库辅助脚本
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
- `pnpm release`：通过 `relizy-runner` 执行正式发版
- `pnpm run release:dry`：预览完整 release 流程，不写文件、不提交、不打 tag、不 push
- `pnpm run changelog`：生成 changelog
- `pnpm run changelog:dry`：预览 changelog 生成

日常开发时的构建与部署入口也可直接查看 [apps/admin/README.md](./apps/admin/README.md)。

## Relizy 发版

根工作区已接入 `relizy`，采用 **independent** 模式管理 `apps/*` 下子包版本。`monorepo.packages` 与 [`pnpm-workspace.yaml`](./pnpm-workspace.yaml) 中的 `packages` 字段保持一致，由 [`relizy.config.ts`](./relizy.config.ts) 解析工作区清单并生成根 `CHANGELOG.md` 与各子包 `CHANGELOG.md`。

当前仓库的发版入口统一走 **`relizy-runner`**，该命令由 `@ruan-cat/utils@4.25.0+` 提供。它是 relizy 前面的**兼容与安全层**，不改变 relizy 的版本计算语义，只负责两件事：

- 在 Windows 上补齐 Git for Windows 自带的 `grep` / `head` / `sed` 路径，避免 PowerShell / cmd 下的 GNU 工具缺失报错。
- 在 `release` / `bump` 前检查 **independent** 模式所需的 package baseline tags，缺失时先打印补 tag 命令并阻断执行。

因此，**不要绕过 runner 直接在当前仓库里调用裸 `relizy release ...`** 作为日常发版入口。

### `--yes` 是做什么的？

`relizy release` 在真正 bump 前会弹出交互确认：**「Do you want to proceed with these version updates?」**。本地用终端跑、或在 CI / 自动化里没有附加输入时，进程会一直等 `(Y/n)`，表现为**卡住不动**。

根脚本里的 **`--yes`** 是 relizy 官方选项（帮助文案：_Skip confirmation prompt about bumping packages_），用来**跳过这一步确认**，不改变版本计算、changelog 或 commit/tag 逻辑。当前 `relizy-runner` 仅在 `release` / `bump` 路径消费或自动追加 `--yes`；`changelog` 子命令**不要**携带 `--yes`。

如果你需要本地人工逐步确认，不要改仓库脚本，直接使用 runner 提供的 `--no-yes`：

```bash
pnpm exec relizy-runner release --no-publish --no-provider-release --no-yes
```

### 常用命令

```bash
# 正式发版
pnpm release

# 预览完整 release
pnpm run release:dry

# 生成 changelog
pnpm run changelog

# 预览 changelog 生成
pnpm run changelog:dry
```

等价的底层入口如下：

```bash
pnpm exec relizy-runner release --no-publish --no-provider-release --yes
pnpm exec relizy-runner release --dry-run --no-publish --no-provider-release --no-push --no-commit --no-clean --yes
pnpm exec relizy-runner changelog
pnpm exec relizy-runner changelog --dry-run
```

**执行效果（`pnpm release` 默认）**

- 基于 **Conventional Commits** 分析 `apps/admin` 与 `apps/type` 的变更。
- 仅对有变更的子包生成独立版本号，并同步更新依赖它们的工作区包版本引用。
- 在根目录生成聚合 `CHANGELOG.md`，同时为每个参与发版的子包生成各自的 `CHANGELOG.md`（生成后由 `format:changelog` 统一格式化）。
- 创建并推送对应的 **git commit** 与 **package tag**。
- **不**执行 `npm publish`，**不**创建 GitHub / GitLab **provider release**（由 `--no-publish`、`--no-provider-release` 与配置共同保证）。

**常用 semver 升级示例（通过 pnpm 把参数传给 relizy）**

```bash
pnpm release -- --patch
pnpm release -- --minor
pnpm run release:dry -- --patch
```

仅本地生成提交与 tag、**不 push**：

```bash
pnpm exec relizy-runner release --no-publish --no-provider-release --yes --no-push
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
pnpm run changelog:dry

# 预览完整 release（仍会先经过 runner 的基线 tag 检查）
pnpm run release:dry
```

若尚未为各包打过 `@scope/pkg@version` 形式的 tag，runner 会先报错并给出 `git tag` 命令；应先补基线 tag，或在已具备 tag 的分支再试。

### 验证命令

按当前仓库标准入口，至少执行以下命令：

```bash
pnpm exec relizy-runner --help
pnpm exec relizy-runner changelog --dry-run
pnpm exec relizy-runner release --dry-run --no-publish --no-provider-release --no-push --no-commit --no-clean --yes
```

如果需要同时确认 relizy 本体可用，可补跑：

```bash
pnpm exec relizy --help
pnpm exec relizy release --help
```

通过 **pnpm 脚本** 向 relizy 追加参数时，使用 `--` 分隔：

```bash
pnpm release -- --patch
pnpm run release:dry -- --minor
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

不是所有接入 `relizy` 的项目都必须额外包一层兼容层：若项目已运行在 **Linux / macOS / CI**，且每个子包都已有完整的独立 **package tag** 历史，可以直接执行 `relizy release ...`。

但只要命中下面**任一**条件，就建议与本项目一样，在根命令前增加兼容层：

- 需要在 **Windows 本地**直接执行发版命令。当前 **`relizy@1.2.1`** 在 independent 模式下会直接调用 `grep` / `head` / `sed` 处理 git tag；Git Bash 或 CI 通常无妨，但 **PowerShell / cmd** 下不一定天然可用。
- **首次接入** independent，仓库里还没有每个子包各自的**基线 tag**。此时 `relizy` 需要先知道每个包从哪个 `@scope/pkg@x.y.z` tag 起算后续变更，否则第一次发版基线不清晰，上游报错也不够直观。

本项目**同时满足**上述两点，因此 [package.json](./package.json) 没有直接写成裸 `relizy release ...`，而是统一走 **`relizy-runner`**：

- 在 Windows 下自动补齐 Git for Windows 的 GNU 工具路径，确保 `grep` / `head` / `sed` 可用。
- 在真正调用 `relizy` 前，先检查 `apps/*` 子包是否已有基线 package tag；若没有，直接打印应补的 `git tag` / `git push` 命令，而不是等 `relizy` 内部再抛出不友好的错误。

**不改变** relizy 自身的发版与版本计算逻辑；兼容层只补齐**运行环境**与**首次接入约束**。

若其他仓库也使用 independent、需要照顾 Windows 本地发版、且子包尚无历史基线 tag，可复用同一类 runner 入口；这与「改 relizy 行为」无关，而是工程化上的前置条件。

### README 与 CHANGELOG 的边界

- README 负责说明发版入口、常用命令、兼容层职责和 dry-run 用法。
- CHANGELOG 负责记录版本历史。
- `rootChangelog: true` 表示参与生成根 `CHANGELOG.md`，**不等于**“修改 README”。
- `format:changelog` 只格式化 `CHANGELOG.md` 文件，不应承担 README 改写职责。

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
