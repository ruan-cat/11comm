export interface ProfileInfo {
	userId: string;
	userName: string;
	storeId: string;
	storeName: string;
	avatar: string;
	currentCommunityId: string;
	currentCommunityName: string;
	version: string;
}

export interface CommunityInfo {
	communityId: string;
	name: string;
	address: string;
}

export interface AttendanceDetail {
	specCd: "1001" | "2002";
	checkTime: number;
	state: string;
	stateName: string;
}

export interface AttendanceDayRecord {
	taskDay: number;
	attendanceClassesTaskDetails: AttendanceDetail[];
}

export interface ProfileCommunityQuery {
	keyword?: string;
}

export interface ProfileAttendanceQuery {
	month: string;
}
