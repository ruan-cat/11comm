import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const videoReadonlyUrls = [
	"/app/video.listMonitorArea",
	"/app/video.listStaffMonitorMachine",
	"/app/video.getPlayVideoUrl",
] as const;

describe("video legacy endpoints phase7 readonly slice", () => {
	const registry = createEndpointRegistry(runtimeEndpointDefinitions);

	test("registers exactly the video readonly handlers", () => {
		for (const url of videoReadonlyUrls) {
			expect(findEndpointDefinition(registry, "GET", url)).toBeTruthy();
			expect(findEndpointDefinition(registry, "POST", url)).toBeTruthy();
		}

		const registeredVideoUrls = runtimeEndpointDefinitions
			.map((definition) => definition.url)
			.filter((url) => url.startsWith("/app/video."))
			.sort();
		expect(registeredVideoUrls).toEqual([...videoReadonlyUrls].sort());
	});

	test("serves monitor areas through the unified app legacy envelope", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/video.listMonitorArea",
			query: { page: 1, row: 2, communityId: "COMM_001" },
		});

		expect(response).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				pageSize: 2,
				hasMore: expect.any(Boolean),
			},
		});
		expect(response).not.toHaveProperty("success");
		expect(response).not.toHaveProperty("message");
		expect(response.data.list[0]).toMatchObject({
			maId: expect.any(String),
			maName: expect.any(String),
		});
	});

	test("lists monitor machines and supports area and name filters", async () => {
		const areaFiltered = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/video.listStaffMonitorMachine",
			query: { page: 1, row: 5, maId: "AREA_001", communityId: "COMM_001" },
		});

		expect(areaFiltered).toMatchObject({
			code: 0,
			data: {
				list: expect.any(Array),
				total: expect.any(Number),
				page: 1,
				pageSize: 5,
			},
		});
		expect(areaFiltered.data.list.length).toBeGreaterThan(0);
		for (const item of areaFiltered.data.list) {
			expect(item).toMatchObject({
				machineId: expect.any(String),
				communityId: "COMM_001",
				machineName: expect.any(String),
				maId: "AREA_001",
				maName: expect.any(String),
				photoUrl: expect.any(String),
			});
		}

		const nameFiltered = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/video.listStaffMonitorMachine",
			query: { page: 1, row: 10, machineNameLike: "Device-01" },
		});

		expect(nameFiltered).toMatchObject({
			code: 0,
			data: {
				list: expect.any(Array),
			},
		});
		expect(nameFiltered.data.list.length).toBeGreaterThan(0);
		for (const item of nameFiltered.data.list) {
			expect(item.machineName).toContain("Device-01");
		}
	});

	test("lets POST body override query parameters like other legacy adapters", async () => {
		const response = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/video.listStaffMonitorMachine",
			query: { page: 1, row: 10, maId: "AREA_002" },
			body: { row: 2, maId: "AREA_003" },
		});

		expect(response).toMatchObject({
			code: 0,
			data: {
				pageSize: 2,
				list: expect.any(Array),
			},
		});
		expect(response.data.list.length).toBeGreaterThan(0);
		for (const item of response.data.list) {
			expect(item.maId).toBe("AREA_003");
		}
	});

	test("returns empty monitor machine pagination for unknown filters without admin envelope fields", async () => {
		const unknownArea = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/video.listStaffMonitorMachine",
			query: { page: 1, row: 5, maId: "AREA_UNKNOWN", communityId: "COMM_UNKNOWN" },
		});

		expect(unknownArea).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: [],
				total: 0,
				page: 1,
				pageSize: 5,
				hasMore: false,
			},
		});
		expect(unknownArea).not.toHaveProperty("success");
		expect(unknownArea).not.toHaveProperty("message");
		expect(unknownArea).not.toHaveProperty("timestamp");

		const unknownName = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/video.listStaffMonitorMachine",
			body: { page: 1, row: 10, machineNameLike: "Device-UNKNOWN" },
		});

		expect(unknownName).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				list: [],
				total: 0,
				page: 1,
				pageSize: 10,
				hasMore: false,
			},
		});
		expect(unknownName).not.toHaveProperty("success");
		expect(unknownName).not.toHaveProperty("message");
		expect(unknownName).not.toHaveProperty("timestamp");
	});

	test("returns deterministic compatible play urls with explicit and default machine ids", async () => {
		const explicit = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/video.getPlayVideoUrl",
			query: { machineId: "MACHINE_0007", communityId: "COMM_001" },
		});

		expect(explicit).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				url: expect.stringContaining("https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"),
			},
		});
		expect(explicit.data.url).toContain("machineId=MACHINE_0007");
		expect(explicit).not.toHaveProperty("success");

		const defaults = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/video.getPlayVideoUrl",
			query: {},
		});

		expect(defaults).toMatchObject({
			code: 0,
			data: {
				url: expect.stringContaining("machineId=MACHINE_0001"),
			},
		});
	});

	test("keeps play url POST payload override and unknown or empty machine ids compatible", async () => {
		const unknownMachine = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/video.getPlayVideoUrl",
			query: { machineId: "MACHINE_0002" },
			body: { machineId: "MACHINE_UNKNOWN" },
		});

		expect(unknownMachine).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				url: expect.stringContaining("https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"),
			},
		});
		expect(unknownMachine.data.url).toContain("machineId=MACHINE_UNKNOWN");
		expect(unknownMachine).not.toHaveProperty("success");
		expect(unknownMachine).not.toHaveProperty("message");
		expect(unknownMachine).not.toHaveProperty("timestamp");

		const emptyMachine = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/video.getPlayVideoUrl",
			body: { machineId: "   " },
		});

		expect(emptyMachine).toMatchObject({
			code: 0,
			msg: expect.any(String),
			data: {
				url: expect.stringContaining("machineId=MACHINE_0001"),
			},
		});
		expect(emptyMachine).not.toHaveProperty("success");
		expect(emptyMachine).not.toHaveProperty("message");
		expect(emptyMachine).not.toHaveProperty("timestamp");
	});
});
