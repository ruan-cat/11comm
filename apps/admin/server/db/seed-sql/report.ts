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
} from "@01s-11comm/type";

import { mockExpenseSummaryTableData } from "../../api/property-manage/report-manage/expense-summary-table/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql, generateUuid } from "./index";
import { getDb } from "../index";

/**
 * 生成报表管理模块的 SQL
 */
export async function generateReportSql(idMap: IdMapRegistry): Promise<SqlStatement[]> {
	const db = await getDb();
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
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (expenseRecords.length > 0) {
		const query = db
			.insert(rptExpenseSummaries as any)
			.values(expenseRecords)
			.toSQL();
		statements.push({
			table: "rpt_expense_summaries",
			sql: toFullSql(query.sql, query.params),
			recordCount: expenseRecords.length,
		});
	}

	// ==========================================
	// 2. 生成 rpt_deposit_reports (押金报表)
	// ==========================================
	console.log("正在生成 rpt_deposit_reports SQL...");
	const depositTypes = ["装修押金", "车位押金", "钥匙押金", "门禁卡押金", "设备押金"];
	const depositRecords = Array.from({ length: 15 }, (_, idx) => {
		const id = idMap.register("rpt_deposit_reports", `DEP-RPT-${idx}`);
		const collectedTotal = (Math.random() * 500000 + 100000).toFixed(2);
		const returnedTotal = (Number(collectedTotal) * (Math.random() * 0.4 + 0.1)).toFixed(2);
		const holdingTotal = (Number(collectedTotal) - Number(returnedTotal)).toFixed(2);

		const periodStart = new Date(2024, Math.floor(Math.random() * 12), 1);
		const periodEnd = new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, 0);

		return {
			id,
			depositType: depositTypes[idx % depositTypes.length],
			collectedTotal,
			returnedTotal,
			holdingTotal,
			periodStart: periodStart.toISOString().split("T")[0],
			periodEnd: periodEnd.toISOString().split("T")[0],
			remark: `${depositTypes[idx % depositTypes.length]}统计报表`,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (depositRecords.length > 0) {
		const query = db
			.insert(rptDepositReports as any)
			.values(depositRecords)
			.toSQL();
		statements.push({
			table: "rpt_deposit_reports",
			sql: toFullSql(query.sql, query.params),
			recordCount: depositRecords.length,
		});
		console.log(`✅ 已生成 rpt_deposit_reports SQL，共 ${depositRecords.length} 条记录`);
	}

	// ==========================================
	// 3. 生成 rpt_payment_details (缴费明细)
	// ==========================================
	console.log("正在生成 rpt_payment_details SQL...");
	const ownerNames = ["张三", "李四", "王五", "赵六", "钱七", "孙八", "周九", "吴十", "郑十一", "陈十二"];
	const expenseItems = ["物业费", "水费", "电费", "燃气费", "停车费", "维修基金", "垃圾清运费"];
	const paymentMethods = ["现金", "微信", "支付宝", "银行转账", "POS机刷卡"];
	const collectors = ["收费员A", "收费员B", "收费员C", "收费员D"];

	const paymentDetailRecords = Array.from({ length: 50 }, (_, idx) => {
		const id = idMap.register("rpt_payment_details", `PAY-DTL-${idx}`);
		const buildingNum = Math.floor(Math.random() * 10) + 1;
		const unitNum = Math.floor(Math.random() * 6) + 1;
		const roomNum = Math.floor(Math.random() * 20) + 1;

		return {
			id,
			ownerName: ownerNames[idx % ownerNames.length],
			houseNumber: `${buildingNum}栋${unitNum}单元${roomNum}号`,
			expenseItem: expenseItems[idx % expenseItems.length],
			paymentAmount: (Math.random() * 5000 + 100).toFixed(2),
			paymentTime: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
			paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
			transactionNo: `TXN${Date.now()}${idx}`,
			collector: collectors[Math.floor(Math.random() * collectors.length)],
			remark: idx % 5 === 0 ? "补缴往期费用" : null,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (paymentDetailRecords.length > 0) {
		const query = db
			.insert(rptPaymentDetails as any)
			.values(paymentDetailRecords)
			.toSQL();
		statements.push({
			table: "rpt_payment_details",
			sql: toFullSql(query.sql, query.params),
			recordCount: paymentDetailRecords.length,
		});
		console.log(`✅ 已生成 rpt_payment_details SQL，共 ${paymentDetailRecords.length} 条记录`);
	}

	// ==========================================
	// 4. 生成 rpt_owner_payment_details (业主缴费明细)
	// ==========================================
	console.log("正在生成 rpt_owner_payment_details SQL...");
	const ownerIds = Array.from({ length: 20 }, (_, i) => idMap.get("hp_owners", `OWNER-${i + 1}`)).filter(Boolean);

	const ownerPaymentRecords = ownerIds.slice(0, 15).map((ownerId, idx) => {
		const id = idMap.register("rpt_owner_payment_details", `OWN-PAY-${idx}`);
		const totalReceivable = (Math.random() * 50000 + 10000).toFixed(2);
		const totalPaid = (Number(totalReceivable) * (Math.random() * 0.5 + 0.4)).toFixed(2);
		const totalOutstanding = (Number(totalReceivable) - Number(totalPaid)).toFixed(2);

		return {
			id,
			ownerId,
			ownerName: ownerNames[idx % ownerNames.length],
			totalReceivable,
			totalPaid,
			totalOutstanding,
			remark: Number(totalOutstanding) > 5000 ? "欠费较多，需重点催缴" : null,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (ownerPaymentRecords.length > 0) {
		const query = db
			.insert(rptOwnerPaymentDetails as any)
			.values(ownerPaymentRecords)
			.toSQL();
		statements.push({
			table: "rpt_owner_payment_details",
			sql: toFullSql(query.sql, query.params),
			recordCount: ownerPaymentRecords.length,
		});
		console.log(`✅ 已生成 rpt_owner_payment_details SQL，共 ${ownerPaymentRecords.length} 条记录`);
	}

	// ==========================================
	// 5. 生成 rpt_fee_reminders (费用提醒)
	// ==========================================
	console.log("正在生成 rpt_fee_reminders SQL...");
	const reminderMethods = ["短信", "电话", "微信", "上门", "邮件"];

	const feeReminderRecords = Array.from({ length: 30 }, (_, idx) => {
		const id = idMap.register("rpt_fee_reminders", `FEE-RMD-${idx}`);
		const ownerName = ownerNames[idx % ownerNames.length];
		const buildingNum = Math.floor(Math.random() * 10) + 1;
		const unitNum = Math.floor(Math.random() * 6) + 1;
		const roomNum = Math.floor(Math.random() * 20) + 1;

		return {
			id,
			ownerInfo: `${ownerName} - ${buildingNum}栋${unitNum}单元${roomNum}号`,
			outstandingAmount: (Math.random() * 10000 + 500).toFixed(2),
			reminderMethod: reminderMethods[Math.floor(Math.random() * reminderMethods.length)],
			reminderTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
			isDelivered: Math.random() > 0.2,
			ownerFeedback: idx % 3 === 0 ? "已承诺本周内缴纳" : idx % 3 === 1 ? "暂时无法缴纳" : null,
			remark: null,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (feeReminderRecords.length > 0) {
		const query = db
			.insert(rptFeeReminders as any)
			.values(feeReminderRecords)
			.toSQL();
		statements.push({
			table: "rpt_fee_reminders",
			sql: toFullSql(query.sql, query.params),
			recordCount: feeReminderRecords.length,
		});
		console.log(`✅ 已生成 rpt_fee_reminders SQL，共 ${feeReminderRecords.length} 条记录`);
	}

	// ==========================================
	// 6. 生成 rpt_no_charge_houses (未收费房屋)
	// ==========================================
	console.log("正在生成 rpt_no_charge_houses SQL...");
	const noChargeReasons = ["空置", "装修中", "业主拒缴", "产权纠纷", "长期出差", "房屋待售"];

	const noChargeHouseRecords = Array.from({ length: 20 }, (_, idx) => {
		const id = idMap.register("rpt_no_charge_houses", `NO-CHG-${idx}`);
		const buildingNum = Math.floor(Math.random() * 10) + 1;
		const unitNum = Math.floor(Math.random() * 6) + 1;
		const roomNum = Math.floor(Math.random() * 20) + 1;

		return {
			id,
			houseNumber: `${buildingNum}栋${unitNum}单元${roomNum}号`,
			ownerInfo: `${ownerNames[idx % ownerNames.length]} - 138${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
			noChargeReason: noChargeReasons[Math.floor(Math.random() * noChargeReasons.length)],
			lastChargeDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
			remark: idx % 4 === 0 ? "需要跟进处理" : null,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (noChargeHouseRecords.length > 0) {
		const query = db
			.insert(rptNoChargeHouses as any)
			.values(noChargeHouseRecords)
			.toSQL();
		statements.push({
			table: "rpt_no_charge_houses",
			sql: toFullSql(query.sql, query.params),
			recordCount: noChargeHouseRecords.length,
		});
		console.log(`✅ 已生成 rpt_no_charge_houses SQL，共 ${noChargeHouseRecords.length} 条记录`);
	}

	// ==========================================
	// 7. 生成 rpt_outstanding_fees (欠费分析)
	// ==========================================
	console.log("正在生成 rpt_outstanding_fees SQL...");
	const agingBuckets = ["1-30天", "31-60天", "61-90天", "91-180天", "180天以上"];
	const communities = ["阳光花园", "碧水蓝天", "绿城小区"];
	const buildings = ["1栋", "2栋", "3栋", "4栋", "5栋"];

	const outstandingFeeRecords = Array.from({ length: 25 }, (_, idx) => {
		const id = idMap.register("rpt_outstanding_fees", `OUT-FEE-${idx}`);

		return {
			id,
			agingBucket: agingBuckets[idx % agingBuckets.length],
			outstandingAmount: (Math.random() * 100000 + 10000).toFixed(2),
			householdCount: Math.floor(Math.random() * 50) + 5,
			community: communities[Math.floor(Math.random() * communities.length)],
			building: buildings[Math.floor(Math.random() * buildings.length)],
			expenseItem: expenseItems[Math.floor(Math.random() * expenseItems.length)],
			remark: idx % 5 === 0 ? "重点关注区域" : null,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (outstandingFeeRecords.length > 0) {
		const query = db
			.insert(rptOutstandingFees as any)
			.values(outstandingFeeRecords)
			.toSQL();
		statements.push({
			table: "rpt_outstanding_fees",
			sql: toFullSql(query.sql, query.params),
			recordCount: outstandingFeeRecords.length,
		});
		console.log(`✅ 已生成 rpt_outstanding_fees SQL，共 ${outstandingFeeRecords.length} 条记录`);
	}

	// ==========================================
	// 8. 生成 rpt_patrol_reports (巡更报表)
	// ==========================================
	console.log("正在生成 rpt_patrol_reports SQL...");
	const periods = ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06"];
	const dimensions = ["按月统计", "按周统计", "按日统计", "按班次统计"];

	const patrolReportRecords = Array.from({ length: 18 }, (_, idx) => {
		const id = idMap.register("rpt_patrol_reports", `PAT-RPT-${idx}`);
		const plannedTasks = Math.floor(Math.random() * 100) + 50;
		const completedTasks = Math.floor(plannedTasks * (Math.random() * 0.3 + 0.6));
		const abnormalTasks = Math.floor(completedTasks * (Math.random() * 0.2));
		const onTimeCompletionRate = ((completedTasks / plannedTasks) * 100).toFixed(2);

		return {
			id,
			plannedTasks,
			completedTasks,
			abnormalTasks,
			onTimeCompletionRate,
			period: periods[idx % periods.length],
			dimension: dimensions[Math.floor(Math.random() * dimensions.length)],
			remark: Number(onTimeCompletionRate) < 80 ? "完成率偏低，需改进" : null,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (patrolReportRecords.length > 0) {
		const query = db
			.insert(rptPatrolReports as any)
			.values(patrolReportRecords)
			.toSQL();
		statements.push({
			table: "rpt_patrol_reports",
			sql: toFullSql(query.sql, query.params),
			recordCount: patrolReportRecords.length,
		});
		console.log(`✅ 已生成 rpt_patrol_reports SQL，共 ${patrolReportRecords.length} 条记录`);
	}

	// ==========================================
	// 9. 生成 rpt_repair_reports (维修报表)
	// ==========================================
	console.log("正在生成 rpt_repair_reports SQL...");
	const repairReportRecords = Array.from({ length: 12 }, (_, idx) => {
		const id = idMap.register("rpt_repair_reports", `REP-RPT-${idx}`);
		const totalRepairs = Math.floor(Math.random() * 200) + 50;
		const completedCount = Math.floor(totalRepairs * (Math.random() * 0.3 + 0.6));
		const pendingCount = totalRepairs - completedCount;
		const avgProcessingTime = (Math.random() * 48 + 2).toFixed(2);
		const satisfactionRate = (Math.random() * 20 + 75).toFixed(2);

		const dissatisfactionReasons = {
			处理速度慢: Math.floor(Math.random() * 10),
			维修质量差: Math.floor(Math.random() * 8),
			服务态度差: Math.floor(Math.random() * 5),
			费用过高: Math.floor(Math.random() * 6),
			其他: Math.floor(Math.random() * 4),
		};

		return {
			id,
			totalRepairs,
			completedCount,
			pendingCount,
			avgProcessingTime,
			satisfactionRate,
			dissatisfactionReasons,
			remark: Number(satisfactionRate) < 80 ? "满意度偏低，需改进服务" : null,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (repairReportRecords.length > 0) {
		const query = db
			.insert(rptRepairReports as any)
			.values(repairReportRecords)
			.toSQL();
		statements.push({
			table: "rpt_repair_reports",
			sql: toFullSql(query.sql, query.params),
			recordCount: repairReportRecords.length,
		});
		console.log(`✅ 已生成 rpt_repair_reports SQL，共 ${repairReportRecords.length} 条记录`);
	}

	// ==========================================
	// 10. 生成 rpt_repair_summaries (维修汇总)
	// ==========================================
	console.log("正在生成 rpt_repair_summaries SQL...");
	const repairSummaryRecords = Array.from({ length: 10 }, (_, idx) => {
		const id = idMap.register("rpt_repair_summaries", `REP-SUM-${idx}`);

		const repairTypeDistribution = {
			水电维修: Math.floor(Math.random() * 50) + 20,
			门窗维修: Math.floor(Math.random() * 30) + 10,
			墙面维修: Math.floor(Math.random() * 25) + 8,
			管道疏通: Math.floor(Math.random() * 20) + 5,
			电器维修: Math.floor(Math.random() * 15) + 5,
			其他: Math.floor(Math.random() * 10) + 3,
		};

		const workerWorkload = {
			维修工A: Math.floor(Math.random() * 80) + 30,
			维修工B: Math.floor(Math.random() * 70) + 25,
			维修工C: Math.floor(Math.random() * 60) + 20,
			维修工D: Math.floor(Math.random() * 50) + 15,
		};

		const repairCostStatistics = {
			材料费: (Math.random() * 50000 + 10000).toFixed(2),
			人工费: (Math.random() * 30000 + 8000).toFixed(2),
			设备费: (Math.random() * 20000 + 5000).toFixed(2),
			其他费用: (Math.random() * 10000 + 2000).toFixed(2),
		};

		return {
			id,
			repairTypeDistribution,
			workerWorkload,
			repairCostStatistics,
			remark: null,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (repairSummaryRecords.length > 0) {
		const query = db
			.insert(rptRepairSummaries as any)
			.values(repairSummaryRecords)
			.toSQL();
		statements.push({
			table: "rpt_repair_summaries",
			sql: toFullSql(query.sql, query.params),
			recordCount: repairSummaryRecords.length,
		});
		console.log(`✅ 已生成 rpt_repair_summaries SQL，共 ${repairSummaryRecords.length} 条记录`);
	}

	// ==========================================
	// 11. 生成 rpt_statement_expenses (报表费用)
	// ==========================================
	console.log("正在生成 rpt_statement_expenses SQL...");
	const reportTypes = ["月度报表", "季度报表", "年度报表", "专项报表"];
	const reportPeriods = ["2024-01", "2024-02", "2024-03", "2024-Q1", "2024-Q2", "2024年度"];

	const statementExpenseRecords = Array.from({ length: 15 }, (_, idx) => {
		const id = idMap.register("rpt_statement_expenses", `STMT-EXP-${idx}`);

		const dataSnapshot = {
			reportTitle: `${reportTypes[idx % reportTypes.length]} - ${reportPeriods[idx % reportPeriods.length]}`,
			totalRevenue: (Math.random() * 1000000 + 500000).toFixed(2),
			totalExpense: (Math.random() * 800000 + 300000).toFixed(2),
			netProfit: (Math.random() * 200000 + 50000).toFixed(2),
			categories: {
				物业费收入: (Math.random() * 500000 + 200000).toFixed(2),
				停车费收入: (Math.random() * 200000 + 50000).toFixed(2),
				其他收入: (Math.random() * 100000 + 20000).toFixed(2),
			},
			expenses: {
				人工成本: (Math.random() * 400000 + 150000).toFixed(2),
				维修费用: (Math.random() * 200000 + 50000).toFixed(2),
				能源费用: (Math.random() * 150000 + 40000).toFixed(2),
				其他费用: (Math.random() * 100000 + 30000).toFixed(2),
			},
		};

		return {
			id,
			reportType: reportTypes[idx % reportTypes.length],
			reportPeriod: reportPeriods[idx % reportPeriods.length],
			dataSnapshot,
			remark: null,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (statementExpenseRecords.length > 0) {
		const query = db
			.insert(rptStatementExpenses as any)
			.values(statementExpenseRecords)
			.toSQL();
		statements.push({
			table: "rpt_statement_expenses",
			sql: toFullSql(query.sql, query.params),
			recordCount: statementExpenseRecords.length,
		});
		console.log(`✅ 已生成 rpt_statement_expenses SQL，共 ${statementExpenseRecords.length} 条记录`);
	}

	// ==========================================
	// 12. 生成 rpt_data_statistics (数据统计)
	// ==========================================
	console.log("正在生成 rpt_data_statistics SQL...");
	const statisticIndicators = [
		"入住率",
		"收缴率",
		"投诉处理率",
		"维修及时率",
		"业主满意度",
		"空置率",
		"欠费率",
		"巡检完成率",
		"设备完好率",
		"绿化覆盖率",
	];

	const dataStatisticRecords = Array.from({ length: 30 }, (_, idx) => {
		const id = idMap.register("rpt_data_statistics", `DATA-STAT-${idx}`);
		const indicator = statisticIndicators[idx % statisticIndicators.length];
		const statisticValue = (Math.random() * 30 + 70).toFixed(4);
		const comparisonBaseline = (Number(statisticValue) - (Math.random() * 10 - 5)).toFixed(4);

		return {
			id,
			statisticIndicator: indicator,
			statisticValue,
			statisticTime: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
			comparisonBaseline,
			remark: Number(statisticValue) < Number(comparisonBaseline) ? "指标下降，需关注" : "指标正常",
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (dataStatisticRecords.length > 0) {
		const query = db
			.insert(rptDataStatistics as any)
			.values(dataStatisticRecords)
			.toSQL();
		statements.push({
			table: "rpt_data_statistics",
			sql: toFullSql(query.sql, query.params),
			recordCount: dataStatisticRecords.length,
		});
		console.log(`✅ 已生成 rpt_data_statistics SQL，共 ${dataStatisticRecords.length} 条记录`);
	}

	return statements;
}
