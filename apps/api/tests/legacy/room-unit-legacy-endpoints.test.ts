import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const roomListUrl = "/app/room.queryRooms";
const roomDetailUrl = "/app/room.queryRoomDetail";
const unitListUrl = "/app/unit.queryUnits";
const unitDetailUrl = "/app/unit.queryUnitDetail";

const readonlyUrls = [roomListUrl, roomDetailUrl, unitListUrl, unitDetailUrl] as const;

describe("room-unit legacy endpoints phase7 readonly slice", () => {
	const registry = createEndpointRegistry(runtimeEndpointDefinitions);

	test("registers room and unit readonly handlers for GET and POST", () => {
		for (const url of readonlyUrls) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
		}
	});

	test("serves unit list through the legacy pagination envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: unitListUrl,
			query: { floorId: "F_COMM_001_001", page: 1, row: 3 },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				pageSize: 3,
				hasMore: true,
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response).not.toHaveProperty("timestamp");
		expect(response.data.list).toHaveLength(3);
		for (const unit of response.data.list) {
			expect(unit).toMatchObject({
				unitId: expect.stringMatching(/^U_COMM_001_001_/),
				unitNum: expect.any(String),
				floorId: "F_COMM_001_001",
				communityId: "COMM_001",
			});
		}
	});

	test("filters units and lets POST body override query parameters", async () => {
		const filtered = await dispatchEndpoint(registry, {
			method: "GET",
			path: unitListUrl,
			query: { communityId: "COMM_001", floorId: "F_COMM_001_001", unitNum: "1", page: 1, row: 5 },
		});

		expect(filtered).toMatchObject({
			code: 0,
			data: {
				list: [expect.objectContaining({ unitId: "U_COMM_001_001_01", unitNum: "1" })],
				total: 1,
				page: 1,
				pageSize: 5,
				hasMore: false,
			},
		});

		const empty = await dispatchEndpoint(registry, {
			method: "GET",
			path: unitListUrl,
			query: { floorId: "F_COMM_001_999", page: 1, row: 5 },
		});
		expect(empty).toMatchObject({
			code: 0,
			data: { list: [], total: 0, hasMore: false },
		});

		const overridden = await dispatchEndpoint(registry, {
			method: "POST",
			path: unitListUrl,
			query: { communityId: "COMM_001", floorId: "F_COMM_001_001", row: 8 },
			body: { communityId: "COMM_002", floorId: "F_COMM_002_002", page: 1, row: 1 },
		});

		expect(overridden).toMatchObject({
			code: 0,
			data: {
				list: [
					expect.objectContaining({
						unitId: "U_COMM_002_002_01",
						floorId: "F_COMM_002_002",
						communityId: "COMM_002",
					}),
				],
				page: 1,
				pageSize: 1,
			},
		});
	});

	test("serves unit detail and preserves business error paths", async () => {
		const detail = await dispatchEndpoint(registry, {
			method: "GET",
			path: unitDetailUrl,
			query: { unitId: "U_COMM_001_001_01" },
		});

		expect(detail).toMatchObject({
			code: 0,
			data: {
				unitId: "U_COMM_001_001_01",
				unitNum: "1",
				floorId: "F_COMM_001_001",
				communityId: "COMM_001",
			},
		});

		const missing = await dispatchEndpoint(registry, {
			method: "GET",
			path: unitDetailUrl,
			query: {},
		});
		expect(missing).toMatchObject({
			code: 400,
			msg: expect.stringContaining("ID"),
			data: null,
		});

		const unknown = await dispatchEndpoint(registry, {
			method: "GET",
			path: unitDetailUrl,
			query: { unitId: "U_COMM_999_999_99" },
		});
		expect(unknown).toMatchObject({
			code: 404,
			msg: expect.any(String),
			data: null,
		});
	});

	test("serves room list through the legacy pagination envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: roomListUrl,
			query: { floorId: "F_COMM_001_001", unitId: "U_COMM_001_001_01", page: 1, row: 2 },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: 6,
				page: 1,
				pageSize: 2,
				hasMore: true,
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response).not.toHaveProperty("timestamp");
		expect(response.data.list).toHaveLength(2);
		for (const room of response.data.list) {
			expect(room).toMatchObject({
				roomId: expect.stringMatching(/^R_COMM_001_001_01_/),
				roomNum: expect.any(String),
				unitId: "U_COMM_001_001_01",
				floorId: "F_COMM_001_001",
				communityId: "COMM_001",
			});
		}
	});

	test("filters rooms and lets POST body override query parameters", async () => {
		const filtered = await dispatchEndpoint(registry, {
			method: "GET",
			path: roomListUrl,
			query: {
				communityId: "COMM_001",
				floorId: "F_COMM_001_001",
				unitId: "U_COMM_001_001_01",
				roomNum: "101",
				page: 1,
				row: 5,
			},
		});

		expect(filtered).toMatchObject({
			code: 0,
			data: {
				list: [expect.objectContaining({ roomId: "R_COMM_001_001_01_01", roomNum: "101" })],
				total: 1,
				page: 1,
				pageSize: 5,
				hasMore: false,
			},
		});

		const empty = await dispatchEndpoint(registry, {
			method: "GET",
			path: roomListUrl,
			query: { unitId: "U_COMM_001_999_99", page: 1, row: 5 },
		});
		expect(empty).toMatchObject({
			code: 0,
			data: { list: [], total: 0, hasMore: false },
		});

		const overridden = await dispatchEndpoint(registry, {
			method: "POST",
			path: roomListUrl,
			query: { communityId: "COMM_001", unitId: "U_COMM_001_001_01", row: 8 },
			body: { communityId: "COMM_002", unitId: "U_COMM_002_002_02", page: 1, row: 1 },
		});

		expect(overridden).toMatchObject({
			code: 0,
			data: {
				list: [
					expect.objectContaining({
						roomId: "R_COMM_002_002_02_01",
						unitId: "U_COMM_002_002_02",
						communityId: "COMM_002",
					}),
				],
				page: 1,
				pageSize: 1,
			},
		});
	});

	test("serves room detail and preserves business error paths", async () => {
		const detail = await dispatchEndpoint(registry, {
			method: "GET",
			path: roomDetailUrl,
			query: { roomId: "R_COMM_001_001_01_01" },
		});

		expect(detail).toMatchObject({
			code: 0,
			data: {
				roomId: "R_COMM_001_001_01_01",
				roomNum: "101",
				unitId: "U_COMM_001_001_01",
				floorId: "F_COMM_001_001",
				communityId: "COMM_001",
			},
		});

		const missing = await dispatchEndpoint(registry, {
			method: "GET",
			path: roomDetailUrl,
			query: {},
		});
		expect(missing).toMatchObject({
			code: 400,
			msg: expect.stringContaining("ID"),
			data: null,
		});

		const unknown = await dispatchEndpoint(registry, {
			method: "GET",
			path: roomDetailUrl,
			query: { roomId: "R_COMM_999_999_99_99" },
		});
		expect(unknown).toMatchObject({
			code: 404,
			msg: expect.any(String),
			data: null,
		});
	});
});
