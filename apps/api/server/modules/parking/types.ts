import type {
	CarportApplyListItem,
	CarportInfoListItem,
	OwnerVehicleListItem,
	ParkingLotListItem,
} from "@01s-11comm/type";

export type AdminCarportApplyListItem = CarportApplyListItem;
export type AdminCarportInfoListItem = CarportInfoListItem;
export type AdminOwnerVehicleListItem = OwnerVehicleListItem;
export type AdminParkingLotListItem = ParkingLotListItem;

export interface ListCarportApplicationsParams {
	pageIndex: number;
	pageSize: number;
	applicant?: string;
	carportType?: string;
	status?: string;
	licensePlate?: string;
	carBrand?: string;
	phoneNumber?: string;
	reviewResult?: string;
}

export interface ListCarportsParams {
	pageIndex: number;
	pageSize: number;
	parkingLot?: string;
	parkingSpace?: string;
	parkingSpaceStatus?: string;
	parkingSpaceType?: string;
	ownerName?: string;
	contactPhone?: string;
	vehicleNumber?: string;
}

export interface ListOwnerVehiclesParams {
	pageIndex: number;
	pageSize: number;
	licensePlate?: string;
	parkingSpaceNumber?: string;
	parkingSpaceStatus?: string;
	ownerName?: string;
	contactInfo?: string;
	memberPlateNumber?: string;
	carBrand?: string;
	vehicleType?: string;
}

export interface ListParkingLotsParams {
	pageIndex: number;
	pageSize: number;
	parkingLotNumber?: string;
	parkingLotType?: string;
	parkingSpaceType?: string;
}
