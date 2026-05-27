## Why

Phase7 迁移进度目前分散在三份庞大的 Superpowers Markdown 文件中，状态矩阵、执行计划、架构决策、历史接力记录和退役门禁混在一起维护。这个模式不适合长任务续跑：后续代理需要同时维护多个任务源，从滚动快照中推断当前状态，并且容易丢失 Memorix 上下文或误判 Phase7 已可退役旧服务。

Phase7 不是孤立的 endpoint 统计任务。它服务于更上层的核心迁移：把 `apps/admin/server` 的旧 admin Nitro API 责任、`apps/app/server` 和旧项目 `D:\code\ruan-cat\01s-11comm-app` 的 app legacy/mock Nitro API 责任，逐步合并到独立部署的 `apps/api` Nitro 项目，并在证据闭环后清退旧服务责任。

本变更把统一 Nitro API 合并主线、Phase7 进度和执行控制迁移到一套兼容 `do-long-task` 的 OpenSpec change 中。新的 OpenSpec 工件将成为 canonical 接力入口；在删除或退役旧 Superpowers 文件前，必须保全统一 `apps/api` 目标架构、admin/app 两条旧 Nitro 源流、Phase7 证据模型、no-go 约束、当前接力状态和未来继续推进的任务细则。

当前 change 的完成状态不能以“旧文档已迁移/已删除”判定。载体迁移只是第一阶段；只要 admin legacy stream、app legacy stream、`apps/api` runtime readiness、DB/write evidence 或 retirement gate 仍有未完成项，本 change 就必须保持 in-progress。

## What Changes

- 引入 OpenSpec 支撑的 Phase7 长任务体系，以 `tasks.md` 作为唯一可执行任务源。
- 将 `tasks.md` 从一次性文档迁移 checklist 改为长期 Nitro 合并 backlog，继续承接 P0-P8 批次和当前下一步任务。
- 恢复并固化统一 Nitro API 合并主线：admin 旧 Nitro API 与 app legacy/mock Nitro API 共同迁向独立 `apps/api`。
- 将 Phase7 定义为统一 Nitro API 迁移的退役准备阶段，而不是独立的阶段 7 endpoint 文档。
- 明确区分四条状态流：admin legacy Nitro stream、app legacy Nitro stream、unified `apps/api` runtime stream、retirement gate stream。
- 保留 Phase7 证据语义，包括 endpoint 覆盖、页面证据、fallback 证据、DB readiness 证据、写入/读回/回滚证据和退役决策。
- 将 admin 切流、admin 特殊端点、app legacy 切流、Neon main 验收、旧服务退役门禁重写为 delta specs。
- 追加 B 方案数据库运维边界：`apps/type` 继续作为 Drizzle Table、Zod Schema 与 TypeScript Type 的唯一事实源；`apps/api` 接管 Drizzle Kit 配置、迁移目录、`db:*` 脚本、Neon readiness 与 drift 诊断；`apps/admin` 的旧 DB 入口只能作为兼容或退役来源。
- 保留未来执行细则：`property-manage/contract-manage` 12 个普通 list endpoint、admin CRUD/页面证据、app `/callComponent/**`、floor、repair、fee/report、guarded writes、剩余 app modules、Neon main `DB_READY`、retirement gate。
- 在 change 目录内新增 `agent-progress.md` 和 `agent-findings.md`，用于可恢复进度和发现记录，但不创建第二套任务清单。
- 完成一次性来源覆盖审计，把旧三文档当前章节、git 历史、Memorix 编号和关键证据 artifact 映射到 OpenSpec 落点；长期价值内容已迁入 canonical 文件，不再保留独立来源覆盖矩阵作为后续执行入口。
- 用稳定的 OpenSpec canonical 入口和更新后的引用，替代对三份超大 Superpowers 文件的直接依赖。
- 只有在必要信息已迁移、引用已更新、校验已通过后，才删除旧 Superpowers 文件。
- **BREAKING**: 后续 Phase7 接力不得再把旧 Superpowers 矩阵、计划或设计文档作为执行源；接力必须从本 OpenSpec change 及其 `tasks.md` 开始。

