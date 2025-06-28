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

interface 报表管理_收缴情况 {
	楼栋: string;
	户数: string;
	收费户: string;
	历史欠费: string;
	总欠费: string;
	本日已交户数: string;
	本日已交金额: string;
	历史欠费清缴户: string;
	历史欠费清缴金额: string;
	本月已收户数: string;
	剩余户数: string;
	已收户占比: string;
	当月已收金额: string;
	当月剩余未收: string;
	收费率: string;
}

const tableDataItem: 报表管理_收缴情况 = {
	楼栋: "A1",
	户数: "7",
	收费户: "0",
	历史欠费: "物业费(2077-1-1~2077-8-8)",
	总欠费: "1(2077-01-01~2077-08-08)=199",
	本日已交户数: "0",
	本日已交金额: "0",
	历史欠费清缴户: "0",
	历史欠费清缴金额: "0",
	本月已收户数: "0",
	剩余户数: "0",
	已收户占比: "居民生活费(2077-01-01~2077-02-02)",
	当月已收金额: "0",
	当月剩余未收: "0",
	收费率: "0",
};

/** 表格数据 */
const tableData = ref<报表管理_收缴情况[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);
// 表格列配置
const columns = ref<TableColumnList>([
	{
		label: "楼栋",
		prop: "楼栋",
		width: 100,
		fixed: true,
	},
	{
		label: "户数",
		prop: "户数",
		width: 100,
		fixed: true,
	},
	{
		label: "收费户",
		prop: "收费户",
		width: 100,
		fixed: true,
	},
	{
		label: "历史欠费",
		prop: "历史欠费",
		width: 100,
		fixed: true,
	},
	{
		label: "总欠费",
		prop: "总欠费",
		width: 100,
		fixed: true,
	},
	{
		label: "本日已交户数",
		prop: "本日已交户数",
		width: 100,
		fixed: true,
	},
	{
		label: "历史欠费清缴户",
		prop: "历史欠费清缴户",
		width: 100,
		fixed: true,
	},
	{
		label: "历史欠费清缴金额",
		prop: "历史欠费清缴金额",
		width: 100,
		fixed: true,
	},
	{
		label: "本月已收户数",
		prop: "本月已收户数",
		width: 100,
		fixed: true,
	},
	{
		label: "剩余户数",
		prop: "剩余户数",
		width: 100,
		fixed: true,
	},
	{
		label: "已收户占比",
		prop: "已收户占比",
		width: 100,
		fixed: true,
	},
	{
		label: "当月已收金额",
		prop: "当月已收金额",
		width: 100,
		fixed: true,
	},
	{
		label: "当月剩余未收",
		prop: "当月剩余未收",
		width: 100,
		fixed: true,
	},
	{
		label: "收费率",
		prop: "收费率",
		width: 100,
		fixed: true,
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
	title: "收缴情况",
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
.index-root {
}
.demo-tabs > .el-tabs__content {
	padding: 32px;
	color: #6b778c;
	font-size: 32px;
	font-weight: 600;
}
</style>
