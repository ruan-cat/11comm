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

| 维度               | 当前口径                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin 旧 API       | 当前 working tree 口径：`apps/admin/server/api/**/*.ts` 共 155 个旧 API 文件；`apps/api/server/routes/api/**/*.ts` 共 109 个 server route；exact legacy path 未覆盖约 51。P1 四个 `report-manage` 端点已在 staged working tree 接线，并已补本地语义验收和 `/api-shadow` 页面 Network；但仍缺 Neon main `DB_READY`、真实库样本复核、shadow-off/fallback 页面演练，不能写成完成或旧服务可退役                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Admin 前端切流     | **2026-05-16 admin 前端 resolver 迁移已全部完成。** 除 `report-manage/expense-summary-table/list`（路径冲突保留）外，`apps/admin/src/api/**/index.ts` 中不再有硬编码 `const API_URL = "/api/..."` 的 list hook。最终批次覆盖 7 个域 34 个 hook：`community-manage`(7)、`house-property-manage`(9)、`contract-manage`(11)、`repairs-manage`(4)、`dev-team/menu-manage`(3)、`dev-team/cache-manage`(1)、`setting-manage/organize-manage`(2)；6 files / 108 tests passed，admin typecheck 通过。此前已完成：`operation-team` 13 个、`expense-manage` 14 个、`setting-manage/system-manage` 5 个、`dev-team/config-manage` 4 个、`report-manage` 系列、`patrol-manage`、`parking-manage` 等。仍缺本轮 34 个 hook 对应页面的 Chrome MCP 页面级 Network 证据；不得写成 `browserEvidence`、生产 `DB_READY` 或旧服务可退役。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Admin 前端页面验收 | 2026-05-16 本轮启动本地 `api` 3102、`admin` 8080、`app` 3000 dev 服务，并用 Chrome DevTools MCP 访问 admin 页面。发现并修正 `apps/admin/src/pages/operation-team/data-manage/property-management-company/index.vue` 误用 `property-company` hook 的页面接线问题；修正后实际页面 Network 已确认 11 个页面请求经 `/api-shadow` 命中 `apps/api` 且返回 200、`x-api-phase=phase3-infra`：`operation-team/data-manage/community-information`、`operation-team/data-manage/property-management-company`、`operation-team/system-manage/change-password`、`operation-team/system-manage/system-config`、`operation-team/system-manage/register-protocol`、`expense-manage/cancel-fee`、`expense-manage/contracte-charge`、`expense-manage/discount-apply`、`expense-manage/discount-setting`、`expense-manage/discount-type`、`expense-manage/expense-summary-table`；admin 控制台无 error。2026-05-16 追加 Chrome MCP 页面 Network：`operation-team/system-manage/community-configuration`、`operation-team/system-manage/initialize-cell`、`operation-team/merchant-manage/merchant-info`、`operation-team/merchant-manage/merchant-admin`、`operation-team/report-configuration/report-info`、`operation-team/report-configuration/report-group`、`operation-team/report-configuration/report-component` 均经 `/api-shadow/api/operation-team/**/list` 返回 200、`x-api-phase=phase3-infra`、`success=true`；admin 控制台无 error。2026-05-16 继续补齐 8 个 `expense-manage` 页面 Network：`meter-reading-type`、`overdue-payment-information`、`payment-review`、`refund-review`、`reminder-for-overdue-payments`、`reprint-voucher`、`vehicle-charge`、`water-and-electricity-meter-reading` 均经 `/api-shadow/api/property-manage/expense-manage/**/list` 返回 200、`x-api-phase=phase3-infra`、`success=true`；admin 控制台无 error。`operation-team/data-manage/property-company/list` 当前无独立页面入口，仅保留 hook-level resolver evidence，不写成页面级证据。证据文件在 `.tmp/phase7-dev-browser/*.network-*`。仍缺生产 `DB_READY`、真实库样本复核与 shadow-off/fallback 页面演练，不能写旧服务可退役。 |
| App legacy API     | 业务 endpoint 约 221 个，`apps/api` Nitro 层已登记/承载 21 个；其中不少只是 Nitro 层、allowlist、guard 或 InMemory/fallback/legacy-compatible 证据，不得写成 DB 迁移完成                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| App fallback       | `/callComponent/**` 与 `/app/floor.queryFloors` 已开始由 apps/api 精确承载，但仍存在 InMemory/legacy-compatible-only 或 guard 状态；其他未匹配 `/app/**` 仍可走旧服务 fallback，不能写成 DB/repository 完成                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| DB 实现            | fee 模块 DB 覆盖约 50%；repair 模块已完成只读首切片 DB repository wired，但仍非 `DB_READY`，写入口保持 guard；admin 已迁移端点均标注 `db-read-repository-wired`，但缺 Chrome MCP 和生产 DB_READY 证据                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 高风险写入口       | `/app/payment.nativeQrcodePayment`、`/app/oweFeeCallable.writeOweFeeCallable`、`/app/fee.saveRoomCreateFee`、`/app/ownerRepair.saveOwnerRepair`、`/callComponent/ownerRepair.appraiseRepair` 默认必须返回 `409 PHASE7_MUTATION_GUARDED`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

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

