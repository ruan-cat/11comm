import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const readonlyParkingEndpoints = [
	"/app/owner.queryOwnerCars",
	"/app/parkingArea.listParkingAreas",
	"/app/machine.listParkingAreaMachines",
	"/app/machine.getBarrierCloudVideo",
	"/app/carInout.listCarInParkingAreaCmd",
	"/app/parkingCoupon.listParkingCouponCar",
	"/app/tempCarFee.getTempCarFeeOrder",
	"/app/carInoutDetail.listCarInoutDetail",
	"/app/carInoutPayment.listCarInoutPayment",
] as const;

const guardedParkingWriteEndpoints = [
	"/app/machine/openDoor",
	"/app/machine/closeDoor",
	"/app/machine.customCarInOutCmd",
] as const;

describe("parking app legacy exact endpoints", () => {
	test("registers readonly parking endpoints as GET-only and parking writes as POST-only guarded", () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const url of readonlyParkingEndpoints) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "POST", url)).toBeUndefined();
		}

		for (const url of guardedParkingWriteEndpoints) {
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "GET", url)).toBeUndefined();
		}
	});

	test.each(guardedParkingWriteEndpoints)("blocks parking write endpoint with the Phase7 guard: %s", async (url) => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: url,
			body: {},
		});

		expect(response).toMatchObject({
			success: false,
			code: "409",
			message: `Phase7 mutation guard blocked parking legacy write endpoint: ${url}`,
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("returns the legacy parking success envelope for filtered owner car pagination", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/owner.queryOwnerCars",
			query: {
				page: 1,
				row: 1,
				carNumLike: "B123",
				ownerName: "Zhang",
				memberCarNumLike: "B123",
				num: "P-001",
				link: "13800000001",
			},
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: {
				list: [
					expect.objectContaining({
						carId: "CAR_0001",
						carNum: "B12345",
						ownerName: "Zhang San",
						link: "13800000001",
						num: "P-001",
					}),
				],
				total: 1,
				page: 1,
				pageSize: 1,
				hasMore: false,
			},
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("returns the legacy parking success envelope for parking area list", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/parkingArea.listParkingAreas",
			query: { page: 1, row: 10, communityId: "IGNORED_COMMUNITY" },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: [
				{ paId: "PA_001", num: "P1", name: "Phase 1 Underground Parking" },
				{ paId: "PA_002", num: "P2", name: "Phase 2 Surface Parking" },
			],
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("returns parking area machines filtered by paNum without leaking paNum in machine rows", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/machine.listParkingAreaMachines",
			query: { paNum: "P1", page: 1, row: 10, communityId: "IGNORED_COMMUNITY" },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: [
				expect.objectContaining({ machineId: "M_001", machineCode: "MC_001", direction: "3306" }),
				expect.objectContaining({ machineId: "M_002", machineCode: "MC_002", direction: "3307" }),
			],
			timestamp: expect.any(Number),
		});
		expect(response.data).toHaveLength(2);
		for (const machine of response.data) {
			expect(machine).not.toHaveProperty("paNum");
		}
		expect(response).not.toHaveProperty("msg");
	});

	test("returns barrier cloud video url for an existing machine", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/machine.getBarrierCloudVideo",
			query: { machineId: "M_001" },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: { url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("returns legacy parking 404 envelope when barrier machine does not exist", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/machine.getBarrierCloudVideo",
			query: { machineId: "UNKNOWN_MACHINE" },
		});

		expect(response).toMatchObject({
			success: false,
			code: "404",
			message: "设备不存在",
			data: null,
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("returns temporary cars in parking area filtered by carNum and paId", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/carInout.listCarInParkingAreaCmd",
			query: {
				carNum: "B123",
				paId: "PA_001",
				page: 1,
				row: 10,
				communityId: "IGNORED_COMMUNITY",
				paNum: "IGNORED_PA_NUM",
			},
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: [
				expect.objectContaining({
					inoutId: "IO_0001",
					paId: "PA_001",
					carNum: "B12345",
					payCharge: expect.any(Number),
					hours: expect.any(Number),
					min: expect.any(Number),
				}),
			],
			timestamp: expect.any(Number),
		});
		expect(response.data).toHaveLength(1);
		expect(response).not.toHaveProperty("msg");
	});

	test("returns parking coupons with ignored legacy query filters", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/parkingCoupon.listParkingCouponCar",
			query: {
				paId: "PA_001",
				page: 1,
				row: 1,
				state: "2000",
				carNum: "IGNORED_CAR",
				communityId: "IGNORED_COMMUNITY",
			},
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: [
				expect.objectContaining({ pccId: "PCC_001", typeCd: "2002", value: 5, state: "1001" }),
				expect.objectContaining({ pccId: "PCC_002", typeCd: "1001", value: 30, state: "1001" }),
				expect.objectContaining({ pccId: "PCC_003", typeCd: "3003", value: 8, state: "1001" }),
			],
			timestamp: expect.any(Number),
		});
		expect(response.data).toHaveLength(3);
		expect(response).not.toHaveProperty("msg");
	});

	test("calculates temporary car fee order amount from comma separated coupon ids", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/tempCarFee.getTempCarFeeOrder",
			query: { pccIds: "PCC_001,PCC_002" },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: { amount: 14 },
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("returns paged car inout detail records filtered by paNum and ignores communityId", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/carInoutDetail.listCarInoutDetail",
			query: { page: 1, row: 1, paNum: "P2", communityId: "IGNORED_COMMUNITY" },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: {
				list: [
					expect.objectContaining({
						inoutId: "IOD_0003",
						carNum: "B34567",
						stateName: expect.any(String),
						paNum: "P2",
						carTypeName: expect.any(String),
						inTime: expect.any(String),
						payCharge: expect.any(Number),
						hours: expect.any(Number),
						min: expect.any(Number),
						remark: expect.any(String),
					}),
				],
				total: 1,
				page: 1,
				pageSize: 1,
				hasMore: false,
			},
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("returns paged car inout payment records without filtering by paNum", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/carInoutPayment.listCarInoutPayment",
			query: { page: 1, row: 10, paNum: "P2", communityId: "IGNORED_COMMUNITY" },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: {
				list: expect.arrayContaining([
					expect.objectContaining({
						inoutId: "IOP_0001",
						carNum: "B12345",
						stateName: expect.any(String),
						inTime: expect.any(String),
						createTime: expect.any(String),
						payTypeName: expect.any(String),
						payCharge: expect.any(Number),
						realCharge: expect.any(Number),
					}),
					expect.objectContaining({
						inoutId: "IOP_0003",
						carNum: "B34567",
					}),
				]),
				total: 3,
				page: 1,
				pageSize: 10,
				hasMore: false,
			},
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});
});
