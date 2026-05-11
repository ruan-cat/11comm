# 2026-05-10 Phase7 旧服务退役准备批量迁移执行计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or the project agent-team workflow to implement this plan batch-by-batch. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 本计划用于驱动后续子代理分批执行 Phase7 大批量迁移，为旧服务退役评审准备证据；它不是删除计划。

**Architecture:** `apps/api` 是 admin 与 app 的唯一目标 Nitro API 服务，`apps/type` 是 Schema / Zod / Drizzle / TypeScript 类型唯一事实来源。`apps/admin/server` 与 `apps/app/server` 在 `no-go-for-retirement` 解除前只作为迁移来源、legacy fallback 与回滚参考保留。

**Tech Stack:** Nitro v3、H3、Drizzle ORM、Neon Postgres、Zod、Vitest、Chrome DevTools MCP、Vercel。

---

## 1. 强约束与当前口径

### 1.1 本计划的边界

本计划只安排“迁移、补矩阵、补证据、复核、汇总报告”工作，不安排删除旧服务目录。后续即使某批端点达到 `delete-candidate`，也只能进入单独的删除候选评审，不能在迁移批次中夹带删除、移动、归档、重命名或清空动作。

### 1.2 永久保留与 no-go 约束

- `D:\code\ruan-cat\01s-11comm-app` 是旧源目录，永久保留，禁止删除、移动、归档、重命名或清空。
- `apps/admin/server` 在 `no-go-for-retirement` 解除前禁止删除、移动、归档、重命名或清空。
- `apps/app/server` 在 `no-go-for-retirement` 解除前禁止删除、移动、归档、重命名或清空。
- 当前 gate 为 `go-for-production-readonly-and-guarded-write-candidate-cutover`，只代表生产只读与默认受保护写入口候选切流可继续推进，不代表旧服务可退役。
- 生产 DB readiness 当前只能按 `READY_CONFIGURED` 记录；只有生产开启 `RUN_PHASE7_DB_READINESS_CHECK=1` 且 `/__nitro/ready` 返回 `DB_READY`，才算生产 DB readiness 完成。

### 1.3 当前统计口径

| 维度           | 当前口径                                                                                                                                                                                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin 旧 API   | `apps/admin/server/api/**/*.ts` 共 155 个旧 API 文件；old path exact covered = 6；canonical-only = 5；11 = 6 exact covered + 5 canonical-only；old path 口径 remaining = 149；144 只能作为执行计划管理口径，不能误读为旧 path exact covered 后的真实剩余数 |
| App legacy API | 业务 endpoint 约 221 个，`apps/api` Nitro 层已登记/承载 21 个；其中不少只是 Nitro 层、allowlist、guard 或 InMemory/fallback/legacy-compatible 证据，不得写成 DB 迁移完成                                                                                   |
| App fallback   | `/callComponent/**` 与 `/app/floor.queryFloors` 已开始由 apps/api 精确承载，但仍存在 InMemory/legacy-compatible-only 或 guard 状态；其他未匹配 `/app/**` 仍可走旧服务 fallback，不能写成 DB/repository 完成                                                |
| DB 实现        | fee 模块 DB 覆盖约 50%；repair 模块已完成只读首切片 DB repository wired，但仍非 `DB_READY`，写入口保持 guard                                                                                                                                               |
| 高风险写入口   | `/app/payment.nativeQrcodePayment`、`/app/oweFeeCallable.writeOweFeeCallable`、`/app/fee.saveRoomCreateFee`、`/app/ownerRepair.saveOwnerRepair`、`/callComponent/ownerRepair.appraiseRepair` 默认必须返回 `409 PHASE7_MUTATION_GUARDED`                    |

---

## 2. 执行方式：必须使用 Agent Team

### 2.1 团队角色

每批至少配置三类成员，主代理负责任务拆分、上下文传递、结果合并与最终复核：

| 角色       | 职责                                                                                                 | 产出                                     |
| ---------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 探索子代理 | 读取业务路径、旧服务实现、`apps/api` 覆盖、schema、调用端、历史报告，确认端点清单和风险              | 更新矩阵草案、范围说明、数据源与风险记录 |
| 编辑子代理 | 按批次实施迁移：route / adapter / service / repository / tests / docs evidence，不修改批次外业务代码 | 代码变更、测试、证据路径、矩阵状态更新   |
| 复核子代理 | 独立检查批次范围、禁止误判、测试与浏览器证据、shadow-off、DB readiness、写入回滚                     | 复核结论，合并到单一汇总报告             |

### 2.2 批次拆分规则

- 每个编辑子代理只负责 2-3 个具体三级业务路由或同规模 endpoint 组，避免单个子代理吞下过大范围。
- admin 批次必须按 `apps/admin/src/router/rank/rank-route-keys.ts` 所体现的三级业务路径划分，不凭空创建业务路径。
- app 批次按 legacy endpoint 模块与端点规模拆分，优先处理生产 H5 会访问、仍在 fallback 或已有 schema 支撑的端点。
- 每批都必须按顺序执行：先更新任务清单/矩阵，再实施，再复核。不得先改代码再回填矩阵。
- 子代理反馈默认合并到单一汇总报告；除非用户明确要求，不新增碎片化报告文件。

