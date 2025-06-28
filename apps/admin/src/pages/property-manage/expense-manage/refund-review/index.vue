<script lang="ts" setup>
definePage({
	meta: {
		title: "退费审核",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.refundReview"),
	},
});

import { ref, computed, watch } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";

interface 退费审核_列表数据 {
	退费单号: string;
	缴费单号: string;
	费用类型: string;
	付费对象: string;
	付费周期: string;
	应付金额实付金额: string;
	申请时间: string;
	退费原因: string;
	申请人: string;
	审核状态: string;
	审核人: string;
}
const tableDataItem: 退费审核_列表数据 = {
	退费单号: "退费单号",
	缴费单号: "缴费单号",
	费用类型: "费用类型",
	付费对象: "付费对象",
	付费周期: "付费周期",
	应付金额实付金额: "应付金额实付金额",
	申请时间: "申请时间",
	退费原因: "退费原因",
	申请人: "申请人",
	审核状态: "审核状态",
	审核人: "审核人",
};
/** 表格数据 */
const tableData = ref<退费审核_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		prop: "退费单号",
		label: "退费单号",
		width: 120,
	},
	{
		prop: "缴费单号",
		label: "缴费单号",
		width: 120,
	},
	{
		prop: "费用类型",
		label: "费用类型",
		width: 120,
	},
	{
		prop: "付费对象",
		label: "付费对象",
		width: 120,
	},
	{
		prop: "付费周期",
		label: "付费周期",
		width: 120,
	},
	{
		prop: "应付金额实付金额",
		label: "应付金额实付金额",
		width: 120,
	},
	{
		prop: "申请时间",
		label: "申请时间",
		width: 120,
	},
	{
		prop: "退费原因",
		label: "退费原因",
		width: 120,
	},
	{
		prop: "申请人",
		label: "申请人",
		width: 120,
	},
	{
		prop: "审核状态",
		label: "审核状态",
		width: 120,
	},
	{
		prop: "审核人",
		label: "审核人",
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
	title: "退费审核",
	columns: columns.value,
});

interface 退费审核_列表查询_VO {
	退费单号?: string;
	缴费单号?: string;
	费用类型?: string;
	付费对象?: string;
	付费周期?: string;
	申请时间?: string;
	申请时间范围?: [string, string];
}
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 退费审核_列表查询_VO = {
	退费单号: "",
	缴费单号: "",
	费用类型: "",
	付费对象: "",
	付费周期: "",
	申请时间: "",
	申请时间范围: ["", ""],
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
	// 缴费单号
	{
		prop: "缴费单号",
		label: "缴费单号",
		type: "input",
	},
	// 费用类型
	{
		prop: "费用类型",
		label: "费用类型",
		type: "select",
		options: [
			{ label: "物业费", value: "物业费" },
			{ label: "押金", value: "押金" },
			{ label: "停车费", value: "停车费" },
			{ label: "燃气费", value: "燃气费" },
			{ label: "取暖费", value: "取暖费" },
			{ label: "燃气费", value: "燃气费" },
			{ label: "维修费", value: "维修费" },
			{ label: "服务费", value: "服务费" },
			{ label: "其他", value: "其他" },
			{ label: "水费", value: "电费" },
			{ label: "公摊费", value: "公摊费" },
			{ label: "系统费用", value: "系统费用" },
			{ label: "租金", value: "租金" },
		],
	},
	// 审核中
	{
		prop: "审核中",
		label: "审核中",
		type: "select",
		options: [
			{ label: "审核中", value: "审核中" },
			{ label: "审核通过", value: "审核通过" },
			{ label: "审核不通过", value: "审核不通过" },
			{ label: "退款单", value: "退款单" },
		],
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

async function handleSearch() {
	console.log("搜索");
}
</script>

<template>
	<section class="index-root">
		<h2>退费审核</h2>
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
