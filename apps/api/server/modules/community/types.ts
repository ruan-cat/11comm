// --- community-manage 只读列表类型 ---

// 1. building-space-structure-diagram
export interface BuildingSpaceStructureDiagramListItem {
	id: string;
	communityId: string;
	buildingNo: string;
	floorCount: number;
	unitCount: number;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListBuildingSpaceStructureDiagramsParams {
	pageIndex: number;
	pageSize: number;
	communityId?: string;
	buildingNo?: string;
	floorCount?: number;
	unitCount?: number;
}

// 2. handing-business
export interface HandingBusinessListItem {
	id: string;
	businessType: string;
	applicant: string;
	contactPhone: string;
	status: string;
	handleTime: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListHandingBusinessesParams {
	pageIndex: number;
	pageSize: number;
	communityId?: string;
	businessName?: string;
	handler?: string;
	status?: string;
}

// 3. house-decoration
export interface HouseDecorationListItem {
	id: string;
	houseNumber: string;
	ownerInfo: string;
	decorationCompany: string;
	plannedStartTime: string;
	plannedEndTime: string;
	auditStatus: string;
	auditor: string;
	auditTime: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListHouseDecorationsParams {
	pageIndex: number;
	pageSize: number;
	communityId?: string;
	houseId?: string;
	applicant?: string;
	decorationType?: string;
	status?: string;
}

// 4. my (communities)
export interface MyCommunityListItem {
	id: string;
	name: string;
	code: string;
	address: string;
	phone: string;
	status: string;
	province: string;
	city: string;
	district: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListMyCommunitiesParams {
	pageIndex: number;
	pageSize: number;
	province?: string;
	city?: string;
	district?: string;
	communityName?: string;
	communityCode?: string;
	status?: string;
}

// 5. notice
export interface NoticeListItem {
	id: string;
	communityId: string;
	title: string;
	content: string;
	publishTime: string;
	publisher: string;
	status: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListNoticesParams {
	pageIndex: number;
	pageSize: number;
	title?: string;
	noticeType?: string;
	publisher?: string;
	status?: string;
}

// 6. parking-space-structure-diagram
export interface ParkingSpaceStructureDiagramListItem {
	id: string;
	parkingLotId: string;
	carportNumber: string;
	carportType: string;
	area: string;
	status: string;
	ownerName: string;
	createTime: string;
	updateTime: string;
}

export interface ListParkingSpaceStructureDiagramsParams {
	pageIndex: number;
	pageSize: number;
	communityId?: string;
	parkingLotId?: string;
	carportNo?: string;
	carportType?: string;
	status?: string;
	area?: string;
}

// 7. property-register
export interface PropertyRegisterListItem {
	id: string;
	communityName: string;
	buildingNo: string;
	unitNo: string;
	roomNo: string;
	ownerName: string;
	contactPhone: string;
	area: string;
	propertyType: string;
	registerDate: string;
	status: string;
	remark: string;
	createTime: string;
	updateTime: string;
}

export interface ListPropertyRegistersParams {
	pageIndex: number;
	pageSize: number;
	communityId?: string;
	registerType?: string;
	applicant?: string;
	status?: string;
	propertyName?: string;
	propertyCode?: string;
	registerDate?: string;
	remark?: string;
}
