/**
 * @file 合同起草服务
 * @description 处理合同起草的 detail/create/update/delete 以及附件增量维护
 */

import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import type { H3Event } from "nitro/h3";
import { z } from "zod";
import {
	createDraftContractSchema,
	ctAttachments,
	ctContracts,
	ctUploadSessions,
	updateDraftContractSchema,
	type AttachmentDetailItem,
	type DraftContractCreatePayload,
	type DraftContractDeletePayload,
	type DraftContractUpdatePayload,
	type JsonVO,
	type ContractDraftDetailVO,
	type NewCtAttachment,
} from "@01s-11comm/type";
import { useDb } from "server/db";
import { formatDateTime } from "server/utils/format-date";

/** 合同起草详情参数校验 */
export const draftContractDetailBodySchema = z.object({
	id: z.string().uuid(),
});

/** 合同起草删除参数校验 */
export const draftContractDeleteBodySchema = z.object({
	ids: z.array(z.string().uuid()).min(1, "至少需要一个 ID"),
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

/** 将字符串时间规整为可写入数据库的 Date */
function toDateValue(value: string | null | undefined): Date | undefined {
	const normalizedValue = normalizeText(value);
	if (!normalizedValue) {
		return undefined;
	}

	const dateValue = new Date(normalizedValue);
	return Number.isNaN(dateValue.getTime()) ? undefined : dateValue;
}

/** 校验附件元数据与新上传会话 ID 列表是否一致 */
function validateAttachmentSessionIds(
	newUploadSessionIds: string[],
	attachmentMetas: DraftContractCreatePayload["attachmentMetas"],
) {
	const requestedSessionIds = new Set(newUploadSessionIds);

	for (const meta of attachmentMetas) {
		if (!requestedSessionIds.has(meta.uploadSessionId)) {
			throw new Error(`attachmentMetas 中的 uploadSessionId 未出现在 newUploadSessionIds: ${meta.uploadSessionId}`);
		}
	}
}

/** 从起草合同 payload 中提取合同表字段 */
function buildContractValues(payload: DraftContractCreatePayload | DraftContractUpdatePayload) {
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
		status: "draft" as const,
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
	createTime?: Date | string | null;
	updateTime?: Date | string | null;
	remark?: string | null;
}

function mapAttachmentRow(
	row: AttachmentSourceRow,
	contract: {
		id: string;
		contractName?: string | null;
		contractNumber?: string | null;
	},
): AttachmentDetailItem {
	return {
		id: row.id,
		contractId: row.contractId,
		changeId: row.changeId || undefined,
		attachmentName: row.attachmentName,
		fileName: row.attachmentName,
		contractNumber: contract.contractNumber || "",
		contractName: contract.contractName || "",
		attachmentType: row.attachmentType || "",
		fileType: row.attachmentType || undefined,
		filePath: row.filePath || undefined,
		fileSize: row.fileSize || undefined,
		fileFormat: row.mimeType || undefined,
		uploader: undefined,
		uploadTime: row.createTime ? formatDateTime(row.createTime) : "",
		status: row.uploadStatus || "ready",
		storageProvider: (row.storageProvider as "r2" | undefined) ?? "r2",
		bucketName: row.bucketName || undefined,
		objectKey: row.objectKey || undefined,
		fileUrl: row.fileUrl || undefined,
		mimeType: row.mimeType || undefined,
		fileHash: row.fileHash || undefined,
		objectEtag: row.objectEtag || undefined,
		uploadSessionId: row.uploadSessionId || undefined,
		uploadStatus: (row.uploadStatus as "ready" | "deleted" | undefined) ?? "ready",
		createTime: row.createTime ? formatDateTime(row.createTime) : "",
		updateTime: row.updateTime ? formatDateTime(row.updateTime) : "",
		remark: row.remark || undefined,
	};
}

/**
 * 加载起草合同详情。
 * @description
 * 汇总合同主记录与未关联变更的附件记录，
 * 输出前端详情页直接可消费的 `ContractDraftDetailVO`。
 */
async function loadDraftContractDetail(event: H3Event, contractId: string): Promise<JsonVO<ContractDraftDetailVO>> {
	const db = useDb(event);

	const [contractRow] = await db
		.select()
		.from(ctContracts)
		.where(and(eq(ctContracts.id, contractId), isNull(ctContracts.deletedAt)))
		.limit(1);

	if (!contractRow) {
		return createResponse(404, "记录不存在", null);
	}

	const attachmentRows = await db
		.select()
		.from(ctAttachments)
		.where(and(eq(ctAttachments.contractId, contractId), isNull(ctAttachments.changeId)))
		.orderBy(asc(ctAttachments.createTime));

	const attachments = attachmentRows.map((item) => mapAttachmentRow(item, contractRow));

	const detail: ContractDraftDetailVO = {
		id: contractRow.id,
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
		description: contractRow.description || "",
		status: contractRow.status || "draft",
		attachments,
		createTime: contractRow.createTime ? formatDateTime(contractRow.createTime) : "",
		updateTime: contractRow.updateTime ? formatDateTime(contractRow.updateTime) : "",
		remark: contractRow.remark || undefined,
	};

	return createResponse(200, "查询成功", detail);
}

/** 将已完成上传会话物化为起草合同附件记录 */
async function materializeDraftAttachments(
	event: H3Event,
	args: {
		contractId: string;
		newUploadSessionIds: string[];
		attachmentMetas: DraftContractCreatePayload["attachmentMetas"];
	},
) {
	if (args.attachmentMetas.length === 0) {
		return;
	}

	validateAttachmentSessionIds(args.newUploadSessionIds, args.attachmentMetas);

	const db = useDb(event);
	const uploadSessions = await db
		.select()
		.from(ctUploadSessions)
		.where(inArray(ctUploadSessions.id, args.newUploadSessionIds));

	const sessionMap = new Map(uploadSessions.map((item) => [item.id, item]));

	for (const meta of args.attachmentMetas) {
		const session = sessionMap.get(meta.uploadSessionId);
		if (!session) {
			throw new Error(`上传会话不存在: ${meta.uploadSessionId}`);
		}

		if (session.bizType !== "draft_contract") {
			throw new Error(`上传会话业务类型不匹配: ${meta.uploadSessionId}`);
		}

		if (session.status !== "completed") {
			throw new Error(`上传会话尚未完成，不能创建附件: ${meta.uploadSessionId}`);
		}

		await db
			.update(ctUploadSessions)
			.set({ bizId: args.contractId } as any)
			.where(eq(ctUploadSessions.id, meta.uploadSessionId));

		const attachmentValues = {
			contractId: args.contractId,
			changeId: null,
			attachmentName: normalizeText(meta.attachmentName) || session.fileName,
			attachmentType: normalizeText(meta.attachmentType),
			filePath: session.r2ObjectKey,
			fileSize: session.fileSize,
			storageProvider: "r2",
			bucketName: session.r2Bucket,
			objectKey: session.r2ObjectKey,
			fileUrl: session.publicUrl,
			mimeType: session.mimeType,
			fileHash: null,
			objectEtag: session.objectEtag,
			uploadSessionId: session.id,
			uploadStatus: "ready",
			remark: "draft contract attachment",
		} as NewCtAttachment;
		await db.insert(ctAttachments).values(attachmentValues as any);
	}
}

/**
 * 同步起草合同附件差量。
 * @description
 * 根据保留、删除、新增三组附件输入，
 * 将附件表状态收敛到前端当前编辑结果。
 */
async function syncDraftAttachmentDelta(
	event: H3Event,
	args: {
		contractId: string;
		retainAttachmentIds: string[];
		deleteAttachmentIds: string[];
		newUploadSessionIds: string[];
		attachmentMetas: DraftContractCreatePayload["attachmentMetas"];
	},
) {
	const db = useDb(event);
	const currentAttachments = await db
		.select({ id: ctAttachments.id })
		.from(ctAttachments)
		.where(and(eq(ctAttachments.contractId, args.contractId), isNull(ctAttachments.changeId)));

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
			.where(and(eq(ctAttachments.contractId, args.contractId), inArray(ctAttachments.id, deleteIds)));
	}

	await materializeDraftAttachments(event, {
		contractId: args.contractId,
		newUploadSessionIds: args.newUploadSessionIds,
		attachmentMetas: args.attachmentMetas,
	});
}

/** 创建起草合同记录及其附件物化结果 */
export async function createDraftContractRecord(
	event: H3Event,
	payload: DraftContractCreatePayload,
): Promise<JsonVO<ContractDraftDetailVO>> {
	try {
		const db = useDb(event);
		const [existingContract] = await db
			.select({ id: ctContracts.id })
			.from(ctContracts)
			.where(and(eq(ctContracts.contractNumber, payload.contractNumber), isNull(ctContracts.deletedAt)))
			.limit(1);

		if (existingContract) {
			return createResponse(409, "合同编号已存在", null);
		}

		const [contractRow] = await db.insert(ctContracts).values(buildContractValues(payload)).returning();

		await materializeDraftAttachments(event, {
			contractId: contractRow.id,
			newUploadSessionIds: payload.newUploadSessionIds,
			attachmentMetas: payload.attachmentMetas,
		});

		return await loadDraftContractDetail(event, contractRow.id);
	} catch (error: any) {
		return createResponse(500, "创建失败", null, {
			success: false,
			error: error?.message || String(error),
			stack: error?.stack,
		});
	}
}

/** 更新起草合同记录并同步附件差量 */
export async function updateDraftContractRecord(
	event: H3Event,
	payload: DraftContractUpdatePayload,
): Promise<JsonVO<ContractDraftDetailVO>> {
	try {
		const db = useDb(event);
		const [existingContract] = await db
			.select({ id: ctContracts.id })
			.from(ctContracts)
			.where(and(eq(ctContracts.id, payload.id), isNull(ctContracts.deletedAt)))
			.limit(1);

		if (!existingContract) {
			return createResponse(404, "记录不存在", null);
		}

		const [duplicatedContract] = await db
			.select({ id: ctContracts.id })
			.from(ctContracts)
			.where(and(eq(ctContracts.contractNumber, payload.contractNumber), isNull(ctContracts.deletedAt)))
			.limit(1);

		if (duplicatedContract && duplicatedContract.id !== payload.id) {
			return createResponse(409, "合同编号已存在", null);
		}

		await db.update(ctContracts).set(buildContractValues(payload)).where(eq(ctContracts.id, payload.id));

		await syncDraftAttachmentDelta(event, {
			contractId: payload.id,
			retainAttachmentIds: payload.retainAttachmentIds,
			deleteAttachmentIds: payload.deleteAttachmentIds,
			newUploadSessionIds: payload.newUploadSessionIds,
			attachmentMetas: payload.attachmentMetas,
		});

		return await loadDraftContractDetail(event, payload.id);
	} catch (error: any) {
		return createResponse(500, "更新失败", null, {
			success: false,
			error: error?.message || String(error),
			stack: error?.stack,
		});
	}
}

/** 删除起草合同记录 */
export async function deleteDraftContractRecord(
	event: H3Event,
	payload: DraftContractDeletePayload,
): Promise<JsonVO<null>> {
	try {
		const db = useDb(event);
		const existingContracts = await db
			.select({ id: ctContracts.id })
			.from(ctContracts)
			.where(and(inArray(ctContracts.id, payload.ids), isNull(ctContracts.deletedAt)));

		if (existingContracts.length === 0) {
			return createResponse(404, "记录不存在", null);
		}

		await db.delete(ctContracts).where(inArray(ctContracts.id, payload.ids));

		return createResponse(200, "删除成功", null);
	} catch (error: any) {
		return createResponse(500, "删除失败", null, {
			success: false,
			error: error?.message || String(error),
			stack: error?.stack,
		});
	}
}

/** 获取单条起草合同详情 */
export async function getDraftContractDetailRecord(
	event: H3Event,
	payload: z.infer<typeof draftContractDetailBodySchema>,
): Promise<JsonVO<ContractDraftDetailVO>> {
	try {
		return await loadDraftContractDetail(event, payload.id);
	} catch (error: any) {
		return createResponse(500, "查询失败", null, {
			success: false,
			error: error?.message || String(error),
			stack: error?.stack,
		});
	}
}

export {
	createDraftContractSchema as draftContractCreateBodySchema,
	updateDraftContractSchema as draftContractUpdateBodySchema,
};
