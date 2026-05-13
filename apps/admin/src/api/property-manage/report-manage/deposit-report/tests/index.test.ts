import { afterEach, beforeEach, test, describe } from "vitest";
import { expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

const API_URL = "/api/property-manage/report-manage/deposit-report/list";

type DepositReportApiModule = typeof import("../index");

async function importDepositReportApi(env: Record<string, string>): Promise<DepositReportApiModule> {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return import("../index");
}

describe("deposit-report admin api", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test("keeps list query on legacy relative api path when shadow is disabled", async () => {
		const { useDepositReportListQuery } = await importDepositReportApi({
			VITE_11COMM_API_SHADOW_ENABLE: "false",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useDepositReportListQuery({ name: "deposit" });

		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "depositReport",
			apiUrl: API_URL,
			initialParams: { name: "deposit" },
		});
	});

	test("resolves list query through the shadow proxy when enabled", async () => {
		const { useDepositReportListQuery } = await importDepositReportApi({
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useDepositReportListQuery({ name: "deposit" });

		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "depositReport",
			apiUrl: `/api-shadow${API_URL}`,
			initialParams: { name: "deposit" },
		});
	});

	test("resolves list query through the direct apps/api base when enabled", async () => {
		const { useDepositReportListQuery } = await importDepositReportApi({
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "false",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useDepositReportListQuery({ name: "deposit" });

		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "depositReport",
			apiUrl: `http://127.0.0.1:3102${API_URL}`,
			initialParams: { name: "deposit" },
		});
	});
});
