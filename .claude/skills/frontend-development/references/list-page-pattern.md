# 列表页模式参考 (List Page Pattern)

本参考文档规定了在前端应用 (`apps/admin`) 中实现带有搜索表单的列表页面的**必须**遵循的模式。

## 变量声明顺序 (Variable Declaration Order)

为了确保一致性和正确的响应式行为，前端代码 **必须** 严格遵循以下变量声明顺序：

1.  **搜索模型引用 (`plusSearchModelRef`)**:
    - 定义搜索表单模型的响应式引用。
    - **必须** 使用 `Partial<{Page}QueryParams>` 类型约束。

2.  **默认值 (`plusSearchDefaultValues`)**:
    - 对 `plusSearchModelRef` 做**深拷贝快照**，供 Hook 初始参数与 `handleReSearch` 重置使用。
    - **必须** 使用 `cloneDeep(plusSearchModelRef)`（`import { cloneDeep } from "@pureadmin/utils"`）。
    - **禁止** `structuredClone`：对 Vue reactive / Proxy 不安全，弹窗与搜索重置场景易报错。

3.  **搜索模型 (`plusSearchModel`)**:
    - `plusSearchModelRef` 为**普通对象字面量**（非 `ref`）；`const plusSearchModel = ref(plusSearchModelRef)` 持有可编辑的搜索状态。

4.  **API Hooks (`use...Api`)**:
    - 调用数据获取的 API Hook。
    - **必须** 在模型完全初始化 **之后** 调用。

## 代码示例 (Code Example)

与主技能 `frontend-development/SKILL.md` §5.2、以及 `references/api-data-fetching.md` **保持一致**：

```typescript
import { ref } from "vue";
import { cloneDeep } from "@pureadmin/utils";

// 1. 搜索模型字面量（类型按页面 QueryParams 约束）
const plusSearchModelRef: FieldValues & Partial<UserQueryParams> = {
	name: "",
	status: "",
};

// 2. 默认值快照（深拷贝）
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

// 3. 在模型与默认值就绪后调用列表 Query Hook
const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useUserListQuery(plusSearchDefaultValues);
```

重置搜索示例：`plusSearchModel.value = cloneDeep(plusSearchDefaultValues)`（见 `api-data-fetching.md`）。

## 为什么顺序很重要 (Why This Order Matters)

1.  **响应式依赖**: API Hook 通常依赖于 `plusSearchModel` 被完全初始化并具有响应性。如果在模型准备好之前调用 Hook，初始数据请求可能会使用过时的数据或失败。
2.  **可读性**: 一致的结构使得开发人员能够更轻松地在不同页面中定位初始化逻辑。
