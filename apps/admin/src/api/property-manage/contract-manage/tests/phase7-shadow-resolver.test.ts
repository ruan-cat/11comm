import { test, describe } from "vitest";
import { afterEach, beforeEach, expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

interface ContractManageModuleConfig {
	name: string;
	queryKeyPrefix: string;
	apiUrl: string;
	importModule: () => Promise<unknown>;
	useQuery: (mod: unknown) => unknown;
}

const CONTRACT_MANAGE_MODULES = [
	{
		name: "type",
		queryKeyPrefix: "type",
		apiUrl: "/api/property-manage/contract-manage/type/list",
		importModule: () => import("../type"),
		useQuery: (mod) => (mod as typeof import("../type")).useTypeListQuery({}),
	},
	{
		name: "second-party",
		queryKeyPrefix: "secondParty",
		apiUrl: "/api/property-manage/contract-manage/second-party/list",
		importModule: () => import("../second-party"),
		useQuery: (mod) => (mod as typeof import("../second-party")).useSecondPartyListQuery({}),
	},
	{
		name: "template",
		queryKeyPrefix: "template",
		apiUrl: "/api/property-manage/contract-manage/template/list",
		importModule: () => import("../template"),
		useQuery: (mod) => (mod as typeof import("../template")).useTemplateListQuery({}),
	},
	{
		name: "review",
		queryKeyPrefix: "review",
		apiUrl: "/api/property-manage/contract-manage/review/list",
		importModule: () => import("../review"),
		useQuery: (mod) => (mod as typeof import("../review")).useReviewListQuery({}),
	},
	{
		name: "first-party",
		queryKeyPrefix: "first-party",
		apiUrl: "/api/property-manage/contract-manage/first-party/list",
		importModule: () => import("../first-party"),
		useQuery: (mod) => (mod as typeof import("../first-party")).useFirstPartyListQuery({}),
	},
	{
		name: "print",
		queryKeyPrefix: "print",
		apiUrl: "/api/property-manage/contract-manage/print/list",
		importModule: () => import("../print"),
		useQuery: (mod) => (mod as typeof import("../print")).usePrintListQuery({}),
	},
	{
		name: "expire",
		queryKeyPrefix: "expire",
		apiUrl: "/api/property-manage/contract-manage/expire/list",
		importModule: () => import("../expire"),
		useQuery: (mod) => (mod as typeof import("../expire")).useExpireListQuery({}),
	},
	{
		name: "clause",
		queryKeyPrefix: "clause",
		apiUrl: "/api/property-manage/contract-manage/clause/list",
		importModule: () => import("../clause"),
		useQuery: (mod) => (mod as typeof import("../clause")).useClauseListQuery({}),
	},
	{
		name: "draft-contract",
		queryKeyPrefix: "draft-contract",
		apiUrl: "/api/property-manage/contract-manage/draft-contract/list",
		importModule: () => import("../draft-contract"),
		useQuery: (mod) => (mod as typeof import("../draft-contract")).useDraftContractListQuery({}),
	},
	{
		name: "archive",
		queryKeyPrefix: "archive",
		apiUrl: "/api/property-manage/contract-manage/archive/list",
		importModule: () => import("../archive"),
		useQuery: (mod) => (mod as typeof import("../archive")).useArchiveListQuery({}),
	},
	{
		name: "attachment",
		queryKeyPrefix: "attachment",
		apiUrl: "/api/property-manage/contract-manage/attachment/list",
		importModule: () => import("../attachment"),
		useQuery: (mod) => (mod as typeof import("../attachment")).useAttachmentListQuery({}),
	},
] satisfies ContractManageModuleConfig[];

async function importContractManageModule(moduleConfig: ContractManageModuleConfig, env: Record<string, string>) {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return moduleConfig.importModule();
}

describe("phase7 contract-manage admin api shadow resolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test.each(CONTRACT_MANAGE_MODULES)(
		"keeps $name list query on legacy relative api path when shadow is disabled",
		async (moduleConfig) => {
			const mod = await importContractManageModule(moduleConfig, {
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

	test.each(CONTRACT_MANAGE_MODULES)(
		"resolves $name list query through the shadow proxy when enabled",
		async (moduleConfig) => {
			const mod = await importContractManageModule(moduleConfig, {
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

	test.each(CONTRACT_MANAGE_MODULES)(
		"resolves $name list query through the direct apps/api base when enabled",
		async (moduleConfig) => {
			const mod = await importContractManageModule(moduleConfig, {
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
