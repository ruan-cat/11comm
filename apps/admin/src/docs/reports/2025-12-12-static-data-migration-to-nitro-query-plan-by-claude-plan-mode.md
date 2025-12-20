<!--
  这份文档是从C盘 C:\Users\pc\.claude\plans 内直接获取的claude code plan 模式生成的原生文档
  未来不再继续使用 因为不存在假数据文件了
-->

# 2025-12-12 静态假数据迁移至 Nitro + TanStack Query 实施计划

## 执行模式：仅设计不实施

**重要说明**：本计划提供完整的架构设计、代码模板和任务清单，**不执行实际代码迁移**。用户将基于此文档自行实施。

---

## 一、核心决策

基于用户确认的实施策略：

|    决策点    |           选择            |                        影响                         |
| :----------: | :-----------------------: | :-------------------------------------------------: |
| 类型迁移策略 | **一步到位** - 纯英文字段 |    不保留中文字段兼容层，所有代码必须一次性迁移     |
|  假数据位置  |  **迁移到 server 目录**   | test-data.ts 从 pages/ 移至 server/api/，与接口共存 |
|   实施范围   |      **仅设计文档**       |  生成 OpenSpec 提案、类型设计、接口模板、迁移指南   |
|   任务粒度   |       **超细粒度**        |         每个页面拆分 5 个步骤，共 ~490 任务         |

---

## 二、迁移范围统计

**基于代码库探索结果：**

- **126 个** index.vue 列表页
- **98 个** test-data.ts 假数据文件
- **84 个** 完整结构页面（含 form 组件）
- **4 个** 主要业务模块：
  - dev-team (8 页面)
  - operation-team (14 页面)
  - property-manage (60+ 页面)
  - setting-manage (7 页面)

---

## 三、架构设计

### 3.1 目录结构调整

```plain
01s-11comm/
├── apps/
│   ├── type/                                    # 新建：类型专用库
│   │   ├── package.json                         # monorepo 包配置
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   └── index.ts                     # 导出 JsonVO, PageDTO
│   │   │   └── business/                        # 业务类型（按模块组织）
│   │   │       ├── dev-team/
│   │   │       │   ├── config-manage/
│   │   │       │   │   ├── center.ts
│   │   │       │   │   ├── dictionary.ts
│   │   │       │   │   └── type.ts
│   │   │       │   └── menu-manage/
│   │   │       ├── operation-team/
│   │   │       ├── property-manage/
│   │   │       │   └── expense-manage/
│   │   │       │       └── house-charge.ts      # 业务类型文件
│   │   │       └── setting-manage/
│   │   └── index.ts                             # 统一导出
│   │
│   └── admin/
│       ├── src/
│       │   ├── api/                             # 新建：API 客户端层
│       │   │   └── property-manage/
│       │   │       └── expense-manage/
│       │   │           └── house-charge/
│       │   │               └── index.ts         # TanStack Query hooks
│       │   ├── composables/
│       │   │   └── useListQuery.ts              # 新建：通用列表查询模板
│       │   └── pages/
│       │       └── property-manage/
│       │           └── expense-manage/
│       │               └── house-charge/
│       │                   ├── index.vue        # 修改：使用 TanStack Query
│       │                   ├── test-data.ts     # 删除：迁移后移除
│       │                   └── components/
│       │
│       ├── server/                              # 修改：启用服务端
│       │   └── api/                             # Nitro 接口目录
│       │       └── property-manage/
│       │           └── expense-manage/
│       │               └── house-charge/
│       │                   ├── list.post.ts     # 新建：分页查询接口
│       │                   └── mock-data.ts     # 新建：从 test-data.ts 迁移来的数据
│       │
│       ├── nitro.config.ts                      # 修改：serverDir: "server"
│       └── package.json                         # 修改：添加 @tanstack/vue-query
```

### 3.2 技术栈版本

|        技术         |     版本      |       新增/现有        |
| :-----------------: | :-----------: | :--------------------: |
|        nitro        | 3.0.1-alpha.1 |   现有（启用服务端）   |
| @tanstack/vue-query |    ^5.62.8    |        **新增**        |
|  @01s-11comm/type   |     1.0.0     | **新增**（本地类型库） |

---

## 四、关键文件清单

### 4.1 需要修改的现有文件

1. `apps\admin\package.json` - 添加 @tanstack/vue-query 依赖
2. `apps\admin\nitro.config.ts` - 启用 serverDir
3. `apps\admin\src\main.ts` - 初始化 VueQueryPlugin
4. `apps\admin\src\pages\**\index.vue` - 替换数据获取方式（98 个文件）

### 4.2 需要创建的新文件

**类型库（apps/type）：**

- `package.json`, `tsconfig.json`, `index.ts`
- `src/business/**/*.ts` - 98 个业务类型文件

**Nitro 接口（apps/admin/server/api）：**

- `**/**/list.post.ts` - 98 个分页查询接口
- `**/**/mock-data.ts` - 98 个假数据文件

**API 客户端（apps/admin/src/api）：**

- `**/**/index.ts` - 98 个 TanStack Query hooks

