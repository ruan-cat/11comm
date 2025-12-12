# 2025-12-12 静态假数据迁移至 Nitro + TanStack Query 实施计划

## 1. 概述

本报告提供了将 98 个列表页的本地静态假数据迁移至 Nitro 全栈接口，并使用 TanStack Query 管理数据获取的完整实施计划。

**执行模式：** 仅设计不实施

**重要说明：** 本计划提供完整的架构设计、代码模板和任务清单，**不执行实际代码迁移**。用户将基于此文档自行实施。

---

## 2. 核心决策

基于用户确认的实施策略：

|    决策点    |           选择            |                        影响                         |
| :----------: | :-----------------------: | :-------------------------------------------------: |
| 类型迁移策略 | **一步到位** - 纯英文字段 |    不保留中文字段兼容层，所有代码必须一次性迁移     |
|  假数据位置  |  **迁移到 server 目录**   | test-data.ts 从 pages/ 移至 server/api/，与接口共存 |
|   实施范围   |      **仅设计文档**       |  生成 OpenSpec 提案、类型设计、接口模板、迁移指南   |
|   任务粒度   |       **超细粒度**        |         每个页面拆分 5 个步骤，共 ~490 任务         |

---

## 3. 迁移范围统计

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

## 4. 架构设计

### 4.1 目录结构调整

```log
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

### 4.2 技术栈版本

|        技术         |     版本      |          新增/现有           |
| :-----------------: | :-----------: | :--------------------------: |
|        nitro        | 3.0.1-alpha.1 |      现有（启用服务端）      |
| @tanstack/vue-query |    ^5.62.8    |           **新增**           |
|   @ruan-cat/utils   |    4.16.0     | 现有（提供 JsonVO, PageDTO） |
|  @01s-11comm/type   |     1.0.0     |    **新增**（本地类型库）    |

---

## 5. 关键文件清单

### 5.1 需要修改的现有文件

1. `apps\admin\package.json` - 添加 @tanstack/vue-query 依赖
2. `apps\admin\nitro.config.ts` - 启用 serverDir
3. `apps\admin\src\main.ts` - 初始化 VueQueryPlugin
4. `apps\admin\src\pages\**\index.vue` - 替换数据获取方式（98 个文件）

### 5.2 需要创建的新文件

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

## 6. 代码模板

### 6.1 apps/type 初始化

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
/** 通用响应类型 */
export type { JsonVO, PageDTO } from "@ruan-cat/utils";

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

### 6.2 Nitro 接口模板

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
// 必须主动导入来自 `nitro/h3` 的 defineHandler 和 readBody ，在 nitro v3 版本内要按照该写法编写
import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO } from "@ruan-cat/utils";
import type { HouseChargeListItem, HouseChargeQueryParams } from "@01s-11comm/type";
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

	// 4. 返回标准格式 必须要用完整的对象来约束返回的数据格式
	/** 返回标准格式 */
	const response: JsonVO<PageDTO<HouseChargeListItem>> = {
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

### 6.3 TanStack Query 集成

#### apps/admin/src/composables/useListQuery.ts

```typescript
import { useQuery } from "@tanstack/vue-query";
import type { JsonVO, PageDTO } from "@ruan-cat/utils";
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

### 6.4 列表页迁移模板

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

## 7. 中英文字段名映射表

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

## 8. OpenSpec 文档结构

### 8.1 proposal.md（提案文件）

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

### 8.2 tasks.md（任务清单 - 超细粒度）

本迁移任务共分为 **6 个阶段**，预计 **490 个子任务**。

#### 阶段概览

|   阶段   |           名称           | 任务数  | 预计时间  |
| :------: | :----------------------: | :-----: | :-------: |
|    1     |       基础设施搭建       |   15    |   1 周    |
|    2     |    dev-team 模块迁移     |   40    |   1 周    |
|    3     | operation-team 模块迁移  |   70    |   2 周    |
|    4     | property-manage 模块迁移 |   300   |   6 周    |
|    5     | setting-manage 模块迁移  |   35    |   1 周    |
|    6     |        验证和清理        |   30    |   1 周    |
| **总计** |                          | **490** | **12 周** |

详细任务清单见计划文档第 7.1 节。

---

## 9. 迁移实施指南

### 9.1 单个页面完整迁移流程

以 `property-manage/expense-manage/house-charge` 为例：

