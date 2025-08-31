<script lang="ts" setup>
definePage({
	meta: {
		title: "配置项",
		icon: "f7:menu",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.configManage.item"),
	},
});

import { ref, computed, watch } from "vue";
</script>

<template>
	<section class="index-root">
		<h2>配置项</h2>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
