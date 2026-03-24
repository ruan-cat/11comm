# Design Document: Drizzle + Neon Database Integration

## 1. Overview

本设计文档描述了将 Drizzle ORM 和 Neon PostgreSQL 数据库集成到现有 Nitro 服务端的技术方案。目标是将现有的 mock 数据接口改造为真实的数据库后端，同时保持 API 契约不变。

### 1.1 Goals

- 使用 Drizzle ORM 实现类型安全的数据库操作
- 连接 Neon Serverless PostgreSQL 数据库
- 保持现有 API 响应格式不变
- 支持数据库 schema 迁移管理
- 配置 Neon MCP 支持 AI 辅助数据库操作

### 1.2 Non-Goals

- 不改变现有的前端 API 调用方式
- 不修改现有的 TypeScript 类型定义
- 不实现复杂的数据库关系（本阶段）

## 2. Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Vue Frontend]
    end

    subgraph "Server Layer - Nitro"
        B[API Handlers]
        C[Database Utils]
        D[Drizzle Client]
    end

    subgraph "Database Layer"
        E[Neon PostgreSQL]
    end

    subgraph "Development Tools"
        F[Drizzle Kit]
        G[Neon MCP]
    end

    A -->|HTTP Request| B
    B -->|Query| C
    C -->|ORM| D
    D -->|SQL| E
    F -->|Migrations| E
    G -->|Schema Inspection| E
```

### 2.1 Directory Structure

```plain
apps/admin/
├── server/
│   ├── api/                    # API handlers (existing)
│   ├── database/               # NEW: Database layer
│   │   ├── schema/             # Drizzle schema definitions
│   │   │   ├── index.ts        # Schema exports
│   │   │   └── config-center.ts # ConfigCenter table schema
│   │   ├── migrations/         # Generated migration files
│   │   ├── client.ts           # Drizzle client instance
│   │   └── seed.ts             # Database seeding script
│   └── utils/
│       ├── filter-data.ts      # Existing filter utility
│       └── db-query.ts         # NEW: Database query helpers
├── drizzle.config.ts           # Drizzle Kit configuration
└── .env                        # Environment variables
```

## 3. Components and Interfaces

### 3.1 Database Client (`server/database/client.ts`)

```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

/** 获取数据库连接字符串 */
function getDatabaseUrl(): string {
	const url = process.env.DATABASE_URL;
	if (!url) {
		throw new Error("DATABASE_URL environment variable is required");
	}
	return url;
}

/** 创建 Neon SQL 客户端 */
const sql = neon(getDatabaseUrl());

/** 创建 Drizzle ORM 实例 */
export const db = drizzle(sql, { schema });

export type Database = typeof db;
```

### 3.2 Schema Definition (`server/database/schema/config-center.ts`)

```typescript
import { pgTable, varchar, integer, timestamp, text } from "drizzle-orm/pg-core";

/** 配置中心表 */
export const configCenter = pgTable("config_center", {
	configId: varchar("config_id", { length: 50 }).primaryKey(),
	configName: varchar("config_name", { length: 100 }).notNull(),
	configType: varchar("config_type", { length: 50 }).notNull(),
	configKey: varchar("config_key", { length: 100 }).notNull().unique(),
	configValue: text("config_value").notNull(),
	defaultValue: text("default_value").notNull(),
	configDescription: text("config_description"),
	status: varchar("status", { length: 20 }).notNull().default("启用"),
	sortOrder: integer("sort_order").notNull().default(0),
	remark: text("remark"),
	createTime: timestamp("create_time").defaultNow(),
	updateTime: timestamp("update_time").defaultNow(),
	creator: varchar("creator", { length: 50 }),
	updater: varchar("updater", { length: 50 }),
});