### 2.3 每批固定流程

- [ ] 更新 `docs/superpowers/reports/phase7-endpoint-migration-matrix.md` 中本批涉及端点的初始状态、负责人、证据占位与风险。
- [ ] 探索数据源：旧服务实现、调用端、`apps/api` 现状、`apps/type` schema、Drizzle 表、manifest、fallback 注册。
- [ ] 编写或调整 Vitest，先覆盖 contract、DTO 兼容、空数据、错误路径和 guard 行为。
- [ ] 实施 repository / service / adapter / route / manifest / frontend resolver 等必要变更。
- [ ] 运行批次相关 Vitest 与 typecheck。
- [ ] 使用 Chrome DevTools MCP 采集真实页面 Network 证据；没有页面入口的端点必须说明原因并补 HTTP gate 或 contract 证据。
- [ ] 执行 shadow-off 或 fallback 演练，确认回退路径仍明确。
- [ ] 写入口只在具备测试数据、业务允许范围、读回断言、回滚步骤和审计字段后执行受控演练。
- [ ] 更新矩阵最终状态与证据路径。
- [ ] 复核子代理独立检查后，将结论合并到单一汇总报告。

---

## 3. 批次 0：Endpoint 迁移矩阵与 P0 Gate

**目标：** 建立后续所有批次的唯一状态矩阵，冻结旧服务新增入口，防止“没扫到 = 可删除”的隐式结论。

**范围：**

- `apps/admin/server/api/**/*.ts`
- `apps/admin/src/**/*.{ts,vue}` 中的 `/api/**` 调用
- `apps/api/server/routes/**/*.ts`
- `apps/api/server/shared/runtime/runtime-endpoints.ts`
- `apps/app/server/modules/**/endpoints.ts`
- `apps/app/src/**/*.{ts,vue}` 中的 `/app/**` 与 `/callComponent/**` 调用

**产物路径：**

- 主矩阵：`docs/superpowers/reports/phase7-endpoint-migration-matrix.md`
- 单一汇总报告：继续维护 `docs/superpowers/reports/2026-05-10-phase7-consolidated-report.md`

**矩阵字段：**

| 字段                        | 含义                                                                                                                                |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `batchId`                   | 批次编号，如 `P0-matrix`、`P1-callcomponent`                                                                                        |
| `ownerRole`                 | 探索 / 编辑 / 复核子代理角色                                                                                                        |
| `sourceKind`                | `admin-server-api`、`admin-client-call`、`app-legacy-endpoint`、`app-client-call`、`apps-api-route`、`manifest`                     |
| `sourcePath`                | 源文件路径                                                                                                                          |
| `businessPath`              | admin 三级业务路径或 app legacy 模块                                                                                                |
| `method`                    | HTTP method                                                                                                                         |
| `oldPath`                   | 旧路径，如 `/api/**`、`/app/**`、`/callComponent/**`                                                                                |
| `coverageKind`              | 覆盖口径：`old-path-exact-covered`、`canonical-only`、`not-covered`                                                                 |
| `callerEvidence`            | 前端调用证据或“无调用者待复核”                                                                                                      |
| `appsApiTarget`             | `apps/api` 目标 route / adapter / dispatcher                                                                                        |
| `dataSourceStatus`          | `db-ready`、`in-memory-only`、`legacy-fallback`、`schema-exists-not-wired`、`unknown-needs-triage`                                  |
| `targetStatus`              | `candidate-after-evidence`、`legacy-fallback`、`blocked-for-execution`、`not-candidate`、`unknown-needs-triage`、`delete-candidate` |
| `browserEvidence`           | Chrome MCP evidence path                                                                                                            |
| `fallbackEvidence`          | shadow-off / fallback / rollback evidence path                                                                                      |
| `writeReadRollbackEvidence` | 写入、读回、回滚证据；非写端点填 `not-applicable`                                                                                   |
| `dbReadinessEvidence`       | `DB_READY` 证据路径；没有开启 probe 时必须写 `READY_CONFIGURED-only`                                                                |
| `retirementDecision`        | `keep-source`、`candidate-after-review`、`not-candidate`、`blocked`                                                                 |
| `notes`                     | 风险、冲突、禁止误判说明                                                                                                            |

**文件热点：**

- `docs/superpowers/reports/phase7-endpoint-migration-matrix.md`
- `docs/superpowers/reports/2026-05-10-phase7-consolidated-report.md`
- 只读参考：`apps/admin/server/api/**`、`apps/app/server/modules/**/endpoints.ts`、`apps/api/server/shared/runtime/runtime-endpoints.ts`

**数据源/风险：**

- admin 旧 API 必须区分数字口径：`apps/admin/server/api/**/*.ts` 共 155；old path exact covered = 6；canonical-only = 5；11 = 6 exact covered + 5 canonical-only；old path 口径 remaining = 149；144 只能作为执行计划管理口径，不能误读为旧 path exact covered 后的真实剩余数。
- 矩阵字段必须用 `coverageKind` 区分 exact covered 与 canonical-only：旧 path 精确覆盖填 `old-path-exact-covered`，仅 canonical route 覆盖填 `canonical-only`，未覆盖填 `not-covered`。
- app 已迁移 17 只能说明 Nitro 层登记或承载，不代表 DB 完成。
- legacy fallback 返回 200 不能升级为 `candidate-after-evidence`。

