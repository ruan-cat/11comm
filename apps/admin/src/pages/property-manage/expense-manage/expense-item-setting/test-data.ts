import type { OptionsType } from "plus-pro-components";

// ==================== 类型定义 ====================

/**
 * 费用项设置列表数据类型
 */
export interface 费用项设置_列表数据 {
	/** 记录ID */
	记录ID: string;
	/** 费用名称 */
	费用名称: string;
	/** 费用标识 */
	费用标识: string;
	/** 付费类型 */
	付费类型: string;
	/** 创建时间 */
	创建时间: string;
	/** 状态 */
	状态: string;
	/** 备注 */
	备注: string;
}

/**
 * 费用项设置列表查询参数类型
 */
export interface 费用项设置_列表查询_VO {
	/** 记录ID */
	记录ID: string;
	/** 费用名称 */
	费用名称: string;
	/** 费用标识 */
	费用标识: string;
	/** 付费类型 */
	付费类型: string;
	/** 创建时间 */
	创建时间: string;
	/** 状态 */
	状态: string;
	/** 备注 */
	备注: string;
}
