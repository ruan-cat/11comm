import type { OptionsType } from "plus-pro-components";

// ==================== 类型定义 ====================

/**
 * 菜单目录列表数据类型
 */
export interface 菜单目录_列表数据 {
	/** 组ID */
	gid: string;
	/** 类型 */
	groupType: string;
	/** 图标 */
	icon: string;
	/** 标签 */
	label: string;
	/** 名称 */
	name: string;
	/** 列序 */
	seq: string;
	/** 归属商户 */
	storeType: string;
	/** 类型文本 */
	类型文本: string;
	/** 归属商户文本 */
	归属商户文本: string;
	/** 创建时间 */
	创建时间: string;
	/** 更新时间 */
	更新时间: string;
}

/**
 * 菜单目录列表查询参数类型
 */
export interface 菜单目录_列表查询_VO {
	/** 菜单组名称 */
	name?: string;
	/** 商户类型 */
	storeType?: string;
	/** 组类型 */
	groupType?: string;
}

/**
 * 菜单目录表单数据类型
 */
export interface 菜单目录表单_VO {
	/** 菜单组编号 */
	gid: string;
	/** 图标 */
	icon: string;
	/** 组名称 */
	name: string;
	/** 序列 */
	seq: number;
	/** 描述 */
	description: string;
	/** 组类型 */
	groupType: string;
	/** 标签 */
	label: string;
	/** 归属商户 */
	storeType: string;
}

// ==================== 常量定义 ====================

/**
 * 组类型选项
 */
export const 组类型选项: OptionsType = [
	{
		label: "系统菜单",
		value: "system",
	},
	{
		label: "商户菜单",
		value: "merchant",
	},
	{
		label: "自定义菜单",
		value: "custom",
	},
	{
		label: "临时菜单",
		value: "temp",
	},
];

/**
 * 归属商户选项
 */
export const 归属商户选项: OptionsType = [
	{
		label: "物业平台",
		value: "property",
	},
	{
		label: "商户平台",
		value: "merchant",
	},
	{
		label: "业主平台",
		value: "owner",
	},
	{
		label: "通用平台",
		value: "common",
	},
];

// ==================== 表格假数据 ====================

/**
 * 表格假数据
 */
