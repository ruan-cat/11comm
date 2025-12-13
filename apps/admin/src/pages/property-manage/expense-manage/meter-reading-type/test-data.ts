import type { OptionsType } from "plus-pro-components";

// ==================== 类型定义 ====================

/**
 * 抄表类型列表数据类型
 */
export interface 抄表类型_列表数据 {
	/** 记录ID */
	记录ID: string;
	/** 类型名称 */
	类型名称: string;
	/** 表类型 */
	表类型: string;
	/** 抄表周期 */
	抄表周期: string;
	/** 创建时间 */
	创建时间: string;
	/** 状态 */
	状态: string;
	/** 备注 */
	备注: string;
}

/**
 * 抄表类型列表查询参数类型
 */
export interface 抄表类型_列表查询_VO {
	/** 记录ID */
	记录ID: string;
	/** 类型名称 */
	类型名称: string;
	/** 表类型 */
	表类型: string;
	/** 抄表周期 */
	抄表周期: string;
	/** 创建时间 */
	创建时间: string;
	/** 状态 */
	状态: string;
	/** 备注 */
	备注: string;
}
