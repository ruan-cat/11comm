import type { ContactRepository } from "./repository";
import type { ContactListQuery, ContactWriteInput } from "./types";

export interface ContactService {
	listContacts(query: ContactListQuery): ReturnType<ContactRepository["listContacts"]>;
	getContactDetail(contactId: string): ReturnType<ContactRepository["getContactDetail"]>;
	getContactsByDepartment(): ReturnType<ContactRepository["getContactsByDepartment"]>;
	searchContacts(query: ContactListQuery & { keyword: string }): ReturnType<ContactRepository["searchContacts"]>;
	getDepartments(): ReturnType<ContactRepository["getDepartments"]>;
	getFavoriteContacts(): ReturnType<ContactRepository["getFavoriteContacts"]>;
	getEmergencyContacts(): ReturnType<ContactRepository["getEmergencyContacts"]>;
	getWriteGuardDecision(
		endpoint: string,
		input: ContactWriteInput,
	): ReturnType<ContactRepository["getWriteGuardDecision"]>;
}

export function createContactService(repository: ContactRepository): ContactService {
	return {
		listContacts: (query) => repository.listContacts(query),
		getContactDetail: (contactId) => repository.getContactDetail(contactId),
		getContactsByDepartment: () => repository.getContactsByDepartment(),
		searchContacts: (query) => repository.searchContacts(query),
		getDepartments: () => repository.getDepartments(),
		getFavoriteContacts: () => repository.getFavoriteContacts(),
		getEmergencyContacts: () => repository.getEmergencyContacts(),
		getWriteGuardDecision: (endpoint, input) => repository.getWriteGuardDecision(endpoint, input),
	};
}
