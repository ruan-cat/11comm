import { describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

describe("fee legacy endpoints", () => {
	test("registers only Phase2 fee payment report legacy endpoints", () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		expect(findEndpointDefinition(registry, "GET", "/app/fee.listFee")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/fee.queryFeeDetail")).toBeTruthy();
		expect(findEndpointDefinition(registry, "POST", "/app/payment.nativeQrcodePayment")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/reportFeeMonthStatistics.queryReportFeeSummary")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/iot/listChargeMachineBmoImpl")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/iot/listChargeMachineOrderBmoImpl")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/iot/listChargeMachinePortBmoImpl")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/machine/listMachineRecords")).toBeUndefined();
	});

	test("serves fee list, fee detail, owe fee, callable, create fee and payment qrcode legacy shapes", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const feeList = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/fee.listFee",
			query: { page: 1, row: 5, communityId: "COMM_001" },
		});
		expect(feeList.data).toMatchObject({
			total: expect.any(Number),
			page: 1,
			row: 5,
			list: expect.any(Array),
		});
		expect(feeList.data.list[0]).toMatchObject({
			feeId: expect.any(String),
			roomId: expect.any(String),
			ownerName: expect.any(String),
			stateName: expect.any(String),
		});

		const feeDetail = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/fee.queryFeeDetail",
			query: { page: 1, row: 10, communityId: "COMM_001", feeId: "FEE_001" },
		});
		expect(feeDetail.data.list[0]).toMatchObject({
			feeId: "FEE_001",
			communityId: "COMM_001",
		});

		const oweFees = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/feeApi/listOweFees",
			query: { page: 1, row: 5, communityId: "COMM_001" },
		});
		expect(oweFees.data.data[0]).toMatchObject({
			feeId: expect.any(String),
			oweAmount: expect.any(Number),
			totalAmount: expect.any(Number),
		});

		const writeCallable = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/oweFeeCallable.writeOweFeeCallable",
			body: {
				communityId: "COMM_001",
				feeIds: ["FEE_001"],
				roomId: "ROOM_001",
				roomName: "1栋101室",
				remark: "电话提醒",
			},
		});
		expect(writeCallable.data).toMatchObject({ code: 0, msg: "登记成功" });

		const createFee = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/fee.saveRoomCreateFee",
			body: {
				locationObjId: "ROOM_001",
				configId: "CONFIG_001",
				amount: "128",
				communityId: "COMM_001",
			},
		});
		expect(createFee.data).toMatchObject({
			success: true,
			totalRoom: 1,
			successRoom: 1,
			errorRoom: 0,
		});

		const payment = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/payment.nativeQrcodePayment",
			body: {
				roomId: "ROOM_001",
				communityId: "COMM_001",
				business: "oweFee",
				feeIds: ["FEE_001"],
			},
		});
		expect(payment.data).toMatchObject({
			code: 0,
			data: { codeUrl: expect.stringContaining("ROOM_001") },
		});
	});

	test("serves report legacy shapes", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const summary = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/reportFeeMonthStatistics.queryReportFeeSummary",
			query: { page: 1, row: 10, communityId: "COMM_001" },
		});
		expect(summary.data.list[0]).toMatchObject({
			feeRoomCount: expect.any(Number),
			receivedFee: expect.any(Number),
		});

		const payFeeDetail = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/reportFeeMonthStatistics/queryPayFeeDetail",
			query: { page: 1, row: 10, communityId: "COMM_001" },
		});
		expect(payFeeDetail.data).toMatchObject({
			total: expect.any(Number),
			list: expect.any(Array),
		});

		const roomFee = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/reportFeeMonthStatistics.queryReportFeeDetailRoom",
			query: { page: 1, row: 10, communityId: "COMM_001" },
		});
		expect(roomFee.data.list[0]).toMatchObject({
			roomId: expect.any(String),
			oweFee: expect.any(Number),
		});

		const dataReport = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/dataReport.queryFeeDataReport",
			query: { communityId: "COMM_001", reportCode: "FEE_REPORT" },
		});
		expect(dataReport.data.list[0]).toMatchObject({
			name: expect.any(String),
			value: expect.any(Number),
		});
	});
});
