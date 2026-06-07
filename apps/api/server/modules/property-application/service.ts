import type { PropertyApplicationRepository } from "./repository";
import type { ApplicationRecordDetailQuery, FeeDiscountQuery } from "./types";

export interface PropertyApplicationService {
	listFeeDiscounts(query: FeeDiscountQuery): ReturnType<PropertyApplicationRepository["listFeeDiscounts"]>;
	listApplicationRecordDetails(
		query: ApplicationRecordDetailQuery,
	): ReturnType<PropertyApplicationRepository["listApplicationRecordDetails"]>;
}

export function createPropertyApplicationService(
	repository: PropertyApplicationRepository,
): PropertyApplicationService {
	return {
		listFeeDiscounts: (query) => repository.listFeeDiscounts(query),
		listApplicationRecordDetails: (query) => repository.listApplicationRecordDetails(query),
	};
}
