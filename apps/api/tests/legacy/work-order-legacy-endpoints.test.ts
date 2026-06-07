import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const guardedWriteEndpoints = [
	["/app/workorder/create", "create"],
	["/app/workorder/update", "update"],
	["/app/workorder/start", "start"],
	["/app/workorder/complete", "complete"],
	["/app/workorder/audit", "audit"],
	["/app/workorder/cancel", "cancel"],
	["/app/workorder/copy/finish", "copy/finish"],
] as const;

describe("work-order legacy endpoints phase7 readonly and guarded write slice", () => {
	const registry = createEndpointRegistry(runtimeEndpointDefinitions);

	test("registers readonly exact handlers and guarded write POST handlers", () => {
		expect(findEndpointDefinition(registry, "GET", "/app/workorder/todo/list")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/workorder/todo/list")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/workorder/detail")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/workorder/detail")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/workorder/copy/list")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/workorder/copy/list")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/workorder/task/list")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/workorder/task/list")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/workorder/task/items")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/workorder/task/items")).toBeTruthy();

		for (const [path] of guardedWriteEndpoints) {
			expect(findEndpointDefinition(registry, "POST", path)).toBeTruthy();
			expect(findEndpointDefinition(registry, "GET", path)).toBeUndefined();
		}
	});

	test.each(guardedWriteEndpoints)(
		"blocks %s by default with the legacy guarded mutation envelope",
		async (path, action) => {
			const response = await dispatchEndpoint(registry, {
				method: "POST",
				path,
				body: { workId: "WO_001" },
			});

			expect(response).toMatchObject({
				code: 409,
				msg: expect.stringContaining(action),
				data: null,
				errorCode: "PHASE7_MUTATION_GUARDED",
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
		},
	);

	test("serves todo list through the unified app legacy envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/workorder/todo/list",
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
			orderId: expect.any(String),
			orderNo: expect.any(String),
			title: expect.any(String),
			status: expect.any(String),
			statusName: expect.any(String),
			communityId: "COMM_001",
		});
	});

	test("lets POST body override query parameters like other legacy adapters", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/workorder/todo/list",
			query: { communityId: "COMM_001", row: 10 },
			body: { communityId: "COMM_002", row: 1 },
		});

		expect(response).toMatchObject({ code: 0, data: { pageSize: 1 } });
		expect(response.data.list).toHaveLength(1);
		expect(response.data.list[0]).toMatchObject({ communityId: "COMM_002" });
	});

	test("returns an empty todo list for an unknown community", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/workorder/todo/list",
			query: { communityId: "COMM_999" },
		});

		expect(response).toMatchObject({
			code: 0,
			data: {
				list: [],
				total: 0,
			},
		});
	});

	test("serves detail and keeps missing or unknown ids controlled", async () => {
		const list = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/workorder/todo/list",
			query: { page: 1, row: 1, communityId: "COMM_001" },
		});
		const orderId = list.data.list[0].orderId;

		const detail = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/workorder/detail",
			query: { orderId },
		});
		expect(detail).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				order: {
					orderId,
					operationLogs: expect.any(Array),
				},
			},
		});
		expect(detail).not.toHaveProperty("success");

		const missing = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/workorder/detail",
			query: {},
		});
		expect(missing).toMatchObject({ code: 400, data: null });

		const unknown = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/workorder/detail",
			body: { orderId: "WO_UNKNOWN" },
		});
		expect(unknown).toMatchObject({ code: 404, data: null });
	});

	test("serves copy list through the unified app legacy envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/workorder/copy/list",
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
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response.data.list[0]).toMatchObject({
			orderId: expect.any(String),
			isCopyToMe: true,
			communityId: "COMM_001",
		});

		const unknownCommunity = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/workorder/copy/list",
			query: { page: 1, row: 1, communityId: "COMM_999" },
		});
		expect(unknownCommunity).toMatchObject({
			code: 0,
			data: {
				total: expect.any(Number),
			},
		});
		expect(unknownCommunity.data.total).toBeGreaterThan(0);
	});

	test("serves task list and keeps missing work id controlled", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/workorder/task/list",
			query: { workId: "WO_001", page: 1, row: 1 },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				pageSize: 1,
			},
		});
		expect(response.data.list[0]).toMatchObject({
			taskId: expect.any(String),
			workId: "WO_001",
			staffId: expect.any(String),
			state: expect.any(String),
		});

		const missing = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/workorder/task/list",
			query: {},
		});
		expect(missing).toMatchObject({ code: 400, data: null });
	});

	test("serves task items with state filtering and empty unknown work id", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/workorder/task/items",
			body: { workId: "WO_001", states: "W", page: 1, row: 10 },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
			},
		});
		expect(response.data.list.length).toBeGreaterThan(0);
		for (const item of response.data.list) {
			expect(item).toMatchObject({
				itemId: expect.any(String),
				workId: "WO_001",
				state: "W",
			});
		}

		const unknown = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/workorder/task/items",
			query: { workId: "WO_UNKNOWN" },
		});
		expect(unknown).toMatchObject({
			code: 0,
			data: {
				list: [],
				total: 0,
			},
		});

		const missing = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/workorder/task/items",
			query: {},
		});
		expect(missing).toMatchObject({ code: 400, data: null });
	});
});