export const tableData: 菜单目录_列表数据[] = [
	{
		gid: "MG001",
		groupType: "system",
		icon: "mdi:home",
		label: "首页",
		name: "首页菜单",
		seq: "1",
		storeType: "common",
		类型文本: "系统菜单",
		归属商户文本: "通用平台",
		创建时间: "2024-01-15 09:30:00",
		更新时间: "2024-03-10 14:25:00",
	},
	{
		gid: "MG002",
		groupType: "system",
		icon: "mdi:cog",
		label: "设置",
		name: "系统设置菜单",
		seq: "2",
		storeType: "property",
		类型文本: "系统菜单",
		归属商户文本: "物业平台",
		创建时间: "2024-01-16 10:15:00",
		更新时间: "2024-03-11 16:40:00",
	},
	{
		gid: "MG003",
		groupType: "merchant",
		icon: "mdi:store",
		label: "商户",
		name: "商户管理菜单",
		seq: "3",
		storeType: "merchant",
		类型文本: "商户菜单",
		归属商户文本: "商户平台",
		创建时间: "2024-01-17 11:20:00",
		更新时间: "2024-03-12 09:15:00",
	},
	{
		gid: "MG004",
		groupType: "custom",
		icon: "mdi:account",
		label: "用户",
		name: "用户中心菜单",
		seq: "4",
		storeType: "owner",
		类型文本: "自定义菜单",
		归属商户文本: "业主平台",
		创建时间: "2024-01-18 14:35:00",
		更新时间: "2024-03-13 11:50:00",
	},
	{
		gid: "MG005",
		groupType: "temp",
		icon: "mdi:calendar",
		label: "活动",
		name: "活动推广菜单",
		seq: "5",
		storeType: "merchant",
		类型文本: "临时菜单",
		归属商户文本: "商户平台",
		创建时间: "2024-01-19 16:45:00",
		更新时间: "2024-03-14 13:20:00",
	},
	{
		gid: "MG006",
		groupType: "system",
		icon: "mdi:file-document",
		label: "文档",
		name: "文档管理菜单",
		seq: "6",
		storeType: "common",
		类型文本: "系统菜单",
		归属商户文本: "通用平台",
		创建时间: "2024-01-20 08:55:00",
		更新时间: "2024-03-15 15:35:00",
	},
	{
		gid: "MG007",
		groupType: "merchant",
		icon: "mdi:chart-bar",
		label: "报表",
		name: "数据分析菜单",
		seq: "7",
		storeType: "property",
		类型文本: "商户菜单",
		归属商户文本: "物业平台",
		创建时间: "2024-01-21 12:10:00",
		更新时间: "2024-03-16 10:45:00",
	},
	{
		gid: "MG008",
		groupType: "custom",
		icon: "mdi:bell",
		label: "通知",
		name: "消息通知菜单",
		seq: "8",
		storeType: "owner",
		类型文本: "自定义菜单",
		归属商户文本: "业主平台",
		创建时间: "2024-01-22 15:40:00",
		更新时间: "2024-03-17 14:50:00",
	},
	{
		gid: "MG009",
		groupType: "system",
		icon: "mdi:shield",
		label: "安全",
		name: "安全设置菜单",
		seq: "9",
		storeType: "common",
		类型文本: "系统菜单",
		归属商户文本: "通用平台",
		创建时间: "2024-01-23 09:25:00",
		更新时间: "2024-03-18 16:15:00",
	},
	{
		gid: "MG010",
		groupType: "temp",
		icon: "mdi:gift",
		label: "优惠",
		name: "优惠活动菜单",
		seq: "10",
		storeType: "merchant",
		类型文本: "临时菜单",
		归属商户文本: "商户平台",
		创建时间: "2024-01-24 11:35:00",
		更新时间: "2024-03-19 12:30:00",
	},
	{
		gid: "MG011",
		groupType: "custom",
		icon: "mdi:help-circle",
		label: "帮助",
		name: "帮助中心菜单",
		seq: "11",
		storeType: "owner",
		类型文本: "自定义菜单",
		归属商户文本: "业主平台",
		创建时间: "2024-01-25 13:15:00",
		更新时间: "2024-03-20 14:25:00",
	},
	{
		gid: "MG012",
		groupType: "merchant",
		icon: "mdi:cart",
		label: "购物",
		name: "购物车菜单",
		seq: "12",
		storeType: "merchant",
		类型文本: "商户菜单",
		归属商户文本: "商户平台",
		创建时间: "2024-01-26 10:20:00",
		更新时间: "2024-03-21 09:40:00",
	},
	{
		gid: "MG013",
		groupType: "system",
		icon: "mdi:payment",
		label: "支付",
		name: "支付管理菜单",
		seq: "13",
		storeType: "common",
		类型文本: "系统菜单",
		归属商户文本: "通用平台",
		创建时间: "2024-01-27 14:10:00",
		更新时间: "2024-03-22 11:20:00",
	},
	{
		gid: "MG014",
		groupType: "custom",
		icon: "mdi:message",
		label: "消息",
		name: "消息中心菜单",
		seq: "14",
		storeType: "owner",
		类型文本: "自定义菜单",
		归属商户文本: "业主平台",
		创建时间: "2024-01-28 16:25:00",
		更新时间: "2024-03-23 15:55:00",
	},
	{
		gid: "MG015",
		groupType: "temp",
		icon: "mdi:star",
		label: "收藏",
		name: "收藏夹菜单",
		seq: "15",
		storeType: "merchant",
		类型文本: "临时菜单",
		归属商户文本: "商户平台",
		创建时间: "2024-01-29 08:45:00",
		更新时间: "2024-03-24 10:15:00",
	},
	{
		gid: "MG016",
		groupType: "system",
		icon: "mdi:history",
		label: "历史",
		name: "历史记录菜单",
		seq: "16",
		storeType: "common",
		类型文本: "系统菜单",
		归属商户文本: "通用平台",
		创建时间: "2024-01-30 12:50:00",
		更新时间: "2024-03-25 13:40:00",
	},
	{
		gid: "MG017",
		groupType: "merchant",
		icon: "mdi:trending-up",
		label: "统计",
		name: "统计分析菜单",
		seq: "17",
		storeType: "property",
		类型文本: "商户菜单",
		归属商户文本: "物业平台",
		创建时间: "2024-01-31 15:30:00",
		更新时间: "2024-03-26 16:25:00",
	},
	{
		gid: "MG018",
		groupType: "custom",
		icon: "mdi:map-marker",
		label: "位置",
		name: "位置服务菜单",
		seq: "18",
		storeType: "owner",
		类型文本: "自定义菜单",
		归属商户文本: "业主平台",
		创建时间: "2024-02-01 09:10:00",
		更新时间: "2024-03-27 11:45:00",
	},
	{
		gid: "MG019",
		groupType: "system",
		icon: "mdi:camera",
		label: "拍照",
		name: "拍照上传菜单",
		seq: "19",
		storeType: "common",
		类型文本: "系统菜单",
		归属商户文本: "通用平台",
		创建时间: "2024-02-02 17:20:00",
		更新时间: "2024-03-28 14:10:00",
	},
	{
		gid: "MG020",
		groupType: "temp",
		icon: "mdi:weather-sunny",
		label: "天气",
		name: "天气预报菜单",
		seq: "20",
		storeType: "merchant",
		类型文本: "临时菜单",
		归属商户文本: "商户平台",
		创建时间: "2024-02-03 13:40:00",
		更新时间: "2024-03-29 12:55:00",
	},
	{
		gid: "MG021",
		groupType: "custom",
		icon: "mdi:music",
		label: "音乐",
		name: "音乐播放菜单",
		seq: "21",
		storeType: "owner",
		类型文本: "自定义菜单",
		归属商户文本: "业主平台",
		创建时间: "2024-02-04 10:55:00",
		更新时间: "2024-03-30 15:20:00",
	},
	{
		gid: "MG022",
		groupType: "merchant",
		icon: "mdi:video",
		label: "视频",
		name: "视频播放菜单",
		seq: "22",
		storeType: "merchant",
		类型文本: "商户菜单",
		归属商户文本: "商户平台",
		创建时间: "2024-02-05 14:05:00",
		更新时间: "2024-03-31 09:35:00",
	},
	{
		gid: "MG023",
		groupType: "system",
		icon: "mdi:book",
		label: "学习",
		name: "学习中心菜单",
		seq: "23",
		storeType: "common",
		类型文本: "系统菜单",
		归属商户文本: "通用平台",
		创建时间: "2024-02-06 11:15:00",
		更新时间: "2024-04-01 16:45:00",
	},
	{
		gid: "MG024",
		groupType: "custom",
		icon: "mdi:gamepad",
		label: "游戏",
		name: "游戏娱乐菜单",
		seq: "24",
		storeType: "owner",
		类型文本: "自定义菜单",
		归属商户文本: "业主平台",
		创建时间: "2024-02-07 16:30:00",
		更新时间: "2024-04-02 13:15:00",
	},
	{
		gid: "MG025",
		groupType: "temp",
		icon: "mdi:local-offer",
		label: "促销",
		name: "促销活动菜单",
		seq: "25",
		storeType: "merchant",
		类型文本: "临时菜单",
		归属商户文本: "商户平台",
		创建时间: "2024-02-08 09:40:00",
		更新时间: "2024-04-03 10:50:00",
	},
	{
		gid: "MG026",
		groupType: "system",
		icon: "mdi:clipboard-check",
		label: "任务",
		name: "任务管理菜单",
		seq: "26",
		storeType: "property",
		类型文本: "系统菜单",
		归属商户文本: "物业平台",
		创建时间: "2024-02-09 12:25:00",
		更新时间: "2024-04-04 14:35:00",
	},
	{
		gid: "MG027",
		groupType: "merchant",
		icon: "mdi:contacts",
		label: "联系人",
		name: "通讯录菜单",
		seq: "27",
		storeType: "common",
		类型文本: "商户菜单",
		归属商户文本: "通用平台",
		创建时间: "2024-02-10 15:10:00",
		更新时间: "2024-04-05 11:25:00",
	},
	{
		gid: "MG028",
		groupType: "custom",
		icon: "mdi:calendar-today",
		label: "日程",
		name: "日程安排菜单",
		seq: "28",
		storeType: "owner",
		类型文本: "自定义菜单",
		归属商户文本: "业主平台",
		创建时间: "2024-02-11 08:20:00",
		更新时间: "2024-04-06 16:10:00",
	},
	{
		gid: "MG029",
		groupType: "system",
		icon: "mdi:database",
		label: "数据",
		name: "数据管理菜单",
		seq: "29",
		storeType: "property",
		类型文本: "系统菜单",
		归属商户文本: "物业平台",
		创建时间: "2024-02-12 13:45:00",
		更新时间: "2024-04-07 12:40:00",
	},
	{
		gid: "MG030",
		groupType: "temp",
		icon: "mdi:rocket",
		label: "推广",
		name: "推广活动菜单",
		seq: "30",
		storeType: "merchant",
		类型文本: "临时菜单",
		归属商户文本: "商户平台",
		创建时间: "2024-02-13 10:30:00",
		更新时间: "2024-04-08 15:55:00",
	},
	{
		gid: "MG031",
		groupType: "custom",
		icon: "mdi:puzzle",
		label: "插件",
		name: "插件管理菜单",
		seq: "31",
		storeType: "owner",
		类型文本: "自定义菜单",
		归属商户文本: "业主平台",
		创建时间: "2024-02-14 17:50:00",
		更新时间: "2024-04-09 09:20:00",
	},
	{
		gid: "MG032",
		groupType: "merchant",
		icon: "mdi:chart-pie",
		label: "分析",
		name: "数据分析菜单",
		seq: "32",
		storeType: "common",
		类型文本: "商户菜单",
		归属商户文本: "通用平台",
		创建时间: "2024-02-15 14:15:00",
		更新时间: "2024-04-10 13:30:00",
	},
	{
		gid: "MG033",
		groupType: "system",
		icon: "mdi:lock",
		label: "权限",
		name: "权限管理菜单",
		seq: "33",
		storeType: "property",
		类型文本: "系统菜单",
		归属商户文本: "物业平台",
		创建时间: "2024-02-16 11:40:00",
		更新时间: "2024-04-11 16:25:00",
	},
	{
		gid: "MG034",
		groupType: "custom",
		icon: "mdi:palette",
		label: "主题",
		name: "主题设置菜单",
		seq: "34",
		storeType: "owner",
		类型文本: "自定义菜单",
		归属商户文本: "业主平台",
		创建时间: "2024-02-17 09:05:00",
		更新时间: "2024-04-12 10:15:00",
	},
	{
		gid: "MG035",
		groupType: "temp",
		icon: "mdi:phone",
		label: "通讯",
		name: "通讯服务菜单",
		seq: "35",
		storeType: "merchant",
		类型文本: "临时菜单",
		归属商户文本: "商户平台",
		创建时间: "2024-02-18 16:00:00",
		更新时间: "2024-04-13 14:40:00",
	},
];