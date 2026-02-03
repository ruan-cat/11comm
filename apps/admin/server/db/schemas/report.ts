/**
 * @file 报表管理模块 Schema
 * @description 定义报表管理相关的表结构，前缀 rpt_
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
import { primaryId, timestamps, remarkField } from "./common";
import { cmCommunities } from "./community";
import { hpOwners } from "./house-property";

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

/** 费用汇总报表插入类型 */
export type InsertRptExpenseSummary = typeof rptExpenseSummaries.$inferInsert;
/** 费用汇总报表查询类型 */
export type SelectRptExpenseSummary = typeof rptExpenseSummaries.$inferSelect;

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

/** 押金报表插入类型 */
export type InsertRptDepositReport = typeof rptDepositReports.$inferInsert;
/** 押金报表查询类型 */
export type SelectRptDepositReport = typeof rptDepositReports.$inferSelect;

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

/** 缴费明细报表插入类型 */
export type InsertRptPaymentDetail = typeof rptPaymentDetails.$inferInsert;
/** 缴费明细报表查询类型 */
export type SelectRptPaymentDetail = typeof rptPaymentDetails.$inferSelect;

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

/** 业主缴费明细插入类型 */
export type InsertRptOwnerPaymentDetail = typeof rptOwnerPaymentDetails.$inferInsert;
/** 业主缴费明细查询类型 */
export type SelectRptOwnerPaymentDetail = typeof rptOwnerPaymentDetails.$inferSelect;

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

/** 催费提醒插入类型 */
export type InsertRptFeeReminder = typeof rptFeeReminders.$inferInsert;
/** 催费提醒查询类型 */
export type SelectRptFeeReminder = typeof rptFeeReminders.$inferSelect;

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

/** 未收费房屋插入类型 */
export type InsertRptNoChargeHouse = typeof rptNoChargeHouses.$inferInsert;
/** 未收费房屋查询类型 */
export type SelectRptNoChargeHouse = typeof rptNoChargeHouses.$inferSelect;

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

/** 欠费分析插入类型 */
export type InsertRptOutstandingFee = typeof rptOutstandingFees.$inferInsert;
/** 欠费分析查询类型 */
export type SelectRptOutstandingFee = typeof rptOutstandingFees.$inferSelect;

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

/** 巡检报表插入类型 */
export type InsertRptPatrolReport = typeof rptPatrolReports.$inferInsert;
/** 巡检报表查询类型 */
export type SelectRptPatrolReport = typeof rptPatrolReports.$inferSelect;

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

/** 维修报表插入类型 */
export type InsertRptRepairReport = typeof rptRepairReports.$inferInsert;
/** 维修报表查询类型 */
export type SelectRptRepairReport = typeof rptRepairReports.$inferSelect;

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

/** 维修汇总报表插入类型 */
export type InsertRptRepairSummary = typeof rptRepairSummaries.$inferInsert;
/** 维修汇总报表查询类型 */
export type SelectRptRepairSummary = typeof rptRepairSummaries.$inferSelect;

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

/** 费用报表插入类型 */
export type InsertRptStatementExpense = typeof rptStatementExpenses.$inferInsert;
/** 费用报表查询类型 */
export type SelectRptStatementExpense = typeof rptStatementExpenses.$inferSelect;

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

/** 综合数据统计插入类型 */
export type InsertRptDataStatistic = typeof rptDataStatistics.$inferInsert;
/** 综合数据统计查询类型 */
export type SelectRptDataStatistic = typeof rptDataStatistics.$inferSelect;
