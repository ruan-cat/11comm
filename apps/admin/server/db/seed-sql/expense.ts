import {
	exExpenseItems,
	exHouseCharges,
	exVehicleCharges,
	exContractCharges,
	exPayments,
	exPaymentReviews,
	exRefundReviews,
	exDiscountTypes,
	exDiscountSettings,
	exDiscountApplications,
	exMeterReadingTypes,
	exMeterReadings,
	exCancelFees,
	exOverdueReminders,
	exReprintVouchers,
	exExpenseSummaryTables,
	type NewExPayment as InsertExPayment,
	type NewExHouseCharge as InsertExHouseCharge,
	type NewExVehicleCharge as InsertExVehicleCharge,
} from "@01s-11comm/type";

import { mockExpenseItemSettingData as mockExpenseItemData } from "../../api/property-manage/expense-manage/expense-item-setting/mock-data";
import { mockHouseChargeData } from "../../api/property-manage/expense-manage/house-charge/mock-data";
import { mockVehicleChargeData } from "../../api/property-manage/expense-manage/vehicle-charge/mock-data";
import { mockContracteChargeData as mockContractChargeData } from "../../api/property-manage/expense-manage/contracte-charge/mock-data";
import { mockMeterReadingTypeData } from "../../api/property-manage/expense-manage/meter-reading-type/mock-data";
import { mockWaterAndElectricityMeterReadingData as mockMeterReadingData } from "../../api/property-manage/expense-manage/water-and-electricity-meter-reading/mock-data";
import { mockHouseData } from "../../api/property-manage/house-property-manage/house/mock-data";
import { mockOwnerVehicleData } from "../../api/property-manage/parking-manage/owner-vehicle/mock-data";
import { mockDraftContractData } from "../../api/property-manage/contract-manage/draft-contract/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql, statusMap, generateUuid } from "./index";
import { getDb } from "../index";

/**
 * 生成费用管理模块的 SQL
 */