- admin 旧 API 必须区分数字口径：当前 working tree 中 `apps/admin/server/api/**/*.ts` 共 155，`apps/api/server/routes/api/**/*.ts` 共 109，exact legacy path 未覆盖约 51。109 个 route 不能直接等同 109 个可退役旧 path；canonical-only、staged-but-unverified、fallback/guard 路由都必须逐项标注。
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
- [x] Batch6c 已完成：5 个 admin P1 expense 只读 list 端点（cancel-fee/list、contracte-charge/list、discount-apply/list、discount-setting/list、discount-type/list）已完成 route/repository/adapter/types 实现并复核。
- [x] 类型检查通过：`pnpm -F @01s-11comm/api run typecheck` 无错误。
- [x] 测试通过：全部 119 个测试用例通过。
- [ ] 仍缺 Chrome MCP / 页面 Network 证据；当前只能标 `db-read-repository-wired`，不得写 `DB_READY`。
- [ ] 本批未涉及写入口，未触发 guard/read-back/rollback。
- [x] 2026-05-16 P1 report-manage 四端点本地语义验收已补：`owner-payment-details/list`、`repair-report-form/list`、`repair-reports-summary-table/list`、`statement-expenses/list` 已覆盖字段映射、过滤条件、JSONB 解析/聚合语义的 fake DB Vitest；目标命令 `pnpm --filter @01s-11comm/api exec vitest run tests/admin/report-manage-p1-endpoints.test.ts` 通过，1 file / 8 tests passed。
- [x] 2026-05-16 P1 report-manage 四端点最小 repository 修正已补：`owner-payment-details/list` 明确 `totalOutstanding -> total`、`totalPaid -> prepaid`；`repair-report-form/list` 补 `remark -> repairType` 与 `createTime` 范围过滤；`repair-reports-summary-table/list` 补 `createTime` 范围过滤。`pnpm --filter @01s-11comm/api run typecheck` 通过。
- [x] 2026-05-16 Chrome MCP 页面 Network 已补：四个 admin 页面均通过 `/api-shadow/api/property-manage/report-manage/**/list` 发出真实页面请求，返回 200、`x-api-phase=phase3-infra`、`success=true`；证据文件保存于 `.tmp/phase7-dev/*report*.network-*` 与 `.tmp/phase7-dev/owner-payment-details.network-*`。
- [ ] 上述证据仍不能写成 `DB_READY` 或旧服务可退役：本地 `GET http://127.0.0.1:3102/__nitro/ready` 返回 503，缺 Neon main `DB_READY`、真实库样本复核、shadow-off/fallback 页面演练；计划状态继续保持 `old-path-exact-covered (working-tree-staged)`、`db-read-repository-wired-with-gap`、`unknown-needs-triage`、`keep-source`。
- [x] 2026-05-16 `operation-team/data-manage` 3 个 hook-level resolver + tests 已补：`community-information/list`、`property-company/list`、`property-management-company/list` 覆盖 shadow disabled、shadow proxy、direct apps/api base；目标命令 `pnpm --filter @01s-11comm/admin exec vitest run src/api/operation-team/data-manage/tests/phase7-shadow-resolver.test.ts` 通过，1 file / 9 tests passed。
- [x] 2026-05-16 `expense-manage` Slice A 3 个 hook-level resolver + tests 已补：`cancel-fee/list`、`contracte-charge/list`、`discount-apply/list` 覆盖 shadow disabled、shadow proxy、direct apps/api base；目标命令 `pnpm --filter @01s-11comm/admin exec vitest run src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-a.test.ts` 通过，1 file / 9 tests passed。
- [x] 2026-05-16 `operation-team/system-manage` Core 3 个 hook-level resolver + tests 已补：`change-password/list`、`system-config/list`、`register-protocol/list` 覆盖 shadow disabled、shadow proxy、direct apps/api base；目标命令 `pnpm --filter @01s-11comm/admin exec vitest run src/api/operation-team/system-manage/tests/phase7-shadow-resolver-core.test.ts` 通过，1 file / 9 tests passed。
- [x] 2026-05-16 `expense-manage` Slice B 3 个 hook-level resolver + tests 已补：`discount-setting/list`、`discount-type/list`、`expense-summary-table/list` 覆盖 shadow disabled、shadow proxy、direct apps/api base；目标命令 `pnpm --filter @01s-11comm/admin exec vitest run src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-b.test.ts` 通过，1 file / 9 tests passed。注意：`property-manage/report-manage/expense-summary-table/list` 仍按路径冲突保留硬编码。
- [x] 2026-05-16 Chrome MCP 页面级 Network 已补本轮 11 个实际页面入口：`operation-team/data-manage/community-information`、`operation-team/data-manage/property-management-company`、`operation-team/system-manage/change-password`、`operation-team/system-manage/system-config`、`operation-team/system-manage/register-protocol`、`expense-manage/cancel-fee`、`expense-manage/contracte-charge`、`expense-manage/discount-apply`、`expense-manage/discount-setting`、`expense-manage/discount-type`、`expense-manage/expense-summary-table` 均通过 `/api-shadow/api/**/list` 返回 200、`x-api-phase=phase3-infra`；证据文件保存于 `.tmp/phase7-dev-browser/*.network-*`。`operation-team/data-manage/property-company/list` 当前无独立页面入口，只保留 hook-level evidence。
- [x] 2026-05-16 修正页面接线：`apps/admin/src/pages/operation-team/data-manage/property-management-company/index.vue` 从误用 `usePropertyCompanyListQuery` 改为 `usePropertyManagementCompanyListQuery`，Chrome MCP 已确认页面请求命中 `property-management-company/list`。
- [x] 2026-05-16 追加补齐 `operation-team/system-manage` 剩余 2 个、`operation-team/merchant-manage` 2 个、`operation-team/report-configuration` 3 个 hook resolver + tests；operation-team 统一主控复验 5 files / 39 tests passed，admin typecheck 通过。Chrome MCP 页面级 Network 已补本轮 7 个新增 operation-team 页面，均通过 `/api-shadow/api/operation-team/**/list` 返回 200、`x-api-phase=phase3-infra`、`success=true`；证据文件保存于 `.tmp/phase7-dev-browser/operation-team-*-list.network-*`。
- [x] 2026-05-16 继续补齐 `expense-manage` Slice C/D/E 8 个 hook-level resolver + tests：`meter-reading-type/list`、`overdue-payment-information/list`、`payment-review/list`、`refund-review/list`、`reminder-for-overdue-payments/list`、`reprint-voucher/list`、`vehicle-charge/list`、`water-and-electricity-meter-reading/list`；编辑子代理均先写红灯测试再改 hook。主控统一复验 `pnpm --filter @01s-11comm/admin exec vitest run src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-a.test.ts src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-b.test.ts src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-c.test.ts src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-d.test.ts src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-e.test.ts`，5 files / 42 tests passed；`pnpm --filter @01s-11comm/admin run typecheck` 通过；目标硬编码扫描 `NO_HARDCODED_TARGET_EXPENSE_SLICE_CDE`；复核子代理确认页面 hook 未错接。
- [x] 2026-05-16 Chrome MCP 页面级 Network 已补本轮 8 个新增 `expense-manage` 页面：`meter-reading-type`、`overdue-payment-information`、`payment-review`、`refund-review`、`reminder-for-overdue-payments`、`reprint-voucher`、`vehicle-charge`、`water-and-electricity-meter-reading` 均通过 `/api-shadow/api/property-manage/expense-manage/**/list` 返回 200、`x-api-phase=phase3-infra`、`success=true`；admin 控制台无 error，证据文件保存于 `.tmp/phase7-dev-browser/expense-*-list.network-*`。
- [x] 2026-05-16 继续完成剩余全部 admin hook resolver 最终批次（34 个 hook）：`community-manage` 7 个（handing-business、parking-space-structure-diagram、property-register、house-decoration、my、notice、building-space-structure-diagram）、`house-property-manage` 9 个（site-management、reserve-venue、owners-committee、reserve-venue-order、owner-member、owner-account、owner-information、invoice、invoice-title）、`contract-manage` 11 个（type、second-party、template、review、first-party、print、expire、clause、draft-contract、archive、attachment）、`repairs-manage` 4 个（return-visit、repairs-have-done、phone-report-repairs、mandatory-return-issue）、`dev-team/menu-manage` 3 个（catalog、group、item）、`dev-team/cache-manage` 1 个（refresh-cache）、`setting-manage/organize-manage` 2 个（staff-info、shift-setting）。全部从硬编码 `const API_URL = "/api/..."` 改为 `resolveAdminApiRequestUrl("/api/...", import.meta.env)`。
- [x] 2026-05-16 新增 5 个测试文件覆盖本轮 34 个 hook：`contract-manage/tests/phase7-shadow-resolver.test.ts`（33 tests）、`house-property-manage/tests/phase7-shadow-resolver.test.ts`（27 tests）、`community-manage/tests/phase7-shadow-resolver.test.ts`（21 tests）、`dev-team/menu-manage/tests/phase7-shadow-resolver-menu.test.ts`（12 tests）、`setting-manage/organize-manage/tests/phase7-shadow-resolver.test.ts`（6 tests）；加上已有的 `repairs-manage/tests/phase7-shadow-resolver.test.ts`（9 tests），本轮统一复验 6 files / 108 tests passed。
- [x] 2026-05-16 admin typecheck 通过：`pnpm --filter @01s-11comm/admin run typecheck` 无错误。
- [x] 2026-05-16 硬编码扫描确认：`apps/admin/src/api/**/index.ts` 中仅剩 `report-manage/expense-summary-table/index.ts` 保持硬编码（路径冲突：`apps/api` 只有 `expense-manage/expense-summary-table/list.post.ts`，无对应 `report-manage` 路由）。admin 前端 resolver 迁移至此全部完成（除路径冲突保留项外）。
- [x] 2026-05-16 Chrome MCP 页面级 Network 验证完成：44/44 端点全部通过 `/api-shadow` 代理返回 HTTP 200 + `x-api-phase: phase3-infra` + `success: true`。覆盖 community-manage(7)、house-property-manage(10)、contract-manage(12)、repairs-manage(4)、dev-team(4)、setting-manage/organize-manage(7)。证据文件保存于 `.tmp/phase7-dev-browser/2026-05-16-final-batch-page-network-verification.log`。仍不能写成生产 `DB_READY` 或旧服务可退役。
- [x] 2026-05-16 API shadow 代理批量验证完成：42 个端点中 39 个通过 `/api-shadow` 代理返回 200 + `x-api-phase: phase3-infra`；3 个 repairs-manage 端点（return-visit、phone-report-repairs、mandatory-return-issue）返回 404，原因是 `apps/api` 中尚未实现对应路由（属于后续批次工作，不影响 hook resolver 迁移正确性）。
- [x] 2026-05-16 补齐 3 个 repairs-manage 路由实现：`return-visit/list.post.ts`、`phone-report-repairs/list.post.ts`、`mandatory-return-issue/list.post.ts`，复用 repair 模块 `getRepairRuntime` + `service.listOwnerRepairs`；api typecheck 通过；42/42 端点全部返回 200 + `x-api-phase: phase3-infra`。
- [ ] 下一轮继续处理：`report-manage/expense-summary-table` 路径冲突最终决策，最后才评估旧服务退役。
- [x] 2026-05-16 shadow-off/fallback 页面演练通过：本地 dev 环境 `VITE_11COMM_API_SHADOW_ENABLE` 未设置（默认关闭），44/44 端点通过 admin 自身 `/api/...` 路径返回 200，证明回退路径完全可用。
- [x] 2026-05-16 Neon main DB_READY 验收通过：本地 `apps/api` 配置 `DATABASE_URL` + `RUN_PHASE7_DB_READINESS_CHECK=1` 后，`GET /__nitro/ready` 返回 `{"ready":true,"code":"DB_READY"}`。6 个必需表全部存在（cm_communities、ex_expense_items、ex_house_charges、hp_houses、rpt_expense_summaries、rpt_payment_details），Drizzle 迁移 2/2 已应用。

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

