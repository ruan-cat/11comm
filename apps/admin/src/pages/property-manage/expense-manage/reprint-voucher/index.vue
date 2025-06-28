<script lang="ts" setup>
definePage({
	meta: {
		title: "补打收据",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.reprintVoucher"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 补打收据_列表数据 {
	收据ID: string;
	收据编号: string;
	费用类型: string;
	费用项: string;
	房屋: string;
	业主: string;
	车位: string;
	总金额: string;
	缴费时间: string;
	操作: string;
}
const tableDataItem: 补打收据_列表数据 = {
	收据ID: "收据ID",
	收据编号: "收据编号",
	费用类型: "费用类型",
	费用项: "费用项",
	房屋: "房屋",
	业主: "业主",
	车位: "车位",
	总金额: "总金额",
	缴费时间: "缴费时间",
	操作: "操作",
};
/** 表格数据 */
const tableData = ref<补打收据_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		prop: "收据ID",
		label: "收据ID",
		width: 120,
	},
	{
		prop: "收据编号",
		label: "收据编号",
		width: 120,
	},
	{
		prop: "费用类型",
		label: "费用类型",
		width: 120,
	},
	{
		prop: "费用项",
		label: "费用项",
		width: 120,
	},
	{
		prop: "房屋",
		label: "房屋",
		width: 120,
	},
	{
		prop: "业主",
		label: "业主",
		width: 120,
	},
	{
		prop: "车位",
		label: "车位",
		width: 120,
	},
	{
		prop: "总金额",
		label: "总金额",
		width: 120,
	},
	{
		prop: "缴费时间",
		label: "缴费时间",
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
	title: "补打收据",
	columns: columns.value,
});

interface 补打收据_列表查询_VO {
	收据编号?: string;
	费用类型?: string;
	费用项?: string;
	房屋?: string;
	业主?: string;
	车位?: string;
	缴费时间范围?: [string, string];
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */

// TODO: 重写你的代码 不要无脑的复制粘贴 把类型补全
const plusSearchModelRef: FieldValues & 房屋装修_列表查询_VO = {
	收据编号: "",
	费用类型: "",
	费用项: "",
	房屋: "",
	业主: "",
	车位: "",
	缴费时间范围: ["", ""],
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
	//请输入收据ID
	{
		label: "收据ID",
		prop: "收据ID",
		valueType: "input",
	},
	//请输入房屋或车位信息，格式为楼栋-单元-房屋1-1-1
	{
		label: "房屋或车位",
		prop: "房屋",
		valueType: "input",
	},
	//请选择收费类型
	{
		label: "收费类型",
		prop: "费用类型",
		valueType: "select",
		options: [
			{
				label: "房屋费",
				value: "房屋费",
			},
			{
				label: "车位费",
				value: "车位费",
			},
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
		<h2>补打收据</h2>
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
