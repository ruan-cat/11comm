<script lang="ts" setup>
definePage({
	meta: {
		title: "排班表",
		icon: "mdi:calendar",
		roles: ["物业团队"],
		rank: getRouteRank("settingManage.organizeManage.workingSchedule"),
	},
});

import { ref, computed, watch } from "vue";
</script>

<template>
	<section class="index-root">
		<h2>排班表</h2>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
