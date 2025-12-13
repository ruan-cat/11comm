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
export interface PropertyRegisterFormVO {
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
export const defaultForm: PropertyRegisterFormVO = {
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

// ==================== 中文名称导出 ====================

/** 产权登记审核状态选项（中文名称） */
export const 产权登记审核状态Options = propertyRegisterStatusOptions;

/** 审核状态选项（中文名称） */
export const 审核状态Options = propertyRegisterStatusOptions;

/** 产权登记审核状态选项（中文名称）- 别名 */
export const 产权登记审核状态选项 = propertyRegisterStatusOptions;

/**
 * @description 楼栋选项
 * Building options
 */
export const 楼栋Options: OptionsType = [
	{ label: "A栋", value: "A栋" },
	{ label: "B栋", value: "B栋" },
	{ label: "C栋", value: "C栋" },
	{ label: "D栋", value: "D栋" },
];

/**
 * @description 单元选项
 * Unit options
 */
export const 单元Options: OptionsType = [
	{ label: "1单元", value: "1单元" },
	{ label: "2单元", value: "2单元" },
	{ label: "3单元", value: "3单元" },
];

// ==================== 兼容旧类型定义 ====================

/**
 * @description 产权登记_列表数据 类型（兼容性）
 * Property register list data type (for compatibility)
 */
export type 产权登记_列表数据 = PropertyRegisterListItem[];

/**
 * @description 产权登记_列表查询_VO 类型（兼容性）
 * Property register list query VO type (for compatibility)
 */
export type 产权登记_列表查询_VO = PropertyRegisterQueryParams;

/**
 * @description 产权登记表单_VO 类型（兼容性）
 * Property register form VO type (for compatibility)
 */
export type 产权登记表单_VO = PropertyRegisterFormVO;
