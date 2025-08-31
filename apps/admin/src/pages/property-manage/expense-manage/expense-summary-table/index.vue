<script lang="ts" setup>
definePage({
	meta: {
		title: "费用汇总表",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.expenseSummaryTable"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 费用汇总表_列表数据 {
	时间: string;
	费用项ID: string;
	费用项名称: string;
	应收金额: string;
	实收金额: string;
}
const tableDataItem: 费用汇总表_列表数据 = {
	时间: "时间",
	费用项ID: "费用项ID",
	费用项名称: "费用项名称",
	应收金额: "应收金额",
	实收金额: "实收金额",
};
/** 表格数据 */
const tableData = ref<费用汇总表_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		prop: "时间",
		label: "时间",
		width: 120,
	},
	{
		prop: "费用项ID",
		label: "费用项ID",
		width: 120,
	},
	{
		prop: "费用项名称",
		label: "费用项名称",
		width: 120,
	},
	{
		prop: "应收金额",
		label: "应收金额",
		width: 120,
	},
	{
		prop: "实收金额",
		label: "实收金额",
		width: 120,
	},
	{
		label: transformI18n($t("common.table.operation")),
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
/** 表格组件 配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});
/** 表格操作栏组件 配置  */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "费用汇总表",
	columns: columns.value,
});
</script>

<template>
	<section class="index-root">
		<h2>缴费汇总表</h2>
		<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
		<PureTable :="pureTableProps">
			<template #operation="{ row }">
				<ElButton type="default">{{ transformI18n($t("欠费缴费")) }}</ElButton>
				<ElButton type="info">{{ transformI18n($t("common.buttons.info")) }}</ElButton>
				<ElButton type="default">{{ transformI18n($t("查看费用")) }}</ElButton>
			</template>
		</PureTable>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
