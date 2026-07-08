import type { RenovationRepository } from "./repository";
import type {
	RenovationApplication,
	RenovationListResult,
	RenovationQueryParams,
	RenovationRecord,
	RenovationRecordMedia,
	RenovationRecordQueryParams,
} from "./types";

export interface RenovationService {
	queryRenovations(query: RenovationQueryParams): Promise<RenovationListResult<RenovationApplication>>;
	queryRecords(query: RenovationRecordQueryParams): Promise<RenovationListResult<RenovationRecord>>;
	getRecordMedia(recordId: string): Promise<RenovationRecordMedia[]>;
}

export function createRenovationService(repository: RenovationRepository): RenovationService {
	return {
		queryRenovations: (query) => repository.queryRenovations(query),
		queryRecords: (query) => repository.queryRecords(query),
		getRecordMedia: (recordId) => repository.getRecordMedia(recordId),
	};
}
