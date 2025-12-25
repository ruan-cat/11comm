<script lang="ts" setup>
definePage({
	meta: {
		title: "业主缴费明细",
		icon: "mdi:account-cash",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.ownerPaymentDetails"),
	},
});

import { transformI18n } from "@/plugins/i18n";
import type { OwnerPaymentDetailsListItem, OwnerPaymentDetailsQueryParams } from "@01s-11comm/type";
import { useOwnerPaymentDetailsListQuery } from "@/api/property-manage/report-manage/owner-payment-details";
import {
	feeCategoryOptions,
	feeItemOptions,
	communityOptions,
	yearOptions,
} from "@01s-11comm/type";

/** 表格列配置 */
const columns = ref<TableColumnList>([
	defaultPureTableIndexColumn,
	{
		label: "小区",
		prop: "community",
		minWidth: 140,
	},
	{
		label: "房屋编号/合同名称",
		prop: "houseNumberContractName",
		minWidth: 180,
	},
	{
		label: "业主名称",
		prop: "ownerName",
		minWidth: 160,
	},
	{
		label: "业主手机号",
		prop: "ownerPhone",
		minWidth: 160,
	},
	{
		label: "费用大类",
		prop: "feeCategory",
		minWidth: 140,
	},
	{
		label: "费用项",
		prop: "feeItem",
		minWidth: 140,
	},
	{
		label: "年度",
		prop: "year",
		minWidth: 120,
	},
	{
		label: "1月",
		prop: "january",
		minWidth: 120,
	},
	{
		label: "2月",
		prop: "february",
		minWidth: 120,
	},
	{
		label: "3月",
		prop: "march",
		minWidth: 120,
	},
	{
		label: "4月",
		prop: "april",
		minWidth: 120,
	},
	{
		label: "5月",
		prop: "may",
		minWidth: 120,
	},
	{
		label: "6月",
		prop: "june",
		minWidth: 120,
	},
	{
		label: "7月",
		prop: "july",
		minWidth: 120,
	},
	{
		label: "8月",
		prop: "august",
		minWidth: 120,
	},
	{
		label: "9月",
		prop: "september",
		minWidth: 120,
	},
	{
		label: "10月",
		prop: "october",
		minWidth: 120,
	},
	{
		label: "11月",
		prop: "november",
		minWidth: 120,
	},
	{
		label: "12月",
		prop: "december",
		minWidth: 120,
	},
	{
		label: "合计",
		prop: "total",
		minWidth: 140,
	},
	{
		label: "应收",
		prop: "receivable",
		minWidth: 140,
	},
	{
		label: "预收",
		prop: "prepaid",
		minWidth: 140,
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
	title: "业主缴费明细",
	columns: columns.value,
});

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & OwnerPaymentDetailsQueryParams = {
	houseNumberContractName: "",
	ownerName: "",
	ownerPhone: "",
	feeCategory: "",
	feeItem: "",
	community: "",
	year: "",
	pageIndex: 1,
	pageSize: 10,
};

/** 表格搜索栏 重置功能用的默认数据 */
const plusSearchDefaultValues = structuredClone(plusSearchModelRef);

/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
const plusSearchColumns = computed<PlusColumn[]>(() => [
	{
		label: "房屋编号/合同名称",
		prop: "houseNumberContractName",
		valueType: "input",
	},
	{
		label: "业主名称",
		prop: "ownerName",
		valueType: "input",
	},
	{
		label: "业主手机号",
		prop: "ownerPhone",
		valueType: "input",
	},
	{
		label: "费用大类",
		prop: "feeCategory",
		valueType: "select",
		options: feeCategoryOptions,
	},
	{
		label: "费用项",
		prop: "feeItem",
		valueType: "select",
		options: feeItemOptions,
	},
	{
		label: "小区",
		prop: "community",
		valueType: "select",
		options: communityOptions,
	},
	{
		label: "年度",
		prop: "year",
		valueType: "select",
		options: yearOptions,
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
				>
					<template #operation="{ row }">
						<ElButton type="info">
							{{ transformI18n($t("common.buttons.info")) }}
						</ElButton>
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
