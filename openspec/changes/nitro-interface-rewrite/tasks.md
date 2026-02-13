# 任务清单：Nitro 接口重写与类型统一实施计划

## 1. 统一规范基线与技能引用 (Baseline)

### 1.1 必学技能清单与使用边界

- nitro-api-development：所有 Nitro Handler 写法与返回结构必须以该技能为准。**[v2.0 更新：必须使用 JsonVO 类型注解约束]**
- type-project-organization：所有 `apps/type` 组织与导出必须以该技能为准。
- project-schema-registry：Schema 设计必须遵循 Trinity Pattern 与业务路径规范。
- schema-and-seed-guardian：涉及 Schema 新增/修改时必须遵循该技能规则。
- neon-db-list：确认 Neon 表名、表数量与来源时必须核对清单。
- project-migration-guide：影子迁移与回滚策略必须遵循该技能。
- code-style：文档与代码风格约束遵循该技能。

### 1.2 规范裁决与统一基线

- API 编写规范裁决：以 nitro-api-development 的 defineHandler 与 nitro/h3 导入为唯一标准。
- **[v2.0 更新] JsonVO 类型注解裁决**：所有 API 响应变量必须使用 `JsonVO<T>` 类型注解，TypeScript 编译器将严格检查字段结构。
- **[v2.0 更新] 响应字段裁决**：统一使用 `message` 字段（不是 `msg`），统一使用 `success` 字段。
- **[v2.0 更新] 错误响应裁决**：catch 块必须返回包含 `error` 和 `stack` 字段的 JsonVO<null> 格式。
- Schema 与类型裁决：以 project-schema-registry 与 type-project-organization 为唯一标准。
- 数据库表与依赖裁决：以 neon-db-list 为唯一参考清单。
- 迁移策略裁决：以 project-migration-guide 的影子迁移策略为唯一标准。

### 1.3 业务映射表与依赖校验

- 在开始每个模块前，必须确认对应表已存在于 `apps/type/src/business/**/schema.ts`，并能在 neon-db-list 中定位来源表名。
- 试点模块映射表（后续批量迁移以此格式扩展）：

|             业务路径              |                  API 路径                   |                            Schema 文件                             |  Drizzle 表名  |
| :-------------------------------: | :-----------------------------------------: | :----------------------------------------------------------------: | :------------: |
| dev-team/config-manage/dictionary | /api/dev-team/config-manage/dictionary/list | apps/type/src/business/dev-team/config-manage/dictionary/schema.ts | dtDictionaries |
|    dev-team/config-manage/type    |    /api/dev-team/config-manage/type/list    |    apps/type/src/business/dev-team/config-manage/type/schema.ts    | dtConfigTypes  |
|    dev-team/config-manage/item    |    /api/dev-team/config-manage/item/list    |    apps/type/src/business/dev-team/config-manage/item/schema.ts    | dtConfigItems  |

### 1.4 错误处理与事务使用标准

- 所有写表接口必须使用 `handleDbError` 统一错误出口，至少覆盖 23505/23503/23502。
- 多表写入、金额计算、库存/余额扣减、跨表一致性要求的写操作必须使用事务。
- 单表读写且无强一致性依赖的操作可不使用事务。
- 返回结构统一为 JsonVO / PageDTO 风格，字段使用 `code`、`msg`、`data`。

### 1.5 Handler 写法与验证基线 (v2.0 更新)

- 统一使用 `defineHandler` 与 `nitro/h3` 导入。
- 禁止 `defineEventHandler` 与 `h3` 导入。
- [v2.0 更新] 所有入参必须通过 `readBody + schema.parse` 或 `readValidatedBody` + Zod Schema 校验。
- [v2.0 更新] **必须**使用 `JsonVO<T>` 类型注解约束响应变量。
- [v2.0 更新] 响应必须使用 `message` 字段（不是 `msg`）。
- [v2.0 更新] Insert 操作必须使用 `as unknown as NewX` 类型回填。
- [v2.0 更新] catch 块必须返回包含 `error` 字段的 `JsonVO<null>` 格式错误响应。

