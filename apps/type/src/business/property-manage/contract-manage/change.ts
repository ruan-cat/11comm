import type { BaseListQueryParams } from "../../../common";
import type { OptionsType } from "../../../common";

/**
 * @file 合同变更类型定义
 * @description Contract change types
 */

/**
 * 合同变更列表数据
 * Contract change list item
 */
export interface ChangeListItem {
	/** ID */
	id: string;
	/** 合同名称 Contract name */
	contractName: string;
	/** 合同编号 Contract number */
	contractNumber: string;
	/** 合同类型 Contract type */
	contractType: string;
	/** 甲方 Party A */
	partyA: string;
	/** 乙方 Party B */
	partyB: string;
	/** 变更类型 Change type */
	changeType: string;
	/** 变更人 Changer */
	changer: string;
	/** 申请时间 Apply time */
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
 * 合同变更查询参数
 * Contract change query parameters
 */
export interface ChangeQueryParams extends BaseListQueryParams {
	/** 合同名称 Contract name */
	contractName?: string;
	/** 合同编号 Contract number */
	contractNumber?: string;
	/** 合同类型 Contract type */
	contractType?: string;
	/** 状态 Status */
	status?: string;
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
