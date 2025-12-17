## ADDED Requirements

## 实施顺序说明

**CRITICAL**: 在实施数据获取相关任务时，必须严格按照以下顺序执行，不允许跳步。

### 执行顺序

1. **Step 1**: TanStack Query 安装和配置（前置条件）
2. **Step 2**: 通用列表查询Hook (useListQuery)（基础设施）
3. **Step 3**: 业务专用查询Hook（业务封装）
4. **Step 4**: 查询结果返回类型（类型定义）
5. **Step 5**: 查询自动触发条件（查询行为）
6. **Step 6**: 缓存策略（性能优化）
7. **Step 7**: 错误处理（异常处理）
8. **Step 8**: 列表页数据获取方式（页面集成）
9. **Step 9**: 搜索功能实现（搜索功能）
10. **Step 10**: 分页功能实现（分页功能）
11. **Step 11**: Loading状态显示（用户体验）
12. **Step 12**: 本地假数据过滤逻辑移除（清理工作）

### 步骤依赖关系

- Step 1 是所有步骤的前置条件，必须最先完成
- Step 2-3 是 Hook 层的基础设施，必须在使用前完成
- Step 4-7 是 Hook 的配置和优化，在创建业务 Hook 时必须遵守
- Step 8-11 是列表页的改造步骤，依赖 Hook 层完成
- Step 12 是最终清理步骤，确保无旧代码残留

### 验收标准

每个步骤完成后，必须满足对应 Requirement 中的所有 Scenarios。

---

### Requirement: TanStack Query 安装和配置 (Step 1)

apps/admin MUST 安装并初始化 @tanstack/vue-query：

- 版本：^5.62.8
- 在 main.ts 中初始化 VueQueryPlugin
- 配置全局默认选项（staleTime, gcTime, retry）
- 提供 Vue DevTools 集成（开发模式）

#### Scenario: 安装依赖

- **GIVEN** apps/admin/package.json
- **WHEN** 运行 `pnpm add @tanstack/vue-query -F @01s-11comm/admin`
- **THEN** package.json dependencies 包含 `"@tanstack/vue-query": "^5.62.8"`
- **AND** pnpm-lock.yaml 更新

#### Scenario: VueQueryPlugin 初始化

- **GIVEN** apps/admin/src/main.ts
- **WHEN** 初始化 Vue 应用
- **THEN** 代码包含：

```typescript
import { VueQueryPlugin } from "@tanstack/vue-query";

app.use(VueQueryPlugin, {
	queryClientConfig: {
		defaultOptions: {
			queries: {
				staleTime: 5 * 60 * 1000, // 5分钟
				gcTime: 10 * 60 * 1000, // 10分钟
				retry: 1,
				refetchOnWindowFocus: false,
			},
		},
	},
});
```

#### Scenario: DevTools 可用（开发模式）

- **GIVEN** 开发环境运行应用
- **WHEN** 打开浏览器 Vue DevTools
- **THEN** 可以看到 TanStack Query 面板
- **AND** 显示所有活动查询和缓存状态

---

### Requirement: 通用列表查询 Hook (useListQuery) (Step 2)

apps/admin MUST 提供通用列表查询模板：

- 文件位置：`src/composables/useListQuery.ts`
- 接受泛型参数 `<T, P extends BaseListQueryParams>`
- 封装 useQuery 的标准用法
- 支持响应式参数（MaybeRef）
- 自动处理 enabled 条件

#### Scenario: useListQuery 接口定义

- **GIVEN** src/composables/useListQuery.ts
- **WHEN** 定义函数签名
- **THEN** 代码为：

```typescript
export interface BaseListQueryParams {
	pageIndex: number;
	pageSize: number;
	[key: string]: any;
}

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

export function useListQuery<T, P extends BaseListQueryParams>(options: UseListQueryOptions<T, P>);
```

#### Scenario: useQuery 封装

- **GIVEN** useListQuery 实现
- **WHEN** 调用 useQuery
- **THEN** 代码包含：

```typescript
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
```

#### Scenario: 响应式参数支持