### 1.6 规范与技能同步 (Docs & Skills Sync)

- [x] nitro-db-integration 规范补充 readValidatedBody 类型回填指引。
- [x] nitro-api-development 技能补充类型回填约束与示例。
- [x] project-schema-registry 技能补充 Insert 类型回填提示。

### 1.7 v2.0 新增验收标准 (v2.0 New Requirements)

- [v2.0 新增] **JsonVO 类型注解**：所有 API Handler 的响应变量必须使用 `JsonVO<T>` 类型注解。
  - 列表接口：`JsonVO<PageDTO<(typeof data)[number]>>`
  - 单条数据接口：`JsonVO<typeof result>`
  - 删除/错误响应：`JsonVO<null>`
- [v2.0 新增] **响应字段规范**：统一使用 `message`（不是 `msg`）和 `success` 字段。
- [v2.0 新增] **错误响应规范**：catch 块必须返回包含 `error` 字段的错误响应，生产环境可选择包含 `stack`。
- [v2.0 新增] **类型回填规范**：Insert 操作必须使用 `as unknown as NewX` 模式回填类型。

## 2. 基础设施与环境准备 (Infrastructure)

- [ ] 2.1 **升级 `apps/type` 运行时依赖**
  - 进入 `apps/type` 目录。
  - 运行命令：`pnpm add drizzle-orm zod drizzle-zod`。
  - 运行命令：`pnpm add -D typescript @types/node` (确保开发环境正常)。
  - 检查 `package.json`，确保 `main` 指向 `src/index.ts` (或构建后的 dist)，且 `exports` 配置正确支持 ESM 导入。
- [ ] 2.2 **配置 `apps/admin` 消费端环境**
  - 进入 `apps/admin` 目录。
  - 运行命令：`pnpm add zod`（确保前端有明确的 Zod 依赖）。
  - 修改 `apps/admin/drizzle.config.ts`：更新 `schema` 字段，指向 `../../apps/type/src/**/*.ts`（跨项目引用源码）。
- [ ] 2.3 **构建服务端核心工具**
  - 创建文件 `apps/admin/server/utils/handle-db-error.ts`。
  - 实现 `handleDbError` 函数，包含 Postgres 错误码 (23505, 23503) 的映射逻辑。
  - 创建文件 `apps/admin/server/utils/zod.ts` (可选)，封装 `h3-zod` 或类似的验证辅助函数（如果决定不使用 h3 内置的 readValidatedBody）。

## 3. 单元测试与验证 (Unit Testing)

- [ ] 3.1 **测试错误处理工具**
  - 创建 `apps/admin/server/utils/handle-db-error.test.ts`。
  - 使用 Vitest 编写测试用例。
  - 模拟 Postgres Error 23505，断言 `handleDbError` 抛出了状态码 409 的 H3Error。
  - 模拟 Postgres Error 23503，断言抛出状态码 400。

## 4. 试点策略与批量迁移节奏 (Pilot & Batch)

### 4.1 试点选择与目标

- 试点范围限定为 dev-team/config-manage 下的 dictionary/type/item 三个模块。
- 试点目标：验证 Schema → Zod → API → 前端联动的闭环可行性。

### 4.2 试点验收标准

- [v2.0 新增] 试点模块接口响应变量使用 `JsonVO<T>` 类型注解约束。
- [v2.0 新增] 试点模块响应使用 `message` 字段（不是 `msg`）。
- [v2.0 新增] 试点模块错误响应包含 `error` 和 `stack` 字段。
- [v2.0 新增] 试点模块 Insert 操作使用 `as unknown as NewX` 类型回填。
- 试点模块接口返回结构统一为 JsonVO/PageDTO。
- 试点模块所有入参均通过 Zod 校验。
- 试点模块能以真实数据库返回数据，不再读取 mock-data.ts。

