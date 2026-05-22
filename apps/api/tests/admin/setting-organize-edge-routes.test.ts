import { afterEach, describe, expect, test, vi } from "vitest";

import { createAdminSettingAdapter } from "../../server/modules/setting/admin-adapter";
import { createDbSettingRepository } from "../../server/modules/setting/repository";
import { createSettingService } from "../../server/modules/setting/service";
import debugEnvHandler from "../../server/routes/api/debug-env.get";
import commonMenuHandler from "../../server/routes/api/j1-dashboard/center/commonmenu/get";
import orgInfoTreeHandler from "../../server/routes/api/setting-manage/organize-manage/org-info/tree.post";
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

describe("setting organize edge routes", () => {
	afterEach(() => {
		restoreEnv();
	});

	test("manifest records org-info tree but excludes debug and placeholder commonmenu routes", () => {
		const urls = runtimeEndpointManifest.map((item) => item.url);

		expect(runtimeEndpointManifest).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					url: "/api/setting-manage/organize-manage/org-info/tree",
					method: "POST",
					targetClient: "admin",
					routeKind: "admin-canonical",
					ownerModule: "setting",
					phase: "phase7-setting-organize-manage-admin-edge",
					responseContract: "JsonVO",
					cutoverStatus: "available-in-apps-api-not-caller-verified",
				}),
			]),
		);
		expect(urls).not.toContain("/api/debug-env");
		expect(urls).not.toContain("/api/j1-dashboard/center/commonmenu/get");
	});

	test("org-info tree route dispatches to the setting runtime adapter", async () => {
		setDatabaseUrlForInjectedRuntime();
		mockedReadBody.mockResolvedValueOnce({ includeDisabled: false });
		const calls: Record<string, unknown>[] = [];
		const event = createRouteEvent({
			context: {
				settingRuntime: {
					adminAdapter: {
						getOrgInfoTree: async (input: Record<string, unknown>) => {
							calls.push(input);
							return {
								success: true,
								code: 200,
								message: "query ok",
								data: [organizationTreeFixture()],
							};
						},
					},
				},
			},
		});

		const response = await orgInfoTreeHandler(event);

		expect(calls).toEqual([{ includeDisabled: false }]);
		expect(response).toMatchObject({
			success: true,
			code: 200,
			data: [
				{
					id: "ORG_ROOT",
					name: "Root Organization",
				},
			],
		});
	});

	test("org-info tree adapter returns repository-backed tree nodes", async () => {
		const adapter = createAdminSettingAdapter(createSettingService(createNoopSettingRepository()));

		const response = await adapter.getOrgInfoTree({});

		expect(response).toMatchObject({
			success: true,
			code: 200,
			data: [
				{
					id: "ORG_ROOT",
					name: "Root Organization",
					code: "ROOT",
					type: "company",
					sort: 1,
					children: [
						{
							id: "ORG_CHILD",
							name: "Child Organization",
							parentId: "ORG_ROOT",
						},
					],
				},
			],
		});
	});

	test("org-info tree repository reads sm_organizations and builds parent-child hierarchy", async () => {
		const db = createOrgTreeCaptureDb([
			organizationRowFixture({
				id: "ORG_ROOT",
				orgName: "Root Organization",
				orgCode: "ROOT",
				orgType: "company",
				sortOrder: 1,
				parentId: null,
				remark: "root remark",
			}),
			organizationRowFixture({
				id: "ORG_CHILD",
				orgName: "Child Organization",
				orgCode: "CHILD",
				orgType: "department",
				sortOrder: 2,
				parentId: "ORG_ROOT",
				remark: null,
			}),
			organizationRowFixture({
				id: "ORG_ORPHAN",
				orgName: "Orphan Organization",
				orgCode: "ORPHAN",
				orgType: "team",
				sortOrder: 3,
				parentId: "MISSING_PARENT",
				remark: "orphan remark",
			}),
		]);
		const repository = createDbSettingRepository(db as any);

		const tree = await (repository as any).getOrgInfoTree();

		expect(db.tables).toContain("sm_organizations");
		expect(db.ops).toEqual(expect.arrayContaining(["select", "orderBy"]));
		expect(tree).toMatchObject([
			{
				id: "ORG_ROOT",
				name: "Root Organization",
				code: "ROOT",
				type: "company",
				sort: 1,
				description: "root remark",
				children: [
					{
						id: "ORG_CHILD",
						name: "Child Organization",
						code: "CHILD",
						type: "department",
						sort: 2,
						parentId: "ORG_ROOT",
					},
				],
			},
			{
				id: "ORG_ORPHAN",
				name: "Orphan Organization",
				code: "ORPHAN",
				parentId: "MISSING_PARENT",
			},
		]);
	});

	test("debug-env and commonmenu stay as non-migrated diagnostic or placeholder routes", async () => {
		const debugResponse = await debugEnvHandler(createRouteEvent());
		const commonMenuResponse = await commonMenuHandler(createRouteEvent());

		expect(debugResponse).toMatchObject({
			success: true,
			code: 200,
			data: {
				nodeEnv: expect.any(String),
				nitro: true,
			},
		});
		expect(commonMenuResponse).toMatchObject({
			success: true,
			code: 200,
			data: [],
		});
	});
});

function setDatabaseUrlForInjectedRuntime(): void {
	process.env.DATABASE_URL = "postgres://setting-organize-edge.test/runtime";
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

function createNoopSettingRepository(): any {
	return {
		listDataPermission: async () => ({ list: [], total: 0 }),
		listOrgInfo: async () => ({ list: [], total: 0 }),
		getOrgInfoTree: async () => [organizationTreeFixture()],
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

function organizationTreeFixture() {
	return {
		id: "ORG_ROOT",
		name: "Root Organization",
		code: "ROOT",
		type: "company",
		sort: 1,
		children: [
			{
				id: "ORG_CHILD",
				name: "Child Organization",
				code: "CHILD",
				type: "department",
				sort: 2,
				parentId: "ORG_ROOT",
				children: [],
			},
		],
	};
}

function organizationRowFixture(overrides: Record<string, unknown>) {
	return {
		id: "ORG_DEFAULT",
		orgName: "Default Organization",
		orgCode: "DEFAULT",
		orgType: "company",
		sortOrder: 1,
		parentId: null,
		remark: null,
		...overrides,
	};
}

function createOrgTreeCaptureDb(rows: Record<string, unknown>[]) {
	const db = {
		ops: [] as string[],
		tables: [] as string[],
		select: vi.fn(() => {
			db.ops.push("select");
			return createQuery(db, rows);
		}),
	};
	return db;
}

function createQuery(db: { ops: string[]; tables: string[] }, result: Record<string, unknown>[]) {
	const query = {
		from: vi.fn((table: unknown) => {
			db.tables.push(getTableName(table));
			return query;
		}),
		orderBy: vi.fn(() => {
			db.ops.push("orderBy");
			return query;
		}),
		then: (onFulfilled: (value: Record<string, unknown>[]) => unknown, onRejected?: (reason: unknown) => unknown) =>
			Promise.resolve(result).then(onFulfilled, onRejected),
	};
	return query;
}

function getTableName(table: unknown): string {
	if (table && typeof table === "object" && Symbol.for("drizzle:Name") in table) {
		return String((table as Record<symbol, unknown>)[Symbol.for("drizzle:Name")]);
	}
	return String(table);
}
