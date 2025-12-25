/**
 * @file 业务共同类型定义
 * @description 导出业务内共享通用的下拉选项数组
 */

import type { OptionsType } from "./OptionsType";

/**
 * @description 业务受理状态选项
 * Handling business status options
 */
export const handlingStatusOptions: OptionsType = [
	{ label: "待缴费", value: "待缴费" },
	{ label: "已缴费", value: "已缴费" },
	{ label: "已取消", value: "已取消" },
];

/**
 * 修改类型选项
 */
export const changePasswordRecordTypeOptions: OptionsType = [
	{ label: "用户自行修改", value: "用户自行修改" },
	{ label: "管理员重置", value: "管理员重置" },
	{ label: "强制修改", value: "强制修改" },
	{ label: "首次登录修改", value: "首次登录修改" },
];

/**
 * 修改方式选项
 */
export const changeMethodOptions: OptionsType = changePasswordRecordTypeOptions;

/**
 * 修改状态选项
 */
export const changePasswordRecordStatusOptions: OptionsType = [
	{ label: "成功", value: "成功" },
	{ label: "失败", value: "失败" },
	{ label: "待审核", value: "待审核" },
];

/**
 * 修改密码状态选项
 */
export const changePasswordStatusOptions: OptionsType = [
	{ label: "成功", value: "成功" },
	{ label: "失败", value: "失败" },
	{ label: "待审核", value: "待审核" },
];

/**
 * 修改密码成功选项
 */
export const changePasswordSuccessOptions: OptionsType = [
	{ label: "是", value: "是" },
	{ label: "否", value: "否" },
];

/**
 * 部门选项
 */
export const changePasswordRecordDepartmentOptions: OptionsType = [
	{ label: "物业团队", value: "物业团队" },
	{ label: "开发团队", value: "开发团队" },
	{ label: "运营团队", value: "运营团队" },
	{ label: "财务部门", value: "财务部门" },
	{ label: "客服部门", value: "客服部门" },
	{ label: "维修部门", value: "维修部门" },
	{ label: "安保部门", value: "安保部门" },
	{ label: "绿化部门", value: "绿化部门" },
];

/**
 * 部门选项别名
 */
export const departmentOptions = changePasswordRecordDepartmentOptions;

/**
 * 用户角色选项
 */
export const userRoleOptions: OptionsType = [
	{ label: "管理员", value: "管理员" },
	{ label: "普通用户", value: "普通用户" },
	{ label: "访客", value: "访客" },
];

/**
 * 运营团队-配置类型选项
 */
export const operationCommunityConfigurationTypeOptions: OptionsType = [
	{ label: "文本", value: "文本" },
	{ label: "数字", value: "数字" },
	{ label: "布尔", value: "布尔" },
	{ label: "JSON", value: "JSON" },
	{ label: "URL", value: "URL" },
];

/**
 * 运营团队-分组选项
 */
export const operationCommunityConfigurationGroupOptions: OptionsType = [
	{ label: "基础配置", value: "基础配置" },
	{ label: "安全配置", value: "安全配置" },
	{ label: "通知配置", value: "通知配置" },
	{ label: "支付配置", value: "支付配置" },
	{ label: "界面配置", value: "界面配置" },
];

/**
 * 运营团队-启用状态选项
 */
export const operationCommunityConfigurationEnabledOptions: OptionsType = [
	{ label: "启用", value: true },
	{ label: "禁用", value: false },
];

/**
 * 运营团队-协议类型选项
 */
export const operationRegisterProtocolTypeOptions: OptionsType = [
	{ label: "用户注册协议", value: "用户注册协议" },
	{ label: "隐私政策", value: "隐私政策" },
	{ label: "服务条款", value: "服务条款" },
	{ label: "免责声明", value: "免责声明" },
	{ label: "版权声明", value: "版权声明" },
];

/**
 * 运营团队-启用状态选项
 */
export const operationRegisterProtocolEnabledOptions: OptionsType = [
	{ label: "启用", value: true },
	{ label: "禁用", value: false },
];

/**
 * 运营团队-必读状态选项
 */
export const operationRegisterProtocolRequiredOptions: OptionsType = [
	{ label: "是", value: true },
	{ label: "否", value: false },
];

/**
 * 注册协议状态选项
 */
export const registerProtocolStatusOptions: OptionsType = [
	{ label: "草稿", value: "草稿" },
	{ label: "已发布", value: "已发布" },
	{ label: "已停用", value: "已停用" },
];

/**
 * 运营团队-配置类型选项
 */
export const operationSystemConfigTypeOptions: OptionsType = [
	{ label: "文本", value: "文本" },
	{ label: "数字", value: "数字" },
	{ label: "布尔", value: "布尔" },
	{ label: "JSON", value: "JSON" },
	{ label: "XML", value: "XML" },
];