### 4.3 批量迁移节奏与依赖校验

- 批量迁移顺序：dev-team → operation-team → property-manage → setting-manage。
- 每个模块迁移前必须完成业务映射表补充与表存在性校验。

### 4.4 回滚策略

- 若试点失败，保留原接口文件并恢复 mock-data.ts 引用。
- 若批量阶段失败，停止新模块迁移，保留已通过验收模块，回滚未验收模块。

### 4.5 旧 Interface 影子迁移策略

- 旧 Interface 暂不删除，统一改为新 Schema 类型的别名。
- 前端改造采用模块级替换策略，完成一个模块后才允许删除其旧 Interface。
- 全部模块替换完成后，再统一清理旧 Interface。

## 5. Schema 迁移与 API 重写 - 核心模块 (Core Modules)

### 5.1 字典管理 (dev-team/config-manage/dictionary)

- [ ] 5.1.1 **Schema define**: 创建 `apps/type/src/business/dev-team/config-manage/dictionary/schema.ts`
  - 定义 `sm_dictionary` 表结构。
  - 定义 Zod Schema: `insertDictionarySchema`, `selectDictionarySchema`, `updateDictionarySchema`, `searchDictionarySchema`。
  - 包含 Date 类型的 `z.coerce.date()` 处理。
- [ ] 5.1.2 **Schema export**: 更新 `apps/type/src/business/dev-team/config-manage/dictionary/index.ts`
  - 导出 `schema.ts` 内容。
  - 添加影子导出: `export type DictionaryItem = Dictionary;`。
- [ ] 5.1.3 **API Rewrite**: 重写 `apps/admin/server/api/dev-team/config-manage/dictionary/list.post.ts` (或 list.get.ts)
  - [x] 引入 `db` 并实现真实分页查询。
  - [ ] 删除 `mock-data.ts`。
- [ ] 5.1.4 **API Create**: 创建/重写 `create.post.ts`
  - [x] 已创建 `create.post.ts` 并完成基础校验。
  - [x] 实现 `readValidatedBody` 和 `insertDictionarySchema`。
- [x] 5.1.5 **API Update**: 重写 `update.post.ts`
  - [x] 使用 `readValidatedBody` 和 `updateDictionarySchema`。
- [x] 5.1.6 **API Detail**: 重写 `detail.get.ts`
  - [x] 使用 `getRouterParam` 与 `selectDictionarySchema`。
- [x] 5.1.7 **API Delete**: 重写 `delete.post.ts`
  - [x] 使用 `readValidatedBody` 与 `deleteDictionarySchema`。

### 5.2 配置项管理 (dev-team/config-manage/item)

- [ ] 5.2.1 **Schema define**: 创建 `apps/type/src/business/dev-team/config-manage/item/schema.ts`
- [ ] 5.2.2 **Schema export**: 更新 `apps/type/src/business/dev-team/config-manage/item/index.ts`
- [ ] 5.2.3 **API Rewrite**: 重写 `apps/admin/server/api/dev-team/config-manage/item/list.post.ts`
  - [x] 已重写为真实查询与分页。
  - [ ] 删除 `mock-data.ts`。
- [x] 5.2.4 **API Create**: 重写 `create.post.ts`
  - [x] 使用 `readValidatedBody` 和 `insertConfigItemSchema`。
- [x] 5.2.5 **API Update**: 重写 `update.post.ts`
  - [x] 使用 `readValidatedBody` 和 `updateConfigItemSchema`。
- [x] 5.2.6 **API Detail**: 重写 `detail.get.ts`
  - [x] 使用 `getRouterParam` 与 `selectConfigItemSchema`。
- [x] 5.2.7 **API Delete**: 重写 `delete.post.ts`
  - [x] 使用 `readValidatedBody` 与 `deleteConfigItemSchema`。

### 5.3 配置类型管理 (dev-team/config-manage/type)

