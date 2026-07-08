import type {
	IssuesListItem,
	RepairsHaveDoneListItem,
	RepairsSettingListItem,
	RepairsTodoListItem,
} from "@01s-11comm/type";

export interface RepairItem {
	repairId: string;
	workOrderNumber: string;
	title: string;
	context: string;
	repairName: string;
	tel: string;
	address: string;
	repairObjName?: string;
	repairType: string;
	repairTypeName: string;
	statusCd: string;
	statusName: string;
	communityId: string;
	createTime: string;
	updateTime: string;
	evaluation?: RepairEvaluation;
}

export interface RepairListQuery {
	page: number;
	row: number;
	communityId?: string;
	keyword?: string;
	statusCd?: string;
	repairType?: string;
}

export interface StaffRepairListQuery extends RepairListQuery {}

export interface StaffFinishRepairListQuery extends RepairListQuery {}

export interface RepairListResult {
	list: RepairItem[];
	total: number;
	page: number;
	row: number;
}

export interface CreateRepairInput {
	title?: string;
	context?: string;
	repairName?: string;
	tel?: string;
	address?: string;
	repairType?: string;
	communityId?: string;
}

export interface RepairSettingItem {
	repairType: string;
	repairTypeName: string;
	publicArea: "T" | "F";
	payFeeFlag: "T" | "F";
	priceScope?: string;
}

export interface RepairStateDictionaryItem {
	statusCd: string;
	name: string;
}

export interface RepairPayTypeItem {
	statusCd: string;
	name: string;
}

export interface RepairStaff {
	repairTypes: string[];
	staffId: string;
	staffName: string;
}

export interface RepairTypeUser {
	userId: string;
	userName: string;
}

export interface RepairResource {
	outHighPrice?: number;
	outLowPrice?: number;
	price?: number;
	resId: string;
	resName: string;
	resTypeName: string;
	specName?: string;
	stock?: number;
	unit?: string;
}

export interface RepairResourceType {
	name: string;
	parentRstId: string;
	rstId: string;
}

export interface RepairStatistics {
	total: number;
	statusStats: Record<string, number>;
	typeStats: Record<string, number>;
	monthlyStats: Record<string, number>;
	avgResponseTime: string;
	satisfactionRate: string;
}

export interface RepairStaffRecord {
	ruId: string;
	repairId: string;
	staffId: string;
	staffName: string;
	statusCd: string;
	statusName: string;
	startTime: string;
	endTime?: string;
	context?: string;
}

export interface CoreDictItem {
	statusCd: string;
	name: string;
}

export interface CoreDictQuery {
	name?: string;
	type?: string;
	domain?: string;
}

export interface RepairEvaluation {
	rating: number;
	comment: string;
	evaluateTime: string;
}

export type AdminRepairsTodoListItem = RepairsTodoListItem & {
	repairId: string;
	workOrderCode: string;
	repairStatus: string;
	statusName: string;
};

export type AdminRepairsSettingListItem = RepairsSettingListItem & {
	repairType: string;
	repairTypeName: string;
	payFeeFlag: "T" | "F";
	priceScope?: string;
};

export type AdminRepairIssueListItem = IssuesListItem & {
	repairId: string;
	workOrderNumber: string;
	repairStatus: string;
	statusName: string;
};

export interface ListRepairsHaveDoneParams {
	pageIndex: number;
	pageSize: number;
	workOrderNumber?: string;
	reporter?: string;
	repairPhone?: string;
	repairType?: string;
	maintenanceType?: string;
	repairStatus?: string;
	sortBy?: string;
	sortOrder?: string;
}

export interface RepairsHaveDoneDbItem {
	id: string;
	workOrderNumber: string;
	repairType: string | null;
	maintenanceType: string | null;
	reporterName: string | null;
	contactPhone: string | null;
	repairLocation: string | null;
	appointmentTime: Date | null;
	status: string | null;
	remark: string | null;
	createTime: Date | null;
	updateTime: Date | null;
}

export type AdminRepairsHaveDoneItem = RepairsHaveDoneListItem & {
	createTime?: string;
	updateTime?: string;
};
