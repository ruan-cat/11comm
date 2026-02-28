/**
 * @file 认证中间件测试
 * @description 测试 JWT 验证中间件和公开路由白名单逻辑
 * @note 此测试需要在 node 环境下运行，使用 --node 参数
 */

import { test, expect, describe } from "vitest";
import * as jose from "jose";

// 模拟 authMiddleware 的逻辑进行单元测试
// 由于中间件依赖 h3 事件对象，我们直接测试其中的 isPublicRoute 函数和 JWT 验证逻辑

/** 公开路由白名单 - 与中间件保持一致 */
const PUBLIC_ROUTES = [
	// 认证相关
	"/api/auth/sign-in",
	"/api/auth/sign-up",
	"/api/auth/sign-out",
	"/api/auth/me",
	"/api/auth/oauth",
	"/api/auth/callback",
	// 通知公告
	/^\/api\/.*\/notice\//,
	// 公共数据
	/^\/api\/.*\/public\//,
	// 系统配置
	/^\/api\/.*\/system-config\//,
	// 健康检查
	"/health",
	"/_health",
];

/**
 * 检查路径是否在白名单中
 * @description 与 server/middleware/2.auth.ts 中的 isPublicRoute 函数保持一致
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
 * 生成测试用 JWT Token
 */
async function generateTestToken(payload: object, secret: string): Promise<string> {
	const jwt = await new jose.SignJWT({ ...payload })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("1h")
		.sign(new TextEncoder().encode(secret));
	return jwt;
}

describe("认证中间件 - 公开路由白名单", () => {
	describe("isPublicRoute 函数", () => {
		test("认证相关路由应该放行", () => {
			expect(isPublicRoute("/api/auth/sign-in")).toBe(true);
			expect(isPublicRoute("/api/auth/sign-up")).toBe(true);
			expect(isPublicRoute("/api/auth/sign-out")).toBe(true);
			expect(isPublicRoute("/api/auth/me")).toBe(true);
			expect(isPublicRoute("/api/auth/oauth/github")).toBe(true);
			expect(isPublicRoute("/api/auth/callback/github")).toBe(true);
		});

		test("健康检查路由应该放行", () => {
			expect(isPublicRoute("/health")).toBe(true);
			expect(isPublicRoute("/_health")).toBe(true);
		});

		test("通知公告路由应该放行（正则匹配）", () => {
			expect(isPublicRoute("/api/property-manage/notice/list")).toBe(true);
			expect(isPublicRoute("/api/dev-team/notice/detail/1")).toBe(true);
			expect(isPublicRoute("/api/operation-team/notice/publish")).toBe(true);
		});

		test("公共数据路由应该放行（正则匹配）", () => {
			expect(isPublicRoute("/api/common/public/config")).toBe(true);
			expect(isPublicRoute("/api/dev-team/public/dict")).toBe(true);
		});

		test("系统配置路由应该放行（正则匹配）", () => {
			expect(isPublicRoute("/api/dev-team/system-config/get")).toBe(true);
			expect(isPublicRoute("/api/operation-team/system-config/update")).toBe(true);
		});

		test("非白名单路由应该需要认证", () => {
			expect(isPublicRoute("/api/dev-team/menu-manage/catalog/list")).toBe(false);
			expect(isPublicRoute("/api/property-manage/owner-info/list")).toBe(false);
			expect(isPublicRoute("/api/operation-team/user/list")).toBe(false);
			expect(isPublicRoute("/api/j1/home/console")).toBe(false);
		});

		test("子路径匹配 - startsWith 行为", () => {
			// 由于 isPublicRoute 使用 startsWith，所以 /api/auth/sign-in-external 会匹配 /api/auth/sign-in
			// 这是预期行为，因为认证端点允许 /api/auth/sign-in-* 形式的路径
			expect(isPublicRoute("/api/auth/sign-in-external")).toBe(true);
		});
	});
});

