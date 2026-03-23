import { describe, expect, test } from "vitest";

import { buildBootstrapInstructions, shouldCheckIndependentBootstrap } from "../scripts/relizy-runner.ts";

describe("relizy-runner", () => {
	test("仅 release 与 bump 需要检查基线 tag", () => {
		expect(shouldCheckIndependentBootstrap(["release"])).toBe(true);
		expect(shouldCheckIndependentBootstrap(["bump"])).toBe(true);
		expect(shouldCheckIndependentBootstrap(["changelog"])).toBe(false);
	});

	test("缺少基线 tag 时生成明确提示", () => {
		const instructions = buildBootstrapInstructions([
			{ name: "@01s-11comm/admin", version: "6.0.0" },
			{ name: "@01s-11comm/type", version: "1.0.0" },
		]);

		expect(instructions).toContain(
			"release:relizy detected that this repository does not have baseline package tags yet:",
		);
		expect(instructions).toContain('git tag "@01s-11comm/admin@6.0.0"');
		expect(instructions).toContain('git tag "@01s-11comm/type@1.0.0"');
		expect(instructions).toContain('git push origin "@01s-11comm/admin@6.0.0" "@01s-11comm/type@1.0.0"');
	});
});
