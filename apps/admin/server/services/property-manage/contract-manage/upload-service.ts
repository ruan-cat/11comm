import {
	AbortMultipartUploadCommand,
	CompleteMultipartUploadCommand,
	CreateMultipartUploadCommand,
	ListPartsCommand,
	UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, asc, desc, eq, notInArray } from "drizzle-orm";
import {
	createUploadAbortSchema,
	createUploadCompleteSchema,
	createUploadInitSchema,
	createUploadSignPartSchema,
	createUploadStatusSchema,
	ctUploadSessionParts,
	ctUploadSessions,
	type CtUploadSession,
	type CtUploadSessionPart,
	type JsonVO,
	type NewCtUploadSession,
	type NewCtUploadSessionPart,
} from "@01s-11comm/type";
import type { DbType } from "server/db";
import { createR2Client } from "server/utils/r2-client";
import { getR2EnvRequired } from "server/utils/r2-env";

/**
 * @file 合同附件断点续传服务
 * @description
 * 负责起草合同与合同变更两类业务的 multipart 上传控制面：
 * 创建上传会话、查询进度、分片签名、完成上传与取消上传。
 */

export type UploadBizType = "draft_contract" | "change";
export type UploadSessionStatus = "initiated" | "uploading" | "paused" | "completed" | "aborted" | "expired";

export interface UploadPartState {
	partNumber: number;
	etag: string;
	partSize: number;
}

