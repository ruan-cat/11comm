import type { OptionsType } from "../../../common";
import { contractTypeOptions } from "../../../common/business-options";

/**
 * @description contracte-charge列表数据
 * ContracteCharge list item
 */
export interface ContracteChargeListItem {
	/** ID */
	id: string;
	/** 名称 Name */
	name: string;
	/** 合同名称 Contract Name */
	contractName: string;
	/** 开始时间 Start Time */
	startTime: string;
	/** 结束时间 End Time */
	endTime: string;
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
 * @description contracte-charge列表查询参数
 * ContracteCharge list query parameters
 */
export interface ContracteChargeQueryParams {
	/** 名称 Name */
	name?: string;
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
export const contracteChargeStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
];