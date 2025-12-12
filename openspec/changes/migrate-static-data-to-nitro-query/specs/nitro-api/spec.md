## ADDED Requirements

### Requirement: Nitro 服务端启用

apps/admin SHALL 启用 Nitro 服务端功能：

- nitro.config.ts 设置 `serverDir: "server"`
- 创建 server/api 目录存放接口文件
- 接口路径与页面目录结构对应
- 支持开发模式热重载

#### Scenario: Nitro 配置正确

- **GIVEN** nitro.config.ts 文件存在
- **WHEN** 设置 `serverDir: "server"`
- **THEN** Vite 开发服务器启动时加载 server/api 目录
- **AND** 可以访问 `/api/**` 路径的接口

#### Scenario: 接口热重载

- **GIVEN** 开发服务器正在运行
- **WHEN** 修改 `server/api/*/list.post.ts` 文件
- **THEN** Nitro 自动重新加载接口
- **AND** 无需重启开发服务器

---

### Requirement: 接口命名和路径规范

所有 Nitro 接口 MUST 满足以下约束：

- 全部使用 POST 方法（文件名 `*.post.ts`）
- 接口路径与页面目录对应
- 列表查询接口统一命名为 `list.post.ts`
- 接口 URL 格式：`/api/{module}/{sub-module}/{page}/list`

#### Scenario: 接口路径对应关系

- **GIVEN** 页面路径 `src/pages/property-manage/expense-manage/house-charge/index.vue`
- **WHEN** 创建 Nitro 接口
- **THEN** 接口文件为 `server/api/property-manage/expense-manage/house-charge/list.post.ts`
- **AND** 访问 URL 为 `POST /api/property-manage/expense-manage/house-charge/list`

#### Scenario: 仅支持 POST 方法

- **GIVEN** 客户端发起列表查询请求
- **WHEN** 使用 GET 方法访问 `/api/property-manage/expense-manage/house-charge/list`
- **THEN** 返回 405 Method Not Allowed
- **WHEN** 使用 POST 方法访问
- **THEN** 返回 200 OK 和数据

---

### Requirement: 接口返回格式规范

所有接口 MUST 返回统一格式 `JsonVO<PageDTO<T>>`：

- success: boolean - 请求是否成功
- code: number - 状态码（200 成功）
- message: string - 提示信息
- `data: PageDTO<T>` - 分页数据对象
- timestamp: number - 时间戳

`PageDTO<T>` 包含：

- list: T[] - 数据列表
- total: number - 总记录数
- pageIndex: number - 当前页码（1-based）
- pageSize: number - 每页大小
- totalPages: number - 总页数

#### Scenario: 成功响应格式

