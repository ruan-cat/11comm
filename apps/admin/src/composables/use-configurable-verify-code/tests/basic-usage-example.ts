import { useConfigurableVerifyCode } from "@/composables/use-configurable-verify-code";

export default {
	setup() {
		const { isImageCaptchaEnabled, isSmsCaptchaEnabled, buildLoginParams } = useConfigurableVerifyCode();

		return {
			isImageCaptchaEnabled,
			isSmsCaptchaEnabled,
			buildLoginParams,
		};
	},
};
