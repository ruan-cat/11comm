<script lang="ts" setup>
definePage({
	meta: {
		title: "报修报表",
		icon: "mdi:tools",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.repairReportForm"),
	},
});

import dayjs from "dayjs";
import { transformI18n } from "@/plugins/i18n";
/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: mockTableData.length,
});

/** 表格数据 */
const tableData = ref<报修报表_表格数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "小区",
		prop: "小区",
		minWidth: 140,
	},
	{
		label: "报修单号",
		prop: "报修单号",
		minWidth: 160,
	},
	{
		label: "报修类型",
		prop: "报修类型",
		minWidth: 140,
	},
	{
		label: "紧急程度",
		prop: "紧急程度",
		minWidth: 140,
	},
	{
		label: "报修人",
		prop: "报修人",
		minWidth: 140,
	},
	{
		label: "报修电话",
		prop: "报修电话",
		minWidth: 160,
	},
	{
		label: "报修地址",
		prop: "报修地址",
		minWidth: 180,
	},
	{
		label: "报修时间",
		prop: "报修时间",
		minWidth: 180,
	},
	{
		label: "受理人",
		prop: "受理人",
		minWidth: 140,
	},
	{
		label: "处理人",
		prop: "处理人",
		minWidth: 140,
	},
	{
		label: "费用状态",
		prop: "费用状态",
		minWidth: 140,
	},
	{
		label: "报修状态",
		prop: "报修状态",
		minWidth: 140,
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
	title: "报修报表",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 报修报表_搜索_VO = {
	报修类型: "",
	报修状态: "",
	紧急程度: "",
	报修人: "",
	报修电话: "",
	小区: "",
	报修时间开始: "",
	报修时间结束: "",
	费用状态: "",
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
		prop: "报修类型",
		valueType: "select",
		options: 报修类型Options,
	},
	{
		label: "报修状态",
		prop: "报修状态",
		valueType: "select",
		options: 报修状态Options,
	},
	{
		label: "紧急程度",
		prop: "紧急程度",
		valueType: "select",
		options: 紧急程度Options,
	},
	{
		label: "报修人",
		prop: "报修人",
		valueType: "input",
	},
	{
		label: "报修电话",
		prop: "报修电话",
		valueType: "input",
	},
	{
		label: "小区",
		prop: "小区",
		valueType: "select",
		options: 小区Options,
	},
	{
		label: "费用状态",
		prop: "费用状态",
		valueType: "select",
		options: 收费状态Options,
	},
	{
		label: "报修时间开始",
		prop: "报修时间开始",
		valueType: "date-picker",
	},
	{
		label: "报修时间结束",
		prop: "报修时间结束",
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

	if (plusSearchModel.value.报修类型) {
		filteredData = filteredData.filter((item) => item.报修类型 === plusSearchModel.value.报修类型);
	}

	if (plusSearchModel.value.报修状态) {
		filteredData = filteredData.filter((item) => item.报修状态 === plusSearchModel.value.报修状态);
	}

	if (plusSearchModel.value.紧急程度) {
		filteredData = filteredData.filter((item) => item.紧急程度 === plusSearchModel.value.紧急程度);
	}

	if (plusSearchModel.value.报修人) {
		filteredData = filteredData.filter((item) => item.报修人.includes(plusSearchModel.value.报修人!));
	}

	if (plusSearchModel.value.报修电话) {
		filteredData = filteredData.filter((item) => item.报修电话.includes(plusSearchModel.value.报修电话!));
	}

	if (plusSearchModel.value.小区) {
		filteredData = filteredData.filter((item) => item.小区 === plusSearchModel.value.小区);
	}

	if (plusSearchModel.value.费用状态) {
		filteredData = filteredData.filter((item) => item.费用状态 === plusSearchModel.value.费用状态);
	}

	if (plusSearchModel.value.报修时间开始 && plusSearchModel.value.报修时间结束) {
		const start = dayjs(plusSearchModel.value.报修时间开始);
		const end = dayjs(plusSearchModel.value.报修时间结束);
		filteredData = filteredData.filter((item) => {
			const current = dayjs(item.报修时间);
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
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
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

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
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
