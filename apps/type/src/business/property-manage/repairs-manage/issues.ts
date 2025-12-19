import type { OptionsType } from "../../../common";
import { repairStatusOptions, repairTypeOptions, repairSourceOptions } from "../../../common/business-options";

/**
 * @description issues列表数据
 * Issues list item
 */
export interface IssuesListItem {
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
 * @description issues列表查询参数
 * Issues list query parameters
 */
export interface IssuesQueryParams {
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
export const issuesStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 工单池表单 VO
 * Issues form VO
 */
export interface IssuesFormVO {
	/** 工单编码 Work order code */
	workOrderCode: string;
	/** 位置 Location */
	location: string;
	/** 报修类型 Repair type */
	repairType: string;
	/** 维修类型 Maintenance type */
	maintenanceType: string;
	/** 报修人 Reporter */
	reporter: string;
	/** 联系方式 Contact information */
	contactInfo: string;
	/** 预约开始结束时间 Appointment start and end time */
	appointmentTimeRange: string;
	/** 提交时间 Submit time */
	submitTime: string;
	/** 提单时长 Order duration */
	orderDuration: string;
	/** 完成时间 Complete time */
	completeTime: string;
	/** 状态 Status */
	status: string;
	/** 违规说明 Violation description */
	violationDescription: string;
	/** 备注 Remark */
	remark: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultIssuesForm: IssuesFormVO = {
	workOrderCode: "",
	location: "",
	repairType: "",
	maintenanceType: "",
	reporter: "",
	contactInfo: "",
	appointmentTimeRange: "",
	submitTime: "",
	orderDuration: "",
	completeTime: "",
	status: "",
	violationDescription: "",
	remark: "",
};

/**
 * @description 工单池列表数据 (向后兼容)
 * Issues list data (backward compatibility)
 */
export interface 工单池_列表数据 extends IssuesListItem {
	/** 工单编码 */
	工单编码: string;
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
 * @description 工单池搜索 VO (向后兼容)
 * Issues search VO (backward compatibility)
 */
export interface 工单池_搜索_VO extends IssuesQueryParams {}

