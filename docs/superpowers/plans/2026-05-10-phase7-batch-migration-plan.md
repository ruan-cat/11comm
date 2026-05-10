# Phase 7 分批次迁移执行计划

**日期**: 2026-05-10
**阶段**: Phase 7 旧服务退役准备
**策略**: 增量矩阵 + 按业务域分批 + 完整迁移（Route + Adapter + Service + Repository + Test + Evidence）

---

## 1. 背景与目标

### 1.1 当前状态

| 维度             | 数据                                                                       |
| ---------------- | -------------------------------------------------------------------------- |
| Admin 旧 API     | 155 文件，已迁移 11 个 (7.1%)，未迁移 144 个                               |
| App Legacy API   | ~221 端点，已迁移 17 个 (7.7%)，legacy fallback ~211 个                    |
| apps/api DB 实现 | fee 约 50%，repair **0%**（完全 InMemory）                                 |
| Phase7 Gate      | `go-for-production-readonly-and-guarded-write-candidate-cutover` ✅ 已满足 |
| 旧服务退役 Gate  | `no-go-for-retirement` ⚠️ 仍确认                                           |

### 1.2 Phase7 目标

在 admin/app 都稳定消费 `apps/api` 后，逐步退役：

- `apps/admin/server`
- `apps/app/server`

**禁止删除对象**：

- `D:\code\ruan-cat\01s-11comm-app`（旧源目录，**永久保留**）
- `apps/admin/server`（在 `no-go-for-retirement` 解除前）
- `apps/app/server`（在 `no-go-for-retirement` 解除前）

### 1.3 迁移原则

1. **每批完整迁移**：Route + Adapter + Service + Repository + Vitest + Chrome MCP + shadow-off 演练
2. **增量矩阵维护**：每批完成后更新 endpoint 状态矩阵
3. **禁止跳跃**：未完成当前批次证据前，不得进入下一批次
4. **禁止误判**：
   - `READY_CONFIGURED` ≠ `DB_READY`
   - legacy fallback 200 ≠ DB/repository 迁移完成
   - 写操作需要独立证据

---

## 2. 分批次迁移计划

### 批次 0：Endpoint 状态矩阵初始化

**目标**：建立基础矩阵文档

**输入源**：
| 来源 | 规模 |
|------|-------|
| `apps/admin/server/api/**/*.ts` | 155 文件 |
| `apps/admin/src/**/*.{ts,vue}` 中的 `/api/**` 调用 | 133 个 unique |
| `apps/api/server/routes/**/*.ts` | 11 admin + 17 app routes |
| `apps/api/server/shared/runtime/runtime-endpoints.ts` | manifest 定义 |
| `apps/app/server/modules/**/endpoints.ts` | ~221 端点 |
| `apps/app/src/**/*.{ts,vue}` 中的 `/app/**` 调用 | ~208 个 unique |

**矩阵字段**：

- `sourceKind`: source file type
- `sourcePath`: file path
- `method`: HTTP method
- `oldPath`: legacy URL path
- `callerEvidence`: frontend caller proof
- `appsApiTarget`: target route in apps/api
- `targetStatus`: `candidate-after-evidence` | `legacy-fallback` | `blocked-for-execution` | `not-candidate` | `unknown-needs-triage` | `delete-candidate`
- `browserEvidence`: Chrome MCP evidence path
- `fallbackEvidence`: shadow-off proof
- `writeReadRollbackEvidence`: write operation proof
- `retirementDecision`: final decision

**验收标准**：

- 所有端点都归入明确状态
- 无隐式结论（"没扫到 = 可删除"）

---

### 批次 1：`/callComponent/**` 端点（2 个）

**优先级**: P0（DB 迁移覆盖为 0，多模块冲突）

#### 1.1 端点清单

| #   | URL                                         | 方法     | 模块冲突                     | 当前状态      |
| --- | ------------------------------------------- | -------- | ---------------------------- | ------------- |
| 1   | `/callComponent/core/list`                  | GET/POST | repair, property-application | DB 迁移覆盖 0 |
| 2   | `/callComponent/ownerRepair.appraiseRepair` | POST     | repair                       | DB 迁移覆盖 0 |

#### 1.2 关键问题

| 问题                | 说明                                                              | 处理方式                            |
| ------------------- | ----------------------------------------------------------------- | ----------------------------------- |
| **多模块冲突**      | `/callComponent/core/list` 被 repair 和 property-application 共用 | compat handler 设计，需要统一数据源 |
| **无 DB 实现**      | 当前完全透传到旧服务                                              | 需要调研 `hp_houses` 或新建 schema  |
| **dispatcher 登记** | 需要在 `legacy-dispatch` 中正确路由                               | 避免与 `/app/**` 冲突               |