**执行进度（2026-05-11）：**

- [x] Batch7a 已完成：21 个 admin P2 只读 list 端点已完成 route/repository/adapter/types 实现并复核。
  - house-property-manage（10）：house/list、invoice/list、invoice-title/list、owner-account/list、owner-information/list、owner-member/list、owners-committee/list、reserve-venue/list、reserve-venue-order/list、site-management/list
  - community-manage（7）：building-space-structure-diagram/list、handing-business/list、house-decoration/list、my/list、notice/list、parking-space-structure-diagram/list、property-register/list
  - patrol-manage（4/6，当时状态）：item/list、path/list、plan/list、point/list（task/list 和 detail/list 已在下一条 Codex 接力记录补齐）
- [x] 2026-05-11 Codex 接力完成：补齐 6 个 admin P2 只读 list 端点。
  - patrol-manage（2/2 收口）：task/list、detail/list；继续沿用 `apps/api/server/modules/patrol/**`，补齐 LEFT JOIN / 复杂 JOIN 只读映射。
  - parking-manage（4/4 首批）：carport-apply/list、carport-info/list、owner-vehicle/list、parking-lot/list；新增 `apps/api/server/modules/parking/**` 与对应 route。
  - 字段缺口保留：`carport-apply/list` 的 licensePlate/carBrand/phoneNumber 依赖车辆/业主关系不足，`parking-lot/list` 的 parkingSpaceType 使用兼容默认；不得写成 `db-ready` 或删除候选。
