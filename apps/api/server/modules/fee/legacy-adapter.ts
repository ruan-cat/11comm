import type { FeeService } from "./service";
import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";

export const feeLegacyAdapterEvidence = {
	scope: "fee-payment-report-plus-charge-machine-and-machine-record-readonly-and-guarded-write",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: [
		"/app/fee.listFee",
		"/app/fee.queryFeeDetail",
		"/app/feeApi/listOweFees",
		"/app/oweFeeCallable.listOweFeeCallable",
		"/app/feeConfig.listFeeConfigs",
		"/app/reportFeeMonthStatistics.queryReportFeeSummary",
		"/app/reportFeeMonthStatistics/queryPayFeeDetail",
		"/app/reportFeeMonthStatistics.queryReportFeeDetailRoom",
		"/app/dataReport.queryFeeDataReport",
		"/app/iot/listChargeMachineBmoImpl",
		"/app/iot/listChargeMachineOrderBmoImpl",
		"/app/iot/listChargeMachinePortBmoImpl",
		"/app/machine/listMachineRecords",
	],
	guardedEndpoints: [
		"/app/payment.nativeQrcodePayment",
		"/app/oweFeeCallable.writeOweFeeCallable",
		"/app/fee.saveRoomCreateFee",
	],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: ["db-backed-charge-machine-data", "db-backed-machine-record-data", "production-app-h5-fee-network"],
} as const;

