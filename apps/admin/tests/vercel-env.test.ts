import { config } from "@dotenvx/dotenvx";
import { describe, expect, test, beforeAll } from "vitest";

describe("Vercel Neon 环境变量配置", () => {
	beforeAll(() => {
		/** 加载项目级别环境变量 */
		config({ path: ".env" });
		/** 加载从 Vercel 拉取的环境变量 */
		config({ path: ".env.vercel.local" });
	});

	test("能够读取 VERCEL_ENV_PREFIX 前缀环境变量", () => {
		const prefix = process.env.VERCEL_ENV_PREFIX;

		expect(prefix).toBeDefined();
		expect(prefix).toBe("comm_admin_11_");
	});

	test("能够读取带前缀的 PGDATABASE 环境变量", () => {
		const prefix = process.env.VERCEL_ENV_PREFIX;
		const pgDatabaseEnvName = `${prefix}_PGDATABASE`;
		const pgDatabase = process.env[pgDatabaseEnvName];

		expect(pgDatabase).toBeDefined();
		expect(pgDatabase).toBe("neondb");
	});

	test("前缀环境变量不为空字符串", () => {
		const prefix = process.env.VERCEL_ENV_PREFIX;

		expect(prefix).toBeDefined();
		expect(prefix!.length).toBeGreaterThan(0);
	});
});
