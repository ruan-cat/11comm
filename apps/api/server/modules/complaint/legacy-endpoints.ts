import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getComplaintRuntime } from "./runtime";

export const complaintLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/auditUser.listAuditComplaints",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getComplaintRuntime(event).legacyAdapter.listAuditComplaints(mergeInput(query, body)),
	},
	{
		url: "/app/auditUser.listAuditHistoryComplaints",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getComplaintRuntime(event).legacyAdapter.listAuditHistoryComplaints(mergeInput(query, body)),
	},
	{
		url: "/app/complaint.listComplaintEvent",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getComplaintRuntime(event).legacyAdapter.listComplaintEvent(mergeInput(query, body)),
	},
	{
		url: "/app/complaintAppraise.listComplaintAppraise",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getComplaintRuntime(event).legacyAdapter.listComplaintAppraise(mergeInput(query, body)),
	},
	{
		url: "/app/complaint",
		method: "POST",
		handler: ({ query, body, event }) =>
			getComplaintRuntime(event).legacyAdapter.saveComplaint(mergeInput(query, body)),
	},
	{
		url: "/app/complaint.auditComplaint",
		method: "POST",
		handler: ({ query, body, event }) =>
			getComplaintRuntime(event).legacyAdapter.auditComplaint(mergeInput(query, body)),
	},
	{
		url: "/app/complaintAppraise.replyComplaintAppraise",
		method: "POST",
		handler: ({ query, body, event }) =>
			getComplaintRuntime(event).legacyAdapter.replyComplaintAppraise(mergeInput(query, body)),
	},
];
