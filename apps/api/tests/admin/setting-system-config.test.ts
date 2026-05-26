import { afterEach, describe, expect, test, vi } from "vitest";

import { createDbSettingRepository } from "../../server/modules/setting/repository";

import createSystemConfigHandler from "../../server/routes/api/setting-manage/system-manage/system-config/create.post";
import deleteSystemConfigHandler from "../../server/routes/api/setting-manage/system-manage/system-config/delete.post";
import listSystemConfigHandler from "../../server/routes/api/setting-manage/system-manage/system-config/list.post";
import updateSystemConfigHandler from "../../server/routes/api/setting-manage/system-manage/system-config/update.post";
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

const systemConfigEndpointSpecs = [
	{ url: "/api/setting-manage/system-manage/system-config/list", method: "POST" },
	{ url: "/api/setting-manage/system-manage/system-config/create", method: "POST" },
	{ url: "/api/setting-manage/system-manage/system-config/update", method: "POST" },
	{ url: "/api/setting-manage/system-manage/system-config/delete", method: "POST" },
] as const;

describe("setting-manage system-manage system-config admin endpoints", () => {
	afterEach(() => {
		restoreEnv();
	});

	test("manifest records all system-config endpoints", () => {
		for (const spec of systemConfigEndpointSpecs) {
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
				configKey: " site.title ",
				configType: "basic",
			})
			.mockResolvedValueOnce({
				configKey: "site.title",
				configValue: "Smart Community",
				configType: "basic",
				configDescription: "Site title",
				status: "enabled",
			})
			.mockResolvedValueOnce({
				id: "SYSTEM_CONFIG_001",
				configValue: "Smart Community v2",
				status: "disabled",
			})
			.mockResolvedValueOnce({ id: "SYSTEM_CONFIG_001" });
		const calls: Array<{ method: string; input: Record<string, unknown> }> = [];
		const event = createRouteEvent({
			context: {
				settingRuntime: {
					adminAdapter: {
						listSystemConfig: async (input: Record<string, unknown>) =>
							recordCall(calls, "listSystemConfig", input, {
								list: [systemConfigFixture()],
								total: 1,
								pageIndex: input.pageIndex,
								pageSize: input.pageSize,
								totalPages: 1,
							}),
						createSystemConfig: async (input: Record<string, unknown>) =>
							recordCall(calls, "createSystemConfig", input, systemConfigFixture({ id: "SYSTEM_CONFIG_CREATED" })),
						updateSystemConfig: async (input: Record<string, unknown>) =>
							recordCall(calls, "updateSystemConfig", input, systemConfigFixture({ id: "SYSTEM_CONFIG_001" })),
						deleteSystemConfig: async (input: Record<string, unknown>) =>
							recordCall(calls, "deleteSystemConfig", input, null, "delete ok"),
					},
				},
			},
		});

		await listSystemConfigHandler(event);
		await createSystemConfigHandler(event);
		await updateSystemConfigHandler(event);
		await deleteSystemConfigHandler(event);

		expect(calls).toEqual([
			{
				method: "listSystemConfig",
				input: {
					pageIndex: 2,
					pageSize: 7,
					configKey: " site.title ",
					configType: "basic",
				},
			},
			{
				method: "createSystemConfig",
				input: {
					configKey: "site.title",
					configValue: "Smart Community",
					configType: "basic",
					configDescription: "Site title",
					status: "enabled",
				},
			},
			{
				method: "updateSystemConfig",
				input: {
					id: "SYSTEM_CONFIG_001",
					configValue: "Smart Community v2",
					status: "disabled",
				},
			},
			{ method: "deleteSystemConfig", input: { id: "SYSTEM_CONFIG_001" } },
		]);
	});

	test("adapter trims system-config list filters and drops blank filters", async () => {
		const { createAdminSettingAdapter } = await import("../../server/modules/setting/admin-adapter");
		const calls: Record<string, unknown>[] = [];
		const adapter = createAdminSettingAdapter({
			listSystemConfig: async (params: Record<string, unknown>) => {
				calls.push(params);
				return { list: [], total: 0 };
			},
		} as any);

		await adapter.listSystemConfig({
			pageIndex: 2,
			pageSize: 7,
			configKey: " task100.system-config.sentinel ",
			configType: " runtime ",
			status: " enabled ",
		} as any);
		await adapter.listSystemConfig({
			pageIndex: 3,
			pageSize: 8,
			configKey: " ",
			configType: "\t",
			status: "",
		} as any);

		expect(calls).toEqual([
			{
				pageIndex: 2,
				pageSize: 7,
				configKey: "task100.system-config.sentinel",
				configType: "runtime",
				status: "enabled",
			},
			{
				pageIndex: 3,
				pageSize: 8,
			},
		]);
	});

	test("repository list filters system-config count and rows with the same where", async () => {
		const db = createTableCaptureDb();
		const repository = createDbSettingRepository(db as any);

		await repository.listSystemConfig({
			pageIndex: 1,
			pageSize: 10,
			configKey: "task100.system-config.sentinel",
			configType: "runtime",
			status: "enabled",
		} as any);

		expect(db.whereArgs).toHaveLength(2);
		expect(db.whereArgs[0]).toBeDefined();
		expect(db.whereArgs[0]).toBe(db.whereArgs[1]);
	});

	test("repository ignores blank system-config filters", async () => {
		const db = createTableCaptureDb();
		const repository = createDbSettingRepository(db as any);

		await repository.listSystemConfig({
			pageIndex: 1,
			pageSize: 10,
			configKey: " ",
			configType: "\t",
			status: "",
		} as any);

		expect(db.whereArgs).toEqual([undefined, undefined]);
	});

	test("repository CRUD uses sm_system_configs", async () => {
		const db = createTableCaptureDb();
		const repository = createDbSettingRepository(db as any);

		await repository.listSystemConfig({ pageIndex: 1, pageSize: 10 });
		await repository.createSystemConfig({
			configKey: "site.title",
			configValue: "Smart Community",
			configType: "basic",
			configDescription: "Site title",
			status: "enabled",
		});
		await repository.updateSystemConfig({
			id: "SYSTEM_CONFIG_001",
			configValue: "Smart Community v2",
			status: "disabled",
		});
		await repository.deleteSystemConfig("SYSTEM_CONFIG_001");

		expect(db.tables).toContain("sm_system_configs");
		expect(db.ops).toEqual(expect.arrayContaining(["select", "insert", "update", "delete"]));
	});

	test("adapter validates missing id for delete", async () => {
		const { createAdminSettingAdapter } = await import("../../server/modules/setting/admin-adapter");
		const { createSettingService } = await import("../../server/modules/setting/service");
		const adapter = createAdminSettingAdapter(createSettingService(createNoopSettingRepository()));

		await expect(adapter.deleteSystemConfig({})).resolves.toMatchObject({
			success: false,
			code: 400,
			data: null,
		});
	});
});

