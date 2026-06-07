import { describe, expect, test } from "vitest";

import { createFeeRepository, createInMemoryFeeRepository } from "../../server/modules/fee/repository";
import { createFeeService } from "../../server/modules/fee/service";

describe("fee service shared repository", () => {
	test("shares one repository between legacy and admin read models", async () => {
		const repository = createInMemoryFeeRepository();
		const service = createFeeService(repository);

		const legacyList = await service.listLegacyFees({ page: 1, row: 10, communityId: "COMM_001" });
		const adminList = await service.listAdminHouseCharges({ pageIndex: 1, pageSize: 10 });

		expect(legacyList.list.length).toBeGreaterThan(0);
		expect(adminList.list.length).toBeGreaterThan(0);
		expect(adminList.list[0].id).toBe(legacyList.list[0].feeId);
	});

	test("mutations are visible through the shared service", async () => {
		const repository = createInMemoryFeeRepository();
		const service = createFeeService(repository);

		await service.writeOweFeeCallable({
			communityId: "COMM_001",
			feeIds: ["FEE_001"],
			roomId: "ROOM_001",
			remark: "电话提醒",
		});

		const callables = await service.listOweFeeCallables({
			communityId: "COMM_001",
			page: 1,
			row: 10,
			payerObjId: "ROOM_001",
		});

		expect(callables.list.some((item) => item.remark === "电话提醒")).toBe(true);
	});

	test("database repository preserves fallback legacy methods for endpoints not migrated to tables yet", async () => {
		const repository = createFeeRepository({ db: {} as never });
		const service = createFeeService(repository);

		const legacyList = await service.listLegacyFees({ page: 1, row: 1, communityId: "COMM_001" });
		const details = await service.listFeeDetails({ page: 1, row: 1, communityId: "COMM_001", feeId: "FEE_001" });

		expect(legacyList).toMatchObject({
			total: expect.any(Number),
			page: 1,
			row: 1,
			list: expect.any(Array),
		});
		expect(details.list[0]).toMatchObject({
			feeId: "FEE_001",
			communityId: "COMM_001",
		});
	});

	test("exposes machine record reads without open-door actions", async () => {
		const repository = createInMemoryFeeRepository();
		const repositoryRecord = repository as unknown as Record<string, unknown>;
		const service = createFeeService(repository);

		expect(repositoryRecord.getChargeMachineList).toBeUndefined();
		expect(repositoryRecord.getOpenDoorLogList).toBeUndefined();
		expect(repositoryRecord.openDoor).toBeUndefined();
		expect(repositoryRecord.listMachineRecords).toEqual(expect.any(Function));
		expect(service.listMachineRecords).toEqual(expect.any(Function));

		const result = await service.listMachineRecords({ page: 1, row: 10, communityId: "UNKNOWN_COMMUNITY" });

		expect(result).toMatchObject({
			total: 2,
			page: 1,
			row: 10,
			list: [
				expect.objectContaining({
					logId: "OPEN_LOG_001",
					roomId: "ROOM_001",
					ownerName: "张三",
				}),
				expect.objectContaining({
					logId: "OPEN_LOG_002",
				}),
			],
		});
	});
});
