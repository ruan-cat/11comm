/**
 * @file 忘记密码 / 密码重置 API
 * @description 处理用户密码重置请求
 */

import { defineHandler, readBody, createError } from "nitro/h3";
import { useAuthClient } from "server/utils/auth-client";
import type { H3Event } from "nitro/h3";

/**
 * 密码重置请求输入
 */
interface ForgotPasswordInput {
	/** 用户邮箱 */
	email: string;
}

/**
 * 处理密码重置请求
 */
async function handleForgotPassword(event: H3Event, input: ForgotPasswordInput) {
	const { email } = input;

	// 验证邮箱格式
	if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		throw createError({
			statusCode: 400,
			message: "请输入有效的邮箱地址",
		});
	}

	try {
		// 获取 Auth 客户端
		const authClient = useAuthClient(event);

		// 使用 Neon Auth 的密码重置功能
		// 注意：实际实现取决于 Neon Auth 的 API
		const { data, error } = await authClient.password.reset({
			email,
		});

		if (error) {
			console.error("[Forgot Password] Error:", error);
			throw createError({
				statusCode: 400,
				message: error.message || "密码重置请求失败",
			});
		}

		return {
			success: true,
			message: "密码重置邮件已发送到您的邮箱",
		};
	} catch (err: any) {
		console.error("[Forgot Password] Exception:", err);

		// 为了安全，即使出错也返回成功（防止邮箱枚举攻击）
		if (process.env.NODE_ENV === "production") {
			return {
				success: true,
				message: "如果该邮箱已注册，我们将发送密码重置邮件",
			};
		}

		throw createError({
			statusCode: 500,
			message: "服务器错误，请稍后重试",
		});
	}
}

/**
 * 验证密码重置令牌
 */
async function handleVerifyResetToken(event: H3Event, token: string) {
	try {
		const authClient = useAuthClient(event);

		// 验证令牌
		const { data, error } = await authClient.password.verifyResetToken(token);

		if (error) {
			throw createError({
				statusCode: 400,
				message: "重置令牌无效或已过期",
			});
		}

		return {
			valid: true,
			email: data?.email,
		};
	} catch (err: any) {
		throw createError({
			statusCode: 400,
			message: "重置令牌无效或已过期",
		});
	}
}

/**
 * 设置新密码
 */
async function handleSetNewPassword(event: H3Event, input: { token: string; password: string }) {
	const { token, password } = input;

	// 验证密码强度
	if (!password || password.length < 8) {
		throw createError({
			statusCode: 400,
			message: "密码长度至少为 8 个字符",
		});
	}

	// 检查密码复杂度
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);

	if (!hasUpperCase || !hasLowerCase || !hasNumber) {
		throw createError({
			statusCode: 400,
			message: "密码必须包含大小写字母和数字",
		});
	}

	try {
		const authClient = useAuthClient(event);

		// 使用新密码
		const { data, error } = await authClient.password.resetConfirm({
			token,
			password,
		});

		if (error) {
			throw createError({
				statusCode: 400,
				message: error.message || "密码重置失败",
			});
		}

		return {
			success: true,
			message: "密码重置成功",
		};
	} catch (err: any) {
		throw createError({
			statusCode: 400,
			message: err.message || "密码重置失败",
		});
	}
}

export default defineHandler({
	/**
	 * POST 忘记密码 - 发送重置邮件
	 */
	async post(event, body: ForgotPasswordInput) {
		return handleForgotPassword(event, body);
	},
});
