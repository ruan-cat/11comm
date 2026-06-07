import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const propertyApplicationReadonlyUrls = [
	"/app/feeDiscount/queryFeeDiscount",
	"/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail",
] as const;

describe("property-application legacy endpoints phase7 readonly slice", () => {
	const registry = createEndpointRegistry(runtimeEndpointDefinitions);

	test("registers exactly the property-application readonly handlers", () => {
		for (const url of propertyApplicationReadonlyUrls) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
		}

		const registeredPropertyApplicationUrls = runtimeEndpointDefinitions
			.map((definition) => definition.url)
			.filter((url) => url.startsWith("/app/feeDiscount/") || url.startsWith("/app/applyRoomDiscountRecord/"))
			.sort();
		expect(registeredPropertyApplicationUrls).toEqual([...propertyApplicationReadonlyUrls].sort());
	});

	test("serves fee discounts through the unified app legacy envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/feeDiscount/queryFeeDiscount",
			query: { discountType: "3003", communityId: "COMM_001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: expect.any(Array),
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response.data.length).toBeGreaterThan(0);
		for (const item of response.data) {
			expect(item).toMatchObject({
				discountId: expect.stringMatching(/^DISCOUNT_/),
				discountName: expect.any(String),
				discountType: "3003",
				discountAmount: expect.any(Number),
				communityId: "COMM_001",
			});
		}
	});

	test("filters fee discounts and returns an empty legacy array for unknown communities", async () => {
		const unknownCommunity = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/feeDiscount/queryFeeDiscount",
			query: { discountType: "3003", communityId: "COMM_UNKNOWN" },
		});

		expect(unknownCommunity).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: [],
		});
		expect(unknownCommunity).not.toHaveProperty("success");
		expect(unknownCommunity).not.toHaveProperty("message");
	});

	test("serves application record details through the unified app legacy envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail",
			query: { ardrId: "ARDR_001", roomName: "101A" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: expect.any(Array),
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response.data.length).toBeGreaterThan(0);
		for (const item of response.data) {
			expect(item).toMatchObject({
				ardrId: "ARDR_001",
				applicationId: expect.any(String),
				roomId: expect.any(String),
				roomName: expect.stringContaining("101A"),
				relTypeCd: expect.any(String),
				url: expect.any(String),
				remark: expect.any(String),
				createTime: expect.any(String),
			});
		}
	});

	test("lets POST body override query parameters like other legacy adapters", async () => {
		const feeDiscounts = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/feeDiscount/queryFeeDiscount",
			query: { communityId: "COMM_UNKNOWN" },
			body: { communityId: "COMM_001", discountType: "3003" },
		});

		expect(feeDiscounts).toMatchObject({
			code: 0,
			data: expect.arrayContaining([expect.objectContaining({ communityId: "COMM_001", discountType: "3003" })]),
		});

		const recordDetails = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail",
			query: { ardrId: "ARDR_UNKNOWN" },
			body: { ardrId: "ARDR_002" },
		});

		expect(recordDetails).toMatchObject({
			code: 0,
			data: [expect.objectContaining({ ardrId: "ARDR_002" })],
		});
	});
});
