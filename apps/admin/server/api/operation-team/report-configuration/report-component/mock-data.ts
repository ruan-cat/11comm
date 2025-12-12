import type { ReportComponentListItem } from "@01s-11comm/type";

/**
 * @description 报表组件模拟数据
 * Report component mock data
 */
export const mockReportComponentData: ReportComponentListItem[] = [
	{
		componentId: "RC001",
		componentName: "用户统计表格",
		componentType: "表格",
		queryMethod: "sql",
		sql: "SELECT * FROM users WHERE status = 'active'",
		java: "",
		description: "展示活跃用户的统计信息表格组件",
	},
	{
		componentId: "RC002",
		componentName: "销售额饼状图",
		componentType: "饼状图",
		queryMethod: "java",
		sql: "",
		java: "com.report.service.SalesAnalysisService",
		description: "按部门展示销售额分布的饼状图组件",
	},
	{
		componentId: "RC003",
		componentName: "月度收入柱状图",
		componentType: "柱状图",
		queryMethod: "sql",
		sql: "SELECT month, SUM(revenue) FROM monthly_revenue GROUP BY month",
		java: "",
		description: "展示各月度收入对比的柱状图组件",
	},
	{
		componentId: "RC004",
		componentName: "访问量趋势图",
		componentType: "折线图",
		queryMethod: "java",
		sql: "",
		java: "com.report.service.TrafficAnalysisService",
		description: "展示网站访问量变化趋势的折线图组件",
	},
	{
		componentId: "RC005",
		componentName: "订单统计卡片",
		componentType: "数据卡片",
		queryMethod: "sql",
		sql: "SELECT COUNT(*) as total_orders FROM orders WHERE DATE(created_at) = CURRENT_DATE",
		java: "",
		description: "展示今日订单总数的数据卡片组件",
	},
	{
		componentId: "RC006",
		componentName: "产品分类表格",
		componentType: "表格",
		queryMethod: "sql",
		sql: "SELECT category, COUNT(*) as count FROM products GROUP BY category",
		java: "",
		description: "按分类展示产品数量的表格组件",
	},
	{
		componentId: "RC007",
		componentName: "地区分布饼图",
		componentType: "饼状图",
		queryMethod: "sql",
		sql: "SELECT region, COUNT(user_id) FROM user_regions GROUP BY region",
		java: "",
		description: "展示用户地区分布情况的饼状图组件",
	},
	{
		componentId: "RC008",
		componentName: "库存预警表格",
		componentType: "表格",
		queryMethod: "java",
		sql: "",
		java: "com.report.service.InventoryWarningService",
		description: "展示低库存商品预警信息的表格组件",
	},
	{
		componentId: "RC009",
		componentName: "客户满意度图表",
		componentType: "柱状图",
		queryMethod: "sql",
		sql: "SELECT satisfaction_level, COUNT(*) FROM customer_feedback GROUP BY satisfaction_level",
		java: "",
		description: "展示客户满意度调查结果的柱状图组件",
	},
	{
		componentId: "RC010",
		componentName: "实时在线用户卡片",
		componentType: "数据卡片",
		queryMethod: "java",
		sql: "",
		java: "com.report.service.OnlineUserService",
		description: "实时显示当前在线用户数量的数据卡片组件",
	},
];

