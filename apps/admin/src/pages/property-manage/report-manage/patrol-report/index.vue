<script lang="ts" setup>
definePage({
	meta: {
		// 巡检报表
		title: "property-manage_report-manage.patrol-report.pageTitle",
		icon: "mdi:clipboard-list",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.patrolReport"),
	},
});

import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { PatrolReportListItem, PatrolReportQueryParams } from "@01s-11comm/type";
import { patrolTypeOptions, patrolLevelOptions, statusOptions, communityOptions } from "@01s-11comm/type";
import { usePatrolReportListQuery } from "@/api/property-manage/report-manage/patrol-report";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.patrol-report.fields.community")),
		),
		prop: "community",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.patrol-report.fields.patrolNumber")),
		),
		prop: "patrolNumber",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.patrol-report.fields.patrolName")),
		),
		prop: "patrolName",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.patrol-report.fields.patrolType")),
		),
		prop: "patrolType",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.patrol-report.fields.patrolLevel")),
		),
		prop: "patrolLevel",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.patrol-report.fields.responsiblePerson")),
		),
		prop: "responsiblePerson",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.patrol-report.fields.patrolTime")),
		),
		prop: "patrolTime",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.patrol-report.fields.status")),
		),
		prop: "status",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.patrol-report.fields.abnormalCount")),
		),
		prop: "abnormalCount",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_report-manage.patrol-report.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<PatrolReportQueryParams> = {
	patrolName: "",
	patrolType: "",
	patrolLevel: "",
	responsiblePerson: "",
	status: "",
	community: "",
	patrolTimeStart: "",
	patrolTimeEnd: "",
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
} = usePatrolReportListQuery(plusSearchDefaultValues);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_report-manage.patrol-report.search.patrolName")),
		prop: "patrolName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.patrol-report.search.patrolType")),
		prop: "patrolType",
		valueType: "select",
		options: patrolTypeOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.patrol-report.search.patrolLevel")),
		prop: "patrolLevel",
		valueType: "select",
		options: patrolLevelOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.patrol-report.search.responsiblePerson")),
		prop: "responsiblePerson",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.patrol-report.search.status")),
		prop: "status",
		valueType: "select",
		options: statusOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.patrol-report.search.community")),
		prop: "community",
		valueType: "select",
		options: communityOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.patrol-report.search.patrolTimeStart")),
		prop: "patrolTimeStart",
		valueType: "date-picker",
	},
	{
		label: transformI18n($t("property-manage_report-manage.patrol-report.search.patrolTimeEnd")),
		prop: "patrolTimeEnd",
		valueType: "date-picker",
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
