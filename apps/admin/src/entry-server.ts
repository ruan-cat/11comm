/**
 * @file 服务端入口文件
 * @description Server entry for SSR rendering with Nitro V3
 * 模仿 nitro__nitrojs/examples/vite-ssr-vue-router/app/entry-server.ts 的写法
 *
 * 警告 不再继续使用这个入口文件了 不做 nitro SSR 改造了
 */

import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import { RouterView, createRouter, createMemoryHistory } from "vue-router";
import { setupLayoutsRoutes } from "./router";

import { createHead, transformHtmlTemplate } from "unhead/server";
// @ts-ignore
import clientEntry from "./entry-client.ts?assets=client";

import { useI18n } from "./plugins/i18n";

/**
 * SSR 渲染处理器
 * @description
 * 处理所有非 API 请求的页面渲染
 */
async function handler(request: Request): Promise<Response> {
	// 使用 RouterView 作为根组件，避免导入客户端 App.vue
	const app = createSSRApp(RouterView);

	// 创建服务端路由（使用内存历史）
	const router = createRouter({
		history: createMemoryHistory(),
		// unplugin-vue-router 会自动生成路由，这里不需要手动配置
		routes: setupLayoutsRoutes,
	});

	app.use(router);

	app.use(useI18n);

	const url = new URL(request.url);
	const href = url.href.slice(url.origin.length);

	// 设置路由
	await router.push(href);
	await router.isReady();

	const assets = clientEntry.merge(
		...(await Promise.all(
			router.currentRoute.value.matched
				.map((to) => to.meta.assets)
				.filter(Boolean)
				.map((fn) => (fn as any)().then((m: any) => m.default)),
		)),
	);

	const head = createHead();

	head.push({
		link: [
			...assets.css.map((attrs: any) => ({ rel: "stylesheet", ...attrs })),
			...assets.js.map((attrs: any) => ({ rel: "modulepreload", ...attrs })),
		],
		script: [{ type: "module", src: clientEntry.entry }],
	});

	// 渲染应用为字符串
	const renderedApp = await renderToString(app);

	// 返回 HTML 响应
	const html = await transformHtmlTemplate(head, htmlTemplate(renderedApp));

	return new Response(html, {
		headers: { "Content-Type": "text/html;charset=utf-8" },
	});
}

/**
 * HTML 模板
 * @description
 * 结合本项目的 index.html 模板
 */
function htmlTemplate(body: string): string {
	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta name="renderer" content="webkit" />
		<meta
			name="viewport"
			content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0"
		/>
		<title>vue-pure-admin</title>
		<link rel="icon" href="/favicon.ico" />
	</head>

	<body>
		<div id="app">
      ${body}
		</div>
	</body>
</html>
`;
}

/**
 * 导出 Nitro 处理器
 * @description
 * 处理所有 GET 请求的页面渲染
 */
export default {
	fetch: handler,
};
