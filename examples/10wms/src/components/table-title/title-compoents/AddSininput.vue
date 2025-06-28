<script lang="ts" setup>
// loc data
import { ref, watch } from "vue";

const props = defineProps<PropsData>();
const size = ref<"default" | "large" | "small">("small");
const inputData = ref("");
// 收到父组件的数据
interface PropsData {
	message: {
		name: string;
		options: string[];
	};
}
// 动态绑定父组件的数据
const model = defineModel<string[]>();
function updata() {
	const data = [];
	data.push(inputData.value);
	data.push("");
	model.value = data;
}
// 检测父组件数据修改
watch(model, (newData) => {
	const [one, two, ...three] = newData;
	inputData.value = one;
});
</script>

<template>
	<div style="display: flex; align-items: center">
		<div style="justify-content: flex-end; margin-left: 5px">
			<!-- 选项抬头 -->
			{{ message.name }}:
		</div>
		<el-input v-model="inputData" style="flex: 1; margin: 5px 0" placeholder="请输入" :size="size" @input="updata()" />
	</div>
</template>
