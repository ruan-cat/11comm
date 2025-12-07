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
import {
	tableData as mockTableData,
	type 巡检报表_搜索_VO,
	type 巡检报表_表格数据,
	巡检类型Options,
	巡检级别Options,
	小区Options,
	状态Options,
} from "./test-data";

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: mockTableData.length,
});

/** 表格数据 */
const tableData = ref<巡检报表_表格数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "小区",
		prop: "小区",
		minWidth: 140,
	},
	{
		label: "巡检编号",
		prop: "巡检编号",
		minWidth: 160,
	},
	{
		label: "巡检名称",
		prop: "巡检名称",
		minWidth: 180,
	},
	{
		label: "巡检类型",
		prop: "巡检类型",
		minWidth: 140,
	},
	{
		label: "巡检级别",
		prop: "巡检级别",
		minWidth: 140,
	},
	{
		label: "负责人",
		prop: "负责人",
		minWidth: 140,
	},
	{
		label: "巡检时间",
		prop: "巡检时间",
		minWidth: 180,
	},
	{
		label: "状态",
		prop: "状态",
		minWidth: 140,
	},
	{
		label: "异常数",
		prop: "异常数",
		minWidth: 120,
	},
	{
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

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
const plusSearchModelRef: FieldValues & 巡检报表_搜索_VO = {
	巡检名称: "",
	巡检类型: "",
	巡检级别: "",
	负责人: "",
	状态: "",
	小区: "",
	巡检时间开始: "",
	巡检时间结束: "",
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
		label: "巡检名称",
		prop: "巡检名称",
		valueType: "input",
	},
	{
		label: "巡检类型",
		prop: "巡检类型",
		valueType: "select",
		options: 巡检类型Options,
	},
	{
		label: "巡检级别",
		prop: "巡检级别",
		valueType: "select",
		options: 巡检级别Options,
	},
	{
		label: "负责人",
		prop: "负责人",
		valueType: "input",
	},
	{
		label: "状态",
		prop: "状态",
		valueType: "select",
		options: 状态Options,
	},
	{
		label: "小区",
		prop: "小区",
		valueType: "select",
		options: 小区Options,
	},
	{
		label: "巡检时间开始",
		prop: "巡检时间开始",
		valueType: "date-picker",
	},
	{
		label: "巡检时间结束",
		prop: "巡检时间结束",
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

/** 加载表格数据 */
async function loadTableData() {
	let filteredData = mockTableData;

	if (plusSearchModel.value.巡检名称) {
		filteredData = filteredData.filter((item) => item.巡检名称.includes(plusSearchModel.value.巡检名称!));
	}

	if (plusSearchModel.value.巡检类型) {
		filteredData = filteredData.filter((item) => item.巡检类型 === plusSearchModel.value.巡检类型);
	}

	if (plusSearchModel.value.巡检级别) {
		filteredData = filteredData.filter((item) => item.巡检级别 === plusSearchModel.value.巡检级别);
	}

	if (plusSearchModel.value.负责人) {
		filteredData = filteredData.filter((item) => item.负责人.includes(plusSearchModel.value.负责人!));
	}

	if (plusSearchModel.value.状态) {
		filteredData = filteredData.filter((item) => item.状态 === plusSearchModel.value.状态);
	}

	if (plusSearchModel.value.小区) {
		filteredData = filteredData.filter((item) => item.小区 === plusSearchModel.value.小区);
	}

	if (plusSearchModel.value.巡检时间开始 && plusSearchModel.value.巡检时间结束) {
		const start = dayjs(plusSearchModel.value.巡检时间开始);
		const end = dayjs(plusSearchModel.value.巡检时间结束);
		filteredData = filteredData.filter((item) => {
			const current = dayjs(item.巡检时间);
			return current.isAfter(start) && current.isBefore(end);
		});
	}

	pagination.value.total = filteredData.length;

	const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
	const endIndex = startIndex + pagination.value.pageSize;
	tableData.value = filteredData.slice(startIndex, endIndex);

	pureTableProps.value.data = tableData.value;
	pureTableProps.value.pagination = pagination.value;
}

/** 重置搜索条件并重新加载数据 */
async function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 执行搜索 */
async function handleSearch() {
	pagination.value.currentPage = 1;
	await loadTableData();
}

/** 处理页数变化 */
async function handlePageSizeChange(pageSize: number) {
	pagination.value.pageSize = pageSize;
	await loadTableData();
}

/** 处理页码变化 即后端的 pageIndex */
async function handleCurrentPageChange(currentPage: number) {
	pagination.value.currentPage = currentPage;
	await loadTableData();
}

onMounted(async () => {
	await loadTableData();
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
				<ElButton type="info" @click="handleReSearch">
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
