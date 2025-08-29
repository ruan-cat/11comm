import { computed, type ComputedRef } from "vue";
import { getConfig } from "@/config";

/**
 * 可配置验证码组合式 API
 *
 * 提供统一的验证码配置管理，支持图片验证码和短信验证码的独立控制
 *
 */
export function useConfigurableVerifyCode() {
	/**
	 * 是否启用图片验证码
	 * @description 控制登录页面图片验证码的显示和验证逻辑
	 * @default false
	 */
	const enableImageCaptcha: ComputedRef<boolean> = computed(() => {
		return getConfig()?.CaptchaConfig?.enableImageCaptcha ?? false;
	});

	/**
	 * 是否启用短信验证码
	 * @description 控制手机登录和忘记密码页面短信验证码功能
	 * @default true
	 */
	const enableSmsCaptcha: ComputedRef<boolean> = computed(() => {
		return getConfig()?.CaptchaConfig?.enableSmsCaptcha ?? true;
	});

	/**
	 * 获取完整的验证码配置
	 * @description 返回当前的验证码配置对象
	 */
	const captchaConfig = computed(() => {
		return (
			getConfig()?.CaptchaConfig ?? {
				enableImageCaptcha: false,
				enableSmsCaptcha: true,
			}
		);
	});

	/**
	 * 检查是否需要验证码
	 * @description 判断当前是否启用了任何类型的验证码
	 */
	const needsVerification = computed(() => {
		return enableImageCaptcha.value || enableSmsCaptcha.value;
	});

	/**
	 * 根据配置构建登录参数
	 * @param baseParams 基础登录参数
	 * @param captchaData 验证码相关数据
	 * @returns 完整的登录参数对象
	 */
	function buildLoginParams(
		baseParams: { username: string; password: string },
		captchaData?: {
			verifyCode?: string;
			uuid?: string;
			smsCode?: string;
			phone?: string;
		},
	) {
		const params: any = { ...baseParams };

		// 图片验证码参数
		if (enableImageCaptcha.value && captchaData?.verifyCode && captchaData?.uuid) {
			params.code = captchaData.verifyCode;
			params.uuid = captchaData.uuid;
		}

		// 短信验证码参数
		if (enableSmsCaptcha.value && captchaData?.smsCode) {
			params.smsCode = captchaData.smsCode;
			if (captchaData.phone) {
				params.phone = captchaData.phone;
			}
		}

		return params;
	}

	return {
		/** 是否启用图片验证码 */
		enableImageCaptcha,
		/** 是否启用短信验证码 */
		enableSmsCaptcha,
		/** 完整的验证码配置 */
		captchaConfig,
		/** 是否需要验证码 */
		needsVerification,
		/** 构建登录参数 */
		buildLoginParams,
	};
}

export type UseConfigurableVerifyCodeReturn = ReturnType<typeof useConfigurableVerifyCode>;
