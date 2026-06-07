import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const readonlyResourceEndpoints = [
	"/app/resourceStore.listStorehouses",
	"/app/resourceStore.listAllocationStorehouseApplys",
] as const;

const guardedResourceEndpoints = [
	[
		"/app/resourceStore.saveAllocationStorehouse",
		{ fromShId: "SH_001", toShId: "SH_002", resourceStores: [{ resName: "Office Desk" }] },
		"resourceStore.saveAllocationStorehouse",
	],
] as const;

describe("resource app legacy exact endpoints", () => {
	test("registers readonly resource endpoints and guarded allocation write with explicit method boundaries", () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const url of readonlyResourceEndpoints) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "POST", url)).toBeUndefined();
		}

		for (const [url] of guardedResourceEndpoints) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeUndefined();
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
		}
	});

	test("returns the legacy resource success envelope for filtered storehouse list", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/resourceStore.listStorehouses",
			query: { allowPurchase: "ON", page: 1, row: 2 },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: {
				list: [
					expect.objectContaining({ shId: "SH_001", allowPurchase: "ON" }),
					expect.objectContaining({ shId: "SH_002", allowPurchase: "ON" }),
				],
				total: 2,
				page: 1,
				pageSize: 2,
				hasMore: false,
			},
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("returns the legacy resource success envelope for allocation apply list", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/resourceStore.listAllocationStorehouseApplys",
			query: { page: 1, row: 10 },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: {
				list: [expect.objectContaining({ allocationId: "AL_20240301_001", state: 1200 })],
				total: 1,
				page: 1,
				pageSize: 10,
				hasMore: false,
			},
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test.each(guardedResourceEndpoints)(
		"returns the legacy resource guard envelope for POST-only write endpoint: %s",
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
});
