/**
 * @file 合同条款类型定义
 * @description Contract clause types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * 合同条款列表数据
 * Contract clause list item
 */
export interface ClauseListItem {
	/** ID ID */
	id: string;
	/** 条款名称 Clause name */
	clauseName: string;
	/** 条款编号 Clause number */
	clauseNumber: string;
	/** 条款类型 Clause type */
	clauseType: string;
	/** 条款内容 Clause content */
	clauseContent: string;
	/** 适用合同类型 Applicable contract type */
	applicableContractType: string;
	/** 状态 Status */
	status: string;
	/** 排序号 Sort order */
	sortOrder: number;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 创建人 Creator */
	creator: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * 合同条款查询参数
 * Contract clause query parameters
 */
export interface ClauseQueryParams extends BaseListQueryParams {
	/** 条款名称 Clause name */
	clauseName?: string;
	/** 条款编号 Clause number */
	clauseNumber?: string;
	/** 条款类型 Clause type */
	clauseType?: string;
	/** 适用合同类型 Applicable contract type */
	applicableContractType?: string;
	/** 状态 Status */
	status?: string;
}

/**
 * 条款类型选项
 * Clause type options
 */
export const clauseTypeOptions: OptionsType = [
	{ label: "权利条款", value: "权利条款" },
	{ label: "义务条款", value: "义务条款" },
	{ label: "违约条款", value: "违约条款" },
	{ label: "免责条款", value: "免责条款" },
	{ label: "解除条款", value: "解除条款" },
	{ label: "其他条款", value: "其他条款" },
];

/**
 * 条款状态选项
 * Clause status options
 */
export const clauseStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];
