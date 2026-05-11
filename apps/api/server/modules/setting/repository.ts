import { and, desc, eq, like, sql } from "drizzle-orm";
import {
	smDataPermissions,
	smOrganizations,
	smRoles,
	smSchedulingSettings,
	smShifts,
	smStaff,
	smWorkingSchedules,
	smChangePasswordRecords,
	smCommunityConfigurations,
	smInitializeCells,
	smRegisterProtocols,
	smSystemConfigs,
} from "@01s-11comm/type";
import type { DbType } from "../../db";
import { formatDateTime } from "../../utils/format-date";
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
	ListChangePasswordParams,
	ListCommunityConfigurationParams,
	ListDataPermissionParams,
	ListInitializeCellParams,
	ListOrgInfoParams,
	ListRegisterProtocolParams,
	ListRolePermissionParams,
	ListSchedulingSettingParams,
	ListShiftSettingParams,
	ListStaffInfoParams,
	ListSystemConfigParams,
	ListWorkingScheduleParams,
} from "./types";

export interface SettingRepository {
	// organize-manage
	listDataPermission: (
		params: ListDataPermissionParams,
	) => Promise<{ list: AdminDataPermissionListItem[]; total: number }>;
	listOrgInfo: (params: ListOrgInfoParams) => Promise<{ list: AdminOrgInfoListItem[]; total: number }>;
	listRolePermission: (
		params: ListRolePermissionParams,
	) => Promise<{ list: AdminRolePermissionListItem[]; total: number }>;
	listSchedulingSetting: (
		params: ListSchedulingSettingParams,
	) => Promise<{ list: AdminSchedulingSettingListItem[]; total: number }>;
	listShiftSetting: (params: ListShiftSettingParams) => Promise<{ list: AdminShiftSettingListItem[]; total: number }>;
	listStaffInfo: (params: ListStaffInfoParams) => Promise<{ list: AdminStaffInfoListItem[]; total: number }>;
	listWorkingSchedule: (
		params: ListWorkingScheduleParams,
	) => Promise<{ list: AdminWorkingScheduleListItem[]; total: number }>;
	// system-manage
	listChangePassword: (
		params: ListChangePasswordParams,
	) => Promise<{ list: AdminChangePasswordListItem[]; total: number }>;
	listCommunityConfiguration: (
		params: ListCommunityConfigurationParams,
	) => Promise<{ list: AdminCommunityConfigurationListItem[]; total: number }>;
	listInitializeCell: (
		params: ListInitializeCellParams,
	) => Promise<{ list: AdminInitializeCellListItem[]; total: number }>;
	listRegisterProtocol: (
		params: ListRegisterProtocolParams,
	) => Promise<{ list: AdminRegisterProtocolListItem[]; total: number }>;
	listSystemConfig: (params: ListSystemConfigParams) => Promise<{ list: AdminSystemConfigListItem[]; total: number }>;
}

export function createSettingRepository(options: { db?: DbType } = {}): SettingRepository {
	return options.db ? createDbSettingRepository(options.db) : createInMemorySettingRepository();
}

