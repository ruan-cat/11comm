# 2026-04-26 11comm App Monorepo API 迁移 Phase5 实施计划

> **给智能体执行者的要求：** 执行本计划时必须使用 `superpowers:executing-plans` 逐项推进。若后续波次覆盖多个业务族，必须使用 `superpowers:subagent-driven-development`，并且每个子代理最多负责 2-3 个三级业务路径。所有步骤使用复选框 `- [ ]` 跟踪进度。

**目标：** 将 Phase5 从“迁移 admin API 并补齐 CRUD”的粗略方向，落成可执行、可验证、可分波次推进的后台 API 迁移计划。首个执行波次以 `propertyManage.expenseManage.houseCharge` 为主坐标，联动核对 `propertyManage.expenseManage.expenseItemSetting`，先解决房屋收费与收费项目配置的字段归属，再补齐能够证明正确的后台标准 API。

**架构：** Phase5 延续 Phase2 到 Phase4 的影子迁移策略：`apps/api` 是唯一新增 Nitro API 服务；`apps/admin/server/api/**` 只作为旧实现参考和回滚证据；`apps/type/src/business/**/schema.ts` 是 Drizzle Table、Zod Schema 和 TypeScript Type 的唯一事实来源。后台 route 输出 `JsonVO<T>` 或 `JsonVO<PageDTO<T>>`，app legacy route 继续保持 `{ code, msg, data }`。

**技术栈：** pnpm workspace、Turbo、Nitro v3、`nitro/h3`、Drizzle ORM、Neon serverless、Vitest、`@01s-11comm/type`、pure-admin 业务路径坐标。

---

## 范围锁定

本计划只处理 Phase5 的后台标准 API 迁移与 CRUD 补齐，不做 Phase6 切流，也不做 Phase7 旧服务退役。

允许范围：

- 读取 `docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md`。
- 读取 `docs/superpowers/plans/2026-04-25-11comm-app-monorepo-api-migration-phase4.md` 与 Phase4 汇总报告。
- 读取 `apps/admin/src/router/rank/rank-route-keys.ts`。
- 读取 `apps/admin/server/api/**`、`apps/admin/src/api/**`、`apps/admin/src/pages/**`，作为后台旧接口和页面消费证据。
- 读取 `apps/type/src/business/**/schema.ts` 与同目录 DTO 文件，作为类型事实来源。
- 执行代码迁移波次时，允许修改 `apps/api/server/modules/fee/**`、`apps/api/server/routes/api/property-manage/expense-manage/**`、`apps/api/tests/**` 与 `apps/api/package.json`。
- Phase5B 联调补充允许最小修改 `apps/admin/src/api/property-manage/expense-manage/**`、`apps/admin/src/pages/property-manage/expense-manage/**` 与 `apps/admin/vite.config.ts`，仅用于补齐 hook、页面消费和本地 `/api-shadow` 独立 Nitro dev proxy。
- 发现 schema 缺口时，只允许记录阻塞结论并拆出独立 schema 同步任务；本计划对应的 API 波次不直接修改 schema。

禁止范围：

- 不删除、移动、归档、重命名、清空 `apps/admin/server`、`apps/app/server`、`D:\code\ruan-cat\01s-11comm-app`。
- 不批量修改 `apps/admin/src` 页面请求 base URL。
- 不把 app legacy `/app/**` 或 `/callComponent/**` 原地改成 admin `JsonVO`。
- 不新增 JWT、Token 校验、Neon Auth、Bearer/Authorization 校验或任何 Nitro 鉴权逻辑。
- 不从 `"h3"` 直接导入 H3 helper。
- 不在 `apps/api` 或测试文件中定义 `pgTable`、`createInsertSchema`、`createSelectSchema`。
- 不用脚本批量生成或批量改写接口文件。
- 不在没有字段归属矩阵时补写 `houseCharge` 的 `create/update/delete`。
- 不自动执行 `git commit`；提交必须由用户明确授权后单独处理。

## 当前调研结论

- `apps/api/server/modules` 当前只有 `fee` 与 `repair` 两个模块。
- `apps/api/server/routes/api` 当前只有 5 条后台标准 route，其中费用相关为 `expense-manage/house-charge/list` 和 `report-manage/payment-details-form/list`。
- `fee` 模块已经具备 DB adapter + fallback runtime，可以作为 Phase5 admin CRUD 的主要样板。
- `repair` 模块来自 Phase4A，当前仍是 fallback-only runtime，不应作为 DB-backed CRUD 样板。
- `propertyManage.expenseManage.houseCharge` 已经存在于 `rank-route-keys.ts`，页面也存在新增/编辑弹窗，但现有 API hook 只有 list。
- `apps/type/src/business/property-manage/expense-manage/house-charge.ts` 中的 `HouseChargeFormVO` 与 `exHouseCharges` 表字段不完全一致，表单字段更接近收费项目配置。
- `propertyManage.expenseManage.expenseItemSetting` 的 DTO、旧 list 接口和 `exExpenseItems` 表更直接相关。
- 因此 Wave 5A 不能盲目把 `houseCharge` 写成完整 L3 CRUD，必须先确认“房屋收费账单”和“收费项目配置”的边界。

