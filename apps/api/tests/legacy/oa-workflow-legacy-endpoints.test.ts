import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { oaWorkflowLegacyEndpointDefinitions } from "../../server/modules/oa-workflow/legacy-endpoints";

const oaWorkflowReadonlyUrls = [
	"/app/oa/workflow/query",
	"/app/oa/workflow/form/query",
	"/app/oa/workflow/form/data/query",
	"/app/oa/workflow/task/undo/query",
	"/app/oa/workflow/task/his/query",
	"/app/oa/workflow/user/query",
	"/app/oa/workflow/image/run",
	"/app/oa/workflow/task/next",
	"/app/oa/workflow/undo/next-deal-user",
] as const;

const oaWorkflowGuardedWriteUrls = [
	"/app/oa/workflow/form/save",
	"/app/oa/workflow/form/update",
	"/app/oa/workflow/audit",
	"/app/oa/workflow/undo/audit",
] as const;

describe("oa-workflow legacy endpoints phase7 readonly and guarded write slice", () => {
	const registry = createEndpointRegistry(oaWorkflowLegacyEndpointDefinitions);

	test("registers exactly the oa-workflow readonly handlers with GET and POST", () => {
		for (const url of oaWorkflowReadonlyUrls) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
		}

		const registeredOaWorkflowUrls = oaWorkflowLegacyEndpointDefinitions.map((definition) => definition.url).sort();
		expect(registeredOaWorkflowUrls).toEqual([...oaWorkflowReadonlyUrls, ...oaWorkflowGuardedWriteUrls].sort());
	});

	test("registers POST-only guarded write endpoints and leaves GET undefined", () => {
		for (const url of oaWorkflowGuardedWriteUrls) {
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "GET", url)).toBeUndefined();
		}
	});

	test("serves workflow list through the unified app legacy envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/oa/workflow/query",
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: { flows: expect.any(Array) },
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response.data.flows.length).toBeGreaterThan(0);
		for (const flow of response.data.flows) {
			expect(flow).toMatchObject({
				flowId: expect.stringMatching(/^FLOW_/),
				flowName: expect.any(String),
				flowType: expect.any(String),
				undoCount: expect.any(Number),
			});
		}
	});

	test("serves form metadata by flowId and returns 404 for unknown flow", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/oa/workflow/form/query",
			query: { flowId: "FLOW_001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				form: {
					flowId: "FLOW_001",
					flowName: expect.any(String),
					formJson: expect.any(String),
				},
			},
		});

		await expect(
			dispatchEndpoint(registry, {
				method: "GET",
				path: "/app/oa/workflow/form/query",
				query: { flowId: "FLOW_UNKNOWN" },
			}),
		).resolves.toMatchObject({
			code: 404,
			msg: expect.stringContaining("不存在"),
			data: null,
		});

		await expect(
			dispatchEndpoint(registry, {
				method: "GET",
				path: "/app/oa/workflow/form/query",
				query: {},
			}),
		).resolves.toMatchObject({
			code: 400,
			msg: expect.stringContaining("flowId"),
			data: null,
		});
	});

	test("serves form data list with pagination and id filtering", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/oa/workflow/form/data/query",
			query: { flowId: "FLOW_001", page: 1, row: 10 },
		});

		expect(response).toMatchObject({
			code: 0,
			data: {
				data: expect.any(Array),
				total: expect.any(Number),
			},
		});
		expect(response.data.data.length).toBeGreaterThan(0);
		for (const item of response.data.data) {
			expect(item).toMatchObject({
				id: expect.stringMatching(/^OA_/),
				flowId: "FLOW_001",
				state: expect.any(String),
				stateName: expect.any(String),
				formData: expect.any(Object),
			});
		}

		const detail = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/oa/workflow/form/data/query",
			query: { flowId: "FLOW_001", id: "OA_001" },
		});
		expect(detail).toMatchObject({
			code: 0,
			data: {
				data: [expect.objectContaining({ id: "OA_001" })],
				total: 1,
			},
		});
	});

	test("serves undo and history task lists with pagination", async () => {
		const undo = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/oa/workflow/task/undo/query",
			query: { flowId: "FLOW_001", page: 1, row: 10 },
		});
		expect(undo).toMatchObject({
			code: 0,
			data: { data: expect.any(Array), total: expect.any(Number) },
		});
		expect(undo.data.data.every((item: { state: string }) => ["1002", "1004"].includes(item.state))).toBe(true);

		const his = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/oa/workflow/task/his/query",
			query: { flowId: "FLOW_002", page: 1, row: 10 },
		});
		expect(his).toMatchObject({
			code: 0,
			data: { data: expect.any(Array), total: expect.any(Number) },
		});
		expect(his.data.data.every((item: { state: string }) => ["1003", "1005"].includes(item.state))).toBe(true);
	});

	test("serves comments, workflow image, next task and next-deal-user", async () => {
		const comments = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/oa/workflow/user/query",
			query: { id: "OA_001" },
		});
		expect(comments).toMatchObject({
			code: 0,
			data: {
				comments: expect.arrayContaining([
					expect.objectContaining({
						staffName: expect.any(String),
						startTime: expect.any(String),
						context: expect.any(String),
					}),
				]),
			},
		});

		const image = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/oa/workflow/image/run",
		});
		expect(image).toMatchObject({
			code: 0,
			data: { image: expect.any(String) },
		});

		for (const path of ["/app/oa/workflow/task/next", "/app/oa/workflow/undo/next-deal-user"]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path,
			});
			expect(response).toMatchObject({
				code: 0,
				data: {
					tasks: expect.arrayContaining([
						expect.objectContaining({
							assignee: expect.any(String),
							next: true,
							back: true,
							exit: true,
						}),
					]),
				},
			});
		}
	});

	test("lets POST body override query parameters for readonly legacy endpoints", async () => {
		const form = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/oa/workflow/form/query",
			query: { flowId: "FLOW_UNKNOWN" },
			body: { flowId: "FLOW_001" },
		});
		expect(form).toMatchObject({
			code: 0,
			data: { form: expect.objectContaining({ flowId: "FLOW_001" }) },
		});

		const formData = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/oa/workflow/form/data/query",
			query: { flowId: "FLOW_001", id: "OA_UNKNOWN" },
			body: { id: "OA_001" },
		});
		expect(formData).toMatchObject({
			code: 0,
			data: { data: [expect.objectContaining({ id: "OA_001" })], total: 1 },
		});

		const undo = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/oa/workflow/task/undo/query",
			query: { flowId: "FLOW_UNKNOWN" },
			body: { flowId: "FLOW_001", row: 1 },
		});
		expect(undo).toMatchObject({
			code: 0,
			data: { data: expect.any(Array), total: expect.any(Number) },
		});
	});

	test("returns 409 PHASE7_MUTATION_GUARDED for all write endpoints without mutation", async () => {
		for (const url of oaWorkflowGuardedWriteUrls) {
			const response = await dispatchEndpoint(registry, {
				method: "POST",
				path: url,
				body: { flowId: "FLOW_001", id: "OA_001", auditMessage: "should not write" },
			});

			expect(response).toMatchObject({
				code: 409,
				msg: expect.stringContaining("Phase7"),
				data: null,
				errorCode: "PHASE7_MUTATION_GUARDED",
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
		}
	});
});
