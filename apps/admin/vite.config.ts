import { getPluginsList } from "./build/plugins/index";
import { include, exclude } from "./build/optimize";
import { type UserConfigExport, type ConfigEnv, loadEnv } from "vite";
import { consola } from "consola";
import { type ViteVercelConfig } from "vite-plugin-vercel";
import { root, alias, wrapperEnv, pathResolve, __APP_INFO__ } from "./build/utils";

export default ({ mode }: ConfigEnv): UserConfigExport => {
	consola.info("  当前的vite模式：", mode);

	const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH } = wrapperEnv(loadEnv(mode, root));

	// 提供类型声明 便于得到使用提示
	const env = loadEnv(mode, process.cwd()) as unknown as ImportMetaEnv;
	const VITE_PROXY_PREFIX = env.VITE_PROXY_PREFIX;
	const VITE_BASE_URL = env.VITE_BASE_URL;
	const VITE_IS_REVERSE_PROXY = env.VITE_IS_REVERSE_PROXY;

	function IS_REVERSE_PROXY() {
		return VITE_IS_REVERSE_PROXY === "true";
	}

	/** @see https://github.com/magne4000/vite-plugin-vercel/tree/v9 */
	const vercel: ViteVercelConfig = IS_REVERSE_PROXY()
		? {
				rewrites: [
					// https://cloud.tencent.com/developer/ask/sof/107190446
					// { source: "/backend/:path(.*)", destination: "http://47.93.160.11:10001/:path" },
					// { source: "/(.*)", destination: "/index.html" },

					// https://segmentfault.com/a/1190000042276351
					{ source: "/backend/(.*)", destination: "/api/proxy" },
				],
			}
		: {};

	return {
		base: VITE_PUBLIC_PATH,
		root,
		resolve: {
			alias,
		},
		// 服务端渲染
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
			},

			// 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
			warmup: {
				clientFiles: ["./index.html", "./src/{views,components}/*"],
			},
		},
		plugins: getPluginsList(VITE_CDN, VITE_COMPRESSION, mode, env),
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
				input: {
					index: pathResolve("./index.html", import.meta.url),
				},
				// 静态资源分类打包
				output: {
					chunkFileNames: "static/js/[name]-[hash].js",
					entryFileNames: "static/js/[name]-[hash].js",
					assetFileNames: "static/[ext]/[name]-[hash].[ext]",
				},
			},
		},
		define: {
			__INTLIFY_PROD_DEVTOOLS__: false,
			__APP_INFO__: JSON.stringify(__APP_INFO__),
		},

		vercel,
	};
};
