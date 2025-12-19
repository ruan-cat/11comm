<script lang="ts" setup>
definePage({
	meta: {
		title: "数据统计",
		icon: "mdi:chart-bar",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.dataStatistics"),
	},
});

import dayjs from "dayjs";
import { transformI18n } from "@/plugins/i18n";
import { cloneDeep } from "lodash-es";
import type {
  DataStatisticsListItem,
  DataStatisticsQueryParams
} from "@01s-11comm/type";
/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 0,
});

/** 表格数据 */
const tableData = ref<DataStatisticsListItem[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "小区",
		prop: "小区",
		minWidth: 160,
	},
	{
		label: "房屋",
		prop: "房屋",
		minWidth: 160,
	},
	{
		label: "业主",
		prop: "业主",
		minWidth: 180,
	},
	{
		label: "欠费",
		prop: "欠费",
		minWidth: 120,
	},
	{
		label: "实收",
		prop: "实收",
		minWidth: 120,
	},
	{
		label: "物业费",
		prop: "物业费",
		minWidth: 120,
	},
	{
		label: "押金",
		prop: "押金",
		minWidth: 120,
	},
	{
		label: "停车费",
		prop: "停车费",
		minWidth: 120,
	},
	{
		label: "煤气费",
		prop: "煤气费",
		minWidth: 120,
	},
	{
		label: "取暖费",
		prop: "取暖费",
		minWidth: 120,
	},
	{
		label: "维修费",
		prop: "维修费",
		minWidth: 120,
	},
	{
		label: "服务费",
		prop: "服务费",
		minWidth: 120,
	},
	{
		label: "其他",
		prop: "其他",
		minWidth: 120,
	},
	{
		label: "水费",
		prop: "水费",
		minWidth: 120,
	},
	{
		label: "电费",
		prop: "电费",
		minWidth: 120,
	},
	{
		label: "租金",
		prop: "租金",
		minWidth: 120,
	},
	{
		label: "公摊费",
		prop: "公摊费",
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

/** 表格操作栏组件配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "数据统计",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & DataStatisticsQueryParams = {
	name: "",
	status: "",
	pageIndex: 1,
	pageSize: 10,
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
		label: "开始时间",
		prop: "startTime",
		valueType: "date-picker",
	},
	{
		label: "结束时间",
		prop: "endTime",
		valueType: "date-picker",
	},
	{
		label: "小区",
		prop: "community",
		valueType: "select",
		options: [],
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
	try {
		// TODO: 使用 TanStack Query Hook 替换 mockTableData
		// 这里应该调用 API 获取真实数据

		pagination.value.total = tableData.value.length;

		const startIndex = (pagination.value.currentPage - 1) * pagination.value.pageSize;
		const endIndex = startIndex + pagination.value.pageSize;
		pureTableProps.value.data = tableData.value.slice(startIndex, endIndex);
		pureTableProps.value.pagination = pagination.value;
	} catch (error) {
		console.error("加载数据失败:", error);
	}
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
