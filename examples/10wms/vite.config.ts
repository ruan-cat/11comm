import type { ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import VueRouter from "unplugin-vue-router/vite";
import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import vueDevTools from "vite-plugin-vue-devtools";
import consola from "consola";

import MetaLayouts from "vite-plugin-vue-meta-layouts";
import AutoImport from "./src/plugins/unplugin-auto-import/index.ts";
import Components from "./src/plugins/unplugin-vue-components/index.ts";
import { getRouteName } from "./src/plugins/unplugin-vue-router.ts";

import autoImport from "./src/plugins/vite-plugin-autogeneration-import-file.ts";
import tsAlias from "./src/plugins/vite-plugin-ts-alias/index.ts";

/**
 * 用全量导入的方式 获取类型
 * 这些类型不能写成export导入的形式，会导致全局类型声明失效
 *
 * 也可以等效地用 三斜线表达式 实现全量导入
 * <reference types="./types/env.shim.d.ts" />
 */
import "./types/env.shim.d.ts";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	consola.box("当前的vite模式：", mode);

	/**
	 * 根据当前工作目录中的 `mode` 加载 .env 文件
	 * @deprecated
	 * 不推荐 环境变量的类型声明文件 现在包含了vite的客户端拓展
	 *
	 * 客户端的拓展类型 包含一个索引类型
	 *
	 * 故无法准确推断key值的类型了
	 *
	 * 该函数效果不佳 故不推荐使用
	 */
	const getViteEnv = (mode: ConfigEnv["mode"], target: keyof ImportMetaEnv) => {
		return loadEnv(mode, process.cwd())[target];
	};

	// 提供类型声明 便于得到使用提示
	const env = loadEnv(mode, process.cwd()) as unknown as ImportMetaEnv;
	const VITE_proxy_prefix = env.VITE_proxy_prefix;
	const VITE_base_url = env.VITE_base_url;
	const VITE_app_port = env.VITE_app_port;
	const VITE_is_reverse_proxy = env.VITE_is_reverse_proxy;

	return {
		server: {
			open: true,
			host: "0.0.0.0",
			port: Number(VITE_app_port),
			proxy: {
				// 默认有的反向代理配置
				...{
					"/captcha": {
						changeOrigin: true,
						target: "http://8.140.208.103:10001",
						rewrite: (path) => path.replace(/^\/captcha/, ""),
					},
				},
				// 是否需要对接口配置反向代理？
				...(VITE_is_reverse_proxy === "true"
					? {
							// 对特定前缀的请求地址 做反向代理
							[VITE_proxy_prefix]: {
								changeOrigin: true,
								target: VITE_base_url,
								rewrite: (path) => path.replace(new RegExp("^" + VITE_proxy_prefix), ""),
							},
						}
					: {}),
			},
		},

		build: {
			assetsDir: "static",
			chunkSizeWarningLimit: 1000,
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes("node_modules")) {
							const regex = /.pnpm\/(.*?)\//;
							const ids = id.toString().split("node_modules/");
							const targetId = ids[1];
							const chunkNames = targetId.split("/");
							// 如果等于pnpm，说明是pnpm的包，需要取第二个
							if (chunkNames[0] === ".pnpm") {
								return chunkNames[1];
							} else {
								return chunkNames[0];
							}
						}
					},
				},

				// 排除掉全部的 sample 案例页面
				external: new RegExp("(views/sample/.*)"),
			},
		},

		plugins: [
			/**
			 * 类型化路由插件
			 * @description
			 * 其定义位置必须在 `@vitejs/plugin-vue` 插件之前。
			 *
			 * @see https://uvr.esm.is/introduction.html#installation
			 */
			VueRouter({
				dts: "./types/typed-router.d.ts",
				routesFolder: [
					{
						/**
						 * 在我们项目中，页面放在 views 文件夹下。
						 * 文档建议是写在pages内
						 * src: "src/pages",
						 */
						src: "src/views",
						exclude: [
							...[
								// 全部的components文件夹都不需要生成路由
								"**/components",
								// status菜单栏下面的全部页面 不生成自动路由
								"src/views/status/**",
							],
							/**
							 * 自动路由组件的忽略配置
							 * 如果是生产环境模式，就排除掉多余的案例组件
							 */
							...(mode === "production" ? ["src/views/sample/**"] : []),
						],

						// 下面的配置暂时不使用
						// override globals
						// exclude: (excluded) => excluded,
						// filePatterns: (filePatterns) => filePatterns,
						// extensions: (extensions) => extensions,
					},
				],
				getRouteName,
				// 该配置被覆盖掉了 故迁移到上面的配置中
				// exclude: mode === "production" ? ["src/views/sample/**"] : [],
			}),

			vue(),

			/** @see https://github.com/dishait/vite-plugin-vue-meta-layouts/blob/main/README_EN.md#config */
			MetaLayouts({
				/**
				 * 忽略掉全部 components 文件夹下面的组件 避免识别成布局组件
				 * @see https://vscode.dev/github/dishait/vite-plugin-vue-meta-layouts/blob/main/examples/unplugin-vue-router/vite.config.ts#L13
				 */
				excludes: ["**/components/**/*.vue"],
			}),

			// 自动生成类型声明文件插件
			autoImport,

			// 自动导入插件
			AutoImport,

			// 自动导入vue组件的插件
			Components,

			Icons({
				autoInstall: true,
			}),

			/**
			 * 开发调试插件
			 * @description
			 * vueDevTools 必须在 createHtmlPlugin 的前面导入
			 *
			 * @see https://devtools.vuejs.org/help/troubleshooting#devtools-vite-plugin-doesn-t-render-as-expected
			 * @see https://github.com/vuejs/devtools/issues/278#issuecomment-2167415057
			 */
			vueDevTools(),

			createHtmlPlugin({
				inject: {
					data: {
						title: getViteEnv(mode, "VITE_APP_TITLE"),
					},
				},
			}),

			tsAlias,
		],
	};
});
