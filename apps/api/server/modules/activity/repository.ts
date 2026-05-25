import type { ActivityItem, ActivityListQuery, ActivityListResult, ActivityStatus } from "./types";

export interface ActivityRepository {
	listActivities(query: ActivityListQuery): Promise<ActivityListResult>;
}

const activityRows: ActivityItem[] = [
	createActivity(1, "COMM_001", "UPCOMING", "Garden Yoga Morning", "Alice Green", "garden"),
	createActivity(2, "COMM_001", "ONGOING", "Garden Family Market", "Bob Garden", "family"),
	createActivity(3, "COMM_001", "COMPLETED", "Fire Safety Drill", "Carol Safety", "safety"),
	createActivity(4, "COMM_002", "ONGOING", "Harbor Garden Cleanup", "David Harbor", "garden"),
	createActivity(5, "COMM_002", "CANCELLED", "Parent Child Reading", "Ellen Book", "family"),
	createActivity(6, "COMM_003", "UPCOMING", "Community Culture Salon", "Frank Culture", "culture"),
	createActivity(7, "COMM_001", "ONGOING", "Volunteer Garden Service", "Grace Volunteer", "garden"),
	createActivity(8, "COMM_002", "COMPLETED", "Traffic Safety Class", "Helen Safety", "safety"),
	createActivity(9, "COMM_001", "UPCOMING", "Festival Decoration Workshop", "Ivan Festival", "festival"),
	createActivity(10, "COMM_003", "ONGOING", "Low Carbon Garden Talk", "Jenny Garden", "environment"),
	createActivity(11, "COMM_001", "COMPLETED", "Health Lecture", "Kevin Health", "health"),
	createActivity(12, "COMM_002", "UPCOMING", "Neighbor Social Night", "Laura Social", "social"),
];

export function createActivityRepository(): ActivityRepository {
	return {
		async listActivities(query) {
			let filtered = [...activityRows];

			if (query.activitiesId) {
				filtered = filtered.filter((item) => item.activitiesId === query.activitiesId);
			}
			if (query.communityId) {
				filtered = filtered.filter((item) => item.communityId === query.communityId);
			}
			if (query.status) {
				filtered = filtered.filter((item) => item.status === query.status);
			}
			if (query.keyword) {
				const keyword = query.keyword.toLowerCase();
				filtered = filtered.filter((item) =>
					`${item.title} ${item.context} ${item.userName}`.toLowerCase().includes(keyword),
				);
			}

			const start = (query.page - 1) * query.row;
			const end = start + query.row;

			return {
				activitiess: cloneValue(filtered.slice(start, end)),
				total: filtered.length,
				page: query.page,
				row: query.row,
			};
		},
	};
}

function createActivity(
	index: number,
	communityId: string,
	status: ActivityStatus,
	title: string,
	userName: string,
	category: string,
): ActivityItem {
	const id = String(index).padStart(3, "0");
	const day = String(24 - index).padStart(2, "0");
	const startHour = String(8 + (index % 6)).padStart(2, "0");
	const endHour = String(10 + (index % 6)).padStart(2, "0");

	return {
		activitiesId: `ACT_${id}`,
		title,
		userName,
		avatar: `https://example.test/activity/avatar-${id}.png`,
		startTime: `2026-05-${day} ${startHour}:00:00`,
		endTime: `2026-05-${day} ${endHour}:00:00`,
		context: `<p>${title} compat seed for ${category} activity in ${communityId}.</p>`,
		headerImg: `${category}_header_${id}.jpg`,
		src: `https://example.test/activity/${category}-${id}.jpg`,
		communityId,
		createTime: `2026-05-${day} 07:30:00`,
		updateTime: `2026-05-${day} 07:45:00`,
		status,
		viewCount: index * 10,
		likeCount: index,
		readCount: index * 8,
		collectCount: Math.floor(index / 2),
		formattedStartTime: `2026-05-${day} ${startHour}:00`,
		formattedCreateTime: `2026-05-${day} 07:30`,
		formattedEndTime: `2026-05-${day} ${endHour}:00`,
	};
}

function cloneValue<T>(value: T): T {
	return structuredClone(value);
}
