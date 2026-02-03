/**
 * @file 报修管理模块 Schema
 * @description 定义报修管理相关的数据库表结构
 * @module rp_ (repairs management)
 */

import { index, pgEnum, pgTable, text, timestamp, uuid, varchar, integer, uniqueIndex } from "drizzle-orm/pg-core";
import { primaryId, timestamps, softDelete, remarkField } from "./common";

/** 报修工单状态枚举 */
export const repairOrderStatusEnum = pgEnum("repair_order_status", [
	"pending",
	"processing",
	"completed",
	"cancelled",
	"paused",
]);

/** 回访状态枚举 */
export const returnVisitStatusEnum = pgEnum("return_visit_status", [
	"not_visited",
	"visited",
	"satisfied",
	"unsatisfied",
]);

/** 报修设置类型枚举 */
export const repairSettingTypeEnum = pgEnum("repair_setting_type", ["cleaning", "maintenance"]);

/** 派单方式枚举 */
export const dispatchMethodEnum = pgEnum("dispatch_method", ["grab", "assign", "rotation"]);

/** 服务区域枚举 */
export const serviceAreaEnum = pgEnum("service_area", ["house", "public_area", "garage", "non_house"]);

/** 强制回单状态枚举 */
export const mandatoryReturnStatusEnum = pgEnum("mandatory_return_status", [
	"pending_return",
	"returned",
	"forced_returned",
]);

/**
 * 报修工单表
 * 存储报修工单的基本信息、报修人信息、内容、状态和指派信息
 */
export const rpRepairOrders = pgTable(
	"rp_repair_orders",
	{
		id: primaryId(),

		/** 工单编号 */
		workOrderNumber: varchar("work_order_number", { length: 50 }).notNull(),
		/** 报修类型 */
		repairType: varchar("repair_type", { length: 50 }),
		/** 维修类型 */
		maintenanceType: varchar("maintenance_type", { length: 50 }),
		/** 报修来源 */
		repairSource: varchar("repair_source", { length: 50 }),

		/** 报修人姓名 */
		reporterName: varchar("reporter_name", { length: 50 }),
		/** 联系电话 */
		contactPhone: varchar("contact_phone", { length: 20 }),
		/** 报修位置 */
		repairLocation: text("repair_location"),

		/** 问题描述 */
		problemDescription: text("problem_description"),
		/** 报修照片URL */
		repairPhotoUrl: text("repair_photo_url"),
		/** 预约时间 */
		appointmentTime: timestamp("appointment_time"),

		/** 工单状态 */
		status: repairOrderStatusEnum("status").default("pending"),

		/** 指派人 */
		assigner: varchar("assigner", { length: 50 }),
		/** 指派时间 */
		assignTime: timestamp("assign_time"),
		/** 维修人员 */
		repairPerson: varchar("repair_person", { length: 50 }),
		/** 计划完成时间 */
		plannedCompletionTime: timestamp("planned_completion_time"),

		/** 备注 */
		remark: remarkField(),

		...timestamps,
		...softDelete,
	},
	(table) => [
		uniqueIndex("rp_repair_orders_work_order_number_idx").on(table.workOrderNumber),
		index("rp_repair_orders_status_idx").on(table.status),
		index("rp_repair_orders_created_at_idx").on(table.createdAt),
	],
);

/** 报修工单插入类型 */
export type InsertRpRepairOrder = typeof rpRepairOrders.$inferInsert;
/** 报修工单查询类型 */
export type SelectRpRepairOrder = typeof rpRepairOrders.$inferSelect;

/**
 * 工单操作历史表
 * 存储工单状态变更的操作记录
 */
export const rpRepairOrderHistories = pgTable(
	"rp_repair_order_histories",
	{
		id: primaryId(),

		/** 关联工单ID */
		orderId: uuid("order_id")
			.references(() => rpRepairOrders.id, { onDelete: "cascade" })
			.notNull(),

		/** 操作类型 */
		operationType: varchar("operation_type", { length: 50 }).notNull(),
		/** 操作人 */
		operator: varchar("operator", { length: 50 }),
		/** 操作时间 */
		operationTime: timestamp("operation_time").notNull().defaultNow(),
		/** 操作说明 */
		operationDescription: text("operation_description"),

		...timestamps,
	},
	(table) => [index("rp_repair_order_histories_order_id_idx").on(table.orderId)],
);

/** 工单操作历史插入类型 */
export type InsertRpRepairOrderHistory = typeof rpRepairOrderHistories.$inferInsert;
/** 工单操作历史查询类型 */
export type SelectRpRepairOrderHistory = typeof rpRepairOrderHistories.$inferSelect;

/**
 * 回访记录表
 * 存储报修工单的回访信息和满意度评价
 */
