## ADDED Requirements

### Requirement: 旧 Nitro server 目录必须先评审后删除

`apps/admin/server` 与 `apps/app/server` MUST 在独立退役评审完成前保持受保护状态。任何删除、移动、归档、重命名或清空行为 MUST 等待本评审给出 `delete-candidate` 结论、通过 dry-run 验证、具备回滚方案，并获得用户明确确认。

#### Scenario: 用户要求删除旧 Nitro server 目录

- **WHEN** 用户或代理准备删除、移动、归档、重命名或清空 `apps/admin/server` 或 `apps/app/server`
- **THEN** 系统 MUST 先检查本 change 的退役评审结果，且在未出现 `delete-candidate` 与用户确认前阻止执行

#### Scenario: OpenSpec 迁移任务已经完成

- **WHEN** `migrate-superpowers-docs-to-openspec-longtask` 显示任务全部完成并通过 `openspec validate --strict`
- **THEN** 系统 MUST 只把该状态解释为迁移和证据体系完成，不得把它解释为旧 Nitro server 目录可删除

### Requirement: 退役评审必须维护目录级证据矩阵

退役评审 MUST 为 `apps/admin/server` 与 `apps/app/server` 建立目录级证据矩阵。矩阵中的每个文件组、endpoint 组或运行时职责 MUST 记录 source path、current dependency、target replacement、caller evidence、test/build evidence、fallback evidence、DB/write evidence、retirement decision 和 rollback note。

#### Scenario: 评审 `apps/admin/server`

- **WHEN** 评审 admin 旧 server 目录
- **THEN** 证据矩阵 MUST 覆盖 `/api/**` route、`server/db/**`、`server/services/**`、`server/utils/**`、`server/middleware/**`、`server/plugins/**`、`apps/admin/nitro.config.ts`、`apps/admin/package.json` 和 `apps/admin/drizzle.config.ts`

#### Scenario: 评审 `apps/app/server`

- **WHEN** 评审 app 旧 server 目录
- **THEN** 证据矩阵 MUST 覆盖 `/app/**`、`/callComponent/**`、`server/modules/**`、`server/handlers/**`、`server/shared/runtime/**`、`apps/app/nitro.config.ts`、`apps/app/vite.config.ts`、`apps/app/package.json`、`apps/app/src/api/mock/**` 和 `apps/app/src/tests/nitro-runtime/**`

### Requirement: 退役决策状态必须保守升级

每个评审项的 `retirementDecision` MUST 只能使用 `protected`、`blocked`、`keep-source`、`not-candidate-but-unused` 或 `delete-candidate`。初始状态 MUST 为 `protected` 或 `blocked`。只有当反向依赖清零、替代实现明确、验证通过、fallback 关闭或保留策略明确、回滚方案可执行时，才允许升级为 `delete-candidate`。

#### Scenario: 存在直接代码引用

- **WHEN** `rg` 或构建失败显示仍有生产代码、mock、测试、配置或脚本引用旧目录内文件
- **THEN** 对应评审项 MUST 保持 `blocked` 或 `keep-source`，不得升级为 `delete-candidate`

#### Scenario: endpoint 仅有 exact handler 覆盖

- **WHEN** 旧 endpoint 在 `apps/api` 中存在 exact handler，但缺少调用端切流、浏览器或 HTTP 证据、fallback/shadow-off 证据、DB/write 证据或测试证据
- **THEN** 对应评审项 MUST 保持 `keep-source`，不得仅凭 route count 或 HTTP 200 升级为 `delete-candidate`

### Requirement: app fallback-only 路径必须阻断目录删除

`apps/app/server` 的退役评审 MUST 单独检查所有 `/app/**` 与 `/callComponent/**` fallback-only 路径。任何未迁移、未保留、未阻断或未被 `apps/api` 明确承接的 fallback-only 路径 MUST 阻断 `apps/app/server` 目录级删除。

#### Scenario: 发现 fallback-only 路径

- **WHEN** 扫描发现某个旧 app endpoint 只能通过旧 app server fallback 承接
- **THEN** 该 endpoint MUST 标记为 `keep-source` 或 `blocked`，且 `apps/app/server` MUST 不得整体删除

### Requirement: admin DB、seed、R2 与兼容入口必须迁移或保留

`apps/admin/server` 的退役评审 MUST 单独处理 DB seed、兼容 drizzle 入口、R2/upload utilities、service repositories 和 Nitro config 依赖。任何仍被 package script、drizzle config、测试或 runtime 依赖的旧 admin server 文件 MUST 阻断对应文件组删除。

#### Scenario: 发现 admin legacy script 依赖

- **WHEN** `apps/admin/package.json` 仍有脚本指向 `server/db/**`、`server/services/**` 或 `server/utils/**`
- **THEN** 对应评审项 MUST 保持 `blocked`，直到脚本迁移、删除或替换方案通过验证

#### Scenario: 发现 R2 或 upload 兼容依赖

- **WHEN** R2 client、R2 env、upload session 或 contract upload 逻辑仍从 `apps/admin/server` 提供
- **THEN** 对应评审项 MUST 保持 `keep-source` 或 `blocked`，直到 `apps/api` 替代实现与 upload 测试证据齐全

### Requirement: dry-run rename/delete 必须在隔离环境执行

目录级删除前 MUST 在独立分支或 worktree 中执行 dry-run rename/delete 验证，不得在当前开发工作区直接删除旧目录。dry-run MUST 记录失败清单、受影响命令、修复策略和回滚步骤。

#### Scenario: 执行 dry-run rename

- **WHEN** 评审准备验证旧目录是否可删除
- **THEN** 代理 MUST 在隔离分支或 worktree 中临时 rename 目标目录，并运行约定的扫描、类型检查、测试和 build 命令

#### Scenario: dry-run 失败

- **WHEN** dry-run rename/delete 导致引用扫描、typecheck、test 或 build 失败
- **THEN** 评审 MUST 把失败项写回 tasks 或证据矩阵，并保持目录级删除阻断

### Requirement: 验证命令必须覆盖 admin、app 与 api

退役评审 MUST 在每次删除候选升级前运行并记录 admin、app、api 三侧相关验证。验证至少 MUST 覆盖全仓引用扫描、OpenSpec strict 校验、相关 typecheck、相关 Vitest、app Nitro build 或其替代决策、以及 fallback/shadow-off drill。

#### Scenario: 升级为 delete-candidate

- **WHEN** 某个文件组或 endpoint 组准备升级为 `delete-candidate`
- **THEN** 评审 MUST 记录通过的验证命令、失败命令为空或已解释、回滚步骤和责任边界

### Requirement: 删除执行必须另行确认

本 change 只定义退役评审与门禁。即使后续评审项全部升级为 `delete-candidate`，实际删除 `apps/admin/server` 或 `apps/app/server` MUST 仍由用户在独立删除执行步骤中明确确认。

#### Scenario: 所有门禁均通过

- **WHEN** 证据矩阵显示目标目录全部文件组均为 `delete-candidate`
- **THEN** 代理 MUST 向用户报告可进入删除执行阶段，不得自动删除目录
