<script lang="ts" setup>
definePage({
	meta: {
		title: "菜单目录",
		icon: "f7:menu",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.menuManage.catalog"),
	},
});

import { ref, computed, watch } from "vue";
</script>

<template>
	<section class="index-root">
		<h2>菜单目录</h2>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
