/**
 * @file 合同变更服务
 * @description 处理合同变更的 detail/create/update/delete 以及附件增量维护
 */

import { and, asc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import {
	ctAttachments,
	ctChanges,
	ctContracts,
	ctUploadSessions,
	type ChangeCreatePayload,
	type ChangeDeletePayload,
	type ChangeType,
	type ChangeUpdatePayload,
	type ContractChangeDetailVO,
	type AttachmentDetailItem,
	type JsonVO,
	type NewCtAttachment,
	type NewCtUploadSession,
} from "@01s-11comm/type";
import { formatDateTime } from "server/utils/format-date";
import type { DbType } from "server/db";

/** 默认的附件公开访问域名 */
const DEFAULT_ATTACHMENT_PUBLIC_BASE_URL = "https://01s-11comm-files.ruan-cat.com";

/** 默认的 R2 bucket 名称 */
const DEFAULT_R2_BUCKET = process.env.R2_BUCKET || "01s-11comm-files";

/** 默认的分片大小 */
const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024;

/** 详情查询参数校验 */
export const changeDetailBodySchema = z.object({
	id: z.string().uuid(),
});

/** 删除参数校验 */
export const changeDeleteBodySchema = z.object({
	ids: z.array(z.string().uuid()).min(1, "至少需要一个 ID"),
});

/** 附件元数据校验 */
export const changeAttachmentMetaSchema = z.object({
	uploadSessionId: z.string().uuid(),
	attachmentName: z.string().min(1),
	attachmentType: z.string().min(1),
});

/** 合同变更创建参数校验 */
export const changeCreateBodySchema = z.object({
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
	contractAmount: z.string().min(1),
	startTime: z.string().min(1),
	endTime: z.string().min(1),
	signingTime: z.string().min(1),
	changeType: z.string().min(1),
	changer: z.string().min(1),
	description: z.string().min(1),
	beforeChange: z.string().min(1),
	afterChange: z.string().min(1),
	changeTime: z.string().optional().nullable(),
	newUploadSessionIds: z.array(z.string().uuid()).default([]),
	attachmentMetas: z.array(changeAttachmentMetaSchema).default([]),
	remark: z.string().optional().nullable(),
});

/** 合同变更更新参数校验 */
export const changeUpdateBodySchema = changeCreateBodySchema.extend({
	id: z.string().uuid(),
	retainAttachmentIds: z.array(z.string().uuid()).default([]),
	deleteAttachmentIds: z.array(z.string().uuid()).default([]),
});

/** 构造统一的 JsonVO 响应对象 */
function createResponse<T>(code: number, message: string, data: T | null, extra: Partial<JsonVO<T>> = {}): JsonVO<T> {
	return {
		success: code >= 200 && code < 300,
		code,
		message,
		data,
		...extra,
	};
}

/** 去除首尾空白并兜底为空字符串 */
function normalizeText(value: string | null | undefined): string {
	return value?.trim() || "";
}

/** 将任意值规整为字符串 */
function toStringValue(value: unknown): string {
	if (value === null || value === undefined) {
		return "";
	}
	return String(value);
}

/** 从日期时间字符串中提取日期部分 */
function extractDatePart(value: string | null | undefined): string {
	if (!value) return "";
	return value.slice(0, 10);
}

/** 将字符串时间规整为可写入数据库的 Date */
function toDateValue(value: string | null | undefined): Date | undefined {
	const normalizedValue = normalizeText(value);
	if (!normalizedValue) {
		return undefined;
	}

	const dateValue = new Date(normalizedValue);
	return Number.isNaN(dateValue.getTime()) ? undefined : dateValue;
}

/** 为变更附件生成稳定的对象键 */
function buildAttachmentObjectKey(changeId: string, sessionId: string, attachmentName: string): string {
	const safeName = normalizeText(attachmentName).replace(/[^\w.\-]+/g, "_") || "attachment";
	return `contract-manage/change/${changeId}/${sessionId}-${safeName}`;
}

/** 将对象键映射为公开访问 URL */
function buildAttachmentFileUrl(objectKey: string): string {
	return `${DEFAULT_ATTACHMENT_PUBLIC_BASE_URL}/${objectKey}`;
}

/** 校验附件元数据与新上传会话 ID 列表是否一致 */
function validateAttachmentSessionIds(
	newUploadSessionIds: string[],
	attachmentMetas: ChangeCreatePayload["attachmentMetas"],
) {
	const requestedSessionIds = new Set(newUploadSessionIds);
	for (const meta of attachmentMetas) {
		if (!requestedSessionIds.has(meta.uploadSessionId)) {
			throw new Error(`attachmentMetas 中的 uploadSessionId 未出现在 newUploadSessionIds 中: ${meta.uploadSessionId}`);
		}
	}
}

/** 从创建/更新 payload 中提取合同表字段 */
function buildContractValues(payload: ChangeCreatePayload | ChangeUpdatePayload) {
	return {
		contractName: normalizeText(payload.contractName),
		contractNumber: normalizeText(payload.contractNumber),
		contractType: normalizeText(payload.contractType),
		amount: normalizeText(payload.contractAmount),
		partyA: normalizeText(payload.partyA),
		partyAContact: normalizeText(payload.partyAContact),
		partyAPhone: normalizeText(payload.partyAPhone),
		partyB: normalizeText(payload.partyB),
		partyBContact: normalizeText(payload.partyBContact),
		partyBPhone: normalizeText(payload.partyBPhone),
		handler: normalizeText(payload.handler),
		handlerPhone: normalizeText(payload.handlerPhone),
		description: normalizeText(payload.description),
		startTime: toDateValue(payload.startTime),
		endTime: toDateValue(payload.endTime),
		signingTime: toDateValue(payload.signingTime),
		remark: normalizeText(payload.remark),
	};
}

/** 从创建/更新 payload 中提取变更表字段 */
function buildChangeValues(payload: ChangeCreatePayload | ChangeUpdatePayload, contractId: string) {
	const changeTime = normalizeText(payload.changeTime || payload.signingTime);
	return {
		contractId,
		changeType: normalizeText(payload.changeType),
		changeReason: normalizeText(payload.description),
		changeContent: normalizeText(payload.description),
		changeDate: extractDatePart(changeTime || payload.signingTime),
		changer: normalizeText(payload.changer),
		description: normalizeText(payload.description),
		beforeChange: normalizeText(payload.beforeChange),
		afterChange: normalizeText(payload.afterChange),
		changeTime: toDateValue(changeTime || payload.signingTime),
		remark: normalizeText(payload.remark),
	};
}

interface AttachmentSourceRow {
	id: string;
	contractId: string;
	changeId?: string | null;
	attachmentName: string;
	attachmentType?: string | null;
	filePath?: string | null;
	fileSize?: number | null;
	storageProvider?: string | null;
	bucketName?: string | null;
	objectKey?: string | null;
	fileUrl?: string | null;
	mimeType?: string | null;
	fileHash?: string | null;
	objectEtag?: string | null;
	uploadSessionId?: string | null;
	uploadStatus?: string | null;
	uploadedAt?: Date | string | null;
	createTime?: Date | string | null;
	updateTime?: Date | string | null;
	createdAt?: Date | string | null;
	updatedAt?: Date | string | null;
	remark?: string | null;
}

interface AttachmentContractMeta {
	contractName?: string | null;
	contractNumber?: string | null;
}

function mapAttachmentRow(row: AttachmentSourceRow, contractMeta: AttachmentContractMeta = {}): AttachmentDetailItem {
	return {
		id: row.id,
		contractId: row.contractId,
		changeId: row.changeId || undefined,
		attachmentName: row.attachmentName,
		fileName: row.attachmentName,
		contractNumber: normalizeText(contractMeta.contractNumber),
		contractName: normalizeText(contractMeta.contractName),
		attachmentType: row.attachmentType || "",
		fileType: row.attachmentType || undefined,
		filePath: row.filePath || undefined,
		fileSize: row.fileSize || undefined,
		fileFormat: row.mimeType || undefined,
		uploader: undefined,
		uploadTime: row.uploadedAt ? formatDateTime(row.uploadedAt) : row.createTime ? formatDateTime(row.createTime) : "",
		status: row.uploadStatus || "ready",
		storageProvider: "r2",
		bucketName: row.bucketName || undefined,
		objectKey: row.objectKey || undefined,
		fileUrl: row.fileUrl || undefined,
		mimeType: row.mimeType || undefined,
		fileHash: row.fileHash || undefined,
		objectEtag: row.objectEtag || undefined,
		uploadSessionId: row.uploadSessionId || undefined,
		uploadStatus: row.uploadStatus === "deleted" ? "deleted" : "ready",
		createTime: row.createTime ? formatDateTime(row.createTime) : row.uploadedAt ? formatDateTime(row.uploadedAt) : "",
		updateTime: row.updateTime ? formatDateTime(row.updateTime) : row.updatedAt ? formatDateTime(row.updatedAt) : "",
		remark: row.remark || undefined,
	};
}

interface ContractSourceRow {
	id: string;
	contractName?: string | null;
	contractNumber?: string | null;
	contractType?: string | null;
	amount?: string | number | null;
	partyA?: string | null;
	partyAContact?: string | null;
	partyAPhone?: string | null;
	partyB?: string | null;
	partyBContact?: string | null;
	partyBPhone?: string | null;
	handler?: string | null;
	handlerPhone?: string | null;
	description?: string | null;
	startTime?: Date | string | null;
	endTime?: Date | string | null;
	signingTime?: Date | string | null;
	status?: string | null;
	createTime?: Date | string | null;
	updateTime?: Date | string | null;
	remark?: string | null;
}

interface ChangeSourceRow {
	id: string;
	contractId: string;
	changeType?: string | null;
	changeReason?: string | null;
	changeContent?: string | null;
	changeDate?: Date | string | null;
	changer?: string | null;
	description?: string | null;
	beforeChange?: string | null;
	afterChange?: string | null;
	changeTime?: Date | string | null;
	approvalStatus?: string | null;
	approver?: string | null;
	approvalTime?: Date | string | null;
	remark?: string | null;
	createTime?: Date | string | null;
	updateTime?: Date | string | null;
}

interface UploadSessionSourceRow {
	id: string;
	bizType: string;
	bizId?: string | null;
	fileName: string;
	mimeType: string;
	fileSize: number;
	chunkSize: number;
	totalParts: number;
	resumeFingerprint: string;
	r2Bucket: string;
	r2ObjectKey: string;
	r2UploadId: string;
	status: string;
	uploadedPartsCount: number;
	objectEtag?: string | null;
	publicUrl?: string | null;
	completedAt?: Date | string | null;
	expiresAt: Date | string;
	remark?: string | null;
	createTime?: Date | string | null;
	updateTime?: Date | string | null;
}

async function ensurePlaceholderUploadSession(
	db: DbType,
	input: {
		sessionId: string;
		changeId: string;
		attachmentName: string;
		attachmentType: string;
	},
) {
	const [existing] = await db
		.select({ id: ctUploadSessions.id })
		.from(ctUploadSessions)
		.where(eq(ctUploadSessions.id, input.sessionId))
		.limit(1);
	if (existing) {
		return existing.id;
	}

	const objectKey = buildAttachmentObjectKey(input.changeId, input.sessionId, input.attachmentName);
	const uploadSessionValues = {
		id: input.sessionId,
		bizType: "change",
		bizId: input.changeId,
		fileName: normalizeText(input.attachmentName) || "attachment",
		mimeType: "application/octet-stream",
		fileSize: 0,
		chunkSize: DEFAULT_CHUNK_SIZE,
		totalParts: 1,
		resumeFingerprint: input.sessionId,
		r2Bucket: DEFAULT_R2_BUCKET,
		r2ObjectKey: objectKey,
		r2UploadId: input.sessionId,
		status: "completed",
		uploadedPartsCount: 0,
		objectEtag: null,
		publicUrl: buildAttachmentFileUrl(objectKey),
		completedAt: new Date(),
		expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
		remark: "change attachment placeholder session",
	} as NewCtUploadSession;
	await db.insert(ctUploadSessions).values(uploadSessionValues as any);

	return input.sessionId;
}

/**
 * 加载合同变更详情。
 * @description
 * 汇总变更记录、所属合同与附件信息，
 * 输出前端详情页直接可消费的 `ContractChangeDetailVO`。
 */
async function loadChangeDetail(db: DbType, changeId: string): Promise<JsonVO<ContractChangeDetailVO>> {
	const [changeRow] = await db.select().from(ctChanges).where(eq(ctChanges.id, changeId)).limit(1);

	if (!changeRow) {
		return createResponse(404, "记录不存在", null);
	}

	const [contractRow] = await db.select().from(ctContracts).where(eq(ctContracts.id, changeRow.contractId)).limit(1);

	if (!contractRow) {
		return createResponse(404, "记录不存在", null);
	}

	const attachmentRows = await db
		.select()
		.from(ctAttachments)
		.where(eq(ctAttachments.changeId, changeId))
		.orderBy(asc(ctAttachments.createTime));

	const attachmentContractMeta = {
		contractName: contractRow.contractName,
		contractNumber: contractRow.contractNumber,
	};
	const attachments = attachmentRows.map((row) => mapAttachmentRow(row, attachmentContractMeta));

	const detail: ContractChangeDetailVO = {
		id: changeRow.id,
		contractId: changeRow.contractId,
		contractName: contractRow.contractName || "",
		contractNumber: contractRow.contractNumber || "",
		contractType: contractRow.contractType || "",
		partyA: contractRow.partyA || "",
		partyAContact: contractRow.partyAContact || "",
		partyAPhone: contractRow.partyAPhone || "",
		partyB: contractRow.partyB || "",
		partyBContact: contractRow.partyBContact || "",
		partyBPhone: contractRow.partyBPhone || "",
		handler: contractRow.handler || "",
		handlerPhone: contractRow.handlerPhone || "",
		contractAmount: toStringValue(contractRow.amount),
		startTime: contractRow.startTime ? formatDateTime(contractRow.startTime) : "",
		endTime: contractRow.endTime ? formatDateTime(contractRow.endTime) : "",
		signingTime: contractRow.signingTime ? formatDateTime(contractRow.signingTime) : "",
		changeType: (changeRow.changeType || "合同金额") as ChangeType,
		changer: changeRow.changer || "",
		description: changeRow.changeContent || changeRow.changeReason || contractRow.description || "",
		beforeChange: changeRow.beforeChange || "",
		afterChange: changeRow.afterChange || "",
		changeTime: changeRow.changeTime ? formatDateTime(changeRow.changeTime) : "",
		status: changeRow.approvalStatus || "pending",
		approver: changeRow.approver || undefined,
		approvalTime: changeRow.approvalTime ? formatDateTime(changeRow.approvalTime) : undefined,
		attachments,
		createTime: changeRow.createTime ? formatDateTime(changeRow.createTime) : "",
		updateTime: changeRow.updateTime ? formatDateTime(changeRow.updateTime) : "",
		remark: changeRow.remark || undefined,
	};

	return createResponse(200, "查询成功", detail);
}

/** 按合同编号创建或更新合同主记录 */
async function upsertContractRecord(db: DbType, payload: ChangeCreatePayload | ChangeUpdatePayload) {
	const contractValues = buildContractValues(payload);
	const [existingContract] = await db
		.select({ id: ctContracts.id })
		.from(ctContracts)
		.where(eq(ctContracts.contractNumber, payload.contractNumber))
		.limit(1);

	if (existingContract) {
		const [updated] = await db
			.update(ctContracts)
			.set(contractValues)
			.where(eq(ctContracts.id, existingContract.id))
			.returning();
		return updated;
	}

	const [created] = await db.insert(ctContracts).values(contractValues).returning();
	return created;
}

/** 将已完成上传会话物化为合同变更附件记录 */
async function materializeAttachments(
	db: DbType,
	args: {
		contractId: string;
		changeId: string;
		newUploadSessionIds: string[];
		attachmentMetas: ChangeCreatePayload["attachmentMetas"];
	},
) {
	if (args.attachmentMetas.length === 0) {
		return;
	}

	validateAttachmentSessionIds(args.newUploadSessionIds, args.attachmentMetas);

	for (const meta of args.attachmentMetas) {
		await ensurePlaceholderUploadSession(db, {
			sessionId: meta.uploadSessionId,
			changeId: args.changeId,
			attachmentName: meta.attachmentName,
			attachmentType: meta.attachmentType,
		});

		const objectKey = buildAttachmentObjectKey(args.changeId, meta.uploadSessionId, meta.attachmentName);
		const attachmentValues = {
			contractId: args.contractId,
			changeId: args.changeId,
			attachmentName: meta.attachmentName,
			attachmentType: meta.attachmentType,
			filePath: objectKey,
			fileSize: 0,
			storageProvider: "r2",
			bucketName: DEFAULT_R2_BUCKET,
			objectKey,
			fileUrl: buildAttachmentFileUrl(objectKey),
			mimeType: "application/octet-stream",
			fileHash: null,
			objectEtag: null,
			uploadSessionId: meta.uploadSessionId,
			uploadStatus: "ready",
			remark: "change attachment placeholder",
		} as NewCtAttachment;
		await db.insert(ctAttachments).values(attachmentValues as any);
	}
}

/**
 * 同步合同变更附件差量。
 * @description
 * 根据保留、删除、新增三组附件输入，
 * 将附件表状态收敛到前端当前编辑结果。
 */
async function syncAttachmentDelta(
	db: DbType,
	args: {
		contractId: string;
		changeId: string;
		retainAttachmentIds: string[];
		deleteAttachmentIds: string[];
		newUploadSessionIds: string[];
		attachmentMetas: ChangeCreatePayload["attachmentMetas"];
	},
) {
	const currentAttachments = await db
		.select({ id: ctAttachments.id })
		.from(ctAttachments)
		.where(eq(ctAttachments.changeId, args.changeId));

	const currentAttachmentIds = currentAttachments.map((item) => item.id);
	const retainSet = new Set(args.retainAttachmentIds);
	const explicitDeleteSet = new Set(args.deleteAttachmentIds);
	const finalDeleteSet = new Set<string>();

	for (const attachmentId of currentAttachmentIds) {
		if (!retainSet.has(attachmentId)) {
			finalDeleteSet.add(attachmentId);
		}
	}

	for (const attachmentId of explicitDeleteSet) {
		finalDeleteSet.add(attachmentId);
	}

	const deleteIds = Array.from(finalDeleteSet);
	if (deleteIds.length > 0) {
		await db
			.delete(ctAttachments)
			.where(and(eq(ctAttachments.changeId, args.changeId), inArray(ctAttachments.id, deleteIds)));
	}

	await materializeAttachments(db, args);
}

/** 创建合同变更记录及其附件物化结果 */
export async function createChangeRecord(
	db: DbType,
	payload: ChangeCreatePayload,
): Promise<JsonVO<ContractChangeDetailVO>> {
	try {
		const contract = await upsertContractRecord(db, payload);
		const changeValues = buildChangeValues(payload, contract.id);
		const [changeRow] = await db.insert(ctChanges).values(changeValues).returning();

		await materializeAttachments(db, {
			contractId: contract.id,
			changeId: changeRow.id,
			newUploadSessionIds: payload.newUploadSessionIds,
			attachmentMetas: payload.attachmentMetas,
		});

		return loadChangeDetail(db, changeRow.id);
	} catch (error: any) {
		return createResponse(500, "创建失败", null, {
			success: false,
			error: error?.message || String(error),
			stack: error?.stack,
		});
	}
}

/** 更新合同变更记录并同步附件差量 */
export async function updateChangeRecord(
	db: DbType,
	payload: ChangeUpdatePayload,
): Promise<JsonVO<ContractChangeDetailVO>> {
	try {
		const [existingChange] = await db.select().from(ctChanges).where(eq(ctChanges.id, payload.id)).limit(1);

		if (!existingChange) {
			return createResponse(404, "记录不存在", null);
		}

		const contract = await upsertContractRecord(db, payload);
		const changeValues = buildChangeValues(payload, contract.id);
		await db.update(ctChanges).set(changeValues).where(eq(ctChanges.id, payload.id));

		await syncAttachmentDelta(db, {
			contractId: contract.id,
			changeId: payload.id,
			retainAttachmentIds: payload.retainAttachmentIds,
			deleteAttachmentIds: payload.deleteAttachmentIds,
			newUploadSessionIds: payload.newUploadSessionIds,
			attachmentMetas: payload.attachmentMetas,
		});

		return loadChangeDetail(db, payload.id);
	} catch (error: any) {
		return createResponse(500, "更新失败", null, {
			success: false,
			error: error?.message || String(error),
			stack: error?.stack,
		});
	}
}

/** 删除合同变更记录 */
export async function deleteChangeRecord(db: DbType, payload: ChangeDeletePayload): Promise<JsonVO<null>> {
	try {
		const existingChanges = await db
			.select({ id: ctChanges.id })
			.from(ctChanges)
			.where(inArray(ctChanges.id, payload.ids));

		if (existingChanges.length === 0) {
			return createResponse(404, "记录不存在", null);
		}

		await db.delete(ctChanges).where(inArray(ctChanges.id, payload.ids));

		return createResponse(200, "删除成功", null);
	} catch (error: any) {
		return createResponse(500, "删除失败", null, {
			success: false,
			error: error?.message || String(error),
			stack: error?.stack,
		});
	}
}

/** 获取单条合同变更详情 */
export async function getChangeDetailRecord(
	db: DbType,
	payload: z.infer<typeof changeDetailBodySchema>,
): Promise<JsonVO<ContractChangeDetailVO>> {
	try {
		return await loadChangeDetail(db, payload.id);
	} catch (error: any) {
		return createResponse(500, "查询失败", null, {
			success: false,
			error: error?.message || String(error),
			stack: error?.stack,
		});
	}
}

// ============================================================================
// 无数据库环境下的内存回退实现
// ============================================================================

interface MemoryChangeManageState {
	contracts: ContractSourceRow[];
	changes: ChangeSourceRow[];
	attachments: AttachmentSourceRow[];
	uploadSessions: UploadSessionSourceRow[];
}

const memoryChangeManageState: MemoryChangeManageState = {
	contracts: [],
	changes: [],
	attachments: [],
	uploadSessions: [],
};

function nowIso(): string {
	return new Date().toISOString();
}

/** 为内存回退模式构造合同行 */
function buildMemoryContractRow(
	payload: ChangeCreatePayload | ChangeUpdatePayload,
	contractId: string,
): ContractSourceRow {
	const contractValues = buildContractValues(payload);
	return {
		id: contractId,
		...contractValues,
		createTime: nowIso(),
		updateTime: nowIso(),
		status: "draft",
	};
}

/** 在内存回退模式中按合同编号创建或更新合同 */
function upsertMemoryContract(payload: ChangeCreatePayload | ChangeUpdatePayload): ContractSourceRow {
	const contractValues = buildContractValues(payload);
	const existing = memoryChangeManageState.contracts.find(
		(item) => item.contractNumber === contractValues.contractNumber,
	);

	if (existing) {
		Object.assign(existing, contractValues, {
			updateTime: nowIso(),
		});
		return existing;
	}

	const contractId = crypto.randomUUID();
	const contractRow = buildMemoryContractRow(payload, contractId);
	memoryChangeManageState.contracts.push(contractRow);
	return contractRow;
}

/** 为内存回退模式构造变更行 */
function buildMemoryChangeRow(
	payload: ChangeCreatePayload | ChangeUpdatePayload,
	contractId: string,
	changeId: string,
): ChangeSourceRow {
	const changeValues = buildChangeValues(payload, contractId);
	return {
		id: changeId,
		contractId,
		...changeValues,
		approvalStatus: "pending",
		approver: undefined,
		approvalTime: undefined,
		createTime: nowIso(),
		updateTime: nowIso(),
	};
}

function findMemoryChange(changeId: string): ChangeSourceRow | undefined {
	return memoryChangeManageState.changes.find((item) => item.id === changeId);
}

function findMemoryContract(contractId: string): ContractSourceRow | undefined {
	return memoryChangeManageState.contracts.find((item) => item.id === contractId);
}

function findMemoryAttachments(changeId: string): AttachmentSourceRow[] {
	return memoryChangeManageState.attachments.filter((item) => item.changeId === changeId);
}

function ensureMemoryUploadSession(changeId: string, meta: ChangeCreatePayload["attachmentMetas"][number]) {
	const existing = memoryChangeManageState.uploadSessions.find((item) => item.id === meta.uploadSessionId);
	if (existing) {
		return existing;
	}

	const objectKey = buildAttachmentObjectKey(changeId, meta.uploadSessionId, meta.attachmentName);
	const session: UploadSessionSourceRow = {
		id: meta.uploadSessionId,
		bizType: "change",
		bizId: changeId,
		fileName: meta.attachmentName,
		mimeType: "application/octet-stream",
		fileSize: 0,
		chunkSize: DEFAULT_CHUNK_SIZE,
		totalParts: 1,
		resumeFingerprint: meta.uploadSessionId,
		r2Bucket: DEFAULT_R2_BUCKET,
		r2ObjectKey: objectKey,
		r2UploadId: meta.uploadSessionId,
		status: "completed",
		uploadedPartsCount: 0,
		objectEtag: null,
		publicUrl: buildAttachmentFileUrl(objectKey),
		completedAt: nowIso(),
		expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
		remark: "change attachment placeholder session",
		createTime: nowIso(),
		updateTime: nowIso(),
	};
	memoryChangeManageState.uploadSessions.push(session);
	return session;
}

/** 在内存回退模式中物化新增附件 */
function insertMemoryAttachments(args: {
	contractId: string;
	changeId: string;
	newUploadSessionIds: string[];
	attachmentMetas: ChangeCreatePayload["attachmentMetas"];
}) {
	validateAttachmentSessionIds(args.newUploadSessionIds, args.attachmentMetas);
	for (const meta of args.attachmentMetas) {
		ensureMemoryUploadSession(args.changeId, meta);
		const objectKey = buildAttachmentObjectKey(args.changeId, meta.uploadSessionId, meta.attachmentName);
		memoryChangeManageState.attachments.push({
			id: crypto.randomUUID(),
			contractId: args.contractId,
			changeId: args.changeId,
			attachmentName: meta.attachmentName,
			attachmentType: meta.attachmentType,
			filePath: objectKey,
			fileSize: 0,
			storageProvider: "r2",
			bucketName: DEFAULT_R2_BUCKET,
			objectKey,
			fileUrl: buildAttachmentFileUrl(objectKey),
			mimeType: "application/octet-stream",
			fileHash: null,
			objectEtag: null,
			uploadSessionId: meta.uploadSessionId,
			uploadStatus: "ready",
			remark: "change attachment placeholder",
			createTime: nowIso(),
			updateTime: nowIso(),
			uploadedAt: nowIso(),
		});
	}
}

/** 读取内存回退模式下的合同变更详情 */
function loadMemoryDetail(changeId: string): JsonVO<ContractChangeDetailVO> {
	const changeRow = findMemoryChange(changeId);
	if (!changeRow) {
		return createResponse(404, "记录不存在", null);
	}

	const contractRow = findMemoryContract(changeRow.contractId);
	if (!contractRow) {
		return createResponse(404, "记录不存在", null);
	}

	const attachmentRows = findMemoryAttachments(changeId);
	const attachmentContractMeta = {
		contractName: contractRow.contractName,
		contractNumber: contractRow.contractNumber,
	};
	const detail: ContractChangeDetailVO = {
		id: changeRow.id,
		contractId: changeRow.contractId,
		contractName: contractRow.contractName || "",
		contractNumber: contractRow.contractNumber || "",
		contractType: contractRow.contractType || "",
		partyA: contractRow.partyA || "",
		partyAContact: contractRow.partyAContact || "",
		partyAPhone: contractRow.partyAPhone || "",
		partyB: contractRow.partyB || "",
		partyBContact: contractRow.partyBContact || "",
		partyBPhone: contractRow.partyBPhone || "",
		handler: contractRow.handler || "",
		handlerPhone: contractRow.handlerPhone || "",
		contractAmount: toStringValue(contractRow.amount),
		startTime: contractRow.startTime ? formatDateTime(contractRow.startTime) : "",
		endTime: contractRow.endTime ? formatDateTime(contractRow.endTime) : "",
		signingTime: contractRow.signingTime ? formatDateTime(contractRow.signingTime) : "",
		changeType: (changeRow.changeType || "合同金额") as ChangeType,
		changer: changeRow.changer || "",
		description: changeRow.changeContent || changeRow.changeReason || contractRow.description || "",
		beforeChange: changeRow.beforeChange || "",
		afterChange: changeRow.afterChange || "",
		changeTime: changeRow.changeTime ? formatDateTime(changeRow.changeTime) : "",
		status: changeRow.approvalStatus || "pending",
		approver: changeRow.approver || undefined,
		approvalTime: changeRow.approvalTime ? formatDateTime(changeRow.approvalTime) : undefined,
		attachments: attachmentRows.map((row) => mapAttachmentRow(row, attachmentContractMeta)),
		createTime: changeRow.createTime ? formatDateTime(changeRow.createTime) : "",
		updateTime: changeRow.updateTime ? formatDateTime(changeRow.updateTime) : "",
		remark: changeRow.remark || undefined,
	};

	return createResponse(200, "查询成功", detail);
}

/** 在内存回退模式下同步附件差量 */
function syncMemoryAttachmentDelta(args: {
	contractId: string;
	changeId: string;
	retainAttachmentIds: string[];
	deleteAttachmentIds: string[];
	newUploadSessionIds: string[];
	attachmentMetas: ChangeCreatePayload["attachmentMetas"];
}) {
	const currentAttachmentIds = findMemoryAttachments(args.changeId).map((item) => item.id);
	const retainSet = new Set(args.retainAttachmentIds);
	const explicitDeleteSet = new Set(args.deleteAttachmentIds);
	const finalDeleteSet = new Set<string>();

	for (const attachmentId of currentAttachmentIds) {
		if (!retainSet.has(attachmentId)) {
			finalDeleteSet.add(attachmentId);
		}
	}

	for (const attachmentId of explicitDeleteSet) {
		finalDeleteSet.add(attachmentId);
	}

	if (finalDeleteSet.size > 0) {
		memoryChangeManageState.attachments = memoryChangeManageState.attachments.filter(
			(item) => item.changeId !== args.changeId || !finalDeleteSet.has(item.id),
		);
	}

	insertMemoryAttachments({
		contractId: args.contractId,
		changeId: args.changeId,
		newUploadSessionIds: args.newUploadSessionIds,
		attachmentMetas: args.attachmentMetas,
	});
}

/** 在内存回退模式下创建合同变更 */
export async function createChangeRecordInMemory(
	payload: ChangeCreatePayload,
): Promise<JsonVO<ContractChangeDetailVO>> {
	try {
		const contract = upsertMemoryContract(payload);
		const changeId = crypto.randomUUID();
		const changeRow = buildMemoryChangeRow(payload, contract.id, changeId);
		memoryChangeManageState.changes.push(changeRow);
		insertMemoryAttachments({
			contractId: contract.id,
			changeId,
			newUploadSessionIds: payload.newUploadSessionIds,
			attachmentMetas: payload.attachmentMetas,
		});
		return loadMemoryDetail(changeId);
	} catch (error: any) {
		return createResponse(500, "创建失败", null, {
			success: false,
			error: error?.message || String(error),
			stack: error?.stack,
		});
	}
}

/** 在内存回退模式下更新合同变更 */
export async function updateChangeRecordInMemory(
	payload: ChangeUpdatePayload,
): Promise<JsonVO<ContractChangeDetailVO>> {
	try {
		const existingChange = findMemoryChange(payload.id);
		if (!existingChange) {
			return createResponse(404, "记录不存在", null);
		}

		const contract = upsertMemoryContract(payload);
		Object.assign(existingChange, buildChangeValues(payload, contract.id), {
			contractId: contract.id,
			updateTime: nowIso(),
		});

		syncMemoryAttachmentDelta({
			contractId: contract.id,
			changeId: payload.id,
			retainAttachmentIds: payload.retainAttachmentIds,
			deleteAttachmentIds: payload.deleteAttachmentIds,
			newUploadSessionIds: payload.newUploadSessionIds,
			attachmentMetas: payload.attachmentMetas,
		});

		return loadMemoryDetail(payload.id);
	} catch (error: any) {
		return createResponse(500, "更新失败", null, {
			success: false,
			error: error?.message || String(error),
			stack: error?.stack,
		});
	}
}

/** 在内存回退模式下删除合同变更 */
export async function deleteChangeRecordInMemory(payload: ChangeDeletePayload): Promise<JsonVO<null>> {
	try {
		const existingIds = new Set(memoryChangeManageState.changes.map((item) => item.id));
		const targetIds = payload.ids.filter((id) => existingIds.has(id));
		if (targetIds.length === 0) {
			return createResponse(404, "记录不存在", null);
		}

		memoryChangeManageState.changes = memoryChangeManageState.changes.filter((item) => !targetIds.includes(item.id));
		memoryChangeManageState.attachments = memoryChangeManageState.attachments.filter(
			(item) => !targetIds.includes(item.changeId || ""),
		);

		return createResponse(200, "删除成功", null);
	} catch (error: any) {
		return createResponse(500, "删除失败", null, {
			success: false,
			error: error?.message || String(error),
			stack: error?.stack,
		});
	}
}

/** 在内存回退模式下读取合同变更详情 */
export async function getChangeDetailRecordInMemory(
	payload: z.infer<typeof changeDetailBodySchema>,
): Promise<JsonVO<ContractChangeDetailVO>> {
	try {
		return loadMemoryDetail(payload.id);
	} catch (error: any) {
		return createResponse(500, "查询失败", null, {
			success: false,
			error: error?.message || String(error),
			stack: error?.stack,
		});
	}
}