- **GIVEN** 调用 useListQuery({ params: ref(queryParams) })
- **WHEN** 修改 queryParams.value.pageIndex
- **THEN** 自动触发新的查询请求
- **AND** queryKey 包含最新参数值

---

### Requirement: 业务专用查询 Hook (Step 3)

每个列表页 MUST 提供专用的 TanStack Query Hook：

- 文件位置：`src/api/{module}/{page}/index.ts`
- 导出命名：`use{Page}ListQuery`
- 调用 useListQuery 通用模板
- 配置正确的 apiUrl 和 queryKeyPrefix

#### Scenario: Hook 文件位置

- **GIVEN** 页面路径 `src/pages/property-manage/expense-manage/house-charge/index.vue`
- **WHEN** 创建查询 Hook
- **THEN** 文件路径为 `src/api/property-manage/expense-manage/house-charge/index.ts`

#### Scenario: Hook 命名规范

- **GIVEN** 页面名称 house-charge
- **WHEN** 定义 Hook 函数
- **THEN** 函数名为 `useHouseChargeListQuery`
- **AND** 使用 PascalCase + List + Query 后缀

#### Scenario: Hook 实现

- **GIVEN** src/api/property-manage/expense-manage/house-charge/index.ts
- **WHEN** 编写 Hook 代码
- **THEN** 代码为：

```typescript
import { useListQuery } from "@/composables/useListQuery";
import type { HouseChargeListItem, HouseChargeQueryParams } from "@01s-11comm/type";

export function useHouseChargeListQuery(params: Ref<HouseChargeQueryParams>) {
	return useListQuery<HouseChargeListItem, HouseChargeQueryParams>({
		apiUrl: "/api/property-manage/expense-manage/house-charge/list",
		queryKeyPrefix: ["houseCharge", "list"],
		params,
	});
}
```

#### Scenario: apiUrl 路径正确

- **GIVEN** Nitro 接口 `server/api/property-manage/expense-manage/house-charge/list.post.ts`
- **WHEN** 配置 apiUrl
- **THEN** apiUrl = "/api/property-manage/expense-manage/house-charge/list"
- **AND** 路径与接口文件对应

---

### Requirement: 查询结果返回类型 (Step 4)

useListQuery 和业务 Hook MUST 返回完整的查询状态：

- data - 响应数据（`JsonVO<PageDTO<T>>`）
- isLoading - 加载状态
- isError - 错误状态
- error - 错误对象
- refetch - 手动重新请求函数
- isFetching - 后台刷新状态

#### Scenario: 返回类型完整性

- **GIVEN** 调用 const result = useHouseChargeListQuery(params)
- **WHEN** 检查返回对象
- **THEN** result 包含以下属性：
  - `data: Ref<JsonVO<PageDTO<HouseChargeListItem>> | undefined>`
  - `isLoading: Ref<boolean>`
  - `isError: Ref<boolean>`
  - `error: Ref<Error | null>`
  - `refetch: () => Promise<void>`
  - `isFetching: Ref<boolean>`

#### Scenario: data 数据结构

- **GIVEN** 查询成功
- **WHEN** 访问 data.value
- **THEN** 结构为：

```typescript
{
  success: true,
  code: 200,
  message: "查询成功",
  data: {
    list: HouseChargeListItem[],
    total: number,
    pageIndex: number,
    pageSize: number,
    totalPages: number
  },
  timestamp: number
}
```

---

### Requirement: 查询自动触发条件 (Step 5)

查询 MUST 在以下情况自动触发：

- 组件挂载时（如果 enabled = true）
- params 响应式对象变化时
- refetch() 被手动调用时
- 查询从缓存失效恢复时

#### Scenario: 组件挂载触发

- **GIVEN** 列表页组件 onMounted
- **WHEN** queryParams 有效（pageIndex > 0）
- **THEN** 自动发起接口请求
- **AND** isLoading = true
- **WHEN** 请求完成
- **THEN** data.value 包含响应数据
- **AND** isLoading = false

#### Scenario: 参数变化触发

