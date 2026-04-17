import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

function readPackageJson() {
	return JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8")) as {
		scripts: Record<string, string>;
	};
}

function readBumpConfig() {
	return readFileSync(resolve(process.cwd(), "bump.config.ts"), "utf8");
}

describe("bumpp 根发版推送策略", () => {
	test("release:root 在命令行里显式关闭 push", () => {
		expect(readPackageJson().scripts["release:root"]).toBe("bumpp --no-push --yes --release patch");
	});

	test("release:bumpp 在命令行里显式开启 push", () => {
		expect(readPackageJson().scripts["release:bumpp"]).toBe("bumpp --push");
	});

	test("bump.config.ts 不再写死 push 配置", () => {
		const text = readBumpConfig();

		expect(text).toContain("bump.config.ts 可能单独使用，也可能被串行命令复用");
		expect(text).toContain("因此 push 策略需要在命令行里通过 --push / --no-push 显式控制");
		expect(text).toMatch(/^\s*\/\/\s*push:\s*false,\s*$/m);
		expect(text).not.toMatch(/^\s*push:\s*/m);
	});
});
