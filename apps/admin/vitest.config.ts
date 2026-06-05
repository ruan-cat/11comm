import { fileURLToPath } from "node:url";

import tsAlias from "./build/plugins/vite-plugin-ts-alias";
import AutoImport from "./build/plugins/unplugin-auto-import";

import { configDefaults, defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import Vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

/** Nitro 集成测试需要 node 环境和本地 8080 服务，不进入默认 jsdom 单元测试。 */
const nitroIntegrationTestPattern = "tests/nitro/**";

/** 历史占位测试文件为空，默认全量测试不把它们计为有效测试套件。 */
const emptyPlaceholderTestPatterns = [
	"src/api/c6/experem/experem.test.ts",
	"src/api/c7/inspection-statistics-table/index.test.ts",
	"src/api/c7/today-inspection-table/index.test.ts",
];

/** 旧 c/j 目录 API smoke 测试会发起真实网络请求，默认全量只运行可离线验证的单测。 */
const legacyApiNetworkSmokeTestPatterns = ["src/api/c*/**/*.test.ts", "src/api/j*/**/*.test.ts"];

// 定义测试配置
const jsdomConfig = defineConfig({
	test: {
		environment: "jsdom",
		// 只排除必要的文件
		exclude: [
			...configDefaults.exclude,
			"e2e/**",
			nitroIntegrationTestPattern,
			...emptyPlaceholderTestPatterns,
			...legacyApiNetworkSmokeTestPatterns,
		],
		root: fileURLToPath(new URL("./", import.meta.url)),
		// 设置环境变量，避免路由初始化时的依赖问题
		env: {
			VITE_ROUTER_HISTORY: "html5,/", // 提供路由历史模式，避免 undefined 错误
			VITE_PUBLIC_PATH: "/",
			...loadEnv("test", process.cwd(), ""),
		},
		// 添加全局设置来模拟必要的依赖
		globals: true,
		setupFiles: ["./tests/setup.ts"], // 添加测试设置文件
	},

	plugins: [
		// 对于单纯的接口测试，只保留必要的插件
		// 移除 MetaLayouts 和 VueRouter，因为接口测试不需要这些
		// 保留 VueI18nPlugin，避免导入路由/i18n 时把 yaml locale 当成普通脚本解析

		// 自动导入插件
		Vue(),
		AutoImport,
		VueI18nPlugin({
			include: [fileURLToPath(new URL("./locales/**", import.meta.url))],
		}),
		// 路径别名插件
		tsAlias,
	],

	// 添加解析配置
	resolve: {
		alias: {
			"@/plugins/i18n": fileURLToPath(new URL("./tests/mocks/i18n.ts", import.meta.url)),
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"virtual:meta-layouts": fileURLToPath(new URL("./tests/mocks/virtual-meta-layouts.ts", import.meta.url)),
			"vue-router/auto-routes": fileURLToPath(new URL("./tests/mocks/vue-router-auto-routes.ts", import.meta.url)),
		},
	},

	// 定义全局变量，避免运行时错误
	define: {
		__INTLIFY_PROD_DEVTOOLS__: false,
		__APP_INFO__: JSON.stringify({
			pkg: { name: "test", version: "1.0.0" },
			lastBuildTime: "2024-01-01 00:00:00",
		}),
	},
});

// Nitro 接口测试配置（node 环境）
const nitroNodeConfig = defineConfig({
	test: {
		environment: "node",
		include: ["tests/nitro/**/*.test.ts"],
		exclude: [...configDefaults.exclude, "e2e/**", "src/**/*.test.ts"],
		root: fileURLToPath(new URL("./", import.meta.url)),
		env: {
			NODE_ENV: "test",
			...loadEnv("test", process.cwd(), ""),
		},
		globals: true,
		setupFiles: ["./tests/setup-neon.ts"],
		pool: "forks",
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"setup-neon": fileURLToPath(new URL("./tests/setup-neon.ts", import.meta.url)),
		},
	},
});

// 导出合并后的配置
export default defineConfig(({ mode }) => {
	// 如果是 node 环境（nitro 接口测试），使用 nitro 配置
	// 检查 --node 参数（在 -- 之后）
	const args = process.argv.slice(2);
	const normalizedArgs = args.map((arg) => arg.replaceAll("\\", "/"));
	const isExplicitNitroTest = normalizedArgs.some((arg) => arg.includes("tests/nitro/"));
	const isNodeTest = args.includes("--node") || isExplicitNitroTest;

	if (isNodeTest) {
		return nitroNodeConfig;
	}

	// 默认使用 jsdom 配置
	return jsdomConfig;
});