## Capabilities

### New Capabilities

- `unified-nitro-api-consolidation`: 定义 admin/app 两套旧 Nitro API 责任合并到独立 `apps/api` 的总体目标、阶段关系、状态流和退役证据。
- `phase7-evidence-model`: 定义 Phase7 状态词汇、证据字段、允许的状态升级和禁止误判规则。
- `admin-api-cutover`: 定义 admin canonical endpoint 与 admin 前端 resolver 切流工作的跟踪、验证和接力方式。
- `admin-special-cases`: 定义 admin upload、write、detail 等不能当作普通 list 切流处理的特殊端点。
- `app-legacy-cutover`: 定义 app legacy `/app/**` 与 `/callComponent/**` endpoint 的 triage、切流、guard 和验证方式。
- `db-readiness-and-write-verification`: 定义 Neon main DB readiness、受控写入窗口、读回、回滚、残留检查和 guard 恢复。
- `vitest-and-runtime-verification`: 定义 Phase7 运行时代码变更时 Vitest 的触发时机、文件位置、写法、app legacy 覆盖矩阵、DB 测试边界和验证记录方式。
- `browser-and-environment-verification`: 定义 Chrome DevTools MCP 三端双环境验收矩阵，覆盖本地 `apps/api`/`apps/admin`/`apps/app` 三个 dev 服务和三个 package `homepage` 指向的生产入口。
- `agent-team-batch-execution`: 定义旧计划中的 Agent Team 分工、batch 0-8 调度语义、每批固定流程、业务路径颗粒度拆分、独立复核和单一任务源纪律。
- `source-history-and-memory-governance`: 定义旧三文档来源覆盖、git 历史溯源、Memorix 接力索引、当前/历史事实分离、文档/skills/AI 记忆治理和证据 artifact 索引。
- `legacy-superpowers-content-transcription`: 定义旧总设计、旧 endpoint 矩阵和旧 batch 计划的核心内容如何转写为 OpenSpec requirement、design 决策、tasks backlog、progress checkpoint 和 findings 记忆。
- `retirement-gate-and-archive`: 定义旧服务退役门禁、受保护路径、旧文档退役、引用替换和删除前提。

### Modified Capabilities

无。现有 OpenSpec capabilities 是 auth/RLS 相关规范，与本次文档和任务体系迁移不重叠。

## Impact

- 受影响文档：
  - `docs/superpowers/phase7-openspec-migration-index.md`
  - `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/proposal.md`
  - `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/design.md`
  - `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/tasks.md`
  - `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/specs/**/spec.md`
  - `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/agent-progress.md`
  - `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/agent-findings.md`
  - prompts、reports、历史 plans 和相关 docs 中的直接引用。
- 受影响工作流：
  - Phase7 与统一 Nitro 合并接力由本 OpenSpec change 承接，其中 `tasks.md` 是唯一 canonical 任务源。
  - `openspec list` 应显示本 change 仍有未完成任务，直到统一 Nitro 合并和旧服务退役门禁完成。
  - 后续接力必须能看出 `apps/admin/server`、`apps/app/server` 和独立 `apps/api` 的迁移关系，且不得用 admin 覆盖进度代替 app legacy 进度。
  - `agent-progress.md` 记录 checkpoint 和验证结果。
  - `agent-findings.md` 记录风险、过期事实、冲突和失败假设。
  - 会话开始必须搜索 Memorix；修改状态后必须更新 Memorix。
  - 后续 schema 或迁移执行必须从 `apps/api` 的 Drizzle 运维入口推进，并先走保守只读 drift/readiness 诊断；不得把 `apps/admin` 的旧 `db:*` 入口继续写成长期权威。
- 本 OpenSpec 迁移不应改变生产代码、运行时 API 行为、数据库 schema、前端行为、部署目标或 package dependency。
