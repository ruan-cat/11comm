import type { OptionsType } from "plus-pro-components";

// ==================== 类型定义 ====================

/**
 * 小区配置列表数据类型
 */
export interface 小区配置_列表数据 {
	/** 主键ID */
	csId: string;
	/** 小区ID */
	communityId: string;
	/** 小区名称 */
	小区名称: string;
	/** 设置名称 */
	settingName: string;
	/** 设置值 */
	settingValue: string;
	/** 设置类型 */
	settingType: string;
	/** 数据状态 */
	statusCd: string;
	/** 状态文本 */
	状态文本: string;
	/** 备注信息 */
	remark: string;
	/** 创建时间 */
	创建时间: string;
	/** 更新时间 */
	更新时间: string;
}

/**
 * 小区配置列表查询参数类型
 */
export interface 小区配置_列表查询_VO {
	/** 小区ID */
	communityId?: string;
	/** 小区名称 */
	小区名称?: string;
	/** 设置名称 */
	settingName?: string;
	/** 设置类型 */
	settingType?: string;
	/** 数据状态 */
	statusCd?: string;
}

/**
 * 小区配置表单数据类型
 */
export interface 小区配置表单_VO {
	/** 主键ID */
	csId: string;
	/** 小区ID */
	communityId: string;
	/** 小区名称 */
	小区名称: string;
	/** 设置名称 */
	settingName: string;
	/** 设置值 */
	settingValue: string;
	/** 设置类型 */
	settingType: string;
	/** 数据状态 */
	statusCd: string;
	/** 备注信息 */
	remark: string;
}

// ==================== 常量定义 ====================

/**
 * settingTypeOptions
 */
export const settingTypeOptions: OptionsType = [
	{
		label: "基础配置",
		value: "1001",
	},
	{
		label: "费用配置",
		value: "2002",
	},
	{
		label: "公告配置",
		value: "3003",
	},
	{
		label: "安防配置",
		value: "4004",
	},
	{
		label: "服务配置",
		value: "5005",
	},
];

/**
 * communityConfigStatusOptions
 */
export const communityConfigStatusOptions: OptionsType = [
	{
		label: "正常",
		value: "0",
	},
	{
		label: "失效",
		value: "1",
	},
];

// ==================== 表格假数据 ====================

/**
 * 表格假数据
 */
