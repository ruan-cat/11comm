import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

describe("inspection legacy endpoints phase7 readonly", () => {
	test("registers only the selected readonly inspection endpoints", () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const path of [
			"/app/staff.listStaffs",
			"/app/inspection.getTodayReport",
			"/app/inspection.listInspectionItemTitles",
			"/app/inspection.listInspectionTasks",
			"/app/inspection.listInspectionTaskDetails",
		]) {
			expect(findEndpointDefinition(registry, "GET", path)).toBeTruthy();
			expect(findEndpointDefinition(registry, "POST", path)).toBeTruthy();
		}

		expect(findEndpointDefinition(registry, "POST", "/app/inspection.submitInspection")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/inspection.submitInspection")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/inspection.transferTask")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/inspection.transferTask")).toBeUndefined();
	});

	test("guards inspection submit write and keeps the path POST-only", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/inspection.submitInspection",
			query: { taskId: "QUERY_TASK_SHOULD_NOT_MATTER" },
			body: {
				taskId: "TASK_001",
				taskDetailId: "DETAIL_TASK_001_001",
				description: "巡检完成",
				photos: ["https://example.test/inspection-a.png"],
			},
		});

		expect(response).toMatchObject({
			code: 409,
			msg: expect.stringContaining("inspection.submitInspection"),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
	});

	test("guards inspection transfer write and keeps the path POST-only", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/inspection.transferTask",
			query: { taskId: "QUERY_TASK_SHOULD_NOT_MATTER" },
			body: {
				taskId: "TASK_001",
				staffName: "王巡检",
			},
		});

		expect(response).toMatchObject({
			code: 409,
			msg: expect.stringContaining("inspection.transferTask"),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
	});

	test("serves staff list with legacy envelope and no admin response fields", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/staff.listStaffs",
			query: { communityId: "COMM_001" },
		});

		expect(response).toEqual({
			code: 0,
			msg: "查询成功",
			data: expect.arrayContaining([
				expect.objectContaining({ userId: expect.any(String), userName: expect.any(String) }),
			]),
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response).not.toHaveProperty("timestamp");
	});

	test("serves staff list with POST body input compatibility", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/staff.listStaffs",
			body: { communityId: "COMM_001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: expect.arrayContaining([
				expect.objectContaining({ userId: expect.any(String), userName: expect.any(String) }),
			]),
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response).not.toHaveProperty("timestamp");
	});

	test("serves today's report as deterministic readonly rows", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/inspection.getTodayReport",
			body: { communityId: "COMM_001", queryTime: "2026-06-06" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: expect.arrayContaining([
				expect.objectContaining({
					staffId: expect.any(String),
					staffName: expect.any(String),
					finishCount: expect.any(Number),
					waitCount: expect.any(Number),
				}),
			]),
		});
	});

	test("serves inspection item title pagination and keeps POST body over query", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/inspection.listInspectionItemTitles",
			query: { itemId: "ITEM_002", page: 1, row: 1 },
			body: { itemId: "ITEM_001", row: 2 },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: {
				list: expect.arrayContaining([
					expect.objectContaining({
						titleId: expect.any(String),
						itemTitle: expect.any(String),
						titleType: expect.any(String),
						inspectionItemTitleValueDtos: expect.any(Array),
					}),
				]),
				total: 3,
				page: 1,
				pageSize: 2,
				hasMore: true,
			},
		});
		expect(response.data.list).toHaveLength(2);
	});

	test("returns legacy failure when itemId is missing", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/inspection.listInspectionItemTitles",
			query: { page: 1, row: 10 },
		});

		expect(response).toEqual({
			code: 400,
			msg: "巡检项ID不能为空",
			data: null,
			requestId: undefined,
			errorCode: undefined,
		});
	});

	test("serves inspection task pagination with legacy filters and default page size", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/inspection.listInspectionTasks",
			query: { moreState: "20200405,20200408", canReexamine: "2000", planInsTime: "2026-06-07" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: {
				list: expect.arrayContaining([
					expect.objectContaining({
						taskId: expect.any(String),
						inspectionPlanId: expect.any(String),
						inspectionPlanName: expect.any(String),
						planInsTime: expect.stringMatching(/^2026-06-07/),
						state: expect.stringMatching(/^(20200405|20200408)$/),
					}),
				]),
				total: 2,
				page: 1,
				pageSize: 10,
				hasMore: false,
			},
		});
		expect(response.data.list).toHaveLength(2);
	});

	test("serves inspection task list with POST body input compatibility", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/inspection.listInspectionTasks",
			query: { moreState: "20200406", row: 1 },
			body: { moreState: "20200405", page: 1, row: 2 },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: {
				list: expect.arrayContaining([expect.objectContaining({ state: "20200405" })]),
				total: 3,
				page: 1,
				pageSize: 2,
				hasMore: true,
			},
		});
		expect(response.data.list).toHaveLength(2);
		expect(response.data.list.every((task: { state: string }) => task.state === "20200405")).toBe(true);
	});

	test("serves inspection task details by taskId before other filters with default row size", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/inspection.listInspectionTaskDetails",
			query: { taskId: "TASK_001", inspectionId: "INSP_002" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: {
				list: expect.arrayContaining([
					expect.objectContaining({
						taskDetailId: "DETAIL_TASK_001_001",
						taskId: "TASK_001",
						inspectionId: "INSP_001",
						pointStartTime: "09:00",
					}),
				]),
				total: 4,
				page: 1,
				pageSize: 100,
				hasMore: false,
			},
		});
	});

	test("returns empty task detail pagination for unknown taskId", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/inspection.listInspectionTaskDetails",
			body: { taskId: "TASK_UNKNOWN" },
		});

		expect(response).toEqual({
			code: 0,
			msg: "查询成功",
			data: {
				list: [],
				total: 0,
				page: 1,
				pageSize: 100,
				hasMore: false,
			},
		});
	});

	test("serves inspection task details with planUserId fallback expansion and qrCodeTime hour filtering", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/inspection.listInspectionTaskDetails",
			query: {
				inspectionId: "INSP_004",
				planUserId: "USER_001",
				qrCodeTime: "09:30:00",
				state: "20200406",
				row: 10,
			},
		});

		expect(response).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: {
				list: expect.arrayContaining([
					expect.objectContaining({
						pointStartTime: "09:00",
						state: "20200406",
					}),
				]),
				total: 10,
				page: 1,
				pageSize: 10,
				hasMore: false,
			},
		});
		expect(response.data.list.every((detail: { pointStartTime?: string }) => detail.pointStartTime === "09:00")).toBe(
			true,
		);
	});
});
