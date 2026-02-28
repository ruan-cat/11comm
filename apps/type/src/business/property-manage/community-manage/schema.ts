/**
 * @file 社区管理模块 Schema
 * @description 定义社区管理相关的表结构，前缀 cm_
 * @module community-manage
 */

import { index, pgTable, text, timestamp, varchar, integer, decimal, date, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { primaryId, timestamps, softDelete, remarkField, statusEnum, auditStatusEnum } from "../../../common";
// 注意：与 organize-manage 的关联通过外键约束在迁移时配置，避免循环依赖

// ==========================================
// Part A: Database Table Definitions
// ==========================================

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
		/** 关联组织 ID（小区所属的物业公司/组织，通过外键约束关联 sm_organizations） */
		organizationId: uuid("organization_id"),

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
		index("cm_communities_organization_id_idx").on(table.organizationId),
	],
);

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

// ==========================================
// Part B: Zod Runtime Schemas
// ==========================================

// --- cmCommunities ---
export const insertCmCommunitySchema = createInsertSchema(cmCommunities, {
	name: (schema) => schema.min(1, "小区名称不能为空").max(100),
	code: (schema) => schema.min(1, "小区编码不能为空").max(50),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
	deletedAt: true,
});

export const selectCmCommunitySchema = createSelectSchema(cmCommunities);

export const updateCmCommunitySchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, "小区名称不能为空").max(100).optional(),
	code: z.string().min(1, "小区编码不能为空").max(50).optional(),
	address: z.string().optional().nullable(),
	phone: z.string().max(20).optional().nullable(),
	status: z.enum(["enabled", "disabled"]).optional(),
	organizationId: z.string().uuid().optional().nullable(),
	landArea: z.string().optional().nullable(),
	buildingArea: z.string().optional().nullable(),
	buildingCount: z.number().int().optional().nullable(),
	unitCount: z.number().int().optional().nullable(),
	householdCount: z.number().int().optional().nullable(),
	parkingCount: z.number().int().optional().nullable(),
	greenRate: z.string().optional().nullable(),
	plotRatio: z.string().optional().nullable(),
	developer: z.string().max(100).optional().nullable(),
	propertyCompany: z.string().max(100).optional().nullable(),
	establishedDate: z.string().optional().nullable(),
	province: z.string().max(50).optional().nullable(),
	city: z.string().max(50).optional().nullable(),
	district: z.string().max(50).optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- cmNotices ---
export const insertCmNoticeSchema = createInsertSchema(cmNotices, {
	title: (schema) => schema.min(1, "公告标题不能为空").max(200),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
	deletedAt: true,
});

export const selectCmNoticeSchema = createSelectSchema(cmNotices);

export const updateCmNoticeSchema = z.object({
	id: z.string().uuid(),
	communityId: z.string().uuid().optional().nullable(),
	title: z.string().min(1, "公告标题不能为空").max(200).optional(),
	content: z.string().optional().nullable(),
	publishTime: z.date().optional().nullable(),
	publisher: z.string().max(50).optional().nullable(),
	status: z.enum(["enabled", "disabled"]).optional(),
	remark: z.string().optional().nullable(),
});

// --- cmHandingBusiness ---
export const insertCmHandingBusinessSchema = createInsertSchema(cmHandingBusiness, {
	businessType: (schema) => schema.min(1, "业务类型不能为空").max(50),
	applicant: (schema) => schema.min(1, "申请人不能为空").max(50),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
	deletedAt: true,
});

export const selectCmHandingBusinessSchema = createSelectSchema(cmHandingBusiness);

