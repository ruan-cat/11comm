import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { apiSeedDatabaseUrlKeys, createSeedPlan, runSeedCli } from "../../server/db/seed/index";

const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const workspaceRoot = path.resolve(apiRoot, "../..");

describe("api seed cli", () => {
	test("exposes package-local seed scripts and keeps admin from calling legacy seed", () => {
		const apiPackageJson = readPackageJson(path.join(apiRoot, "package.json"));
		const adminPackageJson = readPackageJson(path.join(workspaceRoot, "apps/admin/package.json"));

		expect(apiPackageJson.scripts).toMatchObject({
			"db:seed:dry-run": "tsx server/db/seed/index.ts --dry-run",
			"db:seed": "tsx server/db/seed/index.ts",
		});
		expect(adminPackageJson.scripts).toMatchObject({
			"db:generate": "pnpm -F @01s-11comm/api run db:generate",
			"db:migrate": "pnpm -F @01s-11comm/api run db:migrate",
			"db:push": "pnpm -F @01s-11comm/api run db:push",
			"db:studio": "pnpm -F @01s-11comm/api run db:studio",
			"db:seed:dry-run": "pnpm -F @01s-11comm/api run db:seed:dry-run",
			"db:seed": "pnpm -F @01s-11comm/api run db:seed",
		});
		expect(adminPackageJson.scripts).not.toHaveProperty("test:nitro");
		expect(adminPackageJson.scripts).not.toHaveProperty("nitro:build:vercel");
		expect(adminPackageJson.scripts).not.toHaveProperty("db:drop");
		expect(adminPackageJson.scripts).not.toHaveProperty("db:reset");
		expect(JSON.stringify(adminPackageJson.scripts)).not.toContain("NITRO_PRESET");
		expect(JSON.stringify(adminPackageJson.scripts)).not.toContain("nitro:");
		expect(JSON.stringify(adminPackageJson.scripts)).not.toContain("db:legacy");
		expect(JSON.stringify(adminPackageJson.scripts)).not.toContain("server/db/seed");
	});

	test("creates a dry-run plan without requiring a database url", () => {
		const plan = createSeedPlan({ args: ["--dry-run"], env: {} });

		expect(plan).toMatchObject({
			mode: "dry-run",
			willWrite: false,
			databaseUrlConfigured: false,
			sourcePackage: "@01s-11comm/api",
		});
		expect(plan.message).toContain("apps/api");
	});

	test("refuses live seed without an explicit execute flag", () => {
		const plan = createSeedPlan({
			args: [],
			env: { DATABASE_URL: "postgres://seed.example.test/db" },
		});

		expect(plan).toMatchObject({
			mode: "blocked",
			willWrite: false,
			databaseUrlConfigured: true,
		});
		expect(plan.message).toContain("--execute");
	});

	test("refuses live seed without a database url", () => {
		const plan = createSeedPlan({ args: ["--execute"], env: {} });

		expect(plan).toMatchObject({
			mode: "blocked",
			willWrite: false,
			databaseUrlConfigured: false,
		});
		expect(plan.message).toContain(apiSeedDatabaseUrlKeys.join(", "));
	});

	test("runs dry-run without importing or executing admin seed code", async () => {
		const stdout: string[] = [];
		const stderr: string[] = [];

		const exitCode = await runSeedCli({
			args: ["--dry-run"],
			env: {},
			stdout: (message) => stdout.push(message),
			stderr: (message) => stderr.push(message),
		});

		const output = [...stdout, ...stderr].join("\n");

		expect(exitCode).toBe(0);
		expect(output).toContain("apps/api");
		expect(output).not.toContain("apps/admin/server/db/seed");
	});
});

function readPackageJson(filePath: string): { scripts: Record<string, string> } {
	return JSON.parse(readFileSync(filePath, "utf8")) as { scripts: Record<string, string> };
}
