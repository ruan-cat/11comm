/**
 * @file 业务共同类型定义
 * @description 导出业务内共享通用的下拉选项数组
 */

import type { OptionsType } from "./OptionsType";

/**
 * @description 合同类型选项
 * Contract type options
 */
export const contractTypeOptions: OptionsType = [
	{ label: "物业服务合同", value: "物业服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
	{ label: "维修合同", value: "维修合同" },
];

/**
 * @description 审核状态选项
 * Audit status options
 */
export const auditStatusOptions: OptionsType = [
	{ label: "待审核", value: "待审核" },
	{ label: "已通过", value: "已通过" },
	{ label: "已拒绝", value: "已拒绝" },
];

/** 费用项名称选项 Expense item name options */
export const expenseItemNameOptions: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "水电费", value: "水电费" },
	{ label: "停车费", value: "停车费" },
	{ label: "维修费", value: "维修费" },
];

/**
 * @description 费用标识选项
 * Expense identifier options
 */
export const expenseIdentifierOptions: OptionsType = [
	{ label: "周期性费用", value: "周期性费用" },
	{ label: "一次性费用", value: "一次性费用" },
];

/**
 * @description 费用类型选项
 * Expense type options
 */
export const expenseTypeOptions: OptionsType = [
	{ label: "物业服务费", value: "物业服务费" },
	{ label: "水费", value: "水费" },
	{ label: "电费", value: "电费" },
	{ label: "燃气费", value: "燃气费" },
	{ label: "停车费", value: "停车费" },
	{ label: "垃圾处理费", value: "垃圾处理费" },
	{ label: "维修费", value: "维修费" },
];

/** 费用类型选项别名 Fee type options alias */
export const feeTypeOptions = expenseTypeOptions;

/**
 * @description 付费类型选项
 * Payment type options
 */
export const paymentTypeOptions: OptionsType = [
	{ label: "预付费", value: "预付费" },
	{ label: "后付费", value: "后付费" },
];

/**
 * @description 账户抵扣选项
 * Account deduction options
 */
export const accountDeductionOptions: OptionsType = [
	{ label: "是", value: "是" },
	{ label: "否", value: "否" },
];

/**
 * @description 状态选项
 * Status options
 */
export const statusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 车辆状态选项
 * Parking space status options
 */
export const parkingSpaceStatusOptions: OptionsType = [
	{ label: "空闲", value: "空闲" },
	{ label: "已出租", value: "已出租" },
	{ label: "已出售", value: "已出售" },
	{ label: "维修中", value: "维修中" },
	{ label: "其他", value: "其他" },
];

/**
 * @description 费用项选项
 * Expense item options
 */
export const expenseItemOptions: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "水费", value: "水费" },
	{ label: "电费", value: "电费" },
	{ label: "燃气费", value: "燃气费" },
	{ label: "停车费", value: "停车费" },
	{ label: "维修费", value: "维修费" },
	{ label: "垃圾处理费", value: "垃圾处理费" },
	{ label: "装修管理费", value: "装修管理费" },
	{ label: "其他费用", value: "其他费用" },
];

/**
 * @description 折扣类型选项
 * Discount type options
 */
export const discountTypeOptions: OptionsType = [
	{ label: "比例折扣", value: "比例折扣" },
	{ label: "固定金额折扣", value: "固定金额折扣" },
	{ label: "减免期", value: "减免期" },
];

/**
 * @description 规则选项
 * Rule options
 */
export const ruleOptions: OptionsType = [
	{ label: "按比例", value: "按比例" },
	{ label: "按固定金额", value: "按固定金额" },
	{ label: "按时间段", value: "按时间段" },
];

/**
 * @description 申请类型选项
 * Application type options
 */
export const applicationTypeOptions: OptionsType = [
	{ label: "费用减免", value: "费用减免" },
	{ label: "延期缴费", value: "延期缴费" },
	{ label: "分期付款", value: "分期付款" },
];

/**
 * @description 表计类型选项
 * Meter type options
 */
export const meterTypeOptions: OptionsType = [
	{ label: "水表", value: "水表" },
	{ label: "电表", value: "电表" },
	{ label: "燃气表", value: "燃气表" },
];

/**
 * @description 收费对象选项
 * Charge object options
 */
export const chargeObjectOptions: OptionsType = [
	{ label: "业主", value: "业主" },
	{ label: "租户", value: "租户" },
	{ label: "使用人", value: "使用人" },
];

/**
 * @description 退费原因选项
 * Refund reason options
 */
export const refundReasonOptions: OptionsType = [
	{ label: "计算错误", value: "计算错误" },
	{ label: "重复缴费", value: "重复缴费" },
	{ label: "服务未提供", value: "服务未提供" },
	{ label: "其他原因", value: "其他原因" },
];

/**
 * @description 催缴方式选项
 * Reminder method options
 */
export const reminderMethodOptions: OptionsType = [
	{ label: "短信", value: "短信" },
	{ label: "电话", value: "电话" },
	{ label: "上门", value: "上门" },
	{ label: "APP推送", value: "APP推送" },
	{ label: "邮件", value: "邮件" },
];

