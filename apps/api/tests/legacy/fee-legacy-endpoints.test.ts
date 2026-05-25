import { afterEach, describe, expect, test } from "vitest";

import {
	createEndpointRegistry,
	dispatchEndpoint,
	findEndpointDefinition,
} from "../../server/shared/runtime/endpoint-registry";
import { runtimeEndpointDefinitions } from "../../server/shared/runtime/runtime-endpoints";

const readOnlyFeeLegacyPaths = [
	"/app/fee.listFee",
	"/app/fee.queryFeeDetail",
	"/app/feeApi/listOweFees",
	"/app/oweFeeCallable.listOweFeeCallable",
	"/app/feeConfig.listFeeConfigs",
	"/app/reportFeeMonthStatistics.queryReportFeeSummary",
	"/app/reportFeeMonthStatistics/queryPayFeeDetail",
	"/app/reportFeeMonthStatistics.queryReportFeeDetailRoom",
	"/app/dataReport.queryFeeDataReport",
];

function expectLegacyEnvelope(response: Record<string, unknown>) {
	expect(response).toMatchObject({
		code: 0,
		msg: expect.any(String),
	});
	expect(response).toHaveProperty("data");
	expect(response).not.toHaveProperty("success");
	expect(response).not.toHaveProperty("message");
	expect(response).not.toHaveProperty("timestamp");
}

