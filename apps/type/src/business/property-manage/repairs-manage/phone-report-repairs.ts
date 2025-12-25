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
	name?: string;
	/** 工单编号 Work order number */
	workOrderNumber: string;
	/** 位置 Location */
	location: string;
	/** 报修类型 Repair type */
	repairType: string;
	/** 报修人 Reporter */
	reporter: string;
	/** 联系方式 Contact information */
	contactInfo: string;
	/** 预约时间 Appointment time */
	appointmentTime: string;
	/** 超时时间 Overtime time */
	overtimeTime: string;
	/** 提交时间 Submit time */
	submitTime: string;
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
	/** 工单编号 Work order number */
	workOrderNumber?: string;
	/** 报修人 Reporter */
	reporter?: string;
	/** 报修电话 Contact phone */
	contactPhone?: string;
	/** 报修类型 Repair type */
	repairType?: string;
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

