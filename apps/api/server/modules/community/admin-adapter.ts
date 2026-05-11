import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { adminSuccess } from "../../shared/runtime/response-builder";
import type { CommunityService } from "./service";
import type {
	BuildingSpaceStructureDiagramListItem,
	HandingBusinessListItem,
	HouseDecorationListItem,
	MyCommunityListItem,
	NoticeListItem,
	ParkingSpaceStructureDiagramListItem,
	PropertyRegisterListItem,
} from "./types";

export function createAdminCommunityAdapter(service: CommunityService) {
	return {
		async listBuildingSpaceStructures(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			communityId?: string;
			buildingNo?: string;
			floorCount?: number;
			unitCount?: number;
		}): Promise<JsonVO<PageDTO<BuildingSpaceStructureDiagramListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listBuildingSpaceStructures({
				pageIndex,
				pageSize,
				communityId: blankToUndefined(input.communityId),
				buildingNo: blankToUndefined(input.buildingNo),
				floorCount: input.floorCount,
				unitCount: input.unitCount,
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listHandingBusinesses(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			communityId?: string;
			businessName?: string;
			handler?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<HandingBusinessListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listHandingBusinesses({
				pageIndex,
				pageSize,
				communityId: blankToUndefined(input.communityId),
				businessName: blankToUndefined(input.businessName),
				handler: blankToUndefined(input.handler),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listHouseDecorations(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			communityId?: string;
			houseId?: string;
			applicant?: string;
			decorationType?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<HouseDecorationListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listHouseDecorations({
				pageIndex,
				pageSize,
				communityId: blankToUndefined(input.communityId),
				houseId: blankToUndefined(input.houseId),
				applicant: blankToUndefined(input.applicant),
				decorationType: blankToUndefined(input.decorationType),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listMyCommunities(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			province?: string;
			city?: string;
			district?: string;
			communityName?: string;
			communityCode?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<MyCommunityListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listMyCommunities({
				pageIndex,
				pageSize,
				province: blankToUndefined(input.province),
				city: blankToUndefined(input.city),
				district: blankToUndefined(input.district),
				communityName: blankToUndefined(input.communityName),
				communityCode: blankToUndefined(input.communityCode),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listNotices(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			title?: string;
			noticeType?: string;
			publisher?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<NoticeListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listNotices({
				pageIndex,
				pageSize,
				title: blankToUndefined(input.title),
				noticeType: blankToUndefined(input.noticeType),
				publisher: blankToUndefined(input.publisher),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listParkingSpaceStructures(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			communityId?: string;
			parkingLotId?: string;
			carportNo?: string;
			carportType?: string;
			status?: string;
			area?: string;
		}): Promise<JsonVO<PageDTO<ParkingSpaceStructureDiagramListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listParkingSpaceStructures({
				pageIndex,
				pageSize,
				communityId: blankToUndefined(input.communityId),
				parkingLotId: blankToUndefined(input.parkingLotId),
				carportNo: blankToUndefined(input.carportNo),
				carportType: blankToUndefined(input.carportType),
				status: blankToUndefined(input.status),
				area: blankToUndefined(input.area),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listPropertyRegisters(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			communityId?: string;
			registerType?: string;
			applicant?: string;
			status?: string;
			propertyName?: string;
			propertyCode?: string;
			registerDate?: string;
			remark?: string;
		}): Promise<JsonVO<PageDTO<PropertyRegisterListItem>>> {
			const pageIndex = toNumber(input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listPropertyRegisters({
				pageIndex,
				pageSize,
				communityId: blankToUndefined(input.communityId),
				registerType: blankToUndefined(input.registerType),
				applicant: blankToUndefined(input.applicant),
				status: blankToUndefined(input.status),
				propertyName: blankToUndefined(input.propertyName),
				propertyCode: blankToUndefined(input.propertyCode),
				registerDate: blankToUndefined(input.registerDate),
				remark: blankToUndefined(input.remark),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
	};
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
