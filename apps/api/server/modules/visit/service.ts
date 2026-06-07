import type { VisitRepository } from "./repository";
import type { VisitDetailQuery, VisitListQuery } from "./types";

export interface VisitService {
	listVisits(query: VisitListQuery): ReturnType<VisitRepository["listVisits"]>;
	getVisitDetail(query: VisitDetailQuery): ReturnType<VisitRepository["getVisitDetail"]>;
	getWriteGuardDecision(
		endpoint: string,
		input: Record<string, unknown>,
	): ReturnType<VisitRepository["getWriteGuardDecision"]>;
}

export function createVisitService(repository: VisitRepository): VisitService {
	return {
		listVisits: (query) => repository.listVisits(query),
		getVisitDetail: (query) => repository.getVisitDetail(query),
		getWriteGuardDecision: (endpoint, input) => repository.getWriteGuardDecision(endpoint, input),
	};
}
