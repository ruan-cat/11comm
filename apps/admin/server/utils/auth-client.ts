import { createAuthClient } from "@neondatabase/auth";
import type { NeonAuthPublicApi } from "@neondatabase/auth";
import type { H3Event } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";
import consola from "consola";

/**
 * Neon Auth 客户端类型
 */
export type AuthClientType = NeonAuthPublicApi<any>;

/**
 * 从多个来源解析 Neon Auth 基础 URL
 *
 * @param event - H3 事件对象，用于访问 Cloudflare Bindings
 * @returns Neon Auth 基础 URL
 */
function resolveNeonAuthBaseUrl(event: H3Event): string | undefined {
	/** 最高优先级：Cloudflare Bindings */
	try {
		// @ts-ignore — event.req.runtime 是 Nitro v3 Cloudflare 预设的运行时注入
		const cfRuntimeEnv = (event.req as any)?.runtime?.cloudflare?.env;
		if (cfRuntimeEnv) {
			if (cfRuntimeEnv.comm_admin_11__NEON_AUTH_BASE_URL) {
				consola.success("从 req.runtime.cloudflare.env 获取到: comm_admin_11__NEON_AUTH_BASE_URL");
				return cfRuntimeEnv.comm_admin_11__NEON_AUTH_BASE_URL as string;
			}
		}
	} catch {
		/** 非 Cloudflare 环境或路径不存在，静默忽略 */
	}

	/** 次高优先级：旧版 Cloudflare 兼容路径 */
	try {
		const cfCtxEnv = (event.context as any).cloudflare?.env;
		if (cfCtxEnv) {
			if (cfCtxEnv.comm_admin_11__NEON_AUTH_BASE_URL) {
				consola.success("从 context.cloudflare.env 获取到: comm_admin_11__NEON_AUTH_BASE_URL");
				return cfCtxEnv.comm_admin_11__NEON_AUTH_BASE_URL as string;
			}
		}
	} catch {
		/** 非 Cloudflare 环境，静默忽略 */
	}

	/** 检查 process.env（wrangler.vars 构建时 polyfill，适用于本地 Node 开发） */
	if (process.env.comm_admin_11__NEON_AUTH_BASE_URL) {
		consola.success("从 process.env 获取到环境变量: comm_admin_11__NEON_AUTH_BASE_URL");
		return process.env.comm_admin_11__NEON_AUTH_BASE_URL;
	}

	/** 检查标准环境变量 */
	if (process.env.NEON_AUTH_BASE_URL) {
		consola.success("从 process.env 获取到环境变量: NEON_AUTH_BASE_URL");
		return process.env.NEON_AUTH_BASE_URL;
	}

	/** 最后尝试 Nitro runtimeConfig */
	try {
		const config = useRuntimeConfig();
		if (config?.neonAuthBaseUrl) {
			consola.success("从 Nitro runtimeConfig 获取到 neonAuthBaseUrl");
			return config.neonAuthBaseUrl as string;
		}
	} catch {
		/** useRuntimeConfig 在非 Nitro 运行时环境中不可用 */
	}

	return undefined;
}

/**
 * 获取 Neon Auth 认证客户端（懒加载）
 *
 * @description
 * 在 Cloudflare Worker 环境中，process.env 仅在 handler 内可用，
 * 因此必须在请求处理时动态创建客户端实例。
 * 设计参考 server/db/index.ts 的 useDb 懒加载模式。
 *
 * @param event - H3 事件对象
 * @returns Neon Auth 客户端实例
 *
 * @example
 * ```typescript
 * // 在 API 路由中使用
 * export default defineHandler(async (event) => {
 *   const authClient = useAuthClient(event);
 *   const { data } = await authClient.signIn.email(...);
 * });
 * ```
 */
export function useAuthClient(event: H3Event): AuthClientType {
	/** 如果事件上下文中已有 Auth 客户端实例，直接返回（单例模式） */
	if (event.context.authClient) {
		return event.context.authClient as AuthClientType;
	}

	/** 解析 Neon Auth 基础 URL */
	const baseUrl = resolveNeonAuthBaseUrl(event);

	if (!baseUrl) {
		consola.error("未能获取 Neon Auth 基础 URL，已检查以下来源：");
		consola.error("  - event.context.cloudflare.env.comm_admin_11__NEON_AUTH_BASE_URL");
		consola.error("  - process.env.comm_admin_11__NEON_AUTH_BASE_URL");
		consola.error("  - process.env.NEON_AUTH_BASE_URL");
		consola.error("  - Nitro runtimeConfig.neonAuthBaseUrl");

		throw new Error("未设置 Neon Auth 基础 URL。请确保 NEON_AUTH_BASE_URL 环境变量已正确配置。", {
			cause: {
				checkedSources: [
					"event.context.cloudflare.env.comm_admin_11__NEON_AUTH_BASE_URL",
					"process.env.comm_admin_11__NEON_AUTH_BASE_URL",
					"process.env.NEON_AUTH_BASE_URL",
					"Nitro runtimeConfig.neonAuthBaseUrl",
				],
			},
		});
	}

	/** 创建新的 Auth 客户端实例并缓存到事件上下文中 */
	const authClient = createAuthClient(baseUrl) as AuthClientType;
	event.context.authClient = authClient;

	return authClient;
}

