# Schema Authoring Standard

本规范定义了 `apps/type` 中 `schema.ts` 文件的编写标准。所有新创建或迁移的 Schema 文件**必须**严格遵守此结构。

## ADDED Requirements

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

#### Scenario: 依赖引用

- **WHEN** 编写 `schema.ts` 文件时
- **THEN** MUST 从 `drizzle-orm/pg-core` 导入表定义工具
- **AND** MUST 从 `drizzle-zod` 导入 `createInsertSchema`, `createSelectSchema`
- **AND** MUST 从 `zod` 导入 `z`
- **AND** MUST 从 `@/common` 导入 `primaryId`, `timestamps`, `remarkField`, `statusEnum` 等通用辅助
- **AND** MUST NOT 引用 Node.js 特定模块 (fs, path, os) 或服务端数据库驱动

标准导入模板:

```typescript
import {
	index,
	pgTable,
	text,
	timestamp,
	varchar,
	integer,
	decimal,
	date,
	boolean,
	jsonb,
	uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { primaryId, timestamps, remarkField, statusEnum } from "@/common";
```

通用辅助函数 (定义在 `apps/type/src/common/helpers.ts`):

|    函数/常量    |     用途      |                   说明                    |
| :-------------: | :-----------: | :---------------------------------------: |
|  `primaryId()`  |   UUID 主键   | `uuid("id").defaultRandom().primaryKey()` |
|  `timestamps`   | 创建/更新时间 |         展开 `...timestamps` 使用         |
|  `softDelete`   |  软删除字段   |   `deletedAt: timestamp("deleted_at")`    |
| `remarkField()` |   备注字段    |             `text("remark")`              |

通用枚举 (定义在 `apps/type/src/common/enums.ts`):

|       枚举        |   用途    |                  值                   |
| :---------------: | :-------: | :-----------------------------------: |
|   `statusEnum`    | 启用/禁用 |       `["enabled", "disabled"]`       |
|   `genderEnum`    |   性别    |         `["male", "female"]`          |
| `auditStatusEnum` | 审核状态  | `["pending", "approved", "rejected"]` |

### Requirement: Part A - Database Table Definition 规范

Part A MUST 使用 `primaryId()` 生成 UUID 主键，MUST 使用 `...timestamps` 展开时间戳字段。`pgEnum` MUST 在 `apps/type/src/common/enums.ts` 中集中定义以确保全局唯一性。外键引用 MUST 使用 `.references(() => otherTable.id)` 声明。

#### Scenario: 标准表定义

- **WHEN** 定义 `opMerchants` 表时
- **THEN** 使用 `pgTable("op_merchants", { ... })` 定义
- **AND** 主键使用 `id: primaryId()`
- **AND** 末尾展开 `...timestamps`
- **AND** 每个字段 MUST 有 JSDoc 注释说明用途

示例:

```typescript
/** 商户信息表 */
export const opMerchants = pgTable(
	"op_merchants",
	{
		id: primaryId(),
		/** 商户名称 */
		merchantName: varchar("merchant_name", { length: 100 }).notNull(),
		/** 状态 */
		status: statusEnum("status").default("enabled"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("op_merchants_name_idx").on(table.merchantName)],
);
```

### Requirement: Part B - Insert Schema 规范

Insert Schema MUST 使用 `createInsertSchema()` 生成。字段细化 MUST 使用函数回调形式 `(schema) => schema.min(...)` 。MUST 使用 `.omit()` 排除 `id`、`createdAt`、`updatedAt` 等自动管理字段。

#### Scenario: 标准 Insert Schema

- **WHEN** 创建 Insert Schema 时
- **THEN** 使用 `createInsertSchema(table, { field: (schema) => schema.min(1) })` 形式
- **AND** MUST NOT 使用 `{ field: z.string().min(1) }` 直接传 Zod 对象形式（会导致类型不兼容）
- **AND** 使用 `.omit({ id: true, createdAt: true, updatedAt: true })` 排除自动管理字段

示例:

