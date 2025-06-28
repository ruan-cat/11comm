<script lang="ts" setup>
import ComponentsDialogPromise from "components/dialog-promise/index.vue";
import { defineExpose, ref } from "vue";

const props = ref<DialogPromiseProps<{}>>({
	async onDialogClose({ reject, resolve }) {
		resolve({});
		return true;
	},
});
const dialogRef = useTemplateRef("dialog");
function open() {
	dialogRef.value?.open();
}
defineExpose({
	// 对外导出打开弹框函数
	open,
});
</script>

<template>
	<!-- 你必须要提供一个有意义的根dom元素 否则父级无法获得组件实例 -->
	<!-- [!code highlight] -->
	<section class="must-has-dom-root">
		<ComponentsDialogPromise :="props" ref="dialog" />
	</section>
</template>

<style lang="scss" scoped>
.must-has-dom-root {
}
</style>
