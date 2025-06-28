<script lang="ts" setup>
definePage({
	meta: {
		title: "费用汇总表",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.expenseSummaryTable"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { title } from "process";
import build from "./components/build.vue";
import payment from "./components/payment.vue";

interface 报表管理_费用汇总表 {
	总户数: string;
	收费户: string;
	欠费户: string;
	欠费: string;
	实缴: string;
	当期应收: string;
	当前实收: string;
	户收费率: string;
	收费率: string;
	清缴率: string;
}

const tableDataItem: 报表管理_费用汇总表 = {
	总户数: "1",
	收费户: "1",
	欠费户: "1",
	欠费: "1",
	实缴: "4",
	当期应收: "19528.3",
	当前实收: "114514",
	户收费率: "23.73%",
	收费率: "29.84%",
	清缴率: "0.00%",
};

/** 表格数据 */
const tableData = ref<报表管理_费用汇总表[]>(
	Array(1)
		.fill(null)
		.map(() => ({ ...tableDataItem })),
);
// 表格列配置
const columns = ref<TableColumnList>([
	{
		label: "总户数",
		prop: "总户数",
		width: 160,
		fixed: true,
	},
	{
		label: "收费户",
		prop: "收费户",
		width: 160,
	},
	{
		label: "欠费户",
		prop: "欠费户",
		width: 160,
	},
	{
		label: "历史欠费+当期欠费=欠费",
		prop: "欠费",
		width: 160,
	},
	{
		label: "欠费追回+当期部分+预交=实缴",
		prop: "实缴",
		width: 160,
	},
	{
		label: "当前应收",
		prop: "当前应收",
		width: 160,
	},
	{
		label: "当前实收",
		prop: "当前实收",
		width: 160,
	},
	{
		label: "已交户/收费户=户收费率",
		prop: "户收费率",
		width: 160,
	},
	{
		label: "当期实收/当期应收=收费率",
		prop: "收费率",
		width: 160,
	},
	{
		label: "欠费追回/(欠费追回+历史欠费)=清缴率",
		prop: "清缴率",
		width: 160,
	},
	// {
	// 	label: transformI18n($t("table.operation")),
	// 	minWidth: 160,
	// 	fixed: "right",
	// 	slot: "operation",
	// },
]);

/** 表格配置 */
const pureTableProps = ref<PureTableProps>({
	border: true,
	stripe: true,
	adaptive: false,
	highlightCurrentRow: true,
	data: tableData.value,
	columns: [],
});

// 表格操作栏组件配置
const pureTableBarProps = ref<PureTableBarProps>({
	title: "费用提醒",
	columns: columns.value,
});

interface 报表管理_费用汇总表_VO {
	房屋编号合同名称?: string;
	业主名称?: string;
	业主手机号?: string;
	费用项?: string;
	小区?: string;
}
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 报表管理_费用汇总表_VO = {
	房屋编号合同名称: "",
	业主名称: "",
	业主手机号: "",
	费用项: "",
	小区: "",
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
	//房屋编号/合同名称
	{
		label: transformI18n($t("propertyManage_reportManage.report.employerName")),
		prop: "房屋编号合同名称",
		valueType: "input",
	},
	//业主名称
	{
		label: transformI18n($t("propertyManage_reportManage.report.employerName")),
		prop: "业主名称",
		valueType: "input",
	},
	//房屋手机号
	{
		label: transformI18n($t("propertyManage_reportManage.report.employerPhone")),
		prop: "业主手机号",
		valueType: "input",
	},
	//费用项
	{
		label: transformI18n($t("propertyManage_reportManage.report.paymentItem")),
		prop: "费用项",
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
	//小区
	{
		label: transformI18n($t("propertyManage_reportManage.report.cell")),
		prop: "小区",
		valueType: "select",
		options: [
			{
				label: "小区1",
				value: "小区1",
			},
			{
				label: "小区2",
				value: "小区2",
			},
			{
				label: "小区3",
				value: "小区3",
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
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleSearch" />

		<!-- {{ plusSearchModel }} -->

		<PureTableBar :="pureTableBarProps" @refresh="handleReSearch">
			<template #buttons>
				<ElButton type="primary"> {{ transformI18n($t("propertyManage_reportManage.report.derived")) }} </ElButton>
			</template>

			<template #default="{ size, dynamicColumns }">
				<!-- @vue-ignore 忽略treeProps所需要的checkStrictly类型 -->
				<PureTable :="pureTableProps" :columns="dynamicColumns" :size="size" />
			</template>
		</PureTableBar>

		<div>楼栋收费率统计柱状图<build /></div>
		<div>费用项收费率统计柱状图<payment /></div>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
