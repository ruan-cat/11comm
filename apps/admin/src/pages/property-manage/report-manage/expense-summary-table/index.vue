<script lang="ts" setup>
definePage({
	meta: {
		title: "费用汇总表",
		icon: "mdi:table-large",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.expenseSummaryTable"),
	},
});

import dayjs from "dayjs";
import { transformI18n } from "@/plugins/i18n";
import BuildChart from "./components/build.vue";
import PaymentChart from "./components/payment.vue";
import type { ExpenseSummaryTableListItem, ExpenseSummaryTableQueryParams, expenseItemNameOptions, expenseStatusOptions } from "@01s-11comm/type";
import { useExpenseSummaryTableListQuery } from "@/api/property-manage/report-manage/expense-summary-table";

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "小区",
		prop: "小区",
		minWidth: 140,
	},
	{
		label: "房屋编号/合同名称",
		prop: "房屋编号合同名称",
		minWidth: 200,
	},
	{
		label: "业主名称",
		prop: "业主名称",
		minWidth: 160,
	},
	{
		label: "业主手机号",
		prop: "业主手机号",
		minWidth: 160,
	},
	{
		label: "费用项",
		prop: "费用项",
		minWidth: 140,
	},
	{
		label: "总户数",
		prop: "总户数",
		minWidth: 120,
	},
	{
		label: "收费户",
		prop: "收费户",
		minWidth: 120,
	},
	{
		label: "欠费户",
		prop: "欠费户",
		minWidth: 120,
	},
	{
		label: "欠费",
		prop: "欠费",
		minWidth: 140,
	},
	{
		label: "实缴",
		prop: "实缴",
		minWidth: 140,
	},
	{
		label: "当期应收",
		prop: "当期应收",
		minWidth: 140,
	},
	{
		label: "当前实收",
		prop: "当前实收",
		minWidth: 140,
	},
	{
		label: "户收费率",
		prop: "户收费率",
		minWidth: 140,
	},
	{
		label: "收费率",
		prop: "收费率",
		minWidth: 140,
	},
	{
		label: "清缴率",
		prop: "清缴率",
		minWidth: 140,
	},
	{
		label: "统计时间",
		prop: "统计时间",
		minWidth: 180,
	},
]);

/** 表格操作栏组件配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "费用汇总表",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ExpenseSummaryTableQueryParams> = {
	time: "",
	expenseItemId: "",
	expenseItemName: "",
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/** 使用 TanStack Query 获取数据 */
const {
	tableData,
	pureTableProps,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = useExpenseSummaryTableListQuery(plusSearchDefaultValues);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "房屋编号/合同名称",
		prop: "房屋编号合同名称",
		valueType: "input",
	},
	{
		label: "业主名称",
		prop: "业主名称",
		valueType: "input",
	},
	{
		label: "业主手机号",
		prop: "业主手机号",
		valueType: "input",
	},
	{
		label: "费用项名称",
		prop: "expenseItemName",
		valueType: "select",
		options: expenseItemNameOptions,
		fieldProps: {
			clearable: true,
			filterable: true,
		},
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

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = structuredClone(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({ ...plusSearchModel.value, pageIndex: 1 });
}
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
				<ElButton type="info" @click="doFetch">
					{{ transformI18n($t("common.buttons.pureReload")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				/>
			</template>
		</PureTableBar>

		<div>
			楼栋收费率统计柱状图
			<BuildChart />
		</div>
		<div>
			费用项收费率统计柱状图
			<PaymentChart />
		</div>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
