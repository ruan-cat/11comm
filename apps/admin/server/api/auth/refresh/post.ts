/**
 * Token 刷新 API
 * @description 刷新 Access Token
 */

import { defineHandler, getCookie, setCookie } from "nitro/h3";
import { useAuthClient } from "server/utils/auth-client";
import type { JsonVO } from "@01s-11comm/type";

/** 刷新响应数据 */
interface RefreshResponse {
	token: string;
	expiresIn: number;
	tokenHead: string;
}

export default defineHandler(async (event) => {
	try {
		/** 获取 Auth 客户端 */
		const authClient = useAuthClient(event);

		/** 尝试刷新会话 */
		const { data, error } = await authClient.refreshSession();

		if (error) {
			console.error("[Refresh Token] Refresh error:", error);

			/** 刷新失败，清除 Cookie */
			return {
				success: false,
				code: 401,
				message: "Token 刷新失败，请重新登录",
				data: null,
			} as JsonVO<null>;
		}

		/** 刷新成功 */
		if (data?.session) {
			const sessionToken = data.session.token;
			const expiresAt = Date.now() + 15 * 60 * 1000; // 15 分钟

			/** 更新认证 Cookie */
			setCookie(event, "authorized-token", sessionToken, {
				httpOnly: false,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 15 * 60,
				path: "/",
			});

			const response: JsonVO<RefreshResponse> = {
				success: true,
				code: 200,
				message: "Token 刷新成功",
				data: {
					token: sessionToken,
					expiresIn: expiresAt,
					tokenHead: "Bearer",
				},
			};

			return response;
		}

		/** 刷新失败 */
		const failedResponse: JsonVO<null> = {
			success: false,
			code: 401,
			message: "Token 刷新失败，请重新登录",
			data: null,
		};
		return failedResponse;
	} catch (error: any) {
		console.error("[Refresh Token] Error:", error);

		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "Token 刷新失败",
			data: null,
			error: error.message || String(error),
		};
		return errorResponse;
	}
});
