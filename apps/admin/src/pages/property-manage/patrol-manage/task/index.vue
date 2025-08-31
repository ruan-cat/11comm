<script lang="ts" setup>
definePage({
	meta: {
		title: "巡检任务",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.patrolManage.task"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 巡检任务_列表数据 {
	任务编码: string;
	巡检计划: string;
	"巡检人开始/结束时间": string;
	实际巡检时间: string;
	计划巡检人: string;
	当前巡检人: string;
	转移描述: string;
	巡检方式: string;
	巡检状态: string;
	操作: string;
}

const tableDataItem: 巡检任务_列表数据 = {
	任务编码: "任务编码",
	巡检计划: "巡检计划",
	"巡检人开始/结束时间": "巡检人开始/结束时间",
	实际巡检时间: "实际巡检时间",
	计划巡检人: "计划巡检人",
	当前巡检人: "当前巡检人",
	转移描述: "转移描述",
	巡检方式: "巡检方式",
	巡检状态: "巡检状态",
	操作: "操作",
};

/** 表格数据 */
const tableData = ref<巡检任务_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "任务编码",
		prop: "任务编码",
		width: 120,
		fixed: true,
	},
	{
		label: "巡检计划",
		prop: "巡检计划",
		width: 120,
	},
	{
		label: "巡检人开始/结束时间",
		prop: "巡检人开始/结束时间",
		width: 120,
	},
	{
		label: "实际巡检时间",
		prop: "实际巡检时间",
		width: 120,
	},
	{
		label: "计划巡检人",
		prop: "计划巡检人",
		width: 120,
	},
	{
		label: "当前巡检人",
		prop: "当前巡检人",
		width: 120,
	},
	{
		label: "转移描述",
		prop: "转移描述",
		width: 120,
	},
	{
		label: "巡检方式",
		prop: "巡检方式",
		width: 120,
	},
	{
		label: "巡检状态",
		prop: "巡检状态",
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
	title: "巡检任务",
	columns: columns.value,
});

interface 巡检任务_列表查询_VO {
	执行人?: string;
	巡检开始时间?: string;
	巡检结束时间?: string;
	巡检状态?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 巡检任务_列表查询_VO = {
	执行人: "",
	巡检开始时间: "",
	巡检结束时间: "",
	巡检状态: "",
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
	{
		label: transformI18n($t("propertyManage_inspectionManage.inspection.executor")),
		prop: "执行人",
		valueType: "input",
	},

	{
		label: transformI18n($t("propertyManage_inspectionManage.inspection.inspectionStartTame")),
		prop: "巡检开始时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},

	{
		label: transformI18n($t("propertyManage_inspectionManage.inspection.inspectionCompletionTime")),
		prop: "巡检结束时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},

	{
		label: transformI18n($t("propertyManage_inspectionManage.inspection.inspectionStatus")),
		prop: "巡检状态",
		valueType: "select",
		options: [
			{
				label: "未开始",
				value: "未开始",
			},
			{
				label: "巡检中",
				value: "巡检中",
			},
			{
				label: "巡检完成",
				value: "巡检完成",
			},
			{
				label: "已超时",
				value: "已超时",
			},
			{
				label: "缺勤",
				value: "缺勤",
			},
		],
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