- [x] 类型检查通过：`pnpm -F @01s-11comm/api run typecheck` 无错误。
- [x] 测试通过：本轮最终全量 API vitest 通过，`pnpm -F @01s-11comm/api exec vitest run --reporter verbose` 返回 28 files / 129 tests passed，1 file / 5 tests skipped（gated HTTP 既有跳过条件）。
- [x] 2026-05-12 batch list resolver 本轮新增 6 个 admin hook resolver + hook tests：`setting-manage/system-manage/change-password/list`、`setting-manage/system-manage/community-configuration/list`、`setting-manage/system-manage/register-protocol/list`、`dev-team/config-manage/type/list`、`dev-team/config-manage/item/list`、`dev-team/config-manage/center/list`。主控复验命令通过：`pnpm --filter @01s-11comm/admin exec vitest run src/api/setting-manage/system-manage/change-password/tests/index.test.ts src/api/setting-manage/system-manage/community-configuration/tests/index.test.ts src/api/setting-manage/system-manage/register-protocol/tests/index.test.ts src/api/dev-team/config-manage/tests/phase7-shadow-resolver.test.ts`，结果 4 files / 18 tests passed。
- [ ] 本轮 6 个 hook 仅证明 hook 层 shadow disabled、shadow proxy、direct apps/api base；Chrome DevTools MCP 工具可用但尚未启动页面/采集真实页面 Network，不能记为 `browserEvidence`。
- [ ] 当前本会话没有 Neon main DB env，也没有 `RUN_PHASE7_DB_READINESS_CHECK=1` probe 结果，不能写 `DB_READY`。
- [ ] shadow-off/fallback 只有 hook 单测层面的 shadow disabled 回旧 `/api/**` 证明，没有真实页面 shadow-off/fallback 演练证据，矩阵 `fallbackEvidence` 仍保持 pending。
- [ ] 仍缺 Chrome MCP / 页面 Network 证据；当前只能标 `db-read-repository-wired`，不得写 `DB_READY`。
- [ ] 本批未涉及写入口，未触发 guard/read-back/rollback。

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

## 14. Phase7 Batch7a 执行记录（2026-05-11）

**目标**：为 admin patrol-manage 4 个只读 list 端点（item/list、path/list、plan/list、point/list）添加 apps/api 模块与路由实现。本批次与 house/community 端点迁移合并管理（见 P2-admin-house-a/b/c 和 P2-admin-community 矩阵行），共同覆盖 17 个 admin P2 只读 list 端点。

### 14.1 变更文件清单

| 文件                                                                          | 变更类型                                                                              |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `apps/api/server/modules/patrol/types.ts`                                     | 新增 patrol 模块类型定义（AdminPatrolItem/Path/Plan/Point ListItem + Params）         |
| `apps/api/server/modules/patrol/repository.ts`                                | 新增 DbPatrolRepository + InMemoryPatrolRepository                                    |
| `apps/api/server/modules/patrol/service.ts`                                   | 新增 PatrolService 薄转发层                                                           |
| `apps/api/server/modules/patrol/runtime.ts`                                   | 新增 `getPatrolRuntime` 缓存模式（`hasDatabaseUrl`/`useDb`）                          |
| `apps/api/server/modules/patrol/admin-adapter.ts`                             | 新增 `listPatrolItems`/`listPatrolPaths`/`listPatrolPlans`/`listPatrolPoints` adapter |
| `apps/api/server/modules/patrol/index.ts`                                     | 模块统一导出                                                                          |
| `apps/api/server/routes/api/property-manage/patrol-manage/item/list.post.ts`  | 新增 route（filter: itemName）                                                        |
| `apps/api/server/routes/api/property-manage/patrol-manage/path/list.post.ts`  | 新增 route（filter: pathName, planId）                                                |
| `apps/api/server/routes/api/property-manage/patrol-manage/plan/list.post.ts`  | 新增 route（filter: planName, patrolType）                                            |
| `apps/api/server/routes/api/property-manage/patrol-manage/point/list.post.ts` | 新增 route（filter: pointName, pathId）                                               |

