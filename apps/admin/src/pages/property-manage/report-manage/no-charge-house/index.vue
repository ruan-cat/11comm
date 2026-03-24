<script lang="ts" setup>
definePage({
	meta: {
		// 未收费房屋
		title: "property-manage_report-manage.no-charge-house.pageTitle",
		icon: "mdi:home-alert",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.noChargeHouse"),
	},
});
import { cloneDeep } from "@pureadmin/utils";

import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { NoChargeHouseListItem, NoChargeHouseQueryParams } from "@01s-11comm/type";
import { useNoChargeHouseListQuery } from "@/api/property-manage/report-manage/no-charge-house";
import { communityOptions, buildingOptions, unitOptions } from "@01s-11comm/type";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

/** 表格列配置 */
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.no-charge-house.fields.community")),
		),
		prop: "community",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.no-charge-house.fields.building")),
		),
		prop: "building",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.no-charge-house.fields.unit")),
		),
		prop: "unit",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.no-charge-house.fields.houseNumberContractName")),
		),
		prop: "houseNumberContractName",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.no-charge-house.fields.ownerName")),
		),
		prop: "ownerName",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.no-charge-house.fields.ownerPhone")),
		),
		prop: "ownerPhone",
		minWidth: 160,
	},
]);

/** 表格操作栏组件配置 */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_report-manage.no-charge-house.pageTitle")),
	columns: columns.value,
}));

const plusSearchModelRef: FieldValues & NoChargeHouseQueryParams = {
	houseNumberContractName: "",
	ownerName: "",
	ownerPhone: "",
	community: "",
	building: "",
	unit: "",
	pageIndex: 1,
	pageSize: 10,
};
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);
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
} = useNoChargeHouseListQuery(plusSearchDefaultValues);

const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: transformI18n($t("property-manage_report-manage.no-charge-house.search.houseNumberContractName")),
		prop: "houseNumberContractName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.no-charge-house.search.ownerName")),
		prop: "ownerName",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.no-charge-house.search.ownerPhone")),
		prop: "ownerPhone",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.no-charge-house.search.community")),
		prop: "community",
		valueType: "select",
		options: communityOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.no-charge-house.search.building")),
		prop: "building",
		valueType: "select",
		options: buildingOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.no-charge-house.search.unit")),
		prop: "unit",
		valueType: "select",
		options: unitOptions,
	},
]);

const plusSearchProps = searchProps(plusSearchDefaultValues);

function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
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
				/>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
