import type { OptionsType } from "../../../common";
import { repairStatusOptions, repairSourceOptions } from "../../../common/business-options";


/**
 * @description repairs-todo列表数据
 * RepairsTodo list item
 */
export interface RepairsTodoListItem {
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
 * @description repairs-todo列表查询参数
 * RepairsTodo list query parameters
 */
export interface RepairsTodoQueryParams {
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
export const repairsTodoStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 报修待办表单 VO
 * Repairs todo form VO
 */
export interface RepairsTodoFormVO {
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
export const defaultRepairsTodoForm: RepairsTodoFormVO = {
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

/**
 * @description 报修待办列表数据 (向后兼容)
 * Repairs todo list data (backward compatibility)
 */
export interface RepairsTodoListData extends RepairsTodoListItem {
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
 * @description 报修待办列表数据 (向后兼容)
 * Repairs todo list data (backward compatibility)
 */
export type 报修待办_列表数据 = RepairsTodoListData;

/**
 * @description 待办维修列表数据 (向后兼容)
 * Repairs todo list data (backward compatibility)
 */
export interface 待办维修_列表数据 extends RepairsTodoListData {}

/**
 * @description 待办维修搜索 VO (向后兼容)
 * Repairs todo search VO (backward compatibility)
 */
export interface 待办维修_搜索_VO extends RepairsTodoQueryParams {}
