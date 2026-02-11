import {
	cmCommunities,
	cmNotices,
	cmHouseDecorations,
	cmPropertyRegisters,
	cmBuildingStructures,
	type NewCmCommunity as InsertCmCommunity,
	type NewCmNotice as InsertCmNotice,
	type NewCmHouseDecoration as InsertCmHouseDecoration,
	type NewCmPropertyRegister as InsertCmPropertyRegister,
	type NewCmBuildingStructure as InsertCmBuildingStructure,
} from "@01s-11comm/type";
import { mockCommunityInformationData } from "../../api/operation-team/data-manage/community-information/mock-data";
import { mockNoticeData } from "../../api/property-manage/community-manage/notice/mock-data";
// import { mockHandingBusinessData } from "../../api/property-manage/community-manage/handing-business/mock-data"; // Mismatch data type (looks like Fees)
import { mockHouseDecorationData } from "../../api/property-manage/community-manage/house-decoration/mock-data";
import { mockPropertyRegisterData } from "../../api/property-manage/community-manage/property-register/mock-data";
import { mockBuildingSpaceStructureDiagramData } from "../../api/property-manage/community-manage/building-space-structure-diagram/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql, statusMap, toStatusEnum, toAuditStatusEnum } from "./index";
import { db } from "../index";

/**
 * 生成社区管理模块的 SQL
 */
