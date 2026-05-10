import { describe, expect, test } from "vitest";
import { hpHouses } from "@01s-11comm/type";

import { createDbFloorRepository } from "../../server/modules/floor/repository";

describe("floor DB repository phase7 read slice", () => {
	test("aggregates hpHouses rows into legacy floor items", async () => {
		const repository = createDbFloorRepository(
			createFakeDb({
				houses: [
					{
						id: "HOUSE_001",
						communityId: "00000000-0000-4000-8000-000000000001",
						buildingNo: "1",
						floor: 3,
					},
					{
						id: "HOUSE_002",
						communityId: "00000000-0000-4000-8000-000000000001",
						buildingNo: "1",
						floor: 3,
					},
					{
						id: "HOUSE_003",
						communityId: "00000000-0000-4000-8000-000000000001",
						buildingNo: "2",
						floor: 5,
					},
				],
			}) as never,
		);

		const result = await repository.listFloors({ page: 1, row: 10 });

		expect(result).toMatchObject({
			total: 2,
			page: 1,
			pageSize: 10,
			hasMore: false,
		});
		expect(result.list).toEqual([
			{
				floorId: "DB_00000000-0000-4000-8000-000000000001_1_3",
				floorNum: "3",
				floorName: "1-3",
				communityId: "00000000-0000-4000-8000-000000000001",
			},
			{
				floorId: "DB_00000000-0000-4000-8000-000000000001_2_5",
				floorNum: "5",
				floorName: "2-5",
				communityId: "00000000-0000-4000-8000-000000000001",
			},
		]);
	});

	test("filters aggregated floors by floorNum includes and keyword", async () => {
		const repository = createDbFloorRepository(
			createFakeDb({
				houses: [
					{
						id: "HOUSE_101",
						communityId: "00000000-0000-4000-8000-000000000001",
						buildingNo: "A",
						floor: 12,
					},
					{
						id: "HOUSE_102",
						communityId: "00000000-0000-4000-8000-000000000001",
						buildingNo: "B",
						floor: 2,
					},
				],
			}) as never,
		);

		const byFloorNum = await repository.listFloors({ page: 1, row: 10, floorNum: "1" });
		const byKeyword = await repository.listFloors({ page: 1, row: 10, keyword: "A-12" });

		expect(byFloorNum.list).toHaveLength(1);
		expect(byFloorNum.list[0]).toMatchObject({ floorNum: "12", floorName: "A-12" });
		expect(byKeyword.list).toHaveLength(1);
		expect(byKeyword.list[0]).toMatchObject({ floorNum: "12", floorName: "A-12" });
	});

	test("loads detail with floorId returned from list", async () => {
		const repository = createDbFloorRepository(
			createFakeDb({
				houses: [
					{
						id: "HOUSE_201",
						communityId: "00000000-0000-4000-8000-000000000002",
						buildingNo: "7",
						floor: 9,
					},
				],
			}) as never,
		);

		const list = await repository.listFloors({ page: 1, row: 10 });
		const detail = await repository.getFloorById(list.list[0].floorId);

		expect(detail).toEqual(list.list[0]);
	});

	test("does not push non-UUID communityId into hpHouses where clause", async () => {
		const db = createFakeDb({ houses: [] });
		const repository = createDbFloorRepository(db as never);

		await repository.listFloors({ page: 1, row: 10, communityId: "COMM_001" });

		expect(db.whereCalls).toHaveLength(1);
		expect(String(db.whereCalls[0])).not.toContain("COMM_001");
	});
});

function createFakeDb(seed: { houses?: any[] }) {
	const whereCalls: unknown[] = [];

	return {
		whereCalls,
		select() {
			return {
				from(table: unknown) {
					const rows = table === hpHouses ? (seed.houses ?? []) : [];
					return createFakeQuery(rows, whereCalls);
				},
			};
		},
	};
}

function createFakeQuery(rows: any[], whereCalls: unknown[]) {
	const query = {
		where(condition: unknown) {
			whereCalls.push(condition);
			return query;
		},
		orderBy() {
			return query;
		},
		then(resolve: (value: any[]) => unknown) {
			return Promise.resolve(resolve(rows));
		},
	};

	return query;
}
