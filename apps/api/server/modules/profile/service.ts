import type { ProfileRepository } from "./repository";
import type { ProfileAttendanceQuery, ProfileCommunityQuery } from "./types";

export interface ProfileService {
	getUserProfile(): ReturnType<ProfileRepository["getUserProfile"]>;
	listCommunities(query: ProfileCommunityQuery): ReturnType<ProfileRepository["listCommunities"]>;
	listAttendanceRecords(query: ProfileAttendanceQuery): ReturnType<ProfileRepository["listAttendanceRecords"]>;
}

export function createProfileService(repository: ProfileRepository): ProfileService {
	return {
		getUserProfile: () => repository.getUserProfile(),
		listCommunities: (query) => repository.listCommunities(query),
		listAttendanceRecords: (query) => repository.listAttendanceRecords(query),
	};
}
