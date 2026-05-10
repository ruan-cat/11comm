import { afterEach, describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

describe("P1 callComponent endpoints", () => {
	afterEach(() => {
		delete process.env.PHASE7_ALLOW_LEGACY_MUTATIONS;
	});

	test("registers /callComponent/core/list and /callComponent/ownerRepair.appraiseRepair in manifest", () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		expect(findEndpointDefinition(registry, "GET", "/callComponent/core/list")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/callComponent/core/list")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/callComponent/ownerRepair.appraiseRepair")).toBeTruthy();
	});

	test("serves /callComponent/core/list GET envelope with property-application name/type semantics", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const result = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/callComponent/core/list",
			query: { name: "apply_room_discount", type: "state" },
		});
		expect(result).toMatchObject({ code: 0, msg: "query success" });
		expect(result.data).toMatchObject([
			{ statusCd: "0", name: "待提交" },
			{ statusCd: "1", name: "待验房" },
			{ statusCd: "2", name: "待审核" },
			{ statusCd: "3", name: "验房不通过" },
			{ statusCd: "4", name: "审批通过" },
			{ statusCd: "5", name: "审批不通过" },
			{ statusCd: "6", name: "已取消" },
		]);
	});

	test("serves /callComponent/core/list GET envelope with unknown name/type as empty array", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const result = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/callComponent/core/list",
			query: { name: "pay_fee_config", type: "fee_type_cd" },
		});
		expect(result).toMatchObject({ code: 0, msg: "query success" });
		expect(result.data).toEqual([]);
	});

	test("serves /callComponent/core/list GET envelope with repair_status domain", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const result = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/callComponent/core/list",
			query: { domain: "repair_status" },
		});
		expect(result).toMatchObject({ code: 0, msg: "query success" });
		expect(result.data.list).toMatchObject([
			{ statusCd: "PENDING", name: "待派单" },
			{ statusCd: "ASSIGNED", name: "已派单" },
			{ statusCd: "IN_PROGRESS", name: "处理中" },
			{ statusCd: "COMPLETED", name: "已完成" },
			{ statusCd: "CANCELLED", name: "已取消" },
		]);
		expect(result.data.data).toEqual(result.data.list);
	});

	test("serves /callComponent/core/list POST envelope with repair_type domain", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const result = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/callComponent/core/list",
			body: { domain: "repair_type" },
		});
		expect(result).toMatchObject({ code: 0, msg: "query success" });
		// repair_type returns 7 items; verify at least the first few
		expect(result.data.list.length).toBe(7);
		expect(result.data.data).toEqual(result.data.list);
		expect(result.data.list.slice(0, 3)).toMatchObject([
			{ statusCd: "1001", name: "水电维修" },
			{ statusCd: "1002", name: "门窗维修" },
			{ statusCd: "1003", name: "空调维修" },
		]);
	});

	test("serves /callComponent/core/list with empty domain returns empty array", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const result = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/callComponent/core/list",
			query: { domain: "" },
		});
		expect(result).toMatchObject({ code: 0, msg: "query success" });
		expect(result.data).toEqual([]);
	});

	test("serves /callComponent/core/list with unknown domain returns empty array", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const result = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/callComponent/core/list",
			query: { domain: "unknown_domain" },
		});
		expect(result).toMatchObject({ code: 0, msg: "query success" });
		expect(result.data).toEqual({ list: [], data: [] });
	});

	test("serves /callComponent/core/list with unknown name and type params as empty array", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const result = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/callComponent/core/list",
			query: { name: "repair", type: "status" },
		});
		expect(result).toMatchObject({ code: 0, msg: "query success" });
		expect(result.data).toEqual([]);
	});

	test("blocks /callComponent/ownerRepair.appraiseRepair by default with 409 PHASE7_MUTATION_GUARDED", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const result = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/callComponent/ownerRepair.appraiseRepair",
			body: { repairId: "REPAIR_001", context: "服务很好" },
		});
		expect(result).toMatchObject({
			code: 409,
			msg: expect.stringContaining("Phase7"),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
	});

	test("allows /callComponent/ownerRepair.appraiseRepair when PHASE7_ALLOW_LEGACY_MUTATIONS=1", async () => {
		process.env.PHASE7_ALLOW_LEGACY_MUTATIONS = "1";
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const result = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/callComponent/ownerRepair.appraiseRepair",
			body: { repairId: "REPAIR_001", context: "服务很好" },
		});
		expect(result).toMatchObject({ code: 0, msg: "评价成功" });
		expect(result.data).toMatchObject({ success: true });
	});

	test("returns legacy 404 envelope when /callComponent/ownerRepair.appraiseRepair targets missing repair", async () => {
		process.env.PHASE7_ALLOW_LEGACY_MUTATIONS = "1";
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const result = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/callComponent/ownerRepair.appraiseRepair",
			body: { repairId: "REPAIR_MISSING", context: "服务很好" },
		});
		expect(result).toMatchObject({ code: 404, msg: "repair not found", data: null });
	});

	test("returns 400 when /callComponent/ownerRepair.appraiseRepair missing repairId (guard still fires first)", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const result = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/callComponent/ownerRepair.appraiseRepair",
			body: { context: "服务很好" },
		});
		// guard fires first before validation
		expect(result).toMatchObject({ code: 409, errorCode: "PHASE7_MUTATION_GUARDED" });
	});

	test("returns 400 when /callComponent/ownerRepair.appraiseRepair missing context (guard still fires first)", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const result = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/callComponent/ownerRepair.appraiseRepair",
			body: { repairId: "REPAIR_001" },
		});
		// guard fires first before validation
		expect(result).toMatchObject({ code: 409, errorCode: "PHASE7_MUTATION_GUARDED" });
	});
});
