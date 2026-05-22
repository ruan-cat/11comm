import { afterEach, describe, expect, test, vi } from "vitest";

import { createDbSettingRepository } from "../../server/modules/setting/repository";

import createCommunityConfigurationHandler from "../../server/routes/api/setting-manage/system-manage/community-configuration/create.post";
import deleteCommunityConfigurationHandler from "../../server/routes/api/setting-manage/system-manage/community-configuration/delete.post";
import listCommunityConfigurationHandler from "../../server/routes/api/setting-manage/system-manage/community-configuration/list.post";
import updateCommunityConfigurationHandler from "../../server/routes/api/setting-manage/system-manage/community-configuration/update.post";
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

const communityConfigurationEndpointSpecs = [
	{ url: "/api/setting-manage/system-manage/community-configuration/list", method: "POST" },
	{ url: "/api/setting-manage/system-manage/community-configuration/create", method: "POST" },
	{ url: "/api/setting-manage/system-manage/community-configuration/update", method: "POST" },
	{ url: "/api/setting-manage/system-manage/community-configuration/delete", method: "POST" },
] as const;

describe("setting-manage system-manage community-configuration admin endpoints", () => {
	afterEach(() => {
		restoreEnv();
	});

	test("manifest records all community-configuration endpoints", () => {
		for (const spec of communityConfigurationEndpointSpecs) {
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
				settingName: " security ",
				settingType: "system",
			})
			.mockResolvedValueOnce({
				csId: "CS_001",
				communityId: "COMM_001",
				communityName: "Demo Community",
				settingName: "securityLevel",
				settingValue: "high",
				settingType: "system",
				statusCd: "1",
			})
			.mockResolvedValueOnce({
				id: "COMMUNITY_CONFIGURATION_001",
				settingValue: "medium",
				remark: "manual review",
			})
			.mockResolvedValueOnce({ id: "COMMUNITY_CONFIGURATION_001" });
		const calls: Array<{ method: string; input: Record<string, unknown> }> = [];
		const event = createRouteEvent({
			context: {
				settingRuntime: {
					adminAdapter: {
						listCommunityConfiguration: async (input: Record<string, unknown>) =>
							recordCall(calls, "listCommunityConfiguration", input, {
								list: [communityConfigurationFixture()],
								total: 1,
								pageIndex: input.pageIndex,
								pageSize: input.pageSize,
								totalPages: 1,
							}),
						createCommunityConfiguration: async (input: Record<string, unknown>) =>
							recordCall(
								calls,
								"createCommunityConfiguration",
								input,
								communityConfigurationFixture({ id: "COMMUNITY_CONFIGURATION_CREATED" }),
							),
						updateCommunityConfiguration: async (input: Record<string, unknown>) =>
							recordCall(
								calls,
								"updateCommunityConfiguration",
								input,
								communityConfigurationFixture({ id: "COMMUNITY_CONFIGURATION_001" }),
							),
						deleteCommunityConfiguration: async (input: Record<string, unknown>) =>
							recordCall(calls, "deleteCommunityConfiguration", input, null, "delete ok"),
					},
				},
			},
		});

		await listCommunityConfigurationHandler(event);
		await createCommunityConfigurationHandler(event);
		await updateCommunityConfigurationHandler(event);
		await deleteCommunityConfigurationHandler(event);

		expect(calls).toEqual([
			{
				method: "listCommunityConfiguration",
				input: {
					pageIndex: 2,
					pageSize: 7,
					settingName: " security ",
					settingType: "system",
				},
			},
			{
				method: "createCommunityConfiguration",
				input: {
					csId: "CS_001",
					communityId: "COMM_001",
					communityName: "Demo Community",
					settingName: "securityLevel",
					settingValue: "high",
					settingType: "system",
					statusCd: "1",
				},
			},
			{
				method: "updateCommunityConfiguration",
				input: { id: "COMMUNITY_CONFIGURATION_001", settingValue: "medium", remark: "manual review" },
			},
			{ method: "deleteCommunityConfiguration", input: { id: "COMMUNITY_CONFIGURATION_001" } },
		]);
	});

	test("repository CRUD uses sm_community_configurations", async () => {
		const db = createTableCaptureDb();
		const repository = createDbSettingRepository(db as any);

		await repository.listCommunityConfiguration({
			pageIndex: 1,
			pageSize: 10,
			settingName: "security",
			settingType: "system",
		});
		await repository.createCommunityConfiguration({
			csId: "CS_001",
			communityId: "COMM_001",
			communityName: "Demo Community",
			settingName: "securityLevel",
			settingType: "system",
			statusCd: "1",
		});
		await repository.updateCommunityConfiguration({
			id: "COMMUNITY_CONFIGURATION_001",
			settingValue: "medium",
		});
		await repository.deleteCommunityConfiguration("COMMUNITY_CONFIGURATION_001");

		expect(db.tables).toContain("sm_community_configurations");
		expect(db.ops).toEqual(expect.arrayContaining(["select", "insert", "update", "delete"]));
	});

	test("adapter validates missing id for delete", async () => {
		const { createAdminSettingAdapter } = await import("../../server/modules/setting/admin-adapter");
		const { createSettingService } = await import("../../server/modules/setting/service");
		const adapter = createAdminSettingAdapter(createSettingService(createNoopSettingRepository()));

		await expect(adapter.deleteCommunityConfiguration({})).resolves.toMatchObject({
			success: false,
			code: 400,
			data: null,
		});
	});
});

function setDatabaseUrlForInjectedRuntime(): void {
	process.env.DATABASE_URL = "postgres://setting-community-configuration.test/runtime";
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

function communityConfigurationFixture(overrides: Record<string, unknown> = {}) {
	return {
		id: "COMMUNITY_CONFIGURATION_001",
		csId: "CS_001",
		communityId: "COMM_001",
		communityName: "Demo Community",
		settingName: "securityLevel",
		settingValue: "high",
		settingType: "system",
		statusCd: "1",
		remark: "ok",
		createTime: "2026-05-20 09:00:00",
		updateTime: "2026-05-20 10:00:00",
		operator: "system",
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
			return createWriteQuery([communityConfigurationFixture({ id: "COMMUNITY_CONFIGURATION_CREATED" })]);
		}),
		update: vi.fn((table: unknown) => {
			db.ops.push("update");
			db.tables.push(getTableName(table));
			return createWriteQuery([communityConfigurationFixture({ id: "COMMUNITY_CONFIGURATION_001" })]);
		}),
		delete: vi.fn((table: unknown) => {
			db.ops.push("delete");
			db.tables.push(getTableName(table));
			return createDeleteQuery([{ id: "COMMUNITY_CONFIGURATION_001" }]);
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
