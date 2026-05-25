import type { AppointmentRepository } from "./repository";
import type { AppointmentConfirmInput, AppointmentListQuery } from "./types";

export interface AppointmentService {
	listAppointmentOrders(query: AppointmentListQuery): ReturnType<AppointmentRepository["listAppointmentOrders"]>;
	getConfirmGuardDecision(input: AppointmentConfirmInput): ReturnType<AppointmentRepository["getConfirmGuardDecision"]>;
}

export function createAppointmentService(repository: AppointmentRepository): AppointmentService {
	return {
		listAppointmentOrders: (query) => repository.listAppointmentOrders(query),
		getConfirmGuardDecision: (input) => repository.getConfirmGuardDecision(input),
	};
}