**子代理拆分建议：**

- 探索 A：admin 旧 API 与 admin client `/api/**` 调用。
- 探索 B：app legacy endpoint 与 app client `/app/**`、`/callComponent/**` 调用。
- 探索 C：`apps/api` routes、manifest、legacy dispatch、readiness 与 guard。
- 复核 D：核对数量、状态枚举、禁止误判、矩阵字段完整性。

**验收门：**

- 矩阵文件存在且包含全部字段。
- 每个 endpoint 至少有 `sourcePath`、`oldPath`、`targetStatus`、`dataSourceStatus`、`retirementDecision`。
- 所有未知项只能标为 `unknown-needs-triage`，不得标为可删除。

**禁止误判：**

- 禁止把 canonical-only route 抵扣为旧 path exact covered。
- 禁止把无调用者初扫结果作为删除依据。
- 禁止把 `READY_CONFIGURED` 写成 `DB_READY`。

---

## 4. 批次 1：`/callComponent/**` 生产 fallback 清理

**目标：** 优先处理仍在生产 fallback 的 `/callComponent/core/list` 与 `/callComponent/ownerRepair.appraiseRepair`，明确 compat handler、数据源和迁移边界。

**范围：**

| endpoint                                    | 方法     | 当前状态                                               |
| ------------------------------------------- | -------- | ------------------------------------------------------ |
| `/callComponent/core/list`                  | GET/POST | 多模块复用，生产 legacy fallback，DB/repository 覆盖 0 |
| `/callComponent/ownerRepair.appraiseRepair` | POST     | repair 评价路径，legacy fallback                       |

**文件热点：**

- `apps/app/server/modules/**/endpoints.ts`
- `apps/api/server/handlers/legacy-dispatch.ts`
- `apps/api/server/shared/runtime/runtime-endpoints.ts`
- `apps/api/server/modules/**/legacy-adapter.ts`
- `apps/api/tests/**`
- app H5 相关页面：`pages-sub/fee/create`、`pages-sub/report/fee-summary`、repair / property-application 相关页面

**数据源/风险：**

- `/callComponent/core/list` 被 repair 与 property-application 共用，不能只按单模块假设实现。
- 当前生产 200 是统一 server fallback 到旧 app Nitro，不能作为迁移完成证据。
- 若数据源无法确定，端点应保持 `legacy-fallback` 或 `unknown-needs-triage`，不得制造不可信 mock。

**子代理拆分建议：**

- 探索子代理：只负责 `/callComponent/core/list` 与调用页面，确认参数 `name/type` 语义和旧服务数据来源。
- 编辑子代理：只负责 compat handler、manifest、adapter 和测试。
- 复核子代理：只复核 fallback 是否消除、Network 是否命中统一 server、矩阵是否更新。

**验收门：**

- Vitest 覆盖旧响应 envelope、典型 `name/type`、空数据和未知字典。
- Chrome MCP 证明相关 H5 页面命中 `https://01s-11-server.ruan-cat.com` 或本地 `apps/api` 目标实现，而不是旧 app fallback。
- shadow-off/fallback 策略有证据：若仍保留 fallback，矩阵必须标 `legacy-fallback`，不能标完成。
- 生产 DB readiness 只有 `RUN_PHASE7_DB_READINESS_CHECK=1` 返回 `DB_READY` 才能记为完成。

**禁止误判：**

- 不要把 `/callComponent/core/list` 的 200 当作 DB 完成。
- 不要因为 fee-summary 页面渲染成功就推断所有 callComponent 语义完成。

---

## 5. 批次 2：floor legacy endpoint DB 化

**目标：** 迁移 `/app/floor.queryFloors` 与 `/app/floor.queryFloorDetail`，消除 report 页面关键 floor fallback。

**范围：**

| endpoint                      | 方法     | 当前状态                                                                                                           |
| ----------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `/app/floor.queryFloors`      | GET/POST | Batch2 已进入 apps/api registry/allowlist；当前为 `db-read-repository-wired-with-gap`，DB-ready 与 Chrome MCP 待补 |
| `/app/floor.queryFloorDetail` | GET/POST | Batch2 已进入 apps/api registry/allowlist；当前为 `db-read-repository-wired-with-gap`，`floorId` 为合成兼容 ID     |

**文件热点：**

- `apps/app/server/modules/**/endpoints.ts`
- `apps/api/server/handlers/legacy-dispatch.ts`
- `apps/api/server/modules/**`
- `apps/type/src/business/**/schema.ts`
- app H5 `pages-sub/report/fee-summary`

**数据源/风险：**

- 可能依赖 `hp_houses` 或房屋/楼栋相关 schema，必须由探索子代理确认。
- report/fee-summary 同时依赖 `/callComponent/core/list`，批次 2 的验收不能被批次 1 未完成项污染。

**子代理拆分建议：**

- 探索子代理：floor 数据模型与旧响应字段对照。
- 编辑子代理：repository/service/legacy adapter/manifest/tests。
- 复核子代理：Chrome MCP 与矩阵状态。

**执行进度（2026-05-10）：**

