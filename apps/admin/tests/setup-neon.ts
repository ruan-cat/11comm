import { vi } from "vitest";
import { config } from "@dotenvx/dotenvx";
import { resolve } from "node:path";

const adminDir = process.cwd();

/**
 * 加载旧 admin Nitro HTTP 测试环境变量。
 *
 * 该 helper 只服务 `tests/nitro/**` 历史对照套件。当前 admin 包不再通过
 * `vitest.config.ts` 暴露这批测试入口，现行 API/DB/R2 验证必须迁到
 * `apps/api/tests/**`。
 */
function loadVercelEnv() {
	// 加载项目级别环境变量
	config({ path: resolve(adminDir, ".env") });
	// 加载从 Vercel 拉取的环境变量
	config({ path: resolve(adminDir, ".env.vercel.local") });
}

// 在测试环境加载环境变量
loadVercelEnv();

/**
 * 旧 Nitro 服务器地址配置。
 *
 * 这里仍保留 `localhost:8080` 仅用于阅读历史测试意图。删除
 * `apps/admin/server/**` 前不应再把这批旧 HTTP 测试作为门禁；请使用
 * `apps/api/tests/admin/**`、`apps/api/tests/infra/**` 和 admin 调用端
 * resolver/shared-upload 单测替代。
 *
 * 测试代码中可以这样使用:
 * ```typescript
 * import { fetchNitroApi } from './tests/setup-neon'
 *
 * // 在测试中调用 Nitro 接口
 * const response = await fetchNitroApi('/api/dev-team/menu-manage/catalog/list')
 * ```
 */
const NITRO_PORT = process.env.VITE_PORT || "8080";
export const NITRO_BASE_URL = `http://localhost:${NITRO_PORT}`;

/**
 * 辅助函数：在测试中调用 Nitro API
 *
 * @param path - API 路径，例如 '/api/dev-team/menu-manage/catalog/list'
 * @param options - fetch 选项
 */
export async function fetchNitroApi(path: string, options: RequestInit = {}): Promise<Response> {
	const url = `${NITRO_BASE_URL}${path}`;
	console.log(`📡 调用 Nitro API: ${url}`);

	const response = await fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	return response;
}

/**
 * 检查 Nitro 服务器是否运行
 */
export async function checkNitroServer(): Promise<boolean> {
	try {
		const response = await fetch(`${NITRO_BASE_URL}/api/health`, {
			method: "GET",
		});
		return response.ok;
	} catch {
		return false;
	}
}

console.log("=".repeat(50));
console.log("🧪 Nitro 测试环境配置加载完成");
console.log("=".repeat(50));
console.log(`📡 Nitro 服务器地址: ${NITRO_BASE_URL}`);
console.log("💡 该 helper 仅供旧 tests/nitro/** 历史对照；现行接口测试请迁到 apps/api/tests/**");
console.log("=".repeat(50));
