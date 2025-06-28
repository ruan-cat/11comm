<template>
	<div class="statistics-panel">
		<h3 class="title">费用类统计</h3>
		<div v-for="(item, index) in statistics" :key="index" class="stat-item">
			<div class="title">{{ item.title }}</div>
			<div class="value">{{ item.value }}</div>
		</div>
		<div class="null"></div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const statistics = ref([
	{ title: "实收金额", value: "171138.8" },
	{ title: "欠费金额", value: "2978666.82" },
	{ title: "优惠金额", value: "13386.92" },
	{ title: "滞纳金", value: "0" },
	{ title: "账户预存", value: "0" },
	{ title: "账户扣款", value: "0" },
	{ title: "临时车收入", value: "0" },
	{ title: "押金退款", value: "0" },
	{ title: "退款订单数", value: "0" },
	{ title: "退款金额", value: "0" },
	{ title: "充电金额", value: "0" },
	{ title: "月卡实收", value: "0" },
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
.null {
	width: auto;
	height: 130px;
}
</style>
