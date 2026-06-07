import { afterEach, describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const guardedPurchaseUrls = [
	["/app/purchase/purchaseApply", { resourceStores: [{ resId: "RES_001", quantity: 1 }] }, "purchase.purchaseApply"],
	[
		"/app/purchase/urgentPurchaseApply",
		{
			resourceStores: [{ resId: "RES_002", quantity: 1 }],
			endUserName: "User",
			endUserTel: "13800000000",
			description: "urgent",
		},
		"purchase.urgentPurchaseApply",
	],
] as const;

describe("purchase legacy endpoints", () => {
	afterEach(() => {
		delete process.env.PHASE7_ALLOW_LEGACY_MUTATIONS;
	});

	test("registers readonly resource store list and POST-only guarded write handlers", () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		expect(findEndpointDefinition(registry, "GET", "/app/resourceStore.listResourceStores")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/resourceStore.listResourceStores")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/purchase/updatePurchaseApply")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/purchase/updatePurchaseApply")).toBeUndefined();

		for (const [path] of guardedPurchaseUrls) {
			expect(findEndpointDefinition(registry, "GET", path)).toBeUndefined();
			expect(findEndpointDefinition(registry, "POST", path)).toBeTruthy();
		}
	});

	test("lists resource stores with the legacy code msg data envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/resourceStore.listResourceStores",
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				resourceStores: expect.arrayContaining([
					expect.objectContaining({
						resId: expect.stringMatching(/^RES_/),
						resName: expect.any(String),
						quantity: expect.any(Number),
					}),
				]),
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("blocks updatePurchaseApply by default without faking write verification", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/purchase/updatePurchaseApply",
			body: { applyId: "PA_001", communityId: "COMM_001" },
		});

		expect(response).toMatchObject({
			code: 409,
			msg: expect.stringContaining("Phase7"),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
	});

	test("keeps query and body compatible while returning the guarded legacy envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/purchase/updatePurchaseApply",
			query: { applyId: "PA_QUERY", communityId: "COMM_QUERY" },
			body: { applyId: "PA_BODY", communityId: "COMM_BODY" },
		});

		expect(response).toMatchObject({
			code: 409,
			msg: expect.stringContaining("purchase.updatePurchaseApply"),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("keeps the endpoint blocked even when the generic legacy mutation flag is set", async () => {
		process.env.PHASE7_ALLOW_LEGACY_MUTATIONS = "1";
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/purchase/updatePurchaseApply",
			body: { applyId: "PA_001", communityId: "COMM_001" },
		});

		expect(response).toMatchObject({
			code: 409,
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
	});

	test.each(guardedPurchaseUrls)(
		"blocks purchase write endpoint by default without faking write verification: %s",
		async (path, body, action) => {
			const registry = createEndpointRegistry(runtimeEndpointDefinitions);

			const response = await dispatchEndpoint(registry, {
				method: "POST",
				path,
				body,
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
		},
	);
});
