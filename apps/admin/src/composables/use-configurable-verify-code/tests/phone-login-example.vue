<template>
	<el-form ref="phoneForm" :model="phoneForm">
		<!-- 手机号 -->
		<el-form-item prop="phone">
			<el-input v-model="phoneForm.phone" placeholder="手机号" />
		</el-form-item>

		<!-- 短信验证码 - 根据配置显示 -->
		<el-form-item v-if="isSmsCaptchaEnabled" prop="smsCode">
			<el-input v-model="phoneForm.smsCode" placeholder="短信验证码">
				<template #append>
					<el-button @click="sendSmsCode">获取验证码</el-button>
				</template>
			</el-input>
		</el-form-item>

		<el-button @click="handlePhoneLogin">手机登录</el-button>
	</el-form>
</template>

<script setup>
import { reactive } from "vue";
import { useConfigurableVerifyCode } from "@/composables/use-configurable-verify-code";

const { isSmsCaptchaEnabled, isSystemCaptchaEnabled, buildLoginParams } = useConfigurableVerifyCode();

const phoneForm = reactive({
	phone: "",
	smsCode: "",
});

const handlePhoneLogin = async () => {
	const loginParams = buildLoginParams(
		{
			username: phoneForm.phone, // 使用手机号作为用户名
			password: "", // 手机登录可能不需要密码
		},
		{
			smsCode: phoneForm.smsCode,
			phone: phoneForm.phone,
		},
	);

	await phoneLoginApi(loginParams);
};
</script>