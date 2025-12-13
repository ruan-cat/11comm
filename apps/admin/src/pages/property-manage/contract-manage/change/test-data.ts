import type { OptionsType } from "plus-pro-components";

// ==================== 类型定义 ====================

/**
 * 业务受理列表数据类型
 */
export interface 业务受理_列表数据 {
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
 * 业务受理列表查询参数类型
 */
export interface 业务受理_列表查询_VO {
	/** 客户名称 */
	客户名称?: string;
	/** 联系电话 */
	联系电话?: string;
	/** 合同类型 */
	合同类型?: string;
	/** 处理状态 */
	处理状态?: string;
	/** 申请时间范围 */
	申请时间范围?: [string, string];
}

/**
 * 合同类型选项
 */
export const 合同类型Options: OptionsType = [
	{ label: "物业服务合同", value: "物业服务合同" },
	{ label: "租赁合同", value: "租赁合同" },
	{ label: "维修合同", value: "维修合同" },
];

