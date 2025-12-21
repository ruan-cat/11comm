## MODIFIED Requirements

### Requirement: 列表页必须正确调用 API Hook 并传递初始参数

所有列表页组件 MUST 正确调用对应的 API Hook 函数,并传递 `plusSearchDefaultValues` 作为初始参数。

#### Scenario: 列表页正确调用 API Hook

- **WHEN** 列表页组件使用 API Hook 获取数据
- **THEN** 必须传递 `plusSearchDefaultValues` 参数
- **AND** 必须解构出标准的返回值: `tableData`、`pureTableProps`、`isFetching`、`updateParams`、`resetParams`、`doFetch`、`handlePageSizeChange`、`handleCurrentPageChange`

#### Scenario: 列表页不手动定义分页相关代码

- **WHEN** 列表页组件需要分页功能
- **THEN** 必须直接使用 Hook 返回的 `pureTableProps`
- **AND** 不能手动定义 `pagination` 计算属性
- **AND** 不能手动定义 `pureTableProps` ref
- **AND** 不能手动实现 `handlePageSizeChange` 和 `handleCurrentPageChange` 函数

#### Scenario: 列表页使用正确的 loading 状态

- **WHEN** 列表页绑定 PureTable 的 loading 属性
- **THEN** 必须使用 `isFetching` 变量
- **AND** 不能使用 `isLoading` 变量

## ADDED Requirements

### Requirement: 列表页搜索函数必须使用标准写法

所有列表页的搜索和重置函数 MUST 遵循固定的代码模板,确保行为一致性。

#### Scenario: 重置搜索条件的标准写法

- **WHEN** 用户点击重置按钮
- **THEN** `handleReSearch` 函数必须使用 `structuredClone(plusSearchDefaultValues)` 重置搜索表单
- **AND** 必须调用 `resetParams()` 重置查询参数
- **AND** 不能使用 `cloneDeep` 或其他克隆函数

#### Scenario: 执行搜索的标准写法

- **WHEN** 用户点击搜索按钮
- **THEN** `handleSearch` 函数必须调用 `updateParams({ ...plusSearchModel.value, pageIndex: 1 })`
- **AND** 必须将 `pageIndex` 重置为 1

#### Scenario: 搜索表单初始化的标准写法

- **WHEN** 列表页组件初始化搜索表单
- **THEN** 必须定义 `plusSearchModelRef` 对象,类型为 `FieldValues & Partial<{Page}QueryParams>`
- **AND** 必须包含 `Partial` 类型约束,不能省略
- **AND** 必须使用 `structuredClone(plusSearchModelRef)` 创建 `plusSearchDefaultValues`
- **AND** 必须使用 `ref(plusSearchModelRef)` 创建 `plusSearchModel`
- **AND** 这三个变量必须按顺序连续声明,且在 API Hook 调用之前

### Requirement: 搜索表单变量必须严格按顺序声明且在 API Hook 之前

所有列表页的搜索表单变量 MUST 严格按照固定顺序声明,且 MUST 在调用 API Hook 之前声明完成。

#### Scenario: 变量声明顺序的强制要求

- **WHEN** 编写或迁移列表页代码
- **THEN** 必须按以下顺序声明搜索表单变量:
  1. **第一步**: 声明 `plusSearchModelRef`,类型必须为 `FieldValues & Partial<{Page}QueryParams>`
  2. **第二步**: 声明 `plusSearchDefaultValues = structuredClone(plusSearchModelRef)`
  3. **第三步**: 声明 `plusSearchModel = ref(plusSearchModelRef)`
- **AND** 这三个变量必须连续声明,中间不能插入其他无关代码
- **AND** 声明完这三个变量后,才能调用 `use{Page}ListQuery(plusSearchDefaultValues)`

#### Scenario: 避免重复声明和类型错误

- **WHEN** 迁移现有列表页代码时
- **THEN** 如果发现这三个变量已存在但位置或顺序错误
- **THEN** 必须使用"移动代码"方式调整,而不是新增代码
- **AND** 不能出现同一变量声明两次的情况
- **AND** 必须确保 `plusSearchModelRef` 包含 `Partial` 类型约束

**错误示例**:

