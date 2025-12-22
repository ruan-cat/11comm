/**
 * @file 组织管理-班次设置假数据
 * @description Shift setting mock data
 */

import type { ShiftSetting } from "@01s-11comm/type";

/**
 * 班次设置假数据
 * Shift setting mock data
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
	{
		id: "6",
		name: "上午班",
		startTime: "08:30",
		endTime: "12:30",
		type: "morning",
		description: "上午半班",
		enabled: true,
	},
	{
		id: "7",
		name: "下午班",
		startTime: "13:30",
		endTime: "17:30",
		type: "afternoon",
		description: "下午半班",
		enabled: true,
	},
	{
		id: "8",
		name: "周末班",
		startTime: "09:00",
		endTime: "17:00",
		type: "full",
		description: "周末班次",
		enabled: true,
	},
	{
		id: "9",
		name: "加班班",
		startTime: "18:00",
		endTime: "21:00",
		type: "evening",
		description: "加班班次",
		enabled: false,
	},
	{
		id: "10",
		name: "深夜班",
		startTime: "22:00",
		endTime: "06:00",
		type: "night",
		description: "深夜值班",
		enabled: true,
	},
];
