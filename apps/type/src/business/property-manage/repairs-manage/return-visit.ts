import type { OptionsType } from "../../../common";
import { returnVisitStatusOptions } from "../../../common/business-options";

/**
 * @description return-visit列表数据
 * ReturnVisit list item
 */
export interface ReturnVisitListItem {
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
	/** 工单编号 Work order number */
	workOrderNumber?: string;
	/** 位置 Location */
	location?: string;
	/** 报修类型 Repair type */
	repairType?: string;
	/** 报修人 Reporter */
	reporter?: string;
	/** 联系方式 Contact information */
	contactInfo?: string;
	/** 预约时间 Appointment time */
	appointmentTime?: string;
	/** 回访状态 Return visit status */
	returnVisitStatus?: string;
}

/**
 * @description return-visit列表查询参数
 * ReturnVisit list query parameters
 */
export interface ReturnVisitQueryParams {
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
 * @description 报修回访表单 VO
 * Return visit form VO
 */
export interface ReturnVisitFormVO {
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
	/** 回访状态 Return visit status */
	returnVisitStatus: string;
	/** 备注 Remark */
	remark: string;
}
