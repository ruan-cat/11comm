# Schema Authoring Standard

本规范定义了 `apps/type` 中 `schema.ts` 文件的编写标准。所有新创建或迁移的 Schema 文件**必须**严格遵守此结构。

## 1. 文件位置 & 命名

- **Location**: `apps/type/src/business/<一级路由>/<二级路由>/schema.ts`
- **Export Naming**: 导出的变量必须具有**全局唯一性**（带业务前缀），防止在 Barrel Export 时发生命名冲突。

**命名示例**:

- Community 模块: `community` (Table), `insertCommunitySchema` (Zod), `NewCommunity` (Type)
- User 模块: `userInfo` (Table), `insertUserInfoSchema` (Zod), `NewUserInfo` (Type)
- _错误示例_: `export const table = ...` (所有模块都叫 table 就冲突了)

## 2. 依赖引用

禁止引用 Node.js 特定模块 (fs, path, os) 或服务端驱动。

```typescript
// ✅ Correct
import { pgTable, serial, text, timestamp, integer, pgEnum, json } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
```

## 3. 代码结构模板 (The Trinity Pattern)

### Part A: Database Table Definition

- **Enums**: `pgEnum` 的 name 必须全局唯一。建议统一在 `apps/type/src/common/enums.ts` 中定义，然后在 schema 中引用。
- **JSON Fields**: 必须在 Part B 中显式定义结构，否则 Zod 会推导为 `z.unknown()`。

```typescript
// ==========================================
// Part A: Database Table Definition
// ==========================================

// Import global enum if possible
// import { statusEnum } from "@/common/enums";

export const community = pgTable("community", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	config: json("config"), // JSON 字段
	createdAt: timestamp("created_at").defaultNow(),
});
```

### Part B: Zod Runtime Schemas

- **Date Handling**: 针对 API 返回 JSON 的场景（Date -> String），必须覆盖 `createdAt` 等日期字段的类型。
- **JSON Handling**: 必须使用 `.extend()` 或 `createSelectSchema` 的第二个参数来具体化 JSON 字段的结构。

```typescript
// ==========================================
// Part B: Zod Runtime Schemas
// ==========================================

// B1. Insert Schema (API Request Body)
export const insertCommunitySchema = createInsertSchema(community, {
	name: (schema) => schema.min(2, "Name too short").max(50),
	// Explicitly define JSON structure for validation
	config: z
		.object({
			theme: z.enum(["dark", "light"]),
			notificationEnabled: z.boolean(),
		})
		.optional(),
}).omit({
	id: true,
	createdAt: true,
});

// B2. Select Schema (API Response / DB Read)
// ⚠️ Critical: JSON 序列化会把 Date 变成 String
export const selectCommunitySchema = createSelectSchema(community, {
	createdAt: z.string().or(z.date()), // 允许 Date 对象或 ISO String
	config: z.object({
		theme: z.enum(["dark", "light"]),
		notificationEnabled: z.boolean(),
	}),
});

// B3. Update Schema (API Request Body for Edit)
export const updateCommunitySchema = insertCommunitySchema.partial().extend({
	id: z.number(),
});
```

### Part C: TypeScript Types

- 使用 `z.infer` 从 Zod Schema 推导，**严禁**手动定义 Interface。

```typescript
// ==========================================
// Part C: TypeScript Types
// ==========================================
export type Community = z.infer<typeof selectCommunitySchema>;
export type NewCommunity = z.infer<typeof insertCommunitySchema>;
export type UpdateCommunity = z.infer<typeof updateCommunitySchema>;
```

## 4. 导出规范 (Index Re-exporting)

在模块的 `index.ts` 中，必须导出 `schema.ts` 的所有内容。

`apps/type/src/business/property-manage/community-manage/index.ts`:

```typescript
export * from "./schema";
// export * from "./types"; // ❌ remove old manual types
```