- [ ] 5.3.1 **Schema define**: 创建 `apps/type/src/business/dev-team/config-manage/type/schema.ts`
- [ ] 5.3.2 **Schema export**: 更新 `apps/type/src/business/dev-team/config-manage/type/index.ts`
- [ ] 5.3.3 **API Rewrite**: 重写 `apps/admin/server/api/dev-team/config-manage/type/list.post.ts`
  - [x] 已重写为真实查询与分页。
  - [ ] 删除 `mock-data.ts`。
- [x] 5.3.4 **API Create**: 重写 `create.post.ts`
  - [x] 使用 `readValidatedBody` 和 `insertConfigTypeSchema`。
- [x] 5.3.5 **API Update**: 重写 `update.post.ts`
  - [x] 使用 `readValidatedBody` 和 `updateConfigTypeSchema`。
- [x] 5.3.6 **API Detail**: 重写 `detail.get.ts`
  - [x] 使用 `getRouterParam` 与 `selectConfigTypeSchema`。
- [x] 5.3.7 **API Delete**: 重写 `delete.post.ts`
  - [x] 使用 `readValidatedBody` 与 `deleteConfigTypeSchema`。

### 5.4 缓存管理 (dev-team/cache-manage)

- [ ] 5.4.1 **Schema define**: 创建 `apps/type/src/business/dev-team/cache-manage/refresh-cache/schema.ts`
- [ ] 5.4.2 **Schema export**: 更新 `apps/type/src/business/dev-team/cache-manage/refresh-cache/index.ts`
- [ ] 5.4.3 **API Rewrite**: 重写 `apps/admin/server/api/dev-team/cache-manage/refresh-cache/list.post.ts`
  - 删除 `mock-data.ts`。

### 5.5 菜单管理 (dev-team/menu-manage)

- [ ] 5.5.1 **Catalog**: 重写 `catalog/list.post.ts`
  - Schema: `apps/type/src/business/dev-team/menu-manage/catalog/schema.ts`
- [ ] 5.5.2 **Group**: 重写 `group/list.post.ts`
  - Schema: `apps/type/src/business/dev-team/menu-manage/group/schema.ts`
- [ ] 5.5.3 **Item**: 重写 `item/list.post.ts`
  - Schema: `apps/type/src/business/dev-team/menu-manage/item/schema.ts`

### 5.6 配置中心 (dev-team/config-manage/center)

- [ ] 5.6.1 **Schema define**: 创建 `apps/type/src/business/dev-team/config-manage/center/schema.ts`
- [ ] 5.6.2 **API Rewrite**: 重写 `apps/admin/server/api/dev-team/config-manage/center/list.post.ts`
  - [x] 已重写为真实查询与分页。
  - [ ] 删除 `mock-data.ts`。
- [x] 5.6.3 **API Create**: 重写 `create.post.ts`
  - [x] 使用 `readValidatedBody` 和 `insertConfigSchema`。
- [x] 5.6.4 **API Update**: 重写 `update.post.ts`
  - [x] 使用 `readValidatedBody` 和 `updateConfigSchema`。
- [x] 5.6.5 **API Detail**: 重写 `detail.get.ts`
  - [x] 使用 `getRouterParam` 与 `selectConfigSchema`。
- [x] 5.6.6 **API Delete**: 重写 `delete.post.ts`
  - [x] 使用 `readValidatedBody` 与 `deleteConfigSchema`。

## 6. Schema 迁移与 API 重写 - 运营团队 (Operation Team)

### 6.1 数据管理 (operation-team/data-manage)

- [ ] 6.1.1 **Community Info**: 重写 `community-information/list.post.ts`
  - Schema: `apps/type/src/business/operation-team/data-manage/community-information/schema.ts`
- [ ] 6.1.2 **Property Company**: 重写 `property-company/list.post.ts`
  - Schema: `apps/type/src/business/operation-team/data-manage/property-company/schema.ts`
