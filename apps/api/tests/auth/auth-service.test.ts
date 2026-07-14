import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { describe, expect, test } from "vitest";

import { createAuthService, validateWechatLoginInput } from "../../server/modules/auth/auth-service";
import { createScopedAuth, requireScopedAuth } from "../../server/modules/auth/scoped-auth";
import { createTokenService } from "../../server/modules/auth/token-service";
import { createWechatCode2SessionClient } from "../../server/modules/auth/wechat-client";

describe("Nitro 微信登录与 scoped auth", () => {
	test("只接受非空字符串 code", async () => {
		expect(() => validateWechatLoginInput({})).toThrow("code");
		expect(() => validateWechatLoginInput({ code: "   " })).toThrow("code");
		expect(() => validateWechatLoginInput({ code: { code: "wx-code" } })).toThrow("code");

		const service = createAuthService({
			tokenService: createTokenService({ secret: "test-token-secret" }),
			wechatClient: {
				code2Session: async () => ({ openid: "openid-for-test" }),
			},
		});

		await expect(service.login({ code: { code: "wx-code" } } as never)).rejects.toThrow("code");
	});

	test("签发 token 并将验证后的 actor 写入显式鉴权上下文", async () => {
		const tokenService = createTokenService({ secret: "test-token-secret" });
		const tokens = await tokenService.issue({
			actorId: "actor_123",
			role: "wechat-user",
			tenantId: "default",
			openidHash: "openidhash",
		});

		expect(tokens.accessToken).not.toContain("openid-for-test");
		await expect(tokenService.verify(tokens.accessToken, "access")).resolves.toMatchObject({
			actorId: "actor_123",
			tokenType: "access",
		});
		const refreshed = await tokenService.verify(tokens.refreshToken, "refresh").then((payload) => tokenService.issue(payload));
		await expect(tokenService.verify(refreshed.accessToken, "access")).resolves.toMatchObject({
			tokenType: "access",
		});

		const event = {
			node: { req: { headers: { authorization: `Bearer ${tokens.accessToken}` } } },
			context: {},
		};
		const auth = await createScopedAuth(tokenService).require(event as never);

		expect(auth).toMatchObject({ actorId: "actor_123", role: "wechat-user", tenantId: "default" });
		expect(event.context).toMatchObject({ actor: { actorId: "actor_123" } });
	});

	test("requireScopedAuth 保持显式调用且不会注册全局 auth middleware", async () => {
		expect(requireScopedAuth).toBeTypeOf("function");

		const nitroConfigPath = fileURLToPath(new URL("../../nitro.config.ts", import.meta.url));
		const nitroConfig = await readFile(nitroConfigPath, "utf8");

		expect(nitroConfig).toMatch(/scoped auth/i);
		expect(nitroConfig).not.toContain("server/middleware/auth");
	});

	test("code2Session 错误码映射为脱敏错误", async () => {
		const client = createWechatCode2SessionClient({
			appId: "wx-app-id",
			secret: "wechat-secret-value",
			fetchImpl: async () =>
				new Response(JSON.stringify({ errcode: 40029, errmsg: "invalid code, hints: secret=wechat-secret-value" }), {
					status: 200,
					headers: { "content-type": "application/json" },
				}),
		});

		await expect(client.code2Session("expired-code")).rejects.toThrow("微信登录凭证无效或已过期");
		await expect(client.code2Session("expired-code")).rejects.not.toThrow("wechat-secret-value");
	});
});
