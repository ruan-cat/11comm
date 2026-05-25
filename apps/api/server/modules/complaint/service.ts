import type { ComplaintRepository } from "./repository";
import type { ComplaintDetailListQuery, ComplaintListQuery, ComplaintWriteInput } from "./types";

export interface ComplaintService {
	listAuditComplaints(query: ComplaintListQuery): ReturnType<ComplaintRepository["listAuditComplaints"]>;
	listAuditHistoryComplaints(query: ComplaintListQuery): ReturnType<ComplaintRepository["listAuditHistoryComplaints"]>;
	listComplaintEvent(query: ComplaintDetailListQuery): ReturnType<ComplaintRepository["listComplaintEvent"]>;
	listComplaintAppraise(query: ComplaintDetailListQuery): ReturnType<ComplaintRepository["listComplaintAppraise"]>;
	getWriteGuardDecision(
		endpoint: string,
		input: ComplaintWriteInput,
	): ReturnType<ComplaintRepository["getWriteGuardDecision"]>;
}

export function createComplaintService(repository: ComplaintRepository): ComplaintService {
	return {
		listAuditComplaints: (query) => repository.listAuditComplaints(query),
		listAuditHistoryComplaints: (query) => repository.listAuditHistoryComplaints(query),
		listComplaintEvent: (query) => repository.listComplaintEvent(query),
		listComplaintAppraise: (query) => repository.listComplaintAppraise(query),
		getWriteGuardDecision: (endpoint, input) => repository.getWriteGuardDecision(endpoint, input),
	};
}