- [x] 探索子代理已完成：建议基于 `hpHouses` 聚合楼层兼容视图；`floorId` 只能合成，不具备真实 floor 主键语义。
- [x] 编辑子代理已完成：新增 DB runtime/repository 分支与 fake DB 单测；非 UUID `COMM_001` 不下推到 UUID `communityId`。
- [ ] 仍缺 Chrome MCP / 页面 Network 证据；当前只能标 `db-read-repository-wired-with-gap`，不得写 `DB_READY`。

**验收门：**

- Vitest 覆盖列表、详情、空楼栋、未知 community/floor。
- Chrome MCP 在 report 页面记录 floor 请求命中目标实现。
- 矩阵中 `dataSourceStatus` 从 `legacy-fallback` 更新为真实状态；若只做 fallback 包装，必须保持 `legacy-fallback`。

**禁止误判：**

- 不要把统一 server 代理旧 app 返回 200 写成 apps/api repository 完成。

---

## 6. 批次 3：repair DB 接入

**目标：** 将 app repair 5 个 endpoint 与 admin repairs 相关 list 的数据源从 InMemory/未接入状态推进到 Drizzle repository 或明确的阻断状态。

**范围：**

| endpoint                                                         | 方法     | 当前状态                                     |
| ---------------------------------------------------------------- | -------- | -------------------------------------------- |
| `/app/ownerRepair.listOwnerRepairs`                              | GET/POST | InMemory only                                |
| `/app/ownerRepair.queryOwnerRepair`                              | GET/POST | InMemory only                                |
| `/app/ownerRepair.saveOwnerRepair`                               | POST     | InMemory only，写操作                        |
| `/app/repairSetting.listRepairSettings`                          | GET/POST | InMemory only                                |
| `/app/dict.queryRepairStates`                                    | GET/POST | InMemory only                                |
| admin `repairs-todo/list`、`repairs-setting/list`、`issues/list` | POST     | 已有页面证据，但 schema 存在未充分接入需复核 |

**文件热点：**

- `apps/api/server/modules/repair/repository.ts`
- `apps/api/server/modules/repair/service.ts`
- `apps/api/server/modules/repair/admin-adapter.ts`
- `apps/api/server/modules/repair/legacy-adapter.ts`
- `apps/type/src/business/**/schema.ts`
- admin repairs API hooks 与 tests
- app repair 页面与 runtime allowlist

**数据源/风险：**

- `rpRepairOrders`、`rpRepairSettings`、`rpRepairOrderHistories` 等 schema 存在但未完全接入。
- `saveOwnerRepair` 是写入口，必须具备受控写入、读回、回滚和 guard 恢复证据。
- repair endpoint 已在 manifest 里出现，但 app allowlist 未必开放；manifest 登记不等于迁移完成。

**执行进度（2026-05-10）：**

- [x] Batch3 已启动独立 agent team 探索：ownerRepair、repairSetting/dict、旧端语义、矩阵验收各 1 个探索子代理。
- [x] repair 只读 DB repository 首切片已完成：DB URL 存在时 `getRepairRuntime(event)` 切换到 `rpRepairOrders` / `rpRepairSettings` / `rpRepairTypes` 只读数据源。
- [x] app shadow allowlist 小切片已完成：`listOwnerRepairs`、`queryOwnerRepair`、`listRepairSettings`、`dict.queryRepairStates` 已加入 allowlist；`saveOwnerRepair` 仍未开放。
- [x] 写入口默认 guard 已补齐：`/app/ownerRepair.saveOwnerRepair` 与 `/callComponent/ownerRepair.appraiseRepair` 默认返回 `409 PHASE7_MUTATION_GUARDED`；仅 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 可用于受控演练。
- [ ] Chrome MCP / browser shadow evidence 仍待补；当前不得将 repair 端点标记为 `DB_READY` 或删除候选。
- [ ] 写入口 `saveOwnerRepair` 与 `appraiseRepair` 仍缺 controlled write、read-back、rollback 与 guard 恢复证据；未完成前继续保持 `blocked-for-execution`。

**子代理拆分建议：**

- 探索 A：app ownerRepair 三个端点。
- 探索 B：repairSetting 与 dict repair states。
- 编辑 A：repository/service DB 接入。
- 编辑 B：admin/app adapter 与 tests。
- 复核：写入 guard、回滚、Chrome MCP、矩阵。

**验收门：**

- Vitest 覆盖 app legacy envelope 与 admin JsonVO 双契约。
- typecheck 通过。
- Chrome MCP 覆盖至少一个 app repair 页面与 admin repairs 页面。
- 写入口未完成受控演练前只能保持 `blocked-for-execution` 或 `unknown-needs-triage`。

**禁止误判：**

- 不要把 admin repairs list 页面 200 推断为 app repair DB 完成。
- 不要把 InMemory 写入演练写成 Neon/生产写入完成。

---

## 7. 批次 4：fee DB 查询与报表，只读端点

**目标：** 将 fee 查询与报表只读端点从 InMemory/fallback 推进到明确 DB repository 或可解释的保留状态。

**范围：实际只读清单为 8 个，不写成 14 个。**