```typescript
export const insertOpMerchantSchema = createInsertSchema(opMerchants, {
	merchantName: (schema) => schema.min(1, "商户名称不能为空").max(100),
	merchantCode: (schema) => schema.min(1, "商户编码不能为空").max(50),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});
```

### Requirement: Part B - Select Schema 规范

Select Schema MUST 使用 `createSelectSchema()` 生成。MUST NOT 对返回值调用 `.extend()` 覆盖字段类型。

#### Scenario: 标准 Select Schema

- **WHEN** 创建 Select Schema 时
- **THEN** 直接使用 `createSelectSchema(table)` 无参数形式
- **AND** MUST NOT 调用 `.extend()` 覆盖日期字段类型（会触发 drizzle-zod 类型不兼容问题）

示例:

```typescript
export const selectOpMerchantSchema = createSelectSchema(opMerchants);
```

### Requirement: Part B - Update Schema 规范 (Hybrid Pattern)

Update Schema MUST 使用手动 `z.object()` 定义。MUST NOT 使用 `insertSchema.partial().extend()` 模式。这是经过实践验证的最佳方案，因为 `createInsertSchema()` 返回的 drizzle-zod 内部 ZodObject 变体在链式调用 `.partial().extend()` 后与标准 `z.ZodTypeAny` 不兼容。

#### Scenario: 标准 Update Schema

- **WHEN** 创建 Update Schema 时
- **THEN** 使用 `z.object({...})` 手动定义
- **AND** `id` 字段为必填 `z.string().uuid()`
- **AND** `.notNull()` 字段标记为 `.optional()`（更新时可不传，但传值时不能为 null）
- **AND** 可空字段标记为 `.optional().nullable()`（更新时可不传，也可设为 null）
- **AND** 枚举字段使用 `z.enum([...]).optional()` 而非 `z.string()`
- **AND** MUST NOT 使用类型断言 `as unknown as z.ZodTypeAny`

Update Schema 字段修饰符规则:

|     字段特征      |             Zod 修饰符              |               说明                |
| :---------------: | :---------------------------------: | :-------------------------------: |
|     主键 `id`     |         `z.string().uuid()`         |   **必填**，不加 `.optional()`    |
| `.notNull()` 字段 |            `.optional()`            | 更新时可不传，但传值时不能为 null |
|     可空字段      |      `.optional().nullable()`       |    更新时可不传，也可设为 null    |
|     枚举字段      |     `z.enum([...]).optional()`      |  使用 `z.enum` 而非 `z.string()`  |
|  JSON/JSONB 字段  |   `z.any().optional().nullable()`   |          或定义具体结构           |
|     数字字段      |    `z.number().int().optional()`    |          按实际类型使用           |
|     布尔字段      | `z.boolean().optional().nullable()` |     按表定义决定是否 nullable     |

示例:

```typescript
export const updateOpMerchantSchema = z.object({
	id: z.string().uuid(),
	merchantName: z.string().min(1, "商户名称不能为空").max(100).optional(),
	merchantCode: z.string().min(1, "商户编码不能为空").max(50).optional(),
	merchantType: z.string().max(50).optional().nullable(),
	status: z.enum(["enabled", "disabled"]).optional(),
	remark: z.string().optional().nullable(),
});
```

### Requirement: Part C - TypeScript Types 规范

Select/Insert 类型 MUST 使用 Drizzle 的 `$inferSelect` / `$inferInsert` 推导。Update 类型 MUST 使用 `z.infer` 从手动定义的 Update Schema 推导。MUST NOT 手动定义 Interface 替代推导类型。

#### Scenario: 标准类型推导

- **WHEN** 定义 TypeScript 类型时
- **THEN** Select 类型使用 `typeof table.$inferSelect`
- **AND** Insert 类型使用 `typeof table.$inferInsert`
- **AND** Update 类型使用 `z.infer<typeof updateSchema>`

|    类型     |            推导来源            |                  说明                   |
| :---------: | :----------------------------: | :-------------------------------------: |
| Select Type |  `typeof table.$inferSelect`   |   从 Drizzle Table 推导，包含所有字段   |
| Insert Type |  `typeof table.$inferInsert`   | 从 Drizzle Table 推导，排除自动生成字段 |
| Update Type | `z.infer<typeof updateSchema>` |         从手动 Zod Schema 推导          |

