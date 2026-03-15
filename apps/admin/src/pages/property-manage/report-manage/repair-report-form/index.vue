<script lang="ts" setup>
definePage({
	meta: {
		// 报修报表
		title: "property-manage_report-manage.repair-report-form.pageTitle",
		icon: "mdi:tools",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.repairReportForm"),
	},
});

import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { RepairReportFormListItem, RepairReportFormQueryParams } from "@01s-11comm/type";
import { useRepairReportFormListQuery } from "@/api/property-manage/report-manage/repair-report-form";
import {
	repairTypeOptions,
	repairStatusOptions,
	urgencyLevelOptions,
	communityOptions,
	feeStatusOptions,
} from "@01s-11comm/type";

const { locale, withLocale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

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
} = useRepairReportFormListQuery({
	repairType: "",
	repairStatus: "",
	urgencyLevel: "",
	community: "",
	feeStatus: "",
	reportTimeStart: "",
	reportTimeEnd: "",
	reporter: "",
	reporterPhone: "",
});

/** 表格列配置 */
const columns = withLocale<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-report-form.fields.community")),
		),
		prop: "community",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-report-form.fields.repairOrderNumber")),
		),
		prop: "repairOrderNumber",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-report-form.fields.repairType")),
		),
		prop: "repairType",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-report-form.fields.urgencyLevel")),
		),
		prop: "urgencyLevel",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-report-form.fields.reporter")),
		),
		prop: "reporter",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-report-form.fields.reporterPhone")),
		),
		prop: "reporterPhone",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-report-form.fields.repairAddress")),
		),
		prop: "repairAddress",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-report-form.fields.reportTime")),
		),
		prop: "reportTime",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-report-form.fields.handler")),
		),
		prop: "handler",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-report-form.fields.processor")),
		),
		prop: "processor",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-report-form.fields.feeStatus")),
		),
		prop: "feeStatus",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.repair-report-form.fields.repairStatus")),
		),
		prop: "repairStatus",
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

/** 表格操作栏组件 配置  */
const pureTableBarProps = withLocale<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_report-manage.repair-report-form.tableTitle")),
	columns: columns.value,
}));

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & RepairReportFormQueryParams = {
	repairType: "",
	repairStatus: "",
	urgencyLevel: "",
	reporter: "",
	reporterPhone: "",
	community: "",
	reportTimeStart: "",
	reportTimeEnd: "",
	feeStatus: "",
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
const plusSearchColumns = withLocale<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_report-manage.repair-report-form.search.repairType")),
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.repair-report-form.search.repairStatus")),
		prop: "repairStatus",
		valueType: "select",
		options: repairStatusOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.repair-report-form.search.urgencyLevel")),
		prop: "urgencyLevel",
		valueType: "select",
		options: urgencyLevelOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.repair-report-form.search.reporter")),
		prop: "reporter",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.repair-report-form.search.reporterPhone")),
		prop: "reporterPhone",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.repair-report-form.search.community")),
		prop: "community",
		valueType: "select",
		options: communityOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.repair-report-form.search.feeStatus")),
		prop: "feeStatus",
		valueType: "select",
		options: feeStatusOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.repair-report-form.search.reportTimeStart")),
		prop: "reportTimeStart",
		valueType: "date-picker",
	},
	{
		label: transformI18n($t("property-manage_report-manage.repair-report-form.search.reportTimeEnd")),
		prop: "reportTimeEnd",
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
				<ElButton type="info" @click="handleReSearch">
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
