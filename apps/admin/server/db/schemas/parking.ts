/**
 * @file 停车管理模块 Schema
 * @description 定义停车管理相关的表结构，前缀 pk_
 */

import {
	index,
	pgTable,
	text,
	timestamp,
	varchar,
	integer,
	decimal,
	date,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { isNull } from "drizzle-orm";
import { primaryId, timestamps, softDelete, remarkField, statusEnum } from "./common";
import { cmCommunities } from "./community";
import { hpOwners } from "./house-property";

/** 停车场表 */
export const pkParkingLots = pgTable(
	"pk_parking_lots",
	{
		id: primaryId(),
		/** 关联小区 ID */
		communityId: uuid("community_id").references(() => cmCommunities.id),
		/** 停车场名称 */
		lotName: varchar("lot_name", { length: 100 }).notNull(),
		/** 停车场类型：地上/地下/立体 */
		lotType: varchar("lot_type", { length: 50 }),
		/** 总车位数 */
		totalSpaces: integer("total_spaces"),
		/** 可用车位数 */
		availableSpaces: integer("available_spaces"),
		/** 占地面积 */
		floorArea: decimal("floor_area", { precision: 10, scale: 2 }),
		/** 位置描述 */
		locationDescription: text("location_description"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("pk_parking_lots_community_id_idx").on(table.communityId),
		index("pk_parking_lots_lot_name_idx").on(table.lotName),
	],
);

/** 车位表 */
export const pkCarports = pgTable(
	"pk_carports",
	{
		id: primaryId(),
		/** 关联停车场 ID */
		parkingLotId: uuid("parking_lot_id").references(() => pkParkingLots.id),
		/** 车位编号 */
		carportNumber: varchar("carport_number", { length: 50 }).notNull(),
		/** 车位类型：标准/子母/无障碍/充电 */
		carportType: varchar("carport_type", { length: 50 }),
		/** 车位面积 */
		area: decimal("area", { precision: 8, scale: 2 }),
		/** 车位状态：空闲/已售/已租/锁定 */
		status: varchar("status", { length: 20 }),
		/** 归属业主 ID */
		ownerId: uuid("owner_id").references(() => hpOwners.id),
		/** 归属业主姓名 */
		ownerName: varchar("owner_name", { length: 50 }),
		/** 联系电话 */
		contactPhone: varchar("contact_phone", { length: 20 }),
		/** 绑定车辆（车牌号） */
		boundVehicle: varchar("bound_vehicle", { length: 20 }),
		/** 月租金额 */
		monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }),
		/** 购买日期 */
		purchaseDate: date("purchase_date"),
		/** 到期日期 */
		expiryDate: date("expiry_date"),
		...timestamps,
	},
	(table) => [
		index("pk_carports_carport_number_idx").on(table.carportNumber),
		index("pk_carports_status_idx").on(table.status),
		index("pk_carports_parking_lot_id_idx").on(table.parkingLotId),
	],
);

/** 业主车辆表 */
export const pkOwnerVehicles = pgTable(
	"pk_owner_vehicles",
	{
		id: primaryId(),
		/** 关联业主 ID */
		ownerId: uuid("owner_id").references(() => hpOwners.id),
		/** 关联车位 ID（可选） */
		carportId: uuid("carport_id").references(() => pkCarports.id),
		/** 车牌号 */
		licensePlate: varchar("license_plate", { length: 20 }).notNull(),
		/** 车牌类型：蓝牌/绿牌/黄牌/白牌 */
		plateType: varchar("plate_type", { length: 20 }),
		/** 车辆类型：小型轿车/SUV/MPV/新能源/摩托车 */
		vehicleType: varchar("vehicle_type", { length: 50 }),
		/** 车辆颜色 */
		vehicleColor: varchar("vehicle_color", { length: 20 }),
		/** 品牌 */
		brand: varchar("brand", { length: 50 }),
		/** 关联房屋 */
		relatedHouse: varchar("related_house", { length: 100 }),
		/** 有效期开始 */
		validityStart: date("validity_start"),
		/** 有效期结束 */
		validityEnd: date("validity_end"),
		...timestamps,
		...softDelete,
	},
	(table) => [
		uniqueIndex("pk_owner_vehicles_license_plate_idx").on(table.licensePlate).where(isNull(table.deletedAt)),
		index("pk_owner_vehicles_owner_id_idx").on(table.ownerId),
		index("pk_owner_vehicles_carport_id_idx").on(table.carportId),
	],
);

/** 车位申请表 */
export const pkCarportApplications = pgTable(
	"pk_carport_applications",
	{
		id: primaryId(),
		/** 申请人 */
		applicant: varchar("applicant", { length: 50 }).notNull(),
		/** 申请车位类型 */
		carportType: varchar("carport_type", { length: 50 }),
		/** 申请时间 */
		applyTime: timestamp("apply_time").defaultNow(),
		/** 期望价格区间 */
		expectedPriceRange: varchar("expected_price_range", { length: 100 }),
		/** 申请状态：待审核/已通过/已拒绝/已取消 */
		status: varchar("status", { length: 20 }).default("待审核"),
		/** 审批人 */
		approver: varchar("approver", { length: 50 }),
		/** 审批时间 */
		approvalTime: timestamp("approval_time"),
		/** 审批意见 */
		approvalOpinion: text("approval_opinion"),
		/** 分配的车位 */
		allocatedCarport: varchar("allocated_carport", { length: 50 }),
		...timestamps,
	},
	(table) => [
		index("pk_carport_applications_status_idx").on(table.status),
		index("pk_carport_applications_applicant_idx").on(table.applicant),
	],
);

/** 停车场表类型推断 */
export type PkParkingLot = typeof pkParkingLots.$inferSelect;
export type NewPkParkingLot = typeof pkParkingLots.$inferInsert;

/** 车位表类型推断 */
export type PkCarport = typeof pkCarports.$inferSelect;
export type NewPkCarport = typeof pkCarports.$inferInsert;

/** 业主车辆表类型推断 */
export type PkOwnerVehicle = typeof pkOwnerVehicles.$inferSelect;
export type NewPkOwnerVehicle = typeof pkOwnerVehicles.$inferInsert;

/** 车位申请表类型推断 */
export type PkCarportApplication = typeof pkCarportApplications.$inferSelect;
export type NewPkCarportApplication = typeof pkCarportApplications.$inferInsert;

/**
 * 车位结构图表
 * @description 用于存储停车场或车位区域的结构布局图（如 SVG/JSON 数据）
 */
export const pkParkingStructures = pgTable(
	"pk_parking_structures",
	{
		id: primaryId(),
		/** 关联停车场 ID */
		parkingLotId: uuid("parking_lot_id")
			.references(() => pkParkingLots.id)
			.notNull(),
		/** 区域/楼层名称 (B1, B2, A区) */
		regionName: varchar("region_name", { length: 50 }).notNull(),
		/** 结构图数据 (JSON/SVG内容) */
		structureData: text("structure_data"),
		/** 排序号 */
		sortOrder: integer("sort_order").default(0),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("pk_parking_structures_parking_lot_id_idx").on(table.parkingLotId)],
);

/** 车位结构图表类型推断 */
export type PkParkingStructure = typeof pkParkingStructures.$inferSelect;
export type NewPkParkingStructure = typeof pkParkingStructures.$inferInsert;
