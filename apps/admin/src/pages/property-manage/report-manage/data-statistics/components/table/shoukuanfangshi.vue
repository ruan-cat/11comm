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

interface 报表管理_收款方式 {
	现金: string;
	POS刷卡: string;
	微信二维码: string;
	支付宝二维码: string;
	转账: string;
	押金退款到账户: string;
}

const tableDataItem: 报表管理_收款方式 = {
	现金: "114514",
	POS刷卡: "1145141919810",
	微信二维码: "114514",
	支付宝二维码: "114514",
	转账: "114514",
	押金退款到账户: "114514",
};

/** 表格数据 */
const tableData = ref<报表管理_收款方式[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);
// 表格列配置
const columns = ref<TableColumnList>([
	{
		label: "现金",
		prop: "现金",
		width: 100,
		fixed: true,
	},
	{
		label: "POS刷卡",
		prop: "POS刷卡",
		width: 100,
		fixed: true,
	},
	{
		label: "微信二维码",
		prop: "微信二维码",
		width: 100,
		fixed: true,
	},
	{
		label: "支付包二维码",
		prop: "支付宝二维码",
		width: 100,
		fixed: true,
	},
	{
		label: "转账",
		prop: "转账",
		width: 100,
		fixed: true,
	},
	{
		label: "押金",
		prop: "押金",
		width: 100,
		fixed: true,
	},
	{
		label: "押金退款到账户",
		prop: "押金退款到账户",
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
	title: "收款方式",
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