| endpoint                                                 | 方法     | 当前风险                                         |
| -------------------------------------------------------- | -------- | ------------------------------------------------ |
| `/app/fee.listFee`                                       | GET/POST | 已在 Nitro 层承载，但需确认 DB 查询不是 InMemory |
| `/app/fee.queryFeeDetail`                                | GET/POST | 被 property-application 复用，需 compat          |
| `/app/feeApi/listOweFees`                                | GET/POST | 欠费查询需对接 `exHouseCharges` / `exPayments`   |
| `/app/feeConfig.listFeeConfigs`                          | GET/POST | 配置查询需对接 `exExpenseItems`                  |
| `/app/reportFeeMonthStatistics.queryReportFeeSummary`    | GET/POST | 报表汇总需对接 `rptExpenseSummaries`             |
| `/app/reportFeeMonthStatistics/queryPayFeeDetail`        | GET/POST | 支付明细需对接 `rptPaymentDetails`               |
| `/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` | GET/POST | 房间维度报表需明确数据源                         |
| `/app/dataReport.queryFeeDataReport`                     | GET/POST | 当前页面可能未接线，需调用端复核                 |

**文件热点：**

- `apps/api/server/modules/fee/repository.ts`
- `apps/api/server/modules/fee/service.ts`
- `apps/api/server/modules/fee/legacy-adapter.ts`
- `apps/type/src/business/**/schema.ts`
- `apps/app/src/tests/nitro-runtime/runtime-base-url.test.ts`
- app fee/report 页面

**数据源/风险：**

- 费用 CRUD 已有部分 DB 能力，但查询/报表不能自动继承完成结论。
- `fee.queryFeeDetail` 有多模块复用风险。
- `dataReport` 页面历史上存在未接线或注释逻辑，不能只靠 endpoint 存在证明页面完成。

**子代理拆分建议：**

- 编辑 A：`fee.listFee`、`fee.queryFeeDetail`、`feeApi/listOweFees`。
- 编辑 B：`feeConfig` 与三条 `reportFeeMonthStatistics*`。
- 编辑 C：`dataReport` 调用端与数据源复核。
- 复核：对 8 个只读端点逐项检查 DB 来源、Network 与矩阵。

**执行进度（2026-05-10）：**

- [x] Batch4 调度探索已完成：优先选择 `feeConfig.listFeeConfigs` 与 `reportFeeMonthStatistics.queryReportFeeSummary` 两个只读端点做最小 DB wiring。
- [x] 编辑子代理已完成：`feeConfig.listFeeConfigs` 已接入 `exExpenseItems` 只读 DB 分支；`reportFeeMonthStatistics.queryReportFeeSummary` 已接入 `rptExpenseSummaries` 聚合，只保留缺失历史字段的兼容默认。
- [x] `queryPayFeeDetail` 与 `dataReport` 已有 DB 分支，已补 repository 测试与本地 HTTP gate；仍缺页面/Chrome evidence，不能直接写成生产 `DB_READY`。
- [x] 剩余 fee 只读探索已完成：`feeApi/listOweFees` 是下一步最稳候选；`fee.listFee` 与 `oweFeeCallable.listOweFeeCallable` 暂不应直接 DB wiring。
- [x] `feeApi/listOweFees` 最小 DB 分支已完成：主表为 `exHouseCharges`，只推导欠费金额/状态/日期/分页汇总；owner/community/lateFee/oweDays 仍为兼容默认。
- [ ] `fee.listFee`、`fee.queryFeeDetail`、`oweFeeCallable.listOweFeeCallable` 暂不推进；需要 join 来源和字段语义设计后再拆小切片。

**验收门：**

- 8 个端点均有 Vitest contract。
- 至少 fee/detail 与 report/fee-summary 有 Chrome MCP Network 证据。
- repository 明确使用 Drizzle/Neon 或矩阵保留为 `in-memory-only` / `legacy-fallback`。

**禁止误判：**

- 不要把 8 个只读端点写成 14 个。
- 不要把 fee allowlist 或 Nitro adapter 存在写成 DB 完成。

---

## 8. 批次 5：fee guarded writes

**目标：** 对三条高风险写入口建立受控演练方案；未满足条件前保持默认阻断。

**范围：**

| endpoint                                  | 方法 | 当前状态                          |
| ----------------------------------------- | ---- | --------------------------------- |
| `/app/payment.nativeQrcodePayment`        | POST | `blocked-for-execution`，默认 409 |
| `/app/oweFeeCallable.writeOweFeeCallable` | POST | `blocked-for-execution`，默认 409 |
| `/app/fee.saveRoomCreateFee`              | POST | `blocked-for-execution`，默认 409 |

**文件热点：**

- `apps/api/server/modules/fee/legacy-adapter.ts`
- `apps/api/server/modules/fee/repository.ts`
- `apps/api/tests/http/phase7-gated-http.test.ts`
- app fee create / pay-qrcode / write-owe-callable 页面

**数据源/风险：**

- 涉及支付、催缴、费用创建，不能在生产无计划真实写入。
- 本地 in-memory/fallback 演练只能标 `write-runtime-fallback-only`。
- 任何开启 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 的演练都必须可回滚，并在结束后恢复关闭状态。

**子代理拆分建议：**

