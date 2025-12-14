<script lang="ts" setup>
definePage({
	meta: {
		title: "费用项设置",
		icon: "mdi:cog-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.expenseItemSetting"),
	},
});

import { ref, computed, onMounted } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type ExpenseItemSettingFormProps,
	defaultForm,
	type ExpenseItemSettingFormVO,
	type FeeType,
	type ExpenseIdentifierType,
	type PaymentType,
	type AccountDeductionType,
	type MobilePaymentType,
	type RoundingModeType,
	type DecimalPlacesType,
} from "./components/form";
import ExpenseItemSettingForm from "./components/form.vue";
import { useExpenseItemSettingListQuery } from "@/api/property-manage/expense-manage/expense-item-setting";
import {
	type ExpenseItemSettingListItem,
	type ExpenseItemSettingQueryParams,
	费用项设置标识Options,
	费用项设置付费类型Options,
	费用项设置抵扣Options,
	paymentTypeOptions,
	accountDeductionOptions,
} from "@01s-11comm/type";
import { useToggle } from "@vueuse/core";
import { cloneDeep } from "lodash-es";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";
import { useDoBeforeClose } from "@/composables/use-dialog-do-before-close";
import { useMode, type Mode } from "@/composables/use-mode";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { h } from "vue";

/** 表单组件实例 */
const expenseItemSettingFormInstance = ref<InstanceType<typeof ExpenseItemSettingForm> | null>(null);

/** 使用 TanStack Query 获取数据 */
const { tableData, total, pageIndex, pageSize, isLoading, queryParams, updateParams, resetParams, refetch } =
	useExpenseItemSettingListQuery();

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "编号",
		prop: "code",
		width: 120,
	},
	{
		label: "费用类型",
		prop: "feeType",
		width: 120,
	},
	{
		label: "收费项目",
		prop: "expenseItem",
		width: 120,
	},
	{
		label: "费用标识",
		prop: "expenseIdentifier",
		width: 120,
	},
	{
		label: "付费类型",
		prop: "paymentType",
		width: 120,
	},
	{
		label: "缴费周期(单位:月)",
		prop: "paymentCycle",
		width: 120,
	},
	{
		label: "公式",
		prop: "formula",
		width: 120,
	},
	{
		label: "计费单价(单位:元)",
		prop: "billingUnitPrice",
		width: 120,
	},
	{
		label: "附加/固定费用(单位:元)",
		prop: "fixedFee",
		width: 140,
	},
	{
		label: "账户抵扣",
		prop: "accountDeduction",
		width: 120,
	},
	{
		label: "状态",
		prop: "status",
		width: 120,
	},

	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 分页配置 */
const pagination = computed<PaginationProps>(() => ({
	...defaultPagination,
	pageSize: pageSize.value,
	currentPage: pageIndex.value,
	total: total.value,
}));

/** 处理页数变化 */
function handlePageSizeChange(newPageSize: number) {
	pageSize.value = newPageSize;
}

