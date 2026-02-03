/**
 * @file 房产管理模块 Schema
 * @description 定义房产管理相关的表结构，前缀 hp_
 */

import { index, integer, pgTable, text, uuid, varchar, decimal, date } from "drizzle-orm/pg-core";
import { primaryId, timestamps, softDelete, remarkField, statusEnum, genderEnum } from "./common";
import { cmCommunities } from "./community";

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

/** 发票信息表 */
export const hpInvoices = pgTable("hp_invoices", {
	id: primaryId(),
	/** 发票号码 */
	invoiceNo: varchar("invoice_no", { length: 50 }).notNull(),
	/** 发票类型 */
	invoiceType: varchar("invoice_type", { length: 50 }),
	/** 开票金额 */
	amount: decimal("amount", { precision: 12, scale: 2 }),
	/** 开票日期 */
	invoiceDate: date("invoice_date"),
	/** 关联支付记录 ID */
	paymentId: uuid("payment_id"),
	/** 备注 */
	remark: remarkField(),
	...timestamps,
});

/** 发票抬头表 */
export const hpInvoiceTitles = pgTable("hp_invoice_titles", {
	id: primaryId(),
	/** 关联业主 ID */
	ownerId: uuid("owner_id")
		.references(() => hpOwners.id)
		.notNull(),
	/** 抬头名称 */
	titleName: varchar("title_name", { length: 200 }).notNull(),
	/** 纳税人识别号 */
	taxpayerNo: varchar("taxpayer_no", { length: 50 }),
	/** 地址电话 */
	addressPhone: text("address_phone"),
	/** 开户银行及账号 */
	bankAccount: text("bank_account"),
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
	...timestamps,
});

/** 房屋信息插入类型 */
export type InsertHpHouse = typeof hpHouses.$inferInsert;
/** 房屋信息查询类型 */
export type SelectHpHouse = typeof hpHouses.$inferSelect;

/** 业主信息插入类型 */
export type InsertHpOwner = typeof hpOwners.$inferInsert;
/** 业主信息查询类型 */
export type SelectHpOwner = typeof hpOwners.$inferSelect;

/** 业主家庭成员插入类型 */
export type InsertHpOwnerMember = typeof hpOwnerMembers.$inferInsert;
/** 业主家庭成员查询类型 */
export type SelectHpOwnerMember = typeof hpOwnerMembers.$inferSelect;

/** 业主账户插入类型 */
export type InsertHpOwnerAccount = typeof hpOwnerAccounts.$inferInsert;
/** 业主账户查询类型 */
export type SelectHpOwnerAccount = typeof hpOwnerAccounts.$inferSelect;

/** 发票信息插入类型 */
export type InsertHpInvoice = typeof hpInvoices.$inferInsert;
/** 发票信息查询类型 */
export type SelectHpInvoice = typeof hpInvoices.$inferSelect;

/** 发票抬头插入类型 */
export type InsertHpInvoiceTitle = typeof hpInvoiceTitles.$inferInsert;
/** 发票抬头查询类型 */
export type SelectHpInvoiceTitle = typeof hpInvoiceTitles.$inferSelect;

/** 可预约场地插入类型 */
export type InsertHpReserveVenue = typeof hpReserveVenues.$inferInsert;
/** 可预约场地查询类型 */
export type SelectHpReserveVenue = typeof hpReserveVenues.$inferSelect;

/** 场地预约订单插入类型 */
export type InsertHpReserveVenueOrder = typeof hpReserveVenueOrders.$inferInsert;
/** 场地预约订单查询类型 */
export type SelectHpReserveVenueOrder = typeof hpReserveVenueOrders.$inferSelect;

/** 场地管理插入类型 */
export type InsertHpSiteManagement = typeof hpSiteManagements.$inferInsert;
/** 场地管理查询类型 */
export type SelectHpSiteManagement = typeof hpSiteManagements.$inferSelect;

/** 业主委员会插入类型 */
export type InsertHpOwnersCommittee = typeof hpOwnersCommittees.$inferInsert;
/** 业主委员会查询类型 */
export type SelectHpOwnersCommittee = typeof hpOwnersCommittees.$inferSelect;
