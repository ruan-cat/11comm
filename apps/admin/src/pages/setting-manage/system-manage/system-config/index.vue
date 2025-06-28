<script lang="ts" setup>
definePage({
	meta: {
		title: "系统配置",
		icon: "f7:menu",
		roles: ["开发团队"],
		rank: getRouteRank("settingManage.systemManage.systemConfig"),
	},
});

import { ref, computed, watch } from "vue";
</script>

<template>
	<section class="index-root">
		<h2>系统配置</h2>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