**通用工具：**

- `apps/admin/src/composables/useListQuery.ts` - 通用列表查询模板

---

## 五、代码模板

### 5.1 apps/type 初始化

#### package.json

```json
{
	"name": "@01s-11comm/type",
	"version": "1.0.0",
	"description": "01s-11comm shared TypeScript type definitions",
	"type": "module",
	"main": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"import": "./dist/index.js",
			"types": "./dist/index.d.ts"
		},
		"./business/*": {
			"import": "./dist/business/*.js",
			"types": "./dist/business/*.d.ts"
		}
	},
	"scripts": {
		"build": "tsc --project tsconfig.json",
		"typecheck": "tsc --noEmit"
	},
	"dependencies": {
		"@ruan-cat/utils": "4.16.0"
	},
	"devDependencies": {
		"typescript": "^5.9.3"
	}
}
```

#### src/common/index.ts

```typescript
/** 下拉选项类型 */
export type { OptionsType } from "plus-pro-components";
```

#### 示例：src/business/property-manage/expense-manage/house-charge.ts

```typescript
import type { OptionsType } from "../../common";

// ==================== 枚举类型 ====================

/** 费用标识 Expense identifier */
export type ExpenseIdentifier = "周期性费用" | "一次性费用";

/** 费用类型 Expense type */
export type ExpenseType =
	| "物业费"
	| "押金"
	| "停车费"
	| "煤气费"
	| "取暖费"
	| "维修费"
	| "服务费"
	| "其他"
	| "水费"
	| "电费"
	| "租金"
	| "公摊费";

/** 状态 Status */
export type HouseChargeStatus = "启用" | "禁用" | "已缴费" | "未缴费";

// ==================== 接口定义 ====================

/**
 * 房屋收费列表数据
 * House charge list item
 */
export interface HouseChargeListItem {
	/** 费用项目 Expense item */
	expenseItem: string;
	/** 费用标识 Expense identifier */
	expenseIdentifier: ExpenseIdentifier;
	/** 费用类型 Expense type */
	expenseType: ExpenseType;
	/** 应收金额 Receivable amount */
	receivableAmount: string;
	/** 建账时间 Account creation time */
	accountCreationTime: string;
	/** 应收时间段 Receivable period */
	receivablePeriod: string;
	/** 说明 Description */
	description: string;
	/** 状态 Status */
	status: HouseChargeStatus;
}

/**
 * 房屋收费查询参数
 * House charge query parameters
 */
export interface HouseChargeQueryParams {
	/** 房屋编号 House number */
	houseNumber?: string;
	/** 业主名称 Owner name */
	ownerName?: string;
	/** 费用标识 Expense identifier */
	expenseIdentifier?: ExpenseIdentifier;
	/** 费用类型 Expense type */
	expenseType?: ExpenseType;
	/** 状态 Status */
	status?: HouseChargeStatus;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

// ==================== 选项常量 ====================

/** 费用标识选项 Expense identifier options */
export const expenseIdentifierOptions: OptionsType = [
	{ label: "周期性费用", value: "周期性费用" },
	{ label: "一次性费用", value: "一次性费用" },
];

/** 费用类型选项 Expense type options */
export const expenseTypeOptions: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "押金", value: "押金" },
	{ label: "停车费", value: "停车费" },
	{ label: "煤气费", value: "煤气费" },
	{ label: "取暖费", value: "取暖费" },
	{ label: "维修费", value: "维修费" },
	{ label: "服务费", value: "服务费" },
	{ label: "其他", value: "其他" },
	{ label: "水费", value: "水费" },
	{ label: "电费", value: "电费" },
	{ label: "租金", value: "租金" },
	{ label: "公摊费", value: "公摊费" },
];

/** 状态选项 Status options */
export const statusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
	{ label: "已缴费", value: "已缴费" },
	{ label: "未缴费", value: "未缴费" },
];
```

### 5.2 Nitro 接口模板

#### server/api/property-manage/expense-manage/house-charge/mock-data.ts

```typescript
import type { HouseChargeListItem } from "@01s-11comm/type";

/**
 * 房屋收费假数据
 * Mock data for house charge (migrated from test-data.ts)
 */
export const mockHouseChargeData: HouseChargeListItem[] = [
	{
		expenseItem: "物业费",
		expenseIdentifier: "周期性费用",
		expenseType: "物业费",
		receivableAmount: "1250.00",
		accountCreationTime: "2024-01-15 09:30:00",
		receivablePeriod: "2024-01-01~2024-01-31",
		description: "单价：1.5元/平方米·月 附加费：50.0",
		status: "启用",
	},
	// ... 其他 49 条数据（从原 test-data.ts 转换字段名）
];
```

#### server/api/property-manage/expense-manage/house-charge/list.post.ts

