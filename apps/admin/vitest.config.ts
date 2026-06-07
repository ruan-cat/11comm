import { fileURLToPath } from "node:url";

import tsAlias from "./build/plugins/vite-plugin-ts-alias";
import AutoImport from "./build/plugins/unplugin-auto-import";

import { configDefaults, defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import Vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

/** 旧 admin 内置 Nitro HTTP 套件仅作历史对照，不进入当前 admin 有效测试入口。 */
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

// 导出合并后的配置
export default defineConfig(() => {
	// 当前 admin 包只运行前端 jsdom 单测；旧 Nitro HTTP 套件的权威替代验证在 apps/api/tests/**。
	return jsdomConfig;
});
