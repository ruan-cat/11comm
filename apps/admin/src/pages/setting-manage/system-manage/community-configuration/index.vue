<script lang="ts" setup>
definePage({
	meta: {
		title: "小区配置",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("settingManage.systemManage.communityConfiguration"),
	},
});

import { ref, computed, watch } from "vue";
</script>

<template>
	<section class="index-root">
		<h2>小区配置</h2>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
