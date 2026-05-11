import type { CommunityRepository } from "./repository";
import type {
	ListBuildingSpaceStructureDiagramsParams,
	ListHandingBusinessesParams,
	ListHouseDecorationsParams,
	ListMyCommunitiesParams,
	ListNoticesParams,
	ListParkingSpaceStructureDiagramsParams,
	ListPropertyRegistersParams,
} from "./types";

export interface CommunityService {
	listBuildingSpaceStructures: (
		params: ListBuildingSpaceStructureDiagramsParams,
	) => ReturnType<CommunityRepository["listBuildingSpaceStructures"]>;
	listHandingBusinesses: (
		params: ListHandingBusinessesParams,
	) => ReturnType<CommunityRepository["listHandingBusinesses"]>;
	listHouseDecorations: (params: ListHouseDecorationsParams) => ReturnType<CommunityRepository["listHouseDecorations"]>;
	listMyCommunities: (params: ListMyCommunitiesParams) => ReturnType<CommunityRepository["listMyCommunities"]>;
	listNotices: (params: ListNoticesParams) => ReturnType<CommunityRepository["listNotices"]>;
	listParkingSpaceStructures: (
		params: ListParkingSpaceStructureDiagramsParams,
	) => ReturnType<CommunityRepository["listParkingSpaceStructures"]>;
	listPropertyRegisters: (
		params: ListPropertyRegistersParams,
	) => ReturnType<CommunityRepository["listPropertyRegisters"]>;
}

export function createCommunityService(repository: CommunityRepository): CommunityService {
	return {
		listBuildingSpaceStructures: (params) => repository.listBuildingSpaceStructures(params),
		listHandingBusinesses: (params) => repository.listHandingBusinesses(params),
		listHouseDecorations: (params) => repository.listHouseDecorations(params),
		listMyCommunities: (params) => repository.listMyCommunities(params),
		listNotices: (params) => repository.listNotices(params),
		listParkingSpaceStructures: (params) => repository.listParkingSpaceStructures(params),
		listPropertyRegisters: (params) => repository.listPropertyRegisters(params),
	};
}
