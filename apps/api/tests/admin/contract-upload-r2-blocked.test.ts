import { afterEach, describe, expect, test, vi } from "vitest";

import { createAdminContractAdapter } from "../../server/modules/contract/admin-adapter";
import { createInMemoryContractRepository } from "../../server/modules/contract/repository";
import { createContractService } from "../../server/modules/contract/service";
import {
	buildMissingPartNumbers,
	createContractUploadService,
	createDbUploadRepository,
	createInMemoryUploadRepository,
	type UploadGateway,
	type UploadPartState,
	type UploadSessionRecord,
} from "../../server/modules/contract/upload-service";
import { getContractRuntime } from "../../server/modules/contract/runtime";
import { createR2Client } from "../../server/shared/runtime/r2-client";
import { getR2EnvRequired } from "../../server/shared/runtime/r2-env";
import abortUploadHandler from "../../server/routes/api/property-manage/contract-manage/upload/abort.post";
import completeUploadHandler from "../../server/routes/api/property-manage/contract-manage/upload/complete.post";
import initUploadHandler from "../../server/routes/api/property-manage/contract-manage/upload/init.post";
import signPartUploadHandler from "../../server/routes/api/property-manage/contract-manage/upload/sign-part.post";
import statusUploadHandler from "../../server/routes/api/property-manage/contract-manage/upload/status.post";
import { runtimeEndpointManifest } from "../../server/shared/runtime/runtime-endpoints";

const runtimeConfigMock = vi.hoisted(() => ({
	value: {} as Record<string, unknown>,
}));

vi.mock("nitro/h3", async (importOriginal) => {
	const actual = await importOriginal<typeof import("nitro/h3")>();
	return {
		...actual,
		readBody: vi.fn(),
	};
});

vi.mock("nitro/runtime-config", () => ({
	useRuntimeConfig: vi.fn(() => runtimeConfigMock.value),
}));

const { readBody } = await import("nitro/h3");
const mockedReadBody = vi.mocked(readBody);

const envSnapshot = {
	DATABASE_URL: process.env.DATABASE_URL,
	NITRO_DATABASE_URL: process.env.NITRO_DATABASE_URL,
	comm_admin_11__DATABASE_URL: process.env.comm_admin_11__DATABASE_URL,
	R2_BUCKET: process.env.R2_BUCKET,
	R2_PUBLIC_BASE_URL: process.env.R2_PUBLIC_BASE_URL,
	R2_ENDPOINT: process.env.R2_ENDPOINT,
	R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
	R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
};

const contractUploadEndpointSpecs = [
	{ url: "/api/property-manage/contract-manage/upload/init", method: "uploadInit" },
	{ url: "/api/property-manage/contract-manage/upload/sign-part", method: "uploadSignPart" },
	{ url: "/api/property-manage/contract-manage/upload/complete", method: "uploadComplete" },
	{ url: "/api/property-manage/contract-manage/upload/abort", method: "uploadAbort" },
	{ url: "/api/property-manage/contract-manage/upload/status", method: "uploadStatus" },
] as const;

