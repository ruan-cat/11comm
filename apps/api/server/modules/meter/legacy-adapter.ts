import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { MeterService } from "./service";

export const meterLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-plus-guarded-write-batch14",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: [
		"/app/meter.queryFeeTypes",
		"/app/meter.queryFeeTypesItems",
		"/app/meter.listMeterType",
		"/app/meter.listMeterWaters",
		"/app/meter.queryPreMeterWater",
		"/app/meter.listFloorShareReading",
		"/app/meter.listFloorShareMeter",
	],
	guardedEndpoints: [
		"/app/meter.saveMeterWater",
		"/app/meter.saveFloorShareReading",
		"/app/meter.auditFloorShareReading",
	],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: ["db-backed-meter-data", "meter-write-read-back-rollback", "production-app-h5-meter-network"],
} as const;

export function createLegacyMeterAdapter(service: MeterService) {
	return {
		async queryFeeTypes(_input: Record<string, unknown>) {
			return legacySuccess(await service.listFeeTypes(), "查询成功");
		},

		async queryFeeTypesItems(input: Record<string, unknown>) {
			return legacySuccess(await service.listFeeConfigItems(toString(input.feeTypeCd) ?? ""), "查询成功");
		},

		async listMeterType(_input: Record<string, unknown>) {
			return legacySuccess(await service.listMeterTypes(), "查询成功");
		},

		async listMeterWaters(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listMeterReadings({
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 10),
					roomNum: toString(input.roomNum),
				}),
				"查询成功",
			);
		},

		async queryPreMeterWater(input: Record<string, unknown>) {
			return legacySuccess(
				await service.getPreMeterWater({
					objId: toString(input.objId) ?? "",
					meterType: toString(input.meterType) ?? "",
				}),
				"查询成功",
			);
		},

		async listFloorShareReading(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listFloorShareReadings({
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 10),
				}),
				"查询成功",
			);
		},

		async listFloorShareMeter(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listFloorShareMeters({
					page: toNumber(input.page, 1),
					row: toNumber(input.row, 10),
					fsmId: toString(input.fsmId),
				}),
				"查询成功",
			);
		},
		async guardedWrite(endpoint: string, input: Record<string, unknown>) {
			void input;
			return legacyFailure(
				`Phase7 mutation guard blocked ${endpoint}; no meter write read-back rollback evidence exists, so this endpoint stays guarded in apps/api.`,
				409,
				{ errorCode: "PHASE7_MUTATION_GUARDED" },
			);
		},
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
