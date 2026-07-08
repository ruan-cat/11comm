import type { PropertyApplicationRepository } from "./repository";
import type {
	ApplicationRecordDetailQuery,
	ApplyRoomDiscountListQuery,
	ApplyRoomDiscountRecordQuery,
	FeeDiscountQuery,
} from "./types";

export interface PropertyApplicationService {
	listFeeDiscounts(query: FeeDiscountQuery): ReturnType<PropertyApplicationRepository["listFeeDiscounts"]>;
	listApplicationRecordDetails(
		query: ApplicationRecordDetailQuery,
	): ReturnType<PropertyApplicationRepository["listApplicationRecordDetails"]>;
	getApplicationById(id: string): ReturnType<PropertyApplicationRepository["getApplicationById"]>;
	getApplicationList(
		query: ApplyRoomDiscountListQuery,
	): ReturnType<PropertyApplicationRepository["getApplicationList"]>;
	getRecordList(query: ApplyRoomDiscountRecordQuery): ReturnType<PropertyApplicationRepository["getRecordList"]>;
}

export function createPropertyApplicationService(
	repository: PropertyApplicationRepository,
): PropertyApplicationService {
	return {
		listFeeDiscounts: (query) => repository.listFeeDiscounts(query),
		listApplicationRecordDetails: (query) => repository.listApplicationRecordDetails(query),
		getApplicationById: (id) => repository.getApplicationById(id),
		getApplicationList: (query) => repository.getApplicationList(query),
		getRecordList: (query) => repository.getRecordList(query),
	};
}
