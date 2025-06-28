<script setup lang="ts">
import Popup from "components/popup/Popup.vue";
import { ElButton } from "element-plus";
import { ref } from "vue";

definePage({
	meta: {
		menuType: "page",
		isSample: true,
		text: "弹窗组件",
		icon: "IconSetting",
	},
});

// 控制弹窗显示状态
const showPopup = ref(false);

// 弹窗标题和内容
const popupTitle = ref("");
const popupContent = ref("");

// 打开弹窗
function openPopup(buttonId: number) {
	switch (buttonId) {
		case 1:
			popupTitle.value = "录入";
			popupContent.value = "内容。";
			break;
		case 2:
			popupTitle.value = "编辑";
			popupContent.value = "内容。";
			break;
		case 3:
			popupTitle.value = "批量删除";
			popupContent.value = "内容。";
			break;
		case 4:
			popupTitle.value = "查看";
			popupContent.value = "内容。";
			break;
		default:
			popupTitle.value = "默认弹窗";
			popupContent.value = "内容。";
	}

	showPopup.value = true; // 显示弹窗
}
</script>

<template>
	<div>
		<h3>弹窗组件测试页面</h3>

		<!-- 多个按钮 -->
		<ElButton type="primary" @click="openPopup(1)"> 录入</ElButton>
		<ElButton type="primary" @click="openPopup(2)">编辑</ElButton>
		<ElButton type="warning" @click="openPopup(3)">批量删除</ElButton>
		<ElButton type="info" @click="openPopup(4)">查看</ElButton>

		<!-- 弹窗组件 -->
		<Popup v-model:visible="showPopup" :title="popupTitle">
			<p>{{ popupContent }}</p>
		</Popup>
	</div>
</template>

<style scoped>
h3 {
	margin-bottom: 20px;
}

/* 按钮间距 */
.el-button {
	margin-right: 10px;
}
</style>