describe("fee legacy endpoints", () => {
	afterEach(() => {
		delete process.env.PHASE7_ALLOW_LEGACY_MUTATIONS;
	});

	test("keeps Phase2 fee payment report endpoints registered and excludes device endpoints", () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const path of readOnlyFeeLegacyPaths) {
			expect(findEndpointDefinition(registry, "GET", path)).toBeTruthy();
			expect(findEndpointDefinition(registry, "POST", path)).toBeTruthy();
		}
		expect(findEndpointDefinition(registry, "POST", "/app/payment.nativeQrcodePayment")).toBeTruthy();
		expect(findEndpointDefinition(registry, "GET", "/app/iot/listChargeMachineBmoImpl")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/iot/listChargeMachineOrderBmoImpl")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/iot/listChargeMachinePortBmoImpl")).toBeUndefined();
		expect(findEndpointDefinition(registry, "GET", "/app/machine/listMachineRecords")).toBeUndefined();
	});

	test("blocks payment, callable write, and fee-create actions by default in phase7 execution guard", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const request of [
			{
				method: "POST",
				path: "/app/oweFeeCallable.writeOweFeeCallable",
				body: { communityId: "COMM_001", feeIds: ["FEE_001"], roomId: "ROOM_001" },
			},
			{
				method: "POST",
				path: "/app/fee.saveRoomCreateFee",
				body: { locationObjId: "ROOM_001", configId: "CONFIG_001", communityId: "COMM_001" },
			},
			{
				method: "POST",
				path: "/app/payment.nativeQrcodePayment",
				body: { roomId: "ROOM_001", communityId: "COMM_001", feeIds: ["FEE_001"] },
			},
		]) {
			const response = await dispatchEndpoint(registry, request);

			expect(response).toMatchObject({
				code: 409,
				msg: expect.stringContaining("Phase7"),
				data: null,
				errorCode: "PHASE7_MUTATION_GUARDED",
			});
		}
	});

	test("serves fee list, fee detail, owe fee and callable list legacy shapes for GET and POST", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const method of ["GET", "POST"] as const) {
			const feeList = await dispatchEndpoint(registry, {
				method,
				path: "/app/fee.listFee",
				query: method === "GET" ? { page: 1, row: 5, communityId: "COMM_001" } : undefined,
				body: method === "POST" ? { page: 1, row: 5, communityId: "COMM_001" } : undefined,
			});
			expectLegacyEnvelope(feeList);
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
				method,
				path: "/app/fee.queryFeeDetail",
				query: method === "GET" ? { page: 1, row: 10, communityId: "COMM_001", feeId: "FEE_001" } : undefined,
				body: method === "POST" ? { page: 1, row: 10, communityId: "COMM_001", feeId: "FEE_001" } : undefined,
			});
			expectLegacyEnvelope(feeDetail);
			expect(feeDetail.data.list[0]).toMatchObject({
				feeId: "FEE_001",
				communityId: "COMM_001",
			});

			const oweFees = await dispatchEndpoint(registry, {
				method,
				path: "/app/feeApi/listOweFees",
				query: method === "GET" ? { page: 1, row: 5, communityId: "COMM_001" } : undefined,
				body: method === "POST" ? { page: 1, row: 5, communityId: "COMM_001" } : undefined,
			});
			expectLegacyEnvelope(oweFees);
			expect(oweFees.data.data[0]).toMatchObject({
				feeId: expect.any(String),
				oweAmount: expect.any(Number),
				totalAmount: expect.any(Number),
			});

			const callableList = await dispatchEndpoint(registry, {
				method,
				path: "/app/oweFeeCallable.listOweFeeCallable",
				query: method === "GET" ? { page: 1, row: 5, communityId: "COMM_001" } : undefined,
				body: method === "POST" ? { page: 1, row: 5, communityId: "COMM_001" } : undefined,
			});
			expectLegacyEnvelope(callableList);
			expect(callableList.data).toMatchObject({
				list: expect.any(Array),
			});
			expect(callableList.data.list[0]).toMatchObject({
				feeId: expect.any(String),
				callableWayName: expect.any(String),
				remark: expect.any(String),
			});
		}
	});

	test("serves fee config and report legacy shapes for GET and POST", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		for (const method of ["GET", "POST"] as const) {
			const feeConfigs = await dispatchEndpoint(registry, {
				method,
				path: "/app/feeConfig.listFeeConfigs",
				query: method === "GET" ? { page: 1, row: 5, communityId: "COMM_001" } : undefined,
				body: method === "POST" ? { page: 1, row: 5, communityId: "COMM_001" } : undefined,
			});
			expectLegacyEnvelope(feeConfigs);
			expect(feeConfigs.data[0]).toMatchObject({
				configId: expect.any(String),
				feeName: expect.any(String),
				feeTypeCd: expect.any(String),
				valid: expect.any(Number),
			});

			const summary = await dispatchEndpoint(registry, {
				method,
				path: "/app/reportFeeMonthStatistics.queryReportFeeSummary",
				query: method === "GET" ? { page: 1, row: 10, communityId: "COMM_001" } : undefined,
				body: method === "POST" ? { page: 1, row: 10, communityId: "COMM_001" } : undefined,
			});
			expectLegacyEnvelope(summary);
			expect(summary.data.list[0]).toMatchObject({
				feeRoomCount: expect.any(Number),
				oweRoomCount: expect.any(Number),
				curOweFee: expect.any(Number),
				receivedFee: expect.any(Number),
			});

			const payFeeDetail = await dispatchEndpoint(registry, {
				method,
				path: "/app/reportFeeMonthStatistics/queryPayFeeDetail",
				query: method === "GET" ? { page: 1, row: 10, communityId: "COMM_001" } : undefined,
				body: method === "POST" ? { page: 1, row: 10, communityId: "COMM_001" } : undefined,
			});
			expectLegacyEnvelope(payFeeDetail);
			expect(payFeeDetail.data).toMatchObject({
				total: expect.any(Number),
				list: expect.any(Array),
			});
			expect(payFeeDetail.data.list[0]).toMatchObject({
				feeId: expect.any(String),
				receivedAmount: expect.any(Number),
				payMethod: expect.any(String),
			});

			const roomFee = await dispatchEndpoint(registry, {
				method,
				path: "/app/reportFeeMonthStatistics.queryReportFeeDetailRoom",
				query: method === "GET" ? { page: 1, row: 10, communityId: "COMM_001" } : undefined,
				body: method === "POST" ? { page: 1, row: 10, communityId: "COMM_001" } : undefined,
			});
			expectLegacyEnvelope(roomFee);
			expect(roomFee.data.list[0]).toMatchObject({
				roomId: expect.any(String),
				roomName: expect.any(String),
				oweFee: expect.any(Number),
				stateName: expect.any(String),
			});

			const dataReport = await dispatchEndpoint(registry, {
				method,
				path: "/app/dataReport.queryFeeDataReport",
				query: method === "GET" ? { communityId: "COMM_001", reportCode: "FEE_REPORT" } : undefined,
				body: method === "POST" ? { communityId: "COMM_001", reportCode: "FEE_REPORT" } : undefined,
			});
			expectLegacyEnvelope(dataReport);
			expect(dataReport.data.list[0]).toMatchObject({
				name: expect.any(String),
				value: expect.any(Number),
				unit: expect.any(String),
			});
		}
	});

	test("prefers POST body over query parameters for read-only fee legacy endpoints", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const feeList = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/fee.listFee",
			query: { page: 1, row: 1, communityId: "UNKNOWN_COMMUNITY" },
			body: { page: 1, row: 5, communityId: "COMM_001", feeId: "FEE_001" },
		});
		expectLegacyEnvelope(feeList);
		expect(feeList.data).toMatchObject({ total: 1, page: 1, row: 5 });
		expect(feeList.data.list).toHaveLength(1);
		expect(feeList.data.list[0]).toMatchObject({ feeId: "FEE_001", communityId: "COMM_001" });

		const feeDetail = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/fee.queryFeeDetail",
			query: { page: 1, row: 1, communityId: "COMM_001", feeId: "UNKNOWN_FEE" },
			body: { page: 1, row: 20, communityId: "COMM_001", feeId: "FEE_001" },
		});
		expectLegacyEnvelope(feeDetail);
		expect(feeDetail.data.list).toHaveLength(2);
		expect(feeDetail.data.list[0]).toMatchObject({ feeId: "FEE_001" });

		const feeConfigs = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/feeConfig.listFeeConfigs",
			query: { page: 1, row: 5, feeTypeCd: "UNKNOWN_FEE_TYPE" },
			body: { page: 1, row: 5, feeTypeCd: "888800010001" },
		});
		expectLegacyEnvelope(feeConfigs);
		expect(feeConfigs.data).toHaveLength(1);
		expect(feeConfigs.data[0]).toMatchObject({ feeTypeCd: "888800010001" });
	});

	test("keeps empty-result compatibility for unknown fee legacy filters", async () => {
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const feeList = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/fee.listFee",
			query: { page: 1, row: 5, communityId: "UNKNOWN_COMMUNITY" },
		});
		expectLegacyEnvelope(feeList);
		expect(feeList.data).toMatchObject({ total: 0, page: 1, row: 5, list: [] });

		const feeDetail = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/fee.queryFeeDetail",
			query: { page: 1, row: 10, communityId: "COMM_001", feeId: "UNKNOWN_FEE" },
		});
		expectLegacyEnvelope(feeDetail);
		expect(feeDetail.data).toMatchObject({ list: [] });

		const oweFees = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/feeApi/listOweFees",
			query: { page: 1, row: 5, communityId: "COMM_001", roomId: "UNKNOWN_ROOM" },
		});
		expectLegacyEnvelope(oweFees);
		expect(oweFees.data).toMatchObject({ data: [], total: 0, totalAmount: 0, page: 1, row: 5 });

		const callableList = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/oweFeeCallable.listOweFeeCallable",
			query: { page: 1, row: 5, payerObjId: "UNKNOWN_ROOM" },
		});
		expectLegacyEnvelope(callableList);
		expect(callableList.data.list).toEqual([
			expect.objectContaining({
				feeId: expect.any(String),
				callableWayName: expect.any(String),
				remark: expect.any(String),
			}),
		]);

		const feeConfigs = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/feeConfig.listFeeConfigs",
			query: { page: 1, row: 5, feeTypeCd: "UNKNOWN_FEE_TYPE" },
		});
		expectLegacyEnvelope(feeConfigs);
		expect(feeConfigs.data).toEqual([]);

		const payFeeDetail = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/reportFeeMonthStatistics/queryPayFeeDetail",
			query: { page: 1, row: 10, roomId: "UNKNOWN_ROOM" },
		});
		expectLegacyEnvelope(payFeeDetail);
		expect(payFeeDetail.data).toMatchObject({ list: [], total: 0 });

		const roomFee = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/reportFeeMonthStatistics.queryReportFeeDetailRoom",
			query: { page: 1, row: 10, roomId: "UNKNOWN_ROOM" },
		});
		expectLegacyEnvelope(roomFee);
		expect(roomFee.data).toMatchObject({ list: [], total: 0 });

		const summary = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/reportFeeMonthStatistics.queryReportFeeSummary",
			query: { page: 1, row: 10, communityId: "UNKNOWN_COMMUNITY", floorId: "UNKNOWN_FLOOR" },
		});
		expectLegacyEnvelope(summary);
		expect(summary.data.list[0]).toMatchObject({
			feeRoomCount: expect.any(Number),
			curOweFee: expect.any(Number),
			roomCount: expect.any(Number),
		});

		const dataReport = await dispatchEndpoint(registry, {
			method: "GET",
			path: "/app/dataReport.queryFeeDataReport",
			query: { communityId: "UNKNOWN_COMMUNITY", reportCode: "UNKNOWN_REPORT" },
		});
		expectLegacyEnvelope(dataReport);
		expect(dataReport.data.list).toEqual([
			expect.objectContaining({ name: expect.any(String), value: expect.any(Number), unit: expect.any(String) }),
			expect.objectContaining({ name: expect.any(String), value: expect.any(Number), unit: expect.any(String) }),
			expect.objectContaining({ name: expect.any(String), value: expect.any(Number), unit: expect.any(String) }),
		]);
	});

	test("serves legacy mutation compatibility shapes only when explicitly allowed", async () => {
		process.env.PHASE7_ALLOW_LEGACY_MUTATIONS = "1";
		const registry = createEndpointRegistry(runtimeEndpointDefinitions);

		const writeCallable = await dispatchEndpoint(registry, {
			method: "POST",
			path: "/app/oweFeeCallable.writeOweFeeCallable",
			body: {
				communityId: "COMM_001",
				feeIds: ["FEE_001"],
				roomId: "ROOM_001",
				roomName: "room-101",
				remark: "phone reminder",
			},
		});
		expectLegacyEnvelope(writeCallable);
		expect(writeCallable.data).toMatchObject({ code: 0, msg: expect.any(String) });

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
		expectLegacyEnvelope(createFee);
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
		expectLegacyEnvelope(payment);
		expect(payment.data).toMatchObject({
			code: 0,
			data: { codeUrl: expect.stringContaining("ROOM_001") },
		});
	});
});
