# 11comm 智慧社区 · 前端 Monorepo

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ruan-cat/11comm)

基于 `pnpm workspace` + `Turbo` 管理应用与共享类型包；根目录接入 **Relizy** 做子包 **independent** 版本与聚合 Changelog。

**文档入口（请点击）**

- [前端技术文档](https://01s-10wms-frontend-docs.ruancat6312.top/)
- [本项目技术文档](./apps/admin/src/docs/technical-doc.md)

## 生产环境地址

生产环境地址的权威来源是各子项目 `package.json` 的 `homepage` 字段。自动化脚本、AI 代理和文档更新时都应先读取该字段，不要从历史报告、Vercel 列表截图或旧域名反推。

| 子项目                | 地址来源                                | 当前生产地址                         |
| --------------------- | --------------------------------------- | ------------------------------------ |
| admin 后台 H5         | `apps/admin/package.json` 的 `homepage` | <https://01s-11comm.ruan-cat.com>    |
| app H5                | `apps/app/package.json` 的 `homepage`   | <https://01s-11-app.ruan-cat.com>    |
| 统一 Nitro API server | `apps/api/package.json` 的 `homepage`   | <https://01s-11-server.ruan-cat.com> |

如果生产域名变更，先更新对应 `homepage`，再同步环境变量、部署说明和验证文档。

## 部署项目

> **Phase7 架构说明**：本 monorepo 从 Phase7 起统一后端入口至 `apps/api`，`apps/admin` 和 `apps/app` 均已转型为纯前端 SPA。

生产部署、环境变量与构建产物说明不在根 README 展开。admin 侧请阅读 **[admin 项目的文档](./apps/admin/README.md)**；app H5 与统一 API server 以各自 `apps/*/package.json` 的 scripts、env 文件和 `homepage` 字段为准。

### Vercel 云端配置与 `vercel.json` 禁止事项

本仓库是 pnpm workspace monorepo，同一个 Git 仓库会被 `apps/admin`、`apps/app`、`apps/api` 对应的多个 Vercel Project 读取。Vercel 的 `vercel.json` 位于项目根目录时，会覆盖该 Project 的 `outputDirectory`、`buildCommand`、`installCommand` 等 Project Settings；如果多个 Vercel Project 共用同一个仓库根目录，根 `vercel.json` 会被这些项目共同读到。

2026-07-09，Vercel 项目 `11comm-app-h5` 曾因仓库根目录存在 `{"outputDirectory":"apps/admin/dist"}` 的 `vercel.json` 多次部署失败。该配置属于 admin 项目输出目录，却污染了 app H5 项目的构建产物查找。最终 commit `2707fcfd2acf0ff0948195b342470861ef395366` 删除根目录 `vercel.json` 后恢复 READY。

为防止同类事故复发：

- **禁止**在仓库根目录新增或恢复 `vercel.json`。
- **禁止**在各子目录提交具体 Vercel 部署配置文件来固化 Project 专属配置。
- Vercel Project 专属的 Framework Preset、Root Directory、Build Command、Output Directory、Install Command、Ignored Build Step 和环境变量，统一在 Vercel 云端 Project Settings 管理。
- README 只能记录云端 Project Settings 的期望值，禁止把这些值写入仓库 `vercel.json`。

### Phase7 Monorepo 部署架构

```plain
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Phase7 Monorepo 部署架构                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   开发者/CI                              Vercel                             │
│                                                                             │
│   git push dev ─── GitHub Actions ────► Vercel deployments                  │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  apps/admin (SPA)     apps/app (SPA)      apps/api (Nitro Serverless)│   │
│   │  ────────────────     ──────────────      ─────────────────────────  │   │
│   │  https://01s-11comm   https://01s-11-app   https://01s-11-server    │   │
│   │  .ruan-cat.com        .ruan-cat.com        .ruan-cat.com            │   │
│   │  Vercel Static        Vercel Static        Vercel Serverless Funcs  │   │
│   │                                                                 │   │
│   │  dist/** → .vercel    dist/build/h5/**    server/routes/api/**    │   │
│   │  /output/**           → .vercel/output/** (Nitro handlers)        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                      ▲                                       │
│                                      │ API 请求                               │
│                                      └─────────────────────────────────────   │
│   consumers ───► browsers ─────────────────────────────────────────────────►│
│                                                                             │
│   apps/type (共享类型库) ← 被所有子包通过 workspace:^ 依赖                   │
│   ├── business/**/schema.ts  (Drizzle Table + Zod Schemas)                  │
│   └── shared/**             (通用类型与工具)                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

| 子项目       | 产物类型         | 本地构建命令示例                        | 部署平台                    |
| :----------- | :--------------- | :-------------------------------------- | :-------------------------- |
| `apps/admin` | 纯 SPA           | `pnpm -F @01s-11comm/admin build:prod`  | Vercel Static               |
| `apps/app`   | H5 SPA           | `pnpm -F @01s-11comm/app build:h5:prod` | Vercel Static               |
| `apps/api`   | Nitro Serverless | `pnpm -F @01s-11comm/api build`         | Vercel Serverless Functions |
| `apps/type`  | 共享类型库       | `pnpm -F @01s-11comm/type build`        | N/A（被依赖）               |

> **变更历史**：Phase6 时 `apps/admin` 和 `apps/app` 各自带内置 Nitro 服务端，Phase7 统一迁移至独立 `apps/api` 服务。详见 [OpenSpec 变更 `migrate-superpowers-docs-to-openspec-longtask`](./openspec/changes/migrate-superpowers-docs-to-openspec-longtask/)。

> **Vercel 云端入口**：Build Command / Output Directory 以各子项目 README 的“vercel 云项目的部署配置”章节为准，不从本地构建命令示例反推。

## 项目结构

```plain
01s-11comm/
├─ apps/
│  ├─ admin/              # 管理端（Vue 3 + Vite SPA，Phase7 不再内置 Nitro）
│  ├─ app/                # 移动端 H5 / uni-app 子应用（Phase7 不再内置 Nitro）
│  ├─ api/                # 独立统一 Nitro API server（Phase7 新增）
│  └─ type/               # 共享类型与 DB schema（workspace 包）
├─ openspec/
│  └─ changes/
│     └─ migrate-superpowers-docs-to-openspec-longtask/  # Phase7 Nitro 退役变更
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

根工作区当前使用 **两段式本地发版 + 一次性推送**：

1. `release:sub`：由 `relizy-runner + relizy` 负责 `apps/*` 子包的 **independent** 版本计算、子包 changelog、根聚合 changelog、commit 与 scoped tags。
2. `release:root`：由 `bumpp` 负责根包版本号与 `v*` tag，并在 [`bump.config.ts`](./bump.config.ts) 中通过 `changelogen --output CHANGELOG.md -r <newVersion>` 回写根 `CHANGELOG.md`。
3. `git:push`：统一 `git push --follow-tags`，让子包 tag 与根包 tag 在一次 push 中到达远端。

因此，`pnpm release` 的实际执行链路是：

```bash
pnpm run release:sub && pnpm run release:root && pnpm run git:push
```

### 子包入口`relizy-runner`

子包发版入口统一走 **`relizy-runner`**，该命令由 `@ruan-cat/utils@4.25.0+` 提供。它是 relizy 前面的**兼容与安全层**，不改变 relizy 的版本计算语义，只负责两件事：

- 在 Windows 上补齐 Git for Windows 自带的 `grep` / `head` / `sed` 路径，避免 PowerShell / cmd 下的 GNU 工具缺失报错。
- 在 `release` / `bump` 前检查 **independent** 模式所需的 package baseline tags，缺失时先打印补 tag 命令并阻断执行。

因此，**不要绕过 runner 直接在当前仓库里调用裸 `relizy release ...`** 作为日常发版入口。

### 根包入口`bumpp + changelogen`

根包不再通过 `conventional-changelog-cli` 生成 changelog，而是使用：

- `pnpm run release:root`：`bumpp --yes --release patch`
- `pnpm run changelog:root`：`changelogen --output CHANGELOG.md`

`release:root` 会调用 [`bump.config.ts`](./bump.config.ts) 中的 `execute` 钩子，显式执行：

```bash
pnpm exec changelogen --output CHANGELOG.md -r <newVersion>
```

GitHub Actions 随后从根 `CHANGELOG.md` 中提取根包 `v*` tag 对应的 section，并为每个 tag 创建 GitHub Release。

### 常用命令

```bash
# 主发版命令：子包 -> 根包 -> 统一推送
pnpm release

# 只预览子包 release 流程
pnpm run release:dry

# 批量生成子包与根聚合 changelog
pnpm run changelog

# 预览 changelog 生成
pnpm run changelog:dry

# 手动重建根 CHANGELOG.md
pnpm run changelog:root

# 手动使用根包工具
pnpm run release:root
pnpm run release:bumpp
pnpm run release:changelogen
```

等价的底层入口如下：

```bash
pnpm exec relizy-runner release --no-publish --no-provider-release --no-push --yes
pnpm exec relizy-runner release --dry-run --no-publish --no-provider-release --no-push --no-commit --no-clean --yes
pnpm exec relizy-runner changelog
pnpm exec relizy-runner changelog --dry-run
pnpm exec changelogen --output CHANGELOG.md
```

### `--yes` 是做什么的？

`relizy release` 在真正 bump 前会弹出交互确认：**「Do you want to proceed with these version updates?」**。本地用终端跑、或在 CI / 自动化里没有附加输入时，进程会一直等 `(Y/n)`，表现为**卡住不动**。

根脚本里的 **`--yes`** 是 relizy 官方选项（帮助文案：_Skip confirmation prompt about bumping packages_），用来**跳过这一步确认**，不改变版本计算、changelog 或 commit/tag 逻辑。当前 `relizy-runner` 仅在 `release` / `bump` 路径消费或自动追加 `--yes`。

如果你需要本地人工逐步确认，不要改仓库脚本，直接使用 runner 提供的 `--no-yes`：

```bash
pnpm exec relizy-runner release --no-publish --no-provider-release --no-yes
```

### 已知上游差异`changelog --dry-run --yes`

为了与全局 `init-release-base-relizy-and-bumpp` 技能文档保持一致，仓库文档保留以下技能原文验证命令：

```bash
pnpm exec relizy-runner changelog --dry-run --yes
```

但当前 `@ruan-cat/utils` 提供的 `relizy-runner` 版本在 `changelog` 子命令下会报：

```log
error: unknown option '--yes'
```

因此，这条命令目前视为**上游已知差异**的记录口径，不在本仓库通过自建 runner、本地脚本或 vendor patch 绕过。  
当前仓库的临时可执行命令仍是：

```bash
pnpm exec relizy-runner changelog --dry-run
```

### 执行效果（`pnpm release` 默认）

- 基于 **Conventional Commits** 分析 `apps/admin` 与 `apps/type` 的变更。
- 仅对有变更的子包生成独立版本号，并同步更新依赖它们的工作区包版本引用。
- 在根目录生成聚合 `CHANGELOG.md`，同时为每个参与发版的子包生成各自的 `CHANGELOG.md`（生成后由 `format:changelog` 统一格式化）。
- 根包单独生成 `v*` tag，并通过 `changelogen` 生成根 changelog section。
- 最终统一推送对应的 **git commit** 与 **package tag**。
- **不**执行 `npm publish`，**不**创建 GitHub / GitLab **provider release**（由 `--no-publish`、`--no-provider-release` 与配置共同保证）。

**常用 semver 升级示例（通过 pnpm 把参数传给 relizy）**

```bash
pnpm release -- --patch
pnpm release -- --minor
pnpm run release:dry -- --patch
```

仅本地生成子包提交与 tag、**不 push**：

```bash
pnpm exec relizy-runner release --no-publish --no-provider-release --yes --no-push
```

### 预览（dry-run）

relizy 支持全局 `--dry-run`：**不写入文件、不创建 tag/commit、不 publish**，用于预览将执行的操作。通过 runner 传入时，参数写在子命令之后即可。

```bash
# 仅预览 changelog 生成（不写盘、不改仓库）
pnpm run changelog:dry

# 预览完整子包 release（仍会先经过 runner 的基线 tag 检查）
pnpm run release:dry
```

若尚未为各包打过 `@scope/pkg@version` 形式的 tag，runner 会先报错并给出 `git tag` 命令；应先补基线 tag，或在已具备 tag 的分支再试。

### 验证命令

按当前仓库标准入口，至少执行以下命令：

```bash
pnpm exec relizy-runner --help
pnpm exec relizy-runner changelog --dry-run --yes
pnpm exec relizy-runner release --dry-run --no-publish --no-provider-release --no-push --no-commit --no-clean --yes
pnpm exec bumpp --help
pnpm exec bumpp --dry-run --release patch --yes
pnpm exec changelogen --output CHANGELOG.md -r 0.0.1
```

当前因上游差异需要实际补跑的 changelog dry-run 命令：

```bash
pnpm exec relizy-runner changelog --dry-run
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
