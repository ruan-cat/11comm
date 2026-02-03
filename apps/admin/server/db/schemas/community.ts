/**
 * @file 社区管理模块 Schema
 * @description 定义社区管理相关的数据库表结构
 * @module cm_ (community management)
 */

import { index, pgTable, text, timestamp, uuid, varchar, integer, decimal, date } from "drizzle-orm/pg-core";
import { primaryId, timestamps, softDelete, remarkField, statusEnum, auditStatusEnum } from "./common";

/**
 * 小区基础信息表
 * 存储小区的基本信息、面积信息、规划指标和区域信息
 */
export const cmCommunities = pgTable(
	"cm_communities",
	{
		id: primaryId(),

		/** 小区名称 */
		name: varchar("name", { length: 100 }).notNull(),
		/** 小区编码 */
		code: varchar("code", { length: 50 }).notNull(),
		/** 小区地址 */
		address: text("address"),
		/** 联系电话 */
		phone: varchar("phone", { length: 20 }),
		/** 状态 */
		status: statusEnum("status").default("enabled"),

		/** 占地面积（平方米） */
		landArea: decimal("land_area", { precision: 12, scale: 2 }),
		/** 建筑面积（平方米） */
		buildingArea: decimal("building_area", { precision: 12, scale: 2 }),
		/** 楼栋数量 */
		buildingCount: integer("building_count"),
		/** 单元数量 */
		unitCount: integer("unit_count"),
		/** 户数 */
		householdCount: integer("household_count"),
		/** 车位数量 */
		parkingCount: integer("parking_count"),

		/** 绿化率（百分比） */
		greenRate: decimal("green_rate", { precision: 5, scale: 2 }),
		/** 容积率 */
		plotRatio: decimal("plot_ratio", { precision: 5, scale: 2 }),
		/** 开发商 */
		developer: varchar("developer", { length: 100 }),
		/** 物业公司 */
		propertyCompany: varchar("property_company", { length: 100 }),
		/** 成立时间 */
		establishedDate: date("established_date"),

		/** 省份 */
		province: varchar("province", { length: 50 }),
		/** 城市 */
		city: varchar("city", { length: 50 }),
		/** 区县 */
		district: varchar("district", { length: 50 }),

		/** 备注 */
		remark: remarkField(),

		...timestamps,
		...softDelete,
	},
	(table) => [
		index("cm_communities_name_idx").on(table.name),
		index("cm_communities_code_idx").on(table.code),
		index("cm_communities_status_idx").on(table.status),
	],
);

/** 小区基础信息插入类型 */
export type InsertCmCommunity = typeof cmCommunities.$inferInsert;
/** 小区基础信息查询类型 */
export type SelectCmCommunity = typeof cmCommunities.$inferSelect;

/**
 * 社区公告表
 * 存储小区发布的公告信息
 */
export const cmNotices = pgTable(
	"cm_notices",
	{
		id: primaryId(),

		/** 关联小区ID */
		communityId: uuid("community_id").references(() => cmCommunities.id),

		/** 公告标题 */
		title: varchar("title", { length: 200 }).notNull(),
		/** 公告内容 */
		content: text("content"),
		/** 发布时间 */
		publishTime: timestamp("publish_time"),
		/** 发布人 */
		publisher: varchar("publisher", { length: 50 }),
		/** 状态 */
		status: statusEnum("status").default("enabled"),

		/** 备注 */
		remark: remarkField(),

		...timestamps,
		...softDelete,
	},
	(table) => [
		index("cm_notices_community_id_idx").on(table.communityId),
		index("cm_notices_status_idx").on(table.status),
	],
);

/** 社区公告插入类型 */
export type InsertCmNotice = typeof cmNotices.$inferInsert;
/** 社区公告查询类型 */
export type SelectCmNotice = typeof cmNotices.$inferSelect;

/**
 * 业务受理表
 * 存储物业办理业主业务的记录
 */
export const cmHandingBusiness = pgTable(
	"cm_handing_business",
	{
		id: primaryId(),

		/** 业务类型 */
		businessType: varchar("business_type", { length: 50 }).notNull(),
		/** 申请人 */
		applicant: varchar("applicant", { length: 50 }).notNull(),
		/** 联系电话 */
		contactPhone: varchar("contact_phone", { length: 20 }),
		/** 办理状态（待缴费、已缴费、已取消） */
		status: varchar("status", { length: 20 }).default("待缴费"),
		/** 办理时间 */
		handleTime: timestamp("handle_time"),

		/** 备注 */
		remark: remarkField(),

		...timestamps,
		...softDelete,
	},
	(table) => [index("cm_handing_business_status_idx").on(table.status)],
);

