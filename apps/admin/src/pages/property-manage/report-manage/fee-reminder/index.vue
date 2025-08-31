<script lang="ts" setup>
definePage({
	meta: {
		title: "费用提醒",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.feeReminder"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { title } from "process";
import type { TabsPaneContext } from "element-plus";
import ExpirationReminders from "./components/Expiration-reminders.vue";
import PrepaymentReminders from "./components/Prepayment-reminders.vue";

//elmentplus分页
const activeName = ref("first");

const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event);
};

interface 报表管理_费用提醒_VO {
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
const plusSearchModelRef: FieldValues & 报表管理_费用提醒_VO = {
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

		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
			<el-tab-pane label="预缴费提醒" name="first">
				<ExpirationReminders />
			</el-tab-pane>
			<el-tab-pane label="到期提醒" name="second">
				<PrepaymentReminders />
			</el-tab-pane>
		</el-tabs>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
// elementplus分页
.index-root .demo-tabs > .el-tabs__content {
	padding: 32px;
	color: #6b778c;
	font-size: 32px;
	font-weight: 600;
}
</style>
