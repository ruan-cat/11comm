<script lang="ts" setup>
definePage({
	meta: {
		title: "字典类型",
		icon: "f7:menu",
		roles: ["开发团队"],
		rank: getRouteRank("devTeam.configManage.type"),
	},
});

import { ref, computed, watch } from "vue";
</script>

<template>
	<section class="index-root">
		<h2>字典类型</h2>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
