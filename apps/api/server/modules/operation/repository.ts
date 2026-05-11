import { and, desc, eq, like, sql } from "drizzle-orm";
import {
	cmCommunities,
	opPropertyCompanies,
	opMerchants,
	opMerchantAdmins,
	opReportInfos,
	opReportGroups,
	opReportComponents,
	smChangePasswordRecords,
	smCommunityConfigurations,
	smInitializeCells,
	smRegisterProtocols,
	smSystemConfigs,
} from "@01s-11comm/type";
import type { DbType } from "../../db";
import { formatDateTime } from "../../utils/format-date";
import type {
	AdminCommunityInfoListItem,
	AdminPropertyManagementCompanyListItem,
	AdminPropertyCompanyListItem,
	AdminMerchantInfoListItem,
	AdminMerchantAdminListItem,
	AdminReportInfoListItem,
	AdminReportGroupListItem,
	AdminReportComponentListItem,
	AdminChangePasswordListItem,
	AdminCommunityConfigurationListItem,
	AdminInitializeCellListItem,
	AdminRegisterProtocolListItem,
	AdminSystemConfigListItem,
	ListCommunityInfoParams,
	ListPropertyManagementCompanyParams,
	ListPropertyCompanyParams,
	ListMerchantInfoParams,
	ListMerchantAdminParams,
	ListReportInfoParams,
	ListReportGroupParams,
	ListReportComponentParams,
	ListChangePasswordParams,
	ListCommunityConfigurationParams,
	ListInitializeCellParams,
	ListRegisterProtocolParams,
	ListSystemConfigParams,
} from "./types";

