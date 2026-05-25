import { test, describe } from "vitest";
import { afterEach, beforeEach, expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	httpPost: vi.fn(async () => ({ data: { id: "DRAFT_DETAIL_001" } })),
	useMutation: vi.fn((options) => options),
}));

function getMutationFn<TPayload>(callIndex: number) {
	const options = mocks.useMutation.mock.calls[callIndex]?.[0] as
		| { mutationFn?: (payload: TPayload) => Promise<unknown> }
		| undefined;

	if (!options?.mutationFn) {
		throw new Error(`Missing mutationFn for call ${callIndex}`);
	}

	return options.mutationFn;
}

vi.mock("@/utils/http", () => ({
	http: {
		post: mocks.httpPost,
	},
}));

vi.mock("@tanstack/vue-query", () => ({
	useMutation: mocks.useMutation,
	useQuery: vi.fn((options) => options),
}));

async function importDraftContractApi(env: Record<string, string>) {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return import("../api");
}

describe("draft-contract page api resolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test("keeps legacy relative api paths when admin shadow is disabled", async () => {
		const mod = await importDraftContractApi({
			VITE_11COMM_API_SHADOW_ENABLE: "false",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		await mod.fetchDraftContractDetail("DRAFT_001");

		expect(mocks.httpPost).toHaveBeenCalledWith("/api/property-manage/contract-manage/draft-contract/detail", {
			data: { id: "DRAFT_001" },
		});
	});

	test("resolves detail and mutation endpoints through the shadow proxy when enabled", async () => {
		const mod = await importDraftContractApi({
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		await mod.fetchDraftContractDetail("DRAFT_001");
		mod.useDraftContractCreateMutation();
		await getMutationFn<{ contractName: string }>(0)({ contractName: "new-contract" });
		mod.useDraftContractUpdateMutation();
		await getMutationFn<{ id: string; contractName: string }>(1)({
			id: "DRAFT_001",
			contractName: "updated-contract",
		});
		mod.useDraftContractDeleteMutation();
		await getMutationFn<{ id: string }>(2)({ id: "DRAFT_001" });

		expect(mocks.httpPost).toHaveBeenNthCalledWith(
			1,
			"/api-shadow/api/property-manage/contract-manage/draft-contract/detail",
			{ data: { id: "DRAFT_001" } },
		);
		expect(mocks.httpPost).toHaveBeenNthCalledWith(
			2,
			"/api-shadow/api/property-manage/contract-manage/draft-contract/create",
			{ data: { contractName: "new-contract" } },
		);
		expect(mocks.httpPost).toHaveBeenNthCalledWith(
			3,
			"/api-shadow/api/property-manage/contract-manage/draft-contract/update",
			{ data: { id: "DRAFT_001", contractName: "updated-contract" } },
		);
		expect(mocks.httpPost).toHaveBeenNthCalledWith(
			4,
			"/api-shadow/api/property-manage/contract-manage/draft-contract/delete",
			{ data: { id: "DRAFT_001" } },
		);
	});

	test("resolves detail through the direct apps/api base when proxy is disabled", async () => {
		const mod = await importDraftContractApi({
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "false",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		await mod.fetchDraftContractDetail("DRAFT_001");

		expect(mocks.httpPost).toHaveBeenCalledWith(
			"http://127.0.0.1:3102/api/property-manage/contract-manage/draft-contract/detail",
			{ data: { id: "DRAFT_001" } },
		);
	});
});
