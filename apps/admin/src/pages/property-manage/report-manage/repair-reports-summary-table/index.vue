<script lang="ts" setup>
definePage({
	meta: {
		title: "报修汇总表",
		icon: "mdi:table-merge-cells",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.repairReportsSummaryTable"),
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
const tableData = ref<报修汇总表_表格数据[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "小区",
		prop: "小区",
		minWidth: 140,
	},
	{
		label: "报修类型",
		prop: "报修类型",
		minWidth: 140,
	},
	{
		label: "报修数量",
		prop: "报修数量",
		minWidth: 120,
	},
	{
		label: "处理中",
		prop: "处理中",
		minWidth: 120,
	},
	{
		label: "已完成",
		prop: "已完成",
		minWidth: 120,
	},
	{
		label: "未完成",
		prop: "未完成",
		minWidth: 120,
	},
	{
		label: "待回访",
		prop: "待回访",
		minWidth: 120,
	},
	{
		label: "不满意",
		prop: "不满意",
		minWidth: 120,
	},
	{
		label: "紧急工单",
		prop: "紧急工单",
		minWidth: 120,
	},
	{
		label: "统计时间",
		prop: "统计时间",
		minWidth: 180,
	},
]);

/** 表格配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "报修汇总表",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 报修汇总表_搜索_VO = {
	报修类型: "",
	报修状态: "",
	紧急程度: "",
	小区: "",
	统计开始时间: "",
	统计结束时间: "",
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
		label: "小区",
		prop: "小区",
		valueType: "select",
		options: 小区Options,
	},
	{
		label: "统计开始时间",
		prop: "统计开始时间",
		valueType: "date-picker",
	},
	{
		label: "统计结束时间",
		prop: "统计结束时间",
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
	filteredData = filteredData.filter((item) => item.报修状态标签 === plusSearchModel.value.报修状态);
}

if (plusSearchModel.value.紧急程度) {
	filteredData = filteredData.filter((item) => item.紧急程度标签 === plusSearchModel.value.紧急程度);
}

	if (plusSearchModel.value.小区) {
		filteredData = filteredData.filter((item) => item.小区 === plusSearchModel.value.小区);
	}

	if (plusSearchModel.value.统计开始时间 && plusSearchModel.value.统计结束时间) {
		const start = dayjs(plusSearchModel.value.统计开始时间);
		const end = dayjs(plusSearchModel.value.统计结束时间);
		filteredData = filteredData.filter((item) => {
			const current = dayjs(item.统计时间);
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
