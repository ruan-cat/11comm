import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const queryUrl = "/app/owner.queryOwnerAndMembers";
const saveUrl = "/app/owner.saveRoomOwner";
const editUrl = "/app/owner.editOwner";
const deleteUrl = "/app/owner.deleteOwner";

describe("owner legacy endpoints phase7 readonly and guarded slice", () => {
	const registry = createEndpointRegistry(runtimeEndpointDefinitions);

	test("registers owner readonly query and guarded write exact handlers", () => {
		expect(findEndpointDefinition(registry, "GET", queryUrl)).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", queryUrl)).toBeTruthy();

		for (const url of [saveUrl, editUrl, deleteUrl]) {
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "GET", url)).toBeUndefined();
		}
	});

	test("serves owner list through the unified app legacy envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: queryUrl,
			query: { communityId: "COMM_001", page: 1, row: 3 },
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
		for (const owner of response.data.list) {
			expect(owner).toMatchObject({
				memberId: expect.stringMatching(/^MEM_/),
				ownerId: expect.stringMatching(/^OWN_/),
				roomId: expect.stringMatching(/^ROOM_/),
				roomName: expect.any(String),
				name: expect.any(String),
				link: expect.any(String),
				idCard: expect.any(String),
				address: expect.any(String),
				ownerTypeCd: expect.stringMatching(/^100[123]$/),
				communityId: "COMM_001",
			});
		}
	});

	test("supports memberId, name, link, roomName filters and empty result behavior", async () => {
		const detail = await dispatchEndpoint(registry, {
			method: "GET",
			path: queryUrl,
			query: { communityId: "COMM_001", memberId: "MEM_0003", page: 1, row: 5 },
		});

		expect(detail).toMatchObject({
			code: 0,
			data: {
				list: [
					expect.objectContaining({
						memberId: "MEM_0003",
						name: "Owner 003",
						link: "13800000003",
						roomName: "1楼1单元103室",
					}),
				],
				total: 1,
				page: 1,
				pageSize: 5,
				hasMore: false,
			},
		});

		const filtered = await dispatchEndpoint(registry, {
			method: "GET",
			path: queryUrl,
			query: { communityId: "COMM_001", name: "Owner 003", link: "0003", roomName: "103", page: 1, row: 5 },
		});

		expect(filtered).toMatchObject({
			code: 0,
			data: {
				list: [expect.objectContaining({ memberId: "MEM_0003" })],
				total: 1,
			},
		});

		const empty = await dispatchEndpoint(registry, {
			method: "GET",
			path: queryUrl,
			query: { communityId: "COMM_001", memberId: "MEM_UNKNOWN", page: 1, row: 5 },
		});

		expect(empty).toMatchObject({
			code: 0,
			data: {
				list: [],
				total: 0,
				page: 1,
				pageSize: 5,
				hasMore: false,
			},
		});
	});

	test("lets POST body override owner query parameters", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: queryUrl,
			query: { communityId: "COMM_001", memberId: "MEM_0003", row: 8 },
			body: { communityId: "COMM_002", memberId: "MEM_0004", page: 1, row: 1 },
		});

		expect(response).toMatchObject({
			code: 0,
			data: {
				list: [
					expect.objectContaining({
						memberId: "MEM_0004",
						communityId: "COMM_002",
					}),
				],
				total: 1,
				page: 1,
				pageSize: 1,
				hasMore: false,
			},
		});
	});

	test("blocks owner writes without mutating compatibility seed data", async () => {
		const before = await dispatchEndpoint(registry, {
			method: "GET",
			path: queryUrl,
			query: { communityId: "COMM_001", memberId: "MEM_0003", page: 1, row: 1 },
		});

		for (const request of [
			{
				path: saveUrl,
				body: {
					communityId: "COMM_001",
					name: "Phase7 Sentinel Owner",
					link: "13900000000",
					roomName: "测试房屋",
					ownerTypeCd: "1002",
					personRole: "3",
					personType: "P",
				},
			},
			{
				path: editUrl,
				body: {
					communityId: "COMM_001",
					memberId: "MEM_0003",
					ownerId: "OWN_0003",
					name: "Phase7 Edited Owner",
					link: "13900000001",
					ownerTypeCd: "1001",
				},
			},
			{
				path: deleteUrl,
				body: { communityId: "COMM_001", memberId: "MEM_0003" },
			},
		]) {
			const guarded = await dispatchEndpoint(registry, {
				method: "POST",
				path: request.path,
				body: request.body,
			});

			expect(guarded).toMatchObject({
				code: 409,
				msg: expect.stringContaining(request.path.replace("/app/", "")),
				data: null,
				errorCode: "PHASE7_MUTATION_GUARDED",
			});
			expect(guarded).not.toHaveProperty("success");
			expect(guarded).not.toHaveProperty("message");
		}

		const after = await dispatchEndpoint(registry, {
			method: "GET",
			path: queryUrl,
			query: { communityId: "COMM_001", memberId: "MEM_0003", page: 1, row: 1 },
		});

		expect(after).toEqual(before);
	});
});
