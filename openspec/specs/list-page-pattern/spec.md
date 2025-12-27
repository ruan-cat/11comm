# list-page-pattern Specification

## Purpose
TBD - created by archiving change migrate-static-data-to-nitro-query. Update Purpose after archive.
## Requirements
### Requirement: 搜索表单变量声明顺序

搜索表单相关的三个核心变量 MUST 按以下顺序声明,且 MUST 在调用 API Hook 之前:

#### Scenario: 变量声明顺序规则

- **GIVEN** 列表页需要搜索功能
- **WHEN** 声明搜索表单变量
- **THEN** 必须按以下顺序声明:
  1. `plusSearchModelRef` - 原始搜索对象(带 Partial 类型约束)
  2. `plusSearchDefaultValues` - 默认值(用于重置)
  3. `plusSearchModel` - 响应式搜索模型
- **AND** 这三个变量必须在调用 `use{Page}ListQuery()` 之前声明
- **AND** 这三个变量必须连续声明,中间不能插入其他代码

#### Scenario: plusSearchModelRef 类型约束规则

- **WHEN** 声明 `plusSearchModelRef` 变量
- **THEN** 类型必须为 `FieldValues & Partial<{Page}QueryParams>`
- **AND** 必须包含 `Partial` 包裹业务查询参数类型
- **AND** 不能省略 `Partial` 约束

**错误示例**:

```typescript
// ❌ 错误: 在 API Hook 之后声明
const { tableData } = useConfigCenterListQuery(plusSearchDefaultValues);
const plusSearchModelRef: FieldValues & Partial<ConfigCenterQueryParams> = {};
```

**正确示例**:

```typescript
// ✅ 正确: 严格按顺序在 API Hook 之前声明
const plusSearchModelRef: FieldValues & Partial<ConfigCenterQueryParams> = {
	configName: "",
	configType: "",
};
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

// 然后才调用 API Hook
const { tableData, pureTableProps, isFetching, updateParams, resetParams } =
	useConfigCenterListQuery(plusSearchDefaultValues);
```

#### Scenario: 迁移现有代码时的处理方式

- **WHEN** 迁移现有列表页代码
- **THEN** 如果发现这三个变量在 API Hook 之后或顺序错误
- **THEN** 必须使用移动代码的方式,将变量移动到 API Hook 之前
- **AND** 不能新增代码,必须移动现有代码
- **AND** 确保移动后的代码顺序符合规范

---