- **GIVEN** 请求 POST /api/property-manage/expense-manage/house-charge/list
- **WHEN** 接口处理成功
- **THEN** 返回 HTTP 200
- **AND** 响应体结构为：

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
  },
  "timestamp": 1734000000000
}
```

#### Scenario: 分页计算正确

- **GIVEN** 总记录数 total = 47，pageSize = 10
- **WHEN** 计算 totalPages
- **THEN** totalPages = Math.ceil(47 / 10) = 5

#### Scenario: 空列表响应

- **GIVEN** 筛选条件无匹配数据
- **WHEN** 接口返回
- **THEN** success = true
- **AND** data.list = []
- **AND** data.total = 0
- **AND** data.totalPages = 0

---

### Requirement: 假数据文件规范

假数据 SHALL 从独立的 mock-data.ts 文件导入：

- 文件位置：与 list.post.ts 同目录
- 文件命名：`mock-data.ts`
- 数据命名：`mock{Page}Data`（如 mockHouseChargeData）
- 数据类型：与类型库定义一致

#### Scenario: 假数据文件位置

- **GIVEN** 接口文件 `server/api/property-manage/expense-manage/house-charge/list.post.ts`
- **WHEN** 创建假数据文件
- **THEN** 文件路径为 `server/api/property-manage/expense-manage/house-charge/mock-data.ts`

#### Scenario: 假数据导入

- **GIVEN** mock-data.ts 导出 mockHouseChargeData
- **WHEN** 在 list.post.ts 中导入
- **THEN** 使用 `import { mockHouseChargeData } from "./mock-data"`
- **AND** 类型导入为 `import type { HouseChargeListItem } from "@01s-11comm/type"`

#### Scenario: 假数据类型校验

- **GIVEN** mockHouseChargeData 数组
- **WHEN** TypeScript 编译
- **THEN** 数组元素类型为 HouseChargeListItem
- **AND** 所有字段名为英文
- **AND** 无类型报错

---

### Requirement: 请求参数处理

接口 MUST 实现请求参数的读取和验证：

- 使用 `await readBody<QueryParams>(event)` 读取 POST body
- 支持所有筛选字段（可选）
- 必须包含 pageIndex 和 pageSize
- 提供合理的默认值（pageIndex = 1, pageSize = 10）

#### Scenario: 请求参数解析

- **GIVEN** 客户端发送 POST 请求，body 为：

```json
{
	"expenseType": "物业费",
	"status": "启用",
	"pageIndex": 2,
	"pageSize": 20
}
```

- **WHEN** 接口执行 `const body = await readBody<HouseChargeQueryParams>(event)`
- **THEN** body.expenseType = "物业费"
- **AND** body.status = "启用"
- **AND** body.pageIndex = 2
- **AND** body.pageSize = 20

#### Scenario: 默认参数处理

- **GIVEN** 客户端发送请求，body 为 `{}`
- **WHEN** 接口解析参数
- **THEN** pageIndex 默认为 1
- **AND** pageSize 默认为 10
- **AND** 其他筛选字段为 undefined

---

### Requirement: 数据筛选逻辑

接口 MUST 实现请求参数的筛选逻辑：

- 对每个有值的筛选字段进行过滤
- 字符串字段使用 `.includes()` 模糊匹配
- 枚举字段使用 `===` 精确匹配
- 多个条件使用 AND 逻辑
- 筛选顺序不影响结果

#### Scenario: 单条件筛选

- **GIVEN** mockHouseChargeData 有 50 条数据
- **WHEN** 请求参数 `{ "expenseType": "物业费" }`
- **THEN** 返回所有 expenseType === "物业费" 的数据
- **AND** 过滤后数据数量 ≤ 50

#### Scenario: 多条件 AND 筛选

- **GIVEN** 请求参数 `{ "expenseType": "物业费", "status": "启用" }`
- **WHEN** 执行筛选
- **THEN** 返回满足 expenseType === "物业费" **且** status === "启用" 的数据
- **AND** 结果是两个条件的交集

#### Scenario: 模糊匹配字符串

- **GIVEN** expenseItem 字段支持模糊搜索
- **WHEN** 请求参数 `{ "expenseItem": "费" }`
- **THEN** 返回所有 expenseItem.includes("费") 的数据

#### Scenario: 空筛选条件

- **GIVEN** 请求参数仅有分页 `{ "pageIndex": 1, "pageSize": 10 }`
- **WHEN** 执行筛选
- **THEN** 不进行任何过滤
- **AND** 返回前 10 条数据

---

### Requirement: 分页处理

接口 MUST 实现正确的分页逻辑：

- 先筛选再分页
- 使用 Array.slice() 实现分页
- 计算正确的 total 和 totalPages
- 支持超出范围的页码（返回空列表）

#### Scenario: 基础分页

- **GIVEN** 筛选后有 47 条数据
- **WHEN** 请求 `{ "pageIndex": 2, "pageSize": 10 }`
- **THEN** startIndex = `(2 - 1) * 10 = 10`
- **AND** endIndex = 10 + 10 = 20
- **AND** 返回 data[10:20]（第 11-20 条）
- **AND** total = 47
- **AND** totalPages = 5

#### Scenario: 最后一页不满

- **GIVEN** total = 47, pageSize = 10
- **WHEN** 请求 pageIndex = 5（最后一页）
- **THEN** 返回第 41-47 条（7 条数据）
- **AND** list.length = 7

#### Scenario: 超出范围页码

- **GIVEN** total = 47, pageSize = 10
- **WHEN** 请求 pageIndex = 10
- **THEN** list = []
- **AND** total = 47（总数不变）
- **AND** success = true（仍返回成功）

---

### Requirement: 接口实现模板

所有 list.post.ts 接口 MUST 遵循统一模板：

1. 导入类型和假数据
2. 使用 defineEventHandler 定义接口
3. 读取请求参数
4. 数据筛选（遍历所有筛选字段）
5. 分页处理（slice）
6. 返回 `JsonVO<PageDTO<T>>` 格式

#### Scenario: 接口代码结构

- **GIVEN** 创建新接口 list.post.ts
- **WHEN** 编写接口代码
- **THEN** 代码结构按以下顺序：

```typescript
import type { JsonVO, PageDTO } from "@ruan-cat/utils";
import type { HouseChargeListItem, HouseChargeQueryParams } from "@01s-11comm/type";
import { mockHouseChargeData } from "./mock-data";

