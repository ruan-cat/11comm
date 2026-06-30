import type { StaffService } from "./service";
import type { StaffLegacyResponse } from "./types";

export const staffLegacyAdapterEvidence = {
	scope: "detail-sample-batch41-plus-readonly-batch39-batch38-and-guarded-write-batch40",
	dataSourceStatus: "deterministic-compat-seed-no-db-ready",
	responseContract: "{ success, code, message, data, timestamp }",
	endpoints: [
		"/app/staff/organizations",
		"/app/staff/online",
		"/app/staff/by-department",
		"/app/query.staff.infos",
		"/app/staff/search",
		"/app/staff/STAFF_001",
	],
	guardedEndpoints: ["/app/staff/update-online-status", "/app/staff/add"],
	defaultWriteBehavior: "blocked-for-execution",
	writeVerification: "no-read-back-or-rollback-evidence",
	notCovered: ["/app/staff/:staffId", "db-backed-staff-data", "production-app-h5-staff-network"],
} as const;

export function createLegacyStaffAdapter(service: StaffService) {
	return {
		async getOrganizations(input: Record<string, unknown>) {
			void input;
			return staffSuccess(await service.getOrganizations());
		},

		async getOnlineStaffs(input: Record<string, unknown>) {
			void input;
			return staffSuccess(await service.getOnlineStaffs());
		},

		async getStaffDetail(input: Record<string, unknown>) {
			const staffId = toString(input.staffId);
			if (!staffId) {
				return staffFailure("Staff id cannot be empty", "400");
			}

			const staff = await service.getStaffById(staffId);
			if (!staff) {
				return staffFailure(`Staff not found: ${staffId}`, "404");
			}

			return staffSuccess(staff);
		},

		async getStaffsByDepartment(input: Record<string, unknown>) {
			return staffSuccess(await service.getStaffsByDepartment(toString(input.orgName)));
		},

		async queryStaffInfos(input: Record<string, unknown>) {
			return staffSuccess(
				await service.queryStaffInfos({
					page: toNumber(input.page) ?? 1,
					row: toNumber(input.row) ?? 1000,
					storeId: toString(input.storeId) ?? "DEFAULT_STORE",
					name: toString(input.name),
					orgName: toString(input.orgName),
					initials: toString(input.initials),
				}),
			);
		},

		async searchStaffs(input: Record<string, unknown>) {
			const keyword = toString(input.keyword);
			if (!keyword) {
				return staffFailure("Search keyword cannot be empty", "400");
			}

			return staffSuccess(await service.searchStaffs(keyword));
		},

		async guardUpdateOnlineStatus(input: Record<string, unknown>) {
			void input;
			return staffGuardFailure("/app/staff/update-online-status");
		},

		async guardAddStaff(input: Record<string, unknown>) {
			void input;
			return staffGuardFailure("/app/staff/add");
		},
	};
}

function staffSuccess<T>(data: T, message = "success"): StaffLegacyResponse<T> {
	return {
		success: true,
		code: "0",
		message,
		data,
		timestamp: Date.now(),
	};
}

function staffFailure(message: string, code: string): StaffLegacyResponse<null> {
	return {
		success: false,
		code,
		message,
		data: null,
		timestamp: Date.now(),
	};
}

function staffGuardFailure(path: string): StaffLegacyResponse<null> {
	return staffFailure(`Phase7 guarded write blocked staff legacy endpoint: ${path}`, "409");
}

function toString(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}

	return `${value}`.trim();
}

function toNumber(value: unknown): number | undefined {
	const text = toString(value);
	if (!text) {
		return undefined;
	}

	const parsed = Number(text);
	return Number.isFinite(parsed) ? parsed : undefined;
}
