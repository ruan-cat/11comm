import { fileURLToPath } from "node:url";

import tsAlias from "./build/plugins/vite-plugin-ts-alias";
import AutoImport from "./build/plugins/unplugin-auto-import";

import { configDefaults, defineConfig } from "vitest/config";

// 定义测试配置
const testConfig = defineConfig({
	test: {
		environment: "jsdom",
		// 只排除必要的文件
		exclude: [...configDefaults.exclude, "e2e/**"],
		root: fileURLToPath(new URL("./", import.meta.url)),
		// 设置环境变量，避免路由初始化时的依赖问题
		env: {
			VITE_ROUTER_HISTORY: "html5,/", // 提供路由历史模式，避免 undefined 错误
			VITE_PUBLIC_PATH: "/",
		},
		// 添加全局设置来模拟必要的依赖
		globals: true,
		setupFiles: ["./tests/setup.ts"], // 添加测试设置文件
	},

	plugins: [
		// 对于单纯的接口测试，只保留必要的插件
		// 移除 MetaLayouts 和 VueRouter，因为接口测试不需要这些
		// 移除 VueI18nPlugin，如果需要可以单独模拟

		// 自动导入插件
		AutoImport,
		// 路径别名插件
		tsAlias,
	],

	// 添加解析配置
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
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
export default defineConfig(({ mode }) => {
	return testConfig;
});
