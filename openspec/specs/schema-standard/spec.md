# Schema Authoring Standard

本规范定义了 `apps/type` 中 `schema.ts` 文件的编写标准。所有新创建或迁移的 Schema 文件**必须**严格遵守此结构。

## Requirements

### Requirement: 三位一体模式编写规范 (Trinity Pattern Authoring Standard)

每个 `schema.ts` 文件 MUST 严格按照三部分结构编写: Part A (Database Table), Part B (Zod Runtime Schemas), Part C (TypeScript Types)。

文件 MUST 位于 `apps/type/src/business/<一级路由>/<二级路由>/schema.ts`。

导出变量 MUST 具有全局唯一性（带业务前缀），防止 Barrel Export 命名冲突。

#### Scenario: 命名规范

- **WHEN** 创建 OpMerchant 模块的 Schema 时
- **THEN** Table 变量命名为 `opMerchants`
- **AND** Insert Schema 命名为 `insertOpMerchantSchema`
- **AND** Select Schema 命名为 `selectOpMerchantSchema`
- **AND** Update Schema 命名为 `updateOpMerchantSchema`
- **AND** Select Type 命名为 `OpMerchant`
- **AND** Insert Type 命名为 `NewOpMerchant`
- **AND** Update Type 命名为 `UpdateOpMerchant`

### Requirement: Part A - Database Table Definition 规范

Part A MUST 使用 `primaryId()` 生成 UUID 主键，MUST 使用 `...timestamps` 展开时间戳字段。`pgEnum` MUST 在 `apps/type/src/common/enums.ts` 中集中定义以确保全局唯一性。外键引用 MUST 使用 `.references(() => otherTable.id)` 声明。

#### Scenario: 标准表定义

- **WHEN** 定义 `opMerchants` 表时
- **THEN** 使用 `pgTable("op_merchants", { ... })` 定义
- **AND** 主键使用 `id: primaryId()`
- **AND** 末尾展开 `...timestamps`
- **AND** 每个字段 MUST 有 JSDoc 注释说明用途

### Requirement: Part B - Insert Schema 规范

Insert Schema MUST 使用 `createInsertSchema()` 生成。字段细化 MUST 使用函数回调形式 `(schema) => schema.min(...)` 。MUST 使用 `.omit()` 排除 `id`、`createdAt`、`updatedAt` 等自动管理字段。

#### Scenario: 标准 Insert Schema

- **WHEN** 创建 Insert Schema 时
- **THEN** 使用 `createInsertSchema(table, { field: (schema) => schema.min(1) })` 形式
- **AND** MUST NOT 使用 `{ field: z.string().min(1) }` 直接传 Zod 对象形式（会导致类型不兼容）
- **AND** 使用 `.omit({ id: true, createdAt: true, updatedAt: true })` 排除自动管理字段

### Requirement: Part B - Select Schema 规范

Select Schema MUST 使用 `createSelectSchema()` 生成。MUST NOT 对返回值调用 `.extend()` 覆盖字段类型。

#### Scenario: 标准 Select Schema

- **WHEN** 创建 Select Schema 时
- **THEN** 直接使用 `createSelectSchema(table)` 无参数形式
- **AND** MUST NOT 调用 `.extend()` 覆盖日期字段类型（会触发 drizzle-zod 类型不兼容问题）

### Requirement: Part B - Update Schema 规范 (Hybrid Pattern)

Update Schema MUST 使用手动 `z.object()` 定义。MUST NOT 使用 `insertSchema.partial().extend()` 模式。

#### Scenario: 标准 Update Schema

- **WHEN** 创建 Update Schema 时
- **THEN** 使用 `z.object({...})` 手动定义
- **AND** `id` 字段为必填 `z.string().uuid()`
- **AND** `.notNull()` 字段标记为 `.optional()`
- **AND** 可空字段标记为 `.optional().nullable()`
- **AND** 枚举字段使用 `z.enum([...]).optional()`
- **AND** MUST NOT 使用类型断言 `as unknown as z.ZodTypeAny`

### Requirement: Part C - TypeScript Types 规范

Select/Insert 类型 MUST 使用 Drizzle 的 `$inferSelect` / `$inferInsert` 推导。Update 类型 MUST 使用 `z.infer` 从手动定义的 Update Schema 推导。MUST NOT 手动定义 Interface 替代推导类型。

#### Scenario: 标准类型推导

- **WHEN** 定义 TypeScript 类型时
- **THEN** Select 类型使用 `typeof table.$inferSelect`
- **AND** Insert 类型使用 `typeof table.$inferInsert`
- **AND** Update 类型使用 `z.infer<typeof updateSchema>`

### Requirement: 导出规范 (Index Re-exporting)

模块的 `index.ts` MUST 导出 `schema.ts` 的所有内容。MUST NOT 保留与新推导类型冲突的旧 interface 定义。

#### Scenario: 模块导出

- **WHEN** 在模块的 `index.ts` 中配置导出时
- **THEN** 使用 `export * from "./schema"` 全量导出
- **AND** MUST 删除或注释掉旧的手动 interface 定义
