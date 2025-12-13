import type { OptionsType } from "../../../common";

/**
 * @description property-register列表数据
 * PropertyRegister list item
 */
export interface PropertyRegisterListItem {
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
 * @description 产权登记表单VO
 * Property register form VO
 */
export interface 产权登记表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description 产权登记表单默认值
 * Property register form default values
 */
export const defaultForm: 产权登记表单_VO = {
	name: "",
	status: "启用",
	remark: "",
};

/**
 * @description property-register列表查询参数
 * PropertyRegister list query parameters
 */
export interface PropertyRegisterQueryParams {
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
export const propertyRegisterStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];
