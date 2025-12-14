import type { OptionsType } from "../../../common";

/**
 * @description cancel-fee列表数据
 * CancelFee list item
 */
export interface CancelFeeListItem {
	/** ID */
	id: string;
	/** 批次号 Batch Number */
	batchNumber: string;
	/** 员工 Employee */
	employee: string;
	/** 时间 Time */
	time: string;
	/** 取消原因 Cancel Reason */
	cancelReason: string;
	/** 审核状态 Audit Status */
	auditStatus: string;
	/** 审核意见 Audit Opinion */
	auditOpinion: string;
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
 * @description cancel-fee列表查询参数
 * CancelFee list query parameters
 */
export interface CancelFeeQueryParams {
	/** 批次号 Batch Number */
	batchNumber?: string;
	/** 员工 Employee */
	employee?: string;
	/** 时间 Time */
	time?: string;
	/** 取消原因 Cancel Reason */
	cancelReason?: string;
	/** 审核状态 Audit Status */
	auditStatus?: string;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 状态选项
 * Status options
 */
export const cancelFeeStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 审核状态选项
 * Audit status options
 */
export const 审核状态Options: OptionsType = [
	{ label: "待审核", value: "待审核" },
	{ label: "已通过", value: "已通过" },
	{ label: "已拒绝", value: "已拒绝" },
];

// ==================== 兼容旧类型定义 ====================

/**
 * @description 取消费用_列表数据 类型（兼容性）
 * Cancel fee list data type (for compatibility)
 */
export type 取消费用_列表数据 = CancelFeeListItem[];

/**
 * @description 取消费用_列表查询_VO 类型（兼容性）
 * Cancel fee list query VO type (for compatibility)
 */
export type 取消费用_列表查询_VO = CancelFeeQueryParams;
