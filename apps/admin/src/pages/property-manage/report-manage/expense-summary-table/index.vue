<script lang="ts" setup>
definePage({
	meta: {
		// 费用汇总表
		title: "property-manage_report-manage.expense-summary-table.pageTitle",
		icon: "mdi:table-large",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.expenseSummaryTable"),
	},
});

import dayjs from "dayjs";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import BuildChart from "./components/build.vue";
import PaymentChart from "./components/payment.vue";
import {
	type ExpenseSummaryTableListItem,
	type ExpenseSummaryTableQueryParams,
	expenseItemNameOptions,
} from "@01s-11comm/type";
import { useExpenseSummaryTableListQuery } from "@/api/property-manage/report-manage/expense-summary-table";

const { locale, withLocale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/** 表格列配置 */
const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.expense-summary-table.fields.community")),
		),
		prop: "小区",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.expense-summary-table.fields.houseNumberContractName")),
		),
		prop: "房屋编号合同名称",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.expense-summary-table.fields.ownerName")),
		),
		prop: "业主名称",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.expense-summary-table.fields.ownerPhone")),
		),
		prop: "业主手机号",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.expense-summary-table.fields.feeItem")),
		),
		prop: "费用项",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.expense-summary-table.fields.totalHouseholds")),
		),
		prop: "总户数",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.expense-summary-table.fields.chargedHouseholds")),
		),
		prop: "收费户",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.expense-summary-table.fields.arrearsHouseholds")),
		),
		prop: "欠费户",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.expense-summary-table.fields.arrears")),
		),
		prop: "欠费",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.expense-summary-table.fields.actualPayment")),
		),
		prop: "实缴",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.expense-summary-table.fields.currentReceivable")),
		),
		prop: "当期应收",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.expense-summary-table.fields.currentActualReceipt")),
		),
		prop: "当前实收",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.expense-summary-table.fields.householdChargeRate")),
		),
		prop: "户收费率",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.expense-summary-table.fields.chargeRate")),
		),
		prop: "收费率",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.expense-summary-table.fields.clearanceRate")),
		),
		prop: "清缴率",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.expense-summary-table.fields.statisticsTime")),
		),
		prop: "统计时间",
		minWidth: 180,
	},
]);

/** 表格操作栏组件配置 */
const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_report-manage.expense-summary-table.pageTitle")),
	columns: columns.value,
}));

const plusSearchModelRef: FieldValues & Partial<ExpenseSummaryTableQueryParams> = {
	time: "",
	expenseItemId: "",
	expenseItemName: "",
};
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);
const plusSearchModel = ref(plusSearchModelRef);

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

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_report-manage.expense-summary-table.search.houseNumberContractName")),
		prop: "房屋编号合同名称",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.expense-summary-table.search.ownerName")),
		prop: "业主名称",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.expense-summary-table.search.ownerPhone")),
		prop: "业主手机号",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.expense-summary-table.search.expenseItemName")),
		prop: "expenseItemName",
		valueType: "select",
		options: expenseItemNameOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

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
			<template #buttons>
				<ElButton type="info" @click="doFetch">
					{{ transformI18n($t("common.buttons.pureReload")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				/>
			</template>
		</PureTableBar>

		<div>
			{{ transformI18n($t("property-manage_report-manage.expense-summary-table.charts.buildingChargeRate")) }}
			<BuildChart />
		</div>
		<div>
			{{ transformI18n($t("property-manage_report-manage.expense-summary-table.charts.feeItemChargeRate")) }}
			<PaymentChart />
		</div>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
