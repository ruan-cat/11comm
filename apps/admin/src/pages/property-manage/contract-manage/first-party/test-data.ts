import type { OptionsType } from "plus-pro-components";

// ==================== 类型定义 ====================

/**
 * 合同甲方列表数据类型
 */
export interface 合同甲方_列表数据 {
	/** 记录ID */
	记录ID: string;
	/** 甲方名称 */
	甲方名称: string;
	/** 联系人 */
	联系人: string;
	/** 联系电话 */
	联系电话: string;
	/** 合同类型 */
	合同类型: string;
	/** 创建时间 */
	创建时间: string;
	/** 备注 */
	备注: string;
}

/**
 * 合同甲方列表查询参数类型
 */
export interface 合同甲方_列表查询_VO {
	/** 记录ID */
	记录ID: string;
	/** 甲方名称 */
	甲方名称: string;
	/** 联系人 */
	联系人: string;
	/** 联系电话 */
	联系电话: string;
	/** 合同类型 */
	合同类型: string;
	/** 创建时间 */
	创建时间: string;
	/** 备注 */
	备注: string;
}
