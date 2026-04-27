import { afterEach, beforeEach, test, describe } from "vitest";
import { expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	httpPost: vi.fn(),
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

vi.mock("@/utils/http", () => ({
	http: {
		post: mocks.httpPost,
	},
}));

const API_PREFIX = "/api/property-manage/expense-manage/house-charge";

type HouseChargeApiModule = typeof import("../index");

async function importHouseChargeApi(env: Record<string, string>): Promise<HouseChargeApiModule> {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return import("../index");
}

describe("house-charge admin api", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test("keeps list query and detail request on legacy relative api paths when shadow is disabled", async () => {
		const { getHouseChargeDetail, useHouseChargeListQuery } = await importHouseChargeApi({
			VITE_11COMM_API_SHADOW_ENABLE: "false",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useHouseChargeListQuery({ status: "enabled" });

		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "houseCharge",
			apiUrl: `${API_PREFIX}/list`,
			initialParams: { status: "enabled" },
		});
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "HOUSE_CHARGE_001" } });

		await getHouseChargeDetail({ id: "HOUSE_CHARGE_001" });

		expect(mocks.httpPost).toHaveBeenCalledWith(`${API_PREFIX}/detail`, {
			data: { id: "HOUSE_CHARGE_001" },
		});
	});

	test("resolves list query and detail request through the shadow proxy when enabled", async () => {
		const { getHouseChargeDetail, useHouseChargeListQuery } = await importHouseChargeApi({
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useHouseChargeListQuery({ status: "enabled" });

		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "houseCharge",
			apiUrl: `/api-shadow${API_PREFIX}/list`,
			initialParams: { status: "enabled" },
		});
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "HOUSE_CHARGE_001" } });

		await getHouseChargeDetail({ id: "HOUSE_CHARGE_001" });

		expect(mocks.httpPost).toHaveBeenCalledWith(`/api-shadow${API_PREFIX}/detail`, {
			data: { id: "HOUSE_CHARGE_001" },
		});
	});

	test("resolves list query and detail request through the direct apps/api base when enabled", async () => {
		const { getHouseChargeDetail, useHouseChargeListQuery } = await importHouseChargeApi({
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "false",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useHouseChargeListQuery({ status: "enabled" });

		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "houseCharge",
			apiUrl: `http://127.0.0.1:3102${API_PREFIX}/list`,
			initialParams: { status: "enabled" },
		});
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "HOUSE_CHARGE_001" } });

		await getHouseChargeDetail({ id: "HOUSE_CHARGE_001" });

		expect(mocks.httpPost).toHaveBeenCalledWith(`http://127.0.0.1:3102${API_PREFIX}/detail`, {
			data: { id: "HOUSE_CHARGE_001" },
		});
	});
});