```typescript
// ❌ 错误1: 缺少 Partial 约束
const plusSearchModelRef: FieldValues & ExpenseQueryParams = {
	expenseName: "",
};

// ❌ 错误2: 变量声明在 API Hook 之后
const { tableData } = useExpenseListQuery(plusSearchDefaultValues);
const plusSearchModel = ref(plusSearchModelRef); // 太晚了

// ❌ 错误3: 变量声明不连续
const plusSearchModelRef: FieldValues & Partial<ExpenseQueryParams> = {};
const someOtherVariable = "..."; // 中间插入了其他代码
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

// ❌ 错误4: 重复声明
const plusSearchModelRef: FieldValues & Partial<ExpenseQueryParams> = {};
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const { tableData } = useExpenseListQuery(plusSearchDefaultValues);
const plusSearchModel = ref(plusSearchModelRef); // 重复/错位
```

**正确示例**:

```typescript
// ✅ 正确: 严格按顺序且在 API Hook 之前声明
const plusSearchModelRef: FieldValues & Partial<ExpenseQueryParams> = {
	expenseName: "",
	expenseType: "",
	status: "",
};
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

// 完成变量声明后,才调用 API Hook
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useExpenseListQuery(plusSearchDefaultValues);
```

#### Scenario: 迁移时的处理策略

- **WHEN** 迁移现有列表页代码
- **THEN** 如果发现搜索表单变量位置错误或顺序混乱
- **THEN** 必须识别现有的变量声明位置
- **AND** 使用 Edit 工具的移动代码功能,将这些变量移动到正确位置
- **AND** 确保移动后满足: 顺序正确 + 在 API Hook 之前 + 连续声明
- **AND** 不能采用"删除旧代码 + 新增代码"的方式,必须移动现有代码

### Requirement: 列表页必须删除旧的本地数据相关代码

列表页迁移到 Nitro + TanStack Query 后,MUST 删除所有与旧本地数据方案相关的代码。

#### Scenario: 删除 test-data.ts 导入

- **WHEN** 列表页完成迁移
- **THEN** 必须删除 `import { tableData as allTableData } from "./test-data"` 导入语句
- **AND** 必须删除对应的 `test-data.ts` 文件

#### Scenario: 删除手动数据加载函数

- **WHEN** 列表页完成迁移
- **THEN** 必须删除 `loadTableData` 函数及其所有调用
- **AND** 必须删除 `onMounted` 中的 `loadTableData()` 调用
- **AND** 必须删除手动的数据筛选和分页逻辑

#### Scenario: 删除手动定义的分页和表格配置

- **WHEN** 列表页完成迁移
- **THEN** 必须删除手动定义的 `pagination` 计算属性
- **AND** 必须删除手动定义的 `pureTableProps` ref
- **AND** 必须删除手动实现的 `handlePageSizeChange` 函数
- **AND** 必须删除手动实现的 `handleCurrentPageChange` 函数

### Requirement: 列表页模板必须正确绑定 PureTable 属性和事件

列表页的 `<template>` 部分 MUST 正确绑定 PureTable 组件的属性和事件。

#### Scenario: PureTable 绑定标准属性

- **WHEN** 列表页渲染 PureTable 组件
- **THEN** 必须使用 `:="pureTableProps"` 绑定表格属性
- **AND** 必须绑定 `:loading="isFetching"`
- **AND** 必须绑定 `@page-size-change="handlePageSizeChange"`
- **AND** 必须绑定 `@page-current-change="handleCurrentPageChange"`

#### Scenario: PureTable 不手动绑定分页属性

- **WHEN** 列表页渲染 PureTable 组件
- **THEN** 不能手动绑定 `:data`、`:pagination` 等属性(已包含在 pureTableProps 中)
- **AND** 不能使用内联函数处理分页事件

### Requirement: 列表页代码格式必须统一

所有列表页代码 MUST 遵循统一的格式和注释规范。

#### Scenario: 代码注释完整

- **WHEN** 编写列表页代码
- **THEN** 关键变量和函数必须有 JSDoc 注释
- **AND** 注释必须清晰说明变量或函数的用途
- **AND** 重要的代码段必须有行内注释

#### Scenario: 导入语句顺序正确

