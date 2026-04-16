/**
 * @file 合同附件类型定义
 * @description Contract attachment types
 */

import type { BaseListQueryParams, OptionsType } from "../../../common";
import type { AttachmentStorageProvider, AttachmentUploadStatus } from "./upload";

/**
 * 附件对象存储信息
 * Attachment object storage info
 */
export interface AttachmentObjectInfo {
	/** 存储提供方 Storage provider */
	storageProvider: AttachmentStorageProvider;
	/** Bucket 名称 Bucket name */
	bucketName?: string;
	/** 对象键 Object key */
	objectKey?: string;
	/** 文件访问地址 File url */
	fileUrl?: string;
	/** MIME 类型 Mime type */
	mimeType?: string;
	/** 文件哈希 File hash */
	fileHash?: string;
	/** R2 对象 ETag Object etag */
	objectEtag?: string;
	/** 上传会话 ID Upload session id */
	uploadSessionId?: string;
	/** 上传状态 Upload status */
	uploadStatus: AttachmentUploadStatus;
}

/**
 * 合同附件列表数据
 * Contract attachment list item
 */
export interface AttachmentListItem extends AttachmentObjectInfo {
	/** ID ID */
	id: string;
	/** 关联合同 ID Contract id */
	contractId: string;
	/** 关联变更 ID Change id */
	changeId?: string;
	/** 附件名称 Attachment name */
	attachmentName: string;
	/** 文件名称 (alias for attachmentName) */
	fileName?: string;
	/** 所属合同编号 Contract number */
	contractNumber: string;
	/** 所属合同名称 Contract name */
	contractName: string;
	/** 附件类型 Attachment type */
	attachmentType: string;
	/** 文件类型 (alias for attachmentType) */
	fileType?: string;
	/** 文件路径 File path */
	filePath?: string;
	/** 文件大小 File size */
	fileSize?: number;
	/** 文件格式 File format */
	fileFormat?: string;
	/** 上传人 Uploader */
	uploader?: string;
	/** 上传时间 Upload time */
	uploadTime?: string;
	/** 状态 Status */
	status?: string;
	/** 创建时间 Create time */
	createTime: string;
	/** 更新时间 Update time */
	updateTime: string;
	/** 备注 Remark */
	remark?: string;
}

/**
 * 合同附件详情数据
 * Contract attachment detail item
 */
export interface AttachmentDetailItem extends AttachmentListItem {}

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
	/** 关联合同变更 ID Change id */
	changeId?: string;
}

/**
 * 合同附件创建参数
 * Contract attachment create payload
 */
export interface AttachmentCreatePayload extends AttachmentObjectInfo {
	/** 关联合同 ID */
	contractId: string;
	/** 关联变更 ID */
	changeId?: string;
	/** 附件名称 */
	attachmentName: string;
	/** 附件类型 */
	attachmentType?: string;
	/** 文件路径 */
	filePath?: string;
	/** 文件大小 */
	fileSize?: number;
	/** 备注 */
	remark?: string;
}

/**
 * 合同附件更新参数
 * Contract attachment update payload
 */
export interface AttachmentUpdatePayload extends Partial<AttachmentCreatePayload> {
	/** ID */
	id: string;
}

/**
 * 合同附件删除参数
 * Contract attachment delete payload
 */
export interface AttachmentDeletePayload {
	/** 批量删除 ID 列表 */
	ids: string[];
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
	{ label: "正常", value: "ready" },
	{ label: "已删除", value: "deleted" },
];
