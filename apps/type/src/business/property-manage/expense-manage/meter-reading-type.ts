import type { OptionsType } from "../../../common";

/**
 * @description meter-reading-type列表数据
 * MeterReadingType list item
 */
export interface MeterReadingTypeListItem {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
	/** 说明 Description */
	description: string;
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
 * @description meter-reading-type列表查询参数
 * MeterReadingType list query parameters
 */
export interface MeterReadingTypeQueryParams {
	/** 名称 Name */
	name?: string;
	/** 说明 Description */
	description?: string;
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
export const meterReadingTypeStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 抄表类型表单VO
 * Meter reading type form VO
 */
export interface MeterReadingTypeFormVO {
	/** 名称 Name */
	name: string;
	/** 说明 Description */
	description: string;
}
