# Design Document

## 1. Overview

本设计文档描述了将 100 个列表页从本地假数据迁移到 Nitro 后端 + TanStack Query 体系的技术实现方案。该方案实现了真正的前后端分离，统一了类型系统，并引入了现代化的数据管理能力。

## 2. Architecture

### 2.1. 系统分层架构

```plain
┌─────────────────────────────────────────────────────────┐
│                   Browser (Vue 3 App)                    │
├─────────────────────────────────────────────────────────┤
│  Presentation Layer                                      │
│  - src/pages/**/index.vue (列表页组件)                   │
│  - src/pages/**/components/ (表单组件)                   │
├─────────────────────────────────────────────────────────┤
│  Data Fetching Layer (TanStack Query)                    │
│  - src/api/**/index.ts (Query Hooks)                     │
│  - src/composables/useListQuery.ts (通用模板)            │
├─────────────────────────────────────────────────────────┤
│  HTTP Client Layer                                       │
│  - @/utils/http (基于 @ruan-cat/utils 的 axios 封装)     │
├─────────────────────────────────────────────────────────┤
│  Type System (Cross-Cutting)                             │
│  - @01s-11comm/type (独立 TypeScript 包)                 │
│    - business/ (业务类型)                                │
│    - common/ (通用类型)                                   │
└─────────────────────────────────────────────────────────┘
                           ↓ HTTP POST
┌─────────────────────────────────────────────────────────┐
│                   Nitro Server (Node.js)                 │
├─────────────────────────────────────────────────────────┤
│  API Layer                                               │
│  - server/api/**/list.post.ts (接口处理器)               │
├─────────────────────────────────────────────────────────┤
│  Data Layer (Mock)                                       │
│  - server/api/**/mock-data.ts (假数据)                   │
│  - [Future] Database Connector                           │
└─────────────────────────────────────────────────────────┘
```

### 2.2. 数据流

```plain
1. 用户操作（点击搜索/分页）
   ↓
2. 更新 queryParams (ref)
   ↓
3. TanStack Query 监听 queryParams 变化
   ↓
4. 触发 queryFn（调用 http.post）
   ↓
5. Nitro 接口接收请求
   ↓
6. 读取 mock-data，筛选和分页
   ↓
7. 返回 JsonVO<PageDTO<T>>
   ↓
8. TanStack Query 更新 data (ref)
   ↓
9. watch(data) 触发，更新 tableData
   ↓
10. 表格组件重新渲染
```

### 2.3. 目录结构对应关系

```plain
页面路径: src/pages/property-manage/expense-manage/house-charge/
         ↓
类型定义: apps/type/src/business/property-manage/expense-manage/house-charge.ts
         ↓
API Hook: src/api/property-manage/expense-manage/house-charge/index.ts
         ↓
Nitro 接口: server/api/property-manage/expense-manage/house-charge/list.post.ts
         ↓
假数据: server/api/property-manage/expense-manage/house-charge/mock-data.ts
```

## 3. Components and Interfaces

### 3.1. 类型库组件 (@01s-11comm/type)

**职责**: 集中管理所有业务类型定义

**关键接口**:

```typescript
// 列表数据项接口
export interface {Page}ListItem {
  /** 字段说明 Field description */
  fieldName: string;
  // ...
}

// 查询参数接口
export interface {Page}QueryParams {
  /** 当前页码 Current page (1-based) */
  pageIndex: number;
  /** 每页大小 Page size */
  pageSize: number;
  // 其他筛选字段...
}

// 选项常量
export const {field}Options: OptionsType = [
  { label: "选项1", value: "选项1" },
  // ...
];
```

**导出规范**:

- 每个层级使用 index.ts 统一导出
- 使用 `export *` 全量导出
- 不使用 `export type *` 或逐个罗列导出

### 3.2. Nitro 接口组件

**职责**: 处理 HTTP 请求，返回分页数据

**关键实现**:

```typescript
import { defineHandler, readBody } from "nitro/h3";
import type { JsonVO, PageDTO, XXXListItem, XXXQueryParams } from "@01s-11comm/type";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
import { filterDataByQuery } from "server/utils/filter-data";
import { mockXXXData } from "./mock-data";

export default defineHandler(async (event): Promise<JsonVO<PageDTO<XXXListItem>>> => {
	// 1. 读取请求参数
	const body = await readBody<XXXQueryParams>(event);
	const defaultParams: XXXQueryParams = {
		pageIndex: DEFAULT_PAGE_INDEX,
		pageSize: DEFAULT_PAGE_SIZE,
	};
	const mergedParams = { ...defaultParams, ...body };
	const { pageIndex, pageSize, ...filters } = mergedParams;

	// 2. 数据筛选 - 使用通用筛选工具函数
	const filteredData = filterDataByQuery(mockXXXData, filters);

	// 3. 分页处理
	const total = filteredData.length;
	const startIndex = (pageIndex - 1) * pageSize;
	const pageData = filteredData.slice(startIndex, startIndex + pageSize);

	// 4. 返回标准格式
	const response: JsonVO<PageDTO<XXXListItem>> = {
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

### 3.3. TanStack Query Hook 组件

**职责**: 封装数据查询逻辑，提供响应式数据

**通用模板** (`useListQuery`):

```typescript
export function useListQuery<TData, TParams>(options: {
	queryKeyPrefix: string;
	apiUrl: string;
	params: Ref<TParams>;
}) {
	return useQuery({
		queryKey: computed(() => [options.queryKeyPrefix, options.params.value]),
		queryFn: async () => {
			const response = await http.post<JsonVO<PageDTO<TData>>>(options.apiUrl, options.params.value);
			return response.data;
		},
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});
}
```

**专用 Hook**:

```typescript
export function use{Page}ListQuery(params: Ref<{Page}QueryParams>) {
  return useListQuery<{Page}ListItem, {Page}QueryParams>({
    queryKeyPrefix: "property-manage/expense-manage/house-charge",
    apiUrl: "/api/property-manage/expense-manage/house-charge/list",
    params,
  });
}
```

### 3.4. 列表页组件

**职责**: 展示数据列表，处理用户交互

**关键实现**:

```vue
<script setup lang="ts">
import { ref, watch } from "vue";
import type { {Page}ListItem, {Page}QueryParams } from "@01s-11comm/type";
import { use{Page}ListQuery } from "@/api/{module}/{sub-module}/{page}";

/** 查询参数 */
const queryParams = ref<{Page}QueryParams>({
  pageIndex: 1,
  pageSize: 10,
  // 其他筛选字段...
});

/** 使用 Query Hook 获取数据 */
const { data, isLoading, error } = use{Page}ListQuery(queryParams);

/** 表格数据 */
const tableData = ref<{Page}ListItem[]>([]);

/** 监听数据变化 */
watch(
  () => data.value,
  (newData) => {
    if (newData?.data?.list) {
      tableData.value = newData.data.list;
    }
  },
  { immediate: true }
);

/** 搜索处理 */
function handleSearch() {
  queryParams.value.pageIndex = 1; // 重置页码
  // TanStack Query 会自动触发重新请求
}

/** 分页处理 */
function handlePageChange(page: number) {
  queryParams.value.pageIndex = page;
}
</script>
```

## 4. Data Models

### 4.1. 类型定义规范

```typescript
// 1. 枚举类型（使用联合类型）
/** 费用标识 Expense identifier */
export type ExpenseIdentifier = "周期性费用" | "一次性费用";

// 2. 列表数据接口
/**
 * 房屋收费列表数据
 * House charge list item
 */
export interface HouseChargeListItem {
	/** 费用项目 Expense item */
	expenseItem: string;
	/** 费用标识 Expense identifier */
	expenseIdentifier: ExpenseIdentifier;
	/** 创建时间 Create time */
	createTime: string;
	// ...
}

// 3. 查询参数接口
/**
 * 房屋收费查询参数
 * House charge query parameters
 */