/**
 * @description 催缴状态选项
 * Reminder status options
 */
export const reminderStatusOptions: OptionsType = [
	{ label: "未催缴", value: "未催缴" },
	{ label: "已催缴", value: "已催缴" },
	{ label: "催缴成功", value: "催缴成功" },
	{ label: "催缴失败", value: "催缴失败" },
];

/**
 * @description 房屋类型选项
 * House type options
 */
export const houseTypeOptions: OptionsType = [
	{ label: "住宅", value: "住宅" },
	{ label: "商铺", value: "商铺" },
	{ label: "办公", value: "办公" },
	{ label: "车库", value: "车库" },
	{ label: "其他", value: "其他" },
];

/**
 * @description 房屋状态选项
 * House status options
 */
export const houseStatusOptions: OptionsType = [
	{ label: "自住", value: "自住" },
	{ label: "出租", value: "出租" },
	{ label: "空置", value: "空置" },
	{ label: "装修中", value: "装修中" },
];

/**
 * @description 发票类型选项
 * Invoice type options
 */
export const invoiceTypeOptions: OptionsType = [
	{ label: "普通发票", value: "普通发票" },
	{ label: "增值税专用发票", value: "增值税专用发票" },
	{ label: "电子发票", value: "电子发票" },
];

/**
 * @description 人员类型选项
 * Person type options
 */
export const personTypeOptions: OptionsType = [
	{ label: "业主", value: "业主" },
	{ label: "家人", value: "家人" },
	{ label: "租户", value: "租户" },
	{ label: "使用人", value: "使用人" },
];

/**
 * @description 人员角色选项
 * Person role options
 */
export const personRoleOptions: OptionsType = [
	{ label: "产权人", value: "产权人" },
	{ label: "联系人", value: "联系人" },
	{ label: "使用人", value: "使用人" },
];

/**
 * @description 性别选项
 * Gender options
 */
export const genderOptions: OptionsType = [
	{ label: "男", value: "男" },
	{ label: "女", value: "女" },
];

/**
 * @description 成员类型选项
 * Member type options
 */
export const memberTypeOptions: OptionsType = [
	{ label: "家人", value: "家人" },
	{ label: "租户", value: "租户" },
	{ label: "使用人", value: "使用人" },
];

/**
 * @description 场地类型选项
 * Venue type options
 */
export const venueTypeOptions: OptionsType = [
	{ label: "篮球场", value: "篮球场" },
	{ label: "羽毛球场", value: "羽毛球场" },
	{ label: "乒乓球室", value: "乒乓球室" },
	{ label: "健身房", value: "健身房" },
	{ label: "游泳池", value: "游泳池" },
	{ label: "会议室", value: "会议室" },
];

/**
 * @description 预约状态选项
 * Reservation status options
 */
export const reservationStatusOptions: OptionsType = [
	{ label: "可预约", value: "可预约" },
	{ label: "已预约", value: "已预约" },
	{ label: "使用中", value: "使用中" },
	{ label: "维护中", value: "维护中" },
];

/**
 * @description 车辆类型选项
 * Vehicle type options
 */
export const vehicleTypeOptions: OptionsType = [
	{ label: "小型汽车", value: "小型汽车" },
	{ label: "大型汽车", value: "大型汽车" },
	{ label: "新能源汽车", value: "新能源汽车" },
	{ label: "摩托车", value: "摩托车" },
];

/**
 * @description 车牌类型选项
 * License plate type options
 */
export const licensePlateTypeOptions: OptionsType = [
	{ label: "蓝牌", value: "蓝牌" },
	{ label: "黄牌", value: "黄牌" },
	{ label: "绿牌", value: "绿牌" },
	{ label: "白牌", value: "白牌" },
];

/**
 * @description 汽车品牌选项
 * Car brand options
 */
export const carBrandOptions: OptionsType = [
	{ label: "大众", value: "大众" },
	{ label: "丰田", value: "丰田" },
	{ label: "本田", value: "本田" },
	{ label: "日产", value: "日产" },
	{ label: "奔驰", value: "奔驰" },
	{ label: "宝马", value: "宝马" },
	{ label: "奥迪", value: "奥迪" },
	{ label: "特斯拉", value: "特斯拉" },
	{ label: "比亚迪", value: "比亚迪" },
	{ label: "其他", value: "其他" },
];

/**
 * @description 车辆颜色选项
 * Vehicle color options
 */
export const vehicleColorOptions: OptionsType = [
	{ label: "白色", value: "白色" },
	{ label: "黑色", value: "黑色" },
	{ label: "银色", value: "银色" },
	{ label: "灰色", value: "灰色" },
	{ label: "红色", value: "红色" },
	{ label: "蓝色", value: "蓝色" },
	{ label: "黄色", value: "黄色" },
	{ label: "绿色", value: "绿色" },
	{ label: "其他", value: "其他" },
];

