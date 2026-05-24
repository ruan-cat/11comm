import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const noticeReadonlyUrl = "/app/notice.listNotices";

describe("notice legacy endpoints phase7 readonly slice", () => {
	const registry = createEndpointRegistry(runtimeEndpointDefinitions);

	test("registers exactly the notice readonly handler", () => {
		expect(findEndpointDefinition(registry, "GET", noticeReadonlyUrl)).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", noticeReadonlyUrl)).toBeTruthy();

		const registeredNoticeUrls = runtimeEndpointDefinitions
			.map((definition) => definition.url)
			.filter((url) => url.startsWith("/app/notice."))
			.sort();
		expect(registeredNoticeUrls).toEqual([noticeReadonlyUrl]);
	});

	test("serves notice list through the unified app legacy envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: noticeReadonlyUrl,
			query: { page: 1, row: 3, communityId: "COMM_001", noticeTypeCd: "1001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				notices: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				row: 3,
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response.data.notices.length).toBeGreaterThan(0);
		expect(response.data.notices[0]).toMatchObject({
			noticeId: expect.stringMatching(/^NOTICE_/),
			title: expect.any(String),
			context: expect.any(String),
			startTime: expect.any(String),
			timeStr: expect.any(String),
			noticeTypeCd: "1001",
			communityId: "COMM_001",
		});
	});

	test("supports noticeId detail-style filtering and empty result behavior", async () => {
		const detail = await dispatchEndpoint(registry, {
			method: "GET",
			path: noticeReadonlyUrl,
			query: { page: 1, row: 1, communityId: "COMM_001", noticeId: "NOTICE_0001" },
		});

		expect(detail).toMatchObject({
			code: 0,
			data: {
				notices: [expect.objectContaining({ noticeId: "NOTICE_0001" })],
				total: 1,
				page: 1,
				row: 1,
			},
		});

		const missing = await dispatchEndpoint(registry, {
			method: "GET",
			path: noticeReadonlyUrl,
			query: { page: 1, row: 1, communityId: "COMM_001", noticeId: "NOTICE_UNKNOWN" },
		});

		expect(missing).toMatchObject({
			code: 0,
			data: {
				notices: [],
				total: 0,
				page: 1,
				row: 1,
			},
		});
	});

	test("supports notice type and title filters", async () => {
		const typeFiltered = await dispatchEndpoint(registry, {
			method: "GET",
			path: noticeReadonlyUrl,
			query: { page: 1, row: 5, communityId: "COMM_001", noticeTypeCd: "1001" },
		});

		expect(typeFiltered.data.notices.length).toBeGreaterThan(0);
		for (const item of typeFiltered.data.notices) {
			expect(item.noticeTypeCd).toBe("1001");
		}

		const titleFiltered = await dispatchEndpoint(registry, {
			method: "GET",
			path: noticeReadonlyUrl,
			query: { page: 1, row: 10, titleLike: "Maintenance" },
		});

		expect(titleFiltered.data.notices.length).toBeGreaterThan(0);
		for (const item of titleFiltered.data.notices) {
			expect(item.title).toContain("Maintenance");
		}
	});

	test("lets POST body override query parameters like other legacy adapters", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: noticeReadonlyUrl,
			query: { page: 1, row: 10, noticeId: "NOTICE_0001" },
			body: { row: 2, noticeId: "NOTICE_0002" },
		});

		expect(response).toMatchObject({
			code: 0,
			data: {
				notices: [expect.objectContaining({ noticeId: "NOTICE_0002" })],
				total: 1,
				page: 1,
				row: 2,
			},
		});
	});
});
