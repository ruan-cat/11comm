import type { ReportGroupListItem } from "@01s-11comm/type/business/operation-team/report-configuration/report-group";

/**
 * @description 报表组模拟数据
 * Report group mock data
 */
export const mockReportGroupData: ReportGroupListItem[] = [
	{
		groupId: "RG001",
		name: "基础数据报表组",
		url: "/reports/basic-data",
		remark: "包含基础业务数据的报表集合，用于日常运营分析",
	},
	{
		groupId: "RG002",
		name: "财务报表组",
		url: "/reports/financial",
		remark: "财务相关报表，包括收支、成本、利润等分析报表",
	},
	{
		groupId: "RG003",
		name: "用户行为报表组",
		url: "/reports/user-behavior",
		remark: "用户活跃度、行为路径、转化率等用户分析报表",
	},
	{
		groupId: "RG004",
		name: "销售业绩报表组",
		url: "/reports/sales-performance",
		remark: "销售数据、业绩统计、趋势分析等销售相关报表",
	},
	{
		groupId: "RG005",
		name: "运营监控报表组",
		url: "/reports/operation-monitor",
		remark: "系统运行状态、性能指标、异常监控等运营报表",
	},
	{
		groupId: "RG006",
		name: "市场分析报表组",
		url: "/reports/market-analysis",
		remark: "市场趋势、竞品分析、客户画像等市场研究报表",
	},
	{
		groupId: "RG007",
		name: "客户服务报表组",
		url: "/reports/customer-service",
		remark: "客户满意度、服务质量、投诉处理等客服相关报表",
	},
	{
		groupId: "RG008",
		name: "产品数据报表组",
		url: "/reports/product-data",
		remark: "产品使用情况、功能分析、版本对比等产品数据报表",
	},
	{
		groupId: "RG009",
		name: "库存管理报表组",
		url: "/reports/inventory-management",
		remark: "库存状态、进销存、周转率等库存管理相关报表",
	},
	{
		groupId: "RG010",
		name: "人力资源报表组",
		url: "/reports/human-resources",
		remark: "员工考勤、绩效评估、薪资统计等人力资源报表",
	},
];

