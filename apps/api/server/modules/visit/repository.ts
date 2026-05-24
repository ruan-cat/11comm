import type { PaginationResult, VisitDetail, VisitDetailQuery, VisitListQuery, VisitRecord } from "./types";

export interface VisitRepository {
	listVisits(query: VisitListQuery): Promise<PaginationResult<VisitRecord>>;
	getVisitDetail(query: VisitDetailQuery): Promise<PaginationResult<VisitDetail>>;
}

const visitDetails: VisitDetail[] = [
	createVisit({
		index: 1,
		name: "Alice Visitor",
		ownerName: "Owner Zhang",
		roomName: "1-1-101",
		state: "0",
		stateName: "Pending",
		visitCase: "Family visit",
	}),
	createVisit({
		index: 2,
		name: "Bob Visitor",
		ownerName: "Owner Lee",
		roomName: "1-2-102",
		state: "1",
		stateName: "Approved",
		visitCase: "Delivery",
	}),
	createVisit({
		index: 3,
		name: "Carol Visitor",
		ownerName: "Owner Wang",
		roomName: "2-1-103",
		state: "2",
		stateName: "Rejected",
		visitCase: "Business visit",
	}),
	createVisit({
		index: 4,
		name: "David Visitor",
		ownerName: "Owner Chen",
		roomName: "2-2-104",
		state: "0",
		stateName: "Pending",
		visitCase: "Friend visit",
	}),
	createVisit({
		index: 5,
		name: "Eve Visitor",
		ownerName: "Owner Liu",
		roomName: "3-1-105",
		state: "1",
		stateName: "Approved",
		visitCase: "Maintenance visit",
	}),
	createVisit({
		index: 6,
		name: "Frank Visitor",
		ownerName: "Owner Zhao",
		roomName: "3-2-106",
		state: "2",
		stateName: "Rejected",
		visitCase: "Other",
	}),
];

export function createVisitRepository(): VisitRepository {
	return {
		async listVisits(query) {
			let filtered = [...visitDetails];
			if (query.state) {
				filtered = filtered.filter((item) => item.state === query.state);
			}
			if (query.visitId) {
				filtered = filtered.filter((item) => item.visitId === query.visitId);
			}

			const records = filtered.map(({ departureTime: _departureTime, visitCase: _visitCase, ...record }) => record);
			return paginate(records, query.page, query.row);
		},

		async getVisitDetail(query) {
			return paginate(
				visitDetails.filter((item) => item.visitId === query.visitId),
				query.page,
				query.row,
			);
		},
	};
}

function createVisit(input: {
	index: number;
	name: string;
	ownerName: string;
	roomName: string;
	state: string;
	stateName: string;
	visitCase: string;
}): VisitDetail {
	const id = String(input.index).padStart(5, "0");
	const compactId = String(input.index).padStart(4, "0");
	return {
		visitId: `VISIT_${id}`,
		name: input.name,
		phoneNumber: `1380000${compactId}`,
		ownerName: input.ownerName,
		roomName: input.roomName,
		carNum: `CAR${compactId}`,
		visitTime: `2026-05-24 ${String(8 + input.index).padStart(2, "0")}:00:00`,
		state: input.state,
		stateName: input.stateName,
		taskId: input.state === "0" ? `TASK_V_${compactId}` : undefined,
		departureTime: `2026-05-24 ${String(10 + input.index).padStart(2, "0")}:00:00`,
		visitCase: input.visitCase,
	};
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginationResult<T> {
	const start = (page - 1) * pageSize;
	const end = start + pageSize;
	return {
		list: cloneValue(items.slice(start, end)),
		total: items.length,
		page,
		pageSize,
		hasMore: end < items.length,
	};
}

function cloneValue<T>(value: T): T {
	return structuredClone(value);
}
