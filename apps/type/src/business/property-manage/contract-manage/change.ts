import type { OptionsType } from "../../../common";
import { 合同类型Options } from "../../../common/business-options";

/**
 * @description change列表数据
 * Change list item
 */
export interface ChangeListItem {
	/** ID */
	id: string;
	/** 合同名称 Contract Name */
	contractName: string;
	/** 合同编号 Contract Number */
	contractNumber: string;
	/** 合同类型 Contract Type */
	contractType: string;
	/** 甲方 Party A */
	partyA: string;
	/** 乙方 Party B */
	partyB: string;
	/** 变更类型 Change Type */
	changeType: string;
	/** 变更人 Changer */
	changer: string;
	/** 申请时间 Apply Time */
	applyTime: string;
	/** 说明 Description */
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
 * @description change列表查询参数
 * Change list query parameters
 */
export interface ChangeQueryParams {
	/** 合同名称 Contract Name */
	contractName?: string;
	/** 合同编号 Contract Number */
	contractNumber?: string;
	/** 合同类型 Contract Type */
	contractType?: string;
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
export const changeStatusOptions: OptionsType = [
	{ label: "待审核", value: "待审核" },
	{ label: "审核中", value: "审核中" },
	{ label: "已通过", value: "已通过" },
	{ label: "已拒绝", value: "已拒绝" },
	{ label: "已撤回", value: "已撤回" },
];

// ==================== 兼容旧类型定义 ====================

/**
 * @description 业务受理_列表数据 类型（兼容性）
 * Business handling list data type (for compatibility)
 */
export type 业务受理_列表数据 = ChangeListItem[];

/**
 * @description 合同类型_列表查询_VO 类型（兼容性）
 * Contract type list query VO type (for compatibility)
 */
export type 合同类型_列表查询_VO = ChangeQueryParams;
