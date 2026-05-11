import { describe, expect, test } from "vitest";
import { pkCarportApplications, pkCarports, pkOwnerVehicles, pkParkingLots } from "@01s-11comm/type";

import { createDbParkingRepository } from "../../server/modules/parking/repository";

describe("parking DB repository phase7 P2", () => {
	test("maps carport applications and keeps unsupported vehicle fields as empty compatibility values", async () => {
		const repository = createDbParkingRepository(
			createFakeDb({
				carportApplications: [
					{
						id: "APP_001",
						applicant: "Alice",
						carportType: "standard",
						status: "approved",
						allocatedCarport: "A-001",
						createTime: new Date("2026-05-10T01:02:03"),
						updateTime: new Date("2026-05-10T04:05:06"),
					},
				],
			}) as never,
		);

		const result = await repository.listCarportApplications({ pageIndex: 1, pageSize: 10, applicant: "Alice" });

		expect(result.total).toBe(1);
		expect(result.list[0]).toMatchObject({
			applicationId: "APP_001",
			licensePlate: "",
			parkingSpace: "A-001",
			carBrand: "",
			vehicleType: "standard",
			color: "",
			startLeaseTime: "",
			endLeaseTime: "",
			applicant: "Alice",
			phoneNumber: "",
			reviewResult: "approved",
			createTime: "2026-05-10 01:02:03",
			updateTime: "2026-05-10 04:05:06",
		});
	});

	test("maps carports with joined parking lot name", async () => {
		const repository = createDbParkingRepository(
			createFakeDb({
				carports: [
					{
						id: "CARPORT_001",
						carportNumber: "B1-001",
						carportType: "charging",
						area: "12.50",
						status: "rented",
						ownerName: "Bob",
						contactPhone: "13800000000",
						boundVehicle: "PLATE-A12345",
						monthlyRent: "350.00",
						purchaseDate: "2026-01-01",
						expiryDate: "2026-12-31",
						createTime: new Date("2026-05-10T02:03:04"),
						updateTime: new Date("2026-05-10T05:06:07"),
						parkingLotName: "Underground Lot",
					},
				],
			}) as never,
		);

		const result = await repository.listCarports({ pageIndex: 1, pageSize: 10, parkingLot: "Underground" });

		expect(result.total).toBe(1);
		expect(result.list[0]).toMatchObject({
			parkingLot: "Underground Lot",
			parkingSpace: "B1-001",
			parkingSpaceStatus: "rented",
			parkingSpaceType: "charging",
			area: "12.50",
			ownerName: "Bob",
			contactPhone: "13800000000",
			vehicleNumber: "PLATE-A12345",
			purchaseDate: "2026-01-01",
			expiryDate: "2026-12-31",
			monthlyRent: 350,
			createTime: "2026-05-10 02:03:04",
			updateTime: "2026-05-10 05:06:07",
		});
	});

	test("maps owner vehicles with joined owner and carport fields", async () => {
		const repository = createDbParkingRepository(
			createFakeDb({
				ownerVehicles: [
					{
						licensePlate: "PLATE-B67890",
						brand: "BYD",
						relatedHouse: "1-1-101",
						plateType: "green",
						vehicleType: "SUV",
						vehicleColor: "white",
						validityStart: "2026-01-01",
						validityEnd: "2026-12-31",
						createTime: new Date("2026-05-10T03:04:05"),
						updateTime: new Date("2026-05-10T06:07:08"),
						ownerName: "Carol",
						carportNumber: "C-008",
					},
				],
			}) as never,
		);

		const result = await repository.listOwnerVehicles({ pageIndex: 1, pageSize: 10, ownerName: "Carol" });

		expect(result.total).toBe(1);
		expect(result.list[0]).toMatchObject({
			licensePlate: "PLATE-B67890",
			memberVehicle: "BYD",
			houseNumber: "1-1-101",
			licensePlateType: "green",
			vehicleType: "SUV",
			color: "white",
			owner: "Carol",
			parkingSpace: "C-008",
			validityPeriod: "2026-01-01 ~ 2026-12-31",
			status: "enabled",
			createTime: "2026-05-10 03:04:05",
			updateTime: "2026-05-10 06:07:08",
		});
	});

	test("maps parking lots and keeps parkingSpaceType as the standard fallback", async () => {
		const repository = createDbParkingRepository(
			createFakeDb({
				parkingLots: [
					{
						id: "LOT_001",
						lotName: "Tower parking",
						lotType: "multi_level",
						remark: "near east gate",
						createTime: new Date("2026-05-10T07:08:09"),
						updateTime: new Date("2026-05-10T10:11:12"),
					},
				],
			}) as never,
		);

		const result = await repository.listParkingLots({ pageIndex: 1, pageSize: 10, parkingLotType: "multi_level" });

		expect(result.total).toBe(1);
		expect(result.list[0]).toMatchObject({
			parkingLotNumber: "Tower parking",
			parkingLotType: "multi_level",
			parkingSpaceType: "standard",
			externalCode: "LOT_001",
			remark: "near east gate",
			createTime: "2026-05-10 07:08:09",
			updateTime: "2026-05-10 10:11:12",
		});
	});
});

function createFakeDb(seed: {
	carportApplications?: any[];
	carports?: any[];
	ownerVehicles?: any[];
	parkingLots?: any[];
}) {
	return {
		select(selection?: Record<string, unknown>) {
			const isCountQuery = Boolean(selection && "total" in selection);
			return {
				from(table: unknown) {
					const rows = rowsForTable(table, seed);
					return createFakeQuery(isCountQuery ? [{ total: rows.length }] : rows);
				},
			};
		},
	};
}

function rowsForTable(
	table: unknown,
	seed: {
		carportApplications?: any[];
		carports?: any[];
		ownerVehicles?: any[];
		parkingLots?: any[];
	},
) {
	if (table === pkCarportApplications) {
		return seed.carportApplications ?? [];
	}
	if (table === pkCarports) {
		return seed.carports ?? [];
	}
	if (table === pkOwnerVehicles) {
		return seed.ownerVehicles ?? [];
	}
	if (table === pkParkingLots) {
		return seed.parkingLots ?? [];
	}
	return [];
}

function createFakeQuery(rows: any[]) {
	let limitValue: number | undefined;

	const query = {
		leftJoin() {
			return query;
		},
		where() {
			return query;
		},
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
