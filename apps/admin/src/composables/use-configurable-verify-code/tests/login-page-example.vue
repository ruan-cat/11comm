<template>
	<el-form ref="loginForm" :model="form">
		<!-- 用户名 -->
		<el-form-item prop="username">
			<el-input v-model="form.username" placeholder="用户名" />
		</el-form-item>

		<!-- 密码 -->
		<el-form-item prop="password">
			<el-input v-model="form.password" type="password" placeholder="密码" />
		</el-form-item>

		<!-- 图片验证码 - 根据配置显示 -->
		<el-form-item v-if="isImageCaptchaEnabled" prop="verifyCode">
			<el-input v-model="form.verifyCode" placeholder="验证码">
				<template #append>
					<CaptchaImage @loaded="handleCaptchaLoaded" />
				</template>
			</el-input>
		</el-form-item>

		<el-button @click="handleLogin" :loading="loading"> 登录 </el-button>
	</el-form>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useConfigurableVerifyCode } from "@/composables/use-configurable-verify-code";

const { isImageCaptchaEnabled, isSystemCaptchaEnabled, buildLoginParams } = useConfigurableVerifyCode();

const form = reactive({
	username: "",
	password: "",
	verifyCode: "",
});

const captchaInfo = ref(null);
const loading = ref(false);

const handleCaptchaLoaded = (data) => {
	captchaInfo.value = data;
};

const handleLogin = async () => {
	// 根据配置自动构建登录参数
	const loginParams = buildLoginParams(
		{
			username: form.username,
			password: form.password,
		},
		{
			verifyCode: form.verifyCode,
			uuid: captchaInfo.value?.uuid,
		},
	);

	loading.value = true;
	try {
		await loginApi(loginParams);
		// 登录成功处理
	} catch (error) {
		// 错误处理
	} finally {
		loading.value = false;
	}
};
</script>