## Wave 5A 目标

Wave 5A 覆盖 2 个三级业务路径：

| 业务路径                                          | API 路径                                                      | 初始目标等级      | 判定                                                                                                            |
| ------------------------------------------------- | ------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `propertyManage.expenseManage.houseCharge`        | `/api/property-manage/expense-manage/house-charge/**`         | L2 读接口对齐起步 | 已有 list。先补 detail 和字段归属矩阵。`create/update/delete` 只有在确认写入 `exHouseCharges` 正确时才进入 L3。 |
| `propertyManage.expenseManage.expenseItemSetting` | `/api/property-manage/expense-manage/expense-item-setting/**` | L3 CRUD 对齐候选  | DTO、表单、旧 list 和 `exExpenseItems` 更贴近，适合作为首个配置型 CRUD 候选。                                   |

Wave 5A 通过条件：

1. 两个业务路径均有完整字段归属矩阵。
2. `houseCharge` 至少达到 L2，并且未把收费项目配置字段错误写入 `exHouseCharges`。
3. `expenseItemSetting` 若字段映射确认无误，则达到 L3；若发现 schema 缺口，必须记录为 `schema-review-blocker`，不能假实现。
4. 所有新增后台 route 都返回 `JsonVO<T>` 或 `JsonVO<PageDTO<T>>`。
5. 所有 H3 helper 都从 `nitro/h3` 导入。

## 文件责任图

### 只读证据文件

- `docs/superpowers/specs/2026-04-25-11comm-app-monorepo-api-migration-design.md`
- `docs/superpowers/plans/2026-04-25-11comm-app-monorepo-api-migration-phase4.md`
- `docs/superpowers/reports/2026-04-25-phase4-consolidated-report.md`
- `docs/superpowers/reports/2026-04-26-app-response-format-unification-research.md`
- `apps/admin/src/router/rank/rank-route-keys.ts`
- `apps/admin/server/api/property-manage/expense-manage/house-charge/list.post.ts`
- `apps/admin/server/api/property-manage/expense-manage/expense-item-setting/list.post.ts`
- `apps/admin/src/api/property-manage/expense-manage/house-charge/index.ts`
- `apps/admin/src/api/property-manage/expense-manage/expense-item-setting/index.ts`
- `apps/admin/src/pages/property-manage/expense-manage/house-charge/index.vue`
- `apps/admin/src/pages/property-manage/expense-manage/house-charge/components/form.ts`
- `apps/admin/src/pages/property-manage/expense-manage/expense-item-setting/index.vue`
- `apps/admin/src/pages/property-manage/expense-manage/expense-item-setting/components/form.ts`
- `apps/admin/src/docs/prompts/生成接口/API-PROGRESS.md`
- `apps/admin/src/docs/prompts/生成接口/01s-11_apifox.cn_llms.txt.md`
- `apps/type/src/business/property-manage/expense-manage/schema.ts`
- `apps/type/src/business/property-manage/expense-manage/house-charge.ts`
- `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts`

### Wave 5A 代码文件

- 修改：`apps/api/server/modules/fee/types.ts`
- 修改：`apps/api/server/modules/fee/repository.ts`
- 修改：`apps/api/server/modules/fee/service.ts`
- 修改：`apps/api/server/modules/fee/admin-adapter.ts`
- 条件修改：`apps/api/server/modules/fee/runtime.ts`。只有 runtime 缓存或 repository factory 需要兼容扩展时才修改。
- 新增：`apps/api/server/routes/api/property-manage/expense-manage/house-charge/detail.post.ts`
- 字段门禁通过后新增：`apps/api/server/routes/api/property-manage/expense-manage/house-charge/create.post.ts`
- 字段门禁通过后新增：`apps/api/server/routes/api/property-manage/expense-manage/house-charge/update.post.ts`
- 删除门禁通过后新增：`apps/api/server/routes/api/property-manage/expense-manage/house-charge/delete.post.ts`
- 新增：`apps/api/server/routes/api/property-manage/expense-manage/expense-item-setting/list.post.ts`
- 新增：`apps/api/server/routes/api/property-manage/expense-manage/expense-item-setting/detail.post.ts`
- 字段门禁通过后新增：`apps/api/server/routes/api/property-manage/expense-manage/expense-item-setting/create.post.ts`
- 字段门禁通过后新增：`apps/api/server/routes/api/property-manage/expense-manage/expense-item-setting/update.post.ts`
- 删除门禁通过后新增：`apps/api/server/routes/api/property-manage/expense-manage/expense-item-setting/delete.post.ts`
- 新增：`apps/api/tests/modules/fee-admin-crud.test.ts`
- 新增：`apps/api/tests/admin/expense-manage-phase5a.test.ts`
- 修改：`apps/api/tests/admin/fee-admin-endpoints.test.ts`
- 修改：`apps/api/package.json`，在测试文件存在后增加 `verify:phase5`。

