<script lang="ts" setup>
definePage({
	meta: {
		title: "费用提醒",
		icon: "f7:menu",
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { title } from "process";

interface 报表管理_预缴费提醒 {
	费用编号: string;
	房号车辆合同: string;
	费用项: string;
	费用开始时间: string;
	距离费用开始时间: string;
}

const tableDataItem: 报表管理_预缴费提醒 = {
	费用编号: "1",
	房号车辆合同: "1-0-1",
	费用项: "gugugaga",
	费用开始时间: "2025-05-25 00：00：00",
	距离费用开始时间: "114514",
};

/** 表格数据 */
const tableData = ref<报表管理_预缴费提醒[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);
// 表格列配置
const columns = ref<TableColumnList>([
	{
		label: "费用编号",
		prop: "费用编号",
		width: 160,
		fixed: true,
	},
	{
		label: "房号/车辆/合同",
		prop: "房号车辆合同",
		width: 300,
	},
	{
		label: "费用项",
		prop: "费用项",
		width: 300,
	},
	{
		label: "费用开始时间",
		prop: "费用开始时间",
		width: 300,
	},
	{
		label: "距离费用开始时间(天)",
		prop: "距离费用开始时间",
		width: 300,
	},
	// {
	// 	label: transformI18n($t("table.operation")),
	// 	minWidth: 160,
	// 	fixed: "right",
	// 	slot: "operation",
	// },
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
	border: true,
	stripe: true,
	adaptive: true,
	highlightCurrentRow: true,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

// 表格操作栏组件配置
const pureTableBarProps = ref<PureTableBarProps>({
	title: "预缴费提醒",
	columns: columns.value,
});
</script>

<template>
	<section class="index-root">
		<!-- {{ plusSearchModel }} -->
		<PureTableBar :="pureTableBarProps">
			<template #buttons>
				<ElButton type="primary"> {{ transformI18n($t("propertyManage_reportManage.report.derived")) }} </ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				/>
				温馨提示：此表反馈7天内开始缴费的费用
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