export interface HouseChargeQueryParams {
	/** 房屋编号 House number */
	houseNumber?: string;
	/** 费用标识 Expense identifier */
	expenseIdentifier?: ExpenseIdentifier;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

// 4. 选项常量
/** 费用标识选项 Expense identifier options */
export const expenseIdentifierOptions: OptionsType = [
	{ label: "周期性费用", value: "周期性费用" },
	{ label: "一次性费用", value: "一次性费用" },
];
```

### 4.2. 接口返回格式

```typescript
// JsonVO<PageDTO<T>> 结构
{
  "success": true,           // 请求是否成功
  "code": 200,               // HTTP 状态码
  "message": "查询成功",      // 提示消息
  "data": {                  // 分页数据
    "list": [...],           // T[] - 数据列表
    "total": 50,             // 总记录数
    "pageIndex": 1,          // 当前页码
    "pageSize": 10,          // 每页大小
    "totalPages": 5          // 总页数
  },
  "timestamp": 1234567890    // 时间戳
}
```

## 5. Error Handling

### 5.1. 类型错误处理

**场景**: 类型库中出现重复导出

**解决方案**:

- 将公共的下拉选项变量统一放在 `apps/type/src/common/business-options.ts`
- 将公共的业务类型统一放在 `apps/type/src/common/business-types.ts`
- 避免在多个文件中定义相同名称的导出

### 5.2. 接口错误处理

**场景**: Nitro 接口请求失败

**解决方案**:

```typescript
export default defineHandler(async (event) => {
	try {
		// 正常处理逻辑...
		return response;
	} catch (error) {
		return {
			success: false,
			code: 500,
			message: error.message || "服务器错误",
			data: null,
			timestamp: Date.now(),
		};
	}
});
```

### 5.3. 前端错误处理

**场景**: TanStack Query 请求失败

**解决方案**:

```vue
<script setup lang="ts">
const { data, isLoading, error } = use{Page}ListQuery(queryParams);

/** 错误提示 */
watch(
  () => error.value,
  (err) => {
    if (err) {
      ElMessage.error(err.message || "数据加载失败");
    }
  }
);
</script>

<template>
	<div v-if="error" class="error-message">数据加载失败，请稍后重试</div>
</template>
```

## 6. Testing Strategy

### 6.1. 类型检查测试

**目标**: 确保所有代码通过 TypeScript 严格类型检查

**执行命令**:

```bash
# 检查类型库
pnpm -F @01s-11comm/type typecheck

# 检查后台项目
pnpm -F @01s-11comm/admin typecheck
```

**验收标准**:

- 无类型错误
- 无类型警告
- 所有导入路径正确解析

### 6.2. 功能测试

**测试场景**:

1. 列表页初始加载
2. 搜索功能
3. 分页功能
4. 每页大小调整
5. Loading 状态显示
6. 错误状态提示

**测试方法**:

- 启动开发服务器
- 手动访问每个迁移后的列表页
- 验证所有功能正常工作

### 6.3. 接口测试

**测试工具**: Postman 或 curl

**测试用例**:

```bash
# 测试列表接口
curl -X POST http://localhost:3000/api/property-manage/expense-manage/house-charge/list \
  -H "Content-Type: application/json" \
  -d '{
    "pageIndex": 1,
    "pageSize": 10,
    "houseNumber": "A101"
  }'
```

**验收标准**:

- 返回格式符合 JsonVO<PageDTO<T>>
- 筛选逻辑正确
- 分页逻辑正确

## 7. Implementation Strategy

### 7.1. 迁移顺序

```plain
Phase 1: 基础设施（已完成）
  ├─ 初始化 apps/type
  ├─ 安装 @tanstack/vue-query
  ├─ 创建 useListQuery 模板
  └─ 试点页面验证

Phase 2: settingManage（12 个路由）
  └─ 按三级路由逐个迁移

Phase 3: devTeam（8 个路由）✅ 已完成
  └─ 全部 8 个路由已迁移

Phase 4: operationTeam（12 个路由）✅ 已完成
  └─ 全部 12 个路由已迁移

Phase 5: propertyManage（68 个路由）
  └─ 按子模块分批迁移

Phase 6: 验证清理
  ├─ 类型检查
  ├─ 功能测试
  ├─ 删除旧文件
  └─ 文档更新
