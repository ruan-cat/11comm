import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const activityReadonlyUrl = "/app/activities.listActivitiess";

describe("activity legacy endpoints phase7 readonly slice", () => {
	const registry = createEndpointRegistry(runtimeEndpointDefinitions);

	test("registers the activity readonly handler and guarded writes through batch25", () => {
		expect(findEndpointDefinition(registry, "GET", activityReadonlyUrl)).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", activityReadonlyUrl)).toBeTruthy();

		for (const path of [
			"/app/activities.likeActivity",
			"/app/activities.increaseView",
			"/app/activities.updateStatus",
			"/app/activities.updateLike",
			"/app/activities.updateCollect",
			"/app/activities.saveActivities",
			"/app/activities.updateActivities",
			"/app/activities.deleteActivities",
		]) {
			expect(findEndpointDefinition(registry, "POST", path)).toBeTruthy();
			expect(findEndpointDefinition(registry, "GET", path)).toBeUndefined();
		}
	});

	test("serves activity list through the unified app legacy envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: activityReadonlyUrl,
			query: { page: 1, row: 3, communityId: "COMM_001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				activitiess: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				row: 3,
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response.data.activitiess.length).toBeGreaterThan(0);
		expect(response.data.activitiess[0]).toMatchObject({
			activitiesId: expect.stringMatching(/^ACT_/),
			title: expect.any(String),
			userName: expect.any(String),
			startTime: expect.any(String),
			endTime: expect.any(String),
			context: expect.any(String),
			communityId: "COMM_001",
			status: expect.any(String),
			viewCount: expect.any(Number),
			likeCount: expect.any(Number),
			readCount: expect.any(Number),
			collectCount: expect.any(Number),
		});
	});

	test("supports activitiesId detail-style filtering and empty result behavior", async () => {
		const detail = await dispatchEndpoint(registry, {
			method: "GET",
			path: activityReadonlyUrl,
			query: { page: 1, row: 1, communityId: "COMM_001", activitiesId: "ACT_001" },
		});

		expect(detail).toMatchObject({
			code: 0,
			data: {
				activitiess: [expect.objectContaining({ activitiesId: "ACT_001" })],
				total: 1,
				page: 1,
				row: 1,
			},
		});

		const missing = await dispatchEndpoint(registry, {
			method: "GET",
			path: activityReadonlyUrl,
			query: { page: 1, row: 1, communityId: "COMM_001", activitiesId: "ACT_UNKNOWN" },
		});

		expect(missing).toMatchObject({
			code: 0,
			data: {
				activitiess: [],
				total: 0,
				page: 1,
				row: 1,
			},
		});
	});

	test("supports community, status and keyword filters", async () => {
		const communityFiltered = await dispatchEndpoint(registry, {
			method: "GET",
			path: activityReadonlyUrl,
			query: { page: 1, row: 10, communityId: "COMM_002" },
		});

		expect(communityFiltered.data.activitiess.length).toBeGreaterThan(0);
		for (const item of communityFiltered.data.activitiess) {
			expect(item.communityId).toBe("COMM_002");
		}

		const statusFiltered = await dispatchEndpoint(registry, {
			method: "GET",
			path: activityReadonlyUrl,
			query: { page: 1, row: 10, status: "ONGOING" },
		});

		expect(statusFiltered.data.activitiess.length).toBeGreaterThan(0);
		for (const item of statusFiltered.data.activitiess) {
			expect(item.status).toBe("ONGOING");
		}

		const keywordFiltered = await dispatchEndpoint(registry, {
			method: "GET",
			path: activityReadonlyUrl,
			query: { page: 1, row: 10, keyword: "Garden" },
		});

		expect(keywordFiltered.data.activitiess.length).toBeGreaterThan(0);
		for (const item of keywordFiltered.data.activitiess) {
			expect(`${item.title} ${item.context} ${item.userName}`).toContain("Garden");
		}
	});

	test("supports pagination and POST body overriding query parameters", async () => {
		const firstPage = await dispatchEndpoint(registry, {
			method: "GET",
			path: activityReadonlyUrl,
			query: { page: 1, row: 2, communityId: "COMM_001" },
		});
		const secondPage = await dispatchEndpoint(registry, {
			method: "GET",
			path: activityReadonlyUrl,
			query: { page: 2, row: 2, communityId: "COMM_001" },
		});

		expect(firstPage.data.activitiess).toHaveLength(2);
		expect(secondPage.data.activitiess).toHaveLength(2);
		expect(firstPage.data.activitiess[0].activitiesId).not.toBe(secondPage.data.activitiess[0].activitiesId);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: activityReadonlyUrl,
			query: { page: 1, row: 10, activitiesId: "ACT_001" },
			body: { row: 2, activitiesId: "ACT_002" },
		});

		expect(response).toMatchObject({
			code: 0,
			data: {
				activitiess: [expect.objectContaining({ activitiesId: "ACT_002" })],
				total: 1,
				page: 1,
				row: 2,
			},
		});
	});

	test("blocks activity guarded writes through batch25 with the legacy mutation guard envelope", async () => {
		for (const [path, action] of [
			["/app/activities.likeActivity", "activities.likeActivity"],
			["/app/activities.increaseView", "activities.increaseView"],
			["/app/activities.updateStatus", "activities.updateStatus"],
			["/app/activities.updateLike", "activities.updateLike"],
			["/app/activities.updateCollect", "activities.updateCollect"],
			["/app/activities.saveActivities", "activities.saveActivities"],
			["/app/activities.updateActivities", "activities.updateActivities"],
			["/app/activities.deleteActivities", "activities.deleteActivities"],
		] as const) {
			const response = await dispatchEndpoint(registry, {
				method: "POST",
				path,
				body: { activitiesId: "ACT_001", title: "Blocked activity mutation" },
			});

			expect(response).toMatchObject({
				code: 409,
				msg: expect.stringContaining(action),
				data: null,
				errorCode: "PHASE7_MUTATION_GUARDED",
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
			expect(response).not.toHaveProperty("timestamp");
		}
	});
});
