## ADDED Requirements

### Requirement: 统一 Nitro 退役门禁

旧服务退役必须以统一 Nitro 合并的整体证据为准。退役评审必须同时检查 admin legacy stream、app legacy stream、unified `apps/api` runtime stream、DB/write evidence、fallback/shadow-off 和受保护路径状态。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 请求判断旧服务是否可退役

- **WHEN** 后续代理被要求判断旧 Nitro 服务是否可以退役
- **THEN** 必须同时检查 `unified-nitro-api-consolidation`、`admin-api-cutover`、`app-legacy-cutover`、`db-readiness-and-write-verification`、`phase7-evidence-model` 的证据，再决定是否改变 retirementDecision

### Requirement: 旧服务受保护路径

`apps/admin/server`、`apps/app/server` 和 `D:\code\ruan-cat\01s-11comm-app` 在 no-go-for-retirement 解除前必须受保护。不得删除、移动、归档、重命名、清空或把它们当作已退役目录处理。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: OpenSpec 文档迁移完成

- **WHEN** Superpowers 文档内容迁移到 OpenSpec
- **THEN** 受保护 runtime/source 路径仍保持不动，退役仍然阻塞，直到 runtime 证据门禁显式满足

#### Scenario: 旧 Markdown 文件删除

- **WHEN** 三份旧 Superpowers Markdown 文件被删除
- **THEN** 这只表示文档载体归档，不得作为 `apps/admin/server` 或 `apps/app/server` 可删除的证据

### Requirement: Admin 目录级退役前提

`apps/admin/server` 目录级退役前，目录内所有旧 endpoint 必须逐项归类为 delete-candidate、not-candidate-but-unused、keep-source 或 blocked，并有对应证据。admin old path 155/155、resolver 完成、route count 或 HTTP 200 都不能单独触发目录级退役。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 评估 `apps/admin/server`

- **WHEN** 准备评估 `apps/admin/server` 目录
- **THEN** 必须提供 endpoint 清单、反向依赖扫描、调用端切流证据、DB/write/fallback/browser evidence、保留清单和回滚方案

### Requirement: App 目录级退役前提

`apps/app/server` 目录级退役前，app legacy endpoint、client-only gap、server-only endpoint、dynamic path、guarded write、fallback endpoint 必须全部归类。app H5 页面证据、manifest/allowlist、guard 和 legacy dispatch 证据必须逐项对应。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 评估 `apps/app/server`

- **WHEN** 准备评估 `apps/app/server` 目录
- **THEN** 必须证明 `/app/**`、`/callComponent/**`、remaining app modules、client-only gap 和 server-only endpoint 均已迁移、保留或阻断，且没有未归类 fallback

### Requirement: 旧 app 源目录永久保留

`D:\code\ruan-cat\01s-11comm-app` 是旧源目录和历史证据来源，永久保留。任何阶段都只能只读引用、采集迁移证据或记录存在，不得把它纳入删除、移动、归档、重命名或清空对象。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 旧 app 项目已迁入 monorepo

- **WHEN** `apps/app` 已经存在于 monorepo
- **THEN** 仍不得删除或清空 `D:\code\ruan-cat\01s-11comm-app`，因为它是旧项目身份、历史上下文、Memorix 线索和回滚核对来源

### Requirement: 旧 Superpowers 文档最终清理

三份旧 Superpowers 文档只能在其必要信息、未来任务、证据模型、执行规则、no-go 约束、当前接力状态和引用入口都已迁入 OpenSpec 或稳定索引后删除。用户手动恢复文档后，删除不再是自动步骤，必须经过最终清理任务和用户确认。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 直接引用仍存在

- **WHEN** 仓库搜索仍发现指向旧 Superpowers 文件路径的执行入口引用
- **THEN** 不得删除旧文件，必须先改为 OpenSpec canonical 或稳定迁移索引

#### Scenario: 用户恢复旧文档

- **WHEN** 用户手动恢复三份旧文档作为核对材料
- **THEN** OpenSpec 必须把它们视为迁移来源，不得立即再次删除，直到 final cleanup 任务完成并获得确认

### Requirement: OpenSpec canonical 入口

未来 Phase7 和统一 Nitro 合并任务必须从本 OpenSpec change 接力。`tasks.md` 是唯一可执行任务清单；`agent-progress.md` 与 `agent-findings.md` 只记录进度和发现，不能维护第二任务树。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 后续继续任务

- **WHEN** 后续代理被要求继续 Phase7 或 Nitro 合并
- **THEN** 必须先读取 `tasks.md`、搜索 Memorix、读取 `agent-progress.md` 和 `agent-findings.md`，再按未完成 checkbox 推进

### Requirement: 删除验证

删除旧 Superpowers 文档或推进旧服务退役都必须有 fresh scan、OpenSpec validation、状态审查、git diff 检查和 Memorix 记录。旧服务 runtime 退役还必须是单独 OpenSpec change 或明确独立评审。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 删除旧文档

- **WHEN** 迁移最终删除三份旧 Superpowers 文档
- **THEN** 必须具备引用扫描、OpenSpec 校验、`openspec list` 状态、git status/diff 和 Memorix 记录

#### Scenario: 删除旧服务目录

- **WHEN** 有人准备删除、移动、归档、重命名或清空 `apps/admin/server` 或 `apps/app/server`
- **THEN** 必须阻止当前 change 直接执行，并要求单独退役评审、回滚方案和用户明确确认