/** 处理页码变化 即后端的 pageIndex */
function handleCurrentPageChange(currentPage: number) {
	pageIndex.value = currentPage;
}

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
	loading: isLoading.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "费用项",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ExpenseItemSettingQueryParams> = {
	code: "",
	expenseItem: "",
	expenseIdentifier: "",
	paymentType: "",
	accountDeduction: "",
	// 自定义费用: "", // Assuming '自定义费用' maps to something or removed if not in API. It maps to 'expenseIdentifier' in old code? No, old code used '费用标识' for '自定义费用' filter?
	// Wait, old code:
	// if (plusSearchModel.value.自定义费用) { filteredData = filteredData.filter((item) => item.费用标识 === plusSearchModel.value.自定义费用); }
	// So '自定义费用' filter was filtering by 'expenseIdentifier'.
	// But 'expenseIdentifier' filter also exists?
	// if (plusSearchModel.value.费用标识) { filteredData = filteredData.filter((item) => item.费用标识 === plusSearchModel.value.费用标识); }
	// This seems redundant or specific. I will stick to standard filters in QueryParams.
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 费用项ID
	{
		label: transformI18n($t("propertyManage_expensesManage.expenses-setup.expensesID")),
		prop: "code",
		valueType: "input",
	},

	// 收费项目
	{
		label: transformI18n($t("propertyManage_expensesManage.expenses-setup.expensesItem")),
		prop: "expenseItem",
		valueType: "input",
	},

	// 费用标识
	{
		label: transformI18n($t("propertyManage_expensesManage.expenses-setup.expensesUnit")),
		prop: "expenseIdentifier",
		valueType: "select",
		options: 费用项设置标识Options,
	},

	// 付费类型
	{
		label: transformI18n($t("propertyManage_expensesManage.expenses-setup.expensesType")),
		prop: "paymentType",
		valueType: "select",
		options: 费用项设置付费类型Options,
	},
	//账户抵扣
	{
		label: transformI18n($t("propertyManage_expensesManage.expenses-setup.expensesAmount")),
		prop: "accountDeduction",
		valueType: "select",
		options: 费用项设置抵扣Options,
	},
	//自定义费用
	// {
	// 	label: transformI18n($t("propertyManage_expensesManage.expenses-setup.expensesAmountType")),
	// 	prop: "自定义费用", // Removed as it seems redundant or not supported in API params directly
	// 	valueType: "select",
	// 	options: 费用项设置自定义选项,
	// },
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	} as Partial<ExpenseItemSettingQueryParams>);
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: ExpenseItemSettingListItem;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

/** 测试异步函数 */
const [isLoadingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isLoadingT ", isLoadingT.value);
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 弹框标题 */
	const title = `${modeText.value}费用项设置`;

	/** 业务对象 */
	const expenseItemSettingFormVO: ExpenseItemSettingFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? {
					...defaultForm,
					feeType: (row?.feeType as FeeType) || "物业费",
					expenseItem: row?.expenseItem || "",
					expenseIdentifier: (row?.expenseIdentifier as ExpenseIdentifierType) || "周期性费用",
					paymentType: (row?.paymentType as PaymentType) || "预付费",
					paymentCycle: row?.paymentCycle || "1",
					prepaymentPeriod: "30", // Missing in list item
					unit: "元/平方米·月", // Missing in list item
					accountDeduction: (row?.accountDeduction as AccountDeductionType) || "是",
					mobilePayment: "是", // Missing in list item
					roundingMode: "四舍五入", // Missing in list item
					decimalPlaces: "2位", // Missing in list item
					status: row?.status || "启用",
					formula: row?.formula || "",
					billingUnitPrice: row?.billingUnitPrice || "",
					fixedFee: row?.fixedFee || "",
				}
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const props: ExpenseItemSettingFormProps = {
		form: expenseItemSettingFormVO,
		defaultValues: expenseItemSettingFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title,
		props,

		contentRenderer: () =>
			h(ExpenseItemSettingForm, {
				ref: expenseItemSettingFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = expenseItemSettingFormInstance.value.formComputed;
			await useDoBeforeClose({ defaultValues, formComputed, index, options });
		},

		footerButtons: [
			{
				label: transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** console.log(options, index, button); */
					const formComputed = expenseItemSettingFormInstance.value.formComputed;
					await useDoBeforeClose({ defaultValues, formComputed, index, options });
				},
			},

			{
				label: transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					expenseItemSettingFormInstance.value.plusFormInstance.handleReset();
				},
			},

			{
				label: transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await expenseItemSettingFormInstance.value.plusFormInstance.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await refetch();
					}
				},
			},
		],
	});
}

onMounted(async () => {
	// TanStack Query will auto-fetch on mount
});
</script>

<template>
	<section class="index-root">
		<PlusSearch
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary" @click="openDialog({ mode: 'add' })">
					{{ transformI18n($t("common.buttons.add")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="warning" @click="openDialog({ mode: 'edit', row })">
							{{ transformI18n($t("common.buttons.edit")) }}
						</ElButton>
						<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
