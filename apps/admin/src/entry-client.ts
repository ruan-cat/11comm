/**
 * @file 客户端入口文件
 * @description Client entry for SSR hydration
 */

import App from "./App.vue";
import router from "./router";
import { setupStore } from "@/store";
import { useI18n, i18n } from "@/plugins/i18n";
import { getPlatformConfig } from "./config";
import { MotionPlugin } from "@vueuse/motion";
import { useEcharts } from "@/plugins/echarts";
import { createSSRApp, type Directive } from "vue";
import { useVxeTable } from "@/plugins/vxeTable";
import { useElementPlus } from "@/plugins/elementPlus";
import { injectResponsiveStorage } from "@/utils/responsive";
import { VueQueryPlugin, type VueQueryPluginOptions } from "@tanstack/vue-query";

import Table from "@pureadmin/table";
import PureDescriptions from "@pureadmin/descriptions";

// 引入重置样式
import "./style/reset.scss";
// 导入公共样式
import "./style/index.scss";
// 一定要在main.ts中导入tailwind.css，防止vite每次hmr都会请求src/style/index.scss整体css文件导致热更新慢的问题
import "./style/tailwind.css";
import "element-plus/dist/index.css";
// 导入字体图标
import "./assets/iconfont/iconfont.js";
import "./assets/iconfont/iconfont.css";

/** 客户端应用入口 */
async function main() {
	/** 使用 createSSRApp 创建客户端应用，用于与服务端水合 */
	const app = createSSRApp(App);

	/** TanStack Query 配置选项 */
	const vueQueryPluginOptions: VueQueryPluginOptions = {
		queryClientConfig: {
			defaultOptions: {
				queries: {
					/** 数据保持新鲜时间（5分钟） Stale time */
					staleTime: 5 * 60 * 1000,
					/** 垃圾回收时间（10分钟） Garbage collection time */
					gcTime: 10 * 60 * 1000,
					/** 失败重试次数 Retry attempts */
					retry: 1,
					/** 窗口重新聚焦时不自动刷新 Disable refetch on window focus */
					refetchOnWindowFocus: false,
				},
			},
		},
	};

	// 自定义指令
	const directives = await import("@/directives");
	Object.keys(directives).forEach((key) => {
		app.directive(key, (directives as { [key: string]: Directive })[key]);
	});

	// 全局注册@iconify/vue图标库
	const { IconifyIconOffline, IconifyIconOnline, FontIcon } = await import("./components/ReIcon");
	app.component("IconifyIconOffline", IconifyIconOffline);
	app.component("IconifyIconOnline", IconifyIconOnline);
	app.component("FontIcon", FontIcon);

	// 全局注册按钮级别权限组件
	const { Auth } = await import("@/components/ReAuth");
	const { Perms } = await import("@/components/RePerms");
	app.component("Auth", Auth);
	app.component("Perms", Perms);

	// 全局注册vue-tippy
	await import("tippy.js/dist/tippy.css");
	await import("tippy.js/themes/light.css");
	const VueTippy = (await import("vue-tippy")).default;
	app.use(VueTippy);

	// 全局注册常用的组件
	const { PureTableBar } = await import("@/components/RePureTableBar");
	app.component("PureTableBar", PureTableBar);

	const config = await getPlatformConfig(app);
	setupStore(app);
	app.use(router);
	await router.isReady();
	injectResponsiveStorage(app, config);
	app
		.use(MotionPlugin)
		.use(useI18n)
		.use(useElementPlus)
		.use(Table, {
			i18n,
		})
		.use(useVxeTable)
		.use(PureDescriptions)
		.use(useEcharts)
		.use(VueQueryPlugin, vueQueryPluginOptions);

	/** 挂载应用到 DOM */
	app.mount("#app");
}

main().catch((error) => {
	console.error("Failed to start client app:", error);
});
