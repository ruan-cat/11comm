import { defineMiddleware, getCookie, createError, getRequestHeader } from "nitro/h3";
import type { H3Event } from "nitro/h3";
import * as jose from "jose";

/**
 * 公开路由白名单
 * @description 这些路径不需要认证即可访问
 */
const PUBLIC_ROUTES = [
	// 前端页面路由（不需要认证）
	"/",
	"/login",
	"/register",
	"/forgot-password",
	"/oauth/callback",
	// 静态资源
	/^\/public\//,
	/^\/assets\//,
	/^\/favicon/,
	/^\/__/,
	// 认证相关 API
	"/api/auth/sign-in",
	"/api/auth/sign-up",
	"/api/auth/sign-out",
	"/api/auth/me",
	"/api/auth/oauth",
	"/api/auth/callback",
	"/api/auth/refresh",
	"/api/auth/forgot-password",
	"/api/auth/migrate",
	// 开发测试用 API（无需认证）
	/^\/api\/j1-/,
	/^\/api\/dev-/,
	// 通知公告
	/^\/api\/.*\/notice\//,
	// 公共数据
	/^\/api\/.*\/public\//,
	// 系统配置
	/^\/api\/.*\/system-config\//,
	// 健康检查
	"/health",
	"/_health",
	// 开发环境调试
	...(process.env.NODE_ENV === "development" ? ["/api/dev"] : []),
];

/**
 * 检查路径是否在白名单中
 */
function isPublicRoute(path: string): boolean {
	for (const route of PUBLIC_ROUTES) {
		if (typeof route === "string") {
			if (path.startsWith(route)) {
				return true;
			}
		} else if (route instanceof RegExp) {
			if (route.test(path)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * JWT 验证中间件
 *
 * @description
 * 验证请求中的 JWT Token，提取用户信息并注入到事件上下文中
 */
export default defineMiddleware(async (event: H3Event) => {
	/** 获取请求路径 */
	const path = event.path;

	/** 检查是否是公开路由 */
	if (isPublicRoute(path)) {
		return;
	}

	/** 从 Cookie 或 Header 获取 Token */
	const cookieToken = getCookie(event, "authorized-token");
	const headerToken = getRequestHeader(event, "authorization")?.replace(/^Bearer\s+/i, "");

	// 从 Cookie 中提取 accessToken（Cookie 存储的是 JSON 字符串）
	let token: string | undefined;
	if (cookieToken) {
		try {
			const tokenData = JSON.parse(cookieToken);
			token = tokenData.accessToken;
		} catch {
			// 如果不是 JSON 格式，直接使用（向后兼容）
			token = cookieToken;
		}
	} else {
		token = headerToken;
	}

	/** 如果没有 Token，返回 401 */
	if (!token) {
		throw createError({
			statusCode: 401,
			message: "未登录或 Token 已过期",
			data: null,
		});
	}

	try {
		/** 验证 JWT Token */
		/** 注意：实际应用中需要从 Neon Auth 获取 JWKS */
		/** 这里使用简化的验证逻辑，实际需要配置 JWKS */
		const secret = new TextEncoder().encode(process.env.NEON_AUTH_COOKIE_SECRET || "development-secret");

		/** 验证 Token（实际需要使用 Neon Auth 的 JWKS） */
		const { payload } = await jose.jwtVerify(token, secret, {
			algorithms: ["HS256"],
		});

		/** 将用户信息注入到事件上下文 */
		event.context.user = {
			id: payload.sub,
			email: payload.email as string,
			name: payload.name as string | undefined,
			role: (payload.metadata as any)?.role || "user",
			organizationId: (payload.metadata as any)?.organizationId,
			communityId: (payload.metadata as any)?.communityId,
		};

		/** 设置用户已认证标志 */
		event.context.authenticated = true;
	} catch (error: any) {
		console.error("[Auth Middleware] Token verification error:", error);

		/** Token 验证失败，返回 401 */
		throw createError({
			statusCode: 401,
			message: "Token 无效或已过期",
			data: null,
		});
	}
});
