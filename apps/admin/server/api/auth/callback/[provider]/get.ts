/**
 * OAuth 回调处理端点
 * @description 处理 OAuth 提供商返回的回调
 */

import { defineHandler, getRouterParam, sendRedirect, setCookie } from "nitro/h3";
import { useAuthClient } from "server/utils/auth-client";
import type { JsonVO } from "@01s-11comm/type";

/** 支持的 OAuth 提供商 */
const SUPPORTED_PROVIDERS = ["google", "github", "vercel"];

export default defineHandler(async (event) => {
	try {
		/** 获取 OAuth 提供商 */
		const provider = getRouterParam(event, "provider");

		if (!provider || !SUPPORTED_PROVIDERS.includes(provider)) {
			return sendRedirect(event, `/login?error=invalid_provider`, 302);
		}

		/** 获取 Auth 客户端 */
		const authClient = useAuthClient(event);

		/** 获取当前会话（OAuth 回调后会话应该已经创建） */
		const { data: sessionData, error: sessionError } = await authClient.getSession();

		if (sessionError) {
			console.error("[OAuth Callback] Session error:", sessionError);
			return sendRedirect(event, `/login?error=session_error`, 302);
		}

		/** 检查是否有会话 */
		if (sessionData?.session) {
			/** 登录成功，设置 Cookie */
			// @ts-ignore - Better Auth session type
			const sessionToken = sessionData.session.token;
			const expiresAt = Date.now() + 15 * 60 * 1000; // 15 分钟

			/** 设置认证 Cookie */
			setCookie(event, "authorized-token", sessionToken, {
				httpOnly: false,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 15 * 60,
				path: "/",
			});

			/** 登录成功，重定向到首页或仪表盘 */
			return sendRedirect(event, "/", 302);
		}

		/** 会话创建失败 */
		return sendRedirect(event, "/login?error=session_failed", 302);
	} catch (error: any) {
		console.error("[OAuth Callback] Error:", error);
		return sendRedirect(event, "/login?error=unknown", 302);
	}
});
