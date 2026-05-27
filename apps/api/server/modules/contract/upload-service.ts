import {
	AbortMultipartUploadCommand,
	CompleteMultipartUploadCommand,
	CreateMultipartUploadCommand,
	DeleteObjectCommand,
	ListPartsCommand,
	UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, asc, desc, eq, notInArray } from "drizzle-orm";
import type { H3Event } from "nitro/h3";
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
	type NewCtUploadSessionPart,
} from "@01s-11comm/type";
import type { DbType } from "../../db";
import { createR2Client } from "../../shared/runtime/r2-client";
import { getR2EnvRequired } from "../../shared/runtime/r2-env";

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
	deleteObject(session: UploadSessionRecord): Promise<void>;
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

function createResponse<T>(code: number, message: string, data: T | null, extra: Partial<JsonVO<T>> = {}): JsonVO<T> {
	return {
		success: code >= 200 && code < 300,
		code,
		message,
		data: data as T,
		...extra,
	};
}

function nowIso(): string {
	return new Date().toISOString();
}

function toDateOrNull(value: string | null | undefined): Date | null {
	return value ? new Date(value) : null;
}

function sanitizeFileName(fileName: string): string {
	return (
		fileName
			.trim()
			.replace(/[^\w.\-]+/g, "_")
			.replace(/^_+|_+$/g, "") || "upload.bin"
	);
}

function getExtension(fileName: string): string {
	const dotIndex = fileName.lastIndexOf(".");
	if (dotIndex <= 0 || dotIndex === fileName.length - 1) {
		return "";
	}
	return fileName.slice(dotIndex);
}

function getBaseName(fileName: string): string {
	const extension = getExtension(fileName);
	return extension ? fileName.slice(0, fileName.length - extension.length) : fileName;
}

function buildPublicUrl(bucketName: string, objectKey: string, event?: H3Event | Record<string, any>): string {
	const baseUrl = getR2EnvRequired("R2_PUBLIC_BASE_URL", event).replace(/\/+$/, "");
	return `${baseUrl || `https://${bucketName}.ruan-cat.com`}/${objectKey}`;
}

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

function mapPartRow(row: CtUploadSessionPart): UploadPartState {
	return {
		partNumber: row.partNumber,
		etag: row.etag,
		partSize: row.partSize,
	};
}

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

function buildPartInsertValues(sessionId: string, parts: UploadPartState[]): NewCtUploadSessionPart[] {
	return parts.map((part) => ({
		sessionId,
		partNumber: part.partNumber,
		etag: part.etag,
		partSize: part.partSize,
		uploadedAt: new Date(),
	}));
}

export function buildUploadObjectKey(bizType: UploadBizType, sessionId: string, fileName: string): string {
	const normalizedFileName = sanitizeFileName(fileName);
	const extension = getExtension(normalizedFileName);
	const baseName = sanitizeFileName(getBaseName(normalizedFileName)) || "file";
	const stamp = new Date().toISOString().replace(/[-:TZ.]/g, "");
	return `contract-manage/${bizType}/${sessionId}/${stamp}-${baseName}${extension}`;
}

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
			if (!current) return undefined;
			const next = { ...current, ...patch };
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
			await db.delete(ctUploadSessionParts).where(eq(ctUploadSessionParts.sessionId, sessionId));
			if (sortedParts.length > 0) {
				await db.insert(ctUploadSessionParts).values(buildPartInsertValues(sessionId, sortedParts));
			}
			return sortedParts;
		},
	};
}

function createDefaultGateway(event?: H3Event | Record<string, any>): UploadGateway {
	const client = createR2Client(event);
	const bucketName = getR2EnvRequired("R2_BUCKET", event);

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
			return { signedUrl, expiresIn: 15 * 60 };
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
			return { objectEtag: result.ETag ? String(result.ETag) : null };
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
		async deleteObject(session) {
			await client.send(
				new DeleteObjectCommand({
					Bucket: bucketName,
					Key: session.r2ObjectKey,
				}),
			);
		},
	};
}

function createFailureResponse<T>(defaultMessage: string, error: any): JsonVO<T | null> {
	const isValidationError = error?.name === "ZodError";
	const statusCode = Number(error?.statusCode || error?.status || 0);
	const code = isValidationError ? 400 : statusCode >= 400 ? statusCode : 500;
	return createResponse<T | null>(code, defaultMessage, null, {
		success: false,
		error: error?.message || String(error),
	});
}

export function createUnavailableContractUploadService(reason: string) {
	function unavailableResponse<T>(): JsonVO<T | null> {
		return createResponse<T | null>(503, "upload persistence unavailable", null, {
			success: false,
			error: reason,
		});
	}

	return {
		async initUpload(): Promise<JsonVO<UploadInitVO | null>> {
			return unavailableResponse();
		},
		async getStatus(): Promise<JsonVO<UploadStatusVO | null>> {
			return unavailableResponse();
		},
		async signPart(): Promise<JsonVO<UploadSignPartVO | null>> {
			return unavailableResponse();
		},
		async completeUpload(): Promise<JsonVO<UploadCompleteVO | null>> {
			return unavailableResponse();
		},
		async abortUpload(): Promise<JsonVO<UploadAbortVO | null>> {
			return unavailableResponse();
		},
	};
}

