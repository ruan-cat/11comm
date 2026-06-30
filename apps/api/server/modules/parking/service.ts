import type { ParkingRepository } from "./repository";
import type {
	ListCarportApplicationsParams,
	ListCarportsParams,
	ListOwnerVehiclesParams,
	ListParkingLotsParams,
	ParkingCarInoutDetailQuery,
	ParkingCarInoutPaymentQuery,
	ParkingOwnerCarsQuery,
	ParkingTempCarFeeOrderQuery,
	ParkingTempCarsQuery,
} from "./types";

export interface ParkingService {
	listCarportApplications: (
		params: ListCarportApplicationsParams,
	) => ReturnType<ParkingRepository["listCarportApplications"]>;
	listCarports: (params: ListCarportsParams) => ReturnType<ParkingRepository["listCarports"]>;
	listOwnerVehicles: (params: ListOwnerVehiclesParams) => ReturnType<ParkingRepository["listOwnerVehicles"]>;
	listParkingLots: (params: ListParkingLotsParams) => ReturnType<ParkingRepository["listParkingLots"]>;
	listLegacyOwnerCars: (params: ParkingOwnerCarsQuery) => ReturnType<ParkingRepository["listLegacyOwnerCars"]>;
	listLegacyParkingAreas: () => ReturnType<ParkingRepository["listLegacyParkingAreas"]>;
	listLegacyParkingAreaMachines: (paNum?: string) => ReturnType<ParkingRepository["listLegacyParkingAreaMachines"]>;
	getLegacyBarrierCloudVideo: (machineId: string) => ReturnType<ParkingRepository["getLegacyBarrierCloudVideo"]>;
	listLegacyTempCars: (params: ParkingTempCarsQuery) => ReturnType<ParkingRepository["listLegacyTempCars"]>;
	listLegacyParkingCoupons: () => ReturnType<ParkingRepository["listLegacyParkingCoupons"]>;
	getLegacyTempCarFeeOrder: (
		params: ParkingTempCarFeeOrderQuery,
	) => ReturnType<ParkingRepository["getLegacyTempCarFeeOrder"]>;
	listLegacyCarInoutDetails: (
		params: ParkingCarInoutDetailQuery,
	) => ReturnType<ParkingRepository["listLegacyCarInoutDetails"]>;
	listLegacyCarInoutPayments: (
		params: ParkingCarInoutPaymentQuery,
	) => ReturnType<ParkingRepository["listLegacyCarInoutPayments"]>;
}

export function createParkingService(repository: ParkingRepository): ParkingService {
	return {
		listCarportApplications: (params) => repository.listCarportApplications(params),
		listCarports: (params) => repository.listCarports(params),
		listOwnerVehicles: (params) => repository.listOwnerVehicles(params),
		listParkingLots: (params) => repository.listParkingLots(params),
		listLegacyOwnerCars: (params) => repository.listLegacyOwnerCars(params),
		listLegacyParkingAreas: () => repository.listLegacyParkingAreas(),
		listLegacyParkingAreaMachines: (paNum) => repository.listLegacyParkingAreaMachines(paNum),
		getLegacyBarrierCloudVideo: (machineId) => repository.getLegacyBarrierCloudVideo(machineId),
		listLegacyTempCars: (params) => repository.listLegacyTempCars(params),
		listLegacyParkingCoupons: () => repository.listLegacyParkingCoupons(),
		getLegacyTempCarFeeOrder: (params) => repository.getLegacyTempCarFeeOrder(params),
		listLegacyCarInoutDetails: (params) => repository.listLegacyCarInoutDetails(params),
		listLegacyCarInoutPayments: (params) => repository.listLegacyCarInoutPayments(params),
	};
}
