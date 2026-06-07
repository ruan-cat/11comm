import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

describe("item-release legacy endpoints phase7 readonly plus guarded audit batch21", () => {
	const registry = createEndpointRegistry(runtimeEndpointDefinitions);

	test("registers readonly exact handlers and the audit POST guarded exact handler", () => {
		expect(findEndpointDefinition(registry, "GET", "/app/itemRelease.getItemRelease")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/itemRelease.getItemRelease")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/itemRelease.getItemReleaseRes")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/itemRelease.getItemReleaseRes")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/itemRelease.queryOaWorkflowUser")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/itemRelease.queryOaWorkflowUser")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/itemRelease.queryUndoItemReleaseV2")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/itemRelease.queryUndoItemReleaseV2")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/itemRelease.queryFinishItemReleaseV2")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/itemRelease.queryFinishItemReleaseV2")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/itemRelease.auditItemRelease")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/itemRelease.auditItemRelease")).toBeUndefined();
	});

	test("blocks auditItemRelease by default with the legacy guarded mutation envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/itemRelease.auditItemRelease",
			body: {
				irId: "IR_00001",
				flowId: "FLOW_00001",
				taskId: "TASK_00001",
				auditCode: "1100",
				auditMessage: "approved in test",
			},
		});

		expect(response).toMatchObject({
			code: 409,
			msg: expect.stringContaining("itemRelease.auditItemRelease"),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("GET returns the old paginated code msg data envelope with page and row defaulting to 1", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/itemRelease.getItemRelease",
			query: { irId: "IR_00001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: [expect.objectContaining({ irId: "IR_00001" })],
				total: 1,
				page: 1,
				pageSize: 1,
				hasMore: false,
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("GET returns release resource detail rows paginated by irId", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/itemRelease.getItemReleaseRes",
			query: { irId: "IR_00001", page: 1, row: 20 },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: [expect.objectContaining({ resId: expect.any(String), resName: expect.any(String), amount: 1 })],
				total: 1,
				page: 1,
				pageSize: 20,
				hasMore: false,
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("queryOaWorkflowUser returns comments by id and ignores OA flow fields", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/itemRelease.queryOaWorkflowUser",
			query: {
				id: "IR_00001",
				flowId: "IGNORED_FLOW",
				communityId: "IGNORED_COMMUNITY",
				page: 1,
				row: 1,
			},
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: [expect.objectContaining({ staffName: expect.any(String), context: expect.any(String) })],
				total: 2,
				page: 1,
				pageSize: 1,
				hasMore: true,
			},
		});
	});

	test("POST body input can query resource details without widening write coverage", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/itemRelease.getItemReleaseRes",
			query: { irId: "UNKNOWN" },
			body: { irId: "IR_F_00001", page: 1, row: 1 },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: [expect.objectContaining({ resId: expect.any(String), resName: expect.any(String), amount: 1 })],
				total: 1,
				page: 1,
				pageSize: 1,
				hasMore: false,
			},
		});
	});

	test("POST reads merged body input without widening write coverage", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/itemRelease.getItemRelease",
			body: { irId: "IR_F_00001", page: 1, row: 1 },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: [expect.objectContaining({ irId: "IR_F_00001" })],
				total: 1,
				page: 1,
				pageSize: 1,
				hasMore: false,
			},
		});
	});

	test("GET returns undo item-release V2 task list with row defaulting to 10", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/itemRelease.queryUndoItemReleaseV2",
			query: { page: 1 },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.arrayContaining([
					expect.objectContaining({
						irId: "IR_00001",
						flowId: "FLOW_00001",
						taskId: "TASK_00001",
						action: "Audit",
					}),
				]),
				total: 18,
				page: 1,
				pageSize: 10,
				hasMore: true,
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("POST body input returns finished item-release V2 task list without widening audit coverage", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/itemRelease.queryFinishItemReleaseV2",
			query: { page: 2, row: 1 },
			body: { page: 1, row: 2 },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.arrayContaining([
					expect.objectContaining({
						irId: "IR_F_00001",
						flowId: "FLOW_F_00001",
						action: "View",
					}),
				]),
				total: 12,
				page: 1,
				pageSize: 2,
				hasMore: true,
			},
		});
	});
});