function setDatabaseUrlForInjectedRuntime(): void {
	process.env.DATABASE_URL = "postgres://setting-system-config.test/runtime";
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

function systemConfigFixture(overrides: Record<string, unknown> = {}) {
	return {
		id: "SYSTEM_CONFIG_001",
		configId: "SYSTEM_CONFIG_001",
		title: "site.title",
		subtitle: "Site title",
		shortName: "",
		companyName: "",
		logoUrl: "",
		staticUrl: "",
		defaultCommunityCode: "",
		ownerTitle: "",
		propertyMobileTitle: "",
		qqMapKey: "",
		mallUrl: "",
		configKey: "site.title",
		configValue: "Smart Community",
		description: "Site title",
		category: "basic",
		isSystem: true,
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
			return createWriteQuery([systemConfigFixture({ id: "SYSTEM_CONFIG_CREATED" })]);
		}),
		update: vi.fn((table: unknown) => {
			db.ops.push("update");
			db.tables.push(getTableName(table));
			return createWriteQuery([systemConfigFixture({ id: "SYSTEM_CONFIG_001" })]);
		}),
		delete: vi.fn((table: unknown) => {
			db.ops.push("delete");
			db.tables.push(getTableName(table));
			return createDeleteQuery([{ id: "SYSTEM_CONFIG_001" }]);
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
		where: vi.fn((whereArg?: unknown) => {
			db.whereArgs.push(whereArg);
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