export const tableData: 小区配置_列表数据[] = [
	{
		csId: "CS001",
		communityId: "COMM001",
		小区名称: "万科城市花园",
		settingName: "物业费缴纳周期",
		settingValue: "月付",
		settingType: "2002",
		statusCd: "0",
		状态文本: "正常",
		remark: "物业费按月缴纳，每月5日前完成缴费",
		创建时间: "2024-01-15 09:30:00",
		更新时间: "2024-03-10 14:25:00",
	},
	{
		csId: "CS002",
		communityId: "COMM001",
		小区名称: "万科城市花园",
		settingName: "停车费单价",
		settingValue: "200",
		settingType: "2002",
		statusCd: "0",
		状态文本: "正常",
		remark: "地下停车位每月200元",
		创建时间: "2024-01-15 10:15:00",
		更新时间: "2024-02-28 16:40:00",
	},
	{
		csId: "CS003",
		communityId: "COMM002",
		小区名称: "碧桂园凤凰城",
		settingName: "快递代收服务费",
		settingValue: "2",
		settingType: "5005",
		statusCd: "0",
		状态文本: "正常",
		remark: "每件快递收取2元代收服务费",
		创建时间: "2024-01-20 11:20:00",
		更新时间: "2024-03-05 09:15:00",
	},
	{
		csId: "CS004",
		communityId: "COMM002",
		小区名称: "碧桂园凤凰城",
		settingName: "垃圾分类投放时间",
		settingValue: "07:00-09:00,18:00-20:00",
		settingType: "1001",
		statusCd: "0",
		状态文本: "正常",
		remark: "每日早晚两个时间段可投放垃圾",
		创建时间: "2024-01-18 14:35:00",
		更新时间: "2024-03-12 11:50:00",
	},
	{
		csId: "CS005",
		communityId: "COMM003",
		小区名称: "恒大绿洲",
		settingName: "访客停车时长限制",
		settingValue: "4",
		settingType: "4004",
		statusCd: "0",
		状态文本: "正常",
		remark: "访客车辆最长停放4小时，超时收费",
		创建时间: "2024-01-22 16:45:00",
		更新时间: "2024-03-08 13:20:00",
	},
	{
		csId: "CS006",
		communityId: "COMM003",
		小区名称: "恒大绿洲",
		settingName: "公共区域开放时间",
		settingValue: "06:00-22:00",
		settingType: "1001",
		statusCd: "0",
		状态文本: "正常",
		remark: "健身房、游泳池等公共设施开放时间",
		创建时间: "2024-01-19 08:55:00",
		更新时间: "2024-03-15 15:35:00",
	},
	{
		csId: "CS007",
		communityId: "COMM004",
		小区名称: "保利香槟国际",
		settingName: "水电费代收服务费",
		settingValue: "1%",
		settingType: "5005",
		statusCd: "0",
		状态文本: "正常",
		remark: "代收水电费收取1%服务费",
		创建时间: "2024-01-25 12:10:00",
		更新时间: "2024-03-18 10:45:00",
	},
	{
		csId: "CS008",
		communityId: "COMM004",
		小区名称: "保利香槟国际",
		settingName: "小区门禁卡工本费",
		settingValue: "20",
		settingType: "2002",
		statusCd: "0",
		状态文本: "正常",
		remark: "办理或补办门禁卡收取20元工本费",
		创建时间: "2024-01-23 09:25:00",
		更新时间: "2024-03-20 16:15:00",
	},
	{
		csId: "CS009",
		communityId: "COMM005",
		小区名称: "中海国际社区",
		settingName: "噪音控制时间段",
		settingValue: "22:00-07:00",
		settingType: "1001",
		statusCd: "0",
		状态文本: "正常",
		remark: "晚间22:00至次日07:00为安静时间",
		创建时间: "2024-01-28 15:40:00",
		更新时间: "2024-03-22 12:30:00",
	},
	{
		csId: "CS010",
		communityId: "COMM005",
		小区名称: "中海国际社区",
		settingName: "宠物管理费",
		settingValue: "50",
		settingType: "2002",
		statusCd: "0",
		状态文本: "正常",
		remark: "养宠业主每月缴纳50元管理费",
		创建时间: "2024-01-26 13:15:00",
		更新时间: "2024-03-25 14:50:00",
	},
	{
		csId: "CS011",
		communityId: "COMM006",
		小区名称: "龙湖世纪新城",
		settingName: "快递柜使用费",
		settingValue: "免费",
		settingType: "5005",
		statusCd: "0",
		状态文本: "正常",
		remark: "小区智能快递柜免费使用",
		创建时间: "2024-02-01 10:30:00",
		更新时间: "2024-03-28 11:20:00",
	},
	{
		csId: "CS012",
		communityId: "COMM006",
		小区名称: "龙湖世纪新城",
		settingName: "装修保证金",
		settingValue: "5000",
		settingType: "2002",
		statusCd: "0",
		状态文本: "正常",
		remark: "装修前需缴纳5000元保证金",
		创建时间: "2024-01-30 16:25:00",
		更新时间: "2024-03-30 09:40:00",
	},
	{
		csId: "CS013",
		communityId: "COMM007",
		小区名称: "华润置地凤凰城",
		settingName: "公共维修基金比例",
		settingValue: "2%",
		settingType: "2002",
		statusCd: "0",
		状态文本: "正常",
		remark: "按物业费2%比例缴纳维修基金",
		创建时间: "2024-02-03 08:45:00",
		更新时间: "2024-04-01 15:25:00",
	},
	{
		csId: "CS014",
		communityId: "COMM007",
		小区名称: "华润置地凤凰城",
		settingName: "游泳池开放时间",
		settingValue: "06:00-08:00,18:00-21:00",
		settingType: "1001",
		statusCd: "0",
		状态文本: "正常",
		remark: "夏季游泳池开放时间",
		创建时间: "2024-02-05 14:20:00",
		更新时间: "2024-04-02 10:15:00",
	},
	{
		csId: "CS015",
		communityId: "COMM008",
		小区名称: "金地格林小镇",
		settingName: "电梯维保费",
		settingValue: "30",
		settingType: "2002",
		statusCd: "0",
		状态文本: "正常",
		remark: "每月每户电梯维保费30元",
		创建时间: "2024-02-08 11:55:00",
		更新时间: "2024-04-03 13:40:00",
	},
	{
		csId: "CS016",
		communityId: "COMM008",
		小区名称: "金地格林小镇",
		settingName: "门禁系统升级时间",
		settingValue: "02:00-04:00",
		settingType: "1001",
		statusCd: "1",
		状态文本: "失效",
		remark: "系统升级时间段，门禁可能短暂失效",
		创建时间: "2024-02-10 17:10:00",
		更新时间: "2024-04-04 08:25:00",
	},
	{
		csId: "CS017",
		communityId: "COMM009",
		小区名称: "招商果岭花园",
		settingName: "社区巴士费用",
		settingValue: "免费",
		settingType: "5005",
		statusCd: "0",
		状态文本: "正常",
		remark: "小区内社区巴士免费乘坐",
		创建时间: "2024-02-12 09:50:00",
		更新时间: "2024-04-05 16:55:00",
	},
	{
		csId: "CS018",
		communityId: "COMM009",
		小区名称: "招商果岭花园",
		settingName: "保安巡逻频次",
		settingValue: "每小时一次",
		settingType: "4004",
		statusCd: "0",
		状态文本: "正常",
		remark: "24小时保安巡逻，每小时一次",
		创建时间: "2024-02-14 12:40:00",
		更新时间: "2024-04-06 14:20:00",
	},
	{
		csId: "CS019",
		communityId: "COMM010",
		小区名称: "富力桃园",
		settingName: "网络服务费",
		settingValue: "100",
		settingType: "5005",
		statusCd: "0",
		状态文本: "正常",
		remark: "小区宽带网络每月100元",
		创建时间: "2024-02-16 15:25:00",
		更新时间: "2024-04-07 11:45:00",
	},
	{
		csId: "CS020",
		communityId: "COMM010",
		小区名称: "富力桃园",
		settingName: "绿化养护标准",
		settingValue: "一级",
		settingType: "1001",
		statusCd: "0",
		状态文本: "正常",
		remark: "按照一级绿化标准进行养护",
		创建时间: "2024-02-18 07:30:00",
		更新时间: "2024-04-08 17:30:00",
	},
	{
		csId: "CS021",
		communityId: "COMM011",
		小区名称: "雅居乐花园",
		settingName: "二次供水加压费",
		settingValue: "0.5",
		settingType: "2002",
		statusCd: "0",
		状态文本: "正常",
		remark: "高层住宅二次供水每吨0.5元",
		创建时间: "2024-02-20 13:05:00",
		更新时间: "2024-04-09 09:10:00",
	},
	{
		csId: "CS022",
		communityId: "COMM011",
		小区名称: "雅居乐花园",
		settingName: "充电桩使用费",
		settingValue: "1.5",
		settingType: "5005",
		statusCd: "0",
		状态文本: "正常",
		remark: "电动汽车充电桩每小时1.5元",
		创建时间: "2024-02-22 16:40:00",
		更新时间: "2024-04-10 15:15:00",
	},
	{
		csId: "CS023",
		communityId: "COMM012",
		小区名称: "时代倾城",
		settingName: "有线电视费",
		settingValue: "25",
		settingType: "2002",
		statusCd: "0",
		状态文本: "正常",
		remark: "有线电视基础套餐每月25元",
		创建时间: "2024-02-24 10:20:00",
		更新时间: "2024-04-11 12:55:00",
	},
	{
		csId: "CS024",
		communityId: "COMM012",
		小区名称: "时代倾城",
		settingName: "健身器材使用时间",
		settingValue: "06:00-22:00",
		settingType: "1001",
		statusCd: "0",
		状态文本: "正常",
		remark: "户外健身器材使用时间",
		创建时间: "2024-02-26 14:15:00",
		更新时间: "2024-04-12 08:50:00",
	},
	{
		csId: "CS025",
		communityId: "COMM013",
		小区名称: "佳兆业城市广场",
		settingName: "垃圾清运费",
		settingValue: "15",
		settingType: "2002",
		statusCd: "0",
		状态文本: "正常",
		remark: "生活垃圾清运每月15元",
		创建时间: "2024-02-28 11:35:00",
		更新时间: "2024-04-13 16:25:00",
	},
	{
		csId: "CS026",
		communityId: "COMM013",
		小区名称: "佳兆业城市广场",
		settingName: "儿童游乐区开放时间",
		settingValue: "09:00-18:00",
		settingType: "1001",
		statusCd: "0",
		状态文本: "正常",
		remark: "儿童游乐设施开放时间",
		创建时间: "2024-03-01 08:10:00",
		更新时间: "2024-04-14 13:45:00",
	},
	{
		csId: "CS027",
		communityId: "COMM014",
		小区名称: "绿地世纪城",
		settingName: "会议室使用费",
		settingValue: "100/小时",
		settingType: "5005",
		statusCd: "0",
		状态文本: "正常",
		remark: "小区会议室每小时100元",
		创建时间: "2024-03-03 17:20:00",
		更新时间: "2024-04-15 10:30:00",
	},
	{
		csId: "CS028",
		communityId: "COMM014",
		小区名称: "绿地世纪城",
		settingName: "消防检查周期",
		settingValue: "季度检查",
		settingType: "4004",
		statusCd: "0",
		状态文本: "正常",
		remark: "每季度进行一次消防设施检查",
		创建时间: "2024-03-05 12:50:00",
		更新时间: "2024-04-16 14:40:00",
	},
	{
		csId: "CS029",
		communityId: "COMM015",
		小区名称: "新城吾悦广场",
		settingName: "供暖费标准",
		settingValue: "30",
		settingType: "2002",
		statusCd: "0",
		状态文本: "正常",
		remark: "集中供暖每平方米每月30元",
		创建时间: "2024-03-07 09:15:00",
		更新时间: "2024-04-17 11:25:00",
	},
	{
		csId: "CS030",
		communityId: "COMM015",
		小区名称: "新城吾悦广场",
		settingName: "快递配送时间限制",
		settingValue: "08:00-20:00",
		settingType: "1001",
		statusCd: "0",
		状态文本: "正常",
		remark: "快递配送服务时间",
		创建时间: "2024-03-09 15:45:00",
		更新时间: "2024-04-18 16:10:00",
	},
	{
		csId: "CS031",
		communityId: "COMM016",
		小区名称: "正荣财富中心",
		settingName: "管道天然气费",
		settingValue: "3.5",
		settingType: "2002",
		statusCd: "0",
		状态文本: "正常",
		remark: "民用天然气每立方米3.5元",
		创建时间: "2024-03-11 13:30:00",
		更新时间: "2024-04-19 09:55:00",
	},
	{
		csId: "CS032",
		communityId: "COMM016",
		小区名称: "正荣财富中心",
		settingName: "洗衣房使用时间",
		settingValue: "07:00-22:00",
		settingType: "1001",
		statusCd: "0",
		状态文本: "正常",
		remark: "公共洗衣房开放时间",
		创建时间: "2024-03-13 16:05:00",
		更新时间: "2024-04-20 14:15:00",
	},
	{
		csId: "CS033",
		communityId: "COMM017",
		小区名称: "远洋万和城",
		settingName: "储物间租赁费",
		settingValue: "150",
		settingType: "2002",
		statusCd: "0",
		状态文本: "正常",
		remark: "地下储物间每月150元",
		创建时间: "2024-03-15 10:40:00",
		更新时间: "2024-04-21 12:20:00",
	},
	{
		csId: "CS034",
		communityId: "COMM017",
		小区名称: "远洋万和城",
		settingName: "活动中心使用规则",
		settingValue: "预约制",
		settingType: "1001",
		statusCd: "0",
		状态文本: "正常",
		remark: "小区活动中心需提前预约使用",
		创建时间: "2024-03-17 14:55:00",
		更新时间: "2024-04-22 15:35:00",
	},
	{
		csId: "CS035",
		communityId: "COMM018",
		小区名称: "宝龙城市广场",
		settingName: "停车费月卡",
		settingValue: "300",
		settingType: "2002",
		statusCd: "0",
		状态文本: "正常",
		remark: "地下停车场月卡费用300元",
		创建时间: "2024-03-19 11:25:00",
		更新时间: "2024-04-23 10:05:00",
	},
];
