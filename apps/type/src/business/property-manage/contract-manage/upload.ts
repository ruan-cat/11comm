/**
 * @file 合同上传控制面类型定义
 * @description Cloudflare R2 multipart upload contracts for contract-manage.
 */

import { z } from "zod";

/** 上传业务类型常量 Upload biz type values */
export const uploadBizTypeValues = ["draft_contract", "change"] as const;

/** 上传会话状态常量 Upload session status values */
export const uploadSessionStatusValues = [
	"initiated",
	"uploading",
	"paused",
	"completed",
	"aborted",
	"expired",
] as const;

/** 附件存储提供方常量 Attachment storage provider values */
export const attachmentStorageProviderValues = ["r2"] as const;

/** 附件上传状态常量 Attachment upload status values */
export const attachmentUploadStatusValues = ["ready", "deleted"] as const;

/** 上传业务类型 Upload biz type */
export type UploadBizType = (typeof uploadBizTypeValues)[number];

/** 上传会话状态 Upload session status */
export type UploadSessionStatus = (typeof uploadSessionStatusValues)[number];

/** 附件存储提供方 Attachment storage provider */
export type AttachmentStorageProvider = (typeof attachmentStorageProviderValues)[number];

/** 附件上传状态 Attachment upload status */
export type AttachmentUploadStatus = (typeof attachmentUploadStatusValues)[number];

/** 已上传分片 Uploaded part */
export interface UploadPart {
	/** 分片序号 Part number */
	partNumber: number;
	/** 分片 ETag */
	etag: string;
	/** 分片大小 Part size */
	partSize: number;
}

/** 已完成附件资产 Completed attachment asset */
export interface CompletedAttachmentAsset {
	/** 上传会话 ID Upload session id */
	uploadSessionId: string;
	/** 附件名称 Attachment name */
	attachmentName: string;
	/** 附件类型 Attachment type */
	attachmentType: string;
	/** 原始文件名 File name */
	fileName: string;
	/** 文件大小 File size */
	fileSize: number;
	/** MIME 类型 Mime type */
	mimeType: string;
	/** 存储提供方 Storage provider */
	storageProvider: AttachmentStorageProvider;
	/** Bucket 名称 Bucket name */
	bucketName: string;
	/** 文件访问地址 File url */
	fileUrl: string;
	/** 对象键 Object key */
	objectKey: string;
	/** 对象 ETag Object etag */
	objectEtag?: string | null;
	/** 文件哈希 File hash */
	fileHash?: string | null;
	/** 上传状态 Upload status */
	uploadStatus: AttachmentUploadStatus;
}

/** 附件元数据输入 Attachment meta input */
export interface AttachmentMetaInput {
	/** 上传会话 ID Upload session id */
	uploadSessionId: string;
	/** 附件名称 Attachment name */
	attachmentName: string;
	/** 附件类型 Attachment type */
	attachmentType: string;
}

/** 初始化上传参数校验 Init upload schema */
export const createUploadInitSchema = z.object({
	bizType: z.enum(uploadBizTypeValues),
	bizId: z.string().uuid().optional(),
	fileName: z.string().min(1),
	mimeType: z.string().min(1),
	fileSize: z.number().int().positive(),
	chunkSize: z.number().int().positive(),
	resumeFingerprint: z.string().min(1),
});

/** 查询上传状态参数校验 Upload status schema */
export const createUploadStatusSchema = z.object({
	sessionId: z.string().uuid(),
});

/** 分片签名参数校验 Sign part schema */
export const createUploadSignPartSchema = z.object({
	sessionId: z.string().uuid(),
	partNumber: z.number().int().positive(),
});

/** 完成上传参数校验 Complete upload schema */
export const createUploadCompleteSchema = z.object({
	sessionId: z.string().uuid(),
	attachmentName: z.string().min(1),
	attachmentType: z.string().min(1),
	parts: z.array(
		z.object({
			partNumber: z.number().int().positive(),
			etag: z.string().min(1),
		}),
	),
});

/** 终止上传参数校验 Abort upload schema */
export const createUploadAbortSchema = z.object({
	sessionId: z.string().uuid(),
});
