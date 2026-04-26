import type { JsonVO, PageDTO } from "@01s-11comm/type";
import type {
	AdminRepairIssueListItem,
	AdminRepairsSettingListItem,
	AdminRepairsTodoListItem,
	RepairItem,
	RepairSettingItem,
} from "./types";
import type { RepairService } from "./service";
import { adminSuccess } from "../../shared/runtime/response-builder";

export function createAdminRepairAdapter(service: RepairService) {
	return {
		async listRepairsTodo(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			status?: string;
			keyword?: string;
		}): Promise<JsonVO<PageDTO<AdminRepairsTodoListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listOwnerRepairs({
				page: pageIndex,
				row: pageSize,
				communityId: "COMM_001",
				keyword: blankToUndefined(input.keyword),
				statusCd: blankToUndefined(input.status),
			});
			return adminSuccess(toPageResult(result.list.map(toRepairsTodoItem), result.total, pageIndex, pageSize));
		},
		async listRepairsSettings(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			publicArea?: string;
		}): Promise<JsonVO<PageDTO<AdminRepairsSettingListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const list = await service.listRepairSettings({
				page: pageIndex,
				row: pageSize,
				publicArea: blankToUndefined(input.publicArea),
			});
			return adminSuccess(toPageResult(list.map(toRepairsSettingItem), list.length, pageIndex, pageSize));
		},
		async listIssues(input: {
			page?: number;
			pageIndex?: number;
			pageSize?: number;
			keyword?: string;
		}): Promise<JsonVO<PageDTO<AdminRepairIssueListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listOwnerRepairs({
				page: pageIndex,
				row: pageSize,
				communityId: "COMM_001",
				keyword: blankToUndefined(input.keyword),
			});
			return adminSuccess(toPageResult(result.list.map(toIssueItem), result.total, pageIndex, pageSize));
		},
	};
}

function toRepairsTodoItem(item: RepairItem): AdminRepairsTodoListItem {
	return {
		id: item.repairId,
		name: item.title,
		repairId: item.repairId,
		workOrderNumber: item.workOrderNumber,
		workOrderCode: item.workOrderNumber,
		location: item.address,
		repairType: item.repairTypeName,
		maintenanceType: item.repairType,
		reporter: item.repairName,
		contactInfo: item.tel,
		appointmentTime: item.createTime,
		status: item.statusCd,
		repairStatus: item.statusCd,
		statusName: item.statusName,
		createTime: item.createTime,
		updateTime: item.updateTime,
		remark: item.context,
	};
}

function toRepairsSettingItem(item: RepairSettingItem): AdminRepairsSettingListItem {
	return {
		id: item.repairType,
		name: item.repairTypeName,
		typeName: item.repairTypeName,
		settingType: item.publicArea === "T" ? "cleaning" : "repair",
		dispatchMethod: "assign",
		publicArea: item.publicArea,
		ownerDisplay: "yes",
		notificationMethod: "wechat",
		returnVisitSetting: "visit",
		status: "enabled",
		createTime: "2026-04-25 09:00:00",
		updateTime: "2026-04-25 09:00:00",
		remark: item.priceScope,
		repairType: item.repairType,
		repairTypeName: item.repairTypeName,
		payFeeFlag: item.payFeeFlag,
		priceScope: item.priceScope,
	};
}

function toIssueItem(item: RepairItem): AdminRepairIssueListItem {
	return {
		id: item.repairId,
		name: item.title,
		repairId: item.repairId,
		workOrderNumber: item.workOrderNumber,
		workOrderCode: item.workOrderNumber,
		location: item.address,
		repairType: item.repairTypeName,
		maintenanceType: item.repairType,
		reporter: item.repairName,
		contactInfo: item.tel,
		appointmentTimeRange: item.createTime,
		submitTime: item.createTime,
		orderDuration: "0h",
		completeTime: item.statusCd === "10003" ? item.updateTime : "",
		status: item.statusCd,
		repairStatus: item.statusCd,
		statusName: item.statusName,
		violationDescription: "",
		createTime: item.createTime,
		updateTime: item.updateTime,
		remark: item.context,
	};
}

function toPageResult<T>(list: T[], total: number, pageIndex: number, pageSize: number): PageDTO<T> {
	return {
		list,
		total,
		pageIndex,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	};
}

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? result : fallback;
}

function blankToUndefined(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") {
		return undefined;
	}
	return `${value}`.trim();
}
