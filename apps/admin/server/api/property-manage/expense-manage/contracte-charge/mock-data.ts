import type { ContracteChargeListItem } from "@01s-11comm/type";

/**
 * @description 合同收费模拟数据
 * Contract charge mock data
 */
export const mockContracteChargeData: ContracteChargeListItem[] = [
	{
		id: "CC001",
		name: "物业服务合同收费",
		contractName: "阳光花园物业服务合同",
		startTime: "2024-01-01",
		endTime: "2024-12-31",
		status: "启用",
		createTime: "2024-01-01 10:00:00",
		updateTime: "2024-01-01 10:00:00",
		remark: "年度物业服务费用",
	},
	{
		id: "CC002",
		name: "停车场收费合同",
		contractName: "绿城玫瑰园停车场管理合同",
		startTime: "2024-01-01",
		endTime: "2024-12-31",
		status: "启用",
		createTime: "2024-01-02 11:00:00",
		updateTime: "2024-01-02 11:00:00",
		remark: "停车场管理费用",
	},
	{
		id: "CC003",
		name: "公共区域维护合同",
		contractName: "万科城公共设施维护合同",
		startTime: "2024-01-01",
		endTime: "2024-12-31",
		status: "禁用",
		createTime: "2024-01-03 12:00:00",
		updateTime: "2024-01-03 12:00:00",
		remark: "公共区域维护费用",
	},
	{
		id: "CC004",
		name: "绿化养护合同",
		contractName: "保利西湖林语绿化养护合同",
		startTime: "2024-01-01",
		endTime: "2024-12-31",
		status: "启用",
		createTime: "2024-01-04 13:00:00",
		updateTime: "2024-01-04 13:00:00",
	},
	{
		id: "CC005",
		name: "安保服务合同",
		contractName: "融侨锦江安保服务合同",
		startTime: "2024-01-01",
		endTime: "2024-12-31",
		status: "启用",
		createTime: "2024-01-05 14:00:00",
		updateTime: "2024-01-05 14:00:00",
		remark: "24小时安保服务费用",
	},
];
