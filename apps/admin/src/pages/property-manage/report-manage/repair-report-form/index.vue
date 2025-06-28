<script lang="ts" setup>
import { ref } from "vue";
definePage({
	meta: {
		title: "报修报表",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.repairReportForm"),
	},
});
// 定义要显示的组件
// 导入先丑点吧，后面在改动态导入的
import RepairItemTable from "./components/repairitemtable.vue"; // 报修分项表
import RepairDetail from "./components/repairdetail.vue"; // 报修明细
import RepairStatistics from "./components/repairstatistics.vue"; // 报修统计
import RepairUnfinished from "./components/repairunfinished.vue"; // 报修未完成
import RepairCharge from "./components/repaircharge.vue"; // 报修收费
import RepairDissatisfied from "./components/repairdissatisfied.vue"; // 报修不满意
import ComplaintConsult from "./components/complaintconsult.vue"; // 投诉咨询

// 动态组件
const currentComponent = ref(RepairItemTable);

// 处理菜单点击
const handleMenuClick = (index: string) => {
	const componentMap = {
		"1": RepairItemTable,
		"2": RepairDetail,
		"3": RepairStatistics,
		"4": RepairUnfinished,
		"5": RepairCharge,
		"6": RepairDissatisfied,
		"7": ComplaintConsult,
	};
	currentComponent.value = componentMap[index];
};
</script>

<template>
	<section class="index-root">
		<h2>报修报表</h2>
	</section>
	<el-row class="tac">
		<el-col :span="4">
			<el-menu default-active="1" class="el-menu-vertical-demo" @select="handleMenuClick">
				<el-menu-item index="1">
					<span>报修分项表</span>
				</el-menu-item>
				<el-menu-item index="2">
					<span>报修明细</span>
				</el-menu-item>
				<el-menu-item index="3">
					<span>报修统计</span>
				</el-menu-item>
				<el-menu-item index="4">
					<span>报修未完成</span>
				</el-menu-item>
				<el-menu-item index="5">
					<span>报修收费</span>
				</el-menu-item>
				<el-menu-item index="6">
					<span>报修不满意</span>
				</el-menu-item>
				<el-menu-item index="7">
					<span>投诉咨询</span>
				</el-menu-item>
			</el-menu>
		</el-col>
		<el-col :span="20">
			<!-- 动态组件 -->
			<component :is="currentComponent" />
		</el-col>
	</el-row>
</template>

<style lang="scss" scoped>
.index-root {
}
.tac {
	height: calc(100vh - 100px);
}
</style>