#### 1.3 迁移目标

**Route 层**：

- 在 `apps/api/server/routes/app/` 下建立 `/callComponent/` 路由

**Adapter 层**：

- `legacy-adapter.ts` 支持 `/callComponent/` 路径

**Repository 层**：

- 调研数据来源（`hp_houses` 或其他 schema）
- 建立兼容 handler

#### 1.4 验收标准

| 验收项       | 说明                               |
| ------------ | ---------------------------------- |
| Vitest       | `/callComponent/**` contract test  |
| Chrome MCP   | app H5 页面 Network 证据           |
| shadow-off   | 关闭 shadow 后回退到旧服务仍可访问 |
| DB readiness | `DB_READY` 或明确数据来源          |

---

### 批次 2：`/app/floor.queryFloors`（2 个端点）

**优先级**: P0（DB 迁移覆盖为 0）

#### 2.1 端点清单

| #   | URL                           | 方法     | 当前状态      |
| --- | ----------------------------- | -------- | ------------- |
| 1   | `/app/floor.queryFloors`      | GET/POST | DB 迁移覆盖 0 |
| 2   | `/app/floor.queryFloorDetail` | GET/POST | DB 迁移覆盖 0 |

#### 2.2 关键问题

| 问题                | 说明                                                                                   | 处理方式          |
| ------------------- | -------------------------------------------------------------------------------------- | ----------------- |
| **无 DB 实现**      | 完全透传到旧服务                                                                       | 调研数据来源      |
| **report 页面依赖** | report/fee-summary 页面同时调用 `/callComponent/core/list` 和 `/app/floor.queryFloors` | 批次 1 完成后处理 |

#### 2.3 迁移目标

**Repository 层**：

- 建立 `floor` repository（如 `hp_houses` 或新 schema）

**Adapter 层**：

- `legacy-adapter.ts` 支持 floor 端点

---

### 批次 3：repair 模块（5 个端点）

**优先级**: P0（完全 InMemory，0% DB 实现）

#### 3.1 端点清单

| #   | URL                                     | 方法     | 当前状态                    |
| --- | --------------------------------------- | -------- | --------------------------- |
| 1   | `/app/ownerRepair.listOwnerRepairs`     | GET/POST | InMemory only               |
| 2   | `/app/ownerRepair.queryOwnerRepair`     | GET/POST | InMemory only               |
| 3   | `/app/ownerRepair.saveOwnerRepair`      | POST     | InMemory only（**写操作**） |
| 4   | `/app/repairSetting.listRepairSettings` | GET/POST | InMemory only               |
| 5   | `/app/dict.queryRepairStates`           | GET/POST | InMemory only               |

#### 3.2 关键问题

| 问题                                 | 说明                                                | 处理方式                                             |
| ------------------------------------ | --------------------------------------------------- | ---------------------------------------------------- |
| **完全无 DB**                        | `modules/repair/repository.ts` 当前只有 InMemory    | 需要对接 `rpRepairOrders`、`rpRepairSettings` schema |
| **Schema 存在但未接入**              | `rpRepairOrders`、`rpRepairSettings` 已定义但未使用 | 建立 Repository → Schema 映射                        |
| **写操作**                           | `saveOwnerRepair` 是 POST，需要单独处理             | 需要受控写入演练                                     |
| **manifest 已登记但 allowlist 为 0** | 5 个端点已在 manifest，但 app allowlist 未包含      | 修复 allowlist 配置                                  |

#### 3.3 迁移目标

**Repository 层**：

- 建立 `repair` repository，对接 `rpRepairOrders`、`rpRepairSettings` schema
- 替换 InMemory 实现

**Adapter 层**：

- `legacy-adapter.ts` 支持 repair 端点

**Route 层**：

- 5 个端点全部接入

#### 3.4 验收标准

| 验收项       | 说明                                  |
| ------------ | ------------------------------------- |
| Vitest       | repair 模块 contract test             |
| Chrome MCP   | app H5 repair 页面 Network            |
| shadow-off   | 关闭 shadow 后回退验证                |
| DB readiness | `DB_READY`                            |
| 写操作       | `saveOwnerRepair` 受控演练 + 回滚方案 |

---

### 批次 4：fee 查询/报表（14 个端点）

**优先级**: P1（大部分仍 InMemory）

#### 4.1 端点清单