export function generateCommunitySql(idMap: IdMapRegistry): SqlStatement[] {
	const statements: SqlStatement[] = [];

	// ==========================================
	// 1. 生成 cm_communities 表 SQL
	// ==========================================
	console.log("正在生成 cm_communities SQL...");

	const communityRecords: InsertCmCommunity[] = mockCommunityInformationData.map((item) => {
		// 注册 ID 映射
		const id = idMap.register("cm_communities", item.communityId);

		return {
			id: id,
			name: item.communityName,
			code: item.communityCode,
			address: item.address,
			phone: item.contactPhone,
			status: toStatusEnum(item.status),

			landArea: item.landArea ? String(item.landArea) : null,
			buildingArea: item.buildingArea ? String(item.buildingArea) : null,
			buildingCount: item.buildingCount,
			unitCount: item.unitCount,
			householdCount: item.houseCount,
			parkingCount: item.parkingCount,

			greenRate: item.greenRate ? String(item.greenRate) : null,
			plotRatio: item.plotRatio ? String(item.plotRatio) : null,
			developer: item.developer,
			propertyCompany: item.propertyCompany,
			establishedDate: item.establishedTime ? String(item.establishedTime) : null,

			province: item.province,
			city: item.city,
			district: item.district,

			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (communityRecords.length > 0) {
		const query = db.insert(cmCommunities).values(communityRecords).toSQL();
		statements.push({
			table: "cm_communities",
			sql: toFullSql(query.sql, query.params),
			recordCount: communityRecords.length,
		});
		console.log(`✅ 已生成 cm_communities SQL，共 ${communityRecords.length} 条记录`);
	}

	// 获取默认社区 ID (假设为 COMM001)
	const defaultCommunityId = idMap.get("cm_communities", "COMM001");
	if (!defaultCommunityId) {
		console.warn("⚠️ 未找到 COMM001 社区 ID，部分依赖社区的数据可能跳过");
	}

	// ==========================================
	// 2. 生成 cm_notices (社区公告)
	// ==========================================
	console.log("正在生成 cm_notices SQL...");
	const noticeRecords: InsertCmNotice[] = mockNoticeData.map((item) => {
		const id = idMap.register("cm_notices", item.id);

		return {
			id: id,
			communityId: defaultCommunityId, // 默认关联到第一个社区
			title: item.noticeTitle,
			content: item.noticeTitle, // Mock data lacks content, use title as placeholder
			publishTime: item.noticeTime ? new Date(item.noticeTime) : null,
			publisher: item.publisher,
			status: "enabled", // Default
			remark: item.noticeType, // Use type as remark/category
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	});

	if (noticeRecords.length > 0) {
		const query = db.insert(cmNotices).values(noticeRecords).toSQL();
		statements.push({
			table: "cm_notices",
			sql: toFullSql(query.sql, query.params),
			recordCount: noticeRecords.length,
		});
		console.log(`✅ 已生成 cm_notices SQL，共 ${noticeRecords.length} 条记录`);
	}

	// ==========================================
	// 3. 生成 cm_handing_business (业务受理)
	// ==========================================
	// NOTE: Mock data for handing-business contains "Fees" data, not business requests. Skipping.
	console.log("⏩ 跳过生成 cm_handing_business SQL (Mock数据类型不匹配)");

	// ==========================================
	// 4. 生成 cm_house_decorations (装修登记)
	// ==========================================
	console.log("正在生成 cm_house_decorations SQL...");
	const decorationRecords: InsertCmHouseDecoration[] = mockHouseDecorationData.map((item, index) => {
		// Mock data doesn't have ID, use houseNumber + index or register a random ID
		const mockId = `DEC-${item.houseNumber}-${index}`;
		const id = idMap.register("cm_house_decorations", mockId);

		return {
			id: id,
			houseNumber: item.houseNumber,
			ownerInfo: item.contactName, // Map contactName to ownerInfo
			decorationCompany: item.decorationCompany,
			plannedStartTime: item.decorationTime ? String(item.decorationTime) : null,
			plannedEndTime: null, // decorationTime in mock seems to be start time
			auditStatus: toAuditStatusEnum(item.status),
			auditor: null,
			auditTime: null,
			remark: item.remarks,
			createdAt: item.applicationTime ? new Date(item.applicationTime) : new Date(),
			updatedAt: new Date(),
		};
	});

	if (decorationRecords.length > 0) {
		const query = db.insert(cmHouseDecorations).values(decorationRecords).toSQL();
		statements.push({
			table: "cm_house_decorations",
			sql: toFullSql(query.sql, query.params),
			recordCount: decorationRecords.length,
		});
		console.log(`✅ 已生成 cm_house_decorations SQL，共 ${decorationRecords.length} 条记录`);
	}

	// ==========================================
	// 5. 生成 cm_property_registers (物业登记)
	// ==========================================
	console.log("正在生成 cm_property_registers SQL...");
	const registerRecords: InsertCmPropertyRegister[] = mockPropertyRegisterData.map((item) => {
		const id = idMap.register("cm_property_registers", item.id);

		// Parse houseNumber "1-101" to building "1", room "101"
		let building = null;
		let room = null;
		if (item.houseNumber && item.houseNumber.includes("-")) {
			const parts = item.houseNumber.split("-");
			building = parts[0];
			room = parts[1];
		}

		return {
			id: id,
			communityName: "阳光小区", // Hardcode or derive if possible? Mock doesn't have it explicitly besides address
			buildingNo: building,
			unitNo: null,
			roomNo: room,
			ownerName: item.ownerName,
			contactPhone: item.contactInfo,
			area: null,
			propertyType: null,
			registerDate: item.createTime ? String(item.createTime).split(" ")[0] : null,
			status: statusMap[item.status] || "enabled",
			remark: item.remark,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (registerRecords.length > 0) {
		const query = db.insert(cmPropertyRegisters).values(registerRecords).toSQL();
		statements.push({
			table: "cm_property_registers",
			sql: toFullSql(query.sql, query.params),
			recordCount: registerRecords.length,
		});
		console.log(`✅ 已生成 cm_property_registers SQL，共 ${registerRecords.length} 条记录`);
	}

	// ==========================================
	// 6. 生成 cm_building_structures (楼栋空间)
	// ==========================================
	console.log("正在生成 cm_building_structures SQL...");
	const buildingRecords: InsertCmBuildingStructure[] = mockBuildingSpaceStructureDiagramData.map((item) => {
		const id = idMap.register("cm_building_structures", item.buildingId);

		return {
			id: id,
			communityId: defaultCommunityId,
			buildingNo: item.buildingName,
			floorCount: item.totalFloors,
			unitCount: item.totalHouseholds, // Using totalHouseholds as proxy for unitCount/capacity
			roomLayout: null,
			remark: item.remarks,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	});

	if (buildingRecords.length > 0) {
		const query = db.insert(cmBuildingStructures).values(buildingRecords).toSQL();
		statements.push({
			table: "cm_building_structures",
			sql: toFullSql(query.sql, query.params),
			recordCount: buildingRecords.length,
		});
		console.log(`✅ 已生成 cm_building_structures SQL，共 ${buildingRecords.length} 条记录`);
	}

	return statements;
}
