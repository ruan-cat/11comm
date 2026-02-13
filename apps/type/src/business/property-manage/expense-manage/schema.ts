/**
 * @file 费用管理模块 Schema
 * @description 定义费用管理相关的表结构，前缀 ex_, hp_
 * @module expense-manage
 */

import { index, pgTable, text, timestamp, uuid, varchar, integer, decimal, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
	primaryId,
	timestamps,
	softDelete,
	remarkField,
	statusEnum,
	auditStatusEnum,
	chargeStatusEnum,
	refundStatusEnum,
	discountTypeEnum,
	roundingModeEnum,
} from "../../../common";
import { hpHouses, hpOwners } from "../house-property-manage/schema";
import { pkOwnerVehicles } from "../parking-manage/schema";
import { ctContracts } from "../contract-manage/schema";

// ==========================================
// Part A: Database Table Definitions
// ==========================================

/** 收费项目配置表 */
export const exExpenseItems = pgTable(
	"ex_expense_items",
	{
		id: primaryId(),
		/** 费用类型 */
		expenseType: varchar("expense_type", { length: 50 }).notNull(),
		/** 收费项目名称 */
		itemName: varchar("item_name", { length: 100 }).notNull(),
		/** 费用标识/编码 */
		expenseCode: varchar("expense_code", { length: 50 }),
		/** 付费类型 */
		paymentType: varchar("payment_type", { length: 50 }),
		/** 计费单价 */
		unitPrice: decimal("unit_price", { precision: 12, scale: 4 }),
		/** 固定费用 */
		fixedFee: decimal("fixed_fee", { precision: 12, scale: 2 }),
		/** 计算公式 */
		formula: text("formula"),
		/** 缴费周期 */
		billingCycle: varchar("billing_cycle", { length: 50 }),
		/** 账户抵扣开关 */
		accountDeduction: boolean("account_deduction").default(false),
		/** 手机缴费开关 */
		mobilePayment: boolean("mobile_payment").default(true),
		/** 进位方式 */
		roundingMode: roundingModeEnum("rounding_mode").default("round"),
		/** 保留小数位 */
		decimalPlaces: integer("decimal_places").default(2),
		/** 状态 */
		status: statusEnum("status").default("enabled"),
		/** 备注 */
		remark: remarkField(),

		...timestamps,
	},
	(table) => [
		index("ex_expense_items_expense_type_idx").on(table.expenseType),
		index("ex_expense_items_status_idx").on(table.status),
	],
);