- **WHEN** 列表页导入依赖
- **THEN** 必须先导入 Vue 相关
- **AND** 然后导入项目工具函数
- **AND** 最后导入业务类型和 API Hook
- **AND** 类型导入使用 `type` 关键字

---

## 列表页改造的严格执行规范（来自 migrate-static-data-to-nitro-query）

以下规范来自 `migrate-static-data-to-nitro-query` 任务的实践总结，必须严格遵守以避免删改多余内容。

### Requirement: 列表页改造时的职责范围限定

在进行列表页改造时，MUST 明确自己的职责范围，**只做该做的事，不越界删改不该动的代码**。

#### Scenario: 明确改造职责范围

- **WHEN** 改造列表页代码
- **THEN** 职责范围限定为：
  1. 中文变量名替换成英文变量名
  2. 中文类型名替换成来自类型项目的英文类型名
  3. 导入来自 `@01s-11comm/type` 的业务类型
  4. 将 `cloneDeep` 替换成 `structuredClone`
  5. 删除旧的 `test-data.ts` 导入和 `loadTableData` 函数
  6. 删除手动定义的 `pagination`、`pureTableProps`、分页函数
- **AND** 不属于职责范围的内容：
  1. 弹框函数逻辑（`useMode`、`testAsync` 等）
  2. 弹框实例创建逻辑
  3. 表单 props 和 defaultValues 的定义
  4. 按钮配置对象的业务逻辑
  5. 表单字段的默认值和回退逻辑
  6. `definePage` 宏的位置和内容
  7. 全局类型的使用（`TableColumnList`、`PureTableBarProps`）
  8. 全局函数的导入（`getRouteRank`）

### Requirement: 无条件按照 fix-type-error 处理类型错误

在处理列表页的类型替换和变量替换时，MUST 严格按照 `.claude\agents\fix-type-error.md` 文档所述的要求来执行。

#### Scenario: 类型错误处理原则

- **WHEN** 遇到类型错误
- **THEN** 必须按照 `fix-type-error` 代理的规范处理
- **AND** 不要自己胡乱发挥，乱写代码
- **AND** 不要胡乱改变原有的类型
- **AND** 不要导入不存在的、冗余的、多余的全局类型

### Requirement: 不要删改弹框函数逻辑

每一个列表页的弹框相关函数（如 `useMode`、`testAsync` 等）是列表页弹框逻辑必备的函数，**不允许删改**。

#### Scenario: 保留弹框逻辑函数

- **WHEN** 遇到以下代码模式
- **THEN** 必须完整保留，不做任何修改

```typescript
const { modeText, setMode, isAdd } = useMode();
const [isFetchingT, setIsLoadingT] = useToggle(false);
/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}
```

- **AND** 这些函数与表单模式管理和异步操作有关
- **AND** 不属于本次改造的处理范围

### Requirement: 弹框实例代码只做类型替换，不删减逻辑

弹框实例创建逻辑必须保留，只需要进行类型替换和变量名替换。

#### Scenario: 正确处理弹框实例代码

- **WHEN** 遇到弹框实例创建代码
- **THEN** 只进行以下操作：
  1. 从类型项目导入表单 VO 类型（如 `ParkingLotFormVO`）
  2. 将中文组件变量名换成英文（`停车场表单` -> `ParkingLotForm`）
  3. 将中文实例变量名换成英文（`停车场表单Instance` -> `ParkingLotFormInstance`）
- **AND** 不要删除表单实例声明
- **AND** 不要删除表单 props 导入

**正确示例**:

```typescript
import type { ParkingLotFormVO } from "@01s-11comm/type";
import { type ParkingLotFormProps, defaultForm } from "./components/form";
import ParkingLotForm from "./components/form.vue";
const ParkingLotFormInstance = ref<InstanceType<typeof ParkingLotForm> | null>(null);
```

**错误示例（严格禁止）**:

```typescript
// ❌ 错误：删掉了表单实例声明，只保留了类型导入
import type { ParkingLotListItem } from "@01s-11comm/type";
```

### Requirement: 打开弹框组件的逻辑只做变量名和函数替换

在处理打开弹框组件的代码时，必须保留完整的业务逻辑结构。

#### Scenario: 正确处理弹框组件打开逻辑

