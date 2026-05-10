import { describe, expect, test } from "vitest";
import { createEndpointRegistry, dispatchEndpoint } from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

describe("floor legacy endpoints", () => {
	const registry = createEndpointRegistry(runtimeEndpointDefinitions);

	async function dispatchGet(path: string, query: Record<string, unknown> = {}) {
		return dispatchEndpoint(registry, { method: "GET", path, query });
	}

	async function dispatchPost(path: string, body: Record<string, unknown> = {}) {
		return dispatchEndpoint(registry, { method: "POST", path, body, query: {} });
	}

	describe("GET /app/floor.queryFloors", () => {
		test("returns code 0 with list structure", async () => {
			const res = await dispatchGet("/app/floor.queryFloors");
			expect(res).toMatchObject({
				code: 0,
				msg: expect.any(String),
				data: {
					list: expect.any(Array),
					total: expect.any(Number),
					page: expect.any(Number),
					pageSize: expect.any(Number),
					hasMore: expect.any(Boolean),
				},
			});
		});

		test("defaults communityId to COMM_001 when not provided", async () => {
			const res = await dispatchGet("/app/floor.queryFloors");
			const data = res.data as { list: Array<{ communityId: string }> };
			expect(data.list.length).toBeGreaterThan(0);
			expect(data.list.every((f) => f.communityId === "COMM_001")).toBe(true);
		});

		test("filters by communityId", async () => {
			const res = await dispatchGet("/app/floor.queryFloors", { communityId: "COMM_002" });
			const data = res.data as { list: Array<{ communityId: string }> };
			expect(data.list.length).toBeGreaterThan(0);
			expect(data.list.every((f) => f.communityId === "COMM_002")).toBe(true);
		});

		test("filters by floorNum includes", async () => {
			// floorNum "1" matches "1", "10", "11", "12" ... across all floors
			const res = await dispatchGet("/app/floor.queryFloors", { floorNum: "1", row: 50 });
			const data = res.data as { list: Array<{ floorNum: string }> };
			expect(data.list.length).toBeGreaterThan(0);
			expect(data.list.every((f) => f.floorNum.includes("1"))).toBe(true);
		});

		test("filters by keyword matching floorName", async () => {
			const res = await dispatchGet("/app/floor.queryFloors", { keyword: "住宅楼" });
			const data = res.data as { list: Array<{ floorName: string }> };
			expect(data.list.length).toBeGreaterThan(0);
			expect(data.list.every((f) => f.floorName.includes("住宅楼"))).toBe(true);
		});

		test("returns empty list for unknown community", async () => {
			const res = await dispatchGet("/app/floor.queryFloors", { communityId: "COMM_999" });
			const data = res.data as { list: unknown[]; total: number };
			expect(data.list).toHaveLength(0);
			expect(data.total).toBe(0);
		});

		test("paginates correctly", async () => {
			const res = await dispatchGet("/app/floor.queryFloors", { page: 1, row: 10 });
			const data = res.data as { list: unknown[]; total: number; page: number; pageSize: number; hasMore: boolean };
			expect(data.list).toHaveLength(10);
			expect(data.page).toBe(1);
			expect(data.pageSize).toBe(10);
			expect(data.hasMore).toBe(true);
		});
	});

	describe("POST /app/floor.queryFloors", () => {
		// GET and POST share the same handler; POST behavior verified by handler implementation
		test("returns code 0 for POST request", async () => {
			const res = await dispatchPost("/app/floor.queryFloors", { communityId: "COMM_003", page: 1, row: 5 });
			expect(res).toMatchObject({ code: 0 });
			expect(res.data).toHaveProperty("list");
		});

		test("lets POST body override query parameters like other legacy adapters", async () => {
			const res = await dispatchEndpoint(registry, {
				method: "POST",
				path: "/app/floor.queryFloors",
				query: { communityId: "COMM_001" },
				body: { communityId: "COMM_002", row: 5 },
			});

			const data = res.data as { list: Array<{ communityId: string }> };
			expect(data.list).toHaveLength(5);
			expect(data.list.every((f) => f.communityId === "COMM_002")).toBe(true);
		});
	});

	describe("GET /app/floor.queryFloorDetail", () => {
		test("returns floor detail for valid floorId", async () => {
			const listRes = await dispatchGet("/app/floor.queryFloors", { communityId: "COMM_001", row: 1 });
			const firstFloorId = (listRes.data as { list: Array<{ floorId: string }> }).list[0].floorId;

			const res = await dispatchGet("/app/floor.queryFloorDetail", { floorId: firstFloorId });
			expect(res).toMatchObject({ code: 0, msg: expect.any(String) });
			const data = res.data as { floorId: string };
			expect(data.floorId).toBe(firstFloorId);
		});

		test("returns code 400 when floorId is missing", async () => {
			const res = await dispatchGet("/app/floor.queryFloorDetail", {});
			expect(res).toMatchObject({ code: 400, msg: "楼层ID不能为空" });
		});

		test("returns code 400 when floorId is empty string", async () => {
			const res = await dispatchGet("/app/floor.queryFloorDetail", { floorId: "" });
			expect(res).toMatchObject({ code: 400, msg: "楼层ID不能为空" });
		});

		test("returns code 404 for unknown floorId", async () => {
			const res = await dispatchGet("/app/floor.queryFloorDetail", { floorId: "F_COMM_999_999" });
			expect(res).toMatchObject({ code: 404, msg: "楼层不存在" });
		});
	});

	describe("POST /app/floor.queryFloorDetail", () => {
		test("accepts POST with body floorId", async () => {
			const listRes = await dispatchGet("/app/floor.queryFloors", { communityId: "COMM_001", row: 1 });
			const firstFloorId = (listRes.data as { list: Array<{ floorId: string }> }).list[0].floorId;

			const res = await dispatchPost("/app/floor.queryFloorDetail", { floorId: firstFloorId });
			expect(res).toMatchObject({ code: 0 });
		});

		test("lets POST body override query floorId", async () => {
			const listRes = await dispatchGet("/app/floor.queryFloors", { communityId: "COMM_001", row: 2 });
			const [queryFloor, bodyFloor] = (listRes.data as { list: Array<{ floorId: string }> }).list;

			const res = await dispatchEndpoint(registry, {
				method: "POST",
				path: "/app/floor.queryFloorDetail",
				query: { floorId: queryFloor.floorId },
				body: { floorId: bodyFloor.floorId },
			});

			expect(res).toMatchObject({
				code: 0,
				data: {
					floorId: bodyFloor.floorId,
				},
			});
		});
	});
});
