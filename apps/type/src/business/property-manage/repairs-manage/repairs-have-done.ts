import type { OptionsType } from "../../../common";

/**
 * @description repairs-have-done列表数据
 * RepairsHaveDone list item
 */
export interface RepairsHaveDoneListItem {
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
 * @description repairs-have-done列表查询参数
 * RepairsHaveDone list query parameters
 */
export interface RepairsHaveDoneQueryParams {
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
export const repairsHaveDoneStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 报修已办表单 VO
 * Repairs have done form VO
 */
export interface RepairsHaveDoneFormVO {
	/** 工单编号 Work order number */
	workOrderNumber: string;
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
	/** 预约时间 Appointment time */
	appointmentTime: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultRepairsHaveDoneForm: RepairsHaveDoneFormVO = {
	workOrderNumber: "",
	location: "",
	repairType: "",
	maintenanceType: "",
	reporter: "",
	contactInfo: "",
	appointmentTime: "",
	status: "",
	remark: "",
};
