<script lang="ts" setup>
definePage({
	meta: {
		// 报修汇总表
		title: "property-manage_report-manage.repair-reports-summary-table.pageTitle",
		icon: "mdi:table-merge-cells",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.repairReportsSummaryTable"),
	},
});

import { ref, computed } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import {
	type RepairReportsSummaryTableListItem,
	type RepairReportsSummaryTableQueryParams,
	repairTypeOptions,
	repairStatusOptions,
	urgencyLevelOptions,
	communityOptions,
} from "@01s-11comm/type";
import { useRepairReportsSummaryTableListQuery } from "@/api/property-manage/report-manage/repair-reports-summary-table";

const { locale, withLocale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<RepairReportsSummaryTableQueryParams> = {
	repairType: "",
	repairStatus: "",
	urgencyLevel: "",
	community: "",
	statisticsStartTime: "",
	statisticsEndTime: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_report-manage.repair-reports-summary-table.search.repairType")),
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.repair-reports-summary-table.search.repairStatus")),
		prop: "repairStatus",
		valueType: "select",
		options: repairStatusOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.repair-reports-summary-table.search.urgencyLevel")),
		prop: "urgencyLevel",
		valueType: "select",
		options: urgencyLevelOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.repair-reports-summary-table.search.community")),
		prop: "community",
		valueType: "select",
		options: communityOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.repair-reports-summary-table.search.statisticsStartTime")),
		prop: "statisticsStartTime",
		valueType: "date-picker",
	},
	{
		label: transformI18n($t("property-manage_report-manage.repair-reports-summary-table.search.statisticsEndTime")),
		prop: "statisticsEndTime",
		valueType: "date-picker",
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	doFetch,
	updateParams,
	resetParams,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useRepairReportsSummaryTableListQuery(plusSearchDefaultValues);

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

/** 表格列配置 */
const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-reports-summary-table.fields.community")),
		),
		prop: "community",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-reports-summary-table.fields.repairType")),
		),
		prop: "repairType",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-reports-summary-table.fields.repairCount")),
		),
		prop: "repairCount",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-reports-summary-table.fields.processingCount")),
		),
		prop: "processingCount",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-reports-summary-table.fields.completedCount")),
		),
		prop: "completedCount",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-reports-summary-table.fields.unfinishedCount")),
		),
		prop: "unfinishedCount",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-reports-summary-table.fields.pendingRevisitCount")),
		),
		prop: "pendingRevisitCount",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-reports-summary-table.fields.dissatisfiedCount")),
		),
		prop: "dissatisfiedCount",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-reports-summary-table.fields.emergencyCount")),
		),
		prop: "emergencyCount",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-reports-summary-table.fields.statisticsTime")),
		),
		prop: "statisticsTime",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 200,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_report-manage.repair-reports-summary-table.tableTitle")),
	columns: columns.value,
}));
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
				<ElButton type="info" :loading="isFetching" @click="handleReSearch">
					{{ transformI18n($t("common.buttons.pureReload")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
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
