import type { BaseListQueryParams, OptionsType } from "../../../common";
import type { AttachmentDetailItem } from "./attachment";
import type { AttachmentMetaInput, CompletedAttachmentAsset } from "./upload";

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
	{ label: "待审核", value: "pending" },
	{ label: "已通过", value: "approved" },
	{ label: "已拒绝", value: "rejected" },
];

/**
 * 变更类型
 * Change type
 */
export type ChangeType = "合同金额" | "服务期限" | "服务内容" | "付款方式" | "合同主体";

/**
 * 变更页旧附件草稿
 * Existing attachment draft item
 */
export interface ExistingChangeAttachmentDraft extends AttachmentDetailItem {
	/** 来源 source */
	source: "existing";
	/** 是否标记删除 deleted */
	deleted?: boolean;
}

/**
 * 变更页新附件草稿
 * New uploaded attachment draft item
 */
export interface NewChangeAttachmentDraft extends CompletedAttachmentAsset {
	/** 来源 source */
	source: "new";
	/** 是否标记删除 deleted */
	deleted?: boolean;
}

/**
 * 变更页附件草稿联合类型
 * Change attachment draft union
 */
export type ChangeAttachmentDraft = ExistingChangeAttachmentDraft | NewChangeAttachmentDraft;

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
	/** 变更时间 Change time */
	changeTime?: string;
	/** 附件草稿 Attachments */
	attachments: ChangeAttachmentDraft[];
}

/**
 * 合同变更详情数据
 * Contract change detail VO
 */
export interface ContractChangeDetailVO extends Omit<ContractChangeFormVO, "attachments"> {
	/** ID */
	id: string;
	/** 关联合同 ID */
	contractId: string;
	/** 审批状态 Approval status */
	status: string;
	/** 审批人 Approver */
	approver?: string;
	/** 审批时间 Approval time */
	approvalTime?: string;
	/** 明细附件列表 Detail attachments */
	attachments: AttachmentDetailItem[];
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * 合同变更创建参数
 * Contract change create payload
 */
export interface ChangeCreatePayload extends Omit<ContractChangeFormVO, "attachments"> {
	/** 新上传会话 ID 列表 */
	newUploadSessionIds: string[];
	/** 附件元数据 */
	attachmentMetas: AttachmentMetaInput[];
	/** 备注 Remark */
	remark?: string;
}

/**
 * 合同变更更新参数
 * Contract change update payload
 */
export interface ChangeUpdatePayload extends ChangeCreatePayload {
	/** ID */
	id: string;
	/** 保留的旧附件 ID */
	retainAttachmentIds: string[];
	/** 删除的旧附件 ID */
	deleteAttachmentIds: string[];
}

/**
 * 合同变更删除参数
 * Contract change delete payload
 */
export interface ChangeDeletePayload {
	/** 批量删除 ID 列表 */
	ids: string[];
}