/**
 * 运营团队-启用状态选项
 */
export const operationSystemConfigEnabledOptions: OptionsType = [
	{ label: "启用", value: true },
	{ label: "禁用", value: false },
];

/**
 * 运营团队-系统内置选项
 */
export const operationSystemConfigSystemOptions: OptionsType = [
	{ label: "是", value: true },
	{ label: "否", value: false },
];


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
	{ label: "审核完成", value: "审核完成" },
	{ label: "审核失败", value: "审核失败" },
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

/**
 * @description 维修类型选项
 * Maintenance type options
 */
export const maintenanceTypeOptions: OptionsType = [
	{ label: "日常维修", value: "日常维修" },
	{ label: "紧急维修", value: "紧急维修" },
	{ label: "计划维修", value: "计划维修" },
	{ label: "预防性维修", value: "预防性维修" },
];

/**
 * @description 报修设置类型选项
 * Repairs setting type options
 */
export const repairsSettingTypeOptions: OptionsType = [
	{ label: "保洁单", value: "保洁单" },
	{ label: "维修单", value: "维修单" },
];

/**
 * @description 派单方式选项
 * Dispatch method options
 */
export const dispatchMethodOptions: OptionsType = [
	{ label: "抢单", value: "抢单" },
	{ label: "指派", value: "指派" },
	{ label: "轮训", value: "轮训" },
];

/**
 * @description 区域选项
 * Area options
 */
export const areaOptions: OptionsType = [
	{ label: "房屋", value: "房屋" },
	{ label: "公共区域", value: "公共区域" },
	{ label: "车库", value: "车库" },
	{ label: "非房屋", value: "非房屋" },
];

/**
 * @description 楼栋选项
 * Building options
 */
export const buildingOptions: OptionsType = [
	{ label: "1栋", value: "1栋" },
	{ label: "2栋", value: "2栋" },
	{ label: "3栋", value: "3栋" },
	{ label: "A栋", value: "A栋" },
	{ label: "B栋", value: "B栋" },
	{ label: "C栋", value: "C栋" },
];

/**
 * @description 单元选项
 * Unit options
 */
export const unitOptions: OptionsType = [
	{ label: "1单元", value: "1单元" },
	{ label: "2单元", value: "2单元" },
	{ label: "3单元", value: "3单元" },
];

/**
 * @description 维修类型选项
 * Repair category options
 */
export const repairCategoryOptions: OptionsType = [
	{ label: "紧急维修", value: "紧急维修" },
	{ label: "一般维修", value: "一般维修" },
	{ label: "计划维修", value: "计划维修" },
	{ label: "预防性维修", value: "预防性维修" },
];

/**
 * @description 工单状态选项
 * Work order status options
 */
export const workOrderStatusOptions: OptionsType = [
	{ label: "待处理", value: "待处理" },
	{ label: "处理中", value: "处理中" },
	{ label: "已完成", value: "已完成" },
	{ label: "已取消", value: "已取消" },
];

/**
 * @description 紧急程度选项
 * Urgency level options
 */
export const urgencyLevelOptions: OptionsType = [
	{ label: "普通", value: "普通" },
	{ label: "紧急", value: "紧急" },
	{ label: "非常紧急", value: "非常紧急" },
];

/**
 * @description 小区选项
 * Community options
 */
export const communityOptions: OptionsType = [
	{ label: "阳光花园", value: "阳光花园" },
	{ label: "翠湖苑", value: "翠湖苑" },
	{ label: "碧水蓝天", value: "碧水蓝天" },
	{ label: "金色家园", value: "金色家园" },
];

/**
 * @description 收费状态选项
 * Charge status options
 */
export const chargeStatusOptions: OptionsType = [
	{ label: "已收费", value: "已收费" },
	{ label: "未收费", value: "未收费" },
	{ label: "部分收费", value: "部分收费" },
];

/**
 * @description 巡检类型选项
 * Patrol type options
 */
export const patrolTypeOptions: OptionsType = [
	{ label: "日常巡检", value: "日常巡检" },
	{ label: "专项巡检", value: "专项巡检" },
	{ label: "设备巡检", value: "设备巡检" },
	{ label: "安全巡检", value: "安全巡检" },
];

/**
 * @description 巡检级别选项
 * Patrol level options
 */
export const patrolLevelOptions: OptionsType = [
	{ label: "一级", value: "一级" },
	{ label: "二级", value: "二级" },
	{ label: "三级", value: "三级" },
];

/**
 * @description 提醒类型选项
 * Reminder type options
 */
