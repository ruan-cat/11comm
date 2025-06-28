<script lang="ts" setup>
// 导入PDFObject
import PDFObject from "pdfobject";
import { onMounted } from "vue";

definePage({
	meta: {
		menuType: "page",
		isSample: true,
		text: "PDF预览演示",
		icon: "IconSetting",
	},
});
onMounted(() => {
	const url = "https://pdfobject.com/pdf/sample-3pp.pdf";
	PDFObject.embed(url, "#my-container");
});
</script>

<template>
	<div id="my-container"></div>
</template>

<style scoped>
/* 设置pdf样式，类名固定 */
.pdfobject-container {
	height: 680px;
	border: 1rem solid rgba(0, 0, 0, 0.1);
}
</style>
