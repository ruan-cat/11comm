import { afterEach, beforeEach, test, describe } from "vitest";
import { expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

const API_URL = "/api/property-manage/report-manage/arrears-details-list/list";

type ArrearsDetailsListApiModule = typeof import("../index");

async function importArrearsDetailsListApi(env: Record<string, string>): Promise<ArrearsDetailsListApiModule> {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return import("../index");
}

describe("arrears-details-list admin api", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test("keeps list query on legacy relative api path when shadow is disabled", async () => {
		const { useArrearsDetailsListQuery } = await importArrearsDetailsListApi({
			VITE_11COMM_API_SHADOW_ENABLE: "false",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useArrearsDetailsListQuery({ feeNumber: "FEE-1" });

		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "arrearsDetailsList",
			apiUrl: API_URL,
			initialParams: { feeNumber: "FEE-1" },
		});
	});

	test("resolves list query through the shadow proxy when enabled", async () => {
		const { useArrearsDetailsListQuery } = await importArrearsDetailsListApi({
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useArrearsDetailsListQuery({ feeNumber: "FEE-1" });

		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "arrearsDetailsList",
			apiUrl: `/api-shadow${API_URL}`,
			initialParams: { feeNumber: "FEE-1" },
		});
	});

	test("resolves list query through the direct apps/api base when enabled", async () => {
		const { useArrearsDetailsListQuery } = await importArrearsDetailsListApi({
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "false",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useArrearsDetailsListQuery({ feeNumber: "FEE-1" });

		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "arrearsDetailsList",
			apiUrl: `http://127.0.0.1:3102${API_URL}`,
			initialParams: { feeNumber: "FEE-1" },
		});
	});
});