/** 房屋收费表 */
export const exHouseCharges = pgTable(
	"ex_house_charges",
	{
		id: primaryId(),
		/** 关联房屋 ID */
		houseId: uuid("house_id")
			.references(() => hpHouses.id)
			.notNull(),
		/** 费用项目 */
		expenseItem: varchar("expense_item", { length: 100 }).notNull(),
		/** 应收金额 */
		receivableAmount: decimal("receivable_amount", { precision: 12, scale: 2 }).notNull(),
		/** 实收金额 */
		receivedAmount: decimal("received_amount", { precision: 12, scale: 2 }).default("0"),
		/** 账单周期 */
		billingPeriod: varchar("billing_period", { length: 50 }),
		/** 缴费状态 */
		status: chargeStatusEnum("status").default("unpaid"),
		/** 账单生成日期 */
		billDate: date("bill_date"),
		/** 到期日期 */
		dueDate: date("due_date"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("ex_house_charges_house_id_billing_period_idx").on(table.houseId, table.billingPeriod),
		index("ex_house_charges_status_idx").on(table.status),
	],
);

/** 车辆收费表 */
export const exVehicleCharges = pgTable(
	"ex_vehicle_charges",
	{
		id: primaryId(),
		/** 关联车辆 ID - 引用 pk_owner_vehicles 表 */
		vehicleId: uuid("vehicle_id")
			.notNull()
			.references(() => pkOwnerVehicles.id),
		/** 车牌号 */
		licensePlate: varchar("license_plate", { length: 20 }).notNull(),
		/** 车位编号 */
		carportNumber: varchar("carport_number", { length: 50 }),
		/** 费用类型 */
		expenseType: varchar("expense_type", { length: 50 }),
		/** 应收金额 */
		receivableAmount: decimal("receivable_amount", { precision: 12, scale: 2 }).notNull(),
		/** 实收金额 */
		receivedAmount: decimal("received_amount", { precision: 12, scale: 2 }).default("0"),
		/** 账单周期 */
		billingPeriod: varchar("billing_period", { length: 50 }),
		/** 缴费状态 */
		status: chargeStatusEnum("status").default("unpaid"),
		/** 备注 */
		remark: remarkField(),
		/** 业主名称 */
		ownerName: varchar("owner_name", { length: 50 }),
		/** 车位状态 */
		parkingSpaceStatus: varchar("parking_space_status", { length: 50 }),
		...timestamps,
	},
	(table) => [
		index("ex_vehicle_charges_vehicle_id_idx").on(table.vehicleId),
		index("ex_vehicle_charges_license_plate_idx").on(table.licensePlate),
		index("ex_vehicle_charges_status_idx").on(table.status),
	],
);

/** 合同收费表 */
export const exContractCharges = pgTable(
	"ex_contract_charges",
	{
		id: primaryId(),
		/** 关联合同 ID - 引用 ct_contracts 表 */
		contractId: uuid("contract_id")
			.notNull()
			.references(() => ctContracts.id),
		/** 合同编号 */
		contractNumber: varchar("contract_number", { length: 50 }),
		/** 费用项目 */
		expenseItem: varchar("expense_item", { length: 100 }).notNull(),
		/** 应收金额 */
		receivableAmount: decimal("receivable_amount", { precision: 12, scale: 2 }).notNull(),
		/** 实收金额 */
		receivedAmount: decimal("received_amount", { precision: 12, scale: 2 }).default("0"),
		/** 收费周期 */
		chargeCycle: varchar("charge_cycle", { length: 50 }),
		/** 缴费状态 */
		status: chargeStatusEnum("status").default("unpaid"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("ex_contract_charges_contract_id_idx").on(table.contractId),
		index("ex_contract_charges_status_idx").on(table.status),
	],
);

/** 缴费记录表 */
export const exPayments = pgTable(
	"ex_payments",
	{
		id: primaryId(),
		/** 关联费用账单 ID */
		chargeId: uuid("charge_id").notNull(),
		/** 费用类型：house/vehicle/contract */
		chargeType: varchar("charge_type", { length: 20 }),
		/** 支付金额 */
		paymentAmount: decimal("payment_amount", { precision: 12, scale: 2 }).notNull(),
		/** 支付方式 */
		paymentMethod: varchar("payment_method", { length: 50 }),
		/** 支付时间 */
		paymentTime: timestamp("payment_time"),
		/** 交易流水号 */
		transactionNo: varchar("transaction_no", { length: 100 }),
		/** 支付人 */
		payer: varchar("payer", { length: 50 }),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
		...softDelete,
	},
	(table) => [
		index("ex_payments_charge_id_idx").on(table.chargeId),
		index("ex_payments_transaction_no_idx").on(table.transactionNo),
	],
);

/** 缴费审核表 */
export const exPaymentReviews = pgTable(
	"ex_payment_reviews",
	{
		id: primaryId(),
		/** 关联缴费记录 ID */
		paymentId: uuid("payment_id")
			.references(() => exPayments.id)
			.notNull(),
		/** 审核人 */
		reviewer: varchar("reviewer", { length: 50 }),
		/** 审核意见 */
		reviewOpinion: text("review_opinion"),
		/** 审核结果 */
		reviewResult: auditStatusEnum("review_result").default("pending"),
		/** 审核时间 */
		reviewTime: timestamp("review_time"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("ex_payment_reviews_payment_id_idx").on(table.paymentId),
		index("ex_payment_reviews_result_idx").on(table.reviewResult),
	],
);

/** 退费审核表 */
export const exRefundReviews = pgTable(
	"ex_refund_reviews",
	{
		id: primaryId(),
		/** 关联收费记录 ID */
		chargeId: uuid("charge_id").notNull(),
		/** 费用类型 */
		chargeType: varchar("charge_type", { length: 20 }),
		/** 退费原因 */
		refundReason: text("refund_reason"),
		/** 退费金额 */
		refundAmount: decimal("refund_amount", { precision: 12, scale: 2 }).notNull(),
		/** 申请时间 */
		applyTime: timestamp("apply_time"),
		/** 申请人 */
		applicant: varchar("applicant", { length: 50 }),
		/** 退费状态 */
		status: refundStatusEnum("status").default("pending"),
		/** 审核人 */
		reviewer: varchar("reviewer", { length: 50 }),
		/** 审核时间 */
		reviewTime: timestamp("review_time"),
		/** 审核意见 */
		reviewOpinion: text("review_opinion"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("ex_refund_reviews_charge_id_idx").on(table.chargeId),
		index("ex_refund_reviews_status_idx").on(table.status),
	],
);

/** 折扣类型配置表 */
export const exDiscountTypes = pgTable("ex_discount_types", {
	id: primaryId(),
	/** 折扣名称 */
	discountName: varchar("discount_name", { length: 100 }).notNull(),
	/** 折扣类型：比例/固定金额/减免期 */
	discountType: discountTypeEnum("discount_type").notNull(),
	/** 折扣值 */
	discountValue: decimal("discount_value", { precision: 10, scale: 2 }),
	/** 状态 */
	status: statusEnum("status").default("enabled"),
	/** 备注 */
	remark: remarkField(),
	...timestamps,
});

/** 折扣设置表 */
export const exDiscountSettings = pgTable(
	"ex_discount_settings",
	{
		id: primaryId(),
		/** 关联折扣类型 ID */
		discountTypeId: uuid("discount_type_id").references(() => exDiscountTypes.id),
		/** 适用费用项 */
		applicableItem: varchar("applicable_item", { length: 100 }),
		/** 折扣类型 */
		discountType: varchar("discount_type", { length: 50 }),
		/** 有效期开始 */
		validityStart: date("validity_start"),
		/** 有效期结束 */
		validityEnd: date("validity_end"),
		/** 有效期描述 */
		validityPeriod: varchar("validity_period", { length: 100 }),
		/** 适用条件 */
		conditions: text("conditions"),
		/** 状态 */
		status: statusEnum("status").default("enabled"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ex_discount_settings_status_idx").on(table.status)],
);

/** 折扣申请表 */
export const exDiscountApplications = pgTable(
	"ex_discount_applications",
	{
		id: primaryId(),
		/** 关联折扣设置 ID */
		discountSettingId: uuid("discount_setting_id").references(() => exDiscountSettings.id),
		/** 申请人 */
		applicant: varchar("applicant", { length: 50 }),
		/** 申请类型 */
		applicationType: varchar("application_type", { length: 50 }),
		/** 申请原因 */
		applicationReason: text("application_reason"),
		/** 申请金额 */
		applicationAmount: decimal("application_amount", { precision: 12, scale: 2 }),
		/** 审核状态 */
		auditStatus: auditStatusEnum("audit_status").default("pending"),
		/** 审核人 */
		auditor: varchar("auditor", { length: 50 }),
		/** 审核时间 */
		auditTime: timestamp("audit_time"),
		/** 审核意见 */
		auditOpinion: text("audit_opinion"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ex_discount_applications_audit_status_idx").on(table.auditStatus)],
);

/** 表计类型配置表 */
export const exMeterReadingTypes = pgTable("ex_meter_reading_types", {
	id: primaryId(),
	/** 类型名称：水表/电表/燃气表 */
	typeName: varchar("type_name", { length: 50 }).notNull(),
	/** 类型编码 */
	typeCode: varchar("type_code", { length: 50 }),
	/** 单价 */
	unitPrice: decimal("unit_price", { precision: 10, scale: 4 }),
	/** 计费方式 */
	billingMethod: varchar("billing_method", { length: 50 }),
	/** 状态 */
	status: statusEnum("status").default("enabled"),
	/** 备注 */
	remark: remarkField(),

	...timestamps,
});

/** 表计抄读记录表 */
export const exMeterReadings = pgTable(
	"ex_meter_readings",
	{
		id: primaryId(),
		/** 关联房屋 ID */
		houseId: uuid("house_id")
			.references(() => hpHouses.id)
			.notNull(),
		/** 关联表计类型 ID */
		meterTypeId: uuid("meter_type_id").references(() => exMeterReadingTypes.id),
		/** 表计编号 */
		meterNo: varchar("meter_no", { length: 50 }).notNull(),
		/** 本期读数 */
		currentReading: decimal("current_reading", { precision: 12, scale: 2 }),
		/** 上期读数 */
		previousReading: decimal("previous_reading", { precision: 12, scale: 2 }),
		/** 用量 */
		usage: decimal("usage", { precision: 12, scale: 2 }),
		/** 抄表日期 */
		readingDate: date("reading_date"),
		/** 抄表员 */
		reader: varchar("reader", { length: 50 }),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("ex_meter_readings_house_id_idx").on(table.houseId),
		index("ex_meter_readings_meter_no_idx").on(table.meterNo),
		index("ex_meter_readings_reading_date_idx").on(table.readingDate),
	],
);

/** 费用核销表 */
export const exCancelFees = pgTable(
	"ex_cancel_fees",
	{
		id: primaryId(),
		/** 关联费用账单 ID */
		chargeId: uuid("charge_id").notNull(),
		/** 费用类型 */
		chargeType: varchar("charge_type", { length: 20 }),
		/** 核销金额 */
		cancelAmount: decimal("cancel_amount", { precision: 12, scale: 2 }).notNull(),
		/** 核销原因 */
		cancelReason: text("cancel_reason"),
		/** 核销日期 */
		cancelDate: date("cancel_date"),
		/** 操作人 */
		operator: varchar("operator", { length: 50 }),
		/** 审核状态 */
		auditStatus: auditStatusEnum("audit_status").default("pending"),
		/** 审核人 */
		auditor: varchar("auditor", { length: 50 }),
		/** 审核时间 */
		auditTime: timestamp("audit_time"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("ex_cancel_fees_charge_id_idx").on(table.chargeId),
		index("ex_cancel_fees_audit_status_idx").on(table.auditStatus),
	],
);

/** 逾期催缴记录表 */
export const exOverdueReminders = pgTable(
	"ex_overdue_reminders",
	{
		id: primaryId(),
		/** 关联费用账单 ID */
		chargeId: uuid("charge_id").notNull(),
		/** 费用类型 */
		chargeType: varchar("charge_type", { length: 20 }),
		/** 催缴方式 */
		reminderMethod: varchar("reminder_method", { length: 50 }),
		/** 催缴时间 */
		reminderTime: timestamp("reminder_time"),
		/** 催缴结果 */
		reminderResult: varchar("reminder_result", { length: 100 }),
		/** 催缴人 ID */
		reminderId: uuid("reminder_id"),
		/** 催缴人姓名 */
		reminderName: varchar("reminder_name", { length: 50 }),
		/** 联系方式 */
		contactPhone: varchar("contact_phone", { length: 20 }),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("ex_overdue_reminders_charge_id_idx").on(table.chargeId),
		index("ex_overdue_reminders_reminder_time_idx").on(table.reminderTime),
	],
);

/** 凭证重打记录表 */
export const exReprintVouchers = pgTable(
	"ex_reprint_vouchers",
	{
		id: primaryId(),
		/** 关联缴费记录 ID */
		paymentId: uuid("payment_id").references(() => exPayments.id),
		/** 原凭证号 */
		originalVoucherNo: varchar("original_voucher_no", { length: 100 }).notNull(),
		/** 新凭证号 */
		newVoucherNo: varchar("new_voucher_no", { length: 100 }),
		/** 重打原因 */
		reprintReason: text("reprint_reason"),
		/** 重打时间 */
		reprintTime: timestamp("reprint_time"),
		/** 操作人 */
		operator: varchar("operator", { length: 50 }),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("ex_reprint_vouchers_payment_id_idx").on(table.paymentId),
		index("ex_reprint_vouchers_original_voucher_no_idx").on(table.originalVoucherNo),
	],
);

/** 发票信息表 */
export const hpInvoices = pgTable(
	"hp_invoices",
	{
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
		paymentId: uuid("payment_id").references(() => exPayments.id),
		/** 编号 - 申请单号 */
		code: varchar("code", { length: 50 }),
		/** 业主名称 */
		ownerName: varchar("owner_name", { length: 50 }),
		/** 申请人 */
		applicant: varchar("applicant", { length: 50 }),
		/** 发票名头 */
		invoiceTitle: varchar("invoice_title", { length: 200 }),
		/** 纳税人识别号 */
		taxpayerId: varchar("taxpayer_id", { length: 50 }),
		/** 审核状态 */
		auditStatus: varchar("audit_status", { length: 20 }).default("pending"),
		/** 申请时间 */
		applicationTime: timestamp("application_time"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("hp_invoices_payment_id_idx").on(table.paymentId)],
);

/** 发票抬头表 */
export const hpInvoiceTitles = pgTable(
	"hp_invoice_titles",
	{
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
	},
	(table) => [index("hp_invoice_titles_owner_id_idx").on(table.ownerId)],
);

/** 费用汇总表 */
export const exExpenseSummaryTables = pgTable(
	"ex_expense_summary_tables",
	{
		id: primaryId(),
		/** 时间（月份） */
		time: varchar("time", { length: 20 }).notNull(),
		/** 费用项ID */
		expenseItemId: varchar("expense_item_id", { length: 50 }),
		/** 费用项名称 */
		expenseItemName: varchar("expense_item_name", { length: 100 }).notNull(),
		/** 应收金额 */
		receivableAmount: decimal("receivable_amount", { precision: 12, scale: 2 }).notNull(),
		/** 实收金额 */
		actualAmount: decimal("actual_amount", { precision: 12, scale: 2 }).notNull(),
		/** 状态 */
		status: statusEnum("status").default("enabled"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("ex_expense_summary_tables_time_idx").on(table.time),
		index("ex_expense_summary_tables_expense_item_name_idx").on(table.expenseItemName),
		index("ex_expense_summary_tables_status_idx").on(table.status),
	],
);

// ==========================================
// Part B: Zod Runtime Schemas
// ==========================================

// --- exExpenseItems ---
export const insertExExpenseItemSchema = createInsertSchema(exExpenseItems, {
	itemName: (schema) => schema.min(1, "收费项目名称不能为空").max(100),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectExExpenseItemSchema = createSelectSchema(exExpenseItems);

export const updateExExpenseItemSchema = z.object({
	id: z.string().uuid(),
	expenseType: z.string().max(50).optional(),
	itemName: z.string().min(1, "收费项目名称不能为空").max(100).optional(),
	expenseCode: z.string().max(50).optional().nullable(),
	paymentType: z.string().max(50).optional().nullable(),
	unitPrice: z.string().optional().nullable(),
	fixedFee: z.string().optional().nullable(),
	formula: z.string().optional().nullable(),
	billingCycle: z.string().max(50).optional().nullable(),
	accountDeduction: z.boolean().optional(),
	mobilePayment: z.boolean().optional(),
	roundingMode: z.enum(["round", "ceil", "floor"]).optional(),
	decimalPlaces: z.number().int().optional(),
	status: z.enum(["enabled", "disabled"]).optional(),
	remark: z.string().optional().nullable(),
});

// --- exHouseCharges ---
export const insertExHouseChargeSchema = createInsertSchema(exHouseCharges, {
	expenseItem: (schema) => schema.min(1, "费用项目不能为空").max(100),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectExHouseChargeSchema = createSelectSchema(exHouseCharges);

export const updateExHouseChargeSchema = z.object({
	id: z.string().uuid(),
	houseId: z.string().uuid().optional(),
	expenseItem: z.string().min(1, "费用项目不能为空").max(100).optional(),
	receivableAmount: z.string().optional(),
	receivedAmount: z.string().optional(),
	billingPeriod: z.string().max(50).optional().nullable(),
	status: z.enum(["unpaid", "paid", "partial", "overdue"]).optional(),
	billDate: z.string().optional().nullable(),
	dueDate: z.string().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- exVehicleCharges ---
export const insertExVehicleChargeSchema = createInsertSchema(exVehicleCharges, {
	licensePlate: (schema) => schema.min(1, "车牌号不能为空").max(20),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectExVehicleChargeSchema = createSelectSchema(exVehicleCharges);

export const updateExVehicleChargeSchema = z.object({
	id: z.string().uuid(),
	vehicleId: z.string().uuid().optional(),
	licensePlate: z.string().min(1, "车牌号不能为空").max(20).optional(),
	carportNumber: z.string().max(50).optional().nullable(),
	expenseType: z.string().max(50).optional().nullable(),
	receivableAmount: z.string().optional(),
	receivedAmount: z.string().optional(),
	billingPeriod: z.string().max(50).optional().nullable(),
	status: z.enum(["unpaid", "paid", "partial", "overdue"]).optional(),
	remark: z.string().optional().nullable(),
	ownerName: z.string().max(50).optional().nullable(),
	parkingSpaceStatus: z.string().max(50).optional().nullable(),
});

// --- exContractCharges ---
export const insertExContractChargeSchema = createInsertSchema(exContractCharges, {
	expenseItem: (schema) => schema.min(1, "费用项目不能为空").max(100),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectExContractChargeSchema = createSelectSchema(exContractCharges);

export const updateExContractChargeSchema = z.object({
	id: z.string().uuid(),
	contractId: z.string().uuid().optional(),
	contractNumber: z.string().max(50).optional().nullable(),
	expenseItem: z.string().min(1, "费用项目不能为空").max(100).optional(),
	receivableAmount: z.string().optional(),
	receivedAmount: z.string().optional(),
	chargeCycle: z.string().max(50).optional().nullable(),
	status: z.enum(["unpaid", "paid", "partial", "overdue"]).optional(),
	remark: z.string().optional().nullable(),
});

// --- exPayments ---
export const insertExPaymentSchema = createInsertSchema(exPayments).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	deletedAt: true,
});

export const selectExPaymentSchema = createSelectSchema(exPayments);

export const updateExPaymentSchema = z.object({
	id: z.string().uuid(),
	chargeId: z.string().uuid().optional(),
	chargeType: z.string().max(20).optional().nullable(),
	paymentAmount: z.string().optional(),
	paymentMethod: z.string().max(50).optional().nullable(),
	paymentTime: z.date().optional().nullable(),
	transactionNo: z.string().max(100).optional().nullable(),
	payer: z.string().max(50).optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- exPaymentReviews ---
export const insertExPaymentReviewSchema = createInsertSchema(exPaymentReviews).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectExPaymentReviewSchema = createSelectSchema(exPaymentReviews);

export const updateExPaymentReviewSchema = z.object({
	id: z.string().uuid(),
	paymentId: z.string().uuid().optional(),
	reviewer: z.string().max(50).optional().nullable(),
	reviewOpinion: z.string().optional().nullable(),
	reviewResult: z.enum(["pending", "approved", "rejected"]).optional(),
	reviewTime: z.date().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- exRefundReviews ---
export const insertExRefundReviewSchema = createInsertSchema(exRefundReviews).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectExRefundReviewSchema = createSelectSchema(exRefundReviews);

export const updateExRefundReviewSchema = z.object({
	id: z.string().uuid(),
	chargeId: z.string().uuid().optional(),
	chargeType: z.string().max(20).optional().nullable(),
	refundReason: z.string().optional().nullable(),
	refundAmount: z.string().optional(),
	applyTime: z.date().optional().nullable(),
	applicant: z.string().max(50).optional().nullable(),
	status: z.enum(["pending", "approved", "rejected", "refunded"]).optional(),
	reviewer: z.string().max(50).optional().nullable(),
	reviewTime: z.date().optional().nullable(),
	reviewOpinion: z.string().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- exDiscountTypes ---
export const insertExDiscountTypeSchema = createInsertSchema(exDiscountTypes, {
	discountName: (schema) => schema.min(1, "折扣名称不能为空").max(100),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectExDiscountTypeSchema = createSelectSchema(exDiscountTypes);

export const updateExDiscountTypeSchema = z.object({
	id: z.string().uuid(),
	discountName: z.string().min(1, "折扣名称不能为空").max(100).optional(),
	discountType: z.enum(["percentage", "fixed", "period"]).optional(),
	discountValue: z.string().optional().nullable(),
	status: z.enum(["enabled", "disabled"]).optional(),
	remark: z.string().optional().nullable(),
});

// --- exDiscountSettings ---
export const insertExDiscountSettingSchema = createInsertSchema(exDiscountSettings).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectExDiscountSettingSchema = createSelectSchema(exDiscountSettings);

export const updateExDiscountSettingSchema = z.object({
	id: z.string().uuid(),
	discountTypeId: z.string().uuid().optional().nullable(),
	applicableItem: z.string().max(100).optional().nullable(),
	discountType: z.string().max(50).optional().nullable(),
	validityStart: z.string().optional().nullable(),
	validityEnd: z.string().optional().nullable(),
	validityPeriod: z.string().max(100).optional().nullable(),
	conditions: z.string().optional().nullable(),
	status: z.enum(["enabled", "disabled"]).optional(),
	remark: z.string().optional().nullable(),
});

// --- exDiscountApplications ---
export const insertExDiscountApplicationSchema = createInsertSchema(exDiscountApplications).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectExDiscountApplicationSchema = createSelectSchema(exDiscountApplications);

export const updateExDiscountApplicationSchema = z.object({
	id: z.string().uuid(),
	discountSettingId: z.string().uuid().optional().nullable(),
	applicant: z.string().max(50).optional().nullable(),
	applicationType: z.string().max(50).optional().nullable(),
	applicationReason: z.string().optional().nullable(),
	applicationAmount: z.string().optional().nullable(),
	auditStatus: z.enum(["pending", "approved", "rejected"]).optional(),
	auditor: z.string().max(50).optional().nullable(),
	auditTime: z.date().optional().nullable(),
	auditOpinion: z.string().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- exMeterReadingTypes ---
export const insertExMeterReadingTypeSchema = createInsertSchema(exMeterReadingTypes, {
	typeName: (schema) => schema.min(1, "类型名称不能为空").max(50),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectExMeterReadingTypeSchema = createSelectSchema(exMeterReadingTypes);

export const updateExMeterReadingTypeSchema = z.object({
	id: z.string().uuid(),
	typeName: z.string().min(1, "类型名称不能为空").max(50).optional(),
	typeCode: z.string().max(50).optional().nullable(),
	unitPrice: z.string().optional().nullable(),
	billingMethod: z.string().max(50).optional().nullable(),
	status: z.enum(["enabled", "disabled"]).optional(),
	remark: z.string().optional().nullable(),
});

// --- exMeterReadings ---
export const insertExMeterReadingSchema = createInsertSchema(exMeterReadings, {
	meterNo: (schema) => schema.min(1, "表计编号不能为空").max(50),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectExMeterReadingSchema = createSelectSchema(exMeterReadings);

export const updateExMeterReadingSchema = z.object({
	id: z.string().uuid(),
	houseId: z.string().uuid().optional(),
	meterTypeId: z.string().uuid().optional().nullable(),
	meterNo: z.string().min(1, "表计编号不能为空").max(50).optional(),
	currentReading: z.string().optional().nullable(),
	previousReading: z.string().optional().nullable(),
	usage: z.string().optional().nullable(),
	readingDate: z.string().optional().nullable(),
	reader: z.string().max(50).optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- exCancelFees ---
export const insertExCancelFeeSchema = createInsertSchema(exCancelFees).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectExCancelFeeSchema = createSelectSchema(exCancelFees);

export const updateExCancelFeeSchema = z.object({
	id: z.string().uuid(),
	chargeId: z.string().uuid().optional(),
	chargeType: z.string().max(20).optional().nullable(),
	cancelAmount: z.string().optional(),
	cancelReason: z.string().optional().nullable(),
	cancelDate: z.string().optional().nullable(),
	operator: z.string().max(50).optional().nullable(),
	auditStatus: z.enum(["pending", "approved", "rejected"]).optional(),
	auditor: z.string().max(50).optional().nullable(),
	auditTime: z.date().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- exOverdueReminders ---
export const insertExOverdueReminderSchema = createInsertSchema(exOverdueReminders).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectExOverdueReminderSchema = createSelectSchema(exOverdueReminders);

export const updateExOverdueReminderSchema = z.object({
	id: z.string().uuid(),
	chargeId: z.string().uuid().optional(),
	chargeType: z.string().max(20).optional().nullable(),
	reminderMethod: z.string().max(50).optional().nullable(),
	reminderTime: z.date().optional().nullable(),
	reminderResult: z.string().max(100).optional().nullable(),
	reminderId: z.string().uuid().optional().nullable(),
	reminderName: z.string().max(50).optional().nullable(),
	contactPhone: z.string().max(20).optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- exReprintVouchers ---
export const insertExReprintVoucherSchema = createInsertSchema(exReprintVouchers, {
	originalVoucherNo: (schema) => schema.min(1, "原凭证号不能为空").max(100),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectExReprintVoucherSchema = createSelectSchema(exReprintVouchers);

export const updateExReprintVoucherSchema = z.object({
	id: z.string().uuid(),
	paymentId: z.string().uuid().optional().nullable(),
	originalVoucherNo: z.string().min(1, "原凭证号不能为空").max(100).optional(),
	newVoucherNo: z.string().max(100).optional().nullable(),
	reprintReason: z.string().optional().nullable(),
	reprintTime: z.date().optional().nullable(),
	operator: z.string().max(50).optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- hpInvoices ---
export const insertHpInvoiceSchema = createInsertSchema(hpInvoices, {
	invoiceNo: (schema) => schema.min(1, "发票号码不能为空").max(50),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectHpInvoiceSchema = createSelectSchema(hpInvoices);

export const updateHpInvoiceSchema = z.object({
	id: z.string().uuid(),
	invoiceNo: z.string().min(1, "发票号码不能为空").max(50).optional(),
	invoiceType: z.string().max(50).optional().nullable(),
	amount: z.string().optional().nullable(),
	invoiceDate: z.string().optional().nullable(),
	paymentId: z.string().uuid().optional().nullable(),
	code: z.string().max(50).optional().nullable(),
	ownerName: z.string().max(50).optional().nullable(),
	applicant: z.string().max(50).optional().nullable(),
	invoiceTitle: z.string().max(200).optional().nullable(),
	taxpayerId: z.string().max(50).optional().nullable(),
	auditStatus: z.string().max(20).optional(),
	applicationTime: z.date().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- hpInvoiceTitles ---
export const insertHpInvoiceTitleSchema = createInsertSchema(hpInvoiceTitles, {
	titleName: (schema) => schema.min(1, "抬头名称不能为空").max(200),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectHpInvoiceTitleSchema = createSelectSchema(hpInvoiceTitles);

export const updateHpInvoiceTitleSchema = z.object({
	id: z.string().uuid(),
	ownerId: z.string().uuid().optional(),
	titleName: z.string().min(1, "抬头名称不能为空").max(200).optional(),
	taxpayerNo: z.string().max(50).optional().nullable(),
	addressPhone: z.string().optional().nullable(),
	bankAccount: z.string().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- exExpenseSummaryTables ---
export const insertExExpenseSummaryTableSchema = createInsertSchema(exExpenseSummaryTables, {
	time: (schema) => schema.min(1, "时间不能为空").max(20),
	expenseItemName: (schema) => schema.min(1, "费用项名称不能为空").max(100),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectExExpenseSummaryTableSchema = createSelectSchema(exExpenseSummaryTables);

export const updateExExpenseSummaryTableSchema = z.object({
	id: z.string().uuid(),
	time: z.string().min(1).max(20).optional(),
	expenseItemId: z.string().max(50).optional().nullable(),
	expenseItemName: z.string().min(1).max(100).optional(),
	receivableAmount: z.string().optional(),
	actualAmount: z.string().optional(),
	status: z.enum(["enabled", "disabled"]).optional(),
	remark: z.string().optional().nullable(),
});

// ==========================================
// Part C: TypeScript Types
// ==========================================

export type ExExpenseItem = typeof exExpenseItems.$inferSelect;
export type NewExExpenseItem = typeof exExpenseItems.$inferInsert;
export type UpdateExExpenseItem = z.infer<typeof updateExExpenseItemSchema>;

export type ExHouseCharge = typeof exHouseCharges.$inferSelect;
export type NewExHouseCharge = typeof exHouseCharges.$inferInsert;
export type UpdateExHouseCharge = z.infer<typeof updateExHouseChargeSchema>;

export type ExVehicleCharge = typeof exVehicleCharges.$inferSelect;
export type NewExVehicleCharge = typeof exVehicleCharges.$inferInsert;
export type UpdateExVehicleCharge = z.infer<typeof updateExVehicleChargeSchema>;

export type ExContractCharge = typeof exContractCharges.$inferSelect;
export type NewExContractCharge = typeof exContractCharges.$inferInsert;
export type UpdateExContractCharge = z.infer<typeof updateExContractChargeSchema>;

export type ExPayment = typeof exPayments.$inferSelect;
export type NewExPayment = typeof exPayments.$inferInsert;
export type UpdateExPayment = z.infer<typeof updateExPaymentSchema>;

export type ExPaymentReview = typeof exPaymentReviews.$inferSelect;
export type NewExPaymentReview = typeof exPaymentReviews.$inferInsert;
export type UpdateExPaymentReview = z.infer<typeof updateExPaymentReviewSchema>;

export type ExRefundReview = typeof exRefundReviews.$inferSelect;
export type NewExRefundReview = typeof exRefundReviews.$inferInsert;
export type UpdateExRefundReview = z.infer<typeof updateExRefundReviewSchema>;

export type ExDiscountType = typeof exDiscountTypes.$inferSelect;
export type NewExDiscountType = typeof exDiscountTypes.$inferInsert;
export type UpdateExDiscountType = z.infer<typeof updateExDiscountTypeSchema>;

export type ExDiscountSetting = typeof exDiscountSettings.$inferSelect;
export type NewExDiscountSetting = typeof exDiscountSettings.$inferInsert;
export type UpdateExDiscountSetting = z.infer<typeof updateExDiscountSettingSchema>;

export type ExDiscountApplication = typeof exDiscountApplications.$inferSelect;
export type NewExDiscountApplication = typeof exDiscountApplications.$inferInsert;
export type UpdateExDiscountApplication = z.infer<typeof updateExDiscountApplicationSchema>;

export type ExMeterReadingType = typeof exMeterReadingTypes.$inferSelect;
export type NewExMeterReadingType = typeof exMeterReadingTypes.$inferInsert;
export type UpdateExMeterReadingType = z.infer<typeof updateExMeterReadingTypeSchema>;

export type ExMeterReading = typeof exMeterReadings.$inferSelect;
export type NewExMeterReading = typeof exMeterReadings.$inferInsert;
export type UpdateExMeterReading = z.infer<typeof updateExMeterReadingSchema>;

export type ExCancelFee = typeof exCancelFees.$inferSelect;
export type NewExCancelFee = typeof exCancelFees.$inferInsert;
export type UpdateExCancelFee = z.infer<typeof updateExCancelFeeSchema>;

export type ExOverdueReminder = typeof exOverdueReminders.$inferSelect;
export type NewExOverdueReminder = typeof exOverdueReminders.$inferInsert;
export type UpdateExOverdueReminder = z.infer<typeof updateExOverdueReminderSchema>;

export type ExReprintVoucher = typeof exReprintVouchers.$inferSelect;
export type NewExReprintVoucher = typeof exReprintVouchers.$inferInsert;
export type UpdateExReprintVoucher = z.infer<typeof updateExReprintVoucherSchema>;

export type HpInvoice = typeof hpInvoices.$inferSelect;
export type NewHpInvoice = typeof hpInvoices.$inferInsert;
export type UpdateHpInvoice = z.infer<typeof updateHpInvoiceSchema>;

export type HpInvoiceTitle = typeof hpInvoiceTitles.$inferSelect;
export type NewHpInvoiceTitle = typeof hpInvoiceTitles.$inferInsert;
export type UpdateHpInvoiceTitle = z.infer<typeof updateHpInvoiceTitleSchema>;

export type ExExpenseSummaryTable = typeof exExpenseSummaryTables.$inferSelect;
export type NewExExpenseSummaryTable = typeof exExpenseSummaryTables.$inferInsert;
export type UpdateExExpenseSummaryTable = z.infer<typeof updateExExpenseSummaryTableSchema>;
