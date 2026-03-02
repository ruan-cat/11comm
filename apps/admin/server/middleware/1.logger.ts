import { defineMiddleware, getRequestHeader, setResponseHeader } from "nitro/h3";
import { randomUUID } from "node:crypto";
import type { H3Event } from "nitro/h3";

/**
 * 请求日志中间件
 *
 * @description
 * 为每个请求生成唯一 requestId，记录请求方法、路径、耗时等信息
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

	/** 请求完成后的日志记录 */
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
});
