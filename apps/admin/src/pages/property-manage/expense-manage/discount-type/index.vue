<script lang="ts" setup>
definePage({
	meta: {
		title: "优惠类型",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.expenseManage.discountType"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 优惠类型_列表数据 {
	折扣ID: string;
	折扣名称: string;
	折扣类型: string;
	规则名称: string;
	规则: string;
}
const tableDataItem: 优惠类型_列表数据 = {
	折扣ID: "折扣ID",
	折扣名称: "折扣名称",
	折扣类型: "折扣类型",
	规则名称: "规则名称",
	规则: "规则",
};
/** 表格数据 */
const tableData = ref<优惠类型_列表数据[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);

/** 表格列配置 */
const columns = ref<TableColumnList>([
	{
		prop: "折扣ID",
		label: "折扣ID",
		width: 120,
	},
	{
		prop: "折扣名称",
		label: "折扣名称",
		width: 120,
	},
	{
		prop: "折扣类型",
		label: "折扣类型",
		width: 120,
	},
	{
		prop: "规则名称",
		label: "规则名称",
		width: 120,
	},
	{
		prop: "规则",
		label: "规则",
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
	title: "优惠类型",
	columns: columns.value,
});

interface 优惠类型_列表查询_VO {
	折扣ID?: string;
	折扣名称?: string;
	折扣类型?: string;
	规则名称?: string;
	规则?: string;
}
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 优惠类型_列表查询_VO = {
	折扣ID: "",
	折扣名称: "",
	折扣类型: "",
	规则名称: "",
	规则: "",
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
	// 折扣ID
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseNumber")),
		prop: "折扣ID",
		valueType: "input",
	},
	// 折扣名称
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.contacts")),
		prop: "折扣名称",
		valueType: "input",
	},
	// 折扣类型
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseState")),
		prop: "折扣类型",
		valueType: "select",
		options: [
			{
				label: "节日优惠",
				value: "节日优惠",
			},
			{
				label: "日常优惠",
				value: "日常优惠",
			},
		],
	},
	// 申请类型
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseState")),
		prop: "申请类型",
		valueType: "select",
		options: [
			{
				label: "节日优惠",
				value: "节日优惠",
			},
			{
				label: "日常优惠",
				value: "日常优惠",
			},
		],
	},
]);
</script>

<template>
	<section class="index-root">
		<h2>优惠类型</h2>
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
