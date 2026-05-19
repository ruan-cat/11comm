## ADDED Requirements

### Requirement: 唯一独立 Nitro API 目标

本变更必须保留原始迁移目标：把 `apps/admin/server` 承担的旧 admin Nitro API 职责，以及 `apps/app/server` / `D:\code\ruan-cat\01s-11comm-app` 承担的 app legacy/mock Nitro API 职责，逐步合并到独立部署的 `apps/api` Nitro 项目。`apps/api` 是 admin 与 app 的唯一长期 API 服务目标。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 后续代理恢复 Phase7

- **WHEN** 后续代理从本 OpenSpec change 继续 Phase7
- **THEN** 必须把 Phase7 理解为统一 Nitro API 迁移的退役准备阶段，而不是孤立的 endpoint 数量统计或文档清理任务

#### Scenario: 描述目标架构

- **WHEN** 记录迁移目标架构
- **THEN** 必须写明 `apps/admin` 与 `apps/app` 共同消费 `apps/api`，`apps/type` 是 Schema、Zod、Drizzle、TypeScript 类型的共享事实来源

### Requirement: Admin 与 App 两条旧 Nitro 源流独立跟踪

本变更必须分别跟踪 admin legacy Nitro stream 与 app legacy/mock Nitro stream。`apps/admin/server/api/**` 是 admin 旧 Nitro 源流；`apps/app/server/modules/**/endpoints.ts` 与旧项目 `D:\code\ruan-cat\01s-11comm-app` 是 app 旧 Nitro 源流。任一源流的完成进度都不得推导另一源流完成。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: Admin old path 覆盖达到 155/155

- **WHEN** admin old path exact coverage 被记录为 155/155
- **THEN** app legacy stream 仍必须独立跟踪，只有 app endpoint、调用端、响应契约、guard、fallback、页面或 HTTP 证据齐全时才允许升级

#### Scenario: App endpoint 仍是 guarded 或 fallback

- **WHEN** app legacy endpoint 仍处于 guarded、fallback-only、in-memory-only 或 unknown-needs-triage
- **THEN** 统一 Nitro 迁移仍为 partial migration，即使 admin canonical route 已存在于 `apps/api`

### Requirement: `apps/api` 领域模块组织标准

迁入 `apps/api` 的业务域必须按领域模块组织，不能直接照搬 `apps/admin/server` 或 `apps/app/server`。每个迁移域应优先形成 `repository`、`service`、`runtime`、`admin-adapter`、`legacy-adapter`、`legacy-endpoints` 的清晰边界；route handler 只做参数读取、运行时组装、错误包装和响应输出。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 新增或补齐业务域

- **WHEN** 一个业务域被迁入 `apps/api/server/modules/{domain}`
- **THEN** 该域必须说明 repository 数据源、service 业务能力、admin adapter 输出、legacy adapter 输出、runtime 组装方式，以及是否仍依赖 fallback 或 in-memory 数据

#### Scenario: Route handler 承担过多逻辑

- **WHEN** route handler 内直接复制旧服务业务逻辑、硬编码 mock 数据或绕过领域 service
- **THEN** 该 endpoint 不能被视为符合统一 Nitro 目标，必须记录为实现形态不合格或待重构

### Requirement: Admin canonical 与 App legacy 双契约输出

`apps/api` 内同一领域服务必须能够通过不同 adapter 输出 admin canonical 契约和 app legacy 契约。admin 侧按 `rank-route-keys.ts` 三级业务路径组织，返回 `JsonVO`、`PageDTO` 或项目统一 DTO；app 侧保留 `/app/**`、`/callComponent/**` 的旧路径、旧字段、旧 envelope、GET/POST 兼容和旧错误语义，直到 app 前端完成调用迁移。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 同一业务存在 admin 与 app 消费

- **WHEN** 同一业务域同时服务 admin 与 app
- **THEN** repository/service 只能维护一套核心数据与业务能力，admin/app 通过 adapter 做契约转换，不得各自维护两套漂移的数据源

#### Scenario: App legacy 契约被新 canonical DTO 替换

- **WHEN** app legacy endpoint 直接返回 admin canonical DTO 或丢失旧字段、旧 envelope、旧兼容状态码
- **THEN** 该 endpoint 必须保持未完成，直到 legacy adapter 显式证明兼容旧 app 调用方

### Requirement: 旧服务在门禁通过前只是迁移来源与保护路径

`apps/admin/server` 与 `apps/app/server` 在退役门禁通过前只能作为迁移来源、兼容参考、fallback/rollback 证据和只读核对材料。它们不得被描述为长期目标 API，也不得因为三份旧 Superpowers Markdown 被删除而被视为 runtime 已退役。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 旧 Markdown 文件被删除

- **WHEN** 三份旧 Superpowers 文档经过确认后被删除
- **THEN** 这只表示文档载体归档，不表示 `apps/admin/server`、`apps/app/server` 或 `D:\code\ruan-cat\01s-11comm-app` 可以删除、移动、清空、归档或重命名

### Requirement: Phase1 到 Phase7 阶段链必须保留

OpenSpec 工件必须保留旧总设计中的阶段链：Phase1 快照迁入 app；Phase2 建立最小 `apps/api` shadow service 与 fee/payment/report 首批纵切；Phase3 加固独立运行、构建、部署与接入基础设施；后续阶段扩展 app/admin 模块；Phase7 验证旧 Nitro 职责能否进入退役评审。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: 解释 Phase7 范围

- **WHEN** 总结 Phase7 范围
- **THEN** 必须说明 Phase7 的目的在于证明旧 admin/app Nitro 职责是否已被 `apps/api` 承接，而不是证明某个 route 文件已存在

### Requirement: 统一 Nitro 完成证据

统一 Nitro 合并完成必须同时具备调用端切流、route/adapter 存在、响应契约、共享数据源、DB readiness、fallback 或 shadow-off、guarded write、浏览器或 HTTP 证据、retirement decision。route 文件、manifest 条目或 HTTP 200 不能单独作为完成证据。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: Route 存在但证据不足

- **WHEN** `apps/api` route 或 runtime manifest 条目已经存在，但缺少调用端、DB readiness、真实库样本、fallback、页面或写入闭环证据
- **THEN** endpoint 只能保持 partial、candidate-after-evidence、legacy-fallback、blocked 或 unknown 状态，不能用于证明旧 Nitro 服务可退役

#### Scenario: 开始旧服务退役评审

- **WHEN** 后续任务准备评估旧服务退役
- **THEN** 必须同时检查 admin legacy stream、app legacy stream、unified `apps/api` runtime stream 和 retirement gate stream
