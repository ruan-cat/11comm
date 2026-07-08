import { getPluginsList } from "./build/plugins/index";
import { include, exclude } from "./build/optimize";
import { type UserConfigExport, type ConfigEnv, loadEnv } from "vite";
import { consola } from "consola";
import { root, alias, wrapperEnv, pathResolve, __APP_INFO__ } from "./build/utils";
import { createProxyMiddleware } from "http-proxy-middleware";

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default ({ mode }: ConfigEnv): UserConfigExport => {
	consola.info("  当前的vite模式：", mode);

	const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH } = wrapperEnv(loadEnv(mode, root));

	// 提供类型声明 便于得到使用提示
	const env = loadEnv(mode, process.cwd()) as unknown as ImportMetaEnv;
	const VITE_PROXY_PREFIX = env.VITE_PROXY_PREFIX;
	const VITE_BASE_URL = env.VITE_BASE_URL;
	const VITE_IS_REVERSE_PROXY = env.VITE_IS_REVERSE_PROXY;
	const VITE_11COMM_API_BASE_URL = process.env.VITE_11COMM_API_BASE_URL || env.VITE_11COMM_API_BASE_URL;
	const VITE_11COMM_API_PROXY_PREFIX =
		process.env.VITE_11COMM_API_PROXY_PREFIX || env.VITE_11COMM_API_PROXY_PREFIX || "/api-shadow";
	const VITE_11COMM_API_USE_PROXY = process.env.VITE_11COMM_API_USE_PROXY || env.VITE_11COMM_API_USE_PROXY;

	const adminApiShadowProxyPlugin = {
		name: "admin-api-shadow-proxy",
		enforce: "pre" as const,
		configureServer(server) {
			if (VITE_11COMM_API_USE_PROXY !== "true" || !VITE_11COMM_API_BASE_URL) {
				return;
			}

			const prefixPattern = new RegExp("^" + escapeRegExp(VITE_11COMM_API_PROXY_PREFIX));
			const proxy = createProxyMiddleware({
				changeOrigin: true,
				secure: false,
				target: VITE_11COMM_API_BASE_URL,
				pathRewrite: (path) => path.replace(prefixPattern, ""),
				on: {
					proxyReq(proxyReq) {
						proxyReq.removeHeader("expect");
					},
				},
			});

			server.middlewares.use((req, res, next) => {
				if (req.url?.startsWith(VITE_11COMM_API_PROXY_PREFIX)) {
					proxy(req, res, next);
					return;
				}

				next();
			});
		},
	};

	function IS_REVERSE_PROXY() {
		return VITE_IS_REVERSE_PROXY === "true";
	}

	return {
		base: VITE_PUBLIC_PATH,
		root,
		resolve: {
			alias,
		},

		/**
		 * SSR 配置
		 * @description
		 * 配置服务端构建时需要外部化的依赖，避免在服务端代码中打包客户端依赖
		 * @see https://cn.vitejs.dev/config/ssr-options.html#ssr-external
		 */
		ssr: {
			/**
			 * 不外部化的依赖
			 * @description
			 * 这些依赖需要被服务端构建打包，而不是作为外部模块加载
			 * 这样可以避免服务端代码错误导入客户端模块
			 */
			noExternal:
				/** @see https://github.com/posva/unplugin-vue-router/discussions/349#discussioncomment-9043123 */
				mode === "development" ? ["vue-router"] : [],
		},

		/**
		 * Vite Environments 配置
		 * @description
		 * 用于分离客户端和服务端构建环境
		 * @see https://cn.vitejs.dev/guide/api-environment.html
		 */
		// environments: {
		// 	client: { build: { rollupOptions: { input: "./src/entry-client.ts" } } },
		// 	/**
		// 	 * 根据 vite v8 beta 的文档 环境API不存在显性的 SSR 键了
		// 	 * An app doesn't need to use the ssr name for its SSR environment, it could name it server for example.
		// 	 * 但是在 vite v7 内 ，nitro仍旧需要读取 ssr 的配置
		// 	 */
		// 	ssr: {
		// 		build: { rollupOptions: { input: "./src/entry-server.ts" } },
		// 		resolve: {
		// 			noExternal:
		// 				mode === "development" ? ["vue-router", "virtual:meta-layouts", "lodash-es", "@01s-11comm/type"] : [],
		// 		},
		// 	},
		// },

		server: {
			open: true,
			// 端口号
			port: VITE_PORT,
			host: "0.0.0.0",

			/**
			 * 本地跨域代理
			 * @see https://cn.vitejs.dev/config/server-options.html#server-proxy
			 */
			proxy: {
				// 是否需要对接口配置反向代理？
				...(IS_REVERSE_PROXY()
					? {
							// 对特定前缀的请求地址 做反向代理
							[VITE_PROXY_PREFIX]: {
								changeOrigin: true,
								target: VITE_BASE_URL,
								secure: false,
								rewrite: (path) => path.replace(new RegExp("^" + VITE_PROXY_PREFIX), ""),
							},
						}
					: {}),
				...(VITE_11COMM_API_USE_PROXY === "true" && VITE_11COMM_API_BASE_URL
					? {
							[VITE_11COMM_API_PROXY_PREFIX]: {
								changeOrigin: true,
								target: VITE_11COMM_API_BASE_URL,
								secure: false,
								rewrite: (path) => path.replace(new RegExp("^" + VITE_11COMM_API_PROXY_PREFIX), ""),
							},
						}
					: {}),
			},

			// 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
			warmup: {
				clientFiles: [
					// 模仿SSR配置 不提供任何具体的 index.html 文件
					// "./index.html",
					"./src/{views,pages,components}/*",
				],
			},
		},

		plugins: [adminApiShadowProxyPlugin, ...getPluginsList(VITE_CDN, VITE_COMPRESSION, mode, env)],

		// https://cn.vitejs.dev/config/dep-optimization-options.html#dep-optimization-options
		optimizeDeps: {
			include,
			exclude,
		},
		build: {
			// https://cn.vitejs.dev/guide/build.html#browser-compatibility
			target: "es2015",
			sourcemap: false,
			// 消除打包大小超过500kb警告
			chunkSizeWarningLimit: 4000,
			rollupOptions: {
				external: [
					// 修复 Element Plus CSS 模块导入问题
					"@element-plus/components/color-picker-panel/css",
				],
				// 静态资源分类打包
				output: {
					chunkFileNames: "static/js/[name]-[hash].js",
					entryFileNames: "static/js/[name]-[hash].js",
					assetFileNames: "static/[ext]/[name]-[hash].[ext]",
				},
			},
			commonjsOptions: {
				transformMixedEsModules: true,
				strictRequires: "auto",
			},
		},
		define: {
			__INTLIFY_PROD_DEVTOOLS__: false,
			__APP_INFO__: JSON.stringify(__APP_INFO__),
		},
	};
};
