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
	/** 停车场 Parking lot */
	停车场: string;
	/** 车位 Parking space */
	车位: string;
	/** 车位状态 Parking space status */
	车位状态: string;
	/** 车位类型 Parking space type */
	车位类型: string;
	/** 面积 Area */
	面积: string;
	/** 业主姓名 Owner name */
	业主姓名: string;
	/** 联系电话 Contact phone */
	联系电话: string;
	/** 车辆号码 Vehicle number */
	车辆号码: string;
	/** 购买日期 Purchase date */
	购买日期: string;
	/** 到期日期 Expiry date */
	到期日期: string;
	/** 月租费用 Monthly rent */
	月租费用: number;
	/** 备注 Remark */
	备注: string;
}
