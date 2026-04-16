import { computed, ref } from "vue";
import { localForage } from "@/utils/localforage";
import type { ProxyStorage } from "@/utils/localforage/types.d";
import { createResumableUploadCache } from "./upload-cache";
import type {
	UploadAbortPayload,
	UploadCompletePayload,
	UploadInitPayload,
	UploadSignPartPayload,
	UploadStatusPayload,
} from "@/api/property-manage/contract-manage/upload";
import type {
	ResumableUploadAttachmentTypeOption,
	ResumableUploadBizType,
	ResumableUploadCache,
	ResumableUploadCompletedAsset,
	ResumableUploadItemStatus,
	ResumableUploadPartState,
	ResumableUploadQueueItem,
	ResumableUploadSessionSnapshot,
} from "./types";
export { createResumableUploadCache } from "./upload-cache";

export interface UseResumableUploadOptions {
	bizType: ResumableUploadBizType;
	chunkSize?: number;
	cache?: ResumableUploadCache;
	attachmentTypeOptions?: ResumableUploadAttachmentTypeOption[];
	client?: ResumableUploadClient;
}

/** 默认分片大小：5MB */
const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024;

export interface ResumableUploadInitResult {
	sessionId: string;
	chunkSize: number;
	totalParts: number;
	objectKey: string;
	status: string;
}

export interface ResumableUploadStatusResult {
	status: string;
	uploadedParts: Array<{
		partNumber: number;
		etag: string;
	}>;
}

export interface ResumableUploadSignPartResult {
	signedUrl: string;
	expiresIn: number;
}

export interface ResumableUploadCompleteResult {
	sessionId: string;
	fileUrl?: string;
	publicUrl?: string;
	objectKey: string;
}

export interface ResumableUploadClient {
	init(payload: UploadInitPayload): Promise<ResumableUploadInitResult>;
	status(payload: UploadStatusPayload): Promise<ResumableUploadStatusResult>;
	signPart(payload: UploadSignPartPayload): Promise<ResumableUploadSignPartResult>;
	uploadPart(payload: {
		signedUrl: string;
		blob: Blob;
		mimeType: string;
		partNumber: number;
		signal?: AbortSignal;
	}): Promise<{ etag: string }>;
	complete(payload: UploadCompletePayload): Promise<ResumableUploadCompleteResult>;
	abort(payload: UploadAbortPayload): Promise<void>;
}

/**
 * 兼容 unwrap 普通数据与 JsonVO 包装响应。
 * @description
 * 当前上传相关接口在不同阶段可能返回直接数据或 `JsonVO<T>`，
 * 这里统一把调用方真正需要的 payload 解出来。
 */
function unwrapResponse<T>(response: any): T {
	const payload = response?.data ?? response;

	if (payload && typeof payload === "object" && "code" in payload && "data" in payload) {
		if (payload.success === false) {
			throw new Error(payload.error || payload.message || "Upload request failed");
		}

		return payload.data as T;
	}

	return payload as T;
}

/**
 * 创建默认上传客户端。
 * @description
 * 负责衔接 Nitro 上传控制面接口与浏览器直传 R2 的 `PUT` 请求，
 * composable 本身只依赖这个抽象接口，不直接依赖具体 API 模块。
 */
function createDefaultUploadClient(): ResumableUploadClient {
	return {
		async init(payload) {
			const { uploadInit } = await import("@/api/property-manage/contract-manage/upload");
			return unwrapResponse<ResumableUploadInitResult>(await uploadInit(payload));
		},
		async status(payload) {
			const { uploadStatus } = await import("@/api/property-manage/contract-manage/upload");
			return unwrapResponse<ResumableUploadStatusResult>(await uploadStatus(payload));
		},
		async signPart(payload) {
			const { uploadSignPart } = await import("@/api/property-manage/contract-manage/upload");
			return unwrapResponse<ResumableUploadSignPartResult>(await uploadSignPart(payload));
		},
		async uploadPart(payload) {
			const response = await fetch(payload.signedUrl, {
				method: "PUT",
				body: payload.blob,
				headers: {
					"Content-Type": payload.mimeType || "application/octet-stream",
				},
				signal: payload.signal,
			});

			if (!response.ok) {
				throw new Error(`Upload part failed with status ${response.status}`);
			}

			const etag = response.headers.get("etag") || response.headers.get("ETag");
			if (!etag) {
				throw new Error(`Upload part ${payload.partNumber} did not return an ETag`);
			}

			return { etag };
		},
		async complete(payload) {
			const { uploadComplete } = await import("@/api/property-manage/contract-manage/upload");
			return unwrapResponse<ResumableUploadCompleteResult>(await uploadComplete(payload));
		},
		async abort(payload) {
			const { uploadAbort } = await import("@/api/property-manage/contract-manage/upload");
			await uploadAbort(payload);
		},
	};
}

