<script lang="ts" setup>
definePage({
	meta: {
		// 业主缴费明细
		title: "property-manage_report-manage.owner-payment-details.pageTitle",
		icon: "mdi:account-cash",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.ownerPaymentDetails"),
	},
});

import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { OwnerPaymentDetailsListItem, OwnerPaymentDetailsQueryParams } from "@01s-11comm/type";
import { useOwnerPaymentDetailsListQuery } from "@/api/property-manage/report-manage/owner-payment-details";
import { feeCategoryOptions, feeItemOptions, communityOptions, yearOptions } from "@01s-11comm/type";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/** 使用列表查询组合式函数 */
const {
	tableData,
	pagination,
	doFetch,
	resetParams,
	updateParams,
	isFetching,
	handlePageSizeChange,
	handleCurrentPageChange,
	pureTableProps: pureTablePropsFromComposable,
} = useOwnerPaymentDetailsListQuery({
	houseNumberContractName: "",
	ownerName: "",
	ownerPhone: "",
	feeCategory: "",
	feeItem: "",
	community: "",
	year: "",
});

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.community")),
		),
		prop: "community",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.houseNumberContractName")),
		),
		prop: "houseNumberContractName",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.ownerName")),
		),
		prop: "ownerName",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.ownerPhone")),
		),
		prop: "ownerPhone",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.feeCategory")),
		),
		prop: "feeCategory",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.feeItem")),
		),
		prop: "feeItem",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.year")),
		),
		prop: "year",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.january")),
		),
		prop: "january",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.february")),
		),
		prop: "february",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.march")),
		),
		prop: "march",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.april")),
		),
		prop: "april",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.may")),
		),
		prop: "may",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.june")),
		),
		prop: "june",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.july")),
		),
		prop: "july",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.august")),
		),
		prop: "august",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.september")),
		),
		prop: "september",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.october")),
		),
		prop: "october",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.november")),
		),
		prop: "november",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.december")),
		),
		prop: "december",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.total")),
		),
		prop: "total",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.receivable")),
		),
		prop: "receivable",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.owner-payment-details.fields.prepaid")),
		),
		prop: "prepaid",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格配置 */
const pureTableProps = computed<PureTableProps>(() => ({
	...pureTablePropsFromComposable.value,
	columns: [],
}));

/** 表格操作栏组件配置 */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_report-manage.owner-payment-details.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & OwnerPaymentDetailsQueryParams = {
	houseNumberContractName: "",
	ownerName: "",
	ownerPhone: "",
	feeCategory: "",
	feeItem: "",
	community: "",
	year: "",
	pageIndex: 1,
	pageSize: 10,
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_report-manage.owner-payment-details.search.houseNumberContractName")),
		prop: "houseNumberContractName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.owner-payment-details.search.ownerName")),
		prop: "ownerName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.owner-payment-details.search.ownerPhone")),
		prop: "ownerPhone",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.owner-payment-details.search.feeCategory")),
		prop: "feeCategory",
		valueType: "select",
		options: feeCategoryOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.owner-payment-details.search.feeItem")),
		prop: "feeItem",
		valueType: "select",
		options: feeItemOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.owner-payment-details.search.community")),
		prop: "community",
		valueType: "select",
		options: communityOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.owner-payment-details.search.year")),
		prop: "year",
		valueType: "select",
		options: yearOptions,
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
				>
					<template #operation="{ row }">
						<ElButton type="info">
							{{ transformI18n($t("common.buttons.info")) }}
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
