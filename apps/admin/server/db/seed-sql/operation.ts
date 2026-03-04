import {
	opMerchants,
	opPropertyCompanies,
	opCommunityInfo,
	opCommunityConfigs,
	opRegisterProtocols,
	opMerchantAdmins,
	opReportGroups,
	opReportInfos,
	opReportComponents,
	type NewOpCommunityConfig,
	type NewOpRegisterProtocol,
	type NewOpMerchantAdmin,
	type NewOpReportGroup,
	type NewOpReportInfo,
	type NewOpReportComponent,
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
	const communityConfigRecords: any[] = mockOpCommunityConfigData.map((item) => {
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
	const protocolRecords: any[] = mockOpRegisterProtocolData.map((item) => {
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

	// ==========================================
	// 6. 生成 op_merchant_admins (商户管理员)
	// ==========================================
	console.log("正在生成 op_merchant_admins SQL...");
	const merchantAdminRecords: any[] = [];

	// 为每个商户生成 1-2 个管理员
	mockMerchantInfoData.forEach((merchant, index) => {
		const merchantId = idMap.get("op_merchants", merchant.merchantName);
		if (!merchantId) return;

		const adminCount = index % 3 === 0 ? 2 : 1; // 每3个商户中有1个有2个管理员
		for (let i = 0; i < adminCount; i++) {
			const adminId = idMap.register("op_merchant_admins", `${merchant.merchantName}-admin-${i + 1}`);
			merchantAdminRecords.push({
				id: adminId,
				merchantId: merchantId,
				adminName: i === 0 ? `${merchant.contactPerson || "管理员"}` : `副管理员${i}`,
				phone: merchant.contactPhone || `138${String(index).padStart(8, "0")}`,
				email: `admin${i + 1}@${merchant.merchantCode}.com`,
				account: `${merchant.merchantCode}_admin${i + 1}`,
				role: i === 0 ? "主管理员" : "副管理员",
				createTime: new Date(),
				updateTime: new Date(),
			});
		}
	});

	if (merchantAdminRecords.length > 0) {
		const query = db
			.insert(opMerchantAdmins as any)
			.values(merchantAdminRecords)
			.toSQL();
		statements.push({
			table: "op_merchant_admins",
			sql: toFullSql(query.sql, query.params),
			recordCount: merchantAdminRecords.length,
		});
		console.log(`✅ 已生成 op_merchant_admins SQL，共 ${merchantAdminRecords.length} 条记录`);
	}

	// ==========================================
	// 7. 生成 op_report_groups (报表分组)
	// ==========================================
	console.log("正在生成 op_report_groups SQL...");
	const reportGroupData = [
		{ name: "运营数据报表", code: "operation_data", description: "运营相关的数据统计报表", order: 1 },
		{ name: "财务报表", code: "financial", description: "财务收支相关报表", order: 2 },
		{ name: "物业服务报表", code: "property_service", description: "物业服务质量报表", order: 3 },
		{ name: "业主满意度报表", code: "owner_satisfaction", description: "业主满意度调查报表", order: 4 },
		{ name: "设备设施报表", code: "facility", description: "设备设施运行报表", order: 5 },
		{ name: "人员管理报表", code: "staff", description: "人员考勤与绩效报表", order: 6 },
		{ name: "安全管理报表", code: "security", description: "安全巡检与事件报表", order: 7 },
		{ name: "能耗分析报表", code: "energy", description: "能源消耗分析报表", order: 8 },
		{ name: "投诉处理报表", code: "complaint", description: "投诉处理统计报表", order: 9 },
		{ name: "综合分析报表", code: "comprehensive", description: "综合数据分析报表", order: 10 },
	];

	const reportGroupRecords: any[] = reportGroupData.map((item) => {
		const id = idMap.register("op_report_groups", item.code);
		return {
			id,
			groupName: item.name,
			groupCode: item.code,
			groupDescription: item.description,
			sortOrder: item.order,
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (reportGroupRecords.length > 0) {
		const query = db
			.insert(opReportGroups as any)
			.values(reportGroupRecords)
			.toSQL();
		statements.push({
			table: "op_report_groups",
			sql: toFullSql(query.sql, query.params),
			recordCount: reportGroupRecords.length,
		});
		console.log(`✅ 已生成 op_report_groups SQL，共 ${reportGroupRecords.length} 条记录`);
	}

	// ==========================================
	// 8. 生成 op_report_infos (报表信息)
	// ==========================================
	console.log("正在生成 op_report_infos SQL...");
	const reportInfoData = [
		{ groupCode: "operation_data", name: "月度运营数据汇总", code: "monthly_operation", type: "summary" },
		{ groupCode: "operation_data", name: "小区入住率统计", code: "occupancy_rate", type: "chart" },
		{ groupCode: "financial", name: "物业费收缴报表", code: "property_fee", type: "table" },
		{ groupCode: "financial", name: "月度收支明细", code: "monthly_finance", type: "detail" },
		{ groupCode: "property_service", name: "报修处理统计", code: "repair_stats", type: "chart" },
		{ groupCode: "property_service", name: "服务响应时效", code: "service_response", type: "chart" },
		{ groupCode: "owner_satisfaction", name: "业主满意度调查", code: "satisfaction_survey", type: "survey" },
		{ groupCode: "owner_satisfaction", name: "服务评价统计", code: "service_rating", type: "chart" },
		{ groupCode: "facility", name: "设备维护记录", code: "facility_maintenance", type: "table" },
		{ groupCode: "facility", name: "设备故障统计", code: "facility_failure", type: "chart" },
		{ groupCode: "staff", name: "员工考勤统计", code: "staff_attendance", type: "table" },
		{ groupCode: "staff", name: "员工绩效评估", code: "staff_performance", type: "summary" },
		{ groupCode: "security", name: "安全巡检记录", code: "security_patrol", type: "table" },
		{ groupCode: "security", name: "安全事件统计", code: "security_incident", type: "chart" },
		{ groupCode: "energy", name: "水电能耗分析", code: "energy_consumption", type: "chart" },
		{ groupCode: "energy", name: "能耗成本统计", code: "energy_cost", type: "summary" },
		{ groupCode: "complaint", name: "投诉处理统计", code: "complaint_stats", type: "chart" },
		{ groupCode: "complaint", name: "投诉类型分析", code: "complaint_analysis", type: "chart" },
		{ groupCode: "comprehensive", name: "运营综合分析", code: "comprehensive_analysis", type: "dashboard" },
		{ groupCode: "comprehensive", name: "年度数据对比", code: "yearly_comparison", type: "chart" },
	];

	const reportInfoRecords: any[] = reportInfoData.map((item) => {
		const id = idMap.register("op_report_infos", item.code);
		const groupId = idMap.get("op_report_groups", item.groupCode);
		return {
			id,
			groupId: groupId || null,
			reportName: item.name,
			reportCode: item.code,
			reportType: item.type,
			dataSourceConfig: JSON.stringify({ source: "database", table: item.code }),
			createTime: new Date(),
			updateTime: new Date(),
		};
	});

	if (reportInfoRecords.length > 0) {
		const query = db
			.insert(opReportInfos as any)
			.values(reportInfoRecords)
			.toSQL();
		statements.push({
			table: "op_report_infos",
			sql: toFullSql(query.sql, query.params),
			recordCount: reportInfoRecords.length,
		});
		console.log(`✅ 已生成 op_report_infos SQL，共 ${reportInfoRecords.length} 条记录`);
	}

	// ==========================================
	// 9. 生成 op_report_components (报表组件)
	// ==========================================
	console.log("正在生成 op_report_components SQL...");
	const reportComponentRecords: any[] = [];

	// 为每个报表生成 1-3 个组件
	reportInfoData.forEach((reportData, index) => {
		const reportId = idMap.get("op_report_infos", reportData.code);
		if (!reportId) return;

		const componentTypes = ["chart", "table", "summary"];
		const componentCount = (index % 3) + 1; // 1-3个组件

		for (let i = 0; i < componentCount; i++) {
			const componentId = idMap.register("op_report_components", `${reportData.code}-component-${i + 1}`);
			const componentType = componentTypes[i % componentTypes.length];

			reportComponentRecords.push({
				id: componentId,
				reportId: reportId,
				componentName: `${reportData.name}-${componentType === "chart" ? "图表" : componentType === "table" ? "表格" : "摘要"}`,
				componentType: componentType,
				componentConfig: {
					type: componentType,
					dataSource: reportData.code,
					refreshInterval: 300,
					displayOptions: {
						showLegend: true,
						showGrid: true,
						animation: true,
					},
				},
				createTime: new Date(),
				updateTime: new Date(),
			});
		}
	});

	if (reportComponentRecords.length > 0) {
		const query = db
			.insert(opReportComponents as any)
			.values(reportComponentRecords)
			.toSQL();
		statements.push({
			table: "op_report_components",
			sql: toFullSql(query.sql, query.params),
			recordCount: reportComponentRecords.length,
		});
		console.log(`✅ 已生成 op_report_components SQL，共 ${reportComponentRecords.length} 条记录`);
	}

	return statements;
}
