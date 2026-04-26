import { describe, expect, test } from "vitest";

import healthHandler from "../../server/routes/__nitro/health.get";
import indexHandler from "../../server/routes/index.get";
import { formatDateTime } from "../../server/utils/format-date";

describe("api smoke endpoints", () => {
	test("returns the api root metadata", async () => {
		const response = await indexHandler({} as any);

		expect(response).toMatchObject({
			success: true,
			service: "@01s-11comm/api",
			phase: "phase3-infra",
			health: "/__nitro/health",
			ready: "/__nitro/ready",
			endpoints: "/__nitro/endpoints",
		});
	});

	test("returns the api health status", async () => {
		const response = await healthHandler({} as any);

		expect(response).toMatchObject({
			success: true,
			service: "@01s-11comm/api",
			status: "ok",
			checks: {
				database: {
					configured: expect.any(Boolean),
				},
			},
		});
		expect(response.timestamp).toEqual(expect.any(String));
	});

	test("formats date values for adapters", () => {
		const formatted = formatDateTime(new Date("2026-04-25T00:00:00.000Z"));

		expect(formatted).toEqual(expect.any(String));
		expect(formatted.length).toBeGreaterThan(0);
		expect(formatDateTime("not-a-date")).toBe("not-a-date");
	});
});
