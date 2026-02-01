import { config } from "@dotenvx/dotenvx";
import { describe, expect, test } from "vitest";

describe("Vercel 环境变量配置", () => {
	test("能够正常读取 .env.vercel 文件中的环境变量", () => {
		/** 加载 Vercel 项目配置环境变量 */
		config({ path: ".env.vercel" });

		const vercelProjectName = process.env.VERCEL_PROJECT_NAME;
		const vercelOrgId = process.env.VERCEL_ORG_ID;
		const vercelProjectId = process.env.VERCEL_PROJECT_ID;

		expect(vercelProjectName).toBeDefined();
		expect(vercelProjectName).toBe("01s-vercel");

		expect(vercelOrgId).toBeDefined();
		expect(vercelOrgId).toBe("team_cUeGw4TtOCLp0bbuH8kA7BYH");

		expect(vercelProjectId).toBeDefined();
		expect(vercelProjectId).toBe("prj_0dbaKzhoqP9C3A7C4QDkzjSprN2L");
	});

	test("三个环境变量值不为空字符串", () => {
		config({ path: ".env.vercel" });

		const vercelProjectName = process.env.VERCEL_PROJECT_NAME;
		const vercelOrgId = process.env.VERCEL_ORG_ID;
		const vercelProjectId = process.env.VERCEL_PROJECT_ID;

		expect(vercelProjectName!.length).toBeGreaterThan(0);
		expect(vercelOrgId!.length).toBeGreaterThan(0);
		expect(vercelProjectId!.length).toBeGreaterThan(0);
	});
});
