import type { H3Event } from "nitro/h3";
import {
	resolveCloudflareRuntimeEnv,
	resolveNitroRuntimeConfig,
	resolveProcessEnv,
	type RuntimeEnvRecord,
} from "./env";

export const R2_ENV_KEYS = [
	"R2_ENDPOINT",
	"R2_BUCKET",
	"R2_ACCESS_KEY_ID",
	"R2_SECRET_ACCESS_KEY",
	"R2_PUBLIC_BASE_URL",
] as const;

export type R2EnvKey = (typeof R2_ENV_KEYS)[number];

export interface R2EnvReadinessResult {
	requiredKeys: R2EnvKey[];
	configured: boolean;
	missingKeys: R2EnvKey[];
}

type RuntimeConfigWithR2 = Record<string, any> & {
	r2?: Record<string, unknown>;
};

const runtimeConfigKeyMap: Record<R2EnvKey, string[]> = {
	R2_ENDPOINT: ["endpoint", "r2Endpoint"],
	R2_BUCKET: ["bucket", "r2Bucket"],
	R2_ACCESS_KEY_ID: ["accessKeyId", "r2AccessKeyId"],
	R2_SECRET_ACCESS_KEY: ["secretAccessKey", "r2SecretAccessKey"],
	R2_PUBLIC_BASE_URL: ["publicBaseUrl", "r2PublicBaseUrl"],
};

export function getR2EnvRequired(key: R2EnvKey, event?: H3Event | Record<string, any>): string {
	const value = resolveR2EnvValue(key, event);
	if (!value) {
		throw new Error(`Missing required R2 environment variable: ${key}.`);
	}
	return value;
}

export function probeR2EnvReadiness(event?: H3Event | Record<string, any>): R2EnvReadinessResult {
	const missingKeys = R2_ENV_KEYS.filter((key) => !resolveR2EnvValue(key, event));
	return {
		requiredKeys: [...R2_ENV_KEYS],
		configured: missingKeys.length === 0,
		missingKeys,
	};
}

function resolveR2EnvValue(key: R2EnvKey, event?: H3Event | Record<string, any>): string | undefined {
	return (
		firstConfiguredValue(event ? resolveCloudflareRuntimeEnv(event) : undefined, [key]) ||
		firstConfiguredValue(resolveProcessEnv(), [key]) ||
		resolveR2RuntimeConfigValue(key)
	);
}

function resolveR2RuntimeConfigValue(key: R2EnvKey): string | undefined {
	const runtimeConfig = resolveNitroRuntimeConfig() as RuntimeConfigWithR2;
	const candidates = runtimeConfigKeyMap[key];
	for (const candidate of candidates) {
		const value = normalizeOptionalString(runtimeConfig.r2?.[candidate] ?? runtimeConfig[candidate]);
		if (value) {
			return value;
		}
	}
	return undefined;
}

function firstConfiguredValue(source: RuntimeEnvRecord | undefined, keys: readonly string[]): string | undefined {
	if (!source) {
		return undefined;
	}

	for (const key of keys) {
		const value = normalizeOptionalString(source[key]);
		if (value) {
			return value;
		}
	}

	return undefined;
}

function normalizeOptionalString(value: unknown): string | undefined {
	const normalized = String(value || "").trim();
	return normalized || undefined;
}