|   步骤   |         工作内容         |   预计时间   |    验证方式    |
| :------: | :----------------------: | :----------: | :------------: |
|    1     |   迁移类型到 apps/type   |   30 分钟    | pnpm typecheck |
|    2     |    创建 mock-data.ts     |   20 分钟    | 目视检查字段名 |
|    3     |     编写 Nitro 接口      |   30 分钟    | curl 测试接口  |
|    4     | 创建 TanStack Query Hook |   15 分钟    | pnpm typecheck |
|    5     |   更新列表页 index.vue   |   40 分钟    | 浏览器功能测试 |
|    6     |  清理删除 test-data.ts   |    5 分钟    | pnpm typecheck |
| **总计** |                          | **2.5 小时** |                |

### 9.2 批量迁移策略

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

### 9.3 常见问题和解决方案

|           问题            |        原因        |                     解决方案                      |
| :-----------------------: | :----------------: | :-----------------------------------------------: |
|      Nitro 接口 404       |  serverDir 未启用  | 检查 nitro.config.ts 是否设置 serverDir: "server" |
|       类型导入报错        |  apps/type 未构建  |        运行 pnpm -F @01s-11comm/type build        |
| TanStack Query 不触发请求 | enabled 条件不满足 |          检查 queryParams.pageIndex > 0           |
|        数据不显示         |  watch 未正确设置  |       确认 watch(data, ...) 在 setup 中定义       |
|       字段名不匹配        |  迁移时未完全转换  |               使用映射表逐字段检查                |

---

## 10. 风险和缓解措施

|               风险               | 影响等级 |                缓解措施                |
| :------------------------------: | :------: | :------------------------------------: |
| 一步到位策略导致大量页面同时失效 |  **高**  | 按模块增量迁移，每完成一个模块立即验证 |
|   字段名转换错误导致数据不显示   |  **中**  |   使用映射表自动化转换，编写脚本验证   |
| Nitro 接口与 Vite 开发服务器冲突 |  **中**  |    使用 Nitro 的开发模式，分离端口     |
|     98 个文件迁移工作量巨大      |  **高**  |   编写脚本自动化生成类型、接口、hook   |
|     类型库构建失败影响主应用     |  **低**  |     在 CI/CD 中单独构建 apps/type      |

---

## 11. 自动化工具建议

为减少重复工作，建议编写以下脚本：

### 11.1 类型迁移脚本（generate-types.js）

功能：

1. 解析 test-data.ts 中的接口定义
2. 转换字段名为英文
3. 添加 JSDoc 注释
4. 生成到 apps/type/src/business/{module}/{page}.ts

### 11.2 接口生成脚本（generate-api.js）

功能：

1. 读取 test-data.ts 的 tableData
2. 转换字段名并写入 mock-data.ts
3. 生成标准的 list.post.ts 接口文件

### 11.3 Hook 生成脚本（generate-hooks.js）

功能：

1. 读取类型文件
2. 生成 useListQuery 调用代码
3. 写入 src/api/{module}/{page}/index.ts

---

## 12. 验收标准

### 12.1 代码质量

- [ ] pnpm -F @01s-11comm/type typecheck 无报错
- [ ] pnpm -F @01s-11comm/admin typecheck 无报错
- [ ] 所有 Nitro 接口返回格式统一为 `JsonVO<PageDTO<T>>`
- [ ] 所有类型字段名为英文，包含 JSDoc 注释
- [ ] 所有列表页使用 TanStack Query 获取数据

### 12.2 功能验证

- [ ] 所有列表页初始加载正常显示数据
- [ ] 所有搜索功能正常（筛选条件生效）
- [ ] 所有分页功能正常（页码切换、每页大小调整）
- [ ] loading 状态正确显示
- [ ] 错误状态正确提示

### 12.3 文档完善

- [ ] OpenSpec 提案通过验证（openspec validate --strict）
- [ ] 更新 .claude/agents/make-list-page.md
- [ ] 编写迁移总结报告
- [ ] 更新 CLAUDE.md 项目说明

---

## 13. 后续工作

迁移完成后，可继续进行：

### 13.1 接入真实数据库

- 替换 mock-data.ts 为数据库查询
- 实现 CRUD 接口

### 13.2 优化性能

- 启用 TanStack Query 的预取（prefetch）
- 实现虚拟滚动（大数据量列表）

### 13.3 增强用户体验

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

**报告生成时间：** 2025-12-12

**报告编制：** Claude Sonnet 4.5

用户可基于此报告进行实施，或使用本报告生成的 OpenSpec 提案进行迭代开发。