export type ConfigCenterRecord = typeof configCenter.$inferSelect;
export type NewConfigCenterRecord = typeof configCenter.$inferInsert;
```

### 3.3 Database Query Helper (`server/utils/db-query.ts`)

```typescript
import { SQL, and, like, eq, sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

/** 构建分页查询参数 */
export interface PaginationParams {
	pageIndex: number;
	pageSize: number;
}

/** 构建筛选条件 */
export function buildFilters<T extends PgTable>(table: T, filters: Record<string, unknown>): SQL[] {
	const conditions: SQL[] = [];

	for (const [key, value] of Object.entries(filters)) {
		if (value === undefined || value === null || value === "") continue;

		const column = table[key as keyof T];
		if (!column) continue;

		if (typeof value === "string") {
			// 字符串使用模糊匹配
			conditions.push(like(column, `%${value}%`));
		} else {
			// 其他类型使用精确匹配
			conditions.push(eq(column, value));
		}
	}

	return conditions;
}

/** 执行分页查询 */
export async function paginatedQuery<T>(
	queryBuilder: any,
	pagination: PaginationParams,
): Promise<{ data: T[]; total: number }> {
	const { pageIndex, pageSize } = pagination;
	const offset = (pageIndex - 1) * pageSize;

	const [data, countResult] = await Promise.all([
		queryBuilder.limit(pageSize).offset(offset),
		queryBuilder.select({ count: sql`count(*)` }),
	]);

	return {
		data,
		total: Number(countResult[0]?.count ?? 0),
	};
}
```

### 3.4 Refactored API Handler Example

```typescript
// server/api/dev-team/config-manage/center/list.post.ts
import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, ConfigCenterListItem, ConfigCenterQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { db } from "server/database/client";
import { configCenter } from "server/database/schema";
import { buildFilters } from "server/utils/db-query";
import { and, sql } from "drizzle-orm";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ConfigCenterListItem>>> => {
	const body = await readBody<ConfigCenterQueryParams>(event);
	const { pageIndex = DEFAULT_PAGE_INDEX, pageSize = DEFAULT_PAGE_SIZE, ...filters } = body;

	// 构建筛选条件
	const whereConditions = buildFilters(configCenter, filters);
	const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

	// 执行查询
	const [data, countResult] = await Promise.all([
		db
			.select()
			.from(configCenter)
			.where(whereClause)
			.limit(pageSize)
			.offset((pageIndex - 1) * pageSize),
		db
			.select({ count: sql`count(*)` })
			.from(configCenter)
			.where(whereClause),
	]);

	const total = Number(countResult[0]?.count ?? 0);

	return {
		success: true,
		code: 200,
		message: "查询成功",
		data: {
			list: data as ConfigCenterListItem[],
			total,
			pageIndex,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		},
	};
});
```

## 4. Data Models

### 4.1 ConfigCenter Table

|       Column       |     Type     |       Constraints        | Description |
| :----------------: | :----------: | :----------------------: | :---------: |
|     config_id      | VARCHAR(50)  |       PRIMARY KEY        |  配置项 ID  |
|    config_name     | VARCHAR(100) |         NOT NULL         | 配置项名称  |
|    config_type     | VARCHAR(50)  |         NOT NULL         |  配置类型   |
|     config_key     | VARCHAR(100) |     NOT NULL, UNIQUE     |  配置键名   |
|    config_value    |     TEXT     |         NOT NULL         |   配置值    |
|   default_value    |     TEXT     |         NOT NULL         |   默认值    |
| config_description |     TEXT     |                          |  配置描述   |
|       status       | VARCHAR(20)  | NOT NULL, DEFAULT '启用' |    状态     |
|     sort_order     |   INTEGER    |   NOT NULL, DEFAULT 0    |   排序号    |
|       remark       |     TEXT     |                          |    备注     |
|    create_time     |  TIMESTAMP   |      DEFAULT NOW()       |  创建时间   |
|    update_time     |  TIMESTAMP   |      DEFAULT NOW()       |  更新时间   |
|      creator       | VARCHAR(50)  |                          |   创建人    |
|      updater       | VARCHAR(50)  |                          |   更新人    |

### 4.2 Type Mapping

| TypeScript Type | PostgreSQL Type | Drizzle Type |
| :-------------: | :-------------: | :----------: |
|     string      |  VARCHAR/TEXT   | varchar/text |
|     number      |     INTEGER     |   integer    |
|      Date       |    TIMESTAMP    |  timestamp   |
|     boolean     |     BOOLEAN     |   boolean    |

## 5. Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Database Connection Establishment

_For any_ valid database connection string, when the Nitro server initializes the database client, the connection should be established successfully and the client should be ready for queries.
**Validates: Requirements 1.1**

### Property 2: Schema-Type Alignment

_For any_ TypeScript interface field in ConfigCenterListItem, there should exist a corresponding column in the Drizzle schema with compatible type mapping.
**Validates: Requirements 2.1, 3.1**

### Property 3: Serialization Round Trip

_For any_ valid database record, serializing it to JSON and then deserializing back should produce an equivalent object with all fields preserved.
**Validates: Requirements 2.5, 2.6**

### Property 4: Query Result Format Consistency

_For any_ database query result, the returned data format should match the existing mock data response structure (same field names and types).
**Validates: Requirements 3.3**

### Property 5: Pagination Correctness

_For any_ list query with pagination parameters (pageIndex, pageSize), the returned results should contain at most pageSize items, and the total count should reflect the actual number of matching records.
**Validates: Requirements 4.1**

### Property 6: Filter Translation Correctness

_For any_ filter parameter, the database query should return only records that match the filter criteria (string fields use fuzzy match, others use exact match).
**Validates: Requirements 4.5**

### Property 7: CRUD Operation Integrity

_For any_ create operation, the created record should be retrievable; for any update operation, the changes should be persisted; for any delete operation, the record should no longer exist.
**Validates: Requirements 4.2, 4.3, 4.4**

## 6. Error Handling

### 6.1 Connection Errors

```typescript
/** 数据库连接错误处理 */
export class DatabaseConnectionError extends Error {
	constructor(
		message: string,
		public readonly cause?: Error,
	) {
		super(`Database connection failed: ${message}`);
		this.name = "DatabaseConnectionError";
	}
}

