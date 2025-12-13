import type { OptionsType } from "plus-pro-components";

// ==================== 类型定义 ====================

/**
 * 折扣设置列表数据类型
 */
export interface 折扣设置_列表数据 {
	/** 记录ID */
	记录ID: string;
	/** 折扣名称 */
	折扣名称: string;
	/** 折扣类型 */
	折扣类型: string;
	/** 折扣值 */
	折扣值: string;
	/** 创建时间 */
	创建时间: string;
	/** 状态 */
	状态: string;
	/** 备注 */
	备注: string;
}

/**
 * 折扣设置列表查询参数类型
 */
export interface 折扣设置_列表查询_VO {
	/** 记录ID */
	记录ID: string;
	/** 折扣名称 */
	折扣名称: string;
	/** 折扣类型 */
	折扣类型: string;
	/** 折扣值 */
	折扣值: string;
	/** 创建时间 */
	创建时间: string;
	/** 状态 */
	状态: string;
	/** 备注 */
	备注: string;
}
