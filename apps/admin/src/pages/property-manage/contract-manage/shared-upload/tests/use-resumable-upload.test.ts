import { describe, expect, test, vi } from "vitest";
import {
	buildResumeFingerprint,
	createResumableUploadCache,
	pickMissingPartNumbers,
	useResumableUpload,
} from "../use-resumable-upload";

function createMemoryStorage() {
	const store = new Map<string, unknown>();

	return {
		async getItem<T>(key: string) {
			return (store.get(key) ?? null) as T | null;
		},
		async setItem<T>(key: string, value: T) {
			store.set(key, value);
			return value;
		},
		async removeItem(key: string) {
			store.delete(key);
		},
		async clear() {
			store.clear();
		},
		async keys() {
			return [...store.keys()];
		},
	};
}

describe("shared-upload", () => {
	test("buildResumeFingerprint 对相同文件元数据和 chunkSize 生成稳定指纹", async () => {
		const file = new File(["hello"], "contract.pdf", {
			type: "application/pdf",
			lastModified: 123,
		});

		const first = await buildResumeFingerprint(file, 5 * 1024 * 1024);
		const second = await buildResumeFingerprint(file, 5 * 1024 * 1024);
		const differentChunkSize = await buildResumeFingerprint(file, 8 * 1024 * 1024);

		expect(first).toBe(second);
		expect(first).not.toBe(differentChunkSize);
		expect(first).toMatch(/^[a-f0-9]{64}$/);
	});

	test("pickMissingPartNumbers 只返回缺失的分片号", () => {
		expect(pickMissingPartNumbers(5, [{ partNumber: 1 }, { partNumber: 3 }])).toEqual([2, 4, 5]);
		expect(pickMissingPartNumbers(4, [{ partNumber: 4 }, { partNumber: 2 }, { partNumber: 2 }])).toEqual([1, 3]);
	});

	test("缓存可以按 fingerprint 恢复会话，并在移除后清空", async () => {
		const cache = createResumableUploadCache(createMemoryStorage());

		await cache.saveSession({
			fingerprint: "fingerprint-demo",
			bizType: "draft_contract",
			sessionId: "session-1",
			fileName: "contract.pdf",
			mimeType: "application/pdf",
			fileSize: 120,
			chunkSize: 50,
			totalParts: 3,
			status: "uploading",
			uploadedParts: [{ partNumber: 1, etag: "etag-1", uploadedAt: 1 }],
			updatedAt: 2,
		});

		const restored = await cache.restoreSession("fingerprint-demo");
		expect(restored?.sessionId).toBe("session-1");
		expect(restored?.uploadedParts).toEqual([{ partNumber: 1, etag: "etag-1", uploadedAt: 1 }]);

		await cache.removeSession("fingerprint-demo");
		expect(await cache.restoreSession("fingerprint-demo")).toBeNull();
	});

	test("状态机可以恢复会话、暂停/继续/移除，并在未完成前阻止提交", async () => {
		const cache = createResumableUploadCache(createMemoryStorage());
		const file = new File(["12345678901234567890"], "contract.pdf", {
			type: "application/pdf",
			lastModified: 123,
		});
		const fingerprint = await buildResumeFingerprint(file, 5);
		await cache.saveSession({
			fingerprint,
			bizType: "draft_contract",
			sessionId: "session-1",
			fileName: "contract.pdf",
			mimeType: "application/pdf",
			fileSize: 20,
			chunkSize: 5,
			totalParts: 4,
			status: "uploading",
			uploadedParts: [{ partNumber: 1, etag: "etag-1", uploadedAt: 1 }],
			updatedAt: 2,
		});

		const uploader = useResumableUpload({
			bizType: "draft_contract",
			chunkSize: 5,
			cache,
		});

		const [item] = await uploader.addFiles([file]);

		expect(item.sessionId).toBe("session-1");
		expect(item.missingPartNumbers).toEqual([2, 3, 4]);
		expect(uploader.hasBlockingUpload.value).toBe(true);

		uploader.pauseUpload(item.localId);
		expect(uploader.files.value[0].status).toBe("paused");

		uploader.resumeUpload(item.localId);
		expect(uploader.files.value[0].status).toBe("uploading");

		uploader.markUploadedPart(item.localId, { partNumber: 2, etag: "etag-2" });
		expect(uploader.files.value[0].missingPartNumbers).toEqual([3, 4]);

		uploader.markCompleted(item.localId, {
			uploadSessionId: "session-1",
			attachmentName: "合同正文",
			attachmentType: "pdf",
			fileName: "contract.pdf",
			fileSize: 20,
			mimeType: "application/pdf",
			fileUrl: "https://example.com/contract.pdf",
			objectKey: "contract-manage/draft_contract/session-1/contract.pdf",
		});

		expect(uploader.hasBlockingUpload.value).toBe(false);
		expect(uploader.completedAssets.value).toHaveLength(1);

		uploader.removeUpload(item.localId);
		expect(uploader.files.value).toHaveLength(0);
	});
});

