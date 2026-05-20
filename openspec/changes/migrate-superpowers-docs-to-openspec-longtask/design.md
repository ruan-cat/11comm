## Context

Phase7 的现行任务载体原本由三份 Superpowers 文档组成，旧来源的审计过程已迁入 `design.md`、`tasks.md`、`agent-findings.md` 和相关 specs，稳定入口见 `docs/superpowers/phase7-openspec-migration-index.md`。

这三份文件同时承担了事实源、执行队列、证据矩阵、历史快照、no-go 约束和接力记录。它们已经过大且职责混杂，不适合继续作为 `do-long-task` 的长任务载体。

当前项目 OpenSpec 默认 schema 为 `spec-driven`，工件链为：

```text
proposal -> specs -> design -> tasks -> implement
```

本 change 的目标是把统一 Nitro API 合并主线和 Phase7 接力入口迁到 OpenSpec，并明确 `tasks.md` 是唯一可执行任务源。`tasks.md` 必须承接未来继续推进的 Nitro 合并任务细则，而不是只记录旧文档迁移是否完成。`agent-progress.md` 和 `agent-findings.md` 只记录进度、验证结果、发现和失败路径，不记录新的任务树。

长期 canonical 文件只包括本 change 下的 `proposal.md`、`design.md`、`tasks.md`、`specs/**/spec.md`、`agent-findings.md` 和 `agent-progress.md`。临时来源覆盖审计只服务于本次迁移核对，不作为后续执行入口、任务源或需要持续维护的第四份矩阵。

## Core Mission

旧总设计的核心目标不是“维护阶段 7 文档”，而是完成以下架构迁移：

```text
apps/admin/server 旧 admin Nitro API 责任
apps/app/server 与 D:\code\ruan-cat\01s-11comm-app 旧 app legacy/mock Nitro API 责任
        ↓
apps/api 独立 Nitro API 服务
        ↓
apps/admin 与 apps/app 共同消费统一 API
        ↓
证据闭环后清退旧 admin/app Nitro 服务责任
```

因此 Phase7 是统一 Nitro API 迁移的退役准备阶段。它要证明旧 admin/app Nitro 职责已经被 `apps/api` 正确承接，而不是只证明 `apps/api/server/routes/api/**/*.ts` 中存在某些 route 文件。

## Goals / Non-Goals

**Goals:**

- 建立 Phase7 OpenSpec canonical 入口。
- 恢复并固化旧总设计的统一 Nitro API 主线：`apps/api` 是 admin 与 app 的唯一长期 API 服务。
- 单独跟踪 admin 旧 Nitro 源流、app legacy/mock 旧 Nitro 源流、`apps/api` 独立运行时源流和退役门禁源流。
- 把旧三文档中仍有效的当前状态、证据模型、执行纪律、no-go 约束和接力点迁入 OpenSpec 工件。
- 用 `tasks.md` 取代旧 Superpowers checklist，满足 `do-long-task` 的唯一任务源要求，并承接 P0-P8 后续执行 backlog。
- 为旧三文档删除准备可验证路径：迁移、引用更新、校验、删除、记录 Memorix。
- 保留 Phase7 当前 no-go-for-retirement 判断，避免文档迁移被误读成旧服务退役。

**Non-Goals:**

- 不实现新的 API route、repository、service、adapter 或 frontend resolver。
- 不修改数据库 schema、Drizzle migration、Neon 配置或 R2 配置。
- 不改变 admin/app 运行时行为、部署地址、环境变量或 package dependency。
- 不在本 change 中退役 `apps/admin/server`、`apps/app/server` 或 `D:\code\ruan-cat\01s-11comm-app`。
- 不把 `apps/admin/server` 或 `apps/app/server` 描述为长期目标 API；它们只是迁移来源、兼容参考、fallback/rollback 证据或受保护旧路径。
- 不把历史报告全部重写为新的 narrative；只迁移 Phase7 续跑必需事实和引用入口。

## Decisions

### Decision 1: Use One OpenSpec Change As Canonical

