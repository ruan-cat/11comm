<script lang="ts" setup>
definePage({
	meta: {
		title: "费用明细表",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.statementExpenses"),
	},
});

import { ref, computed, watch } from "vue";
import { transformI18n } from "@/plugins/i18n";
import { title } from "process";
import houseDetails from "./components/houseDetails.vue";
import ownerDetails from "./components/ownerDetails.vue";
import contractDetails from "./components/contract.vue";
import carDetails from "./components/carDetails.vue";
import type { TabsPaneContext } from "element-plus";

const activeName = ref("first");

const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event);
};

interface 报表管理_费用明细表_VO {
	费用大类?: string;
	填写房屋编号?: string;
	开始事件?: string;
	结束时间?: string;
	小区?: string;
	填写业主名称?: string;
}
/**
 * 表格搜索栏 双向绑定的变量 原本的数据
 * @description
 * 为了满足搜索栏组件的校验需求 这里需要额外拓展为索引类型
 */
const plusSearchModelRef: FieldValues & 报表管理_费用明细表_VO = {
	费用大类: "",
	填写房屋编号: "",
	开始事件: "",
	结束时间: "",
	小区: "",
	填写业主名称: "",
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
	// 开始时间
	{
		label: transformI18n($t("propertyManage_reportManage.report.startTime")),
		prop: "开始时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	// 结束时间
	{
		label: transformI18n($t("propertyManage_reportManage.report.endTime")),
		prop: "结束时间",
		valueType: "date-picker",
		fieldProps: {
			type: "datetime",
			valueFormat: "YYYY-MM-DD HH:mm:ss",
			format: "YYYY-MM-DD HH:mm:ss",
		},
	},
	//房屋编号/合同名称
	{
		label: transformI18n($t("propertyManage_communityManage.house-decoration.houseNumber")),
		prop: "填写房屋编号/合同名称",
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
async function handleSearch() {
	console.log("搜索");
}
</script>

<template>
	<section class="index-root">
		<PlusSearch v-model="plusSearchModel" :="plusSearchProps" :columns="plusSearchColumns" @search="handleReSearch" />

		<!-- {{ plusSearchModel }} -->

		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
			<el-tab-pane label="房屋费用明细" name="first"> <houseDetails /></el-tab-pane>
			<el-tab-pane label="业主费用明细" name="second"><ownerDetails /> </el-tab-pane>
			<el-tab-pane label="合同费用明细" name="third"><contractDetails /> </el-tab-pane>
			<el-tab-pane label="车辆费用明细" name="fourth"><carDetails /> </el-tab-pane>
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
