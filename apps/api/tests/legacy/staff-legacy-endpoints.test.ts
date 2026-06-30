import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import type { StaffOnlineResult } from "../../server/modules/staff/types";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const readonlyStaffEndpoints = [
	"/app/staff/organizations",
	"/app/staff/online",
	"/app/staff/by-department",
	"/app/query.staff.infos",
	"/app/staff/search",
	"/app/staff/STAFF_001",
] as const;

const readonlyStaffGetSuccessRequests = [
	["/app/staff/organizations", {}],
	["/app/staff/online", {}],
	["/app/staff/by-department", { orgName: "Property Management" }],
	["/app/query.staff.infos", { row: 1 }],
	["/app/staff/search", { keyword: "Alice" }],
	["/app/staff/STAFF_001", {}],
] as const;

const guardedStaffWriteEndpoints = ["/app/staff/update-online-status", "/app/staff/add"] as const;

describe("staff app legacy exact endpoints", () => {
	test("registers readonly staff exact endpoints and POST-only guarded write endpoints", () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		expect(findEndpointDefinition(registry, "GET", "/app/staff/organizations")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/staff/organizations")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/staff/online")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/staff/online")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/staff/by-department")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/staff/by-department")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/query.staff.infos")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/query.staff.infos")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/staff/search")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/staff/search")).toBeTruthy();

		for (const path of guardedStaffWriteEndpoints) {
			expect(findEndpointDefinition(registry, "GET", path)).toBeUndefined();
			expect(findEndpointDefinition(registry, "POST", path)).toBeTruthy();
		}

		expect(findEndpointDefinition(registry, "GET", "/app/staff/STAFF_001")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/staff/STAFF_001")).toBeUndefined();
	});

	test("returns organization summaries without the contact msg envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/staff/organizations",
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: {
				organizations: expect.arrayContaining([
					expect.objectContaining({ orgName: "Property Management", staffCount: 2, onlineCount: 1 }),
					expect.objectContaining({ orgName: "Security", staffCount: 2, onlineCount: 2 }),
				]),
				totalOrganizations: 3,
				totalStaffs: 5,
			},
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("returns online staff list and ratio in the staff success envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/staff/online",
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: {
				staffs: expect.arrayContaining([
					expect.objectContaining({
						id: "STAFF_001",
						name: "Alice Zhang",
						tel: "13800000001",
						orgName: "Property Management",
						initials: "AZ",
						position: "Property Manager",
						email: "alice.zhang@property.example",
						avatar: "https://example.test/staff-001.png",
						isOnline: true,
					}),
				]),
				total: 4,
				onlineRatio: 80,
			},
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("returns exact department staff for GET by-department and empty list without orgName", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/staff/by-department",
			query: { orgName: "Security" },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: {
				staffs: [
					expect.objectContaining({ id: "STAFF_003", orgName: "Security", name: "Chen Wei" }),
					expect.objectContaining({ id: "STAFF_004", orgName: "Security", name: "Dana Liu" }),
				],
				total: 2,
				page: 1,
				row: 2,
			},
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");

		const emptyResponse = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/staff/by-department",
			query: {},
		});

		expect(emptyResponse).toMatchObject({
			success: true,
			code: "0",
			data: {
				staffs: [],
				total: 0,
				page: 1,
				row: 0,
			},
		});
	});

	test("POST by-department body overrides query orgName", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/staff/by-department",
			query: { orgName: "Security" },
			body: { orgName: "Maintenance" },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: {
				staffs: [expect.objectContaining({ id: "STAFF_005", orgName: "Maintenance", name: "Eric Wang" })],
				total: 1,
				page: 1,
				row: 1,
			},
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("GET query.staff.infos filters by department and keeps deterministic pagination", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/query.staff.infos",
			query: { page: 1, row: 2, orgName: "Security" },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: {
				staffs: [
					expect.objectContaining({ id: "STAFF_003", orgName: "Security", name: "Chen Wei" }),
					expect.objectContaining({ id: "STAFF_004", orgName: "Security", name: "Dana Liu" }),
				],
				total: 2,
				page: 1,
				row: 2,
			},
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("POST query.staff.infos body overrides query filters", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/query.staff.infos",
			query: { orgName: "Security" },
			body: { orgName: "Maintenance", row: 5 },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: {
				staffs: [expect.objectContaining({ id: "STAFF_005", orgName: "Maintenance", name: "Eric Wang" })],
				total: 1,
				page: 1,
				row: 5,
			},
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("GET staff/search returns matching staff in the staff success envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/staff/search",
			query: { keyword: "Alice" },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: {
				staffs: [expect.objectContaining({ id: "STAFF_001", name: "Alice Zhang" })],
				total: 1,
				keyword: "Alice",
			},
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
	});

	test("GET exact staff detail sample returns STAFF_001 in the staff success envelope", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/staff/STAFF_001",
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: expect.objectContaining({
				id: "STAFF_001",
				name: "Alice Zhang",
				tel: "13800000001",
				orgName: "Property Management",
				initials: "AZ",
				position: "Property Manager",
				email: "alice.zhang@property.example",
				avatar: "https://example.test/staff-001.png",
				isOnline: true,
			}),
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");
		expect(response).not.toHaveProperty("errorCode");
	});

	test("POST staff/search body overrides query keyword and missing keyword fails closed", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/staff/search",
			query: { keyword: "Alice" },
			body: { keyword: "Eric" },
		});

		expect(response).toMatchObject({
			success: true,
			code: "0",
			message: expect.any(String),
			data: {
				staffs: [expect.objectContaining({ id: "STAFF_005", name: "Eric Wang" })],
				total: 1,
				keyword: "Eric",
			},
			timestamp: expect.any(Number),
		});
		expect(response).not.toHaveProperty("msg");

		const missingKeywordResponse = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/staff/search",
			query: {},
		});

		expect(missingKeywordResponse).toMatchObject({
			success: false,
			code: "400",
			message: expect.any(String),
			data: null,
			timestamp: expect.any(Number),
		});
		expect(missingKeywordResponse).not.toHaveProperty("msg");
	});

	test.each(readonlyStaffEndpoints)(
		"uses success/message/timestamp envelope for readonly staff endpoint: %s",
		async (path) => {
			const registry = createEndpointRegistry(runtimeEndpointDefinitions);

			const response = await dispatchEndpoint(registry, {
				method: "GET",
				path,
				query: readonlyStaffGetSuccessRequests.find(([requestPath]) => requestPath === path)?.[1] ?? {},
			});

			expect(response).toHaveProperty("success", true);
			expect(response).toHaveProperty("code", "0");
			expect(response).toHaveProperty("message");
			expect(response).toHaveProperty("data");
			expect(response).toHaveProperty("timestamp");
			expect(response).not.toHaveProperty("msg");
		},
	);

	test("blocks guarded staff writes without mutating the deterministic online staff seed", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);
		const beforeOnlineResponse = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/staff/online",
		});
		const beforeOnlineData = beforeOnlineResponse.data as StaffOnlineResult;
		const beforeOnlineStaffs = beforeOnlineData.staffs;
		const beforeIds = beforeOnlineStaffs.map((staff) => staff.id).sort();

		for (const path of guardedStaffWriteEndpoints) {
			const response = await dispatchEndpoint(registry, {
				method: "POST",
				path,
				query: { staffId: "STAFF_001" },
				body: { staffId: "STAFF_001", isOnline: false, name: "Blocked Staff" },
			});

			expect(response).toMatchObject({
				success: false,
				code: "409",
				message: expect.stringContaining(path),
				data: null,
				timestamp: expect.any(Number),
			});
			expect(response).not.toHaveProperty("msg");
			expect(response).not.toHaveProperty("errorCode");
		}

		const afterOnlineResponse = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/staff/online",
		});
		const afterOnlineData = afterOnlineResponse.data as StaffOnlineResult;
		const afterOnlineStaffs = afterOnlineData.staffs;
		const afterIds = afterOnlineStaffs.map((staff) => staff.id).sort();

		expect(afterOnlineData.total).toBe(beforeOnlineData.total);
		expect(afterIds).toEqual(beforeIds);
	});
});
