import { describe, expect, test } from "vitest";

import { createInMemoryRepairRepository } from "../../server/modules/repair/repository";
import { createRepairService } from "../../server/modules/repair/service";

describe("repair service wave4a", () => {
	test("lists, reads and creates owner repairs through one shared service", async () => {
		const service = createRepairService(createInMemoryRepairRepository());

		const list = await service.listOwnerRepairs({ page: 1, row: 5, communityId: "COMM_001" });
		expect(list).toMatchObject({ total: expect.any(Number), page: 1, row: 5 });
		expect(list.list[0]).toMatchObject({ repairId: expect.any(String), communityId: "COMM_001" });

		const detail = await service.getOwnerRepair({ repairId: list.list[0].repairId });
		expect(detail).toMatchObject({ repairId: list.list[0].repairId });

		const created = await service.createOwnerRepair({
			title: "Water pipe repair",
			context: "Kitchen pipe leaking",
			repairName: "Alice",
			tel: "13800000000",
			address: "Building 1 Room 101",
			repairType: "1001",
			communityId: "COMM_001",
		});
		expect(created).toMatchObject({
			repairId: expect.any(String),
			statusCd: "10001",
			communityId: "COMM_001",
		});

		const updatedList = await service.listOwnerRepairs({ page: 1, row: 10, communityId: "COMM_001" });
		expect(updatedList.list.some((item) => item.repairId === created.repairId)).toBe(true);
	});

	test("exposes repair settings and status dictionary", async () => {
		const service = createRepairService(createInMemoryRepairRepository());

		const settings = await service.listRepairSettings({ page: 1, row: 10, publicArea: "T" });
		expect(settings[0]).toMatchObject({ repairType: expect.any(String), repairTypeName: expect.any(String) });

		const states = await service.listRepairStates();
		expect(states.map((item) => item.statusCd)).toContain("10001");
	});

	test("keeps the wave4a repository fallback-only surface narrow", () => {
		const repository = createInMemoryRepairRepository() as unknown as Record<string, unknown>;

		expect(repository.listResourceStoreTypes).toBeUndefined();
		expect(repository.listStaffRepairs).toBeUndefined();
		expect(repository.repairDispatch).toBeUndefined();
	});
});