/** 业务受理插入类型 */
export type InsertCmHandingBusiness = typeof cmHandingBusiness.$inferInsert;
/** 业务受理查询类型 */
export type SelectCmHandingBusiness = typeof cmHandingBusiness.$inferSelect;

/**
 * 房屋装修登记表
 * 存储业主装修申请和审批信息
 */
export const cmHouseDecorations = pgTable(
	"cm_house_decorations",
	{
		id: primaryId(),

		/** 房屋编号 */
		houseNumber: varchar("house_number", { length: 50 }).notNull(),
		/** 业主信息 */
		ownerInfo: varchar("owner_info", { length: 100 }),
		/** 装修公司 */
		decorationCompany: varchar("decoration_company", { length: 100 }),
		/** 预计开始时间 */
		plannedStartTime: date("planned_start_time"),
		/** 预计结束时间 */
		plannedEndTime: date("planned_end_time"),

		/** 审批状态 */
		auditStatus: auditStatusEnum("audit_status").default("pending"),
		/** 审批人 */
		auditor: varchar("auditor", { length: 50 }),
		/** 审批时间 */
		auditTime: timestamp("audit_time"),

		/** 备注 */
		remark: remarkField(),

		...timestamps,
		...softDelete,
	},
	(table) => [index("cm_house_decorations_audit_status_idx").on(table.auditStatus)],
);

/** 房屋装修登记插入类型 */
export type InsertCmHouseDecoration = typeof cmHouseDecorations.$inferInsert;
/** 房屋装修登记查询类型 */
export type SelectCmHouseDecoration = typeof cmHouseDecorations.$inferSelect;

/**
 * 物业登记表
 * 存储物业房产登记信息
 */
export const cmPropertyRegisters = pgTable(
	"cm_property_registers",
	{
		id: primaryId(),

		/** 社区名称 */
		communityName: varchar("community_name", { length: 100 }),
		/** 楼栋号 */
		buildingNo: varchar("building_no", { length: 20 }),
		/** 单元号 */
		unitNo: varchar("unit_no", { length: 20 }),
		/** 房间号 */
		roomNo: varchar("room_no", { length: 20 }),
		/** 业主姓名 */
		ownerName: varchar("owner_name", { length: 50 }),
		/** 联系电话 */
		contactPhone: varchar("contact_phone", { length: 20 }),

		/** 房产面积（平方米） */
		area: decimal("area", { precision: 10, scale: 2 }),
		/** 房产类型 */
		propertyType: varchar("property_type", { length: 50 }),
		/** 登记日期 */
		registerDate: date("register_date"),
		/** 状态 */
		status: statusEnum("status").default("enabled"),

		/** 备注 */
		remark: remarkField(),

		...timestamps,
		...softDelete,
	},
	(table) => [index("cm_property_registers_status_idx").on(table.status)],
);

/** 物业登记插入类型 */
export type InsertCmPropertyRegister = typeof cmPropertyRegisters.$inferInsert;
/** 物业登记查询类型 */
export type SelectCmPropertyRegister = typeof cmPropertyRegisters.$inferSelect;

/**
 * 楼栋空间结构表
 * 存储楼栋的空间结构信息
 */
export const cmBuildingStructures = pgTable(
	"cm_building_structures",
	{
		id: primaryId(),

		/** 关联小区ID */
		communityId: uuid("community_id").references(() => cmCommunities.id),

		/** 楼栋编号 */
		buildingNo: varchar("building_no", { length: 20 }).notNull(),
		/** 层数 */
		floorCount: integer("floor_count"),
		/** 单元数 */
		unitCount: integer("unit_count"),
		/** 房间布局信息（JSON格式存储） */
		roomLayout: text("room_layout"),

		/** 备注 */
		remark: remarkField(),

		...timestamps,
		...softDelete,
	},
	(table) => [index("cm_building_structures_community_id_idx").on(table.communityId)],
);

/** 楼栋空间结构插入类型 */
export type InsertCmBuildingStructure = typeof cmBuildingStructures.$inferInsert;
/** 楼栋空间结构查询类型 */
export type SelectCmBuildingStructure = typeof cmBuildingStructures.$inferSelect;
