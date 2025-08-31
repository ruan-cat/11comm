<script lang="ts" setup>
definePage({
	meta: {
		title: "欠费信息",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.overduePaymentInformation"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 欠费信息_列表数据 {
	序号: string;
	收费对象: string;
	业主名称: string;
	手机号: string;
	开始时间: string;
	结束时间: string;
	合计: string;
	更新时间: string;
}
const tableDataItem: 欠费信息_列表数据 = {
	序号: "序号",
	收费对象: "收费对象",
	业主名称: "业主名称",
	手机号: "手机号",
	开始时间: "开始时间",
	结束时间: "结束时间",
	合计: "合计",
	更新时间: "更新时间",
};
/** 表格数据 */
const tableData = ref<欠费信息_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		prop: "序号",
		label: "序号",
		width: 120,
	},
	{
		prop: "收费对象",
		label: "收费对象",
		width: 120,
	},
	{
		prop: "业主名称",
		label: "业主名称",
		width: 120,
	},
	{
		prop: "手机号",
		label: "手机号",
		width: 120,
	},
	{
		prop: "开始时间",
		label: "开始时间",
		width: 120,
	},
	{
		prop: "结束时间",
		label: "结束时间",
		width: 120,
	},
	{
		prop: "合计",
		label: "合计",
		width: 120,
	},
	{
		prop: "更新时间",
		label: "更新时间",
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
	title: "欠费信息",
	columns: columns.value,
});
interface 欠费信息_列表查询_VO {
	序号?: string;
	收费对象?: string;
	业主名称?: string;
	手机号?: string;
	开始时间?: string;
	结束时间?: string;
	合计?: string;
	更新时间?: string;
}
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchDefaultValues = ref<Record<string, any>>({
	序号: "",
	收费对象: "",
	业主名称: "",
	手机号: "",
	开始时间: "",
	结束时间: "",
	合计: "",
	更新时间: "",
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
	//楼栋
	columns: [
		{
			prop: "请选择楼栋",
			label: "请选择楼栋",
			valueType: "input",
		},
		// 单元
		{
			prop: "请选择单元",
			label: "请选择单元",
			valueType: "select",
			options: [
				{ label: "单元1", value: "单元1" },
				{ label: "单元2", value: "单元2" },
			],
		},
		//房屋编号
		{
			prop: "请输入房屋编号",
			label: "请输入房屋编号",
			valueType: "input",
		},
	],
});
/** 表格搜索栏组件 配置  */
const plusSearchProps = ref<PlusSearchProps>({
	// TODO: 重写你的代码 不要无脑的复制粘贴
	// defaultValues: plusSearchDefaultValues,
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
		<h2>欠费信息</h2>
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