test("startUpload 会调用 upload 控制面并按 chunkSize 分片完成直传", async () => {
	const init = vi.fn(async () => ({
		sessionId: "session-1",
		chunkSize: 5,
		totalParts: 3,
		objectKey: "contract-manage/draft_contract/session-1/test.bin",
		status: "initiated",
	}));
	const status = vi.fn(async () => ({
		status: "initiated",
		uploadedParts: [],
	}));
	const signPart = vi.fn(async ({ partNumber }: { partNumber: number }) => ({
		signedUrl: `https://signed.example/${partNumber}`,
		expiresIn: 900,
	}));
	const uploadPart = vi.fn(async ({ blob, partNumber }: { blob: Blob; partNumber: number }) => ({
		etag: `etag-${partNumber}-${blob.size}`,
	}));
	const complete = vi.fn(async () => ({
		sessionId: "session-1",
		fileUrl: "https://files.example.com/contract-manage/draft_contract/session-1/test.bin",
		objectKey: "contract-manage/draft_contract/session-1/test.bin",
	}));
	const abort = vi.fn(async () => undefined);

	const uploader = useResumableUpload({
		bizType: "draft_contract",
		chunkSize: 5,
		cache: createResumableUploadCache(createMemoryStorage()),
		client: {
			init,
			status,
			signPart,
			uploadPart,
			complete,
			abort,
		},
	});

	const file = new File(["1234567890abc"], "test.bin", {
		type: "application/octet-stream",
		lastModified: 123,
	});
	const [item] = await uploader.addFiles([file]);

	await uploader.startUpload(item.localId);

	expect(init).toHaveBeenCalledTimes(1);
	expect(status).toHaveBeenCalledTimes(1);
	expect(signPart).toHaveBeenCalledTimes(3);
	expect(uploadPart).toHaveBeenCalledTimes(3);
	expect(uploadPart.mock.calls.map(([payload]) => payload.blob.size)).toEqual([5, 5, 3]);
	expect(complete).toHaveBeenCalledTimes(1);
	expect(uploader.files.value[0].status).toBe("completed");
	expect(uploader.completedAssets.value[0]?.uploadSessionId).toBe("session-1");
});

test("恢复上传时只补传缺失分片，并在移除未完成项时终止会话", async () => {
	const cache = createResumableUploadCache(createMemoryStorage());
	const file = new File(["1234567890abc"], "resume.bin", {
		type: "application/octet-stream",
		lastModified: 123,
	});
	const fingerprint = await buildResumeFingerprint(file, 5);
	await cache.saveSession({
		fingerprint,
		bizType: "draft_contract",
		sessionId: "session-resume",
		fileName: "resume.bin",
		mimeType: "application/octet-stream",
		fileSize: 13,
		chunkSize: 5,
		totalParts: 3,
		status: "paused",
		uploadedParts: [{ partNumber: 1, etag: "etag-1", uploadedAt: 1 }],
		updatedAt: 2,
	});

	const init = vi.fn(async () => {
		throw new Error("should not init existing session");
	});
	const status = vi.fn(async () => ({
		status: "uploading",
		uploadedParts: [{ partNumber: 1, etag: "etag-1" }],
	}));
	const signPart = vi.fn(async ({ partNumber }: { partNumber: number }) => ({
		signedUrl: `https://signed.example/${partNumber}`,
		expiresIn: 900,
	}));
	const uploadPart = vi.fn(async ({ partNumber }: { partNumber: number }) => ({
		etag: `etag-${partNumber}`,
	}));
	const complete = vi.fn(async () => ({
		sessionId: "session-resume",
		fileUrl: "https://files.example.com/contract-manage/draft_contract/session-resume/resume.bin",
		objectKey: "contract-manage/draft_contract/session-resume/resume.bin",
	}));
	const abort = vi.fn(async () => undefined);

	const uploader = useResumableUpload({
		bizType: "draft_contract",
		chunkSize: 5,
		cache,
		client: {
			init,
			status,
			signPart,
			uploadPart,
			complete,
			abort,
		},
	});

	const [item] = await uploader.addFiles([file]);

	await uploader.resumeUpload(item.localId);

	expect(init).not.toHaveBeenCalled();
	expect(status).toHaveBeenCalledTimes(1);
	expect(signPart.mock.calls.map(([payload]) => payload.partNumber)).toEqual([2, 3]);
	expect(uploadPart.mock.calls.map(([payload]) => payload.partNumber)).toEqual([2, 3]);
	expect(complete).toHaveBeenCalledTimes(1);

	uploader.rememberSession(item.localId, {
		fingerprint,
		bizType: "draft_contract",
		sessionId: "session-resume-remove",
		fileName: "resume.bin",
		mimeType: "application/octet-stream",
		fileSize: 13,
		chunkSize: 5,
		totalParts: 3,
		status: "paused",
		uploadedParts: [],
		updatedAt: 3,
	});
	uploader.files.value[0].status = "paused";

	uploader.removeUpload(item.localId);
	await Promise.resolve();

	expect(abort).toHaveBeenCalledWith({ sessionId: "session-resume-remove" });
});
