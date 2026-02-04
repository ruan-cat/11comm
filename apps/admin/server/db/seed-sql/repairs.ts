import {
	rpRepairOrders,
	rpReturnVisits,
	rpRepairSettings,
	rpRepairTypes,
	rpMandatoryReturnIssues,
	rpPhoneRepairReports,
} from "../schemas/repairs";

import { mockRepairsTodoData } from "../../api/property-manage/repairs-manage/repairs-todo/mock-data";
import { mockReturnVisitData } from "../../api/property-manage/repairs-manage/return-visit/mock-data";
import { mockMandatoryReturnIssueData } from "../../api/property-manage/repairs-manage/mandatory-return-issue/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql, statusMap, generateUuid } from "./index";
import { db } from "../index";

/**
 * 生成报修管理模块的 SQL
 */
export function generateRepairsSql(idMap: IdMapRegistry): SqlStatement[] {
	const statements: SqlStatement[] = [];

	// ==========================================
	// 1. 生成 rp_repair_orders (报修工单)
	// ==========================================
	console.log("正在生成 rp_repair_orders SQL...");
	const orderRecords = mockRepairsTodoData.map((item) => {
		const id = idMap.register("rp_repair_orders", item.workOrderNumber);
		return {
			id,
			workOrderNumber: item.workOrderNumber,
			repairType: item.repairType,
			repairSource: "owner", // Mock data missing this field
			reporterName: item.reporter,
			contactPhone: item.contactInfo,
			repairLocation: item.location,
			problemDescription: item.remark || "待处理",
			status: "pending",
			assigner: null,
			assignTime: null,
			repairPerson: null,
			createdAt: item.createTime ? new Date(item.createTime) : new Date(),
			updatedAt: new Date(),
		};
	});

	if (orderRecords.length > 0) {
		const query = db.insert(rpRepairOrders).values(orderRecords).toSQL();
		statements.push({
			table: "rp_repair_orders",
			sql: toFullSql(query.sql, query.params),
			recordCount: orderRecords.length,
		});
	}

	// Note: Skipping return visits and mandatory return issues
	// as the mock data structure doesn't match well with the schema requirements
	// These can be added later with proper mock data

	return statements;
}
