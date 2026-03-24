/**
 * @file 报修管理模块 Schema
 * @description 定义报修管理相关的表结构，前缀 rp_
 * @module repairs-manage
 */

import { index, pgTable, text, timestamp, uuid, varchar, integer, uniqueIndex } from "drizzle-orm/pg-core";
import { isNull } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
	primaryId,
	timestamps,
	softDelete,
	remarkField,
	repairOrderStatusEnum,
	returnVisitStatusEnum,
	repairSettingTypeEnum,
	dispatchMethodEnum,
	serviceAreaEnum,
	mandatoryReturnStatusEnum,
} from "../../../common";
import { smStaff } from "../../setting-manage/user-manage/schema";

// ==========================================
// Part A: Database Table Definitions
// ==========================================

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
		/** 指派人 ID */
		assignerId: uuid("assigner_id").references(() => smStaff.id),
		/** 指派时间 */
		assignTime: timestamp("assign_time"),
		/** 维修人员 */
		repairPerson: varchar("repair_person", { length: 50 }),
		/** 维修人员 ID */
		repairPersonId: uuid("repair_person_id").references(() => smStaff.id),
		/** 计划完成时间 */
		plannedCompletionTime: timestamp("planned_completion_time"),

		/** 备注 */
		remark: remarkField(),

		...timestamps,
		...softDelete,
	},
	(table) => [
		uniqueIndex("rp_repair_orders_work_order_number_idx").on(table.workOrderNumber).where(isNull(table.deletedAt)),
		index("rp_repair_orders_status_idx").on(table.status),
		index("rp_repair_orders_created_at_idx").on(table.createTime),
	],
);

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
		/** 回访人 ID */
		visitorId: uuid("visitor_id").references(() => smStaff.id),
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

// ==========================================
// Part B: Zod Runtime Schemas
// ==========================================

// --- rpRepairOrders ---
export const insertRpRepairOrderSchema = createInsertSchema(rpRepairOrders, {
	workOrderNumber: (schema) => schema.min(1, "工单编号不能为空").max(50),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
	deletedAt: true,
});

export const selectRpRepairOrderSchema = createSelectSchema(rpRepairOrders);

