import { afterEach, describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

describe("repair legacy endpoints wave4a", () => {
	afterEach(() => {
		delete process.env.PHASE7_ALLOW_LEGACY_MUTATIONS;
	});

	test("registers the Wave 4A repair compatibility slice without blocked leftovers", () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		expect(findEndpointDefinition(registry, "GET", "/app/ownerRepair.listOwnerRepairs")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.listOwnerRepairs")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/ownerRepair.queryOwnerRepair")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.queryOwnerRepair")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.saveOwnerRepair")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/repairSetting.listRepairSettings")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/repairSetting.listRepairSettings")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/dict.queryRepairStates")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/dict.queryRepairStates")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/dict.queryPayTypes")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/dict.queryPayTypes")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/ownerRepair.getRepairStatistics")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.getRepairStatistics")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/ownerRepair.listRepairStaffRecords")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.listRepairStaffRecords")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/ownerRepair.listRepairStaffs")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.listRepairStaffs")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/repair.listRepairTypeUsers")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/repair.listRepairTypeUsers")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/resourceStore.listResources")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/resourceStore.listResources")).toBeTruthy();

		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.updateOwnerRepair")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.repairDispatch")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.repairFinish")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.repairEnd")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.repairStart")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.repairStop")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.grabbingRepair")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/repair.replyRepairAppraise")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/ownerRepair.listStaffRepairs")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/resourceStoreType.listResourceStoreTypes")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/owner.queryOwnerCars")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/machine/openDoor")).toBeUndefined();
	});

	test("blocks owner repair create by default in phase7 execution guard", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/ownerRepair.saveOwnerRepair",
			body: {
				title: "Water pipe repair",
				context: "Kitchen pipe leaking",
				repairName: "Alice",
				tel: "13800000000",
				address: "Building 1 Room 101",
				repairType: "1001",
				communityId: "COMM_001",
			},
		});

		expect(response).toMatchObject({
			code: 409,
			msg: expect.stringContaining("Phase7"),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
	});

	test("serves list, detail, settings and dictionary legacy shapes", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const list = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/ownerRepair.listOwnerRepairs",
			query: { page: 1, row: 5, communityId: "COMM_001" },
		});
		expect(list).toMatchObject({ code: 0, data: { ownerRepairs: expect.any(Array), total: expect.any(Number) } });
		expect(list.data.ownerRepairs[0]).toMatchObject({
			repairId: expect.any(String),
			repairName: expect.any(String),
			statusCd: expect.any(String),
			statusName: expect.any(String),
		});

		const firstRepairId = list.data.ownerRepairs[0].repairId;
		const detail = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/ownerRepair.queryOwnerRepair",
			query: { repairId: firstRepairId },
		});
		expect(detail.data.ownerRepair).toMatchObject({ repairId: firstRepairId });

		const settings = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/repairSetting.listRepairSettings",
			query: { page: 1, row: 10, publicArea: "T" },
		});
		expect(settings.data).toEqual(expect.any(Array));
		expect(settings.data[0]).toMatchObject({ repairType: expect.any(String), repairTypeName: expect.any(String) });

		const dict = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/dict.queryRepairStates",
		});
		expect(dict.data[0]).toMatchObject({ statusCd: expect.any(String), name: expect.any(String) });

		const payTypes = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/dict.queryPayTypes",
		});
		expect(payTypes).toEqual({
			code: 0,
			msg: "查询成功",
			data: expect.arrayContaining([
				expect.objectContaining({ statusCd: expect.any(String), name: expect.any(String) }),
			]),
		});

		const statistics = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/ownerRepair.getRepairStatistics",
			query: { ignored: "yes" },
		});
		expect(statistics).toMatchObject({
			code: 0,
			msg: "获取统计数据成功",
			data: {
				total: expect.any(Number),
				statusStats: expect.any(Object),
				typeStats: expect.any(Object),
				monthlyStats: expect.any(Object),
				avgResponseTime: expect.any(String),
				satisfactionRate: expect.any(String),
			},
		});

		const staffRecords = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/ownerRepair.listRepairStaffRecords",
			query: { repairId: firstRepairId },
		});
		expect(staffRecords).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: {
				staffRecords: expect.arrayContaining([
					expect.objectContaining({
						repairId: firstRepairId,
						ruId: expect.any(String),
						staffId: expect.any(String),
						staffName: expect.any(String),
						statusCd: expect.any(String),
						statusName: expect.any(String),
						startTime: expect.any(String),
					}),
				]),
			},
		});

		const staffs = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/ownerRepair.listRepairStaffs",
			query: { repairType: "1001" },
		});
		expect(staffs).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: {
				staffs: expect.arrayContaining([
					expect.objectContaining({
						staffId: expect.any(String),
						staffName: expect.any(String),
						repairTypes: expect.arrayContaining(["水电维修"]),
					}),
				]),
			},
		});

		const users = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/repair.listRepairTypeUsers",
			query: { repairType: "1001" },
		});
		expect(users).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: {
				users: expect.arrayContaining([
					expect.objectContaining({
						userId: expect.any(String),
						userName: expect.any(String),
					}),
				]),
			},
		});

		const resources = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/resourceStore.listResources",
			query: { rstId: "RST_001_01" },
		});
		expect(resources).toMatchObject({
			code: 0,
			msg: "查询成功",
			data: {
				resources: expect.arrayContaining([
					expect.objectContaining({
						resId: expect.any(String),
						resName: expect.any(String),
						resTypeName: "水管类",
					}),
				]),
				total: expect.any(Number),
			},
		});
		expect(resources.data.resources.every((item: { resTypeName: string }) => item.resTypeName === "水管类")).toBe(true);
	});

	test("returns an empty legacy list envelope for unmatched owner repair filters", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/ownerRepair.listOwnerRepairs",
			query: { page: 2, row: 3, communityId: "UNKNOWN_COMMUNITY" },
		});

		expect(response).toEqual({
			code: 0,
			msg: "query success",
			data: {
				ownerRepairs: [],
				total: 0,
				page: 2,
				row: 3,
			},
		});
	});

	test("returns legacy error envelopes for missing and unknown owner repair detail ids", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		await expect(
			dispatchEndpoint(registry, {
				method: "GET",
				path: "/app/ownerRepair.queryOwnerRepair",
				query: {},
			}),
		).resolves.toMatchObject({
			code: 400,
			msg: "repairId is required",
			data: null,
		});

		await expect(
			dispatchEndpoint(registry, {
				method: "GET",
				path: "/app/ownerRepair.queryOwnerRepair",
				query: { repairId: "UNKNOWN_REPAIR" },
			}),
		).resolves.toMatchObject({
			code: 404,
			msg: "repair not found",
			data: null,
		});
	});

	test("returns legacy error envelopes for missing and unknown repair staff record ids", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		await expect(
			dispatchEndpoint(registry, {
				method: "GET",
				path: "/app/ownerRepair.listRepairStaffRecords",
				query: {},
			}),
		).resolves.toEqual({
			code: 400,
			msg: "维修工单ID不能为空",
			data: null,
			requestId: undefined,
			errorCode: undefined,
		});

		await expect(
			dispatchEndpoint(registry, {
				method: "GET",
				path: "/app/ownerRepair.listRepairStaffRecords",
				query: { repairId: "UNKNOWN_REPAIR" },
			}),
		).resolves.toEqual({
			code: 404,
			msg: "维修工单不存在",
			data: null,
			requestId: undefined,
			errorCode: undefined,
		});
	});

	test("keeps repair settings empty page and dictionary unknown payload behavior compatible", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const settings = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/repairSetting.listRepairSettings",
			query: { page: 99, row: 10, publicArea: "T" },
		});
		expect(settings).toEqual({
			code: 0,
			msg: "query success",
			data: [],
		});

		const states = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/dict.queryRepairStates",
			body: { domain: "unknown_repair_state_domain" },
		});
		expect(states).toMatchObject({
			code: 0,
			msg: "query success",
			data: expect.arrayContaining([{ statusCd: "10001", name: expect.any(String) }]),
		});
	});

	test("supports POST body overriding query for repair readonly legacy endpoints", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const list = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/ownerRepair.listOwnerRepairs",
			query: { communityId: "UNKNOWN_COMMUNITY", page: 1, row: 1 },
			body: { communityId: "COMM_001", page: 1, row: 1 },
		});
		expect(list).toMatchObject({
			code: 0,
			data: {
				ownerRepairs: [
					expect.objectContaining({
						repairId: expect.any(String),
						communityId: "COMM_001",
					}),
				],
				total: expect.any(Number),
				page: 1,
				row: 1,
			},
		});

		const detail = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/ownerRepair.queryOwnerRepair",
			query: { repairId: "UNKNOWN_REPAIR" },
			body: { repairId: "REPAIR_001" },
		});
		expect(detail).toMatchObject({
			code: 0,
			data: { ownerRepair: { repairId: "REPAIR_001" } },
		});

		const settings = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/repairSetting.listRepairSettings",
			query: { publicArea: "T", page: 1, row: 1 },
			body: { publicArea: "F", page: 1, row: 1 },
		});
		expect(settings).toMatchObject({
			code: 0,
			data: [expect.objectContaining({ publicArea: "F" })],
		});

		const records = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/ownerRepair.listRepairStaffRecords",
			query: { repairId: "UNKNOWN_REPAIR" },
			body: { repairId: "REPAIR_001" },
		});
		expect(records).toMatchObject({
			code: 0,
			data: { staffRecords: [expect.objectContaining({ repairId: "REPAIR_001" })] },
		});

		const staffs = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/ownerRepair.listRepairStaffs",
			query: { repairType: "unknown" },
			body: { repairType: "1001" },
		});
		expect(staffs).toMatchObject({
			code: 0,
			data: {
				staffs: expect.arrayContaining([
					expect.objectContaining({ staffId: expect.any(String), staffName: expect.any(String) }),
				]),
			},
		});

		const users = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/repair.listRepairTypeUsers",
			query: { repairType: "unknown" },
			body: { repairType: "1001" },
		});
		expect(users).toMatchObject({
			code: 0,
			data: {
				users: expect.arrayContaining([
					expect.objectContaining({ userId: expect.any(String), userName: expect.any(String) }),
				]),
			},
		});

		const resources = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/resourceStore.listResources",
			query: { rstId: "unknown" },
			body: { rstId: "RST_001_01" },
		});
		expect(resources).toMatchObject({
			code: 0,
			data: {
				resources: expect.arrayContaining([expect.objectContaining({ resTypeName: "水管类" })]),
				total: expect.any(Number),
			},
		});
	});

	test("allows owner repair create only when legacy mutations are explicitly enabled", async () => {
		process.env.PHASE7_ALLOW_LEGACY_MUTATIONS = "1";
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const created = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/ownerRepair.saveOwnerRepair",
			body: {
				title: "Water pipe repair",
				context: "Kitchen pipe leaking",
				repairName: "Alice",
				tel: "13800000000",
				address: "Building 1 Room 101",
				repairType: "1001",
				communityId: "COMM_001",
			},
		});
		expect(created.data.ownerRepair).toMatchObject({
			repairId: expect.any(String),
			statusCd: "10001",
			communityId: "COMM_001",
		});
	});
});