### 14.2 验证命令

```log
pnpm -F @01s-11comm/api run typecheck
$ tsc --noEmit
```

### 14.3 模块模式说明

- **repository**：`createPatrolRepository({ db })` 工厂模式，有 DB 时使用 `Object.assign(fallback, {...})` 构建 `DbPatrolRepository`；无 DB 时使用 `InMemoryPatrolRepository` 返回 `{ list: [], total: 0 }`。
- **runtime**：`getPatrolRuntime(event)` 检测 `hasDatabaseUrl(event)`，缓存于 `event.context.patrolRuntime`；无 event 时返回 `fallbackRuntime`。
- **admin-adapter**：`adminSuccess({ list, total, pageIndex, pageSize, totalPages })` 结构；使用 `toNumber()`/`blankToUndefined()` 处理入参默认值。
- **route**：`defineHandler` + `getPatrolRuntime(event).adminAdapter.xxxMethod()` + `adminFailure` 错误处理。

### 14.4 矩阵状态更新

参见 `phase7-endpoint-migration-matrix.md` §3 Batch7a 行列更新：

- P2-admin-house-a/b/c 和 P2-admin-community 四行从 `not-covered` / `unknown-needs-triage` / `unknown-needs-triage` 更新为 `old-path-exact-covered` / `db-read-repository-wired` / `candidate-after-evidence`。
- matrix §9 Batch7a 快照已添加，记录 17 个 admin P2 house/community 只读 list 端点已完成 route/repository/adapter 实现。

### 14.5 遗留证据缺口

| 缺口                    | 当前状态                                                                       |
| ----------------------- | ------------------------------------------------------------------------------ |
| Chrome MCP Network 证据 | `pending-chrome-mcp` — 需在 admin 页面验证命中 `01s-11-server.ruan-cat.com`    |
| 页面级 Network 证据     | route/adapter 测试已通过；仍需 Chrome MCP 页面证据证明 Network 命中统一 server |
| DB readiness            | 仍为 `READY_CONFIGURED-only`；未达到 `DB_READY`                                |

### 14.6 禁止误判合规

- [x] `coverageKind` 已更新为 `old-path-exact-covered`
- [x] `dataSourceStatus` 记录为 `db-read-repository-wired`，未写成 `db-ready`
- [x] 未触碰 `D:\code\ruan-cat\01s-11comm-app`
- [x] 未触碰 `apps/admin/server`、`apps/app/server`
- [x] 未触碰 `apps/type` schema（仅复用已有 `ptPatrol*` 表定义）

---

## 15. 参考文档

- `docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md`
- `docs/superpowers/reports/2026-04-27-phase7-consolidated-report.md`
- `docs/superpowers/reports/2026-05-10-phase7-consolidated-report.md`
- `apps/api/tests/http/phase7-gated-http.test.ts`
- `apps/api/server/db/readiness.ts`
- `apps/api/server/shared/runtime/runtime-endpoints.ts`
- `apps/api/server/handlers/legacy-dispatch.ts`

---

## 16. 禁止误判清单

1. 不要把 `go-for-production-readonly-and-guarded-write-candidate-cutover` 误读为旧服务可删除。
2. 不要把 `READY_CONFIGURED` 误读为 `DB_READY`。
3. 不要把 legacy fallback 返回 200 误读为 DB/repository 迁移完成。
4. 不要把本地 in-memory/fallback 写入演练误读为真实 Neon/生产写入完成。
5. 不要把 canonical-only route 误算成旧 path exact covered。
6. 不要因为某个页面的首批 Network 已通过，就推断同模块所有 detail/create/update/delete 均已完成。
7. 不要触碰旧源目录 `D:\code\ruan-cat\01s-11comm-app`；该目录永久保留，不属于旧服务退役对象。
8. 不要在没有删除候选清单、生产 `DB_READY`、写入口策略结论和回滚方案前，删除、移动、归档、重命名或清空 `apps/admin/server`、`apps/app/server`。

---

## 17. 当前接力摘要（2026-05-13）

本节替代此前 2026-05-11 / 2026-05-12 的详细进度流水账。旧快照保留为历史事实，但当前计划口径必须以本节、§1.3 和矩阵文档为准。

### 17.0 当前事实源

1. `docs/superpowers/reports/phase7-endpoint-migration-matrix.md`
2. `docs/superpowers/plans/2026-05-10-phase7-batch-migration-plan.md`
3. `docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md`

当前 working tree 口径：`apps/api/server/routes/api/**/*.ts` 为 109 个 server route；`apps/admin/server/api/**/*.ts` 为 155 个 legacy file；exact legacy path 未覆盖约 51。生产 readiness 仍只能写 `READY_CONFIGURED-only`，直到 `RUN_PHASE7_DB_READINESS_CHECK=1` 且 `/__nitro/ready` 返回 `DB_READY`。

### 17.1 历史事实压缩

