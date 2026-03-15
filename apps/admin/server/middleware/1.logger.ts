import { defineMiddleware, getRequestHeader, setResponseHeader } from "nitro/h3";
import { randomUUID } from "node:crypto";
import type { H3Event } from "nitro/h3";

/**
 * 请求日志中间件
 *
 * @description
 * 为每个请求生成唯一 requestId，记录请求方法、路径、耗时等信息
 *
 * @note 排错经验 - Node.js 与 Cloudflare Workers 环境差异
 * - 本项目仅运行 Node.js 环境，因此只保留 `event.node.res.once("finish", ...)` 方式记录日志。
 * - Cloudflare Workers 环境下 `event.node` 不可用，曾尝试用 `event.respondWith` 做兼容，
 *   但 `event.respondWith()` 在 H3 v2 中已被废弃移除（TS2339），不应再使用。
 * - 如果未来需要支持 Cloudflare Workers，应寻找 H3 v2 的替代方案（如 onAfterResponse 钩子），
 *   而不是恢复 `event.respondWith` 分支。
 */
export default defineMiddleware(async (event: H3Event) => {
	/** 生成或获取 requestId */
	const existingRequestId = getRequestHeader(event, "x-request-id");
	const requestId = existingRequestId || randomUUID();

	/** 将 requestId 注入到事件上下文 */
	event.context.requestId = requestId;

	/** 设置响应头中的 requestId */
	setResponseHeader(event, "x-request-id", requestId);

	/** 记录请求开始时间 */
	const startTime = Date.now();

	/**
	 * 请求完成后的日志记录
	 * 使用 event.node?.res 可选链判断，是因为 Cloudflare Workers 环境中 event.node 不存在。
	 * 当前项目固定为 Node.js 环境，此判断作为防御性编程保留。
	 */
	if (event.node?.res) {
		event.node.res.once("finish", () => {
			const duration = Date.now() - startTime;
			const method = event.method;
			const path = event.path;
			const status = event.node.res.statusCode;

			/** 根据状态码选择日志级别 */
			if (status >= 500) {
				console.error(`[${requestId}] ${method} ${path} ${status} ${duration}ms`);
			} else if (status >= 400) {
				console.warn(`[${requestId}] ${method} ${path} ${status} ${duration}ms`);
			} else {
				console.log(`[${requestId}] ${method} ${path} ${status} ${duration}ms`);
			}
		});
	}
});
