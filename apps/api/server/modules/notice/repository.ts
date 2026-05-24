import type { NoticeItem, NoticeListQuery, NoticeListResult } from "./types";

export interface NoticeRepository {
	listNotices(query: NoticeListQuery): Promise<NoticeListResult>;
}

const noticeTitles = [
	"Elevator Maintenance Notice",
	"Spring Festival Property Service Arrangement",
	"Fire Safety Inspection Reminder",
	"Underground Garage Lighting Upgrade",
	"Waste Sorting Special Governance Notice",
	"Community Convenience Service Day",
	"Water Supply Facility Maintenance Notice",
	"Public Area Landscaping Arrangement",
	"Rainy Season Flood Prevention Reminder",
	"Civilized Pet Ownership Proposal",
	"Property Fee Payment Reminder",
	"Night Noise Governance Notice",
] as const;

const noticeRows: NoticeItem[] = Array.from({ length: 36 }, (_, index) => {
	const title = noticeTitles[index % noticeTitles.length];
	const day = String(24 - (index % 24)).padStart(2, "0");
	const hour = String(9 + (index % 8)).padStart(2, "0");

	return {
		noticeId: `NOTICE_${String(index + 1).padStart(4, "0")}`,
		title: index < 8 ? `${title} - Important` : title,
		context: `<p>Dear resident, ${title.toLowerCase()} has been published. Please follow the property service arrangement.</p>`,
		startTime: `2026-05-${day} ${hour}:30:00`,
		timeStr: `2026-05-${day} ${hour}:30`,
		noticeTypeCd: index % 5 === 0 ? "1002" : "1001",
		communityId: index % 7 === 0 ? "COMM_002" : "COMM_001",
	};
});

noticeRows[0] = {
	...noticeRows[0],
	noticeTypeCd: "1001",
	communityId: "COMM_001",
};
noticeRows[1] = {
	...noticeRows[1],
	noticeTypeCd: "1001",
	communityId: "COMM_001",
};

export function createNoticeRepository(): NoticeRepository {
	return {
		async listNotices(query) {
			let filtered = [...noticeRows];

			if (query.communityId) {
				filtered = filtered.filter((item) => item.communityId === query.communityId);
			}
			if (query.noticeTypeCd) {
				filtered = filtered.filter((item) => item.noticeTypeCd === query.noticeTypeCd);
			}
			if (query.noticeId) {
				filtered = filtered.filter((item) => item.noticeId === query.noticeId);
			}
			if (query.titleLike) {
				filtered = filtered.filter((item) => item.title.includes(query.titleLike ?? ""));
			}

			const start = (query.page - 1) * query.row;
			const end = start + query.row;

			return {
				notices: cloneValue(filtered.slice(start, end)),
				total: filtered.length,
				page: query.page,
				row: query.row,
			};
		},
	};
}

function cloneValue<T>(value: T): T {
	return structuredClone(value);
}
