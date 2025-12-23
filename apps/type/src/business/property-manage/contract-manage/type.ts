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
 * @description 是否审核类型
 * Is audit type
 */
export type IsAuditType = "是" | "否";

/**
 * @description 审核类型选项
 * Audit type options
 */
export const auditTypeOptions: OptionsType = [
	{ label: "是", value: "是" },
	{ label: "否", value: "否" },
];