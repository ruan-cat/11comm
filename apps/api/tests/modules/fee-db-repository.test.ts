import { describe, expect, test } from "vitest";
import { exExpenseItems, exHouseCharges, rptExpenseSummaries, rptPaymentDetails } from "@01s-11comm/type";

import { createDbFeeRepository } from "../../server/modules/fee/repository";

describe("fee DB repository phase7 read slice", () => {
	test("reads owe fees from exHouseCharges with amount filtering pagination and compatibility defaults", async () => {
		const repository = createDbFeeRepository(
			createFakeDb({
				houseCharges: [
					{
						id: "11111111-1111-4111-8111-111111111111",
						houseId: "22222222-2222-4222-8222-222222222222",
						expenseItem: "Property management fee",
						receivableAmount: "300.50",
						receivedAmount: "100.25",
						status: "partial",
						billDate: "2026-05-01",
						dueDate: "2026-05-31",
						billingPeriod: "2026-05",
						createTime: "2026-05-10 09:00:00",
					},
					{
						id: "33333333-3333-4333-8333-333333333333",
						houseId: "44444444-4444-4444-8444-444444444444",
						expenseItem: "Water fee",
						receivableAmount: "50",
						receivedAmount: "50",
						status: "paid",
						billDate: "2026-05-02",
						dueDate: "2026-05-20",
						billingPeriod: "2026-05",
						createTime: "2026-05-10 10:00:00",
					},
					{
						id: "55555555-5555-4555-8555-555555555555",
						houseId: "66666666-6666-4666-8666-666666666666",
						expenseItem: "Parking fee",
						receivableAmount: "80",
						receivedAmount: "0",
						status: "unpaid",
						billDate: "2026-05-03",
						dueDate: "2026-05-21",
						billingPeriod: "2026-05",
						createTime: "2026-05-10 11:00:00",
					},
				],
			}) as never,
		);

		const result = await repository.listOweFees({
			page: 1,
			row: 1,
			communityId: "COMM_001",
		});

		expect(result).toEqual({
			data: [
				{
					oweFeeId: "11111111-1111-4111-8111-111111111111",
					feeId: "11111111-1111-4111-8111-111111111111",
					feeName: "Property management fee",
					roomId: "22222222-2222-4222-8222-222222222222",
					roomName: "22222222-2222-4222-8222-222222222222",
					communityId: "",
					ownerName: "",
					ownerTel: "",
					oweAmount: 200.25,
					startTime: "2026-05-01",
					endTime: "2026-05-31",
					oweDays: 0,
					lateFee: 0,
					totalAmount: 200.25,
					state: "PARTIAL_PAID",
					createTime: "2026-05-10 09:00:00",
				},
			],
			totalAmount: 280.25,
			total: 2,
			page: 1,
			row: 1,
		});
	});

	test("reads fee configs from exExpenseItems instead of in-memory fallback", async () => {
		const repository = createDbFeeRepository(
			createFakeDb({
				expenseItems: [
					{
						id: "EXPENSE_PROPERTY",
						expenseType: "PROPERTY",
						itemName: "Property management fee",
						paymentType: "monthly",
						formula: "area * unitPrice",
						status: "enabled",
						createTime: "2026-05-10 10:00:00",
					},
				],
			}) as never,
		);

		const configs = await repository.listFeeConfigs({
			page: 1,
			row: 10,
			feeTypeCd: "PROPERTY",
			valid: 1,
		});

		expect(configs).toEqual([
			{
				configId: "EXPENSE_PROPERTY",
				feeName: "Property management fee",
				feeTypeCd: "PROPERTY",
				computingFormula: "area * unitPrice",
				feeFlag: "monthly",
				isDefault: "F",
				valid: 1,
			},
		]);
	});

	test("aggregates fee summary report from rptExpenseSummaries instead of fallback totals", async () => {
		const db = createFakeDb({
			expenseSummaries: [
				{
					id: "SUMMARY_1",
					communityId: "COMM_001",
					building: "BUILDING_1",
					expenseType: "PROPERTY",
					receivableTotal: "100.50",
					receivedTotal: "80.25",
					outstandingTotal: "20.25",
					createTime: "2026-05-10 10:00:00",
				},
				{
					id: "SUMMARY_2",
					communityId: "COMM_001",
					building: "BUILDING_2",
					expenseType: "PROPERTY",
					receivableTotal: "50",
					receivedTotal: "50",
					outstandingTotal: "0",
					createTime: "2026-05-10 11:00:00",
				},
			],
		});
		const repository = createDbFeeRepository(db as never);

		const summary = await repository.getFeeSummaryReport({
			page: 1,
			row: 10,
			communityId: "COMM_001",
			feeTypeCd: "PROPERTY",
		});

		expect(summary.list).toEqual([
			{
				feeRoomCount: 2,
				oweRoomCount: 1,
				curOweFee: 20.25,
				hisOweFee: 0,
				receivedFee: 130.25,
				curReceivableFee: 150.5,
				hisReceivedFee: 0,
				roomCount: 2,
			},
		]);
		expect(db.whereCalls).toHaveLength(1);
	});

	test("does not push legacy communityId fallback into UUID report columns", async () => {
		const db = createFakeDb({ expenseSummaries: [] });
		const repository = createDbFeeRepository(db as never);

		await repository.getFeeSummaryReport({
			page: 1,
			row: 10,
			communityId: "COMM_001",
		});

		expect(db.whereCalls).toHaveLength(1);
		expect(String(db.whereCalls[0])).not.toContain("COMM_001");
	});

	test("reads payment detail report from rptPaymentDetails", async () => {
		const repository = createDbFeeRepository(
			createFakeDb({
				paymentDetails: [
					{
						id: "PAYMENT_DETAIL_1",
						expenseItem: "Property management fee",
						houseNumber: "1-101",
						ownerName: "Alice",
						paymentAmount: "88.5",
						paymentTime: "2026-05-10 12:00:00",
						paymentMethod: "wechat",
						collector: "Cashier A",
						transactionNo: "TXN_001",
						createTime: "2026-05-10 12:00:00",
					},
				],
				counts: new Map([[rptPaymentDetails, 1]]),
			}) as never,
		);

		const result = await repository.getPayFeeDetailReport({
			page: 1,
			row: 10,
			communityId: "COMM_001",
		});

		expect(result).toMatchObject({
			total: 1,
			list: [
				{
					feeId: "PAYMENT_DETAIL_1",
					feeName: "Property management fee",
					roomId: "1-101",
					roomName: "1-101",
					ownerName: "Alice",
					receivedAmount: 88.5,
					payMethod: "wechat",
					collector: "Cashier A",
					transactionNo: "TXN_001",
				},
			],
		});
	});

	test("reads room fee report from exHouseCharges with compatibility room ids", async () => {
		const repository = createDbFeeRepository(
			createFakeDb({
				houseCharges: [
					{
						id: "ROOM_FEE_1",
						houseId: "77777777-7777-4777-8777-777777777777",
						expenseItem: "Property management fee",
						receivableAmount: "300.50",
						receivedAmount: "100.25",
						status: "partial",
						createTime: "2026-05-10 09:00:00",
					},
				],
				counts: new Map([[exHouseCharges, 1]]),
			}) as never,
		);

		const result = await repository.getRoomFeeReport({
			page: 1,
			row: 10,
			communityId: "COMM_001",
		});

		expect(result).toEqual({
			list: [
				{
					roomId: "77777777-7777-4777-8777-777777777777",
					roomName: "77777777-7777-4777-8777-777777777777",
					ownerName: "",
					feeName: "Property management fee",
					receivableFee: 300.5,
					receivedFee: 100.25,
					oweFee: 200.25,
					stateName: "部分缴纳",
				},
			],
			total: 1,
		});
	});

	test("reads data report from rptExpenseSummaries", async () => {
		const repository = createDbFeeRepository(
			createFakeDb({
				expenseSummaries: [
					{
						id: "SUMMARY_3",
						expenseItem: "Parking fee",
						expenseType: "PARKING",
						receivedTotal: "60",
						receivableTotal: "100",
					},
				],
			}) as never,
		);

		const report = await repository.getDataReport({
			communityId: "COMM_001",
			reportCode: "FEE_REPORT",
		});

		expect(report.list).toEqual([
			{
				name: "Parking fee",
				value: 60,
				unit: "元",
			},
		]);
	});
});

