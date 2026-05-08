import type { H3Event } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";

export interface RuntimeConfigLike {
	databaseUrl?: string;
	public?: Record<string, unknown>;
}

export interface PublicRuntimeConfig {
	serviceName: string;
	phase: string;
	corsAllowedOrigins: string[];
	enableDetailedErrors: boolean;
	apiBasePath: string;
}

export type RuntimeEnvRecord = Record<string, string | undefined>;

export const defaultCorsAllowedOrigins = [
	"http://localhost:3000",
	"http://127.0.0.1:3000",
	"http://localhost:8080",
	"http://127.0.0.1:8080",
	"https://01s-11comm.ruan-cat.com",
	"https://01s-11-app.ruan-cat.com",
	"https://01s.11.app.ruan-cat.com",
	"https://01s-11.ruan-cat.com",
	"https://01s-11comm-app.ruan-cat.com",
	"https://01s-11comm-h5.ruan-cat.com",
];

export const defaultLegacyAppFallbackBaseUrl = "https://01s-11-app-server.ruan-cat.com";

const databaseUrlKeys = [
	"comm_admin_11__DATABASE_URL",
	"NITRO_DATABASE_URL",
	"DATABASE_URL",
	"POSTGRES_URL",
	"POSTGRES_PRISMA_URL",
	"VERCEL_POSTGRES_URL",
] as const;

export function resolveCloudflareRuntimeEnv(event: H3Event | Record<string, any>): RuntimeEnvRecord | undefined {
	return (event as any).req?.runtime?.cloudflare?.env as RuntimeEnvRecord | undefined;
}

export function resolveProcessEnv(): RuntimeEnvRecord {
	return process.env as RuntimeEnvRecord;
}

export function resolveNitroRuntimeConfig(): RuntimeConfigLike {
	try {
		return useRuntimeConfig() as RuntimeConfigLike;
	} catch {
		return {};
	}
}

export function resolveDatabaseUrlFromSources(
	event: H3Event | Record<string, any>,
	runtimeConfig: RuntimeConfigLike = resolveNitroRuntimeConfig(),
): string | undefined {
	const cloudflareEnv = resolveCloudflareRuntimeEnv(event);
	const processEnv = resolveProcessEnv();

	return (
		firstConfiguredValue(cloudflareEnv, databaseUrlKeys) ||
		firstConfiguredValue(processEnv, databaseUrlKeys) ||
		normalizeOptionalString(runtimeConfig.databaseUrl)
	);
}

export function resolvePublicRuntimeConfig(raw: RuntimeConfigLike["public"] = {}): PublicRuntimeConfig {
	return {
		serviceName: String(raw.serviceName || "@01s-11comm/api"),
		phase: String(raw.phase || "phase3-infra"),
		corsAllowedOrigins: uniqueStrings([
			...defaultCorsAllowedOrigins,
			...parseCsv(raw.corsAllowedOrigins),
			...parseCsv(process.env.NITRO_CORS_ALLOWED_ORIGINS),
			...parsePlatformOrigins(process.env.VERCEL_URL),
			...parsePlatformOrigins(process.env.CF_PAGES_URL),
		]),
		enableDetailedErrors: parseBoolean(raw.enableDetailedErrors, process.env.NODE_ENV !== "production"),
		apiBasePath: String(raw.apiBasePath || "/"),
	};
}

export function getPublicRuntimeConfig(): PublicRuntimeConfig {
	return resolvePublicRuntimeConfig(resolveNitroRuntimeConfig().public);
}

export function hasConfiguredDatabaseUrl(event: H3Event): boolean {
	return Boolean(resolveDatabaseUrlFromSources(event));
}

function firstConfiguredValue<T extends readonly string[]>(
	source: RuntimeEnvRecord | undefined,
	keys: T,
): string | undefined {
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

function parseCsv(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.flatMap(parseCsv);
	}

	return String(value || "")
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);
}

function parseBoolean(value: unknown, defaultValue: boolean): boolean {
	if (value === undefined || value === null || value === "") {
		return defaultValue;
	}

	return String(value).toLowerCase() === "true";
}

function parsePlatformOrigins(value: unknown): string[] {
	return parseCsv(value).map((origin) => (/^https?:\/\//.test(origin) ? origin : `https://${origin}`));
}

function normalizeOptionalString(value: unknown): string | undefined {
	const normalized = String(value || "").trim();
	return normalized || undefined;
}

function uniqueStrings(values: string[]): string[] {
	return [...new Set(values)];
}
