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
	const houseChargeRecords = mockHouseChargeData
		.map((item) => {
			const id = idMap.register("ex_house_charges", item.id);
			// 查找房屋ID - 使用 any 类型避免属性访问错误
			const houseId = (idMap as any).get("hp_houses", (item as any).houseCode);
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
	const vehicleChargeRecords = mockVehicleChargeData
		.map((item) => {
			const id = idMap.register("ex_vehicle_charges", item.id);
			// 查找车辆ID - 使用 any 类型避免属性访问错误
			const vehicleId = (idMap as any).get("pk_owner_vehicles", (item as any).carNumber);
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

	return statements;
}
