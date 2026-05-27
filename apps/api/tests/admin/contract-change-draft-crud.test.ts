import { afterEach, describe, expect, test, vi } from "vitest";

import { createDbContractRepository } from "../../server/modules/contract/repository";

import createChangeHandler from "../../server/routes/api/property-manage/contract-manage/change/create.post";
import deleteChangeHandler from "../../server/routes/api/property-manage/contract-manage/change/delete.post";
import detailChangeHandler from "../../server/routes/api/property-manage/contract-manage/change/detail.post";
import updateChangeHandler from "../../server/routes/api/property-manage/contract-manage/change/update.post";
import createDraftContractHandler from "../../server/routes/api/property-manage/contract-manage/draft-contract/create.post";
import deleteDraftContractHandler from "../../server/routes/api/property-manage/contract-manage/draft-contract/delete.post";
import detailDraftContractHandler from "../../server/routes/api/property-manage/contract-manage/draft-contract/detail.post";
import updateDraftContractHandler from "../../server/routes/api/property-manage/contract-manage/draft-contract/update.post";
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

const contractChangeCrudEndpointSpecs = [
	{ url: "/api/property-manage/contract-manage/change/create", method: "POST" },
	{ url: "/api/property-manage/contract-manage/change/detail", method: "POST" },
	{ url: "/api/property-manage/contract-manage/change/update", method: "POST" },
	{ url: "/api/property-manage/contract-manage/change/delete", method: "POST" },
] as const;

const draftContractCrudEndpointSpecs = [
	{ url: "/api/property-manage/contract-manage/draft-contract/create", method: "POST" },
	{ url: "/api/property-manage/contract-manage/draft-contract/detail", method: "POST" },
	{ url: "/api/property-manage/contract-manage/draft-contract/update", method: "POST" },
	{ url: "/api/property-manage/contract-manage/draft-contract/delete", method: "POST" },
] as const;