- [ ] 6.1.3 **Prop Mgmt Company**: 重写 `property-management-company/list.post.ts`
  - Schema: `apps/type/src/business/operation-team/data-manage/property-management-company/schema.ts`

### 6.2 商户管理 (operation-team/merchant-manage)

- [ ] 6.2.1 **Merchant Admin**: 重写 `merchant-admin/list.post.ts`
  - Schema: `apps/type/src/business/operation-team/merchant-manage/merchant-admin/schema.ts`
- [ ] 6.2.2 **Merchant Info**: 重写 `merchant-info/list.post.ts`
  - Schema: `apps/type/src/business/operation-team/merchant-manage/merchant-info/schema.ts`

### 6.3 报表配置 (operation-team/report-configuration)

- [ ] 6.3.1 **Report Component**: 重写 `report-component/list.post.ts`
  - Schema: `apps/type/src/business/operation-team/report-configuration/report-component/schema.ts`
- [ ] 6.3.2 **Report Group**: 重写 `report-group/list.post.ts`
  - Schema: `apps/type/src/business/operation-team/report-configuration/report-group/schema.ts`
- [ ] 6.3.3 **Report Info**: 重写 `report-info/list.post.ts`
  - Schema: `apps/type/src/business/operation-team/report-configuration/report-info/schema.ts`

### 6.4 系统管理 (operation-team/system-manage)

- [ ] 6.4.1 **Change Password**: 重写 `change-password/list.post.ts` (注意：这是写操作，需特殊处理)
  - Schema: `apps/type/src/business/operation-team/system-manage/change-password/schema.ts`
- [ ] 6.4.2 **Community Config**: 重写 `community-configuration/list.post.ts`
  - Schema: `apps/type/src/business/operation-team/system-manage/community-configuration/schema.ts`
- [ ] 6.4.3 **Initialize Cell**: 重写 `initialize-cell/list.post.ts`
  - Schema: `apps/type/src/business/operation-team/system-manage/initialize-cell/schema.ts`
- [ ] 6.4.4 **Register Protocol**: 重写 `register-protocol/list.post.ts`
  - Schema: `apps/type/src/business/operation-team/system-manage/register-protocol/schema.ts`
- [ ] 6.4.5 **System Config**: 重写 `system-config/list.post.ts`
  - Schema: `apps/type/src/business/operation-team/system-manage/system-config/schema.ts`

## 7. Schema 迁移与 API 重写 - 物业管理 (Property Manage)

### 7.1 社区管理 (property-manage/community-manage)

- [ ] 7.1.1 **Building Space**: 重写 `building-space-structure-diagram/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/community-manage/building-space-structure-diagram/schema.ts`
- [ ] 7.1.2 **Handing Business**: 重写 `handing-business/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/community-manage/handing-business/schema.ts`
- [ ] 7.1.3 **House Decoration**: 重写 `house-decoration/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/community-manage/house-decoration/schema.ts`
- [ ] 7.1.4 **My**: 重写 `my/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/community-manage/my/schema.ts`
- [ ] 7.1.5 **Notice**: 重写 `notice/list.post.ts` (新增)
  - Schema: `apps/type/src/business/property-manage/community-manage/notice/schema.ts`
- [ ] 7.1.6 **Property Register**: 重写 `property-register/list.post.ts` (新增)
  - Schema: `apps/type/src/business/property-manage/community-manage/property-register/schema.ts`
- [ ] 7.1.7 **Parking Diagram**: 重写 `parking-space-structure-diagram/list.post.ts` (新增)
  - Schema: `apps/type/src/business/property-manage/community-manage/parking-space-structure-diagram/schema.ts`

### 7.2 合同管理 (property-manage/contract-manage) (新增)

- [ ] 7.2.1 **Change**: 重写 `change/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/contract-manage/change/schema.ts`
- [ ] 7.2.2 **Draft**: 重写 `draft-contract/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/contract-manage/draft-contract/schema.ts`
- [ ] 7.2.3 **Expire**: 重写 `expire/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/contract-manage/expire/schema.ts`
- [ ] 7.2.4 **First Party**: 重写 `first-party/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/contract-manage/first-party/schema.ts`
- [ ] 7.2.5 **Type**: 重写 `type/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/contract-manage/type/schema.ts`

