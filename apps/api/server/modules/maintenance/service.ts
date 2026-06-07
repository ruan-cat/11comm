import type { MaintenanceRepository } from "./repository";
import type { MaintenanceTaskQuery } from "./types";

export interface MaintenanceService {
	listTasks(query: MaintenanceTaskQuery): ReturnType<MaintenanceRepository["listTasks"]>;
	getTask(taskId: string): ReturnType<MaintenanceRepository["getTask"]>;
	listTaskDetails(taskId: string): ReturnType<MaintenanceRepository["listTaskDetails"]>;
}

export function createMaintenanceService(repository: MaintenanceRepository): MaintenanceService {
	return {
		listTasks: (query) => repository.listTasks(query),
		getTask: (taskId) => repository.getTask(taskId),
		listTaskDetails: (taskId) => repository.listTaskDetails(taskId),
	};
}
