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

		expect(findEndpointDefinition(registry, "POST", "/app/ownerRepair.repairDispatch")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/ownerRepair.listStaffRepairs")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/resourceStore.listResources")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/resourceStoreType.listResourceStoreTypes")).toBeUndefined();
		expect(findEndpointDefinition(registry, "POST", "/app/workorder/create")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/owner.queryOwnerCars")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/machine/listMachineRecords")).toBeUndefined();
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