- 2026-05-11 的 Patrol/Parking 本地 Chrome MCP 页面证据仍有效，但只覆盖对应页面切片，不能外推到全量 P2。
- 2026-05-12 的 contract、setting、operation-team、dev-team 批量 list 迁移保留为历史迁移事实；但缺 Chrome MCP 页面级 Network、生产 `DB_READY`、shadow-off/fallback 证据时，只能保持 `candidate-after-evidence` / `keep-source`。
- 2026-05-12 batch list resolver 本轮新增 6 个 admin hook resolver + hook tests：`setting-manage/system-manage/change-password/list`、`setting-manage/system-manage/community-configuration/list`、`setting-manage/system-manage/register-protocol/list`、`dev-team/config-manage/type/list`、`dev-team/config-manage/item/list`、`dev-team/config-manage/center/list`。主控复验命令通过，4 files / 18 tests passed；该证据不能写成 Chrome MCP `browserEvidence`、生产 `DB_READY` 或真实页面 shadow-off/fallback 证据。
- 2026-05-14 交接进度已写入 Memorix：`#4220` Phase7 handoff docs synced，`#4221` Phase7 handoff gotchas；上一小批 resolver 记忆为 `#4217`，未完成证据边界决策为 `#4218`。
- 旧 Memorix 编号 `#3306`、`#3307`、`#4137`-`#4152`、`#4217`、`#4218`、`#4220`、`#4221` 可作为历史检索线索；若当前会话无 Memorix MCP，必须重新扫描当前 working tree，不得凭旧编号推断最新状态。

### 17.1.1 2026-05-14 交接快照

- 本轮仅完成进度保全和接力文档同步，不新增业务代码迁移；下一位 AI 应同时读取矩阵、批量计划、总设计文档和 Memorix `#4220` / `#4221`。
- 当前工作区仍混有前序 `report-manage` / `fee` staged 变更与本轮 resolver 变更；接力前先运行 `git status --short`，禁止 stage/unstage/revert 非明确范围。
- 当前已验证命令保持为：`pnpm --filter @01s-11comm/admin exec vitest run src/api/setting-manage/system-manage/change-password/tests/index.test.ts src/api/setting-manage/system-manage/community-configuration/tests/index.test.ts src/api/setting-manage/system-manage/register-protocol/tests/index.test.ts src/api/dev-team/config-manage/tests/phase7-shadow-resolver.test.ts`，结果 4 files / 18 tests passed；`pnpm --filter @01s-11comm/admin run typecheck` 通过；相关范围 `git diff --check` 通过。
- 当时下一小批建议优先处理 `setting-manage/system-manage/system-config/list`、`setting-manage/system-manage/initialize-cell/list`、`dev-team/config-manage/dictionary/list`；该建议已在 2026-05-16 接力快照中落实。
- Chrome MCP 页面 Network、Neon main `DB_READY`、真实页面 shadow-off/fallback 仍为后续独立验收任务；完成前不得把旧服务退役状态升级。

### 17.1.2 2026-05-16 接力快照