本次迁移使用 `openspec/changes/migrate-superpowers-docs-to-openspec-longtask/` 作为唯一 canonical。没有 active OpenSpec change 与当前目标重叠，因此新建 change 比复用归档 change 更清晰。

替代方案是保留 Superpowers 文档并只新增索引，但这会继续维持多任务源。另一个替代方案是自定义 OpenSpec schema，但成本高于收益。

### Decision 2: Split Specs By Capability, Not By Old File

旧三文档不会一对一迁移为三个 spec。新 specs 按 Phase7 续跑能力拆分：

- `phase7-evidence-model`
- `admin-api-cutover`
- `admin-special-cases`
- `app-legacy-cutover`
- `db-readiness-and-write-verification`
- `vitest-and-runtime-verification`
- `browser-and-environment-verification`
- `agent-team-batch-execution`
- `source-history-and-memory-governance`
- `retirement-gate-and-archive`

这样可以把重复的历史快照压缩为规则和当前状态，并让后续执行按能力补证，而不是继续维护三个混杂文件。

### Decision 2A: Model Unified Nitro Consolidation Above Phase7

补充 `unified-nitro-api-consolidation` 作为上层 capability。它承接旧总设计中的“唯一 Nitro API 服务放在 `apps/api`”“admin 和 app 都通过配置指向 `apps/api`”“`apps/admin/server` 与 `apps/app/server` 只作为迁移来源或临时兼容层”的目标架构。

Phase7 的状态矩阵和 batch 计划必须挂在这个 capability 下面解释：admin old path coverage、app legacy allowlist、DB_READY、fallback、write/read/rollback 和 retirementDecision 都是判断旧 Nitro 职责能否清退的证据字段，而不是互相独立的文档栏目。

### Decision 3: Keep Tasks Executable And File-Level

`tasks.md` 只包含可执行任务，使用文件级粒度和 checkbox。任务分成两类：已完成的任务载体迁移记录，以及尚未完成的 Nitro 合并执行 backlog。后续判断本 change 是否完成时，必须以 Nitro 合并 backlog 是否全部完成为准，而不是以旧 Superpowers 文档是否删除为准。

`agent-progress.md` 记录 checkpoint、验证命令和结果。`agent-findings.md` 记录风险、冲突、过时事实和失败尝试。两者都不得成为第二任务源。

### Decision 3B: Delete Temporary Source Audit Input

临时来源覆盖审计的职责到迁移审计为止：确认旧三文档当前章节、git history、Memorix 编号和 `.tmp` evidence artifact 是否已有 OpenSpec 落点。审计结论已迁入 canonical 文件；它不参与后续 `do-long-task` 调度，也不再承接新的批次、状态或证据矩阵。

旧三文档的长期角色被压缩到以下 canonical 信息架构：

- `proposal.md` 说明为什么从 Superpowers 文档迁到 OpenSpec，以及本 change 对工作流的影响。
- `design.md` 保留架构主线、来源角色、迁移决策、历史/当前事实边界和旧批次到 OpenSpec 结构的解释。
- `specs/**/spec.md` 按能力保存可验证要求，不按旧文件拆分。
- `tasks.md` 是唯一任务源，承接所有未完成执行 backlog 和 final cleanup。
- `agent-progress.md` 记录执行 checkpoint、验证命令和结果。
- `agent-findings.md` 记录冲突口径、过时事实、gotcha、失败路径和历史检索线索。

这意味着 source coverage 中适合长期保留的内容只进入设计决策、spec 要求、任务行、进度记录或发现记录；大表、历史流水和重复索引不再原样复制，避免形成旧三文档之外的第四份长期维护矩阵。

### Decision 3A: Keep The Change In Progress Until Runtime Migration Gates Pass

OpenSpec `tasks.md` 必须保留未完成项，覆盖以下仍需推进的工作：

- admin legacy stream：`property-manage/contract-manage` 12 个普通 list endpoint、CRUD 页面交互证据、contract upload R2 评审、边缘接口决策。
- app legacy stream：`/callComponent/**`、floor、repair、fee/report、guarded writes、剩余 app modules、client-only gap、server-only endpoint。
- unified `apps/api` runtime stream：独立启动、health/ready、Neon main `DB_READY`、真实库样本复核。
- retirement gate stream：旧服务新增入口冻结、endpoint retirement candidate 清单、旧服务目录独立删除评审。

