import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { renovationLegacyEndpointDefinitions } from "../../server/modules/renovation/legacy-endpoints";
import { renovationLegacyAdapterEvidence } from "../../server/modules/renovation/legacy-adapter";

const readonlyEndpoints = [
	"/app/roomRenovation/queryRoomRenovation",
	"/app/roomRenovation/queryRoomRenovationRecord",
	"/app/roomRenovation/queryRoomRenovationRecordDetail",
] as const;

const guardedEndpoints = [
	"/app/roomRenovation/updateRoomToExamine",
	"/app/roomRenovation/saveRoomRenovationDetail",
	"/app/roomRenovation/updateRoomRenovationState",
	"/app/roomRenovation/updateRoomDecorationRecord",
	"/app/roomRenovation/deleteRoomRenovationRecord",
] as const;

describe("renovation legacy endpoints", () => {
	const registry = createEndpointRegistry(renovationLegacyEndpointDefinitions);

	test.each(readonlyEndpoints)("registers GET/POST for readonly endpoint %s", (url) => {
		expect(findEndpointDefinition(registry, "GET", url)).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
	});

	test.each(guardedEndpoints)("registers POST-only guarded endpoint %s", (url) => {
		expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", url)).toBeUndefined();
	});

	test("queryRoomRenovation returns deterministic compat seed list", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/roomRenovation/queryRoomRenovation",
			query: { communityId: "COMM_001", page: 1, row: 10 },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.stringContaining("查询装修申请列表成功"),
		});
		expect(response.data).toMatchObject({
			list: expect.any(Array),
			total: 5,
			page: 1,
			pageSize: 10,
			hasMore: false,
		});
		expect(response.data.list).toHaveLength(5);
		expect(response.data.list[0].rId).toBe("REN_0001");
	});

	test("queryRoomRenovation supports state and roomName filters", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/roomRenovation/queryRoomRenovation",
			body: { communityId: "COMM_001", state: "3000", roomName: "102" },
		});

		expect(response.code).toBe(0);
		expect(response.data.list).toHaveLength(1);
		expect(response.data.list[0].roomName).toBe("1栋102B室");
	});

	test("queryRoomRenovationRecord returns records by rId", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/roomRenovation/queryRoomRenovationRecord",
			body: { rId: "REN_0003", communityId: "COMM_001" },
		});

		expect(response.code).toBe(0);
		expect(response.data.list).toHaveLength(2);
		expect(response.data.list[0].recordId).toBe("RR_0003");
	});

	test("queryRoomRenovationRecord returns 400 when rId is missing", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/roomRenovation/queryRoomRenovationRecord",
			body: { communityId: "COMM_001" },
		});

		expect(response.code).toBe(400);
		expect(response.msg).toContain("rId 不能为空");
	});

	test("queryRoomRenovationRecordDetail returns media by recordId", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/roomRenovation/queryRoomRenovationRecordDetail",
			query: { recordId: "RR_0003" },
		});

		expect(response.code).toBe(0);
		expect(response.data).toHaveLength(1);
		expect(response.data[0].detailId).toBe("RM_VIDEO_0003");
		expect(response.data[0].relTypeCd).toBe(21000);
	});

	test("queryRoomRenovationRecordDetail returns 400 when recordId is missing", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/roomRenovation/queryRoomRenovationRecordDetail",
			query: {},
		});

		expect(response.code).toBe(400);
		expect(response.msg).toContain("recordId 不能为空");
	});

	test.each(guardedEndpoints)("POST %s returns PHASE7_MUTATION_GUARDED without real mutation", async (url) => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: url,
			body: { rId: "REN_0001", recordId: "RR_0001" },
		});

		expect(response).toMatchObject({
			code: 409,
			msg: expect.stringContaining("Phase7 mutation guard"),
			errorCode: "PHASE7_MUTATION_GUARDED",
			data: null,
		});
	});

	test("evidence lists exact endpoints and guarded endpoints", () => {
		expect(renovationLegacyAdapterEvidence.endpoints).toEqual(readonlyEndpoints);
		expect(renovationLegacyAdapterEvidence.guardedEndpoints).toEqual(guardedEndpoints);
		expect(renovationLegacyAdapterEvidence.defaultWriteBehavior).toBe("blocked-for-execution");
	});
});
