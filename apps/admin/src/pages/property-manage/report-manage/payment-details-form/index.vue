<script lang="ts" setup>
definePage({
	meta: {
		title: "缴费明细表",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.paymentDetailsForm"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 报表管理_缴费明细表 {
	订单号: string;
	房号业主: string;
	费用类型费用项: string;
	费用状态: string;
	支付方式: string;
	缴费时间: string;
	收银员: string;
	应缴应收金额: string;
	实收金额: string;
	账户抵扣: string;
	优惠减免金额: string;
	赠送金额: string;
	滞纳金: string;
	面积: string;
	车位: string;
	说明: string;
}

const tableDataItem: 报表管理_缴费明细表 = {
	订单号: "102025052218564682",
	房号业主: "001-1-2905/林先生",
	费用类型费用项: "物业费>物业费520",
	费用状态: "正常",
	支付方式: "现金",
	缴费时间: "2025-05-25~2025-06-24",
	收银员: "wuxw",
	应缴应收金额: "500.00/500.00",
	实收金额: "500.00",
	账户抵扣: "0.00",
	优惠减免金额: "0.00/0.00",
	赠送金额: "0.00",
	滞纳金: "0.00",
	面积: "111.00",
	车位: "",
	说明: "",
};

/** 表格数据 */
const tableData = ref<报表管理_缴费明细表[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);
const columns = ref<TableColumnList>([
	{
		label: "订单号",
		prop: "订单号",
		width: 180,
		fixed: true,
	},
	{
		label: "房号/业主",
		prop: "房号业主",
		width: 120,
	},
	{
		label: "费用项目>费用项",
		prop: "费用类型费用项",
		width: 160,
	},
	{
		label: "费用状态",
		prop: "费用状态",
		width: 60,
	},
	{
		label: "支付方式",
		prop: "支付方式",
		width: 60,
	},
	{
		label: "缴费时间",
		prop: "缴费时间",
		width: 180,
	},
	{
		label: "收银员",
		prop: "收银员",
		width: 80,
	},
	{
		label: "应缴/应收金额(元)",
		prop: "应缴应收金额",
		width: 120,
	},
	{
		label: "实收金额(元)",
		prop: "实收金额",
		width: 120,
	},
	{
		label: "账户抵扣(元)",
		prop: "账户抵扣",
		width: 120,
	},
	{
		label: "优惠减免金额",
		prop: "优惠减免金额",
		width: 120,
	},
	{
		label: "赠送金额(元)",
		prop: "赠送金额",
		width: 120,
	},
	{
		label: "滞纳金(元)",
		prop: "滞纳金",
		width: 120,
	},
	{
		label: "面积",
		prop: "面积",
		width: 120,
	},
	{
		label: "车位",
		prop: "车位",
		width: 120,
	},
	{
		label: "说明",
		prop: "说明",
		width: 120,
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
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
	pagination: pagination.value,
});

// 表格操作栏组件配置
const pureTableBarProps = ref<PureTableBarProps>({
	title: "缴费明细表",
	columns: columns.value,
});

interface 报表管理_缴费明细表_VO {
	缴费开始时间?: string;
	缴费结束时间?: string;
	支付方式?: string;
	费用状态?: string;
	房屋编号车牌号?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 报表管理_缴费明细表_VO = {
	缴费开始时间: "",
	缴费结束时间: "",
	支付方式: "",
	费用状态: "",
	房屋编号车牌号: "",
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
	//缴费开始时间
	{
		label: transformI18n($t("propertyManage_reportManage.report.startTime")),
		prop: "缴费开始时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	//缴费结束时间
	{
		label: transformI18n($t("propertyManage_reportManage.report.endTime")),
		prop: "缴费结束时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	// 支付方式
	{
		label: transformI18n($t("propertyManage_reportManage.report.payMethod")),
		prop: "支付方式",
		valueType: "select",
		options: [
			{
				label: "现金",
				value: "现金",
			},
			{
				label: "POS刷卡",
				value: "POS刷卡",
			},
			{
				label: "微信二维码",
				value: "微信二维码",
			},
			{
				label: "支付宝二维码",
				value: "支付宝二维码",
			},
			{
				label: "微信公众号支付",
				value: "微信公众号支付",
			},
			{
				label: "微信小程序支付",
				value: "微信小程序支付",
			},
			{
				label: "转账",
				value: "转账",
			},
			{
				label: "押金退款到账户",
				value: "押金退款到账户",
			},
		],
	},
	// 费用状态
	{
		label: transformI18n($t("propertyManage_reportManage.report.payState")),
		prop: "费用状态",
		valueType: "select",
		options: [
			{
				label: "退费中",
				value: "退费中",
			},
			{
				label: "已退费",
				value: "已退费",
			},
			{
				label: "退费失败",
				value: "退费失败",
			},
			{
				label: "正常",
				value: "正常",
			},
			{
				label: "欠费",
				value: "欠费",
			},
		],
	},
	// 房屋编号车牌号
	{
		label: transformI18n($t("propertyManage_reportManage.report.houseNumberCarNumber")),
		prop: "房屋编号车牌号",
		valueType: "input",
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

async function handleReSearch() {
	console.log("重新搜索");
}
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" />

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
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
				>
					<template #operation="{ row }">
						<ElButton type="warning"> {{ transformI18n($t("common.buttons.edit")) }} </ElButton>
						<ElButton type="info"> {{ transformI18n($t("common.buttons.info")) }} </ElButton>
						<ElButton type="danger"> {{ transformI18n($t("common.buttons.del")) }} </ElButton>
					</template>
				</PureTable>
			</template>
		</PureTableBar>
	</section>
</template>

<style lang="scss" scoped></style>
