import type { OptionsType } from "../../../common";

/**
 * @description discount-apply列表数据
 * DiscountApply list item
 */
export interface DiscountApplyListItem {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
	/** 房屋 House */
	house: string;
	/** 申请类型 Application Type */
	applicationType: string;
	/** 折扣名称 Discount Name */
	discountName: string;
	/** 申请人 Applicant */
	applicant: string;
	/** 申请人电话 Applicant Phone */
	applicantPhone: string;
	/** 开始时间 Start Time */
	startTime: string;
	/** 结束时间 End Time */
	endTime: string;
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
 * @description discount-apply列表查询参数
 * DiscountApply list query parameters
 */
export interface DiscountApplyQueryParams {
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
export const discountApplyStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 申请类型选项
 * Application type options
 */
export const applicationTypeOptions: OptionsType = [
	{ label: "新申请", value: "新申请" },
	{ label: "续期申请", value: "续期申请" },
	{ label: "变更申请", value: "变更申请" },
];

/**
 * @description 使用状态选项
 * Usage status options
 */
export const usageStatusOptions: OptionsType = [
	{ label: "未使用", value: "未使用" },
	{ label: "使用中", value: "使用中" },
	{ label: "已使用", value: "已使用" },
];

// ==================== 折扣申请相关选项 ====================
