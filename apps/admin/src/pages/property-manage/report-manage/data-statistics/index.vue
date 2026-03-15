<script lang="ts" setup>
definePage({
	meta: {
		// 数据统计
		title: "property-manage_report-manage.data-statistics.pageTitle",
		icon: "mdi:chart-bar",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.dataStatistics"),
	},
});

import dayjs from "dayjs";
import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { DataStatisticsListItem, DataStatisticsQueryParams } from "@01s-11comm/type";
import { useDataStatisticsListQuery } from "@/api/property-manage/report-manage/data-statistics";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.community")),
		),
		prop: "小区",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.house")),
		),
		prop: "房屋",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.owner")),
		),
		prop: "业主",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.arrears")),
		),
		prop: "欠费",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.actualReceipt")),
		),
		prop: "实收",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.propertyFee")),
		),
		prop: "物业费",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.deposit")),
		),
		prop: "押金",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.parkingFee")),
		),
		prop: "停车费",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.gasFee")),
		),
		prop: "煤气费",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.heatingFee")),
		),
		prop: "取暖费",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.repairFee")),
		),
		prop: "维修费",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.serviceFee")),
		),
		prop: "服务费",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.other")),
		),
		prop: "其他",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.waterFee")),
		),
		prop: "水费",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.electricityFee")),
		),
		prop: "电费",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.rent")),
		),
		prop: "租金",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.data-statistics.fields.publicShareFee")),
		),
		prop: "公摊费",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件配置 */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_report-manage.data-statistics.pageTitle")),
	columns: columns.value,
}));

const plusSearchModelRef: FieldValues & DataStatisticsQueryParams = {
	name: "",
	status: "",
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
} = useDataStatisticsListQuery(plusSearchDefaultValues);

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_report-manage.data-statistics.search.startTime")),
		prop: "startTime",
		valueType: "date-picker",
	},
	{
		label: transformI18n($t("property-manage_report-manage.data-statistics.search.endTime")),
		prop: "endTime",
		valueType: "date-picker",
	},
	{
		label: transformI18n($t("property-manage_report-manage.data-statistics.search.community")),
		prop: "community",
		valueType: "select",
		options: [],
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