describe("property-manage contract-manage change and draft-contract admin CRUD endpoints", () => {
	afterEach(() => {
		restoreEnv();
	});

	test("manifest records change and draft-contract CRUD endpoints", () => {
		for (const spec of [...contractChangeCrudEndpointSpecs, ...draftContractCrudEndpointSpecs]) {
			expect(runtimeEndpointManifest).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						url: spec.url,
						method: spec.method,
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "contract",
						phase: "phase7-contract-manage-admin-crud",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				]),
			);
		}
	});

	test("routes dispatch change and draft-contract CRUD to the contract runtime adapter", async () => {
		setDatabaseUrlForInjectedRuntime();
		mockedReadBody
			.mockResolvedValueOnce({
				contractId: "CONTRACT_001",
				changeType: "amount",
				changeReason: "price changed",
			})
			.mockResolvedValueOnce({ id: "CHANGE_001" })
			.mockResolvedValueOnce({
				id: "CHANGE_001",
				changeReason: "price adjusted",
				approvalStatus: "pending",
			})
			.mockResolvedValueOnce({ id: "CHANGE_001" })
			.mockResolvedValueOnce({
				contractName: "Draft contract",
				contractNumber: "DRAFT_001",
				contractType: "service",
			})
			.mockResolvedValueOnce({ id: "CONTRACT_DRAFT_001" })
			.mockResolvedValueOnce({
				id: "CONTRACT_DRAFT_001",
				contractName: "Draft contract v2",
			})
			.mockResolvedValueOnce({ id: "CONTRACT_DRAFT_001" });
		const calls: Array<{ method: string; input: Record<string, unknown> }> = [];
		const event = createRouteEvent({
			context: {
				contractRuntime: {
					adminAdapter: {
						createChange: async (input: Record<string, unknown>) =>
							recordCall(calls, "createChange", input, changeFixture({ id: "CHANGE_CREATED" })),
						getChangeDetail: async (input: Record<string, unknown>) =>
							recordCall(calls, "getChangeDetail", input, changeFixture()),
						updateChange: async (input: Record<string, unknown>) =>
							recordCall(calls, "updateChange", input, changeFixture({ id: "CHANGE_001" })),
						deleteChange: async (input: Record<string, unknown>) =>
							recordCall(calls, "deleteChange", input, null, "delete ok"),
						createDraftContract: async (input: Record<string, unknown>) =>
							recordCall(calls, "createDraftContract", input, draftContractFixture({ id: "CONTRACT_DRAFT_CREATED" })),
						getDraftContractDetail: async (input: Record<string, unknown>) =>
							recordCall(calls, "getDraftContractDetail", input, draftContractFixture()),
						updateDraftContract: async (input: Record<string, unknown>) =>
							recordCall(calls, "updateDraftContract", input, draftContractFixture({ id: "CONTRACT_DRAFT_001" })),
						deleteDraftContract: async (input: Record<string, unknown>) =>
							recordCall(calls, "deleteDraftContract", input, null, "delete ok"),
					},
				},
			},
		});

		await createChangeHandler(event);
		await detailChangeHandler(event);
		await updateChangeHandler(event);
		await deleteChangeHandler(event);
		await createDraftContractHandler(event);
		await detailDraftContractHandler(event);
		await updateDraftContractHandler(event);
		await deleteDraftContractHandler(event);

		expect(calls).toEqual([
			{
				method: "createChange",
				input: {
					contractId: "CONTRACT_001",
					changeType: "amount",
					changeReason: "price changed",
				},
			},
			{ method: "getChangeDetail", input: { id: "CHANGE_001" } },
			{
				method: "updateChange",
				input: {
					id: "CHANGE_001",
					changeReason: "price adjusted",
					approvalStatus: "pending",
				},
			},
			{ method: "deleteChange", input: { id: "CHANGE_001" } },
			{
				method: "createDraftContract",
				input: {
					contractName: "Draft contract",
					contractNumber: "DRAFT_001",
					contractType: "service",
				},
			},
			{ method: "getDraftContractDetail", input: { id: "CONTRACT_DRAFT_001" } },
			{
				method: "updateDraftContract",
				input: {
					id: "CONTRACT_DRAFT_001",
					contractName: "Draft contract v2",
				},
			},
			{ method: "deleteDraftContract", input: { id: "CONTRACT_DRAFT_001" } },
		]);
	});

	test("repository CRUD uses ct_changes for change and ct_contracts for draft-contract", async () => {
		const db = createTableCaptureDb();
		const repository = createDbContractRepository(db as any);

		await repository.createChange({
			contractId: "CONTRACT_001",
			changeType: "amount",
			changeReason: "price changed",
		});
		await repository.getChangeDetail("CHANGE_001");
		await repository.updateChange({ id: "CHANGE_001", changeReason: "price adjusted" });
		await repository.deleteChange("CHANGE_001");
		await repository.createDraftContract({
			contractName: "Draft contract",
			contractNumber: "DRAFT_001",
			contractType: "service",
		});
		await repository.getDraftContractDetail("CONTRACT_DRAFT_001");
		await repository.updateDraftContract({ id: "CONTRACT_DRAFT_001", contractName: "Draft contract v2" });
		await repository.deleteDraftContract("CONTRACT_DRAFT_001");

		expect(db.tables).toEqual(expect.arrayContaining(["ct_changes", "ct_contracts"]));
		expect(db.ops).toEqual(expect.arrayContaining(["select", "insert", "update", "delete"]));
	});

	test("repository createChange resolves contractId from ct_contracts by contractNumber", async () => {
		const db = createTableCaptureDb({
			selectRows: [{ id: "CONTRACT_RESOLVED_001" }],
		});
		const repository = createDbContractRepository(db as any);

		await repository.createChange({
			contractNumber: "CT-2026-001",
			changeType: "amount",
			changeReason: "price changed",
		});

		expect(db.tables).toEqual(expect.arrayContaining(["ct_contracts", "ct_changes"]));
		expect(db.insertedValues).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					contractId: "CONTRACT_RESOLVED_001",
					changeType: "amount",
					changeReason: "price changed",
				}),
			]),
		);
	});

	test("repository listChange joins ct_contracts for contract filters in count and rows queries", async () => {
		const db = createTableCaptureDb();
		const repository = createDbContractRepository(db as any);

		await repository.listChange({
			pageIndex: 1,
			pageSize: 10,
			contractNumber: "P7-T101-DRAFT-001",
		});

		expect(db.joinTables.filter((table) => table === "ct_contracts")).toHaveLength(2);
	});

	test("adapter validates missing id for detail and delete", async () => {
		const { createAdminContractAdapter } = await import("../../server/modules/contract/admin-adapter");
		const { createContractService } = await import("../../server/modules/contract/service");
		const adapter = createAdminContractAdapter(createContractService(createNoopContractRepository()));

		await expect(adapter.getChangeDetail({})).resolves.toMatchObject({
			success: false,
			code: 400,
			data: null,
		});
		await expect(adapter.deleteChange({})).resolves.toMatchObject({
			success: false,
			code: 400,
			data: null,
		});
		await expect(adapter.getDraftContractDetail({})).resolves.toMatchObject({
			success: false,
			code: 400,
			data: null,
		});
		await expect(adapter.deleteDraftContract({})).resolves.toMatchObject({
			success: false,
			code: 400,
			data: null,
		});
		await expect(adapter.deleteChange({ id: "  " } as any)).resolves.toMatchObject({
			success: false,
			code: 400,
			data: null,
		});
		await expect(adapter.deleteDraftContract({ ids: [] } as any)).resolves.toMatchObject({
			success: false,
			code: 400,
			data: null,
		});
		await expect(adapter.deleteDraftContract({ ids: ["  "] } as any)).resolves.toMatchObject({
			success: false,
			code: 400,
			data: null,
		});
	});

	test("adapter accepts ids payload for deleting change and draft-contract", async () => {
		const { createAdminContractAdapter } = await import("../../server/modules/contract/admin-adapter");
		const deleteChange = vi.fn(async () => true);
		const deleteDraftContract = vi.fn(async () => true);
		const adapter = createAdminContractAdapter({
			...createNoopContractRepository(),
			deleteChange,
			deleteDraftContract,
		} as any);

		await expect(adapter.deleteChange({ ids: ["CHANGE_001"] } as any)).resolves.toMatchObject({
			success: true,
			code: 200,
		});
		expect(deleteChange).toHaveBeenCalledWith("CHANGE_001");

		await expect(adapter.deleteDraftContract({ ids: ["CONTRACT_DRAFT_001"] } as any)).resolves.toMatchObject({
			success: true,
			code: 200,
		});
		expect(deleteDraftContract).toHaveBeenCalledWith("CONTRACT_DRAFT_001");
	});
});

