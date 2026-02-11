import {
	pkParkingLots,
	pkCarports,
	pkOwnerVehicles,
	pkCarportApplications,
	pkParkingStructures,
} from "@01s-11comm/type";

import { mockParkingLotData } from "../../api/property-manage/parking-manage/parking-lot/mock-data";
import { mockCarportInfoData } from "../../api/property-manage/parking-manage/carport-info/mock-data";
import { mockOwnerVehicleData } from "../../api/property-manage/parking-manage/owner-vehicle/mock-data";
import { mockCarportApplyData } from "../../api/property-manage/parking-manage/carport-apply/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql, statusMap, generateUuid } from "./index";
import { db } from "../index";

/**
 * 生成停车管理模块的 SQL
 */
export function generateParkingSql(idMap: IdMapRegistry): SqlStatement[] {
	const statements: SqlStatement[] = [];
	const defaultCommunityId = idMap.get("cm_communities", "COMM001") || generateUuid("cm_communities", "COMM001");

	// ==========================================
	// 1. 生成 pk_parking_lots (停车场)
	// ==========================================
	console.log("正在生成 pk_parking_lots SQL...");
	const lotRecords = mockParkingLotData.map((item) => {
		const id = idMap.register("pk_parking_lots", item.parkingLotNumber);
		return {
			id,
			communityId: defaultCommunityId,
			lotName: `${item.parkingLotNumber}号停车场`, // Mock data lacks name, synthesize it
			lotType: item.parkingLotType,
			// parkingSpaceType: item.parkingSpaceType, // Schema doesn't have this
			totalSpaces: 100, // Mock
			availableSpaces: 50, // Mock
			remark: `External Code: ${item.externalCode}`,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (lotRecords.length > 0) {
		const query = db.insert(pkParkingLots).values(lotRecords).toSQL();
		statements.push({
			table: "pk_parking_lots",
			sql: toFullSql(query.sql, query.params),
			recordCount: lotRecords.length,
		});
	}

	// ==========================================
	// 2. 生成 pk_carports (车位)
	// ==========================================
	console.log("正在生成 pk_carports SQL...");

	// Map "A区" -> first lot, "B区" -> second lot, etc. to ensure distribution
	const uniqueZones = Array.from(new Set(mockCarportInfoData.map((c) => c.parkingLot)));
	const zoneToLotId = new Map<string, string>();
	if (lotRecords.length > 0) {
		uniqueZones.forEach((zone, idx) => {
			const lot = lotRecords[idx % lotRecords.length];
			if (lot) zoneToLotId.set(zone, lot.id);
		});
	}

	const carportRecords = mockCarportInfoData.map((item) => {
		const id = idMap.register("pk_carports", item.parkingSpace);
		const lotId = zoneToLotId.get(item.parkingLot) || (lotRecords[0] ? lotRecords[0].id : null);

		// Status mapping
		// Mock: "已售", "已租", "空闲"
		// Schema: empty? Default varchar.

		return {
			id,
			parkingLotId: lotId,
			carportNumber: item.parkingSpace,
			carportType: item.parkingSpaceType,
			area: item.area ? String(item.area) : null,
			status: item.parkingSpaceStatus,
			ownerName: item.ownerName,
			contactPhone: item.contactPhone,
			boundVehicle: item.vehicleNumber,
			monthlyRent: item.monthlyRent ? String(item.monthlyRent) : null,
			purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : null,
			expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (carportRecords.length > 0) {
		const query = db.insert(pkCarports).values(carportRecords).toSQL();
		statements.push({
			table: "pk_carports",
			sql: toFullSql(query.sql, query.params),
			recordCount: carportRecords.length,
		});
	}

	// ==========================================
	// 3. 生成 pk_owner_vehicles (业主车辆)
	// ==========================================
	console.log("正在生成 pk_owner_vehicles SQL...");
	const DEFAULT_OWNER_ID = "32f4cbc2-ada7-53eb-8169-34eb23681024";

	const vehicleRecords = mockOwnerVehicleData.map((item) => {
		const id = idMap.register("pk_owner_vehicles", item.licensePlate);
		let ownerId = idMap.get("hp_owners", item.owner);

		// Fallback if owner not found (logic migrated from patch-06-parking.ts)
		if (!ownerId) {
			console.warn(`Owner [${item.owner}] not found for vehicle [${item.licensePlate}], using default.`);
			ownerId = DEFAULT_OWNER_ID;
		}

		const carportId = idMap.get("pk_carports", item.parkingSpace);

		return {
			id,
			ownerId: ownerId,
			carportId: carportId,
			licensePlate: item.licensePlate,
			plateType: item.licensePlateType,
			vehicleType: item.vehicleType,
			vehicleColor: item.color,
			relatedHouse: item.houseNumber,
			// Validity period parsing "2024-01-01 至 2024-12-31"
			validityStart: item.validityPeriod ? new Date(item.validityPeriod.split(" 至 ")[0]) : null,
			validityEnd: item.validityPeriod ? new Date(item.validityPeriod.split(" 至 ")[1]) : null,

			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (vehicleRecords.length > 0) {
		const query = db.insert(pkOwnerVehicles).values(vehicleRecords).toSQL();
		statements.push({
			table: "pk_owner_vehicles",
			sql: toFullSql(query.sql, query.params),
			recordCount: vehicleRecords.length,
		});
	}

	// ==========================================
	// 4. 生成 pk_carport_applications (车位申请)
	// ==========================================
	console.log("正在生成 pk_carport_applications SQL...");
	if (mockCarportApplyData && mockCarportApplyData.length > 0) {
		const applyRecords = mockCarportApplyData.map((item, idx) => {
			const id = idMap.register("pk_carport_applications", item.applicant + idx);

			return {
				id,
				applicant: item.applicant,
				carportType: "标准车位", // Mock data missing this field, using default
				status: item.reviewResult || "待审核",
				// Mapping other fields if mock data has them
				createdAt: item.createTime ? new Date(item.createTime) : new Date(),
				updatedAt: new Date(),
			};
		});

		if (applyRecords.length > 0) {
			const query = db.insert(pkCarportApplications).values(applyRecords).toSQL();
			statements.push({
				table: "pk_carport_applications",
				sql: toFullSql(query.sql, query.params),
				recordCount: applyRecords.length,
			});
		}
	}

	// ==========================================
	// 5. 生成 pk_parking_structures (车位结构图)
	// ==========================================
	console.log("正在生成 pk_parking_structures SQL...");
	const structureRecords = [];
	if (lotRecords.length > 0) {
		lotRecords.forEach((lot) => {
			// Generate 2 structures per lot: "A区" and "B区"
			["A区", "B区"].forEach((region, index) => {
				const id = idMap.register("pk_parking_structures", `${lot.lotName}-${region}`);
				structureRecords.push({
					id,
					parkingLotId: lot.id,
					regionName: region,
					structureData: JSON.stringify({
						width: 800,
						height: 600,
						elements: [
							{ type: "rect", x: 10, y: 10, w: 100, h: 50, label: "Entrance" },
							{ type: "rect", x: 10, y: 100, w: 50, h: 100, label: "Space 01" },
						],
					}),
					sortOrder: index + 1,
					remark: "System generated structure mock data",
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			});
		});
	}

	if (structureRecords.length > 0) {
		const query = db.insert(pkParkingStructures).values(structureRecords).toSQL();
		statements.push({
			table: "pk_parking_structures",
			sql: toFullSql(query.sql, query.params),
			recordCount: structureRecords.length,
		});
	}

	return statements;
}
