/**
 * @file 合同模板类型定义
 * @description Contract template types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";
import { contractTypeOptions } from "../../../common/business-options";

/**
 * 合同模板列表数据
 * Contract template list item
 */
export interface TemplateListItem {
	/** ID ID */
	id: string;
	/** 模板名称 Template name */
	templateName: string;
	/** 模板编号 Template number */
	templateNumber: string;
	/** 适用合同类型 Applicable contract type */
	applicableContractType: string;
	/** 模板版本 Template version */
	templateVersion: string;
	/** 模板描述 Template description */
	templateDescription: string;
	/** 状态 Status */
	status: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 创建人 Creator */
	creator: string;
	/** 使用次数 Usage count */
	usageCount: number;
}

/**
 * 合同模板查询参数
 * Contract template query parameters
 */
export interface TemplateQueryParams extends BaseListQueryParams {
	/** 模板名称 Template name */
	templateName?: string;
	/** 模板编号 Template number */
	templateNumber?: string;
	/** 适用合同类型 Applicable contract type */
	applicableContractType?: string;
	/** 状态 Status */
	status?: string;
}

/**
 * 模板状态选项
 * Template status options
 */
export const templateStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
	{ label: "草稿", value: "草稿" },
];

/**
 * 合同模板类型选项
 * Template contract type options
 */
export const templateContractTypeOptions = contractTypeOptions;
