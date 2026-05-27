import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test, vi } from "vitest";

const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const workspaceRoot = path.resolve(apiRoot, "../..");
const drizzleEnvKeys = [
	"comm_admin_11__DATABASE_URL",
	"NITRO_DATABASE_URL",
	"DATABASE_URL",
	"POSTGRES_URL",
	"POSTGRES_PRISMA_URL",
	"VERCEL_POSTGRES_URL",
] as const;

async function importFreshDrizzleConfig() {
	vi.resetModules();
	return import("../../drizzle.config.ts");
}

async function withoutDatabaseEnv<T>(callback: () => Promise<T> | T): Promise<T> {
	const previous = new Map<string, string | undefined>();

	for (const key of drizzleEnvKeys) {
		previous.set(key, process.env[key]);
		delete process.env[key];
	}

	try {
		return await callback();
	} finally {
		for (const key of drizzleEnvKeys) {
			const value = previous.get(key);
			if (value === undefined) {
				delete process.env[key];
			} else {
				process.env[key] = value;
			}
		}
	}
}

describe("api drizzle kit configuration", () => {
	test("fails closed when no database url env is configured", async () => {
		await withoutDatabaseEnv(async () => {
			await expect(importFreshDrizzleConfig()).rejects.toThrow("Missing database URL for apps/api Drizzle Kit");
		});
	});

	test("uses the runtime database url priority and points schema to apps/type", async () => {
		await withoutDatabaseEnv(async () => {
			process.env.POSTGRES_URL = "postgres://lower-priority.example.test/db";
			process.env.NITRO_DATABASE_URL = "postgres://nitro.example.test/db";
			process.env.comm_admin_11__DATABASE_URL = "postgres://primary.example.test/db";

			const module = await importFreshDrizzleConfig();
			const config = module.default as {
				schema: string[];
				out: string;
				dialect: string;
				dbCredentials: { url: string };
			};

			expect(module.drizzleDatabaseUrlKeys).toEqual([...drizzleEnvKeys]);
			expect(module.resolveDrizzleDatabaseUrl()).toBe("postgres://primary.example.test/db");
			expect(config.schema).toEqual([
				"../../apps/type/src/common/enums.ts",
				"../../apps/type/src/business/**/schema.ts",
			]);
			expect(config.out).toBe("./drizzle");
			expect(config.dialect).toBe("postgresql");
			expect(config.dbCredentials.url).toBe("postgres://primary.example.test/db");
		});
	});

	test("keeps admin migration history intact under apps/api", () => {
		const expectedFiles = [
			"0000_fearless_shinko_yamashiro.sql",
			"0001_bright_thaddeus_ross.sql",
			"meta/0000_snapshot.json",
			"meta/0001_snapshot.json",
			"meta/_journal.json",
		];

		for (const relativePath of expectedFiles) {
			const apiFile = path.join(apiRoot, "drizzle", relativePath);
			const adminFile = path.join(workspaceRoot, "apps/admin/drizzle", relativePath);

			expect(readFileSync(apiFile, "utf8")).toBe(readFileSync(adminFile, "utf8"));
		}

		const journal = JSON.parse(readFileSync(path.join(apiRoot, "drizzle/meta/_journal.json"), "utf8")) as {
			entries: { idx: number; tag: string; version: string }[];
		};

		expect(journal.entries).toEqual([
			{
				idx: 0,
				version: "7",
				tag: "0000_fearless_shinko_yamashiro",
				when: expect.any(Number),
				breakpoints: true,
			},
			{
				idx: 1,
				version: "7",
				tag: "0001_bright_thaddeus_ross",
				when: expect.any(Number),
				breakpoints: true,
			},
		]);
	});

	test("exposes db scripts through package-local dependencies", () => {
		const packageJson = JSON.parse(readFileSync(path.join(apiRoot, "package.json"), "utf8")) as {
			scripts: Record<string, string>;
			devDependencies?: Record<string, string>;
		};

		expect(packageJson.devDependencies?.["drizzle-kit"]).toBeDefined();
		expect(packageJson.scripts).toMatchObject({
			"db:generate": "drizzle-kit generate",
			"db:migrate": "drizzle-kit migrate",
			"db:push": "drizzle-kit push",
			"db:studio": "drizzle-kit studio",
		});
	});
});