- 探索子代理：定义测试数据、业务允许范围、读回断言、回滚步骤、失败清理策略。
- 编辑子代理：补 guard tests、受控演练脚本入口或手动步骤文档、审计字段处理。
- 复核子代理：确认默认 409 恢复、矩阵状态、无生产真实写入误述。

**验收门：**

- 默认状态 HTTP gate 仍证明三条写入口返回 `409 PHASE7_MUTATION_GUARDED`。
- 若执行受控写入，必须有写入、读回、回滚、guard 恢复四类证据。
- 生产真实写入只有在明确授权、测试数据和回滚方案存在时才可进行；否则矩阵保持 `blocked-for-execution`。

**禁止误判：**

- 不要把默认阻断写成写能力完成。
- 不要把本地 fallback 写入写成真实 Neon 或生产写入完成。

---

## 9. 批次 6：admin P1 业务域

**目标：** 优先迁移 admin remaining 中已有 schema 基础、页面入口明确、生产 Network 可观察的 P1 业务域。

**范围：**

| 业务域                           | remaining 规模 | 拆分建议                                      |
| -------------------------------- | -------------- | --------------------------------------------- |
| `property-manage/expense-manage` | 16             | 每组 2-3 个三级路由，先 list/detail，再写入口 |
| `property-manage/report-manage`  | 13             | 每组 2-3 个报表页面，只读优先                 |
| `property-manage/repairs-manage` | 7              | 与 repair DB 批次联动，先 list/detail         |

**文件热点：**

- `apps/admin/server/api/property-manage/**`
- `apps/admin/src/api/property-manage/**`
- `apps/admin/src/views/property-manage/**`
- `apps/api/server/routes/api/property-manage/**`
- `apps/api/server/modules/**`
- `apps/type/src/business/**/schema.ts`

**数据源/风险：**

- admin canonical route 与旧 path exact covered 不等价，矩阵必须保留旧路径映射。
- create/update/delete/upload 需要独立写入策略，不得夹在 list/detail 迁移中默认完成。

**子代理拆分建议：**

- expense 子代理 A：2-3 个 expense 只读三级路由。
- expense 子代理 B：2-3 个 expense 写风险路由。
- report 子代理 C：2-3 个 report 只读路由。
- repairs 子代理 D：2-3 个 repairs 路由。
- 每组都配独立复核或由复核子代理按组复核。

**验收门：**

- 每组完成前矩阵先更新。
- Vitest 覆盖 API hook resolver 与 apps/api contract。
- Chrome MCP 覆盖对应 admin 页面。
- 写入口必须有 guard、读回、回滚或明确阻断状态。

**禁止误判：**

- 不要因为一个 list 页面 200 就推断同域 detail/create/update/delete 完成。

**执行进度（2026-05-11）：**

- [x] Batch6a 已完成：5 个 admin P1 expense 只读 list 端点（expense-summary-table/list、refund-review/list、meter-reading-type/list、reminder-for-overdue-payments/list、reprint-voucher/list）已完成 route/repository/adapter/types 实现并复核。
- [x] 类型检查通过：`pnpm -F @01s-11comm/api run typecheck` 无错误。
- [x] 测试通过：4 个测试文件 20 个测试用例全部通过（fee-db-repository、fee-legacy-endpoints、endpoint-manifest、phase7-api-contracts）。
- [ ] 仍缺 Chrome MCP / 页面 Network 证据；当前只能标 `db-read-repository-wired`，不得写 `DB_READY`。
- [ ] 本批未涉及写入口，未触发 guard/read-back/rollback。
- [x] Batch6b 已完成：4 个 admin P1 expense 只读 list 端点（vehicle-charge/list、water-and-electricity-meter-reading/list、overdue-payment-information/list、payment-review/list）已完成 route/repository/adapter/types 实现并复核。
- [x] 类型检查通过：`pnpm -F @01s-11comm/api run typecheck` 无错误。
- [x] 测试通过：4 个测试文件 20 个测试用例全部通过（fee-db-repository、fee-legacy-endpoints、endpoint-manifest、phase7-api-contracts）。
- [ ] 仍缺 Chrome MCP / 页面 Network 证据；当前只能标 `db-read-repository-wired`，不得写 `DB_READY`。
- [ ] 本批未涉及写入口，未触发 guard/read-back/rollback。
- [x] Batch7 已完成：8 个 admin P1 report/repairs 只读 list 端点（arrears-details-list/list、data-statistics/list、deposit-report/list、fee-reminder/list、no-charge-house/list、outstanding-fees-analysis/list、patrol-report/list、repairs-have-done/list）已完成 route/repository/adapter/types 实现并复核。
- [x] 类型检查通过：`pnpm -F @01s-11comm/api run typecheck` 无错误。
- [x] 测试通过：24 个测试文件 119 个测试用例全部通过。
- [ ] 仍缺 Chrome MCP / 页面 Network 证据；当前只能标 `db-read-repository-wired`，不得写 `DB_READY`。
- [ ] 本批未涉及写入口，未触发 guard/read-back/rollback。

---

## 10. 批次 7：admin P2/P3 业务域

**目标：** 在 P1 收口后，按风险和 schema 准备度迁移其他 admin 业务域。

**范围与建议顺序：**

