<script lang="ts" setup>
definePage({
	meta: {
		// 押金报表
		title: "property-manage_report-manage.deposit-report.pageTitle",
		icon: "mdi:bank",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.depositReport"),
	},
});

import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { DepositReportListItem, DepositReportQueryParams } from "@01s-11comm/type";
import {
	buildingOptions,
	unitOptions,
	feeItemOptions,
	chargeStatusOptions,
	chargeObjectOptions,
	reminderStatusOptions,
	chargeObjectTypeOptions,
	refundStatusOptions,
} from "@01s-11comm/type";
import { useDepositReportListQuery } from "@/api/property-manage/report-manage/deposit-report";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.deposit-report.fields.feeId")),
		),
		prop: "费用ID",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.deposit-report.fields.roomNumber")),
		),
		prop: "房号",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.deposit-report.fields.owner")),
		),
		prop: "业主",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.deposit-report.fields.feeType")),
		),
		prop: "费用类型",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.deposit-report.fields.feeItem")),
		),
		prop: "费用项",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.deposit-report.fields.feeStartTime")),
		),
		prop: "费用开始时间",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.deposit-report.fields.feeEndTime")),
		),
		prop: "费用结束时间",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.deposit-report.fields.createTime")),
		),
		prop: "创建时间",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.deposit-report.fields.payerObjectType")),
		),
		prop: "付费对象类型",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.deposit-report.fields.payerId")),
		),
		prop: "付款方ID",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.deposit-report.fields.receivableAmount")),
		),
		prop: "应收金额",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.deposit-report.fields.status")),
		),
		prop: "状态",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.deposit-report.fields.refundStatus")),
		),
		prop: "退费状态",
		minWidth: 140,
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
	title: transformI18n($t("property-manage_report-manage.deposit-report.pageTitle")),
	columns: columns.value,
}));

const plusSearchModelRef: FieldValues & Partial<DepositReportQueryParams> = {
	building: "",
	unit: "",
	roomNumber: "",
	feeId: "",
	feeItemName: "",
	chargeStatus: "",
	chargeObjectType: "",
	feeCreateStartTime: "",
	feeCreateEndTime: "",
	refundStatus: "",
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
} = useDepositReportListQuery(plusSearchDefaultValues);

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_report-manage.deposit-report.search.building")),
		prop: "building",
		valueType: "select",
		options: buildingOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.deposit-report.search.unit")),
		prop: "unit",
		valueType: "select",
		options: unitOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.deposit-report.search.roomNumber")),
		prop: "roomNumber",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.deposit-report.search.feeId")),
		prop: "feeId",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.deposit-report.search.feeItemName")),
		prop: "feeItemName",
		valueType: "select",
		options: feeItemOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.deposit-report.search.chargeStatus")),
		prop: "chargeStatus",
		valueType: "select",
		options: chargeStatusOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.deposit-report.search.chargeObjectType")),
		prop: "chargeObjectType",
		valueType: "select",
		options: chargeObjectTypeOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.deposit-report.search.feeCreateStartTime")),
		prop: "feeCreateStartTime",
		valueType: "date-picker",
	},
	{
		label: transformI18n($t("property-manage_report-manage.deposit-report.search.feeCreateEndTime")),
		prop: "feeCreateEndTime",
		valueType: "date-picker",
	},
	{
		label: transformI18n($t("property-manage_report-manage.deposit-report.search.refundStatus")),
		prop: "refundStatus",
		valueType: "select",
		options: refundStatusOptions,
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
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
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
