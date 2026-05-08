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
import { usePaymentDetailsFormListQuery } from "@/api/property-manage/report-manage/payment-details-form";
import type { PaymentDetailsFormQueryParams } from "@01s-11comm/type";
import {
	paymentMethodOptions,
	expenseStatusOptions,
	feeTypeOptions,
	expenseItemOptions,
	communityOptions,
} from "@01s-11comm/type";

const { locale, createHeaderRenderer, searchProps, plusSearchButtonTexts } = useI18nConfig();

const {
	pureTableProps: pureTablePropsFromComposable,
	isFetching,
	updateParams,
	resetParams,
	doFetch,
	handlePageSizeChange,
	handleCurrentPageChange,
} = usePaymentDetailsFormListQuery({
	name: "",
	status: "",
});

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
		prop: "orderNumber",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.community")),
		),
		prop: "community",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.roomNumberOwner")),
		),
		prop: "roomNumberOwner",
		minWidth: 180,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.feeType")),
		),
		prop: "feeType",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.feeItem")),
		),
		prop: "feeItem",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.feeStatus")),
		),
		prop: "feeStatus",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.paymentMethod")),
		),
		prop: "paymentMethod",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.paymentTime")),
		),
		prop: "paymentTime",
		minWidth: 200,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.cashier")),
		),
		prop: "cashier",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.payableAmount")),
		),
		prop: "payableAmount",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.receivableAmount")),
		),
		prop: "receivableAmount",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.actualAmount")),
		),
		prop: "actualAmount",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.accountDeduction")),
		),
		prop: "accountDeduction",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.discountAmount")),
		),
		prop: "discountAmount",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.giftAmount")),
		),
		prop: "giftAmount",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.lateFee")),
		),
		prop: "lateFee",
		minWidth: 140,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.area")),
		),
		prop: "area",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.parkingSpace")),
		),
		prop: "parkingSpace",
		minWidth: 120,
	},
	{
		headerRenderer: createHeaderRenderer(
			transformI18n($t("property-manage_report-manage.payment-details-form.fields.description")),
		),
		prop: "description",
		minWidth: 160,
	},
	{
		headerRenderer: createHeaderRenderer(transformI18n($t("common.table.operation"))),
		width: 230,
		fixed: "right",
		slot: "operation",
	},
]);

const pureTableProps = computed<ListPureTableProps>(() => ({
	...pureTablePropsFromComposable.value,
	columns: [],
}));

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
const plusSearchModelRef: FieldValues & PaymentDetailsFormQueryParams = {
	缴费开始时间: "",
	缴费结束时间: "",
	支付方式: "",
	费用状态: "",
	费用类型: "",
	费用项: "",
	房屋编号车牌号: "",
	小区: "",
	name: "",
	status: "",
	pageIndex: 1,
	pageSize: 10,
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

/** 重置搜索条件并重新加载数据 */
function handleReSearch() {
	plusSearchModel.value = cloneDeep(plusSearchDefaultValues);
	resetParams();
}

/** 执行搜索 */
function handleSearch() {
	updateParams({
		name: String(plusSearchModel.value["费用项"] || plusSearchModel.value.name || ""),
		status: String(plusSearchModel.value["费用状态"] || plusSearchModel.value.status || ""),
		pageIndex: 1,
	});
}
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

		<PureTableBar :="pureTableBarProps" @refresh="doFetch">
			<template #buttons>
				<ElButton type="info" :loading="isFetching" @click="doFetch">
					{{ transformI18n($t("common.buttons.pureReload")) }}
				</ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<PureTable
					:="pureTableProps"
					:columns="dynamicColumns"
					:size="size"
					:loading="isFetching"
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
