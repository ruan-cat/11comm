import { cdn } from "../cdn";
import vue from "@vitejs/plugin-vue";
import { pathResolve } from "../utils";
import svgLoader from "vite-svg-loader";
import Icons from "unplugin-icons/vite";
import type { PluginOption, ConfigEnv } from "vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import tailwindcss from "@tailwindcss/vite";
import { configCompressPlugin } from "../compress";
import removeNoMatch from "vite-plugin-router-warn";
import { visualizer } from "rollup-plugin-visualizer";
import removeConsole from "vite-plugin-remove-console";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { codeInspectorPlugin } from "code-inspector-plugin";
import { vitePluginFakeServer } from "vite-plugin-fake-server";

// 自动化路由插件
import VueRouter from "vue-router/vite";
import { getRouteName } from "../../src/router/file-based-routing/get-route-name";

// 布局插件
import MetaLayouts from "vite-plugin-vue-meta-layouts";

// 集中封装后的 全局自动导入插件
import AutoImport from "../plugins/unplugin-auto-import/index";
// 集中封装后的 全局自动导入组件插件
import Components from "../plugins/unplugin-vue-components/index";
// 集中封装后的 全局自动导入组件插件
import AutogenerationImportFile from "../plugins/vite-plugin-autogeneration-import-file/index";
// 集中封装后的 别名插件
import tsAlias from "../plugins/vite-plugin-ts-alias/index";

// 开发调试插件
import vueDevTools from "vite-plugin-vue-devtools";

import vercel from "vite-plugin-vercel";

export function getPluginsList(
	VITE_CDN: boolean,
	VITE_COMPRESSION: ViteCompression,
	/**
	 * 模式
	 * @description
	 * 原框架没有 这里额外拓展的
	 */
	mode: ConfigEnv["mode"],

	/**
	 * 环境变量
	 * @description
	 * 原框架没有 这里额外拓展的
	 * 用来获取vite配置的环境变量
	 */
	env: ImportMetaEnv,
): PluginOption[] {
	const lifecycle = process.env.npm_lifecycle_event;
	const enableAutogenerationImportFile = process.env.VITE_DISABLE_AUTOGENERATION_IMPORT_FILE !== "true";

	const VITE_IS_REVERSE_PROXY = env.VITE_IS_REVERSE_PROXY;
	function IS_REVERSE_PROXY() {
		return VITE_IS_REVERSE_PROXY === "true";
	}

	const vercelPlugin = IS_REVERSE_PROXY() /**
	 * 生成指定vercel目录结构
	 * @description
	 * Bundle your Vite application as supported by Vercel Output API (v3).
	 * @see https://github.com/magne4000/vite-plugin-vercel/tree/v9
	 */
		? vercel()
		: [];

	return [
		tailwindcss(),

		/**
		 * 布局插件
		 * @description 注意到布局插件源码demo的写法 这里把布局组件移动到 `路由插件` 上面。
		 * @see https://github.com/dishait/vite-plugin-vue-meta-layouts/blob/main/README_EN.md#config
		 */
		MetaLayouts({
			// 本项目的路由文件夹名称为 layout
			target: "src/layout",
			// 为了避免影响其他地方 故设置默认布局的名称为 index
			defaultLayout: "index",
			skipTopLevelRouteLayout: true,
			/**
			 * 忽略掉全部 components 文件夹下面的组件 避免识别成布局组件
			 */
			excludes: ["**/components/**/*.vue"],
		}),

		/**
		 * 文件路由插件
		 * @description
		 * 其定义位置必须在 `@vitejs/plugin-vue` 插件之前。
		 *
		 * @see https://router.vuejs.org/guide/migration/v4-to-v5.html
		 */
		VueRouter({
			dts: "./src/route-map.d.ts",
			routesFolder: [
				{
					/**
					 * 在我们项目中，页面放在 views 文件夹下。
					 * 文档建议是写在pages内
					 */
					src: "src/pages",
					exclude: [
						// TODO: 做出自定义配置
						...[
							// 全部的components文件夹都不需要生成路由
							"**/components/**",
							// status菜单栏下面的全部页面 不生成自动路由
							"src/views/status/**",
						],
						/**
						 * 自动路由组件的忽略配置
						 * 如果是生产环境模式，就排除掉多余的案例组件
						 */
						...(mode === "production" || mode === "development" ? ["src/views/sample/**"] : []),
					],
				},
			],
			getRouteName,
		}),

		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag === "deep-chat",
				},
			},
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

		/** 自动导入插件 */
		AutoImport,

		// 自动导入插件
		enableAutogenerationImportFile ? AutogenerationImportFile : null,

		// 自动导入vue组件的插件
		Components,

		// jsx、tsx语法支持
		vueJsx(),
		VueI18nPlugin({
			/** @see https://vue-i18n.intlify.dev/guide/advanced/optimization.html#ssr-server-side-rendering */
			// ssr: true,
			include: [pathResolve("../locales/**")],
		}),
		/**
		 * 在页面上按住组合键时，鼠标在页面移动即会在 DOM 上出现遮罩层并显示相关信息，点击一下将自动打开 IDE 并将光标定位到元素对应的代码位置
		 * Mac 默认组合键 Option + Shift
		 * Windows 默认组合键 Alt + Shift
		 * 更多用法看 https://inspector.fe-dev.cn/guide/start.html
		 */
		codeInspectorPlugin({
			bundler: "vite",
			hideConsole: true,
		}),
		// 不使用信息查看插件了 避免可能的故障
		// viteBuildInfo(),
		/**
		 * 开发环境下移除非必要的vue-router动态路由警告No match found for location with path
		 * 非必要具体看 https://github.com/vuejs/router/issues/521 和 https://github.com/vuejs/router/issues/359
		 * vite-plugin-router-warn只在开发环境下启用，只处理vue-router文件并且只在服务启动或重启时运行一次，性能消耗可忽略不计
		 */
		removeNoMatch(),

		// mock支持
		vitePluginFakeServer({
			logger: false,
			include: "mock",
			infixName: false,
			// FIXME: 该配置导致生产环境多出来莫名其妙的模块 目前不清楚为什么
			// 目前只能暂且关闭 这导致生产环境没有预先写好的 写死的数据
			enableProd: false,
		}),

		// svg组件化支持
		svgLoader(),
		// 自动按需加载图标
		Icons({
			compiler: "vue3",
			scale: 1,
		}),
		VITE_CDN ? cdn : null,
		configCompressPlugin(VITE_COMPRESSION),
		// 线上环境删除console
		removeConsole({ external: ["src/assets/iconfont/iconfont.js"] }),
		// 打包分析
		lifecycle === "report" ? visualizer({ open: true, brotliSize: true, filename: "report.html" }) : (null as any),

		// 路径别名插件
		tsAlias,

		vercelPlugin,

		/**
		 * admin 不再主动接入内置 Nitro。
		 * 统一 Nitro API 已由 apps/api 承接，当前构建只保留前端 Vite 插件链。
		 */
	];
}
