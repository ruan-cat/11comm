import type { ActivityRepository } from "./repository";
import type { ActivityListQuery } from "./types";

export interface ActivityService {
	listActivities(query: ActivityListQuery): ReturnType<ActivityRepository["listActivities"]>;
}

export function createActivityService(repository: ActivityRepository): ActivityService {
	return {
		listActivities: (query) => repository.listActivities(query),
	};
}
