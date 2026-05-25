export type ContactDepartment =
	| "Property Management"
	| "Security"
	| "Cleaning"
	| "Maintenance"
	| "Customer Service"
	| "Finance";

export type EmergencyContactPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface Contact {
	contactId: string;
	name: string;
	position: string;
	department: ContactDepartment | "External Contact";
	phone: string;
	email?: string;
	workTime?: string;
	avatar?: string;
	description?: string;
	isOnline: boolean;
}

export interface EmergencyContact extends Contact {
	priority: EmergencyContactPriority;
}

export interface ContactListQuery {
	page: number;
	row: number;
	department?: string;
	keyword?: string;
	isOnline?: boolean;
}

export interface ContactListResult {
	contacts: Contact[];
	total: number;
	page: number;
	row: number;
}

export interface DepartmentSummary {
	departmentName: string;
	totalCount: number;
	onlineCount: number;
	contacts?: Contact[];
}

export interface ContactsByDepartmentResult {
	departments: DepartmentSummary[];
	totalContacts: number;
	onlineContacts: number;
}

export interface ContactSearchResult {
	contacts: Contact[];
	total: number;
	page: number;
	row: number;
	keyword: string;
}

export interface ContactWriteInput {
	[key: string]: unknown;
}

export interface ContactGuardDecision {
	code: 409;
	message: string;
	errorCode: "PHASE7_MUTATION_GUARDED";
}