示例:

```typescript
export type OpMerchant = typeof opMerchants.$inferSelect;
export type NewOpMerchant = typeof opMerchants.$inferInsert;
export type UpdateOpMerchant = z.infer<typeof updateOpMerchantSchema>;
```

### Requirement: drizzle-zod 兼容性规范

在 `drizzle-zod@^0.8.x` + `zod@^3.24.x` 环境下，以下操作 MUST 遵守兼容性约束。

#### Scenario: 兼容性检查

- **WHEN** 使用 drizzle-zod 生成的 Schema 时
- **THEN** `createInsertSchema(table)` 安全可用
- **AND** `createInsertSchema(table, { field: (s) => s.min(1) })` 安全可用
- **AND** `insertSchema.omit({ id: true })` 安全可用
- **AND** `createSelectSchema(table)` 安全可用
- **AND** `insertSchema.partial().extend({...})` MUST NOT 使用（类型不兼容）
- **AND** `selectSchema.extend({...})` MUST NOT 使用（类型不兼容）
- **AND** `createInsertSchema(table, { field: z.string() })` MUST NOT 使用（需用函数回调）

兼容性速查表:

|                          操作                           | 是否安全 |     替代方案      |
| :-----------------------------------------------------: | :------: | :---------------: |
|               `createInsertSchema(table)`               |    ✅    |         -         |
| `createInsertSchema(table, { field: (s) => s.min(1) })` |    ✅    |         -         |
|            `insertSchema.omit({ id: true })`            |    ✅    |         -         |
|               `createSelectSchema(table)`               |    ✅    |         -         |
|         `insertSchema.partial().extend({...})`          |    ❌    | 手动 `z.object()` |
|              `selectSchema.extend({...})`               |    ❌    | 不覆盖，直接使用  |
|   `createInsertSchema(table, { field: z.string() })`    |    ❌    |   使用函数回调    |

### Requirement: 导出规范 (Index Re-exporting)

模块的 `index.ts` MUST 导出 `schema.ts` 的所有内容。MUST NOT 保留与新推导类型冲突的旧 interface 定义。

#### Scenario: 模块导出

- **WHEN** 在模块的 `index.ts` 中配置导出时
- **THEN** 使用 `export * from "./schema"` 全量导出
- **AND** MUST 删除或注释掉旧的手动 interface 定义

## Appendix: 完整 Schema 文件模板

```typescript
/**
 * @file 模块名 Schema
 * @description 定义模块相关的表结构，前缀 xx_
 * @module module-name
 */

import { index, pgTable, text, timestamp, varchar, integer, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { primaryId, timestamps, remarkField, statusEnum } from "@/common";

// ==========================================
// Part A: Database Table Definitions
// ==========================================

/** 示例表 */
export const xxItems = pgTable(
	"xx_items",
	{
		id: primaryId(),
		/** 名称 */
		name: varchar("name", { length: 100 }).notNull(),
		/** 描述 */
		description: text("description"),
		/** 状态 */
		status: statusEnum("status").default("enabled"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("xx_items_name_idx").on(table.name)],
);

// ==========================================
// Part B: Zod Runtime Schemas
// ==========================================

export const insertXxItemSchema = createInsertSchema(xxItems, {
	name: (schema) => schema.min(1, "名称不能为空").max(100),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectXxItemSchema = createSelectSchema(xxItems);

export const updateXxItemSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, "名称不能为空").max(100).optional(),
	description: z.string().optional().nullable(),
	status: z.enum(["enabled", "disabled"]).optional(),
	remark: z.string().optional().nullable(),
});

// ==========================================
// Part C: TypeScript Types
// ==========================================

export type XxItem = typeof xxItems.$inferSelect;
export type NewXxItem = typeof xxItems.$inferInsert;
export type UpdateXxItem = z.infer<typeof updateXxItemSchema>;
```
