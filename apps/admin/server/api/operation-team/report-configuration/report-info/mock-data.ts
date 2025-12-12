import type { ReportInfoListItem } from "@01s-11comm/type/business/operation-team/report-configuration/report-info";

/**
 * @description 报表信息模拟数据
 * Report info mock data
 */
export const mockReportInfoData: ReportInfoListItem[] = [
	{
		reportId: "RPT001",
		reportGroup: "财务报表",
		optionTitle: "月度收支统计",
		sortOrder: "1",
		description: "按月统计社区收支情况",
	},
	{
		reportId: "RPT002",
		reportGroup: "财务报表",
		optionTitle: "年度财务汇总",
		sortOrder: "2",
		description: "年度财务收支总体情况分析",
	},
	{
		reportId: "RPT003",
		reportGroup: "物业管理",
		optionTitle: "设备维修统计",
		sortOrder: "3",
		description: "统计各类设备维修频次和费用",
	},
	{
		reportId: "RPT004",
		reportGroup: "物业管理",
		optionTitle: "保洁服务报表",
		sortOrder: "4",
		description: "保洁服务完成情况和质量评价",
	},
	{
		reportId: "RPT005",
		reportGroup: "安防管理",
		optionTitle: "门禁出入记录",
		sortOrder: "5",
		description: "记录社区门禁系统出入情况",
	},
	{
		reportId: "RPT006",
		reportGroup: "安防管理",
		optionTitle: "监控设备状态",
		sortOrder: "6",
		description: "监控设备运行状态和故障统计",
	},
	{
		reportId: "RPT007",
		reportGroup: "业主服务",
		optionTitle: "投诉处理统计",
		sortOrder: "7",
		description: "业主投诉及处理结果统计分析",
	},
	{
		reportId: "RPT008",
		reportGroup: "业主服务",
		optionTitle: "报修服务报表",
		sortOrder: "8",
		description: "业主报修服务响应时间和满意度",
	},
	{
		reportId: "RPT009",
		reportGroup: "停车管理",
		optionTitle: "停车位使用率",
		sortOrder: "9",
		description: "统计停车位的使用情况和收费",
	},
	{
		reportId: "RPT010",
		reportGroup: "停车管理",
		optionTitle: "临时停车统计",
		sortOrder: "10",
		description: "临时停车收费和时长统计",
	},
];

