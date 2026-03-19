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
import { defineSeed, sid, rows } from "../helpers";

export default defineSeed({
	name: "report",
	dependencies: ["expense"],
	async seed(db) {
		await db.insert(rptExpenseSummaries).values(
			rows([
				{
					id: sid("rpt-expense", "1"),
					communityId: sid("community", "sunshine"),
					periodStart: "2024-01-01",
					periodEnd: "2024-01-31",
					expenseType: "物业费",
					receivableTotal: "50000.00",
					receivedTotal: "45000.00",
					outstandingTotal: "5000.00",
				},
				{
					id: sid("rpt-expense", "2"),
					communityId: sid("community", "sunshine"),
					periodStart: "2024-02-01",
					periodEnd: "2024-02-29",
					expenseType: "停车费",
					receivableTotal: "30000.00",
					receivedTotal: "28000.00",
					outstandingTotal: "2000.00",
				},
			]),
		);

		await db.insert(rptDepositReports).values(
			rows([
				{
					id: sid("rpt-deposit", "1"),
					depositType: "装修保证金",
					collectedTotal: "100000.00",
					returnedTotal: "80000.00",
					holdingTotal: "20000.00",
				},
				{
					id: sid("rpt-deposit", "2"),
					depositType: "停车预付款",
					collectedTotal: "50000.00",
					returnedTotal: "10000.00",
					holdingTotal: "40000.00",
				},
			]),
		);

		await db.insert(rptPaymentDetails).values(
			rows([
				{
					id: sid("rpt-payment", "1"),
					ownerName: "张三",
					houseNumber: "A-101",
					expenseItem: "物业费",
					paymentAmount: "300.00",
					paymentTime: new Date("2024-01-15"),
					paymentMethod: "微信支付",
				},
				{
					id: sid("rpt-payment", "2"),
					ownerName: "李四",
					houseNumber: "A-102",
					expenseItem: "停车费",
					paymentAmount: "350.00",
					paymentTime: new Date("2024-01-20"),
					paymentMethod: "支付宝",
				},
			]),
		);

		await db.insert(rptOwnerPaymentDetails).values(
			rows([
				{
					id: sid("rpt-owner-pay", "1"),
					ownerId: sid("owner", "zhangsan"),
					ownerName: "张三",
					totalReceivable: "3600.00",
					totalPaid: "3600.00",
					totalOutstanding: "0.00",
				},
				{
					id: sid("rpt-owner-pay", "2"),
					ownerId: sid("owner", "lisi"),
					ownerName: "李四",
					totalReceivable: "2550.00",
					totalPaid: "1200.00",
					totalOutstanding: "1350.00",
				},
			]),
		);

		await db
			.insert(rptFeeReminders)
			.values(
				rows([
					{
						id: sid("rpt-reminder", "1"),
						ownerInfo: "王五 B-201",
						outstandingAmount: "275.00",
						reminderMethod: "短信",
						isDelivered: true,
					},
				]),
			);

		await db
			.insert(rptNoChargeHouses)
			.values(
				rows([
					{
						id: sid("rpt-no-charge", "1"),
						houseNumber: "C-301",
						ownerInfo: "空置房",
						noChargeReason: "房屋空置6个月以上",
					},
				]),
			);

		await db.insert(rptOutstandingFees).values(
			rows([
				{
					id: sid("rpt-outstanding", "1"),
					agingBucket: "1-30天",
					outstandingAmount: "5000.00",
					householdCount: 3,
					community: "阳光花园",
					expenseItem: "物业费",
				},
				{
					id: sid("rpt-outstanding", "2"),
					agingBucket: "31-90天",
					outstandingAmount: "2000.00",
					householdCount: 1,
					community: "阳光花园",
					expenseItem: "停车费",
				},
			]),
		);

		await db
			.insert(rptPatrolReports)
			.values(
				rows([
					{
						id: sid("rpt-patrol", "1"),
						plannedTasks: 30,
						completedTasks: 28,
						abnormalTasks: 2,
						onTimeCompletionRate: "93.33",
						period: "2024-01",
					},
				]),
			);

		await db
			.insert(rptRepairReports)
			.values(
				rows([
					{
						id: sid("rpt-repair", "1"),
						totalRepairs: 15,
						completedCount: 12,
						pendingCount: 3,
						avgProcessingTime: "4.5",
						satisfactionRate: "96.00",
					},
				]),
			);

		await db
			.insert(rptRepairSummaries)
			.values(
				rows([
					{
						id: sid("rpt-repair-summary", "1"),
						repairTypeDistribution: JSON.stringify({ 水管维修: 5, 电路维修: 4, 门窗维修: 3, 电梯维修: 2, 消防设施: 1 }),
						workerWorkload: JSON.stringify({ 王五: 8, 赵六: 7 }),
					},
				]),
			);

		await db
			.insert(rptStatementExpenses)
			.values(
				rows([
					{
						id: sid("rpt-statement", "1"),
						reportType: "月度报表",
						reportPeriod: "2024-01",
						dataSnapshot: JSON.stringify({ totalIncome: 75000, totalExpense: 45000 }),
					},
				]),
			);

		await db.insert(rptDataStatistics).values(
			rows([
				{
					id: sid("rpt-stat", "1"),
					statisticIndicator: "入住率",
					statisticValue: "92.5",
					statisticTime: new Date("2024-01-31"),
				},
				{
					id: sid("rpt-stat", "2"),
					statisticIndicator: "缴费率",
					statisticValue: "88.0",
					statisticTime: new Date("2024-01-31"),
				},
			]),
		);
	},
});
