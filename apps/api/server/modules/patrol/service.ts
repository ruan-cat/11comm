import type { PatrolRepository } from "./repository";
import type {
	ListPatrolItemsParams,
	ListPatrolPathsParams,
	ListPatrolPlansParams,
	ListPatrolPointsParams,
} from "./types";

export interface PatrolService {
	listPatrolItems: (params: ListPatrolItemsParams) => ReturnType<PatrolRepository["listPatrolItems"]>;
	listPatrolPaths: (params: ListPatrolPathsParams) => ReturnType<PatrolRepository["listPatrolPaths"]>;
	listPatrolPlans: (params: ListPatrolPlansParams) => ReturnType<PatrolRepository["listPatrolPlans"]>;
	listPatrolPoints: (params: ListPatrolPointsParams) => ReturnType<PatrolRepository["listPatrolPoints"]>;
}

export function createPatrolService(repository: PatrolRepository): PatrolService {
	return {
		listPatrolItems: (params) => repository.listPatrolItems(params),
		listPatrolPaths: (params) => repository.listPatrolPaths(params),
		listPatrolPlans: (params) => repository.listPatrolPlans(params),
		listPatrolPoints: (params) => repository.listPatrolPoints(params),
	};
}