| #   | URL                                                      | 方法     | 当前状态 |
| --- | -------------------------------------------------------- | -------- | -------- |
| 1   | `/app/fee.listFee`                                       | GET/POST | InMemory |
| 2   | `/app/fee.queryFeeDetail`                                | GET/POST | InMemory |
| 3   | `/app/feeApi/listOweFees`                                | GET/POST | InMemory |
| 4   | `/app/feeConfig.listFeeConfigs`                          | GET/POST | InMemory |
| 5   | `/app/reportFeeMonthStatistics.queryReportFeeSummary`    | GET/POST | InMemory |
| 6   | `/app/reportFeeMonthStatistics/queryPayFeeDetail`        | GET/POST | InMemory |
| 7   | `/app/reportFeeMonthStatistics.queryReportFeeDetailRoom` | GET/POST | InMemory |
| 8   | `/app/dataReport.queryFeeDataReport`                     | GET/POST | InMemory |

#### 4.2 关键问题

| 问题               | 说明                                              | 处理方式             |
| ------------------ | ------------------------------------------------- | -------------------- |
| **部分 DB 已实现** | fee CRUD 已接入，但查询/报表仍 InMemory           | 补充 Repository 方法 |
| **已有 schema**    | `exHouseCharges`、`exPayments` 等已定义           | 对接 Repository      |
| **多模块冲突**     | `fee.queryFeeDetail` 被 property-application 复用 | compat handler       |

#### 4.3 迁移目标

**Repository 层**：

- 补充 `listLegacyFees`、`listFeeDetails`、`listOweFees` 等方法
- 对接 `exHouseCharges`、`exPayments` schema

---

### 批次 5：fee 高风险写端点（3 个端点）

**优先级**: P1（**blocked-for-execution**）

#### 5.1 端点清单

| #   | URL                                       | 方法 | 当前状态                  |
| --- | ----------------------------------------- | ---- | ------------------------- |
| 1   | `/app/payment.nativeQrcodePayment`        | POST | **blocked-for-execution** |
| 2   | `/app/oweFeeCallable.writeOweFeeCallable` | POST | **blocked-for-execution** |
| 3   | `/app/fee.saveRoomCreateFee`              | POST | **blocked-for-execution** |

#### 5.2 关键问题

| 问题                        | 说明                     | 处理方式                                            |
| --------------------------- | ------------------------ | --------------------------------------------------- |
| **PHASE7_MUTATION_GUARDED** | 默认返回 409             | 需要设置 `PHASE7_ALLOW_LEGACY_MUTATIONS=1` 才能演练 |
| **高风险写入**              | 涉及支付、催缴、费用创建 | 需要业务语义验证                                    |
| **无回滚演练**              | 当前没有受控演练证据     | 编写演练方案                                        |

#### 5.3 迁移目标

**前提条件**：

- 准备好测试数据
- 确定回滚步骤
- 准备审计字段设计

**演练流程**：

1. 设置 `PHASE7_ALLOW_LEGACY_MUTATIONS=1`
2. 执行写操作
3. 验证数据写入
4. 验证回滚步骤
5. 恢复 `PHASE7_ALLOW_LEGACY_MUTATIONS` 关闭状态
6. 验证默认阻断恢复

#### 5.4 验收标准

| 验收项   | 说明                        |
| -------- | --------------------------- |
| 受控演练 | 写操作 + 读回 + 回滚        |
| 业务语义 | 支付/催缴/费用创建语义明确  |
| 审计字段 | 记录操作用户、时间、业务 ID |
| 幂等性   | 重复执行不会产生副作用      |

---

### 批次 6：admin remaining（144 个端点）

**优先级**: P1-P3（按业务域分批）

#### 6.1 端点分布

| 子域                  | 端点数 | 优先级               |
| --------------------- | ------ | -------------------- |
| contract-manage       | 25     | P2（高风险，含上传） |
| expense-manage        | 16     | P1                   |
| report-manage         | 13     | P1                   |
| house-property-manage | 10     | P2                   |
| repairs-manage        | 7      | P1                   |
| community-manage      | 7      | P2                   |
| setting-manage        | 28     | P2                   |
| patrol-manage         | 6      | P2                   |
| parking-manage        | 4      | P2                   |
| dev-team              | 24     | P3                   |
| operation-team        | 13     | P3                   |

#### 6.2 关键问题

| 问题              | 说明                                   | 处理方式         |
| ----------------- | -------------------------------------- | ---------------- |
| **155 → 11**      | 仅 11 个已迁移，144 个待处理           | 按业务域分批迁移 |
| **高风险写操作**  | 至少 37 个 create/update/delete/upload | 需要单独处理     |
| **contract 上传** | R2/文件上传，涉及分片状态              | 保持 legacy      |
| **无 schema**     | 部分端点无对应 schema                  | 先建 schema      |

#### 6.3 迁移顺序建议

1. **expense-manage** (16) - 已有 schema 基础
2. **report-manage** (13) - 已有 schema 基础
3. **repairs-manage** (7) - 已有 schema 基础
4. **house-property-manage** (10) - 调研 schema
5. **community-manage** (7) - 调研 schema
6. **patrol-manage** (6) - 调研 schema
7. **parking-manage** (4) - 调研 schema
8. **contract-manage** (25) - P2，含高风险上传
9. **setting-manage** (28) - P2
10. **dev-team** (24) - P3
11. **operation-team** (13) - P3

