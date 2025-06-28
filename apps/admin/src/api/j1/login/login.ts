/**
 * 验证码返回对象
 */
export interface CaptchaResult {
	/**
	 * 验证码图片
	 */
	captchaImage: string;
	/**
	 * 验证码
	 */
	uuid: string;
}

/**
 * 获取验证码
 * @description
 * @see https://app.apifox.com/link/project/6386631/apis/api-307604117
 */
export function getJ1LoginCaptcha() {
	return http.request<JsonVO<CaptchaResult>>("get", "/login/captcha");
}
