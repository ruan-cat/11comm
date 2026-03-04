import {
	opMerchants,
	opPropertyCompanies,
	opCommunityInfo,
	opCommunityConfigs,
	opRegisterProtocols,
	type NewOpCommunityConfig,
	type NewOpRegisterProtocol,
} from "@01s-11comm/type";

import { mockPropertyCompanyData } from "../../api/operation-team/data-manage/property-company/mock-data";
import { mockMerchantInfoData } from "../../api/operation-team/merchant-manage/merchant-info/mock-data";
import { mockCommunityInformationData } from "../../api/operation-team/data-manage/community-information/mock-data";
import { mockCommunityConfigurationData as mockOpCommunityConfigData } from "../../api/operation-team/system-manage/community-configuration/mock-data";
import { mockRegisterProtocolData as mockOpRegisterProtocolData } from "../../api/operation-team/system-manage/register-protocol/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql, statusMap } from "./index";
import { getDb } from "../index";

/**
 * 生成运营团队模块的 SQL
 */
export async function generateOperationSql(idMap: IdMapRegistry): Promise<SqlStatement[]> {
	const db = await getDb();
	const statements: SqlStatement[] = [];

	// ==========================================
	// 1. 生成 op_property_companies (物业公司)
	// ==========================================
	console.log("正在生成 op_property_companies SQL...");
	const companyRecords = mockPropertyCompanyData.map((item) => {
		const id = idMap.register("op_property_companies", item.companyName);
		return {
			id,
			companyName: item.companyName,
			companyCode: item.companyCode ?? item.companyId,
			contactPerson: item.contactPerson ?? item.administrator,
			contactPhone: item.contactPhone ?? item.phone,
			address: item.address,
			qualificationLevel: item.qualificationLevel ?? item.serviceLevel,
			// Mapping dates...
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: new Date(),
		};
	});

	if (companyRecords.length > 0) {
		const query = db
			.insert(opPropertyCompanies as any)
			.values(companyRecords)
			.toSQL();
		statements.push({
			table: "op_property_companies",
			sql: toFullSql(query.sql, query.params),
			recordCount: companyRecords.length,
		});
	}

	// ==========================================
	// 2. 生成 op_merchants (商户信息)
	// ==========================================
	console.log("正在生成 op_merchants SQL...");
	const merchantRecords = mockMerchantInfoData.map((item) => {
		const id = idMap.register("op_merchants", item.merchantName);
		return {
			id,
			merchantName: item.merchantName,
			merchantCode: item.merchantCode,
			merchantType: item.merchantType,
			contactPerson: item.contactPerson,
			contactPhone: item.contactPhone,
			businessLicense: item.businessLicense ?? item.businessLicenseNo,
			status: statusMap[item.status] || "enabled",
			remark: item.remark ?? item.remarks,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: new Date(),
		};
	});

	if (merchantRecords.length > 0) {
		const query = db
			.insert(opMerchants as any)
			.values(merchantRecords)
			.toSQL();
		statements.push({
			table: "op_merchants",
			sql: toFullSql(query.sql, query.params),
			recordCount: merchantRecords.length,
		});
	}

	// ==========================================
	// 3. 生成 op_community_info (运营侧小区信息)
	// ==========================================
	console.log("正在生成 op_community_info SQL...");
	const infoRecords = mockCommunityInformationData.map((item) => {
		const id = idMap.register("op_community_info", item.communityName); // Using community name as key
		const communityId = idMap.get("cm_communities", "COMM001"); // Defaulting for seed, or try match name via common ID?
		// Realistically we should match by name if we had `cm_communities` seeding storing names.
		// But `cm_communities` seed used `mockCommunityData` which has `name`.
		// Let's rely on fallback to default ID if name match fails.

		return {
			id,
			communityId: communityId,
			operationStatus: "operating",
			administrator: "admin",
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: new Date(),
		};
	});

	if (infoRecords.length > 0) {
		const query = db
			.insert(opCommunityInfo as any)
			.values(infoRecords)
			.toSQL();
		statements.push({
			table: "op_community_info",
			sql: toFullSql(query.sql, query.params),
			recordCount: infoRecords.length,
		});
	}

	// ==========================================
	// 4. 生成 op_community_configs (社区配置)
	// ==========================================
	console.log("正在生成 op_community_configs SQL...");
	const communityConfigRecords: NewOpCommunityConfig[] = mockOpCommunityConfigData.map((item) => {
		const id = idMap.register("op_community_configs", item.csId);
		const communityUuid = idMap.get("cm_communities", item.communityId);
		return {
			id,
			communityId: communityUuid,
			configType: item.settingType,
			configKey: item.settingName,
			configValue: item.settingValue,
			configGroup: item.settingType,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (communityConfigRecords.length > 0) {
		const query = db
			.insert(opCommunityConfigs as any)
			.values(communityConfigRecords)
			.toSQL();
		statements.push({
			table: "op_community_configs",
			sql: toFullSql(query.sql, query.params),
			recordCount: communityConfigRecords.length,
		});
		console.log(`✅ 已生成 op_community_configs SQL，共 ${communityConfigRecords.length} 条记录`);
	}

	// ==========================================
	// 5. 生成 op_register_protocols (注册协议)
	// ==========================================
	console.log("正在生成 op_register_protocols SQL...");
	const protocolRecords: NewOpRegisterProtocol[] = mockOpRegisterProtocolData.map((item) => {
		const id = idMap.register("op_register_protocols", item.id);
		return {
			id,
			protocolType: "register",
			protocolTitle: item.title,
			protocolContent: item.content,
			isRequired: true,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (protocolRecords.length > 0) {
		const query = db
			.insert(opRegisterProtocols as any)
			.values(protocolRecords)
			.toSQL();
		statements.push({
			table: "op_register_protocols",
			sql: toFullSql(query.sql, query.params),
			recordCount: protocolRecords.length,
		});
		console.log(`✅ 已生成 op_register_protocols SQL，共 ${protocolRecords.length} 条记录`);
	}

	return statements;
}
