import type { JsonVO, OrganizationTreeNode, PageDTO } from "@01s-11comm/type";
import { adminSuccess } from "../../shared/runtime/response-builder";
import type { SettingService } from "./service";
import type {
	AdminChangePasswordListItem,
	AdminCommunityConfigurationListItem,
	AdminDataPermissionListItem,
	AdminInitializeCellListItem,
	AdminOrgInfoListItem,
	AdminRegisterProtocolListItem,
	AdminRolePermissionListItem,
	AdminSchedulingSettingListItem,
	AdminShiftSettingListItem,
	AdminStaffInfoListItem,
	AdminSystemConfigListItem,
	AdminWorkingScheduleListItem,
} from "./types";

export function createAdminSettingAdapter(service: SettingService) {
	return {
		async listDataPermission(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
		}): Promise<JsonVO<PageDTO<AdminDataPermissionListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listDataPermission({ pageIndex, pageSize });
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listOrgInfo(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
			keyword?: string;
		}): Promise<JsonVO<PageDTO<AdminOrgInfoListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listOrgInfo({
				pageIndex,
				pageSize,
				keyword: blankToUndefined(input.keyword),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listRolePermission(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
			name?: string;
			code?: string;
		}): Promise<JsonVO<PageDTO<AdminRolePermissionListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listRolePermission({
				pageIndex,
				pageSize,
				name: blankToUndefined(input.name),
				code: blankToUndefined(input.code),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listSchedulingSetting(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
		}): Promise<JsonVO<PageDTO<AdminSchedulingSettingListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listSchedulingSetting({ pageIndex, pageSize });
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listShiftSetting(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
			name?: string;
		}): Promise<JsonVO<PageDTO<AdminShiftSettingListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listShiftSetting({
				pageIndex,
				pageSize,
				name: blankToUndefined(input.name),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listStaffInfo(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
			name?: string;
			phone?: string;
		}): Promise<JsonVO<PageDTO<AdminStaffInfoListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listStaffInfo({
				pageIndex,
				pageSize,
				name: blankToUndefined(input.name),
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

		async listWorkingSchedule(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
		}): Promise<JsonVO<PageDTO<AdminWorkingScheduleListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listWorkingSchedule({ pageIndex, pageSize });
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listChangePassword(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
			username?: string;
			realName?: string;
			department?: string;
			changeType?: string;
			status?: string;
		}): Promise<JsonVO<PageDTO<AdminChangePasswordListItem>>> {
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

		async listCommunityConfiguration(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
			settingName?: string;
			settingType?: string;
		}): Promise<JsonVO<PageDTO<AdminCommunityConfigurationListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listCommunityConfiguration({
				pageIndex,
				pageSize,
				settingName: blankToUndefined(input.settingName),
				settingType: blankToUndefined(input.settingType),
			});
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listInitializeCell(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
		}): Promise<JsonVO<PageDTO<AdminInitializeCellListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listInitializeCell({ pageIndex, pageSize });
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listRegisterProtocol(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
		}): Promise<JsonVO<PageDTO<AdminRegisterProtocolListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listRegisterProtocol({ pageIndex, pageSize });
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async listSystemConfig(input: {
			pageIndex?: number;
			page?: number;
			pageSize?: number;
		}): Promise<JsonVO<PageDTO<AdminSystemConfigListItem>>> {
			const pageIndex = toNumber(input.pageIndex ?? input.page ?? 1, 1);
			const pageSize = toNumber(input.pageSize, 20);
			const result = await service.listSystemConfig({ pageIndex, pageSize });
			return adminSuccess({
				list: result.list,
				total: result.total,
				pageIndex,
				pageSize,
				totalPages: Math.ceil(result.total / pageSize),
			});
		},

		async createChangePassword(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			const result = await service.createChangePassword(input);
			return adminSuccess(result, "创建成功");
		},
		async updateChangePassword(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			const result = await service.updateChangePassword(input);
			return adminSuccess(result, "更新成功");
		},
		async deleteChangePassword(input: { id?: string }): Promise<JsonVO<unknown>> {
			const id = input.id;
			if (!id) return { success: false, code: 400, message: "缺少 id 参数", data: null };
			await service.deleteChangePassword(id);
			return adminSuccess(null, "删除成功");
		},

		async createCommunityConfiguration(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			const result = await service.createCommunityConfiguration(input);
			return adminSuccess(result, "创建成功");
		},
		async updateCommunityConfiguration(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			const result = await service.updateCommunityConfiguration(input);
			return adminSuccess(result, "更新成功");
		},
		async deleteCommunityConfiguration(input: { id?: string }): Promise<JsonVO<unknown>> {
			const id = input.id;
			if (!id) return { success: false, code: 400, message: "缺少 id 参数", data: null };
			await service.deleteCommunityConfiguration(id);
			return adminSuccess(null, "删除成功");
		},

		async createInitializeCell(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			const result = await service.createInitializeCell(input);
			return adminSuccess(result, "创建成功");
		},
		async updateInitializeCell(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			const result = await service.updateInitializeCell(input);
			return adminSuccess(result, "更新成功");
		},
		async deleteInitializeCell(input: { id?: string }): Promise<JsonVO<unknown>> {
			const id = input.id;
			if (!id) return { success: false, code: 400, message: "缺少 id 参数", data: null };
			await service.deleteInitializeCell(id);
			return adminSuccess(null, "删除成功");
		},

		async createRegisterProtocol(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			const result = await service.createRegisterProtocol(input);
			return adminSuccess(result, "创建成功");
		},
		async updateRegisterProtocol(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			const result = await service.updateRegisterProtocol(input);
			return adminSuccess(result, "更新成功");
		},
		async deleteRegisterProtocol(input: { id?: string }): Promise<JsonVO<unknown>> {
			const id = input.id;
			if (!id) return { success: false, code: 400, message: "缺少 id 参数", data: null };
			await service.deleteRegisterProtocol(id);
			return adminSuccess(null, "删除成功");
		},

		async createSystemConfig(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			const result = await service.createSystemConfig(input);
			return adminSuccess(result, "创建成功");
		},
		async updateSystemConfig(input: Record<string, unknown>): Promise<JsonVO<unknown>> {
			const result = await service.updateSystemConfig(input);
			return adminSuccess(result, "更新成功");
		},
		async deleteSystemConfig(input: { id?: string }): Promise<JsonVO<unknown>> {
			const id = input.id;
			if (!id) return { success: false, code: 400, message: "缺少 id 参数", data: null };
			await service.deleteSystemConfig(id);
			return adminSuccess(null, "删除成功");
		},

		async getOrgInfoTree(input: Record<string, unknown>): Promise<JsonVO<OrganizationTreeNode[]>> {
			void input;
			const result = await service.getOrgInfoTree();
			return adminSuccess(result, "查询成功");
		},
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
