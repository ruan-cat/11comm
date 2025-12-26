import type { OptionsType } from "../../../common";
import { repairStatusOptions, repairTypeOptions, repairSourceOptions } from "../../../common/business-options";

/**
 * @description issues列表数据
 * Issues list item
 */
export interface IssuesListItem {
	/** ID */
	id: string;
	/** 名称 Name (保留用于兼容) */
	name?: string;
	/** 工单编码 Work order code */
	workOrderCode?: string;
	/** 位置 Location */
	location?: string;
	/** 报修类型 Repair type */
	repairType?: string;
	/** 维修类型 Maintenance type */
	maintenanceType?: string;
	/** 报修人 Reporter */
	reporter?: string;
	/** 联系方式 Contact information */
	contactInfo?: string;
	/** 预约开始结束时间 Appointment start and end time */
	appointmentTimeRange?: string;
	/** 提交时间 Submit time */
	submitTime?: string;
	/** 提单时长 Order duration */
	orderDuration?: string;
	/** 完成时间 Complete time */
	completeTime?: string;
	/** 状态 Status */
	status: string;
	/** 违规说明 Violation description */
	violationDescription?: string;
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
	/** 工单编号 Work order number */
	workOrderNumber?: string;
	/** 报修人 Reporter */
	reporter?: string;
	/** 报修电话 Reporter phone */
	reporterPhone?: string;
	/** 报修类型 Repair type */
	repairType?: string;
	/** 报修设置类型 Repair setting type */
	repairSettingType?: string;
	/** 报修位置 Repair location */
	repairLocation?: string;
	/** 维修类型 Maintenance type */
	maintenanceType?: string;
	/** 开始时间 Start time */
	startTime?: string;
	/** 结束时间 End time */
	endTime?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options - 工单池专用
 */
export const repairsIssuesStatusOptions: OptionsType = [
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
