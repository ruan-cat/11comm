import { and, asc, desc, eq, like, sql } from "drizzle-orm";
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
import type { OrganizationTreeNode } from "@01s-11comm/type";
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
	getOrgInfoTree: () => Promise<OrganizationTreeNode[]>;
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
	// system-manage CUD
	createChangePassword: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	updateChangePassword: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	deleteChangePassword: (id: string) => Promise<boolean>;
	createCommunityConfiguration: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	updateCommunityConfiguration: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	deleteCommunityConfiguration: (id: string) => Promise<boolean>;
	createInitializeCell: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	updateInitializeCell: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	deleteInitializeCell: (id: string) => Promise<boolean>;
	createRegisterProtocol: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	updateRegisterProtocol: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	deleteRegisterProtocol: (id: string) => Promise<boolean>;
	createSystemConfig: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	updateSystemConfig: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	deleteSystemConfig: (id: string) => Promise<boolean>;
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

		async getOrgInfoTree(): Promise<OrganizationTreeNode[]> {
			const rows = await db
				.select({
					id: smOrganizations.id,
					orgName: smOrganizations.orgName,
					orgCode: smOrganizations.orgCode,
					orgType: smOrganizations.orgType,
					sortOrder: smOrganizations.sortOrder,
					parentId: smOrganizations.parentId,
					remark: smOrganizations.remark,
				})
				.from(smOrganizations)
				.orderBy(asc(smOrganizations.sortOrder), asc(smOrganizations.orgName));

			return buildOrgInfoTree(rows);
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
		// system-manage CUD: change-password
		async createChangePassword(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const [row] = await db
				.insert(smChangePasswordRecords)
				.values({
					username: String(data.username || ""),
					realName: data.realName ? String(data.realName) : null,
					department: data.department ? String(data.department) : null,
					changeTime: data.changeTime ? String(data.changeTime) : null,
					changeIp: data.changeIp ? String(data.changeIp) : null,
					changeType: data.changeType ? String(data.changeType) : null,
					operator: data.operator ? String(data.operator) : null,
					status: data.status ? String(data.status) : null,
					remark: data.remark ? String(data.remark) : null,
				})
				.returning();
			return row ?? null;
		},
		async updateChangePassword(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const id = String(data.id || "");
			if (!id) return null;
			const updates: Record<string, unknown> = {};
			if (data.username !== undefined) updates.username = String(data.username);
			if (data.realName !== undefined) updates.realName = data.realName ? String(data.realName) : null;
			if (data.department !== undefined) updates.department = data.department ? String(data.department) : null;
			if (data.changeType !== undefined) updates.changeType = data.changeType ? String(data.changeType) : null;
			if (data.status !== undefined) updates.status = data.status ? String(data.status) : null;
			if (data.remark !== undefined) updates.remark = data.remark ? String(data.remark) : null;
			const [row] = await db
				.update(smChangePasswordRecords)
				.set(updates)
				.where(eq(smChangePasswordRecords.id, id))
				.returning();
			return row ?? null;
		},
		async deleteChangePassword(id: string): Promise<boolean> {
			const result = await db
				.delete(smChangePasswordRecords)
				.where(eq(smChangePasswordRecords.id, id))
				.returning({ id: smChangePasswordRecords.id });
			return result.length > 0;
		},

		// system-manage CUD: community-configuration
		async createCommunityConfiguration(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const [row] = await db
				.insert(smCommunityConfigurations)
				.values({
					csId: String(data.csId || ""),
					communityId: String(data.communityId || ""),
					communityName: String(data.communityName || ""),
					settingName: String(data.settingName || ""),
					settingValue: data.settingValue ? String(data.settingValue) : null,
					settingType: String(data.settingType || ""),
					statusCd: String(data.statusCd || "1"),
					remark: data.remark ? String(data.remark) : null,
					operator: data.operator ? String(data.operator) : null,
				})
				.returning();
			return row ?? null;
		},
		async updateCommunityConfiguration(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const id = String(data.id || "");
			if (!id) return null;
			const updates: Record<string, unknown> = {};
			if (data.communityName !== undefined) updates.communityName = String(data.communityName);
			if (data.settingName !== undefined) updates.settingName = String(data.settingName);
			if (data.settingValue !== undefined) updates.settingValue = data.settingValue ? String(data.settingValue) : null;
			if (data.settingType !== undefined) updates.settingType = String(data.settingType);
			if (data.statusCd !== undefined) updates.statusCd = String(data.statusCd);
			if (data.remark !== undefined) updates.remark = data.remark ? String(data.remark) : null;
			if (data.operator !== undefined) updates.operator = data.operator ? String(data.operator) : null;
			const [row] = await db
				.update(smCommunityConfigurations)
				.set(updates)
				.where(eq(smCommunityConfigurations.id, id))
				.returning();
			return row ?? null;
		},
		async deleteCommunityConfiguration(id: string): Promise<boolean> {
			const result = await db
				.delete(smCommunityConfigurations)
				.where(eq(smCommunityConfigurations.id, id))
				.returning({ id: smCommunityConfigurations.id });
			return result.length > 0;
		},

		// system-manage CUD: initialize-cell
		async createInitializeCell(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const [row] = await db
				.insert(smInitializeCells)
				.values({
					initItem: String(data.initItem || ""),
					initStatus: data.initStatus ? String(data.initStatus) : undefined,
					configParams: data.configParams ?? undefined,
				})
				.returning();
			return row ?? null;
		},
		async updateInitializeCell(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const id = String(data.id || "");
			if (!id) return null;
			const updates: Record<string, unknown> = {};
			if (data.initItem !== undefined) updates.initItem = data.initItem ? String(data.initItem) : null;
			if (data.initStatus !== undefined) updates.initStatus = data.initStatus ? String(data.initStatus) : null;
			if (data.configParams !== undefined) updates.configParams = data.configParams;
			const [row] = await db.update(smInitializeCells).set(updates).where(eq(smInitializeCells.id, id)).returning();
			return row ?? null;
		},
		async deleteInitializeCell(id: string): Promise<boolean> {
			const result = await db
				.delete(smInitializeCells)
				.where(eq(smInitializeCells.id, id))
				.returning({ id: smInitializeCells.id });
			return result.length > 0;
		},

		// system-manage CUD: register-protocol
		async createRegisterProtocol(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const [row] = await db
				.insert(smRegisterProtocols)
				.values({
					protocolType: data.protocolType ? String(data.protocolType) : null,
					protocolTitle: String(data.protocolTitle || data.title || ""),
					protocolContent: data.protocolContent
						? String(data.protocolContent)
						: data.content
							? String(data.content)
							: null,
					version: data.version ? String(data.version) : null,
					status: (data.status as "enabled" | "disabled") || "enabled",
				})
				.returning();
			return row ?? null;
		},
		async updateRegisterProtocol(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const id = String(data.id || "");
			if (!id) return null;
			const updates: Record<string, unknown> = {};
			if (data.protocolType !== undefined) updates.protocolType = data.protocolType ? String(data.protocolType) : null;
			if (data.protocolTitle !== undefined || data.title !== undefined)
				updates.protocolTitle = String(data.protocolTitle || data.title);
			if (data.protocolContent !== undefined || data.content !== undefined)
				updates.protocolContent = data.protocolContent
					? String(data.protocolContent)
					: data.content
						? String(data.content)
						: null;
			if (data.version !== undefined) updates.version = data.version ? String(data.version) : null;
			if (data.status !== undefined) updates.status = data.status;
			const [row] = await db.update(smRegisterProtocols).set(updates).where(eq(smRegisterProtocols.id, id)).returning();
			return row ?? null;
		},
		async deleteRegisterProtocol(id: string): Promise<boolean> {
			const result = await db
				.delete(smRegisterProtocols)
				.where(eq(smRegisterProtocols.id, id))
				.returning({ id: smRegisterProtocols.id });
			return result.length > 0;
		},

		// system-manage CUD: system-config
		async createSystemConfig(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const [row] = await db
				.insert(smSystemConfigs)
				.values({
					configKey: String(data.configKey || ""),
					configValue: data.configValue ? String(data.configValue) : null,
					configType: data.configType ? String(data.configType) : null,
					configDescription: data.configDescription ? String(data.configDescription) : null,
					status: (data.status as "enabled" | "disabled") || "enabled",
				})
				.returning();
			return row ?? null;
		},
		async updateSystemConfig(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const id = String(data.id || "");
			if (!id) return null;
			const updates: Record<string, unknown> = {};
			if (data.configKey !== undefined) updates.configKey = String(data.configKey);
			if (data.configValue !== undefined) updates.configValue = data.configValue ? String(data.configValue) : null;
			if (data.configType !== undefined) updates.configType = data.configType ? String(data.configType) : null;
			if (data.configDescription !== undefined)
				updates.configDescription = data.configDescription ? String(data.configDescription) : null;
			if (data.status !== undefined) updates.status = data.status;
			const [row] = await db.update(smSystemConfigs).set(updates).where(eq(smSystemConfigs.id, id)).returning();
			return row ?? null;
		},
		async deleteSystemConfig(id: string): Promise<boolean> {
			const result = await db
				.delete(smSystemConfigs)
				.where(eq(smSystemConfigs.id, id))
				.returning({ id: smSystemConfigs.id });
			return result.length > 0;
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
	async getOrgInfoTree(): Promise<OrganizationTreeNode[]> {
		return [];
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
	// CUD fallbacks
	async createChangePassword(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { id: "mock-id", ...data };
	}
	async updateChangePassword(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { ...data };
	}
	async deleteChangePassword(): Promise<boolean> {
		return true;
	}
	async createCommunityConfiguration(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { id: "mock-id", ...data };
	}
	async updateCommunityConfiguration(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { ...data };
	}
	async deleteCommunityConfiguration(): Promise<boolean> {
		return true;
	}
	async createInitializeCell(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { id: "mock-id", ...data };
	}
	async updateInitializeCell(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { ...data };
	}
	async deleteInitializeCell(): Promise<boolean> {
		return true;
	}
	async createRegisterProtocol(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { id: "mock-id", ...data };
	}
	async updateRegisterProtocol(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { ...data };
	}
	async deleteRegisterProtocol(): Promise<boolean> {
		return true;
	}
	async createSystemConfig(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { id: "mock-id", ...data };
	}
	async updateSystemConfig(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { ...data };
	}
	async deleteSystemConfig(): Promise<boolean> {
		return true;
	}
}

export function createInMemorySettingRepository(): SettingRepository {
	return new InMemorySettingRepository();
}

interface OrgInfoTreeRow {
	id: string;
	orgName: string | null;
	orgCode: string | null;
	orgType: string | null;
	sortOrder: number | null;
	parentId: string | null;
	remark: string | null;
}

function buildOrgInfoTree(rows: OrgInfoTreeRow[]): OrganizationTreeNode[] {
	const treeMap = new Map<string, OrganizationTreeNode>();
	const roots: OrganizationTreeNode[] = [];

	for (const row of rows) {
		const node: OrganizationTreeNode = {
			id: row.id,
			name: row.orgName || "",
			sort: row.sortOrder || 0,
			children: [],
		};
		if (row.orgCode) node.code = row.orgCode;
		if (row.orgType) node.type = row.orgType as OrganizationTreeNode["type"];
		if (row.parentId) node.parentId = row.parentId;
		if (row.remark) node.description = row.remark;
		treeMap.set(row.id, node);
	}

	for (const row of rows) {
		const node = treeMap.get(row.id);
		if (!node) continue;
		if (row.parentId && treeMap.has(row.parentId)) {
			treeMap.get(row.parentId)?.children?.push(node);
			continue;
		}
		roots.push(node);
	}

	return roots;
}