```typescript
// 必须要手动导入函数 在 nitro v3 版本内，必须在 nitro/h3 路径内手动导入函数
import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, HouseChargeListItem, HouseChargeQueryParams } from "@01s-11comm/type";
import { mockHouseChargeData } from "./mock-data";

/**
 * 房屋收费列表查询接口
 * POST /api/property-manage/expense-manage/house-charge/list
 */
export default defineHandler(async (event): Promise<JsonVO<PageDTO<HouseChargeListItem>>> => {
	// 1. 读取请求参数
	const body = await readBody<HouseChargeQueryParams>(event);
	const { houseNumber, ownerName, expenseIdentifier, expenseType, status, pageIndex = 1, pageSize = 10 } = body;

	// 2. 数据筛选
	let filteredData = [...mockHouseChargeData];

	if (houseNumber) {
		filteredData = filteredData.filter((item) => item.expenseItem.includes(houseNumber));
	}
	if (ownerName) {
		filteredData = filteredData.filter((item) => item.expenseItem.includes(ownerName));
	}
	if (expenseIdentifier) {
		filteredData = filteredData.filter((item) => item.expenseIdentifier === expenseIdentifier);
	}
	if (expenseType) {
		filteredData = filteredData.filter((item) => item.expenseType === expenseType);
	}
	if (status) {
		filteredData = filteredData.filter((item) => item.status === status);
	}

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

### 5.3 TanStack Query 集成

#### apps/admin/src/composables/useListQuery.ts

```typescript
import { useQuery } from "@tanstack/vue-query";
import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { http } from "@/utils/http";
import type { MaybeRef } from "vue";

/**
 * 通用列表查询参数基类
 */
export interface BaseListQueryParams {
	pageIndex: number;
	pageSize: number;
	[key: string]: any;
}

/**
 * 通用列表查询配置
 */
export interface UseListQueryOptions<T, P extends BaseListQueryParams> {
	/** 接口路径 */
	apiUrl: string;
	/** 查询 key 前缀 */
	queryKeyPrefix: string[];
	/** 查询参数 */
	params: MaybeRef<P>;
	/** 是否启用查询 */
	enabled?: MaybeRef<boolean>;
}

/**
 * 通用列表查询 Hook
 * @example
 * const { data, isLoading, refetch } = useListQuery({
 *   apiUrl: "/api/property-manage/expense-manage/house-charge/list",
 *   queryKeyPrefix: ["houseCharge", "list"],
 *   params: queryParams,
 * });
 */
export function useListQuery<T, P extends BaseListQueryParams>(options: UseListQueryOptions<T, P>) {
	const { apiUrl, queryKeyPrefix, params, enabled = true } = options;

	return useQuery({
		queryKey: [...queryKeyPrefix, params] as const,
		queryFn: async () => {
			const paramsValue = unref(params);
			const response = await http.post<JsonVO<PageDTO<T>>>(apiUrl, {
				data: paramsValue,
			});
			return response.data;
		},
		enabled: computed(() => unref(enabled) && unref(params).pageIndex > 0),
	});
}
```

#### apps/admin/src/api/property-manage/expense-manage/house-charge/index.ts

```typescript
import { useListQuery } from "@/composables/useListQuery";
import type { HouseChargeListItem, HouseChargeQueryParams } from "@01s-11comm/type";

/**
 * 房屋收费列表查询 Hook
 */
export function useHouseChargeListQuery(params: Ref<HouseChargeQueryParams>) {
	return useListQuery<HouseChargeListItem, HouseChargeQueryParams>({
		apiUrl: "/api/property-manage/expense-manage/house-charge/list",
		queryKeyPrefix: ["houseCharge", "list"],
		params,
	});
}
```

### 5.4 列表页迁移模板

#### apps/admin/src/pages/property-manage/expense-manage/house-charge/index.vue（部分代码）

```vue
<script setup lang="ts">
import { useHouseChargeListQuery } from "@/api/property-manage/expense-manage/house-charge";
import type { HouseChargeListItem, HouseChargeQueryParams } from "@01s-11comm/type";

// ==================== 删除的代码 ====================
// import { tableData as allTableData } from "./test-data"; // ❌ 删除
// async function loadTableData() { ... } // ❌ 删除

// ==================== 新增的代码 ====================

/** 查询参数 */
const queryParams = ref<HouseChargeQueryParams>({
	pageIndex: pagination.value.currentPage,
	pageSize: pagination.value.pageSize,
});

/** 使用 TanStack Query */
const { data, isLoading, refetch } = useHouseChargeListQuery(queryParams);

/** 监听数据变化 */
watch(data, (newData) => {
	if (newData?.data) {
		tableData.value = newData.data.list;
		pagination.value.total = newData.data.total;
		pureTableProps.value.data = tableData.value;
	}
});

/** 搜索函数 */
async function handleSearch() {
	queryParams.value = {
		...plusSearchModel.value,
		pageIndex: 1,
		pageSize: pagination.value.pageSize,
	};
}

/** 分页函数 */
async function handleCurrentPageChange(currentPage: number) {
	queryParams.value.pageIndex = currentPage;
}

async function handlePageSizeChange(pageSize: number) {
	queryParams.value.pageSize = pageSize;
	queryParams.value.pageIndex = 1;
}

