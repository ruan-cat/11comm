<script lang="ts" setup>
import { ref } from "vue";
import type { PlusColumn } from "plus-pro-components";

const state = ref({
	status: "0",
	time: new Date().toString(),
});

const columns: PlusColumn[] = [
	{
		label: "时间",
		prop: "time",
		valueType: "date-picker",
	},
	{
		label: "时间",
		prop: "time",
		valueType: "date-picker",
	},
];

// FUNC
const handleChange = (values: any) => {
	console.log(values, "change");
};
const handleSearch = (values: any) => {
	console.log(values, "search");
};
const handleReset = () => {
	console.log("handleReset");
};
</script>

<template>
	<div class="repair-item-table">
		<h3>报修未完成</h3>
		<PlusSearch
			v-model="state"
			:columns="columns"
			:show-number="2"
			@change="handleChange"
			@search="handleSearch"
			@reset="handleReset"
		/>
	</div>
</template>

<style lang="scss" scoped>
.repair-item-table {
	padding: 20px;
}
</style>
