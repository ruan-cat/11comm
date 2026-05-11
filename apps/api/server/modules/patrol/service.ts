import type { PatrolRepository } from "./repository";
import type {
	ListPatrolDetailsParams,
	ListPatrolItemsParams,
	ListPatrolPathsParams,
	ListPatrolPlansParams,
	ListPatrolPointsParams,
	ListPatrolTasksParams,
} from "./types";

export interface PatrolService {
	listPatrolItems: (params: ListPatrolItemsParams) => ReturnType<PatrolRepository["listPatrolItems"]>;
	listPatrolPaths: (params: ListPatrolPathsParams) => ReturnType<PatrolRepository["listPatrolPaths"]>;
	listPatrolPlans: (params: ListPatrolPlansParams) => ReturnType<PatrolRepository["listPatrolPlans"]>;
	listPatrolPoints: (params: ListPatrolPointsParams) => ReturnType<PatrolRepository["listPatrolPoints"]>;
	listPatrolTasks: (params: ListPatrolTasksParams) => ReturnType<PatrolRepository["listPatrolTasks"]>;
	listPatrolDetails: (params: ListPatrolDetailsParams) => ReturnType<PatrolRepository["listPatrolDetails"]>;
}

export function createPatrolService(repository: PatrolRepository): PatrolService {
	return {
		listPatrolItems: (params) => repository.listPatrolItems(params),
		listPatrolPaths: (params) => repository.listPatrolPaths(params),
		listPatrolPlans: (params) => repository.listPatrolPlans(params),
		listPatrolPoints: (params) => repository.listPatrolPoints(params),
		listPatrolTasks: (params) => repository.listPatrolTasks(params),
		listPatrolDetails: (params) => repository.listPatrolDetails(params),
	};
}
