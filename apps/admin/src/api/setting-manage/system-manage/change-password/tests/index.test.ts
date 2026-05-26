import { afterEach, beforeEach, test, describe } from "vitest";
import { expect, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	httpRequest: vi.fn(),
	useListQuery: vi.fn((options) => options),
}));

vi.mock("@/utils/http", () => ({
	http: {
		request: mocks.httpRequest,
	},
}));

vi.mock("@/composables/use-list-query", () => ({
	useListQuery: mocks.useListQuery,
}));

const API_PREFIX = "/api/setting-manage/system-manage/change-password";
const API_URL = `${API_PREFIX}/list`;

type ChangePasswordApiModule = typeof import("../index");

/** 每次导入前重置模块缓存和环境变量，确保 URL resolver 使用当前用例的 shadow 配置。 */
async function importChangePasswordApi(env: Record<string, string>): Promise<ChangePasswordApiModule> {
	vi.unstubAllEnvs();
	vi.resetModules();

	for (const [key, value] of Object.entries(env)) {
		vi.stubEnv(key, value);
	}

	return import("../index");
}

describe("change-password admin api", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	test("keeps list query on legacy relative api path when shadow is disabled", async () => {
		const { useChangePasswordRecordListQuery } = await importChangePasswordApi({
			VITE_11COMM_API_SHADOW_ENABLE: "false",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useChangePasswordRecordListQuery({});

		/** shadow 关闭时必须保留后台旧相对路径，避免列表 Hook 被提前切到 apps/api。 */
		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "changePasswordRecord",
			apiUrl: API_URL,
			initialParams: {},
		});
	});

	test("resolves list query through the shadow proxy when enabled", async () => {
		const { useChangePasswordRecordListQuery } = await importChangePasswordApi({
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "true",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useChangePasswordRecordListQuery({});

		/** shadow 开启且走代理时，列表 URL 只追加代理前缀，不能改写业务路径主体。 */
		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "changePasswordRecord",
			apiUrl: `/api-shadow${API_URL}`,
			initialParams: {},
		});
	});

	test("resolves list query through the direct apps/api base when enabled", async () => {
		const { useChangePasswordRecordListQuery } = await importChangePasswordApi({
			VITE_11COMM_API_SHADOW_ENABLE: "true",
			VITE_11COMM_API_USE_PROXY: "false",
			VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
			VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
		});

		useChangePasswordRecordListQuery({});

		/** shadow 开启且不走代理时，列表 URL 必须拼接独立 apps/api base。 */
		expect(mocks.useListQuery).toHaveBeenCalledWith({
			queryKeyPrefix: "changePasswordRecord",
			apiUrl: `http://127.0.0.1:3102${API_URL}`,
			initialParams: {},
		});
	});

	test("exports create/update/delete callers resolved through the shadow proxy", async () => {
		const { createChangePasswordRecord, updateChangePasswordRecord, deleteChangePasswordRecord } =
			await importChangePasswordApi({
				VITE_11COMM_API_SHADOW_ENABLE: "true",
				VITE_11COMM_API_USE_PROXY: "true",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			});

		const payload = {
			username: "zhangsan",
			realName: "张三",
			department: "物业团队",
			changeTime: "2026-05-26 10:00:00",
			changeIp: "127.0.0.1",
			changeType: "用户自行修改",
			operator: "admin",
			status: "成功",
			remark: "ok",
		};

		await createChangePasswordRecord(payload);
		await updateChangePasswordRecord({ id: "record-1", ...payload });
		await deleteChangePasswordRecord({ id: "record-1" });

		/** 密码修改记录 CUD 走 shadow 代理时，data 必须原样承载写入字段，删除只发送 data.id。 */
		expect(mocks.httpRequest).toHaveBeenNthCalledWith(1, "post", `/api-shadow${API_PREFIX}/create`, {
			data: payload,
		});
		expect(mocks.httpRequest).toHaveBeenNthCalledWith(2, "post", `/api-shadow${API_PREFIX}/update`, {
			data: { id: "record-1", ...payload },
		});
		expect(mocks.httpRequest).toHaveBeenNthCalledWith(3, "post", `/api-shadow${API_PREFIX}/delete`, {
			data: { id: "record-1" },
		});
	});

	test("resolves create/update/delete callers through direct apps/api base", async () => {
		const { createChangePasswordRecord, updateChangePasswordRecord, deleteChangePasswordRecord } =
			await importChangePasswordApi({
				VITE_11COMM_API_SHADOW_ENABLE: "true",
				VITE_11COMM_API_USE_PROXY: "false",
				VITE_11COMM_API_PROXY_PREFIX: "/api-shadow",
				VITE_11COMM_API_BASE_URL: "http://127.0.0.1:3102",
			});

		await createChangePasswordRecord({ username: "lisi" });
		await updateChangePasswordRecord({ id: "record-2", username: "lisi" });
		await deleteChangePasswordRecord({ id: "record-2" });

		/** 直连 apps/api 时不能再出现代理前缀，CUD payload 仍按 data 原样传递。 */
		expect(mocks.httpRequest).toHaveBeenNthCalledWith(1, "post", `http://127.0.0.1:3102${API_PREFIX}/create`, {
			data: { username: "lisi" },
		});
		expect(mocks.httpRequest).toHaveBeenNthCalledWith(2, "post", `http://127.0.0.1:3102${API_PREFIX}/update`, {
			data: { id: "record-2", username: "lisi" },
		});
		expect(mocks.httpRequest).toHaveBeenNthCalledWith(3, "post", `http://127.0.0.1:3102${API_PREFIX}/delete`, {
			data: { id: "record-2" },
		});
	});
});
