<script lang="ts" setup>
definePage({
	meta: {
		title: "费用明细表",
		icon: "mdi:receipt",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.statementExpenses"),
	},
});

import { ref, computed } from "vue";
import { transformI18n } from "@/plugins/i18n";
import type { StatementExpensesListItem, StatementExpensesQueryParams } from "@01s-11comm/type";
import {
	expenseTypeOptions,
	expenseItemOptions,
	expenseStatusOptions,
	paymentMethodOptions,
	statementExpensesCommunityOptions,
} from "@01s-11comm/type";

import { useStatementExpensesListQuery } from "@/api/property-manage/report-manage/statement-expenses";
import { type RemovePageIndexAndPageSize } from "@/utils/remove-pageIndex-and-pageSize";

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & RemovePageIndexAndPageSize<StatementExpensesQueryParams> = {
	community: "",
	houseContractName: "",
	ownerName: "",
	expenseType: "",
	expenseItem: "",
	expenseStatus: "",
	paymentMethod: "",
	billingPeriod: "",
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
} = useStatementExpensesListQuery(plusSearchDefaultValues);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "小区",
		prop: "community",
		width: 120,
	},
	{
		label: "房屋编号/合同名称",
		prop: "houseContractName",
		width: 160,
	},
	{
		label: "业主名称",
		prop: "ownerName",
		width: 120,
	},
	{
		label: "费用类型",
		prop: "expenseType",
		width: 120,
	},
	{
		label: "费用项",
		prop: "expenseItem",
		width: 120,
	},
	{
		label: "费用状态",
		prop: "expenseStatus",
		width: 100,
	},
	{
		label: "支付方式",
		prop: "paymentMethod",
		width: 100,
	},
	{
		label: "应收金额",
		prop: "receivableAmount",
		width: 100,
	},
	{
		label: "已收金额",
		prop: "receivedAmount",
		width: 100,
	},
	{
		label: "未收金额",
		prop: "unpaidAmount",
		width: 100,
	},
	{
		label: "账期",
		prop: "billingPeriod",
		width: 120,
	},
	{
		label: "开始日期",
		prop: "startDate",
		width: 120,
	},
	{
		label: "结束日期",
		prop: "endDate",
		width: 120,
	},
	{
		label: "计费面积",
		prop: "billingArea",
		width: 100,
	},
	{
		label: "车位",
		prop: "parkingSpace",
		width: 120,
	},
	{
		/** @see https://vscode.dev/github/pure-admin/pure-admin-table/blob/main/src/columns.tsx#L36 */
		headerRenderer: () => transformI18n($t("common.table.operation")),
		width: 100,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格操作栏组件配置 */
const pureTableBarProps = ref<PureTableBarProps>({
	title: "费用明细表",
	columns: columns.value,
});

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "小区",
		prop: "community",
		valueType: "select",
		options: statementExpensesCommunityOptions,
	},
	{
		label: "房屋/合同",
		prop: "houseContractName",
		valueType: "input",
	},
	{
		label: "业主名称",
		prop: "ownerName",
		valueType: "input",
	},
	{
		label: "费用类型",
		prop: "expenseType",
		valueType: "select",
		options: expenseTypeOptions,
	},
	{
		label: "费用项",
		prop: "expenseItem",
		valueType: "select",
		options: expenseItemOptions,
	},
	{
		label: "费用状态",
		prop: "expenseStatus",
		valueType: "select",
		options: expenseStatusOptions,
	},
	{
		label: "支付方式",
		prop: "paymentMethod",
		valueType: "select",
		options: paymentMethodOptions,
	},
	{
		label: "账期",
		prop: "billingPeriod",
		valueType: "input",
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	defaultValues: plusSearchDefaultValues,
	columns: [],
	labelWidth: 100,
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
			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
					@page-size-change="handlePageSizeChange"
					@page-current-change="handleCurrentPageChange"
				>
					<template #operation="{ row }">
						<ElButton type="primary" link> 详情 </ElButton>
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