function setDatabaseUrlForInjectedRuntime(): void {
	process.env.DATABASE_URL = "postgres://contract-change-draft-crud.test/runtime";
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

function changeFixture(overrides: Record<string, unknown> = {}) {
	return {
		id: "CHANGE_001",
		contractId: "CONTRACT_001",
		changeType: "amount",
		changeReason: "price changed",
		changeContent: "amount changed",
		changer: "operator",
		approvalStatus: "pending",
		createTime: "2026-05-21 09:00:00",
		updateTime: "2026-05-21 10:00:00",
		...overrides,
	};
}

function draftContractFixture(overrides: Record<string, unknown> = {}) {
	return {
		id: "CONTRACT_DRAFT_001",
		contractName: "Draft contract",
		contractNumber: "DRAFT_001",
		contractType: "service",
		status: "draft",
		createTime: "2026-05-21 09:00:00",
		updateTime: "2026-05-21 10:00:00",
		...overrides,
	};
}

function createTableCaptureDb(options: { selectRows?: Record<string, unknown>[] } = {}) {
	const db = {
		ops: [] as string[],
		tables: [] as string[],
		joinTables: [] as string[],
		insertedValues: [] as Record<string, unknown>[],
		select: vi.fn(() => {
			db.ops.push("select");
			return createQuery(db, options.selectRows ?? []);
		}),
		insert: vi.fn((table: unknown) => {
			db.ops.push("insert");
			db.tables.push(getTableName(table));
			return createWriteQuery([writeFixtureForTable(table)], db.insertedValues);
		}),
		update: vi.fn((table: unknown) => {
			db.ops.push("update");
			db.tables.push(getTableName(table));
			return createWriteQuery([writeFixtureForTable(table)]);
		}),
		delete: vi.fn((table: unknown) => {
			db.ops.push("delete");
			db.tables.push(getTableName(table));
			return createDeleteQuery([{ id: "DELETED_001" }]);
		}),
	};
	return db;
}

function createQuery(db: { tables: string[]; joinTables: string[] }, result: Record<string, unknown>[]) {
	const query = {
		from: vi.fn((table: unknown) => {
			db.tables.push(getTableName(table));
			return query;
		}),
		where: vi.fn(() => query),
		leftJoin: vi.fn((table: unknown) => {
			db.joinTables.push(getTableName(table));
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

function createWriteQuery(result: Record<string, unknown>[], insertedValues?: Record<string, unknown>[]) {
	const query = {
		values: vi.fn((value: Record<string, unknown>) => {
			insertedValues?.push(value);
			return query;
		}),
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

function writeFixtureForTable(table: unknown): Record<string, unknown> {
	const tableName = getTableName(table);
	if (tableName === "ct_contracts") {
		return draftContractFixture();
	}
	return changeFixture();
}

function getTableName(table: unknown): string {
	if (table && typeof table === "object" && Symbol.for("drizzle:Name") in table) {
		return String((table as Record<symbol, unknown>)[Symbol.for("drizzle:Name")]);
	}
	return String(table);
}

function createNoopContractRepository(): any {
	return {
		listArchive: async () => ({ list: [], total: 0 }),
		listAttachment: async () => ({ list: [], total: 0 }),
		listChange: async () => ({ list: [], total: 0 }),
		listClause: async () => ({ list: [], total: 0 }),
		listDraftContract: async () => ({ list: [], total: 0 }),
		listExpire: async () => ({ list: [], total: 0 }),
		listFirstParty: async () => ({ list: [], total: 0 }),
		listPrint: async () => ({ list: [], total: 0 }),
		listReview: async () => ({ list: [], total: 0 }),
		listSecondParty: async () => ({ list: [], total: 0 }),
		listTemplate: async () => ({ list: [], total: 0 }),
		listContractType: async () => ({ list: [], total: 0 }),
		createChange: async () => null,
		getChangeDetail: async () => null,
		updateChange: async () => null,
		deleteChange: async () => false,
		createDraftContract: async () => null,
		getDraftContractDetail: async () => null,
		updateDraftContract: async () => null,
		deleteDraftContract: async () => false,
	};
}
