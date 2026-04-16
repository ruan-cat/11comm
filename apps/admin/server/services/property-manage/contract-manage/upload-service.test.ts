import { beforeEach, describe, expect, test, vi } from "vitest";
import {
	buildMissingPartNumbers,
	createContractUploadService,
	type UploadPartState,
	type UploadSessionRecord,
} from "./upload-service";

function createRepositoryFixture() {
	const sessions = new Map<string, UploadSessionRecord>();
	const parts = new Map<string, UploadPartState[]>();

	return {
		async findReusableSession(input: {
			bizType: UploadSessionRecord["bizType"];
			fileName: string;
			fileSize: number;
			chunkSize: number;
			resumeFingerprint: string;
		}) {
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
		async getSession(sessionId: string) {
			const session = sessions.get(sessionId);
			return session ? { ...session } : undefined;
		},
		async createSession(session: UploadSessionRecord) {
			sessions.set(session.id, { ...session });
			return { ...session };
		},
		async updateSession(sessionId: string, patch: Partial<UploadSessionRecord>) {
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
		async listUploadedParts(sessionId: string) {
			return (parts.get(sessionId) || []).map((part) => ({ ...part }));
		},
		async replaceUploadedParts(sessionId: string, nextParts: UploadPartState[]) {
			parts.set(
				sessionId,
				nextParts.map((part) => ({ ...part })),
			);
			return (parts.get(sessionId) || []).map((part) => ({ ...part }));
		},
		snapshot() {
			return {
				sessions,
				parts,
			};
		},
	};
}

function createGatewayFixture(uploadedParts: UploadPartState[] = []) {
	return {
		createMultipartUpload: vi.fn(async (session: UploadSessionRecord) => ({ uploadId: `${session.id}-upload-id` })),
		listUploadedParts: vi.fn(async () => ({
			uploadedParts: uploadedParts.map((part) => ({ ...part })),
		})),
		signPart: vi.fn(async (session: UploadSessionRecord, partNumber: number) => ({
			signedUrl: `https://signed.example/${session.id}/${partNumber}`,
			expiresIn: 900,
		})),
		completeMultipartUpload: vi.fn(async () => ({ objectEtag: "etag-complete" })),
		abortMultipartUpload: vi.fn(async () => undefined),
	};
}

function createService(options: {
	repository: ReturnType<typeof createRepositoryFixture>;
	gateway: ReturnType<typeof createGatewayFixture>;
	sessionId: string;
	now?: () => string;
}) {
	return createContractUploadService({
		repository: options.repository as any,
		gateway: options.gateway as any,
		sessionIdFactory: () => options.sessionId,
		now: options.now || (() => "2026-04-15T00:00:00.000Z"),
	} as any);
}

describe("contract upload service", () => {
	beforeEach(() => {
		vi.unstubAllEnvs();
		vi.stubEnv("R2_BUCKET", "01s-11comm-files");
		vi.stubEnv("R2_PUBLIC_BASE_URL", "https://files.example.com");
	});

	test("reuses the same active session across service instances", async () => {
		const repository = createRepositoryFixture();
		const gateway = createGatewayFixture();
		const input = {
			bizType: "draft_contract" as const,
			fileName: "contract.pdf",
			mimeType: "application/pdf",
			fileSize: 12 * 1024 * 1024,
			chunkSize: 5 * 1024 * 1024,
			resumeFingerprint: "fingerprint-demo",
		};

		const firstService = createService({ repository, gateway, sessionId: "00000000-0000-4000-8000-000000000001" });
		const firstResponse = await firstService.initUpload(input);

		expect(firstResponse.success).toBe(true);
		expect(firstResponse.data?.sessionId).toBe("00000000-0000-4000-8000-000000000001");
		expect(gateway.createMultipartUpload).toHaveBeenCalledTimes(1);

		const secondService = createService({ repository, gateway, sessionId: "00000000-0000-4000-8000-000000000002" });
		const secondResponse = await secondService.initUpload(input);

		expect(secondResponse.success).toBe(true);
		expect(secondResponse.data?.sessionId).toBe("00000000-0000-4000-8000-000000000001");
		expect(gateway.createMultipartUpload).toHaveBeenCalledTimes(1);
	});

	test("status syncs uploaded parts back into the repository", async () => {
		const repository = createRepositoryFixture();
		const gateway = createGatewayFixture([
			{ partNumber: 1, etag: "etag-1", partSize: 5 },
			{ partNumber: 3, etag: "etag-3", partSize: 5 },
		]);
		const service = createService({ repository, gateway, sessionId: "00000000-0000-4000-8000-000000000003" });

		const initResponse = await service.initUpload({
			bizType: "draft_contract",
			fileName: "contract.pdf",
			mimeType: "application/pdf",
			fileSize: 15,
			chunkSize: 5,
			resumeFingerprint: "fingerprint-status",
		});

		expect(initResponse.success).toBe(true);

		const statusResponse = await service.getStatus({
			sessionId: initResponse.data!.sessionId,
		});

		expect(statusResponse.success).toBe(true);
		expect(statusResponse.data?.missingPartNumbers).toEqual([2]);
		expect(statusResponse.data?.uploadedPartsCount).toBe(2);
		expect(statusResponse.data?.status).toBe("uploading");
		expect(repository.snapshot().parts.get(initResponse.data!.sessionId)).toEqual([
			{ partNumber: 1, etag: "etag-1", partSize: 5 },
			{ partNumber: 3, etag: "etag-3", partSize: 5 },
		]);
	});

	test("complete is idempotent across service instances", async () => {
		const repository = createRepositoryFixture();
		const gateway = createGatewayFixture([
			{ partNumber: 1, etag: "etag-1", partSize: 5 },
			{ partNumber: 2, etag: "etag-2", partSize: 5 },
		]);
		const input = {
			bizType: "draft_contract" as const,
			fileName: "contract.pdf",
			mimeType: "application/pdf",
			fileSize: 10,
			chunkSize: 5,
			resumeFingerprint: "fingerprint-complete",
		};

		const firstService = createService({ repository, gateway, sessionId: "00000000-0000-4000-8000-000000000004" });
		const initResponse = await firstService.initUpload(input);
		expect(initResponse.success).toBe(true);

		const completePayload = {
			sessionId: initResponse.data!.sessionId,
			attachmentName: "合同附件",
			attachmentType: "pdf",
			parts: [
				{ partNumber: 1, etag: "etag-1" },
				{ partNumber: 2, etag: "etag-2" },
			],
		};

		const completeResponse = await firstService.completeUpload(completePayload);
		expect(completeResponse.success).toBe(true);
		expect(completeResponse.data?.status).toBe("completed");
		expect(gateway.completeMultipartUpload).toHaveBeenCalledTimes(1);

		const secondService = createService({ repository, gateway, sessionId: "00000000-0000-4000-8000-000000000005" });
		const retryResponse = await secondService.completeUpload(completePayload);
		expect(retryResponse.success).toBe(true);
		expect(retryResponse.data?.status).toBe("completed");
		expect(gateway.completeMultipartUpload).toHaveBeenCalledTimes(1);
	});

	test("abort persists terminal state across service instances", async () => {
		const repository = createRepositoryFixture();
		const gateway = createGatewayFixture();
		const input = {
			bizType: "change" as const,
			fileName: "change.pdf",
			mimeType: "application/pdf",
			fileSize: 10,
			chunkSize: 5,
			resumeFingerprint: "fingerprint-abort",
		};

		const firstService = createService({ repository, gateway, sessionId: "00000000-0000-4000-8000-000000000006" });
		const initResponse = await firstService.initUpload(input);
		expect(initResponse.success).toBe(true);

		const abortResponse = await firstService.abortUpload({
			sessionId: initResponse.data!.sessionId,
		});
		expect(abortResponse.success).toBe(true);
		expect(abortResponse.data?.status).toBe("aborted");
		expect(gateway.abortMultipartUpload).toHaveBeenCalledTimes(1);

		const secondService = createService({ repository, gateway, sessionId: "00000000-0000-4000-8000-000000000007" });
		const retryResponse = await secondService.abortUpload({
			sessionId: initResponse.data!.sessionId,
		});

		expect(retryResponse.success).toBe(true);
		expect(retryResponse.data?.status).toBe("aborted");
		expect(gateway.abortMultipartUpload).toHaveBeenCalledTimes(1);
	});

	test("buildMissingPartNumbers reports the missing gaps", () => {
		expect(buildMissingPartNumbers(5, [{ partNumber: 1, etag: "etag-1", partSize: 1 }])).toEqual([2, 3, 4, 5]);
	});
});
