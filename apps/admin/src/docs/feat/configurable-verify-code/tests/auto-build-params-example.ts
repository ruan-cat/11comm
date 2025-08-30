// 旧方式 - 手动构建参数
const loginData = {
	username: form.username,
	password: form.password,
	...(isImageCaptchaEnabled.value && {
		verifyCode: form.verifyCode,
		uuid: captchaInfo.value?.uuid,
	}),
};

// 新方式 - 自动构建参数
const loginData = buildLoginParams(
	{ username: form.username, password: form.password },
	{ verifyCode: form.verifyCode, uuid: captchaInfo.value?.uuid },
);