/** 初始化 */
onMounted(() => {
	refetch();
});
</script>
```

---

## 六、中英文字段名映射表

基于 `house-charge/test-data.ts` 示例，完整映射表如下：

| 中文字段名 |     英文字段名      |               JSDoc 注释               |     数据类型      |
| :--------: | :-----------------: | :------------------------------------: | :---------------: |
|  费用项目  |     expenseItem     |     /\*_ 费用项目 Expense item _/      |      string       |
|  费用标识  |  expenseIdentifier  |  /\*_ 费用标识 Expense identifier _/   | ExpenseIdentifier |
|  费用类型  |     expenseType     |     /\*_ 费用类型 Expense type _/      |    ExpenseType    |
|  应收金额  |  receivableAmount   |   /\*_ 应收金额 Receivable amount _/   |      string       |
|  建账时间  | accountCreationTime | /\*_ 建账时间 Account creation time _/ |      string       |
| 应收时间段 |  receivablePeriod   |  /\*_ 应收时间段 Receivable period _/  |      string       |
|    说明    |     description     |        /\*_ 说明 Description _/        |      string       |
|    状态    |       status        |          /\*_ 状态 Status _/           | HouseChargeStatus |

**命名规范：**

- 使用驼峰命名法（camelCase）
- 优先使用完整单词，避免缩写
- 保持与业务语义的对应关系
- JSDoc 注释格式：`/** {中文} {English} */`

---

## 七、OpenSpec 文档结构

### 7.1 openspec/changes/migrate-static-data-to-nitro-query/

#### proposal.md

```markdown
# Change: Migrate static test-data to Nitro + TanStack Query

## Why

- 当前 98 个列表页使用本地假数据（test-data.ts），无法模拟真实后端交互
- 需要统一数据获取方式，为后续对接真实数据库做准备
- 提升开发体验，支持数据缓存、自动重试、loading 状态管理
- 实现前后端分离，假数据从 pages/ 迁移到 server/api/

## What Changes

- **BREAKING**: 所有类型字段名从中文切换为英文（不保留兼容层）
- 初始化 apps/type 类型库，存储所有业务类型
- 配置 Nitro 服务端，编写 POST 接口模拟后端
- 集成 @tanstack/vue-query 管理数据获取
- 迁移 98 个 test-data.ts 到 server/api/\*/mock-data.ts
- 替换 loadTableData 为 TanStack Query hooks
- 接口返回格式统一为 `JsonVO<PageDTO<T>>`

## Impact

- 影响的规范: test-data-quality, list-page-pattern, type-naming-convention
- 影响的代码:
  - apps/admin/src/pages/\*\*/test-data.ts (98 个文件 - 删除并迁移)
  - apps/admin/src/pages/\*\*/index.vue (126 个列表页 - 修改数据获取)
  - apps/admin/nitro.config.ts (启用 serverDir)
  - apps/admin/src/main.ts (初始化 VueQueryPlugin)
  - 新增: apps/type/ (完整类型库)
  - 新增: apps/admin/server/api/ (98 个接口 + mock-data)
  - 新增: apps/admin/src/api/ (98 个 TanStack Query hooks)
  - 新增: apps/admin/src/composables/useListQuery.ts

## Acceptance Criteria

- [ ] apps/type 包构建成功，类型导出正常
- [ ] 所有 Nitro 接口返回 `JsonVO<PageDTO<T>>` 格式
- [ ] 所有列表页使用 TanStack Query 获取数据
- [ ] pnpm typecheck 无报错
- [ ] 手动测试所有列表页的搜索和分页功能正常
```

#### tasks.md（超细粒度，~490 任务）

```markdown
## 任务清单

本迁移任务共分为 **6 个阶段**，预计 **490 个子任务**。

---

### 阶段 1: 基础设施搭建 (15 任务)

#### 1.1 初始化 apps/type 类型库

- [ ] 1.1.1 创建 apps/type/package.json
- [ ] 1.1.2 创建 apps/type/tsconfig.json
- [ ] 1.1.3 创建 apps/type/src/common/index.ts（导出 JsonVO, PageDTO）
- [ ] 1.1.4 创建 apps/type/src/business 目录结构
- [ ] 1.1.5 创建 apps/type/index.ts 统一导出
- [ ] 1.1.6 运行 pnpm install 安装依赖
- [ ] 1.1.7 运行 pnpm build 测试构建

#### 1.2 配置 Nitro 服务端

- [ ] 1.2.1 修改 apps/admin/nitro.config.ts（serverDir: "server"）
- [ ] 1.2.2 创建 apps/admin/server/api 目录
- [ ] 1.2.3 添加 server 别名到 nitro.config.ts

#### 1.3 安装 @tanstack/vue-query

- [ ] 1.3.1 运行 pnpm add @tanstack/vue-query -F @01s-11comm/admin
- [ ] 1.3.2 修改 apps/admin/src/main.ts 初始化 VueQueryPlugin
- [ ] 1.3.3 配置默认 query 选项（staleTime, gcTime 等）

#### 1.4 创建通用工具

- [ ] 1.4.1 创建 apps/admin/src/composables/useListQuery.ts
- [ ] 1.4.2 编写 BaseListQueryParams 接口
- [ ] 1.4.3 编写 useListQuery 函数实现