- **WHEN** 处理表单对象创建代码
- **THEN** 只进行以下操作：
  1. 变量名替换：`停车场表单对象` -> `parkingLotFormVO`
  2. 类型替换：`停车场表单_VO` -> `ParkingLotFormVO`
  3. 类型替换：`停车场表单Props` -> `ParkingLotFormProps`
  4. 函数替换：`cloneDeep` -> `structuredClone`
- **AND** 必须保留的内容：
  1. 表单对象的业务类型约束
  2. `defaultForm` 的使用（不能改成空对象 `{}`）
  3. `...defaultForm` 的展开
  4. 字段的回退逻辑（`row?.field || defaultForm.field`）
  5. `props` 变量的定义
  6. `defaultValues` 变量的定义

**正确示例**:

```typescript
/** 业务对象 */
const parkingLotFormVO: ParkingLotFormVO = isAdd.value
	? structuredClone(defaultForm)
	: structuredClone({
			...defaultForm,
			...row,
			parkingLotType: row?.parkingLotType || defaultForm.parkingLotType,
			parkingSpaceType: row?.parkingSpaceType || defaultForm.parkingSpaceType,
		});

/** 表单组件需要的props */
const props: ParkingLotFormProps = {
	form: parkingLotFormVO,
	defaultValues: parkingLotFormVO,
};

/** 根据不同模式下 变化的表单默认重置对象 */
const defaultValues = props.defaultValues;
```

**错误示例（严格禁止）**:

```typescript
// ❌ 错误1: 删除了类型约束
// ❌ 错误2: 把 defaultForm 改成了 {}
// ❌ 错误3: 删除了 props 和 defaultValues 变量
const parkingLotFormVO = isAdd.value
	? structuredClone({})
	: structuredClone({
			...row,
			parkingLotType: row?.parkingLotType || "地面停车场",
			parkingSpaceType: row?.parkingSpaceType || "标准车位",
		});
```

### Requirement: openDialog 按钮配置只做变量名替换

弹框按钮配置对象必须保留完整的业务逻辑，只替换变量名。

#### Scenario: 正确处理按钮配置逻辑

- **WHEN** 处理 `openDialog` 的 `footerButtons` 配置
- **THEN** 只将中文变量名换成英文（如 `停车场表单Instance` -> `ParkingLotFormInstance`）
- **AND** 必须保留的内容：
  1. 取消按钮中的 `const formComputed` 变量声明
  2. 取消按钮中的 `useDoBeforeClose` 函数调用
  3. 重置按钮的完整配置对象
  4. 提交按钮中的表单验证逻辑
  5. 提交按钮中的 loading 状态管理
  6. 提交按钮中的 `testAsync` 调用

**正确示例**:

```typescript
footerButtons: [
	{
		label: transformI18n($t("common.buttons.cancel")),
		type: "info",
		btnClick: async ({ dialog: { options, index }, button }) => {
			const formComputed = ParkingLotFormInstance.value?.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},
	},
	{
		label: transformI18n($t("common.buttons.reset")),
		type: "warning",
		btnClick: ({ dialog: { options, index }, button }) => {
			ParkingLotFormInstance.value?.plusFormInstance?.handleReset();
		},
	},
	{
		label: transformI18n($t("common.buttons.submit")),
		type: "success",
		btnClick: async ({ dialog: { options, index }, button }) => {
			const res = await ParkingLotFormInstance.value?.plusFormInstance?.handleSubmit();
			if (res) {
				button.btn.loading = true;
				await testAsync();
				button.btn.loading = false;
				closeDialog(options, index);
			}
		},
	},
];
```

**错误示例（严格禁止）**:

```typescript
// ❌ 错误1: 删除了 formComputed 变量
// ❌ 错误2: 删除了 useDoBeforeClose 调用
// ❌ 错误3: 删除了整个重置按钮配置
footerButtons: [
	{
		label: transformI18n($t("common.buttons.cancel")),
		type: "info",
		btnClick: async ({ dialog: { options, index }, button }) => {
			closeDialog(options, index);
		},
	},
	{
		label: transformI18n($t("common.buttons.submit")),
		type: "success",
		btnClick: async ({ dialog: { options, index }, button }) => {
			button.btn.loading = true;
			await testAsync();
			button.btn.loading = false;
			closeDialog(options, index);
		},
	},
];
```

