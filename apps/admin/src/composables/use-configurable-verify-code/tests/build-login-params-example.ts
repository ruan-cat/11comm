import { useConfigurableVerifyCode } from "../index";

// 参数类型定义
export interface BaseParams {
	username: string;
	password: string;
}

export interface CaptchaData {
	verifyCode?: string; // 图片验证码
	uuid?: string; // 验证码UUID
	smsCode?: string; // 短信验证码
	phone?: string; // 手机号
}

// 使用组合式函数
const { buildLoginParams } = useConfigurableVerifyCode();

// 使用示例
export const loginParams = buildLoginParams(
	{
		username: "admin",
		password: "123456",
	},
	{
		verifyCode: "1234",
		uuid: "abc-123-def",
		smsCode: "567890",
		phone: "13800138000",
	},
);