因此 `openspec list` 不应在这些任务未完成时显示本 change 为 complete。

### Decision 4: Delete Old Files Only After Reference Replacement

用户目标是全面删除三份旧文件，但直接删除会断开历史 prompt、报告和阶段计划中的链接。因此执行顺序必须是：

1. 迁移必需信息到 OpenSpec。
2. 建立稳定迁移索引或 canonical 说明。
3. 更新直接引用点。
4. 运行引用扫描和 OpenSpec 校验。
5. 删除旧三文档。

如果某个历史文档不适合逐行改写，则应指向稳定索引，避免保留对已删除路径的直接依赖。

### Decision 5: Preserve No-Go State

本 change 只迁移任务执行和记录载体。Phase7 当前仍保持 no-go-for-retirement。以下路径仍受保护：

- `apps/admin/server`
- `apps/app/server`
- `D:\code\ruan-cat\01s-11comm-app`

任何旧服务删除、移动、归档、重命名或清空都不属于本 change。

## Migration Mapping

| 旧内容来源                                                                | 迁移目标                                                                                 | 说明                                                                                                                                      |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 旧总设计的目标架构、Phase1-Phase7 阶段链、唯一 `apps/api` 决策            | `specs/unified-nitro-api-consolidation/spec.md`、`design.md`                             | 保留“admin/app 两套旧 Nitro 责任合并到独立 apps/api，再清退旧服务责任”的主线                                                              |
| 矩阵字段定义与禁止误判规则                                                | `specs/phase7-evidence-model/spec.md`                                                    | 保留状态字段、证据字段和升级门槛                                                                                                          |
| Admin 旧路径覆盖、resolver 状态、页面/HTTP gate 证据                      | `specs/admin-api-cutover/spec.md`、`tasks.md`、`agent-progress.md`                       | 只迁移续跑所需当前状态，不继续维护大表流水                                                                                                |
| `contract-manage` upload/R2、写入、detail 分流                            | `specs/admin-special-cases/spec.md`、`tasks.md`                                          | 防止被普通 list 批次吞掉                                                                                                                  |
| App legacy `/app/**`、`/callComponent/**`、client/server gap              | `specs/app-legacy-cutover/spec.md`、`tasks.md`                                           | 保留 triage 和 guard 要求                                                                                                                 |
| Neon main `DB_READY` 与写入闭环流程                                       | `specs/db-readiness-and-write-verification/spec.md`、`design.md`                         | 保留不使用 Neon 测试分支的项目决策                                                                                                        |
| Vitest、typecheck、HTTP gate、运行时证据边界                              | `specs/vitest-and-runtime-verification/spec.md`、`tasks.md`、`agent-progress.md`         | 明确何时写 Vitest、怎么写、写到哪个包，以及测试不能替代 DB_READY 或退役证据                                                               |
| Chrome MCP、本地三 dev、三个生产入口验收                                  | `specs/browser-and-environment-verification/spec.md`、`tasks.md`、`agent-progress.md`    | 明确 admin H5、app H5、API server 在 local-dev 和 production 的浏览器/Network 证据矩阵                                                    |
| Agent Team 分工、batch 0-8、每批固定流程、完成定义与复核清单              | `specs/agent-team-batch-execution/spec.md`、`tasks.md`、`agent-progress.md`、`design.md` | 承接旧计划的执行组织方式；Batch 0-8 在长期结构中不再作为独立计划表维护，而是映射为 app/admin/runtime/DB/retirement backlog 与批次执行纪律 |
| Phase1.1 文档治理、skills/AI 记忆、Memorix 项目身份、敏感信息和字符集规则 | `specs/source-history-and-memory-governance/spec.md`、`design.md`、`agent-findings.md`   | 承接旧总设计的任务记录和记忆保全规则，防止格式迁移后记忆丢失                                                                              |
| 三份旧文档当前章节、git history、Memorix 编号、`.tmp` 证据 artifact       | `design.md`、`agent-findings.md`、`agent-progress.md`                                    | 保留来源角色、历史检索线索和必要 evidence 索引；历史 evidence 不自动升级为当前完成事实                                                    |
| 旧服务 no-go、受保护路径、旧文档删除前提                                  | `specs/retirement-gate-and-archive/spec.md`、`tasks.md`                                  | 文档迁移不等于旧服务退役                                                                                                                  |
| 批次 0-8 和子代理执行纪律                                                 | `tasks.md`、`agent-progress.md`                                                          | 转成文件级任务和进度 checkpoint                                                                                                           |
| 历史快照和 Memorix 编号                                                   | `agent-findings.md`、必要时迁移索引                                                      | 只保留检索线索和当前续跑相关事实                                                                                                          |

