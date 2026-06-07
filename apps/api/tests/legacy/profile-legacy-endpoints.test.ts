import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

describe("profile legacy endpoints phase7 readonly slice", () => {
	const registry = createEndpointRegistry(runtimeEndpointDefinitions);

	test("registers only readonly exact handlers", () => {
		for (const url of [
			"/app/profile.getUserProfile",
			"/app/profile.listCommunities",
			"/app/profile.listAttendanceRecords",
		]) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
		}

		expect(findEndpointDefinition(registry, "POST", "/app/profile.changeCommunity")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/profile.changePassword")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/profile.changeCommunity")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/profile.changePassword")).toBeUndefined();
	});

	test("serves profile snapshot through the unified app legacy envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/profile.getUserProfile",
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				userId: expect.any(String),
				userName: expect.any(String),
				storeId: expect.any(String),
				storeName: expect.any(String),
				avatar: expect.any(String),
				currentCommunityId: expect.any(String),
				currentCommunityName: expect.any(String),
				version: expect.any(String),
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("lists communities and supports keyword filtering", async () => {
		const all = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/profile.listCommunities",
			query: {},
		});

		expect(all).toMatchObject({
			code: 0,
			data: expect.any(Array),
		});
		expect(all.data.length).toBeGreaterThan(1);
		expect(all.data[0]).toMatchObject({
			communityId: expect.any(String),
			name: expect.any(String),
			address: expect.any(String),
		});

		const keyword = all.data[0].name.slice(0, 3);
		const filtered = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/profile.listCommunities",
			query: { keyword },
		});

		expect(filtered).toMatchObject({
			code: 0,
			data: expect.any(Array),
		});
		expect(filtered.data.length).toBeGreaterThan(0);
		for (const item of filtered.data) {
			expect(item.name).toContain(keyword);
		}
	});

	test("lets POST body override query parameters like other legacy adapters", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/profile.listCommunities",
			query: { keyword: "NO_MATCH" },
			body: { keyword: "Sun" },
		});

		expect(response).toMatchObject({
			code: 0,
			data: expect.any(Array),
		});
		expect(response.data.length).toBeGreaterThan(0);
		for (const item of response.data) {
			expect(item.name).toContain("Sun");
		}
	});

	test.each([
		["/app/profile.changeCommunity", { communityId: "COMM_002" }, "profile.changeCommunity"],
		["/app/profile.changePassword", { oldPwd: "old-password", newPwd: "new-password" }, "profile.changePassword"],
	])("guards %s without faking write verification", async (path, body, action) => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path,
			body,
		});

		expect(response).toMatchObject({
			code: 409,
			msg: expect.stringContaining(action),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
	});

	test("returns an empty legacy data array for an unknown community keyword", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/profile.listCommunities",
			query: { keyword: "__PROFILE_COMMUNITY_NO_MATCH__" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: [],
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response).not.toHaveProperty("timestamp");
	});

	test("serves attendance records with explicit and default month", async () => {
		const explicit = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/profile.listAttendanceRecords",
			query: { month: "2026-03", staffId: "STAFF_001" },
		});

		expect(explicit).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: expect.any(Array),
		});
		expect(explicit.data.length).toBeGreaterThan(0);
		expect(explicit.data[0]).toMatchObject({
			taskDay: expect.any(Number),
			attendanceClassesTaskDetails: [
				expect.objectContaining({
					specCd: "1001",
					checkTime: expect.any(Number),
					state: expect.any(String),
					stateName: expect.any(String),
				}),
				expect.objectContaining({
					specCd: "2002",
					checkTime: expect.any(Number),
					state: expect.any(String),
					stateName: expect.any(String),
				}),
			],
		});
		expect(explicit).not.toHaveProperty("success");

		const defaults = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/profile.listAttendanceRecords",
			query: {},
		});
		expect(defaults).toMatchObject({
			code: 0,
			data: expect.any(Array),
		});
		expect(defaults.data.length).toBeGreaterThan(0);
	});

	test("keeps attendance compatibility when staffId does not match seeded data", async () => {
		const baseline = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/profile.listAttendanceRecords",
			query: { month: "2026-03" },
		});

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/profile.listAttendanceRecords",
			query: { month: "2026-03", staffId: "__PROFILE_STAFF_NO_MATCH__" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: expect.any(Array),
		});
		expect(response.data).toEqual(baseline.data);
		expect(response.data.length).toBeGreaterThan(0);
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response).not.toHaveProperty("timestamp");
	});

	test("lets POST body override query parameters for attendance records", async () => {
		const march = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/profile.listAttendanceRecords",
			query: { month: "2026-03", staffId: "STAFF_001" },
		});

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/profile.listAttendanceRecords",
			query: { month: "2026-02", staffId: "__PROFILE_STAFF_NO_MATCH__" },
			body: { month: "2026-03", staffId: "STAFF_001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: expect.any(Array),
		});
		expect(response.data).toEqual(march.data);
		expect(response.data.length).toBeGreaterThan(0);
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response).not.toHaveProperty("timestamp");
	});
});
