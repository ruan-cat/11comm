import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { adminSuccess } from "../../shared/runtime/response-builder";
import type { ParkingService } from "./service";
import type {
	AdminCarportApplyListItem,
	AdminCarportInfoListItem,
	AdminOwnerVehicleListItem,
	AdminParkingLotListItem,
} from "./types";

export function createAdminParkingAdapter(service: ParkingService) {
	return {
		async listCarportApplications(input: {
			pageIndex?: number;
			pageSize?: number;
			applicant?: string;
			carportType?: string;
			status?: string;
			licensePlate?: string;
			carBrand?: string;
			phoneNumber?: string;
			reviewResult?: string;
		}): Promise<JsonVO<PageDTO<AdminCarportApplyListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listCarportApplications({
				pageIndex,
				pageSize,
				applicant: blankToUndefined(input.applicant),
				carportType: blankToUndefined(input.carportType),
				status: blankToUndefined(input.status),
				licensePlate: blankToUndefined(input.licensePlate),
				carBrand: blankToUndefined(input.carBrand),
				phoneNumber: blankToUndefined(input.phoneNumber),
				reviewResult: blankToUndefined(input.reviewResult),
			});
			return pageSuccess(result, pageIndex, pageSize);
		},

		async listCarports(input: {
			pageIndex?: number;
			pageSize?: number;
			parkingLot?: string;
			parkingSpace?: string;
			parkingSpaceStatus?: string;
			parkingSpaceType?: string;
			ownerName?: string;
			contactPhone?: string;
			vehicleNumber?: string;
		}): Promise<JsonVO<PageDTO<AdminCarportInfoListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listCarports({
				pageIndex,
				pageSize,
				parkingLot: blankToUndefined(input.parkingLot),
				parkingSpace: blankToUndefined(input.parkingSpace),
				parkingSpaceStatus: blankToUndefined(input.parkingSpaceStatus),
				parkingSpaceType: blankToUndefined(input.parkingSpaceType),
				ownerName: blankToUndefined(input.ownerName),
				contactPhone: blankToUndefined(input.contactPhone),
				vehicleNumber: blankToUndefined(input.vehicleNumber),
			});
			return pageSuccess(result, pageIndex, pageSize);
		},

		async listOwnerVehicles(input: {
			pageIndex?: number;
			pageSize?: number;
			licensePlate?: string;
			parkingSpaceNumber?: string;
			parkingSpaceStatus?: string;
			ownerName?: string;
			contactInfo?: string;
			memberPlateNumber?: string;
			carBrand?: string;
			vehicleType?: string;
		}): Promise<JsonVO<PageDTO<AdminOwnerVehicleListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listOwnerVehicles({
				pageIndex,
				pageSize,
				licensePlate: blankToUndefined(input.licensePlate),
				parkingSpaceNumber: blankToUndefined(input.parkingSpaceNumber),
				parkingSpaceStatus: blankToUndefined(input.parkingSpaceStatus),
				ownerName: blankToUndefined(input.ownerName),
				contactInfo: blankToUndefined(input.contactInfo),
				memberPlateNumber: blankToUndefined(input.memberPlateNumber),
				carBrand: blankToUndefined(input.carBrand),
				vehicleType: blankToUndefined(input.vehicleType),
			});
			return pageSuccess(result, pageIndex, pageSize);
		},

		async listParkingLots(input: {
			pageIndex?: number;
			pageSize?: number;
			parkingLotNumber?: string;
			parkingLotType?: string;
			parkingSpaceType?: string;
		}): Promise<JsonVO<PageDTO<AdminParkingLotListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listParkingLots({
				pageIndex,
				pageSize,
				parkingLotNumber: blankToUndefined(input.parkingLotNumber),
				parkingLotType: blankToUndefined(input.parkingLotType),
				parkingSpaceType: blankToUndefined(input.parkingSpaceType),
			});
			return pageSuccess(result, pageIndex, pageSize);
		},
	};
}

function pageSuccess<T>(result: { list: T[]; total: number }, pageIndex: number, pageSize: number): JsonVO<PageDTO<T>> {
	return adminSuccess({
		list: result.list,
		total: result.total,
		pageIndex,
		pageSize,
		totalPages: Math.ceil(result.total / pageSize),
	});
}

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? result : fallback;
}

function blankToUndefined(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}
	return `${value}`.trim();
}
