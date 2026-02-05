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
} from "../schemas/expense";

import { mockExpenseItemSettingData as mockExpenseItemData } from "../../api/property-manage/expense-manage/expense-item-setting/mock-data";
import { mockHouseChargeData } from "../../api/property-manage/expense-manage/house-charge/mock-data";
import { mockVehicleChargeData } from "../../api/property-manage/expense-manage/vehicle-charge/mock-data";
import { mockContracteChargeData as mockContractChargeData } from "../../api/property-manage/expense-manage/contracte-charge/mock-data";
import { mockMeterReadingTypeData } from "../../api/property-manage/expense-manage/meter-reading-type/mock-data";
import { mockWaterAndElectricityMeterReadingData as mockMeterReadingData } from "../../api/property-manage/expense-manage/water-and-electricity-meter-reading/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql, statusMap, generateUuid } from "./index";
import { db } from "../index";

/**
 * 生成费用管理模块的 SQL
 */
export function generateExpenseSql(idMap: IdMapRegistry): SqlStatement[] {
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
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (itemRecords.length > 0) {
		const query = db.insert(exExpenseItems).values(itemRecords).toSQL();
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
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: new Date(),
		};
	});

	if (meterTypeRecords.length > 0) {
		const query = db.insert(exMeterReadingTypes).values(meterTypeRecords).toSQL();
		statements.push({
			table: "ex_meter_reading_types",
			sql: toFullSql(query.sql, query.params),
			recordCount: meterTypeRecords.length,
		});
	}

	// ==========================================
	// 3. 生成 ex_meter_readings (抄表记录)
	// ==========================================
	console.log("正在生成 ex_meter_readings SQL...");
	const readingRecords = mockMeterReadingData
		.map((item) => {
			const id = idMap.register("ex_meter_readings", item.meterId + (item.currentReadingTime || ""));
			const houseId = idMap.get("hp_houses", item.objectName);
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
				createdAt: item.createTime ? new Date(item.createTime) : new Date(),
				updatedAt: new Date(),
			};
		})
		.filter(Boolean);

	if (readingRecords.length > 0) {
		const query = db.insert(exMeterReadings).values(readingRecords).toSQL();
		statements.push({
			table: "ex_meter_readings",
			sql: toFullSql(query.sql, query.params),
			recordCount: readingRecords.length,
		});
	}

	return statements;
}
