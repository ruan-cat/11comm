<script lang="ts" setup>
definePage({
	meta: {
		title: "数据统计",
		icon: "f7:menu",
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { title } from "process";

interface 报表管理_业主费用明细 {
	业主: string;
	房屋: string;
	欠费: string;
	实收: string;
	物业费: string;
	押金: string;
	停车费: string;
	煤气费: string;
	取暖费: string;
	维修费: string;
	服务费: string;
	其他: string;
	水费: string;
	电费: string;
	租金: string;
	公摊费: string;
}

const tableDataItem: 报表管理_业主费用明细 = {
	业主: "20250530业主(13555555555)",
	房屋: "20250530-112725-101",
	欠费: "1000",
	实收: "0",
	物业费: "111.00",
	押金: "0",
	停车费: "0",
	煤气费: "0",
	取暖费: "0",
	维修费: "0",
	服务费: "0",
	其他: "0",
	水费: "0",
	电费: "0",
	租金: "0",
	公摊费: "0",
};

/** 表格数据 */
const tableData = ref<报表管理_业主费用明细[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);
// 表格列配置
const columns = ref<TableColumnList>([
	{
		label: "业主111",
		prop: "业主",
		width: 120,
	},
	{
		label: "房屋",
		prop: "房屋",
		width: 60,
		fixed: true,
	},
	{
		label: "欠费",
		prop: "欠费",
		width: 160,
	},
	{
		label: "实收",
		prop: "实收",
		width: 120,
	},
	{
		label: "物业费欠费/实收",
		prop: "物业费",
		width: 180,
	},
	{
		label: "押金欠费/实收",
		prop: "押金",
		width: 180,
	},
	{
		label: "停车费欠费/实收",
		prop: "停车费",
		width: 100,
	},
	{
		label: "煤气费欠费/实收",
		prop: "结束时间",
		width: 80,
	},
	{
		label: "取暖费欠费/实收",
		prop: "取暖费",
		width: 80,
	},
	{
		label: "服务费欠费/实收",
		prop: "服务费",
		width: 80,
	},
	{
		label: "其他欠费/实收",
		prop: "其他费",
		width: 80,
	},
	{
		label: "水费欠费/实收",
		prop: "水费",
		width: 80,
	},
	{
		label: "电费欠费/实收",
		prop: "电费",
		width: 80,
	},
	{
		label: "租金欠费/实收",
		prop: "租金",
		width: 80,
	},
	{
		label: "公摊费欠费/实收",
		prop: "公摊费",
		width: 80,
	},
	// {
	// 	label: transformI18n($t("table.operation")),
	// 	minWidth: 240,
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
	title: "业主费用明细",
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
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped>
.demo-tabs > .el-tabs__content {
	padding: 32px;
	color: #6b778c;
	font-size: 32px;
	font-weight: 600;
}
</style>
