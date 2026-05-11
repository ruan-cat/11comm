import { afterEach, beforeEach, test, describe } from "vitest";
import { expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

interface ParkingModuleConfig {
	name: string;
	queryKeyPrefix: string;
	apiUrl: string;
	importModule: () => Promise<unknown>;
	useQuery: (mod: unknown) => unknown;
}

const PARKING_MODULES = [
	{
		name: "carport-apply",
		queryKeyPrefix: "carportApply",
		apiUrl: "/api/property-manage/parking-manage/carport-apply/list",
		importModule: () => import("../carport-apply"),
		useQuery: (mod) => (mod as typeof import("../carport-apply")).useCarportApplyListQuery({}),
	},
	{
		name: "carport-info",
		queryKeyPrefix: "carportInfo",
		apiUrl: "/api/property-manage/parking-manage/carport-info/list",
		importModule: () => import("../carport-info"),
		useQuery: (mod) => (mod as typeof import("../carport-info")).useCarportInfoListQuery({}),
	},
	{
		name: "owner-vehicle",
		queryKeyPrefix: "ownerVehicle",
		apiUrl: "/api/property-manage/parking-manage/owner-vehicle/list",
		importModule: () => import("../owner-vehicle"),
		useQuery: (mod) => (mod as typeof import("../owner-vehicle")).useOwnerVehicleListQuery({}),
	},
	{
		name: "parking-lot",
		queryKeyPrefix: "parkingLot",
		apiUrl: "/api/property-manage/parking-manage/parking-lot/list",
		importModule: () => import("../parking-lot"),
		useQuery: (mod) => (mod as typeof import("../parking-lot")).useParkingLotListQuery({}),
	},
] satisfies ParkingModuleConfig[];

async function importParkingModule(moduleConfig: ParkingModuleConfig, env: Record<string, string>) {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return moduleConfig.importModule();
}

describe("phase7 parking admin api shadow resolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test.each(PARKING_MODULES)(
		"keeps $name list query on legacy relative api path when shadow is disabled",
		async (moduleConfig) => {
			const mod = await importParkingModule(moduleConfig, {
				VITE_11COMM_API_SHADOW_ENABLE: "false",
				VITE_11COMM_API_USE_PROXY: "true",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			});

			moduleConfig.useQuery(mod);

			expect(mocks.useListQuery).toHaveBeenCalledWith({
				queryKeyPrefix: moduleConfig.queryKeyPrefix,
				apiUrl: moduleConfig.apiUrl,
				initialParams: {},
			});
		},
	);

	test.each(PARKING_MODULES)(
		"resolves $name list query through the shadow proxy when enabled",
		async (moduleConfig) => {
			const mod = await importParkingModule(moduleConfig, {
				VITE_11COMM_API_SHADOW_ENABLE: "true",
				VITE_11COMM_API_USE_PROXY: "true",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			});

			moduleConfig.useQuery(mod);

			expect(mocks.useListQuery).toHaveBeenCalledWith({
				queryKeyPrefix: moduleConfig.queryKeyPrefix,
				apiUrl: `/api-shadow${moduleConfig.apiUrl}`,
				initialParams: {},
			});
		},
	);

	test.each(PARKING_MODULES)(
		"resolves $name list query through the direct apps/api base when enabled",
		async (moduleConfig) => {
			const mod = await importParkingModule(moduleConfig, {
				VITE_11COMM_API_SHADOW_ENABLE: "true",
				VITE_11COMM_API_USE_PROXY: "false",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			});

			moduleConfig.useQuery(mod);

			expect(mocks.useListQuery).toHaveBeenCalledWith({
				queryKeyPrefix: moduleConfig.queryKeyPrefix,
				apiUrl: `http://127.0.0.1:3102${moduleConfig.apiUrl}`,
				initialParams: {},
			});
		},
	);
});