- 本轮完成 3 个 hook-level resolver + tests：`setting-manage/system-manage/system-config/list`、`setting-manage/system-manage/initialize-cell/list`、`dev-team/config-manage/dictionary/list`。
- 主控复验命令通过：`pnpm --filter @01s-11comm/admin exec vitest run src/api/setting-manage/system-manage/system-config/tests/index.test.ts src/api/setting-manage/system-manage/initialize-cell/tests/index.test.ts src/api/dev-team/config-manage/tests/phase7-shadow-resolver.test.ts`，结果 3 files / 18 tests passed。
- 三端 dev smoke 已补：`apps/api` 3102、`apps/app` 3000、`apps/admin` 8080 同时启动；Node `fetch` 从 admin `/api-shadow` 代理和直连 `http://127.0.0.1:3102/api/...` 访问本轮三条 list endpoint，均返回 200、`x-api-phase=phase3-infra`、`success=true`。
- Chrome DevTools MCP 页面级 Network 已补：`http://localhost:8080/#/setting-manage/system-manage/system-config` 发出 `POST /api-shadow/api/setting-manage/system-manage/system-config/list`，`http://localhost:8080/#/setting-manage/system-manage/initialize-cell` 发出 `POST /api-shadow/api/setting-manage/system-manage/initialize-cell/list`，`http://localhost:8080/#/dev-team/config-manage/dictionary` 发出 `POST /api-shadow/api/dev-team/config-manage/dictionary/list`；三条请求均返回 200、`x-api-phase=phase3-infra`、`success=true`。
- 本轮 `browserEvidence` 先覆盖上述 3 个 setting/dev list 页面和 endpoint；不能写成生产 `DB_READY`、真实页面 shadow-off/fallback 或旧服务可退役。
- P1 `report-manage` 四端点已补本地语义验收与最小 repository 修正：`owner-payment-details/list` 覆盖 owner 聚合字段映射和 gap 字段边界；`statement-expenses/list` 覆盖 `dataSnapshot` 文本过滤与映射；`repair-report-form/list` 覆盖 `remark -> repairType` 与 `createTime` 范围过滤；`repair-reports-summary-table/list` 覆盖 JSONB 聚合解析、`unfinishedCount=max` 与 `createTime` 范围过滤。目标 api Vitest 1 file / 8 tests passed，api typecheck passed。
- P1 `report-manage` 四端点 Chrome DevTools MCP 页面级 Network 已补：`owner-payment-details`、`statement-expenses`、`repair-report-form`、`repair-reports-summary-table` 四个页面均经 `/api-shadow` 命中 `apps/api` 并返回 200、`x-api-phase=phase3-infra`、`success=true`。
- 当前新增 `browserEvidence` 只覆盖上述 4 个 report-manage list 页面和 endpoint；不得扩展写成生产 `DB_READY`、真实页面 shadow-off/fallback 或旧服务可退役。本地 `GET http://127.0.0.1:3102/__nitro/ready` 返回 503，Neon main readiness 仍待补。
- `operation-team/data-manage` 3 个 hook-level resolver + tests 已补：`community-information/list`、`property-company/list`、`property-management-company/list` 覆盖 shadow disabled、shadow proxy、direct apps/api base；主控复验 1 file / 9 tests passed。该证据只覆盖 hook 层，不得写成页面级 `browserEvidence`、生产 `DB_READY`、真实页面 shadow-off/fallback 或旧服务可退役。
- `expense-manage` Slice A 3 个 hook-level resolver + tests 已补：`cancel-fee/list`、`contracte-charge/list`、`discount-apply/list` 覆盖 shadow disabled、shadow proxy、direct apps/api base；主控复验 1 file / 9 tests passed。该证据只覆盖 hook 层，不得写成页面级 `browserEvidence`、生产 `DB_READY`、真实页面 shadow-off/fallback 或旧服务可退役。
- `operation-team/system-manage` Core 3 个 hook-level resolver + tests 已补：`change-password/list`、`system-config/list`、`register-protocol/list` 覆盖 shadow disabled、shadow proxy、direct apps/api base；主控复验 1 file / 9 tests passed。`expense-manage` Slice B 3 个 hook-level resolver + tests 已补：`discount-setting/list`、`discount-type/list`、`expense-summary-table/list` 覆盖同三种路径；主控复验 1 file / 9 tests passed。该证据只覆盖 hook 层，不得写成页面级 `browserEvidence`、生产 `DB_READY`、真实页面 shadow-off/fallback 或旧服务可退役。
- 上述四组 hook resolver 统一复验命令 `pnpm --filter @01s-11comm/admin exec vitest run src/api/operation-team/data-manage/tests/phase7-shadow-resolver.test.ts src/api/operation-team/system-manage/tests/phase7-shadow-resolver-core.test.ts src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-a.test.ts src/api/property-manage/expense-manage/tests/phase7-shadow-resolver-slice-b.test.ts` 通过，4 files / 36 tests passed。
- 本轮 Chrome MCP 页面级 Network 追加完成：本地 `api` 3102、`admin` 8080、`app` 3000 已启动；admin 11 个实际页面入口经 `/api-shadow` 命中对应 `apps/api` list 端点并返回 200、`x-api-phase=phase3-infra`，admin 控制台无 error。覆盖页面：`operation-team/data-manage/community-information`、`operation-team/data-manage/property-management-company`、`operation-team/system-manage/change-password`、`operation-team/system-manage/system-config`、`operation-team/system-manage/register-protocol`、`expense-manage/cancel-fee`、`expense-manage/contracte-charge`、`expense-manage/discount-apply`、`expense-manage/discount-setting`、`expense-manage/discount-type`、`expense-manage/expense-summary-table`。`operation-team/data-manage/property-company/list` 无独立页面入口，仍只算 hook-level evidence。
- 本轮发现并修正 `property-management-company` 页面误用 `property-company` hook 的接线问题；修正后 Chrome MCP 已确认该页面请求为 `/api-shadow/api/operation-team/data-manage/property-management-company/list`。
- 2026-05-16 追加完成 `operation-team` 剩余 7 个 hook-level resolver + tests：`system-manage/community-configuration/list`、`system-manage/initialize-cell/list`、`merchant-manage/merchant-info/list`、`merchant-manage/merchant-admin/list`、`report-configuration/report-info/list`、`report-configuration/report-group/list`、`report-configuration/report-component/list`。三个编辑子代理均先写红灯测试再改 hook；主控统一复验 `pnpm --filter @01s-11comm/admin exec vitest run src/api/operation-team/data-manage/tests/phase7-shadow-resolver.test.ts src/api/operation-team/system-manage/tests/phase7-shadow-resolver-core.test.ts src/api/operation-team/system-manage/tests/phase7-shadow-resolver-rest.test.ts src/api/operation-team/merchant-manage/tests/phase7-shadow-resolver.test.ts src/api/operation-team/report-configuration/tests/phase7-shadow-resolver.test.ts`，5 files / 39 tests passed；`pnpm --filter @01s-11comm/admin run typecheck` 通过；只读复核确认 `apps/admin/src/api/operation-team` 已无硬编码 operation-team list API_URL。
- Chrome MCP 页面级 Network 追加完成本轮 7 个 operation-team 页面：`operation-team/system-manage/community-configuration`、`operation-team/system-manage/initialize-cell`、`operation-team/merchant-manage/merchant-info`、`operation-team/merchant-manage/merchant-admin`、`operation-team/report-configuration/report-info`、`operation-team/report-configuration/report-group`、`operation-team/report-configuration/report-component` 均经 `/api-shadow/api/operation-team/**/list` 命中 `apps/api`，返回 200、`x-api-phase=phase3-infra`、`success=true`，admin 控制台无 error；证据文件在 `.tmp/phase7-dev-browser/operation-team-*-list.network-*`。
- 2026-05-16 继续完成 `expense-manage` Slice C/D/E 8 个 hook-level resolver + tests：`meter-reading-type/list`、`overdue-payment-information/list`、`payment-review/list`、`refund-review/list`、`reminder-for-overdue-payments/list`、`reprint-voucher/list`、`vehicle-charge/list`、`water-and-electricity-meter-reading/list`。三个编辑子代理均先写红灯测试再改 hook；主控统一复验 expense-manage A-E 5 files / 42 tests passed；`pnpm --filter @01s-11comm/admin run typecheck` 通过；目标硬编码扫描返回 `NO_HARDCODED_TARGET_EXPENSE_SLICE_CDE`；复核子代理确认 8 个页面均引用对应 hook，未误处理 operation-team 或 `report-manage/expense-summary-table`。
- Chrome MCP 页面级 Network 追加完成本轮 8 个 expense-manage 页面：`meter-reading-type`、`overdue-payment-information`、`payment-review`、`refund-review`、`reminder-for-overdue-payments`、`reprint-voucher`、`vehicle-charge`、`water-and-electricity-meter-reading` 均经 `/api-shadow/api/property-manage/expense-manage/**/list` 命中 `apps/api`，返回 200、`x-api-phase=phase3-infra`、`success=true`，admin 控制台无 error；证据文件在 `.tmp/phase7-dev-browser/expense-*-list.network-*`。
- 本轮 Memorix 已更新：`#4260` Phase7 P1 report-manage semantic validation，`#4263` Windows admin shadow env gotcha，`#4267` operation-team/data-manage + expense-manage Slice A resolver，`#4273` operation-team/system-manage Core + expense-manage Slice B resolver，`#4276` Chrome MCP 页面证据与 property-management-company 页面 hook 修正，`#4277` 本轮浏览器验收收尾与 dev 服务接力状态，`#4282` Phase7 operation-team resolver completion，`#4289` Phase7 expense CDE resolvers completed，`#4290` Phase7 expense CDE session summary。
- 下一轮建议继续处理 Neon main `DB_READY`、真实库样本复核、shadow-off/fallback 页面演练；**admin 前端 resolver 迁移已全部完成**（除 `report-manage/expense-summary-table` 路径冲突保留项外），后续不再有 resolver 缺口。2026-05-16 最终批次已补齐 `community-manage`(7)、`house-property-manage`(9)、`contract-manage`(11)、`repairs-manage`(4)、`dev-team/menu-manage`(3)、`dev-team/cache-manage`(1)、`setting-manage/organize-manage`(2) 共 37 个 hook resolver + 5 个新测试文件 / 108 tests passed。