export const rpReturnVisits = pgTable(
	"rp_return_visits",
	{
		id: primaryId(),

		/** 关联工单ID */
		orderId: uuid("order_id")
			.references(() => rpRepairOrders.id)
			.notNull(),

		/** 回访人 */
		visitor: varchar("visitor", { length: 50 }),
		/** 回访时间 */
		visitTime: timestamp("visit_time"),
		/** 回访方式 */
		visitMethod: varchar("visit_method", { length: 50 }),
		/** 满意度评价 */
		satisfactionRating: integer("satisfaction_rating"),

		/** 回访状态 */
		visitStatus: returnVisitStatusEnum("visit_status").default("not_visited"),
		/** 回访备注 */
		visitNote: text("visit_note"),

		...timestamps,
	},
	(table) => [index("rp_return_visits_order_id_idx").on(table.orderId)],
);

/** 回访记录插入类型 */
export type InsertRpReturnVisit = typeof rpReturnVisits.$inferInsert;
/** 回访记录查询类型 */
export type SelectRpReturnVisit = typeof rpReturnVisits.$inferSelect;

/**
 * 报修设置表
 * 存储报修相关的配置信息
 */
export const rpRepairSettings = pgTable("rp_repair_settings", {
	id: primaryId(),

	/** 设置类型（保洁单/维修单） */
	settingType: repairSettingTypeEnum("setting_type"),
	/** 派单方式（抢单/指派/轮训） */
	dispatchMethod: dispatchMethodEnum("dispatch_method"),

	/** 服务区域（房屋/公共区域/车库/非房屋） */
	serviceArea: serviceAreaEnum("service_area"),

	/** 处理时限（分钟） */
	processingTimeLimit: integer("processing_time_limit"),
	/** 回访时限（分钟） */
	returnVisitTimeLimit: integer("return_visit_time_limit"),

	...timestamps,
});

/** 报修设置插入类型 */
export type InsertRpRepairSetting = typeof rpRepairSettings.$inferInsert;
/** 报修设置查询类型 */
export type SelectRpRepairSetting = typeof rpRepairSettings.$inferSelect;

/**
 * 报修类型表
 * 存储报修类型的配置信息
 */
export const rpRepairTypes = pgTable("rp_repair_types", {
	id: primaryId(),

	/** 类型名称（水管/电路/门窗/电梯/消防等） */
	typeName: varchar("type_name", { length: 50 }).notNull(),
	/** 类型描述 */
	typeDescription: text("type_description"),
	/** 排序号 */
	sortOrder: integer("sort_order").default(0),

	...timestamps,
});

/** 报修类型插入类型 */
export type InsertRpRepairType = typeof rpRepairTypes.$inferInsert;
/** 报修类型查询类型 */
export type SelectRpRepairType = typeof rpRepairTypes.$inferSelect;

/**
 * 强制回单记录表
 * 存储强制要求维修人员回单的记录
 */
export const rpMandatoryReturnIssues = pgTable("rp_mandatory_return_issues", {
	id: primaryId(),

	/** 工单编号 */
	workOrderNumber: varchar("work_order_number", { length: 50 }).notNull(),
	/** 强制回单原因 */
	mandatoryReason: text("mandatory_reason"),
	/** 强制回单时间 */
	mandatoryTime: timestamp("mandatory_time"),

	/** 回单状态 */
	returnStatus: mandatoryReturnStatusEnum("return_status").default("pending_return"),

	...timestamps,
});

/** 强制回单记录插入类型 */
export type InsertRpMandatoryReturnIssue = typeof rpMandatoryReturnIssues.$inferInsert;
/** 强制回单记录查询类型 */
export type SelectRpMandatoryReturnIssue = typeof rpMandatoryReturnIssues.$inferSelect;

/**
 * 电话报修记录表
 * 存储通过电话接收的报修信息
 */
export const rpPhoneRepairReports = pgTable(
	"rp_phone_repair_reports",
	{
		id: primaryId(),

		/** 关联工单ID（可选，电话报修转工单后填写） */
		orderId: uuid("order_id").references(() => rpRepairOrders.id),

		/** 来电号码 */
		callerPhone: varchar("caller_phone", { length: 20 }).notNull(),
		/** 来电时间 */
		callTime: timestamp("call_time").notNull().defaultNow(),
		/** 接听人 */
		receiver: varchar("receiver", { length: 50 }),
		/** 报修内容摘要 */
		repairSummary: text("repair_summary"),

		...timestamps,
	},
	(table) => [index("rp_phone_repair_reports_order_id_idx").on(table.orderId)],
);

/** 电话报修记录插入类型 */
export type InsertRpPhoneRepairReport = typeof rpPhoneRepairReports.$inferInsert;
/** 电话报修记录查询类型 */
export type SelectRpPhoneRepairReport = typeof rpPhoneRepairReports.$inferSelect;