### 7.3 费用管理 (property-manage/expense-manage)

此模块涉及金额计算，需特别注意 Decimal 类型处理。

- [ ] 7.3.1 **Cancel Fee**: 重写 `cancel-fee/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/expense-manage/cancel-fee/schema.ts`
- [ ] 7.3.2 **Contracte Charge**: 重写 `contracte-charge/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/expense-manage/contracte-charge/schema.ts`
- [ ] 7.3.3 **Discount Apply**: 重写 `discount-apply/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/expense-manage/discount-apply/schema.ts`
- [ ] 7.3.4 **Discount Setting**: 重写 `discount-setting/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/expense-manage/discount-setting/schema.ts`
- [ ] 7.3.5 **Discount Type**: 重写 `discount-type/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/expense-manage/discount-type/schema.ts`
- [ ] 7.3.6 **Expense Item**: 重写 `expense-item-setting/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/expense-manage/expense-item-setting/schema.ts`
- [ ] 7.3.7 **Expense Summary**: 重写 `expense-summary-table/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/expense-manage/expense-summary-table/schema.ts`
- [ ] 7.3.8 **House Charge**: 重写 `house-charge/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/expense-manage/house-charge/schema.ts`
- [ ] 7.3.9 **Meter Reading Type**: 重写 `meter-reading-type/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/expense-manage/meter-reading-type/schema.ts`
- [ ] 7.3.10 **Overdue Info**: 重写 `overdue-payment-information/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/expense-manage/overdue-payment-information/schema.ts`
- [ ] 7.3.11 **Payment Review**: 重写 `payment-review/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/expense-manage/payment-review/schema.ts`
- [ ] 7.3.12 **Refund Review**: 重写 `refund-review/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/expense-manage/refund-review/schema.ts`
- [ ] 7.3.13 **Reminder**: 重写 `reminder-for-overdue-payments/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/expense-manage/reminder-for-overdue-payments/schema.ts`
- [ ] 7.3.14 **Reprint Voucher**: 重写 `reprint-voucher/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/expense-manage/reprint-voucher/schema.ts`
- [ ] 7.3.15 **Vehicle Charge**: 重写 `vehicle-charge/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/expense-manage/vehicle-charge/schema.ts`
- [ ] 7.3.16 **Water & Elec**: 重写 `water-and-electricity-meter-reading/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/expense-manage/water-and-electricity-meter-reading/schema.ts`

### 7.4 房产管理 (property-manage/house-property-manage)

- [ ] 7.4.1 **House**: 重写 `house/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/house-property-manage/house/schema.ts`
- [ ] 7.4.2 **Invoice**: 重写 `invoice/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/house-property-manage/invoice/schema.ts`
- [ ] 7.4.3 **Invoice Title**: 重写 `invoice-title/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/house-property-manage/invoice-title/schema.ts`
- [ ] 7.4.4 **Owner Account**: 重写 `owner-account/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/house-property-manage/owner-account/schema.ts`
- [ ] 7.4.5 **Owner Info**: 重写 `owner-information/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/house-property-manage/owner-information/schema.ts`
- [ ] 7.4.6 **Owner Member**: 重写 `owner-member/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/house-property-manage/owner-member/schema.ts`
- [ ] 7.4.7 **Owners Committee**: 重写 `owners-committee/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/house-property-manage/owners-committee/schema.ts`
- [ ] 7.4.8 **Reserve Venue**: 重写 `reserve-venue/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/house-property-manage/reserve-venue/schema.ts`
- [ ] 7.4.9 **Reserve Order**: 重写 `reserve-venue-order/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/house-property-manage/reserve-venue-order/schema.ts`
- [ ] 7.4.10 **Site Mgmt**: 重写 `site-management/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/house-property-manage/site-management/schema.ts`

