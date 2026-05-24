import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

describe("visit legacy endpoints phase7 readonly slice", () => {
	const registry = createEndpointRegistry(runtimeEndpointDefinitions);

	test("registers only readonly exact handlers", () => {
		expect(findEndpointDefinition(registry, "GET", "/app/visit.getVisit")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/visit.getVisit")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/visit.getVisitDetail")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/visit.getVisitDetail")).toBeTruthy();

		expect(findEndpointDefinition(registry, "POST", "/app/visit.auditVisit")).toBeUndefined();
	});

	test("serves visit list through the unified app legacy envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/visit.getVisit",
			query: { page: 1, row: 2, communityId: "COMM_001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				pageSize: 2,
				hasMore: expect.any(Boolean),
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response.data.list[0]).toMatchObject({
			visitId: expect.any(String),
			name: expect.any(String),
			phoneNumber: expect.any(String),
			ownerName: expect.any(String),
			roomName: expect.any(String),
			state: expect.any(String),
			stateName: expect.any(String),
			taskId: expect.any(String),
		});
	});

	test("supports state and visitId filters on the list endpoint", async () => {
		const stateFiltered = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/visit.getVisit",
			query: { page: 1, row: 10, state: "0" },
		});

		expect(stateFiltered).toMatchObject({
			code: 0,
			data: {
				total: expect.any(Number),
			},
		});
		expect(stateFiltered.data.list.length).toBeGreaterThan(0);
		for (const item of stateFiltered.data.list) {
			expect(item.state).toBe("0");
		}

		const visitId = stateFiltered.data.list[0].visitId;
		const exact = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/visit.getVisit",
			query: { visitId },
		});
		expect(exact).toMatchObject({
			code: 0,
			data: {
				total: 1,
				list: [expect.objectContaining({ visitId })],
			},
		});
	});

	test("lets POST body override query parameters like other legacy adapters", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/visit.getVisit",
			query: { row: 10, state: "1" },
			body: { row: 1, state: "0" },
		});

		expect(response).toMatchObject({
			code: 0,
			data: {
				pageSize: 1,
				total: expect.any(Number),
			},
		});
		expect(response.data.list).toHaveLength(1);
		expect(response.data.list[0].state).toBe("0");
	});

	test("serves visit detail list and keeps missing or unknown ids as empty pagination", async () => {
		const detail = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/visit.getVisitDetail",
			query: { page: 1, row: 1, visitId: "VISIT_00001" },
		});

		expect(detail).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: [
					expect.objectContaining({
						visitId: "VISIT_00001",
						departureTime: expect.any(String),
						visitCase: expect.any(String),
					}),
				],
				total: 1,
				page: 1,
				pageSize: 1,
				hasMore: false,
			},
		});
		expect(detail).not.toHaveProperty("success");

		for (const query of [{}, { visitId: "VISIT_UNKNOWN" }]) {
			const empty = await dispatchEndpoint(registry, {
				method: "GET",
				path: "/app/visit.getVisitDetail",
				query,
			});
			expect(empty).toMatchObject({
				code: 0,
				data: {
					list: [],
					total: 0,
				},
			});
		}
	});
});