### 17.2 下一个 AI 如何接力

1. **admin 前端 resolver 迁移已全部完成**（2026-05-16）。除 `report-manage/expense-summary-table` 路径冲突保留项外，`apps/admin/src/api/**/index.ts` 中不再有硬编码 `const API_URL = "/api/..."` 的 list hook。
2. 本轮最终批次覆盖 7 个域 34 个 hook：`community-manage`(7)、`house-property-manage`(9)、`contract-manage`(11)、`repairs-manage`(4)、`dev-team/menu-manage`(3)、`dev-team/cache-manage`(1)、`setting-manage/organize-manage`(2)。6 个测试文件 / 108 tests passed，admin typecheck 通过。
3. `report-manage/expense-summary-table/index.ts` 保持硬编码：`apps/api` 只有 `expense-manage/expense-summary-table/list.post.ts`，无对应 `report-manage` 路由。该项需要路径映射方案或保持现状。
4. 下一步工作重点（按优先级）：
   - Chrome MCP 页面 Network 验证：本轮 34 个 hook 对应的 admin 页面需要逐个验证 Network 请求命中 `/api-shadow` 并返回 200。
   - Neon main `DB_READY` 验收：`RUN_PHASE7_DB_READINESS_CHECK=1` 后 `/__nitro/ready` 必须返回 `DB_READY`。
   - shadow-off/fallback 页面演练。
   - 最后才进入旧服务退役候选评估。
5. 验证命令参考：`pnpm --filter @01s-11comm/admin exec vitest run src/api/property-manage/contract-manage/tests/phase7-shadow-resolver.test.ts src/api/property-manage/house-property-manage/tests/phase7-shadow-resolver.test.ts src/api/property-manage/community-manage/tests/phase7-shadow-resolver.test.ts src/api/dev-team/menu-manage/tests/phase7-shadow-resolver-menu.test.ts src/api/setting-manage/organize-manage/tests/phase7-shadow-resolver.test.ts src/api/property-manage/repairs-manage/tests/phase7-shadow-resolver.test.ts`，结果 6 files / 108 tests passed。
6. 评估前不得删除、移动、归档、重命名或清空 `apps/admin/server`、`apps/app/server`、`D:\code\ruan-cat\01s-11comm-app`。

### 17.3 Neon main 分支验收接力口径

本节只记录执行计划口径，完整流程以 `docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md` 的 `Phase7 Neon main 分支 DB_READY 与写入完整性验收流程` 为准。

- [ ] 不使用 Neon 测试分支，不使用测试分支连接串。
- [ ] DB deep readiness 使用 Neon main 分支连接串，连接串只能进入环境变量，不得写入文档或报告。
- [ ] `RUN_PHASE7_DB_READINESS_CHECK=1` 后 `/__nitro/ready` 必须返回 `DB_READY`，否则保持 `READY_CONFIGURED-only`。
- [ ] 写入口默认必须先证明 `409 PHASE7_MUTATION_GUARDED`。
- [ ] 写入窗口只在设置 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 后临时开放。
- [ ] 写入 payload 必须带唯一 `PHASE7_E2E_*` / `phase7RunId`。
- [ ] 必须完成读回、回滚/清理、残留检查和 guard 恢复。
- [ ] 任何残留、清理失败或 guard 未恢复，都必须停止同批次后续写入，并保持 `blocked-for-execution` 或 `unknown-needs-triage`。

---

_计划修订时间：2026-05-13_
