import { describe, expect, test } from "vitest";

import {
	buildLegacyAppFallbackUrl,
	isLegacyAppFallbackPath,
	proxyLegacyAppRequest,
} from "../../server/shared/runtime/legacy-fallback";

describe("legacy app fallback proxy", () => {
	test("only accepts app legacy and callComponent paths", () => {
		expect(isLegacyAppFallbackPath("/app/floor.queryFloors")).toBe(true);
		expect(isLegacyAppFallbackPath("/callComponent/core/list")).toBe(true);
		expect(isLegacyAppFallbackPath("/api/property-manage/expense-manage/house-charge/list")).toBe(false);
	});

	test("builds fallback URLs with query params preserved", () => {
		expect(
			buildLegacyAppFallbackUrl("https://01s-11-app-server.ruan-cat.com", "/app/floor.queryFloors", {
				communityId: "COMM_001",
				page: 1,
				row: 5,
			}),
		).toBe("https://01s-11-app-server.ruan-cat.com/app/floor.queryFloors?communityId=COMM_001&page=1&row=5");
	});

	test("proxies JSON requests and returns parsed legacy payloads", async () => {
		const response = await proxyLegacyAppRequest(
			{
				method: "POST",
				path: "/callComponent/core/list",
				query: { name: "pay_fee_config", type: "fee_type_cd" },
				body: { active: true },
			},
			{
				baseUrl: "https://legacy.example.com",
				fetchImpl: async (url, init) =>
					new Response(
						JSON.stringify({
							code: "0",
							message: "ok",
							data: {
								url: String(url),
								method: init?.method,
								body: init?.body,
							},
						}),
						{
							status: 200,
							headers: { "content-type": "application/json;charset=UTF-8" },
						},
					),
			},
		);

		expect(response).toMatchObject({
			status: 200,
			body: {
				code: "0",
				message: "ok",
				data: {
					url: "https://legacy.example.com/callComponent/core/list?name=pay_fee_config&type=fee_type_cd",
					method: "POST",
					body: '{"active":true}',
				},
			},
		});
	});
});
