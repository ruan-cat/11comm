<script lang="ts" setup>
definePage({
	meta: {
		title: "车位结构图",
		icon: "f7:menu",
		roles: ["物业团队"],
		rank: getRouteRank("propertyManage.communityManage.parkingSpaceStructureDiagram"),
	},
});

import { ref, computed, watch } from "vue";
</script>

<template>
	<section class="index-root">
		<h2>车位结构图</h2>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
