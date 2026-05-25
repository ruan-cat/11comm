import type {
	AppointmentConfirmInput,
	AppointmentGuardDecision,
	AppointmentListQuery,
	AppointmentListResult,
	AppointmentOrder,
	AppointmentOrderState,
} from "./types";

export interface AppointmentRepository {
	listAppointmentOrders(query: AppointmentListQuery): Promise<AppointmentListResult>;
	getConfirmGuardDecision(input: AppointmentConfirmInput): Promise<AppointmentGuardDecision>;
}

const appointmentRows: AppointmentOrder[] = Array.from({ length: 48 }, (_, index) => createAppointmentOrder(index));

const guardedDecision: AppointmentGuardDecision = {
	code: 409,
	message:
		"Phase7 mutation guard blocked communitySpace.saveCommunitySpaceConfirmOrder; appointment confirm writes require controlled write, read-back, rollback, and guard restore evidence.",
	errorCode: "PHASE7_MUTATION_GUARDED",
};

export function createAppointmentRepository(): AppointmentRepository {
	return {
		async listAppointmentOrders(query) {
			let filtered = [...appointmentRows];

			if (query.timeId) {
				filtered = filtered.filter((item) => item.timeId.includes(query.timeId ?? ""));
			}

			return paginate(filtered, query.page, query.row);
		},

		async getConfirmGuardDecision(input) {
			void input;
			return guardedDecision;
		},
	};
}

function createAppointmentOrder(index: number): AppointmentOrder {
	const baseDay = (index % 20) + 1;
	const startHour = 8 + (index % 8);
	const id = String(index + 1).padStart(5, "0");
	const compactIndex = String(index).padStart(4, "0");

	return {
		orderId: `ORDER_${id}`,
		timeId: `HEXIAO_${100000 + index}`,
		spaceName: index % 2 === 0 ? "Badminton Hall" : "Basketball Court",
		appointmentDate: `2026-03-${String(baseDay).padStart(2, "0")}`,
		hours: `${String(startHour).padStart(2, "0")}:00-${String(startHour + 1).padStart(2, "0")}:00`,
		personName: index % 2 === 0 ? "Zhang Resident" : "Li Resident",
		personTel: `1380000${compactIndex}`,
		createTime: `2026-03-${String(baseDay).padStart(2, "0")} ${String(7 + (index % 9)).padStart(2, "0")}:30:00`,
		state: toAppointmentState(index),
	};
}

function toAppointmentState(index: number): AppointmentOrderState {
	return index % 3 === 0 ? "CONFIRMED" : "WAIT_CONFIRM";
}

function paginate(items: AppointmentOrder[], page: number, pageSize: number): AppointmentListResult {
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
