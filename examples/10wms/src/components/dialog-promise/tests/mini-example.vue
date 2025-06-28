<script lang="ts" setup>
import ComponentsDialogPromise from "components/dialog-promise/index.vue";
import { ref, useTemplateRef } from "vue";

const props = ref<
	DialogPromiseProps<{
		name: string;
		age: number;
	}>
>({
	async onDialogClose({ reject, resolve }) {
		resolve({
			name: "张三",
			age: 18,
		});
		return true;
	},
});
const dialogRef = useTemplateRef("dialog");
</script>

<template>
	<section>
		<ElButton type="success" @click="dialogRef?.open">打开弹框</ElButton>

		<ComponentsDialogPromise :="props" ref="dialog" />
	</section>
</template>