---

## 3. 验收标准总表

### 3.1 每批次必须满足

| 验收项                 | 说明                                              |
| ---------------------- | ------------------------------------------------- |
| **Vitest 测试**        | contract test + module test，100% 通过            |
| **Chrome MCP**         | 页面级 Network 证据，真实浏览器验证               |
| **shadow-off 演练**    | 关闭 shadow 后回退到旧服务验证                    |
| **DB readiness**       | `RUN_PHASE7_DB_READINESS_CHECK=1` 返回 `DB_READY` |
| **写操作（仅写端点）** | 受控演练 + 回滚方案 + 审计字段                    |

### 3.2 禁止事项

| 禁止项                             | 说明                                                      |
| ---------------------------------- | --------------------------------------------------------- |
| `READY_CONFIGURED` 当作 `DB_READY` | 必须实际开启深度探针                                      |
| legacy fallback 200 当作 DB 完成   | 需要明确数据来源                                          |
| 删除旧源目录                       | `D:\code\ruan-cat\01s-11comm-app` 永久保留                |
| 删除旧服务                         | `apps/admin/server`、`apps/app/server` 在 gate 解除前禁止 |
| 跳跃式迁移                         | 未完成当前批次不得进入下一批次                            |

### 3.3 Phase7 Gate 状态

| Gate                                                             | 当前状态  | 说明                 |
| ---------------------------------------------------------------- | --------- | -------------------- |
| `go-for-production-readonly-and-guarded-write-candidate-cutover` | ✅ 已满足 | 只读 + guarded write |
| `no-go-for-retirement`                                           | ⚠️ 仍确认 | 旧服务禁止删除       |

---

## 4. 参考上下文与 Skills

### 4.1 参考文档

| 文档                                                                            | 说明                               |
| ------------------------------------------------------------------------------- | ---------------------------------- |
| `docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md` | 主设计文档                         |
| `docs/superpowers/reports/2026-05-10-phase7-consolidated-report.md`             | 探索汇总报告                       |
| `apps/api/server/db/readiness.ts`                                               | DB readiness 探针逻辑              |
| `apps/api/server/modules/fee/legacy-adapter.ts`                                 | fee legacy adapter（参考实现）     |
| `apps/api/server/modules/repair/repository.ts`                                  | repair repository（当前 InMemory） |

### 4.2 项目 Skills

| Skill                      | 用途                        |
| -------------------------- | --------------------------- |
| `nitro-api-development`    | Nitro API 开发规范          |
| `schema-and-seed-guardian` | Schema 定义与 Seed 编写规范 |
| `schema-change-sync`       | Schema 变更同步检查清单     |
| `neon-db-query`            | Neon 数据库表查询           |

### 4.3 可用工具

| 工具                                            | 用途                    |
| ----------------------------------------------- | ----------------------- |
| Chrome DevTools MCP                             | 页面级 Network 证据采集 |
| Vitest                                          | 单元/集成测试           |
| `apps/api/tests/http/phase7-gated-http.test.ts` | HTTP gate 测试          |

---

## 5. 执行流程

```plain
for each 批次:
    1. 调研数据来源（schema/现有 Repository）
    2. 实现 Repository 层
    3. 实现 Service 层
    4. 实现 Adapter 层
    5. 实现 Route 层
    6. 编写 Vitest 测试
    7. 采集 Chrome MCP 证据
    8. 执行 shadow-off 演练
    9. 验证 DB readiness（如适用）
    10. 执行写操作演练（如适用）
    11. 更新 endpoint 矩阵
    12. 评审批次完成
```

---

## 6. 禁止误判清单

根据设计文档明确的禁止项：

1. **不要把 `go-for-production-readonly-and-guarded-write-candidate-cutover` 误读为旧服务可删除**
2. **不要把 `READY_CONFIGURED` 误读为 `DB_READY`**
3. **不要把 legacy fallback 返回 200 误读为 DB/repository 迁移完成**
4. **不要把本地 in-memory/fallback 写入演练误读为真实 Neon/生产写入完成**
5. **不要把 canonical-only route 误算成旧 path exact covered**
6. **不要因为某个页面的首批 Network 已通过，就推断同模块所有 detail/create/update/delete 均已完成**
7. **不要触碰旧源目录 `D:\code\ruan-cat\01s-11comm-app`**
8. **不要在没有删除候选清单和回滚方案前删除、移动、归档、重命名或清空 `apps/admin/server`、`apps/app/server`**

---

_计划创建时间：2026-05-10_