export const updateCmHandingBusinessSchema = z.object({
	id: z.string().uuid(),
	businessType: z.string().min(1, "业务类型不能为空").max(50).optional(),
	applicant: z.string().min(1, "申请人不能为空").max(50).optional(),
	contactPhone: z.string().max(20).optional().nullable(),
	status: z.string().max(20).optional(),
	handleTime: z.date().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- cmHouseDecorations ---
export const insertCmHouseDecorationSchema = createInsertSchema(cmHouseDecorations, {
	houseNumber: (schema) => schema.min(1, "房屋编号不能为空").max(50),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
	deletedAt: true,
});

export const selectCmHouseDecorationSchema = createSelectSchema(cmHouseDecorations);

export const updateCmHouseDecorationSchema = z.object({
	id: z.string().uuid(),
	houseNumber: z.string().min(1, "房屋编号不能为空").max(50).optional(),
	ownerInfo: z.string().max(100).optional().nullable(),
	decorationCompany: z.string().max(100).optional().nullable(),
	plannedStartTime: z.string().optional().nullable(),
	plannedEndTime: z.string().optional().nullable(),
	auditStatus: z.enum(["pending", "approved", "rejected"]).optional(),
	auditor: z.string().max(50).optional().nullable(),
	auditTime: z.date().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- cmPropertyRegisters ---
export const insertCmPropertyRegisterSchema = createInsertSchema(cmPropertyRegisters).omit({
	id: true,
	createTime: true,
	updateTime: true,
	deletedAt: true,
});

export const selectCmPropertyRegisterSchema = createSelectSchema(cmPropertyRegisters);

export const updateCmPropertyRegisterSchema = z.object({
	id: z.string().uuid(),
	communityName: z.string().max(100).optional().nullable(),
	buildingNo: z.string().max(20).optional().nullable(),
	unitNo: z.string().max(20).optional().nullable(),
	roomNo: z.string().max(20).optional().nullable(),
	ownerName: z.string().max(50).optional().nullable(),
	contactPhone: z.string().max(20).optional().nullable(),
	area: z.string().optional().nullable(),
	propertyType: z.string().max(50).optional().nullable(),
	registerDate: z.string().optional().nullable(),
	status: z.enum(["enabled", "disabled"]).optional(),
	remark: z.string().optional().nullable(),
});

// --- cmBuildingStructures ---
export const insertCmBuildingStructureSchema = createInsertSchema(cmBuildingStructures, {
	buildingNo: (schema) => schema.min(1, "楼栋编号不能为空").max(20),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
	deletedAt: true,
});

export const selectCmBuildingStructureSchema = createSelectSchema(cmBuildingStructures);

export const updateCmBuildingStructureSchema = z.object({
	id: z.string().uuid(),
	communityId: z.string().uuid().optional().nullable(),
	buildingNo: z.string().min(1, "楼栋编号不能为空").max(20).optional(),
	floorCount: z.number().int().optional().nullable(),
	unitCount: z.number().int().optional().nullable(),
	roomLayout: z.string().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// ==========================================
// Part C: TypeScript Types
// ==========================================

export type CmCommunity = typeof cmCommunities.$inferSelect;
export type NewCmCommunity = typeof cmCommunities.$inferInsert;
export type UpdateCmCommunity = z.infer<typeof updateCmCommunitySchema>;

export type CmNotice = typeof cmNotices.$inferSelect;
export type NewCmNotice = typeof cmNotices.$inferInsert;
export type UpdateCmNotice = z.infer<typeof updateCmNoticeSchema>;

export type CmHandingBusiness = typeof cmHandingBusiness.$inferSelect;
export type NewCmHandingBusiness = typeof cmHandingBusiness.$inferInsert;
export type UpdateCmHandingBusiness = z.infer<typeof updateCmHandingBusinessSchema>;

export type CmHouseDecoration = typeof cmHouseDecorations.$inferSelect;
export type NewCmHouseDecoration = typeof cmHouseDecorations.$inferInsert;
export type UpdateCmHouseDecoration = z.infer<typeof updateCmHouseDecorationSchema>;

export type CmPropertyRegister = typeof cmPropertyRegisters.$inferSelect;
export type NewCmPropertyRegister = typeof cmPropertyRegisters.$inferInsert;
export type UpdateCmPropertyRegister = z.infer<typeof updateCmPropertyRegisterSchema>;

export type CmBuildingStructure = typeof cmBuildingStructures.$inferSelect;
export type NewCmBuildingStructure = typeof cmBuildingStructures.$inferInsert;
export type UpdateCmBuildingStructure = z.infer<typeof updateCmBuildingStructureSchema>;
