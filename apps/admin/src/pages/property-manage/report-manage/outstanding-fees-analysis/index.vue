<script lang="ts" setup>
definePage({
	meta: {
		// 欠费分析
		title: "property-manage_report-manage.outstanding-fees-analysis.pageTitle",
		icon: "mdi:chart-line",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.outstandingFeesAnalysis"),
	},
});

import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { OutstandingFeesAnalysisListItem, OutstandingFeesAnalysisQueryParams } from "@01s-11comm/type";
import { useOutstandingFeesAnalysisListQuery } from "@/api/property-manage/report-manage/outstanding-fees-analysis";
import { feeItemOptions, communityOptions, buildingOptions, unitOptions } from "@01s-11comm/type";

const { locale, withLocale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/** 表格列配置 */
const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.fields.community")),
		),
		prop: "community",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.fields.building")),
		),
		prop: "building",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.fields.unit")),
		),
		prop: "unit",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.fields.houseNumberContractName")),
		),
		prop: "houseNumberContractName",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.fields.ownerName")),
		),
		prop: "ownerName",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.fields.ownerPhone")),
		),
		prop: "ownerPhone",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.fields.feeItem")),
		),
		prop: "feeItem",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.fields.totalUncollectedAmount")),
		),
		prop: "totalUncollectedAmount",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.fields.currentUncollectedAmount")),
		),
		prop: "currentUncollectedAmount",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.fields.historicalUncollectedAmount")),
		),
		prop: "historicalUncollectedAmount",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.fields.latestReceivableMonth")),
		),
		prop: "latestReceivableMonth",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.fields.statisticsTime")),
		),
		prop: "statisticsTime",
		minWidth: 180,
	},
]);

/** 表格操作栏组件配置 */
const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.pageTitle")),
	columns: columns.value,
}));

const plusSearchModelRef: FieldValues & OutstandingFeesAnalysisQueryParams = {
	houseNumberContractName: "",
	ownerName: "",
	ownerPhone: "",
	feeItem: "",
	community: "",
	building: "",
	unit: "",
	pageIndex: 1,
	pageSize: 10,
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
} = useOutstandingFeesAnalysisListQuery(plusSearchDefaultValues);

const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.search.houseNumberContractName")),
		prop: "houseNumberContractName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.search.ownerName")),
		prop: "ownerName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.search.ownerPhone")),
		prop: "ownerPhone",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.search.feeItem")),
		prop: "feeItem",
		valueType: "select",
		options: feeItemOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.search.community")),
		prop: "community",
		valueType: "select",
		options: communityOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.search.building")),
		prop: "building",
		valueType: "select",
		options: buildingOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.outstanding-fees-analysis.search.unit")),
		prop: "unit",
		valueType: "select",
		options: unitOptions,
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