---

### 阶段 2: dev-team 模块迁移 (40 任务 = 8 页面 × 5 步骤)

#### 2.1 config-manage/center

- [ ] 2.1.1 迁移类型到 apps/type/src/business/dev-team/config-manage/center.ts
- [ ] 2.1.2 创建 server/api/dev-team/config-manage/center/mock-data.ts
- [ ] 2.1.3 创建 server/api/dev-team/config-manage/center/list.post.ts
- [ ] 2.1.4 创建 src/api/dev-team/config-manage/center/index.ts（TanStack Query hook）
- [ ] 2.1.5 更新 src/pages/dev-team/config-manage/center/index.vue 使用新接口

#### 2.2 config-manage/dictionary

- [ ] 2.2.1 迁移类型到 apps/type/src/business/dev-team/config-manage/dictionary.ts
- [ ] 2.2.2 创建 server/api/dev-team/config-manage/dictionary/mock-data.ts
- [ ] 2.2.3 创建 server/api/dev-team/config-manage/dictionary/list.post.ts
- [ ] 2.2.4 创建 src/api/dev-team/config-manage/dictionary/index.ts
- [ ] 2.2.5 更新 src/pages/dev-team/config-manage/dictionary/index.vue

#### 2.3 config-manage/type

- [ ] 2.3.1 迁移类型
- [ ] 2.3.2 创建 mock-data.ts
- [ ] 2.3.3 创建 list.post.ts
- [ ] 2.3.4 创建 TanStack Query hook
- [ ] 2.3.5 更新 index.vue

#### 2.4 config-manage/item

- [ ] 2.4.1 迁移类型
- [ ] 2.4.2 创建 mock-data.ts
- [ ] 2.4.3 创建 list.post.ts
- [ ] 2.4.4 创建 TanStack Query hook
- [ ] 2.4.5 更新 index.vue

#### 2.5 menu-manage/catalog

- [ ] 2.5.1 迁移类型
- [ ] 2.5.2 创建 mock-data.ts
- [ ] 2.5.3 创建 list.post.ts
- [ ] 2.5.4 创建 TanStack Query hook
- [ ] 2.5.5 更新 index.vue

#### 2.6 menu-manage/group

- [ ] 2.6.1 迁移类型
- [ ] 2.6.2 创建 mock-data.ts
- [ ] 2.6.3 创建 list.post.ts
- [ ] 2.6.4 创建 TanStack Query hook
- [ ] 2.6.5 更新 index.vue

#### 2.7 menu-manage/item

- [ ] 2.7.1 迁移类型
- [ ] 2.7.2 创建 mock-data.ts
- [ ] 2.7.3 创建 list.post.ts
- [ ] 2.7.4 创建 TanStack Query hook
- [ ] 2.7.5 更新 index.vue

#### 2.8 cache-manage/refresh-cache

- [ ] 2.8.1 迁移类型
- [ ] 2.8.2 创建 mock-data.ts
- [ ] 2.8.3 创建 list.post.ts
- [ ] 2.8.4 创建 TanStack Query hook
- [ ] 2.8.5 更新 index.vue

---

### 阶段 3: operation-team 模块迁移 (70 任务 = 14 页面 × 5 步骤)

#### 3.1 data-manage/property-management-company

- [ ] 3.1.1 迁移类型
- [ ] 3.1.2 创建 mock-data.ts
- [ ] 3.1.3 创建 list.post.ts
- [ ] 3.1.4 创建 TanStack Query hook
- [ ] 3.1.5 更新 index.vue

... （省略其他 13 个页面，每个 5 个任务）

---

### 阶段 4: property-manage 模块迁移 (300 任务 = 60 页面 × 5 步骤)

#### 4.1 expense-manage 子模块 (17 页面 = 85 任务)

##### 4.1.1 house-charge（示例）

- [ ] 4.1.1.1 迁移类型到 apps/type/src/business/property-manage/expense-manage/house-charge.ts
- [ ] 4.1.1.2 创建 server/api/property-manage/expense-manage/house-charge/mock-data.ts
- [ ] 4.1.1.3 创建 server/api/property-manage/expense-manage/house-charge/list.post.ts
- [ ] 4.1.1.4 创建 src/api/property-manage/expense-manage/house-charge/index.ts
- [ ] 4.1.1.5 更新 src/pages/property-manage/expense-manage/house-charge/index.vue

... （省略其他 59 个页面）

---

### 阶段 5: setting-manage 模块迁移 (35 任务 = 7 页面 × 5 步骤)

... （省略具体页面）

---

### 阶段 6: 验证和清理 (30 任务)

#### 6.1 类型检查

- [ ] 6.1.1 运行 pnpm -F @01s-11comm/type typecheck
- [ ] 6.1.2 运行 pnpm -F @01s-11comm/admin typecheck
- [ ] 6.1.3 修复所有类型错误

#### 6.2 功能测试

