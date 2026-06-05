import { vi } from "vitest";
import { config } from "@dotenvx/dotenvx";
import { resolve } from "node:path";

vi.mock("@/plugins/i18n", () => ({
	/** 默认 jsdom 单元测试不验证真实 locale 解析，只保留翻译入口的稳定占位。 */
	transformI18n(message: unknown = "") {
		if (!message) {
			return "";
		}

		if (typeof message === "object") {
			const localeMessage = message as Record<string, string>;
			return localeMessage.zh ?? localeMessage["zh-CN"] ?? localeMessage.en ?? "";
		}

		return String(message);
	},
	$t: (key: string) => key,
	i18n: {
		global: {
			locale: { value: "zh" },
			te: () => false,
			t: (key: string) => key,
		},
	},
	useI18n: () => {},
}));

const adminDir = process.cwd();

/**
 * 加载 Vercel Neon 环境变量
 *
 * 使用 @dotenvx/dotenvx 加载环境变量，确保测试可以访问 Neon 数据库连接
 */
function loadVercelEnv() {
	// 加载项目级别环境变量
	config({ path: resolve(adminDir, ".env") });
	// 加载从 Vercel 拉取的环境变量
	config({ path: resolve(adminDir, ".env.vercel.local") });
}

// 在测试环境加载环境变量
loadVercelEnv();

// 模拟环境变量
Object.assign(process.env, {
	VITE_ROUTER_HISTORY: "html5,/",
	VITE_PUBLIC_PATH: "/",
});

/**
 * Nitro 服务器地址配置
 *
 * 如果需要在测试时调用真实的 Nitro 接口，请先启动 Nitro 开发服务器：
 *
 * ```bash
 * # 终端 1: 启动 Nitro 服务器
 * pnpm dev
 *
 * # 终端 2: 运行测试
 * pnpm test
 * ```
 *
 * Nitro 服务器默认地址: http://localhost:8080
 *
 * 测试代码中可以这样使用:
 * ```typescript
 * import { fetchNitroApi } from './tests/setup'
 *
 * // 在测试中调用 Nitro 接口
 * const response = await fetchNitroApi('/api/your-endpoint')
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

console.log("=".repeat(50));
console.log("🧪 测试环境配置加载完成");
console.log("=".repeat(50));
console.log(`📡 Nitro 服务器地址: ${NITRO_BASE_URL}`);
console.log("💡 如需测试真实 Nitro 接口，请先运行: pnpm dev");
console.log("=".repeat(50));
