import { describe, expect, test } from "vitest";
import { rpRepairSettings, rpRepairTypes } from "@01s-11comm/type";

import {
	createDbRepairRepository,
	mapRepairOrderToItem,
	toRepairDbStatus,
} from "../../server/modules/repair/repository";

describe("repair DB repository phase7 batch3", () => {
	test("maps repair order rows to owner repair compatibility items", () => {
		const item = mapRepairOrderToItem(
			{
				id: "ORDER_001",
				workOrderNumber: "WO-001",
				repairType: "TYPE_WATER",
				reporterName: "Alice",
				contactPhone: "13800000000",
				repairLocation: "Building 1 Room 101",
				problemDescription: "Pipe leaking",
				remark: "fallback remark",
				status: "processing",
				createTime: "2026-05-10 01:02:03",
				updateTime: "2026-05-10 04:05:06",
			},
			new Map([["TYPE_WATER", "Water repair"]]),
		);

		expect(item).toMatchObject({
			repairId: "ORDER_001",
			workOrderNumber: "WO-001",
			title: "Pipe leaking",
			context: "Pipe leaking",
			repairName: "Alice",
			tel: "13800000000",
			address: "Building 1 Room 101",
			repairObjName: "Building 1 Room 101",
			repairType: "TYPE_WATER",
			repairTypeName: "Water repair",
			statusCd: "10003",
			statusName: "处理中",
			communityId: "COMM_001",
		});
		expect(item.createTime).toBe("2026-05-10 01:02:03");
		expect(item.updateTime).toBe("2026-05-10 04:05:06");
	});

	test("maps DB repair status enum to legacy owner status codes", () => {
		expect(
			mapRepairOrderToItem({
				id: "ORDER_PENDING",
				workOrderNumber: "WO-PENDING",
				status: "pending",
			}),
		).toMatchObject({ statusCd: "10001", statusName: "待派单" });
		expect(
			mapRepairOrderToItem({
				id: "ORDER_COMPLETED",
				workOrderNumber: "WO-COMPLETED",
				status: "completed",
			}),
		).toMatchObject({ statusCd: "10004", statusName: "已完成" });
		expect(
			mapRepairOrderToItem({
				id: "ORDER_CANCELLED",
				workOrderNumber: "WO-CANCELLED",
				status: "cancelled",
			}),
		).toMatchObject({ statusCd: "10005", statusName: "已取消" });
		expect(
			mapRepairOrderToItem({
				id: "ORDER_PAUSED",
				workOrderNumber: "WO-PAUSED",
				status: "paused",
			}),
		).toMatchObject({ statusCd: "10006", statusName: "暂停" });
	});

	test("normalizes legacy owner repair status filters to DB enum values", () => {
		expect(toRepairDbStatus("10001")).toBe("pending");
		expect(toRepairDbStatus("10003")).toBe("processing");
		expect(toRepairDbStatus("pending")).toBe("pending");
		expect(toRepairDbStatus("processing")).toBe("processing");
	});

	test("keeps write methods on DB repository delegated to fallback", async () => {
		const repository = createDbRepairRepository({} as never);

		const created = await repository.createOwnerRepair({
			title: "Fallback write",
			context: "DB writes are not enabled in this slice",
			communityId: "COMM_001",
		});

		expect(created).toMatchObject({
			repairId: expect.stringMatching(/^REPAIR_/),
			title: "Fallback write",
			communityId: "COMM_001",
		});
	});

	test("prefers DB repair settings over type fallback when filtering public area settings", async () => {
		const repository = createDbRepairRepository(
			createFakeDb({
				settings: [
					{
						id: "SETTING_PUBLIC",
						settingType: "Public pipeline",
						serviceArea: "public_area",
						createTime: "2026-05-10 10:00:00",
					},
				],
				types: [
					{
						id: "TYPE_PRIVATE",
						typeName: "Private fallback type",
						sortOrder: 1,
					},
				],
			}) as never,
		);

		const settings = await repository.listRepairSettings({
			page: 1,
			row: 10,
			publicArea: "T",
		});

		expect(settings).toEqual([
			{
				repairType: "SETTING_PUBLIC",
				repairTypeName: "Public pipeline",
				publicArea: "T",
				payFeeFlag: "F",
				priceScope: "public_area",
			},
		]);
	});

	test("paginates repair type compatibility fallback when DB settings are empty", async () => {
		const repository = createDbRepairRepository(
			createFakeDb({
				settings: [],
				types: [
					{ id: "TYPE_001", typeName: "Type 1", sortOrder: 1 },
					{ id: "TYPE_002", typeName: "Type 2", sortOrder: 2 },
					{ id: "TYPE_003", typeName: "Type 3", sortOrder: 3 },
				],
			}) as never,
		);

		const settings = await repository.listRepairSettings({
			page: 2,
			row: 1,
		});

		expect(settings).toEqual([
			{
				repairType: "TYPE_002",
				repairTypeName: "Type 2",
				publicArea: "F",
				payFeeFlag: "F",
				priceScope: "0",
			},
		]);
	});

	test("keeps core list mixed compat while reading repair types from DB", async () => {
		const repository = createDbRepairRepository(
			createFakeDb({
				types: [{ id: "DB_REPAIR_TYPE", typeName: "DB repair type", sortOrder: 1 }],
			}) as never,
		);

		await expect(repository.listCoreDict({ domain: "repair_type" })).resolves.toEqual([
			{ statusCd: "DB_REPAIR_TYPE", name: "DB repair type" },
		]);

		await expect(repository.listCoreDict({ domain: "repair_status" })).resolves.toEqual(
			expect.arrayContaining([expect.objectContaining({ statusCd: "PENDING" })]),
		);

		await expect(repository.listCoreDict({ name: "apply_room_discount", type: "state" })).resolves.toEqual(
			expect.arrayContaining([expect.objectContaining({ statusCd: "0" })]),
		);

		await expect(repository.listCoreDict({ name: "pay_fee_config", type: "fee_type_cd" })).resolves.toEqual([]);
	});
});

function createFakeDb(seed: { settings?: any[]; types?: any[] }) {
	return {
		select() {
			return {
				from(table: unknown) {
					const rows =
						table === rpRepairSettings ? (seed.settings ?? []) : table === rpRepairTypes ? (seed.types ?? []) : [];

					return createFakeQuery(rows);
				},
			};
		},
	};
}

function createFakeQuery(rows: any[]) {
	let limitValue: number | undefined;

	const query = {
		orderBy() {
			return query;
		},
		limit(value: number) {
			limitValue = value;
			return query;
		},
		offset(value: number) {
			return Promise.resolve(rows.slice(value, limitValue === undefined ? undefined : value + limitValue));
		},
		then(resolve: (value: any[]) => unknown) {
			return Promise.resolve(resolve(rows));
		},
	};

	return query;
}
