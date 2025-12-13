import { defineConfig } from "nitro";
import { pathResolve } from "./build/utils";

export default defineConfig({
	serverDir: "./server",

	/**
	 * 配置 Nitro 扫描目录
	 * @description
	 * 明确指定 Nitro 只扫描服务端目录，避免扫描客户端代码
	 * @see https://nitro.unjs.io/config#scandirs
	 */
	scanDirs: ["./server"],

	devServer: {
		watch: ["./server/**/*.ts"],
	},

	// FIXME: 无法实现全局类型导入
	// imports: {
	// 	autoImport: true,
	// 	imports: [
	// 		// import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@01s-11comm/type";
	// 		{ from: "@01s-11comm/type", name: "DEFAULT_PAGE_INDEX" },
	// 		{ from: "@01s-11comm/type", name: "DEFAULT_PAGE_SIZE" },
	// 		// import { defineHandler, readBody } from "nitro/h3";
	// 		{ from: "nitro/h3", name: "defineHandler" },
	// 		{ from: "nitro/h3", name: "readBody" },
	// 		// import type { JsonVO, PageDTO } from "@01s-11comm/type";
	// 		{ from: "@01s-11comm/type", name: "JsonVO", type: true },
	// 		{ from: "@01s-11comm/type", name: "PageDTO", type: true },
	// 	],
	// },

	alias: {
		/**
		 * Nitro 构建需要显式传入当前文件的 import.meta.url，
		 * 否则默认会以 build/utils.ts 的路径为基准，导致解析到 build/src。
		 */
		"@": pathResolve("./src", import.meta.url),
		components: pathResolve("./src/components", import.meta.url),
		composables: pathResolve("./src/composables", import.meta.url),
	},

	compatibilityDate: "2024-09-19",
	// 不提供任何写死的预设了 需要在运行命令的环境变量 NITRO_PRESET 内传入
	// preset: "cloudflare_module",
	typescript: {
		// typeCheck: true,
		// generatedTypesDir: pathResolve("./src/types"),
	},

	cloudflare: {
		deployConfig: true,
		nodeCompat: true,
		wrangler: {
			// 部署到 cloudflare worker 的名称。 与 cloudflare worker 云端设置保持一致
			name: "01s-11comm-admin",
			vars: {
				// 将包锁文件上传 即可更改构建流为 pnpm 了 以下环境变量失效
				/** @see https://developers.cloudflare.com/workers/ci-cd/builds/build-image/ */
				// SKIP_DEPENDENCY_INSTALL: 1,
				// NPM_CONFIG_PACKAGE_MANAGER: "pnpm",
				/** @see https://github.com/cloudflare/workers-sdk/pull/1427 */
				// npm_config_user_agent: "pnpm",
			},
		},
	},
});
