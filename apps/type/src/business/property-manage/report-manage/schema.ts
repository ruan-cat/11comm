/**
 * @file 报表管理模块 Schema
 * @description 定义报表管理相关的表结构，前缀 rpt_
 * @module report-manage
 */

import {
	index,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
	integer,
	decimal,
	date,
	jsonb,
	boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { primaryId, timestamps, remarkField } from "../../../common";
import { cmCommunities } from "../community-manage/schema";
import { hpOwners } from "../house-property-manage/schema";

// ==========================================
// Part A: Database Table Definitions
// ==========================================

/**
 * 费用汇总报表表
 * 存储费用汇总统计数据，支持按小区、楼栋、费用项等维度统计
 */
export const rptExpenseSummaries = pgTable(
	"rpt_expense_summaries",
	{
		id: primaryId(),

		/** 关联小区 ID */
		communityId: uuid("community_id").references(() => cmCommunities.id),

		/** 统计周期开始时间 */
		periodStart: date("period_start").notNull(),
		/** 统计周期结束时间 */
		periodEnd: date("period_end").notNull(),
		/** 费用类型 */
		expenseType: varchar("expense_type", { length: 50 }),
		/** 应收总额 */
		receivableTotal: decimal("receivable_total", { precision: 14, scale: 2 }),
		/** 实收总额 */
		receivedTotal: decimal("received_total", { precision: 14, scale: 2 }),
		/** 欠费总额 */
		outstandingTotal: decimal("outstanding_total", { precision: 14, scale: 2 }),

		/** 楼栋维度 */
		building: varchar("building", { length: 50 }),
		/** 费用项维度 */
		expenseItem: varchar("expense_item", { length: 100 }),

		/** 备注 */
		remark: remarkField(),

		...timestamps,
	},
	(table) => [
		index("rpt_expense_summaries_period_start_idx").on(table.periodStart),
		index("rpt_expense_summaries_period_end_idx").on(table.periodEnd),
		index("rpt_expense_summaries_community_id_idx").on(table.communityId),
	],
);

/**
 * 押金报表表
 * 存储押金收取、退还和在押统计数据
 */
export const rptDepositReports = pgTable(
	"rpt_deposit_reports",
	{
		id: primaryId(),

		/** 押金类型 */
		depositType: varchar("deposit_type", { length: 50 }),
		/** 收取总额 */
		collectedTotal: decimal("collected_total", { precision: 14, scale: 2 }),
		/** 退还总额 */
		returnedTotal: decimal("returned_total", { precision: 14, scale: 2 }),
		/** 在押总额 */
		holdingTotal: decimal("holding_total", { precision: 14, scale: 2 }),
		/** 统计周期开始时间 */
		periodStart: date("period_start"),
		/** 统计周期结束时间 */
		periodEnd: date("period_end"),

		/** 备注 */
		remark: remarkField(),

		...timestamps,
	},
	(table) => [
		index("rpt_deposit_reports_period_start_idx").on(table.periodStart),
		index("rpt_deposit_reports_period_end_idx").on(table.periodEnd),
	],
);

/**
 * 缴费明细报表表
 * 存储每笔缴费的详细记录
 */
export const rptPaymentDetails = pgTable(
	"rpt_payment_details",
	{
		id: primaryId(),

		/** 业主姓名 */
		ownerName: varchar("owner_name", { length: 50 }),
		/** 房屋编号 */
		houseNumber: varchar("house_number", { length: 50 }),
		/** 费用项目 */
		expenseItem: varchar("expense_item", { length: 100 }),
		/** 缴费金额 */
		paymentAmount: decimal("payment_amount", { precision: 12, scale: 2 }),
		/** 缴费时间 */
		paymentTime: timestamp("payment_time"),
		/** 支付方式 */
		paymentMethod: varchar("payment_method", { length: 50 }),
		/** 交易流水号 */
		transactionNo: varchar("transaction_no", { length: 100 }),
		/** 收款人 */
		collector: varchar("collector", { length: 50 }),

		/** 备注 */
		remark: remarkField(),

		...timestamps,
	},
	(table) => [index("rpt_payment_details_payment_time_idx").on(table.paymentTime)],
);

/**
 * 业主缴费明细表
 * 存储业主的缴费汇总统计
 */
export const rptOwnerPaymentDetails = pgTable(
	"rpt_owner_payment_details",
	{
		id: primaryId(),

		/** 关联业主 ID */
		ownerId: uuid("owner_id").references(() => hpOwners.id),

		/** 业主姓名 */
		ownerName: varchar("owner_name", { length: 50 }),
		/** 累计应缴 */
		totalReceivable: decimal("total_receivable", { precision: 14, scale: 2 }),
		/** 累计已缴 */
		totalPaid: decimal("total_paid", { precision: 14, scale: 2 }),
		/** 累计欠费 */
		totalOutstanding: decimal("total_outstanding", { precision: 14, scale: 2 }),

		/** 备注 */
		remark: remarkField(),

		...timestamps,
	},
	(table) => [index("rpt_owner_payment_details_owner_id_idx").on(table.ownerId)],
);

/**
 * 催费提醒表
 * 存储催费提醒记录和结果
 */
export const rptFeeReminders = pgTable(
	"rpt_fee_reminders",
	{
		id: primaryId(),

		/** 业主信息 */
		ownerInfo: varchar("owner_info", { length: 200 }),
		/** 欠费金额 */
		outstandingAmount: decimal("outstanding_amount", { precision: 12, scale: 2 }),
		/** 提醒方式 */
		reminderMethod: varchar("reminder_method", { length: 50 }),
		/** 提醒时间 */
		reminderTime: timestamp("reminder_time"),
		/** 是否送达 */
		isDelivered: boolean("is_delivered").default(false),
		/** 业主反馈 */
		ownerFeedback: text("owner_feedback"),

		/** 备注 */
		remark: remarkField(),

		...timestamps,
	},
	(table) => [index("rpt_fee_reminders_reminder_time_idx").on(table.reminderTime)],
);

/**
 * 未收费房屋表
 * 存储未产生收费的房屋统计
 */
export const rptNoChargeHouses = pgTable("rpt_no_charge_houses", {
	id: primaryId(),

	/** 房屋编号 */
	houseNumber: varchar("house_number", { length: 50 }),
	/** 业主信息 */
	ownerInfo: varchar("owner_info", { length: 200 }),
	/** 未收费原因 */
	noChargeReason: varchar("no_charge_reason", { length: 200 }),
	/** 最后收费日期 */
	lastChargeDate: date("last_charge_date"),

	/** 备注 */
	remark: remarkField(),

	...timestamps,
});

/**
 * 欠费分析表
 * 存储欠费情况的分析统计数据
 */
export const rptOutstandingFees = pgTable(
	"rpt_outstanding_fees",
	{
		id: primaryId(),

		/** 欠费账龄（如：1-30天、31-60天等） */
		agingBucket: varchar("aging_bucket", { length: 50 }),
		/** 欠费金额 */
		outstandingAmount: decimal("outstanding_amount", { precision: 14, scale: 2 }),
		/** 欠费户数 */
		householdCount: integer("household_count"),
		/** 小区维度 */
		community: varchar("community", { length: 100 }),
		/** 楼栋维度 */
		building: varchar("building", { length: 50 }),
		/** 费用项维度 */
		expenseItem: varchar("expense_item", { length: 100 }),

		/** 备注 */
		remark: remarkField(),

		...timestamps,
	},
	(table) => [index("rpt_outstanding_fees_aging_bucket_idx").on(table.agingBucket)],
);

/**
 * 巡检报表表
 * 存储巡检任务的统计数据
 */
export const rptPatrolReports = pgTable(
	"rpt_patrol_reports",
	{
		id: primaryId(),

		/** 计划任务数 */
		plannedTasks: integer("planned_tasks"),
		/** 完成任务数 */
		completedTasks: integer("completed_tasks"),
		/** 异常任务数 */
		abnormalTasks: integer("abnormal_tasks"),
		/** 按时完成率（百分比） */
		onTimeCompletionRate: decimal("on_time_completion_rate", { precision: 5, scale: 2 }),
		/** 统计周期 */
		period: varchar("period", { length: 50 }),
		/** 统计维度 */
		dimension: varchar("dimension", { length: 50 }),

		/** 备注 */
		remark: remarkField(),

		...timestamps,
	},
	(table) => [index("rpt_patrol_reports_period_idx").on(table.period)],
);

/**
 * 维修报表表
 * 存储维修任务的统计数据
 */
export const rptRepairReports = pgTable("rpt_repair_reports", {
	id: primaryId(),

	/** 报修总数 */
	totalRepairs: integer("total_repairs"),
	/** 已完成数 */
	completedCount: integer("completed_count"),
	/** 待处理数 */
	pendingCount: integer("pending_count"),
	/** 平均处理时长（小时） */
	avgProcessingTime: decimal("avg_processing_time", { precision: 10, scale: 2 }),
	/** 满意率（百分比） */
	satisfactionRate: decimal("satisfaction_rate", { precision: 5, scale: 2 }),
	/** 不满意原因分布（JSON格式） */
	dissatisfactionReasons: jsonb("dissatisfaction_reasons"),

	/** 备注 */
	remark: remarkField(),

	...timestamps,
});

/**
 * 维修汇总报表表
 * 存储维修类型分布、人员工作量、成本统计等汇总数据
 */
export const rptRepairSummaries = pgTable("rpt_repair_summaries", {
	id: primaryId(),

	/** 维修类型分布（JSON格式） */
	repairTypeDistribution: jsonb("repair_type_distribution"),
	/** 维修人员工作量（JSON格式） */
	workerWorkload: jsonb("worker_workload"),
	/** 维修成本统计（JSON格式） */
	repairCostStatistics: jsonb("repair_cost_statistics"),

	/** 备注 */
	remark: remarkField(),

	...timestamps,
});

/**
 * 费用报表表
 * 存储费用报表的数据快照
 */
export const rptStatementExpenses = pgTable("rpt_statement_expenses", {
	id: primaryId(),

	/** 报表类型 */
	reportType: varchar("report_type", { length: 50 }),
	/** 报表周期 */
	reportPeriod: varchar("report_period", { length: 50 }),
	/** 数据快照（JSON格式） */
	dataSnapshot: jsonb("data_snapshot"),

	/** 备注 */
	remark: remarkField(),

	...timestamps,
});

/**
 * 综合数据统计表
 * 存储各类统计指标数据
 */
export const rptDataStatistics = pgTable(
	"rpt_data_statistics",
	{
		id: primaryId(),

		/** 统计指标 */
		statisticIndicator: varchar("statistic_indicator", { length: 100 }),
		/** 统计值 */
		statisticValue: decimal("statistic_value", { precision: 18, scale: 4 }),
		/** 统计时间 */
		statisticTime: timestamp("statistic_time"),
		/** 对比基准值 */
		comparisonBaseline: decimal("comparison_baseline", { precision: 18, scale: 4 }),

		/** 备注 */
		remark: remarkField(),

		...timestamps,
	},
	(table) => [index("rpt_data_statistics_statistic_time_idx").on(table.statisticTime)],
);

// ==========================================
// Part B: Zod Runtime Schemas
// ==========================================

// --- rptExpenseSummaries ---
export const insertRptExpenseSummarySchema = createInsertSchema(rptExpenseSummaries, {
	periodStart: (schema) => schema.min(1, "开始时间不能为空"),
	periodEnd: (schema) => schema.min(1, "结束时间不能为空"),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectRptExpenseSummarySchema = createSelectSchema(rptExpenseSummaries);

export const updateRptExpenseSummarySchema = z.object({
	id: z.string().uuid(),
	communityId: z.string().uuid().optional().nullable(),
	periodStart: z.string().optional(),
	periodEnd: z.string().optional(),
	expenseType: z.string().max(50).optional().nullable(),
	receivableTotal: z.string().optional().nullable(),
	receivedTotal: z.string().optional().nullable(),
	outstandingTotal: z.string().optional().nullable(),
	building: z.string().max(50).optional().nullable(),
	expenseItem: z.string().max(100).optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- rptDepositReports ---
export const insertRptDepositReportSchema = createInsertSchema(rptDepositReports).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectRptDepositReportSchema = createSelectSchema(rptDepositReports);

export const updateRptDepositReportSchema = z.object({
	id: z.string().uuid(),
	depositType: z.string().max(50).optional().nullable(),
	collectedTotal: z.string().optional().nullable(),
	returnedTotal: z.string().optional().nullable(),
	holdingTotal: z.string().optional().nullable(),
	periodStart: z.string().optional().nullable(),
	periodEnd: z.string().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- rptPaymentDetails ---
export const insertRptPaymentDetailSchema = createInsertSchema(rptPaymentDetails).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectRptPaymentDetailSchema = createSelectSchema(rptPaymentDetails);

export const updateRptPaymentDetailSchema = z.object({
	id: z.string().uuid(),
	ownerName: z.string().max(50).optional().nullable(),
	houseNumber: z.string().max(50).optional().nullable(),
	expenseItem: z.string().max(100).optional().nullable(),
	paymentAmount: z.string().optional().nullable(),
	paymentTime: z.date().optional().nullable(),
	paymentMethod: z.string().max(50).optional().nullable(),
	transactionNo: z.string().max(100).optional().nullable(),
	collector: z.string().max(50).optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- rptOwnerPaymentDetails ---
export const insertRptOwnerPaymentDetailSchema = createInsertSchema(rptOwnerPaymentDetails).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectRptOwnerPaymentDetailSchema = createSelectSchema(rptOwnerPaymentDetails);

export const updateRptOwnerPaymentDetailSchema = z.object({
	id: z.string().uuid(),
	ownerId: z.string().uuid().optional().nullable(),
	ownerName: z.string().max(50).optional().nullable(),
	totalReceivable: z.string().optional().nullable(),
	totalPaid: z.string().optional().nullable(),
	totalOutstanding: z.string().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- rptFeeReminders ---
export const insertRptFeeReminderSchema = createInsertSchema(rptFeeReminders).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectRptFeeReminderSchema = createSelectSchema(rptFeeReminders);

export const updateRptFeeReminderSchema = z.object({
	id: z.string().uuid(),
	ownerInfo: z.string().max(200).optional().nullable(),
	outstandingAmount: z.string().optional().nullable(),
	reminderMethod: z.string().max(50).optional().nullable(),
	reminderTime: z.date().optional().nullable(),
	isDelivered: z.boolean().optional(),
	ownerFeedback: z.string().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- rptNoChargeHouses ---
export const insertRptNoChargeHouseSchema = createInsertSchema(rptNoChargeHouses).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectRptNoChargeHouseSchema = createSelectSchema(rptNoChargeHouses);

export const updateRptNoChargeHouseSchema = z.object({
	id: z.string().uuid(),
	houseNumber: z.string().max(50).optional().nullable(),
	ownerInfo: z.string().max(200).optional().nullable(),
	noChargeReason: z.string().max(200).optional().nullable(),
	lastChargeDate: z.string().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- rptOutstandingFees ---
export const insertRptOutstandingFeeSchema = createInsertSchema(rptOutstandingFees).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectRptOutstandingFeeSchema = createSelectSchema(rptOutstandingFees);

export const updateRptOutstandingFeeSchema = z.object({
	id: z.string().uuid(),
	agingBucket: z.string().max(50).optional().nullable(),
	outstandingAmount: z.string().optional().nullable(),
	householdCount: z.number().int().optional().nullable(),
	community: z.string().max(100).optional().nullable(),
	building: z.string().max(50).optional().nullable(),
	expenseItem: z.string().max(100).optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- rptPatrolReports ---
export const insertRptPatrolReportSchema = createInsertSchema(rptPatrolReports).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectRptPatrolReportSchema = createSelectSchema(rptPatrolReports);

export const updateRptPatrolReportSchema = z.object({
	id: z.string().uuid(),
	plannedTasks: z.number().int().optional().nullable(),
	completedTasks: z.number().int().optional().nullable(),
	abnormalTasks: z.number().int().optional().nullable(),
	onTimeCompletionRate: z.string().optional().nullable(),
	period: z.string().max(50).optional().nullable(),
	dimension: z.string().max(50).optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- rptRepairReports ---
export const insertRptRepairReportSchema = createInsertSchema(rptRepairReports).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectRptRepairReportSchema = createSelectSchema(rptRepairReports);

export const updateRptRepairReportSchema = z.object({
	id: z.string().uuid(),
	totalRepairs: z.number().int().optional().nullable(),
	completedCount: z.number().int().optional().nullable(),
	pendingCount: z.number().int().optional().nullable(),
	avgProcessingTime: z.string().optional().nullable(),
	satisfactionRate: z.string().optional().nullable(),
	dissatisfactionReasons: z.any().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- rptRepairSummaries ---
export const insertRptRepairSummarySchema = createInsertSchema(rptRepairSummaries).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectRptRepairSummarySchema = createSelectSchema(rptRepairSummaries);

export const updateRptRepairSummarySchema = z.object({
	id: z.string().uuid(),
	repairTypeDistribution: z.any().optional().nullable(),
	workerWorkload: z.any().optional().nullable(),
	repairCostStatistics: z.any().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- rptStatementExpenses ---
export const insertRptStatementExpenseSchema = createInsertSchema(rptStatementExpenses).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectRptStatementExpenseSchema = createSelectSchema(rptStatementExpenses);

export const updateRptStatementExpenseSchema = z.object({
	id: z.string().uuid(),
	reportType: z.string().max(50).optional().nullable(),
	reportPeriod: z.string().max(50).optional().nullable(),
	dataSnapshot: z.any().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- rptDataStatistics ---
export const insertRptDataStatisticSchema = createInsertSchema(rptDataStatistics).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectRptDataStatisticSchema = createSelectSchema(rptDataStatistics);

export const updateRptDataStatisticSchema = z.object({
	id: z.string().uuid(),
	statisticIndicator: z.string().max(100).optional().nullable(),
	statisticValue: z.string().optional().nullable(),
	statisticTime: z.date().optional().nullable(),
	comparisonBaseline: z.string().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// ==========================================
// Part C: TypeScript Types
// ==========================================

export type RptExpenseSummary = typeof rptExpenseSummaries.$inferSelect;
export type NewRptExpenseSummary = typeof rptExpenseSummaries.$inferInsert;
export type UpdateRptExpenseSummary = z.infer<typeof updateRptExpenseSummarySchema>;

export type RptDepositReport = typeof rptDepositReports.$inferSelect;
export type NewRptDepositReport = typeof rptDepositReports.$inferInsert;
export type UpdateRptDepositReport = z.infer<typeof updateRptDepositReportSchema>;

export type RptPaymentDetail = typeof rptPaymentDetails.$inferSelect;
export type NewRptPaymentDetail = typeof rptPaymentDetails.$inferInsert;
export type UpdateRptPaymentDetail = z.infer<typeof updateRptPaymentDetailSchema>;

export type RptOwnerPaymentDetail = typeof rptOwnerPaymentDetails.$inferSelect;
export type NewRptOwnerPaymentDetail = typeof rptOwnerPaymentDetails.$inferInsert;
export type UpdateRptOwnerPaymentDetail = z.infer<typeof updateRptOwnerPaymentDetailSchema>;

export type RptFeeReminder = typeof rptFeeReminders.$inferSelect;
export type NewRptFeeReminder = typeof rptFeeReminders.$inferInsert;
export type UpdateRptFeeReminder = z.infer<typeof updateRptFeeReminderSchema>;

export type RptNoChargeHouse = typeof rptNoChargeHouses.$inferSelect;
export type NewRptNoChargeHouse = typeof rptNoChargeHouses.$inferInsert;
export type UpdateRptNoChargeHouse = z.infer<typeof updateRptNoChargeHouseSchema>;

export type RptOutstandingFee = typeof rptOutstandingFees.$inferSelect;
export type NewRptOutstandingFee = typeof rptOutstandingFees.$inferInsert;
export type UpdateRptOutstandingFee = z.infer<typeof updateRptOutstandingFeeSchema>;

export type RptPatrolReport = typeof rptPatrolReports.$inferSelect;
export type NewRptPatrolReport = typeof rptPatrolReports.$inferInsert;
export type UpdateRptPatrolReport = z.infer<typeof updateRptPatrolReportSchema>;

export type RptRepairReport = typeof rptRepairReports.$inferSelect;
export type NewRptRepairReport = typeof rptRepairReports.$inferInsert;
export type UpdateRptRepairReport = z.infer<typeof updateRptRepairReportSchema>;

export type RptRepairSummary = typeof rptRepairSummaries.$inferSelect;
export type NewRptRepairSummary = typeof rptRepairSummaries.$inferInsert;
export type UpdateRptRepairSummary = z.infer<typeof updateRptRepairSummarySchema>;

export type RptStatementExpense = typeof rptStatementExpenses.$inferSelect;
export type NewRptStatementExpense = typeof rptStatementExpenses.$inferInsert;
export type UpdateRptStatementExpense = z.infer<typeof updateRptStatementExpenseSchema>;

export type RptDataStatistic = typeof rptDataStatistics.$inferSelect;
export type NewRptDataStatistic = typeof rptDataStatistics.$inferInsert;
export type UpdateRptDataStatistic = z.infer<typeof updateRptDataStatisticSchema>;
