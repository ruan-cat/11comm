import type { ParkingLotListItem } from "@01s-11comm/type";

/**
 * @description parking-lot模拟数据
 * ParkingLot mock data
 */
export const mockParkingLotData: ParkingLotListItem[] = [
	{
		parkingLotNumber: "PL001",
		parkingLotType: "地面停车场",
		parkingSpaceType: "标准车位",
		externalCode: "EXT001",
		remark: "这是示例数据1",
		createTime: "2024-01-01 10:00:00",
		updateTime: "2024-01-01 10:00:00",
	},
	{
		parkingLotNumber: "PL002",
		parkingLotType: "地下停车场",
		parkingSpaceType: "大型车位",
		externalCode: "EXT002",
		remark: "这是示例数据2",
		createTime: "2024-01-02 11:00:00",
		updateTime: "2024-01-02 11:00:00",
	},
	{
		parkingLotNumber: "PL003",
		parkingLotType: "立体停车场",
		parkingSpaceType: "无障碍车位",
		externalCode: "EXT003",
		remark: "这是示例数据3",
		createTime: "2024-01-03 12:00:00",
		updateTime: "2024-01-03 12:00:00",
	},
	{
		parkingLotNumber: "PL004",
		parkingLotType: "路边停车位",
		parkingSpaceType: "充电桩车位",
		externalCode: "EXT004",
		createTime: "2024-01-04 13:00:00",
		updateTime: "2024-01-04 13:00:00",
	},
	{
		parkingLotNumber: "PL005",
		parkingLotType: "地面停车场",
		parkingSpaceType: "访客车位",
		externalCode: "EXT005",
		remark: "这是示例数据5",
		createTime: "2024-01-05 14:00:00",
		updateTime: "2024-01-05 14:00:00",
	},
];
