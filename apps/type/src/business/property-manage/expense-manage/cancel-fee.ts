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
