import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const workspaceRoot = path.resolve(apiRoot, "../..");

describe("legacy built-in nitro config retirement", () => {
	test("removes admin embedded Nitro and Drizzle authority configs", () => {
		expect(existsSync(path.join(workspaceRoot, "apps/admin/nitro.config.ts"))).toBe(false);
		expect(existsSync(path.join(workspaceRoot, "apps/admin/drizzle.config.ts"))).toBe(false);

		const adminPackageJson = readPackageJson(path.join(workspaceRoot, "apps/admin/package.json"));
		const adminBuildPlugins = readFileSync(path.join(workspaceRoot, "apps/admin/build/plugins/index.ts"), "utf8");

		expect(JSON.stringify(adminPackageJson.scripts)).not.toContain("nitro:");
		expect(JSON.stringify(adminPackageJson.scripts)).not.toContain("db:legacy");
		expect(JSON.stringify(adminPackageJson.scripts)).not.toContain("drizzle.config.ts");
		expect(adminBuildPlugins).not.toContain("nitro/vite");
		expect(adminBuildPlugins).not.toMatch(/\bnitro\s*\(/);
	});

	test("removes app embedded Nitro config while keeping orchestration aliases", () => {
		expect(existsSync(path.join(workspaceRoot, "apps/app/nitro.config.ts"))).toBe(false);

		const appPackageJson = readPackageJson(path.join(workspaceRoot, "apps/app/package.json"));
		const appScripts = appPackageJson.scripts;
		const appViteConfig = readFileSync(path.join(workspaceRoot, "apps/app/vite.config.ts"), "utf8");

		expect(appScripts).not.toHaveProperty("dev:nitro");
		expect(appScripts).not.toHaveProperty("dev:h5:nitro");
		expect(appScripts).not.toHaveProperty("dev:mp-weixin:nitro");
		expect(appScripts).not.toHaveProperty("build:nitro");
		expect(appScripts).not.toHaveProperty("build:nitro:node");
		expect(appScripts).not.toHaveProperty("build:nitro:vercel");
		expect(appScripts).not.toHaveProperty("preview:nitro");
		expect(appViteConfig).not.toContain("nitro/vite");
		expect(appViteConfig).not.toContain("serverDir");
		expect(appViteConfig).not.toMatch(/\bnitro\s*\(/);
	});
});

function readPackageJson(filePath: string): { scripts: Record<string, string> } {
	return JSON.parse(readFileSync(filePath, "utf8")) as { scripts: Record<string, string> };
}