## Source Provenance Architecture

旧三文档在迁移后只保留角色语义，不保留原始维护形态：

- endpoint 矩阵是状态账本来源：它提供证据字段、状态字段、当前口径和禁止误判规则。长期落点是 `phase7-evidence-model`、admin/app cutover specs、浏览器/环境验证 spec、`agent-progress.md` 与 `agent-findings.md`。
- batch 计划是执行组织来源：它提供 Agent Team 分工、Batch 0-8、每批固定流程、完成定义、复核清单和 Neon main 接力口径。长期落点是 `agent-team-batch-execution`、`tasks.md`、DB/Vitest/浏览器验证 specs 与 progress checkpoint。
- 总设计是架构与治理来源：它提供唯一 `apps/api` 目标、Phase1-Phase7 阶段链、文档治理、skills/AI 记忆、Memorix、Vitest、Neon main 写入闭环和旧服务退役门禁。长期落点是 `unified-nitro-api-consolidation`、`source-history-and-memory-governance`、DB/retirement specs 与本设计文档。

Phase1-Phase7 在 OpenSpec 中解释为统一 Nitro API 合并的阶段链：Phase1/1.1 归入来源治理和记忆治理，Phase2-Phase6 归入统一 `apps/api` runtime、app legacy、admin cutover 与验证 specs，Phase7 归入 evidence model、batch execution、DB readiness、browser verification 和 retirement gate。Batch 0-8 则只作为旧计划到当前 backlog 的等价解释：Batch 1-5 主要映射到 app legacy 与 DB/write guard，Batch 6-7 映射到 admin cutover 和 special cases，Batch 8 映射到剩余 app legacy triage，Batch 0 映射到 evidence model 与 fresh scan 门禁。

这个结构替代来源覆盖审计的长期维护价值：后续代理从 `tasks.md` 取任务，从 specs 取验收要求，从 `design.md` 取架构和来源解释，从 `agent-progress.md`/`agent-findings.md` 取执行事实与风险。临时审计文件完成后不得被当作执行前置入口，也不得恢复成长期维护矩阵。

## Legacy Content Transcription Ledger

本轮迁移的核心不是“删除三个 Markdown 文件”，而是把三个旧载体里的长文本语义改写为 OpenSpec 可执行结构。旧文件被删除后，后续代理仍必须能从 OpenSpec 中恢复相同的阶段关系、证据规则、当前进度和接力约束。

