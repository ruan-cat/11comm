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

### Requirement: Phase1 app 快照迁入范围

Phase1 app 快照迁入语义 MUST 保留：`apps/app` 来自旧 app 项目过滤快照，保留 `src/**`、`server/**`、`env/**`、app 专属非 OpenSpec `.claude/skills/**`、`package.json`、`vite.config.ts`、`nitro.config.ts`、`pages.config.ts`、`manifest.config.ts` 和必要脚本配置；默认排除 `.cursor/**`、`.gemini/**`、`.qoder/**`、`.trae/**`、`.kiro/**`、依赖、构建产物和多工具垃圾副本。Phase1 的“不拆 app 业务结构”不得解释为保留所有工具垃圾目录。

#### Scenario: 复核 apps/app 来源

- **WHEN** 后续代理需要判断 `apps/app` 里的历史文件是否应保留
- **THEN** 必须按快照迁入范围、文档价值分类和 app 专属技能价值判断，而不是简单按是否来自旧项目判断

### Requirement: Phase2 与 Phase3 边界

Phase2 MUST 被解释为最小可运行 `apps/api` shadow service 加 fee/payment/report 首批纵切样板；它不是只搭建无业务接口的空壳，也不是 repair/resource/parking 等多模块并行迁移。Phase3 MUST 聚焦部署 preset、runtimeConfig、环境变量、CORS、日志、监控、错误追踪、admin/app API base URL、回退策略、局部切流和 runtime helper 固化；Phase3 不得扩大为多业务域迁移。

#### Scenario: 解释 Phase2 完成内容

- **WHEN** 后续代理引用 Phase2
- **THEN** 必须同时说明独立 `apps/api` 服务边界与 fee/payment/report 首批纵切，不得把 Phase2 描述为空基础设施

#### Scenario: 规划 Phase3 或后续工作

- **WHEN** 后续代理处理部署、runtimeConfig、CORS、base URL、fallback 或日志监控
- **THEN** 必须归入 Phase3/runtime governance；repair/resource/parking 或更多业务域扩展应归入 Phase4+ 或当前 Phase7 backlog

#### Scenario: 旧总设计 Phase4+ 示例被误归入 Phase2 或 Phase3

- **WHEN** 后续代理引用 `repair/resource/parking`、`charge-machine/open-door`、`machine-record` 或同类 app legacy 扩展示例
- **THEN** 必须把它们解释为 Phase4+ app legacy 扩展或当前 backlog 线索，不能写成 Phase2/Phase3 范围、已完成事实、生产 `DB_READY`、shadow-off/fallback 完成或退役证据

### Requirement: Phase5 CRUD 完整度等级与 `houseCharge` 历史样板

旧总设计 Phase5 中的 `L0-L4` CRUD 完整度等级 MUST 作为历史分级语言保留，用于解释当时如何评估接口从只读、契约兼容、真实 DB 读、受控写入到完整 CRUD 闭环的逐级成熟度。`houseCharge` 首波样板 MUST 被记录为历史样板和分级示例，而不是当前 runtime 完成事实；后续状态升级必须重新依据当前 OpenSpec 证据字段、fresh scan、DB readiness、写入闭环和退役门禁判断。

#### Scenario: 引用 Phase5 L0-L4

- **WHEN** 后续代理引用旧总设计的 Phase5 `L0-L4`
- **THEN** 必须把它解释为历史 CRUD 完整度分级：L0 为旧源/路径识别，L1 为契约或 mock/fallback 兼容，L2 为真实只读 repository 接入，L3 为受控 create/update/delete 写入能力，L4 为含 read-back、rollback/cleanup、guard-after 和调用端证据的完整闭环；任一级都不能缺省推导为当前已完成

#### Scenario: 引用 `houseCharge` 首波样板