describe("property-manage contract-manage upload R2 controls", () => {
	afterEach(() => {
		restoreEnv();
	});

	test("R2 env resolver uses Cloudflare runtime, then process env, then Nitro runtime config", () => {
		clearR2Env();
		runtimeConfigMock.value = {
			r2: {
				bucket: "runtime-bucket",
				endpoint: "https://runtime-r2.example.com",
				accessKeyId: "runtime-access-key",
				secretAccessKey: "runtime-secret-key",
				publicBaseUrl: "https://runtime-files.example.com",
			},
		};

		expect(getR2EnvRequired("R2_BUCKET")).toBe("runtime-bucket");

		process.env.R2_BUCKET = "process-bucket";
		expect(getR2EnvRequired("R2_BUCKET")).toBe("process-bucket");

		const event = createRouteEvent({
			runtimeEnv: {
				R2_BUCKET: "cloudflare-bucket",
				R2_ENDPOINT: "https://cloudflare-r2.example.com",
				R2_ACCESS_KEY_ID: "cloudflare-access-key",
				R2_SECRET_ACCESS_KEY: "cloudflare-secret-key",
				R2_PUBLIC_BASE_URL: "https://cloudflare-files.example.com",
			},
		});

		expect(getR2EnvRequired("R2_BUCKET", event)).toBe("cloudflare-bucket");
		expect(() => createR2Client(event)).not.toThrow();
	});

	test("manifest records upload controls after R2 migration wiring", () => {
		for (const spec of contractUploadEndpointSpecs) {
			expect(runtimeEndpointManifest).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						url: spec.url,
						method: "POST",
						targetClient: "admin",
						routeKind: "admin-canonical",
						ownerModule: "contract",
						phase: "phase7-contract-manage-upload-r2",
						responseContract: "JsonVO",
						cutoverStatus: "available-in-apps-api-not-caller-verified",
					}),
				]),
			);
		}
	});

	test("adapter drives init, reuse, status, sign, complete, and abort through an injected R2 gateway", async () => {
		setR2EnvForMockGateway();
		const uploadedParts: UploadPartState[] = [
			{ partNumber: 1, etag: "etag-1", partSize: 5 },
			{ partNumber: 2, etag: "etag-2", partSize: 5 },
		];
		const gateway = createGatewayFixture(uploadedParts);
		const uploadService = createContractUploadService({
			gateway,
			sessionIdFactory: () => "00000000-0000-4000-8000-000000000101",
			now: () => "2026-05-26T00:00:00.000Z",
		});
		const adapter = createAdminContractAdapter(
			createContractService(createInMemoryContractRepository(), uploadService),
		);
		const initPayload = {
			bizType: "draft_contract",
			fileName: "contract.pdf",
			mimeType: "application/pdf",
			fileSize: 10,
			chunkSize: 5,
			resumeFingerprint: "fingerprint-r2",
		};

		const init = await adapter.uploadInit(initPayload);
		const initData = init.data as { sessionId: string };
		const reused = await adapter.uploadInit(initPayload);
		const reusedData = reused.data as { sessionId: string };
		const status = await adapter.uploadStatus({ sessionId: initData.sessionId });
		const sign = await adapter.uploadSignPart({ sessionId: initData.sessionId, partNumber: 1 });
		const complete = await adapter.uploadComplete({
			sessionId: initData.sessionId,
			attachmentName: "contract attachment",
			attachmentType: "pdf",
			parts: [
				{ partNumber: 1, etag: "etag-1" },
				{ partNumber: 2, etag: "etag-2" },
			],
		});
		const retryComplete = await adapter.uploadComplete({
			sessionId: initData.sessionId,
			attachmentName: "contract attachment",
			attachmentType: "pdf",
			parts: [
				{ partNumber: 1, etag: "etag-1" },
				{ partNumber: 2, etag: "etag-2" },
			],
		});
		const abortCompleted = await adapter.uploadAbort({ sessionId: initData.sessionId });

		expect(init).toMatchObject({
			success: true,
			code: 200,
			data: {
				sessionId: "00000000-0000-4000-8000-000000000101",
				totalParts: 2,
				status: "initiated",
			},
		});
		expect(reusedData.sessionId).toBe(initData.sessionId);
		expect(status).toMatchObject({
			success: true,
			data: {
				status: "uploading",
				uploadedPartsCount: 2,
				missingPartNumbers: [],
			},
		});
		expect(sign).toMatchObject({
			success: true,
			data: {
				partNumber: 1,
				signedUrl: "https://signed.example/00000000-0000-4000-8000-000000000101/1",
				expiresIn: 900,
			},
		});
		expect(complete).toMatchObject({
			success: true,
			data: {
				status: "completed",
				objectEtag: "etag-complete",
				publicUrl: expect.stringContaining("https://files.example.com/contract-manage/draft_contract/"),
			},
		});
		expect(retryComplete).toMatchObject({ success: true, data: { status: "completed" } });
		expect(abortCompleted).toMatchObject({ success: true, data: { status: "completed" } });
		expect(gateway.createMultipartUpload).toHaveBeenCalledTimes(1);
		expect(gateway.completeMultipartUpload).toHaveBeenCalledTimes(1);
		expect(gateway.abortMultipartUpload).not.toHaveBeenCalled();
	});

	test("upload service reads R2 bucket and public url from Cloudflare runtime env", async () => {
		clearR2Env();
		const uploadedParts: UploadPartState[] = [{ partNumber: 1, etag: "etag-1", partSize: 10 }];
		const gateway = createGatewayFixture(uploadedParts);
		const uploadService = createContractUploadService({
			event: createRouteEvent({
				runtimeEnv: {
					R2_BUCKET: "cloudflare-contract-bucket",
					R2_PUBLIC_BASE_URL: "https://cloudflare-files.example.com",
				},
			}),
			gateway,
			sessionIdFactory: () => "00000000-0000-4000-8000-000000000112",
			now: () => "2026-05-26T00:00:00.000Z",
		});

		const init = await uploadService.initUpload({
			bizType: "draft_contract",
			fileName: "contract.pdf",
			mimeType: "application/pdf",
			fileSize: 10,
			chunkSize: 10,
			resumeFingerprint: "fingerprint-cloudflare-r2",
		});
		const complete = await uploadService.completeUpload({
			sessionId: "00000000-0000-4000-8000-000000000112",
			attachmentName: "contract attachment",
			attachmentType: "pdf",
			parts: [{ partNumber: 1, etag: "etag-1" }],
		});

		expect(init).toMatchObject({
			success: true,
			data: {
				sessionId: "00000000-0000-4000-8000-000000000112",
			},
		});
		expect(gateway.createMultipartUpload).toHaveBeenCalledWith(
			expect.objectContaining({ r2Bucket: "cloudflare-contract-bucket" }),
		);
		expect(complete).toMatchObject({
			success: true,
			data: {
				publicUrl: expect.stringContaining("https://cloudflare-files.example.com/contract-manage/draft_contract/"),
			},
		});
	});

	test("service returns a controlled failure when required R2 env is missing", async () => {
		delete process.env.R2_BUCKET;
		const service = createContractUploadService({
			gateway: createGatewayFixture(),
			sessionIdFactory: () => "00000000-0000-4000-8000-000000000102",
		});

		const response = await service.initUpload({
			bizType: "change",
			fileName: "change.pdf",
			mimeType: "application/pdf",
			fileSize: 10,
			chunkSize: 5,
			resumeFingerprint: "fingerprint-missing-env",
		});

		expect(response).toMatchObject({
			success: false,
			code: 500,
			message: "init upload failed",
			data: null,
			error: expect.stringContaining("R2_BUCKET"),
		});
	});

	test("real contract runtime rejects upload control plane when database url is missing", async () => {
		clearDatabaseEnv();
		setR2EnvForMockGateway();
		const runtime = getContractRuntime(createRouteEvent());

		const response = await runtime.service.uploadInit({
			bizType: "draft_contract",
			fileName: "contract.pdf",
			mimeType: "application/pdf",
			fileSize: 10,
			chunkSize: 5,
			resumeFingerprint: "fingerprint-no-db",
		});

		expect(response).toMatchObject({
			success: false,
			code: 503,
			message: "upload persistence unavailable",
			data: null,
			error: expect.stringContaining("Database URL"),
		});
	});

	test("status returns terminal persisted sessions without listing R2 parts", async () => {
		const repository = createInMemoryUploadRepository();
		await repository.createSession(
			uploadSessionFixture({
				id: "00000000-0000-4000-8000-000000000113",
				status: "completed",
				uploadedPartsCount: 1,
				objectEtag: "etag-complete",
				publicUrl: "https://files.example.com/completed.pdf",
				completedAt: "2026-05-26T00:10:00.000Z",
			}),
		);
		await repository.replaceUploadedParts("00000000-0000-4000-8000-000000000113", [
			{ partNumber: 1, etag: "etag-1", partSize: 10 },
		]);
		await repository.createSession(
			uploadSessionFixture({
				id: "00000000-0000-4000-8000-000000000114",
				status: "aborted",
				uploadedPartsCount: 0,
			}),
		);
		await repository.createSession(
			uploadSessionFixture({
				id: "00000000-0000-4000-8000-000000000115",
				status: "expired",
				uploadedPartsCount: 0,
			}),
		);
		const gateway = createGatewayFixture([{ partNumber: 1, etag: "r2-should-not-be-read", partSize: 10 }]);
		const service = createContractUploadService({ repository, gateway });

		const completed = await service.getStatus({ sessionId: "00000000-0000-4000-8000-000000000113" });
		const aborted = await service.getStatus({ sessionId: "00000000-0000-4000-8000-000000000114" });
		const expired = await service.getStatus({ sessionId: "00000000-0000-4000-8000-000000000115" });

		expect(completed).toMatchObject({
			success: true,
			data: {
				status: "completed",
				uploadedParts: [{ partNumber: 1, etag: "etag-1", partSize: 10 }],
				uploadedPartsCount: 1,
			},
		});
		expect(aborted).toMatchObject({ success: true, data: { status: "aborted" } });
		expect(expired).toMatchObject({ success: true, data: { status: "expired" } });
		expect(gateway.listUploadedParts).not.toHaveBeenCalled();
	});

	test("complete rejects client parts that do not exactly match listed R2 parts", async () => {
		setR2EnvForMockGateway();
		const gateway = createGatewayFixture([
			{ partNumber: 1, etag: "etag-1", partSize: 5 },
			{ partNumber: 2, etag: "etag-2", partSize: 5 },
		]);
		const service = createContractUploadService({
			gateway,
			sessionIdFactory: () => "00000000-0000-4000-8000-000000000116",
		});
		const init = await service.initUpload({
			bizType: "draft_contract",
			fileName: "contract.pdf",
			mimeType: "application/pdf",
			fileSize: 10,
			chunkSize: 5,
			resumeFingerprint: "fingerprint-complete-validation",
		});
		const sessionId = String((init.data as { sessionId: string }).sessionId);

		const missing = await service.completeUpload({
			sessionId,
			attachmentName: "contract attachment",
			attachmentType: "pdf",
			parts: [{ partNumber: 1, etag: "etag-1" }],
		});
		const extra = await service.completeUpload({
			sessionId,
			attachmentName: "contract attachment",
			attachmentType: "pdf",
			parts: [
				{ partNumber: 1, etag: "etag-1" },
				{ partNumber: 2, etag: "etag-2" },
				{ partNumber: 3, etag: "etag-3" },
			],
		});
		const mismatch = await service.completeUpload({
			sessionId,
			attachmentName: "contract attachment",
			attachmentType: "pdf",
			parts: [
				{ partNumber: 1, etag: "etag-1" },
				{ partNumber: 2, etag: "wrong-etag" },
			],
		});
		const valid = await service.completeUpload({
			sessionId,
			attachmentName: "contract attachment",
			attachmentType: "pdf",
			parts: [
				{ partNumber: 1, etag: "etag-1" },
				{ partNumber: 2, etag: "etag-2" },
			],
		});

		expect(missing).toMatchObject({
			success: false,
			code: 409,
			error: expect.stringContaining("Missing parts: 2"),
		});
		expect(extra).toMatchObject({
			success: false,
			code: 409,
			error: expect.stringContaining("Unexpected parts: 3"),
		});
		expect(mismatch).toMatchObject({
			success: false,
			code: 409,
			error: expect.stringContaining("ETag mismatch for part 2"),
		});
		expect(valid).toMatchObject({ success: true, data: { status: "completed" } });
		expect(gateway.completeMultipartUpload).toHaveBeenCalledTimes(1);
	});

	test("routes dispatch upload requests through the contract runtime adapter", async () => {
		setDatabaseUrlForInjectedRuntime();
		mockedReadBody
			.mockResolvedValueOnce({ fileName: "contract.pdf" })
			.mockResolvedValueOnce({ sessionId: "SESSION_001", partNumber: 1 })
			.mockResolvedValueOnce({ sessionId: "SESSION_001" })
			.mockResolvedValueOnce({ sessionId: "SESSION_001" })
			.mockResolvedValueOnce({ sessionId: "SESSION_001" });
		const calls: Array<{ method: string; input: Record<string, unknown> }> = [];
		const event = createRouteEvent({
			context: {
				contractRuntime: {
					adminAdapter: {
						uploadInit: async (input: Record<string, unknown>) => recordCall(calls, "uploadInit", input),
						uploadSignPart: async (input: Record<string, unknown>) => recordCall(calls, "uploadSignPart", input),
						uploadComplete: async (input: Record<string, unknown>) => recordCall(calls, "uploadComplete", input),
						uploadAbort: async (input: Record<string, unknown>) => recordCall(calls, "uploadAbort", input),
						uploadStatus: async (input: Record<string, unknown>) => recordCall(calls, "uploadStatus", input),
					},
				},
			},
		});

		await initUploadHandler(event);
		await signPartUploadHandler(event);
		await completeUploadHandler(event);
		await abortUploadHandler(event);
		await statusUploadHandler(event);

		expect(calls).toEqual([
			{ method: "uploadInit", input: { fileName: "contract.pdf" } },
			{ method: "uploadSignPart", input: { sessionId: "SESSION_001", partNumber: 1 } },
			{ method: "uploadComplete", input: { sessionId: "SESSION_001" } },
			{ method: "uploadAbort", input: { sessionId: "SESSION_001" } },
			{ method: "uploadStatus", input: { sessionId: "SESSION_001" } },
		]);
	});

	test("db upload repository touches upload session and part tables", async () => {
		const db = createUploadTableCaptureDb();
		const repository = createDbUploadRepository(db as any);

		await repository.findReusableSession({
			bizType: "draft_contract",
			fileName: "contract.pdf",
			fileSize: 10,
			chunkSize: 5,
			resumeFingerprint: "fingerprint-db",
		});
		await repository.getSession("00000000-0000-4000-8000-000000000103");
		await repository.createSession(uploadSessionFixture());
		await repository.updateSession("00000000-0000-4000-8000-000000000103", { status: "uploading" });
		await repository.listUploadedParts("00000000-0000-4000-8000-000000000103");
		await repository.replaceUploadedParts("00000000-0000-4000-8000-000000000103", [
			{ partNumber: 1, etag: "etag-1", partSize: 5 },
		]);

		expect(db.tables).toEqual(expect.arrayContaining(["ct_upload_sessions", "ct_upload_session_parts"]));
		expect(db.ops).toEqual(expect.arrayContaining(["select", "insert", "update", "delete"]));
	});

	test("buildMissingPartNumbers reports missing multipart gaps", () => {
		expect(buildMissingPartNumbers(4, [{ partNumber: 2, etag: "etag-2", partSize: 5 }])).toEqual([1, 3, 4]);
	});
});

