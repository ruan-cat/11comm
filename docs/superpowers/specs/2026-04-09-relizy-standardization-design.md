# 2026-04-09 Relizy 标准化收敛设计

> 2026-04-17 当前状态补充：
>
> - 本文是 2026-04-09 针对“Relizy 入口标准化”的阶段性设计，不再代表仓库当前完整发版基线。
> - 当前现行链路已升级为：子包使用 `relizy-runner + relizy`，根包使用 `bumpp + changelogen`，GitHub Release 从根 `CHANGELOG.md` 提取。
> - `conventional-changelog-cli` 与 `changelog:conventional-changelog` 已从现行根发版链路移除；下文若提到它们，应视为历史背景。

## 背景

当前仓库已经接入 relizy，但仍保留一套仓库内自建的 [`scripts/relizy-runner.ts`](../../../../scripts/relizy-runner.ts) 兼容层，并由根 [`package.json`](../../../../package.json) 的 `release` / `release:relizy` 脚本通过 `tsx` 调用。这个实现与全局 `init-relizy` 技能当前基线不一致。

根据技能要求，标准接入方式应改为使用 `@ruan-cat/utils` 提供的 `relizy-runner` bin，禁止继续在业务仓库内维护本地 runner 副本。同时，README 中现有 Relizy 发版章节也围绕旧脚本组织，需要同步改写为 bin 入口和标准 dry-run 验证命令。

## 目标

1. 将根发版入口从本地 `tsx scripts/relizy-runner.ts` 收敛为 `relizy-runner` bin。
2. 删除仓库内本地 runner 代码和仅服务于该 runner 的测试。
3. 统一根 README 的 Relizy 发版文档，使其与实际脚本和 `init-relizy` 技能要求一致。
4. 保持现有 monorepo 的 `independent` 版本策略、`apps/*` 工作区范围和 `publish: false` / `providerRelease: false` 安全基线不变。
5. 通过标准化 dry-run 命令验证新入口可用。

## 非目标

1. 不将 `versionMode` 从 `independent` 改为其他模式。
2. 不回滚 `apps/admin`、`apps/type` 的 `private: false` 现状。
3. 不重写历史报告或 issue 调研文档的历史叙述，只修正当前有效入口和当前 README。
4. 不清理全部旧发版链路依赖与脚本，例如 `bumpp`、`conventional-changelog-cli`；本次仅处理 Relizy 主链路。（这是 2026-04-09 的阶段性边界。当前仓库后续已继续演进，现行根链路已移除 `conventional-changelog-cli`。）

## 现状侦察结论

### 工作区与版本策略

- 根工作区由 [`pnpm-workspace.yaml`](../../../../pnpm-workspace.yaml) 定义，正向 glob 为 `apps/*`。
- [`relizy.config.ts`](../../../../relizy.config.ts) 已使用 `pnpm-workspace-yaml` 解析工作区，并配置 `versionMode: "independent"`。
- Git 中已存在 baseline tags：
  - `@01s-11comm/admin@6.0.0` 至 `@01s-11comm/admin@6.1.2`
  - `@01s-11comm/type@1.0.0` 至 `@01s-11comm/type@1.1.1`

### 当前阻塞

- `package.json` 和 `pnpm-lock.yaml` 声明依赖为 `@ruan-cat/utils@4.22.0`、`relizy@1.2.2-beta.0`。
- 当前 `node_modules` 内实际落地的 `@ruan-cat/utils` 版本是 `4.20.0`，不包含 `relizy-runner` bin。
- `pnpm exec relizy --help` 当前直接失败，说明现有安装状态与锁文件不一致，必须先做定向依赖同步。

### 需要收敛的旧实现

- 根脚本仍直接依赖本地 [`scripts/relizy-runner.ts`](../../../../scripts/relizy-runner.ts)。
- 测试 [`tests/relizy-runner.test.ts`](../../../../tests/relizy-runner.test.ts) 直接 import 该本地 runner。
- 根 [`README.md`](../../../../README.md) 的 Relizy 发版章节、常用命令、验证命令、兼容说明都绑定旧 runner 路径。

## 方案对比

### 方案 A：最小替换

只替换 `package.json` 脚本和 README 命令，删除本地 runner。

优点：

- 改动面最小。

缺点：

- 缺少技能模板中的 `release:dry`、`changelog`、`changelog:dry` 标准入口。
- 可维护性不足，未来仍容易继续沿用旧命名和旧文档习惯。

### 方案 B：标准化收敛

在根脚本层完整对齐 `init-relizy` 推荐入口，定向升级依赖，删除本地 runner，并按技能验证矩阵验收。

优点：

- 与当前技能基线一致。
- 文档与脚本统一，后续扩展最稳定。
- 删除本地 runner 后，不再维护重复逻辑。

缺点：

- 旧命令入口会收缩，存在轻微命令兼容性变化。

### 方案 C：激进清理

除方案 B 外，再一并清理其它旧发版工具和依赖。

优点：

- 发版链路最干净。

缺点：

- 风险过高，超出本次任务范围。

## 选定方案

采用方案 B。

## 设计

### 1. 依赖层

先执行一次定向依赖同步，使 `node_modules` 与锁文件、根 `package.json` 一致，确保以下前置条件成立：

- `@ruan-cat/utils` 版本落到带 `relizy-runner` bin 的版本；
- `relizy` CLI 在当前仓库可执行；
- 不通过新增本地脚本解决 runner 缺失问题。

依赖处理顺序固定为：

