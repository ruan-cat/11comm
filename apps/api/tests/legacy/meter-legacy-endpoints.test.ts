import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const readonlyMeterEndpoints = [
	"/app/meter.queryFeeTypes",
	"/app/meter.queryFeeTypesItems",
	"/app/meter.listMeterType",
	"/app/meter.listMeterWaters",
	"/app/meter.queryPreMeterWater",
	"/app/meter.listFloorShareReading",
	"/app/meter.listFloorShareMeter",
] as const;

const guardedMeterWriteEndpoints = [
	["/app/meter.saveMeterWater", "meter.saveMeterWater"],
	["/app/meter.saveFloorShareReading", "meter.saveFloorShareReading"],
	["/app/meter.auditFloorShareReading", "meter.auditFloorShareReading"],
] as const;

describe("meter legacy exact endpoints", () => {
	test.each(readonlyMeterEndpoints)("registers %s as GET and POST readonly endpoint", (path) => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		expect(findEndpointDefinition(registry, "GET", path)).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", path)).toBeTruthy();
	});

	test("queryFeeTypes returns fee type items in the legacy envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/meter.queryFeeTypes",
		});

		expect(response).toEqual({
			code: 0,
			msg: "查询成功",
			data: [
				{ id: "888800010015", name: "水费" },
				{ id: "888800010016", name: "电费" },
				{ id: "888800010009", name: "燃气费" },
			],
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response).not.toHaveProperty("timestamp");
	});

	test("queryFeeTypesItems returns exact fee config matches and lets POST body override query", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		await expect(
			dispatchEndpoint(registry, {
				method: "GET",
				path: "/app/meter.queryFeeTypesItems",
				query: { feeTypeCd: "888800010015" },
			}),
		).resolves.toEqual({
			code: 0,
			msg: "查询成功",
			data: [
				{ configId: "CFG_WATER_001", feeName: "居民生活用水" },
				{ configId: "CFG_WATER_002", feeName: "商业用水" },
			],
		});

		await expect(
			dispatchEndpoint(registry, {
				method: "POST",
				path: "/app/meter.queryFeeTypesItems",
				query: { feeTypeCd: "888800010015" },
				body: { feeTypeCd: "888800010016" },
			}),
		).resolves.toEqual({
			code: 0,
			msg: "查询成功",
			data: [
				{ configId: "CFG_POWER_001", feeName: "居民生活用电" },
				{ configId: "CFG_POWER_002", feeName: "公共照明用电" },
			],
		});

		await expect(
			dispatchEndpoint(registry, {
				method: "GET",
				path: "/app/meter.queryFeeTypesItems",
				query: { feeTypeCd: "UNKNOWN" },
			}),
		).resolves.toMatchObject({ code: 0, msg: "查询成功", data: [] });

		await expect(
			dispatchEndpoint(registry, {
				method: "GET",
				path: "/app/meter.queryFeeTypesItems",
			}),
		).resolves.toMatchObject({ code: 0, msg: "查询成功", data: [] });
	});

	test("listMeterType returns meter type items in the legacy envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/meter.listMeterType",
			body: { ignored: "yes" },
		});

		expect(response).toEqual({
			code: 0,
			msg: "查询成功",
			data: [
				{ typeId: "1010", typeName: "电表" },
				{ typeId: "2020", typeName: "水表" },
				{ typeId: "3030", typeName: "燃气表" },
			],
		});
	});

	test("queryPreMeterWater returns the previous reading for objId and meterType", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/meter.queryPreMeterWater",
			query: { objId: "ROOM_0001", meterType: "1010" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: {
				curDegrees: 108,
				curReadingTime: expect.any(String),
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response).not.toHaveProperty("timestamp");
	});

	test("queryPreMeterWater lets POST body override query and falls back to zero for unknown readings", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		await expect(
			dispatchEndpoint(registry, {
				method: "POST",
				path: "/app/meter.queryPreMeterWater",
				query: { objId: "UNKNOWN_ROOM", meterType: "UNKNOWN_TYPE" },
				body: { objId: "ROOM_0002", meterType: "2020" },
			}),
		).resolves.toMatchObject({
			code: 0,
			msg: "查询成功",
			data: {
				curDegrees: 112,
				curReadingTime: expect.any(String),
			},
		});

		await expect(
			dispatchEndpoint(registry, {
				method: "GET",
				path: "/app/meter.queryPreMeterWater",
				query: { objId: "UNKNOWN_ROOM", meterType: "2020" },
			}),
		).resolves.toMatchObject({
			code: 0,
			msg: "查询成功",
			data: {
				curDegrees: 0,
				curReadingTime: expect.any(String),
			},
		});
	});

	test("listMeterWaters returns paged readings filtered by objName and ignores communityId", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/meter.listMeterWaters",
			query: { page: 1, row: 2, roomNum: "1-", communityId: "UNKNOWN_COMMUNITY" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: {
				list: expect.any(Array),
				total: 20,
				page: 1,
				pageSize: 2,
				hasMore: true,
			},
		});
		expect(response.data.list).toHaveLength(2);
		expect(response.data.list.every((item: { objName: string }) => item.objName.includes("1-"))).toBe(true);
	});

	test("listMeterWaters lets POST body override query parameters", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/meter.listMeterWaters",
			query: { page: 1, row: 1, roomNum: "1-" },
			body: { page: 2, row: 3, roomNum: "2-", communityId: "UNKNOWN_COMMUNITY" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: {
				list: expect.any(Array),
				total: 20,
				page: 2,
				pageSize: 3,
				hasMore: true,
			},
		});
		expect(response.data.list).toHaveLength(3);
		expect(response.data.list.every((item: { objName: string }) => item.objName.includes("2-"))).toBe(true);
	});

	test("listFloorShareReading returns paged readings without communityId fsmId or state filtering", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/meter.listFloorShareReading",
			query: { page: 1, row: 2, communityId: "UNKNOWN_COMMUNITY", fsmId: "FSM_0001", state: "W" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: {
				list: expect.any(Array),
				total: 28,
				page: 1,
				pageSize: 2,
				hasMore: true,
			},
		});
		expect(response.data.list).toHaveLength(2);
	});

	test("listFloorShareMeter filters only by exact fsmId and lets POST body override query", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/meter.listFloorShareMeter",
			query: { page: 1, row: 5, fsmId: "FSM_0001", communityId: "UNKNOWN_COMMUNITY" },
			body: { page: 1, row: 1, fsmId: "FSM_0002" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: {
				list: [expect.objectContaining({ fsmId: "FSM_0002" })],
				total: 1,
				page: 1,
				pageSize: 1,
				hasMore: false,
			},
		});
	});

	test.each(guardedMeterWriteEndpoints)("registers %s as POST guarded write endpoint", (path) => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		expect(findEndpointDefinition(registry, "GET", path)).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", path)).toBeTruthy();
	});

	test.each(guardedMeterWriteEndpoints)(
		"blocks %s by default with the legacy guarded mutation envelope",
		async (path, action) => {
			const registry = createEndpointRegistry(runtimeEndpointDefinitions);

			const response = await dispatchEndpoint(registry, {
				method: "POST",
				path,
				body: { objId: "ROOM_0001", meterType: "1010", state: "C" },
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
