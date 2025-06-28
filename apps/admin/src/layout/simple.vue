<script lang="ts" setup>
import { ref, computed, watch } from "vue";
</script>

<template>
	<section class="simple-root">
		<!-- 简单布局页 仅仅是提供一个空的容器 -->
		<router-view></router-view>
	</section>
</template>

<style lang="scss" scoped>
.simple-root {
	width: 100vw;
	height: 100vh;
}
</style>