```

### 7.2. 单页面迁移步骤（10 步）

**Step 1**: 创建类型定义文件（15 分钟）

- 路径: `apps/type/src/business/{module}/{sub-module}/{page}.ts`
- 定义 ListItem、QueryParams、枚举类型、Options

**Step 2**: 创建 Mock 数据文件（10 分钟）

- 路径: `apps/admin/server/api/{module}/{sub-module}/{page}/mock-data.ts`
- 至少 20-50 条数据

**Step 3**: 创建 Nitro 接口文件（20 分钟）

- 路径: `apps/admin/server/api/{module}/{sub-module}/{page}/list.post.ts`
- 使用 filterDataByQuery 工具函数

**Step 4**: 创建前端 API Hook（10 分钟）

- 路径: `apps/admin/src/api/{module}/{sub-module}/{page}/index.ts`
- 调用 useListQuery 模板

**Step 5**: 改写列表页（30 分钟）

- 路径: `apps/admin/src/pages/{module}/{sub-module}/{page}/index.vue`
- 使用 Query Hook，移除 test-data

**Step 6**: 删除旧的假数据文件（5 分钟）

- 删除: `apps/admin/src/pages/{module}/{sub-module}/{page}/test-data.ts`

**Step 7**: 更新表单类型文件（15 分钟）

- 路径: `apps/admin/src/pages/{module}/{sub-module}/{page}/components/form.ts`
- 从类型库导入类型

**Step 8**: 更新表单组件（15 分钟）

- 路径: `apps/admin/src/pages/{module}/{sub-module}/{page}/components/form.vue`
- 使用英文字段名

**Step 9**: 运行类型检查（5 分钟）

- 执行 `pnpm typecheck`
- 修复所有类型报错

**Step 10**: 测试验证（15 分钟）

- 测试列表加载、搜索、分页
- 测试新增/编辑/删除功能

**总计**: 2.5 小时/页面

### 7.3. 主从代理任务划分

**主代理职责**:

- 阅读和理解全部任务要求
- 按业务路径拆分任务
- 新建足够数量的子代理
- 收集子代理反馈
- 验收子代理工作成果
- 更新任务进度文件

**子代理职责**:

- 严格按照 10 步流程执行
- 每次负责 2-3 个三级路由
- 以报告文件形式反馈结果
- 确保类型检查通过

**任务划分示例**:

- propertyManage.expenseManage 有 16 个三级路由
- 划分为 6 个子代理，每个负责 2-3 个路由
- 子代理并行执行，加快迁移速度

## 8. Technical Decisions

### 8.1. 使用 apps/type 作为独立 monorepo 包

**理由**:

- 类型可被多个应用共享
- 独立构建和版本管理
- 强制类型与业务逻辑分离

### 8.2. 所有接口使用 POST 方法

**理由**:

- 统一接口规范
- 支持复杂查询参数
- 避免 URL 长度限制

### 8.3. 使用 TanStack Query

**理由**:

- 成熟的数据获取库
- 内置缓存、重试、loading 状态
- 与 Vue 3 完美集成

### 8.4. 字段名一步到位切换英文

**理由**:

- 避免长期维护兼容层
- 强制统一代码规范
- 符合国际化要求

### 8.5. 假数据迁移到 server/api

**理由**:

- 实现真正的前后端分离
- 便于未来对接数据库
- 前端代码更清爽

## 9. Migration Plan

### 9.1. 回滚策略

**如果迁移失败**:

1. 保留原 test-data.ts 文件（不要立即删除）
2. 使用 git revert 回滚代码
3. 分析失败原因，修复后重新迁移

**检查点**:

- 每个模块完成后运行 typecheck
- 每个模块完成后进行功能测试
- 发现问题立即停止

### 9.2. 依赖管理

**构建顺序**:

```plain
1. apps/type (独立构建)
   ↓
2. apps/admin (依赖 apps/type)
```

## 10. Performance Considerations

### 10.1. 优化项

- TanStack Query 自动缓存减少重复请求
- 分页减少单次数据量
- 使用 staleTime 避免频繁刷新

### 10.2. 暂不实现

- 虚拟滚动（数据量 <1000 条时不需要）
- 无限滚动（分页已足够）
- 预取（优化点不明显）

## 11. Security Considerations

### 11.1. 类型安全

- 所有接口使用 TypeScript 严格类型约束
- 避免使用 any 类型
- 确保类型库导出正确

### 11.2. 数据验证

- 接口层验证请求参数
- 前端验证用户输入
- 使用 JSDoc 注释说明字段含义

## 12. References

- [TanStack Query 文档](https://tanstack.com/query/latest/docs/vue/overview)
- [Nitro 文档](https://nitro.unjs.io/)
- [pnpm Workspace](https://pnpm.io/workspaces)
- [AGENTS.md 项目规范](../../../AGENTS.md)