function createFakeDb(seed: {
	counts?: Map<unknown, number>;
	expenseItems?: any[];
	expenseSummaries?: any[];
	houseCharges?: any[];
	paymentDetails?: any[];
}) {
	const whereCalls: unknown[] = [];

	return {
		whereCalls,
		select(selection?: Record<string, unknown>) {
			return {
				from(table: unknown) {
					if (selection && "total" in selection && seed.counts?.has(table)) {
						return createFakeQuery([{ total: seed.counts.get(table) }], whereCalls);
					}
					const rows =
						table === exExpenseItems
							? (seed.expenseItems ?? [])
							: table === exHouseCharges
								? (seed.houseCharges ?? [])
								: table === rptExpenseSummaries
									? (seed.expenseSummaries ?? [])
									: table === rptPaymentDetails
										? (seed.paymentDetails ?? [])
										: [];

					return createFakeQuery(rows, whereCalls);
				},
			};
		},
	};
}

function createFakeQuery(rows: any[], whereCalls: unknown[]) {
	let selected = rows;
	let limitValue: number | undefined;

	const query = {
		where(condition: unknown) {
			whereCalls.push(condition);
			return query;
		},
		orderBy() {
			return query;
		},
		limit(value: number) {
			limitValue = value;
			return query;
		},
		offset(value: number) {
			selected = selected.slice(value, limitValue === undefined ? undefined : value + limitValue);
			return Promise.resolve(selected);
		},
		then(resolve: (value: any[]) => unknown) {
			return Promise.resolve(resolve(selected));
		},
	};

	return query;
}
