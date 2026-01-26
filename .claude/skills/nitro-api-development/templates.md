# Nitro v3 项目初始化模板

本文档提供项目初始化所需的完整代码模板。

## 1. nitro.config.ts 基础模板

```typescript
import { defineConfig } from "nitro";

export default defineConfig({
	/** 服务端代码目录 */
	serverDir: "./server",

	/**
	 * 配置 Nitro 扫描目录
	 * @description
	 * 明确指定 Nitro 只扫描服务端目录，避免扫描客户端代码
	 * @see https://nitro.unjs.io/config#scandirs
	 */
	scanDirs: ["./server"],

	/** 开发服务器配置 */
	devServer: {
		watch: ["./server/**/*.ts"],
	},

	/** 路径别名配置 */
	alias: {
		"@": "./src",
		server: "./server",
	},

	/** 兼容性日期 */
	compatibilityDate: "2024-09-19",

	/** TypeScript 配置 */
	typescript: {
		// typeCheck: true,
	},
});
```

## 2. nitro.config.ts Cloudflare 部署模板

```typescript
import { defineConfig } from "nitro";

export default defineConfig({
	serverDir: "./server",
	scanDirs: ["./server"],
	compatibilityDate: "2024-09-19",

	/** Cloudflare 部署配置 */
	cloudflare: {
		deployConfig: true,
		nodeCompat: true,
		wrangler: {
			/** 部署到 Cloudflare Worker 的名称 */
			name: "your-project-name",
			vars: {
				// 环境变量配置
			},
		},
	},
});
```

## 3. filter-data.ts 工具函数模板

```typescript
/**
 * @file 通用数据筛选工具函数
 * @description Generic data filtering utility function
 */

/**
 * 通用数据筛选工具函数
 * 用于根据查询参数对数据列表进行筛选
 *
 * @template TItem - 数据项的类型
 * @template TFilters - 筛选条件的类型，必须是 TItem 的部分字段
 *
 * @param data - 原始数据数组
 * @param filters - 筛选条件对象
 * @returns 筛选后的数据数组
 *
 * 筛选规则：
 * - 字符串字段：使用 `.includes()` 进行模糊匹配
 * - 其他字段（枚举、数字等）：使用 `===` 进行精确匹配
 * - 自动忽略空值、null 和 undefined
 * - 多个条件使用 AND 逻辑
 */
export function filterDataByQuery<TItem, TFilters extends Partial<TItem> = Partial<TItem>>(
	data: readonly TItem[],
	filters: TFilters,
): TItem[] {
	let filteredData = [...data];

	(Object.keys(filters) as Array<keyof TFilters>).forEach((key) => {
		const filterValue = filters[key];

		if (filterValue !== undefined && filterValue !== null && filterValue !== "") {
			filteredData = filteredData.filter((item) => {
				const itemValue = item[key as keyof TItem];

				if (typeof itemValue === "string" && typeof filterValue === "string") {
					return itemValue.includes(filterValue);
				}

				return itemValue === (filterValue as unknown as TItem[keyof TItem]);
			});
		}
	});

	return filteredData;
}
```

## 4. 标准列表接口模板

```typescript
/**
 * @file {页面名称}列表接口
 * @description {Page name} list API
 * POST /api/{module}/{sub-module}/{page}/list
 */

import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, YourListItem, YourQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockYourData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<YourListItem>>> => {
	const body = await readBody<YourQueryParams>(event);
	const defaultParams: YourQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	/** 数据筛选 */
	const filteredData = filterDataByQuery(mockYourData, filters);

	/** 分页处理 */
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	/** 返回标准格式 */
	const response: JsonVO<PageDTO<YourListItem>> = {
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

## 5. 标准树形接口模板

```typescript
/**
 * @file {页面名称}树形接口
 * @description {Page name} tree API
 * POST /api/{module}/{sub-module}/{page}/tree
 */

import { defineHandler } from "nitro/h3";
import type { JsonVO, YourTreeNode } from "@01s-11comm/type";
import { mockYourTreeData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<YourTreeNode[]>> => {
	/** 返回标准格式 */
	const response: JsonVO<YourTreeNode[]> = {
		success: true,
		code: 200,
		message: "查询成功",
		data: mockYourTreeData,
	};

	return response;
});
```

## 6. Mock 数据文件模板

```typescript
/**
 * @file {页面名称}假数据
 * @description {Page name} mock data
 */

import type { YourListItem } from "@01s-11comm/type";

/**
 * {页面名称}假数据
 * {Page name} mock data
 */
export const mockYourData: YourListItem[] = [
	{
		id: "001",
		name: "示例数据1",
		status: "启用",
		createTime: "2024-01-01 09:00:00",
		updateTime: "2024-01-15 14:30:00",
	},
	{
		id: "002",
		name: "示例数据2",
		status: "启用",
		createTime: "2024-01-02 10:00:00",
		updateTime: "2024-01-16 15:30:00",
	},
];
```

## 7. Vite 插件配置模板

```typescript
// build/plugins/index.ts 或 vite.config.ts
import { nitro } from "nitro/vite";
import vue from "@vitejs/plugin-vue";
import type { PluginOption } from "vite";

export function getPluginsList(): PluginOption[] {
	return [
		vue(),

		// 其他 Vite 插件...

		/**
		 * Nitro 全栈插件
		 * @description 将 Vite 项目变成全栈项目
		 * @see https://v3.nitro.build/docs/quick-start#add-to-a-vite-project
		 */
		nitro(),
	];
}
```

## 8. package.json 脚本配置

```json
{
	"scripts": {
		"dev": "nitro dev",
		"build": "nitro build",
		"preview": "nitro preview",
		"typecheck": "tsc --noEmit"
	}
}
```

## 9. 类型定义模板

### 9.1 列表项类型

```typescript
/**
 * @file {页面名称}类型定义
 * @description {Page name} type definitions
 */

/** {页面名称}列表项 {Page name} list item */
export interface YourListItem {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: "启用" | "禁用";
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
}

/** {页面名称}查询参数 {Page name} query params */
export interface YourQueryParams {
	/** 页码 Page index */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
	/** 名称（筛选用） Name for filtering */
	name?: string;
	/** 状态（筛选用） Status for filtering */
	status?: string;
}
```

### 9.2 树形节点类型

```typescript
/** {页面名称}树形节点 {Page name} tree node */
export interface YourTreeNode {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
	/** 父节点ID Parent ID */
	parentId: string | null;
	/** 子节点 Children */
	children?: YourTreeNode[];
}
```

## 10. 环境变量配置模板

### 10.1 .env 文件

```bash
# Nitro 运行时配置
# 注意：环境变量必须以 NITRO_ 为前缀

# API 密钥
NITRO_API_TOKEN="your-api-token"

# 数据库连接
NITRO_DATABASE_URL="your-database-url"

# 部署预设（根据部署平台选择）
# NITRO_PRESET=cloudflare_module
# NITRO_PRESET=cloudflare_pages
# NITRO_PRESET=vercel
# NITRO_PRESET=node
```

### 10.2 .env.development

```bash
# 开发环境配置
NITRO_API_TOKEN="dev-token"
NITRO_DEBUG=true
```

### 10.3 .env.production

```bash
# 生产环境配置
NITRO_API_TOKEN="prod-token"
NITRO_DEBUG=false
```
