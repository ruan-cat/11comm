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
	/** 变更原因 Change reason */
	changeReason?: string;
	/** 变更内容 Change content */
	changeContent?: string;
	/** 变更时间 Change time */
	changeTime?: string;
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

/**
 * 变更类型
 * Change type
 */
export type ChangeType = "合同金额" | "服务期限" | "服务内容" | "付款方式" | "合同主体";

/**
 * 合同变更表单业务类型
 * Contract change form VO
 */
export interface ContractChangeFormVO {
	/** 合同名称 Contract name */
	contractName: string;
	/** 合同编号 Contract number */
	contractNumber: string;
	/** 合同类型 Contract type */
	contractType: string;
	/** 甲方 Party A */
	partyA: string;
	/** 甲方联系人 Party A contact */
	partyAContact: string;
	/** 甲方电话 Party A phone */
	partyAPhone: string;
	/** 乙方 Party B */
	partyB: string;
	/** 乙方联系人 Party B contact */
	partyBContact: string;
	/** 乙方电话 Party B phone */
	partyBPhone: string;
	/** 经办人 Handler */
	handler: string;
	/** 经办人电话 Handler phone */
	handlerPhone: string;
	/** 合同金额 Contract amount */
	contractAmount: string;
	/** 开始时间 Start time */
	startTime: string;
	/** 结束时间 End time */
	endTime: string;
	/** 签订时间 Signing time */
	signingTime: string;
	/** 变更类型 Change type */
	changeType: ChangeType;
	/** 变更人 Changer */
	changer: string;
	/** 说明 Description */
	description: string;
	/** 变更前 Before change */
	beforeChange: string;
	/** 变更后 After change */
	afterChange: string;
	/** 附件 Attachments */
	attachments?: any[];
}
