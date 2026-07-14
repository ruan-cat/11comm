import { AuthError } from "./errors";
import { resolveAuthRuntimeConfig } from "./runtime";
import { createTokenService, sha256Hex, type TokenService } from "./token-service";
import { AUTH_DEFAULT_ROLE, AUTH_DEFAULT_TENANT_ID, type AuthActor, type AuthTokens } from "./types";
import { createWechatCode2SessionClient, type WechatCode2SessionClient } from "./wechat-client";

export interface WechatLoginInput {
	code: string;
}

export interface AuthService {
	login(input: unknown): Promise<AuthTokens & { user: AuthActor }>;
	refresh(input: unknown): Promise<AuthTokens>;
}

export interface CreateAuthServiceOptions {
	tokenService: TokenService;
	wechatClient: WechatCode2SessionClient;
}

export function createAuthService(options: CreateAuthServiceOptions): AuthService {
	return {
		async login(input) {
			const code = validateWechatLoginInput(input);
			const session = await options.wechatClient.code2Session(code);
			const openidHash = await sha256Hex(session.openid);
			const user: AuthActor = {
				actorId: `wx_${openidHash}`,
				role: AUTH_DEFAULT_ROLE,
				tenantId: AUTH_DEFAULT_TENANT_ID,
				openidHash,
			};

			return { ...(await options.tokenService.issue(user)), user };
		},
		async refresh(input) {
			if (
				!input ||
				typeof input !== "object" ||
				typeof (input as { refreshToken?: unknown }).refreshToken !== "string" ||
				!(input as { refreshToken: string }).refreshToken.trim()
			) {
				throw new AuthError("refreshToken 必须为非空字符串", 400);
			}

			const payload = await options.tokenService.verify((input as { refreshToken: string }).refreshToken, "refresh");
			return options.tokenService.issue(payload);
		},
	};
}

export function getAuthService(event: Parameters<typeof resolveAuthRuntimeConfig>[0]): AuthService {
	const runtime = resolveAuthRuntimeConfig(event);
	return createAuthService({
		tokenService: createTokenService({
			secret: runtime.tokenSecret,
			accessTokenTtlSeconds: runtime.accessTokenTtlSeconds,
			refreshTokenTtlSeconds: runtime.refreshTokenTtlSeconds,
		}),
		wechatClient: createWechatCode2SessionClient({ appId: runtime.wechatAppId, secret: runtime.wechatSecret }),
	});
}

export function validateWechatLoginInput(input: unknown): string {
	if (!input || typeof input !== "object" || typeof (input as WechatLoginInput).code !== "string") {
		throw new AuthError("code 必须为非空字符串", 400);
	}

	const code = (input as WechatLoginInput).code.trim();
	if (!code) {
		throw new AuthError("code 必须为非空字符串", 400);
	}

	return code;
}
