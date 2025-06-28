<script lang="ts" setup>
definePage({
	meta: {
		title: "缴费审核",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.paymentReview"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 缴费审核_列表数据 {
	房屋: string;
	费用项目: string;
	付费周期: string;
	缴费起始时间: string;
	缴费结束时间: string;
	应付金额: string;
	实付金额: string;
	操作员工: string;
	缴费时间: string;
	审核状态: string;
	审核说明: string;
	缴费备注: string;
	详情: string;
}

// TODO: 重写你的代码 不要无脑的复制粘贴
const tableDataItem: 取消费用_列表数据 = {
	房屋: "房屋",
	费用项目: "费用项目",
	付费周期: "付费周期",
	缴费起始时间: "缴费起始时间",
	缴费结束时间: "缴费结束时间",
	应付金额: "应付金额",
	实付金额: "实付金额",
	操作员工: "操作员工",
	缴费时间: "缴费时间",
	审核状态: "审核状态",
	审核说明: "审核说明",
	缴费备注: "缴费备注",
	详情: "详情",
};
/** 表格数据 */
const tableData = ref<缴费审核_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		prop: "房屋",
		label: "房屋",
		width: 120,
	},
	{
		prop: "费用项目",
		label: "费用项目",
		width: 120,
	},
	{
		prop: "付费周期",
		label: "付费周期",
		width: 120,
	},
	{
		prop: "缴费起始时间",
		label: "缴费起始时间",
		width: 120,
	},
	{
		prop: "缴费结束时间",
		label: "缴费结束时间",
		width: 120,
	},
	{
		prop: "应付金额",
		label: "应付金额",
		width: 120,
	},
	{
		prop: "实付金额",
		label: "实付金额",
		width: 120,
	},
	{
		prop: "操作员工",
		label: "操作员工",
		width: 120,
	},
	{
		prop: "缴费时间",
		label: "缴费时间",
		width: 120,
	},
	{
		prop: "审核状态",
		label: "审核状态",
		width: 120,
	},
	{
		prop: "审核说明",
		label: "审核说明",
		width: 120,
	},
	{
		prop: "缴费备注",
		label: "缴费备注",
		width: 120,
	},
	{
		prop: "详情",
		label: "详情",
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
	title: "缴费审核",
	columns: columns.value,
});

interface 缴费审核_列表查询_VO {
	房屋: string;
	费用项目: string;
	付费周期: string;
	缴费起始时间: string;
	缴费结束时间: string;
	应付金额: string;
	实付金额: string;
	操作员工: string;
	缴费时间: string;
	审核状态: string;
	审核说明: string;
	缴费备注: string;
	详情: string;
}
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const searchForm = ref<缴费审核_列表查询_VO & { [key: string]: any }>({
	房屋: "",
	费用项目: "",
	付费周期: "",
	缴费起始时间: "",
	缴费结束时间: "",
	应付金额: "",
	实付金额: "",
	操作员工: "",
	缴费时间: "",
	审核状态: "",
	审核说明: "",
	缴费备注: "",
	详情: "",
});

// TODO: 重写你的代码 不要无脑的复制粘贴
/** 表格搜索栏 重置功能用的默认数据 */
// const plusSearchDefaultValues = cloneDeep(plusSearchModelRef);

// TODO: 重写你的代码 不要无脑的复制粘贴
/** 表格搜索栏变量 双向绑定的变量 响应式数据 */
// const plusSearchModel = ref(plusSearchModelRef);

/**
 * 表格搜索栏组件 表单配置
 * @see https://github.com/plus-pro-components/plus-pro-components/issues/184
 */
// TODO: 重写你的代码 不要无脑的复制粘贴 哪里来的 PlusSearchFormProps 类型？
const plusSearchFormProps = ref<PlusSearchFormProps>({
	// 选择付费对象
	formItems: [
		{
			prop: "付费对象",
			label: "付费对象",
			type: "select",
			options: [
				{ label: "房屋", value: "房屋" },
				{ label: "停车位", value: "停车位" },
				{ label: "合同", value: "合同" },
			],
		},
		// 待审核
		{
			prop: "待审核",
			label: "待审核",
			type: "select",
			options: [
				{ label: "待审核", value: "待审核" },
				{ label: "审核通过", value: "审核通过" },
				{ label: "审核未通过", value: "审核未通过" },
			],
		},
		// 房屋
		{
			prop: "房屋",
			label: "房屋",
			type: "input",
		},
	],
});

// TODO: 重写你的代码 不要无脑的复制粘贴
// /** 表格搜索栏组件 配置  */
// const plusSearchProps = ref<PlusSearchProps>({
// 	defaultValues: plusSearchDefaultValues,
// 	columns: [],
// 	labelWidth: 140,
// 	labelPosition: "right",
// 	showNumber: 3,
// });

async function handleReSearch() {
	console.log("重新搜索");
}

async function handleSearch() {
	console.log("搜索");
}
</script>

<template>
	<section class="index-root">
		<h2>缴费审核</h2>
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
