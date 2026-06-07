import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const readonlyMaintenanceEndpoints = [
	"/app/maintenance.listMaintenanceTasks",
	"/app/maintenance.queryMaintenanceTask",
	"/app/maintenance.listMaintenanceTaskDetails",
] as const;

const guardedMaintenanceEndpoints = [
	["/app/maintenance.startMaintenanceTask", { taskId: "MT_001" }, "maintenance.startMaintenanceTask"],
	["/app/maintenance.completeMaintenanceTask", { taskId: "MT_001" }, "maintenance.completeMaintenanceTask"],
	[
		"/app/maintenance.submitMaintenanceSingle",
		{ taskDetailId: "MTD_MT_001_01", result: "OK" },
		"maintenance.submitMaintenanceSingle",
	],
	[
		"/app/maintenance.transferMaintenanceTask",
		{ taskId: "MT_001", staffId: "STAFF_002" },
		"maintenance.transferMaintenanceTask",
	],
] as const;

describe("maintenance app legacy exact endpoints", () => {
	test("registers readonly endpoints and guarded maintenance writes with explicit method boundaries", () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const url of readonlyMaintenanceEndpoints) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
		}

		for (const [url] of guardedMaintenanceEndpoints) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeUndefined();
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
		}
	});

	test.each(guardedMaintenanceEndpoints)(
		"returns the legacy maintenance guard envelope for POST-only write endpoint: %s",
		async (path, body, action) => {
			const registry = createEndpointRegistry(runtimeEndpointDefinitions);

			const response = await dispatchEndpoint(registry, {
				method: "POST",
				path,
				body,
			});

			expect(response).toMatchObject({
				success: false,
				code: "409",
				message: expect.stringContaining(action),
				data: null,
				errorCode: "PHASE7_MUTATION_GUARDED",
				timestamp: expect.any(Number),
			});
			expect(response).not.toHaveProperty("msg");
		},
	);

	test("returns the legacy maintenance success envelope for paginated task list", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/maintenance.listMaintenanceTasks",
			query: { communityId: "COMM_001", status: "10001", page: 1, row: 2 },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: {
				list: [expect.objectContaining({ communityId: "COMM_001", status: "10001" })],
				total: expect.any(Number),
				page: 1,
				pageSize: 2,
				hasMore: expect.any(Boolean),
			},
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("returns task detail and detail items with the maintenance envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const taskResponse = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/maintenance.queryMaintenanceTask",
			body: { taskId: "MT_001" },
		});

		expect(taskResponse).toMatchObject({
			success: true,
			code: "0",
			data: {
				task: expect.objectContaining({
					taskId: "MT_001",
					communityId: "COMM_001",
				}),
			},
			timestamp: expect.any(Number),
		});

		const detailItemsResponse = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/maintenance.listMaintenanceTaskDetails",
			query: { taskId: "MT_001" },
		});

		expect(detailItemsResponse).toMatchObject({
			success: true,
			code: "0",
			data: {
				items: expect.arrayContaining([
					expect.objectContaining({ taskId: "MT_001", taskDetailId: expect.any(String) }),
				]),
			},
			timestamp: expect.any(Number),
		});
	});

	test.each([
		["/app/maintenance.queryMaintenanceTask", {}, "400"],
		["/app/maintenance.queryMaintenanceTask", { taskId: "MT_NOT_FOUND" }, "404"],
		["/app/maintenance.listMaintenanceTaskDetails", {}, "400"],
		["/app/maintenance.listMaintenanceTaskDetails", { taskId: "MT_NOT_FOUND" }, "404"],
	])("returns the legacy maintenance error envelope for invalid task detail request: %s", async (path, query, code) => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path,
			query,
		});

		expect(response).toMatchObject({
			success: false,
			code,
			message: expect.any(String),
			data: null,
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});
});
