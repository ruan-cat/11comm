<script lang="ts" setup>
definePage({
	meta: {
		title: "巡检报表",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.reportManage.patrolReport"),
	},
});
// TODO:MAKAR's 巡检报表
import { ref, computed, watch } from "vue";
</script>

<template>
	<section class="index-root">
		<h2>巡检报表</h2>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