| 旧载体                                                            | 必须转写的核心内容                                                                                                                                                                              | OpenSpec 落点                                                                                                                                                                                  | 转写口径                                                                                             |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 旧总设计 `2026-04-25-11comm-app-monorepo-api-migration-design.md` | 背景、已确认决策、唯一 `apps/api` 目标、`apps/app` 快照迁入、`apps/type` 事实源、Nitro 无鉴权、Phase1-7 阶段链、Phase1.1 文档/skills/AI 记忆治理、动态 mock、Vitest、Neon main、Phase7 退役门禁 | `unified-nitro-api-consolidation`、`source-history-and-memory-governance`、`db-readiness-and-write-verification`、`vitest-and-runtime-verification`、`retirement-gate-and-archive`、本设计文档 | 转写为架构与治理规则，不保留旧长文流水；保留所有会影响后续实现和误判防护的约束                       |
| 旧矩阵 `phase7-endpoint-migration-matrix.md`                      | 基线口径、admin 已覆盖/剩余、app legacy 覆盖、P0/P1 fallback 与差集、app 剩余模块、扫描证据快照、复核硬门槛、当前接力摘要、历史事实压缩、风险                                                   | `phase7-evidence-model`、`admin-api-cutover`、`app-legacy-cutover`、`browser-and-environment-verification`、`tasks.md`、`agent-progress.md`、`agent-findings.md`                               | 转写为字段模型、状态枚举、证据层级、当前 baseline 和 endpoint/module backlog，不再维护一份并行大矩阵 |
| 旧计划 `2026-05-10-phase7-batch-migration-plan.md`                | 强约束、no-go、当前统计口径、Agent Team 角色、批次拆分规则、每批固定流程、Batch0-8、完成定义、复核清单、禁止误判、Neon main 接力口径                                                            | `agent-team-batch-execution`、`legacy-superpowers-content-transcription`、`tasks.md`、`agent-progress.md`、`agent-findings.md`                                                                 | 转写为批次执行纪律和长期 backlog；Batch0-8 的语义保留，旧 checkbox 不再作为任务源                    |

旧总设计的阶段链在 OpenSpec 中不再作为单一长文维护，而是拆成能力规范：Phase1/1.1 进入来源治理，Phase2-6 进入统一 Nitro API、admin/app cutover、browser 和 Vitest 规范，Phase7 进入证据模型、Agent Team、DB readiness 和 retirement gate。旧矩阵的状态表不再逐行复制，但它的状态字段、当前口径、下一切片和风险全部进入 `phase7-evidence-model`、`tasks.md` 与 `agent-findings.md`。旧计划的批次表不再作为第二任务源，但 Batch0-8 的顺序和完成定义进入 `agent-team-batch-execution` 与 `tasks.md`。

语义覆盖闸门如下：删除旧载体前，后续代理必须能仅靠 OpenSpec 回答四个问题：统一 Nitro 合并目标是什么；Phase7 当前哪些证据完成、哪些仍缺；下一批应该做哪些 endpoint 且不碰哪些范围；为什么旧服务目录仍不能退役。若任一问题只能从旧三文档回答，就说明转写不完整。

## Current Handoff Baseline

迁移时应保留以下当前口径，后续执行前必须重新扫描验证：

- 上层目标是把 `apps/admin/server` 与 `apps/app/server` 的旧 Nitro 职责合并到独立 `apps/api`，再逐步清退旧职责。
- `apps/api` 已作为独立 Nitro 服务存在；它仍需要按 endpoint 和调用方补齐生产、DB、fallback、写入与退役证据。
- app legacy 源流与 admin 源流相互独立；admin exact coverage 不能推导 app legacy 已完成。
- Phase7 是 partial migration，仍为 no-go-for-retirement。
- `apps/api/server/routes/api/**/*.ts` 最新文档口径为 160 个 server route。
- `apps/admin/server/api/**/*.ts` 最新文档口径为 155 个 legacy file。
- admin old path exact coverage 最新文档口径为 155/155。
- admin 前端 resolver 迁移已记录为完成。
- 生产 `DB_READY`、真实库样本复核、shadow-off/fallback、真实页面 CRUD/交互和旧服务退役证据仍未闭环。
- 下一推荐切片是 `property-manage/contract-manage` 12 个普通 list endpoint 的 runtime manifest/contract/HTTP gate；upload/R2、写入、删除和 detail 继续排除并单独评审。
- 旧矩阵存在冲突口径：前文与旧计划写 admin old path exact coverage 为 155/155，但末尾仍残留“未覆盖 exact legacy path 约 51 个”的旧说法。后续必须先 fresh scan，再更新 `agent-findings.md`，不得直接沿用任一旧数字。
- Chrome MCP 验收必须覆盖三端双环境：本地 `apps/api` dev、`apps/admin` dev、`apps/app` H5 dev，以及三个生产 homepage。生产地址必须在执行时重新读取 package `homepage`；截至 2026-05-19，admin 为 `https://01s-11comm.ruan-cat.com`，app 为 `https://01s-11-app.ruan-cat.com`，API server 为 `https://01s-11-server.ruan-cat.com`。

