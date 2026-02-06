import {
	rptExpenseSummaries,
	rptDepositReports,
	rptPaymentDetails,
	rptOwnerPaymentDetails,
	rptFeeReminders,
	rptNoChargeHouses,
	rptOutstandingFees,
	rptPatrolReports,
	rptRepairReports,
	rptRepairSummaries,
	rptStatementExpenses,
	rptDataStatistics,
} from "../schemas/report";

import { mockExpenseSummaryTableData } from "../../api/property-manage/report-manage/expense-summary-table/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql, generateUuid } from "./index";
import { db } from "../index";

/**
 * 生成报表管理模块的 SQL
 */
export function generateReportSql(idMap: IdMapRegistry): SqlStatement[] {
	const statements: SqlStatement[] = [];
	const defaultCommunityId = idMap.get("cm_communities", "COMM001") || generateUuid("cm_communities", "COMM001");

	// ==========================================
	// 1. 生成 rpt_expense_summaries
	// ==========================================
	console.log("正在生成 rpt_expense_summaries SQL...");
	const expenseRecords = mockExpenseSummaryTableData.map((item, idx) => {
		const id = idMap.register("rpt_expense_summaries", `EXP-SUM-${idx}`);

		// Fix date format: YYYY-MM -> YYYY-MM-01, YYYY年QX -> YYYY-MM-01
		let dateStr = item.time;
		if (/^\d{4}-\d{2}$/.test(dateStr)) {
			dateStr = `${dateStr}-01`;
		} else if (dateStr.includes("Q1")) {
			dateStr = dateStr.replace("年Q1", "-01-01");
		} else if (dateStr.includes("Q2")) {
			dateStr = dateStr.replace("年Q2", "-04-01");
		} else if (dateStr.includes("Q3")) {
			dateStr = dateStr.replace("年Q3", "-07-01");
		} else if (dateStr.includes("Q4")) {
			dateStr = dateStr.replace("年Q4", "-10-01");
		}

		return {
			id,
			communityId: defaultCommunityId,
			periodStart: dateStr,
			periodEnd: dateStr, // Using start date as end date for simplicity in seed
			receivableTotal: item.receivableAmount,
			receivedTotal: item.actualAmount,
			outstandingTotal: String(Number(item.receivableAmount) - Number(item.actualAmount)),
			expenseItem: item.expenseItemName,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	});

	if (expenseRecords.length > 0) {
		const query = db.insert(rptExpenseSummaries).values(expenseRecords).toSQL();
		statements.push({
			table: "rpt_expense_summaries",
			sql: toFullSql(query.sql, query.params),
			recordCount: expenseRecords.length,
		});
	}

	// Note: Skipping other report types for now due to mock data structure mismatches
	// These can be added later with proper mock data

	return statements;
}