### Requirement: definePage 宏必须在文件最上方

`definePage` 宏的位置和内容不允许修改。

#### Scenario: definePage 宏的位置规则

- **WHEN** 列表页包含 `definePage` 宏
- **THEN** `definePage` 宏必须在所有 `import` 语句之上
- **AND** 不要修改 `definePage` 宏的任何内容
- **AND** 不要修改 `definePage` 宏的位置

**正确示例**:

```typescript
definePage({
	meta: {
		title: "菜单组",
		icon: "mdi:group",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.group"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
// ... 其他 import
```

**错误示例（严格禁止）**:

```typescript
// ❌ 错误：把 definePage 放到 import 下面
import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";

definePage({
	meta: {
		title: "菜单组",
		// ...
	},
});
```

### Requirement: 表格列配置必须使用全局类型 TableColumnList

表格列配置的类型约束是全局类型 `TableColumnList`，不要替换。

#### Scenario: 保持 TableColumnList 全局类型

- **WHEN** 定义表格列配置
- **THEN** 必须使用全局类型 `TableColumnList`
- **AND** 不要手动导入 `TableColumns` 类型
- **AND** 不要替换掉原来的全局类型

**正确示例**:

```typescript
/** 表格列配置 */
const columns = ref<TableColumnList>([
	// ...具体的表格列配置
]);
```

**错误示例（严格禁止）**:

```typescript
// ❌ 错误：手动导入并使用 TableColumns 类型
import type { TableColumns } from "@pureadmin/table";
const columns = ref<TableColumns[]>([
	// ...
]);
```

### Requirement: 保留全局类型约束 PureTableBarProps

`pureTableBarProps` 变量的类型约束是全局类型 `PureTableBarProps`，不要删除。

#### Scenario: 保持 PureTableBarProps 全局类型

- **WHEN** 定义 `pureTableBarProps` 变量
- **THEN** 必须保留全局类型约束 `PureTableBarProps`
- **AND** 变量必须是 `ref` 对象
- **AND** 不要删除类型约束

**正确示例**:

```typescript
/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "菜单组",
	columns: columns.value,
});
```

**错误示例（严格禁止）**:

```typescript
// ❌ 错误：删除了类型约束
const pureTableBarProps = ref({
	title: "菜单组",
	columns: columns.value,
});
```

### Requirement: 不要导入全局函数 getRouteRank

`getRouteRank` 是全局函数，不需要手动导入。

#### Scenario: 避免导入 getRouteRank

- **WHEN** 使用 `getRouteRank` 函数
- **THEN** 不要添加 import 语句
- **AND** 直接使用即可，它是全局函数

**错误示例（严格禁止）**:

```typescript
// ❌ 错误：不应该导入这个全局函数
import { getRouteRank } from "@/router/rank/getRouteRank";
```

**正确做法**: 直接在 `definePage` 中使用 `getRouteRank`，无需导入。

---

## 快速检查清单

在完成列表页改造后，使用以下清单验证是否符合规范：

- [ ] ✅ 只进行了变量名和类型名的替换，未删减业务逻辑
- [ ] ✅ 保留了弹框函数逻辑（`useMode`、`testAsync` 等）
- [ ] ✅ 保留了弹框实例声明和 props 导入
- [ ] ✅ 保留了表单对象的完整初始化逻辑（`defaultForm`、字段回退）
- [ ] ✅ 保留了 `props` 和 `defaultValues` 变量定义
- [ ] ✅ 保留了按钮配置中的所有业务逻辑（三个按钮都完整）
- [ ] ✅ `definePage` 宏在所有 import 之上
- [ ] ✅ 使用全局类型 `TableColumnList` 和 `PureTableBarProps`
- [ ] ✅ 未导入全局函数 `getRouteRank`
- [ ] ✅ 使用 `structuredClone` 替代 `cloneDeep`
- [ ] ✅ 删除了 `test-data.ts` 导入和 `loadTableData` 函数
- [ ] ✅ 删除了手动定义的 `pagination`、`pureTableProps`、分页函数
