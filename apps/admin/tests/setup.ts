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

console.log("=".repeat(50));
console.log("🧪 测试环境配置加载完成");
console.log("=".repeat(50));
console.log("💡 当前 admin 默认单测只验证前端/jsdom；接口与旧 Nitro 退役验证迁到 apps/api/tests/**");
console.log("=".repeat(50));
