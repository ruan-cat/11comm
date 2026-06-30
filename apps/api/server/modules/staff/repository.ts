import type { StaffListResult, StaffMember, StaffOrganizationSummary, StaffQueryParams } from "./types";

const staffSeed: StaffMember[] = [
	{
		id: "STAFF_001",
		name: "Alice Zhang",
		tel: "13800000001",
		orgName: "Property Management",
		initials: "AZ",
		position: "Property Manager",
		email: "alice.zhang@property.example",
		avatar: "https://example.test/staff-001.png",
		isOnline: true,
	},
	{
		id: "STAFF_002",
		name: "Bob Li",
		tel: "13800000002",
		orgName: "Property Management",
		initials: "BL",
		position: "Property Assistant",
		email: "bob.li@property.example",
		avatar: "https://example.test/staff-002.png",
		isOnline: false,
	},
	{
		id: "STAFF_003",
		name: "Chen Wei",
		tel: "13800000003",
		orgName: "Security",
		initials: "CW",
		position: "Security Lead",
		email: "chen.wei@property.example",
		avatar: "https://example.test/staff-003.png",
		isOnline: true,
	},
	{
		id: "STAFF_004",
		name: "Dana Liu",
		tel: "13800000004",
		orgName: "Security",
		initials: "DL",
		position: "Security Guard",
		email: "dana.liu@property.example",
		avatar: "https://example.test/staff-004.png",
		isOnline: true,
	},
	{
		id: "STAFF_005",
		name: "Eric Wang",
		tel: "13800000005",
		orgName: "Maintenance",
		initials: "EW",
		position: "Maintenance Engineer",
		email: "eric.wang@property.example",
		avatar: "https://example.test/staff-005.png",
		isOnline: true,
	},
];

export interface StaffRepository {
	getAllStaffs: () => StaffMember[];
	getOnlineStaffs: () => StaffMember[];
	getOrganizationSummaries: () => StaffOrganizationSummary[];
	getStaffById: (staffId: string) => StaffMember | undefined;
	getStaffsByDepartment: (orgName?: string) => StaffMember[];
	queryStaffInfos: (params: StaffQueryParams) => StaffListResult;
	searchStaffs: (keyword: string) => StaffMember[];
}

export function createStaffRepository(): StaffRepository {
	const staffs = staffSeed.map((staff) => ({ ...staff }));

	return {
		getAllStaffs() {
			return staffs.map((staff) => ({ ...staff }));
		},
		getOnlineStaffs() {
			return staffs.filter((staff) => staff.isOnline).map((staff) => ({ ...staff }));
		},
		getOrganizationSummaries() {
			return Array.from(new Set(staffs.map((staff) => staff.orgName)))
				.sort()
				.map((orgName) => {
					const orgStaffs = staffs.filter((staff) => staff.orgName === orgName);
					return {
						orgName,
						staffCount: orgStaffs.length,
						onlineCount: orgStaffs.filter((staff) => staff.isOnline).length,
					};
				});
		},
		getStaffById(staffId) {
			const normalized = staffId.trim();
			const staff = staffs.find((item) => item.id === normalized);
			return staff ? { ...staff } : undefined;
		},
		getStaffsByDepartment(orgName) {
			const normalized = orgName?.trim();
			if (!normalized) {
				return [];
			}

			return staffs.filter((staff) => staff.orgName === normalized).map((staff) => ({ ...staff }));
		},
		queryStaffInfos(params) {
			let filteredStaffs = [...staffs];

			const name = params.name?.trim();
			if (name) {
				filteredStaffs = filteredStaffs.filter((staff) => staffMatchesSearchKeyword(staff, name));
			}

			const orgName = params.orgName?.trim();
			if (orgName) {
				filteredStaffs = filteredStaffs.filter((staff) => textIncludes(staff.orgName, orgName));
			}

			const initials = params.initials?.trim().toUpperCase();
			if (initials) {
				filteredStaffs = filteredStaffs.filter((staff) => staff.initials.toUpperCase() === initials);
			}

			filteredStaffs.sort((left, right) => left.initials.localeCompare(right.initials));

			const page = toPositiveInteger(params.page, 1);
			const row = toPositiveInteger(params.row, 1000);
			const startIndex = (page - 1) * row;
			const pagedStaffs = filteredStaffs.slice(startIndex, startIndex + row);

			return {
				staffs: pagedStaffs.map((staff) => ({ ...staff })),
				total: filteredStaffs.length,
				page,
				row,
			};
		},
		searchStaffs(keyword) {
			const normalized = keyword.trim();
			if (!normalized) {
				return [];
			}

			return staffs.filter((staff) => staffMatchesSearchKeyword(staff, normalized)).map((staff) => ({ ...staff }));
		},
	};
}

function staffMatchesSearchKeyword(staff: StaffMember, rawKeyword: string): boolean {
	const keyword = rawKeyword.trim();
	if (!keyword) {
		return true;
	}

	const telDigits = keyword.replace(/\D/g, "");
	const staffTelDigits = staff.tel.replace(/\D/g, "");

	return (
		textIncludes(staff.name, keyword) ||
		textIncludes(staff.orgName, keyword) ||
		textIncludes(staff.position, keyword) ||
		textIncludes(staff.email, keyword) ||
		textIncludes(staff.tel, keyword) ||
		(telDigits.length > 0 && staffTelDigits.includes(telDigits)) ||
		textIncludes(staff.initials, keyword) ||
		textIncludes(staff.id, keyword)
	);
}

function textIncludes(value: string | undefined, keyword: string): boolean {
	if (!value) {
		return false;
	}

	return value.toLowerCase().includes(keyword.toLowerCase());
}

function toPositiveInteger(value: number | undefined, fallback: number): number {
	if (!Number.isFinite(value) || value === undefined) {
		return fallback;
	}

	const normalized = Math.trunc(value);
	return normalized > 0 ? normalized : fallback;
}
