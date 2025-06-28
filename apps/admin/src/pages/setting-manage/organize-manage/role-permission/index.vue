<script lang="ts" setup>
definePage({
	meta: {
		title: "角色权限",
		icon: "f7:menu",
		roles: ["物业团队", "运营团队"],
		rank: getRouteRank("settingManage.organizeManage.rolePermission"),
	},
});

import { ref, computed, watch } from "vue";
</script>

<template>
	<section class="index-root">
		<h2>角色权限</h2>
		<!--
      TODO: 暂时跳过本页面的静态代码生成 因为本页面的效果不是传统的列表页。
    -->
	</section>
</template>

<style lang="scss" scoped>
.index-root {
}
</style>
