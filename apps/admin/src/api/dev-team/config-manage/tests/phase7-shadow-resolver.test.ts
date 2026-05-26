import { afterEach, beforeEach, test, describe } from "vitest";
import { expect, vi } from "vitest";

/** 隔离真实请求和列表 Hook，只验证 API hook 传入的 URL、查询键和 payload 形态。 */
const mocks = vi.hoisted(() => ({
	httpGet: vi.fn(),
	httpPost: vi.fn(),
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

vi.mock("@/utils/http", () => ({
	http: {
		get: mocks.httpGet,
		post: mocks.httpPost,
	},
}));

interface ConfigManageModuleConfig {
	name: string;
	queryKeyPrefix: string;
	apiUrl: string;
	importModule: () => Promise<unknown>;
	useQuery: (mod: unknown) => unknown;
}

/** 配置管理模块矩阵，统一覆盖类型、配置项、配置中心和字典四类 API hook。 */
const CONFIG_MANAGE_MODULES = [
	{
		name: "type",
		queryKeyPrefix: "dictionaryType",
		apiUrl: "/api/dev-team/config-manage/type/list",
		importModule: () => import("../type"),
		useQuery: (mod) => (mod as typeof import("../type")).useDictionaryTypeListQuery({}),
	},
	{
		name: "item",
		queryKeyPrefix: "configItem",
		apiUrl: "/api/dev-team/config-manage/item/list",
		importModule: () => import("../item"),
		useQuery: (mod) => (mod as typeof import("../item")).useConfigItemListQuery({}),
	},
	{
		name: "center",
		queryKeyPrefix: "configCenter",
		apiUrl: "/api/dev-team/config-manage/center/list",
		importModule: () => import("../center"),
		useQuery: (mod) => (mod as typeof import("../center")).useConfigCenterListQuery({}),
	},
	{
		name: "dictionary",
		queryKeyPrefix: "dictionary",
		apiUrl: "/api/dev-team/config-manage/dictionary/list",
		importModule: () => import("../dictionary"),
		useQuery: (mod) => (mod as typeof import("../dictionary")).useDictionaryListQuery({}),
	},
] satisfies ConfigManageModuleConfig[];

/** 每次导入前重置模块缓存和环境变量，确保 URL resolver 使用当前用例的 shadow 配置。 */
async function importConfigManageModule(moduleConfig: ConfigManageModuleConfig, env: Record<string, string>) {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return moduleConfig.importModule();
}

describe("phase7 dev-team config-manage admin api shadow resolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test.each(CONFIG_MANAGE_MODULES)(
		"keeps $name list query on legacy relative api path when shadow is disabled",
		async (moduleConfig) => {
			const mod = await importConfigManageModule(moduleConfig, {
				VITE_11COMM_API_SHADOW_ENABLE: "false",
				VITE_11COMM_API_USE_PROXY: "true",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			});

			moduleConfig.useQuery(mod);

			/** shadow 关闭时必须保留后台旧相对路径，避免页面层列表 Hook 被提前切到 apps/api。 */
			expect(mocks.useListQuery).toHaveBeenCalledWith({
				queryKeyPrefix: moduleConfig.queryKeyPrefix,
				apiUrl: moduleConfig.apiUrl,
				initialParams: {},
			});
		},
	);

	test.each(CONFIG_MANAGE_MODULES)(
		"resolves $name list query through the shadow proxy when enabled",
		async (moduleConfig) => {
			const mod = await importConfigManageModule(moduleConfig, {
				VITE_11COMM_API_SHADOW_ENABLE: "true",
				VITE_11COMM_API_USE_PROXY: "true",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			});

			moduleConfig.useQuery(mod);

			/** shadow 开启且走代理时，列表 URL 只追加代理前缀，不能改写业务路径主体。 */
			expect(mocks.useListQuery).toHaveBeenCalledWith({
				queryKeyPrefix: moduleConfig.queryKeyPrefix,
				apiUrl: `/api-shadow${moduleConfig.apiUrl}`,
				initialParams: {},
			});
		},
	);

	test.each(CONFIG_MANAGE_MODULES)(
		"resolves $name list query through the direct apps/api base when enabled",
		async (moduleConfig) => {
			const mod = await importConfigManageModule(moduleConfig, {
				VITE_11COMM_API_SHADOW_ENABLE: "true",
				VITE_11COMM_API_USE_PROXY: "false",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			});

			moduleConfig.useQuery(mod);

			/** shadow 开启且不走代理时，列表 URL 必须拼接独立 apps/api base。 */
			expect(mocks.useListQuery).toHaveBeenCalledWith({
				queryKeyPrefix: moduleConfig.queryKeyPrefix,
				apiUrl: `http://127.0.0.1:3102${moduleConfig.apiUrl}`,
				initialParams: {},
			});
		},
	);

	test("resolves item detail/create/update/delete through the shadow proxy when enabled", async () => {
		const mod = (await importConfigManageModule(CONFIG_MANAGE_MODULES[1], {
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		})) as Record<string, (payload: Record<string, unknown>) => Promise<unknown>>;

		mocks.httpGet.mockResolvedValueOnce({ code: 200, data: { id: "ITEM_001" } });
		await mod.getConfigItemDetail({ id: "ITEM_001" });
		const createPayload = {
			dictionaryId: "DICT_001",
			itemName: "启用",
			itemCode: "enabled",
			sortOrder: 1,
			isDefault: true,
		};
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "ITEM_001" } });
		await mod.createConfigItem(createPayload);
		const updatePayload = { id: "ITEM_001", itemName: "禁用", itemCode: "disabled" };
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "ITEM_001" } });
		await mod.updateConfigItem(updatePayload);
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: null });
		await mod.deleteConfigItem({ id: "ITEM_001" });

		/** 配置项 CUD 调用必须保留原始 data payload，删除接口只透传 data.id。 */
		expect(mocks.httpGet).toHaveBeenCalledWith("/api-shadow/api/dev-team/config-manage/item/detail", {
			params: { id: "ITEM_001" },
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(1, "/api-shadow/api/dev-team/config-manage/item/create", {
			data: createPayload,
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(2, "/api-shadow/api/dev-team/config-manage/item/update", {
			data: updatePayload,
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(3, "/api-shadow/api/dev-team/config-manage/item/delete", {
			data: { id: "ITEM_001" },
		});
	});

	test("resolves type detail/create/update/delete through the shadow proxy when enabled", async () => {
		const mod = (await importConfigManageModule(CONFIG_MANAGE_MODULES[0], {
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		})) as Record<string, (payload: Record<string, unknown>) => Promise<unknown>>;

		mocks.httpGet.mockResolvedValueOnce({ code: 200, data: { id: "TYPE_001" } });
		await mod.getDictionaryTypeDetail({ id: "TYPE_001" });
		const createPayload = {
			typeName: "System Config",
			typeCode: "system",
			typeDescription: "System level config",
			sortOrder: 1,
		};
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "TYPE_001" } });
		await mod.createDictionaryType(createPayload);
		const updatePayload = { id: "TYPE_001", typeName: "Database Config", typeCode: "database" };
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "TYPE_001" } });
		await mod.updateDictionaryType(updatePayload);
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: null });
		await mod.deleteDictionaryType({ id: "TYPE_001" });

		/** 配置类型 shadow 代理路径和 create/update/delete 的 data 映射需要同时被锁定。 */
		expect(mocks.httpGet).toHaveBeenCalledWith("/api-shadow/api/dev-team/config-manage/type/detail", {
			params: { id: "TYPE_001" },
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(1, "/api-shadow/api/dev-team/config-manage/type/create", {
			data: createPayload,
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(2, "/api-shadow/api/dev-team/config-manage/type/update", {
			data: updatePayload,
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(3, "/api-shadow/api/dev-team/config-manage/type/delete", {
			data: { id: "TYPE_001" },
		});
	});

	test("resolves type detail/create/update/delete through the direct apps/api base when enabled", async () => {
		const mod = (await importConfigManageModule(CONFIG_MANAGE_MODULES[0], {
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "false",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		})) as Record<string, (payload: Record<string, unknown>) => Promise<unknown>>;

		mocks.httpGet.mockResolvedValueOnce({ code: 200, data: { id: "TYPE_001" } });
		await mod.getDictionaryTypeDetail({ id: "TYPE_001" });
		mocks.httpPost.mockResolvedValue({ code: 200, data: { id: "TYPE_001" } });
		await mod.createDictionaryType({ typeName: "System Config", typeCode: "system" });
		await mod.updateDictionaryType({ id: "TYPE_001", typeName: "Database Config" });
		await mod.deleteDictionaryType({ id: "TYPE_001" });

		/** 直连 apps/api 时不能再出现代理前缀，CUD payload 仍按 data 原样传递。 */
		expect(mocks.httpGet).toHaveBeenCalledWith("http://127.0.0.1:3102/api/dev-team/config-manage/type/detail", {
			params: { id: "TYPE_001" },
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(1, "http://127.0.0.1:3102/api/dev-team/config-manage/type/create", {
			data: { typeName: "System Config", typeCode: "system" },
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(2, "http://127.0.0.1:3102/api/dev-team/config-manage/type/update", {
			data: { id: "TYPE_001", typeName: "Database Config" },
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(3, "http://127.0.0.1:3102/api/dev-team/config-manage/type/delete", {
			data: { id: "TYPE_001" },
		});
	});

	test("resolves item detail/create/update/delete through the direct apps/api base when enabled", async () => {
		const mod = (await importConfigManageModule(CONFIG_MANAGE_MODULES[1], {
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "false",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		})) as Record<string, (payload: Record<string, unknown>) => Promise<unknown>>;

		mocks.httpGet.mockResolvedValueOnce({ code: 200, data: { id: "ITEM_001" } });
		await mod.getConfigItemDetail({ id: "ITEM_001" });
		mocks.httpPost.mockResolvedValue({ code: 200, data: { id: "ITEM_001" } });
		await mod.createConfigItem({ dictionaryId: "DICT_001", itemName: "启用", itemCode: "enabled" });
		await mod.updateConfigItem({ id: "ITEM_001", itemName: "禁用", itemCode: "disabled" });
		await mod.deleteConfigItem({ id: "ITEM_001" });

		/** 配置项直连模式同时验证详情 params、写入 data 和删除 data.id 的边界。 */
		expect(mocks.httpGet).toHaveBeenCalledWith("http://127.0.0.1:3102/api/dev-team/config-manage/item/detail", {
			params: { id: "ITEM_001" },
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(1, "http://127.0.0.1:3102/api/dev-team/config-manage/item/create", {
			data: { dictionaryId: "DICT_001", itemName: "启用", itemCode: "enabled" },
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(2, "http://127.0.0.1:3102/api/dev-team/config-manage/item/update", {
			data: { id: "ITEM_001", itemName: "禁用", itemCode: "disabled" },
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(3, "http://127.0.0.1:3102/api/dev-team/config-manage/item/delete", {
			data: { id: "ITEM_001" },
		});
	});

	test("resolves center detail/create/update/delete through the shadow proxy when enabled", async () => {
		const mod = (await importConfigManageModule(CONFIG_MANAGE_MODULES[2], {
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		})) as Record<string, (payload: Record<string, unknown>) => Promise<unknown>>;

		mocks.httpGet.mockResolvedValueOnce({ code: 200, data: { id: "CENTER_001" } });
		await mod.getConfigCenterDetail({ id: "CENTER_001" });
		const createPayload = { configName: "系统名称", configKey: "system.name", status: "enabled" };
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "CENTER_001" } });
		await mod.createConfigCenter(createPayload);
		const updatePayload = { id: "CENTER_001", status: "disabled" };
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "CENTER_001" } });
		await mod.updateConfigCenter(updatePayload);
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: null });
		await mod.deleteConfigCenter({ id: "CENTER_001" });

		/** 配置中心 shadow 代理路径和 CUD data 映射必须与正式接口保持一致。 */
		expect(mocks.httpGet).toHaveBeenCalledWith("/api-shadow/api/dev-team/config-manage/center/detail", {
			params: { id: "CENTER_001" },
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(1, "/api-shadow/api/dev-team/config-manage/center/create", {
			data: createPayload,
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(2, "/api-shadow/api/dev-team/config-manage/center/update", {
			data: updatePayload,
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(3, "/api-shadow/api/dev-team/config-manage/center/delete", {
			data: { id: "CENTER_001" },
		});
	});

	test("resolves center detail/create/update/delete through the direct apps/api base when enabled", async () => {
		const mod = (await importConfigManageModule(CONFIG_MANAGE_MODULES[2], {
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "false",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		})) as Record<string, (payload: Record<string, unknown>) => Promise<unknown>>;

		mocks.httpGet.mockResolvedValueOnce({ code: 200, data: { id: "CENTER_001" } });
		await mod.getConfigCenterDetail({ id: "CENTER_001" });
		mocks.httpPost.mockResolvedValue({ code: 200, data: { id: "CENTER_001" } });
		await mod.createConfigCenter({ configName: "系统名称" });
		await mod.updateConfigCenter({ id: "CENTER_001", status: "disabled" });
		await mod.deleteConfigCenter({ id: "CENTER_001" });

		/** 配置中心直连模式锁定 base URL 拼接规则，并确认删除只发送 data.id。 */
		expect(mocks.httpGet).toHaveBeenCalledWith("http://127.0.0.1:3102/api/dev-team/config-manage/center/detail", {
			params: { id: "CENTER_001" },
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(
			1,
			"http://127.0.0.1:3102/api/dev-team/config-manage/center/create",
			{ data: { configName: "系统名称" } },
		);
		expect(mocks.httpPost).toHaveBeenNthCalledWith(
			2,
			"http://127.0.0.1:3102/api/dev-team/config-manage/center/update",
			{ data: { id: "CENTER_001", status: "disabled" } },
		);
		expect(mocks.httpPost).toHaveBeenNthCalledWith(
			3,
			"http://127.0.0.1:3102/api/dev-team/config-manage/center/delete",
			{ data: { id: "CENTER_001" } },
		);
	});

	test("resolves dictionary detail/create/update/delete through the shadow proxy when enabled", async () => {
		const mod = (await importConfigManageModule(CONFIG_MANAGE_MODULES[3], {
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		})) as Record<string, (payload: Record<string, unknown>) => Promise<unknown>>;

		mocks.httpGet.mockResolvedValueOnce({ code: 200, data: { id: "DICT_001" } });
		await mod.getDictionaryDetail({ id: "DICT_001" });
		const createPayload = { dictionaryName: "系统字典", dictionaryCode: "SYS", dictionaryType: "system" };
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "DICT_001" } });
		await mod.createDictionary(createPayload);
		const updatePayload = { id: "DICT_001", dictionaryName: "业务字典" };
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: { id: "DICT_001" } });
		await mod.updateDictionary(updatePayload);
		mocks.httpPost.mockResolvedValueOnce({ code: 200, data: null });
		await mod.deleteDictionary({ id: "DICT_001" });

		/** 字典 shadow 代理路径和 create/update/delete 的 data 映射需要同时被锁定。 */
		expect(mocks.httpGet).toHaveBeenCalledWith("/api-shadow/api/dev-team/config-manage/dictionary/detail", {
			params: { id: "DICT_001" },
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(1, "/api-shadow/api/dev-team/config-manage/dictionary/create", {
			data: createPayload,
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(2, "/api-shadow/api/dev-team/config-manage/dictionary/update", {
			data: updatePayload,
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(3, "/api-shadow/api/dev-team/config-manage/dictionary/delete", {
			data: { id: "DICT_001" },
		});
	});

	test("resolves dictionary detail/create/update/delete through the direct apps/api base when enabled", async () => {
		const mod = (await importConfigManageModule(CONFIG_MANAGE_MODULES[3], {
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "false",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		})) as Record<string, (payload: Record<string, unknown>) => Promise<unknown>>;

		mocks.httpGet.mockResolvedValueOnce({ code: 200, data: { id: "DICT_001" } });
		await mod.getDictionaryDetail({ id: "DICT_001" });
		mocks.httpPost.mockResolvedValue({ code: 200, data: { id: "DICT_001" } });
		await mod.createDictionary({ dictionaryName: "系统字典", dictionaryCode: "SYS" });
		await mod.updateDictionary({ id: "DICT_001", dictionaryName: "业务字典" });
		await mod.deleteDictionary({ id: "DICT_001" });

		/** 字典直连模式验证 URL resolver 不影响业务 payload 透传语义。 */
		expect(mocks.httpGet).toHaveBeenCalledWith("http://127.0.0.1:3102/api/dev-team/config-manage/dictionary/detail", {
			params: { id: "DICT_001" },
		});
		expect(mocks.httpPost).toHaveBeenNthCalledWith(
			1,
			"http://127.0.0.1:3102/api/dev-team/config-manage/dictionary/create",
			{ data: { dictionaryName: "系统字典", dictionaryCode: "SYS" } },
		);
		expect(mocks.httpPost).toHaveBeenNthCalledWith(
			2,
			"http://127.0.0.1:3102/api/dev-team/config-manage/dictionary/update",
			{ data: { id: "DICT_001", dictionaryName: "业务字典" } },
		);
		expect(mocks.httpPost).toHaveBeenNthCalledWith(
			3,
			"http://127.0.0.1:3102/api/dev-team/config-manage/dictionary/delete",
			{ data: { id: "DICT_001" } },
		);
	});
});
