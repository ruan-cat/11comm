# Nitro API 接口规范

## 快速导航

**完整迁移指南**: 请查看 [migration-guide.md](../migration-guide.md#step-3-创建-nitro-接口文件-20分钟)

**代码范例**:

- ✅ **正确范例**: [配置中心接口](../../../../apps/admin/server/api/dev-team/config-manage/center/list.post.ts)
- ❌ **错误反面例子**: [缴费审核接口](../../../../apps/admin/server/api/property-manage/expense-manage/payment-review/list.post.ts)

---

## ADDED Requirements

### Requirement: Nitro v3 代码写法规范

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

- **AND** 从 `nitro/h3` 导入,不是 `h3`
- **AND** 使用 `defineHandler`,不是 `defineEventHandler`
- **AND** 创建 `response` 变量并添加完整类型约束
- **AND** 有 JSDoc 注释说明接口路径

#### Scenario: 错误的写法对比

**❌ 错误示例 - 缴费审核接口**:

```typescript
// ❌ 错误1: 从 h3 导入而不是 nitro/h3
import { defineEventHandler, readBody } from "h3";

// ❌ 错误2: 使用 defineEventHandler (Nitro v2 写法)
export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<PaymentReviewListItem>>> => {
	// ❌ 错误3: 手动解构参数并设置默认值
	const { pageIndex = 1, pageSize = 10, house, expenseItem } = body;

	// ❌ 错误4: 手动编写 filter 逻辑
	let filteredData = [...mockPaymentReviewData];
	if (house) {
		filteredData = filteredData.filter((item) => item.house.includes(house));
	}

	// ❌ 错误5: 直接返回对象字面量,没有类型约束变量
	return {
		success: true,
		code: 200,
		message: "查询成功",
		data: { ... },
		timestamp: Date.now(),
	};
});
```

**问题分析**:

1. 从 `h3` 导入会导致 Nitro v3 兼容性问题
2. `defineEventHandler` 是 Nitro v2 的旧写法
3. 手动设置默认值不统一,应使用 DEFAULT 常量
4. 手动编写 filter 逻辑重复劳动,且容易出错
5. 直接返回对象字面量缺少类型检查,容易遗漏字段

---

### Requirement: 标准参数处理模式

所有 Nitro 接口 MUST 使用固定的参数处理模式:

- 使用 `readBody<QueryParams>(event)` 读取请求体
- 创建 `defaultParams` 对象并使用 DEFAULT 常量
- 使用对象展开合并参数
- 解构出 `pageIndex`、`pageSize` 和 `filters`

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
- **AND** `filters` 包含除分页参数外的所有搜索字段

#### Scenario: 默认参数处理

- **GIVEN** 客户端发送请求,body 为 `{}`
- **WHEN** 接口解析参数
- **THEN** pageIndex 默认为 1
- **AND** pageSize 默认为 10
- **AND** 其他筛选字段为 undefined

---

### Requirement: 使用通用筛选函数 filterDataByQuery

所有 Nitro 接口 MUST 使用 `filterDataByQuery` 工具函数进行数据筛选:

- 导入 `filterDataByQuery` 从 `server/utils/filter-data`
- 传入数据数组和 filters 对象
- 工具函数自动处理字符串模糊匹配和枚举精确匹配
- 工具函数自动忽略空值、null 和 undefined

#### Scenario: 使用通用筛选函数

- **GIVEN** 需要筛选数据
- **WHEN** 调用 filterDataByQuery
- **THEN** 代码为:

```typescript
import { filterDataByQuery } from "server/utils/filter-data";

const filteredData = filterDataByQuery(mockConfigCenterData, filters);
```

- **AND** 自动处理所有筛选字段,无需为每个字段编写 if 条件
- **AND** 字符串字段自动模糊匹配
- **AND** 枚举字段自动精确匹配
- **AND** 自动忽略空值、null 和 undefined

#### Scenario: 禁止手动编写 filter 逻辑

- **GIVEN** 需要筛选数据
- **WHEN** 编写筛选代码
- **THEN** 不允许使用以下写法:

```typescript
// ❌ 禁止
let filteredData = [...mockConfigCenterData];
if (configName) {
	filteredData = filteredData.filter((item) => item.configName.includes(configName));
}
if (configType) {
	filteredData = filteredData.filter((item) => item.configType === configType);
}
```

- **AND** 必须使用 `filterDataByQuery` 工具函数

---

### Requirement: 完整的返回值类型约束

所有 Nitro 接口 MUST 创建带完整类型约束的 `response` 变量:

- 创建 `response` 变量
- 类型约束为 `JsonVO<PageDTO<{Page}ListItem>>`
- 包含所有必需字段
- 最后 return response

#### Scenario: 正确的返回值写法

- **GIVEN** 接口准备返回数据
- **WHEN** 编写返回逻辑
- **THEN** 代码为:

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

- **AND** 必须添加 JSDoc 注释
- **AND** 必须有完整类型约束
- **AND** 必须包含 success、code、message、data 所有字段

#### Scenario: 禁止直接返回对象字面量

- **GIVEN** 接口准备返回数据
- **WHEN** 编写返回逻辑
- **THEN** 不允许使用以下写法:

```typescript
// ❌ 禁止
return {
	success: true,
	code: 200,
	message: "查询成功",
	data: { ... },
};
```

- **AND** 必须创建 response 变量
- **AND** 必须添加类型约束

---

### Requirement: 接口命名和路径规范

所有 Nitro 接口 MUST 满足以下约束:

- 全部使用 POST 方法(文件名 `*.post.ts`)
- 接口路径与页面目录对应
- 列表查询接口统一命名为 `list.post.ts`
- 接口 URL 格式: `/api/{module}/{sub-module}/{page}/list`

#### Scenario: 接口路径对应关系

- **GIVEN** 页面路径 `src/pages/property-manage/expense-manage/house-charge/index.vue`
- **WHEN** 创建 Nitro 接口
- **THEN** 接口文件为 `server/api/property-manage/expense-manage/house-charge/list.post.ts`
- **AND** 访问 URL 为 `POST /api/property-manage/expense-manage/house-charge/list`

---

### Requirement: Mock 数据文件规范

Mock 数据 SHALL 从独立的 mock-data.ts 文件导入:

- 文件位置: 与 list.post.ts 同目录
- 文件命名: `mock-data.ts`
- 数据命名: `mock{Page}Data`(如 mockConfigCenterData)
- 数据类型: 与类型库定义一致

#### Scenario: Mock 数据导入

- **GIVEN** mock-data.ts 导出 mockConfigCenterData
- **WHEN** 在 list.post.ts 中导入
- **THEN** 使用 `import { mockConfigCenterData } from "./mock-data"`
- **AND** 类型导入为 `import type { ConfigCenterListItem } from "@01s-11comm/type"`

---

### Requirement: 接口返回格式规范

所有接口 MUST 返回统一格式 `JsonVO<PageDTO<T>>`:

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

- **GIVEN** 请求 POST /api/property-manage/expense-manage/house-charge/list
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

---

### Requirement: 分页处理规范

接口 MUST 实现正确的分页逻辑:

- 先筛选再分页
- 使用 Array.slice() 实现分页
- 计算正确的 total 和 totalPages
- 支持超出范围的页码(返回空列表)

#### Scenario: 基础分页

- **GIVEN** 筛选后有 47 条数据
- **WHEN** 请求 `{ "pageIndex": 2, "pageSize": 10 }`
- **THEN** startIndex = `(2 - 1) * 10 = 10`
- **AND** endIndex = 10 + 10 = 20
- **AND** 返回 data[10:20](第 11-20 条)
- **AND** total = 47
- **AND** totalPages = 5

#### Scenario: 超出范围页码

- **GIVEN** total = 47, pageSize = 10
- **WHEN** 请求 pageIndex = 10
- **THEN** list = []
- **AND** total = 47(总数不变)
- **AND** success = true(仍返回成功)

---

## REMOVED Requirements

### Requirement: 手动编写数据筛选逻辑

**Reason**: 已抽取为通用工具函数 `filterDataByQuery`

**Migration**: 使用 `filterDataByQuery(data, filters)` 替代手动 filter

### Requirement: 使用 defineEventHandler

**Reason**: Nitro v3 废弃此 API

**Migration**: 改为使用 `defineHandler` 从 `nitro/h3` 导入

---

## 总结

### 必须遵守的 5 个核心规则

1. **Nitro v3 写法**: `defineHandler` + `nitro/h3`
2. **标准参数处理**: 使用固定的参数合并模式
3. **通用筛选函数**: 使用 `filterDataByQuery`
4. **完整类型约束**: 创建 `response` 变量并添加类型
5. **JSDoc 注释**: 包含接口路径说明

### 快速检查清单

创建 Nitro 接口后,验证以下要点:

- [ ] 从 `nitro/h3` 导入 `defineHandler` 和 `readBody`
- [ ] 使用 `defineHandler` 而不是 `defineEventHandler`
- [ ] 使用 DEFAULT_PAGE_INDEX 和 DEFAULT_PAGE_SIZE 常量
- [ ] 使用 `filterDataByQuery` 工具函数
- [ ] 创建 `response` 变量并添加类型约束 `JsonVO<PageDTO<T>>`
- [ ] 添加 JSDoc 注释,包含接口路径
- [ ] 文件路径与页面路径对应
- [ ] Mock 数据从 mock-data.ts 导入

### 完整示例代码

完整的标准模板和详细说明,请参考 [migration-guide.md](../migration-guide.md#step-3-创建-nitro-接口文件-20分钟)。