export const updateRpRepairOrderSchema = z.object({
	id: z.string().uuid(),
	workOrderNumber: z.string().min(1, "工单编号不能为空").max(50).optional(),
	repairType: z.string().max(50).optional().nullable(),
	maintenanceType: z.string().max(50).optional().nullable(),
	repairSource: z.string().max(50).optional().nullable(),
	reporterName: z.string().max(50).optional().nullable(),
	contactPhone: z.string().max(20).optional().nullable(),
	repairLocation: z.string().optional().nullable(),
	problemDescription: z.string().optional().nullable(),
	repairPhotoUrl: z.string().optional().nullable(),
	appointmentTime: z.date().optional().nullable(),
	status: z.enum(["pending", "processing", "completed", "cancelled", "paused"]).optional(),
	assigner: z.string().max(50).optional().nullable(),
	assignerId: z.string().uuid().optional().nullable(),
	assignTime: z.date().optional().nullable(),
	repairPerson: z.string().max(50).optional().nullable(),
	repairPersonId: z.string().uuid().optional().nullable(),
	plannedCompletionTime: z.date().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- rpRepairOrderHistories ---
export const insertRpRepairOrderHistorySchema = createInsertSchema(rpRepairOrderHistories, {
	operationType: (schema) => schema.min(1, "操作类型不能为空").max(50),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectRpRepairOrderHistorySchema = createSelectSchema(rpRepairOrderHistories);

export const updateRpRepairOrderHistorySchema = z.object({
	id: z.string().uuid(),
	orderId: z.string().uuid().optional(),
	operationType: z.string().min(1, "操作类型不能为空").max(50).optional(),
	operator: z.string().max(50).optional().nullable(),
	operationTime: z.date().optional(),
	operationDescription: z.string().optional().nullable(),
});

// --- rpReturnVisits ---
export const insertRpReturnVisitSchema = createInsertSchema(rpReturnVisits).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectRpReturnVisitSchema = createSelectSchema(rpReturnVisits);

export const updateRpReturnVisitSchema = z.object({
	id: z.string().uuid(),
	orderId: z.string().uuid().optional(),
	visitor: z.string().max(50).optional().nullable(),
	visitorId: z.string().uuid().optional().nullable(),
	visitTime: z.date().optional().nullable(),
	visitMethod: z.string().max(50).optional().nullable(),
	satisfactionRating: z.number().int().optional().nullable(),
	visitStatus: z.enum(["not_visited", "visited", "satisfied", "unsatisfied"]).optional(),
	visitNote: z.string().optional().nullable(),
});

// --- rpRepairSettings ---
export const insertRpRepairSettingSchema = createInsertSchema(rpRepairSettings).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectRpRepairSettingSchema = createSelectSchema(rpRepairSettings);

export const updateRpRepairSettingSchema = z.object({
	id: z.string().uuid(),
	settingType: z.enum(["cleaning", "maintenance"]).optional().nullable(),
	dispatchMethod: z.enum(["grab", "assign", "rotation"]).optional().nullable(),
	serviceArea: z.enum(["house", "public_area", "garage", "non_house"]).optional().nullable(),
	processingTimeLimit: z.number().int().optional().nullable(),
	returnVisitTimeLimit: z.number().int().optional().nullable(),
});

// --- rpRepairTypes ---
export const insertRpRepairTypeSchema = createInsertSchema(rpRepairTypes, {
	typeName: (schema) => schema.min(1, "类型名称不能为空").max(50),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectRpRepairTypeSchema = createSelectSchema(rpRepairTypes);

export const updateRpRepairTypeSchema = z.object({
	id: z.string().uuid(),
	typeName: z.string().min(1, "类型名称不能为空").max(50).optional(),
	typeDescription: z.string().optional().nullable(),
	sortOrder: z.number().int().optional(),
});

// --- rpMandatoryReturnIssues ---
export const insertRpMandatoryReturnIssueSchema = createInsertSchema(rpMandatoryReturnIssues, {
	workOrderNumber: (schema) => schema.min(1, "工单编号不能为空").max(50),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectRpMandatoryReturnIssueSchema = createSelectSchema(rpMandatoryReturnIssues);

export const updateRpMandatoryReturnIssueSchema = z.object({
	id: z.string().uuid(),
	workOrderNumber: z.string().min(1, "工单编号不能为空").max(50).optional(),
	mandatoryReason: z.string().optional().nullable(),
	mandatoryTime: z.date().optional().nullable(),
	returnStatus: z.enum(["pending_return", "returned", "forced_returned"]).optional(),
});

// --- rpPhoneRepairReports ---
export const insertRpPhoneRepairReportSchema = createInsertSchema(rpPhoneRepairReports, {
	callerPhone: (schema) => schema.min(1, "来电号码不能为空").max(20),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectRpPhoneRepairReportSchema = createSelectSchema(rpPhoneRepairReports);

export const updateRpPhoneRepairReportSchema = z.object({
	id: z.string().uuid(),
	orderId: z.string().uuid().optional().nullable(),
	callerPhone: z.string().min(1, "来电号码不能为空").max(20).optional(),
	callTime: z.date().optional(),
	receiver: z.string().max(50).optional().nullable(),
	repairSummary: z.string().optional().nullable(),
});

// ==========================================
// Part C: TypeScript Types
// ==========================================

export type RpRepairOrder = typeof rpRepairOrders.$inferSelect;
export type NewRpRepairOrder = typeof rpRepairOrders.$inferInsert;
export type UpdateRpRepairOrder = z.infer<typeof updateRpRepairOrderSchema>;

export type RpRepairOrderHistory = typeof rpRepairOrderHistories.$inferSelect;
export type NewRpRepairOrderHistory = typeof rpRepairOrderHistories.$inferInsert;
export type UpdateRpRepairOrderHistory = z.infer<typeof updateRpRepairOrderHistorySchema>;

export type RpReturnVisit = typeof rpReturnVisits.$inferSelect;
export type NewRpReturnVisit = typeof rpReturnVisits.$inferInsert;
export type UpdateRpReturnVisit = z.infer<typeof updateRpReturnVisitSchema>;

export type RpRepairSetting = typeof rpRepairSettings.$inferSelect;
export type NewRpRepairSetting = typeof rpRepairSettings.$inferInsert;
export type UpdateRpRepairSetting = z.infer<typeof updateRpRepairSettingSchema>;

export type RpRepairType = typeof rpRepairTypes.$inferSelect;
export type NewRpRepairType = typeof rpRepairTypes.$inferInsert;
export type UpdateRpRepairType = z.infer<typeof updateRpRepairTypeSchema>;

export type RpMandatoryReturnIssue = typeof rpMandatoryReturnIssues.$inferSelect;
export type NewRpMandatoryReturnIssue = typeof rpMandatoryReturnIssues.$inferInsert;
export type UpdateRpMandatoryReturnIssue = z.infer<typeof updateRpMandatoryReturnIssueSchema>;

export type RpPhoneRepairReport = typeof rpPhoneRepairReports.$inferSelect;
export type NewRpPhoneRepairReport = typeof rpPhoneRepairReports.$inferInsert;
export type UpdateRpPhoneRepairReport = z.infer<typeof updateRpPhoneRepairReportSchema>;
