/**
 * @file 合同附件类型定义
 * @description Contract attachment types
 */

import type { OptionsType, BaseListQueryParams } from "../../../common";

/**
 * 合同附件列表数据
 * Contract attachment list item
 */
export interface AttachmentListItem {
	/** ID ID */
	id: string;
	/** 附件名称 Attachment name */
	attachmentName: string;
	/** 所属合同编号 Contract number */
	contractNumber: string;
	/** 所属合同名称 Contract name */
	contractName: string;
	/** 附件类型 Attachment type */
	attachmentType: string;
	/** 文件大小 File size */
	fileSize: string;
	/** 文件格式 File format */
	fileFormat: string;
	/** 上传人 Uploader */
	uploader: string;
	/** 上传时间 Upload time */
	uploadTime: string;
	/** 状态 Status */
	status: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * 合同附件查询参数
 * Contract attachment query parameters
 */
export interface AttachmentQueryParams extends BaseListQueryParams {
	/** 附件名称 Attachment name */
	attachmentName?: string;
	/** 所属合同编号 Contract number */
	contractNumber?: string;
	/** 所属合同名称 Contract name */
	contractName?: string;
	/** 附件类型 Attachment type */
	attachmentType?: string;
	/** 状态 Status */
	status?: string;
}

/**
 * 附件类型选项
 * Attachment type options
 */
export const attachmentTypeOptions: OptionsType = [
	{ label: "合同正本", value: "合同正本" },
	{ label: "合同副本", value: "合同副本" },
	{ label: "补充协议", value: "补充协议" },
	{ label: "授权文件", value: "授权文件" },
	{ label: "资质证明", value: "资质证明" },
	{ label: "其他", value: "其他" },
];

/**
 * 附件状态选项
 * Attachment status options
 */
export const attachmentStatusOptions: OptionsType = [
	{ label: "正常", value: "正常" },
	{ label: "已删除", value: "已删除" },
];
