<script lang="ts" setup>
definePage({
	meta: {
		title: "巡检点",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.patrolManage.point"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 巡检明细_列表数据 {
	任务详情ID: string;
	巡检点名称: string;
	巡检计划名称: string;
	巡检路线名称: string;
	"巡检人开始/结束时间": string;
	"巡检点开始/结束时间": string;
	实际巡检时间: string;
	实际签到状态: string;
	计划巡检人: string;
	实际巡检人: string;
	巡检方式: string;
	任务状态: string;
	巡检点状态: string;
	巡检情况: string;
	巡检照片: string;
	创建时间: string;
	位置信息: string;
	操作: string;
}

const tableDataItem: 巡检明细_列表数据 = {
	任务详情ID: "任务详情ID",
	巡检点名称: "巡检点名称",
	巡检计划名称: "巡检计划名称",
	巡检路线名称: "巡检路线名称",
	"巡检人开始/结束时间": "巡检人",
	"巡检点开始/结束时间": "巡检点",
	实际巡检时间: "实际巡检时间",
	实际签到状态: "实际签到状态",
	计划巡检人: "计划巡检人",
	实际巡检人: "实际巡检人",
	巡检方式: "巡检方式",
	任务状态: "任务状态",
	巡检点状态: "巡检点状态",
	巡检情况: "巡检情况",
	巡检照片: "巡检照片",
	创建时间: "创建时间",
	位置信息: "位置信息",
};

/** 表格数据 */
const tableData = ref<巡查明细_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "任务详情ID",
		prop: "任务详情ID",
		width: 120,
		fixed: true,
	},
	{
		label: "巡检点名称",
		prop: "巡检点名称",
		width: 120,
	},
	{
		label: "巡检计划名称",
		prop: "巡检计划名称",
		width: 120,
	},
	{
		label: "巡检路线名称",
		prop: "巡检路线名称",
		width: 120,
	},
	{
		label: "巡检人开始/结束时间",
		prop: "巡检人开始/结束时间",
		width: 120,
	},
	{
		label: "巡检点开始/结束时间",
		prop: "巡检点开始/结束时间",
		width: 120,
	},
	{
		label: "实际巡检时间",
		prop: "实际巡检时间",
		width: 120,
	},
	{
		label: "实际签到状态",
		prop: "实际签到状态",
		width: 120,
	},
	{
		label: "计划巡检人",
		prop: "计划巡检人",
		width: 120,
	},
	{
		label: "实际巡检人",
		prop: "实际巡检人",
		width: 120,
	},
	{
		label: "巡检方式",
		prop: "巡检方式",
		width: 120,
	},
	{
		label: "任务状态",
		prop: "任务状态",
		width: 120,
	},
	{
		label: "巡检点状态",
		prop: "巡检点状态",
		width: 120,
	},
	{
		label: "巡检情况",
		prop: "巡检情况",
		width: 120,
	},
	{
		label: "巡检照片",
		prop: "巡检照片",
		width: 120,
	},
	{
		label: "创建时间",
		prop: "创建时间",
		width: 120,
	},
	{
		label: "位置信息",
		prop: "位置信息",
		width: 120,
	},
	{
		label: transformI18n($t("common.table.operation")),
		minWidth: 240,
		fixed: "right",
		slot: "operation",
	},
]);
/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 1000,
});

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	// 做异步接口请求
}
/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	// 做异步接口请求
}

/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "巡检明细",
	columns: columns.value,
});

interface 巡检明细_列表查询_VO {
	巡检人?: string;
	巡检开始时间?: string;
	巡检结束时间?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 巡查明细_列表查询_VO = {
	巡检人: "",
	巡检开始时间: "",
	巡检结束时间: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	// 巡检人
	{
		label: transformI18n($t("propertyManage_inspectionManage.inspection.inspectionPersonnel")),
		prop: "巡检人",
		valueType: "input",
	},

	{
		label: transformI18n($t("propertyManage_inspectionManage.inspection.inspectionStartTame")),
		prop: "巡查开始时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},

	{
		label: transformI18n($t("propertyManage_inspectionManage.inspection.inspectionCompletionTime")),
		prop: "巡查结束时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
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

function handleReSearch() {
	console.log("重新搜索");
}

async function handleSearch() {
	console.log("搜索");
}
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<!-- {{ plusSearchModel }} -->

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
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
						<ElButton type="warning"> {{ transformI18n($t("common.buttons.edit")) }} </ElButton>
						<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
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
