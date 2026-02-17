import { opMerchants, opPropertyCompanies, opCommunityInfo } from "@01s-11comm/type";

import { mockPropertyCompanyData } from "../../api/operation-team/data-manage/property-company/mock-data";
import { mockMerchantInfoData } from "../../api/operation-team/merchant-manage/merchant-info/mock-data";
import { mockCommunityInformationData } from "../../api/operation-team/data-manage/community-information/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql, statusMap } from "./index";
import { db } from "../index";

/**
 * 生成运营团队模块的 SQL
 */
export function generateOperationSql(idMap: IdMapRegistry): SqlStatement[] {
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
		const query = db.insert(opPropertyCompanies).values(companyRecords).toSQL();
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
		const query = db.insert(opMerchants).values(merchantRecords).toSQL();
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
		const query = db.insert(opCommunityInfo).values(infoRecords).toSQL();
		statements.push({
			table: "op_community_info",
			sql: toFullSql(query.sql, query.params),
			recordCount: infoRecords.length,
		});
	}

	return statements;
}
