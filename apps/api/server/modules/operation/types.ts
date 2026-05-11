/** 运营团队模块 - 类型定义 */

// --- CommunityInfo / cmCommunities ---

export interface AdminCommunityInfoListItem {
	id: string;
	communityId: string;
	communityName: string;
	communityCode: string;
	region: string;
	address: string;
	landArea: string | null;
	buildingArea: string | null;
	buildingCount: number | null;
	unitCount: number | null;
	householdCount: number | null;
	parkingCount: number | null;
	greenRate: string | null;
	plotRatio: string | null;
	developer: string | null;
	propertyCompany: string | null;
	establishedDate: string | null;
	phone: string | null;
	status: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListCommunityInfoParams {
	pageIndex: number;
	pageSize: number;
	communityId?: string;
	communityName?: string;
	province?: string;
	city?: string;
	district?: string;
	propertyCompany?: string;
	status?: string;
}

// --- PropertyManagementCompany / opPropertyCompanies ---

export interface AdminPropertyManagementCompanyListItem {
	id: string;
	companyId: string;
	companyName: string;
	companyCode: string | null;
	contactPerson: string | null;
	contactPhone: string | null;
	address: string | null;
	qualificationLevel: string | null;
	qualificationCertNo: string | null;
	qualificationValidUntil: string | null;
	remark: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListPropertyManagementCompanyParams {
	pageIndex: number;
	pageSize: number;
	companyId?: string;
	companyName?: string;
	phone?: string;
}

// --- PropertyCompany / opPropertyCompanies (same table) ---

export interface AdminPropertyCompanyListItem {
	id: string;
	companyId: string;
	companyName: string;
	companyCode: string | null;
	contactPerson: string | null;
	contactPhone: string | null;
	address: string | null;
	qualificationLevel: string | null;
	remark: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListPropertyCompanyParams {
	pageIndex: number;
	pageSize: number;
	companyName?: string;
	companyCode?: string;
}

// --- MerchantInfo / opMerchants ---

export interface AdminMerchantInfoListItem {
	id: string;
	merchantId: string;
	merchantName: string;
	merchantCode: string;
	merchantType: string | null;
	contactPerson: string | null;
	contactPhone: string | null;
	businessLicense: string | null;
	legalRepresentative: string | null;
	registeredAddress: string | null;
	registeredCapital: string | null;
	establishedDate: string | null;
	businessAddress: string | null;
	businessScope: string | null;
	businessHours: string | null;
	businessArea: string | null;
	serviceCommunities: string | null;
	contractStartDate: string | null;
	contractEndDate: string | null;
	bankName: string | null;
	bankAccount: string | null;
	status: string | null;
	remark: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListMerchantInfoParams {
	pageIndex: number;
	pageSize: number;
	merchantName?: string;
	merchantCode?: string;
	merchantType?: string;
	contactPerson?: string;
	contactPhone?: string;
	status?: string;
}

// --- MerchantAdmin / opMerchantAdmins join opMerchants ---

export interface AdminMerchantAdminListItem {
	id: string;
	merchantId: string;
	merchantName: string;
	adminName: string;
	phone: string | null;
	email: string | null;
	account: string | null;
	role: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListMerchantAdminParams {
	pageIndex: number;
	pageSize: number;
	merchantId?: string;
	merchantName?: string;
	adminName?: string;
	phone?: string;
	role?: string;
}

// --- ReportInfo / opReportInfos ---

export interface AdminReportInfoListItem {
	id: string;
	groupId: string | null;
	reportName: string;
	reportCode: string | null;
	reportType: string | null;
	dataSourceConfig: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListReportInfoParams {
	pageIndex: number;
	pageSize: number;
	reportName?: string;
	reportCode?: string;
	groupId?: string;
	reportType?: string;
}

// --- ReportGroup / opReportGroups ---

export interface AdminReportGroupListItem {
	id: string;
	groupName: string;
	groupCode: string | null;
	groupDescription: string | null;
	sortOrder: number | null;
	createTime: string;
	updateTime: string;
}

export interface ListReportGroupParams {
	pageIndex: number;
	pageSize: number;
	groupName?: string;
	groupCode?: string;
}

// --- ReportComponent / opReportComponents ---

export interface AdminReportComponentListItem {
	id: string;
	reportId: string;
	componentName: string;
	componentType: string | null;
	componentConfig: unknown | null;
	createTime: string;
	updateTime: string;
}

export interface ListReportComponentParams {
	pageIndex: number;
	pageSize: number;
	reportId?: string;
	componentName?: string;
	componentType?: string;
}

// --- ChangePassword / smChangePasswordRecords ---

export interface AdminChangePasswordListItem {
	id: string;
	username: string;
	realName: string | null;
	department: string | null;
	changeTime: string | null;
	changeIp: string | null;
	changeType: string | null;
	operator: string | null;
	status: string | null;
	remark: string | null;
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
	createTime: string | null;
	updateTime: string | null;
	operator: string | null;
}

export interface ListCommunityConfigurationParams {
	pageIndex: number;
	pageSize: number;
	communityId?: string;
	communityName?: string;
	settingName?: string;
	settingType?: string;
	status?: string;
}

// --- InitializeCell / smInitializeCells ---

export interface AdminInitializeCellListItem {
	id: string;
	initItem: string;
	initStatus: string | null;
	configParams: unknown | null;
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
	protocolType: string | null;
	protocolTitle: string;
	protocolContent: string | null;
	version: string | null;
	status: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListRegisterProtocolParams {
	pageIndex: number;
	pageSize: number;
	protocolType?: string;
	protocolTitle?: string;
	status?: string;
}

// --- SystemConfig / smSystemConfigs ---

export interface AdminSystemConfigListItem {
	id: string;
	configKey: string;
	configValue: string | null;
	configType: string | null;
	configDescription: string | null;
	status: string | null;
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
