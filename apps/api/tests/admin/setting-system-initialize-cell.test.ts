import { afterEach, describe, expect, test, vi } from "vitest";

import { createDbSettingRepository } from "../../server/modules/setting/repository";

import createInitializeCellHandler from "../../server/routes/api/setting-manage/system-manage/initialize-cell/create.post";
import deleteInitializeCellHandler from "../../server/routes/api/setting-manage/system-manage/initialize-cell/delete.post";
import listInitializeCellHandler from "../../server/routes/api/setting-manage/system-manage/initialize-cell/list.post";
import updateInitializeCellHandler from "../../server/routes/api/setting-manage/system-manage/initialize-cell/update.post";
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

const initializeCellEndpointSpecs = [
	{ url: "/api/setting-manage/system-manage/initialize-cell/list", method: "POST" },
	{ url: "/api/setting-manage/system-manage/initialize-cell/create", method: "POST" },
	{ url: "/api/setting-manage/system-manage/initialize-cell/update", method: "POST" },
	{ url: "/api/setting-manage/system-manage/initialize-cell/delete", method: "POST" },
] as const;

describe("setting-manage system-manage initialize-cell admin endpoints", () => {
	afterEach(() => {
		restoreEnv();
	});

	test("manifest records all initialize-cell endpoints", () => {
		for (const spec of initializeCellEndpointSpecs) {
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
				initItem: " building ",
				initStatus: "pending",
			})
			.mockResolvedValueOnce({
				initItem: "building",
				initStatus: "pending",
				configParams: { communityId: "COMM_001" },
			})
			.mockResolvedValueOnce({
				id: "INITIALIZE_CELL_001",
				initStatus: "completed",
				configParams: { communityId: "COMM_001", finished: true },
			})
			.mockResolvedValueOnce({ id: "INITIALIZE_CELL_001" });
		const calls: Array<{ method: string; input: Record<string, unknown> }> = [];
		const event = createRouteEvent({
			context: {
				settingRuntime: {
					adminAdapter: {
						listInitializeCell: async (input: Record<string, unknown>) =>
							recordCall(calls, "listInitializeCell", input, {
								list: [initializeCellFixture()],
								total: 1,
								pageIndex: input.pageIndex,
								pageSize: input.pageSize,
								totalPages: 1,
							}),
						createInitializeCell: async (input: Record<string, unknown>) =>
							recordCall(
								calls,
								"createInitializeCell",
								input,
								initializeCellFixture({ id: "INITIALIZE_CELL_CREATED" }),
							),
						updateInitializeCell: async (input: Record<string, unknown>) =>
							recordCall(calls, "updateInitializeCell", input, initializeCellFixture({ id: "INITIALIZE_CELL_001" })),
						deleteInitializeCell: async (input: Record<string, unknown>) =>
							recordCall(calls, "deleteInitializeCell", input, null, "delete ok"),
					},
				},
			},
		});

		await listInitializeCellHandler(event);
		await createInitializeCellHandler(event);
		await updateInitializeCellHandler(event);
		await deleteInitializeCellHandler(event);

		expect(calls).toEqual([
			{
				method: "listInitializeCell",
				input: {
					pageIndex: 2,
					pageSize: 7,
					initItem: " building ",
					initStatus: "pending",
				},
			},
			{
				method: "createInitializeCell",
				input: {
					initItem: "building",
					initStatus: "pending",
					configParams: { communityId: "COMM_001" },
				},
			},
			{
				method: "updateInitializeCell",
				input: {
					id: "INITIALIZE_CELL_001",
					initStatus: "completed",
					configParams: { communityId: "COMM_001", finished: true },
				},
			},
			{ method: "deleteInitializeCell", input: { id: "INITIALIZE_CELL_001" } },
		]);
	});

	test("repository CRUD uses sm_initialize_cells", async () => {
		const db = createTableCaptureDb();
		const repository = createDbSettingRepository(db as any);

		await repository.listInitializeCell({ pageIndex: 1, pageSize: 10 });
		await repository.createInitializeCell({
			initItem: "building",
			initStatus: "pending",
			configParams: { communityId: "COMM_001" },
		});
		await repository.updateInitializeCell({
			id: "INITIALIZE_CELL_001",
			initStatus: "completed",
		});
		await repository.deleteInitializeCell("INITIALIZE_CELL_001");

		expect(db.tables).toContain("sm_initialize_cells");
		expect(db.ops).toEqual(expect.arrayContaining(["select", "insert", "update", "delete"]));
	});

	test("adapter forwards initialize-cell list filters after trimming blanks", async () => {
		const { createAdminSettingAdapter } = await import("../../server/modules/setting/admin-adapter");
		const { createSettingService } = await import("../../server/modules/setting/service");
		const calls: Record<string, unknown>[] = [];
		const repository = createNoopSettingRepository();
		repository.listInitializeCell = async (params: Record<string, unknown>) => {
			calls.push(params);
			return { list: [], total: 0 };
		};
		const adapter = createAdminSettingAdapter(createSettingService(repository));

		await adapter.listInitializeCell({
			pageIndex: 2,
			pageSize: 7,
			initItem: " building ",
			initStatus: " pending ",
		} as any);
		await adapter.listInitializeCell({
			pageIndex: 1,
			pageSize: 20,
			initItem: "   ",
			initStatus: "",
		} as any);

		expect(calls).toEqual([
			{
				pageIndex: 2,
				pageSize: 7,
				initItem: "building",
				initStatus: "pending",
			},
			{
				pageIndex: 1,
				pageSize: 20,
				initItem: undefined,
				initStatus: undefined,
			},
		]);
	});

	test("repository applies initialize-cell filters to both count and rows queries", async () => {
		const db = createTableCaptureDb();
		const repository = createDbSettingRepository(db as any);

		await repository.listInitializeCell({
			pageIndex: 1,
			pageSize: 10,
			initItem: " building ",
			initStatus: " pending ",
		} as any);

		expect(db.whereArgs).toHaveLength(2);
		expect(db.whereArgs[0]).toBeDefined();
		expect(db.whereArgs[1]).toBe(db.whereArgs[0]);
	});

	test("repository ignores blank initialize-cell filters", async () => {
		const db = createTableCaptureDb();
		const repository = createDbSettingRepository(db as any);

		await repository.listInitializeCell({
			pageIndex: 1,
			pageSize: 10,
			initItem: "   ",
			initStatus: "",
		} as any);

		expect(db.whereArgs).toEqual([undefined, undefined]);
	});

	test("adapter validates missing id for delete", async () => {
		const { createAdminSettingAdapter } = await import("../../server/modules/setting/admin-adapter");
		const { createSettingService } = await import("../../server/modules/setting/service");
		const adapter = createAdminSettingAdapter(createSettingService(createNoopSettingRepository()));

		await expect(adapter.deleteInitializeCell({})).resolves.toMatchObject({
			success: false,
			code: 400,
			data: null,
		});
	});
});

function setDatabaseUrlForInjectedRuntime(): void {
	process.env.DATABASE_URL = "postgres://setting-initialize-cell.test/runtime";
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

function initializeCellFixture(overrides: Record<string, unknown> = {}) {
	return {
		id: "INITIALIZE_CELL_001",
		initItem: "building",
		initStatus: "pending",
		configParams: { communityId: "COMM_001" },
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
			return createWriteQuery([initializeCellFixture({ id: "INITIALIZE_CELL_CREATED" })]);
		}),
		update: vi.fn((table: unknown) => {
			db.ops.push("update");
			db.tables.push(getTableName(table));
			return createWriteQuery([initializeCellFixture({ id: "INITIALIZE_CELL_001" })]);
		}),
		delete: vi.fn((table: unknown) => {
			db.ops.push("delete");
			db.tables.push(getTableName(table));
			return createDeleteQuery([{ id: "INITIALIZE_CELL_001" }]);
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
		where: vi.fn((condition: unknown) => {
			db.whereArgs.push(condition);
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