### 7.5 停车管理 (property-manage/parking-manage)

- [ ] 7.5.1 **Carport Apply**: 重写 `carport-apply/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/parking-manage/carport-apply/schema.ts`
- [ ] 7.5.2 **Carport Info**: 重写 `carport-info/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/parking-manage/carport-info/schema.ts`
- [ ] 7.5.3 **Owner Vehicle**: 重写 `owner-vehicle/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/parking-manage/owner-vehicle/schema.ts`
- [ ] 7.5.4 **Parking Lot**: 重写 `parking-lot/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/parking-manage/parking-lot/schema.ts`

### 7.6 巡逻管理 (property-manage/patrol-manage)

- [ ] 7.6.1 **Detail**: 重写 `detail/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/patrol-manage/detail/schema.ts`
- [ ] 7.6.2 **Item**: 重写 `item/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/patrol-manage/item/schema.ts`
- [ ] 7.6.3 **Path**: 重写 `path/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/patrol-manage/path/schema.ts`
- [ ] 7.6.4 **Plan**: 重写 `plan/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/patrol-manage/plan/schema.ts`
- [ ] 7.6.5 **Point**: 重写 `point/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/patrol-manage/point/schema.ts`
- [ ] 7.6.6 **Task**: 重写 `task/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/patrol-manage/task/schema.ts`

### 7.7 报修管理 (property-manage/repairs-manage)

- [ ] 7.7.1 **Issues**: 重写 `issues/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/repairs-manage/issues/schema.ts`
- [ ] 7.7.2 **Mandatory**: 重写 `mandatory-return-issue/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/repairs-manage/mandatory-return-issue/schema.ts`
- [ ] 7.7.3 **Phone Report**: 重写 `phone-report-repairs/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/repairs-manage/phone-report-repairs/schema.ts`
- [ ] 7.7.4 **Have Done**: 重写 `repairs-have-done/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/repairs-manage/repairs-have-done/schema.ts`
- [ ] 7.7.5 **Setting**: 重写 `repairs-setting/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/repairs-manage/repairs-setting/schema.ts`
- [ ] 7.7.6 **Todo**: 重写 `repairs-todo/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/repairs-manage/repairs-todo/schema.ts`
- [ ] 7.7.7 **Return Visit**: 重写 `return-visit/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/repairs-manage/return-visit/schema.ts`

### 7.8 报表管理 (property-manage/report-manage)

此模块需注意复杂聚合查询 (Aggregation) 的实现。

- [ ] 7.8.1 **Arrears**: 重写 `arrears-details-list/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/report-manage/arrears-details-list/schema.ts`
- [ ] 7.8.2 **Statistics**: 重写 `data-statistics/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/report-manage/data-statistics/schema.ts`
- [ ] 7.8.3 **Deposit**: 重写 `deposit-report/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/report-manage/deposit-report/schema.ts`
- [ ] 7.8.4 **Summary**: 重写 `expense-summary-table/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/report-manage/expense-summary-table/schema.ts`
- [ ] 7.8.5 **Fee Reminder**: 重写 `fee-reminder/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/report-manage/fee-reminder/schema.ts`
- [ ] 7.8.6 **No Charge**: 重写 `no-charge-house/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/report-manage/no-charge-house/schema.ts`
- [ ] 7.8.7 **Outstanding**: 重写 `outstanding-fees-analysis/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/report-manage/outstanding-fees-analysis/schema.ts`
- [ ] 7.8.8 **Owner Payment**: 重写 `owner-payment-details/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/report-manage/owner-payment-details/schema.ts`
- [ ] 7.8.9 **Patrol Report**: 重写 `patrol-report/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/report-manage/patrol-report/schema.ts`
- [ ] 7.8.10 **Payment Form**: 重写 `payment-details-form/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/report-manage/payment-details-form/schema.ts`
- [ ] 7.8.11 **Repair Form**: 重写 `repair-report-form/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/report-manage/repair-report-form/schema.ts`
- [ ] 7.8.12 **Repair Summary**: 重写 `repair-reports-summary-table/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/report-manage/repair-reports-summary-table/schema.ts`
- [ ] 7.8.13 **Statement**: 重写 `statement-expenses/list.post.ts`
  - Schema: `apps/type/src/business/property-manage/report-manage/statement-expenses/schema.ts`

