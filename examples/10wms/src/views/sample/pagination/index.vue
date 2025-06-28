<script lang="ts" setup>
import MiniExample from "components/pagination/tests/mini-example.vue";

definePage({
	meta: {
		menuType: "page",
		isSample: true,
		text: "分页栏组件",
		icon: "IconSetting",
	},
});
</script>

<template>
	<section class="pagination-root">
		<h1>分页栏组件</h1>

		<ElCollapse accordion>
			<ElCollapseItem title="最小使用案例">
				<MiniExample />
			</ElCollapseItem>
		</ElCollapse>
	</section>
</template>

<style lang="scss" scoped>
.pagination-root {
}
</style>