- **WHEN** 后续代理看到 `houseCharge`、房屋收费或费用首波样板记录
- **THEN** 只能作为 Phase5 早期样板和分级来源说明，不能据此把 `property-manage/expense-manage/house-charge/list`、admin 收费 CRUD 或 app 缴费 legacy 标记为 DB-ready、production-ready 或 delete-candidate

### Requirement: Phase6 受控切流与回退顺序

旧总设计 Phase6 MUST 保留为受控 shadow/proxy 切流和回退演练阶段，而不是旧服务退役阶段。Phase6 的配置语义必须覆盖 `VITE_11COMM_API_SHADOW_ENABLE`、`VITE_11COMM_API_USE_PROXY`、模块 allowlist 或等价配置；切流必须先 allowlist 小范围开启 shadow，再验证调用端、契约、DB/fallback 证据，随后按 fallback/shadow-off 顺序复验。任何 Phase6 记录都不得写成 `apps/admin/server` 或 `apps/app/server` 已可删除。

#### Scenario: 开启 shadow 或 proxy 切流

- **WHEN** 后续代理启用 `VITE_11COMM_API_SHADOW_ENABLE`、`VITE_11COMM_API_USE_PROXY`、模块 allowlist 或等价配置
- **THEN** 必须记录作用端、模块范围、legacy path、目标 `apps/api` path、是否仍允许 fallback、验证命令和回退入口；未进入 allowlist 的模块必须继续保持旧路径保护

#### Scenario: 执行 fallback/shadow-off 复验

- **WHEN** Phase6 需要验证回退或关闭 shadow
- **THEN** 必须先证明开启 shadow/proxy 时请求命中 `apps/api`，再按模块关闭 shadow 或移出 allowlist，验证 fallback 仍可回退到受保护旧服务，最后执行 shadow-off 状态下的页面或 HTTP 复验；该顺序只产生 fallback/shadow-off evidence，不产生旧服务退役结论

### Requirement: Nitro runtime governance

统一 `apps/api` runtime MUST 使用 Nitro v3/H3 规范：H3 API 从 `nitro/h3` 导入，禁止直接从 `h3` 导入；禁止新增 JWT、Token、Neon Auth 或任何鉴权中间件；配置通过 runtimeConfig/env 管理；不得在模块顶层创建 Neon/Drizzle 连接；CORS、日志、监控、错误追踪、admin/app API base URL 和 fallback 策略必须作为 runtime governance 证据记录。

#### Scenario: 新增 apps/api handler

- **WHEN** 后续代理新增或修改 `apps/api` route handler
- **THEN** handler 必须只做参数读取、运行时组装、错误包装和响应输出，业务逻辑进入 service/repository/adapter，且不得新增鉴权

#### Scenario: 修改运行时配置

- **WHEN** 后续代理修改 runtimeConfig、env、CORS、日志、监控、错误追踪或 base URL 策略
- **THEN** 必须记录 local-dev 与 production 的配置来源、验证命令和回退影响

### Requirement: 统一 Nitro 完成证据

统一 Nitro 合并完成必须同时具备调用端切流、route/adapter 存在、响应契约、共享数据源、DB readiness、fallback 或 shadow-off、guarded write、浏览器或 HTTP 证据、retirement decision。route 文件、manifest 条目或 HTTP 200 不能单独作为完成证据。 本 requirement MUST 作为后续执行、证据升级和退役评审的强制约束。

#### Scenario: Route 存在但证据不足

- **WHEN** `apps/api` route 或 runtime manifest 条目已经存在，但缺少调用端、DB readiness、真实库样本、fallback、页面或写入闭环证据
- **THEN** endpoint 只能保持 partial、candidate-after-evidence、legacy-fallback、blocked 或 unknown 状态，不能用于证明旧 Nitro 服务可退役

#### Scenario: 开始旧服务退役评审

- **WHEN** 后续任务准备评估旧服务退役
- **THEN** 必须同时检查 admin legacy stream、app legacy stream、unified `apps/api` runtime stream 和 retirement gate stream
