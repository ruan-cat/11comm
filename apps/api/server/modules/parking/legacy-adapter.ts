import type { ParkingService } from "./service";
import type { ParkingLegacyResponse } from "./types";

export const parkingLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-batch36-plus-guarded-write-batch37",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ success, code, message, data, timestamp }",
	endpoints: [
		"/app/owner.queryOwnerCars",
		"/app/parkingArea.listParkingAreas",
		"/app/machine.listParkingAreaMachines",
		"/app/machine.getBarrierCloudVideo",
		"/app/carInout.listCarInParkingAreaCmd",
		"/app/parkingCoupon.listParkingCouponCar",
		"/app/tempCarFee.getTempCarFeeOrder",
		"/app/carInoutDetail.listCarInoutDetail",
		"/app/carInoutPayment.listCarInoutPayment",
	],
	guardedEndpoints: ["/app/machine/openDoor", "/app/machine/closeDoor", "/app/machine.customCarInOutCmd"],
	excludedWriteEndpoints: [],
	notCovered: ["db-backed-parking-data", "parking-write-read-back-rollback", "production-app-h5-parking-network"],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
} as const;

export function createLegacyParkingAdapter(service: ParkingService) {
	return {
		async queryOwnerCars(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const carNumLike = toString(input.carNumLike);
			const ownerName = toString(input.ownerName);
			const memberCarNumLike = toString(input.memberCarNumLike);
			const num = toString(input.num);
			const link = toString(input.link);

			return parkingSuccess(
				await service.listLegacyOwnerCars({ page, row, carNumLike, ownerName, memberCarNumLike, num, link }),
			);
		},

		async listParkingAreas(_input: Record<string, unknown>) {
			return parkingSuccess(await service.listLegacyParkingAreas());
		},

		async listParkingAreaMachines(input: Record<string, unknown>) {
			const paNum = toString(input.paNum);

			return parkingSuccess(await service.listLegacyParkingAreaMachines(paNum));
		},

		async getBarrierCloudVideo(input: Record<string, unknown>) {
			const machineId = toString(input.machineId);
			const video = machineId ? await service.getLegacyBarrierCloudVideo(machineId) : undefined;

			return video ? parkingSuccess(video) : parkingFailure("设备不存在", "404");
		},

		async listCarInParkingArea(input: Record<string, unknown>) {
			const carNum = toString(input.carNum);
			const paId = toString(input.paId);

			return parkingSuccess(await service.listLegacyTempCars({ carNum, paId }));
		},

		async listParkingCouponCar(_input: Record<string, unknown>) {
			return parkingSuccess(await service.listLegacyParkingCoupons());
		},

		async getTempCarFeeOrder(input: Record<string, unknown>) {
			const pccIds = toString(input.pccIds);

			return parkingSuccess(await service.getLegacyTempCarFeeOrder({ pccIds }), "calculate success");
		},

		async listCarInoutDetails(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const paNum = toString(input.paNum);

			return parkingSuccess(await service.listLegacyCarInoutDetails({ page, row, paNum }));
		},

		async listCarInoutPayments(input: Record<string, unknown>) {
			const page = toNumber(input.page, 1);
			const row = toNumber(input.row, 10);
			const paNum = toString(input.paNum);

			return parkingSuccess(await service.listLegacyCarInoutPayments({ page, row, paNum }));
		},

		async guardedWrite(endpoint: string, input: Record<string, unknown>) {
			void input;
			return parkingFailure(`Phase7 mutation guard blocked parking legacy write endpoint: ${endpoint}`, "409", {
				errorCode: "PHASE7_MUTATION_GUARDED",
			});
		},
	};
}

function parkingFailure(
	message: string,
	code: string,
	extra: Record<string, unknown> = {},
): ParkingLegacyResponse<null> & Record<string, unknown> {
	return {
		success: false,
		code,
		message,
		data: null,
		timestamp: Date.now(),
		...extra,
	};
}

function parkingSuccess<T>(data: T, message = "success"): ParkingLegacyResponse<T> {
	return {
		success: true,
		code: "0",
		message,
		data,
		timestamp: Date.now(),
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
