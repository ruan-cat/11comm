# Mock 模式开发参考 (Legacy Mock Mode)

> **警告：Mock 模式已被弃用**  
> 本文档保留用于维护尚未迁移到数据库的 legacy 接口。  
> **新开发必须使用 Drizzle ORM 模式**（参阅[mock-to-neon-migration.md](mock-to-neon-migration.md)）。

## 核心规范 [CRITICAL]

### 1. Nitro v3 标准写法

所有 Mock 模式接口**必须**遵循以下模板：

```typescript
/**
 * @file 配置中心列表接口
 * @description Configuration center list API
 * POST /api/dev-team/config-manage/center/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, ConfigCenterListItem, ConfigCenterQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockConfigCenterData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<ConfigCenterListItem>>> => {
	// 1. 读取请求参数
	const body = await readBody<ConfigCenterQueryParams>(event);
	const defaultParams: ConfigCenterQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	// 2. 数据筛选 - 使用通用筛选工具函数
	const filteredData = filterDataByQuery(mockConfigCenterData, filters);

	// 3. 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 4. 返回标准格式 - 必须要用完整的对象来约束返回的数据格式
	/** 返回标准格式 */
	const response: JsonVO<PageDTO<ConfigCenterListItem>> = {
		success: true,
		code: 200,
		message: "查询成功",
		data: {
			list: pageData,
			total,
			pageIndex,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		},
	};

	return response;
});
```

### 2. 必须使用的导入源

- **从`nitro/h3`导入，不是`h3`**
- 使用`defineHandler`，不是`defineEventHandler`

### 3. 错误写法对比 ❌

**禁止以下写法：**

```typescript
// ❌ 错误1: 从h3导入而不是nitro/h3
import { defineEventHandler, readBody } from "h3";

// ❌ 错误2: 使用defineEventHandler (Nitro v2写法)
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<ListItem>>> => {
	// ❌ 错误3: 直接返回对象字面量，没有类型约束变量
	return {
		success: true,
		code: 200,
		message: "查询成功",
		data: { ... },
	};
});
```

## 参数处理规范 [CRITICAL]

### 标准参数处理流程

**必须**使用以下固定模式：

```typescript
const body = await readBody<ConfigCenterQueryParams>(event);
const defaultParams: ConfigCenterQueryParams = {
	pageIndex: DEFAULT_PAGE_INDEX,
	pageSize: DEFAULT_PAGE_SIZE,
};
const mergedParams = { ...defaultParams, ...body };
const { pageIndex, pageSize, ...filters } = mergedParams;
```

### 禁止的写法 ❌

```typescript
// ❌ 禁止使用参数默认值
const { pageIndex = 1, pageSize = 10 } = body;
```

### 为什么要这样写？

1.  **类型安全**：`defaultParams`对象确保类型完整性
2.  **统一常量**：使用`DEFAULT_PAGE_INDEX`和`DEFAULT_PAGE_SIZE`确保全局一致性
3.  **清晰分离**：`filters`变量包含除分页外的所有搜索字段

## filterDataByQuery 工具函数 [CRITICAL]

### 必须使用通用筛选函数

所有 Mock 接口**必须**使用`filterDataByQuery`工具函数：

```typescript
import { filterDataByQuery } from "server/utils/filter-data";

const filteredData = filterDataByQuery(mockConfigCenterData, filters);
```

### 自动处理特性

- ✅ 字符串字段自动模糊匹配
- ✅ 枚举字段自动精确匹配
- ✅ 自动忽略空值、null 和 undefined
- ✅ 无需为每个字段编写 if 条件

### 禁止的写法 ❌

```typescript
// ❌ 禁止手动编写filter逻辑
let filteredData = [...mockConfigCenterData];
if (configName) {
	filteredData = filteredData.filter((item) => item.configName.includes(configName));
}
if (configType) {
	filteredData = filteredData.filter((item) => item.configType === configType);
}
```

## 返回值规范 [CRITICAL]

### 必须创建 response 变量

**禁止**直接返回对象字面量，**必须**创建带完整类型约束的`response`变量：

```typescript
/** 返回标准格式 */
const response: JsonVO<PageDTO<ConfigCenterListItem>> = {
	success: true,
	code: 200,
	message: "查询成功",
	data: {
		list: pageData,
		total,
		pageIndex,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	},
};

return response;
```

### 为什么要这样写？

1.  **类型检查**：编译时捕获字段缺失或类型错误
2.  **代码可读性**：清晰标识返回数据结构
3.  **IDE 支持**：提供完整的智能提示

## Mock 数据文件规范

### 文件组织

- **位置**：与`list.post.ts`同目录
- **命名**：`mock-data.ts`
- **数据命名**：`mock{Page}Data`（如`mockConfigCenterData`）

### 示例

```typescript
/**
 * @file 配置中心假数据
 * @description Configuration center mock data
 */

import type { ConfigCenterListItem } from "@01s-11comm/type";

/** 配置中心假数据 */
export const mockConfigCenterData: ConfigCenterListItem[] = [
	{
		id: "001",
		configName: "系统配置1",
		configType: "基础配置",
		createTime: "2024-01-01 09:00:00",
		updateTime: "2024-01-15 14:30:00",
	},
	// ... 更多数据（建议约35行以演示分页）
];
```

## 分页处理规范

### 标准分页逻辑

```typescript
// 1. 先筛选
const filteredData = filterDataByQuery(mockData, filters);

// 2. 后分页
const total = filteredData.length;
const startIndex = (pageIndex - 1) * pageSize;
const pageData = filteredData.slice(startIndex, startIndex + pageSize);

// 3. 计算总页数
const totalPages = Math.ceil(total / pageSize);
```

### 分页公式

- **startIndex**: `(pageIndex - 1) × pageSize`
- **endIndex**: `startIndex + pageSize`
- **totalPages**: `Math.ceil(total / pageSize)`

### 超出范围处理

当请求页码超出范围时：

- `list`返回空数组`[]`
- `total`保持不变
- `success`仍为`true`

## 接口命名和路径规范

### 文件命名

- 列表查询接口统一命名为：`list.post.ts`
- 全部使用 POST 方法

### 路径映射

| 前端页面路径                                                      | API 文件路径                                                          | URL 路径                                                     |
| :---------------------------------------------------------------- | :-------------------------------------------------------------------- | :----------------------------------------------------------- |
| `src/pages/property-manage/expense-manage/house-charge/index.vue` | `server/api/property-manage/expense-manage/house-charge/list.post.ts` | `POST /api/property-manage/expense-manage/house-charge/list` |

## 迁移到 Drizzle

当准备迁移 Mock 接口到真实数据库时，请参阅：

- [mock-to-neon-migration.md](mock-to-neon-migration.md) - 完整迁移指南
- [examples.md](examples.md) - Drizzle ORM 代码示例
