import type {
	Complaint,
	ComplaintAppraise,
	ComplaintAppraiseListResult,
	ComplaintDetailListQuery,
	ComplaintEvent,
	ComplaintEventListResult,
	ComplaintGuardDecision,
	ComplaintHistoryListResult,
	ComplaintListQuery,
	ComplaintListResult,
	ComplaintState,
	ComplaintTypeCd,
	ComplaintWriteInput,
} from "./types";

export interface ComplaintRepository {
	listAuditComplaints(query: ComplaintListQuery): Promise<ComplaintListResult>;
	listAuditHistoryComplaints(query: ComplaintListQuery): Promise<ComplaintHistoryListResult>;
	listComplaintEvent(query: ComplaintDetailListQuery): Promise<ComplaintEventListResult>;
	listComplaintAppraise(query: ComplaintDetailListQuery): Promise<ComplaintAppraiseListResult>;
	getWriteGuardDecision(endpoint: string, input: ComplaintWriteInput): Promise<ComplaintGuardDecision>;
}

const complaintRows: Complaint[] = Array.from({ length: 40 }, (_, index) => createComplaint(index));
const complaintEvents: ComplaintEvent[] = complaintRows
	.slice(0, 15)
	.flatMap((complaint, index) => [createCreateEvent(complaint, index), createHandleEvent(complaint, index)]);
const complaintAppraises: ComplaintAppraise[] = complaintRows.slice(0, 15).map((complaint, index) => ({
	appraiseId: `APPR_${String(index + 1).padStart(3, "0")}`,
	complaintId: complaint.complaintId,
	communityId: complaint.communityId,
	context: "Handled promptly and service was satisfactory",
	score: 5,
	state: "C",
	stateName: "Replied",
	replyContext: "Thank you for the feedback",
	createTime: `2026-03-${String((index % 20) + 1).padStart(2, "0")} 14:30:00`,
	createUserName: `Resident ${String(index + 1).padStart(2, "0")}`,
}));

export function createComplaintRepository(): ComplaintRepository {
	return {
		async listAuditComplaints(query) {
			void query.process;
			return paginateTodoComplaints(
				complaintRows.filter((item) => item.taskId),
				query.page,
				query.row,
			);
		},

		async listAuditHistoryComplaints(query) {
			void query.process;
			const result = paginateComplaints(complaintRows, query.page, query.row);
			return {
				complaints: result.list.map((item) => ({
					...item,
					createTime: item.createTime.slice(5, 10),
				})),
				total: result.total,
				page: result.page,
				records: result.pageSize,
			};
		},

		async listComplaintEvent(query) {
			const filtered = complaintEvents.filter((item) => item.complaintId === query.complaintId);
			const result = paginateItems(filtered, query.page, query.row);
			return {
				data: result.list,
				total: result.total,
			};
		},

		async listComplaintAppraise(query) {
			const filtered = complaintAppraises.filter((item) => item.complaintId === query.complaintId);
			const result = paginateItems(filtered, query.page, query.row);
			return {
				data: result.list,
				total: result.total,
			};
		},

		async getWriteGuardDecision(endpoint, input) {
			void input;
			return {
				code: 409,
				message: `Phase7 mutation guard blocked ${endpoint}; complaint writes require controlled write, read-back, rollback, and guard restore evidence.`,
				errorCode: "PHASE7_MUTATION_GUARDED",
			};
		},
	};
}

function createComplaint(index: number): Complaint {
	const id = String(index + 1).padStart(3, "0");
	const typeCd = toComplaintTypeCd(index);
	const state = toComplaintState(index);
	const day = String((index % 20) + 1).padStart(2, "0");

	return {
		complaintId: `COMP_${id}`,
		communityId: "COMM_001",
		storeId: "STORE_001",
		userId: `USER_${id}`,
		typeCd,
		typeName: typeCd === "809001" ? "Complaint" : "Suggestion",
		complaintName: `Resident ${id}`,
		tel: `1380000${String(index + 1).padStart(4, "0")}`,
		roomId: `ROOM_${id}`,
		roomName: `Building ${Math.floor(index / 4) + 1} Unit ${(index % 4) + 1} Room ${100 + index}`,
		floorNum: String((index % 10) + 1),
		unitNum: String((index % 4) + 1),
		roomNum: String(100 + index),
		context: `Complaint content ${index + 1}`,
		state,
		stateName: state === "1100" ? "Handled" : "Pending",
		createTime: `2026-03-${day} ${String(8 + (index % 9)).padStart(2, "0")}:00:00`,
		taskId: `TASK_COMP_${id}`,
		photos: [],
	};
}

function toComplaintTypeCd(index: number): ComplaintTypeCd {
	return index % 3 === 0 ? "809002" : "809001";
}

function toComplaintState(index: number): ComplaintState {
	return index % 2 === 0 ? "1200" : "1100";
}

function createCreateEvent(complaint: Complaint, index: number): ComplaintEvent {
	return {
		eventId: `EVENT_${String(index + 1).padStart(3, "0")}_CREATE`,
		complaintId: complaint.complaintId,
		communityId: complaint.communityId,
		eventType: "1000",
		eventTypeName: "Create",
		createUserId: complaint.userId,
		createUserName: complaint.complaintName,
		createTime: complaint.createTime,
		remark: complaint.context,
	};
}

function createHandleEvent(complaint: Complaint, index: number): ComplaintEvent {
	return {
		eventId: `EVENT_${String(index + 1).padStart(3, "0")}_HANDLE`,
		complaintId: complaint.complaintId,
		communityId: complaint.communityId,
		eventType: "1001",
		eventTypeName: "Handle",
		createUserId: "STAFF_001",
		createUserName: "Property Staff",
		createTime: `2026-03-${String((index % 20) + 1).padStart(2, "0")} 15:00:00`,
		remark: "Handled by property staff",
	};
}

function paginateTodoComplaints(items: Complaint[], page: number, pageSize: number): ComplaintListResult {
	const result = paginateComplaints(items, page, pageSize);
	return {
		data: result.list,
		total: result.total,
		page: result.page,
		records: result.pageSize,
	};
}

function paginateComplaints(items: Complaint[], page: number, pageSize: number) {
	return paginateItems(items, page, pageSize);
}

function paginateItems<T>(items: T[], page: number, pageSize: number) {
	const start = (page - 1) * pageSize;
	const end = start + pageSize;
	return {
		list: cloneValue(items.slice(start, end)),
		total: items.length,
		page,
		pageSize,
	};
}

function cloneValue<T>(value: T): T {
	return structuredClone(value);
}
