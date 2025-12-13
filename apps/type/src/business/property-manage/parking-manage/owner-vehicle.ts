import type { OptionsType } from "../../../common";

/**
 * @description owner-vehicle列表数据
 * OwnerVehicle list item
 */
export interface OwnerVehicleListItem {
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
 * @description owner-vehicle列表查询参数
 * OwnerVehicle list query parameters
 */
export interface OwnerVehicleQueryParams {
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
export const ownerVehicleStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 业主车辆表单VO
 * Owner vehicle form VO
 */
export interface 业主车辆表单_VO {
	/** 车牌号 License plate */
	车牌号: string;
	/** 汽车品牌 Car brand */
	汽车品牌: string;
	/** 车类型 Car type */
	车类型: string;
	/** 颜色 Color */
	颜色: string;
	/** 车牌类型 License plate type */
	车牌类型: string;
	/** 开始时间 Start time */
	开始时间: string;
	/** 结束时间 End time */
	结束时间: string;
	/** 业主 Owner */
	业主: string;
	/** 车位 Parking space */
	车位: string;
	/** 业主车辆 Owner vehicle */
	业主车辆: string;
	/** 备注 Remark */
	备注: string;
}