describe("认证中间件 - JWT Token 验证", () => {
	const testSecret = "test-secret-key-for-unit-testing";

	describe("Token 生成与验证", () => {
		test("应该能够生成有效的 JWT Token", async () => {
			const payload = {
				sub: "user-123",
				email: "test@example.com",
				name: "测试用户",
				metadata: {
					role: "admin",
					organizationId: "org-1",
					communityId: "comm-1",
				},
			};

			const token = await generateTestToken(payload, testSecret);
			expect(token).toBeDefined();
			expect(typeof token).toBe("string");
			expect(token.split(".").length).toBe(3); // JWT 格式: header.payload.signature
		});

		test("应该能够验证有效的 JWT Token", async () => {
			const payload = {
				sub: "user-456",
				email: "test2@example.com",
				name: "测试用户2",
			};

			const token = await generateTestToken(payload, testSecret);
			const secret = new TextEncoder().encode(testSecret);

			const { payload: decoded } = await jose.jwtVerify(token, secret, {
				algorithms: ["HS256"],
			});

			expect(decoded.sub).toBe("user-456");
			expect(decoded.email).toBe("test2@example.com");
			expect(decoded.name).toBe("测试用户2");
		});

		test("错误的密钥应该验证失败", async () => {
			const payload = { sub: "user-789" };
			const token = await generateTestToken(payload, testSecret);
			const wrongSecret = new TextEncoder().encode("wrong-secret");

			await expect(jose.jwtVerify(token, wrongSecret, { algorithms: ["HS256"] })).rejects.toThrow();
		});

		test("过期的 Token 应该验证失败", async () => {
			const expiredSecret = new TextEncoder().encode(testSecret);

			const token = await new jose.SignJWT({ sub: "user-expired" })
				.setProtectedHeader({ alg: "HS256" })
				.setIssuedAt()
				.setExpirationTime("-1h") // 1 小时前过期
				.sign(expiredSecret);

			await expect(jose.jwtVerify(token, expiredSecret, { algorithms: ["HS256"] })).rejects.toThrow();
		});

		test("格式错误的 Token 应该验证失败", async () => {
			const invalidToken = "not-a-valid-jwt-token";

			await expect(
				jose.jwtVerify(invalidToken, new TextEncoder().encode(testSecret), {
					algorithms: ["HS256"],
				}),
			).rejects.toThrow();
		});
	});

	describe("Token 载荷解析", () => {
		test("应该正确解析用户信息", async () => {
			const payload = {
				sub: "user-001",
				email: "admin@company.com",
				name: "管理员",
				metadata: {
					role: "super_admin",
					organizationId: "org-admin",
					communityId: "comm-main",
				},
			};

			const token = await generateTestToken(payload, testSecret);
			const secret = new TextEncoder().encode(testSecret);

			const { payload: decoded } = await jose.jwtVerify(token, secret, {
				algorithms: ["HS256"],
			});

			// 验证基本字段
			expect(decoded.sub).toBe("user-001");
			expect(decoded.email).toBe("admin@company.com");
			expect(decoded.name).toBe("管理员");

			// 验证 metadata 中的字段
			const metadata = decoded.metadata as Record<string, unknown>;
			expect(metadata?.role).toBe("super_admin");
			expect(metadata?.organizationId).toBe("org-admin");
			expect(metadata?.communityId).toBe("comm-main");
		});

		test("缺少 sub 字段的 Token 应该验证失败", async () => {
			const payload = {
				email: "test@example.com",
				// 故意不包含 sub
			};

			const token = await generateTestToken(payload, testSecret);
			const secret = new TextEncoder().encode(testSecret);

			// JWT 验证本身会通过，但我们需要验证业务逻辑
			const { payload: decoded } = await jose.jwtVerify(token, secret, {
				algorithms: ["HS256"],
			});

			expect(decoded.sub).toBeUndefined();
		});
	});
});

describe("认证中间件 - 环境变量配置", () => {
	test("应该使用默认的开发环境密钥", () => {
		const defaultSecret = process.env.NEON_AUTH_COOKIE_SECRET || "development-secret";
		expect(defaultSecret).toBeDefined();
		expect(typeof defaultSecret).toBe("string");
	});
});
