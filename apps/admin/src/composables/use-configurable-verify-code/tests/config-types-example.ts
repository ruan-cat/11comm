interface PlatformConfigs {
	/** 验证码相关配置 */
	CaptchaConfig?: {
		/** 是否启用图片验证码，默认false */
		isImageCaptchaEnabled?: boolean;
		/** 是否启用短信验证码，默认true */
		isSmsCaptchaEnabled?: boolean;
		/** 是否启用系统自带的前端验证码，默认true */
		isSystemCaptchaEnabled?: boolean;
	};
}

interface StorageConfigs {
	/** 验证码相关配置（驼峰命名用于本地存储） */
	captchaConfig?: {
		/** 是否启用图片验证码，默认false */
		isImageCaptchaEnabled?: boolean;
		/** 是否启用短信验证码，默认true */
		isSmsCaptchaEnabled?: boolean;
		/** 是否启用系统自带的前端验证码，默认true */
		isSystemCaptchaEnabled?: boolean;
	};
}
