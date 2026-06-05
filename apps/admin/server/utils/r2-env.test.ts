import { beforeEach, describe, expect, test, vi } from "vitest";

describe("getR2EnvRequired", () => {
	beforeEach(() => {
		vi.unstubAllEnvs();
		vi.resetModules();
		vi.stubEnv("R2_BUCKET", "");
	});

	test("missing key throws readable error", async () => {
		const { getR2EnvRequired } = await import("./r2-env");

		expect(() => getR2EnvRequired("R2_BUCKET")).toThrow(/R2_BUCKET/);
	});

	test("reads explicitly configured runtime env", async () => {
		vi.stubEnv("R2_BUCKET", "01s-11comm-files");

		const { getR2EnvRequired } = await import("./r2-env");

		expect(getR2EnvRequired("R2_BUCKET")).toBe("01s-11comm-files");
	});
});
