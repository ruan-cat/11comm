<script lang="ts" setup>
definePage({
	meta: {
		title: "缴费明细表",
		icon: "mdi:cash-register",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.paymentDetailsForm"),
	},
});

import dayjs from "dayjs";
import { transformI18n } from "@/plugins/i18n";
import type { ExpenseSummaryTableListItem, ExpenseSummaryTableQueryParams } from "@01s-11comm/type";
/** 分页配置 */
const pagination = ref<PaginationProps>({
	...defaultPagination,
	pageSize: 10,
	currentPage: 1,
	total: mockTableData.length,
});

/** 表格数据 */
const tableData = ref<ExpenseSummaryTableListItem[]>([]);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "订单号",
		prop: "订单号",
		minWidth: 180,
	},
	{
		label: "小区",
		prop: "小区",
		minWidth: 140,
	},
	{
		label: "房号/业主",
		prop: "房号业主",
		minWidth: 180,
	},
	{
		label: "费用类型",
		prop: "费用类型",
		minWidth: 140,
	},
	{
		label: "费用项",
		prop: "费用项",
		minWidth: 140,
	},
	{
		label: "费用状态",
		prop: "费用状态",
		minWidth: 120,
	},
	{
		label: "支付方式",
		prop: "支付方式",
		minWidth: 120,
	},
	{
		label: "缴费时间",
		prop: "缴费时间",
		minWidth: 200,
	},
	{
		label: "收银员",
		prop: "收银员",
		minWidth: 140,
	},
	{
		label: "应缴金额",
		prop: "应缴金额",
		minWidth: 140,
	},
	{
		label: "应收金额",
		prop: "应收金额",
		minWidth: 140,
	},
	{
		label: "实收金额",
		prop: "实收金额",
		minWidth: 140,
	},
	{
		label: "账户抵扣",
		prop: "账户抵扣",
		minWidth: 140,
	},
	{
		label: "优惠减免金额",
		prop: "优惠减免金额",
		minWidth: 160,
	},
	{
		label: "赠送金额",
		prop: "赠送金额",
		minWidth: 140,
	},
	{
		label: "滞纳金",
		prop: "滞纳金",
		minWidth: 140,
	},
	{
		label: "面积",
		prop: "面积",
		minWidth: 120,
	},
	{
		label: "车位",
		prop: "车位",
		minWidth: 120,
	},
	{
		label: "说明",
		prop: "说明",
		minWidth: 160,
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
	title: "缴费明细表",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & Partial<ExpenseSummaryTableQueryParams> = {
	缴费开始时间: "",
	缴费结束时间: "",
	支付方式: "",
	费用状态: "",
	费用类型: "",
	费用项: "",
	房屋编号车牌号: "",
	小区: "",
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
		label: "缴费开始时间",
		prop: "缴费开始时间",
		valueType: "date-picker",
	},
	{
		label: "缴费结束时间",
		prop: "缴费结束时间",
		valueType: "date-picker",
	},
	{
		label: "支付方式",
		prop: "支付方式",
		valueType: "select",
		options: 支付方式Options,
	},
	{
		label: "费用状态",
		prop: "费用状态",
		valueType: "select",
		options: 费用状态Options,
	},
	{
		label: "费用类型",
		prop: "费用类型",
		valueType: "select",
		options: feeTypeOptions,
	},
	{
		label: "费用项",
		prop: "费用项",
		valueType: "select",
		options: 费用项Options,
	},
	{
		label: "房屋编号/车牌号",
		prop: "房屋编号车牌号",
		valueType: "input",
	},
	{
		label: "小区",
		prop: "小区",
		valueType: "select",
		options: 小区Options,
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

	if (plusSearchModel.value.缴费开始时间 && plusSearchModel.value.缴费结束时间) {
		const start = dayjs(plusSearchModel.value.缴费开始时间);
		const end = dayjs(plusSearchModel.value.缴费结束时间);
		filteredData = filteredData.filter((item) => {
			const current = dayjs(item.缴费时间);
			return current.isAfter(start) && current.isBefore(end);
		});
	}

	if (plusSearchModel.value.支付方式) {
		filteredData = filteredData.filter((item) => item.支付方式 === plusSearchModel.value.支付方式);
	}

	if (plusSearchModel.value.费用状态) {
		filteredData = filteredData.filter((item) => item.费用状态 === plusSearchModel.value.费用状态);
	}

	if (plusSearchModel.value.费用类型) {
		filteredData = filteredData.filter((item) => item.费用类型 === plusSearchModel.value.费用类型);
	}

	if (plusSearchModel.value.费用项) {
		filteredData = filteredData.filter((item) => item.费用项 === plusSearchModel.value.费用项);
	}

	if (plusSearchModel.value.房屋编号车牌号) {
		filteredData = filteredData.filter((item) =>
			item.房号业主.includes(plusSearchModel.value.房屋编号车牌号!) ||
			item.车位?.includes(plusSearchModel.value.房屋编号车牌号!),
		);
	}

	if (plusSearchModel.value.小区) {
		filteredData = filteredData.filter((item) => item.小区 === plusSearchModel.value.小区);
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
						<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
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
