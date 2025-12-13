import type { OptionsType } from "../../../common";

/**
 * @description refund-review列表数据
 * RefundReview list item
 */
export interface RefundReviewListItem {
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
 * @description 退费审核表单VO
 * Refund review form VO
 */
export interface 退费审核表单_VO {
	/** 名称 Name */
	name: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark: string;
}

/**
 * @description refund-review列表查询参数
 * RefundReview list query parameters
 */
export interface RefundReviewQueryParams {
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
export const refundReviewStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];
