<script lang="ts" setup>
definePage({
	meta: {
		title: "欠费催缴",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.reminderForOverduePayments"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 欠费催缴_列表数据 {
	编号: string;
	业主名称: string;
	付费对象: string;
	费用名称: string;
	催缴金额: string;
	欠费时间段: string;
	催缴方式: string;
	状态: string;
	说明: string;
	创建时间: string;
	操作: string;
}
const tableDataItem: 欠费催缴_列表数据 = {
	编号: "编号",
	业主名称: "业主名称",
	付费对象: "付费对象",
	费用名称: "费用名称",
	催缴金额: "催缴金额",
	欠费时间段: "欠费时间段",
	催缴方式: "催缴方式",
	状态: "状态",
	说明: "说明",
	创建时间: "创建时间",
	操作: "操作",
};
/** 表格数据 */
const tableData = ref<欠费催缴_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		prop: "编号",
		label: "编号",
		width: 120,
	},
	{
		prop: "业主名称",
		label: "业主名称",
		width: 120,
	},
	{
		prop: "付费对象",
		label: "付费对象",
		width: 120,
	},
	{
		prop: "费用名称",
		label: "费用名称",
		width: 120,
	},
	{
		prop: "催缴金额",
		label: "催缴金额",
		width: 120,
	},
	{
		prop: "欠费时间段",
		label: "欠费时间段",
		width: 120,
	},
	{
		prop: "催缴方式",
		label: "催缴方式",
		width: 120,
	},
	{
		prop: "状态",
		label: "状态",
		width: 120,
	},
	{
		prop: "说明",
		label: "说明",
		width: 120,
	},
	{
		prop: "创建时间",
		label: "创建时间",
		width: 120,
	},
	{
		prop: "操作",
		label: "操作",
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
	title: "欠费催缴",
	columns: columns.value,
});
interface 欠费催缴_列表查询_VO {
	业主名称?: string;
	付费对象?: string;
	费用名称?: string;
	催缴金额?: string;
	欠费时间段?: string;
	催缴方式?: string;
	状态?: string;
	说明?: string;
	创建时间?: string;
}
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 欠费催缴_列表查询_VO = {
	业主名称: "",
	付费对象: "",
	费用名称: "",
	催缴金额: "",
	欠费时间段: "",
	催缴方式: "",
	状态: "",
	说明: "",
	创建时间: "",
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
	//填写业主名称
	{
		prop: "业主名称",
		label: "业主名称",
		type: "input",
		placeholder: "请输入业主名称",
	},
	//填写付费名称
	{
		prop: "费用名称",
		label: "费用名称",
		type: "input",
		placeholder: "请输入费用名称",
	},
	// 选择催缴方式
	{
		prop: "催缴方式",
		label: "催缴方式",
		type: "select",
		options: [
			{ label: "微信模块消息", value: "微信模块消息" },
			{ label: "短信", value: "短信" },
			{ label: "上门催缴", value: "上门催缴" },
		],
	},
	//填写催缴人
	{
		prop: "催缴人",
		label: "催缴人",
		type: "input",
		placeholder: "请输入催缴人",
	},
	//选择状态
	{
		prop: "状态",
		label: "状态",
		type: "select",
		options: [
			{ label: "待催缴", value: "待催缴" },
			{ label: "催缴完成", value: "催缴完成" },
			{ label: "催缴失败", value: "催缴失败" },
			{ label: "催缴中", value: "催缴中" },
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
		<h2>欠费催缴</h2>
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