export default defineEventHandler(async (event): Promise<JsonVO<PageDTO<HouseChargeListItem>>> => {
	// 1. 读取请求参数
	const body = await readBody<HouseChargeQueryParams>(event);
	const { pageIndex = 1, pageSize = 10, ...filters } = body;

	// 2. 数据筛选
	let filteredData = [...mockHouseChargeData];
	if (filters.expenseType) {
		filteredData = filteredData.filter((item) => item.expenseType === filters.expenseType);
	}
	// ... 其他筛选条件

	// 3. 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const pageData = filteredData.slice(startIndex, endIndex);

	// 4. 返回标准格式
	return {
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
		timestamp: Date.now(),
	};
});
```

---

## MODIFIED Requirements

### Requirement: 假数据从 pages/ 迁移到 server/

**FROM**: test-data.ts 位于 `src/pages/{module}/{page}/test-data.ts`
**TO**: mock-data.ts 位于 `server/api/{module}/{page}/mock-data.ts`

假数据文件 MUST 迁移到服务端目录：

- 字段名从中文转换为英文
- 数据数组重命名（tableData → mock{Page}Data）
- 删除原 test-data.ts 文件

#### Scenario: 文件迁移路径

- **GIVEN** 原文件 `src/pages/property-manage/expense-manage/house-charge/test-data.ts`
- **WHEN** 迁移完成
- **THEN** 新文件位于 `server/api/property-manage/expense-manage/house-charge/mock-data.ts`
- **AND** 原文件已删除

#### Scenario: 字段名转换

- **GIVEN** 原数据对象 `{ "费用项目": "物业费", "状态": "启用" }`
- **WHEN** 迁移到 mock-data.ts
- **THEN** 新对象为 `{ expenseItem: "物业费", status: "启用" }`
- **AND** 枚举值保持中文不变

#### Scenario: 数组命名

- **GIVEN** 原导出 `export const tableData: 房屋收费_列表数据[] = [...]`
- **WHEN** 迁移到 mock-data.ts
- **THEN** 新导出为 `export const mockHouseChargeData: HouseChargeListItem[] = [...]`

---

### Requirement: 及时删除旧 test-data.ts 文件

完成 Nitro 接口生成后 MUST 及时删除旧的 test-data.ts 文件：

- 在每个页面迁移的最后一步删除 test-data.ts
- 删除前确保 Nitro 接口和 TanStack Query 集成已完成
- 删除后运行 typecheck 确保无依赖引用错误
- 不允许保留旧的 test-data.ts 文件与新接口共存

#### Scenario: 迁移完成后立即删除

- **GIVEN** 页面 `src/pages/property-manage/expense-manage/house-charge/index.vue` 已更新使用 TanStack Query
- **AND** Nitro 接口 `server/api/property-manage/expense-manage/house-charge/list.post.ts` 已创建
- **AND** 假数据已迁移到 `server/api/property-manage/expense-manage/house-charge/mock-data.ts`
- **WHEN** 完成页面迁移的第 5 步
- **THEN** 必须立即删除 `src/pages/property-manage/expense-manage/house-charge/test-data.ts`
- **AND** 运行 `pnpm typecheck` 确保无报错

#### Scenario: 删除前验证迁移完整性

- **GIVEN** 准备删除旧 test-data.ts 文件
- **WHEN** 执行删除操作前
- **THEN** 必须确认以下条件全部满足：
  - mock-data.ts 已创建并包含完整数据
  - list.post.ts 接口已创建并正常工作
  - TanStack Query Hook 已创建
  - 页面 index.vue 已更新并移除对 test-data.ts 的导入
  - 浏览器测试页面功能正常

#### Scenario: 禁止新旧文件共存

- **GIVEN** 某个页面迁移过程中
- **WHEN** Nitro 接口和 mock-data.ts 已创建
- **THEN** 不允许同时保留 `pages/{module}/{page}/test-data.ts` 和 `server/api/{module}/{page}/mock-data.ts`
- **AND** 必须在完成页面更新后立即删除旧文件
- **AND** 旧文件的保留时间不得超过单个页面迁移周期（约 2.5 小时）
