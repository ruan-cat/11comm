import { afterEach, describe, expect, test, vi } from "vitest";

import { createDbSettingRepository } from "../../server/modules/setting/repository";

import createRegisterProtocolHandler from "../../server/routes/api/setting-manage/system-manage/register-protocol/create.post";
import deleteRegisterProtocolHandler from "../../server/routes/api/setting-manage/system-manage/register-protocol/delete.post";
import listRegisterProtocolHandler from "../../server/routes/api/setting-manage/system-manage/register-protocol/list.post";
import updateRegisterProtocolHandler from "../../server/routes/api/setting-manage/system-manage/register-protocol/update.post";
import { runtimeEndpointManifest } from "../../server/shared/runtime/runtime-endpoints";

vi.mock("nitro/h3", async (importOriginal) => {
	const actual = await importOriginal<typeof import("nitro/h3")>();
	return {
		...actual,
		readBody: vi.fn(),
	};
});

const { readBody } = await import("nitro/h3");
const mockedReadBody = vi.mocked(readBody);

const envSnapshot = {
	DATABASE_URL: process.env.DATABASE_URL,
	NITRO_DATABASE_URL: process.env.NITRO_DATABASE_URL,
	comm_admin_11__DATABASE_URL: process.env.comm_admin_11__DATABASE_URL,
};

const registerProtocolEndpointSpecs = [
	{ url: "/api/setting-manage/system-manage/register-protocol/list", method: "POST" },
	{ url: "/api/setting-manage/system-manage/register-protocol/create", method: "POST" },
	{ url: "/api/setting-manage/system-manage/register-protocol/update", method: "POST" },
	{ url: "/api/setting-manage/system-manage/register-protocol/delete", method: "POST" },
] as const;

