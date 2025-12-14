import type { MeterReadingTypeListItem } from "@01s-11comm/type";

/**
 * @description meter-reading-type模拟数据
 * MeterReadingType mock data
 */
export const mockMeterReadingTypeData: MeterReadingTypeListItem[] = [
	{
		id: "1",
		name: "水表",
		description: "用于计量用水量",
		status: "启用",
		createTime: "2024-01-01 10:00:00",
		updateTime: "2024-01-01 10:00:00",
		remark: "这是示例数据1",
	},
	{
		id: "2",
		name: "电表",
		description: "用于计量用电量",
		status: "启用",
		createTime: "2024-01-02 11:00:00",
		updateTime: "2024-01-02 11:00:00",
		remark: "这是示例数据2",
	},
	{
		id: "3",
		name: "燃气表",
		description: "用于计量用气量",
		status: "禁用",
		createTime: "2024-01-03 12:00:00",
		updateTime: "2024-01-03 12:00:00",
		remark: "这是示例数据3",
	},
	{
		id: "4",
		name: "暖气表",
		description: "用于计量供暖量",
		status: "启用",
		createTime: "2024-01-04 13:00:00",
		updateTime: "2024-01-04 13:00:00",
	},
	{
		id: "5",
		name: "热水表",
		description: "用于计量热水用量",
		status: "启用",
		createTime: "2024-01-05 14:00:00",
		updateTime: "2024-01-05 14:00:00",
		remark: "这是示例数据5",
	},
];
