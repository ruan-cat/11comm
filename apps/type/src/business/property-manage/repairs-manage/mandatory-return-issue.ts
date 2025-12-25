import type { OptionsType } from "../../../common";
import { repairStatusOptions, repairSourceOptions } from "../../../common/business-options";

/**
 * @description mandatory-return-issue列表数据
 * MandatoryReturnIssue list item
 */
export interface MandatoryReturnIssueListItem {
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
 * @description mandatory-return-issue列表查询参数
 * MandatoryReturnIssue list query parameters
 */
export interface MandatoryReturnIssueQueryParams {
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
 * Status options - 强制回单专用
 */
export const mandatoryReturnIssueFormStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

// TODO:
/**
 * @description 强制回单表单 VO
 * Mandatory return issue form VO
 */
export interface MandatoryReturnIssueFormVO {
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
	/** 提交时间 Submit time */
	submitTime: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}