1. 先执行 `pnpm install`，校正当前 `node_modules` 与锁文件不一致的问题。
2. 检查 `node_modules/@ruan-cat/utils/package.json` 是否暴露 `relizy-runner` bin，检查 `pnpm exec relizy --help` 是否恢复正常。
3. 如果第 2 步仍失败，则显式升级根开发依赖中的 `@ruan-cat/utils` 与 `relizy`，再重新安装并复验。

### 2. 根脚本层

根 [`package.json`](../../../../package.json) 收敛为以下 Relizy 主入口：

- `release`
- `release:dry`
- `changelog`
- `changelog:dry`

这些命令都直接使用 `relizy-runner` bin，并在脚本中显式写出 `--yes`。保留 `release` 作为主入口；不再保留 `release:relizy` 这种依赖旧实现语义的别名。

### 3. 代码删除层

删除以下旧实现：

- [`scripts/relizy-runner.ts`](../../../../scripts/relizy-runner.ts)
- [`tests/relizy-runner.test.ts`](../../../../tests/relizy-runner.test.ts)

删除原则是只移除本仓库自建 runner 及其测试，不影响 relizy 配置文件和历史报告。

### 4. 配置层

保留 [`relizy.config.ts`](../../../../relizy.config.ts) 的核心语义：

- `types` 继续复用 [`changelog.config.ts`](../../../../changelog.config.ts)
- `versionMode: "independent"`
- `monorepo.packages` 与 [`pnpm-workspace.yaml`](../../../../pnpm-workspace.yaml) 对齐
- `release.publish = false`
- `release.providerRelease = false`

`relizy.config.ts` 默认不做语义改造。只有在依赖升级后出现类型不兼容，或当前配置字段与技能要求的 `release` 默认块不一致时，才允许做等价修正；修正范围只限于保持现有 `independent`、`packages`、`publish: false`、`providerRelease: false` 语义不变。

### 5. 文档层

重写根 [`README.md`](../../../../README.md) 的 Relizy 发版章节，重点改成：

- 不再提及仓库内 `scripts/relizy-runner.ts`
- 所有命令改为 `relizy-runner` bin 入口
- 明确 `--yes` / `--no-yes` 只适用于 `release` / `bump`，`changelog` 不携带 `--yes`
- 提供标准 dry-run 与 release dry-run 验证命令
- 保持 README 与 CHANGELOG 的职责边界，不让 `formatCmd` 承担 README 改写语义

历史文档如 [`apps/admin/src/docs/reports/2026-03-23-relizy-independent-release-breaking-change.md`](../../../../apps/admin/src/docs/reports/2026-03-23-relizy-independent-release-breaking-change.md) 和 [`docs/issues/relizy/2026-03-24-windows-path-body-filter-no-bump.md`](../../../../docs/issues/relizy/2026-03-24-windows-path-body-filter-no-bump.md) 保留原有历史叙述，不作为当前入口说明来源。

## 数据流与执行流

新的执行流应为：

1. 用户执行根脚本，例如 `pnpm release`。
2. 根脚本调用 `relizy-runner` bin。
3. `relizy-runner` 在执行前处理 Windows GNU 兼容、baseline tag 预检，并对 `release` / `bump` 自动补齐或显式消费 `--yes` 逻辑。
4. 兼容层通过后，再进入 `relizy` 本体执行版本分析、changelog 生成、commit、tag 等流程。

这样仓库自身不再承担 runner 实现细节，只维护配置和命令入口。

## 错误处理

### 依赖侧错误

如果 `pnpm install` 后依旧无法执行 `pnpm exec relizy-runner --help`，优先排查：

- `@ruan-cat/utils` 实际安装版本是否正确；
- `node_modules/.bin` 是否生成 `relizy-runner`；
- 当前版本是否真的发布了该 bin。

### 运行侧错误

如果 dry-run 报 `grep` / `head` / `sed` 缺失，应视为 `relizy-runner` 入口未正确生效，而不是 README 或配置问题。

如果 dry-run 报“无可 bump 包”，但没有配置/平台错误，则解释为当前无变更可发，不应视为接入失败。

## 测试与验证

实施完成后，至少执行以下验证：

```bash
pnpm exec relizy-runner --help
pnpm exec relizy-runner changelog --dry-run
pnpm exec relizy-runner release --dry-run --no-publish --no-provider-release --no-push --no-commit --no-clean --yes
```

根据仓库状态补充：

- `pnpm exec relizy --help`
- `pnpm exec prettier --check README.md package.json relizy.config.ts changelog.config.ts`

验证重点：

1. CLI 可执行。
2. 新脚本与 README 命令一致。
3. 删除本地 runner 后，不再存在任何当前入口依赖 `tsx scripts/relizy-runner.ts`。

## 破坏性变更与兼容性说明

本次属于轻微命令层破坏性变更：

- 旧的 `release:relizy` 别名会被移除；
- 仓库内本地 `scripts/relizy-runner.ts` 不再保留；
- 任何依赖该本地脚本路径的内部说明都必须迁移到 bin 入口。

但以下对外语义保持不变：

- 仍使用 `independent` 版本模式；
- 仍不执行 publish；
- 仍不创建 provider release；
- 仍保留 Windows 兼容与 baseline tag 预检能力，只是由 `@ruan-cat/utils` 提供。

## 实施清单

1. 先执行 `pnpm install`；若 bin 或 CLI 仍缺失，再升级 `@ruan-cat/utils`、`relizy` 并重装。
2. 改写根 `package.json` 的 Relizy 相关脚本。
3. 删除本地 runner 与其测试。
4. 仅在类型或字段兼容性需要时，对 `relizy.config.ts` 做等价调整。
5. 重写根 README 的 Relizy 发版章节。
6. 跑标准验证命令并记录结果。
