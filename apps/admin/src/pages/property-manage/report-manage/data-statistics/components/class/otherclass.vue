<template>
	<div class="statistics-panel">
		<h3 class="title">其他类统计</h3>
		<div v-for="(item, index) in statistics" :key="index" class="stat-item">
			<div class="title">{{ item.title }}</div>
			<div class="value">{{ item.value }}</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const statistics = ref([
	{ title: "场地预约书", value: "7" },
	{ title: "合同数", value: "0" },
	{ title: "合同资产变更", value: "0" },
	{ title: "租期变更", value: "0" },
	{ title: "主体变更", value: "0" },
	{ title: "到期合同", value: "0" },
	{ title: "车辆数", value: "0" },
	{ title: "车位申请", value: "0" },
	{ title: "停车券购买", value: "0" },
	{ title: "停车券核销", value: "0" },
	{ title: "赠送优惠券", value: "0" },
	{ title: "使用优惠券", value: "0" },
	{ title: "退房数量", value: "0" },
	{ title: "使用积分", value: "0" },
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
