export type AppointmentOrderState = "WAIT_CONFIRM" | "CONFIRMED";

export interface AppointmentOrder {
	orderId: string;
	timeId: string;
	spaceName: string;
	appointmentDate: string;
	hours: string;
	personName: string;
	personTel: string;
	createTime: string;
	state: AppointmentOrderState;
}

export interface AppointmentListQuery {
	page: number;
	row: number;
	communityId?: string;
	timeId?: string;
}

export interface AppointmentListResult {
	list: AppointmentOrder[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

export interface AppointmentConfirmInput {
	[key: string]: unknown;
}

export interface AppointmentGuardDecision {
	code: 409;
	message: string;
	errorCode: "PHASE7_MUTATION_GUARDED";
}
