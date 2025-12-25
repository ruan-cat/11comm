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
import type { RepairReportFormListItem, RepairReportFormQueryParams } from "@01s-11comm/type";
import {
	repairTypeOptions,
	repairStatusOptions,
	urgencyLevelOptions,
	communityOptions,
	feeStatusOptions,
} from "@01s-11comm/type";

/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: 0,
});

/** 表格数据 */
const tableData = ref<RepairReportFormListItem[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "小区",
		prop: "community",
		minWidth: 140,
	},
	{
		label: "报修单号",
		prop: "repairOrderNumber",
		minWidth: 160,
	},
	{
		label: "报修类型",
		prop: "repairType",
		minWidth: 140,
	},
	{
		label: "紧急程度",
		prop: "urgencyLevel",
		minWidth: 140,
	},
	{
		label: "报修人",
		prop: "reporter",
		minWidth: 140,
	},
	{
		label: "报修电话",
		prop: "reporterPhone",
		minWidth: 160,
	},
	{
		label: "报修地址",
		prop: "repairAddress",
		minWidth: 180,
	},
	{
		label: "报修时间",
		prop: "reportTime",
		minWidth: 180,
	},
	{
		label: "受理人",
		prop: "handler",
		minWidth: 140,
	},
	{
		label: "处理人",
		prop: "processor",
		minWidth: 140,
	},
	{
		label: "费用状态",
		prop: "feeStatus",
		minWidth: 140,
	},
	{
		label: "报修状态",
		prop: "repairStatus",
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
const plusSearchModelRef: FieldValues & RepairReportFormQueryParams = {
	repairType: "",
	repairStatus: "",
	urgencyLevel: "",
	reporter: "",
	reporterPhone: "",
	community: "",
	reportTimeStart: "",
	reportTimeEnd: "",
	feeStatus: "",
	pageIndex: 1,
	pageSize: 10,
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
		label: "报修人",
		prop: "reporter",
		valueType: "input",
	},
	{
		label: "报修电话",
		prop: "reporterPhone",
		valueType: "input",
	},
	{
		label: "小区",
		prop: "community",
		valueType: "select",
		options: communityOptions,
	},
	{
		label: "费用状态",
		prop: "feeStatus",
		valueType: "select",
		options: feeStatusOptions,
	},
	{
		label: "报修时间开始",
		prop: "reportTimeStart",
		valueType: "date-picker",
	},
	{
		label: "报修时间结束",
		prop: "reportTimeEnd",
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
	let filteredData: RepairReportFormListItem[] = [];

	if (plusSearchModel.value.repairType) {
		filteredData = filteredData.filter((item) => item.repairType === plusSearchModel.value.repairType);
	}

	if (plusSearchModel.value.repairStatus) {
		filteredData = filteredData.filter((item) => item.repairStatus === plusSearchModel.value.repairStatus);
	}

	if (plusSearchModel.value.urgencyLevel) {
		filteredData = filteredData.filter((item) => item.urgencyLevel === plusSearchModel.value.urgencyLevel);
	}

	if (plusSearchModel.value.reporter) {
		filteredData = filteredData.filter((item) => item.reporter.includes(plusSearchModel.value.reporter!));
	}

	if (plusSearchModel.value.reporterPhone) {
		filteredData = filteredData.filter((item) => item.reporterPhone.includes(plusSearchModel.value.reporterPhone!));
	}

	if (plusSearchModel.value.community) {
		filteredData = filteredData.filter((item) => item.community === plusSearchModel.value.community);
	}

	if (plusSearchModel.value.feeStatus) {
		filteredData = filteredData.filter((item) => item.feeStatus === plusSearchModel.value.feeStatus);
	}

	if (plusSearchModel.value.reportTimeStart && plusSearchModel.value.reportTimeEnd) {
		const start = dayjs(plusSearchModel.value.reportTimeStart);
		const end = dayjs(plusSearchModel.value.reportTimeEnd);
		filteredData = filteredData.filter((item) => {
			const current = dayjs(item.reportTime);
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