### 受保护文件

- 禁止修改：`apps/admin/server/**`
- 禁止修改：`apps/app/server/**`
- 禁止修改：`D:\code\ruan-cat\01s-11comm-app`
- 禁止在本 API 波次内修改：`apps/type/src/business/**/schema.ts`

如果确实需要 schema 变更，必须停止当前 API 波次，创建独立 schema-change 计划，并同步处理迁移文件、导出链、种子数据、前端页面、后端 API 和 `.claude/skills/neon-db-query/SKILL.md`。

## 实施步骤

### 任务 1：基线与边界校验

- [x] **步骤 1：确认受保护路径仍然存在**

运行：

```powershell
Test-Path apps/admin/server
Test-Path apps/app/server
Test-Path "D:\code\ruan-cat\01s-11comm-app"
```

预期：

- 三条命令都输出 `True`。
- 任何一条命令输出 `False` 时，立即停止 Phase5 执行。

- [x] **步骤 2：确认 Wave 5A 业务坐标存在**

运行：

```powershell
rg -n '"propertyManage\.expenseManage\.(houseCharge|expenseItemSetting)"' apps/admin/src/router/rank/rank-route-keys.ts
```

预期：

- 输出同时包含 `houseCharge` 与 `expenseItemSetting`。

- [x] **步骤 3：记录当前 `apps/api` 基线**

运行：

```powershell
rg --files apps/api/server/modules
rg --files apps/api/server/routes/api
rg --files apps/api/tests
```

预期：

- 在 Wave 5A 编辑前，模块仍然只包含已知的 Phase2/Phase4 模块。
- 当前 route 列表包含 `house-charge/list.post.ts`，且不包含未规划的 CRUD 文件。

### 任务 2：字段归属矩阵

- [x] **步骤 1：提取后端 schema 证据**

运行：

```powershell
rg -n "exHouseCharges|insertExHouseChargeSchema|selectExHouseChargeSchema|updateExHouseChargeSchema|exExpenseItems|insertExExpenseItemSchema|selectExExpenseItemSchema|updateExExpenseItemSchema" apps/type/src/business/property-manage/expense-manage/schema.ts
```

预期：

- 输出包含 8 个 table/schema 符号。

- [x] **步骤 2：提取前端与旧接口证据**

运行：

```powershell
rg -n "HouseChargeFormVO|HouseChargeListItem|HouseChargeQueryParams" apps/type/src/business/property-manage/expense-manage/house-charge.ts apps/admin/src/pages/property-manage/expense-manage/house-charge
rg -n "ExpenseItemSettingFormVO|ExpenseItemSettingListItem|ExpenseItemSettingQueryParams" apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts apps/admin/src/pages/property-manage/expense-manage/expense-item-setting
rg -n "房屋收费|收费项目|创建房屋费用|获取房屋费用详情|费用项设置" apps/admin/src/docs/prompts/生成接口/API-PROGRESS.md apps/admin/src/docs/prompts/生成接口/01s-11_apifox.cn_llms.txt.md
```

预期：

- 输出能够证明哪些字段属于房屋收费账单，哪些字段属于收费项目配置。
- 若本地 API 文档与代码冲突，优先以 `rank-route-keys.ts`、`apps/type` schema 和实际页面消费为准，并把冲突记录在本计划中。

- [x] **步骤 3：复核字段矩阵后再写代码**

复核 `## Wave 5A 字段归属矩阵`。若本地 API 文档或页面代码证明映射不同，必须先更新矩阵。矩阵列名必须保持为：

```markdown
| UI/API 字段 | 来源文件 | 目标表 | 目标列 | 操作 | 结论 |
```

必要结论：

- `houseCharge` 账单字段映射到 `exHouseCharges`。
- `expenseItemSetting` 配置字段映射到 `exExpenseItems`。
- 不能映射的字段必须标记为 `blocked-schema-review` 或 `blocked-contract-review`。

在 `contract-review-required`、`blocked-schema-review` 或 `blocked-contract-review` 行没有明确处理结论前，禁止实现 `list/detail` 之外的写接口。

## Wave 5A 字段归属矩阵

