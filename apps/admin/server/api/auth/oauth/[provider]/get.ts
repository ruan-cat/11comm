/**
 * OAuth 登录发起端点
 * @description 发起 OAuth 登录流程（Google、GitHub 等）
 */

import { defineHandler, getRouterParam, sendRedirect } from "nitro/h3";
import { useAuthClient } from "server/utils/auth-client";
import { useRuntimeConfig } from "nitro/runtime-config";
import type { JsonVO } from "@01s-11comm/type";

/** 支持的 OAuth 提供商 */
const SUPPORTED_PROVIDERS = ["google", "github", "vercel"];

export default defineHandler(async (event) => {
	try {
		/** 获取 OAuth 提供商 */
		const provider = getRouterParam(event, "provider");

		if (!provider || !SUPPORTED_PROVIDERS.includes(provider)) {
			const errorResponse: JsonVO<null> = {
				success: false,
				code: 400,
				message: `不支持的 OAuth 提供商: ${provider}。支持的提供商: ${SUPPORTED_PROVIDERS.join(", ")}`,
				data: null,
			};
			return errorResponse;
		}

		/** 构建回调 URL */
		const config = useRuntimeConfig();
		const baseUrl = config.publicBaseUrl as string;
		const callbackURL = `${baseUrl}/api/auth/callback/${provider}`;

		/** 获取 Auth 客户端 */
		const authClient = useAuthClient(event);

		/** 发起 OAuth 登录 - 使用 Better Auth API */
		const { data, error } = await authClient.signIn.social({
			provider: provider as "google" | "github" | "vercel",
			callbackURL,
		});

		if (error) {
			console.error("[OAuth] Authorize error:", error);

			const errorResponse: JsonVO<null> = {
				success: false,
				code: 500,
				message: "OAuth 登录发起失败",
				data: null,
				error: error.message,
			};
			return errorResponse;
		}

		/** 如果返回了 URL，直接重定向 */
		if (data?.url) {
			return sendRedirect(event, data.url, 302);
		}

		/** 跳转到社交登录页面 */
		return sendRedirect(event, `/login?oauth=${provider}`, 302);
	} catch (error: any) {
		console.error("[OAuth] Error:", error);

		const errorResponse: JsonVO<null> = {
			success: false,
			code: 500,
			message: "OAuth 登录发起失败",
			data: null,
			error: error.message || String(error),
			stack: error.stack,
		};
		return errorResponse;
	}
});