- [ ] 6.2.1 手动测试 dev-team 模块所有列表页
- [ ] 6.2.2 手动测试 operation-team 模块所有列表页
- [ ] 6.2.3 手动测试 property-manage 模块所有列表页
- [ ] 6.2.4 手动测试 setting-manage 模块所有列表页
- [ ] 6.2.5 验证所有搜索功能正常
- [ ] 6.2.6 验证所有分页功能正常

#### 6.3 代码清理

- [ ] 6.3.1 删除 apps/admin/src/pages/dev-team/\*\*/test-data.ts（8 个文件）
- [ ] 6.3.2 删除 apps/admin/src/pages/operation-team/\*\*/test-data.ts（14 个文件）
- [ ] 6.3.3 删除 apps/admin/src/pages/property-manage/\*\*/test-data.ts（60 个文件）
- [ ] 6.3.4 删除 apps/admin/src/pages/setting-manage/\*\*/test-data.ts（7 个文件）

#### 6.4 文档更新

- [ ] 6.4.1 更新 .claude/agents/make-list-page.md（反映新的数据获取方式）
- [ ] 6.4.2 编写迁移总结报告（apps/admin/src/docs/reports/）
- [ ] 6.4.3 更新 CLAUDE.md 项目说明

#### 6.5 OpenSpec 归档

- [ ] 6.5.1 运行 openspec validate migrate-static-data-to-nitro-query --strict
- [ ] 6.5.2 修复所有验证错误
- [ ] 6.5.3 运行 openspec archive migrate-static-data-to-nitro-query --yes
```

#### specs/test-data-migration/spec.md

````markdown
## ADDED Requirements

### Requirement: 类型库初始化

apps/type 类型库 SHALL 满足以下约束：

- 作为 monorepo 包发布，版本 1.0.0
- 提供 TypeScript 类型定义（.d.ts 文件）
- 业务类型按模块目录组织，路径与 pages/ 对应

#### Scenario: 类型库构建成功

- **GIVEN** apps/type/package.json 配置正确
- **WHEN** 运行 pnpm build
- **THEN** dist/ 目录生成 .js 和 .d.ts 文件

#### Scenario: 类型导入正常

- **GIVEN** apps/admin 依赖 @01s-11comm/type
- **WHEN** 在代码中导入 `import type { HouseChargeListItem } from "@01s-11comm/type"`
- **THEN** TypeScript 编译器识别类型，无报错

---

### Requirement: 英文字段命名规范

所有业务类型 MUST 使用英文字段名：

- 采用驼峰命名法（camelCase）
- 不允许出现任何中文变量名
- 每个字段必须包含 JSDoc 注释，格式：`/** {中文} {English} */`
- 优先使用完整单词，避免缩写

#### Scenario: 字段命名转换正确

- **GIVEN** 原字段名为 "费用项目"
- **WHEN** 迁移到类型文件
- **THEN** 字段名为 expenseItem，注释为 `/** 费用项目 Expense item */`

---

### Requirement: Nitro 接口规范

所有 Nitro 接口 MUST 满足以下约束：

- 全部使用 POST 方法（不允许 GET/PUT/DELETE）
- 接口路径与页面目录对应（例：`/api/property-manage/expense-manage/house-charge/list`）
- 返回格式为 `JsonVO<PageDTO<T>>`
- 假数据从独立的 mock-data.ts 文件导入
- 实现请求参数的筛选逻辑

#### Scenario: 接口返回格式正确

- **GIVEN** 请求 POST /api/property-manage/expense-manage/house-charge/list
- **WHEN** 接口返回响应
- **THEN** 响应结构为：
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
    "timestamp": 1234567890
  }
  ```
````

#### Scenario: 数据筛选正常

- **GIVEN** mock-data.ts 包含 50 条数据
- **WHEN** 请求参数 `{ "expenseType": "物业费", "pageIndex": 1, "pageSize": 10 }`
- **THEN** 返回筛选后的物业费数据（最多 10 条）

---

### Requirement: TanStack Query 集成

列表页 MUST 使用 TanStack Query 获取数据：

- 通过 useListQuery 通用 hook 实现
- 支持自动缓存和重试
- 监听 queryParams 变化自动触发请求
- 提供 loading 状态

#### Scenario: 列表页加载数据

- **GIVEN** 页面使用 useHouseChargeListQuery(queryParams)
- **WHEN** 组件挂载
- **THEN** 自动触发接口请求，tableData 更新

#### Scenario: 分页触发请求

- **GIVEN** 当前页码为 1
- **WHEN** 用户点击第 2 页
- **THEN** queryParams.pageIndex 更新为 2，自动触发新请求

---

### Requirement: 假数据迁移规则

test-data.ts SHALL 按以下规则迁移：

- 从 `apps/admin/src/pages/{module}/{sub-module}/{page}/test-data.ts` 迁移到 `apps/admin/server/api/{module}/{sub-module}/{page}/mock-data.ts`
- 字段名转换为英文（与类型定义一致）
- 删除原 test-data.ts 文件
- tableData 数组重命名为 mock{Page}Data（例：mockHouseChargeData）

#### Scenario: 迁移文件位置正确