## Consolidation State Model

| 状态流                            | 旧来源                                                                       | 目标承接                                                              | 当前口径                                                                                                                                  | 不能误判为                    |
| --------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Admin legacy Nitro stream         | `apps/admin/server/api/**/*.ts`、`rank-route-keys.ts`                        | `apps/api/server/routes/api/**`、admin resolver、admin adapter        | old path exact coverage 文档口径 155/155，resolver 完成；仍缺生产 DB_READY、真实库样本、shadow-off/fallback、真实页面 CRUD/交互和退役证据 | 旧 `apps/admin/server` 可删除 |
| App legacy Nitro stream           | `apps/app/server/modules/**/endpoints.ts`、`D:\code\ruan-cat\01s-11comm-app` | `apps/api` legacy adapter、manifest、allowlist、guard、app H5 shadow  | app legacy `/app/**` 与 `/callComponent/**` 需要独立 triage；部分 endpoint 只有 manifest/allowlist/guard/fallback 口径                    | admin 完成即 app 完成         |
| Unified `apps/api` runtime stream | `apps/api` 独立 Nitro package、server modules、deployment env                | 独立启动、构建、部署、health/ready、DB env、shared repository/service | 已存在独立 Nitro 服务边界；`DB_READY` 与 main 分支真实数据证据仍未闭环                                                                    | route 文件数等于生产可退役    |
| Retirement gate stream            | 旧服务职责、fallback、写入 guard、旧文档引用                                 | `retirementDecision`、保护路径、OpenSpec canonical、Memorix           | 当前仍是 no-go-for-retirement；文档删除不等于 runtime 退役                                                                                | 删除旧 Markdown 即删除旧服务  |

## Risks / Trade-offs

- 旧文档引用断链 -> 先创建稳定 OpenSpec/index 入口，再更新直接引用，删除前后各运行 `rg`。
- 信息迁移遗漏 -> 使用旧文件章节到新工件的映射矩阵，并在 `agent-findings.md` 记录不迁移原因。
- 只记 Phase7 而丢失统一 Nitro 主线 -> 新增 `unified-nitro-api-consolidation` spec，并在设计中维护四条状态流。
- 双任务源复活 -> `tasks.md` 是唯一任务源，`agent-progress.md` 和 `agent-findings.md` 不写待办树。
- 子代理并行误改同一文件 -> 实施阶段按 disjoint write set 分派，主代理负责整合 `tasks.md`。
- 把文档迁移误读为旧服务退役 -> specs 明确 no-go-for-retirement 和受保护路径。
- 旧数字过期 -> 所有计数以“文档口径/快照”标记，实际执行前必须重新扫描。

## Migration Plan

1. 完成 OpenSpec artifacts：proposal、specs、design、tasks、agent-progress、agent-findings。
   1.1. 完成一次性来源审计，确认旧三文档、三文件 git history、Memorix 编号和证据 artifact 已落入 canonical 工件；审计完成后删除临时审计文件，不再把它作为长期维护文件。
2. 运行 `openspec validate migrate-superpowers-docs-to-openspec-longtask --strict`。
3. 用 `tasks.md` 承接旧三文档中的未来执行任务，并保持未完成项直到 runtime 证据闭环。
4. 建立稳定迁移索引或 canonical 入口说明。
5. 更新直接引用旧三文档的 prompt、计划、报告或相关 docs。
6. 运行旧路径引用扫描。
7. 只有在用户确认 OpenSpec 已完整承接信息后，才删除旧三文档。
8. 删除后再次运行引用扫描、OpenSpec 校验和 git diff 检查。
9. 用 Memorix 记录迁移结果、验证证据和剩余风险。

## Open Questions

- 历史报告中引用旧三文档作为历史事实的位置，是全部改写为 OpenSpec canonical，还是保留历史表述并增加迁移索引说明？默认策略：直接执行入口全部改写，历史报告优先指向迁移索引。
- 旧三文档是否需要保留最后有效版本的 git commit 链接？默认策略：在迁移索引或 `agent-findings.md` 记录删除前 git 状态和旧路径清单。
