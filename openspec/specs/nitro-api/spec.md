# nitro-api Specification

## Purpose

规范 Nitro API 接口的开发标准，支持从 Mock 数据向 Drizzle ORM 数据库查询的平滑迁移。

## Requirements

### Requirement: Nitro v3 代码写法规范 [CRITICAL]

所有 Nitro 接口 MUST 使用 Nitro v3 的标准写法:

- 必须从 `nitro/h3` 导入 `defineHandler` 和 `readBody`
- 必须使用 `defineHandler` 而不是 `defineEventHandler`
- 返回值必须创建带类型约束的 `response` 变量
- 必须添加 JSDoc 注释,包含接口路径

#### Scenario: 正确的 Nitro v3 写法

- **GIVEN** 创建新的 Nitro 接口文件
- **WHEN** 编写代码
- **THEN** 必须使用以下标准模板:

```typescript
/**
 * @file 配置中心列表接口
 * @description Configuration center list API
 * POST /api/dev-team/config-manage/center/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, ConfigCenterListItem, ConfigCenterQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { db, smSystemConfigs } from "server/db";
import { count, eq, and, like } from "drizzle-orm";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ConfigCenterListItem>>> => {
	// 1. 读取请求参数
	const body = await readBody<ConfigCenterQueryParams>(event);
	const defaultParams: ConfigCenterQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, configKey, configType, status } = mergedParams;

	// 2. 构建查询条件
	const whereConditions = [];
	if (configKey) whereConditions.push(like(smSystemConfigs.configKey, `%${configKey}%`));
	if (configType) whereConditions.push(eq(smSystemConfigs.configType, configType));
	if (status) whereConditions.push(eq(smSystemConfigs.status, status as any));

	const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

	// 3. 执行查询 (分页 + 总数)
	// 查询总数
	const [totalResult] = await db.select({ count: count() }).from(smSystemConfigs).where(whereClause);
	const total = totalResult?.count || 0;

	// 查询数据
	const records = await db
		.select()
		.from(smSystemConfigs)
		.where(whereClause)
		.limit(pageSize)
		.offset((pageIndex - 1) * pageSize);

	// 4. 数据转换 (Snake_case -> CamelCase)
	// 注意：由于 Drizzle Schema 中定义了 name 属性 (e.g. configKey: varchar("config_key")),
	// Drizzle 查询结果会自动映射为 camelCase (configKey)，通常不需要手动 map。
	// 如果 schema 未定义 camelCase 映射，则需要手动转换。
	const list: ConfigCenterListItem[] = records.map((item) => ({
		...item,
		// 如果需要额外转换或组合字段，在此处处理
	})) as unknown as ConfigCenterListItem[];

	// 5. 返回标准格式
	/** 返回标准格式 */
	const response: JsonVO<PageDTO<ConfigCenterListItem>> = {
		success: true,
		code: 200,
		message: "查询成功",
		data: {
			list,
			total,
			pageIndex,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		},
	};

	return response;
});
```

- **AND** 从 `nitro/h3` 导入,不是 `h3`
- **AND** 使用 `defineHandler`,不是 `defineEventHandler`
- **AND** 创建 `response` 变量并添加完整类型约束
- **AND** 有 JSDoc 注释说明接口路径

---

### Requirement: 标准参数处理模式 [CRITICAL]

所有 Nitro 接口 MUST 使用固定的参数处理模式:

- 使用 `readBody<QueryParams>(event)` 读取请求体
- 创建 `defaultParams` 对象并使用 DEFAULT 常量
- 使用对象展开合并参数
- 解构出 `pageIndex`、`pageSize` 和具体查询字段

#### Scenario: 参数处理标准流程

- **GIVEN** 接口需要处理查询参数
- **WHEN** 读取请求体
- **THEN** 使用以下固定代码模式:

```typescript
const body = await readBody<ConfigCenterQueryParams>(event);
const defaultParams: ConfigCenterQueryParams = {
	pageIndex: DEFAULT_PAGE_INDEX,
	pageSize: DEFAULT_PAGE_SIZE,
};
const mergedParams = { ...defaultParams, ...body };
const { pageIndex, pageSize, ...filters } = mergedParams;
```

- **AND** 不允许使用 `const { pageIndex = 1, pageSize = 10 } = body` 这种写法
- **AND** 必须使用 `DEFAULT_PAGE_INDEX` 和 `DEFAULT_PAGE_SIZE` 常量

---

### Requirement: [DEPRECATED] 使用通用筛选函数 filterDataByQuery

此规范已废弃，但在完全迁移之前，旧接口 MUST 继续维持原有实现，或者 MUST 迁移到 Drizzle ORM。

