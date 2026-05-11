/** 房产管理模块 - 类型定义 */

// --- House / hpHouses ---

export interface AdminHouseListItem {
	id: string;
	communityId: string;
	buildingNo: string;
	unitNo: string;
	floor: number | null;
	roomNo: string;
	houseNumber: string;
	buildingArea: string | null;
	usableArea: string | null;
	houseType: string | null;
	status: string;
	rent: string | null;
	validUntil: string | null;
	remark: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListHousesParams {
	pageIndex: number;
	pageSize: number;
	communityId?: string;
	buildingNo?: string;
	unitNo?: string;
	roomNo?: string;
	ownerName?: string;
	status?: string;
}

// --- Invoice / hpInvoices ---

export interface AdminInvoiceListItem {
	id: string;
	invoiceNo: string;
	invoiceType: string | null;
	amount: string | null;
	invoiceDate: string | null;
	ownerName: string | null;
	applicant: string | null;
	invoiceTitle: string | null;
	taxpayerId: string | null;
	auditStatus: string;
	remark: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListInvoicesParams {
	pageIndex: number;
	pageSize: number;
	invoiceNo?: string;
	invoiceType?: string;
	ownerName?: string;
	auditStatus?: string;
}

// --- InvoiceTitle / hpInvoiceTitles ---

export interface AdminInvoiceTitleListItem {
	id: string;
	ownerName: string;
	titleName: string;
	taxpayerNo: string | null;
	addressPhone: string | null;
	bankAccount: string | null;
	remark: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListInvoiceTitlesParams {
	pageIndex: number;
	pageSize: number;
	ownerName?: string;
}

// --- OwnerAccount / hpOwnerAccounts ---

export interface AdminOwnerAccountListItem {
	id: string;
	ownerId: string;
	accountNo: string;
	accountName: string | null;
	accountType: string | null;
	balance: string | null;
	deductionHouse: string | null;
	remark: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListOwnerAccountsParams {
	pageIndex: number;
	pageSize: number;
	accountName?: string;
	accountType?: string;
}

// --- OwnerInformation / hpOwners ---

export interface AdminOwnerInformationListItem {
	id: string;
	name: string;
	idCard: string | null;
	phone: string | null;
	gender: string | null;
	email: string | null;
	address: string | null;
	emergencyContact: string | null;
	remark: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListOwnerInformationParams {
	pageIndex: number;
	pageSize: number;
	name?: string;
	phone?: string;
	idCard?: string;
}

// --- OwnerMember / hpOwnerMembers ---

export interface AdminOwnerMemberListItem {
	id: string;
	ownerId: string;
	name: string;
	gender: string | null;
	memberType: string | null;
	idCard: string | null;
	phone: string | null;
	homeAddress: string | null;
	remark: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListOwnerMembersParams {
	pageIndex: number;
	pageSize: number;
	name?: string;
	memberType?: string;
}

// --- OwnersCommittee / hpOwnersCommittees ---

export interface AdminOwnersCommitteeListItem {
	id: string;
	committeeName: string;
	establishedDate: string | null;
	term: string | null;
	chairman: string | null;
	contactPhone: string | null;
	status: string | null;
	remark: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListOwnersCommitteesParams {
	pageIndex: number;
	pageSize: number;
	committeeName?: string;
	term?: string;
	chairman?: string;
	status?: string;
}

// --- ReserveVenue / hpReserveVenues ---

export interface AdminReserveVenueListItem {
	id: string;
	venueName: string;
	venueType: string | null;
	capacity: number | null;
	openTime: string | null;
	chargeStandard: string | null;
	status: string;
	remark: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListReserveVenuesParams {
	pageIndex: number;
	pageSize: number;
	venueName?: string;
	venueType?: string;
	status?: string;
}

// --- ReserveVenueOrder / hpReserveVenueOrders ---

export interface AdminReserveVenueOrderListItem {
	id: string;
	venueId: string;
	booker: string;
	contactPhone: string | null;
	timeSlot: string | null;
	status: string | null;
	remark: string | null;
	reservationTime: string | null;
	startTime: string | null;
	endTime: string | null;
	numberOfUsers: number | null;
	createTime: string;
	updateTime: string;
}

export interface ListReserveVenueOrdersParams {
	pageIndex: number;
	pageSize: number;
	venueId?: string;
	status?: string;
}

// --- SiteManagement / hpSiteManagements ---

export interface AdminSiteManagementListItem {
	id: string;
	siteName: string;
	location: string | null;
	manager: string | null;
	maintenanceRecord: string | null;
	remark: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListSiteManagementsParams {
	pageIndex: number;
	pageSize: number;
	siteName?: string;
	location?: string;
	manager?: string;
}