/** 安全获取数据库客户端 */
export function getDbClient() {
	try {
		return db;
	} catch (error) {
		console.error("Failed to initialize database client:", error);
		throw new DatabaseConnectionError(
			"Unable to connect to database. Please check DATABASE_URL configuration.",
			error as Error,
		);
	}
}
```

### 6.2 Query Errors

```typescript
/** 查询错误处理包装器 */
export async function safeQuery<T>(queryFn: () => Promise<T>, fallback?: T): Promise<T> {
	try {
		return await queryFn();
	} catch (error) {
		console.error("Database query failed:", error);
		if (fallback !== undefined) {
			return fallback;
		}
		throw error;
	}
}
```

### 6.3 Environment Validation

```typescript
/** 验证必需的环境变量 */
export function validateEnv() {
	const required = ["DATABASE_URL"];
	const missing = required.filter((key) => !process.env[key]);

	if (missing.length > 0) {
		throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
	}
}
```

## 7. Testing Strategy

### 7.1 Property-Based Testing

使用 `fast-check` 库进行属性测试：

```typescript
import * as fc from "fast-check";

// Property 3: Serialization Round Trip
describe("Serialization Round Trip", () => {
	it("should preserve all fields after JSON serialization/deserialization", () => {
		fc.assert(
			fc.property(
				fc.record({
					configId: fc.string(),
					configName: fc.string(),
					configType: fc.string(),
					// ... other fields
				}),
				(record) => {
					const serialized = JSON.stringify(record);
					const deserialized = JSON.parse(serialized);
					return deepEqual(record, deserialized);
				},
			),
			{ numRuns: 100 },
		);
	});
});
```

### 7.2 Unit Testing

- 测试数据库连接初始化
- 测试 schema 定义与类型匹配
- 测试筛选条件构建
- 测试分页逻辑

### 7.3 Integration Testing

- 测试完整的 API 请求-响应流程
- 测试数据库 CRUD 操作
- 测试迁移脚本执行

## 8. Configuration

### 8.1 Environment Variables

```bash
# .env.example
# Neon PostgreSQL 连接字符串
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require
```

### 8.2 Drizzle Configuration

```typescript
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./server/database/schema/index.ts",
	out: "./server/database/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
```

### 8.3 Neon MCP Configuration

```json
// .kiro/settings/mcp.json
{
	"mcpServers": {
		"neon": {
			"command": "npx",
			"args": ["-y", "@neondatabase/mcp-server-neon"],
			"env": {
				"NEON_API_KEY": "${NEON_API_KEY}"
			},
			"disabled": false,
			"autoApprove": []
		}
	}
}
```

## 9. Dependencies

### 9.1 Production Dependencies

```json
{
	"drizzle-orm": "^0.38.0",
	"@neondatabase/serverless": "^0.10.0"
}
```

### 9.2 Development Dependencies

```json
{
	"drizzle-kit": "^0.30.0",
	"fast-check": "^3.23.0"
}
```

## 10. Migration Strategy

### 10.1 Initial Migration

1. 创建 Drizzle schema 定义
2. 生成初始迁移文件：`npx drizzle-kit generate`
3. 应用迁移到 Neon 数据库：`npx drizzle-kit push`
4. 运行种子脚本导入 mock 数据

### 10.2 Incremental Changes

1. 修改 schema 定义
2. 生成迁移文件：`npx drizzle-kit generate`
3. 审查生成的 SQL
4. 应用迁移：`npx drizzle-kit push`
