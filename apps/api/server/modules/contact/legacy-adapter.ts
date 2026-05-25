import { legacyFailure, legacySuccess } from "../../shared/runtime/response-builder";
import type { ContactService } from "./service";

export const contactLegacyAdapterEvidence = {
	scope: "readonly-exact-handler-plus-guarded-write",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ code, msg, data }",
	endpoints: [
		"/app/contact.listContacts",
		"/app/contact.getContactDetail",
		"/app/contact.getContactsByDepartment",
		"/app/contact.searchContacts",
		"/app/contact.getDepartments",
		"/app/contact.getFavoriteContacts",
		"/app/contact.getEmergencyContacts",
	],
	guardedEndpoints: ["/app/contact.updateOnlineStatus"],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: [
		"db-backed-contact-data",
		"contact-update-online-status-read-back-rollback",
		"natural-app-h5-contact-page-network",
	],
} as const;

export function createLegacyContactAdapter(service: ContactService) {
	return {
		async listContacts(input: Record<string, unknown>) {
			return legacySuccess(
				await service.listContacts({
					page: toNumber(input.page, 1, 100),
					row: toNumber(input.row, 20, 100),
					department: toString(input.department),
					keyword: toString(input.keyword),
					isOnline: toOptionalBoolean(input.isOnline),
				}),
				"query success",
			);
		},

		async getContactDetail(input: Record<string, unknown>) {
			const contactId = toString(input.contactId);
			if (!contactId) {
				return legacyFailure("contact ID cannot be empty", 400);
			}

			const contact = await service.getContactDetail(contactId);
			if (!contact) {
				return legacyFailure("contact does not exist", 404);
			}

			return legacySuccess({ contact }, "query success");
		},

		async getContactsByDepartment(input: Record<string, unknown>) {
			void input;
			return legacySuccess(await service.getContactsByDepartment(), "query success");
		},

		async searchContacts(input: Record<string, unknown>) {
			const keyword = toString(input.keyword);
			if (!keyword) {
				return legacyFailure("search keyword cannot be empty", 400);
			}

			const result = await service.searchContacts({
				page: toNumber(input.page, 1, 100),
				row: toNumber(input.row, 50, 100),
				department: toString(input.department),
				keyword,
				isOnline: toOptionalBoolean(input.isOnline),
			});

			return legacySuccess(
				{
					contacts: result.contacts,
					total: result.total,
					keyword,
				},
				"query success",
			);
		},

		async getDepartments(input: Record<string, unknown>) {
			void input;
			return legacySuccess({ departments: await service.getDepartments() }, "query success");
		},

		async getFavoriteContacts(input: Record<string, unknown>) {
			void input;
			return legacySuccess({ contacts: await service.getFavoriteContacts() }, "query success");
		},

		async getEmergencyContacts(input: Record<string, unknown>) {
			void input;
			return legacySuccess({ contacts: await service.getEmergencyContacts() }, "query success");
		},

		async updateOnlineStatus(input: Record<string, unknown>) {
			const decision = await service.getWriteGuardDecision("/app/contact.updateOnlineStatus", input);
			return legacyFailure(decision.message, decision.code, { errorCode: decision.errorCode });
		},
	};
}

function toNumber(value: unknown, fallback: number, max: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? Math.min(result, max) : fallback;
}

function toString(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}

	return `${value}`.trim();
}

function toOptionalBoolean(value: unknown): boolean | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}

	if (typeof value === "boolean") {
		return value;
	}

	const normalized = `${value}`.trim().toLowerCase();
	if (["true", "1", "yes", "y"].includes(normalized)) {
		return true;
	}
	if (["false", "0", "no", "n"].includes(normalized)) {
		return false;
	}

	return undefined;
}