- **GIVEN** queryParams = { pageIndex: 1, pageSize: 10 }
- **WHEN** 修改 queryParams.value.pageIndex = 2
- **THEN** 自动发起新请求（pageIndex = 2）
- **AND** queryKey 更新为包含新参数

#### Scenario: 手动 refetch

- **GIVEN** 查询已完成
- **WHEN** 调用 refetch()
- **THEN** 使用当前 params 重新请求
- **AND** isFetching = true（不是 isLoading）

---

### Requirement: 缓存策略 (Step 6)

TanStack Query MUST 实现智能缓存：

- staleTime: 5 分钟 - 数据新鲜时间
- gcTime: 10 分钟 - 垃圾回收时间
- 相同 queryKey 共享缓存
- 参数变化视为不同查询

#### Scenario: 缓存命中

- **GIVEN** 首次请求 pageIndex = 1, pageSize = 10
- **WHEN** 5 分钟内再次请求相同参数
- **THEN** 直接返回缓存数据
- **AND** 不发起网络请求
- **AND** isLoading = false

#### Scenario: 缓存过期

- **GIVEN** 首次请求完成，经过 5 分钟
- **WHEN** 再次访问相同页面
- **THEN** 先返回缓存数据（快速显示）
- **AND** 后台发起新请求更新数据
- **AND** isFetching = true, isLoading = false

#### Scenario: 不同参数不共享缓存

- **GIVEN** 请求 A: { pageIndex: 1, expenseType: "物业费" }
- **AND** 请求 B: { pageIndex: 1, expenseType: "水费" }
- **WHEN** 执行两次查询
- **THEN** 生成两个不同的 queryKey
- **AND** 各自维护独立缓存

---

### Requirement: 错误处理 (Step 7)

查询失败 MUST 提供明确的错误状态：

- isError = true
- error 对象包含错误详情
- 自动重试 1 次（retry: 1）
- 不阻塞 UI 渲染

#### Scenario: 网络错误

- **GIVEN** 接口返回 500 Internal Server Error
- **WHEN** 查询执行
- **THEN** 自动重试 1 次
- **WHEN** 重试仍失败
- **THEN** isError = true
- **AND** error.value 包含错误信息

#### Scenario: 错误不阻塞 UI

- **GIVEN** 查询失败
- **WHEN** 页面渲染
- **THEN** 可以通过 `v-if="isError"` 显示错误提示
- **AND** 不影响页面其他部分

---

## MODIFIED Requirements

### Requirement: 列表页数据获取方式 (Step 8)

**FROM**: 本地 import test-data.ts，使用 loadTableData 函数过滤
**TO**: 调用 TanStack Query Hook 获取服务端数据

列表页 MUST 使用 TanStack Query 获取数据：

- 删除 `import { tableData as allTableData } from "./test-data"`
- 删除 loadTableData 函数
- 使用 `const { data, isLoading, refetch } = use{Page}ListQuery(queryParams)`
- 监听 data 变化更新 tableData

#### Scenario: 删除旧代码

- **GIVEN** 原列表页代码 import { tableData as allTableData } from "./test-data"
- **WHEN** 迁移完成
- **THEN** 该导入语句已删除
- **AND** allTableData 变量不再存在

#### Scenario: 删除 loadTableData

- **GIVEN** 原代码包含：

```typescript
async function loadTableData() {
	let filteredData = [...allTableData];
	// 筛选逻辑
	tableData.value = filteredData.slice(startIndex, endIndex);
	pagination.value.total = filteredData.length;
}
```

- **WHEN** 迁移完成
- **THEN** loadTableData 函数已删除
- **AND** 筛选逻辑移至 Nitro 接口

#### Scenario: 使用 TanStack Query Hook

- **GIVEN** 列表页 setup 函数
- **WHEN** 编写数据获取代码
- **THEN** 代码为：

```typescript
import { useHouseChargeListQuery } from "@/api/property-manage/expense-manage/house-charge";

const queryParams = ref<HouseChargeQueryParams>({
	pageIndex: pagination.value.currentPage,
	pageSize: pagination.value.pageSize,
});

const { data, isLoading, refetch } = useHouseChargeListQuery(queryParams);
```

