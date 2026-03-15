<script lang="ts" setup>
definePage({
	meta: {
		// 费用项设置
		title: "property-manage_expense-manage.expense-item-setting.pageTitle",
		icon: "mdi:cog-outline",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.expenseItemSetting"),
	},
});

import { ref } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { cloneDeep } from "@pureadmin/utils";
import { type ExpenseItemSettingFormProps, defaultForm } from "./components/form";
import type {
	ExpenseItemSettingFormVO,
	ExpenseItemFeeType as FeeType,
	ExpenseItemIdentifierType as ExpenseIdentifierType,
	ExpenseItemPaymentType as PaymentType,
	ExpenseItemAccountDeductionType as AccountDeductionType,
	ExpenseItemMobilePaymentType as MobilePaymentType,
	ExpenseItemRoundingModeType as RoundingModeType,
	ExpenseItemDecimalPlacesType as DecimalPlacesType,
} from "@01s-11comm/type";
import ExpenseItemSettingForm from "./components/form.vue";
import { useExpenseItemSettingListQuery } from "@/api/property-manage/expense-manage/expense-item-setting";
import {
	type ExpenseItemSettingListItem,
	type ExpenseItemSettingQueryParams,
	expenseIdentifierOptions,
	paymentTypeOptions,
	accountDeductionOptions,
} from "@01s-11comm/type";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";

import { useMode, type Mode } from "@/composables/use-mode";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { h } from "vue";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 表单组件实例 */
const expenseItemSettingFormInstance = ref<InstanceType<typeof ExpenseItemSettingForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ExpenseItemSettingQueryParams> = {
	code: "",
	name: "",
	status: undefined,
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useExpenseItemSettingListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.code")),
		),
		prop: "code",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.feeType")),
		),
		prop: "feeType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.expenseItem")),
		),
		prop: "expenseItem",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.expenseIdentifier")),
		),
		prop: "expenseIdentifier",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.paymentType")),
		),
		prop: "paymentType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.paymentCycle")),
		),
		prop: "paymentCycle",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.formula")),
		),
		prop: "formula",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.billingUnitPrice")),
		),
		prop: "billingUnitPrice",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.fixedFee")),
		),
		prop: "fixedFee",
		width: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.accountDeduction")),
		),
		prop: "accountDeduction",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.status")),
		),
		prop: "status",
		width: 120,
	},

	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 240,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_expense-manage.expense-item-setting.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 费用项ID
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.code")),
		prop: "code",
		valueType: "input",
	},

	// 收费项目
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.expenseItem")),
		prop: "expenseItem",
		valueType: "input",
	},

	// 费用标识
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.expenseIdentifier")),
		prop: "expenseIdentifier",
		valueType: "select",
		options: expenseIdentifierOptions,
	},

	// 付费类型
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.paymentType")),
		prop: "paymentType",
		valueType: "select",
		options: paymentTypeOptions,
	},
	//账户抵扣
	{
		label: transformI18n($t("property-manage_expense-manage.expense-item-setting.fields.accountDeduction")),
		prop: "accountDeduction",
		valueType: "select",
		options: accountDeductionOptions,
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		...plusSearchModel.value,
		pageIndex: 1,
	});
}

/** 打开弹框 参数 */
interface OpenDialogParams {
	mode: Mode;
	row?: ExpenseItemSettingListItem;
}

const { mode, modeText, setMode, isAdd, isEdit } = useMode();

/** 测试异步函数 */
const [isFetchingT, setIsLoadingT] = useToggle(false);

/** 模拟异步操作函数 */
async function testAsync() {
	setIsLoadingT(true);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
	await sleep(1300);
	setIsLoadingT(false);
	consola.log("模拟异步操作, isFetchingT ", isFetchingT.value);
}

/** 打开弹框 */
function openDialog({ mode, row }: OpenDialogParams) {
	setMode(mode);

	/** 业务对象 */
	const formVO: ExpenseItemSettingFormVO = isAdd.value
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
		form: formVO,
		defaultValues: formVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = props.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_expense-manage.expense-item-setting.dialogs.addTitle"))
				: transformI18n($t("property-manage_expense-manage.expense-item-setting.dialogs.editTitle")),
		props,

		contentRenderer: () =>
			h(ExpenseItemSettingForm, {
				ref: expenseItemSettingFormInstance,
				...props,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = expenseItemSettingFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** console.log(options, index, button); */
					const formComputed = expenseItemSettingFormInstance.value?.formComputed;
					if (formComputed) {
						await useDoBeforeClose({ defaultValues, formComputed, index, options });
					}
				},
			},

			{
				label: () => transformI18n($t("common.buttons.reset")),
				type: "warning",
				btnClick: ({ dialog: { options, index }, button }) => {
					/** 手动重置表单 */
					expenseItemSettingFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await expenseItemSettingFormInstance.value?.plusFormInstance?.handleSubmit();
					if (res) {
						button.btn.loading = true;
						await testAsync();
						button.btn.loading = false;
						closeDialog(options, index);
						await doFetch();
					}
				},
			},
		],
	});
}
</script>

<template>
	<section :key="locale" class="index-root">
		<PlusSearch
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			:search-text="plusSearchButtonTexts.searchText"
			:reset-text="plusSearchButtonTexts.resetText"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
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
					:loading="isFetching"
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
