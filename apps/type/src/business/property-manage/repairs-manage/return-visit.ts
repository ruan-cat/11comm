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

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultReturnVisitForm: ReturnVisitFormVO = {
	workOrderNumber: "",
	location: "",
	repairType: "",
	reporter: "",
	contactInfo: "",
	appointmentTime: "",
	returnVisitStatus: "",
	remark: "",
};

/**
 * @description 回访列表数据 (向后兼容)
 * Return visit list data (backward compatibility)
 */
export interface 回访_列表数据 extends ReturnVisitListItem {
	/** 工单编号 */
	工单编号: string;
	/** 位置 */
	位置: string;
	/** 报修类型 */
	报修类型: string;
	/** 报修人 */
	报修人: string;
	/** 联系方式 */
	联系方式: string;
	/** 预约时间 */
	预约时间: string;
	/** 回访状态 */
	回访状态: string;
	/** 备注 */
	备注: string;
}

/**
 * @description 回访搜索 VO (向后兼容)
 * Return visit search VO (backward compatibility)
 */
export interface 回访_搜索_VO extends ReturnVisitQueryParams {}

