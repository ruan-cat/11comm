import { createHash } from "node:crypto";
import { afterEach, beforeEach, expect, test, describe } from "vitest";

import envHandler from "../../server/routes/__nitro/env.get";

describe("api env endpoint", () => {
	const snapshot = {
		API_VISIBLE_SECRET: process.env.API_VISIBLE_SECRET,
		API_EMPTY_VALUE: process.env.API_EMPTY_VALUE,
	};

	beforeEach(() => {
		delete process.env.API_VISIBLE_SECRET;
		delete process.env.API_EMPTY_VALUE;
	});

	afterEach(() => {
		restoreEnv("API_VISIBLE_SECRET", snapshot.API_VISIBLE_SECRET);
		restoreEnv("API_EMPTY_VALUE", snapshot.API_EMPTY_VALUE);
	});

	test("reports masked entries from process.env and cloudflare runtime env", async () => {
		process.env.API_VISIBLE_SECRET = "process-secret";
		process.env.API_EMPTY_VALUE = "";

		const response = await envHandler({
			context: {},
			req: {
				runtime: {
					cloudflare: {
						env: {
							CF_VISIBLE_SECRET: "cloudflare-secret",
						},
					},
				},
			},
			res: { headers: new Headers() },
		} as any);

		expect(response).toMatchObject({
			success: true,
			service: "@01s-11comm/api",
			phase: "phase3-infra",
			data: {
				sources: {
					"process.env": {
						keyCount: expect.any(Number),
						keys: expect.arrayContaining(["API_VISIBLE_SECRET", "API_EMPTY_VALUE"]),
						entries: {
							API_VISIBLE_SECRET: {
								kind: "string",
								length: "process-secret".length,
								hash: sha256("process-secret"),
							},
							API_EMPTY_VALUE: {
								kind: "string",
								length: 0,
								hash: sha256(""),
							},
						},
					},
					"req.runtime.cloudflare.env": {
						keyCount: expect.any(Number),
						keys: expect.arrayContaining(["CF_VISIBLE_SECRET"]),
						entries: {
							CF_VISIBLE_SECRET: {
								kind: "string",
								length: "cloudflare-secret".length,
								hash: sha256("cloudflare-secret"),
							},
						},
					},
				},
			},
		});

		const serialized = JSON.stringify(response);
		expect(serialized).not.toContain("process-secret");
		expect(serialized).not.toContain("cloudflare-secret");
	});
});

function restoreEnv(name: string, value: string | undefined): void {
	if (value === undefined) {
		delete process.env[name];
		return;
	}

	process.env[name] = value;
}

function sha256(value: string): string {
	return createHash("sha256").update(value).digest("hex");
}
