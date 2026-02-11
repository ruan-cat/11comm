/**
 * @file 房产管理模块 Schema
 * @description 定义房产管理相关的表结构，前缀 hp_
 * @module house-property-manage
 */

import { index, integer, pgTable, text, uuid, varchar, decimal, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { primaryId, timestamps, softDelete, remarkField, statusEnum, genderEnum } from "../../../common";
import { cmCommunities } from "../community-manage/schema";

// ==========================================
// Part A: Database Table Definitions
// ==========================================

/** 房屋信息表 */
export const hpHouses = pgTable(
	"hp_houses",
	{
		id: primaryId(),
		/** 关联小区 ID */
		communityId: uuid("community_id").references(() => cmCommunities.id),
		/** 楼栋号 */
		buildingNo: varchar("building_no", { length: 20 }),
		/** 单元号 */
		unitNo: varchar("unit_no", { length: 20 }),
		/** 楼层 */
		floor: integer("floor"),
		/** 房间号 */
		roomNo: varchar("room_no", { length: 20 }),
		/** 房屋编号 */
		houseNumber: varchar("house_number", { length: 50 }).notNull(),
		/** 建筑面积 */
		buildingArea: decimal("building_area", { precision: 10, scale: 2 }),
		/** 使用面积 */
		usableArea: decimal("usable_area", { precision: 10, scale: 2 }),
		/** 房屋类型 */
		houseType: varchar("house_type", { length: 50 }),
		/** 房屋状态 */
		status: statusEnum("status").default("enabled"),
		/** 备注 */
		remark: remarkField(),
		/** 租金 */
		rent: decimal("rent", { precision: 12, scale: 2 }),
		/** 有效期 */
		validUntil: date("valid_until"),
		...timestamps,
	},
	(table) => [
		index("hp_houses_house_number_idx").on(table.houseNumber),
		index("hp_houses_community_id_idx").on(table.communityId),
	],
);

/** 业主信息表 */
export const hpOwners = pgTable(
	"hp_owners",
	{
		id: primaryId(),
		/** 业主姓名 */
		name: varchar("name", { length: 50 }).notNull(),
		/** 身份证号 */
		idCard: varchar("id_card", { length: 18 }),
		/** 手机号 */
		phone: varchar("phone", { length: 20 }),
		/** 性别 */
		gender: genderEnum("gender"),
		/** 邮箱 */
		email: varchar("email", { length: 100 }),
		/** 家庭地址 */
		address: text("address"),
		/** 紧急联系人 */
		emergencyContact: varchar("emergency_contact", { length: 100 }),
		/** 备注 */
		remark: remarkField(),

		...timestamps,
		...softDelete,
	},
	(table) => [index("hp_owners_name_idx").on(table.name), index("hp_owners_phone_idx").on(table.phone)],
);

/** 业主家庭成员表 */
export const hpOwnerMembers = pgTable("hp_owner_members", {
	id: primaryId(),
	/** 关联业主 ID */
	ownerId: uuid("owner_id")
		.references(() => hpOwners.id)
		.notNull(),
	/** 成员姓名 */
	name: varchar("name", { length: 50 }).notNull(),
	/** 性别 */
	gender: genderEnum("gender"),
	/** 成员类型：家人/租户/使用人 */
	memberType: varchar("member_type", { length: 20 }),
	/** 身份证号 */
	idCard: varchar("id_card", { length: 18 }),
	/** 手机号 */
	phone: varchar("phone", { length: 20 }),
	/** 家庭住址 */
	homeAddress: text("home_address"),
	/** 人脸照片 URL */
	facePhotoUrl: text("face_photo_url"),
	/** 门禁钥匙 */
	accessKey: varchar("access_key", { length: 100 }),
	/** 备注 */
	remark: remarkField(),

	...timestamps,
});

/** 业主账户表 */
export const hpOwnerAccounts = pgTable("hp_owner_accounts", {
	id: primaryId(),
	/** 关联业主 ID */
	ownerId: uuid("owner_id")
		.references(() => hpOwners.id)
		.notNull(),
	/** 账户编号 */
	accountNo: varchar("account_no", { length: 50 }).notNull(),
	/** 账户名称 */
	accountName: varchar("account_name", { length: 100 }),
	/** 账户类型 */
	accountType: varchar("account_type", { length: 50 }),
	/** 账户余额 */
	balance: decimal("balance", { precision: 12, scale: 2 }).default("0"),
	/** 扣款房号 */
	deductionHouse: varchar("deduction_house", { length: 50 }),
	/** 备注 */
	remark: remarkField(),
	...timestamps,
});

/** 可预约场地表 */
export const hpReserveVenues = pgTable("hp_reserve_venues", {
	id: primaryId(),
	/** 场地名称 */
	venueName: varchar("venue_name", { length: 100 }).notNull(),
	/** 场地类型 */
	venueType: varchar("venue_type", { length: 50 }),
	/** 容纳人数 */
	capacity: integer("capacity"),
	/** 开放时间 */
	openTime: varchar("open_time", { length: 100 }),
	/** 收费标准 */
	chargeStandard: varchar("charge_standard", { length: 200 }),
	/** 场地状态 */
	status: statusEnum("status").default("enabled"),
	/** 备注 */
	remark: remarkField(),
	...timestamps,
});

/** 场地预约订单表 */
export const hpReserveVenueOrders = pgTable("hp_reserve_venue_orders", {
	id: primaryId(),
	/** 关联场地 ID */
	venueId: uuid("venue_id")
		.references(() => hpReserveVenues.id)
		.notNull(),
	/** 预约人 */
	booker: varchar("booker", { length: 50 }).notNull(),
	/** 联系电话 */
	contactPhone: varchar("contact_phone", { length: 20 }),
	/** 预约时间段 */
	timeSlot: varchar("time_slot", { length: 100 }),
	/** 预约状态 */
	status: varchar("status", { length: 20 }),
	/** 备注 */
	remark: remarkField(),
	/** 预约时间 - 业务日期 */
	reservationTime: timestamp("reservation_time"),
	/** 开始时间 */
	startTime: timestamp("start_time"),
	/** 结束时间 */
	endTime: timestamp("end_time"),
	/** 使用人数 */
	numberOfUsers: integer("number_of_users"),
	...timestamps,
});

/** 场地管理表 */
export const hpSiteManagements = pgTable("hp_site_managements", {
	id: primaryId(),
	/** 场地名称 */
	siteName: varchar("site_name", { length: 100 }).notNull(),
	/** 位置 */
	location: text("location"),
	/** 管理员 */
	manager: varchar("manager", { length: 50 }),
	/** 维护记录 */
	maintenanceRecord: text("maintenance_record"),
	/** 备注 */
	remark: remarkField(),
	...timestamps,
});

/** 业主委员会表 */
export const hpOwnersCommittees = pgTable("hp_owners_committees", {
	id: primaryId(),
	/** 委员会名称 */
	committeeName: varchar("committee_name", { length: 100 }).notNull(),
	/** 成立日期 */
	establishedDate: date("established_date"),
	/** 届次 */
	term: varchar("term", { length: 20 }),
	/** 主任 */
	chairman: varchar("chairman", { length: 50 }),
	/** 联系电话 */
	contactPhone: varchar("contact_phone", { length: 20 }),
	/** 成员名单 */
	memberList: text("member_list"),
	/** 职务 */
	position: varchar("position", { length: 50 }),
	/** 任期 */
	tenure: varchar("tenure", { length: 50 }),
	/** 备注 */
	remark: remarkField(),
	/** 姓名 */
	fullName: varchar("full_name", { length: 50 }),
	/** 性别 */
	gender: genderEnum("gender"),
	/** 身份证号码 */
	idNumber: varchar("id_number", { length: 18 }),
	/** 住址 */
	address: text("address"),
	/** 岗位 */
	post: varchar("post", { length: 50 }),
	/** 状态 */
	status: varchar("status", { length: 20 }),
	...timestamps,
});

// ==========================================
// Part B: Zod Runtime Schemas
// ==========================================

// --- hpHouses ---
export const insertHpHouseSchema = createInsertSchema(hpHouses, {
	houseNumber: (schema) => schema.min(1, "房屋编号不能为空").max(50),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectHpHouseSchema = createSelectSchema(hpHouses);

export const updateHpHouseSchema = z.object({
	id: z.string().uuid(),
	communityId: z.string().uuid().optional().nullable(),
	buildingNo: z.string().max(20).optional().nullable(),
	unitNo: z.string().max(20).optional().nullable(),
	floor: z.number().int().optional().nullable(),
	roomNo: z.string().max(20).optional().nullable(),
	houseNumber: z.string().min(1, "房屋编号不能为空").max(50).optional(),
	buildingArea: z.string().optional().nullable(),
	usableArea: z.string().optional().nullable(),
	houseType: z.string().max(50).optional().nullable(),
	status: z.enum(["enabled", "disabled"]).optional(),
	remark: z.string().optional().nullable(),
	rent: z.string().optional().nullable(),
	validUntil: z.string().optional().nullable(),
});

// --- hpOwners ---
export const insertHpOwnerSchema = createInsertSchema(hpOwners, {
	name: (schema) => schema.min(1, "业主姓名不能为空").max(50),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	deletedAt: true,
});

export const selectHpOwnerSchema = createSelectSchema(hpOwners);

export const updateHpOwnerSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, "业主姓名不能为空").max(50).optional(),
	idCard: z.string().max(18).optional().nullable(),
	phone: z.string().max(20).optional().nullable(),
	gender: z.enum(["male", "female"]).optional().nullable(),
	email: z.string().email().max(100).optional().nullable(),
	address: z.string().optional().nullable(),
	emergencyContact: z.string().max(100).optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- hpOwnerMembers ---
export const insertHpOwnerMemberSchema = createInsertSchema(hpOwnerMembers, {
	name: (schema) => schema.min(1, "成员姓名不能为空").max(50),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectHpOwnerMemberSchema = createSelectSchema(hpOwnerMembers);

export const updateHpOwnerMemberSchema = z.object({
	id: z.string().uuid(),
	ownerId: z.string().uuid().optional(),
	name: z.string().min(1, "成员姓名不能为空").max(50).optional(),
	gender: z.enum(["male", "female"]).optional().nullable(),
	memberType: z.string().max(20).optional().nullable(),
	idCard: z.string().max(18).optional().nullable(),
	phone: z.string().max(20).optional().nullable(),
	homeAddress: z.string().optional().nullable(),
	facePhotoUrl: z.string().optional().nullable(),
	accessKey: z.string().max(100).optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- hpOwnerAccounts ---
export const insertHpOwnerAccountSchema = createInsertSchema(hpOwnerAccounts, {
	accountNo: (schema) => schema.min(1, "账户编号不能为空").max(50),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectHpOwnerAccountSchema = createSelectSchema(hpOwnerAccounts);

export const updateHpOwnerAccountSchema = z.object({
	id: z.string().uuid(),
	ownerId: z.string().uuid().optional(),
	accountNo: z.string().min(1, "账户编号不能为空").max(50).optional(),
	accountName: z.string().max(100).optional().nullable(),
	accountType: z.string().max(50).optional().nullable(),
	balance: z.string().optional().nullable(),
	deductionHouse: z.string().max(50).optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- hpReserveVenues ---
export const insertHpReserveVenueSchema = createInsertSchema(hpReserveVenues, {
	venueName: (schema) => schema.min(1, "场地名称不能为空").max(100),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectHpReserveVenueSchema = createSelectSchema(hpReserveVenues);

export const updateHpReserveVenueSchema = z.object({
	id: z.string().uuid(),
	venueName: z.string().min(1, "场地名称不能为空").max(100).optional(),
	venueType: z.string().max(50).optional().nullable(),
	capacity: z.number().int().optional().nullable(),
	openTime: z.string().max(100).optional().nullable(),
	chargeStandard: z.string().max(200).optional().nullable(),
	status: z.enum(["enabled", "disabled"]).optional(),
	remark: z.string().optional().nullable(),
});

// --- hpReserveVenueOrders ---
export const insertHpReserveVenueOrderSchema = createInsertSchema(hpReserveVenueOrders, {
	booker: (schema) => schema.min(1, "预约人不能为空").max(50),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectHpReserveVenueOrderSchema = createSelectSchema(hpReserveVenueOrders);

export const updateHpReserveVenueOrderSchema = z.object({
	id: z.string().uuid(),
	venueId: z.string().uuid().optional(),
	booker: z.string().min(1, "预约人不能为空").max(50).optional(),
	contactPhone: z.string().max(20).optional().nullable(),
	timeSlot: z.string().max(100).optional().nullable(),
	status: z.string().max(20).optional().nullable(),
	remark: z.string().optional().nullable(),
	reservationTime: z.date().optional().nullable(),
	startTime: z.date().optional().nullable(),
	endTime: z.date().optional().nullable(),
	numberOfUsers: z.number().int().optional().nullable(),
});

// --- hpSiteManagements ---
export const insertHpSiteManagementSchema = createInsertSchema(hpSiteManagements, {
	siteName: (schema) => schema.min(1, "场地名称不能为空").max(100),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectHpSiteManagementSchema = createSelectSchema(hpSiteManagements);

export const updateHpSiteManagementSchema = z.object({
	id: z.string().uuid(),
	siteName: z.string().min(1, "场地名称不能为空").max(100).optional(),
	location: z.string().optional().nullable(),
	manager: z.string().max(50).optional().nullable(),
	maintenanceRecord: z.string().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- hpOwnersCommittees ---
export const insertHpOwnersCommitteeSchema = createInsertSchema(hpOwnersCommittees, {
	committeeName: (schema) => schema.min(1, "委员会名称不能为空").max(100),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectHpOwnersCommitteeSchema = createSelectSchema(hpOwnersCommittees);

export const updateHpOwnersCommitteeSchema = z.object({
	id: z.string().uuid(),
	committeeName: z.string().min(1, "委员会名称不能为空").max(100).optional(),
	establishedDate: z.string().optional().nullable(),
	term: z.string().max(20).optional().nullable(),
	chairman: z.string().max(50).optional().nullable(),
	contactPhone: z.string().max(20).optional().nullable(),
	memberList: z.string().optional().nullable(),
	position: z.string().max(50).optional().nullable(),
	tenure: z.string().max(50).optional().nullable(),
	remark: z.string().optional().nullable(),
	fullName: z.string().max(50).optional().nullable(),
	gender: z.enum(["male", "female"]).optional().nullable(),
	idNumber: z.string().max(18).optional().nullable(),
	address: z.string().optional().nullable(),
	post: z.string().max(50).optional().nullable(),
	status: z.string().max(20).optional().nullable(),
});

// ==========================================
// Part C: TypeScript Types
// ==========================================

export type HpHouse = typeof hpHouses.$inferSelect;
export type NewHpHouse = typeof hpHouses.$inferInsert;
export type UpdateHpHouse = z.infer<typeof updateHpHouseSchema>;

export type HpOwner = typeof hpOwners.$inferSelect;
export type NewHpOwner = typeof hpOwners.$inferInsert;
export type UpdateHpOwner = z.infer<typeof updateHpOwnerSchema>;

export type HpOwnerMember = typeof hpOwnerMembers.$inferSelect;
export type NewHpOwnerMember = typeof hpOwnerMembers.$inferInsert;
export type UpdateHpOwnerMember = z.infer<typeof updateHpOwnerMemberSchema>;

export type HpOwnerAccount = typeof hpOwnerAccounts.$inferSelect;
export type NewHpOwnerAccount = typeof hpOwnerAccounts.$inferInsert;
export type UpdateHpOwnerAccount = z.infer<typeof updateHpOwnerAccountSchema>;

export type HpReserveVenue = typeof hpReserveVenues.$inferSelect;
export type NewHpReserveVenue = typeof hpReserveVenues.$inferInsert;
export type UpdateHpReserveVenue = z.infer<typeof updateHpReserveVenueSchema>;

export type HpReserveVenueOrder = typeof hpReserveVenueOrders.$inferSelect;
export type NewHpReserveVenueOrder = typeof hpReserveVenueOrders.$inferInsert;
export type UpdateHpReserveVenueOrder = z.infer<typeof updateHpReserveVenueOrderSchema>;

export type HpSiteManagement = typeof hpSiteManagements.$inferSelect;
export type NewHpSiteManagement = typeof hpSiteManagements.$inferInsert;
export type UpdateHpSiteManagement = z.infer<typeof updateHpSiteManagementSchema>;

export type HpOwnersCommittee = typeof hpOwnersCommittees.$inferSelect;
export type NewHpOwnersCommittee = typeof hpOwnersCommittees.$inferInsert;
export type UpdateHpOwnersCommittee = z.infer<typeof updateHpOwnersCommitteeSchema>;
