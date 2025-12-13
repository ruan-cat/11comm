import type { OptionsType } from "plus-pro-components";

// ==================== 类型定义 ====================

/**
 * 费用汇总表列表数据类型
 */
export interface 费用汇总表_列表数据 {
	/** 记录ID */
	记录ID: string;
	/** 统计时间 */
	统计时间: string;
	/** 费用项名称 */
	费用项名称: string;
	/** 收费金额 */
	收费金额: string;
	/** 收费户数 */
	收费户数: string;
	/** 创建时间 */
	创建时间: string;
	/** 备注 */
	备注: string;
}

/**
 * 费用汇总表列表查询参数类型
 */
export interface 费用汇总表_列表查询_VO {
	/** 记录ID */
	记录ID: string;
	/** 统计时间 */
	统计时间: string;
	/** 费用项名称 */
	费用项名称: string;
	/** 收费金额 */
	收费金额: string;
	/** 收费户数 */
	收费户数: string;
	/** 创建时间 */
	创建时间: string;
	/** 备注 */
	备注: string;
}
