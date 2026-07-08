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
	"/app/purchaseApply.listPurchaseApplys",
	"/app/itemRelease.listItemRelease",
	"/app/purchaseApply.listMyAuditOrders",
	"/app/itemRelease.queryUndoItemRelease",
	"/app/resourceStore.listAllocationStoreAuditOrders",
	"/app/resourceStore.listAllocationStorehouses",
	"/app/resourceStore.queryMyResourceStoreInfo",
] as const;

const dualReadonlyResourceEndpoints = [
	"/app/resourceStore.listUserStorehouses",
	"/app/resourceStoreType.listResourceStoreTypes",
] as const;

const guardedResourceEndpoints = [
	[
		"/app/resourceStore.saveAllocationStorehouse",
		{ fromShId: "SH_001", toShId: "SH_002", resourceStores: [{ resName: "Office Desk" }] },
		"resourceStore.saveAllocationStorehouse",
	],
	[
		"/app/purchaseApply.auditApplyOrder",
		{ applyOrderId: "PA_20240301_001", taskId: "TASK_001", auditCode: "1100" },
		"purchaseApply.auditApplyOrder",
	],
	[
		"/app/itemRelease.auditUndoItemRelease",
		{ applyOrderId: "IO_20240301_001", taskId: "TASK_002", auditCode: "1100" },
		"itemRelease.auditUndoItemRelease",
	],
	[
		"/app/resourceStore.auditAllocationStoreOrder",
		{ allocationId: "AL_20240301_001", taskId: "TASK_003", auditCode: "1100" },
		"resourceStore.auditAllocationStoreOrder",
	],
	[
		"/app/collection/resourceOut",
		{ resourceStores: [{ resName: "Office Desk" }], description: "compat out" },
		"/app/collection/resourceOut",
	],
	[
		"/app/purchase/resourceEnter",
		{ applyOrderId: "PA_20240301_001" },
		"/app/purchase/resourceEnter",
	],
	[
		"/app/purchaseApply.deletePurchaseApply",
		{ applyOrderId: "PA_20240301_001" },
		"/app/purchaseApply.deletePurchaseApply",
	],
	[
		"/app/resourceStore.allocationStoreEnter",
		{ allocationId: "AL_20240301_001" },
		"/app/resourceStore.allocationStoreEnter",
	],
	[
		"/app/resourceStore.deleteAllocationStorehouse",
		{ allocationId: "AL_20240301_001" },
		"/app/resourceStore.deleteAllocationStorehouse",
	],
	[
		"/app/resourceStore.saveAllocationUserStorehouse",
		{ fromShId: "SH_001", toShId: "SH_002", resourceStores: [{ resName: "Office Desk" }] },
		"/app/resourceStore.saveAllocationUserStorehouse",
	],
	[
		"/app/resourceStore.saveResourceReturn",
		{ resId: "RES_001" },
		"/app/resourceStore.saveResourceReturn",
	],
	[
		"/app/resourceStore.saveResourceScrap",
		{ resId: "RES_001" },
		"/app/resourceStore.saveResourceScrap",
	],
] as const;

describe("resource app legacy exact endpoints", () => {
	test("registers readonly resource endpoints and guarded resource writes with explicit method boundaries", () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const url of readonlyResourceEndpoints) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "POST", url)).toBeUndefined();
		}

		for (const url of dualReadonlyResourceEndpoints) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
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

	test("returns the legacy resource success envelope for user storehouse list", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/resourceStore.listUserStorehouses",
			query: { page: 1, row: 10, keyword: "Office" },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: {
				resources: expect.arrayContaining([
					expect.objectContaining({ resId: "RES_001", resName: "Office Desk" }),
				]),
				total: expect.any(Number),
			},
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("returns the legacy resource success envelope for resource store types", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/resourceStoreType.listResourceStoreTypes",
			body: { parentId: "" },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: expect.arrayContaining([
				expect.objectContaining({ rstId: "RST_001", rstName: "Office Furniture" }),
			]),
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

	test.each([
		[
			"/app/purchaseApply.listPurchaseApplys",
			{ page: 1, row: 1, communityId: "IGNORED_COMMUNITY" },
			{
				list: [
					expect.objectContaining({ applyOrderId: "PA_20240301_001", resourceNames: "Office Desk, Office Chair" }),
				],
				total: 2,
				page: 1,
				pageSize: 1,
				hasMore: true,
			},
		],
		[
			"/app/itemRelease.listItemRelease",
			{ page: 1, row: 2, communityId: "IGNORED_COMMUNITY" },
			{
				list: expect.arrayContaining([
					expect.objectContaining({ applyOrderId: "IO_20240301_001", resourceNames: "Desktop Computer" }),
				]),
				total: 2,
				page: 1,
				pageSize: 2,
				hasMore: false,
			},
		],
		[
			"/app/purchaseApply.listMyAuditOrders",
			{ page: 1, row: 1, communityId: "IGNORED_COMMUNITY" },
			{
				list: [
					expect.objectContaining({
						taskId: "TASK_001",
						businessId: "PA_20240301_001",
						businessType: "Purchase Audit",
					}),
				],
				total: 1,
				page: 1,
				pageSize: 1,
				hasMore: false,
			},
		],
		[
			"/app/itemRelease.queryUndoItemRelease",
			{ page: 1, row: 1, communityId: "IGNORED_COMMUNITY" },
			{
				list: [
					expect.objectContaining({
						taskId: "TASK_002",
						businessId: "IO_20240301_001",
						businessType: "Item Release Audit",
					}),
				],
				total: 1,
				page: 1,
				pageSize: 1,
				hasMore: false,
			},
		],
		[
			"/app/resourceStore.listAllocationStoreAuditOrders",
			{ page: 1, row: 1, communityId: "IGNORED_COMMUNITY" },
			{
				list: [
					expect.objectContaining({
						taskId: "TASK_003",
						businessId: "AL_20240301_001",
						businessType: "Allocation Audit",
					}),
				],
				total: 1,
				page: 1,
				pageSize: 1,
				hasMore: false,
			},
		],
		[
			"/app/resourceStore.listAllocationStorehouses",
			{ page: 1, row: 2, communityId: "IGNORED_COMMUNITY" },
			{
				list: expect.arrayContaining([expect.objectContaining({ resId: "RES_001", resName: "Office Desk" })]),
				total: 3,
				page: 1,
				pageSize: 2,
				hasMore: true,
			},
		],
	])(
		"returns the legacy resource success envelope for readonly resource old source endpoint: %s",
		async (path, query, data) => {
			const registry = createEndpointRegistry(runtimeEndpointDefinitions);

			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path,
				query,
			});

			expect(response).toMatchObject({
				success: true,
				code: "0",
				message: expect.any(String),
				data,
				timestamp: expect.any(Number),
			});
			expect(response).not.toHaveProperty("msg");
		},
	);

	test("filters personal resource store info by resource name and user name", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/resourceStore.queryMyResourceStoreInfo",
			query: { page: 1, row: 10, resName: "Desk", searchUserName: "Admin" },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: {
				list: [
					expect.objectContaining({
						resId: "MY_RES_001",
						resName: "Office Desk",
						userName: "Admin",
					}),
				],
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
