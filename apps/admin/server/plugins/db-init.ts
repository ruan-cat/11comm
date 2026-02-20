import { definePlugin } from "nitro";

/**
 * 数据库懒加载插件
 *
 * 在 Cloudflare Worker 环境中，环境变量只在请求处理时可用
 * 因此需要在每个请求时动态初始化数据库连接
 *
 * 注意：实际数据库初始化在 useDb 函数中进行，这里可以用于请求级别的初始化逻辑
 */
export default definePlugin((nitroApp) => {
	// 在请求时动态获取数据库连接并存储到事件上下文中
	nitroApp.hooks.hook("request", (event) => {
		// 不在这里初始化，让 useDb 函数在路由处理时懒加载
		// 这样可以确保环境变量在运行时可用
	});
});
