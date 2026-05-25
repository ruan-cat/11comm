export type ActivityStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export interface ActivityItem {
	activitiesId: string;
	title: string;
	userName: string;
	avatar?: string;
	startTime: string;
	endTime: string;
	context: string;
	headerImg?: string;
	src?: string;
	communityId: string;
	createTime: string;
	updateTime: string;
	status: ActivityStatus;
	viewCount: number;
	likeCount: number;
	readCount: number;
	collectCount: number;
	formattedStartTime?: string;
	formattedCreateTime?: string;
	formattedEndTime?: string;
}

export interface ActivityListQuery {
	page: number;
	row: number;
	activitiesId?: string;
	communityId?: string;
	status?: ActivityStatus;
	keyword?: string;
}

export interface ActivityListResult {
	activitiess: ActivityItem[];
	total: number;
	page: number;
	row: number;
}