| UI/API 字段                            | 来源文件                                                                        | 目标表           | 目标列                   | 操作                        | 结论                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------- | ---------------- | ------------------------ | --------------------------- | ----------------------------------------------------- |
| `houseCharge.id`                       | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exHouseCharges` | `id`                     | `list/detail`               | 已确认                                                |
| `houseCharge.name`                     | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exHouseCharges` | `expenseItem`            | `list/detail`               | 已确认，仅作为展示名                                  |
| `houseCharge.status`                   | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exHouseCharges` | `status`                 | `list/detail`               | 已确认                                                |
| `houseCharge.createTime`               | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exHouseCharges` | `createTime`             | `list/detail`               | 已确认                                                |
| `houseCharge.updateTime`               | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exHouseCharges` | `updateTime`             | `list/detail`               | 已确认                                                |
| `houseCharge.remark`                   | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exHouseCharges` | `remark`                 | `list/detail`               | 已确认                                                |
| `houseCharge.houseId`                  | 当前 `apps/api` house-charge adapter 与旧后台 list route                        | `exHouseCharges` | `houseId`                | `list/detail`               | 已确认                                                |
| `houseCharge.expenseItem`              | 当前 `apps/api` house-charge adapter 与旧后台 list route                        | `exHouseCharges` | `expenseItem`            | `list/detail`               | 已确认                                                |
| `houseCharge.receivableAmount`         | 当前 `apps/api` house-charge adapter 与旧后台 list route                        | `exHouseCharges` | `receivableAmount`       | `list/detail`               | 已确认                                                |
| `houseCharge.receivedAmount`           | 当前 `apps/api` house-charge adapter 与旧后台 list route                        | `exHouseCharges` | `receivedAmount`         | `list/detail`               | 已确认                                                |
| `houseCharge.billingPeriod`            | 当前 `apps/api` house-charge adapter 与旧后台 list route                        | `exHouseCharges` | `billingPeriod`          | `list/detail`               | 已确认                                                |
| `houseCharge.billDate`                 | 当前 `apps/api` house-charge adapter 与旧后台 list route                        | `exHouseCharges` | `billDate`               | `list/detail`               | 已确认                                                |
| `houseCharge.dueDate`                  | 当前 `apps/api` house-charge adapter 与旧后台 list route                        | `exHouseCharges` | `dueDate`                | `list/detail`               | 已确认                                                |
| `HouseChargeFormVO.expenseType`        | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exExpenseItems` | `expenseType`            | `create/update`             | `contract-review-required`，不得写入 `exHouseCharges` |
| `HouseChargeFormVO.chargeItem`         | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exExpenseItems` | `itemName`               | `create/update`             | `contract-review-required`，不得写入 `exHouseCharges` |
| `HouseChargeFormVO.feeIdentifier`      | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exExpenseItems` | `expenseCode` 或派生标识 | `create/update`             | `contract-review-required`                            |
| `HouseChargeFormVO.paymentType`        | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exExpenseItems` | `paymentType`            | `create/update`             | `contract-review-required`                            |
| `HouseChargeFormVO.paymentCycleMonths` | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exExpenseItems` | `billingCycle`           | `create/update`             | `contract-review-required`                            |
| `HouseChargeFormVO.accountDeduction`   | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exExpenseItems` | `accountDeduction`       | `create/update`             | `contract-review-required`                            |
| `HouseChargeFormVO.mobilePayment`      | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exExpenseItems` | `mobilePayment`          | `create/update`             | `contract-review-required`                            |
| `HouseChargeFormVO.roundingMethod`     | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exExpenseItems` | `roundingMode`           | `create/update`             | `contract-review-required`                            |
| `HouseChargeFormVO.decimalPlaces`      | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exExpenseItems` | `decimalPlaces`          | `create/update`             | `contract-review-required`                            |
| `HouseChargeFormVO.calculationFormula` | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exExpenseItems` | `formula`                | `create/update`             | `contract-review-required`                            |
| `HouseChargeFormVO.billingUnitPrice`   | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exExpenseItems` | `unitPrice`              | `create/update`             | `contract-review-required`                            |
| `HouseChargeFormVO.fixedFee`           | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | `exExpenseItems` | `fixedFee`               | `create/update`             | `contract-review-required`                            |
| `HouseChargeFormVO.prepaidPeriodDays`  | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | 无               | 无                       | `create/update`             | `blocked-schema-review`                               |
| `HouseChargeFormVO.unit`               | `apps/type/src/business/property-manage/expense-manage/house-charge.ts`         | 无               | 无                       | `create/update`             | `blocked-schema-review`                               |
| `expenseItemSetting.id`                | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | `exExpenseItems` | `id`                     | `list/detail/update/delete` | 已确认                                                |
| `expenseItemSetting.code`              | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | `exExpenseItems` | `expenseCode`            | `list/detail/create/update` | 已确认                                                |
| `expenseItemSetting.feeType`           | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | `exExpenseItems` | `expenseType`            | `list/detail/create/update` | 已确认                                                |
| `expenseItemSetting.expenseItem`       | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | `exExpenseItems` | `itemName`               | `list/detail/create/update` | 已确认                                                |
| `expenseItemSetting.expenseIdentifier` | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | `exExpenseItems` | `expenseCode` 或派生标识 | `list/detail/create/update` | `contract-review-required`                            |
| `expenseItemSetting.paymentType`       | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | `exExpenseItems` | `paymentType`            | `list/detail/create/update` | 已确认                                                |
| `expenseItemSetting.paymentCycle`      | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | `exExpenseItems` | `billingCycle`           | `list/detail/create/update` | 已确认                                                |
| `expenseItemSetting.formula`           | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | `exExpenseItems` | `formula`                | `list/detail/create/update` | 已确认                                                |
| `expenseItemSetting.billingUnitPrice`  | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | `exExpenseItems` | `unitPrice`              | `list/detail/create/update` | 已确认                                                |
| `expenseItemSetting.fixedFee`          | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | `exExpenseItems` | `fixedFee`               | `list/detail/create/update` | 已确认                                                |
| `expenseItemSetting.accountDeduction`  | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | `exExpenseItems` | `accountDeduction`       | `list/detail/create/update` | 已确认                                                |
| `expenseItemSetting.mobilePayment`     | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | `exExpenseItems` | `mobilePayment`          | `create/update`             | 已从表单确认                                          |
| `expenseItemSetting.roundingMode`      | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | `exExpenseItems` | `roundingMode`           | `create/update`             | 已从表单确认                                          |
| `expenseItemSetting.decimalPlaces`     | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | `exExpenseItems` | `decimalPlaces`          | `create/update`             | 已从表单确认                                          |
| `expenseItemSetting.status`            | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | `exExpenseItems` | `status`                 | `list/detail/create/update` | 已确认                                                |
| `expenseItemSetting.unit`              | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | 无               | 无                       | `create/update`             | `blocked-schema-review`                               |
| `expenseItemSetting.prepaymentPeriod`  | `apps/type/src/business/property-manage/expense-manage/expense-item-setting.ts` | 无               | 无                       | `create/update`             | `blocked-schema-review`                               |
| `houseCharge.delete`                   | `apps/type/src/business/property-manage/expense-manage/schema.ts`               | `exHouseCharges` | 无 `deletedAt`           | `delete`                    | `blocked-contract-review`，除非明确接受物理删除       |
| `expenseItemSetting.delete`            | `apps/type/src/business/property-manage/expense-manage/schema.ts`               | `exExpenseItems` | 无 `deletedAt`           | `delete`                    | `blocked-contract-review`，除非明确接受物理删除       |

### 任务 3：红灯测试

- [x] **步骤 1：新增 service/repository CRUD 测试**

新增文件：`apps/api/tests/modules/fee-admin-crud.test.ts`。

测试文件必须使用：

```ts
import { describe, test } from "vitest";
```

必须覆盖的测试用例：

- `同一个 repository 能同时提供房屋收费列表和详情`
- `同一个 service 能创建和更新收费项目配置`
- `字段门禁通过前不得暴露被阻塞的 house-charge 写操作`
- `每个目标表的 delete 行为必须显式声明`

运行：

```powershell
pnpm -F @01s-11comm/api test -- tests/modules/fee-admin-crud.test.ts
```

预期：

- 实现前测试失败，失败原因是 repository/service 方法尚不存在。

- [x] **步骤 2：新增后台 route 测试**

新增文件：`apps/api/tests/admin/expense-manage-phase5a.test.ts`。

测试文件必须使用：

```ts
import { describe, test } from "vitest";
```

必须覆盖的测试用例：

- `house-charge detail 返回 JsonVO 单项结构`
- `expense-item-setting list 返回 JsonVO PageDTO 结构`
- `expense-item-setting detail 返回 JsonVO 单项结构`
- `expense-item-setting create 校验必填字段`
- `expense-item-setting update 校验 id`
- `expense-item-setting delete 遵循显式删除策略`
- `route handler 在 adapter 抛错时返回 adminFailure 并设置 500`

运行：

```powershell
pnpm -F @01s-11comm/api test -- tests/admin/expense-manage-phase5a.test.ts
```

预期：

- 实现前测试失败，失败原因是 route handler 与 adapter 方法尚不存在。

### 任务 4：Repository 与 Service 实现

- [x] **步骤 1：扩展 fee repository 接口**

修改文件：`apps/api/server/modules/fee/repository.ts`。

必须新增的 repository 方法：

- `getHouseChargeDetail(id: string)`
- `listExpenseItemSettings(params)`
- `getExpenseItemSettingDetail(id: string)`
- `createExpenseItemSetting(input)`
- `updateExpenseItemSetting(input)`
- `deleteExpenseItemSetting(id: string)`

条件新增的方法：

- `createHouseCharge(input)`
- `updateHouseCharge(input)`
- `deleteHouseCharge(id)`

上述 3 个 `houseCharge` 写方法只有在字段矩阵确认这些操作属于 `exHouseCharges` 后才能新增。

实现规则：

- DB 实现使用 `exHouseCharges`、`exExpenseItems`、`insertExExpenseItemSchema`、`updateExExpenseItemSchema` 以及 `@01s-11comm/type` 导出的相关类型。
- fallback 实现必须维护可变的内存状态，让测试能在无数据库 URL 时证明 `create/update/delete` 行为。
- 不在 `apps/api` 内定义任何 schema。

- [x] **步骤 2：扩展 fee service**

修改文件：`apps/api/server/modules/fee/service.ts`。

必须新增与 repository 对应的 service 方法。业务判断放在 service 中，不放在 route handler 中。

预期：

- route handler 不直接调用 repository。
- admin adapter 只调用 service。

### 任务 5：Admin Adapter 与 Route

- [x] **步骤 1：扩展 admin adapter**

修改文件：`apps/api/server/modules/fee/admin-adapter.ts`。

必须新增的 adapter 方法：

- `getHouseChargeDetail(input): Promise<JsonVO<AdminHouseChargeListItem>>`
- `listExpenseItemSettings(input): Promise<JsonVO<PageDTO<ExpenseItemSettingListItem>>>`
- `getExpenseItemSettingDetail(input): Promise<JsonVO<ExpenseItemSettingListItem>>`
- `createExpenseItemSetting(input): Promise<JsonVO<ExpenseItemSettingListItem>>`
- `updateExpenseItemSetting(input): Promise<JsonVO<ExpenseItemSettingListItem>>`
- `deleteExpenseItemSetting(input): Promise<JsonVO<{ id: string }>>`

条件新增的方法：

- `houseCharge` 的 `create/update/delete` adapter 方法。只有字段矩阵和删除门禁通过后才能新增。

预期：

- 成功响应使用 `adminSuccess`。
- 校验失败必须有确定性错误处理，不能静默返回成功。

- [x] **步骤 2：新增 route handler**

新增文件以“文件责任图”中的 route 文件清单为准。

每个 route handler 必须满足：

- H3 helper 从 `nitro/h3` 导入。
- 使用 `readBody(event)` 读取请求体。
- 调用 `getFeeRuntime(event).adminAdapter`。
- `catch` 中调用 `setResponseStatus(event, 500)`。
- `catch` 中返回 `adminFailure("查询失败" | "保存失败" | "删除失败", error)`。

预期：

- 现有 `house-charge/list.post.ts` 保持兼容。
- 新增 route handler 不包含任何 auth、token、Bearer 或 Authorization 逻辑。

### 任务 6：包级验证脚本

- [x] **步骤 1：新增 `verify:phase5`**

修改文件：`apps/api/package.json`。

新增脚本：

```json
"verify:phase5": "vitest run tests/admin tests/modules tests/runtime tests/infra && pnpm run typecheck && pnpm run build:node"
```

预期：

- 脚本只使用本地 package 依赖和已有 scripts。
- 不引入全局安装命令。

### 任务 7：验证门禁

- [x] **步骤 1：运行定向测试**

运行：

```powershell
pnpm -F @01s-11comm/api test -- tests/modules/fee-admin-crud.test.ts
pnpm -F @01s-11comm/api test -- tests/admin/expense-manage-phase5a.test.ts
pnpm -F @01s-11comm/api test -- tests/admin/fee-admin-endpoints.test.ts
```

预期：

- 所有定向测试通过。

- [x] **步骤 2：运行包级与类型验证**

运行：

```powershell
pnpm -F @01s-11comm/api run verify:phase5
pnpm -F @01s-11comm/api typecheck
pnpm -F @01s-11comm/api build:node
pnpm -F @01s-11comm/type typecheck
```

预期：

- 所有命令退出码为 0。

- [x] **步骤 3：运行禁用模式扫描**

运行：

```powershell
rg -n 'from [''"]h3[''"]' apps/api/server apps/api/tests
rg -n "@neondatabase/auth|JWT|jwt|Neon Auth|Token 验证|token 验证|Bearer|Authorization" apps/api/server apps/api/tests
rg -n "pgTable|createInsertSchema|createSelectSchema" apps/api/server apps/api/tests
```

预期：

- 三条命令均无匹配输出。

- [x] **步骤 4：校验受保护目录**

运行：

```powershell
Test-Path apps/admin/server
Test-Path apps/app/server
Test-Path "D:\code\ruan-cat\01s-11comm-app"
git status --short -- apps/admin/server apps/app/server
```

预期：

- 三条 `Test-Path` 命令都输出 `True`。
- `git status --short -- apps/admin/server apps/app/server` 不显示删除、移动、重命名或清理状态。

- [x] **步骤 5：运行最终工作区门禁**

运行：

```powershell
pnpm run ci
git diff --check
```

预期：

- CI 通过。
- `git diff --check` 无输出。

### 任务 8：Admin Hook、页面消费与独立 Nitro 联调补充

- [x] **步骤 1：补齐 admin expense hook 的 Phase5B 消费入口**

修改文件：

- `apps/admin/src/api/property-manage/expense-manage/house-charge/index.ts`
- `apps/admin/src/api/property-manage/expense-manage/expense-item-setting/index.ts`
- `apps/admin/src/api/property-manage/expense-manage/house-charge/tests/index.test.ts`
- `apps/admin/src/api/property-manage/expense-manage/expense-item-setting/tests/index.test.ts`

完成内容：

- `houseCharge` 补齐 `getHouseChargeDetail`，继续保持只读边界。
- `expenseItemSetting` 补齐 `getExpenseItemSettingDetail`、`createExpenseItemSetting`、`updateExpenseItemSetting`、`deleteExpenseItemSetting`。
- hook 支持 `VITE_11COMM_API_SHADOW_ENABLE=true` 时切到独立 `apps/api` 影子接口。
- `deleteExpenseItemSetting` 保留 405 策略响应，不把“禁止物理删除”误包装成前端异常。

- [x] **步骤 2：补齐 admin 页面必要消费代码**

修改文件：

- `apps/admin/src/pages/property-manage/expense-manage/house-charge/index.vue`
- `apps/admin/src/pages/property-manage/expense-manage/expense-item-setting/index.vue`

完成内容：

- `houseCharge` 保留前端新增、编辑、删除入口作为待实现坐标；当前写操作保持 `pending/blocked`，不接入 `create/update/delete` hook，不发送写请求，不提交假数据，不伪造成功，不绕过字段门禁写入 `exHouseCharges`；点击只能提示待实现或策略未确认。
- `expenseItemSetting` 将新增、编辑、详情、删除按钮接到 Phase5B hook；新增和编辑使用页面表单映射到 `exExpenseItems` 支持的字段。
- 页面字段映射遵守字段归属矩阵；`unit`、`prepaymentPeriod`、`prepaidPeriodDays` 等 schema 未支持字段不写入 Neon。

- [x] **步骤 3：修复 admin dev server 的 `/api-shadow` 独立 Nitro 代理**

修改文件：

- `apps/admin/vite.config.ts`

根因与处理：

- 仅依赖 Vite `server.proxy` 时，`/api-shadow/**` 在当前 admin Vite + Nitro 插件组合下会落入 admin 自身的 SPA/Nitro 回退，浏览器拿到 `index.html`，不能证明独立 `apps/api` 可用。
- 新增 `admin-api-shadow-proxy` 前置 dev middleware，仅在 `VITE_11COMM_API_USE_PROXY=true` 且 `VITE_11COMM_API_BASE_URL` 存在时启用，在 Nitro 插件前把 `/api-shadow/**` 转发到独立 `apps/api`。
- 该代理只影响本地 dev 联调，不改变生产构建的 API 行为。

- [x] **步骤 4：使用 Chrome MCP 从 admin 浏览器上下文验证接口可用**

运行环境：

- 独立 `apps/api`：`http://127.0.0.1:3102`
- admin dev server：`http://127.0.0.1:8080`
- 环境变量：`VITE_11COMM_API_SHADOW_ENABLE=true`、`VITE_11COMM_API_USE_PROXY=true`、`VITE_11COMM_API_BASE_URL=http://127.0.0.1:3102`、`VITE_11COMM_API_PROXY_PREFIX=/api-shadow`

验证结果：

- Chrome MCP 打开 `http://127.0.0.1:8080/#/property-manage/expense-manage/expense-item-setting` 后，当前模板按既有登录策略重定向到 `/#/login`。
- 在浏览器页面上下文执行 `fetch('/api-shadow/__nitro/health')` 返回 `success: true`，并确认 `checks.database.configured: true`。
- 在浏览器页面上下文执行 `expense-item-setting/list` 返回 `success: true`。
- 在浏览器页面上下文执行 `expense-item-setting/create -> update -> detail -> delete` 全链路成功；`delete` 按策略返回 405 和 `unsupported`，不做物理删除。

- [x] **步骤 5：使用真实 Neon 做 create/update 写入与清理验证**

验证结果：

- 通过 admin dev server 的 `/api-shadow` 代理调用独立 Nitro API，创建测试编码 `FEE_PHASE5B_1777206887840`，随后 update/detail/delete-policy 均符合预期。
- 直接查询 Neon `ex_expense_items`，确认 `remark = phase5b-update`、`status = disabled`、`unit_price = 2.3400` 已落库。
- 清理该测试记录后，`remaining = 0`。
- Chrome MCP 浏览器上下文另创建测试编码 `FEE_CHROME_1777206927570`，直接查询 Neon 确认 `remark = phase5b-chrome-update`、`status = disabled`、`unit_price = 4.5600` 已落库。
- 清理 Chrome MCP 测试记录后，`remaining = 0`。
- 本阶段不需要修改 Neon schema；`ex_expense_items` 已覆盖本轮 create/update 字段，`delete` 因无 `deletedAt` 字段继续保持显式 405 策略响应。

### Phase5B 验证记录

- [x] `pnpm -F @01s-11comm/admin exec vitest run src/api/property-manage/expense-manage/house-charge/tests src/api/property-manage/expense-manage/expense-item-setting/tests`：2 个文件、7 个测试通过。
- [x] `pnpm -F @01s-11comm/admin typecheck`：通过。
- [x] `pnpm -F @01s-11comm/api test -- tests/admin/expense-manage-phase5a.test.ts`：通过，并覆盖 api 当前测试集合 15 个文件、54 个测试。
- [x] `pnpm -F @01s-11comm/api run verify:phase5`：12 个文件、46 个测试通过，随后 `typecheck` 与 `build:node` 通过。
- [x] `pnpm -F @01s-11comm/type typecheck`：通过。
- [x] 禁用模式扫描：`"h3"` 直导、auth/token/Authorization、`apps/api` 内 schema 定义均无命中。
- [x] 受保护目录校验：`apps/admin/server`、`apps/app/server`、`D:\code\ruan-cat\01s-11comm-app` 均存在，且未出现删除、移动、重命名状态。
- [x] `git diff --check`：通过。
- [x] `pnpm run ci`：4 个 workspace build 任务通过。

### houseCharge 浏览器/Neon 只读验收记录

- [x] 浏览器打开 `propertyManage.expenseManage.houseCharge` 页面，确认列表查询与详情回显命中 `/api-shadow/api/property-manage/expense-manage/house-charge/**`。
  - Chrome MCP 页面：`http://127.0.0.1:8080/#/property-manage/expense-manage/house-charge`。
  - `house-charge/list` 返回 `status = 200`、`success = true`、`total = 3`。
  - `house-charge/detail` 使用列表首行 `id = 40bb4956-6eaa-5bae-b84f-ba535402473d` 查询，返回 `status = 200`、`success = true`、`expenseItem = 住宅物业服务费`。
- [x] 点击新增、编辑、删除入口，确认页面只提示待实现或策略未确认，不调用 `create/update/delete` hook，不产生写请求，不伪造成功状态。
  - Chrome MCP 页面按钮包含 `添加`、`修改`、`详情`、`删除`。
  - 点击 `添加`、`修改`、`删除` 后，浏览器资源请求中没有 `house-charge/create`、`house-charge/update`、`house-charge/delete`。
- [x] 使用 Neon 只读查询复核列表/详情返回数据来源，不创建、不更新、不删除任何 `ex_house_charges` 数据。
  - 只读查询 `ex_house_charges`，确认 `id = 40bb4956-6eaa-5bae-b84f-ba535402473d` 存在。
  - Neon 返回 `house_id = f6c72125-bd2e-5038-a5dd-394fff49851d`、`expense_item = 住宅物业服务费`、`receivable_amount = 300.00`、`received_amount = 0.00`、`billing_period = 2024-01`、`status = paid`。

## Phase5 完成结论 / 可进入 Phase6

Phase5 已完成当前计划内的后台标准 API 迁移、Phase5B admin hook 与页面消费联调、`/api-shadow` 独立 Nitro dev proxy 验证、`expenseItemSetting` 的真实 Neon create/update 落库与清理验证，以及 `houseCharge` 的浏览器列表/详情、pending/blocked 入口和 Neon 只读验收记录。当前 Phase5 门禁已满足，可以进入 Phase6 切流准备。

`houseCharge` 本轮只确认列表、详情与字段归属边界；新增、编辑、删除前端入口允许保留为待实现坐标，写接口继续标记为 `pending/blocked`。当前不接 `create/update/delete` hook，不发送写请求，不提交假数据，不伪造成功，也不得把收费项目配置字段写入 `exHouseCharges`。`houseCharge` 写接口应拆为未来独立任务处理；Phase6 不得把 `houseCharge` 写操作视为已完成能力。

## 通过/失败门禁

Wave 5A 只有同时满足以下条件才算通过：

1. `Wave 5A 字段归属矩阵` 已经复核，且写接口涉及的 `contract-review-required`、`blocked-schema-review`、`blocked-contract-review` 行都有明确处理结论。
2. `houseCharge` 没有把收费项目配置字段写入 `exHouseCharges`。
3. `expenseItemSetting` CRUD 使用 `exExpenseItems` 和 `@01s-11comm/type` 导出的 Zod schema。
4. 每个新增后台 route 都返回 `JsonVO<T>` 或 `JsonVO<PageDTO<T>>`。
5. 每个新增 route handler 都能在 adapter 抛错时返回 `adminFailure`。
6. 没有任何 H3 helper 从 `"h3"` 导入。
7. 没有新增 auth、JWT、Token、Neon Auth、Bearer 或 Authorization 逻辑。
8. 没有在 `apps/api` 中定义 schema。
9. 受保护目录仍然存在，且没有删除、移动、重命名状态。
10. 定向测试、`verify:phase5`、typecheck、build、完整 CI 和 `git diff --check` 均通过。

任何一项不满足，Wave 5A 即失败。失败时必须停止扩展范围，在本计划中记录失败命令、失败文件和失败原因，修复对应层级后重新运行匹配验证命令。

## 后续波次

Wave 5A 通过后，按以下顺序选择后续 Phase5 波次：

1. `propertyManage.expenseManage.meterReadingType`、`discountType`、`discountSetting`：配置型 CRUD。
2. `propertyManage.expenseManage.vehicleCharge`、`contracteCharge`：收费实体 CRUD。
3. `propertyManage.expenseManage.paymentReview`、`refundReview`、`cancelFee`：审核与状态流 action。
4. `propertyManage.housePropertyManage.house`、`ownerInformation`、`ownerMember`：房屋与业主基础数据。
5. `propertyManage.parkingManage.ownerVehicle`、`carportInfo`、`parkingLot`：停车基础数据。
6. `propertyManage.repairsManage.*`：只有在 repair DB adapter 和状态流评审计划完成后再推进。

每个后续波次都必须创建或扩展自己的字段归属矩阵和通过/失败门禁。不得把 Wave 5A 的完成视为批量生成全部剩余 CRUD 文件的许可。
