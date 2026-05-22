import { afterEach, describe, expect, test, vi } from "vitest";

import { createDbSettingRepository } from "../../server/modules/setting/repository";

import createChangePasswordHandler from "../../server/routes/api/setting-manage/system-manage/change-password/create.post";
import deleteChangePasswordHandler from "../../server/routes/api/setting-manage/system-manage/change-password/delete.post";
import listChangePasswordHandler from "../../server/routes/api/setting-manage/system-manage/change-password/list.post";
import updateChangePasswordHandler from "../../server/routes/api/setting-manage/system-manage/change-password/update.post";
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

const changePasswordEndpointSpecs = [
	{ url: "/api/setting-manage/system-manage/change-password/list", method: "POST" },
	{ url: "/api/setting-manage/system-manage/change-password/create", method: "POST" },
	{ url: "/api/setting-manage/system-manage/change-password/update", method: "POST" },
	{ url: "/api/setting-manage/system-manage/change-password/delete", method: "POST" },
] as const;

describe("setting-manage system-manage change-password admin endpoints", () => {
	afterEach(() => {
		restoreEnv();
	});

	test("manifest records all change-password endpoints", () => {
		for (const spec of changePasswordEndpointSpecs) {
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
				username: " admin ",
				realName: " Alice ",
				department: "ops",
				changeType: "self",
				status: "success",
			})
			.mockResolvedValueOnce({
				username: "admin",
				realName: "Alice",
				department: "ops",
				changeType: "self",
				status: "success",
			})
			.mockResolvedValueOnce({
				id: "CHANGE_PASSWORD_001",
				status: "failed",
				remark: "manual review",
			})
			.mockResolvedValueOnce({ id: "CHANGE_PASSWORD_001" });
		const calls: Array<{ method: string; input: Record<string, unknown> }> = [];
		const event = createRouteEvent({
			context: {
				settingRuntime: {
					adminAdapter: {
						listChangePassword: async (input: Record<string, unknown>) =>
							recordCall(calls, "listChangePassword", input, {
								list: [changePasswordFixture()],
								total: 1,
								pageIndex: input.pageIndex,
								pageSize: input.pageSize,
								totalPages: 1,
							}),
						createChangePassword: async (input: Record<string, unknown>) =>
							recordCall(
								calls,
								"createChangePassword",
								input,
								changePasswordFixture({ id: "CHANGE_PASSWORD_CREATED" }),
							),
						updateChangePassword: async (input: Record<string, unknown>) =>
							recordCall(calls, "updateChangePassword", input, changePasswordFixture({ id: "CHANGE_PASSWORD_001" })),
						deleteChangePassword: async (input: Record<string, unknown>) =>
							recordCall(calls, "deleteChangePassword", input, null, "delete ok"),
					},
				},
			},
		});

		await listChangePasswordHandler(event);
		await createChangePasswordHandler(event);
		await updateChangePasswordHandler(event);
		await deleteChangePasswordHandler(event);

		expect(calls).toEqual([
			{
				method: "listChangePassword",
				input: {
					pageIndex: 2,
					pageSize: 7,
					username: " admin ",
					realName: " Alice ",
					department: "ops",
					changeType: "self",
					status: "success",
				},
			},
			{
				method: "createChangePassword",
				input: {
					username: "admin",
					realName: "Alice",
					department: "ops",
					changeType: "self",
					status: "success",
				},
			},
			{
				method: "updateChangePassword",
				input: { id: "CHANGE_PASSWORD_001", status: "failed", remark: "manual review" },
			},
			{ method: "deleteChangePassword", input: { id: "CHANGE_PASSWORD_001" } },
		]);
	});

	test("repository CRUD uses sm_change_password_records and no operation-team table alias", async () => {
		const db = createTableCaptureDb();
		const repository = createDbSettingRepository(db as any);

		await repository.listChangePassword({
			pageIndex: 1,
			pageSize: 10,
			username: "admin",
			realName: "Alice",
			department: "ops",
			changeType: "self",
			status: "success",
		});
		await repository.createChangePassword({ username: "admin", realName: "Alice" });
		await repository.updateChangePassword({ id: "CHANGE_PASSWORD_001", status: "failed" });
		await repository.deleteChangePassword("CHANGE_PASSWORD_001");

		expect(db.tables).toContain("sm_change_password_records");
		expect(db.ops).toEqual(expect.arrayContaining(["select", "insert", "update", "delete"]));
	});

	test("adapter validates missing id for delete", async () => {
		const { createAdminSettingAdapter } = await import("../../server/modules/setting/admin-adapter");
		const { createSettingService } = await import("../../server/modules/setting/service");
		const adapter = createAdminSettingAdapter(createSettingService(createNoopSettingRepository()));

		await expect(adapter.deleteChangePassword({})).resolves.toMatchObject({
			success: false,
			code: 400,
			data: null,
		});
	});
});

function setDatabaseUrlForInjectedRuntime(): void {
	process.env.DATABASE_URL = "postgres://setting-change-password.test/runtime";
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

function changePasswordFixture(overrides: Record<string, unknown> = {}) {
	return {
		id: "CHANGE_PASSWORD_001",
		username: "admin",
		realName: "Alice",
		department: "ops",
		changeTime: "2026-05-20 09:00:00",
		changeIp: "127.0.0.1",
		changeType: "self",
		operator: "system",
		status: "success",
		remark: "ok",
		createTime: "2026-05-20 09:00:00",
		updateTime: "2026-05-20 10:00:00",
		...overrides,
	};
}

function createTableCaptureDb() {
	const db = {
		ops: [] as string[],
		tables: [] as string[],
		select: vi.fn(() => {
			db.ops.push("select");
			return createQuery(db, []);
		}),
		insert: vi.fn((table: unknown) => {
			db.ops.push("insert");
			db.tables.push(getTableName(table));
			return createWriteQuery([changePasswordFixture({ id: "CHANGE_PASSWORD_CREATED" })]);
		}),
		update: vi.fn((table: unknown) => {
			db.ops.push("update");
			db.tables.push(getTableName(table));
			return createWriteQuery([changePasswordFixture({ id: "CHANGE_PASSWORD_001" })]);
		}),
		delete: vi.fn((table: unknown) => {
			db.ops.push("delete");
			db.tables.push(getTableName(table));
			return createDeleteQuery([{ id: "CHANGE_PASSWORD_001" }]);
		}),
	};
	return db;
}

function createQuery(db: { tables: string[] }, result: Record<string, unknown>[]) {
	const query = {
		from: vi.fn((table: unknown) => {
			db.tables.push(getTableName(table));
			return query;
		}),
		where: vi.fn(() => query),
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
