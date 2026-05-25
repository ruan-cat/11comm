import type {
	Contact,
	ContactDepartment,
	ContactGuardDecision,
	ContactListQuery,
	ContactListResult,
	ContactSearchResult,
	ContactWriteInput,
	ContactsByDepartmentResult,
	DepartmentSummary,
	EmergencyContact,
} from "./types";

export interface ContactRepository {
	listContacts(query: ContactListQuery): Promise<ContactListResult>;
	getContactDetail(contactId: string): Promise<Contact | undefined>;
	getContactsByDepartment(): Promise<ContactsByDepartmentResult>;
	searchContacts(query: ContactListQuery & { keyword: string }): Promise<ContactSearchResult>;
	getDepartments(): Promise<DepartmentSummary[]>;
	getFavoriteContacts(): Promise<Contact[]>;
	getEmergencyContacts(): Promise<EmergencyContact[]>;
	getWriteGuardDecision(endpoint: string, input: ContactWriteInput): Promise<ContactGuardDecision>;
}

const contactDepartments: ContactDepartment[] = [
	"Property Management",
	"Security",
	"Cleaning",
	"Maintenance",
	"Customer Service",
	"Finance",
];

const contactPositions = ["Manager", "Specialist", "Assistant", "Supervisor", "Team Lead", "Deputy Manager"];

const contactRows: Contact[] = Array.from({ length: 30 }, (_, index) => createContact(index));
const favoriteContactIds = new Set([
	"CON_001",
	"CON_002",
	"CON_003",
	"CON_004",
	"CON_005",
	"CON_006",
	"CON_007",
	"CON_008",
]);

export function createContactRepository(): ContactRepository {
	return {
		async listContacts(query) {
			return paginateContacts(filterContacts(contactRows, query), query.page, query.row);
		},

		async getContactDetail(contactId) {
			return cloneValue(contactRows.find((contact) => contact.contactId === contactId));
		},

		async getContactsByDepartment() {
			const departments = contactDepartments.map((departmentName) => {
				const contacts = contactRows.filter((contact) => contact.department === departmentName);
				return {
					departmentName,
					contacts: cloneValue(sortContacts(contacts)),
					onlineCount: contacts.filter((contact) => contact.isOnline).length,
					totalCount: contacts.length,
				};
			});

			return {
				departments,
				totalContacts: contactRows.length,
				onlineContacts: contactRows.filter((contact) => contact.isOnline).length,
			};
		},

		async searchContacts(query) {
			const filtered = filterContacts(contactRows, query).sort((left, right) => {
				const leftScore = getContactMatchScore(left, query.keyword);
				const rightScore = getContactMatchScore(right, query.keyword);
				return rightScore - leftScore || left.contactId.localeCompare(right.contactId);
			});
			const result = paginateContacts(filtered, query.page, query.row);

			return {
				...result,
				keyword: query.keyword,
			};
		},

		async getDepartments() {
			return contactDepartments.map((departmentName) => {
				const contacts = contactRows.filter((contact) => contact.department === departmentName);
				return {
					departmentName,
					onlineCount: contacts.filter((contact) => contact.isOnline).length,
					totalCount: contacts.length,
				};
			});
		},

		async getFavoriteContacts() {
			return cloneValue(contactRows.filter((contact) => favoriteContactIds.has(contact.contactId)));
		},

		async getEmergencyContacts() {
			return cloneValue(emergencyContacts);
		},

		async getWriteGuardDecision(endpoint, input) {
			void input;
			return {
				code: 409,
				message: `Phase7 mutation guard blocked ${endpoint}; contact online status writes require controlled write, read-back, rollback, and guard restore evidence.`,
				errorCode: "PHASE7_MUTATION_GUARDED",
			};
		},
	};
}

