<script lang="ts" setup>
definePage({
	meta: {
		// 费用汇总表
		title: "property-manage_expense-manage.expense-summary-table.pageTitle",
		icon: "mdi:table-large",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.expenseSummaryTable"),
	},
});

import { h, ref, computed } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import { type ExpenseSummaryTableFormProps, defaultForm } from "./components/form";
import type { ExpenseSummaryTableFormVO, ExpenseItemNameType } from "@01s-11comm/type";
import ExpenseSummaryTableForm from "./components/form.vue";
import { useExpenseSummaryTableListQuery } from "@/api/property-manage/expense-manage/expense-summary-table";
import {
	type ExpenseSummaryTableListItem,
	type ExpenseSummaryTableQueryParams,
	expenseItemNameOptions,
} from "@01s-11comm/type";
import { useToggle } from "@vueuse/core";
import { consola } from "consola";
import { defaultAddDialogParams } from "@/config/constant";

import { useMode, type Mode } from "@/composables/use-mode";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";

const { locale, createHeaderRenderer, plusSearchButtonTexts, searchProps } = useI18nConfig();

/** 表单组件实例 */
const expenseSummaryTableFormInstance = ref<InstanceType<typeof ExpenseSummaryTableForm> | null>(null);

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ExpenseSummaryTableQueryParams> = {
	time: "",
	expenseItemId: "",
	expenseItemName: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useExpenseSummaryTableListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-summary-table.fields.time")),
		),
		prop: "time",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-summary-table.fields.expenseItemId")),
		),
		prop: "expenseItemId",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-summary-table.fields.expenseItemName")),
		),
		prop: "expenseItemName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-summary-table.fields.receivableAmount")),
		),
		prop: "receivableAmount",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_expense-manage.expense-summary-table.fields.actualAmount")),
		),
		prop: "actualAmount",
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
	title: transformI18n($t("property-manage_expense-manage.expense-summary-table.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 时间
	{
		label: transformI18n($t("property-manage_expense-manage.expense-summary-table.search.time")),
		prop: "time",
		valueType: "input",
	},

	// 费用项ID
	{
		label: transformI18n($t("property-manage_expense-manage.expense-summary-table.search.expenseItemId")),
		prop: "expenseItemId",
		valueType: "input",
	},

	// 费用项名称
	{
		label: transformI18n($t("property-manage_expense-manage.expense-summary-table.search.expenseItemName")),
		prop: "expenseItemName",
		valueType: "select",
		options: expenseItemNameOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
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
	row?: ExpenseSummaryTableListItem;
}

const { modeText, setMode, isAdd, isEdit } = useMode();

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
	const expenseSummaryTableFormVO: ExpenseSummaryTableFormVO = isAdd.value
		? cloneDeep(defaultForm)
		: isEdit.value
			? cloneDeep({
					...defaultForm,
					time: row?.time || "",
					expenseItemId: row?.expenseItemId || "",
					expenseItemName: (row?.expenseItemName as ExpenseItemNameType) || "物业费",
					receivableAmount: row?.receivableAmount || "",
					actualAmount: row?.actualAmount || "",
				})
			: cloneDeep(defaultForm);

	/** 表单组件需要的props */
	const formProps: ExpenseSummaryTableFormProps = {
		form: expenseSummaryTableFormVO,
		defaultValues: expenseSummaryTableFormVO,
	};

	/** 根据不同模式下 变化的表单默认重置对象 */
	const defaultValues = formProps.defaultValues;

	addDialog({
		...defaultAddDialogParams,
		title: () =>
			isAdd.value
				? transformI18n($t("property-manage_expense-manage.expense-summary-table.dialogs.addTitle"))
				: transformI18n($t("property-manage_expense-manage.expense-summary-table.dialogs.editTitle")),
		props: formProps,

		contentRenderer: () =>
			h(ExpenseSummaryTableForm, {
				ref: expenseSummaryTableFormInstance,
				...formProps,
			}),

		async doBeforeClose({ options, index }) {
			const formComputed = expenseSummaryTableFormInstance.value?.formComputed;
			if (formComputed) {
				await useDoBeforeClose({ defaultValues, formComputed, index, options });
			}
		},

		footerButtons: [
			{
				label: () => transformI18n($t("common.buttons.cancel")),
				type: "info",
				btnClick: async ({ dialog: { options, index }, button }) => {
					const formComputed = expenseSummaryTableFormInstance.value?.formComputed;
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
					expenseSummaryTableFormInstance.value?.plusFormInstance?.handleReset();
				},
			},

			{
				label: () => transformI18n($t("common.buttons.submit")),
				type: "success",
				btnClick: async ({ dialog: { options, index }, button }) => {
					/** 提交表单时 校验 */
					const res = await expenseSummaryTableFormInstance.value?.plusFormInstance?.handleSubmit();
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
						<ElButton type="info">
							{{ transformI18n($t("property-manage_expense-manage.expense-summary-table.button.overduePayment")) }}
						</ElButton>
						<ElButton type="danger">
							{{ transformI18n($t("common.buttons.del")) }}
						</ElButton>
						<ElButton type="info">
							{{ transformI18n($t("property-manage_expense-manage.expense-summary-table.button.viewFee")) }}
						</ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
	display: flex;
	flex-direction: column;
	height: 100%;
}
</style>
