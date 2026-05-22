import { afterEach, describe, expect, test, vi } from "vitest";

import { createAdminContractAdapter } from "../../server/modules/contract/admin-adapter";
import { createInMemoryContractRepository } from "../../server/modules/contract/repository";
import { createContractService } from "../../server/modules/contract/service";
import abortUploadHandler from "../../server/routes/api/property-manage/contract-manage/upload/abort.post";
import completeUploadHandler from "../../server/routes/api/property-manage/contract-manage/upload/complete.post";
import initUploadHandler from "../../server/routes/api/property-manage/contract-manage/upload/init.post";
import signPartUploadHandler from "../../server/routes/api/property-manage/contract-manage/upload/sign-part.post";
import statusUploadHandler from "../../server/routes/api/property-manage/contract-manage/upload/status.post";
import { runtimeEndpointManifest } from "../../server/shared/runtime/runtime-endpoints";

vi.mock("nitro/h3", async (importOriginal) => {
	const actual = await importOriginal<typeof import("nitro/h3")>();
	return {
		...actual,
		readBody: vi.fn(),
	};
});

const { readBody } = await import("nitro/h3");
const mockedReadBody = vi.mocked(readBody);

const envSnapshot = {
	DATABASE_URL: process.env.DATABASE_URL,
	NITRO_DATABASE_URL: process.env.NITRO_DATABASE_URL,
	comm_admin_11__DATABASE_URL: process.env.comm_admin_11__DATABASE_URL,
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

	test("keeps upload controls out of the available runtime manifest until R2 migration is proven", () => {
		for (const spec of contractUploadEndpointSpecs) {
			expect(runtimeEndpointManifest.find((entry) => entry.url === spec.url)).toBeUndefined();
		}
	});

	test("default admin adapter blocks upload controls instead of returning placeholder success", async () => {
		const adapter = createAdminContractAdapter(createContractService(createInMemoryContractRepository()));

		const responses = await Promise.all([
			adapter.uploadInit({ fileName: "contract.pdf", fileSize: 1024 }),
			adapter.uploadSignPart({ uploadId: "mock-upload-id", partNumber: 1 }),
			adapter.uploadComplete({ uploadId: "mock-upload-id" }),
			adapter.uploadAbort({ uploadId: "mock-upload-id" }),
			adapter.uploadStatus({ uploadId: "mock-upload-id" }),
		]);

		for (const response of responses) {
			expect(response).toMatchObject({
				success: false,
				code: 409,
				message: expect.stringContaining("R2"),
				data: null,
			});
		}
		expect(responses).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining({ data: expect.objectContaining({ uploadId: "mock-upload-id" }) }),
				expect.objectContaining({ data: expect.objectContaining({ signedUrl: "" }) }),
				expect.objectContaining({ data: expect.objectContaining({ status: "unknown" }) }),
			]),
		);
	});

	test("routes still dispatch upload requests through the contract runtime adapter", async () => {
		setDatabaseUrlForInjectedRuntime();
		mockedReadBody
			.mockResolvedValueOnce({ fileName: "contract.pdf" })
			.mockResolvedValueOnce({ uploadId: "UPLOAD_001", partNumber: 1 })
			.mockResolvedValueOnce({ uploadId: "UPLOAD_001" })
			.mockResolvedValueOnce({ uploadId: "UPLOAD_001" })
			.mockResolvedValueOnce({ uploadId: "UPLOAD_001" });
		const calls: Array<{ method: string; input: Record<string, unknown> }> = [];
		const event = createRouteEvent({
			context: {
				contractRuntime: {
					adminAdapter: {
						uploadInit: async (input: Record<string, unknown>) => recordBlockedCall(calls, "uploadInit", input),
						uploadSignPart: async (input: Record<string, unknown>) => recordBlockedCall(calls, "uploadSignPart", input),
						uploadComplete: async (input: Record<string, unknown>) => recordBlockedCall(calls, "uploadComplete", input),
						uploadAbort: async (input: Record<string, unknown>) => recordBlockedCall(calls, "uploadAbort", input),
						uploadStatus: async (input: Record<string, unknown>) => recordBlockedCall(calls, "uploadStatus", input),
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
			{ method: "uploadSignPart", input: { uploadId: "UPLOAD_001", partNumber: 1 } },
			{ method: "uploadComplete", input: { uploadId: "UPLOAD_001" } },
			{ method: "uploadAbort", input: { uploadId: "UPLOAD_001" } },
			{ method: "uploadStatus", input: { uploadId: "UPLOAD_001" } },
		]);
	});
});

function setDatabaseUrlForInjectedRuntime(): void {
	process.env.DATABASE_URL = "postgres://contract-upload-r2-blocked.test/runtime";
	delete process.env.NITRO_DATABASE_URL;
	delete process.env.comm_admin_11__DATABASE_URL;
}

function restoreEnv(): void {
	restoreEnvVar("DATABASE_URL", envSnapshot.DATABASE_URL);
	restoreEnvVar("NITRO_DATABASE_URL", envSnapshot.NITRO_DATABASE_URL);
	restoreEnvVar("comm_admin_11__DATABASE_URL", envSnapshot.comm_admin_11__DATABASE_URL);
	mockedReadBody.mockReset();
}

function restoreEnvVar(name: string, value: string | undefined): void {
	if (value === undefined) {
		delete process.env[name];
		return;
	}
	process.env[name] = value;
}

function createRouteEvent(options: { context?: Record<string, unknown> } = {}): any {
	return {
		context: options.context ?? {},
		res: {
			headers: new Headers(),
			status: 200,
		},
	};
}

function recordBlockedCall(
	calls: Array<{ method: string; input: Record<string, unknown> }>,
	method: string,
	input: Record<string, unknown>,
) {
	calls.push({ method, input });
	return {
		success: false,
		code: 409,
		message: "R2 upload is blocked in apps/api",
		data: null,
	};
}
