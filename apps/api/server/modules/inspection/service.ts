import type { InspectionRepository } from "./repository";
import type { InspectionItemTitleQuery, InspectionTaskDetailQuery, InspectionTaskQuery } from "./types";

export interface InspectionService {
	listTodayReports(params: {
		communityId?: string;
		queryTime?: string;
	}): ReturnType<InspectionRepository["listTodayReports"]>;
	listStaffs(params: { communityId?: string }): ReturnType<InspectionRepository["listStaffs"]>;
	listInspectionItemTitles(
		query: InspectionItemTitleQuery,
	): ReturnType<InspectionRepository["listInspectionItemTitles"]>;
	listInspectionTasks(query: InspectionTaskQuery): ReturnType<InspectionRepository["listInspectionTasks"]>;
	listInspectionTaskDetails(
		query: InspectionTaskDetailQuery,
	): ReturnType<InspectionRepository["listInspectionTaskDetails"]>;
}

export function createInspectionService(repository: InspectionRepository): InspectionService {
	return {
		listTodayReports: (params) => repository.listTodayReports(params),
		listStaffs: (params) => repository.listStaffs(params),
		listInspectionItemTitles: (query) => repository.listInspectionItemTitles(query),
		listInspectionTasks: (query) => repository.listInspectionTasks(query),
		listInspectionTaskDetails: (query) => repository.listInspectionTaskDetails(query),
	};
}