export interface OperationRepository {
	listCommunityInfo: (
		params: ListCommunityInfoParams,
	) => Promise<{ list: AdminCommunityInfoListItem[]; total: number }>;
	listPropertyManagementCompany: (
		params: ListPropertyManagementCompanyParams,
	) => Promise<{ list: AdminPropertyManagementCompanyListItem[]; total: number }>;
	listPropertyCompany: (
		params: ListPropertyCompanyParams,
	) => Promise<{ list: AdminPropertyCompanyListItem[]; total: number }>;
	listMerchantInfo: (params: ListMerchantInfoParams) => Promise<{ list: AdminMerchantInfoListItem[]; total: number }>;
	listMerchantAdmin: (
		params: ListMerchantAdminParams,
	) => Promise<{ list: AdminMerchantAdminListItem[]; total: number }>;
	listReportInfo: (params: ListReportInfoParams) => Promise<{ list: AdminReportInfoListItem[]; total: number }>;
	listReportGroup: (params: ListReportGroupParams) => Promise<{ list: AdminReportGroupListItem[]; total: number }>;
	listReportComponent: (
		params: ListReportComponentParams,
	) => Promise<{ list: AdminReportComponentListItem[]; total: number }>;
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

export function createOperationRepository(options: { db?: DbType } = {}): OperationRepository {
	return options.db ? createDbOperationRepository(options.db) : createInMemoryOperationRepository();
}

export function createDbOperationRepository(db: DbType): OperationRepository {
	const fallback = createInMemoryOperationRepository();

	return Object.assign(fallback, {
		async listCommunityInfo(
			params: ListCommunityInfoParams,
		): Promise<{ list: AdminCommunityInfoListItem[]; total: number }> {
			const conditions = [];
			if (params.communityName) conditions.push(like(cmCommunities.name, `%${params.communityName}%`));
			if (params.communityId) conditions.push(eq(cmCommunities.code, params.communityId));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(cmCommunities)
				.where(where);
			const rows = await db
				.select()
				.from(cmCommunities)
				.where(where)
				.orderBy(desc(cmCommunities.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					communityId: row.code || "",
					communityName: row.name || "",
					communityCode: row.code || "",
					region: row.district || "",
					address: row.address || "",
					landArea: row.landArea,
					buildingArea: row.buildingArea,
					buildingCount: row.buildingCount,
					unitCount: row.unitCount,
					householdCount: row.householdCount,
					parkingCount: row.parkingCount,
					greenRate: row.greenRate,
					plotRatio: row.plotRatio,
					developer: row.developer,
					propertyCompany: row.propertyCompany,
					establishedDate: row.establishedDate,
					phone: row.phone,
					status: row.status,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listPropertyManagementCompany(
			params: ListPropertyManagementCompanyParams,
		): Promise<{ list: AdminPropertyManagementCompanyListItem[]; total: number }> {
			const conditions = [];
			if (params.companyName) conditions.push(like(opPropertyCompanies.companyName, `%${params.companyName}%`));
			if (params.companyId) conditions.push(like(opPropertyCompanies.companyCode, `%${params.companyId}%`));
			if (params.phone) conditions.push(like(opPropertyCompanies.contactPhone, `%${params.phone}%`));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(opPropertyCompanies)
				.where(where);
			const rows = await db
				.select()
				.from(opPropertyCompanies)
				.where(where)
				.orderBy(desc(opPropertyCompanies.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					companyId: row.companyCode || "",
					companyName: row.companyName || "",
					companyCode: row.companyCode,
					contactPerson: row.contactPerson,
					contactPhone: row.contactPhone,
					address: row.address,
					qualificationLevel: row.qualificationLevel,
					qualificationCertNo: null,
					qualificationValidUntil: null,
					remark: row.remark,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listPropertyCompany(
			params: ListPropertyCompanyParams,
		): Promise<{ list: AdminPropertyCompanyListItem[]; total: number }> {
			const conditions = [];
			if (params.companyName) conditions.push(like(opPropertyCompanies.companyName, `%${params.companyName}%`));
			if (params.companyCode) conditions.push(like(opPropertyCompanies.companyCode, `%${params.companyCode}%`));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(opPropertyCompanies)
				.where(where);
			const rows = await db
				.select()
				.from(opPropertyCompanies)
				.where(where)
				.orderBy(desc(opPropertyCompanies.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					companyId: row.companyCode || "",
					companyName: row.companyName || "",
					companyCode: row.companyCode,
					contactPerson: row.contactPerson,
					contactPhone: row.contactPhone,
					address: row.address,
					qualificationLevel: row.qualificationLevel,
					remark: row.remark,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listMerchantInfo(
			params: ListMerchantInfoParams,
		): Promise<{ list: AdminMerchantInfoListItem[]; total: number }> {
			const conditions = [];
			if (params.merchantName) conditions.push(like(opMerchants.merchantName, `%${params.merchantName}%`));
			if (params.merchantCode) conditions.push(like(opMerchants.merchantCode, `%${params.merchantCode}%`));
			if (params.status) conditions.push(eq(opMerchants.status, params.status as any));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(opMerchants)
				.where(where);
			const rows = await db
				.select()
				.from(opMerchants)
				.where(where)
				.orderBy(desc(opMerchants.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					merchantId: row.merchantCode || "",
					merchantName: row.merchantName || "",
					merchantCode: row.merchantCode || "",
					merchantType: row.merchantType,
					contactPerson: row.contactPerson,
					contactPhone: row.contactPhone,
					businessLicense: row.businessLicense,
					legalRepresentative: row.legalRepresentative,
					registeredAddress: row.registeredAddress,
					registeredCapital: row.registeredCapital,
					establishedDate: row.establishedDate,
					businessAddress: row.businessAddress,
					businessScope: row.businessScope,
					businessHours: row.businessHours,
					businessArea: row.businessArea,
					serviceCommunities: row.serviceCommunities,
					contractStartDate: row.contractStartDate,
					contractEndDate: row.contractEndDate,
					bankName: row.bankName,
					bankAccount: row.bankAccount,
					status: row.status,
					remark: row.remark,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listMerchantAdmin(
			params: ListMerchantAdminParams,
		): Promise<{ list: AdminMerchantAdminListItem[]; total: number }> {
			const conditions = [];
			if (params.merchantId) conditions.push(eq(opMerchantAdmins.merchantId, params.merchantId));
			if (params.adminName) conditions.push(like(opMerchantAdmins.adminName, `%${params.adminName}%`));
			if (params.phone) conditions.push(eq(opMerchantAdmins.phone, params.phone));
			if (params.role) conditions.push(eq(opMerchantAdmins.role, params.role));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(opMerchantAdmins)
				.where(where);
			const rows = await db
				.select({
					id: opMerchantAdmins.id,
					merchantId: opMerchantAdmins.merchantId,
					adminName: opMerchantAdmins.adminName,
					phone: opMerchantAdmins.phone,
					email: opMerchantAdmins.email,
					account: opMerchantAdmins.account,
					role: opMerchantAdmins.role,
					createTime: opMerchantAdmins.createTime,
					updateTime: opMerchantAdmins.updateTime,
					merchantName: opMerchants.merchantName,
				})
				.from(opMerchantAdmins)
				.leftJoin(opMerchants, eq(opMerchantAdmins.merchantId, opMerchants.id))
				.where(where)
				.orderBy(desc(opMerchantAdmins.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					merchantId: row.merchantId || "",
					merchantName: row.merchantName || "",
					adminName: row.adminName || "",
					phone: row.phone,
					email: row.email,
					account: row.account,
					role: row.role,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listReportInfo(params: ListReportInfoParams): Promise<{ list: AdminReportInfoListItem[]; total: number }> {
			const conditions = [];
			if (params.reportName) conditions.push(like(opReportInfos.reportName, `%${params.reportName}%`));
			if (params.reportCode) conditions.push(like(opReportInfos.reportCode, `%${params.reportCode}%`));
			if (params.groupId) conditions.push(eq(opReportInfos.groupId, params.groupId as any));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(opReportInfos)
				.where(where);
			const rows = await db
				.select()
				.from(opReportInfos)
				.where(where)
				.orderBy(desc(opReportInfos.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					groupId: row.groupId,
					reportName: row.reportName || "",
					reportCode: row.reportCode,
					reportType: row.reportType,
					dataSourceConfig: row.dataSourceConfig,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listReportGroup(params: ListReportGroupParams): Promise<{ list: AdminReportGroupListItem[]; total: number }> {
			const conditions = [];
			if (params.groupName) conditions.push(like(opReportGroups.groupName, `%${params.groupName}%`));
			if (params.groupCode) conditions.push(like(opReportGroups.groupCode, `%${params.groupCode}%`));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(opReportGroups)
				.where(where);
			const rows = await db
				.select()
				.from(opReportGroups)
				.where(where)
				.orderBy(desc(opReportGroups.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					groupName: row.groupName || "",
					groupCode: row.groupCode,
					groupDescription: row.groupDescription,
					sortOrder: row.sortOrder,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listReportComponent(
			params: ListReportComponentParams,
		): Promise<{ list: AdminReportComponentListItem[]; total: number }> {
			const conditions = [];
			if (params.componentName) conditions.push(like(opReportComponents.componentName, `%${params.componentName}%`));
			if (params.componentType) conditions.push(eq(opReportComponents.componentType, params.componentType));
			if (params.reportId) conditions.push(eq(opReportComponents.reportId, params.reportId as any));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(opReportComponents)
				.where(where);
			const rows = await db
				.select()
				.from(opReportComponents)
				.where(where)
				.orderBy(desc(opReportComponents.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					reportId: row.reportId || "",
					componentName: row.componentName || "",
					componentType: row.componentType,
					componentConfig: row.componentConfig,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listChangePassword(
			params: ListChangePasswordParams,
		): Promise<{ list: AdminChangePasswordListItem[]; total: number }> {
			const conditions = [];
			if (params.username) conditions.push(like(smChangePasswordRecords.username, `%${params.username}%`));
			if (params.realName) conditions.push(like(smChangePasswordRecords.realName, `%${params.realName}%`));
			if (params.department) conditions.push(like(smChangePasswordRecords.department, `%${params.department}%`));
			if (params.changeType) conditions.push(like(smChangePasswordRecords.changeType, `%${params.changeType}%`));
			if (params.status) conditions.push(like(smChangePasswordRecords.status, `%${params.status}%`));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(smChangePasswordRecords)
				.where(where);
			const rows = await db
				.select()
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
					realName: row.realName,
					department: row.department,
					changeTime: row.changeTime,
					changeIp: row.changeIp,
					changeType: row.changeType,
					operator: row.operator,
					status: row.status,
					remark: row.remark,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listCommunityConfiguration(
			params: ListCommunityConfigurationParams,
		): Promise<{ list: AdminCommunityConfigurationListItem[]; total: number }> {
			const conditions = [];
			if (params.settingName) conditions.push(like(smCommunityConfigurations.settingName, `%${params.settingName}%`));
			if (params.settingType) conditions.push(like(smCommunityConfigurations.settingType, `%${params.settingType}%`));

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(smCommunityConfigurations)
				.where(where);
			const rows = await db
				.select()
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
				.select()
				.from(smInitializeCells)
				.orderBy(desc(smInitializeCells.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					initItem: row.initItem || "",
					initStatus: row.initStatus,
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
				.select()
				.from(smRegisterProtocols)
				.orderBy(desc(smRegisterProtocols.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					protocolType: row.protocolType,
					protocolTitle: row.protocolTitle || "",
					protocolContent: row.protocolContent,
					version: row.version,
					status: row.status,
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
				.select()
				.from(smSystemConfigs)
				.orderBy(desc(smSystemConfigs.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					configKey: row.configKey || "",
					configValue: row.configValue,
					configType: row.configType,
					configDescription: row.configDescription,
					status: row.status,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},
	}) satisfies Partial<OperationRepository>;
}

class InMemoryOperationRepository implements OperationRepository {
	async listCommunityInfo(): Promise<{ list: AdminCommunityInfoListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listPropertyManagementCompany(): Promise<{ list: AdminPropertyManagementCompanyListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listPropertyCompany(): Promise<{ list: AdminPropertyCompanyListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listMerchantInfo(): Promise<{ list: AdminMerchantInfoListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listMerchantAdmin(): Promise<{ list: AdminMerchantAdminListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listReportInfo(): Promise<{ list: AdminReportInfoListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listReportGroup(): Promise<{ list: AdminReportGroupListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listReportComponent(): Promise<{ list: AdminReportComponentListItem[]; total: number }> {
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

export function createInMemoryOperationRepository(): OperationRepository {
	return new InMemoryOperationRepository();
}