export interface UploadSessionRecord {
	id: string;
	bizType: UploadBizType;
	bizId: string | null;
	fileName: string;
	mimeType: string | null;
	fileSize: number;
	chunkSize: number;
	totalParts: number;
	resumeFingerprint: string;
	r2Bucket: string;
	r2ObjectKey: string;
	r2UploadId: string;
	status: UploadSessionStatus;
	uploadedPartsCount: number;
	objectEtag: string | null;
	publicUrl: string | null;
	completedAt: string | null;
	expiresAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface UploadRepository {
	findReusableSession(input: {
		bizType: UploadBizType;
		fileName: string;
		fileSize: number;
		chunkSize: number;
		resumeFingerprint: string;
	}): Promise<UploadSessionRecord | undefined>;
	getSession(sessionId: string): Promise<UploadSessionRecord | undefined>;
	createSession(session: UploadSessionRecord): Promise<UploadSessionRecord>;
	updateSession(sessionId: string, patch: Partial<UploadSessionRecord>): Promise<UploadSessionRecord | undefined>;
	listUploadedParts(sessionId: string): Promise<UploadPartState[]>;
	replaceUploadedParts(sessionId: string, nextParts: UploadPartState[]): Promise<UploadPartState[]>;
}

export interface UploadGateway {
	createMultipartUpload(session: UploadSessionRecord): Promise<{ uploadId: string }>;
	listUploadedParts(session: UploadSessionRecord): Promise<{ uploadedParts: UploadPartState[] }>;
	signPart(session: UploadSessionRecord, partNumber: number): Promise<{ signedUrl: string; expiresIn: number }>;
	completeMultipartUpload(
		session: UploadSessionRecord,
		parts: UploadPartState[],
	): Promise<{ objectEtag: string | null }>;
	abortMultipartUpload(session: UploadSessionRecord): Promise<void>;
}

export interface UploadInitInput {
	bizType: UploadBizType;
	fileName: string;
	mimeType?: string | null;
	fileSize: number;
	chunkSize: number;
	resumeFingerprint: string;
	bizId?: string | null;
}

export interface UploadStatusInput {
	sessionId: string;
}

export interface UploadSignPartInput {
	sessionId: string;
	partNumber: number;
}

export interface UploadCompleteInput {
	sessionId: string;
	parts: Array<{
		partNumber: number;
		etag: string;
	}>;
	attachmentName: string;
	attachmentType: string;
}

export interface UploadAbortInput {
	sessionId: string;
}

export interface UploadInitVO {
	sessionId: string;
	bizType: UploadBizType;
	fileName: string;
	mimeType: string | null;
	fileSize: number;
	chunkSize: number;
	totalParts: number;
	objectKey: string;
	status: UploadSessionStatus;
	resumeFingerprint: string;
	uploadedPartsCount: number;
	expiresAt: string | null;
}

export interface UploadStatusVO {
	sessionId: string;
	status: UploadSessionStatus;
	totalParts: number;
	uploadedParts: UploadPartState[];
	missingPartNumbers: number[];
	objectKey: string;
	publicUrl: string | null;
	uploadedPartsCount: number;
}

export interface UploadSignPartVO {
	sessionId: string;
	partNumber: number;
	signedUrl: string;
	expiresIn: number;
	objectKey: string;
}

export interface UploadCompleteVO {
	sessionId: string;
	status: UploadSessionStatus;
	objectKey: string;
	objectEtag: string | null;
	publicUrl: string | null;
	attachmentName: string;
	attachmentType: string;
}

export interface UploadAbortVO {
	sessionId: string;
	status: UploadSessionStatus;
	objectKey: string;
}

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

/** 生成当前 ISO 时间戳 */
function nowIso(): string {
	return new Date().toISOString();
}

/** 将可选时间字符串转换为 Date 或 null */
function toDateOrNull(value: string | null | undefined): Date | null {
	return value ? new Date(value) : null;
}

/** 规整上传文件名，避免对象键中出现不稳定字符 */
function sanitizeFileName(fileName: string): string {
	return (
		fileName
			.trim()
			.replace(/[^\w.\-]+/g, "_")
			.replace(/^_+|_+$/g, "") || "upload.bin"
	);
}

/** 提取文件扩展名 */
function getExtension(fileName: string): string {
	const dotIndex = fileName.lastIndexOf(".");
	if (dotIndex <= 0 || dotIndex === fileName.length - 1) {
		return "";
	}

	return fileName.slice(dotIndex);
}

/** 提取不带扩展名的文件基名 */
function getBaseName(fileName: string): string {
	const extension = getExtension(fileName);
	if (!extension) {
		return fileName;
	}

	return fileName.slice(0, fileName.length - extension.length);
}

/** 生成最终对外访问的附件 URL */
function buildPublicUrl(bucketName: string, objectKey: string): string {
	const baseUrl = getR2EnvRequired("R2_PUBLIC_BASE_URL").replace(/\/+$/, "");
	return `${baseUrl || `https://${bucketName}.ruan-cat.com`}/${objectKey}`;
}

/** 将数据库上传会话记录映射为服务层实体 */
function mapSessionRow(row: CtUploadSession): UploadSessionRecord {
	return {
		id: row.id,
		bizType: row.bizType as UploadBizType,
		bizId: row.bizId ?? null,
		fileName: row.fileName,
		mimeType: row.mimeType ?? null,
		fileSize: row.fileSize,
		chunkSize: row.chunkSize,
		totalParts: row.totalParts,
		resumeFingerprint: row.resumeFingerprint,
		r2Bucket: row.r2Bucket,
		r2ObjectKey: row.r2ObjectKey,
		r2UploadId: row.r2UploadId,
		status: row.status as UploadSessionStatus,
		uploadedPartsCount: row.uploadedPartsCount ?? 0,
		objectEtag: row.objectEtag ?? null,
		publicUrl: row.publicUrl ?? null,
		completedAt: row.completedAt?.toISOString() ?? null,
		expiresAt: row.expiresAt?.toISOString() ?? null,
		createdAt: row.createTime.toISOString(),
		updatedAt: row.updateTime.toISOString(),
	};
}

/** 将数据库分片记录映射为服务层分片状态 */
function mapPartRow(row: CtUploadSessionPart): UploadPartState {
	return {
		partNumber: row.partNumber,
		etag: row.etag,
		partSize: row.partSize,
	};
}

/** 构造上传会话的数据库插入值 */
function buildSessionInsertValues(session: UploadSessionRecord): any {
	return {
		id: session.id,
		bizType: session.bizType,
		bizId: session.bizId ?? null,
		fileName: session.fileName,
		mimeType: session.mimeType || "application/octet-stream",
		fileSize: session.fileSize,
		chunkSize: session.chunkSize,
		totalParts: session.totalParts,
		resumeFingerprint: session.resumeFingerprint,
		r2Bucket: session.r2Bucket,
		r2ObjectKey: session.r2ObjectKey,
		r2UploadId: session.r2UploadId,
		status: session.status,
		uploadedPartsCount: session.uploadedPartsCount,
		objectEtag: session.objectEtag ?? null,
		publicUrl: session.publicUrl ?? null,
		completedAt: toDateOrNull(session.completedAt),
		expiresAt: toDateOrNull(session.expiresAt) ?? new Date(),
		createTime: toDateOrNull(session.createdAt) ?? new Date(),
		updateTime: toDateOrNull(session.updatedAt) ?? new Date(),
	};
}

/** 构造上传会话的数据库更新补丁 */
function buildSessionPatchValues(patch: Partial<UploadSessionRecord>): Record<string, unknown> {
	const values: Record<string, unknown> = {};

	if (patch.bizId !== undefined) values.bizId = patch.bizId;
	if (patch.fileName !== undefined) values.fileName = patch.fileName;
	if (patch.mimeType !== undefined) values.mimeType = patch.mimeType || "application/octet-stream";
	if (patch.fileSize !== undefined) values.fileSize = patch.fileSize;
	if (patch.chunkSize !== undefined) values.chunkSize = patch.chunkSize;
	if (patch.totalParts !== undefined) values.totalParts = patch.totalParts;
	if (patch.resumeFingerprint !== undefined) values.resumeFingerprint = patch.resumeFingerprint;
	if (patch.r2Bucket !== undefined) values.r2Bucket = patch.r2Bucket;
	if (patch.r2ObjectKey !== undefined) values.r2ObjectKey = patch.r2ObjectKey;
	if (patch.r2UploadId !== undefined) values.r2UploadId = patch.r2UploadId;
	if (patch.status !== undefined) values.status = patch.status;
	if (patch.uploadedPartsCount !== undefined) values.uploadedPartsCount = patch.uploadedPartsCount;
	if (patch.objectEtag !== undefined) values.objectEtag = patch.objectEtag ?? null;
	if (patch.publicUrl !== undefined) values.publicUrl = patch.publicUrl ?? null;
	if (patch.completedAt !== undefined) values.completedAt = toDateOrNull(patch.completedAt);
	if (patch.expiresAt !== undefined) values.expiresAt = toDateOrNull(patch.expiresAt);
	values.updateTime = toDateOrNull(patch.updatedAt) ?? new Date();

	return values;
}

/** 将分片状态批量映射为数据库插入值 */
function buildPartInsertValues(sessionId: string, parts: UploadPartState[]): NewCtUploadSessionPart[] {
	return parts.map((part) => ({
		sessionId,
		partNumber: part.partNumber,
		etag: part.etag,
		partSize: part.partSize,
		uploadedAt: new Date(),
	}));
}

/**
 * 生成上传对象键。
 * @description
 * 对象键按业务类型、会话 ID 和时间戳分层，避免同名文件覆盖，
 * 同时便于后续在 R2 中按业务目录定位对象。
 */
export function buildUploadObjectKey(bizType: UploadBizType, sessionId: string, fileName: string): string {
	const normalizedFileName = sanitizeFileName(fileName);
	const extension = getExtension(normalizedFileName);
	const baseName = sanitizeFileName(getBaseName(normalizedFileName)) || "file";
	const stamp = new Date().toISOString().replace(/[-:TZ.]/g, "");

	return `contract-manage/${bizType}/${sessionId}/${stamp}-${baseName}${extension}`;
}

/** 根据当前已上传分片计算缺失的分片编号 */
export function buildMissingPartNumbers(totalParts: number, uploadedParts: UploadPartState[]): number[] {
	const uploadedPartNumbers = new Set(uploadedParts.map((part) => part.partNumber));
	const missing: number[] = [];

	for (let partNumber = 1; partNumber <= totalParts; partNumber += 1) {
		if (!uploadedPartNumbers.has(partNumber)) {
			missing.push(partNumber);
		}
	}

	return missing;
}

/**
 * 创建内存版上传仓储。
 * @description
 * 供测试或无数据库环境回退使用，行为尽量与数据库仓储保持一致。
 */
export function createInMemoryUploadRepository(): UploadRepository {
	const sessions = new Map<string, UploadSessionRecord>();
	const parts = new Map<string, UploadPartState[]>();

	return {
		async findReusableSession(input) {
			for (const session of sessions.values()) {
				if (
					session.bizType === input.bizType &&
					session.fileName === input.fileName &&
					session.fileSize === input.fileSize &&
					session.chunkSize === input.chunkSize &&
					session.resumeFingerprint === input.resumeFingerprint &&
					session.status !== "completed" &&
					session.status !== "aborted" &&
					session.status !== "expired"
				) {
					return { ...session };
				}
			}

			return undefined;
		},
		async getSession(sessionId) {
			const session = sessions.get(sessionId);
			return session ? { ...session } : undefined;
		},
		async createSession(session) {
			sessions.set(session.id, { ...session });
			return { ...session };
		},
		async updateSession(sessionId, patch) {
			const current = sessions.get(sessionId);
			if (!current) {
				return undefined;
			}

			const next = {
				...current,
				...patch,
			};
			sessions.set(sessionId, next);
			return { ...next };
		},
		async listUploadedParts(sessionId) {
			return (parts.get(sessionId) || []).map((part) => ({ ...part }));
		},
		async replaceUploadedParts(sessionId, nextParts) {
			const sortedParts = nextParts
				.map((part) => ({ ...part }))
				.sort((left, right) => left.partNumber - right.partNumber);
			parts.set(sessionId, sortedParts);
			return sortedParts.map((part) => ({ ...part }));
		},
	};
}

/**
 * 创建基于 Drizzle 的上传仓储。
 * @description
 * 负责上传会话与分片状态在 `ct_upload_sessions`、`ct_upload_session_parts`
 * 两张表中的持久化读写。
 */
export function createDbUploadRepository(db: DbType): UploadRepository {
	return {
		async findReusableSession(input) {
			const [row] = await db
				.select()
				.from(ctUploadSessions)
				.where(
					and(
						eq(ctUploadSessions.bizType, input.bizType),
						eq(ctUploadSessions.fileName, input.fileName),
						eq(ctUploadSessions.fileSize, input.fileSize),
						eq(ctUploadSessions.chunkSize, input.chunkSize),
						eq(ctUploadSessions.resumeFingerprint, input.resumeFingerprint),
						notInArray(ctUploadSessions.status, ["completed", "aborted", "expired"]),
					),
				)
				.orderBy(desc(ctUploadSessions.createTime))
				.limit(1);

			return row ? mapSessionRow(row) : undefined;
		},
		async getSession(sessionId) {
			const [row] = await db.select().from(ctUploadSessions).where(eq(ctUploadSessions.id, sessionId)).limit(1);
			return row ? mapSessionRow(row) : undefined;
		},
		async createSession(session) {
			const [row] = await db.insert(ctUploadSessions).values(buildSessionInsertValues(session)).returning();
			return mapSessionRow(row);
		},
		async updateSession(sessionId, patch) {
			const [row] = await db
				.update(ctUploadSessions)
				.set(buildSessionPatchValues(patch))
				.where(eq(ctUploadSessions.id, sessionId))
				.returning();

			return row ? mapSessionRow(row) : undefined;
		},
		async listUploadedParts(sessionId) {
			const rows = await db
				.select()
				.from(ctUploadSessionParts)
				.where(eq(ctUploadSessionParts.sessionId, sessionId))
				.orderBy(asc(ctUploadSessionParts.partNumber));

			return rows.map(mapPartRow);
		},
		async replaceUploadedParts(sessionId, nextParts) {
			const sortedParts = nextParts
				.map((part) => ({ ...part }))
				.sort((left, right) => left.partNumber - right.partNumber);

			// neon-http does not support transactions. Replace the remote part snapshot
			// with sequential statements so status polling works in Nitro local/Vercel.
			await db.delete(ctUploadSessionParts).where(eq(ctUploadSessionParts.sessionId, sessionId));

			if (sortedParts.length > 0) {
				await db.insert(ctUploadSessionParts).values(buildPartInsertValues(sessionId, sortedParts));
			}

			return sortedParts;
		},
	};
}

/**
 * 创建默认上传网关。
 * @description
 * 封装 Cloudflare R2 multipart upload 所需的 SDK 调用，
 * 统一提供创建、列举、签名、完成和取消五类网关能力。
 */
function createDefaultGateway(): UploadGateway {
	const client = createR2Client();
	const bucketName = getR2EnvRequired("R2_BUCKET");

	return {
		async createMultipartUpload(session) {
			const result = await client.send(
				new CreateMultipartUploadCommand({
					Bucket: bucketName,
					Key: session.r2ObjectKey,
					ContentType: session.mimeType || undefined,
				}),
			);

			if (!result.UploadId) {
				throw new Error("R2 multipart upload did not return an upload id");
			}

			return { uploadId: result.UploadId };
		},
		async listUploadedParts(session) {
			const result = await client.send(
				new ListPartsCommand({
					Bucket: bucketName,
					Key: session.r2ObjectKey,
					UploadId: session.r2UploadId,
				}),
			);

			const uploadedParts =
				result.Parts?.map((part) => ({
					partNumber: Number(part.PartNumber || 0),
					etag: String(part.ETag || ""),
					partSize: Number(part.Size || 0),
				})).filter((part) => part.partNumber > 0 && part.etag) || [];

			return { uploadedParts };
		},
		async signPart(session, partNumber) {
			const signedUrl = await getSignedUrl(
				client,
				new UploadPartCommand({
					Bucket: bucketName,
					Key: session.r2ObjectKey,
					UploadId: session.r2UploadId,
					PartNumber: partNumber,
				}),
				{ expiresIn: 15 * 60 },
			);

			return {
				signedUrl,
				expiresIn: 15 * 60,
			};
		},
		async completeMultipartUpload(session, parts) {
			const result = await client.send(
				new CompleteMultipartUploadCommand({
					Bucket: bucketName,
					Key: session.r2ObjectKey,
					UploadId: session.r2UploadId,
					MultipartUpload: {
						Parts: parts.map((part) => ({
							PartNumber: part.partNumber,
							ETag: part.etag,
						})),
					},
				}),
			);

			return {
				objectEtag: result.ETag ? String(result.ETag) : null,
			};
		},
		async abortMultipartUpload(session) {
			await client.send(
				new AbortMultipartUploadCommand({
					Bucket: bucketName,
					Key: session.r2ObjectKey,
					UploadId: session.r2UploadId,
				}),
			);
		},
	};
}

/** 将异常统一转换为上传接口失败响应 */
function createFailureResponse<T>(defaultMessage: string, error: any): JsonVO<T> {
	const isValidationError = error?.name === "ZodError";
	const code = isValidationError ? 400 : 500;

	return createResponse(code, defaultMessage, null, {
		success: false,
		error: error?.message || String(error),
		stack: error?.stack,
	});
}

/**
 * 创建合同上传服务。
 * @description
 * 通过可注入的 repository / gateway 把业务流程与底层存储实现解耦，
 * 既可走数据库 + R2，也可走内存回退用于测试与本地验证。
 */
export function createContractUploadService(
	options: {
		repository?: UploadRepository;
		gateway?: UploadGateway;
		sessionIdFactory?: () => string;
		now?: () => string;
	} = {},
) {
	const repository = options.repository || createInMemoryUploadRepository();
	let gateway = options.gateway;
	const sessionIdFactory = options.sessionIdFactory || crypto.randomUUID.bind(crypto);
	const now = options.now || nowIso;

	function getGateway(): UploadGateway {
		if (!gateway) {
			gateway = createDefaultGateway();
		}

		return gateway;
	}

	function buildExpiresAt(currentTime: string): string {
		return new Date(new Date(currentTime).getTime() + 24 * 60 * 60 * 1000).toISOString();
	}

	async function createSession(input: UploadInitInput): Promise<UploadSessionRecord> {
		const parsed = createUploadInitSchema.parse(input);
		const totalParts = Math.max(1, Math.ceil(parsed.fileSize / parsed.chunkSize));
		const reusableSession = await repository.findReusableSession({
			bizType: parsed.bizType,
			fileName: parsed.fileName,
			fileSize: parsed.fileSize,
			chunkSize: parsed.chunkSize,
			resumeFingerprint: parsed.resumeFingerprint,
		});

		if (reusableSession) {
			return reusableSession;
		}

		const currentTime = now();
		const sessionId = sessionIdFactory();
		const session: UploadSessionRecord = {
			id: sessionId,
			bizType: parsed.bizType,
			bizId: parsed.bizId ?? null,
			fileName: parsed.fileName,
			mimeType: parsed.mimeType ?? null,
			fileSize: parsed.fileSize,
			chunkSize: parsed.chunkSize,
			totalParts,
			resumeFingerprint: parsed.resumeFingerprint,
			r2Bucket: getR2EnvRequired("R2_BUCKET"),
			r2ObjectKey: buildUploadObjectKey(parsed.bizType, sessionId, parsed.fileName),
			r2UploadId: "",
			status: "initiated",
			uploadedPartsCount: 0,
			objectEtag: null,
			publicUrl: null,
			completedAt: null,
			expiresAt: buildExpiresAt(currentTime),
			createdAt: currentTime,
			updatedAt: currentTime,
		};

		const result = await getGateway().createMultipartUpload(session);
		session.r2UploadId = result.uploadId;

		return repository.createSession(session);
	}

	return {
		async initUpload(input: UploadInitInput): Promise<JsonVO<UploadInitVO>> {
			try {
				const session = await createSession(input);
				const response: JsonVO<UploadInitVO> = createResponse(200, "初始化成功", {
					sessionId: session.id,
					bizType: session.bizType,
					fileName: session.fileName,
					mimeType: session.mimeType,
					fileSize: session.fileSize,
					chunkSize: session.chunkSize,
					totalParts: session.totalParts,
					objectKey: session.r2ObjectKey,
					status: session.status,
					resumeFingerprint: session.resumeFingerprint,
					uploadedPartsCount: session.uploadedPartsCount,
					expiresAt: session.expiresAt,
				});

				return response;
			} catch (error: any) {
				return createFailureResponse("初始化失败", error);
			}
		},
		async getStatus(input: UploadStatusInput): Promise<JsonVO<UploadStatusVO>> {
			try {
				const parsed = createUploadStatusSchema.parse(input);
				const session = await repository.getSession(parsed.sessionId);

				if (!session) {
					return createResponse(404, "上传会话不存在", null, { success: false });
				}

				const { uploadedParts } = await getGateway().listUploadedParts(session);
				const normalizedUploadedParts = uploadedParts
					.map((part) => ({ ...part }))
					.sort((left, right) => left.partNumber - right.partNumber);
				await repository.replaceUploadedParts(session.id, normalizedUploadedParts);

				const missingPartNumbers = buildMissingPartNumbers(session.totalParts, normalizedUploadedParts);
				const nextStatus =
					session.status === "completed" || session.status === "aborted" || session.status === "expired"
						? session.status
						: normalizedUploadedParts.length > 0
							? "uploading"
							: session.status;
				const nextSession = await repository.updateSession(session.id, {
					status: nextStatus,
					uploadedPartsCount: normalizedUploadedParts.length,
					updatedAt: now(),
				});
				const response: JsonVO<UploadStatusVO> = createResponse(200, "查询成功", {
					sessionId: session.id,
					status: nextSession?.status || session.status,
					totalParts: session.totalParts,
					uploadedParts: normalizedUploadedParts,
					missingPartNumbers,
					objectKey: session.r2ObjectKey,
					publicUrl: nextSession?.publicUrl ?? session.publicUrl,
					uploadedPartsCount: normalizedUploadedParts.length,
				});

				return response;
			} catch (error: any) {
				return createFailureResponse("查询失败", error);
			}
		},
		async signPart(input: UploadSignPartInput): Promise<JsonVO<UploadSignPartVO>> {
			try {
				const parsed = createUploadSignPartSchema.parse(input);
				const session = await repository.getSession(parsed.sessionId);

				if (!session) {
					return createResponse(404, "上传会话不存在", null, { success: false });
				}

				if (session.status === "completed" || session.status === "aborted" || session.status === "expired") {
					return createResponse(409, "上传会话不可签名", null, { success: false });
				}

				if (parsed.partNumber > session.totalParts) {
					return createResponse(400, "分片编号超出范围", null, { success: false });
				}

				const result = await getGateway().signPart(session, parsed.partNumber);
				await repository.updateSession(session.id, {
					status: session.status === "initiated" || session.status === "paused" ? "uploading" : session.status,
					updatedAt: now(),
				});

				const response: JsonVO<UploadSignPartVO> = createResponse(200, "签名成功", {
					sessionId: session.id,
					partNumber: parsed.partNumber,
					signedUrl: result.signedUrl,
					expiresIn: result.expiresIn,
					objectKey: session.r2ObjectKey,
				});

				return response;
			} catch (error: any) {
				return createFailureResponse("签名失败", error);
			}
		},
		async completeUpload(input: UploadCompleteInput): Promise<JsonVO<UploadCompleteVO>> {
			try {
				const parsed = createUploadCompleteSchema.parse(input);
				const session = await repository.getSession(parsed.sessionId);

				if (!session) {
					return createResponse(404, "上传会话不存在", null, { success: false });
				}

				if (session.status === "aborted") {
					return createResponse(409, "上传会话已终止", null, { success: false });
				}

				if (session.status === "completed") {
					const response: JsonVO<UploadCompleteVO> = createResponse(200, "完成成功", {
						sessionId: session.id,
						status: session.status,
						objectKey: session.r2ObjectKey,
						objectEtag: session.objectEtag,
						publicUrl: session.publicUrl,
						attachmentName: parsed.attachmentName,
						attachmentType: parsed.attachmentType,
					});

					return response;
				}

				const { uploadedParts } = await getGateway().listUploadedParts(session);
				const normalizedUploadedParts = uploadedParts
					.map((part) => ({ ...part }))
					.sort((left, right) => left.partNumber - right.partNumber);
				await repository.replaceUploadedParts(session.id, normalizedUploadedParts);

				const uploadedPartMap = new Map(normalizedUploadedParts.map((part) => [part.partNumber, part]));
				const missingPartNumbers = buildMissingPartNumbers(session.totalParts, normalizedUploadedParts);

				if (missingPartNumbers.length > 0) {
					return createResponse(409, "仍有分片未上传完成", null, {
						success: false,
						error: `Missing parts: ${missingPartNumbers.join(",")}`,
					});
				}

				const normalizedParts = parsed.parts
					.map((part) => ({
						partNumber: part.partNumber,
						etag: part.etag,
						partSize: uploadedPartMap.get(part.partNumber)?.partSize || 0,
					}))
					.sort((left, right) => left.partNumber - right.partNumber);

				const completion = await getGateway().completeMultipartUpload(session, normalizedParts);
				const currentTime = now();
				const publicUrl = buildPublicUrl(session.r2Bucket, session.r2ObjectKey);
				const nextSession = await repository.updateSession(session.id, {
					status: "completed",
					objectEtag: completion.objectEtag,
					publicUrl,
					completedAt: currentTime,
					uploadedPartsCount: normalizedParts.length,
					updatedAt: currentTime,
				});
				const response: JsonVO<UploadCompleteVO> = createResponse(200, "完成成功", {
					sessionId: session.id,
					status: nextSession?.status || "completed",
					objectKey: session.r2ObjectKey,
					objectEtag: completion.objectEtag,
					publicUrl,
					attachmentName: parsed.attachmentName,
					attachmentType: parsed.attachmentType,
				});

				return response;
			} catch (error: any) {
				return createFailureResponse("完成失败", error);
			}
		},
		async abortUpload(input: UploadAbortInput): Promise<JsonVO<UploadAbortVO>> {
			try {
				const parsed = createUploadAbortSchema.parse(input);
				const session = await repository.getSession(parsed.sessionId);

				if (!session) {
					return createResponse(404, "上传会话不存在", null, { success: false });
				}

				if (session.status !== "completed" && session.status !== "aborted") {
					await getGateway().abortMultipartUpload(session);
					await repository.updateSession(session.id, {
						status: "aborted",
						updatedAt: now(),
					});
				}

				const nextSession = await repository.getSession(session.id);
				const response: JsonVO<UploadAbortVO> = createResponse(200, "取消成功", {
					sessionId: session.id,
					status: nextSession?.status || "aborted",
					objectKey: session.r2ObjectKey,
				});

				return response;
			} catch (error: any) {
				return createFailureResponse("取消失败", error);
			}
		},
	};
}