function createContact(index: number): Contact {
	const id = String(index + 1).padStart(3, "0");
	const department = contactDepartments[index % contactDepartments.length];
	const position = contactPositions[index % contactPositions.length];

	return {
		contactId: `CON_${id}`,
		name: `Contact ${id}`,
		position,
		department,
		phone: `138${String(10000000 + index + 1).padStart(8, "0")}`,
		email: `contact${id}@property.example`,
		workTime: "09:00-18:00",
		avatar: `https://example.test/contact-${id}.png`,
		description: `${position} for ${department}`,
		isOnline: index % 3 !== 0,
	};
}

const emergencyContacts: EmergencyContact[] = [
	{
		contactId: "EMG_001",
		name: "24h Duty Desk",
		position: "Duty Desk",
		department: "Property Management",
		phone: "400-888-9999",
		email: "duty@property.example",
		workTime: "00:00-24:00",
		description: "Emergency property duty line",
		isOnline: true,
		priority: "HIGH",
	},
	{
		contactId: "EMG_002",
		name: "Security Lead",
		position: "Team Lead",
		department: "Security",
		phone: "13810009998",
		email: "security@property.example",
		workTime: "00:00-24:00",
		description: "Community security escalation",
		isOnline: true,
		priority: "HIGH",
	},
	{
		contactId: "EMG_003",
		name: "Maintenance Lead",
		position: "Supervisor",
		department: "Maintenance",
		phone: "13810009997",
		email: "maintenance@property.example",
		workTime: "00:00-24:00",
		description: "Urgent repair escalation",
		isOnline: true,
		priority: "MEDIUM",
	},
	{
		contactId: "EMG_004",
		name: "Medical Emergency",
		position: "Emergency Service",
		department: "External Contact",
		phone: "120",
		description: "Medical emergency service",
		isOnline: true,
		priority: "CRITICAL",
	},
	{
		contactId: "EMG_005",
		name: "Fire Emergency",
		position: "Emergency Service",
		department: "External Contact",
		phone: "119",
		description: "Fire emergency service",
		isOnline: true,
		priority: "CRITICAL",
	},
	{
		contactId: "EMG_006",
		name: "Police Emergency",
		position: "Emergency Service",
		department: "External Contact",
		phone: "110",
		description: "Public security emergency service",
		isOnline: true,
		priority: "CRITICAL",
	},
];

function filterContacts(contacts: Contact[], query: ContactListQuery): Contact[] {
	let filtered = [...contacts];

	if (query.department) {
		filtered = filtered.filter((contact) => contact.department === query.department);
	}

	if (query.isOnline !== undefined) {
		filtered = filtered.filter((contact) => contact.isOnline === query.isOnline);
	}

	if (query.keyword) {
		const keyword = query.keyword.toLowerCase();
		filtered = filtered.filter((contact) =>
			[contact.contactId, contact.name, contact.position, contact.department, contact.phone, contact.email ?? ""].some(
				(value) => value.toLowerCase().includes(keyword),
			),
		);
	}

	return sortContacts(filtered);
}

function sortContacts(contacts: Contact[]): Contact[] {
	return [...contacts].sort((left, right) => {
		const departmentOrder = getDepartmentOrder(left.department) - getDepartmentOrder(right.department);
		return departmentOrder || left.name.localeCompare(right.name);
	});
}

function getDepartmentOrder(department: string): number {
	const index = contactDepartments.findIndex((item) => item === department);
	return index === -1 ? contactDepartments.length : index;
}

function getContactMatchScore(contact: Contact, keyword: string): number {
	const text = keyword.toLowerCase();
	return (
		(contact.name.toLowerCase().includes(text) ? 4 : 0) +
		(contact.contactId.toLowerCase().includes(text) ? 3 : 0) +
		(contact.position.toLowerCase().includes(text) ? 2 : 0) +
		(contact.department.toLowerCase().includes(text) ? 1 : 0)
	);
}

function paginateContacts(items: Contact[], page: number, row: number): ContactListResult {
	const start = (page - 1) * row;
	const end = start + row;
	return {
		contacts: cloneValue(items.slice(start, end)),
		total: items.length,
		page,
		row,
	};
}

function cloneValue<T>(value: T): T {
	return structuredClone(value);
}