export function createLegacyFeeAdapter(service: FeeService) {
	return {
		async listFee(input: Record<string, unknown>) {
			const result = await service.listLegacyFees({
				page: toNumber(input.page, 1),
				row: toNumber(input.row, 10),
				communityId: toString(input.communityId) || "COMM_001",
				roomId: toString(input.roomId),
				roomName: toString(input.roomName),
				feeType: toString(input.feeType),
				state: toString(input.state),
				ownerName: toString(input.ownerName),
				feeId: toString(input.feeId),
				payerObjId: toString(input.payerObjId),
			});
			return legacySuccess(result, "查询费用列表成功");
		},
		async queryFeeDetail(input: Record<string, unknown>) {
			const result = await service.listFeeDetails({
				page: toNumber(input.page, 1),
				row: toNumber(input.row, 50),
				communityId: toString(input.communityId) || "COMM_001",
				feeId: toString(input.feeId),
			});
			return legacySuccess(result, "查询费用详情成功");
		},
		async listOweFees(input: Record<string, unknown>) {
			const result = await service.listOweFees({
				page: toNumber(input.page, 1),
				row: toNumber(input.row, 10),
				communityId: toString(input.communityId) || "COMM_001",
				roomId: toString(input.roomId),
				ownerId: toString(input.ownerId),
			});
			return legacySuccess(result, "查询欠费成功");
		},
		async nativeQrcodePayment(input: Record<string, unknown>) {
			if (!isLegacyMutationAllowed()) {
				return legacyMutationGuarded("payment.nativeQrcodePayment");
			}

			const result = await service.createNativeQrcodePayment({
				roomId: toString(input.roomId) || "ROOM_001",
				communityId: toString(input.communityId) || "COMM_001",
				business: toString(input.business),
				feeIds: toStringArray(input.feeIds),
			});
			return legacySuccess(result, "生成二维码成功");
		},
		async listOweFeeCallable(input: Record<string, unknown>) {
			const result = await service.listOweFeeCallables({
				page: toNumber(input.page, 1),
				row: toNumber(input.row, 10),
				communityId: toString(input.communityId) || "COMM_001",
				payerObjId: toString(input.payerObjId),
			});
			return legacySuccess(result, "查询欠费催缴成功");
		},
		async writeOweFeeCallable(input: Record<string, unknown>) {
			if (!isLegacyMutationAllowed()) {
				return legacyMutationGuarded("oweFeeCallable.writeOweFeeCallable");
			}

			const result = await service.writeOweFeeCallable({
				communityId: toString(input.communityId) || "COMM_001",
				feeIds: toStringArray(input.feeIds),
				remark: toString(input.remark),
				roomId: toString(input.roomId),
			});
			return legacySuccess(result, "登记欠费催缴成功");
		},
		async saveRoomCreateFee(input: Record<string, unknown>) {
			if (!isLegacyMutationAllowed()) {
				return legacyMutationGuarded("fee.saveRoomCreateFee");
			}

			return legacySuccess(await service.saveRoomCreateFee(input), "创建费用成功");
		},
		async listFeeConfigs(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listFeeConfigs({
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 500),
					communityId: toString(input.communityId) || "COMM_001",
					feeTypeCd: toString(input.feeTypeCd),
					isDefault: toString(input.isDefault),
					valid: input.valid === undefined ? undefined : toNumber(input.valid, 1),
				}),
				"查询费用配置成功",
			);
		},
		async getFeeSummaryReport(input: Record<string, unknown>) {
			return legacySuccess(await service.getFeeSummaryReport(toReportQuery(input)), "查询费用汇总成功");
		},
		async getPayFeeDetailReport(input: Record<string, unknown>) {
			return legacySuccess(
				await service.getPayFeeDetailReport({
					...toReportQuery(input),
					roomId: toString(input.roomId),
				}),
				"查询缴费明细成功",
			);
		},
		async getRoomFeeReport(input: Record<string, unknown>) {
			return legacySuccess(
				await service.getRoomFeeReport({
					...toReportQuery(input),
					roomId: toString(input.roomId),
				}),
				"查询房间费用成功",
			);
		},
		async getDataReport(input: Record<string, unknown>) {
			return legacySuccess(
				await service.getDataReport({
					communityId: toString(input.communityId) || "COMM_001",
					reportCode: toString(input.reportCode) || "FEE_REPORT",
				}),
				"查询数据报表成功",
			);
		},
		async listChargeMachines(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listChargeMachines({
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 10),
					communityId: toString(input.communityId) || "COMM_001",
					machineId: toString(input.machineId),
					machineNameLike: toString(input.machineNameLike),
				}),
				"查询充电桩列表成功",
			);
		},
		async listChargeMachineOrders(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listChargeMachineOrders({
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 10),
					machineId: toString(input.machineId),
				}),
				"查询充电订单成功",
			);
		},
		async listChargeMachinePorts(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listChargeMachinePorts({
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 10),
					machineId: toString(input.machineId) || "MACHINE_001",
				}),
				"查询充电桩插座成功",
			);
		},
		async listMachineRecords(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listMachineRecords({
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 10),
					communityId: toString(input.communityId) || "COMM_001",
					startDate: toString(input.startDate),
					endDate: toString(input.endDate),
				}),
				"查询开门记录成功",
			);
		},
	};
}

function isLegacyMutationAllowed(): boolean {
	return process.env.PHASE7_ALLOW_LEGACY_MUTATIONS === "1";
}

function legacyMutationGuarded(action: string) {
	return legacyFailure(
		`Phase7 mutation guard blocked ${action}; set PHASE7_ALLOW_LEGACY_MUTATIONS=1 only for controlled rollback evidence runs.`,
		409,
		{ errorCode: "PHASE7_MUTATION_GUARDED" },
	);
}

function toReportQuery(input: Record<string, unknown>) {
	return {
		page: toNumber(input.page, 1),
		row: toNumber(input.row, 10),
		communityId: toString(input.communityId) || "COMM_001",
		feeTypeCd: toString(input.feeTypeCd),
		floorId: toString(input.floorId),
	};
}

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? result : fallback;
}

function toString(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}
	return `${value}`.trim();
}

function toStringArray(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.map((item) => `${item}`).filter(Boolean);
	}
	if (typeof value === "string") {
		return value
			.split(",")
			.map((item) => item.trim())
			.filter(Boolean);
	}
	return [];
}
