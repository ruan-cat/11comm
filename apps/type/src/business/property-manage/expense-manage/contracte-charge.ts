import type { OptionsType } from "../../../common";

/**
 * @description contracte-charge列表数据
 * ContracteCharge list item
 */
export interface ContracteChargeListItem {
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
 * @description contracte-charge列表查询参数
 * ContracteCharge list query parameters
 */
export interface ContracteChargeQueryParams {
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
export const contracteChargeStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

// ==================== 兼容旧类型定义 ====================

/**
 * @description 合同收费_列表数据 类型（兼容性）
 * Contract charge list data type (for compatibility)
 */
export type 合同收费_列表数据 = ContracteChargeListItem[];

/**
 * @description 合同类型选项（兼容性）
 * Contract type options (for compatibility)
 */
export const 合同类型Options = contracteChargeStatusOptions;