export function createDbSettingRepository(db: DbType): SettingRepository {
	const fallback = createInMemorySettingRepository();

	return Object.assign(fallback, {
		async listDataPermission(
			params: ListDataPermissionParams,
		): Promise<{ list: AdminDataPermissionListItem[]; total: number }> {
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(smDataPermissions)
				.leftJoin(smRoles, eq(smDataPermissions.roleId, smRoles.id));

			const rows = await db
				.select({
					id: smDataPermissions.id,
					roleId: smDataPermissions.roleId,
					roleName: smRoles.roleName,
					scope: smDataPermissions.scope,
					permissionRule: smDataPermissions.permissionRule,
					dataFilter: smDataPermissions.dataFilter,
					createTime: smDataPermissions.createTime,
					updateTime: smDataPermissions.updateTime,
				})
				.from(smDataPermissions)
				.leftJoin(smRoles, eq(smDataPermissions.roleId, smRoles.id))
				.orderBy(desc(smDataPermissions.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					roleId: row.roleId || "",
					name: row.roleName || "",
					scope: row.scope || "",
					permissionRule: row.permissionRule || "",
					dataFilter: row.dataFilter,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listOrgInfo(params: ListOrgInfoParams): Promise<{ list: AdminOrgInfoListItem[]; total: number }> {
			const where = params.keyword ? like(smOrganizations.orgName, `%${params.keyword}%`) : undefined;

			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(smOrganizations)
				.where(where);

			const rows = await db
				.select({
					id: smOrganizations.id,
					orgName: smOrganizations.orgName,
					orgCode: smOrganizations.orgCode,
					orgType: smOrganizations.orgType,
					sortOrder: smOrganizations.sortOrder,
					parentId: smOrganizations.parentId,
					remark: smOrganizations.remark,
					createTime: smOrganizations.createTime,
					updateTime: smOrganizations.updateTime,
				})
				.from(smOrganizations)
				.where(where)
				.orderBy(desc(smOrganizations.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					name: row.orgName || "",
					code: row.orgCode || "",
					type: row.orgType || "",
					sort: row.sortOrder || 0,
					parentId: row.parentId || "",
					remark: row.remark || "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listRolePermission(
			params: ListRolePermissionParams,
		): Promise<{ list: AdminRolePermissionListItem[]; total: number }> {
			const conditions = [];
			if (params.name) {
				conditions.push(like(smRoles.roleName, `%${params.name}%`));
			}
			if (params.code) {
				conditions.push(like(smRoles.code, `%${params.code}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(smRoles)
				.where(where);

			const rows = await db
				.select({
					id: smRoles.id,
					roleName: smRoles.roleName,
					code: smRoles.code,
					description: smRoles.description,
					isEnabled: smRoles.isEnabled,
					createTime: smRoles.createTime,
					updateTime: smRoles.updateTime,
				})
				.from(smRoles)
				.where(where)
				.orderBy(desc(smRoles.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					name: row.roleName || "",
					code: row.code || "",
					description: row.description || "",
					enabled: row.isEnabled ?? true,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listSchedulingSetting(
			params: ListSchedulingSettingParams,
		): Promise<{ list: AdminSchedulingSettingListItem[]; total: number }> {
			const countResult = await db.select({ total: sql<number>`count(*)` }).from(smSchedulingSettings);

			const rows = await db
				.select({
					id: smSchedulingSettings.id,
					schedulingMode: smSchedulingSettings.schedulingMode,
					applicablePosition: smSchedulingSettings.applicablePosition,
					rotationCycle: smSchedulingSettings.rotationCycle,
					createTime: smSchedulingSettings.createTime,
					updateTime: smSchedulingSettings.updateTime,
				})
				.from(smSchedulingSettings)
				.orderBy(desc(smSchedulingSettings.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					name: row.applicablePosition || "",
					type: row.schedulingMode || "",
					cycle: row.rotationCycle || "",
					effectiveTime: formatDateTime(row.createTime),
					staff: "",
					status: "enabled",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listShiftSetting(
			params: ListShiftSettingParams,
		): Promise<{ list: AdminShiftSettingListItem[]; total: number }> {
			const countResult = await db.select({ total: sql<number>`count(*)` }).from(smShifts);

			const rows = await db
				.select({
					id: smShifts.id,
					shiftName: smShifts.shiftName,
					startTime: smShifts.startTime,
					endTime: smShifts.endTime,
					workDuration: smShifts.workDuration,
					createTime: smShifts.createTime,
					updateTime: smShifts.updateTime,
				})
				.from(smShifts)
				.orderBy(desc(smShifts.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					name: row.shiftName || "",
					shiftName: row.shiftName || "",
					type: "",
					startTime: row.startTime || "",
					endTime: row.endTime || "",
					enabled: true,
					description: "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listStaffInfo(params: ListStaffInfoParams): Promise<{ list: AdminStaffInfoListItem[]; total: number }> {
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(smStaff)
				.leftJoin(smOrganizations, eq(smStaff.orgId, smOrganizations.id));

			const rows = await db
				.select({
					id: smStaff.id,
					employeeNumber: smStaff.employeeNumber,
					name: smStaff.name,
					gender: smStaff.gender,
					position: smStaff.position,
					email: smStaff.email,
					phone: smStaff.phone,
					homeAddress: smStaff.homeAddress,
					avatarUrl: smStaff.avatarUrl,
					orgId: smStaff.orgId,
					orgName: smOrganizations.orgName,
					createTime: smStaff.createTime,
					updateTime: smStaff.updateTime,
				})
				.from(smStaff)
				.leftJoin(smOrganizations, eq(smStaff.orgId, smOrganizations.id))
				.orderBy(desc(smStaff.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					employeeNumber: row.employeeNumber || "",
					name: row.name || "",
					gender: row.gender || "",
					position: row.position || "",
					email: row.email || "",
					phone: row.phone || "",
					address: row.homeAddress || "",
					orgId: row.orgId || "",
					orgName: row.orgName || "",
					avatar: row.avatarUrl || "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listWorkingSchedule(
			params: ListWorkingScheduleParams,
		): Promise<{ list: AdminWorkingScheduleListItem[]; total: number }> {
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(smWorkingSchedules)
				.leftJoin(smStaff, eq(smWorkingSchedules.staffId, smStaff.id))
				.leftJoin(smShifts, eq(smWorkingSchedules.shiftId, smShifts.id));

			const rows = await db
				.select({
					id: smWorkingSchedules.id,
					staffId: smWorkingSchedules.staffId,
					shiftId: smWorkingSchedules.shiftId,
					scheduleDate: smWorkingSchedules.scheduleDate,
					name: smWorkingSchedules.name,
					type: smWorkingSchedules.type,
					startTime: smWorkingSchedules.startTime,
					endTime: smWorkingSchedules.endTime,
					weekday: smWorkingSchedules.weekday,
					managerName: smWorkingSchedules.managerName,
					phone: smWorkingSchedules.phone,
					enabled: smWorkingSchedules.enabled,
					description: smWorkingSchedules.description,
					workDate: smWorkingSchedules.workDate,
					status: smWorkingSchedules.status,
					createTime: smWorkingSchedules.createTime,
					updateTime: smWorkingSchedules.updateTime,
				})
				.from(smWorkingSchedules)
				.leftJoin(smStaff, eq(smWorkingSchedules.staffId, smStaff.id))
				.leftJoin(smShifts, eq(smWorkingSchedules.shiftId, smShifts.id))
				.orderBy(desc(smWorkingSchedules.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					name: row.name || "",
					type: row.type || "",
					startTime: row.startTime || "",
					endTime: row.endTime || "",
					weekday: row.weekday || 0,
					managerName: row.managerName || "",
					phone: row.phone || "",
					enabled: row.enabled ?? true,
					description: row.description || "",
					staffId: row.staffId || "",
					shiftId: row.shiftId || "",
					workDate: row.workDate || "",
					status: row.status || "",
					remark: "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listChangePassword(
			params: ListChangePasswordParams,
		): Promise<{ list: AdminChangePasswordListItem[]; total: number }> {
			const conditions = [];
			if (params.username) {
				conditions.push(like(smChangePasswordRecords.username, `%${params.username}%`));
			}
			if (params.realName) {
				conditions.push(like(smChangePasswordRecords.realName, `%${params.realName}%`));
			}
			if (params.department) {
				conditions.push(like(smChangePasswordRecords.department, `%${params.department}%`));
			}
			if (params.changeType) {
				conditions.push(like(smChangePasswordRecords.changeType, `%${params.changeType}%`));
			}
			if (params.status) {
				conditions.push(like(smChangePasswordRecords.status, `%${params.status}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(smChangePasswordRecords)
				.where(where);

			const rows = await db
				.select({
					id: smChangePasswordRecords.id,
					username: smChangePasswordRecords.username,
					realName: smChangePasswordRecords.realName,
					department: smChangePasswordRecords.department,
					changeTime: smChangePasswordRecords.changeTime,
					changeIp: smChangePasswordRecords.changeIp,
					changeType: smChangePasswordRecords.changeType,
					operator: smChangePasswordRecords.operator,
					status: smChangePasswordRecords.status,
					remark: smChangePasswordRecords.remark,
					createTime: smChangePasswordRecords.createTime,
					updateTime: smChangePasswordRecords.updateTime,
				})
				.from(smChangePasswordRecords)
				.where(where)
				.orderBy(desc(smChangePasswordRecords.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					username: row.username,
					realName: row.realName || "",
					department: row.department || "",
					changeTime: row.changeTime || "",
					changeIp: row.changeIp || "",
					changeType: row.changeType || "",
					operator: row.operator || "",
					status: row.status || "",
					remark: row.remark || "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listCommunityConfiguration(
			params: ListCommunityConfigurationParams,
		): Promise<{ list: AdminCommunityConfigurationListItem[]; total: number }> {
			const conditions = [];
			if (params.settingName) {
				conditions.push(like(smCommunityConfigurations.settingName, `%${params.settingName}%`));
			}
			if (params.settingType) {
				conditions.push(like(smCommunityConfigurations.settingType, `%${params.settingType}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(smCommunityConfigurations)
				.where(where);

			const rows = await db
				.select({
					id: smCommunityConfigurations.id,
					csId: smCommunityConfigurations.csId,
					communityId: smCommunityConfigurations.communityId,
					communityName: smCommunityConfigurations.communityName,
					settingName: smCommunityConfigurations.settingName,
					settingValue: smCommunityConfigurations.settingValue,
					settingType: smCommunityConfigurations.settingType,
					statusCd: smCommunityConfigurations.statusCd,
					remark: smCommunityConfigurations.remark,
					createTime: smCommunityConfigurations.createTime,
					updateTime: smCommunityConfigurations.updateTime,
					operator: smCommunityConfigurations.operator,
				})
				.from(smCommunityConfigurations)
				.where(where)
				.orderBy(desc(smCommunityConfigurations.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					csId: row.csId,
					communityId: row.communityId,
					communityName: row.communityName,
					settingName: row.settingName,
					settingValue: row.settingValue,
					settingType: row.settingType,
					statusCd: row.statusCd,
					remark: row.remark,
					createTime: row.createTime || "",
					updateTime: row.updateTime || "",
					operator: row.operator,
				})),
			};
		},

		async listInitializeCell(
			params: ListInitializeCellParams,
		): Promise<{ list: AdminInitializeCellListItem[]; total: number }> {
			const countResult = await db.select({ total: sql<number>`count(*)` }).from(smInitializeCells);

			const rows = await db
				.select({
					id: smInitializeCells.id,
					initItem: smInitializeCells.initItem,
					initStatus: smInitializeCells.initStatus,
					configParams: smInitializeCells.configParams,
					createTime: smInitializeCells.createTime,
					updateTime: smInitializeCells.updateTime,
				})
				.from(smInitializeCells)
				.orderBy(desc(smInitializeCells.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					initItem: row.initItem || "",
					initStatus: row.initStatus || "",
					configParams: row.configParams,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listRegisterProtocol(
			params: ListRegisterProtocolParams,
		): Promise<{ list: AdminRegisterProtocolListItem[]; total: number }> {
			const countResult = await db.select({ total: sql<number>`count(*)` }).from(smRegisterProtocols);

			const rows = await db
				.select({
					id: smRegisterProtocols.id,
					protocolType: smRegisterProtocols.protocolType,
					protocolTitle: smRegisterProtocols.protocolTitle,
					protocolContent: smRegisterProtocols.protocolContent,
					version: smRegisterProtocols.version,
					status: smRegisterProtocols.status,
					createTime: smRegisterProtocols.createTime,
					updateTime: smRegisterProtocols.updateTime,
				})
				.from(smRegisterProtocols)
				.orderBy(desc(smRegisterProtocols.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					title: row.protocolTitle || "",
					content: row.protocolContent || "",
					version: row.version || "",
					status: row.status || "enabled",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listSystemConfig(
			params: ListSystemConfigParams,
		): Promise<{ list: AdminSystemConfigListItem[]; total: number }> {
			const countResult = await db.select({ total: sql<number>`count(*)` }).from(smSystemConfigs);

			const rows = await db
				.select({
					id: smSystemConfigs.id,
					configKey: smSystemConfigs.configKey,
					configValue: smSystemConfigs.configValue,
					configType: smSystemConfigs.configType,
					configDescription: smSystemConfigs.configDescription,
					status: smSystemConfigs.status,
					createTime: smSystemConfigs.createTime,
					updateTime: smSystemConfigs.updateTime,
				})
				.from(smSystemConfigs)
				.orderBy(desc(smSystemConfigs.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					configId: row.id || "",
					title: row.configKey || "",
					subtitle: row.configDescription || "",
					shortName: "",
					companyName: "",
					logoUrl: "",
					staticUrl: "",
					defaultCommunityCode: "",
					ownerTitle: "",
					propertyMobileTitle: "",
					qqMapKey: "",
					mallUrl: "",
					configKey: row.configKey || "",
					configValue: row.configValue || "",
					description: row.configDescription || "",
					category: row.configType || "",
					isSystem: true,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},
	}) satisfies Partial<SettingRepository>;
}

class InMemorySettingRepository implements SettingRepository {
	async listDataPermission(): Promise<{ list: AdminDataPermissionListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listOrgInfo(): Promise<{ list: AdminOrgInfoListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listRolePermission(): Promise<{ list: AdminRolePermissionListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listSchedulingSetting(): Promise<{ list: AdminSchedulingSettingListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listShiftSetting(): Promise<{ list: AdminShiftSettingListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listStaffInfo(): Promise<{ list: AdminStaffInfoListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listWorkingSchedule(): Promise<{ list: AdminWorkingScheduleListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listChangePassword(): Promise<{ list: AdminChangePasswordListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listCommunityConfiguration(): Promise<{ list: AdminCommunityConfigurationListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listInitializeCell(): Promise<{ list: AdminInitializeCellListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listRegisterProtocol(): Promise<{ list: AdminRegisterProtocolListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listSystemConfig(): Promise<{ list: AdminSystemConfigListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
}

export function createInMemorySettingRepository(): SettingRepository {
	return new InMemorySettingRepository();
}
