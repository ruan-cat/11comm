<template>
	<div class="statistics-panel">
		<h3 class="title">工单类统计</h3>
		<div v-for="(item, index) in statistics" :key="index" class="stat-item">
			<div class="title">{{ item.title }}</div>
			<div class="value">{{ item.value }}</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const statistics = ref([
	{ title: "投诉单", value: "0" },
	{ title: "未完成投诉单", value: "0" },
	{ title: "完成投诉单", value: "0" },
	{ title: "报修单", value: "0" },
	{ title: "未完成报修单", value: "4" },
	{ title: "完成报修单", value: "1" },
	{ title: "巡检", value: "27" },
	{ title: "未完成巡检", value: "27" },
	{ title: "完成巡检", value: "0" },
	{ title: "保养", value: "0" },
	{ title: "未完成保养", value: "0" },
	{ title: "完成保养", value: "0" },
	{ title: "业主返库", value: "0" },
	{ title: "充电订单", value: "0" },
]);
</script>

<style scoped>
.statistics-panel {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 10px;
	width: 100%;
}

.title {
	font-weight: bold;
	color: #00a0e9;
	text-align: center;
	margin-bottom: 10px; /* 标题和数据项之间留出间距 */
}

/* 标题样式（整体） */
h3.title {
	grid-column: 1 / -1; /* 占据全部列 */
	text-align: center;
	margin: 0;
	padding: 10px 0;
	border-bottom: 2px solid #00a0e9;
}

.stat-item {
	border: 1px solid #00a0e9;
	padding: 10px;
	text-align: center;
	border-radius: 4px;
}

.value {
	font-size: 16px;
	margin-top: 5px;
}
</style>
