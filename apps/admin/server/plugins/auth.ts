import { definePlugin } from "nitro";
import type { H3Event } from "nitro/h3";

/**
 * Neon Auth 认证插件
 *
 * @description
 * 在每个请求开始时验证用户会话，并将会话信息注入到事件上下文中。
 * 使用懒加载模式，在 Cloudflare Worker 环境中安全地访问环境变量。
 */
export default definePlugin((nitroApp) => {
	/** 在请求时验证会话并注入用户信息 */
	nitroApp.hooks.hook("request", async (rawEvent) => {
		const event = rawEvent as H3Event;
		/** 跳过静态资源和公开路径 */
		const path = event.path;
		if (path.startsWith("/_nuxt") || path.startsWith("/favicon")) {
			return;
		}

		/** 获取会话信息 */
		try {
			// 动态导入以支持懒加载
			const { useAuthClient } = await import("../utils/auth-client");
			const authClient = useAuthClient(event);

			/** 获取当前会话 */
			const { data: sessionData } = await authClient.getSession();

			if (sessionData?.session) {
				/** 将用户信息注入到事件上下文 */
				const user = sessionData.user;
				const metadata = (user as any).metadata || {};

				event.context.user = {
					id: user.id,
					email: user.email || "",
					name: user.name,
					role: metadata.role || "user",
					organizationId: metadata.organizationId,
					communityId: metadata.communityId,
				};
				event.context.session = sessionData.session;
			}
		} catch (error) {
			/** 静默处理认证错误，不阻塞请求 */
			console.error("[Auth Plugin] Session validation error:", error);
		}
	});
});
