<script lang="ts" setup>
import { ref, computed, watch } from "vue";
</script>

<template>
	<section class="simple-root">
		<!-- 简单布局页 仅仅是提供一个空的容器 -->
		<router-view />
	</section>
</template>

<style lang="scss" scoped>
/* 禁止使用 100vw：含垂直滚动条时 vw 仍按视口全宽计算，会导致横向溢出与横向滚动条 */
.simple-root {
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 100%;
	min-height: 100dvh;
	min-height: 100vh;
	overflow-x: hidden;
}
</style>
