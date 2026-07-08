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
	"/app/applyRoomDiscount/queryApplyRoomDiscount",
	"/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord",
] as const;

const propertyApplicationGuardedWriteUrls = [
	"/app/applyRoomDiscount/updateApplyRoomDiscount",
	"/app/applyRoomDiscount/updateReviewApplyRoomDiscount",
	"/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord",
	"/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord",
] as const;

describe("property-application legacy endpoints phase7 readonly and guarded write slice", () => {
	const registry = createEndpointRegistry(runtimeEndpointDefinitions);

	test("registers exactly the property-application readonly handlers", () => {
		for (const url of propertyApplicationReadonlyUrls) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
		}

		const registeredPropertyApplicationUrls = runtimeEndpointDefinitions
			.map((definition) => definition.url)
			.filter((url) =>
				url.startsWith("/app/feeDiscount/") ||
				url.startsWith("/app/applyRoomDiscount/") ||
				url.startsWith("/app/applyRoomDiscountRecord/"),
			)
			.sort();
		expect(registeredPropertyApplicationUrls).toEqual([...propertyApplicationReadonlyUrls, ...propertyApplicationGuardedWriteUrls].sort());
	});

	test("registers POST-only guarded write endpoints and leaves GET undefined", () => {
		for (const url of propertyApplicationGuardedWriteUrls) {
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "GET", url)).toBeUndefined();
		}
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

	test("serves apply room discount list through the unified app legacy envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/applyRoomDiscount/queryApplyRoomDiscount",
			query: { communityId: "COMM_001", page: 1, row: 10 },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				pageSize: 10,
				hasMore: expect.any(Boolean),
			},
		});
		expect(response.data.list.length).toBeGreaterThan(0);
		for (const item of response.data.list) {
			expect(item).toMatchObject({
				ardId: expect.stringMatching(/^ARD_/),
				roomName: expect.any(String),
				communityId: "COMM_001",
				state: expect.any(String),
				stateName: expect.any(String),
			});
		}
	});

	test("serves apply room discount detail when ardId is provided", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/applyRoomDiscount/queryApplyRoomDiscount",
			query: { ardId: "ARD_001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: [expect.objectContaining({ ardId: "ARD_001" })],
				total: 1,
				page: 1,
				pageSize: 1,
				hasMore: false,
			},
		});
	});

	test("returns 404 for unknown apply room discount detail", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/applyRoomDiscount/queryApplyRoomDiscount",
			query: { ardId: "ARD_UNKNOWN" },
		});

		expect(response).toMatchObject({
			code: 404,
			msg: expect.stringContaining("不存在"),
			data: null,
		});
	});

	test("filters apply room discount list by roomName and state", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/applyRoomDiscount/queryApplyRoomDiscount",
			body: { communityId: "COMM_001", roomName: "101A", state: "4" },
		});

		expect(response).toMatchObject({
			code: 0,
			data: {
				list: expect.arrayContaining([expect.objectContaining({ ardId: "ARD_001", state: "4" })]),
			},
		});
	});

	test("serves apply room discount records through the unified app legacy envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord",
			query: { communityId: "COMM_001", applicationId: "ARD_001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				pageSize: 10,
				hasMore: expect.any(Boolean),
			},
		});
		expect(response.data.list.length).toBeGreaterThan(0);
		for (const item of response.data.list) {
			expect(item).toMatchObject({
				ardrId: expect.stringMatching(/^ARDR_/),
				applicationId: "ARD_001",
				roomName: expect.any(String),
				communityId: "COMM_001",
			});
		}
	});

	test("returns 409 PHASE7_MUTATION_GUARDED for all write endpoints without mutation", async () => {
		for (const url of propertyApplicationGuardedWriteUrls) {
			const response = await dispatchEndpoint(registry, {
				method: "POST",
				path: url,
				body: { ardId: "ARD_001", communityId: "COMM_001", remark: "should not write" },
			});

			expect(response).toMatchObject({
				code: 409,
				msg: expect.stringContaining("Phase7 mutation guard blocked"),
				data: null,
				errorCode: "PHASE7_MUTATION_GUARDED",
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
		}
	});
});
