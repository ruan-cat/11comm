import { AuthError } from "./errors";
import type { WechatCode2SessionResult } from "./types";

export interface WechatCode2SessionClient {
	code2Session(code: string): Promise<WechatCode2SessionResult>;
}

export interface CreateWechatCode2SessionClientOptions {
	appId?: string;
	secret?: string;
	fetchImpl?: typeof fetch;
}

export function createWechatCode2SessionClient(
	options: CreateWechatCode2SessionClientOptions,
): WechatCode2SessionClient {
	const fetchImpl = options.fetchImpl || globalThis.fetch;

	return {
		async code2Session(code) {
			if (!options.appId || !options.secret) {
				throw new AuthError("微信登录服务未配置", 500);
			}
			if (typeof fetchImpl !== "function") {
				throw new AuthError("当前运行时不支持微信登录请求", 500);
			}

			const requestUrl = new URL("https://api.weixin.qq.com/sns/jscode2session");
			requestUrl.search = new URLSearchParams({
				appid: options.appId,
				secret: options.secret,
				js_code: code,
				grant_type: "authorization_code",
			}).toString();

			let response: Response;
			try {
				response = await fetchImpl(requestUrl);
			} catch {
				throw new AuthError("微信登录服务暂不可用", 502);
			}

			if (!response.ok) {
				throw new AuthError("微信登录校验失败", 401);
			}

				const payload = (await response.json()) as Record<string, unknown>;
				const errcode = Number(payload.errcode || 0);
				if (errcode !== 0) {
					throw createCode2SessionError(errcode);
				}

				const openid = typeof payload.openid === "string" ? payload.openid.trim() : "";
				if (!openid) {
					throw new AuthError("微信登录校验失败", 401);
				}

			return {
				openid,
				unionid: typeof payload.unionid === "string" ? payload.unionid : undefined,
			};
		},
		};
	}

function createCode2SessionError(errcode: number): AuthError {
	if (errcode === -1) {
		return new AuthError("微信登录服务繁忙，请稍后重试", 502);
	}
	if (errcode === 40029) {
		return new AuthError("微信登录凭证无效或已过期", 401);
	}
	if (errcode === 40163) {
		return new AuthError("微信登录凭证已使用，请重新登录", 401);
	}
	if (errcode === 45011) {
		return new AuthError("微信登录请求过于频繁，请稍后重试", 429);
	}

	return new AuthError(`微信登录校验失败（错误码：${errcode}）`, 401);
}
