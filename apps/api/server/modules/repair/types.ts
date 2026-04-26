import type { IssuesListItem, RepairsSettingListItem, RepairsTodoListItem } from "@01s-11comm/type";

export interface RepairItem {
	repairId: string;
	workOrderNumber: string;
	title: string;
	context: string;
	repairName: string;
	tel: string;
	address: string;
	repairType: string;
	repairTypeName: string;
	statusCd: string;
	statusName: string;
	communityId: string;
	createTime: string;
	updateTime: string;
}

export interface RepairListQuery {
	page: number;
	row: number;
	communityId?: string;
	keyword?: string;
	statusCd?: string;
	repairType?: string;
}

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
