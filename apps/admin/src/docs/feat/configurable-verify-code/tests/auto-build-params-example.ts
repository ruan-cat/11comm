import { useConfigurableVerifyCode } from "@/composables/use-configurable-verify-code";

/** 假设的表单数据和验证码信息 */
const form = {
	username: "admin",
	password: "123456",
	verifyCode: "1234",
};

const captchaInfo = {
	value: {
		uuid: "abc-123-def",
	},
};

const { isImageCaptchaEnabled, buildLoginParams } = useConfigurableVerifyCode();

// 旧方式 - 手动构建参数
const loginDataOld = {
	username: form.username,
	password: form.password,
	...(isImageCaptchaEnabled.value && {
		verifyCode: form.verifyCode,
		uuid: captchaInfo.value?.uuid,
	}),
};

// 新方式 - 自动构建参数
const loginDataNew = buildLoginParams(
	{ username: form.username, password: form.password },
	{ verifyCode: form.verifyCode, uuid: captchaInfo.value?.uuid },
);
