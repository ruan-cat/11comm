import type { OptionsType } from "../../../common";
import { repairStatusOptions, repairSourceOptions } from "../../../common/business-options";


/**
 * @description phone-report-repairs列表数据
 * PhoneReportRepairs list item
 */
export interface PhoneReportRepairsListItem {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * @description phone-report-repairs列表查询参数
 * PhoneReportRepairs list query parameters
 */
export interface PhoneReportRepairsQueryParams {
	/** 名称 Name */
	name?: string;
	/** 状态 Status */
	status?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const phoneReportRepairsStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 电话报修表单 VO
 * Phone repairs form VO
 */
export interface PhoneRepairsFormVO {
	/** 报修范围 Repair scope */
	repairScope: string;
	/** 报修类型 Repair type */
	repairType: string;
	/** 报修人 Reporter */
	reporter: string;
	/** 联系方式 Contact information */
	contactInfo: string;
	/** 预约时间 Appointment time */
	appointmentTime: string;
	/** 报修内容 Repair description */
	repairDescription: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultPhoneRepairsForm: PhoneRepairsFormVO = {
	repairScope: "小区公区",
	repairType: "水管维修",
	reporter: "",
	contactInfo: "",
	appointmentTime: "",
	repairDescription: "",
};

/**
 * @description 电话报修列表数据 (向后兼容)
 * Phone report repairs list data (backward compatibility)
 */
export interface 电话报修_列表数据 extends PhoneReportRepairsListItem {
	/** 工单编号 */
	工单编号: string;
	/** 位置 */
	位置: string;
	/** 报修类型 */
	报修类型: string;
	/** 维修类型 */
	维修类型: string;
	/** 报修人 */
	报修人: string;
	/** 联系方式 */
	联系方式: string;
	/** 预约时间 */
	预约时间: string;
	/** 状态 */
	状态: string;
	/** 备注 */
	备注: string;
}

/**
 * @description 电话报修搜索 VO (向后兼容)
 * Phone report repairs search VO (backward compatibility)
 */
export interface 电话报修_搜索_VO extends PhoneReportRepairsQueryParams {}
