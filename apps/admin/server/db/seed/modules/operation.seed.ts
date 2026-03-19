import {
	opPropertyCompanies,
	opMerchants,
	opCommunityInfo,
	opCommunityConfigs,
	opRegisterProtocols,
	opMerchantAdmins,
	opReportGroups,
	opReportInfos,
	opReportComponents,
} from "@01s-11comm/type";
import { defineSeed, sid, rows } from "../helpers";

export default defineSeed({
	name: "operation",
	dependencies: ["community"],
	seed: async (db) => {
		const communityId = sid("community", "sunshine");

		// --- opPropertyCompanies ---
		await db.insert(opPropertyCompanies).values(
			rows([
				{
					id: sid("property-company", "zhonghang"),
					companyName: "中航物业",
					companyCode: "PC-001",
					contactPerson: "张经理",
					contactPhone: "0755-88880001",
					address: "深圳市南山区科技园",
				},
				{
					id: sid("property-company", "vanke"),
					companyName: "万科物业",
					companyCode: "PC-002",
					contactPerson: "李经理",
					contactPhone: "0755-88880002",
					address: "深圳市福田区中心区",
				},
				{
					id: sid("property-company", "greentown"),
					companyName: "绿城物业",
					companyCode: "PC-003",
					contactPerson: "王经理",
					contactPhone: "0571-88880003",
					address: "杭州市西湖区文三路",
				},
			]),
		);

		// --- opMerchants ---
		await db.insert(opMerchants).values(
			rows([
				{
					id: sid("merchant", "convenience-store"),
					merchantName: "阳光便利店",
					merchantCode: "M-001",
					merchantType: "retail",
					contactPerson: "刘店长",
					contactPhone: "13600136001",
					businessAddress: "阳光花园商业街1号",
					businessScope: "日用百货、食品饮料",
					status: "enabled",
				},
				{
					id: sid("merchant", "clinic"),
					merchantName: "社区诊所",
					merchantCode: "M-002",
					merchantType: "medical",
					contactPerson: "陈医生",
					contactPhone: "13600136002",
					businessAddress: "阳光花园商业街5号",
					businessScope: "社区医疗、健康咨询",
					status: "enabled",
				},
				{
					id: sid("merchant", "gym"),
					merchantName: "健身房",
					merchantCode: "M-003",
					merchantType: "fitness",
					contactPerson: "赵教练",
					contactPhone: "13600136003",
					businessAddress: "阳光花园B座负1层",
					businessScope: "健身服务、私教课程",
					status: "enabled",
				},
			]),
		);

		// --- opCommunityInfo ---
		await db.insert(opCommunityInfo).values(
			rows([
				{
					id: sid("community-info", "sunshine-general"),
					communityId,
					operationStatus: "active",
					administrator: "张管理员",
					operationConfig: { autoNotify: true, maintenanceCycle: 30 },
				},
				{
					id: sid("community-info", "sunshine-security"),
					communityId,
					operationStatus: "active",
					administrator: "李安保",
					operationConfig: { patrolInterval: 60, cameraCount: 120 },
				},
			]),
		);

		// --- opCommunityConfigs ---
		await db.insert(opCommunityConfigs).values(
			rows([
				{
					id: sid("community-config", "visitor-approval"),
					communityId,
					configType: "security",
					configKey: "visitor_approval_required",
					configValue: "true",
					configGroup: "access_control",
				},
				{
					id: sid("community-config", "parking-fee"),
					communityId,
					configType: "billing",
					configKey: "monthly_parking_fee",
					configValue: "300",
					configGroup: "parking",
				},
			]),
		);

		// --- opRegisterProtocols ---
		await db.insert(opRegisterProtocols).values(
			rows([
				{
					id: sid("protocol", "user-agreement"),
					protocolType: "registration",
					protocolTitle: "用户注册服务协议",
					protocolContent: "欢迎使用本物业管理平台，请仔细阅读以下协议条款...",
					isRequired: true,
				},
				{
					id: sid("protocol", "privacy-policy"),
					protocolType: "privacy",
					protocolTitle: "隐私保护政策",
					protocolContent: "我们非常重视您的个人信息保护...",
					isRequired: true,
				},
			]),
		);

		// --- opMerchantAdmins ---
		await db.insert(opMerchantAdmins).values(
			rows([
				{
					id: sid("merchant-admin", "convenience-store-admin"),
					merchantId: sid("merchant", "convenience-store"),
					adminName: "刘店长",
					phone: "13600136001",
					email: "liu@store.com",
				},
				{
					id: sid("merchant-admin", "clinic-admin"),
					merchantId: sid("merchant", "clinic"),
					adminName: "陈医生",
					phone: "13600136002",
					email: "chen@clinic.com",
				},
				{
					id: sid("merchant-admin", "gym-admin"),
					merchantId: sid("merchant", "gym"),
					adminName: "赵教练",
					phone: "13600136003",
					email: "zhao@gym.com",
				},
			]),
		);

		// --- opReportGroups ---
		await db.insert(opReportGroups).values(
			rows([
				{
					id: sid("report-group", "financial"),
					groupName: "财务报表",
					groupCode: "RG-FINANCE",
					sortOrder: 1,
				},
				{
					id: sid("report-group", "operational"),
					groupName: "运营报表",
					groupCode: "RG-OPERATION",
					sortOrder: 2,
				},
				{
					id: sid("report-group", "customer"),
					groupName: "客户报表",
					groupCode: "RG-CUSTOMER",
					sortOrder: 3,
				},
			]),
		);

		// --- opReportInfos ---
		await db.insert(opReportInfos).values(
			rows([
				{
					id: sid("report-info", "monthly-income"),
					groupId: sid("report-group", "financial"),
					reportName: "月度收入报表",
					reportCode: "RPT-FIN-001",
					reportType: "chart",
				},
				{
					id: sid("report-info", "complaint-stats"),
					groupId: sid("report-group", "operational"),
					reportName: "投诉统计报表",
					reportCode: "RPT-OPS-001",
					reportType: "table",
				},
				{
					id: sid("report-info", "owner-satisfaction"),
					groupId: sid("report-group", "customer"),
					reportName: "业主满意度报表",
					reportCode: "RPT-CST-001",
					reportType: "chart",
				},
			]),
		);

		// --- opReportComponents ---
		await db.insert(opReportComponents).values(
			rows([
				{
					id: sid("report-component", "income-bar-chart"),
					reportId: sid("report-info", "monthly-income"),
					componentName: "月收入柱状图",
					componentType: "bar_chart",
					componentConfig: { xAxis: "month", yAxis: "amount" },
				},
				{
					id: sid("report-component", "complaint-pie-chart"),
					reportId: sid("report-info", "complaint-stats"),
					componentName: "投诉分类饼图",
					componentType: "pie_chart",
					componentConfig: { dimension: "category", metric: "count" },
				},
				{
					id: sid("report-component", "satisfaction-line-chart"),
					reportId: sid("report-info", "owner-satisfaction"),
					componentName: "满意度趋势线图",
					componentType: "line_chart",
					componentConfig: { xAxis: "month", yAxis: "score" },
				},
			]),
		);
	},
});