- **GIVEN** 原文件 `src/pages/property-manage/expense-manage/house-charge/test-data.ts`
- **WHEN** 迁移完成
- **THEN** 新文件位于 `server/api/property-manage/expense-manage/house-charge/mock-data.ts`

---

## MODIFIED Requirements

### Requirement: 列表页数据获取方式

列表页 SHALL 通过 Nitro 接口获取数据：

- 删除本地 import test-data.ts
- 删除 loadTableData 函数中的本地过滤逻辑
- 使用 TanStack Query hooks 替代
- 监听 data 变化更新 tableData

#### Scenario: 删除旧代码

- **GIVEN** 原代码 import { tableData as allTableData } from "./test-data"
- **WHEN** 迁移完成
- **THEN** 该导入语句已删除

#### Scenario: 使用新接口

- **GIVEN** 列表页需要加载数据
- **WHEN** 调用 const { data, isLoading } = useHouseChargeListQuery(queryParams)
- **THEN** data 包含服务端返回的分页数据

---

## REMOVED Requirements

### Requirement: 本地假数据过滤

**Reason**: 数据获取迁移到 Nitro 服务端，不再需要前端本地过滤逻辑
**Migration**: 使用 Nitro 接口的筛选功能替代

---

## RENAMED Requirements

- FROM: `### Requirement: test-data.ts 字段对齐`
- TO: `### Requirement: mock-data.ts 字段对齐`

````plain

---

## 八、迁移实施指南

### 8.1 单个页面完整迁移流程

以 `property-manage/expense-manage/house-charge` 为例：

#### 步骤 1: 迁移类型（预计 30 分钟）

1. 创建类型文件：`apps/type/src/business/property-manage/expense-manage/house-charge.ts`
2. 阅读原 `test-data.ts`，提取以下内容：
   - 接口定义（如 `房屋收费_列表数据`）
   - 枚举类型（如 `费用标识类型`）
   - Options 常量（如 `费用标识Options`）
3. 转换字段名为英文（参考映射表）
4. 添加 JSDoc 注释
5. 导出到 `apps/type/index.ts`

**验证：**
```bash
cd apps/type
pnpm typecheck  # 应无报错
````

#### 步骤 2: 创建假数据文件（预计 20 分钟）

1. 创建 `server/api/property-manage/expense-manage/house-charge/mock-data.ts`
2. 从原 `test-data.ts` 复制 tableData 数组
3. 转换字段名为英文
4. 重命名数组为 `mockHouseChargeData`
5. 导入新类型：`import type { HouseChargeListItem } from "@01s-11comm/type"`

**验证：**

- 目视检查字段名是否全部转换
- 确认类型导入正确

#### 步骤 3: 编写 Nitro 接口（预计 30 分钟）

1. 创建 `server/api/property-manage/expense-manage/house-charge/list.post.ts`
2. 使用模板代码（见 5.2 节）
3. 实现筛选逻辑（与原 loadTableData 一致）
4. 确认返回格式为 `JsonVO<PageDTO<HouseChargeListItem>>`

**验证：**

```bash
# 启动开发服务器
pnpm -F @01s-11comm/admin dev

# 使用 curl 测试接口
curl -X POST http://localhost:3000/api/property-manage/expense-manage/house-charge/list \
  -H "Content-Type: application/json" \
  -d '{"pageIndex":1,"pageSize":10}'
```

#### 步骤 4: 创建 TanStack Query Hook（预计 15 分钟）

1. 创建 `src/api/property-manage/expense-manage/house-charge/index.ts`
2. 使用 useListQuery 模板（见 5.3 节）
3. 配置 queryKey 和 apiUrl

**验证：**

```bash
pnpm -F @01s-11comm/admin typecheck  # 应无报错
```

#### 步骤 5: 更新列表页（预计 40 分钟）

1. 打开 `src/pages/property-manage/expense-manage/house-charge/index.vue`
2. 删除 `import { tableData as allTableData } from "./test-data"`
3. 删除 loadTableData 函数
4. 添加 TanStack Query hook：
   ```typescript
   const { data, isLoading, refetch } = useHouseChargeListQuery(queryParams);
   ```
5. 添加 watch 监听数据变化
6. 更新 handleSearch、handleCurrentPageChange、handlePageSizeChange 函数
7. 在 onMounted 中调用 refetch()

**验证：**

```bash
# 启动开发服务器
pnpm -F @01s-11comm/admin dev

