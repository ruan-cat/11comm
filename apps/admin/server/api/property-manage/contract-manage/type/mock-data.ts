import type { TypeListItem } from "@01s-11comm/type";

/**
 * @description type模拟数据
 * Type mock data
 */
export const mockTypeData: TypeListItem[] = [
	{
		id: "1",
		typeName: "物业服务合同",
		isAudit: "是",
		description: "用于物业服务的标准合同",
		status: "启用",
		createTime: "2024-01-01 10:00:00",
		updateTime: "2024-01-01 10:00:00",
		remark: "这是示例数据1",
	},
	{
		id: "2",
		typeName: "租赁合同",
		isAudit: "是",
		description: "用于房屋租赁的合同",
		status: "启用",
		createTime: "2024-01-02 11:00:00",
		updateTime: "2024-01-02 11:00:00",
		remark: "这是示例数据2",
	},
	{
		id: "3",
		typeName: "维修合同",
		isAudit: "否",
		description: "用于设备维修的合同",
		status: "禁用",
		createTime: "2024-01-03 12:00:00",
		updateTime: "2024-01-03 12:00:00",
		remark: "这是示例数据3",
	},
	{
		id: "4",
		typeName: "劳务合同",
		isAudit: "是",
		description: "用于劳务派遣的合同",
		status: "启用",
		createTime: "2024-01-04 13:00:00",
		updateTime: "2024-01-04 13:00:00",
	},
	{
		id: "5",
		typeName: "技术合同",
		isAudit: "否",
		description: "用于技术开发的合同",
		status: "启用",
		createTime: "2024-01-05 14:00:00",
		updateTime: "2024-01-05 14:00:00",
		remark: "这是示例数据5",
	},
];
