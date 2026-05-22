import { afterEach, describe, expect, test, vi } from "vitest";

import { createDbDevRepository } from "../../server/modules/dev/repository";

import createItemHandler from "../../server/routes/api/dev-team/config-manage/item/create.post";
import deleteItemHandler from "../../server/routes/api/dev-team/config-manage/item/delete.post";
import detailItemHandler from "../../server/routes/api/dev-team/config-manage/item/detail.get";
import listItemHandler from "../../server/routes/api/dev-team/config-manage/item/list.post";
import updateItemHandler from "../../server/routes/api/dev-team/config-manage/item/update.post";
import { runtimeEndpointManifest } from "../../server/shared/runtime/runtime-endpoints";

vi.mock("nitro/h3", async (importOriginal) => {
	const actual = await importOriginal<typeof import("nitro/h3")>();
	return {
		...actual,
		getQuery: vi.fn(),
		readBody: vi.fn(),
	};
});

const { getQuery, readBody } = await import("nitro/h3");
const mockedGetQuery = vi.mocked(getQuery);
const mockedReadBody = vi.mocked(readBody);

const envSnapshot = {
	DATABASE_URL: process.env.DATABASE_URL,
	NITRO_DATABASE_URL: process.env.NITRO_DATABASE_URL,
	comm_admin_11__DATABASE_URL: process.env.comm_admin_11__DATABASE_URL,
};

const itemEndpointSpecs = [
	{ url: "/api/dev-team/config-manage/item/list", method: "POST" },
	{ url: "/api/dev-team/config-manage/item/create", method: "POST" },
	{ url: "/api/dev-team/config-manage/item/detail", method: "GET" },
	{ url: "/api/dev-team/config-manage/item/update", method: "POST" },
	{ url: "/api/dev-team/config-manage/item/delete", method: "POST" },
] as const;

describe("dev-team config-manage item admin endpoints", () => {
	afterEach(() => {
		restoreEnv();
	});

	test("manifest records all item CRUD endpoints with the real HTTP methods", () => {
		for (const spec of itemEndpointSpecs) {
			expect(runtimeEndpointManifest).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						url: spec.url,
						method: spec.method,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "dev",
						phase: "phase7-dev-config-manage-admin-crud",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				]),
			);
		}
	});

	test("routes dispatch list, detail and mutations to the dev runtime adapter", async () => {
		setDatabaseUrlForInjectedRuntime();
		mockedReadBody
			.mockResolvedValueOnce({ pageIndex: 2, pageSize: 7, dictionaryId: " DICT_001 ", itemName: " 启用 " })
			.mockResolvedValueOnce({
				dictionaryId: "DICT_001",
				itemName: "启用",
				itemCode: "enabled",
				sortOrder: 1,
				isDefault: true,
			})
			.mockResolvedValueOnce({
				id: "ITEM_001",
				itemName: "禁用",
				itemCode: "disabled",
			})
			.mockResolvedValueOnce({ id: "ITEM_001" });
		mockedGetQuery.mockReturnValue({ id: "ITEM_001" });
		const calls: Array<{ method: string; input: Record<string, unknown> }> = [];
		const event = createRouteEvent({
			context: {
				devRuntime: {
					adminAdapter: {
						listDictionaryItem: async (input: Record<string, unknown>) =>
							recordCall(calls, "listDictionaryItem", input, {
								list: [itemFixture()],
								total: 1,
								pageIndex: input.pageIndex,
								pageSize: input.pageSize,
								totalPages: 1,
							}),
						createDictionaryItem: async (input: Record<string, unknown>) =>
							recordCall(calls, "createDictionaryItem", input, itemFixture({ id: "ITEM_CREATED" })),
						getDictionaryItemDetail: async (input: Record<string, unknown>) =>
							recordCall(calls, "getDictionaryItemDetail", input, itemFixture()),
						updateDictionaryItem: async (input: Record<string, unknown>) =>
							recordCall(calls, "updateDictionaryItem", input, itemFixture({ id: "ITEM_001" })),
						deleteDictionaryItem: async (input: Record<string, unknown>) =>
							recordCall(calls, "deleteDictionaryItem", input, null, "删除成功"),
					},
				},
			},
		});

		await listItemHandler(event);
		await createItemHandler(event);
		await detailItemHandler(event);
		await updateItemHandler(event);
		await deleteItemHandler(event);

		expect(calls).toEqual([
			{
				method: "listDictionaryItem",
				input: { pageIndex: 2, pageSize: 7, dictionaryId: " DICT_001 ", itemName: " 启用 " },
			},
			{
				method: "createDictionaryItem",
				input: {
					dictionaryId: "DICT_001",
					itemName: "启用",
					itemCode: "enabled",
					sortOrder: 1,
					isDefault: true,
				},
			},
			{ method: "getDictionaryItemDetail", input: { id: "ITEM_001" } },
			{ method: "updateDictionaryItem", input: { id: "ITEM_001", itemName: "禁用", itemCode: "disabled" } },
			{ method: "deleteDictionaryItem", input: { id: "ITEM_001" } },
		]);
	});

	test("repository CRUD uses dt_dictionary_items and not dictionaries", async () => {
		const db = createTableCaptureDb();
		const repository = createDbDevRepository(db as any);

		await repository.listDictionaryItem({ pageIndex: 1, pageSize: 10, dictionaryId: "DICT_001", itemName: "启用" });
		await repository.createDictionaryItem({ dictionaryId: "DICT_001", itemName: "启用", itemCode: "enabled" });
		await repository.getDictionaryItemDetail("ITEM_001");
		await repository.updateDictionaryItem({ id: "ITEM_001", itemName: "禁用" });
		await repository.deleteDictionaryItem("ITEM_001");

		expect(db.tables).toContain("dt_dictionary_items");
		expect(db.tables).not.toContain("dt_dictionaries");
		expect(db.ops).toEqual(expect.arrayContaining(["select", "insert", "update", "delete"]));
	});

	test("adapter validates missing id for detail and delete", async () => {
		const { createAdminDevAdapter } = await import("../../server/modules/dev/admin-adapter");
		const { createDevService } = await import("../../server/modules/dev/service");
		const adapter = createAdminDevAdapter(createDevService(createNoopDevRepository()));

		await expect(adapter.getDictionaryItemDetail({})).resolves.toMatchObject({
			success: false,
			code: 400,
			data: null,
		});
		await expect(adapter.deleteDictionaryItem({ id: " " })).resolves.toMatchObject({
			success: false,
			code: 400,
			data: null,
		});
	});
});

