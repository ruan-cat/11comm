import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const listUrl = "/app/contact.listContacts";
const detailUrl = "/app/contact.getContactDetail";
const byDepartmentUrl = "/app/contact.getContactsByDepartment";
const searchUrl = "/app/contact.searchContacts";
const departmentsUrl = "/app/contact.getDepartments";
const favoriteUrl = "/app/contact.getFavoriteContacts";
const emergencyUrl = "/app/contact.getEmergencyContacts";
const updateOnlineStatusUrl = "/app/contact.updateOnlineStatus";

const readonlyUrls = [
	listUrl,
	detailUrl,
	byDepartmentUrl,
	searchUrl,
	departmentsUrl,
	favoriteUrl,
	emergencyUrl,
] as const;

describe("contact legacy endpoints phase7 readonly and guarded slice", () => {
	const registry = createEndpointRegistry(runtimeEndpointDefinitions);

	test("registers readonly contact handlers and guarded online status write handler", () => {
		for (const url of readonlyUrls) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
		}

		expect(findEndpointDefinition(registry, "POST", updateOnlineStatusUrl)).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", updateOnlineStatusUrl)).toBeUndefined();
	});

	test("serves contact list through the unified app legacy envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: listUrl,
			query: { page: 1, row: 3, isOnline: "true" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				contacts: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				row: 3,
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response).not.toHaveProperty("timestamp");
		expect(response.data.contacts).toHaveLength(3);
		for (const contact of response.data.contacts) {
			expect(contact).toMatchObject({
				contactId: expect.stringMatching(/^CON_/),
				name: expect.any(String),
				position: expect.any(String),
				department: expect.any(String),
				phone: expect.any(String),
				isOnline: true,
			});
		}
	});

	test("supports POST body overriding query parameters on list handlers", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: listUrl,
			query: { page: 1, row: 5, keyword: "Contact" },
			body: { page: 2, row: 1, keyword: "Contact" },
		});

		expect(response).toMatchObject({
			code: 0,
			data: {
				contacts: [expect.objectContaining({ contactId: expect.stringMatching(/^CON_/) })],
				page: 2,
				row: 1,
			},
		});
	});

	test("serves contact detail and keeps validation error behavior", async () => {
		const detail = await dispatchEndpoint(registry, {
			method: "GET",
			path: detailUrl,
			query: { contactId: "CON_001" },
		});

		expect(detail).toMatchObject({
			code: 0,
			data: {
				contact: {
					contactId: "CON_001",
					name: expect.any(String),
					phone: expect.any(String),
				},
			},
		});

		const missing = await dispatchEndpoint(registry, {
			method: "GET",
			path: detailUrl,
			query: {},
		});
		expect(missing).toMatchObject({
			code: 400,
			msg: expect.stringContaining("ID"),
			data: null,
		});

		const unknown = await dispatchEndpoint(registry, {
			method: "GET",
			path: detailUrl,
			query: { contactId: "CON_UNKNOWN" },
		});
		expect(unknown).toMatchObject({
			code: 404,
			msg: expect.any(String),
			data: null,
		});
	});

	test("serves department, search, favorite, and emergency readonly responses", async () => {
		const grouped = await dispatchEndpoint(registry, {
			method: "GET",
			path: byDepartmentUrl,
			query: {},
		});
		expect(grouped).toMatchObject({
			code: 0,
			data: {
				departments: expect.any(Array),
				totalContacts: expect.any(Number),
				onlineContacts: expect.any(Number),
			},
		});
		expect(grouped.data.departments[0]).toMatchObject({
			departmentName: expect.any(String),
			totalCount: expect.any(Number),
			onlineCount: expect.any(Number),
			contacts: expect.any(Array),
		});

		const departments = await dispatchEndpoint(registry, {
			method: "GET",
			path: departmentsUrl,
			query: {},
		});
		expect(departments).toMatchObject({
			code: 0,
			data: { departments: expect.any(Array) },
		});

		const search = await dispatchEndpoint(registry, {
			method: "POST",
			path: searchUrl,
			query: { keyword: "missing" },
			body: { keyword: "Contact 001", page: 1, row: 5 },
		});
		expect(search).toMatchObject({
			code: 0,
			data: {
				contacts: expect.arrayContaining([expect.objectContaining({ contactId: "CON_001" })]),
				total: expect.any(Number),
				keyword: "Contact 001",
			},
		});

		const missingKeyword = await dispatchEndpoint(registry, {
			method: "GET",
			path: searchUrl,
			query: {},
		});
		expect(missingKeyword).toMatchObject({
			code: 400,
			msg: expect.any(String),
			data: null,
		});

		const favorite = await dispatchEndpoint(registry, {
			method: "GET",
			path: favoriteUrl,
			query: {},
		});
		expect(favorite).toMatchObject({
			code: 0,
			data: {
				contacts: expect.arrayContaining([expect.objectContaining({ contactId: expect.stringMatching(/^CON_/) })]),
			},
		});

		const emergency = await dispatchEndpoint(registry, {
			method: "GET",
			path: emergencyUrl,
			query: {},
		});
		expect(emergency).toMatchObject({
			code: 0,
			data: {
				contacts: expect.arrayContaining([
					expect.objectContaining({ contactId: "EMG_001", phone: "400-888-9999" }),
					expect.objectContaining({ phone: "120" }),
					expect.objectContaining({ phone: "119" }),
					expect.objectContaining({ phone: "110" }),
				]),
			},
		});
	});

	test("blocks contact online status writes without mutating compatibility seed data", async () => {
		const before = await dispatchEndpoint(registry, {
			method: "GET",
			path: detailUrl,
			query: { contactId: "CON_001" },
		});

		const guarded = await dispatchEndpoint(registry, {
			method: "POST",
			path: updateOnlineStatusUrl,
			body: { contactId: "CON_001", isOnline: !before.data.contact.isOnline },
		});

		expect(guarded).toMatchObject({
			code: 409,
			msg: expect.stringContaining("contact.updateOnlineStatus"),
			data: null,
			errorCode: "PHASE7_MUTATION_GUARDED",
		});
		expect(guarded).not.toHaveProperty("success");
		expect(guarded).not.toHaveProperty("message");

		const after = await dispatchEndpoint(registry, {
			method: "GET",
			path: detailUrl,
			query: { contactId: "CON_001" },
		});
		expect(after.data.contact.isOnline).toBe(before.data.contact.isOnline);
	});
});
