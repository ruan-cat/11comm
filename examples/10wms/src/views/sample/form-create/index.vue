<script lang="ts" setup>
import { ref } from "vue";
import "element-plus/dist/index.css";

definePage({
	meta: {
		menuType: "page",
		isSample: true,
		text: "可视化表单演示",
		icon: "IconSetting",
	},
});
const designer = ref(null);
</script>

<template>
	<fc-designer ref="designer" height="88vh" />
</template>