/** 生成用于断点续传恢复的稳定指纹摘要 */
async function hashText(text: string) {
	const encoded = new TextEncoder().encode(text);

	if (globalThis.crypto?.subtle) {
		const digest = await globalThis.crypto.subtle.digest("SHA-256", encoded);
		return Array.from(new Uint8Array(digest))
			.map((item) => item.toString(16).padStart(2, "0"))
			.join("");
	}

	const { createHash } = await import("node:crypto");
	return createHash("sha256").update(text).digest("hex");
}

/** 为前端上传队列项创建本地唯一 ID */
function createFileLocalId() {
	return globalThis.crypto?.randomUUID?.() ?? `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** 根据已上传分片数量计算进度百分比 */
function computeProgress(uploadedCount: number, totalParts: number) {
	if (totalParts <= 0) {
		return 0;
	}

	return Math.min(100, Math.round((uploadedCount / totalParts) * 100));
}

/** 规整服务端返回的分片状态，保证顺序与本地时间戳字段完整 */
function normalizePartStates(
	parts: Array<Pick<ResumableUploadPartState, "partNumber" | "etag">>,
): ResumableUploadPartState[] {
	return parts
		.slice()
		.sort((left, right) => left.partNumber - right.partNumber)
		.map((part) => ({
			partNumber: part.partNumber,
			etag: part.etag,
			uploadedAt: Date.now(),
		}));
}

/** 计算当前仍缺失的分片编号列表 */
export function pickMissingPartNumbers(
	totalParts: number,
	uploadedParts: Array<Pick<ResumableUploadPartState, "partNumber">>,
) {
	const uploaded = new Set(uploadedParts.map((part) => part.partNumber));

	return Array.from({ length: totalParts }, (_, index) => index + 1).filter((partNumber) => !uploaded.has(partNumber));
}

/** 基于文件元信息与分片大小生成可恢复上传指纹 */
export async function buildResumeFingerprint(file: File, chunkSize: number) {
	const raw = `${file.name}:${file.size}:${file.lastModified}:${chunkSize}`;
	return hashText(raw);
}

/** 从上传队列项提取可持久化的会话快照 */
function createSnapshotFromItem(item: ResumableUploadQueueItem): ResumableUploadSessionSnapshot | null {
	if (!item.sessionId) {
		return null;
	}

	return {
		fingerprint: item.fingerprint,
		bizType: item.bizType,
		sessionId: item.sessionId,
		fileName: item.file.name,
		mimeType: item.file.type,
		fileSize: item.file.size,
		chunkSize: item.chunkSize,
		totalParts: item.totalParts,
		status: item.status === "completed" ? "completed" : item.status === "paused" ? "paused" : "uploading",
		uploadedParts: item.uploadedParts,
		completedAsset: item.completedAsset,
		updatedAt: Date.now(),
	};
}

/** 构造前端上传队列项，并吸收已恢复的断点续传状态 */
function buildQueueItem(options: {
	bizType: ResumableUploadBizType;
	file: File;
	fingerprint: string;
	chunkSize: number;
	restoredSession?: ResumableUploadSessionSnapshot | null;
}): ResumableUploadQueueItem {
	const totalParts = Math.max(1, Math.ceil(options.file.size / options.chunkSize));
	const uploadedParts = options.restoredSession ? normalizePartStates(options.restoredSession.uploadedParts) : [];
	const status: ResumableUploadItemStatus = options.restoredSession
		? options.restoredSession.status === "completed"
			? "completed"
			: "paused"
		: "queued";

	return {
		localId: createFileLocalId(),
		file: options.file,
		bizType: options.bizType,
		fingerprint: options.fingerprint,
		sessionId: options.restoredSession?.sessionId,
		status,
		chunkSize: options.chunkSize,
		totalParts,
		uploadedParts,
		missingPartNumbers: pickMissingPartNumbers(totalParts, uploadedParts),
		progress: computeProgress(uploadedParts.length, totalParts),
		completedAsset: options.restoredSession?.completedAsset,
	};
}

/** 推导上传资产的附件类型，优先采用业务侧提供的默认选项 */
function deriveAttachmentType(fileName: string, attachmentTypeOptions: ResumableUploadAttachmentTypeOption[]) {
	const preferred = attachmentTypeOptions[0]?.value;
	if (preferred) {
		return preferred;
	}

	const extension = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".") + 1) : "";
	return extension || "其他";
}

/**
 * 管理合同业务下的断点续传队列。
 * @description
 * 负责文件入队、上传会话恢复、分片签名上传、完成提交、
 * 暂停重试以及本地快照同步，是起草合同与合同变更页共用的上传状态内核。
 */
export function useResumableUpload(options: UseResumableUploadOptions) {
	const chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
	const cache = options.cache ?? createResumableUploadCache(localForage() as ProxyStorage);
	const client = options.client ?? createDefaultUploadClient();
	const files = ref<ResumableUploadQueueItem[]>([]);
	const taskMap = new Map<string, Promise<void>>();
	const controllerMap = new Map<string, AbortController>();

	/** 将浏览器选择的文件加入上传队列，并尝试恢复已有会话 */
	async function addFiles(selectedFiles: File[]) {
		const queued = await Promise.all(
			selectedFiles.map(async (file) => {
				const fingerprint = await buildResumeFingerprint(file, chunkSize);
				const restoredSession = await cache.restoreSession(fingerprint);
				return buildQueueItem({
					bizType: options.bizType,
					file,
					fingerprint,
					chunkSize,
					restoredSession,
				});
			}),
		);

		files.value.push(...queued);
		return queued;
	}

	/** 按本地队列 ID 查找上传项 */
	function findFile(localId: string) {
		return files.value.find((item) => item.localId === localId);
	}

	/** 将当前队列项的可恢复状态同步到本地缓存 */
	function syncSnapshot(localId: string) {
		const item = findFile(localId);
		if (!item || !item.sessionId) {
			return;
		}

		const snapshot = createSnapshotFromItem(item);
		if (snapshot) {
			void cache.saveSession(snapshot);
		}
	}

	/** 暂停指定上传任务，并中止当前分片请求 */
	function pauseUpload(localId: string) {
		const item = findFile(localId);
		if (!item || item.status === "completed") {
			return;
		}

		item.status = "paused";
		controllerMap.get(localId)?.abort();
		syncSnapshot(localId);
	}

	/** 恢复指定上传任务 */
	async function resumeUpload(localId: string) {
		const item = findFile(localId);
		if (!item || item.status === "completed") {
			return;
		}

		item.status = "uploading";
		syncSnapshot(localId);
		await processUpload(localId);
	}

	/** 将失败任务切回上传中状态并重新执行 */
	function retryUpload(localId: string) {
		const item = findFile(localId);
		if (!item || item.status === "completed") {
			return;
		}

		item.status = "uploading";
		item.errorMessage = undefined;
		syncSnapshot(localId);
		return processUpload(localId);
	}

	/** 启动上传，语义上与恢复上传保持一致 */
	function startUpload(localId: string) {
		return resumeUpload(localId);
	}

	/** 记录单个分片已上传完成，并刷新本地进度 */
	function markUploadedPart(localId: string, part: Pick<ResumableUploadPartState, "partNumber" | "etag">) {
		const item = findFile(localId);
		if (!item || item.status === "completed") {
			return;
		}

		const nextParts = item.uploadedParts.filter((current) => current.partNumber !== part.partNumber);
		nextParts.push({
			partNumber: part.partNumber,
			etag: part.etag,
			uploadedAt: Date.now(),
		});

		item.uploadedParts = nextParts.sort((left, right) => left.partNumber - right.partNumber);
		item.missingPartNumbers = pickMissingPartNumbers(item.totalParts, item.uploadedParts);
		item.progress = computeProgress(item.uploadedParts.length, item.totalParts);
		syncSnapshot(localId);
	}

	/** 用外部恢复得到的快照覆盖当前队列项 */
	function rememberSession(localId: string, snapshot: ResumableUploadSessionSnapshot) {
		const item = findFile(localId);
		if (!item) {
			return;
		}

		item.sessionId = snapshot.sessionId;
		item.uploadedParts = normalizePartStates(snapshot.uploadedParts);
		item.completedAsset = snapshot.completedAsset;
		item.status = snapshot.status === "completed" ? "completed" : "paused";
		item.missingPartNumbers = pickMissingPartNumbers(item.totalParts, item.uploadedParts);
		item.progress = computeProgress(item.uploadedParts.length, item.totalParts);
		void cache.saveSession({
			...snapshot,
			updatedAt: Date.now(),
		});
	}

	/** 标记上传完成，并清理断点续传缓存 */
	function markCompleted(localId: string, asset: ResumableUploadCompletedAsset) {
		const item = findFile(localId);
		if (!item) {
			return;
		}

		item.status = "completed";
		item.completedAsset = asset;
		item.sessionId = asset.uploadSessionId;
		item.progress = 100;
		item.missingPartNumbers = [];
		item.uploadedParts = [];
		void cache.removeSession(item.fingerprint);
	}

	/** 从队列中移除上传项，并尽量终止未完成会话 */
	function removeUpload(localId: string) {
		const target = findFile(localId);
		if (target?.status !== "completed" && target?.sessionId) {
			void client.abort({ sessionId: target.sessionId });
		}
		controllerMap.get(localId)?.abort();
		controllerMap.delete(localId);
		taskMap.delete(localId);

		const index = files.value.findIndex((item) => item.localId === localId);
		if (index < 0) {
			return;
		}

		const [item] = files.value.splice(index, 1);
		if (item.sessionId) {
			void cache.removeSession(item.fingerprint);
		}
	}

	/** 清空当前上传队列 */
	function clearUpload() {
		files.value.splice(0, files.value.length);
	}

	/** 确保本地队列项已经绑定远端上传会话，并拉取最新分片状态 */
	async function ensureRemoteSession(localId: string) {
		const item = findFile(localId);
		if (!item) {
			return null;
		}

		if (!item.sessionId) {
			const initResult = await client.init({
				bizType: item.bizType,
				fileName: item.file.name,
				mimeType: item.file.type || "application/octet-stream",
				fileSize: item.file.size,
				chunkSize: item.chunkSize,
				resumeFingerprint: item.fingerprint,
			});

			item.sessionId = initResult.sessionId;
			item.chunkSize = initResult.chunkSize;
			item.totalParts = initResult.totalParts;
		}

		const statusResult = await client.status({
			sessionId: item.sessionId,
		});
		item.uploadedParts = normalizePartStates(statusResult.uploadedParts);
		item.missingPartNumbers = pickMissingPartNumbers(item.totalParts, item.uploadedParts);
		item.progress = computeProgress(item.uploadedParts.length, item.totalParts);
		item.status = item.missingPartNumbers.length === 0 ? "completed" : "uploading";
		syncSnapshot(localId);

		return item;
	}

	/**
	 * 执行完整的上传流程。
	 * @description
	 * 包括初始化远端会话、逐片签名并直传、完成 multipart upload，
	 * 以及在暂停、失败、完成三种状态之间维护本地队列与缓存。
	 */
	async function processUpload(localId: string) {
		if (taskMap.has(localId)) {
			return taskMap.get(localId);
		}

		const task = (async () => {
			const item = await ensureRemoteSession(localId);
			if (!item || !item.sessionId) {
				return;
			}

			if (item.status === "completed" && item.completedAsset) {
				return;
			}

			try {
				for (const partNumber of [...item.missingPartNumbers]) {
					const current = findFile(localId);
					if (!current || current.status !== "uploading" || !current.sessionId) {
						return;
					}

					const controller = new AbortController();
					controllerMap.set(localId, controller);
					const signResult = await client.signPart({
						sessionId: current.sessionId,
						partNumber,
					});
					const start = (partNumber - 1) * current.chunkSize;
					const end = Math.min(start + current.chunkSize, current.file.size);
					const uploadResult = await client.uploadPart({
						signedUrl: signResult.signedUrl,
						blob: current.file.slice(start, end),
						mimeType: current.file.type || "application/octet-stream",
						partNumber,
						signal: controller.signal,
					});
					markUploadedPart(localId, {
						partNumber,
						etag: uploadResult.etag,
					});
					controllerMap.delete(localId);
				}

				const latest = findFile(localId);
				if (!latest || !latest.sessionId) {
					return;
				}

				const attachmentName = latest.file.name;
				const attachmentType = deriveAttachmentType(latest.file.name, options.attachmentTypeOptions ?? []);
				const completeResult = await client.complete({
					sessionId: latest.sessionId,
					parts: latest.uploadedParts.map((part) => ({
						partNumber: part.partNumber,
						etag: part.etag,
					})),
					attachmentName,
					attachmentType,
				});

				markCompleted(localId, {
					uploadSessionId: latest.sessionId,
					attachmentName,
					attachmentType,
					fileName: latest.file.name,
					fileSize: latest.file.size,
					mimeType: latest.file.type || "application/octet-stream",
					fileUrl: completeResult.fileUrl || completeResult.publicUrl || "",
					objectKey: completeResult.objectKey,
				});
			} catch (error: any) {
				const current = findFile(localId);
				const isAbort = error?.name === "AbortError";
				if (!current) {
					return;
				}

				if (isAbort && current.status === "paused") {
					syncSnapshot(localId);
					return;
				}

				current.status = "failed";
				current.errorMessage = error?.message || String(error);
				syncSnapshot(localId);
			} finally {
				controllerMap.delete(localId);
				taskMap.delete(localId);
			}
		})();

		taskMap.set(localId, task);
		return task;
	}

	const completedAssets = computed(() =>
		files.value.flatMap((item) => {
			if (item.status !== "completed" || !item.completedAsset) {
				return [];
			}

			return [item.completedAsset];
		}),
	);

	const hasBlockingUpload = computed(() =>
		files.value.some((item) => item.status !== "completed" || !item.completedAsset),
	);

	return {
		files,
		completedAssets,
		hasBlockingUpload,
		addFiles,
		startUpload,
		pauseUpload,
		resumeUpload,
		retryUpload,
		removeUpload,
		clearUpload,
		markUploadedPart,
		markCompleted,
		rememberSession,
		processUpload,
	};
}
