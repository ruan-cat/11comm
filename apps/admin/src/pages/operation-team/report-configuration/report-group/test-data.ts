import { type OptionsType } from "plus-pro-components";

/** 报表组_列表数据 */
export interface 报表组_列表数据 {
	组ID: string;
	组名称: string;
	组url: string;
	描述: string;
}

/** 报表组_列表查询_VO */
export interface 报表组_列表查询_VO {
	组ID?: string;
	组名称?: string;
	组url?: string;
}

/** 表格数据 */
export const tableData: 报表组_列表数据[] = [
	{
		组ID: "RG001",
		组名称: "基础数据报表组",
		组url: "/reports/basic-data",
		描述: "包含基础业务数据的报表集合，用于日常运营分析",
	},
	{
		组ID: "RG002",
		组名称: "财务报表组",
		组url: "/reports/financial",
		描述: "财务相关报表，包括收支、成本、利润等分析报表",
	},
	{
		组ID: "RG003",
		组名称: "用户行为报表组",
		组url: "/reports/user-behavior",
		描述: "用户活跃度、行为路径、转化率等用户分析报表",
	},
	{
		组ID: "RG004",
		组名称: "销售业绩报表组",
		组url: "/reports/sales-performance",
		描述: "销售数据、业绩统计、趋势分析等销售相关报表",
	},
	{
		组ID: "RG005",
		组名称: "运营监控报表组",
		组url: "/reports/operation-monitor",
		描述: "系统运行状态、性能指标、异常监控等运营报表",
	},
	{
		组ID: "RG006",
		组名称: "市场分析报表组",
		组url: "/reports/market-analysis",
		描述: "市场趋势、竞品分析、客户画像等市场研究报表",
	},
	{
		组ID: "RG007",
		组名称: "客户服务报表组",
		组url: "/reports/customer-service",
		描述: "客户满意度、服务质量、投诉处理等客服相关报表",
	},
	{
		组ID: "RG008",
		组名称: "产品数据报表组",
		组url: "/reports/product-data",
		描述: "产品使用情况、功能分析、版本对比等产品数据报表",
	},
	{
		组ID: "RG009",
		组名称: "库存管理报表组",
		组url: "/reports/inventory-management",
		描述: "库存状态、进销存、周转率等库存管理相关报表",
	},
	{
		组ID: "RG010",
		组名称: "人力资源报表组",
		组url: "/reports/human-resources",
		描述: "员工考勤、绩效评估、薪资统计等人力资源报表",
	},
	{
		组ID: "RG011",
		组名称: "风险控制报表组",
		组url: "/reports/risk-control",
		描述: "风险识别、信用评估、合规检查等风险管理报表",
	},
	{
		组ID: "RG012",
		组名称: "质量管理报表组",
		组url: "/reports/quality-management",
		描述: "质量检测、缺陷统计、改进追踪等质量管控报表",
	},
	{
		组ID: "RG013",
		组名称: "供应链报表组",
		组url: "/reports/supply-chain",
		描述: "供应商评估、采购分析、物流跟踪等供应链管理报表",
	},
	{
		组ID: "RG014",
		组名称: "项目管理报表组",
		组url: "/reports/project-management",
		描述: "项目进度、资源分配、成本控制等项目管理报表",
	},
	{
		组ID: "RG015",
		组名称: "数据质量报表组",
		组url: "/reports/data-quality",
		描述: "数据完整性、一致性、准确性等数据质量监控报表",
	},
	{
		组ID: "RG016",
		组名称: "合规审计报表组",
		组url: "/reports/compliance-audit",
		描述: "合规检查、审计跟踪、法规遵循等审计相关报表",
	},
	{
		组ID: "RG017",
		组名称: "技术运维报表组",
		组url: "/reports/technical-ops",
		描述: "系统性能、服务器状态、网络监控等技术运维报表",
	},
	{
		组ID: "RG018",
		组名称: "营销活动报表组",
		组url: "/reports/marketing-activities",
		描述: "活动效果、推广数据、ROI分析等营销活动报表",
	},
	{
		组ID: "RG019",
		组名称: "安全监控报表组",
		组url: "/reports/security-monitoring",
		描述: "安全事件、威胁检测、访问控制等信息安全报表",
	},
	{
		组ID: "RG020",
		组名称: "环境监测报表组",
		组url: "/reports/environment-monitoring",
		描述: "环境指标、能耗统计、污染监控等环境监测报表",
	},
	{
		组ID: "RG021",
		组名称: "设备维护报表组",
		组url: "/reports/equipment-maintenance",
		描述: "设备状态、维修记录、保养计划等设备管理报表",
	},
	{
		组ID: "RG022",
		组名称: "培训教育报表组",
		组url: "/reports/training-education",
		描述: "培训进度、学习效果、技能评估等教育培训报表",
	},
	{
		组ID: "RG023",
		组名称: "渠道分析报表组",
		组url: "/reports/channel-analysis",
		描述: "渠道效果、合作伙伴、分销数据等渠道管理报表",
	},
	{
		组ID: "RG024",
		组名称: "成本核算报表组",
		组url: "/reports/cost-accounting",
		描述: "成本分摊、预算对比、费用分析等成本核算报表",
	},
	{
		组ID: "RG025",
		组名称: "创新研发报表组",
		组url: "/reports/innovation-rd",
		描述: "研发投入、专利申请、创新成果等研发管理报表",
	},
	{
		组ID: "RG026",
		组名称: "客户关系报表组",
		组url: "/reports/customer-relationship",
		描述: "客户生命周期、忠诚度、流失分析等CRM相关报表",
	},
	{
		组ID: "RG027",
		组名称: "物流配送报表组",
		组url: "/reports/logistics-delivery",
		描述: "配送效率、运输成本、物流轨迹等物流管理报表",
	},
	{
		组ID: "RG028",
		组名称: "业务流程报表组",
		组url: "/reports/business-process",
		描述: "流程效率、瓶颈分析、优化建议等业务流程报表",
	},
	{
		组ID: "RG029",
		组名称: "数字化转型报表组",
		组url: "/reports/digital-transformation",
		描述: "数字化程度、系统集成、转型效果等数字化报表",
	},
	{
		组ID: "RG030",
		组名称: "可持续发展报表组",
		组url: "/reports/sustainable-development",
		描述: "ESG指标、社会责任、可持续发展等相关报表",
	},
	{
		组ID: "RG031",
		组名称: "智能分析报表组",
		组url: "/reports/intelligent-analysis",
		描述: "AI预测、机器学习、智能推荐等智能化分析报表",
	},
	{
		组ID: "RG032",
		组名称: "区域业务报表组",
		组url: "/reports/regional-business",
		描述: "区域分布、地理分析、本地化运营等区域业务报表",
	},
	{
		组ID: "RG033",
		组名称: "移动端数据报表组",
		组url: "/reports/mobile-data",
		描述: "移动应用、用户行为、设备分析等移动端数据报表",
	},
	{
		组ID: "RG034",
		组名称: "社交媒体报表组",
		组url: "/reports/social-media",
		描述: "社交影响力、内容传播、粉丝分析等社交媒体报表",
	},
	{
		组ID: "RG035",
		组名称: "综合仪表板报表组",
		组url: "/reports/comprehensive-dashboard",
		描述: "综合性仪表板，集成各业务线关键指标的概览报表",
	},
];