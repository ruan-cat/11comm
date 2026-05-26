/** 设置管理模块 - 类型定义 */

import type { SmRegisterProtocolQueryParams } from "@01s-11comm/type";

// --- DataPermission / smDataPermissions + smRoles ---

export interface AdminDataPermissionListItem {
	id: string;
	roleId: string;
	name: string;
	scope: string;
	permissionRule: string;
	dataFilter: unknown;
	createTime: string;
	updateTime: string;
}

export interface ListDataPermissionParams {
	pageIndex: number;
	pageSize: number;
}

// --- OrgInfo / smOrganizations ---

export interface AdminOrgInfoListItem {
	id: string;
	name: string;
	code: string;
	type: string;
	sort: number;
	parentId: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListOrgInfoParams {
	pageIndex: number;
	pageSize: number;
	keyword?: string;
}

// --- RolePermission / smRoles ---

export interface AdminRolePermissionListItem {
	id: string;
	name: string;
	code: string;
	description: string;
	enabled: boolean;
	createTime: string;
	updateTime: string;
}

export interface ListRolePermissionParams {
	pageIndex: number;
	pageSize: number;
	name?: string;
	code?: string;
}

// --- SchedulingSetting / smSchedulingSettings ---

export interface AdminSchedulingSettingListItem {
	id: string;
	name: string;
	type: string;
	cycle: string;
	effectiveTime: string;
	staff: string;
	status: string;
	createTime: string;
	updateTime: string;
}

export interface ListSchedulingSettingParams {
	pageIndex: number;
	pageSize: number;
}

// --- ShiftSetting / smShifts ---

export interface AdminShiftSettingListItem {
	id: string;
	name: string;
	shiftName: string;
	type: string;
	startTime: string;
	endTime: string;
	enabled: boolean;
	description: string;
	createTime: string;
	updateTime: string;
}

export interface ListShiftSettingParams {
	pageIndex: number;
	pageSize: number;
	name?: string;
}

// --- StaffInfo / smStaff + smOrganizations ---

export interface AdminStaffInfoListItem {
	id: string;
	employeeNumber: string;
	name: string;
	gender: string;
	position: string;
	email: string;
	phone: string;
	address: string;
	orgId: string;
	orgName: string;
	avatar: string;
	createTime: string;
	updateTime: string;
}

export interface ListStaffInfoParams {
	pageIndex: number;
	pageSize: number;
	name?: string;
	phone?: string;
}

// --- WorkingSchedule / smWorkingSchedules ---

export interface AdminWorkingScheduleListItem {
	id: string;
	name: string;
	type: string;
	startTime: string;
	endTime: string;
	weekday: number;
	managerName: string;
	phone: string;
	enabled: boolean;
	description: string;
	staffId: string;
	shiftId: string;
	workDate: string;
	status: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListWorkingScheduleParams {
	pageIndex: number;
	pageSize: number;
}

// --- ChangePassword / smChangePasswordRecords ---

export interface AdminChangePasswordListItem {
	id: string;
	username: string;
	realName: string;
	department: string;
	changeTime: string;
	changeIp: string;
	changeType: string;
	operator: string;
	status: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListChangePasswordParams {
	pageIndex: number;
	pageSize: number;
	username?: string;
	realName?: string;
	department?: string;
	changeType?: string;
	status?: string;
}

// --- CommunityConfiguration / smCommunityConfigurations ---

export interface AdminCommunityConfigurationListItem {
	id: string;
	csId: string;
	communityId: string;
	communityName: string;
	settingName: string;
	settingValue: string | null;
	settingType: string;
	statusCd: string;
	remark: string | null;
	createTime: string;
	updateTime: string;
	operator: string | null;
}

export interface ListCommunityConfigurationParams {
	pageIndex: number;
	pageSize: number;
	settingName?: string;
	settingType?: string;
}

// --- InitializeCell / smInitializeCells ---

export interface AdminInitializeCellListItem {
	id: string;
	initItem: string;
	initStatus: string;
	configParams: unknown;
	createTime: string;
	updateTime: string;
}

export interface ListInitializeCellParams {
	pageIndex: number;
	pageSize: number;
	initItem?: string;
	initStatus?: string;
}

// --- RegisterProtocol / smRegisterProtocols ---

export interface AdminRegisterProtocolListItem {
	id: string;
	title: string;
	content: string;
	version: string;
	status: string;
	createTime: string;
	updateTime: string;
}

export interface ListRegisterProtocolParams extends Pick<
	SmRegisterProtocolQueryParams,
	"protocolType" | "protocolTitle" | "status"
> {
	pageIndex: number;
	pageSize: number;
}

// --- SystemConfig / smSystemConfigs ---

export interface AdminSystemConfigListItem {
	id: string;
	configId: string;
	title: string;
	subtitle: string;
	shortName: string;
	companyName: string;
	logoUrl: string;
	staticUrl: string;
	defaultCommunityCode: string;
	ownerTitle: string;
	propertyMobileTitle: string;
	qqMapKey: string;
	mallUrl: string;
	configKey: string;
	configValue: string;
	description: string;
	category: string;
	isSystem: boolean;
	createTime: string;
	updateTime: string;
}

export interface ListSystemConfigParams {
	pageIndex: number;
	pageSize: number;
	configKey?: string;
	configType?: string;
	status?: string;
}
