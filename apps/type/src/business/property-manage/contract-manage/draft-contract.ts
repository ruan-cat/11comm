import { z } from "zod";
import type { OptionsType } from "../../../common";
import { contractTypeOptions } from "../../../common/business-options";
import type { AttachmentDetailItem } from "./attachment";
import type { AttachmentMetaInput, CompletedAttachmentAsset } from "./upload";

/**
 * @description draft-contract列表数据
 * DraftContract list item
 */
export interface DraftContractListItem {
	/** ID */
	id: string;
	/** 合同名称 Contract Name */
	contractName: string;
	/** 合同编号 Contract Number */
	contractNumber: string;
	/** 父合同编号 Parent Contract Number */
	parentContractNumber?: string;
	/** 合同类型 Contract Type */
	contractType: string;
	/** 甲方 Party A */
	partyA: string;
	/** 乙方 Party B */
	partyB: string;
	/** 经办人 Handler */
	handler: string;
	/** 合同金额 Contract Amount */
	contractAmount: string;
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
 * @description draft-contract列表查询参数
 * DraftContract list query parameters
 */
export type DraftContractQueryParamsType = DraftContractQueryParams;

/** DraftContractQueryParams */
export interface DraftContractQueryParams {
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
export const draftContractStatusOptions: OptionsType = [
	{ label: "草稿", value: "draft" },
	{ label: "待审核", value: "pending_review" },
	{ label: "已生效", value: "effective" },
	{ label: "已终止", value: "terminated" },
];

/**
 * @description 合同草稿类型选项
 * Draft contract type options
 */
export const draftContractTypeOptions = contractTypeOptions;

/**
 * 合同草稿表单业务类型
 * Contract draft form VO
 */
export interface ContractDraftFormVO {
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
	/** 说明 Description */
	description: string;
	/** 已完成上传的附件 Attachments */
	attachments: CompletedAttachmentAsset[];
}

/**
 * 合同草稿详情数据
 * Contract draft detail VO
 */
export interface ContractDraftDetailVO extends Omit<ContractDraftFormVO, "attachments"> {
	/** ID */
	id: string;
	/** 合同状态 Status */
	status: string;
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
 * 合同草稿创建参数
 * Draft contract create payload
 */
export interface DraftContractCreatePayload extends Omit<ContractDraftFormVO, "attachments"> {
	/** 新上传会话 ID 列表 */
	newUploadSessionIds: string[];
	/** 附件元数据 */
	attachmentMetas: AttachmentMetaInput[];
	/** 备注 Remark */
	remark?: string;
}

/**
 * 合同草稿更新参数
 * Draft contract update payload
 */
export interface DraftContractUpdatePayload extends DraftContractCreatePayload {
	/** ID */
	id: string;
	/** 保留的旧附件 ID */
	retainAttachmentIds: string[];
	/** 删除的旧附件 ID */
	deleteAttachmentIds: string[];
}

/**
 * 合同草稿删除参数
 * Draft contract delete payload
 */
export interface DraftContractDeletePayload {
	/** 批量删除 ID 列表 */
	ids: string[];
}

/**
 * 合同草稿创建校验
 * Draft contract create schema
 */
export const createDraftContractSchema = z.object({
	contractName: z.string().min(1),
	contractNumber: z.string().min(1),
	contractType: z.string().min(1),
	partyA: z.string().min(1),
	partyAContact: z.string().min(1),
	partyAPhone: z.string().min(1),
	partyB: z.string().min(1),
	partyBContact: z.string().min(1),
	partyBPhone: z.string().min(1),
	handler: z.string().min(1),
	handlerPhone: z.string().min(1),
	contractAmount: z.string().default(""),
	startTime: z.string().min(1),
	endTime: z.string().min(1),
	signingTime: z.string().min(1),
	description: z.string().default(""),
	newUploadSessionIds: z.array(z.string().uuid()).default([]),
	attachmentMetas: z
		.array(
			z.object({
				uploadSessionId: z.string().uuid(),
				attachmentName: z.string().min(1),
				attachmentType: z.string().min(1),
			}),
		)
		.default([]),
	remark: z.string().optional(),
});

/**
 * 合同草稿更新校验
 * Draft contract update schema
 */
export const updateDraftContractSchema = createDraftContractSchema.extend({
	id: z.string().uuid(),
	retainAttachmentIds: z.array(z.string().uuid()).default([]),
	deleteAttachmentIds: z.array(z.string().uuid()).default([]),
});
