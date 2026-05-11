import type { JsonVO, PageDTO } from "@01s-11comm/type";
import { adminSuccess } from "../../shared/runtime/response-builder";
import type { OperationService } from "./service";

export function createAdminOperationAdapter(service: OperationService) {
	return {
		async listCommunityInfo(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listCommunityInfo({
				pageIndex,
				pageSize,
				communityName: blankToUndefined(input.communityName),
				communityId: blankToUndefined(input.communityId),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listPropertyManagementCompany(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listPropertyManagementCompany({
				pageIndex,
				pageSize,
				companyName: blankToUndefined(input.companyName),
				companyId: blankToUndefined(input.companyId),
				phone: blankToUndefined(input.phone),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listPropertyCompany(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listPropertyCompany({
				pageIndex,
				pageSize,
				companyName: blankToUndefined(input.companyName),
				companyCode: blankToUndefined(input.companyCode),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listMerchantInfo(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listMerchantInfo({
				pageIndex,
				pageSize,
				merchantName: blankToUndefined(input.merchantName),
				merchantCode: blankToUndefined(input.merchantCode),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listMerchantAdmin(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listMerchantAdmin({
				pageIndex,
				pageSize,
				merchantId: blankToUndefined(input.merchantId),
				adminName: blankToUndefined(input.adminName),
				phone: blankToUndefined(input.phone),
				role: blankToUndefined(input.role),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listReportInfo(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listReportInfo({
				pageIndex,
				pageSize,
				reportName: blankToUndefined(input.reportName),
				reportCode: blankToUndefined(input.reportCode),
				groupId: blankToUndefined(input.groupId),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listReportGroup(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listReportGroup({
				pageIndex,
				pageSize,
				groupName: blankToUndefined(input.groupName),
				groupCode: blankToUndefined(input.groupCode),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listReportComponent(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listReportComponent({
				pageIndex,
				pageSize,
				componentName: blankToUndefined(input.componentName),
				componentType: blankToUndefined(input.componentType),
				reportId: blankToUndefined(input.reportId),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listChangePassword(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listChangePassword({
				pageIndex,
				pageSize,
				username: blankToUndefined(input.username),
				realName: blankToUndefined(input.realName),
				department: blankToUndefined(input.department),
				changeType: blankToUndefined(input.changeType),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listCommunityConfiguration(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listCommunityConfiguration({
				pageIndex,
				pageSize,
				communityId: blankToUndefined(input.communityId),
				communityName: blankToUndefined(input.communityName),
				settingName: blankToUndefined(input.settingName),
				settingType: blankToUndefined(input.settingType),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listInitializeCell(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listInitializeCell({
				pageIndex,
				pageSize,
				initItem: blankToUndefined(input.initItem),
				initStatus: blankToUndefined(input.initStatus),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listRegisterProtocol(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listRegisterProtocol({
				pageIndex,
				pageSize,
				protocolType: blankToUndefined(input.protocolType),
				protocolTitle: blankToUndefined(input.protocolTitle),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listSystemConfig(input: Record<string, any>): Promise<JsonVO<PageDTO<any>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listSystemConfig({
				pageIndex,
				pageSize,
				configKey: blankToUndefined(input.configKey),
				configType: blankToUndefined(input.configType),
				status: blankToUndefined(input.status),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},
	};
}

function toNumber(value: unknown, fallback: number): number {
	const result = Number(value);
	return Number.isFinite(result) && result > 0 ? result : fallback;
}

function blankToUndefined(value: unknown): string | undefined {
	if (value === undefined || value === null || `${value}`.trim() === "") return undefined;
	return `${value}`.trim();
}