**Note:** 所有旧的 Nitro 接口曾要求使用 `filterDataByQuery` 工具函数进行数据筛选。
迁移时，应移除此函数调用，替换为数据库查询逻辑。

#### Scenario: 废弃说明

- **GIVEN** 准备开发新接口
- **WHEN** 查阅文档
- **THEN** 应当忽略此规范，参考 Drizzle ORM 查询规范

---

### Requirement: 使用 Drizzle ORM 查询数据 [CRITICAL]

所有新开发的 Nitro 接口 MUST 使用 Drizzle ORM 进行数据库查询：

- 必须从 `server/db` 导入 `db` 实例
- 必须从 `server/db` 导入相关的 schema 定义 (e.g., `smSystemConfigs`)
- 必须使用 `drizzle-orm` 提供的 SQL 运算符 (e.g., `eq`, `like`, `and`, `count`)
- 必须处理异步数据库操作 (`await`)

#### Scenario: 数据库查询实现

- **GIVEN** 需要从数据库查询数据
- **WHEN** 编写查询逻辑
- **THEN** 代码为:

```typescript
import { db, smSystemConfigs } from "server/db";
import { count, eq, and, like } from "drizzle-orm";

// 构建条件
const whereConditions = [];
if (configKey) whereConditions.push(like(smSystemConfigs.configKey, `%${configKey}%`));
const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

// 查询总数
const [totalResult] = await db.select({ count: count() }).from(smSystemConfigs).where(whereClause);
const total = totalResult?.count || 0;

// 查询列表
const records = await db
	.select()
	.from(smSystemConfigs)
	.where(whereClause)
	.limit(pageSize)
	.offset((pageIndex - 1) * pageSize);
```

- **AND** 使用 `limit` 和 `offset` 实现分页
- **AND** 分开查询总数和列表数据

---

### Requirement: [DEPRECATED] Mock 数据文件规范

此规范已废弃，但在完全迁移之前，遗留接口 MUST 继续使用 Mock 数据，直到迁移到数据库。

**Note:** Mock 数据文件 (`mock-data.ts`) 仅用于开发阶段或尚未迁移到数据库的接口。
在迁移过程中，应逐步删除 `mock-data.ts` 文件。

#### Scenario: 废弃说明

- **GIVEN** 准备开发新接口
- **WHEN** 查阅文档
- **THEN** 应当忽略此规范，直接使用数据库

---

### Requirement: 数据库查询标准模板 [CRITICAL]

所有基于数据库查询的列表接口 MUST 遵循以下模式：

1.  **参数解构**：明确解构出所有查询参数。
2.  **条件构建**：使用数组收集 `where` 条件，最后用 `and(...)` 组合。
3.  **双重查询**：
    - 一次查询 `count()` 获取总数。
    - 一次查询 `select()` 获取分页数据。
4.  **类型转换**：虽然 Drizzle 会自动处理 camelCase 映射，但仍需确保返回数据符合 `JsonVO<PageDTO<T>>` 的泛型约束。如果有必要，使用 `.map()` 进行转换。

#### Scenario: 模糊查询与精确匹配

- **GIVEN** 字符串字段 (如 name) 和 枚举字段 (如 status)
- **WHEN** 构建查询条件
- **THEN** 字符串字段使用 `like` (e.g., `like(table.name, \`%${val}%\`)`)
- **AND** 枚举字段使用 `eq` (e.g., `eq(table.status, val)`)

---

### Requirement: 接口返回格式规范 [IMPORTANT]

所有 Nitro 接口 MUST 返回统一格式 `JsonVO<PageDTO<T>>`:

- success: boolean - 请求是否成功
- code: number - 状态码(200 成功)
- message: string - 提示信息
- `data: PageDTO<T>` - 分页数据对象
- timestamp: number - 时间戳(可选)

**重要**: `JsonVO` 和 `PageDTO` 类型 MUST 从 `@01s-11comm/type` 导入。

`PageDTO<T>` 包含:

- list: T[] - 数据列表
- total: number - 总记录数
- pageIndex: number - 当前页码(1-based)
- pageSize: number - 每页大小
- totalPages: number - 总页数

#### Scenario: 成功响应格式

- **GIVEN** 请求 POST /api/dev-team/config-manage/center/list
- **WHEN** 接口处理成功
- **THEN** 返回 HTTP 200
- **AND** 响应体结构为:

```json
{
  "success": true,
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [...],
    "total": 50,
    "pageIndex": 1,
    "pageSize": 10,
    "totalPages": 5
  }
}
```
