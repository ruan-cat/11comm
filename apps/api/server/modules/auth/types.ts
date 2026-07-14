export const AUTH_DEFAULT_ROLE = "wechat-user";
export const AUTH_DEFAULT_TENANT_ID = "default";
export const DEFAULT_ACCESS_TOKEN_TTL_SECONDS = 60 * 60;
export const DEFAULT_REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;

export type AuthTokenType = "access" | "refresh";

export interface AuthActor {
	actorId: string;
	role: string;
	tenantId: string;
	openidHash: string;
}

export interface AuthTokenPayload extends AuthActor {
	version: 1;
	tokenType: AuthTokenType;
	iat: number;
	exp: number;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
	accessExpiresIn: number;
	refreshExpiresIn: number;
}

export interface WechatCode2SessionResult {
	openid: string;
	unionid?: string;
}
