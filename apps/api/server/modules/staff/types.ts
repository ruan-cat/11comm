export interface StaffMember {
	id: string;
	name: string;
	tel: string;
	orgName: string;
	initials: string;
	position?: string;
	email?: string;
	avatar?: string;
	isOnline?: boolean;
}

export interface StaffOrganizationSummary {
	orgName: string;
	staffCount: number;
	onlineCount: number;
}

export interface StaffOrganizationsResult {
	organizations: StaffOrganizationSummary[];
	totalOrganizations: number;
	totalStaffs: number;
}

export interface StaffOnlineResult {
	staffs: StaffMember[];
	total: number;
	onlineRatio: number;
}

export interface StaffDepartmentResult {
	staffs: StaffMember[];
	total: number;
	page: number;
	row: number;
}

export interface StaffQueryParams {
	page?: number;
	row?: number;
	storeId?: string;
	name?: string;
	orgName?: string;
	initials?: string;
}

export interface StaffListResult {
	staffs: StaffMember[];
	total: number;
	page: number;
	row: number;
}

export interface StaffSearchResult {
	staffs: StaffMember[];
	total: number;
	keyword: string;
}

export interface StaffLegacyResponse<T> {
	success: boolean;
	code: string;
	message: string;
	data: T;
	timestamp: number;
}
