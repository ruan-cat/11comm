import type { OptionsType } from "../../../common";

/**
 * @description type列表数据
 * Type list item
 */
export interface TypeListItem {
	/** ID */
	id: string;
	/** 类型名称 Type Name */
	typeName: string;
	/** 是否审核 Is Audit */
	isAudit: string;
	/** 描述 Description */
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
 * @description type列表查询参数
 * Type list query parameters
 */
export interface TypeQueryParams {
	/** 类型名称 Type Name */
	typeName?: string;
	/** 是否审核 Is Audit */
	isAudit?: string;
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
export const typeStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];

/**
 * @description 审核类型选项
 * Audit type options
 */
export const auditTypeOptions: OptionsType = [
	{ label: "是", value: "是" },
	{ label: "否", value: "否" },
];

// ==================== 兼容旧中文名称 ====================

/**
 * @description 审核类型选项（兼容性）
 * Audit type options (for compatibility)
 */
export const 审核类型Options = auditTypeOptions;

// ==================== 兼容旧类型定义 ====================

/**
 * @description 合同类型_列表数据 类型（兼容性）
 * Contract type list data type (for compatibility)
 */
export type 合同类型_列表数据 = TypeListItem[];

/**
 * @description 合同类型_列表查询_VO 类型（兼容性）
 * Contract type list query VO type (for compatibility)
 */
export type 合同类型_列表查询_VO = TypeQueryParams;
