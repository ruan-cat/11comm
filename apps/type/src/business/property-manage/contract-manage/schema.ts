/**
 * @file 合同管理模块 Schema
 * @description 定义合同管理相关的表结构，前缀 ct_
 * @module contract-manage
 */

import { isNull } from "drizzle-orm";
import {
	date,
	decimal,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
	auditStatusEnum,
	contractStatusEnum,
	primaryId,
	remarkField,
	softDelete,
	statusEnum,
	templateStatusEnum,
	timestamps,
} from "../../../common";
import { hpOwners } from "../house-property-manage/schema";

const uploadBizTypeValues = ["draft_contract", "change"] as const;
const uploadSessionStatusValues = ["initiated", "uploading", "paused", "completed", "aborted", "expired"] as const;
const attachmentUploadStatusValues = ["ready", "deleted"] as const;
const storageProviderValues = ["r2"] as const;

// ==========================================
// Part A: Database Table Definitions
// ==========================================

/** 合同甲方表 */
export const ctFirstParties = pgTable(
	"ct_first_parties",
	{
		id: primaryId(),
		/** 甲方名称 */
		name: varchar("name", { length: 200 }).notNull(),
		/** 联系人 */
		contactPerson: varchar("contact_person", { length: 50 }),
		/** 联系电话 */
		contactPhone: varchar("contact_phone", { length: 20 }),
		/** 地址 */
		address: text("address"),
		/** 统一社会信用代码 */
		creditCode: varchar("credit_code", { length: 50 }),
		/** 成立日期 */
		establishedDate: date("established_date"),
		/** 法定代表人 */
		legalRepresentative: varchar("legal_representative", { length: 50 }),
		/** 经营范围 */
		businessScope: text("business_scope"),
		/** 状态 */
		status: statusEnum("status").default("enabled"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ct_first_parties_status_idx").on(table.status)],
);

/** 合同乙方表 */
export const ctSecondParties = pgTable(
	"ct_second_parties",
	{
		id: primaryId(),
		/** 乙方名称 */
		name: varchar("name", { length: 200 }).notNull(),
		/** 乙方类型 */
		partyType: varchar("party_type", { length: 50 }),
		/** 联系人 */
		contactPerson: varchar("contact_person", { length: 50 }),
		/** 联系电话 */
		contactPhone: varchar("contact_phone", { length: 20 }),
		/** 地址 */
		address: text("address"),
		/** 关联业主 ID（可选） */
		ownerId: uuid("owner_id").references(() => hpOwners.id),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ct_second_parties_owner_id_idx").on(table.ownerId)],
);

/** 合同模板表 */
export const ctTemplates = pgTable(
	"ct_templates",
	{
		id: primaryId(),
		/** 模板名称 */
		templateName: varchar("template_name", { length: 200 }).notNull(),
		/** 模板类型 */
		templateType: varchar("template_type", { length: 50 }),
		/** 模板内容 */
		templateContent: text("template_content"),
		/** 版本号 */
		version: varchar("version", { length: 20 }),
		/** 状态 */
		status: templateStatusEnum("status").default("draft"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ct_templates_status_idx").on(table.status)],
);

/** 合同条款表 */
export const ctClauses = pgTable(
	"ct_clauses",
	{
		id: primaryId(),
		/** 关联模板 ID */
		templateId: uuid("template_id")
			.references(() => ctTemplates.id)
			.notNull(),
		/** 条款名称 */
		clauseName: varchar("clause_name", { length: 200 }).notNull(),
		/** 条款内容 */
		clauseContent: text("clause_content"),
		/** 条款类型 */
		clauseType: varchar("clause_type", { length: 50 }),
		/** 排序号 */
		sortOrder: integer("sort_order").default(0),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ct_clauses_template_id_idx").on(table.templateId)],
);

/** 合同类型表 */
export const ctTypes = pgTable("ct_types", {
	id: primaryId(),
	/** 类型名称 */
	typeName: varchar("type_name", { length: 100 }).notNull(),
	/** 类型编码 */
	typeCode: varchar("type_code", { length: 50 }),
	/** 类型描述 */
	typeDescription: text("type_description"),
	/** 备注 */
	remark: remarkField(),
	...timestamps,
});

/** 合同信息表 */
export const ctContracts = pgTable(
	"ct_contracts",
	{
		id: primaryId(),
		/** 合同名称 */
		contractName: varchar("contract_name", { length: 200 }).notNull(),
		/** 合同编号 */
		contractNumber: varchar("contract_number", { length: 100 }).notNull(),
		/** 合同类型 */
		contractType: varchar("contract_type", { length: 50 }),
		/** 合同金额 */
		amount: decimal("amount", { precision: 12, scale: 2 }),
		/** 甲方 ID */
		firstPartyId: uuid("first_party_id").references(() => ctFirstParties.id),
		/** 乙方 ID */
		secondPartyId: uuid("second_party_id").references(() => ctSecondParties.id),
		/** 开始时间 */
		startTime: timestamp("start_time"),
		/** 结束时间 */
		endTime: timestamp("end_time"),
		/** 签订日期 */
		signDate: date("sign_date"),
		/** 甲方名称（表单回显快照） */
		partyA: varchar("party_a", { length: 200 }),
		/** 甲方联系人（表单回显快照） */
		partyAContact: varchar("party_a_contact", { length: 50 }),
		/** 甲方电话（表单回显快照） */
		partyAPhone: varchar("party_a_phone", { length: 20 }),
		/** 乙方名称（表单回显快照） */
		partyB: varchar("party_b", { length: 200 }),
		/** 乙方联系人（表单回显快照） */
		partyBContact: varchar("party_b_contact", { length: 50 }),
		/** 乙方电话（表单回显快照） */
		partyBPhone: varchar("party_b_phone", { length: 20 }),
		/** 经办人（表单回显快照） */
		handler: varchar("handler", { length: 50 }),
		/** 经办人电话（表单回显快照） */
		handlerPhone: varchar("handler_phone", { length: 20 }),
		/** 合同说明 */
		description: text("description"),
		/** 签订时间 */
		signingTime: timestamp("signing_time"),
		/** 合同状态 */
		status: contractStatusEnum("status").default("draft"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
		...softDelete,
	},
	(table) => [
		uniqueIndex("ct_contracts_contract_number_idx").on(table.contractNumber).where(isNull(table.deletedAt)),
		index("ct_contracts_status_idx").on(table.status),
		index("ct_contracts_first_party_id_idx").on(table.firstPartyId),
		index("ct_contracts_second_party_id_idx").on(table.secondPartyId),
	],
);

/** 合同上传会话表 */
export const ctUploadSessions = pgTable(
	"ct_upload_sessions",
	{
		id: primaryId(),
		/** 业务类型：合同草稿 / 合同变更 */
		bizType: varchar("biz_type", { length: 50 }).notNull(),
		/** 业务 ID（创建态可为空） */
		bizId: uuid("biz_id"),
		/** 文件名 */
		fileName: varchar("file_name", { length: 255 }).notNull(),
		/** MIME 类型 */
		mimeType: varchar("mime_type", { length: 255 }).notNull(),
		/** 文件大小 */
		fileSize: integer("file_size").notNull(),
		/** 分片大小 */
		chunkSize: integer("chunk_size").notNull(),
		/** 分片总数 */
		totalParts: integer("total_parts").notNull(),
		/** 断点续传指纹 */
		resumeFingerprint: varchar("resume_fingerprint", { length: 255 }).notNull(),
		/** R2 bucket */
		r2Bucket: varchar("r2_bucket", { length: 100 }).notNull(),
		/** R2 对象 key */
		r2ObjectKey: text("r2_object_key").notNull(),
		/** R2 multipart uploadId
		 * Cloudflare R2 returns uploadId values longer than 255 chars.
		 * Use text to avoid insert failures during multipart session creation.
		 */
		r2UploadId: text("r2_upload_id").notNull(),
		/** 会话状态 */
		status: varchar("status", { length: 20 }).notNull().default("initiated"),
		/** 已上传分片数量 */
		uploadedPartsCount: integer("uploaded_parts_count").notNull().default(0),
		/** 对象 ETag */
		objectEtag: varchar("object_etag", { length: 255 }),
		/** 公网访问地址 */
		publicUrl: text("public_url"),
		/** 完成时间 */
		completedAt: timestamp("completed_at"),
		/** 过期时间 */
		expiresAt: timestamp("expires_at").notNull(),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("ct_upload_sessions_biz_type_idx").on(table.bizType),
		index("ct_upload_sessions_status_idx").on(table.status),
		index("ct_upload_sessions_resume_fingerprint_idx").on(table.resumeFingerprint),
	],
);

/** 合同上传分片表 */
export const ctUploadSessionParts = pgTable(
	"ct_upload_session_parts",
	{
		id: primaryId(),
		/** 上传会话 ID */
		sessionId: uuid("session_id")
			.references(() => ctUploadSessions.id, { onDelete: "cascade" })
			.notNull(),
		/** 分片序号 */
		partNumber: integer("part_number").notNull(),
		/** 分片 ETag */
		etag: varchar("etag", { length: 255 }).notNull(),
		/** 分片大小 */
		partSize: integer("part_size").notNull(),
		/** 上传完成时间 */
		uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
		...timestamps,
	},
	(table) => [
		index("ct_upload_session_parts_session_id_idx").on(table.sessionId),
		uniqueIndex("ct_upload_session_parts_session_part_idx").on(table.sessionId, table.partNumber),
	],
);

/** 合同变更表 */
export const ctChanges = pgTable(
	"ct_changes",
	{
		id: primaryId(),
		/** 关联合同 ID */
		contractId: uuid("contract_id")
			.references(() => ctContracts.id)
			.notNull(),
		/** 变更类型 */
		changeType: varchar("change_type", { length: 50 }),
		/** 变更原因 */
		changeReason: text("change_reason"),
		/** 变更内容 */
		changeContent: text("change_content"),
		/** 变更日期 */
		changeDate: date("change_date"),
		/** 变更人 */
		changer: varchar("changer", { length: 50 }),
		/** 变更说明 */
		description: text("description"),
		/** 变更前 */
		beforeChange: text("before_change"),
		/** 变更后 */
		afterChange: text("after_change"),
		/** 变更时间 */
		changeTime: timestamp("change_time"),
		/** 审批状态 */
		approvalStatus: auditStatusEnum("approval_status").default("pending"),
		/** 审批人 */
		approver: varchar("approver", { length: 50 }),
		/** 审批时间 */
		approvalTime: timestamp("approval_time"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("ct_changes_contract_id_idx").on(table.contractId),
		index("ct_changes_approval_status_idx").on(table.approvalStatus),
	],
);

/** 合同附件表 */
export const ctAttachments = pgTable(
	"ct_attachments",
	{
		id: primaryId(),
		/** 关联合同 ID */
		contractId: uuid("contract_id")
			.references(() => ctContracts.id, { onDelete: "cascade" })
			.notNull(),
		/** 关联变更 ID */
		changeId: uuid("change_id").references(() => ctChanges.id, { onDelete: "cascade" }),
		/** 附件名称 */
		attachmentName: varchar("attachment_name", { length: 200 }).notNull(),
		/** 附件类型 */
		attachmentType: varchar("attachment_type", { length: 50 }),
		/** 文件路径 */
		filePath: text("file_path"),
		/** 文件大小（字节） */
		fileSize: integer("file_size"),
		/** 存储提供方 */
		storageProvider: varchar("storage_provider", { length: 20 }).notNull().default("r2"),
		/** Bucket 名称 */
		bucketName: varchar("bucket_name", { length: 100 }),
		/** 对象 Key */
		objectKey: text("object_key"),
		/** 文件 URL */
		fileUrl: text("file_url"),
		/** MIME 类型 */
		mimeType: varchar("mime_type", { length: 255 }),
		/** 文件哈希 */
		fileHash: varchar("file_hash", { length: 255 }),
		/** 对象 ETag */
		objectEtag: varchar("object_etag", { length: 255 }),
		/** 上传会话 ID */
		uploadSessionId: uuid("upload_session_id").references(() => ctUploadSessions.id, { onDelete: "set null" }),
		/** 上传状态 */
		uploadStatus: varchar("upload_status", { length: 20 }).notNull().default("ready"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("ct_attachments_contract_id_idx").on(table.contractId),
		index("ct_attachments_change_id_idx").on(table.changeId),
		index("ct_attachments_upload_session_id_idx").on(table.uploadSessionId),
	],
);

/** 合同审核表 */
export const ctReviews = pgTable(
	"ct_reviews",
	{
		id: primaryId(),
		/** 关联合同 ID */
		contractId: uuid("contract_id")
			.references(() => ctContracts.id)
			.notNull(),
		/** 审核人 */
		reviewer: varchar("reviewer", { length: 50 }),
		/** 审核意见 */
		reviewOpinion: text("review_opinion"),
		/** 审核结果 */
		reviewResult: auditStatusEnum("review_result"),
		/** 审核时间 */
		reviewTime: timestamp("review_time"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ct_reviews_contract_id_idx").on(table.contractId)],
);

/** 合同归档表 */
export const ctArchives = pgTable(
	"ct_archives",
	{
		id: primaryId(),
		/** 关联合同 ID */
		contractId: uuid("contract_id")
			.references(() => ctContracts.id)
			.notNull(),
		/** 归档编号 */
		archiveNo: varchar("archive_no", { length: 100 }),
		/** 归档日期 */
		archiveDate: date("archive_date"),
		/** 归档位置 */
		archiveLocation: varchar("archive_location", { length: 200 }),
		/** 归档人 */
		archiver: varchar("archiver", { length: 50 }),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ct_archives_contract_id_idx").on(table.contractId)],
);

/** 合同打印记录表 */
export const ctPrints = pgTable(
	"ct_prints",
	{
		id: primaryId(),
		/** 关联合同 ID */
		contractId: uuid("contract_id")
			.references(() => ctContracts.id)
			.notNull(),
		/** 打印人 */
		printer: varchar("printer", { length: 50 }),
		/** 打印时间 */
		printTime: timestamp("print_time"),
		/** 打印份数 */
		printCount: integer("print_count").default(1),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [index("ct_prints_contract_id_idx").on(table.contractId)],
);

// ==========================================
// Part B: Zod Runtime Schemas
// ==========================================

// --- ctFirstParties ---
export const insertCtFirstPartySchema = createInsertSchema(ctFirstParties, {
	name: (schema) => schema.min(1, "甲方名称不能为空").max(200),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectCtFirstPartySchema = createSelectSchema(ctFirstParties);

export const updateCtFirstPartySchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, "甲方名称不能为空").max(200).optional(),
	contactPerson: z.string().max(50).optional().nullable(),
	contactPhone: z.string().max(20).optional().nullable(),
	address: z.string().optional().nullable(),
	creditCode: z.string().max(50).optional().nullable(),
	establishedDate: z.string().optional().nullable(),
	legalRepresentative: z.string().max(50).optional().nullable(),
	businessScope: z.string().optional().nullable(),
	status: z.enum(["enabled", "disabled"]).optional(),
	remark: z.string().optional().nullable(),
});

// --- ctSecondParties ---
export const insertCtSecondPartySchema = createInsertSchema(ctSecondParties, {
	name: (schema) => schema.min(1, "乙方名称不能为空").max(200),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectCtSecondPartySchema = createSelectSchema(ctSecondParties);

export const updateCtSecondPartySchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, "乙方名称不能为空").max(200).optional(),
	partyType: z.string().max(50).optional().nullable(),
	contactPerson: z.string().max(50).optional().nullable(),
	contactPhone: z.string().max(20).optional().nullable(),
	address: z.string().optional().nullable(),
	ownerId: z.string().uuid().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- ctTemplates ---
export const insertCtTemplateSchema = createInsertSchema(ctTemplates, {
	templateName: (schema) => schema.min(1, "模板名称不能为空").max(200),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectCtTemplateSchema = createSelectSchema(ctTemplates);

export const updateCtTemplateSchema = z.object({
	id: z.string().uuid(),
	templateName: z.string().min(1, "模板名称不能为空").max(200).optional(),
	templateType: z.string().max(50).optional().nullable(),
	templateContent: z.string().optional().nullable(),
	version: z.string().max(20).optional().nullable(),
	status: z.enum(["draft", "published", "disabled"]).optional(),
	remark: z.string().optional().nullable(),
});

// --- ctClauses ---
export const insertCtClauseSchema = createInsertSchema(ctClauses, {
	clauseName: (schema) => schema.min(1, "条款名称不能为空").max(200),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectCtClauseSchema = createSelectSchema(ctClauses);

export const updateCtClauseSchema = z.object({
	id: z.string().uuid(),
	templateId: z.string().uuid().optional(),
	clauseName: z.string().min(1, "条款名称不能为空").max(200).optional(),
	clauseContent: z.string().optional().nullable(),
	clauseType: z.string().max(50).optional().nullable(),
	sortOrder: z.number().int().optional(),
	remark: z.string().optional().nullable(),
});

// --- ctTypes ---
export const insertCtTypeSchema = createInsertSchema(ctTypes, {
	typeName: (schema) => schema.min(1, "类型名称不能为空").max(100),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectCtTypeSchema = createSelectSchema(ctTypes);

export const updateCtTypeSchema = z.object({
	id: z.string().uuid(),
	typeName: z.string().min(1, "类型名称不能为空").max(100).optional(),
	typeCode: z.string().max(50).optional().nullable(),
	typeDescription: z.string().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- ctContracts ---
export const insertCtContractSchema = createInsertSchema(ctContracts, {
	contractName: (schema) => schema.min(1, "合同名称不能为空").max(200),
	contractNumber: (schema) => schema.min(1, "合同编号不能为空").max(100),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
	deletedAt: true,
});

export const selectCtContractSchema = createSelectSchema(ctContracts);

export const updateCtContractSchema = z.object({
	id: z.string().uuid(),
	contractName: z.string().min(1, "合同名称不能为空").max(200).optional(),
	contractNumber: z.string().min(1, "合同编号不能为空").max(100).optional(),
	contractType: z.string().max(50).optional().nullable(),
	amount: z.string().optional().nullable(),
	firstPartyId: z.string().uuid().optional().nullable(),
	secondPartyId: z.string().uuid().optional().nullable(),
	startTime: z.date().optional().nullable(),
	endTime: z.date().optional().nullable(),
	signDate: z.string().optional().nullable(),
	partyA: z.string().max(200).optional().nullable(),
	partyAContact: z.string().max(50).optional().nullable(),
	partyAPhone: z.string().max(20).optional().nullable(),
	partyB: z.string().max(200).optional().nullable(),
	partyBContact: z.string().max(50).optional().nullable(),
	partyBPhone: z.string().max(20).optional().nullable(),
	handler: z.string().max(50).optional().nullable(),
	handlerPhone: z.string().max(20).optional().nullable(),
	description: z.string().optional().nullable(),
	signingTime: z.date().optional().nullable(),
	status: z.enum(["draft", "pending_review", "effective", "expired", "terminated"]).optional(),
	remark: z.string().optional().nullable(),
});

// --- ctUploadSessions ---
export const insertCtUploadSessionSchema = createInsertSchema(ctUploadSessions, {
	fileName: (schema) => schema.min(1, "文件名不能为空").max(255),
	mimeType: (schema) => schema.min(1, "文件类型不能为空").max(255),
	resumeFingerprint: (schema) => schema.min(1, "断点续传指纹不能为空").max(255),
	r2Bucket: (schema) => schema.min(1, "R2 bucket 不能为空").max(100),
	r2UploadId: (schema) => schema.min(1, "R2 uploadId 不能为空").max(1024),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
	uploadedPartsCount: true,
	objectEtag: true,
	publicUrl: true,
	completedAt: true,
});

export const selectCtUploadSessionSchema = createSelectSchema(ctUploadSessions);

export const updateCtUploadSessionSchema = z.object({
	id: z.string().uuid(),
	bizType: z.enum(uploadBizTypeValues).optional(),
	bizId: z.string().uuid().optional().nullable(),
	fileName: z.string().min(1, "文件名不能为空").max(255).optional(),
	mimeType: z.string().min(1, "文件类型不能为空").max(255).optional(),
	fileSize: z.number().int().optional(),
	chunkSize: z.number().int().optional(),
	totalParts: z.number().int().optional(),
	resumeFingerprint: z.string().min(1, "断点续传指纹不能为空").max(255).optional(),
	r2Bucket: z.string().min(1, "R2 bucket 不能为空").max(100).optional(),
	r2ObjectKey: z.string().min(1, "R2 对象 key 不能为空").optional(),
	r2UploadId: z.string().min(1, "R2 uploadId 不能为空").max(1024).optional(),
	status: z.enum(uploadSessionStatusValues).optional(),
	uploadedPartsCount: z.number().int().optional(),
	objectEtag: z.string().max(255).optional().nullable(),
	publicUrl: z.string().optional().nullable(),
	completedAt: z.date().optional().nullable(),
	expiresAt: z.date().optional(),
	remark: z.string().optional().nullable(),
});

// --- ctUploadSessionParts ---
export const insertCtUploadSessionPartSchema = createInsertSchema(ctUploadSessionParts, {
	etag: (schema) => schema.min(1, "分片 ETag 不能为空").max(255),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectCtUploadSessionPartSchema = createSelectSchema(ctUploadSessionParts);

export const updateCtUploadSessionPartSchema = z.object({
	id: z.string().uuid(),
	sessionId: z.string().uuid().optional(),
	partNumber: z.number().int().optional(),
	etag: z.string().min(1, "分片 ETag 不能为空").max(255).optional(),
	partSize: z.number().int().optional(),
	uploadedAt: z.date().optional(),
});

// --- ctChanges ---
export const insertCtChangeSchema = createInsertSchema(ctChanges).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectCtChangeSchema = createSelectSchema(ctChanges);

export const updateCtChangeSchema = z.object({
	id: z.string().uuid(),
	contractId: z.string().uuid().optional(),
	changeType: z.string().max(50).optional().nullable(),
	changeReason: z.string().optional().nullable(),
	changeContent: z.string().optional().nullable(),
	changeDate: z.string().optional().nullable(),
	changer: z.string().max(50).optional().nullable(),
	description: z.string().optional().nullable(),
	beforeChange: z.string().optional().nullable(),
	afterChange: z.string().optional().nullable(),
	changeTime: z.date().optional().nullable(),
	approvalStatus: z.enum(["pending", "approved", "rejected"]).optional(),
	approver: z.string().max(50).optional().nullable(),
	approvalTime: z.date().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- ctAttachments ---
export const insertCtAttachmentSchema = createInsertSchema(ctAttachments, {
	attachmentName: (schema) => schema.min(1, "附件名称不能为空").max(200),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectCtAttachmentSchema = createSelectSchema(ctAttachments);

export const updateCtAttachmentSchema = z.object({
	id: z.string().uuid(),
	contractId: z.string().uuid().optional(),
	changeId: z.string().uuid().optional().nullable(),
	attachmentName: z.string().min(1, "附件名称不能为空").max(200).optional(),
	attachmentType: z.string().max(50).optional().nullable(),
	filePath: z.string().optional().nullable(),
	fileSize: z.number().int().optional().nullable(),
	storageProvider: z.enum(storageProviderValues).optional(),
	bucketName: z.string().max(100).optional().nullable(),
	objectKey: z.string().optional().nullable(),
	fileUrl: z.string().optional().nullable(),
	mimeType: z.string().max(255).optional().nullable(),
	fileHash: z.string().max(255).optional().nullable(),
	objectEtag: z.string().max(255).optional().nullable(),
	uploadSessionId: z.string().uuid().optional().nullable(),
	uploadStatus: z.enum(attachmentUploadStatusValues).optional(),
	remark: z.string().optional().nullable(),
});

// --- ctReviews ---
export const insertCtReviewSchema = createInsertSchema(ctReviews).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectCtReviewSchema = createSelectSchema(ctReviews);

export const updateCtReviewSchema = z.object({
	id: z.string().uuid(),
	contractId: z.string().uuid().optional(),
	reviewer: z.string().max(50).optional().nullable(),
	reviewOpinion: z.string().optional().nullable(),
	reviewResult: z.enum(["pending", "approved", "rejected"]).optional().nullable(),
	reviewTime: z.date().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- ctArchives ---
export const insertCtArchiveSchema = createInsertSchema(ctArchives).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectCtArchiveSchema = createSelectSchema(ctArchives);

export const updateCtArchiveSchema = z.object({
	id: z.string().uuid(),
	contractId: z.string().uuid().optional(),
	archiveNo: z.string().max(100).optional().nullable(),
	archiveDate: z.string().optional().nullable(),
	archiveLocation: z.string().max(200).optional().nullable(),
	archiver: z.string().max(50).optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- ctPrints ---
export const insertCtPrintSchema = createInsertSchema(ctPrints).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectCtPrintSchema = createSelectSchema(ctPrints);

export const updateCtPrintSchema = z.object({
	id: z.string().uuid(),
	contractId: z.string().uuid().optional(),
	printer: z.string().max(50).optional().nullable(),
	printTime: z.date().optional().nullable(),
	printCount: z.number().int().optional(),
	remark: z.string().optional().nullable(),
});

// ==========================================
// Part C: TypeScript Types
// ==========================================

export type CtFirstParty = typeof ctFirstParties.$inferSelect;
export type NewCtFirstParty = typeof ctFirstParties.$inferInsert;
export type UpdateCtFirstParty = z.infer<typeof updateCtFirstPartySchema>;

export type CtSecondParty = typeof ctSecondParties.$inferSelect;
export type NewCtSecondParty = typeof ctSecondParties.$inferInsert;
export type UpdateCtSecondParty = z.infer<typeof updateCtSecondPartySchema>;

export type CtTemplate = typeof ctTemplates.$inferSelect;
export type NewCtTemplate = typeof ctTemplates.$inferInsert;
export type UpdateCtTemplate = z.infer<typeof updateCtTemplateSchema>;

export type CtClause = typeof ctClauses.$inferSelect;
export type NewCtClause = typeof ctClauses.$inferInsert;
export type UpdateCtClause = z.infer<typeof updateCtClauseSchema>;

export type CtType = typeof ctTypes.$inferSelect;
export type NewCtType = typeof ctTypes.$inferInsert;
export type UpdateCtType = z.infer<typeof updateCtTypeSchema>;

export type CtContract = typeof ctContracts.$inferSelect;
export type NewCtContract = typeof ctContracts.$inferInsert;
export type UpdateCtContract = z.infer<typeof updateCtContractSchema>;

export type CtUploadSession = typeof ctUploadSessions.$inferSelect;
export type NewCtUploadSession = typeof ctUploadSessions.$inferInsert;
export type UpdateCtUploadSession = z.infer<typeof updateCtUploadSessionSchema>;

export type CtUploadSessionPart = typeof ctUploadSessionParts.$inferSelect;
export type NewCtUploadSessionPart = typeof ctUploadSessionParts.$inferInsert;
export type UpdateCtUploadSessionPart = z.infer<typeof updateCtUploadSessionPartSchema>;

export type CtChange = typeof ctChanges.$inferSelect;
export type NewCtChange = typeof ctChanges.$inferInsert;
export type UpdateCtChange = z.infer<typeof updateCtChangeSchema>;

export type CtAttachment = typeof ctAttachments.$inferSelect;
export type NewCtAttachment = typeof ctAttachments.$inferInsert;
export type UpdateCtAttachment = z.infer<typeof updateCtAttachmentSchema>;

export type CtReview = typeof ctReviews.$inferSelect;
export type NewCtReview = typeof ctReviews.$inferInsert;
export type UpdateCtReview = z.infer<typeof updateCtReviewSchema>;

export type CtArchive = typeof ctArchives.$inferSelect;
export type NewCtArchive = typeof ctArchives.$inferInsert;
export type UpdateCtArchive = z.infer<typeof updateCtArchiveSchema>;

export type CtPrint = typeof ctPrints.$inferSelect;
export type NewCtPrint = typeof ctPrints.$inferInsert;
export type UpdateCtPrint = z.infer<typeof updateCtPrintSchema>;