/**
 * @description 车位类型选项
 * Parking space type options
 */
export const parkingSpaceTypeOptions: OptionsType = [
	{ label: "标准车位", value: "标准车位" },
	{ label: "机械车位", value: "机械车位" },
	{ label: "子母车位", value: "子母车位" },
	{ label: "无障碍车位", value: "无障碍车位" },
];

/**
 * @description 停车场选项
 * Parking lot options
 */
export const parkingLotOptions: OptionsType = [
	{ label: "地下停车场", value: "地下停车场" },
	{ label: "地面停车场", value: "地面停车场" },
	{ label: "立体停车场", value: "立体停车场" },
];

/**
 * @description 停车场类型选项
 * Parking lot type options
 */
export const parkingLotTypeOptions: OptionsType = [
	{ label: "地下停车场", value: "地下停车场" },
	{ label: "地面停车场", value: "地面停车场" },
	{ label: "立体停车场", value: "立体停车场" },
	{ label: "路边停车场", value: "路边停车场" },
	{ label: "楼顶停车场", value: "楼顶停车场" },
];

/**
 * @description 签到状态选项
 * Check-in status options
 */
export const checkInStatusOptions: OptionsType = [
	{ label: "未签到", value: "未签到" },
	{ label: "已签到", value: "已签到" },
	{ label: "迟到", value: "迟到" },
	{ label: "缺勤", value: "缺勤" },
];

/**
 * @description 保留小数位选项
 * Decimal places options
 */
export const decimalPlacesOptions: OptionsType = [
	{ label: "保留0位小数", value: 0 },
	{ label: "保留1位小数", value: 1 },
	{ label: "保留2位小数", value: 2 },
	{ label: "保留3位小数", value: 3 },
	{ label: "保留4位小数", value: 4 },
];

/**
 * @description 进位方式选项
 * Rounding method options
 */
export const roundingMethodOptions: OptionsType = [
	{ label: "四舍五入", value: "四舍五入" },
	{ label: "向上进位", value: "向上进位" },
	{ label: "向下舍去", value: "向下舍去" },
	{ label: "银行家进位", value: "银行家进位" },
];

/**
 * @description 手机缴费选项
 * Mobile payment options
 */
export const mobilePaymentOptions: OptionsType = [
	{ label: "支持", value: "支持" },
	{ label: "不支持", value: "不支持" },
];

/**
 * @description 巡检方式选项
 * Patrol method options
 */
export const patrolMethodOptions: OptionsType = [
	{ label: "日常巡检", value: "日常巡检" },
	{ label: "专项巡检", value: "专项巡检" },
	{ label: "突击巡检", value: "突击巡检" },
	{ label: "定期巡检", value: "定期巡检" },
];

/**
 * @description 巡检情况选项
 * Patrol situation options
 */
export const patrolSituationOptions: OptionsType = [
	{ label: "正常", value: "正常" },
	{ label: "异常", value: "异常" },
	{ label: "需要维修", value: "需要维修" },
	{ label: "需要更换", value: "需要更换" },
];

/**
 * @description 巡检点状态选项
 * Patrol point status options
 */
export const patrolPointStatusOptions: OptionsType = [
	{ label: "正常", value: "正常" },
	{ label: "异常", value: "异常" },
	{ label: "已处理", value: "已处理" },
	{ label: "待处理", value: "待处理" },
];

/**
 * @description 报修状态选项
 * Repair status options
 */
export const repairStatusOptions: OptionsType = [
	{ label: "待处理", value: "待处理" },
	{ label: "处理中", value: "处理中" },
	{ label: "已完成", value: "已完成" },
	{ label: "已取消", value: "已取消" },
	{ label: "已暂停", value: "已暂停" },
];

/**
 * @description 报修类型选项
 * Repair type options
 */
export const repairTypeOptions: OptionsType = [
	{ label: "水管维修", value: "水管维修" },
	{ label: "电路维修", value: "电路维修" },
	{ label: "门窗维修", value: "门窗维修" },
	{ label: "电梯维修", value: "电梯维修" },
	{ label: "消防设施", value: "消防设施" },
	{ label: "清洁服务", value: "清洁服务" },
	{ label: "绿化养护", value: "绿化养护" },
	{ label: "其他", value: "其他" },
];

/**
 * @description 报修来源选项
 * Repair source options
 */
export const repairSourceOptions: OptionsType = [
	{ label: "业主APP", value: "业主APP" },
	{ label: "电话报修", value: "电话报修" },
	{ label: "现场报修", value: "现场报修" },
	{ label: "微信公众号", value: "微信公众号" },
	{ label: "物业前台", value: "物业前台" },
	{ label: "其他", value: "其他" },
];

/**
 * @description 回访状态选项
 * Return visit status options
 */
export const returnVisitStatusOptions: OptionsType = [
	{ label: "未回访", value: "未回访" },
	{ label: "已回访", value: "已回访" },
	{ label: "满意", value: "满意" },
	{ label: "不满意", value: "不满意" },
];
