<!-- 
	用户信息弹框 
	显示用户信息，可修改用户信息
-->
<script lang="ts" setup>
import type { BaseFormProps } from "components/base-form/index.vue";
import type { DialogPromiseProps } from "components/dialog-promise/types";
import { defineExpose, onMounted, ref, useTemplateRef } from "vue";

/** 弹框组件配置 */
const dialogPromiseProps = ref<DialogPromiseProps<{}>>({
	dialogProps: {
		title: "个人信息",
		width: "40%",
	},
	async onDialogClose({ reject, resolve }) {
		resolve({});
		return true;
	},
});

/** 弹框组件实例 */
const dialogRef = useTemplateRef("dialogRef");

/** 打开弹框 */
async function open() {
	await nextTick();
	dialogRef.value?.open();
}

defineExpose({
	// 对外导出打开弹框函数
	open,
});

/**
 * 用户信息
 * @description
 * TODO: 临时写的 不清楚后端是那个接口
 */
interface UserInfo {
	username: string;
	name: string;
	phone: string;
	email: string;
}

const form = ref<UserInfo>({
	username: "admin",
	name: "管理员",
	phone: "",
	email: "",
});

/** 表单配置 */
const baseFormProps = ref<BaseFormProps<UserInfo>>({
	form: form.value,
	labelWidth: "100px",
	// isNotTableLikeBg: true,
	formItems: [
		// 用户账号
		{
			type: "input",
			props: {
				label: "用户账号",
				prop: "username",
				readonly: true,
				responsive: {
					xs: 24,
					lg: 24,
				},
			},
		},

		// 姓名
		{
			type: "input",
			props: {
				label: "姓名",
				prop: "name",
				readonly: true,
				responsive: {
					xs: 24,
					lg: 24,
				},
			},
		},

		// 手机号码
		{
			type: "input",
			props: {
				label: "手机号码",
				prop: "phone",
				readonly: true,
				responsive: {
					xs: 24,
					lg: 24,
				},
			},
		},

		// 邮箱
		{
			type: "input",
			props: {
				label: "邮箱",
				prop: "email",
				readonly: true,
				responsive: {
					xs: 24,
					lg: 24,
				},
			},
		},
	],
});

/** 表单组件实例 */
const baseFormRef = useTemplateRef("baseFormRef");

onMounted(() => {
	// TODO: 对接获取用户信息的接口
});
</script>

<template>
	<section class="info-dialog-root">
		<ComponentsDialogPromise :="dialogPromiseProps" ref="dialogRef">
			<template #default>
				<ComponentsBaseForm :="baseFormProps" ref="baseFormRef"></ComponentsBaseForm>
			</template>

			<template #footer="{ reject, resolve }">
				<ElButton type="info" @click="dialogPromiseProps.onDialogClose({ reject, resolve })"> 关闭 </ElButton>
			</template>
		</ComponentsDialogPromise>
	</section>
</template>

<style lang="scss" scoped>
.info-dialog-root {
}
</style>
