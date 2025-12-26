<script lang="ts" setup>
definePage({
	meta: {
		title: "巡检报表",
		icon: "mdi:clipboard-list",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.patrolReport"),
	},
});

import dayjs from "dayjs";
import { transformI18n } from "@/plugins/i18n";
import type { PatrolReportListItem, PatrolReportQueryParams } from "@01s-11comm/type";
import { patrolTypeOptions, patrolLevelOptions, statusOptions, communityOptions } from "@01s-11comm/type";
import { usePatrolReportListQuery } from "@/api/property-manage/report-manage/patrol-report";

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "小区",
		prop: "community",
		minWidth: 140,
	},
	{
		label: "巡检编号",
		prop: "patrolNumber",
		minWidth: 160,
	},
	{
		label: "巡检名称",
		prop: "patrolName",
		minWidth: 180,
	},
	{
		label: "巡检类型",
		prop: "patrolType",
		minWidth: 140,
	},
	{
		label: "巡检级别",
		prop: "patrolLevel",
		minWidth: 140,
	},
	{
		label: "负责人",
		prop: "responsiblePerson",
		minWidth: 140,
	},
	{
		label: "巡检时间",
		prop: "patrolTime",
		minWidth: 180,
	},
	{
		label: "状态",
		prop: "status",
		minWidth: 140,
	},
	{
		label: "异常数",
		prop: "abnormalCount",
		minWidth: 120,
	},
	{
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "巡检报表",
	columns: columns.value,
});

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
		label: "巡检名称",
		prop: "patrolName",
		valueType: "input",
	},
	{
		label: "巡检类型",
		prop: "patrolType",
		valueType: "select",
		options: patrolTypeOptions,
	},
	{
		label: "巡检级别",
		prop: "patrolLevel",
		valueType: "select",
		options: patrolLevelOptions,
	},
	{
		label: "负责人",
		prop: "responsiblePerson",
		valueType: "input",
	},
	{
		label: "状态",
		prop: "status",
		valueType: "select",
		options: statusOptions,
	},
	{
		label: "小区",
		prop: "community",
		valueType: "select",
		options: communityOptions,
	},
	{
		label: "巡检时间开始",
		prop: "patrolTimeStart",
		valueType: "date-picker",
	},
	{
		label: "巡检时间结束",
		prop: "patrolTimeEnd",
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