function setDatabaseUrlForInjectedRuntime(): void {
	process.env.DATABASE_URL = "postgres://dev-config-item.test/runtime";
	delete process.env.NITRO_DATABASE_URL;
	delete process.env.comm_admin_11__DATABASE_URL;
}

function restoreEnv(): void {
	restoreEnvVar("DATABASE_URL", envSnapshot.DATABASE_URL);
	restoreEnvVar("NITRO_DATABASE_URL", envSnapshot.NITRO_DATABASE_URL);
	restoreEnvVar("comm_admin_11__DATABASE_URL", envSnapshot.comm_admin_11__DATABASE_URL);
	mockedGetQuery.mockReset();
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
	message = "查询成功",
) {
	calls.push({ method, input });
	return {
		success: true,
		code: 200,
		message,
		data,
	};
}

function itemFixture(overrides: Record<string, unknown> = {}) {
	return {
		id: "ITEM_001",
		dictionaryId: "DICT_001",
		itemName: "启用",
		itemCode: "enabled",
		itemValue: "enabled",
		sortOrder: 1,
		remark: null,
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
			return createWriteQuery([itemFixture({ id: "ITEM_CREATED" })]);
		}),
		update: vi.fn((table: unknown) => {
			db.ops.push("update");
			db.tables.push(getTableName(table));
			return createWriteQuery([itemFixture({ id: "ITEM_001" })]);
		}),
		delete: vi.fn((table: unknown) => {
			db.ops.push("delete");
			db.tables.push(getTableName(table));
			return createDeleteQuery([{ id: "ITEM_001" }]);
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

function createNoopDevRepository(): any {
	return {
		listRefreshCache: async () => ({ list: [], total: 0 }),
		listConfigCenter: async () => ({ list: [], total: 0 }),
		listDictionary: async () => ({ list: [], total: 0 }),
		listDictionaryItem: async () => ({ list: [], total: 0 }),
		listDictionaryType: async () => ({ list: [], total: 0 }),
		listMenuCatalog: async () => ({ list: [], total: 0 }),
		listMenuGroup: async () => ({ list: [], total: 0 }),
		listMenuItem: async () => ({ list: [], total: 0 }),
		createConfigCenter: async () => null,
		getConfigCenterDetail: async () => null,
		updateConfigCenter: async () => null,
		deleteConfigCenter: async () => false,
		createDictionary: async () => null,
		getDictionaryDetail: async () => null,
		updateDictionary: async () => null,
		deleteDictionary: async () => false,
		createDictionaryItem: async () => null,
		getDictionaryItemDetail: async () => null,
		updateDictionaryItem: async () => null,
		deleteDictionaryItem: async () => false,
		createDictionaryType: async () => null,
		getDictionaryTypeDetail: async () => null,
		updateDictionaryType: async () => null,
		deleteDictionaryType: async () => false,
	};
}
