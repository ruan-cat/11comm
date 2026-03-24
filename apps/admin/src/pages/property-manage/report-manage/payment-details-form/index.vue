<script lang="ts" setup>
definePage({
	meta: {
		// 缴费明细表
		title: "property-manage_report-manage.payment-details-form.pageTitle",
		icon: "mdi:cash-register",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.paymentDetailsForm"),
	},
});
import { cloneDeep } from "@pureadmin/utils";

import { $t, transformI18n } from "@/plugins/i18n";
import { useI18nConfig } from "@/composables/use-i18n-config";
import type { ExpenseSummaryTableListItem, ExpenseSummaryTableQueryParams } from "@01s-11comm/type";
import {
	paymentMethodOptions,
	expenseStatusOptions,
	feeTypeOptions,
	expenseItemOptions,
	communityOptions,
} from "@01s-11comm/type";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

// TODO: 本页面需要继续完成写法改造；需要从API获取真实数据
/** 模拟表格数据 - 待替换为真实API数据 */
const mockTableData: ExpenseSummaryTableListItem[] = [];

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
const columns = computed<TableColumnList>(() => [
	{
		...defaultPureTableIndexColumn,
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.index"))),
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.orderNumber")),
		),
		prop: "订单号",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.community")),
		),
		prop: "小区",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.roomNumberOwner")),
		),
		prop: "房号业主",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.feeType")),
		),
		prop: "费用类型",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.feeItem")),
		),
		prop: "费用项",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.feeStatus")),
		),
		prop: "费用状态",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.paymentMethod")),
		),
		prop: "支付方式",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.paymentTime")),
		),
		prop: "缴费时间",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.cashier")),
		),
		prop: "收银员",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.payableAmount")),
		),
		prop: "应缴金额",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.receivableAmount")),
		),
		prop: "应收金额",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.actualAmount")),
		),
		prop: "实收金额",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.accountDeduction")),
		),
		prop: "账户抵扣",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.discountAmount")),
		),
		prop: "优惠减免金额",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.giftAmount")),
		),
		prop: "赠送金额",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.lateFee")),
		),
		prop: "滞纳金",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.area")),
		),
		prop: "面积",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.parkingSpace")),
		),
		prop: "车位",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.description")),
		),
		prop: "说明",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

/** 表格配置 */
const pureTableProps = ref<ListPureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

/** 表格操作栏组件配置 */
const pureTableBarProps = computed<PureTableBarProps>(() => ({
	title: transformI18n($t("property-manage_report-manage.payment-details-form.tableTitle")),
	columns: columns.value,
}));

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
		label: transformI18n($t("property-manage_report-manage.payment-details-form.search.paymentStartTime")),
		prop: "缴费开始时间",
		valueType: "date-picker",
	},
	{
		label: transformI18n($t("property-manage_report-manage.payment-details-form.search.paymentEndTime")),
		prop: "缴费结束时间",
		valueType: "date-picker",
	},
	{
		label: transformI18n($t("property-manage_report-manage.payment-details-form.search.paymentMethod")),
		prop: "支付方式",
		valueType: "select",
		options: paymentMethodOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.payment-details-form.search.feeStatus")),
		prop: "费用状态",
		valueType: "select",
		options: expenseStatusOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.payment-details-form.search.feeType")),
		prop: "费用类型",
		valueType: "select",
		options: feeTypeOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.payment-details-form.search.feeItem")),
		prop: "费用项",
		valueType: "select",
		options: expenseItemOptions,
	},
	{
		label: transformI18n($t("property-manage_report-manage.payment-details-form.search.houseNumberCarNumber")),
		prop: "房屋编号车牌号",
		valueType: "input",
	},
	{
		label: transformI18n($t("property-manage_report-manage.payment-details-form.search.community")),
		prop: "小区",
		valueType: "select",
		options: communityOptions,
	},
]);

/** 表格搜索栏组件 配置  */
const plusSearchProps = searchProps(plusSearchDefaultValues);

/** 加载表格数据 */
async function loadTableData() {
	let filteredData = mockTableData;

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
	<section :key="locale" class="index-root">
		<PlusSearch
			:key="locale"
			v-model="plusSearchModel"
			:="plusSearchProps"
			:columns="plusSearchColumns"
			:search-text="plusSearchButtonTexts.searchText"
			:reset-text="plusSearchButtonTexts.resetText"
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