| 业务域                                  | remaining 规模 | 优先级 | 备注                                     |
| --------------------------------------- | -------------- | ------ | ---------------------------------------- |
| `property-manage/house-property-manage` | 10             | P2     | 房屋/业主 schema 需先复核                |
| `property-manage/community-manage`      | 7              | P2     | 社区基础数据，需 DB readiness            |
| `property-manage/patrol-manage`         | 6              | P2     | 巡检相关，可与 app inspection 后续联动   |
| `property-manage/parking-manage`        | 4              | P2     | 停车相关，需确认 app parking 重叠        |
| `property-manage/contract-manage`       | 25             | P2     | 含上传/分片/R2，高风险，上传保持单独评审 |
| `setting-manage`                        | 28             | P2     | 系统/组织配置，需鉴别模板遗留与真实业务  |
| `dev-team`                              | 24             | P3     | 平台配置/菜单/缓存，最后处理             |
| `operation-team`                        | 13             | P3     | 运营端配置，最后处理                     |
| `j1-dashboard`、`debug-env`             | 2              | P3     | 单独判断是否保留或迁移                   |

**文件热点：**

- `apps/admin/server/api/**`
- `apps/admin/src/router/rank/rank-route-keys.ts`
- `apps/admin/src/api/**`
- `apps/admin/src/views/**`
- `apps/api/server/routes/api/**`
- `apps/type/src/business/**/schema.ts`

**数据源/风险：**

- contract 上传涉及文件状态、R2、分片，不能和普通 CRUD 同批结案。
- setting/dev/operation 中可能存在模板遗留或无人调用路径，必须通过矩阵标 `unknown-needs-triage` 或 `not-candidate`，不得直接删除。

**子代理拆分建议：**

- 每个子代理只负责 2-3 个三级业务路由。
- contract 上传子批次单独探索、单独编辑、单独复核。
- P3 域先做调用端与业务有效性探索，再决定是否实施迁移。

**验收门：**

- 每个三级业务路由都有矩阵记录、调用端证据、测试、Chrome MCP 或明确无页面原因。
- 无 schema 的端点先走 schema-change-sync，而不是在 API 层硬编码 mock。

**禁止误判：**

- 不要把无人调用、模板遗留、搜索未命中直接标为可删除。

---

## 11. 批次 8：其他 app legacy 业务域

**目标：** 在 P0 app fallback、repair、fee 批次完成后，按生产访问概率和 schema 准备度迁移剩余 app legacy endpoint。

**范围示例：**

- activity、appointment、complaint、contact、coupon、inspection、item-release、maintenance、meter、notice、oa-workflow、owner、parking、purchase/resource 等。

**文件热点：**

- `apps/app/server/modules/**/endpoints.ts`
- `apps/app/src/**`
- `apps/api/server/handlers/legacy-dispatch.ts`
- `apps/api/server/shared/runtime/runtime-endpoints.ts`
- `apps/api/server/modules/**`
- `apps/type/src/business/**/schema.ts`

**数据源/风险：**

- 约 211 个仍在 legacy fallback 兼容的大范围端点不能一次性全量重写。
- purchase/resource 等存在 endpoint 冲突，必须先做冲突矩阵。
- POST 不一定都是安全写，需按业务语义拆成只读 POST、受控写、真实写、高风险阻断。

**子代理拆分建议：**

- 按 app 模块每组 2-3 个 endpoint 或一个小模块分配。
- 优先生产 H5 会访问、有 schema、只读或低风险的模块。
- 高风险写模块单独批次，复用批次 5 的 guard / rollback 标准。

**验收门：**

- manifest、allowlist、legacy dispatch 状态与矩阵一致。
- Chrome MCP 覆盖真实 app 页面；没有页面入口时补 contract 与 HTTP gate。
- fallback 移除前有 shadow-off 或 rollback 证据。

**禁止误判：**

- 不要把 app legacy endpoint 注册进 `apps/api` 就当作 DB 完成。
- 不要用新 mock 伪造迁移完成。

---

## 12. 每批完成定义

一个批次只有同时满足以下条件，才允许标记完成：

- 矩阵已在实施前创建或更新本批记录，实施后再次更新最终状态。
- route / adapter / service / repository / schema / frontend resolver 的必要变更已完成；不适用项写明原因。
- Vitest 已覆盖 contract、正常路径、空数据、错误路径、guard 或兼容响应。
- 相关 package 的 typecheck 已通过。
- Chrome DevTools MCP 已采集页面级 Network 证据；无法采集页面时有明确替代证据。
- shadow-off / fallback / rollback 路径已验证或明确保留原因。
- 生产 DB readiness 未开启 deep probe 时只能记录 `READY_CONFIGURED-only`；不得写 `DB_READY`。
- 写入口已完成默认阻断验证；若执行写入，必须有写入、读回、回滚、guard 恢复证据。
- 单一汇总报告已合并探索、编辑、复核、验证证据和遗留风险。
- 复核子代理确认不存在禁止误判。

---

## 13. 复核检查清单

复核子代理必须逐项检查：