/**
 * OAuth 配置检查
 * @description 验证 OAuth 所需的配置是否完整
 * @returns 配置检查结果
 */
export function checkOAuthConfig(): { valid: boolean; missing: string[]; warnings: string[] } {
	const missing: string[] = [];
	const warnings: string[] = [];

	// 检查 Neon Auth 基础 URL
	if (!process.env.NEON_AUTH_BASE_URL && !process.env.comm_admin_11__NEON_AUTH_BASE_URL) {
		missing.push("NEON_AUTH_BASE_URL");
	}

	// 检查 Cookie 密钥
	if (!process.env.NEON_AUTH_COOKIE_SECRET && !process.env.comm_admin_11__NEON_AUTH_COOKIE_SECRET) {
		missing.push("NEON_AUTH_COOKIE_SECRET");
	}

	// 检查密钥长度
	const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET || process.env.comm_admin_11__NEON_AUTH_COOKIE_SECRET;
	if (cookieSecret && cookieSecret.length < 32) {
		warnings.push("NEON_AUTH_COOKIE_SECRET 长度不足 32 字符，建议使用更长的密钥");
	}

	// 检查前端基础 URL
	if (!process.env.PUBLIC_BASE_URL && !process.env.comm_admin_11__PUBLIC_BASE_URL) {
		missing.push("PUBLIC_BASE_URL");
	}

	// 可选 OAuth 配置检查
	const githubClientId = process.env.GITHUB_CLIENT_ID || process.env.comm_admin_11__GITHUB_CLIENT_ID;
	const githubClientSecret = process.env.GITHUB_CLIENT_SECRET || process.env.comm_admin_11__GITHUB_CLIENT_SECRET;

	if (githubClientId && !githubClientSecret) {
		warnings.push("GitHub OAuth: 已配置 CLIENT_ID 但缺少 CLIENT_SECRET");
	}
	if (!githubClientId && githubClientSecret) {
		warnings.push("GitHub OAuth: 已配置 CLIENT_SECRET 但缺少 CLIENT_ID");
	}

	const wechatAppId = process.env.WECHAT_MINI_PROGRAM_APPID || process.env.comm_admin_11__WECHAT_MINI_PROGRAM_APPID;
	const wechatSecret = process.env.WECHAT_MINI_PROGRAM_SECRET || process.env.comm_admin_11__WECHAT_MINI_PROGRAM_SECRET;

	if (wechatAppId && !wechatSecret) {
		warnings.push("微信小程序 OAuth: 已配置 APPID 但缺少 SECRET");
	}
	if (!wechatAppId && wechatSecret) {
		warnings.push("微信小程序 OAuth: 已配置 SECRET 但缺少 APPID");
	}

	return {
		valid: missing.length === 0,
		missing,
		warnings,
	};
}

/**
 * 处理 OAuth 回调错误
 * @description 将 OAuth 错误转换为用户友好的消息
 * @param error - OAuth 错误对象
 * @returns 处理后的错误信息
 */
export function handleOAuthCallbackError(error: unknown): { message: string; code?: string; details?: unknown } {
	const showDetails = process.env.OAUTH_SHOW_ERROR_DETAILS === "true";

	// Neon Auth 常见错误处理
	if (error && typeof error === "object") {
		const err = error as { cause?: { code?: string }; message?: string };

		if (err.cause?.code === "invalid_grant") {
			return {
				message: "授权已过期或已被使用，请重新发起登录",
				code: "invalid_grant",
			};
		}

		if (err.cause?.code === "invalid_request") {
			return {
				message: "授权请求无效，请检查登录参数",
				code: "invalid_request",
			};
		}

		if (err.cause?.code === "access_denied") {
			return {
				message: "用户拒绝了授权请求",
				code: "access_denied",
			};
		}

		return {
			message: showDetails ? err.message || "登录失败" : "登录失败，请稍后重试",
			code: "unknown",
			details: showDetails ? error : undefined,
		};
	}

	return {
		message: showDetails ? String(error) : "登录失败，请稍后重试",
		code: "unknown",
	};
}
