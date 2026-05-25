import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const todoUrl = "/app/auditUser.listAuditComplaints";
const historyUrl = "/app/auditUser.listAuditHistoryComplaints";
const eventUrl = "/app/complaint.listComplaintEvent";
const appraiseUrl = "/app/complaintAppraise.listComplaintAppraise";
const saveUrl = "/app/complaint";
const auditUrl = "/app/complaint.auditComplaint";
const replyUrl = "/app/complaintAppraise.replyComplaintAppraise";

describe("complaint legacy endpoints phase7 readonly and guarded slice", () => {
	const registry = createEndpointRegistry(runtimeEndpointDefinitions);

	test("registers readonly complaint handlers and guarded write handlers", () => {
		for (const url of [todoUrl, historyUrl, eventUrl, appraiseUrl]) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
		}

		for (const url of [saveUrl, auditUrl, replyUrl]) {
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "GET", url)).toBeUndefined();
		}
	});

	test("serves todo complaint list through the unified app legacy envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: todoUrl,
			query: { page: 1, row: 3, communityId: "COMM_001", userId: "USER_001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				data: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				records: 3,
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response.data.data[0]).toMatchObject({
			complaintId: expect.stringMatching(/^COMP_/),
			communityId: "COMM_001",
			typeCd: expect.stringMatching(/^80900[12]$/),
			typeName: expect.any(String),
			complaintName: expect.any(String),
			tel: expect.any(String),
			roomId: expect.any(String),
			context: expect.any(String),
			state: expect.stringMatching(/^(1100|1200)$/),
			stateName: expect.any(String),
			createTime: expect.any(String),
			taskId: expect.stringMatching(/^TASK_/),
		});
	});

	test("serves history list, event list, and appraise list with old nested data fields", async () => {
		const history = await dispatchEndpoint(registry, {
			method: "GET",
			path: historyUrl,
			query: { page: 1, row: 2, process: "START" },
		});
		const complaintId = history.data.complaints[0].complaintId;

		expect(history).toMatchObject({
			code: 0,
			data: {
				complaints: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				records: 2,
			},
		});
		expect(history.data.complaints[0].createTime).toMatch(/^\d{2}-\d{2}$/);

		const events = await dispatchEndpoint(registry, {
			method: "GET",
			path: eventUrl,
			query: { page: 1, row: 20, complaintId },
		});
		expect(events).toMatchObject({
			code: 0,
			data: {
				data: expect.arrayContaining([expect.objectContaining({ complaintId, eventType: "1000" })]),
				total: expect.any(Number),
			},
		});

		const appraises = await dispatchEndpoint(registry, {
			method: "GET",
			path: appraiseUrl,
			query: { page: 1, row: 20, complaintId },
		});
		expect(appraises).toMatchObject({
			code: 0,
			data: {
				data: expect.arrayContaining([
					expect.objectContaining({ complaintId, appraiseId: expect.stringMatching(/^APPR/) }),
				]),
				total: expect.any(Number),
			},
		});
	});

	test("keeps validation error behavior for readonly detail lists", async () => {
		for (const path of [eventUrl, appraiseUrl]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path,
				query: { page: 1, row: 10 },
			});

			expect(response).toMatchObject({
				code: 400,
				msg: expect.stringContaining(path === eventUrl ? "投诉ID" : "投诉ID"),
				data: null,
			});
		}
	});

	test("returns empty legacy detail lists for unknown complaint id without admin envelope fields", async () => {
		for (const path of [eventUrl, appraiseUrl]) {
			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path,
				query: { page: 1, row: 10, complaintId: "UNKNOWN_COMPLAINT_ID" },
			});

			expect(response).toMatchObject({
				code: 0,
				data: {
					data: [],
					total: 0,
				},
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
			expect(response).not.toHaveProperty("timestamp");
		}
	});

	test("supports POST body overriding query parameters on readonly handlers", async () => {
		const history = await dispatchEndpoint(registry, {
			method: "POST",
			path: historyUrl,
			query: { page: 1, row: 5 },
			body: { page: 2, row: 1 },
		});

		expect(history).toMatchObject({
			code: 0,
			data: {
				complaints: [expect.any(Object)],
				page: 2,
				records: 1,
			},
		});
	});

	test("blocks complaint writes without faking read-back rollback evidence", async () => {
		for (const request of [
			{
				path: saveUrl,
				body: {
					typeCd: "809001",
					complaintName: "测试投诉人",
					tel: "13800138000",
					roomId: "ROOM_001",
					context: "测试投诉内容",
					communityId: "COMM_001",
				},
			},
			{
				path: auditUrl,
				body: { complaintId: "COMP_001", context: "已处理", communityId: "COMM_001" },
			},
			{
				path: replyUrl,
				body: { appraiseId: "APPR_001", replyContext: "已回复", communityId: "COMM_001" },
			},
		]) {
			const response = await dispatchEndpoint(registry, {
				method: "POST",
				path: request.path,
				body: request.body,
			});

			expect(response).toMatchObject({
				code: 409,
				msg: expect.stringContaining(request.path.replace("/app/", "")),
				data: null,
				errorCode: "PHASE7_MUTATION_GUARDED",
			});
			expect(response).not.toHaveProperty("success");
			expect(response).not.toHaveProperty("message");
		}

		const events = await dispatchEndpoint(registry, {
			method: "GET",
			path: eventUrl,
			query: { page: 1, row: 20, complaintId: "COMP_001" },
		});
		expect(events.data.data.map((item: { eventType: string }) => item.eventType)).toEqual(["1000", "1001"]);
	});
});
