import type { OptionsType } from "../../../common";

/**
 * @description carport-info列表数据
 * CarportInfo list item
 */
export interface CarportInfoListItem {
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
 * @description carport-info列表查询参数
 * CarportInfo list query parameters
 */
export interface CarportInfoQueryParams {
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
export const carportInfoStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 车位信息表单VO
 * Carport info form VO
 */
export interface 车位信息_表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}