- [ ] 本批没有修改 `docs/superpowers/plans/2026-05-10-phase7-batch-migration-plan.md` 以外的计划范围之外文档，除非批次要求更新矩阵或汇总报告。
- [ ] 没有删除、移动、归档、重命名或清空 `D:\code\ruan-cat\01s-11comm-app`、`apps/admin/server`、`apps/app/server`。
- [ ] 所有端点在矩阵中都有明确 `targetStatus` 和 `dataSourceStatus`。
- [ ] `READY_CONFIGURED` 未被写成 `DB_READY`。
- [ ] legacy fallback 200 未被写成 DB/repository 完成。
- [ ] app 已迁移 17 的表述没有被写成全部 DB 完成。
- [ ] fee 查询/报表只读清单按 8 个管理；三条高风险写入口单独列入 guarded writes。
- [ ] Vitest 命令、typecheck 命令和结果已记录。
- [ ] Chrome MCP Network evidence 路径已记录。
- [ ] shadow-off / fallback / rollback 证据已记录。
- [ ] 写入演练具备测试数据、业务允许范围、读回断言、回滚步骤、失败清理和 guard 恢复。
- [ ] 所有子代理反馈已合并到单一汇总报告，未制造无必要碎片报告。

---

## 14. 参考文档

- `docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md`
- `docs/superpowers/reports/2026-04-27-phase7-consolidated-report.md`
- `docs/superpowers/reports/2026-05-10-phase7-consolidated-report.md`
- `apps/api/tests/http/phase7-gated-http.test.ts`
- `apps/api/server/db/readiness.ts`
- `apps/api/server/shared/runtime/runtime-endpoints.ts`
- `apps/api/server/handlers/legacy-dispatch.ts`

---

## 15. 禁止误判清单

1. 不要把 `go-for-production-readonly-and-guarded-write-candidate-cutover` 误读为旧服务可删除。
2. 不要把 `READY_CONFIGURED` 误读为 `DB_READY`。
3. 不要把 legacy fallback 返回 200 误读为 DB/repository 迁移完成。
4. 不要把本地 in-memory/fallback 写入演练误读为真实 Neon/生产写入完成。
5. 不要把 canonical-only route 误算成旧 path exact covered。
6. 不要因为某个页面的首批 Network 已通过，就推断同模块所有 detail/create/update/delete 均已完成。
7. 不要触碰旧源目录 `D:\code\ruan-cat\01s-11comm-app`；该目录永久保留，不属于旧服务退役对象。
8. 不要在没有删除候选清单、生产 `DB_READY`、写入口策略结论和回滚方案前，删除、移动、归档、重命名或清空 `apps/admin/server`、`apps/app/server`。

---

## 16. 2026-05-10 接力进度快照

本节用于其他 AI 会话接力。当前事实源优先级为：

1. `docs/superpowers/reports/phase7-endpoint-migration-matrix.md`
2. `docs/superpowers/plans/2026-05-10-phase7-batch-migration-plan.md`
3. `docs/superpowers/reports/2026-05-10-phase7-consolidated-report.md`
4. `docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md`

**本轮已落地并提交：**

- `26d18de2`：`feat(api)!`，接入 Phase7 app legacy 只读端点迁移，覆盖 fee/floor/repair 与 app runtime allowlist；`ownerRepair.saveOwnerRepair` 默认返回 `409 PHASE7_MUTATION_GUARDED`。
- `5873a123`：`test(api)`，补充 fee/floor/repair/callcomponent legacy、repository、runtime、manifest、contract、HTTP gate 与 app runtime 测试。
- `828a019e`：`docs(superpowers)`，更新本计划、endpoint 矩阵、综合报告和阶段 7 执行提示。
- 以上提交尚未 push；接力前先运行 `git status --short --branch` 确认分支状态。

**已验证：**

- `pnpm -F @01s-11comm/api exec vitest run tests/modules/fee-db-repository.test.ts tests/legacy/fee-legacy-endpoints.test.ts tests/modules/floor-db-repository.test.ts tests/legacy/floor-legacy-endpoints.test.ts tests/modules/repair-db-repository.test.ts tests/modules/repair-runtime.test.ts tests/legacy/repair-legacy-endpoints.test.ts tests/infra/endpoint-manifest.test.ts tests/infra/phase7-api-contracts.test.ts tests/http/phase7-gated-http.test.ts`
- `pnpm -F @01s-11comm/api run typecheck`
- `pnpm -F @01s-11comm/app exec vitest run src/tests/nitro-runtime/runtime-base-url.test.ts`
- `RUN_PHASE7_HTTP_TESTS=1` 的本地 `phase7-gated-http.test.ts`
- `git diff --check`

**接力优先级：**

1. 先处理矩阵中 `db-read-repository-wired-with-gap` 的兼容缺口，不要把它标为完整完成。
2. 继续推进 `schema-exists-not-wired` 的 fee read endpoint，优先补 repository branch、contract/module test、HTTP gate。
3. 对 `blocked-for-execution` 的 mutation 只保持默认 guard 或设计受控写入演练；没有读回、回滚和 guard restored 证据前，不得开放。
4. 继续按每批完成后立即更新矩阵和本计划，避免长任务中断后状态丢失。

**已写入 Memorix：**

- `#3306`：Phase7 批量迁移接力进度。
- `#3307`：Phase7 接力关键误区。

---

_计划修订时间：2026-05-10_
