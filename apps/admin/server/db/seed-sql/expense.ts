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
} from "@01s-11comm/type";

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
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
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
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: new Date(),
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
				createTime: item.createTime ? new Date(item.createTime) : new Date(),
				updateTime: new Date(),
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

	// ==========================================
	// 4. 生成 ex_contract_charges (合同收费)
	// ==========================================
	console.log("正在生成 ex_contract_charges SQL...");
	const contractChargeRecords = mockContractChargeData
		.map((item) => {
			const id = idMap.register("ex_contract_charges", item.id);

			// Try to find contract by exact name match first
			let contractId = idMap.get("ct_contracts", item.contractName);

			// Fallback: Try matching by partial name or "name" field if exact match fails
			if (!contractId && item.name) {
				contractId = idMap.get("ct_contracts", item.name);
			}

			// If still not found, we must skip this record because contractId is NOT NULL
			if (!contractId) {
				// console.warn(`⚠️ 跳过合同收费记录 ${item.contractName}: 未找到对应合同`);
				return null;
			}

			return {
				id,
				contractId,
				contractNumber: null, // Optional, can be updated if contract is found
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
		const query = db.insert(exContractCharges).values(contractChargeRecords).toSQL();
		statements.push({
			table: "ex_contract_charges",
			sql: toFullSql(query.sql, query.params),
			recordCount: contractChargeRecords.length,
		});
		console.log(`✅ 已生成 ex_contract_charges SQL，共 ${contractChargeRecords.length} 条记录`);
	}

	return statements;
}
