import type { H3Event } from "nitro/h3";
import {
	resolveCloudflareRuntimeEnv,
	resolveNitroRuntimeConfig,
	resolveProcessEnv,
	type RuntimeEnvRecord,
} from "../../shared/runtime/env";
import {
	DEFAULT_ACCESS_TOKEN_TTL_SECONDS,
	DEFAULT_REFRESH_TOKEN_TTL_SECONDS,
} from "./types";

interface AuthRuntimeConfigSource {
	wechat?: {
		appId?: unknown;
		secret?: unknown;
	};
	auth?: {
		tokenSecret?: unknown;
		accessTokenTtlSeconds?: unknown;
		refreshTokenTtlSeconds?: unknown;
	};
}

export interface AuthRuntimeConfig {
	wechatAppId?: string;
	wechatSecret?: string;
	tokenSecret?: string;
	accessTokenTtlSeconds: number;
	refreshTokenTtlSeconds: number;
}

export function resolveAuthRuntimeConfig(event: H3Event | Record<string, unknown>): AuthRuntimeConfig {
	const cloudflareEnv = resolveCloudflareRuntimeEnv(event);
	const processEnv = resolveProcessEnv();
	const runtimeConfig = resolveNitroRuntimeConfig() as AuthRuntimeConfigSource;

	return {
		wechatAppId:
			firstConfiguredValue(cloudflareEnv, processEnv, ["WECHAT_MP_APPID", "WECHAT_MP_APP_ID"]) ||
			normalizeOptionalString(runtimeConfig.wechat?.appId),
		wechatSecret:
			firstConfiguredValue(cloudflareEnv, processEnv, ["WECHAT_MP_SECRET", "WECHAT_APP_SECRET"]) ||
			normalizeOptionalString(runtimeConfig.wechat?.secret),
		tokenSecret:
			firstConfiguredValue(cloudflareEnv, processEnv, ["AUTH_TOKEN_SECRET", "NITRO_AUTH_TOKEN_SECRET"]) ||
			normalizeOptionalString(runtimeConfig.auth?.tokenSecret),
		accessTokenTtlSeconds: parsePositiveInteger(
			firstConfiguredValue(cloudflareEnv, processEnv, ["AUTH_ACCESS_TOKEN_TTL_SECONDS"]) ||
				runtimeConfig.auth?.accessTokenTtlSeconds,
			DEFAULT_ACCESS_TOKEN_TTL_SECONDS,
		),
		refreshTokenTtlSeconds: parsePositiveInteger(
			firstConfiguredValue(cloudflareEnv, processEnv, ["AUTH_REFRESH_TOKEN_TTL_SECONDS"]) ||
				runtimeConfig.auth?.refreshTokenTtlSeconds,
			DEFAULT_REFRESH_TOKEN_TTL_SECONDS,
		),
	};
}

function firstConfiguredValue(
	cloudflareEnv: RuntimeEnvRecord | undefined,
	processEnv: RuntimeEnvRecord,
	keys: readonly string[],
): string | undefined {
	for (const source of [cloudflareEnv, processEnv]) {
		if (!source) {
			continue;
		}

		for (const key of keys) {
			const value = normalizeOptionalString(source[key]);
			if (value) {
				return value;
			}
		}
	}
}

function parsePositiveInteger(value: unknown, fallback: number): number {
	const parsed = Number.parseInt(String(value || ""), 10);
	return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeOptionalString(value: unknown): string | undefined {
	const normalized = String(value || "").trim();
	return normalized || undefined;
}
