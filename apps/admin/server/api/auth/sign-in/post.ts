/**
 * 登录 API
 * @description 用户邮箱密码登录
 */

import { defineHandler, readBody, setCookie } from "nitro/h3";
import { z } from "zod";
import { useAuthClient } from "server/utils/auth-client";
import type { JsonVO } from "@01s-11comm/type";

/** 登录请求参数 */
const signInSchema = z.object({
	email: z.string().email("请输入有效的邮箱地址"),
	password: z.string().min(1, "请输入密码"),
});

/** 登录响应数据 */
interface SignInResponse {
	token: string;
	refreshToken: string;
	expiresIn: number;
	tokenHead: string;
	clientId: string;
}

export default defineHandler(async (event) => {
	try {
		/** 获取并验证请求参数 */
		const body = await readBody(event);
		const credentials = signInSchema.parse(body);

		/** 获取 Auth 客户端 */
		const authClient = useAuthClient(event);

		/** 执行邮箱密码登录 - 使用 Better Auth API */
		const { data, error } = await authClient.signIn.email({
			email: credentials.email,
			password: credentials.password,
		});

		if (error) {
			console.error("[Sign In] Login error:", error);

			const errorResponse: JsonVO<null> = {
				success: false,
				code: 401,
				message: error.message || "登录失败，请检查邮箱和密码",
				data: null,
				error: error.message,
			};
			return errorResponse;
		}

		/** 登录成功，设置 Cookie */
		if (data?.session) {
			/** 将 Session 相关的 Cookie 转发到客户端 */
			// Better Auth API: session 包含 token
			const sessionToken = data.session.token;
			const expiresAt = Date.now() + 15 * 60 * 1000; // 15 分钟

			/** 设置认证 Cookie */
			setCookie(event, "authorized-token", sessionToken, {
				httpOnly: false, // 允许前端 JavaScript 访问（用于 Token 刷新）
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 15 * 60, // 15 分钟
				path: "/",
			});

			/** 构建登录响应（适配前端格式） */
			const response: JsonVO<SignInResponse> = {
				success: true,
				code: 200,
				message: "登录成功",
				data: {
					token: sessionToken,
					refreshToken: "",
					expiresIn: expiresAt,
					tokenHead: "Bearer",
					clientId: "comm-manager",
				},
			};

			return response;
		}

		/** Session 创建失败 */
		const failedResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "登录会话创建失败",
			data: null,
		};
		return failedResponse;
	} catch (error: any) {
		console.error("[Sign In] Error:", error);

		/** 参数验证错误 */
		if (error instanceof z.ZodError) {
			const errorResponse: JsonVO<null> = {
				success: false,
				code: 400,
				message: error.errors[0]?.message || "请求参数无效",
				data: null,
				error: error.message,
			};
			return errorResponse;
		}

		/** 通用错误 */
		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "登录失败",
			data: null,
			error: error.message || String(error),
			stack: error.stack,
		};
		return errorResponse;
	}
});
