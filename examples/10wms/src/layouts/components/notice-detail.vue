<!-- 通知详情或者消息详细 -->

<script lang="ts" setup>
import { getNoticeDetailAPI } from "@/apis/notice-remind/index.js";
import { ref } from "vue";

const prop = defineProps(["dialogTitle", "noticeId"]);
const control = defineModel("control");
// 数据 后端获得
const data = ref();

// 获取公告详情
async function getNoticeDetail() {
	const res = await getNoticeDetailAPI(prop.noticeId);
	if (res.code === 10000) {
		data.value = res.data;
	}
	console.log("通知详情", res);
	// data.value = data;
}

watch(
	() => control.value,
	async (newValue) => {
		if (newValue) {
			await getNoticeDetail();
		}
	},
	{ immediate: true },
);

// watch(
// 	() => prop.noticeId,
// 	async (newVal) => {
// 		if (newVal) {
// 			await getNoticeDetail();
// 		}
// 	},
// 	{ immediate: true },
// );

// 处理可见性变化
function handleDialogChange(value) {
	console.log("点击关闭", value);
	control.value = value;
}

//
</script>

<template>
	<el-dialog :model-value="control" draggable :title="dialogTitle" @update:model-value="handleDialogChange">
		<div>
			<h4>{{ data?.noticeTitle }}</h4>
			<h4 class="time">{{ data?.createTime }}</h4>
			<div class="content">{{ data?.noticeContent }}</div>
		</div>
		<template #footer>
			<el-button @click="control = false">关闭</el-button>
		</template>
	</el-dialog>
</template>

<style lang="scss" scoped>
.time {
	border-bottom: 1px solid #000;
}
.content {
	margin-top: 10px;
	height: 400px;
}
</style>