function setR2EnvForMockGateway(): void {
	process.env.R2_BUCKET = "01s-11comm-files";
	process.env.R2_PUBLIC_BASE_URL = "https://files.example.com";
}

function setDatabaseUrlForInjectedRuntime(): void {
	process.env.DATABASE_URL = "postgres://contract-upload-r2.test/runtime";
	delete process.env.NITRO_DATABASE_URL;
	delete process.env.comm_admin_11__DATABASE_URL;
}

function restoreEnv(): void {
	for (const [name, value] of Object.entries(envSnapshot)) {
		restoreEnvVar(name, value);
	}
	runtimeConfigMock.value = {};
	mockedReadBody.mockReset();
}

function clearDatabaseEnv(): void {
	delete process.env.DATABASE_URL;
	delete process.env.NITRO_DATABASE_URL;
	delete process.env.comm_admin_11__DATABASE_URL;
}

function clearR2Env(): void {
	delete process.env.R2_BUCKET;
	delete process.env.R2_PUBLIC_BASE_URL;
	delete process.env.R2_ENDPOINT;
	delete process.env.R2_ACCESS_KEY_ID;
	delete process.env.R2_SECRET_ACCESS_KEY;
}

function restoreEnvVar(name: string, value: string | undefined): void {
	if (value === undefined) {
		delete process.env[name];
		return;
	}
	process.env[name] = value;
}

