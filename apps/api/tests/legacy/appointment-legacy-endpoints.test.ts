import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const listUrl = "/app/communitySpace.listCommunitySpaceConfirmOrder";
const saveUrl = "/app/communitySpace.saveCommunitySpaceConfirmOrder";

describe("appointment legacy endpoints phase7 readonly and guarded slice", () => {
	const registry = createEndpointRegistry(runtimeEndpointDefinitions);

	test("registers appointment list and guarded save exact handlers", () => {
		expect(findEndpointDefinition(registry, "GET", listUrl)).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", listUrl)).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", saveUrl)).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", saveUrl)).toBeUndefined();
	});

	test("serves appointment list through the unified app legacy envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: listUrl,
			query: { page: 1, row: 5, communityId: "COMM_001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				pageSize: 5,
				hasMore: expect.any(Boolean),
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response.data.list.length).toBeGreaterThan(0);
		expect(response.data.list[0]).toMatchObject({
			orderId: expect.stringMatching(/^ORDER_/),
			timeId: expect.stringMatching(/^HEXIAO_/),
			spaceName: expect.any(String),
			appointmentDate: expect.any(String),
			hours: expect.any(String),
			personName: expect.any(String),
			personTel: expect.any(String),
			createTime: expect.any(String),
			state: expect.stringMatching(/^(WAIT_CONFIRM|CONFIRMED)$/),
		});
	});

	test("supports timeId filtering and empty result behavior", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: listUrl,
			query: { page: 1, row: 10, communityId: "COMM_001", timeId: "HEXIAO_100001" },
		});

		expect(response).toMatchObject({
			code: 0,
			data: {
				list: [expect.objectContaining({ timeId: "HEXIAO_100001" })],
				total: 1,
				page: 1,
				pageSize: 10,
			},
		});

		const missing = await dispatchEndpoint(registry, {
			method: "GET",
			path: listUrl,
			query: { page: 1, row: 10, communityId: "COMM_001", timeId: "HEXIAO_UNKNOWN" },
		});

		expect(missing).toMatchObject({
			code: 0,
			data: {
				list: [],
				total: 0,
				page: 1,
				pageSize: 10,
				hasMore: false,
			},
		});
	});

	test("supports pagination and POST body overriding query parameters", async () => {
		const firstPage = await dispatchEndpoint(registry, {
			method: "GET",
			path: listUrl,
			query: { page: 1, row: 3, communityId: "COMM_001" },
		});
		const secondPage = await dispatchEndpoint(registry, {
			method: "GET",
			path: listUrl,
			query: { page: 2, row: 3, communityId: "COMM_001" },
		});

		expect(firstPage.data.list).toHaveLength(3);
		expect(secondPage.data.list).toHaveLength(3);
		expect(firstPage.data.list[0].orderId).not.toBe(secondPage.data.list[0].orderId);

		const postResponse = await dispatchEndpoint(registry, {
			method: "POST",
			path: listUrl,
			query: { page: 1, row: 10, timeId: "HEXIAO_100001" },
			body: { row: 1, timeId: "HEXIAO_100002" },
		});

		expect(postResponse).toMatchObject({
			code: 0,
			data: {
				list: [expect.objectContaining({ timeId: "HEXIAO_100002" })],
				total: 1,
				page: 1,
				pageSize: 1,
			},
		});
	});

	test("blocks appointment confirm writes without faking read-back rollback evidence", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: saveUrl,
			query: { timeId: "HEXIAO_QUERY", communityId: "COMM_QUERY" },
			body: { timeId: "HEXIAO_100002", communityId: "COMM_001" },
		});

		expect(response).toMatchObject({
			code: 409,
			msg: expect.stringContaining("communitySpace.saveCommunitySpaceConfirmOrder"),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");

		const listAfterGuard = await dispatchEndpoint(registry, {
			method: "GET",
			path: listUrl,
			query: { page: 1, row: 1, timeId: "HEXIAO_100002" },
		});
		expect(listAfterGuard.data.list[0]).toMatchObject({
			timeId: "HEXIAO_100002",
			state: "WAIT_CONFIRM",
		});
	});
});
