<template>
	<div class="statistics-panel">
		<h3 class="title">出入类统计</h3>
		<div v-for="(item, index) in statistics" :key="index" class="stat-item">
			<div class="title">{{ item.title }}</div>
			<div class="value">{{ item.value }}</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const statistics = ref([
	{ title: "进场车辆数", value: "0" },
	{ title: "出场车辆数", value: "0" },
	{ title: "进场人员数", value: "0" },
	{ title: "人脸同步数", value: "3" },
	{ title: "采购入库数", value: "1000" },
	{ title: "领用出库数", value: "30" },
	{ title: "采购入库金额", value: "12000" },
	{ title: "完成巡检", value: "200" },
	{ title: "调拨数量", value: "26" },
	{ title: "房屋装修数", value: "1" },
	{ title: "物品放行", value: "0" },
	{ title: "交房数量", value: "2" },
	{ title: "退房数量", value: "0" },
	{ title: "业主绑定", value: "0" },
	{ title: "未考勤数", value: "0" },
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