#### Scenario: 监听数据变化

- **GIVEN** TanStack Query 返回 data
- **WHEN** 设置 watch 监听器
- **THEN** 代码为：

```typescript
watch(data, (newData) => {
	if (newData?.data) {
		tableData.value = newData.data.list;
		pagination.value.total = newData.data.total;
		pureTableProps.value.data = tableData.value;
	}
});
```

---

### Requirement: 搜索功能实现 (Step 9)

**FROM**: 调用 loadTableData() 本地过滤
**TO**: 更新 queryParams 触发新请求

搜索功能 MUST 通过修改 queryParams 实现：

- handleSearch 函数更新 queryParams.value
- 重置 pageIndex 为 1
- 自动触发查询

#### Scenario: 搜索按钮点击

- **GIVEN** 用户填写搜索表单（如 expenseType: "物业费"）
- **WHEN** 点击搜索按钮
- **THEN** handleSearch 执行：

```typescript
async function handleSearch() {
	queryParams.value = {
		...plusSearchModel.value,
		pageIndex: 1,
		pageSize: pagination.value.pageSize,
	};
}
```

- **AND** TanStack Query 自动发起新请求

#### Scenario: 重置搜索

- **GIVEN** 用户点击重置按钮
- **WHEN** handleReset 执行
- **THEN** plusSearchModel.value 清空
- **AND** queryParams.value 重置为默认值
- **AND** 自动触发查询

---

### Requirement: 分页功能实现 (Step 10)

**FROM**: 手动切片 allTableData
**TO**: 更新 queryParams.pageIndex/pageSize

分页 MUST 通过修改 queryParams 实现：

- handleCurrentPageChange 更新 pageIndex
- handlePageSizeChange 更新 pageSize 并重置 pageIndex
- 自动触发查询

#### Scenario: 页码切换

- **GIVEN** 当前 pageIndex = 1
- **WHEN** 用户点击第 2 页
- **THEN** handleCurrentPageChange(2) 执行：

```typescript
async function handleCurrentPageChange(currentPage: number) {
	queryParams.value.pageIndex = currentPage;
}
```

- **AND** 自动发起请求（pageIndex = 2）

#### Scenario: 每页大小切换

- **GIVEN** 当前 pageSize = 10, pageIndex = 3
- **WHEN** 用户切换为 pageSize = 20
- **THEN** handlePageSizeChange(20) 执行：

```typescript
async function handlePageSizeChange(pageSize: number) {
	queryParams.value.pageSize = pageSize;
	queryParams.value.pageIndex = 1; // 重置到第一页
}
```

- **AND** 自动发起请求

---

### Requirement: Loading 状态显示 (Step 11)

列表页 MUST 使用 isLoading 显示加载状态：

- 表格 loading 属性绑定 isLoading
- 禁用搜索按钮（可选）
- 防止重复请求

#### Scenario: 表格 loading

- **GIVEN** PureTable 组件
- **WHEN** 绑定 loading 属性
- **THEN** 代码为：

```vue
<PureTable :loading="isLoading" :data="tableData" />
```

- **WHEN** isLoading = true
- **THEN** 表格显示骨架屏或 loading 遮罩

#### Scenario: 搜索按钮禁用

- **GIVEN** 查询进行中（isLoading = true）
- **WHEN** 用户点击搜索按钮
- **THEN** 按钮禁用，不触发新请求
- **AND** 按钮文本显示"搜索中..."

---

## REMOVED Requirements

### Requirement: 本地假数据过滤逻辑 (Step 12)

**Reason**: 数据获取迁移到 Nitro 服务端，不再需要前端本地过滤

**Migration**: 使用 Nitro 接口的筛选功能替代

#### Scenario: 删除本地过滤

- **GIVEN** 原代码包含：

```typescript
let filteredData = [...allTableData];
if (searchForm.expenseType) {
	filteredData = filteredData.filter((item) => item.费用类型 === searchForm.expenseType);
}
```

- **WHEN** 迁移完成
- **THEN** 该代码已删除
- **AND** 筛选逻辑移至 server/api/.../list.post.ts
