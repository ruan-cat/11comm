import type { OptionsType } from "plus-pro-components";

// ==================== 类型定义 ====================

/**
 * 房屋收费列表数据类型
 */
export interface 房屋收费_列表数据 {
	/** 记录ID */
	记录ID: string;
	/** 房号 */
	房号: string;
	/** 客户名称 */
	客户名称: string;
	/** 费用类型 */
	费用类型: string;
	/** 收费时间 */
	收费时间: string;
	/** 收费金额 */
	收费金额: string;
	/** 状态 */
	状态: string;
	/** 备注 */
	备注: string;
}

/**
 * 房屋收费列表查询参数类型
 */
export interface 房屋收费_列表查询_VO {
	/** 记录ID */
	记录ID: string;
	/** 房号 */
	房号: string;
	/** 客户名称 */
	客户名称: string;
	/** 费用类型 */
	费用类型: string;
	/** 收费时间 */
	收费时间: string;
	/** 收费金额 */
	收费金额: string;
	/** 状态 */
	状态: string;
	/** 备注 */
	备注: string;
}
