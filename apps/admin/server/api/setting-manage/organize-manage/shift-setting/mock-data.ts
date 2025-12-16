import type { ShiftSetting } from "@01s-11comm/type";

/**
 * 模拟班次设置数据
 */
export const mockShiftSettingData: ShiftSetting[] = [
	{
		id: "1",
		name: "早班",
		startTime: "08:00",
		endTime: "16:00",
		type: "morning",
		description: "正常工作班次",
		enabled: true,
	},
	{
		id: "2",
		name: "中班",
		startTime: "16:00",
		endTime: "24:00",
		type: "afternoon",
		description: "下午班次",
		enabled: true,
	},
	{
		id: "3",
		name: "晚班",
		startTime: "18:00",
		endTime: "22:00",
		type: "evening",
		description: "晚间班次",
		enabled: true,
	},
	{
		id: "4",
		name: "夜班",
		startTime: "00:00",
		endTime: "08:00",
		type: "night",
		description: "夜间值班",
		enabled: true,
	},
	{
		id: "5",
		name: "全天班",
		startTime: "09:00",
		endTime: "18:00",
		type: "full",
		description: "全职班次",
		enabled: false,
	},
];
