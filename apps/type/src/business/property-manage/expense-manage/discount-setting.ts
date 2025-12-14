import type { OptionsType } from "../../../common";

/**
 * @description discount-setting列表数据
 * DiscountSetting list item
 */
export interface DiscountSettingListItem {
	/** ID */
	id: string;
	/** 折扣ID Discount ID */
	discountId: string;
	/** 折扣名称 Discount Name */
	discountName: string;
	/** 折扣类型 Discount Type */
	discountType: string;
	/** 规则名称 Rule Name */
	ruleName: string;
	/** 规则 Rule */
	rule: string;
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
 * @description discount-setting列表查询参数
 * DiscountSetting list query parameters
 */
export interface DiscountSettingQueryParams {
	/** 折扣ID Discount ID */
	discountId?: string;
	/** 折扣名称 Discount Name */
	discountName?: string;
	/** 折扣类型 Discount Type */
	discountType?: string;
	/** 规则名称 Rule Name */
	ruleName?: string;
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
export const discountSettingStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 折扣设置类型选项
 * Discount setting type options
 */
export const 折扣设置类型Options: OptionsType = [
	{ label: "百分比折扣", value: "百分比折扣" },
	{ label: "固定金额折扣", value: "固定金额折扣" },
	{ label: "阶梯折扣", value: "阶梯折扣" },
];

/**
 * @description 折扣设置规则选项
 * Discount setting rule options
 */
export const 折扣设置规则Options: OptionsType = [
	{ label: "全部适用", value: "全部适用" },
	{ label: "按时间限制", value: "按时间限制" },
	{ label: "按金额限制", value: "按金额限制" },
];

// ==================== 兼容旧类型定义 ====================

/**
 * @description 折扣设置_列表数据 类型（兼容性）
 * Discount setting list data type (for compatibility)
 */
export type 折扣设置_列表数据 = DiscountSettingListItem[];

/**
 * @description 折扣设置_列表查询_VO 类型（兼容性）
 * Discount setting list query VO type (for compatibility)
 */
export type 折扣设置_列表查询_VO = DiscountSettingQueryParams;

/**
 * @description 折扣类型选项（兼容性）
 * Discount type options (for compatibility)
 */
export const 折扣类型Options = 折扣设置类型Options;

/**
 * @description 规则选项（兼容性）
 * Rule options (for compatibility)
 */
export const 规则Options = 折扣设置规则Options;