function isTerminalStatus(status: UploadSessionStatus): boolean {
	return status === "completed" || status === "aborted" || status === "expired";
}

type CompletePartsValidationResult = { ok: true; parts: UploadCompleteInput["parts"] } | { ok: false; error: string };

function assertCompletePartsMatch(
	totalParts: number,
	uploadedParts: UploadPartState[],
	submittedParts: UploadCompleteInput["parts"],
): CompletePartsValidationResult {
	const uploadedPartMap = new Map(uploadedParts.map((part) => [part.partNumber, part]));
	const submittedPartMap = new Map(submittedParts.map((part) => [part.partNumber, part]));
	const missingPartNumbers: number[] = [];
	const unexpectedPartNumbers: number[] = [];

	for (let partNumber = 1; partNumber <= totalParts; partNumber += 1) {
		if (!submittedPartMap.has(partNumber)) {
			missingPartNumbers.push(partNumber);
		}
	}

	for (const partNumber of submittedPartMap.keys()) {
		if (partNumber < 1 || partNumber > totalParts) {
			unexpectedPartNumbers.push(partNumber);
		}
	}

	if (missingPartNumbers.length > 0) {
		return { ok: false, error: `Missing parts: ${missingPartNumbers.join(",")}` };
	}
	if (unexpectedPartNumbers.length > 0) {
		return { ok: false, error: `Unexpected parts: ${unexpectedPartNumbers.join(",")}` };
	}

	for (let partNumber = 1; partNumber <= totalParts; partNumber += 1) {
		const uploadedPart = uploadedPartMap.get(partNumber);
		const submittedPart = submittedPartMap.get(partNumber);
		if (!uploadedPart) {
			return { ok: false, error: `Missing uploaded part: ${partNumber}` };
		}
		if (!submittedPart || uploadedPart.etag !== submittedPart.etag) {
			return { ok: false, error: `ETag mismatch for part ${partNumber}` };
		}
	}

	return {
		ok: true,
		parts: Array.from(submittedPartMap.values()).sort((left, right) => left.partNumber - right.partNumber),
	};
}