describe("setting-manage system-manage register-protocol admin endpoints", () => {
	afterEach(() => {
		restoreEnv();
	});

	test("manifest records all register-protocol endpoints", () => {
		for (const spec of registerProtocolEndpointSpecs) {
			expect(runtimeEndpointManifest).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						url: spec.url,
						method: spec.method,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "setting",
						phase: "phase7-setting-system-manage-admin-crud",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				]),
			);
		}
	});

	test("routes dispatch list and mutations to the setting runtime adapter", async () => {
		setDatabaseUrlForInjectedRuntime();
		mockedReadBody
			.mockResolvedValueOnce({
				pageIndex: 2,
				pageSize: 7,
				protocolType: " owner ",
				status: "enabled",
			})
			.mockResolvedValueOnce({
				protocolType: "owner",
				protocolTitle: "Owner Register Protocol",
				protocolContent: "Terms",
				version: "v1",
				status: "enabled",
			})
			.mockResolvedValueOnce({
				id: "REGISTER_PROTOCOL_001",
				protocolTitle: "Owner Register Protocol v2",
				version: "v2",
				status: "disabled",
			})
			.mockResolvedValueOnce({ id: "REGISTER_PROTOCOL_001" });
		const calls: Array<{ method: string; input: Record<string, unknown> }> = [];
		const event = createRouteEvent({
			context: {
				settingRuntime: {
					adminAdapter: {
						listRegisterProtocol: async (input: Record<string, unknown>) =>
							recordCall(calls, "listRegisterProtocol", input, {
								list: [registerProtocolFixture()],
								total: 1,
								pageIndex: input.pageIndex,
								pageSize: input.pageSize,
								totalPages: 1,
							}),
						createRegisterProtocol: async (input: Record<string, unknown>) =>
							recordCall(
								calls,
								"createRegisterProtocol",
								input,
								registerProtocolFixture({ id: "REGISTER_PROTOCOL_CREATED" }),
							),
						updateRegisterProtocol: async (input: Record<string, unknown>) =>
							recordCall(
								calls,
								"updateRegisterProtocol",
								input,
								registerProtocolFixture({ id: "REGISTER_PROTOCOL_001" }),
							),
						deleteRegisterProtocol: async (input: Record<string, unknown>) =>
							recordCall(calls, "deleteRegisterProtocol", input, null, "delete ok"),
					},
				},
			},
		});

		await listRegisterProtocolHandler(event);
		await createRegisterProtocolHandler(event);
		await updateRegisterProtocolHandler(event);
		await deleteRegisterProtocolHandler(event);

		expect(calls).toEqual([
			{
				method: "listRegisterProtocol",
				input: {
					pageIndex: 2,
					pageSize: 7,
					protocolType: " owner ",
					status: "enabled",
				},
			},
			{
				method: "createRegisterProtocol",
				input: {
					protocolType: "owner",
					protocolTitle: "Owner Register Protocol",
					protocolContent: "Terms",
					version: "v1",
					status: "enabled",
				},
			},
			{
				method: "updateRegisterProtocol",
				input: {
					id: "REGISTER_PROTOCOL_001",
					protocolTitle: "Owner Register Protocol v2",
					version: "v2",
					status: "disabled",
				},
			},
			{ method: "deleteRegisterProtocol", input: { id: "REGISTER_PROTOCOL_001" } },
		]);
	});

	test("repository CRUD uses sm_register_protocols", async () => {
		const db = createTableCaptureDb();
		const repository = createDbSettingRepository(db as any);

		await repository.listRegisterProtocol({ pageIndex: 1, pageSize: 10 });
		await repository.createRegisterProtocol({
			protocolType: "owner",
			protocolTitle: "Owner Register Protocol",
			protocolContent: "Terms",
			version: "v1",
			status: "enabled",
		});
		await repository.updateRegisterProtocol({
			id: "REGISTER_PROTOCOL_001",
			protocolTitle: "Owner Register Protocol v2",
			status: "disabled",
		});
		await repository.deleteRegisterProtocol("REGISTER_PROTOCOL_001");

		expect(db.tables).toContain("sm_register_protocols");
		expect(db.ops).toEqual(expect.arrayContaining(["select", "insert", "update", "delete"]));
	});

	test("adapter trims and forwards register-protocol list filters", async () => {
		const { createAdminSettingAdapter } = await import("../../server/modules/setting/admin-adapter");
		const capturedParams: Record<string, unknown>[] = [];
		const adapter = createAdminSettingAdapter({
			...createNoopSettingRepository(),
			listRegisterProtocol: async (params: Record<string, unknown>) => {
				capturedParams.push(params);
				return { list: [], total: 0 };
			},
		});

		await adapter.listRegisterProtocol({
			pageIndex: 2,
			pageSize: 7,
			protocolType: " owner ",
			protocolTitle: " Unique Sentinel ",
			status: " enabled ",
		});
		await adapter.listRegisterProtocol({
			pageIndex: 1,
			pageSize: 20,
			protocolType: "   ",
			protocolTitle: "",
			status: "   ",
		});

		expect(capturedParams).toEqual([
			{
				pageIndex: 2,
				pageSize: 7,
				protocolType: "owner",
				protocolTitle: "Unique Sentinel",
				status: "enabled",
			},
			{
				pageIndex: 1,
				pageSize: 20,
				protocolType: undefined,
				protocolTitle: undefined,
				status: undefined,
			},
		]);
	});

	test("repository register-protocol list applies shared where filters and ignores blank filters", async () => {
		const db = createTableCaptureDb();
		const repository = createDbSettingRepository(db as any);

		await repository.listRegisterProtocol({
			pageIndex: 1,
			pageSize: 10,
			protocolType: " owner ",
			protocolTitle: " Unique Sentinel ",
			status: " enabled ",
		});

		expect(db.whereArgs).toHaveLength(2);
		expect(db.whereArgs[0]).toBeDefined();
		expect(db.whereArgs[1]).toBe(db.whereArgs[0]);

		db.whereArgs.length = 0;
		await repository.listRegisterProtocol({
			pageIndex: 1,
			pageSize: 10,
			protocolType: "   ",
			protocolTitle: "",
			status: "   ",
		});

		expect(db.whereArgs).toEqual([undefined, undefined]);
	});

	test("adapter validates missing id for delete", async () => {
		const { createAdminSettingAdapter } = await import("../../server/modules/setting/admin-adapter");
		const { createSettingService } = await import("../../server/modules/setting/service");
		const adapter = createAdminSettingAdapter(createSettingService(createNoopSettingRepository()));

		await expect(adapter.deleteRegisterProtocol({})).resolves.toMatchObject({
			success: false,
			code: 400,
			data: null,
		});
	});
});

function setDatabaseUrlForInjectedRuntime(): void {
	process.env.DATABASE_URL = "postgres://setting-register-protocol.test/runtime";
	delete process.env.NITRO_DATABASE_URL;
	delete process.env.comm_admin_11__DATABASE_URL;
}

function restoreEnv(): void {
	restoreEnvVar("DATABASE_URL", envSnapshot.DATABASE_URL);
	restoreEnvVar("NITRO_DATABASE_URL", envSnapshot.NITRO_DATABASE_URL);
	restoreEnvVar("comm_admin_11__DATABASE_URL", envSnapshot.comm_admin_11__DATABASE_URL);
	mockedReadBody.mockReset();
}

function restoreEnvVar(name: string, value: string | undefined): void {
	if (value === undefined) {
		delete process.env[name];
		return;
	}
	process.env[name] = value;
}

