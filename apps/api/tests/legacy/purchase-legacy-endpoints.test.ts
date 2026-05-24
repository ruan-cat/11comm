import { afterEach, describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

describe("purchase update legacy guard", () => {
	afterEach(() => {
		delete process.env.PHASE7_ALLOW_LEGACY_MUTATIONS;
	});

	test("registers only the guarded updatePurchaseApply exact handler", () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		expect(findEndpointDefinition(registry, "POST", "/app/purchase/updatePurchaseApply")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/purchase/updatePurchaseApply")).toBeUndefined();
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
});