# 打开浏览器测试：
# 1. 页面加载是否显示数据
# 2. 搜索功能是否正常
# 3. 分页功能是否正常
```

#### 步骤 6: 清理（预计 5 分钟）

1. 删除 `src/pages/property-manage/expense-manage/house-charge/test-data.ts`
2. 运行 `pnpm typecheck` 确认无报错

**总计时间：** 约 2.5 小时/页面

---

### 8.2 批量迁移策略

**建议顺序：**

1. **Phase 1: 基础设施 + 试点**（1 周）
   - 初始化 apps/type
   - 安装 vue-query
   - 完成 1 个示例页面（house-charge）
   - 验证方案可行性

2. **Phase 2: dev-team 模块**（1 周）
   - 8 个页面，适合快速积累经验
   - 验证批量迁移流程

3. **Phase 3-5: 其他模块**（4-6 周）
   - 按优先级迁移 operation-team, property-manage, setting-manage

---

### 8.3 常见问题和解决方案

|           问题            |        原因        |                     解决方案                      |
| :-----------------------: | :----------------: | :-----------------------------------------------: |
|      Nitro 接口 404       |  serverDir 未启用  | 检查 nitro.config.ts 是否设置 serverDir: "server" |
|       类型导入报错        |  apps/type 未构建  |        运行 pnpm -F @01s-11comm/type build        |
| TanStack Query 不触发请求 | enabled 条件不满足 |          检查 queryParams.pageIndex > 0           |
|        数据不显示         |  watch 未正确设置  |       确认 watch(data, ...) 在 setup 中定义       |
|       字段名不匹配        |  迁移时未完全转换  |               使用映射表逐字段检查                |

---

## 九、风险和缓解措施

|               风险               | 影响等级 |                缓解措施                |
| :------------------------------: | :------: | :------------------------------------: |
| 一步到位策略导致大量页面同时失效 |  **高**  | 按模块增量迁移，每完成一个模块立即验证 |
|   字段名转换错误导致数据不显示   |  **中**  |   使用映射表自动化转换，编写脚本验证   |
| Nitro 接口与 Vite 开发服务器冲突 |  **中**  |    使用 Nitro 的开发模式，分离端口     |
|     98 个文件迁移工作量巨大      |  **高**  |   编写脚本自动化生成类型、接口、hook   |
|     类型库构建失败影响主应用     |  **低**  |     在 CI/CD 中单独构建 apps/type      |

---

## 十、自动化工具建议

为减少重复工作，建议编写以下脚本：

### 10.1 类型迁移脚本（generate-types.js）

```javascript
// 读取 test-data.ts，自动生成英文类型文件
// 功能：
// 1. 解析接口定义，转换字段名
// 2. 添加 JSDoc 注释
// 3. 生成到 apps/type/src/business/{module}/{page}.ts
```

### 10.2 接口生成脚本（generate-api.js）

```javascript
// 自动生成 Nitro 接口和 mock-data.ts
// 功能：
// 1. 读取 test-data.ts 的 tableData
// 2. 转换字段名并写入 mock-data.ts
// 3. 生成标准的 list.post.ts 接口文件
```

### 10.3 Hook 生成脚本（generate-hooks.js）

```javascript
// 自动生成 TanStack Query hooks
// 功能：
// 1. 读取类型文件
// 2. 生成 useListQuery 调用代码
// 3. 写入 src/api/{module}/{page}/index.ts
```

---

## 十一、验收标准

### 11.1 代码质量

- [ ] pnpm -F @01s-11comm/type typecheck 无报错
- [ ] pnpm -F @01s-11comm/admin typecheck 无报错
- [ ] 所有 Nitro 接口返回格式统一为 `JsonVO<PageDTO<T>>`
- [ ] 所有类型字段名为英文，包含 JSDoc 注释
- [ ] 所有列表页使用 TanStack Query 获取数据

### 11.2 功能验证

- [ ] 所有列表页初始加载正常显示数据
- [ ] 所有搜索功能正常（筛选条件生效）
- [ ] 所有分页功能正常（页码切换、每页大小调整）
- [ ] loading 状态正确显示
- [ ] 错误状态正确提示

### 11.3 文档完善

- [ ] OpenSpec 提案通过验证（openspec validate --strict）
- [ ] 更新 .claude/agents/make-list-page.md
- [ ] 编写迁移总结报告
- [ ] 更新 CLAUDE.md 项目说明

---

## 十二、后续工作

迁移完成后，可继续进行：

1. **接入真实数据库**
   - 替换 mock-data.ts 为数据库查询
   - 实现 CRUD 接口

2. **优化性能**
   - 启用 TanStack Query 的预取（prefetch）
   - 实现虚拟滚动（大数据量列表）

3. **增强用户体验**
   - 添加 optimistic updates（乐观更新）
   - 实现无限滚动（infinite scroll）

---

## 附录：关键文件路径速查

|  文件类型  |                             路径模板                              | 数量 |
| :--------: | :---------------------------------------------------------------: | :--: |
|  类型定义  |     `apps/type/src/business/{module}/{sub-module}/{page}.ts`      |  98  |
| Nitro 接口 | `apps/admin/server/api/{module}/{sub-module}/{page}/list.post.ts` |  98  |
|   假数据   | `apps/admin/server/api/{module}/{sub-module}/{page}/mock-data.ts` |  98  |
| Query Hook |    `apps/admin/src/api/{module}/{sub-module}/{page}/index.ts`     |  98  |
|   列表页   |   `apps/admin/src/pages/{module}/{sub-module}/{page}/index.vue`   | 126  |

---

**计划编写完成。** 🎉

用户可基于此文档进行实施，或使用本计划生成的 OpenSpec 提案进行迭代开发。