function createRouteEvent(options: { context?: Record<string, unknown> } = {}): any {
	return {
		context: options.context ?? {},
		res: {
			headers: new Headers(),
			status: 200,
		},
	};
}

function recordCall(
	calls: Array<{ method: string; input: Record<string, unknown> }>,
	method: string,
	input: Record<string, unknown>,
	data: unknown,
	message = "query ok",
) {
	calls.push({ method, input });
	return {
		success: true,
		code: 200,
		message,
		data,
	};
}

function registerProtocolFixture(overrides: Record<string, unknown> = {}) {
	return {
		id: "REGISTER_PROTOCOL_001",
		title: "Owner Register Protocol",
		content: "Terms",
		version: "v1",
		status: "enabled",
		createTime: "2026-05-20 09:00:00",
		updateTime: "2026-05-20 10:00:00",
		...overrides,
	};
}

function createTableCaptureDb() {
	const db = {
		ops: [] as string[],
		tables: [] as string[],
		whereArgs: [] as unknown[],
		select: vi.fn(() => {
			db.ops.push("select");
			return createQuery(db, []);
		}),
		insert: vi.fn((table: unknown) => {
			db.ops.push("insert");
			db.tables.push(getTableName(table));
			return createWriteQuery([registerProtocolFixture({ id: "REGISTER_PROTOCOL_CREATED" })]);
		}),
		update: vi.fn((table: unknown) => {
			db.ops.push("update");
			db.tables.push(getTableName(table));
			return createWriteQuery([registerProtocolFixture({ id: "REGISTER_PROTOCOL_001" })]);
		}),
		delete: vi.fn((table: unknown) => {
			db.ops.push("delete");
			db.tables.push(getTableName(table));
			return createDeleteQuery([{ id: "REGISTER_PROTOCOL_001" }]);
		}),
	};
	return db;
}

function createQuery(db: { tables: string[]; whereArgs: unknown[] }, result: Record<string, unknown>[]) {
	const query = {
		from: vi.fn((table: unknown) => {
			db.tables.push(getTableName(table));
			return query;
		}),
		where: vi.fn((where: unknown) => {
			db.whereArgs.push(where);
			return query;
		}),
		orderBy: vi.fn(() => query),
		limit: vi.fn(() => query),
		offset: vi.fn(async () => result),
		then: (onFulfilled: (value: Record<string, unknown>[]) => unknown, onRejected?: (reason: unknown) => unknown) =>
			Promise.resolve(result).then(onFulfilled, onRejected),
	};
	return query;
}

function createWriteQuery(result: Record<string, unknown>[]) {
	const query = {
		values: vi.fn(() => query),
		set: vi.fn(() => query),
		where: vi.fn(() => query),
		returning: vi.fn(async () => result),
	};
	return query;
}

function createDeleteQuery(result: Record<string, unknown>[]) {
	const query = {
		where: vi.fn(() => query),
		returning: vi.fn(async () => result),
	};
	return query;
}

function getTableName(table: unknown): string {
	if (table && typeof table === "object" && Symbol.for("drizzle:Name") in table) {
		return String((table as Record<symbol, unknown>)[Symbol.for("drizzle:Name")]);
	}
	return String(table);
}

function createNoopSettingRepository(): any {
	return {
		listDataPermission: async () => ({ list: [], total: 0 }),
		listOrgInfo: async () => ({ list: [], total: 0 }),
		getOrgInfoTree: async () => [],
		listRolePermission: async () => ({ list: [], total: 0 }),
		listSchedulingSetting: async () => ({ list: [], total: 0 }),
		listShiftSetting: async () => ({ list: [], total: 0 }),
		listStaffInfo: async () => ({ list: [], total: 0 }),
		listWorkingSchedule: async () => ({ list: [], total: 0 }),
		listChangePassword: async () => ({ list: [], total: 0 }),
		listCommunityConfiguration: async () => ({ list: [], total: 0 }),
		listInitializeCell: async () => ({ list: [], total: 0 }),
		listRegisterProtocol: async () => ({ list: [], total: 0 }),
		listSystemConfig: async () => ({ list: [], total: 0 }),
		createChangePassword: async () => null,
		updateChangePassword: async () => null,
		deleteChangePassword: async () => false,
		createCommunityConfiguration: async () => null,
		updateCommunityConfiguration: async () => null,
		deleteCommunityConfiguration: async () => false,
		createInitializeCell: async () => null,
		updateInitializeCell: async () => null,
		deleteInitializeCell: async () => false,
		createRegisterProtocol: async () => null,
		updateRegisterProtocol: async () => null,
		deleteRegisterProtocol: async () => false,
		createSystemConfig: async () => null,
		updateSystemConfig: async () => null,
		deleteSystemConfig: async () => false,
	};
}
