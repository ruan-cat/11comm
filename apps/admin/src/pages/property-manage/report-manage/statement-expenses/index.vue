<script lang="ts" setup>
definePage({
	meta: {
		// 费用明细表
		title: "property-manage_report-manage.statement-expenses.pageTitle",
		icon: "mdi:receipt",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.statementExpenses"),
	},
});
import { cloneDeep } from "@pureadmin/utils";

import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { StatementExpensesListItem, StatementExpensesQueryParams } from "@01s-11comm/type";
import {
	expenseTypeOptions,
	expenseItemOptions,
	expireStatusOptions,
	paymentMethodOptions,
	statementExpensesCommunityOptions,
} from "@01s-11comm/type";

import { useStatementExpensesListQuery } from "@/api/property-manage/report-manage/statement-expenses";
import { type RemovePageIndexAndPageSize } from "@/utils/remove-pageIndex-and-pageSize";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & RemovePageIndexAndPageSize<StatementExpensesQueryParams> = {
	community: "",
	houseContractName: "",
	ownerName: "",
	expenseType: "",
	expenseItem: "",
	expenseStatus: "",
	paymentMethod: "",
	billingPeriod: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

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
} = useStatementExpensesListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.statement-expenses.fields.community")),
		),
		prop: "community",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.statement-expenses.fields.houseContractName")),
		),
		prop: "houseContractName",
		width: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.statement-expenses.fields.ownerName")),
		),
		prop: "ownerName",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.statement-expenses.fields.expenseType")),
		),
		prop: "expenseType",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.statement-expenses.fields.expenseItem")),
		),
		prop: "expenseItem",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.statement-expenses.fields.expenseStatus")),
		),
		prop: "expenseStatus",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.statement-expenses.fields.paymentMethod")),
		),
		prop: "paymentMethod",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.statement-expenses.fields.receivableAmount")),
		),
		prop: "receivableAmount",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.statement-expenses.fields.receivedAmount")),
		),
		prop: "receivedAmount",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.statement-expenses.fields.unpaidAmount")),
		),
		prop: "unpaidAmount",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.statement-expenses.fields.billingPeriod")),
		),
		prop: "billingPeriod",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.statement-expenses.fields.startDate")),
		),
		prop: "startDate",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.statement-expenses.fields.endDate")),
		),
		prop: "endDate",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.statement-expenses.fields.billingArea")),
		),
		prop: "billingArea",
		width: 100,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.statement-expenses.fields.parkingSpace")),
		),
		prop: "parkingSpace",
		width: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 100,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件配置 */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_report-manage.statement-expenses.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_report-manage.statement-expenses.search.community")),
		prop: "community",
		valueType: "select",
		options: statementExpensesCommunityOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.statement-expenses.search.houseContractName")),
		prop: "houseContractName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.statement-expenses.search.ownerName")),
		prop: "ownerName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.statement-expenses.search.expenseType")),
		prop: "expenseType",
		valueType: "select",
		options: expenseTypeOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.statement-expenses.search.expenseItem")),
		prop: "expenseItem",
		valueType: "select",
		options: expenseItemOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.statement-expenses.search.expenseStatus")),
		prop: "expenseStatus",
		valueType: "select",
		options: expireStatusOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.statement-expenses.search.paymentMethod")),
		prop: "paymentMethod",
		valueType: "select",
		options: paymentMethodOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.statement-expenses.search.billingPeriod")),
		prop: "billingPeriod",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}
</script>

<template>
	<section :key="locale" class="index-root">
		<PlusSearch
			:key="locale"
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			:search-text="plusSearchButtonTexts.searchText"
			:reset-text="plusSearchButtonTexts.resetText"
			@search="handleSearch"
			@reset="handleReSearch"
		/>

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
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
						<ElButton type="primary" link>
							{{ transformI18n($t("property-manage_report-manage.statement-expenses.buttons.detail")) }}
						</ElButton>
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
