<script lang="ts" setup>
definePage({
	meta: {
		title: "欠费分析",
		icon: "mdi:chart-line",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.outstandingFeesAnalysis"),
	},
});

import { transformI18n } from "@/plugins/i18n";
import type { OutstandingFeesAnalysisListItem, OutstandingFeesAnalysisQueryParams } from "@01s-11comm/type";
import { useOutstandingFeesAnalysisListQuery } from "@/api/property-manage/report-manage/outstanding-fees-analysis";
import {
	feeItemOptions,
	communityOptions,
	buildingOptions,
	unitOptions,
} from "@01s-11comm/type";

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "小区",
		prop: "community",
		minWidth: 140,
	},
	{
		label: "楼栋",
		prop: "building",
		minWidth: 120,
	},
	{
		label: "单元",
		prop: "unit",
		minWidth: 120,
	},
	{
		label: "房屋编号/合同名称",
		prop: "houseNumberContractName",
		minWidth: 200,
	},
	{
		label: "业主名称",
		prop: "ownerName",
		minWidth: 160,
	},
	{
		label: "业主手机号",
		prop: "ownerPhone",
		minWidth: 160,
	},
	{
		label: "费用项",
		prop: "feeItem",
		minWidth: 140,
	},
	{
		label: "总未收金额",
		prop: "totalUncollectedAmount",
		minWidth: 140,
	},
	{
		label: "当期未收金额",
		prop: "currentUncollectedAmount",
		minWidth: 140,
	},
	{
		label: "历史未收金额",
		prop: "historicalUncollectedAmount",
		minWidth: 140,
	},
	{
		label: "最近应收月份",
		prop: "latestReceivableMonth",
		minWidth: 140,
	},
	{
		label: "统计时间",
		prop: "statisticsTime",
		minWidth: 180,
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "欠费分析",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
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
} = useOutstandingFeesAnalysisListQuery(plusSearchDefaultValues);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "房屋编号/合同名称",
		prop: "houseNumberContractName",
		valueType: "input",
	},
	{
		label: "业主名称",
		prop: "ownerName",
		valueType: "input",
	},
	{
		label: "业主手机号",
		prop: "ownerPhone",
		valueType: "input",
	},
	{
		label: "费用项",
		prop: "feeItem",
		valueType: "select",
		options: feeItemOptions,
	},
	{
		label: "小区",
		prop: "community",
		valueType: "select",
		options: communityOptions,
	},
	{
		label: "楼栋",
		prop: "building",
		valueType: "select",
		options: buildingOptions,
	},
	{
		label: "单元",
		prop: "unit",
		valueType: "select",
		options: unitOptions,
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 140,
	labelPosition: "right",
	showNumber: 3,
});

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
	<section class="index-root">
		<PlusSearch
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
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
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
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
