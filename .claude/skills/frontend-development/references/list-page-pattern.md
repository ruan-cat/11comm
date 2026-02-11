# 列表页模式参考 (List Page Pattern)

本参考文档规定了在前端应用 (`apps/admin`) 中实现带有搜索表单的列表页面的**必须**遵循的模式。

## 变量声明顺序 (Variable Declaration Order)

为了确保一致性和正确的响应式行为，前端代码 **必须** 严格遵循以下变量声明顺序：

1.  **搜索模型引用 (`plusSearchModelRef`)**:
    - 定义搜索表单模型的响应式引用。
    - **必须** 使用 `Partial<{Page}QueryParams>` 类型约束。

2.  **默认值 (`plusSearchDefaultValues`)**:
    - 定义搜索表单的默认值。

3.  **搜索模型初始化 (`plusSearchModel`)**:
    - 使用 `useMode` 或类似组合式函数初始化完整的搜索模型。
    - 结合 `plusSearchModelRef` 和 `plusSearchDefaultValues`。

4.  **API Hooks (`use...Api`)**:
    - 调用数据获取的 API Hook。
    - **必须** 在模型完全初始化 **之后** 调用。

## 代码示例 (Code Example)

```typescript
// 1. 定义搜索模型引用 (Define Search Model Ref)
const plusSearchModelRef = ref<Partial<UserQueryParams>>({});

// 2. 定义默认值 (Define Default Values)
const plusSearchDefaultValues = {
	status: "enabled",
	role: "admin",
};

// 3. 初始化搜索模型 (Initialize Search Model)
const { plusSearchModel } = useMode({
	plusSearchModelRef,
	plusSearchDefaultValues,
});

// 4. 调用 API Hook (Call API Hook)
const { data, refresh } = useUserApi({
	searchModel: plusSearchModel,
});
```

## 为什么顺序很重要 (Why This Order Matters)

1.  **响应式依赖**: API Hook 通常依赖于 `plusSearchModel` 被完全初始化并具有响应性。如果在模型准备好之前调用 Hook，初始数据请求可能会使用过时的数据或失败。
2.  **可读性**: 一致的结构使得开发人员能够更轻松地在不同页面中定位初始化逻辑。
