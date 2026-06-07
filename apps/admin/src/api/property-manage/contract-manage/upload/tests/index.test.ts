import { test, describe } from "vitest";
import { afterEach, beforeEach, expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	httpPost: vi.fn(async () => ({ data: { sessionId: "UPLOAD_SESSION_001" } })),
}));

vi.mock("@/utils/http", () => ({
	http: {
		post: mocks.httpPost,
	},
}));

/** 每次重新导入 upload API，确保模块级 BASE_URL 使用当前测试注入的环境变量。 */
async function importUploadApi(env: Record<string, string>) {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return import("../index");
}

async function callUploadEndpoints(mod: typeof import("../index")) {
	await mod.uploadInit({
		bizType: "draft_contract",
		fileName: "contract.pdf",
		mimeType: "application/pdf",
		fileSize: 6 * 1024 * 1024,
		chunkSize: 5 * 1024 * 1024,
		resumeFingerprint: "fingerprint-001",
	});
	await mod.uploadStatus({ sessionId: "UPLOAD_SESSION_001" });
	await mod.uploadSignPart({ sessionId: "UPLOAD_SESSION_001", partNumber: 1 });
	await mod.uploadComplete({
		sessionId: "UPLOAD_SESSION_001",
		parts: [{ partNumber: 1, etag: "etag-001" }],
		attachmentName: "contract.pdf",
		attachmentType: "pdf",
	});
	await mod.uploadAbort({ sessionId: "UPLOAD_SESSION_001" });
}

describe("contract upload api resolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test("resolves upload endpoints through the admin shadow proxy", async () => {
		const mod = await importUploadApi({
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		await callUploadEndpoints(mod);

		expectUploadEndpointUrls("/api-shadow/api/property-manage/contract-manage/upload");
	});

	test("resolves upload endpoints through the direct apps/api base", async () => {
		const mod = await importUploadApi({
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "false",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		await callUploadEndpoints(mod);

		expectUploadEndpointUrls("http://127.0.0.1:3102/api/property-manage/contract-manage/upload");
	});

	test("keeps upload endpoints on apps/api when shadow is disabled but standalone is enabled", async () => {
		const mod = await importUploadApi({
			VITE_11COMM_API_SHADOW_ENABLE: "false",
			VITE_11COMM_API_STANDALONE_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		await callUploadEndpoints(mod);

		expectUploadEndpointUrls("http://127.0.0.1:3102/api/property-manage/contract-manage/upload");
	});
});

function expectUploadEndpointUrls(baseUrl: string) {
	expect(mocks.httpPost).toHaveBeenNthCalledWith(1, `${baseUrl}/init`, {
		data: {
			bizType: "draft_contract",
			fileName: "contract.pdf",
			mimeType: "application/pdf",
			fileSize: 6 * 1024 * 1024,
			chunkSize: 5 * 1024 * 1024,
			resumeFingerprint: "fingerprint-001",
		},
	});
	expect(mocks.httpPost).toHaveBeenNthCalledWith(2, `${baseUrl}/status`, {
		data: { sessionId: "UPLOAD_SESSION_001" },
	});
	expect(mocks.httpPost).toHaveBeenNthCalledWith(3, `${baseUrl}/sign-part`, {
		data: { sessionId: "UPLOAD_SESSION_001", partNumber: 1 },
	});
	expect(mocks.httpPost).toHaveBeenNthCalledWith(4, `${baseUrl}/complete`, {
		data: {
			sessionId: "UPLOAD_SESSION_001",
			parts: [{ partNumber: 1, etag: "etag-001" }],
			attachmentName: "contract.pdf",
			attachmentType: "pdf",
		},
	});
	expect(mocks.httpPost).toHaveBeenNthCalledWith(5, `${baseUrl}/abort`, {
		data: { sessionId: "UPLOAD_SESSION_001" },
	});
}
