import type { ParkingRepository } from "./repository";
import type {
	ListCarportApplicationsParams,
	ListCarportsParams,
	ListOwnerVehiclesParams,
	ListParkingLotsParams,
} from "./types";

export interface ParkingService {
	listCarportApplications: (
		params: ListCarportApplicationsParams,
	) => ReturnType<ParkingRepository["listCarportApplications"]>;
	listCarports: (params: ListCarportsParams) => ReturnType<ParkingRepository["listCarports"]>;
	listOwnerVehicles: (params: ListOwnerVehiclesParams) => ReturnType<ParkingRepository["listOwnerVehicles"]>;
	listParkingLots: (params: ListParkingLotsParams) => ReturnType<ParkingRepository["listParkingLots"]>;
}

export function createParkingService(repository: ParkingRepository): ParkingService {
	return {
		listCarportApplications: (params) => repository.listCarportApplications(params),
		listCarports: (params) => repository.listCarports(params),
		listOwnerVehicles: (params) => repository.listOwnerVehicles(params),
		listParkingLots: (params) => repository.listParkingLots(params),
	};
}
