import type { VideoRepository } from "./repository";
import type { MonitorMachineQuery, PaginationQuery, VideoPlayUrlQuery } from "./types";

export interface VideoService {
	listMonitorAreas(query: PaginationQuery): ReturnType<VideoRepository["listMonitorAreas"]>;
	listStaffMonitorMachines(query: MonitorMachineQuery): ReturnType<VideoRepository["listStaffMonitorMachines"]>;
	getPlayVideoUrl(query: VideoPlayUrlQuery): ReturnType<VideoRepository["getPlayVideoUrl"]>;
}

export function createVideoService(repository: VideoRepository): VideoService {
	return {
		listMonitorAreas: (query) => repository.listMonitorAreas(query),
		listStaffMonitorMachines: (query) => repository.listStaffMonitorMachines(query),
		getPlayVideoUrl: (query) => repository.getPlayVideoUrl(query),
	};
}
