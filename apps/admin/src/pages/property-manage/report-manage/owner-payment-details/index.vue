<script lang="ts" setup>
definePage({
	meta: {
		title: "业主缴费明细",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.ownerPaymentDetails"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";

interface 报表管理_业主缴费明细 {
	业主: string;
	房屋: string;
	费用项目: string;
	一: string;
	二: string;
	三: string;
	四: string;
	五: string;
	六: string;
	七: string;
	八: string;
	九: string;
	十: string;
	十一: string;
	十二: string;
	合计: string;
	应收: string;
	预收: string;
}

const tableDataItem: 报表管理_业主缴费明细 = {
	业主: "业主",
	房屋: "房屋",
	费用项目: "费用项目",
	一: "1",
	二: "2",
	三: "3",
	四: "4",
	五: "5",
	六: "6",
	七: "7",
	八: "8",
	九: "9",
	十: "10",
	十一: "11",
	十二: "12",
	合计: "合计",
	应收: "应收",
	预收: "预收",
};

/** 表格数据 */
const tableData = ref<报表管理_业主缴费明细[]>(
	Array(35)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);
const columns = ref<TableColumnList>([
	{
		label: "业主",
		prop: "业主",
		width: 120,
		fixed: true,
	},
	{
		label: "房屋",
		prop: "房屋",
		width: 120,
	},
	{
		label: "费用项目",
		prop: "费用项目",
		width: 120,
	},
	{
		label: "1月",
		prop: "一",
		width: 120,
	},
	{
		label: "2月",
		prop: "二",
		width: 120,
	},
	{
		label: "3月",
		prop: "三",
		width: 120,
	},
	{
		label: "4月",
		prop: "四",
		width: 120,
	},
	{
		label: "5月",
		prop: "五",
		width: 120,
	},
	{
		label: "6月",
		prop: "六",
		width: 120,
	},
	{
		label: "7月",
		prop: "七",
		width: 120,
	},
	{
		label: "8月",
		prop: "八",
		width: 120,
	},
	{
		label: "9月",
		prop: "九",
		width: 120,
	},
	{
		label: "10月",
		prop: "十",
		width: 120,
	},
	{
		label: "11月",
		prop: "十一",
		width: 120,
	},
	{
		label: "12月",
		prop: "十二",
		width: 120,
	},
	{
		label: "合计",
		prop: "合计",
		width: 120,
	},
	{
		label: "应收",
		prop: "应收",
		width: 120,
	},
	{
		label: "预收",
		prop: "预收",
		width: 120,
	},
	// {
	// 	label: transformI18n($t("table.operation")),
	// 	minWidth: 240,
	// 	fixed: "right",
	// 	slot: "operation",
	// },
]);

/** 表格配置 */
const pureTableProps = ref<PureTableProps>({
	...defaultPureTableProps,
	data: tableData.value,
	columns: [],
});

// 表格操作栏组件配置
const pureTableBarProps = ref<PureTableBarProps>({
	title: "业主缴费明细",
	columns: columns.value,
});

interface 报表管理_业主缴费明细_VO {
	收费大类?: string;
	收费项?: string;
	房屋编号?: string;
	业主名称?: string;
}

/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 报表管理_业主缴费明细_VO = {
	收费大类: "",
	收费项: "",
	房屋编号: "",
	业主名称: "",
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
	//费用大类
	{
		label: transformI18n($t("propertyManage_reportManage.report.chargeCategories")),
		prop: "收费大类",
		valueType: "select",
		options: [
			{
				label: "物业费",
				value: "物业费",
			},
			{
				label: "押金",
				value: "押金",
			},
			{
				label: "停车费",
				value: "停车费",
			},
			{
				label: "煤气费",
				value: "煤气费",
			},
			{
				label: "服务费",
				value: "服务费",
			},
			{
				label: "其他",
				value: "其他",
			},
			{
				label: "水费",
				value: "水费",
			},
			{
				label: "电费",
				value: "电费",
			},
			{
				label: "公摊费",
				value: "公摊费",
			},
			{
				label: "系统费用",
				value: "系统费用",
			},
			{
				label: "租金",
				value: "租金",
			},
		],
	},
	//收费项目
	{
		label: transformI18n($t("propertyManage_reportManage.report.chargeItem")),
		prop: "收费项",
		valueType: "select",
		options: [
			{
				label: "物业费历史欠费",
				value: "物业费历史欠费",
			},
			{
				label: "test1",
				value: "test1",
			},
		],
	},
	//房屋编号
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseNumber")),
		prop: "房屋编号",
		valueType: "input",
	},
	//业主名称
	{
		label: transformI18n($t("propertyManage_reportManage.report.employerName")),
		prop: "业主名称",
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
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary"> {{ transformI18n($t("common.buttons.add")) }} </ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable :="pureTableProps" :columns="dynamicColumns" :size="size">
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

<style lang="scss" scoped>
.index-root {
}
</style>
