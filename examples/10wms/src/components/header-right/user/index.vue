<!-- 
	用户组件 即顶部导航栏内最右侧的用户按钮
-->
<script lang="ts" setup>
import { Setting, SwitchButton, User } from "@element-plus/icons-vue";

import avatarImage from "assets/layoutIcon/avatar2.png";
import guestImage from "assets/layoutIcon/游客.png";
import { computed, nextTick, ref, useTemplateRef } from "vue";

// 待优化
// import UserInfoDialog from "./components/UserInfoDialog.vue";

const userStore = useUserStore();

/** 用户信息提示 */
const userInfo = computed(() => {
	return userStore.getUser === null ? "游客" : userStore.getUser.username;
});

// 处理弹框逻辑
// const showDialog = (i: any) => {
// 	status.value = i;
// 	dialogVisible.value = true;
// };

const changePasswordDialogVisible = ref(false); // 修改密码控制弹框显示/隐藏
// 系统消息控制弹框显示
const systemMessageDialogVisible = ref(false);
// 消息数据
const messages = ref([]);
// 打开弹框
function showSystemMessageDialog() {
	systemMessageDialogVisible.value = true;
}
// 控制弹框显示
const homeStyleDialogVisible = ref(false);

// // 打开弹框
function showHomeStyleDialog() {
	homeStyleDialogVisible.value = true;
}

// 控制详情页
const showDetail = ref(false);

function handleClearCache() {
	// 模拟清除缓存操作
	// clearCacheDialog.value.showDialog("浏览器缓存清除成功！");
}
const logoutDialog = ref();
function handleLogout() {
	logoutDialog.value.showDialog();
}

/** 用户信息弹框 组件实例 */
const userInfoDialogRef = useTemplateRef("userInfoDialogRef");

/** 打开 用户信息弹框 */
async function openUserInfoDialog() {
	await nextTick();
	userInfoDialogRef.value?.open();
}
</script>

<template>
	<el-dropdown trigger="click">
		<span style="color: white" class="move">
			<!-- 根据用户是否登录显示不同的图片 -->
			<img
				v-if="userStore.getUser !== null"
				:src="avatarImage"
				alt="欢迎用户"
				style="width: 32px; height: 32px; vertical-align: middle; border-radius: 50%"
			/>

			<img
				v-else
				:src="guestImage"
				alt="欢迎游客"
				style="width: 32px; height: 32px; vertical-align: middle; border-radius: 50%"
			/>
			{{ userInfo }}
		</span>

		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item :icon="User" @click="openUserInfoDialog">个人信息</el-dropdown-item>
				<el-dropdown-item :icon="Setting" @click="showSystemMessageDialog"> 系统消息 </el-dropdown-item>
				<el-dropdown-item :icon="Setting" @click="showHomeStyleDialog"> 首页风格 </el-dropdown-item>
				<el-dropdown-item :icon="Setting" @click="handleClearCache">消除缓存</el-dropdown-item>
				<el-dropdown-item :icon="SwitchButton" @click="changePasswordDialogVisible = true">修改密码</el-dropdown-item>
				<el-dropdown-item :icon="SwitchButton" @click="handleLogout">注销</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>

	<!-- 个人信息弹框 -->
	<ComponentsHeaderRightUserInfoDialog ref="userInfoDialogRef" />
</template>

<style lang="scss" scoped>
.user-root {
}
</style>
