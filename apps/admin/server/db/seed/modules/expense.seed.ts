import {
	exExpenseItems,
	exMeterReadingTypes,
	exHouseCharges,
	exVehicleCharges,
	exMeterReadings,
	exContractCharges,
	exPayments,
	exDiscountTypes,
	exDiscountSettings,
	exDiscountApplications,
	exPaymentReviews,
	exRefundReviews,
	exCancelFees,
	exOverdueReminders,
	exReprintVouchers,
	exExpenseSummaryTables,
} from "@01s-11comm/type";
import { defineSeed, sid, rows } from "../helpers";

export default defineSeed({
	name: "expense",
	dependencies: ["parking", "contract"],
	async seed(db) {
		await db.insert(exExpenseItems).values(
			rows([
				{
					id: sid("expense-item", "property-fee"),
					expenseType: "物业费",
					itemName: "住宅物业服务费",
					expenseCode: "FEE-001",
					unitPrice: "2.50",
					billingCycle: "monthly",
					status: "enabled",
				},
				{
					id: sid("expense-item", "water"),
					expenseType: "水费",
					itemName: "生活用水费",
					expenseCode: "FEE-002",
					unitPrice: "3.50",
					billingCycle: "monthly",
					status: "enabled",
				},
				{
					id: sid("expense-item", "electric"),
					expenseType: "电费",
					itemName: "生活用电费",
					expenseCode: "FEE-003",
					unitPrice: "0.55",
					billingCycle: "monthly",
					status: "enabled",
				},
				{
					id: sid("expense-item", "parking-fee"),
					expenseType: "停车费",
					itemName: "月租停车费",
					expenseCode: "FEE-004",
					fixedFee: "300.00",
					billingCycle: "monthly",
					status: "enabled",
				},
				{
					id: sid("expense-item", "gas"),
					expenseType: "燃气费",
					itemName: "天然气费",
					expenseCode: "FEE-005",
					unitPrice: "2.80",
					billingCycle: "monthly",
					status: "enabled",
				},
			]),
		);

		await db.insert(exMeterReadingTypes).values(
			rows([
				{ id: sid("meter-type", "electric"), typeName: "电表", typeCode: "METER-E", status: "enabled" },
				{ id: sid("meter-type", "water"), typeName: "水表", typeCode: "METER-W", status: "enabled" },
				{ id: sid("meter-type", "gas"), typeName: "燃气表", typeCode: "METER-G", status: "enabled" },
			]),
		);

		await db.insert(exHouseCharges).values(
			rows([
				{
					id: sid("house-charge", "1"),
					houseId: sid("house", "A-101"),
					expenseItem: "住宅物业服务费",
					receivableAmount: "300.00",
					billingPeriod: "2024-01",
					status: "paid",
				},
				{
					id: sid("house-charge", "2"),
					houseId: sid("house", "A-102"),
					expenseItem: "住宅物业服务费",
					receivableAmount: "212.50",
					billingPeriod: "2024-01",
					status: "unpaid",
				},
				{
					id: sid("house-charge", "3"),
					houseId: sid("house", "B-201"),
					expenseItem: "住宅物业服务费",
					receivableAmount: "275.00",
					billingPeriod: "2024-01",
					status: "unpaid",
				},
			]),
		);

		await db.insert(exVehicleCharges).values(
			rows([
				{
					id: sid("vehicle-charge", "1"),
					vehicleId: sid("vehicle", "1"),
					licensePlate: "京A12345",
					expenseType: "月租停车费",
					receivableAmount: "300.00",
					billingPeriod: "2024-01",
					status: "paid",
				},
				{
					id: sid("vehicle-charge", "2"),
					vehicleId: sid("vehicle", "2"),
					licensePlate: "京B67890",
					expenseType: "月租停车费",
					receivableAmount: "350.00",
					billingPeriod: "2024-01",
					status: "unpaid",
				},
			]),
		);

		await db.insert(exMeterReadings).values(
			rows([
				{
					id: sid("meter-reading", "1"),
					houseId: sid("house", "A-101"),
					meterTypeId: sid("meter-type", "electric"),
					meterNo: "EM-A101-001",
					currentReading: "1500",
					previousReading: "1350",
					usage: "150",
				},
				{
					id: sid("meter-reading", "2"),
					houseId: sid("house", "A-102"),
					meterTypeId: sid("meter-type", "water"),
					meterNo: "WM-A102-001",
					currentReading: "280",
					previousReading: "250",
					usage: "30",
				},
			]),
		);

		await db
			.insert(exContractCharges)
			.values(
				rows([
					{
						id: sid("contract-charge", "1"),
						contractId: sid("contract", "HT2024001"),
						contractNumber: "HT2024001",
						expenseItem: "物业服务费",
						receivableAmount: "50000.00",
						status: "unpaid",
					},
				]),
			);

		await db.insert(exPayments).values(
			rows([
				{
					id: sid("payment", "1"),
					chargeId: sid("house-charge", "1"),
					chargeType: "house",
					paymentAmount: "300.00",
					paymentMethod: "wechat",
					paymentTime: new Date("2024-01-15"),
					payer: "张三",
				},
				{
					id: sid("payment", "2"),
					chargeId: sid("vehicle-charge", "1"),
					chargeType: "vehicle",
					paymentAmount: "300.00",
					paymentMethod: "alipay",
					paymentTime: new Date("2024-01-16"),
					payer: "张三",
				},
			]),
		);

		await db.insert(exDiscountTypes).values(
			rows([
				{
					id: sid("discount-type", "property"),
					discountName: "物业费折扣",
					discountType: "percentage",
					discountValue: "0.90",
					status: "enabled",
				},
				{
					id: sid("discount-type", "parking"),
					discountName: "停车费折扣",
					discountType: "fixed",
					discountValue: "50.00",
					status: "enabled",
				},
			]),
		);

		await db
			.insert(exDiscountSettings)
			.values(
				rows([
					{
						id: sid("discount-setting", "1"),
						discountTypeId: sid("discount-type", "property"),
						applicableItem: "住宅物业服务费",
						status: "enabled",
					},
				]),
			);

		await db
			.insert(exDiscountApplications)
			.values(
				rows([
					{
						id: sid("discount-app", "1"),
						discountSettingId: sid("discount-setting", "1"),
						applicant: "张三",
						applicationReason: "困难家庭减免",
						applicationAmount: "30.00",
						auditStatus: "approved",
					},
				]),
			);

		await db
			.insert(exPaymentReviews)
			.values(
				rows([
					{
						id: sid("payment-review", "1"),
						paymentId: sid("payment", "1"),
						reviewer: "财务主管",
						reviewResult: "approved",
						reviewTime: new Date("2024-01-15"),
					},
				]),
			);

		await db
			.insert(exRefundReviews)
			.values(
				rows([
					{
						id: sid("refund-review", "1"),
						chargeId: sid("house-charge", "1"),
						chargeType: "house",
						refundReason: "重复缴费",
						refundAmount: "300.00",
						applicant: "张三",
						status: "approved",
					},
				]),
			);

		await db
			.insert(exCancelFees)
			.values(
				rows([
					{
						id: sid("cancel-fee", "1"),
						chargeId: sid("house-charge", "2"),
						chargeType: "house",
						cancelAmount: "212.50",
						cancelReason: "房屋空置减免",
						operator: "财务专员",
						auditStatus: "pending",
					},
				]),
			);

		await db
			.insert(exOverdueReminders)
			.values(
				rows([
					{
						id: sid("overdue-reminder", "1"),
						chargeId: sid("house-charge", "3"),
						chargeType: "house",
						reminderMethod: "sms",
						reminderName: "王五",
						contactPhone: "13800138003",
					},
				]),
			);

		await db
			.insert(exReprintVouchers)
			.values(
				rows([
					{
						id: sid("reprint-voucher", "1"),
						paymentId: sid("payment", "1"),
						originalVoucherNo: "V-2024-001",
						reprintReason: "票据遗失",
						operator: "前台",
					},
				]),
			);

		await db.insert(exExpenseSummaryTables).values(
			rows([
				{
					id: sid("expense-summary", "1"),
					time: "2024-01-01",
					expenseItemName: "住宅物业服务费",
					receivableAmount: "50000.00",
					actualAmount: "45000.00",
					status: "enabled",
				},
				{
					id: sid("expense-summary", "2"),
					time: "2024-02-01",
					expenseItemName: "停车费",
					receivableAmount: "30000.00",
					actualAmount: "28000.00",
					status: "enabled",
				},
			]),
		);
	},
});
