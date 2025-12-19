<script lang="ts" setup>
definePage({
	meta: {
		title: "报修汇总表",
		icon: "mdi:table-merge-cells",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.repairReportsSummaryTable"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import {
	type RepairReportsSummaryTableListItem,
	type RepairReportsSummaryTableQueryParams,
	repairTypeOptions,
	repairStatusOptions,
	urgencyLevelOptions,
	communityOptions,
} from "@01s-11comm/type";
import { useRepairReportsSummaryTableListQuery } from "@/api/property-manage/report-manage/repair-reports-summary-table";

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
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "报修类型",
		prop: "repairType",
		valueType: "select",
		options: repairTypeOptions,
	},
	{
		label: "报修状态",
		prop: "repairStatus",
		valueType: "select",
		options: repairStatusOptions,
	},
	{
		label: "紧急程度",
		prop: "urgencyLevel",
		valueType: "select",
		options: urgencyLevelOptions,
	},
	{
		label: "小区",
		prop: "community",
		valueType: "select",
		options: communityOptions,
	},
	{
		label: "统计开始时间",
		prop: "statisticsStartTime",
		valueType: "date-picker",
	},
	{
		label: "统计结束时间",
		prop: "statisticsEndTime",
		valueType: "date-picker",
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

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
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
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "小区",
		prop: "community",
		minWidth: 140,
	},
	{
		label: "报修类型",
		prop: "repairType",
		minWidth: 140,
	},
	{
		label: "报修数量",
		prop: "repairCount",
		minWidth: 120,
	},
	{
		label: "处理中",
		prop: "processingCount",
		minWidth: 120,
	},
	{
		label: "已完成",
		prop: "completedCount",
		minWidth: 120,
	},
	{
		label: "未完成",
		prop: "unfinishedCount",
		minWidth: 120,
	},
	{
		label: "待回访",
		prop: "pendingRevisitCount",
		minWidth: 120,
	},
	{
		label: "不满意",
		prop: "dissatisfiedCount",
		minWidth: 120,
	},
	{
		label: "紧急工单",
		prop: "emergencyCount",
		minWidth: 120,
	},
	{
		label: "统计时间",
		prop: "statisticsTime",
		minWidth: 180,
	},
	{
		label: "操作",
		width: 200,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "报修汇总表",
	columns: columns.value,
});
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

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="info" :loading="isFetching" @click="handleReSearch">
					{{ transformI18n($t("common.buttons.pureReload")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
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
