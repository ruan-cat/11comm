/**
 * 注册 API
 * @description 用户邮箱密码注册
 */

import { defineHandler, readBody, setCookie } from "nitro/h3";
import { z } from "zod";
import { useAuthClient } from "server/utils/auth-client";
import type { JsonVO } from "@01s-11comm/type";

/** 注册请求参数 */
const signUpSchema = z.object({
	email: z.string().email("请输入有效的邮箱地址"),
	password: z.string().min(8, "密码至少需要 8 个字符"),
	name: z.string().min(1, "请输入用户名").optional(),
});

/** 注册响应数据 */
interface SignUpResponse {
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
		const credentials = signUpSchema.parse(body);

		/** 获取 Auth 客户端 */
		const authClient = useAuthClient(event);

		/** 执行邮箱密码注册 - 使用 Better Auth API */
		const { data, error } = await authClient.signUp.email({
			email: credentials.email,
			password: credentials.password,
			name: credentials.name || credentials.email.split("@")[0],
		});

		if (error) {
			console.error("[Sign Up] Registration error:", error);

			/** 处理用户已存在错误 */
			if (error.message?.toLowerCase().includes("already exists")) {
				const errorResponse: JsonVO<null> = {
					success: false,
					code: 409,
					message: "该邮箱已被注册",
					data: null,
					error: error.message,
				};
				return errorResponse;
			}

			const errorResponse: JsonVO<null> = {
				success: false,
				code: 400,
				message: error.message || "注册失败",
				data: null,
				error: error.message,
			};
			return errorResponse;
		}

		/** 注册成功 */
		if (data?.session) {
			const sessionToken = data.session.token;
			const expiresAt = Date.now() + 15 * 60 * 1000;

			/** 设置认证 Cookie */
			setCookie(event, "authorized-token", sessionToken, {
				httpOnly: false,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 15 * 60,
				path: "/",
			});

			const response: JsonVO<SignUpResponse> = {
				success: true,
				code: 201,
				message: "注册成功",
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

		/** 需要邮箱验证 */
		if (data?.session === null) {
			const response: JsonVO<null> = {
				success: true,
				code: 201,
				message: "注册成功，请查收邮箱验证链接",
				data: null,
			};
			return response;
		}

		/** 注册失败 */
		const failedResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "注册失败",
			data: null,
		};
		return failedResponse;
	} catch (error: any) {
		console.error("[Sign Up] Error:", error);

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

		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "注册失败",
			data: null,
			error: error.message || String(error),
			stack: error.stack,
		};
		return errorResponse;
	}
});