export async function generateExpenseSql(idMap: IdMapRegistry): Promise<SqlStatement[]> {
	const db = await getDb();
	const statements: SqlStatement[] = [];

	// ==========================================
	// 1. 生成 ex_expense_items (收费项目)
	// ==========================================
	console.log("正在生成 ex_expense_items SQL...");
	const itemRecords = mockExpenseItemData.map((item) => {
		const id = idMap.register("ex_expense_items", item.expenseItem);
		return {
			id,
			expenseType: item.feeType,
			itemName: item.expenseItem,
			paymentType: item.paymentType,
			unitPrice: item.billingUnitPrice ? String(item.billingUnitPrice) : null,
			billingCycle: item.paymentCycle,
			status: statusMap[item.status] || "enabled",
			remark: item.remark,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (itemRecords.length > 0) {
		const query = db
			.insert(exExpenseItems as any)
			.values(itemRecords)
			.toSQL();
		statements.push({
			table: "ex_expense_items",
			sql: toFullSql(query.sql, query.params),
			recordCount: itemRecords.length,
		});
	}

	// ==========================================
	// 2. 生成 ex_meter_reading_types
	// ==========================================
	console.log("正在生成 ex_meter_reading_types SQL...");
	const meterTypeRecords = mockMeterReadingTypeData.map((item) => {
		const id = idMap.register("ex_meter_reading_types", item.name);
		return {
			id,
			typeName: item.name,
			typeCode: `MT-${item.id}`,
			unitPrice: "0", // Mock data missing price
			billingMethod: "usage", // Defaulting
			status: statusMap[item.status] || "enabled",
			remark: item.remark,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: new Date(),
		};
	});

	if (meterTypeRecords.length > 0) {
		const query = db
			.insert(exMeterReadingTypes as any)
			.values(meterTypeRecords)
			.toSQL();
		statements.push({
			table: "ex_meter_reading_types",
			sql: toFullSql(query.sql, query.params),
			recordCount: meterTypeRecords.length,
		});
	}

	// ==========================================
	// 3. 生成 ex_house_charges (房屋收费)
	// ==========================================
	console.log("正在生成 ex_house_charges SQL...");
	// 使用 mockHouseData 获取正确的 houseCode
	const houseCodes = mockHouseData.slice(0, 20).map((h) => h.houseCode);
	const houseChargeRecords = mockHouseChargeData
		.map((item, index) => {
			const id = idMap.register("ex_house_charges", item.id);
			// 使用 mockHouseData 中的 houseCode
			const houseCode = houseCodes[index % houseCodes.length];
			const houseId = idMap.get("hp_houses", houseCode);
			return {
				id,
				houseId: houseId || undefined,
				expenseItemId: (idMap as any).get("ex_expense_items", (item as any).expenseType) || undefined,
				chargeAmount: (item as any).chargeAmount ? String((item as any).chargeAmount) : "0",
				receiveAmount: (item as any).receiveAmount ? String((item as any).receiveAmount) : "0",
				chargeCycle: (item as any).chargeCycle || "monthly",
				status: statusMap[item.status] || "enabled",
				remark: item.remark,
				createTime: item.createTime ? new Date(item.createTime) : new Date(),
				updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
			};
		})
		.filter((r: any) => r.houseId) as any;

	if (houseChargeRecords.length > 0) {
		const query = db
			.insert(exHouseCharges as any)
			.values(houseChargeRecords)
			.toSQL();
		statements.push({
			table: "ex_house_charges",
			sql: toFullSql(query.sql, query.params),
			recordCount: houseChargeRecords.length,
		});
		console.log(`✅ 已生成 ex_house_charges SQL，共 ${houseChargeRecords.length} 条记录`);
	}

	// ==========================================
	// 4. 生成 ex_vehicle_charges (车辆收费)
	// ==========================================
	console.log("正在生成 ex_vehicle_charges SQL...");
	// 使用 mockOwnerVehicleData 获取正确的 licensePlate
	const vehiclePlates = mockOwnerVehicleData.slice(0, 18).map((v) => v.licensePlate);
	const vehicleChargeRecords = mockVehicleChargeData
		.map((item, index) => {
			const id = idMap.register("ex_vehicle_charges", item.id);
			// 使用 mockOwnerVehicleData 中的 licensePlate
			const licensePlate = vehiclePlates[index % vehiclePlates.length];
			const vehicleId = idMap.get("pk_owner_vehicles", licensePlate);
			return {
				id,
				vehicleId: vehicleId || undefined,
				expenseItemId: (idMap as any).get("ex_expense_items", (item as any).expenseType) || undefined,
				chargeAmount: (item as any).chargeAmount ? String((item as any).chargeAmount) : "0",
				receiveAmount: (item as any).receiveAmount ? String((item as any).receiveAmount) : "0",
				chargeCycle: (item as any).chargeCycle || "monthly",
				status: statusMap[item.status] || "enabled",
				remark: item.remark,
				createTime: item.createTime ? new Date(item.createTime) : new Date(),
				updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
			};
		})
		.filter((r: any) => r.vehicleId) as any;

	if (vehicleChargeRecords.length > 0) {
		const query = db
			.insert(exVehicleCharges as any)
			.values(vehicleChargeRecords)
			.toSQL();
		statements.push({
			table: "ex_vehicle_charges",
			sql: toFullSql(query.sql, query.params),
			recordCount: vehicleChargeRecords.length,
		});
		console.log(`✅ 已生成 ex_vehicle_charges SQL，共 ${vehicleChargeRecords.length} 条记录`);
	}

	// ==========================================
	// 5. 生成 ex_meter_readings (抄表记录)
	// ==========================================
	console.log("正在生成 ex_meter_readings SQL...");
	const readingRecords = mockMeterReadingData
		.map((item) => {
			const id = idMap.register("ex_meter_readings", item.meterId + (item.currentReadingTime || ""));
			// 将 "A-1-101" 转换为 "A-101" 格式来查找房屋
			const normalizedHouseCode = item.objectName?.replace(/^([A-Z])-(\d+)-(\d+)$/, "$1-$3");
			let houseId = idMap.get("hp_houses", normalizedHouseCode);
			// 如果找不到，尝试直接匹配
			if (!houseId) {
				houseId = idMap.get("hp_houses", item.objectName);
			}
			const meterTypeId = idMap.get("ex_meter_reading_types", item.meterType);

			// If house not found, skip
			if (!houseId) return null;

			const usage = (Number(item.currentReading || 0) - Number(item.lastReading || 0)).toFixed(2);

			return {
				id,
				houseId,
				meterTypeId: meterTypeId || null,
				meterNo: item.meterId,
				currentReading: item.currentReading ? String(item.currentReading) : "0",
				previousReading: item.lastReading ? String(item.lastReading) : "0",
				usage: usage,
				readingDate: item.currentReadingTime ? new Date(item.currentReadingTime) : new Date(),
				reader: "System",
				remark: "Auto generated",
				createTime: item.createTime ? new Date(item.createTime) : new Date(),
				updateTime: new Date(),
			};
		})
		.filter(Boolean);

	if (readingRecords.length > 0) {
		const query = db
			.insert(exMeterReadings as any)
			.values(readingRecords)
			.toSQL();
		statements.push({
			table: "ex_meter_readings",
			sql: toFullSql(query.sql, query.params),
			recordCount: readingRecords.length,
		});
	}

	// ==========================================
	// 4. 生成 ex_contract_charges (合同收费)
	// ==========================================
	console.log("正在生成 ex_contract_charges SQL...");
	// 使用 mockDraftContractData 获取正确的 contractNumber
	const contractNumbers = mockDraftContractData.slice(0, 15).map((c) => c.contractNumber);
	const contractChargeRecords = mockContractChargeData
		.map((item, index) => {
			const id = idMap.register("ex_contract_charges", item.id);

			// 使用 mockDraftContractData 中的 contractNumber
			const contractNumber = contractNumbers[index % contractNumbers.length];
			const contractId = idMap.get("ct_contracts", contractNumber);

			// If still not found, we must skip this record because contractId is NOT NULL
			if (!contractId) {
				// console.warn(`⚠️ 跳过合同收费记录 ${item.contractName}: 未找到对应合同`);
				return null;
			}

			return {
				id,
				contractId,
				contractNumber: contractNumber, // Use contractNumber from mockDraftContractData
				expenseItem: item.name || "合同费用",
				receivableAmount: "0", // Mock data missing amount, default to 0
				receivedAmount: "0",
				chargeCycle: "monthly",
				status: statusMap[item.status] || "enabled", // Map 'Enable'/'Disable' to status
				remark: item.remark,
				createTime: item.createTime ? new Date(item.createTime) : new Date(),
				updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
			};
		})
		.filter(Boolean); // Filter out nulls

	if (contractChargeRecords.length > 0) {
		const query = db
			.insert(exContractCharges as any)
			.values(contractChargeRecords)
			.toSQL();
		statements.push({
			table: "ex_contract_charges",
			sql: toFullSql(query.sql, query.params),
			recordCount: contractChargeRecords.length,
		});
		console.log(`✅ 已生成 ex_contract_charges SQL，共 ${contractChargeRecords.length} 条记录`);
	}

	// ==========================================
	// 5. 生成 ex_payments (支付记录)
	// ==========================================
	console.log("正在生成 ex_payments SQL...");
	// 获取房屋和车位的账单数据来生成支付记录
	const houseChargeIds = mockHouseChargeData
		.map((item) => idMap.get("ex_house_charges", item.id))
		.filter(Boolean) as string[];
	const vehicleChargeIds = mockVehicleChargeData
		.map((item) => idMap.get("ex_vehicle_charges", item.id))
		.filter(Boolean) as string[];

	const paymentRecords: any[] = [];
	const chargeIds = [...houseChargeIds, ...vehicleChargeIds].slice(0, 20);

	chargeIds.forEach((chargeId, index) => {
		// 部分已支付，部分未支付
		if (index % 3 !== 0) {
			const paymentMethods = ["微信支付", "支付宝", "银行卡", "现金"];
			paymentRecords.push({
				id: idMap.register("ex_payments", `PAY-${index + 1}`),
				chargeId,
				chargeType: index < houseChargeIds.length ? "house" : "vehicle",
				paymentAmount: (Math.random() * 500 + 100).toFixed(2),
				paymentMethod: paymentMethods[index % paymentMethods.length],
				paymentTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
				transactionNo: `TXN${Date.now()}${index}`,
				payer: "业主",
				createTime: new Date(),
				updateTime: new Date(),
			});
		}
	});

	if (paymentRecords.length > 0) {
		const query = db
			.insert(exPayments as any)
			.values(paymentRecords)
			.toSQL();
		statements.push({
			table: "ex_payments",
			sql: toFullSql(query.sql, query.params),
			recordCount: paymentRecords.length,
		});
		console.log(`✅ 已生成 ex_payments SQL，共 ${paymentRecords.length} 条记录`);
	}

	// ==========================================
	// 6. 生成 ex_discount_types (折扣类型)
	// ==========================================
	console.log("正在生成 ex_discount_types SQL...");
	const discountTypeRecords = [
		{ name: "物业费折扣", type: "percentage", value: "10.00" },
		{ name: "停车费折扣", type: "percentage", value: "15.00" },
		{ name: "水电费折扣", type: "fixed", value: "50.00" },
		{ name: "新业主优惠", type: "percentage", value: "20.00" },
		{ name: "长期租户优惠", type: "percentage", value: "12.00" },
		{ name: "一次性减免", type: "fixed", value: "100.00" },
		{ name: "季度优惠", type: "percentage", value: "8.00" },
		{ name: "年度优惠", type: "percentage", value: "18.00" },
		{ name: "节日优惠", type: "fixed", value: "80.00" },
		{ name: "推荐优惠", type: "percentage", value: "5.00" },
	].map((item) => {
		const id = idMap.register("ex_discount_types", item.name);
		return {
			id,
			discountName: item.name,
			discountType: item.type as "percentage" | "fixed" | "period",
			discountValue: item.value,
			status: "enabled" as const,
			remark: `${item.name}说明`,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (discountTypeRecords.length > 0) {
		const query = db
			.insert(exDiscountTypes as any)
			.values(discountTypeRecords)
			.toSQL();
		statements.push({
			table: "ex_discount_types",
			sql: toFullSql(query.sql, query.params),
			recordCount: discountTypeRecords.length,
		});
		console.log(`✅ 已生成 ex_discount_types SQL，共 ${discountTypeRecords.length} 条记录`);
	}

	// ==========================================
	// 7. 生成 ex_discount_settings (折扣设置)
	// ==========================================
	console.log("正在生成 ex_discount_settings SQL...");
	const discountSettingRecords = discountTypeRecords.slice(0, 12).map((_, index) => {
		const id = idMap.register("ex_discount_settings", `SETTING-${index + 1}`);
		const discountTypeId = discountTypeRecords[index % discountTypeRecords.length].id;
		const items = ["物业费", "停车费", "水费", "电费", "燃气费"];
		const now = new Date();
		const validityStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
		const validityEnd = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

		return {
			id,
			discountTypeId,
			applicableItem: items[index % items.length],
			discountType: index % 2 === 0 ? "percentage" : "fixed",
			validityStart: validityStart.toISOString().split("T")[0],
			validityEnd: validityEnd.toISOString().split("T")[0],
			validityPeriod: "3个月",
			conditions: `适用于${items[index % items.length]}的优惠条件`,
			status: index % 5 === 0 ? ("disabled" as const) : ("enabled" as const),
			remark: `折扣设置 ${index + 1}`,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (discountSettingRecords.length > 0) {
		const query = db
			.insert(exDiscountSettings as any)
			.values(discountSettingRecords)
			.toSQL();
		statements.push({
			table: "ex_discount_settings",
			sql: toFullSql(query.sql, query.params),
			recordCount: discountSettingRecords.length,
		});
		console.log(`✅ 已生成 ex_discount_settings SQL，共 ${discountSettingRecords.length} 条记录`);
	}

	// ==========================================
	// 8. 生成 ex_discount_applications (折扣申请)
	// ==========================================
	console.log("正在生成 ex_discount_applications SQL...");
	const discountApplicationRecords = discountSettingRecords.slice(0, 15).map((_, index) => {
		const id = idMap.register("ex_discount_applications", `APP-${index + 1}`);
		const discountSettingId = discountSettingRecords[index % discountSettingRecords.length].id;
		const applicants = ["张三", "李四", "王五", "赵六", "钱七"];
		const types = ["物业费优惠", "停车费优惠", "水电费优惠"];
		const statuses: Array<"pending" | "approved" | "rejected"> = ["pending", "approved", "rejected"];
		const auditStatus = statuses[index % statuses.length];

		return {
			id,
			discountSettingId,
			applicant: applicants[index % applicants.length],
			applicationType: types[index % types.length],
			applicationReason: `申请${types[index % types.length]}的原因说明`,
			applicationAmount: (Math.random() * 200 + 50).toFixed(2),
			auditStatus,
			auditor: auditStatus !== "pending" ? "审核员" : null,
			auditTime: auditStatus !== "pending" ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) : null,
			auditOpinion: auditStatus !== "pending" ? `审核意见：${auditStatus === "approved" ? "同意" : "拒绝"}` : null,
			remark: `折扣申请 ${index + 1}`,
			createTime: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000),
			updateTime: new Date(),
		};
	});

	if (discountApplicationRecords.length > 0) {
		const query = db
			.insert(exDiscountApplications as any)
			.values(discountApplicationRecords)
			.toSQL();
		statements.push({
			table: "ex_discount_applications",
			sql: toFullSql(query.sql, query.params),
			recordCount: discountApplicationRecords.length,
		});
		console.log(`✅ 已生成 ex_discount_applications SQL，共 ${discountApplicationRecords.length} 条记录`);
	}

	// ==========================================
	// 9. 生成 ex_payment_reviews (支付审核)
	// ==========================================
	console.log("正在生成 ex_payment_reviews SQL...");
	const paymentReviewRecords = paymentRecords.slice(0, 10).map((payment, index) => {
		const id = idMap.register("ex_payment_reviews", `REVIEW-${index + 1}`);
		const reviewResults: Array<"pending" | "approved" | "rejected"> = ["pending", "approved", "rejected"];
		const reviewResult = reviewResults[index % reviewResults.length];

		return {
			id,
			paymentId: payment.id,
			reviewer: reviewResult !== "pending" ? "审核员" : null,
			reviewOpinion: reviewResult !== "pending" ? `审核意见：${reviewResult === "approved" ? "通过" : "不通过"}` : null,
			reviewResult,
			reviewTime: reviewResult !== "pending" ? new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000) : null,
			remark: `支付审核 ${index + 1}`,
			createTime: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
			updateTime: new Date(),
		};
	});

	if (paymentReviewRecords.length > 0) {
		const query = db
			.insert(exPaymentReviews as any)
			.values(paymentReviewRecords)
			.toSQL();
		statements.push({
			table: "ex_payment_reviews",
			sql: toFullSql(query.sql, query.params),
			recordCount: paymentReviewRecords.length,
		});
		console.log(`✅ 已生成 ex_payment_reviews SQL，共 ${paymentReviewRecords.length} 条记录`);
	}

	// ==========================================
	// 10. 生成 ex_refund_reviews (退款审核)
	// ==========================================
	console.log("正在生成 ex_refund_reviews SQL...");
	const refundReviewRecords = chargeIds.slice(0, 12).map((chargeId, index) => {
		const id = idMap.register("ex_refund_reviews", `REFUND-${index + 1}`);
		const statuses: Array<"pending" | "approved" | "rejected" | "refunded"> = [
			"pending",
			"approved",
			"rejected",
			"refunded",
		];
		const status = statuses[index % statuses.length];
		const applicants = ["张三", "李四", "王五", "赵六"];

		return {
			id,
			chargeId,
			chargeType: index < houseChargeIds.length ? "house" : "vehicle",
			refundReason: `退款原因说明 ${index + 1}`,
			refundAmount: (Math.random() * 300 + 100).toFixed(2),
			applyTime: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
			applicant: applicants[index % applicants.length],
			status,
			reviewer: status !== "pending" ? "审核员" : null,
			reviewTime: status !== "pending" ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
			reviewOpinion: status !== "pending" ? `审核意见：${status}` : null,
			remark: `退款审核 ${index + 1}`,
			createTime: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000),
			updateTime: new Date(),
		};
	});

	if (refundReviewRecords.length > 0) {
		const query = db
			.insert(exRefundReviews as any)
			.values(refundReviewRecords)
			.toSQL();
		statements.push({
			table: "ex_refund_reviews",
			sql: toFullSql(query.sql, query.params),
			recordCount: refundReviewRecords.length,
		});
		console.log(`✅ 已生成 ex_refund_reviews SQL，共 ${refundReviewRecords.length} 条记录`);
	}

	// ==========================================
	// 11. 生成 ex_cancel_fees (取消费用)
	// ==========================================
	console.log("正在生成 ex_cancel_fees SQL...");
	const cancelFeeRecords = chargeIds.slice(0, 10).map((chargeId, index) => {
		const id = idMap.register("ex_cancel_fees", `CANCEL-${index + 1}`);
		const auditStatuses: Array<"pending" | "approved" | "rejected"> = ["pending", "approved", "rejected"];
		const auditStatus = auditStatuses[index % auditStatuses.length];
		const operators = ["操作员A", "操作员B", "操作员C"];

		return {
			id,
			chargeId,
			chargeType: index < houseChargeIds.length ? "house" : "vehicle",
			cancelAmount: (Math.random() * 200 + 50).toFixed(2),
			cancelReason: `核销原因说明 ${index + 1}`,
			cancelDate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
			operator: operators[index % operators.length],
			auditStatus,
			auditor: auditStatus !== "pending" ? "审核员" : null,
			auditTime: auditStatus !== "pending" ? new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000) : null,
			remark: `费用核销 ${index + 1}`,
			createTime: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
			updateTime: new Date(),
		};
	});

	if (cancelFeeRecords.length > 0) {
		const query = db
			.insert(exCancelFees as any)
			.values(cancelFeeRecords)
			.toSQL();
		statements.push({
			table: "ex_cancel_fees",
			sql: toFullSql(query.sql, query.params),
			recordCount: cancelFeeRecords.length,
		});
		console.log(`✅ 已生成 ex_cancel_fees SQL，共 ${cancelFeeRecords.length} 条记录`);
	}

	// ==========================================
	// 12. 生成 ex_overdue_reminders (逾期提醒)
	// ==========================================
	console.log("正在生成 ex_overdue_reminders SQL...");
	const overdueReminderRecords = chargeIds.slice(0, 15).map((chargeId, index) => {
		const id = idMap.register("ex_overdue_reminders", `REMINDER-${index + 1}`);
		const methods = ["短信", "电话", "邮件", "上门"];
		const results = ["已联系", "未接通", "已承诺缴费", "拒绝缴费"];
		const reminderNames = ["催缴员A", "催缴员B", "催缴员C"];

		return {
			id,
			chargeId,
			chargeType: index < houseChargeIds.length ? "house" : "vehicle",
			reminderMethod: methods[index % methods.length],
			reminderTime: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
			reminderResult: results[index % results.length],
			reminderId: generateUuid("ex_overdue_reminders", `REMINDER-USER-${index + 1}`),
			reminderName: reminderNames[index % reminderNames.length],
			contactPhone: `138${Math.floor(Math.random() * 100000000)
				.toString()
				.padStart(8, "0")}`,
			remark: `逾期催缴 ${index + 1}`,
			createTime: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
			updateTime: new Date(),
		};
	});

	if (overdueReminderRecords.length > 0) {
		const query = db
			.insert(exOverdueReminders as any)
			.values(overdueReminderRecords)
			.toSQL();
		statements.push({
			table: "ex_overdue_reminders",
			sql: toFullSql(query.sql, query.params),
			recordCount: overdueReminderRecords.length,
		});
		console.log(`✅ 已生成 ex_overdue_reminders SQL，共 ${overdueReminderRecords.length} 条记录`);
	}

	// ==========================================
	// 13. 生成 ex_reprint_vouchers (重打凭证)
	// ==========================================
	console.log("正在生成 ex_reprint_vouchers SQL...");
	const reprintVoucherRecords = paymentRecords.slice(0, 8).map((payment, index) => {
		const id = idMap.register("ex_reprint_vouchers", `REPRINT-${index + 1}`);
		const operators = ["操作员A", "操作员B", "操作员C"];

		return {
			id,
			paymentId: payment.id,
			originalVoucherNo: `VO${Date.now() - index * 1000}`,
			newVoucherNo: `VO${Date.now() + index * 1000}`,
			reprintReason: `重打原因说明 ${index + 1}`,
			reprintTime: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
			operator: operators[index % operators.length],
			remark: `凭证重打 ${index + 1}`,
			createTime: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
			updateTime: new Date(),
		};
	});

	if (reprintVoucherRecords.length > 0) {
		const query = db
			.insert(exReprintVouchers as any)
			.values(reprintVoucherRecords)
			.toSQL();
		statements.push({
			table: "ex_reprint_vouchers",
			sql: toFullSql(query.sql, query.params),
			recordCount: reprintVoucherRecords.length,
		});
		console.log(`✅ 已生成 ex_reprint_vouchers SQL，共 ${reprintVoucherRecords.length} 条记录`);
	}

	// ==========================================
	// 14. 生成 ex_expense_summary_tables (费用汇总表)
	// ==========================================
	console.log("正在生成 ex_expense_summary_tables SQL...");
	const expenseSummaryRecords = itemRecords.slice(0, 12).map((item, index) => {
		const id = idMap.register("ex_expense_summary_tables", `SUMMARY-${index + 1}`);
		const now = new Date();
		const month = now.getMonth() - (index % 6);
		const year = now.getFullYear() - Math.floor(index / 12);
		const time = `${year}-${String(month + 1).padStart(2, "0")}`;

		return {
			id,
			time,
			expenseItemId: item.id,
			expenseItemName: item.itemName,
			receivableAmount: (Math.random() * 50000 + 10000).toFixed(2),
			actualAmount: (Math.random() * 45000 + 8000).toFixed(2),
			status: index % 4 === 0 ? ("disabled" as const) : ("enabled" as const),
			remark: `${time} ${item.itemName}汇总`,
			createTime: new Date(year, month, 1),
			updateTime: new Date(),
		};
	});

	if (expenseSummaryRecords.length > 0) {
		const query = db
			.insert(exExpenseSummaryTables as any)
			.values(expenseSummaryRecords)
			.toSQL();
		statements.push({
			table: "ex_expense_summary_tables",
			sql: toFullSql(query.sql, query.params),
			recordCount: expenseSummaryRecords.length,
		});
		console.log(`✅ 已生成 ex_expense_summary_tables SQL，共 ${expenseSummaryRecords.length} 条记录`);
	}

	return statements;
}
