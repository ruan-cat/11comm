import type { OptionsType } from "plus-pro-components";

// ==================== 类型定义 ====================

/**
 * 欠费信息列表数据类型
 */
export interface 欠费信息_列表数据 {
	/** 记录ID */
	记录ID: string;
	/** 房号 */
	房号: string;
	/** 客户名称 */
	客户名称: string;
	/** 收费对象 */
	收费对象: string;
	/** 欠费金额 */
	欠费金额: string;
	/** 欠费时间 */
	欠费时间: string;
	/** 备注 */
	备注: string;
}

/**
 * 欠费信息列表查询参数类型
 */
export interface 欠费信息_列表查询_VO {
	/** 记录ID */
	记录ID: string;
	/** 房号 */
	房号: string;
	/** 客户名称 */
	客户名称: string;
	/** 收费对象 */
	收费对象: string;
	/** 欠费金额 */
	欠费金额: string;
	/** 欠费时间 */
	欠费时间: string;
	/** 备注 */
	备注: string;
}
