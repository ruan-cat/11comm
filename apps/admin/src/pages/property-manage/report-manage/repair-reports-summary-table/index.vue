<script lang="ts" setup>
definePage({
	meta: {
		title: "报修汇总表",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.repairReportsSummaryTable"),
	},
});
// TODO:MAKAR's 报修汇总表
import { ref, computed, watch, onMounted } from "vue";
import type { PlusColumn } from "plus-pro-components";

// 表单配置
const state = ref({
	status: "0",
	time: new Date().toString(),
});

// 将columns改为响应式
const columns = ref<PlusColumn[]>([]);

// 获取表单配置数据
const getFormConfig = async () => {
	try {
		// TODO: 替换为实际的API调用
		const response = await fetch("/api/form-config");
		const data = await response.json();
		columns.value = data;
	} catch (error) {
		console.error("获取表单配置失败:", error);
		// 可以设置一些默认值
		columns.value = [
			{
				label: "创建开始时间",
				prop: "创建开始时间",
				valueType: "date-picker",
			},
			{
				label: "创建结束时间",
				prop: "创建结束时间",
				valueType: "date-picker",
			},
		];
	}
};

// 在组件挂载时获取数据
onMounted(() => {
	getFormConfig();
});

const handleChange = (values: any) => {
	console.log(values, "change");
};
const handleSearch = (values: any) => {
	console.log(values, "search");
};
const handleReset = () => {
	console.log("handleReset");
};

// 表格配置
</script>

<template>
	<section class="index-root">
		<h2>报修汇总表</h2>
	</section>
	<el-card>
		<PlusSearch
			v-model="state"
			:columns="columns"
			:show-number="2"
			:colProps="{ sm: 12 }"
			label-width="150px"
			@change="handleChange"
			@search="handleSearch"
			@reset="handleReset"
		/>
	</el-card>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