export const reminderTypeOptions: OptionsType = [
	{ label: "短信提醒", value: "短信提醒" },
	{ label: "电话提醒", value: "电话提醒" },
	{ label: "APP推送", value: "APP推送" },
	{ label: "微信提醒", value: "微信提醒" },
];

/**
 * @description 费用项选项
 * Fee item options
 */
export const feeItemOptions: OptionsType = [
	{ label: "物业费", value: "物业费" },
	{ label: "水费", value: "水费" },
	{ label: "电费", value: "电费" },
	{ label: "燃气费", value: "燃气费" },
	{ label: "停车费", value: "停车费" },
];

/**
 * @description 收费大类选项
 * Charge category options
 */
export const chargeCategoryOptions: OptionsType = [
	{ label: "物业服务费", value: "物业服务费" },
	{ label: "能源费用", value: "能源费用" },
	{ label: "车辆服务费", value: "车辆服务费" },
	{ label: "其他费用", value: "其他费用" },
];

/**
 * @description 费用大类选项别名
 * Fee category options alias
 */
export const feeCategoryOptions = chargeCategoryOptions;

/**
 * @description 年度选项
 * Year options
 */
export const yearOptions: OptionsType = [
	{ label: "2024年", value: "2024" },
	{ label: "2025年", value: "2025" },
	{ label: "2026年", value: "2026" },
];

/**
 * @description 支付方式选项
 * Payment method options
 */
export const paymentMethodOptions: OptionsType = [
	{ label: "现金", value: "现金" },
	{ label: "微信支付", value: "微信支付" },
	{ label: "支付宝", value: "支付宝" },
	{ label: "银行卡", value: "银行卡" },
	{ label: "银行转账", value: "银行转账" },
];

/**
 * @description 费用状态选项
 * Fee status options
 */
export const feeStatusOptions: OptionsType = [
	{ label: "已缴费", value: "已缴费" },
	{ label: "未缴费", value: "未缴费" },
	{ label: "部分缴费", value: "部分缴费" },
	{ label: "逾期", value: "逾期" },
];

/**
 * @description 回访设置选项
 * Return visit setting options
 */
export const returnVisitSettingOptions: OptionsType = [
	{ label: "需要回访", value: "需要回访" },
	{ label: "不需要回访", value: "不需要回访" },
];

/**
 * @description 工单状态选项
 * Issues status options
 */
export const issuesStatusOptions: OptionsType = [
	{ label: "待处理", value: "待处理" },
	{ label: "处理中", value: "处理中" },
	{ label: "已完成", value: "已完成" },
	{ label: "已取消", value: "已取消" },
];

/**
 * @description 强制回单状态选项
 * Mandatory return issue status options
 */
export const mandatoryReturnIssueStatusOptions: OptionsType = [
	{ label: "待回单", value: "待回单" },
	{ label: "已回单", value: "已回单" },
	{ label: "已强制回单", value: "已强制回单" },
];

/**
 * @description 预约状态选项
 * Booking status options
 */
export const bookingStatusOptions: OptionsType = [
	{ label: "待审核", value: "待审核" },
	{ label: "已通过", value: "已通过" },
	{ label: "已拒绝", value: "已拒绝" },
	{ label: "已取消", value: "已取消" },
];


/**
 * 设置类型选项
 */
export const settingTypeOptions: OptionsType = [
	{ label: "系统设置", value: "系统设置" },
	{ label: "业务设置", value: "业务设置" },
	{ label: "界面设置", value: "界面设置" },
	{ label: "功能设置", value: "功能设置" },
	{ label: "安全设置", value: "安全设置" },
];

/**
 * 小区配置状态选项
 */
export const communityConfigStatusOptions: OptionsType = [
	{ label: "启用", value: "0" },
	{ label: "禁用", value: "1" },
	{ label: "待审核", value: "2" },
];

/**
 * @description 楼层区域选项
 * Floor area options
 */
export const floorAreaOptions: OptionsType = [
	{ label: "地下一层", value: "地下一层" },
	{ label: "地下二层", value: "地下二层" },
	{ label: "地下三层", value: "地下三层" },
	{ label: "地面一层", value: "地面一层" },
	{ label: "地面二层", value: "地面二层" },
	{ label: "地面三层", value: "地面三层" },
];

/**
 * @description 是否充电桩选项
 * Is charging pile options
 */
export const isChargingPileOptions: OptionsType = [
	{ label: "是", value: "是" },
	{ label: "否", value: "否" },
];


/**
 * @description 物业公司选项
 * Property company options
 * TODO: This should be dynamically loaded from API
 */
export const propertyCompanyOptions: OptionsType = [
	{ label: "示例物业公司1", value: "示例物业公司1" },
	{ label: "示例物业公司2", value: "示例物业公司2" },
];
