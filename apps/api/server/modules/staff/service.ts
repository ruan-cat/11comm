import type { StaffRepository } from "./repository";
import type {
	StaffDepartmentResult,
	StaffListResult,
	StaffMember,
	StaffOnlineResult,
	StaffOrganizationsResult,
	StaffQueryParams,
	StaffSearchResult,
} from "./types";

export interface StaffService {
	getOrganizations: () => Promise<StaffOrganizationsResult>;
	getOnlineStaffs: () => Promise<StaffOnlineResult>;
	getStaffById: (staffId: string) => Promise<StaffMember | undefined>;
	getStaffsByDepartment: (orgName?: string) => Promise<StaffDepartmentResult>;
	queryStaffInfos: (params: StaffQueryParams) => Promise<StaffListResult>;
	searchStaffs: (keyword: string) => Promise<StaffSearchResult>;
}

export function createStaffService(repository: StaffRepository): StaffService {
	return {
		async getOrganizations() {
			const organizations = repository.getOrganizationSummaries();
			return {
				organizations,
				totalOrganizations: organizations.length,
				totalStaffs: repository.getAllStaffs().length,
			};
		},
		async getOnlineStaffs() {
			const staffs = repository.getOnlineStaffs();
			const totalStaffs = repository.getAllStaffs().length;
			return {
				staffs,
				total: staffs.length,
				onlineRatio: Math.round((staffs.length / Math.max(totalStaffs, 1)) * 100),
			};
		},
		async getStaffById(staffId) {
			return repository.getStaffById(staffId);
		},
		async getStaffsByDepartment(orgName) {
			const staffs = repository.getStaffsByDepartment(orgName);
			return {
				staffs,
				total: staffs.length,
				page: 1,
				row: staffs.length,
			};
		},
		async queryStaffInfos(params) {
			return repository.queryStaffInfos(params);
		},
		async searchStaffs(keyword) {
			const staffs = repository.searchStaffs(keyword);
			return {
				staffs,
				total: staffs.length,
				keyword: keyword.trim(),
			};
		},
	};
}
