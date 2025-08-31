<script lang="ts" setup>
definePage({
	meta: {
		title: "报修已办",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.repairsManage.repairsHaveDone"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 报修已办_列表数据 {
	工单编号: string;
	位置: string;
	报修类型: string;
	维修类型: string;
	报修人: string;
	联系方式: string;
	预约时间: string;
	状态: string;
	备注: string;
}

const tableDataItem: 报修已办_列表数据 = {
	工单编号: "工单编号",
	位置: "位置",
	报修类型: "报修类型",
	维修类型: "维修类型",
	报修人: "报修人",
	联系方式: "联系方式",
	预约时间: "预约时间",
	状态: "状态",
	备注: "备注",
};

/** 表格数据 */
const tableData = ref<报修已办_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		label: "工单编号",
		prop: "工单编号",
		width: 120,
		fixed: true,
	},
	{
		label: "位置",
		prop: "位置",
		width: 120,
	},
	{
		label: "报修类型",
		prop: "报修类型",
		width: 120,
	},
	{
		label: "维修类型",
		prop: "维修类型",
		width: 120,
	},
	{
		label: "报修人",
		prop: "报修人",
		width: 120,
	},
	{
		label: "联系方式",
		prop: "联系方式",
		width: 120,
	},
	{
		label: "预约时间",
		prop: "预约时间",
		width: 120,
	},
	{
		label: "状态",
		prop: "状态",
		width: 120,
	},
	{
		// label: transformI18n($t("common.table.operation")),
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
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

/** 表格配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "报修已办",
	columns: columns.value,
});

interface 报修已办_列表查询_VO {
	维修类型?: string;
	报修人?: string;
	报修电话?: string;
	报修类型?: string;
	报修状态?: string;
	工单编号?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 报修已办_列表查询_VO = {
	维修类型: "",
	报修人: "",
	报修电话: "",
	报修类型: "",
	报修状态: "",
	工单编号: "",
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
	// 维修类型
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.maintenanceType")),
		prop: "维修类型",
		valueType: "select",
		options: [
			{
				label: "有偿服务",
				value: "有偿服务",
			},
			{
				label: "无偿服务",
				value: "无偿服务",
			},
			{
				label: "需要用料",
				value: "无需用料",
			},
			{
				label: "无需用料",
				value: "维修单",
			},
		],
	},
	// 报修人
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairman")),
		prop: "报修人",
		valueType: "input",
	},

	// 报修电话
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairPhone")),
		prop: "报修电话",
		valueType: "input",
	},
	// 报修类型
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairType")),
		prop: "报修类型",
		valueType: "select",
		options: [
			{
				label: "类型1",
				value: "类型1",
			},
			{
				label: "类型2",
				value: "类型2",
			},
		],
	},

	// 报修状态
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.repairStatus")),
		prop: "报修状态",
		valueType: "select",
		options: [
			{
				label: "状态1",
				value: "状态1",
			},
			{
				label: "状态2",
				value: "状态2",
			},
		],
	},

	// 工单编号
	{
		label: transformI18n($t("propertyManage_repairsManage.repairs.workOrderNumber")),
		prop: "工单编号",
		valueType: "input",
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

async function handleReSearch() {
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
