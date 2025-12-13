import type { OptionsType } from "plus-pro-components";

// ==================== 类型定义 ====================

/**
 * 合同草稿列表数据类型
 */
export interface 合同草稿_列表数据 {
	/** 记录ID */
	记录ID: string;
	/** 客户名称 */
	客户名称: string;
	/** 联系电话 */
	联系电话: string;
	/** 合同类型 */
	合同类型: string;
	/** 申请时间 */
	申请时间: string;
	/** 处理状态 */
	处理状态: string;
	/** 备注 */
	备注: string;
}

/**
 * 合同草稿列表查询参数类型
 */
export interface 合同草稿_列表查询_VO {
	/** 记录ID */
	记录ID: string;
	/** 客户名称 */
	客户名称: string;
	/** 联系电话 */
	联系电话: string;
	/** 合同类型 */
	合同类型: string;
	/** 申请时间 */
	申请时间: string;
	/** 处理状态 */
	处理状态: string;
	/** 备注 */
	备注: string;
}
