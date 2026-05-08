import { test, describe } from "vitest";
import { afterEach, beforeEach, expect } from "vitest";

import {
	defaultCorsAllowedOrigins,
	resolveCloudflareRuntimeEnv,
	resolveDatabaseUrlFromSources,
	resolvePublicRuntimeConfig,
} from "../../server/shared/runtime/env";

describe("api runtime env resolver", () => {
	const snapshot = {
		comm_admin_11__DATABASE_URL: process.env.comm_admin_11__DATABASE_URL,
		DATABASE_URL: process.env.DATABASE_URL,
		NITRO_DATABASE_URL: process.env.NITRO_DATABASE_URL,
		NITRO_CORS_ALLOWED_ORIGINS: process.env.NITRO_CORS_ALLOWED_ORIGINS,
		VERCEL_URL: process.env.VERCEL_URL,
	};

	beforeEach(() => {
		delete process.env.comm_admin_11__DATABASE_URL;
		delete process.env.DATABASE_URL;
		delete process.env.NITRO_DATABASE_URL;
		delete process.env.NITRO_CORS_ALLOWED_ORIGINS;
		delete process.env.VERCEL_URL;
	});

	afterEach(() => {
		restoreEnv("comm_admin_11__DATABASE_URL", snapshot.comm_admin_11__DATABASE_URL);
		restoreEnv("DATABASE_URL", snapshot.DATABASE_URL);
		restoreEnv("NITRO_DATABASE_URL", snapshot.NITRO_DATABASE_URL);
		restoreEnv("NITRO_CORS_ALLOWED_ORIGINS", snapshot.NITRO_CORS_ALLOWED_ORIGINS);
		restoreEnv("VERCEL_URL", snapshot.VERCEL_URL);
	});

	test("uses Cloudflare Worker runtime env as the highest priority source", () => {
		const event = {
			req: {
				runtime: {
					cloudflare: {
						env: {
							comm_admin_11__DATABASE_URL: "postgresql://cf-runtime",
							DATABASE_URL: "postgresql://standard",
						},
					},
				},
			},
		};

		expect(resolveCloudflareRuntimeEnv(event as any)).toMatchObject({
			comm_admin_11__DATABASE_URL: "postgresql://cf-runtime",
		});
		expect(resolveDatabaseUrlFromSources(event as any, { databaseUrl: "postgresql://runtime" })).toBe(
			"postgresql://cf-runtime",
		);
	});

	test("uses Node and Nitro runtime config before returning undefined", () => {
		process.env.NITRO_DATABASE_URL = "postgresql://node-runtime";

		expect(resolveDatabaseUrlFromSources({} as any, { databaseUrl: "postgresql://nitro-runtime" })).toBe(
			"postgresql://node-runtime",
		);

		delete process.env.NITRO_DATABASE_URL;
		expect(resolveDatabaseUrlFromSources({} as any, { databaseUrl: "postgresql://nitro-runtime" })).toBe(
			"postgresql://nitro-runtime",
		);

		expect(resolveDatabaseUrlFromSources({} as any, {})).toBeUndefined();
	});

	test("normalizes public runtime config values from runtime config and platform env", () => {
		process.env.NITRO_CORS_ALLOWED_ORIGINS = "https://env.example.com";
		process.env.VERCEL_URL = "api.vercel.app";

		expect(
			resolvePublicRuntimeConfig({
				serviceName: "@01s-11comm/api",
				phase: "phase3-infra",
				corsAllowedOrigins: "http://localhost:5173,https://example.com",
			}),
		).toMatchObject({
			serviceName: "@01s-11comm/api",
			phase: "phase3-infra",
			corsAllowedOrigins: [
				...defaultCorsAllowedOrigins,
				"http://localhost:5173",
				"https://example.com",
				"https://env.example.com",
				"https://api.vercel.app",
			],
		});
	});
});

function restoreEnv(name: string, value: string | undefined): void {
	if (value === undefined) {
		delete process.env[name];
		return;
	}
	process.env[name] = value;
}