## 8. Schema 迁移与 API 重写 - 设置管理 (Setting Manage)

### 8.1 组织管理 (organize-manage)

此模块涉及权限树 (Tree) 和 RBAC 逻辑。

- [ ] 8.1.1 **Data Permission**: 重写 `data-permission/list.post.ts`
  - Schema: `apps/type/src/business/setting-manage/organize-manage/data-permission/schema.ts`
- [ ] 8.1.2 **Org Info**: 重写 `org-info/list.post.ts` & `tree.post.ts`
  - Schema: `apps/type/src/business/setting-manage/organize-manage/org-info/schema.ts`
- [ ] 8.1.3 **Role Permission**: 重写 `role-permission/list.post.ts`
  - Schema: `apps/type/src/business/setting-manage/organize-manage/role-permission/schema.ts`
- [ ] 8.1.4 **Scheduling**: 重写 `scheduling-setting/list.post.ts`
  - Schema: `apps/type/src/business/setting-manage/organize-manage/scheduling-setting/schema.ts`
- [ ] 8.1.5 **Shift**: 重写 `shift-setting/list.post.ts`
  - Schema: `apps/type/src/business/setting-manage/organize-manage/shift-setting/schema.ts`
- [ ] 8.1.6 **Staff Info**: 重写 `staff-info/list.post.ts`
  - Schema: `apps/type/src/business/setting-manage/organize-manage/staff-info/schema.ts`
- [ ] 8.1.7 **Work Schedule**: 重写 `working-schedule/list.post.ts`
  - Schema: `apps/type/src/business/setting-manage/organize-manage/working-schedule/schema.ts`

### 8.2 系统配置 (system-manage)

- [ ] 8.2.1 **Change Password**: 重写 `change-password/list.post.ts`
  - Schema: `apps/type/src/business/setting-manage/system-manage/change-password/schema.ts`
- [ ] 8.2.2 **Community Config**: 重写 `community-configuration/list.post.ts`
  - Schema: `apps/type/src/business/setting-manage/system-manage/community-configuration/schema.ts`
- [ ] 8.2.3 **Init Cell**: 重写 `initialize-cell/list.post.ts`
  - Schema: `apps/type/src/business/setting-manage/system-manage/initialize-cell/schema.ts`
- [ ] 8.2.4 **Protocol**: 重写 `register-protocol/list.post.ts`
  - Schema: `apps/type/src/business/setting-manage/system-manage/register-protocol/schema.ts`
- [ ] 8.2.5 **Sys Config**: 重写 `system-config/list.post.ts`
  - Schema: `apps/type/src/business/setting-manage/system-manage/system-config/schema.ts`

## 9. 前端适配验证 (Frontend Verification)

- [ ] 9.1 **Dev Team 模块验证**
- [ ] 9.2 **Operation Team 模块验证**
- [ ] 9.3 **Property Manage 模块验证**
- [ ] 9.4 **Setting Manage 模块验证**
- [ ] 9.5 **全局 Type Check**: 运行 `pnpm build` (Skip Lib Check: false)，确保影子迁移策略生效，无类型错误。

## 10. 收尾与清理 (Cleanup)

- [ ] 10.1 **清理旧数据库 Schema**
  - 删除 `apps/admin/server/db/schemas` 目录。
- [ ] 10.2 **全项目搜索 Mock 数据**
  - 搜索字符串 `mock-data`，确保无残留引用。
- [ ] 10.3 **文档更新**
  - 更新项目 README，说明新的 Schema 架构。
