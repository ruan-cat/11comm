import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const couponReadonlyUrls = [
	"/app/couponProperty.listCouponPropertyUserDetail",
	"/app/integral.listIntegralSetting",
	"/app/integral.listIntegralUserDetail",
	"/app/reserveOrder.listReserveGoodsConfirmOrder",
] as const;

const guardedCouponUrls = [
	[
		"/app/couponProperty.writeOffCouponPropertyUser",
		{ couponQrcode: "CPN100000" },
		"couponProperty.writeOffCouponPropertyUser",
	],
	[
		"/app/integral.useIntegral",
		{ ownerName: "积分业主01", ownerTel: "13800000001", integral: 10 },
		"integral.useIntegral",
	],
	[
		"/app/reserveOrder.saveReserveGoodsConfirmOrder",
		{ timeId: "RSV200000" },
		"reserveOrder.saveReserveGoodsConfirmOrder",
	],
] as const;

describe("coupon legacy endpoints phase7 readonly plus guarded batch28", () => {
	const registry = createEndpointRegistry(runtimeEndpointDefinitions);

	test("registers coupon readonly endpoints and guarded writes with explicit method boundaries", () => {
		for (const url of couponReadonlyUrls) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
		}

		for (const [url] of guardedCouponUrls) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeUndefined();
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
		}
	});

	test("lists coupon write-off orders with legacy pagination and ignores communityId", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/couponProperty.listCouponPropertyUserDetail",
			query: { page: 1, row: 2, couponQrcode: "CPN10000", communityId: "COMM_UNKNOWN" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.arrayContaining([
					expect.objectContaining({
						uoId: expect.stringMatching(/^UO_/),
						couponQrcode: expect.stringContaining("CPN10000"),
						couponName: expect.any(String),
						value: expect.any(String),
						userName: expect.any(String),
						tel: expect.any(String),
						createTime: expect.any(String),
						remark: expect.any(String),
					}),
				]),
				total: expect.any(Number),
				page: 1,
				pageSize: 2,
			},
		});
		expect(response.data.hasMore).toBe(true);
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("returns an empty coupon pagination for an unknown qrcode", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/couponProperty.listCouponPropertyUserDetail",
			query: { page: 1, row: 10, couponQrcode: "NO_SUCH_COUPON" },
		});

		expect(response).toMatchObject({
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

	test("lists integral settings as an array rather than pagination", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/integral.listIntegralSetting",
			query: { page: 99, row: 99, communityId: "COMM_UNKNOWN" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: [
				expect.objectContaining({
					settingId: "IS_001",
					settingName: expect.any(String),
					onceMaxIntegral: 200,
				}),
			],
		});
		expect(response.data).not.toHaveProperty("list");
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("lists integral write-off logs and lets POST body override query", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/integral.listIntegralUserDetail",
			query: { page: 3, row: 1, ownerTel: "NO_MATCH" },
			body: { page: 1, row: 1, ownerTel: "13800000001", communityId: "IGNORED" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: [
					expect.objectContaining({
						logId: expect.stringMatching(/^IL_/),
						ownerName: expect.any(String),
						ownerTel: "13800000001",
						integral: expect.any(Number),
						operatorName: expect.any(String),
						createTime: expect.any(String),
					}),
				],
				total: 1,
				page: 1,
				pageSize: 1,
				hasMore: false,
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("lists reserve confirm orders with legacy pagination", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/reserveOrder.listReserveGoodsConfirmOrder",
			query: { page: 1, row: 2, reserveQrcode: "RSV20000", communityId: "IGNORED" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.arrayContaining([
					expect.objectContaining({
						orderId: expect.stringMatching(/^RO_/),
						reserveQrcode: expect.stringContaining("RSV20000"),
						goodsName: expect.any(String),
						quantity: expect.any(Number),
						appointmentTime: expect.any(String),
						hours: expect.any(String),
						personName: expect.any(String),
						personTel: expect.any(String),
						createTime: expect.any(String),
					}),
				]),
				total: expect.any(Number),
				page: 1,
				pageSize: 2,
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test.each(guardedCouponUrls)(
		"returns the legacy coupon guard envelope for POST-only write endpoint: %s",
		async (path, body, action) => {
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