export function createContractUploadService(
	options: {
		event?: H3Event | Record<string, any>;
		repository?: UploadRepository;
		gateway?: UploadGateway;
		sessionIdFactory?: () => string;
		now?: () => string;
	} = {},
) {
	const event = options.event;
	const repository = options.repository || createInMemoryUploadRepository();
	let gateway = options.gateway;
	const sessionIdFactory = options.sessionIdFactory || crypto.randomUUID.bind(crypto);
	const now = options.now || nowIso;

	function getGateway(): UploadGateway {
		if (!gateway) {
			gateway = createDefaultGateway(event);
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
			r2Bucket: getR2EnvRequired("R2_BUCKET", event),
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
		async initUpload(input: UploadInitInput): Promise<JsonVO<UploadInitVO | null>> {
			try {
				const session = await createSession(input);
				return createResponse(200, "init upload ok", {
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
			} catch (error: any) {
				return createFailureResponse("init upload failed", error);
			}
		},
		async getStatus(input: UploadStatusInput): Promise<JsonVO<UploadStatusVO | null>> {
			try {
				const parsed = createUploadStatusSchema.parse(input);
				const session = await repository.getSession(parsed.sessionId);
				if (!session) {
					return createResponse(404, "upload session not found", null, { success: false });
				}
				if (isTerminalStatus(session.status)) {
					const persistedParts = await repository.listUploadedParts(session.id);
					const sortedParts = persistedParts
						.map((part) => ({ ...part }))
						.sort((left, right) => left.partNumber - right.partNumber);
					return createResponse(200, "upload status ok", {
						sessionId: session.id,
						status: session.status,
						totalParts: session.totalParts,
						uploadedParts: sortedParts,
						missingPartNumbers: buildMissingPartNumbers(session.totalParts, sortedParts),
						objectKey: session.r2ObjectKey,
						publicUrl: session.publicUrl,
						uploadedPartsCount: session.uploadedPartsCount,
					});
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
				return createResponse(200, "upload status ok", {
					sessionId: session.id,
					status: nextSession?.status || session.status,
					totalParts: session.totalParts,
					uploadedParts: normalizedUploadedParts,
					missingPartNumbers,
					objectKey: session.r2ObjectKey,
					publicUrl: nextSession?.publicUrl ?? session.publicUrl,
					uploadedPartsCount: normalizedUploadedParts.length,
				});
			} catch (error: any) {
				return createFailureResponse("upload status failed", error);
			}
		},
		async signPart(input: UploadSignPartInput): Promise<JsonVO<UploadSignPartVO | null>> {
			try {
				const parsed = createUploadSignPartSchema.parse(input);
				const session = await repository.getSession(parsed.sessionId);
				if (!session) {
					return createResponse(404, "upload session not found", null, { success: false });
				}
				if (session.status === "completed" || session.status === "aborted" || session.status === "expired") {
					return createResponse(409, "upload session cannot sign parts", null, { success: false });
				}
				if (parsed.partNumber > session.totalParts) {
					return createResponse(400, "part number out of range", null, { success: false });
				}
				const result = await getGateway().signPart(session, parsed.partNumber);
				await repository.updateSession(session.id, {
					status: session.status === "initiated" || session.status === "paused" ? "uploading" : session.status,
					updatedAt: now(),
				});
				return createResponse(200, "sign part ok", {
					sessionId: session.id,
					partNumber: parsed.partNumber,
					signedUrl: result.signedUrl,
					expiresIn: result.expiresIn,
					objectKey: session.r2ObjectKey,
				});
			} catch (error: any) {
				return createFailureResponse("sign part failed", error);
			}
		},
		async completeUpload(input: UploadCompleteInput): Promise<JsonVO<UploadCompleteVO | null>> {
			try {
				const parsed = createUploadCompleteSchema.parse(input);
				const session = await repository.getSession(parsed.sessionId);
				if (!session) {
					return createResponse(404, "upload session not found", null, { success: false });
				}
				if (session.status === "aborted") {
					return createResponse(409, "upload session already aborted", null, { success: false });
				}
				if (session.status === "completed") {
					return createResponse(200, "complete upload ok", {
						sessionId: session.id,
						status: session.status,
						objectKey: session.r2ObjectKey,
						objectEtag: session.objectEtag,
						publicUrl: session.publicUrl,
						attachmentName: parsed.attachmentName,
						attachmentType: parsed.attachmentType,
					});
				}
				const { uploadedParts } = await getGateway().listUploadedParts(session);
				const normalizedUploadedParts = uploadedParts
					.map((part) => ({ ...part }))
					.sort((left, right) => left.partNumber - right.partNumber);
				await repository.replaceUploadedParts(session.id, normalizedUploadedParts);
				const missingPartNumbers = buildMissingPartNumbers(session.totalParts, normalizedUploadedParts);
				if (missingPartNumbers.length > 0) {
					return createResponse(409, "uploaded parts are incomplete", null, {
						success: false,
						error: `Missing parts: ${missingPartNumbers.join(",")}`,
					});
				}
				const validation = assertCompletePartsMatch(session.totalParts, normalizedUploadedParts, parsed.parts);
				if (!validation.ok) {
					return createResponse(409, "submitted parts do not match uploaded parts", null, {
						success: false,
						error: validation.error,
					});
				}
				const uploadedPartMap = new Map(normalizedUploadedParts.map((part) => [part.partNumber, part]));
				const normalizedParts = validation.parts.map((part) => ({
					partNumber: part.partNumber,
					etag: part.etag,
					partSize: uploadedPartMap.get(part.partNumber)?.partSize || 0,
				}));
				const completion = await getGateway().completeMultipartUpload(session, normalizedParts);
				const currentTime = now();
				const publicUrl = buildPublicUrl(session.r2Bucket, session.r2ObjectKey, event);
				const nextSession = await repository.updateSession(session.id, {
					status: "completed",
					objectEtag: completion.objectEtag,
					publicUrl,
					completedAt: currentTime,
					uploadedPartsCount: normalizedParts.length,
					updatedAt: currentTime,
				});
				return createResponse(200, "complete upload ok", {
					sessionId: session.id,
					status: nextSession?.status || "completed",
					objectKey: session.r2ObjectKey,
					objectEtag: completion.objectEtag,
					publicUrl,
					attachmentName: parsed.attachmentName,
					attachmentType: parsed.attachmentType,
				});
			} catch (error: any) {
				return createFailureResponse("complete upload failed", error);
			}
		},
		async abortUpload(input: UploadAbortInput): Promise<JsonVO<UploadAbortVO | null>> {
			try {
				const parsed = createUploadAbortSchema.parse(input);
				const session = await repository.getSession(parsed.sessionId);
				if (!session) {
					return createResponse(404, "upload session not found", null, { success: false });
				}
				if (session.status === "completed") {
					await getGateway().deleteObject(session);
					await repository.replaceUploadedParts(session.id, []);
					await repository.updateSession(session.id, {
						status: "aborted",
						uploadedPartsCount: 0,
						objectEtag: null,
						publicUrl: null,
						completedAt: null,
						updatedAt: now(),
					});
				} else if (session.status !== "aborted") {
					await getGateway().abortMultipartUpload(session);
					await repository.updateSession(session.id, {
						status: "aborted",
						updatedAt: now(),
					});
				}
				const nextSession = await repository.getSession(session.id);
				return createResponse(200, "abort upload ok", {
					sessionId: session.id,
					status: nextSession?.status || "aborted",
					objectKey: session.r2ObjectKey,
				});
			} catch (error: any) {
				return createFailureResponse("abort upload failed", error);
			}
		},
	};
}
