<script lang="ts" setup>
definePage({
	meta: {
		title: "注册协议",
		icon: "f7:menu",
		roles: ["开发团队"],
		rank: getRouteRank("settingManage.systemManage.registerProtocol"),
	},
});

import { ref, computed, watch } from "vue";
</script>

<template>
	<section class="index-root">
		<h2>注册协议</h2>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