function createGatewayFixture(uploadedParts: UploadPartState[] = []): UploadGateway & {
	createMultipartUpload: ReturnType<typeof vi.fn>;
	listUploadedParts: ReturnType<typeof vi.fn>;
	signPart: ReturnType<typeof vi.fn>;
	completeMultipartUpload: ReturnType<typeof vi.fn>;
	abortMultipartUpload: ReturnType<typeof vi.fn>;
} {
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

function createRouteEvent(
	options: { context?: Record<string, unknown>; runtimeEnv?: Record<string, string> } = {},
): any {
	return {
		context: options.context ?? {},
		req: {
			runtime: {
				cloudflare: {
					env: options.runtimeEnv ?? {},
				},
			},
		},
		res: {
			headers: new Headers(),
			status: 200,
		},
	};
}

function recordCall(
	calls: Array<{ method: string; input: Record<string, unknown> }>,
	method: string,
	input: Record<string, unknown>,
) {
	calls.push({ method, input });
	return {
		success: true,
		code: 200,
		message: "upload ok",
		data: { ok: true },
	};
}

function uploadSessionFixture(overrides: Partial<UploadSessionRecord> = {}): UploadSessionRecord {
	return {
		id: "00000000-0000-4000-8000-000000000103",
		bizType: "draft_contract",
		bizId: null,
		fileName: "contract.pdf",
		mimeType: "application/pdf",
		fileSize: 10,
		chunkSize: 5,
		totalParts: 2,
		resumeFingerprint: "fingerprint-db",
		r2Bucket: "01s-11comm-files",
		r2ObjectKey: "contract-manage/draft_contract/session/contract.pdf",
		r2UploadId: "r2-upload-id",
		status: "initiated",
		uploadedPartsCount: 0,
		objectEtag: null,
		publicUrl: null,
		completedAt: null,
		expiresAt: "2026-05-27T00:00:00.000Z",
		createdAt: "2026-05-26T00:00:00.000Z",
		updatedAt: "2026-05-26T00:00:00.000Z",
		...overrides,
	};
}

function createUploadTableCaptureDb() {
	const db = {
		ops: [] as string[],
		tables: [] as string[],
		select: vi.fn(() => {
			db.ops.push("select");
			return createQuery(db, []);
		}),
		insert: vi.fn((table: unknown) => {
			db.ops.push("insert");
			db.tables.push(getTableName(table));
			return createWriteQuery([uploadSessionDbRowFixture()]);
		}),
		update: vi.fn((table: unknown) => {
			db.ops.push("update");
			db.tables.push(getTableName(table));
			return createWriteQuery([uploadSessionDbRowFixture({ status: "uploading" })]);
		}),
		delete: vi.fn((table: unknown) => {
			db.ops.push("delete");
			db.tables.push(getTableName(table));
			return createDeleteQuery();
		}),
	};
	return db;
}

function createQuery(db: { tables: string[] }, result: Record<string, unknown>[]) {
	const query = {
		from: vi.fn((table: unknown) => {
			db.tables.push(getTableName(table));
			return query;
		}),
		where: vi.fn(() => query),
		orderBy: vi.fn(() => query),
		limit: vi.fn(() => Promise.resolve(result)),
		then: (onFulfilled: (value: Record<string, unknown>[]) => unknown, onRejected?: (reason: unknown) => unknown) =>
			Promise.resolve(result).then(onFulfilled, onRejected),
	};
	return query;
}

function createWriteQuery(result: Record<string, unknown>[]) {
	const query = {
		values: vi.fn(() => query),
		set: vi.fn(() => query),
		where: vi.fn(() => query),
		returning: vi.fn(async () => result),
	};
	return query;
}

function createDeleteQuery() {
	const query = {
		where: vi.fn(() => query),
	};
	return query;
}

function uploadSessionDbRowFixture(overrides: Record<string, unknown> = {}) {
	return {
		...uploadSessionFixture(),
		createTime: new Date("2026-05-26T00:00:00.000Z"),
		updateTime: new Date("2026-05-26T00:00:00.000Z"),
		expiresAt: new Date("2026-05-27T00:00:00.000Z"),
		completedAt: null,
		...overrides,
	};
}

function getTableName(table: unknown): string {
	if (table && typeof table === "object" && Symbol.for("drizzle:Name") in table) {
		return String((table as Record<symbol, unknown>)[Symbol.for("drizzle:Name")]);
	}
	return String(table);
}
