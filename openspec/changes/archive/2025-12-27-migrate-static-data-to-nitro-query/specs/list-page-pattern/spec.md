# 列表页改造规范

## 优先级说明

本规范中的所有 Requirement 按以下优先级分类:

- **[CRITICAL]** - 关键要求,违反将导致严重错误或破坏核心功能
- **[IMPORTANT]** - 重要要求,违反将影响代码质量或可维护性
- **[NICE-TO-HAVE]** - 建议性要求,遵守能提升代码规范性

执行任务时应优先关注 CRITICAL 级别的要求。

---

## 快速导航

**完整迁移指南**: 请查看 [migration-guide.md](../migration-guide.md#step-5-改写列表页-30分钟)

**代码范例**:

- ✅ **正确范例**: [配置中心列表页](../../../../apps/admin/src/pages/dev-team/config-manage/center/index.vue)
- ❌ **错误反面例子**: [缴费审核列表页](../../../../apps/admin/src/pages/property-manage/expense-manage/payment-review/index.vue)

## ⚠️ 重要警告：严格禁止向后兼容的中文类型

**在实施列表页改造相关任务时，严格禁止创建任何向后兼容的中文类型或中文变量别名**：

❌ **错误示例（严格禁止）**：

```typescript
// 不允许创建中文类型别名
export type 巡检方式 = PatrolMethodType;
export type 任务状态 = TaskStatusType;

// 不允许创建中文变量别名
export const 费用类型 = contractTypeOptions;
export const 状态选项 = statusOptions;
```

✅ **正确做法**：

- 直接使用纯英文的业务类型：`PatrolMethodType`、`TaskStatusType` 等
- 直接使用纯英文的变量名：`contractTypeOptions`、`statusOptions` 等
- 不需要任何中文类型的兼容层
- 如果其他文件使用了中文类型，应该直接修改那些文件使用英文类型

---

## ⚠️ 列表页改造严格规范

**在实施列表页改造任务时，必须严格遵守以下规范，避免出现删改多余内容的情况**：

### Requirement: [CRITICAL] 无条件按照 fix-type-error 处理类型错误

在处理列表页的类型替换和变量替换时，MUST 严格按照 `.claude\agents\fix-type-error.md` 文档所述的要求来执行。

- 不要自己胡乱发挥，乱写代码
- 不要胡乱改变原有的类型
- 不要导入不存在的、冗余的、多余的全局类型

### Requirement: [CRITICAL] 不要删改破坏现有的弹框函数逻辑

每一个列表页都有这样的代码段。这些逻辑是列表页弹框逻辑必备的函数。**不允许删改**。这不是迁移改造任务的处理范围。

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

### Requirement: [CRITICAL] 不要删掉弹框实例代码，只负责做类型替换

不要随便删掉弹框实例新建逻辑，只需要实现中文变量名替换、导入来自类型项目的业务类型即可。

✅ **正确做法**：

1. 去类型项目导入 `ParkingLotFormVO`，替代来自 `form.ts` 的 `停车场表单_VO` 中文类型
2. 把导入的中文变量名换成英文名：`停车场表单` -> `ParkingLotForm`
3. 把本地的表单实例中文变量名换成英文名：`停车场表单Instance` -> `ParkingLotFormInstance`

```typescript
import type { ParkingLotFormVO } from "@01s-11comm/type";
import { type ParkingLotFormProps, defaultForm } from "./components/form";
import ParkingLotForm from "./components/form.vue";
const ParkingLotFormInstance = ref<InstanceType<typeof ParkingLotForm> | null>(null);
```

### Requirement: [CRITICAL] 不要胡乱删改打开弹框组件的处理逻辑

在处理弹框组件已有的逻辑时，**只负责变量名替换和函数替换**：

- 变量名替换：`停车场表单对象` -> `parkingLotFormVO`
- 类型替换：`停车场表单_VO` -> `ParkingLotFormVO`
- 函数替换：`cloneDeep` -> `structuredClone`

✅ **正确做法**：

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
```

### Requirement: [CRITICAL] 不要胡乱删改 openDialog 按钮配置逻辑

只负责完成中文变量名和中文类型名的替换，不要删改本来就写好的代码逻辑。

✅ **正确做法**：

```typescript
// 只把中文变量名 停车场表单Instance 换成 ParkingLotFormInstance
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

### Requirement: [IMPORTANT] 不要更改 definePage 宏的排布顺序

在每个列表页内，`definePage` 宏 MUST 排在最上面，不允许被修改位置。

✅ **正确做法**：

```typescript
// definePage 宏永远在 import 导入函数之上
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

### Requirement: [IMPORTANT] 表格列配置使用全局类型 TableColumnList

表格列配置 `columns` 数组的类型约束 MUST 使用全局类型 `TableColumnList`，不要换掉。

✅ **正确做法**：

```typescript
// TableColumnList 是全局类型，不需要导入
const columns = ref<TableColumnList>([
	// ...
]);
```

### Requirement: [IMPORTANT] 保留全局类型约束 PureTableBarProps

在列表页内，不要删掉本来就写好的全局类型约束 `PureTableBarProps`，保持原样即可。

✅ **正确做法**：

```typescript
// 保留原样，PureTableBarProps 是全局类型
const pureTableBarProps = ref<PureTableBarProps>({
	title: "菜单组",
	columns: columns.value,
});
```

### Requirement: [NICE-TO-HAVE] 不要增加 getRouteRank 的导入

不要添油加醋的增加多余的全局导入 `getRouteRank`。这个函数是全局函数，不应该主动导入。

---

## ADDED Requirements

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

## 总结

### 必须遵守的核心规则

1. **使用 Hook 传递初始参数**: 传递 `plusSearchDefaultValues`
2. **使用固定写法的搜索函数**: `handleReSearch` 和 `handleSearch`
3. **使用 Hook 返回的分页函数**: `handlePageSizeChange` 和 `handleCurrentPageChange`
4. **使用 isFetching**: 不是 isLoading
5. **直接使用 pureTableProps**: 不手动定义
6. **删除所有旧代码**: test-data.ts、loadTableData、手动 pagination 等

### 快速检查清单

- [ ] 使用 `plusSearchDefaultValues` 作为初始值传给 Hook
- [ ] **严格禁止：未创建任何中文类型别名**（如 `export type 巡检方式 = PatrolMethodType;`）
- [ ] **严格禁止：未创建任何中文变量别名**（如 `export const 费用类型 = contractTypeOptions;`）
- [ ] 使用 `handleReSearch` 和 `handleSearch` 固定写法
- [ ] 使用 `handlePageSizeChange` 和 `handleCurrentPageChange` 固定写法
- [ ] 直接使用 `pureTableProps` 从 Hook 导出
- [ ] 使用 `isFetching` 绑定 loading
- [ ] 删除所有手动定义的 pagination、pureTableProps、分页函数
- [ ] 删除 test-data.ts 导入和 loadTableData 函数
- [ ] 删除 onMounted 中的 loadTableData 调用

### 完整示例代码

完整的标准模板和详细说明,请参考 [migration-guide.md](../migration-guide.md#step-5-改写列表页-30分钟)。
