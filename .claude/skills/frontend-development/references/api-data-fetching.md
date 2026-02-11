# API 数据获取参考 (API Data Fetching)

本参考文档规定了前端应用中 API Hooks 和数据获取的标准。

## API Hook 标准 (`useListQuery`)

所有列表页面的查询 Hooks **必须** 遵循此标准。

### 函数签名 (Function Signature)

Hook **必须** 接受 `initialParams` 参数：

```typescript
export function useUserListQuery(initialParams: Partial<UserQueryParams>) { ... }
```

### 返回值 (Return Values)

Hook **必须** 仅返回以下内容：

- `tableData`: 表格数据
- `pureTableProps`: 表格属性（包含数据、分页、加载状态）
- `isFetching`: 加载状态
- `updateParams`: 更新查询参数函数
- `resetParams`: 重置查询参数函数
- `doFetch`: 手动获取数据函数
- `handlePageSizeChange`: 页大小变更处理函数
- `handleCurrentPageChange`: 当前页变更处理函数

### 文件结构 (File Structure)

**位置**: `src/api/{module}/{page}/index.ts`

**模板**:

```typescript
/**
 * @file 用户列表查询 Hook
 * @description 获取用户列表数据的 API hook
 */
import { useListQuery } from "@/hooks/useListQuery";
import type { UserListItem, UserQueryParams } from "@01s-11comm/type";

const API_URL = "/api/users";
const QUERY_KEY_PREFIX = "users";

export function useUserListQuery(initialParams: Partial<UserQueryParams>) {
	return useListQuery<UserListItem, UserQueryParams>(API_URL, QUERY_KEY_PREFIX, { initialParams });
}
```

## 列表页集成 (List Page Integration)

列表页面 **必须** 使用带有 `plusSearchDefaultValues` 的 Hook。

```typescript
// 1. 定义模型引用
const plusSearchModelRef = ref<Partial<UserQueryParams>>({ ... });

// 2. 定义默认值 (使用 structuredClone)
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

// 3. 初始化模型
const plusSearchModel = ref(plusSearchModelRef);

// 4. 调用 Hook
const {
  tableData,
  pureTableProps,
  isFetching,
  updateParams,
  resetParams,
  handlePageSizeChange,
  handleCurrentPageChange
} = useUserListQuery(plusSearchDefaultValues);
```

### 搜索功能 (Search Functions)

**重置 (Reset)**:

```typescript
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}
```

**搜索 (Search)**:

```typescript
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}
```

### 模板绑定 (Template Binding)

```vue
<PureTable
	:="pureTableProps"
	:loading="isFetching"
	@page-size-change="handlePageSizeChange"
	@page-current-change="handleCurrentPageChange"
/>
```
