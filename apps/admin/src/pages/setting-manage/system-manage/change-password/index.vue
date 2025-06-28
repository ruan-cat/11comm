<script lang="ts" setup>
definePage({
	meta: {
		title: "修改密码",
		icon: "f7:menu",
		rank: getRouteRank("settingManage.systemManage.changePassword"),
	},
});

import { ref, computed, watch } from "vue";
</script>

<template>
	<section class="index-root">
		<h2>修改密码</h2>
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
