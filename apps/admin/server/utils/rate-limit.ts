/**
 * API 访问频率限制工具
 * @description 基于内存的简单频率限制实现
 */

import type { H3Event } from "nitro/h3";
import { createError, getRequestHeader, setResponseHeader } from "nitro/h3";

/**
 * 频率限制配置
 */
export interface RateLimitConfig {
	/** 时间窗口（毫秒） */
	windowMs: number;
	/** 时间窗口内最大请求数 */
	maxRequests: number;
	/** 频率限制key前缀 */
	keyPrefix?: string;
}

/**
 * 频率限制记录
 */
interface RateLimitRecord {
	count: number;
	resetTime: number;
}

/**
 * 内存存储的频率限制Map
 */
const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * 清理过期的记录
 */
function cleanupExpired(): void {
	const now = Date.now();
	for (const [key, record] of rateLimitStore.entries()) {
		if (record.resetTime < now) {
			rateLimitStore.delete(key);
		}
	}
}

/**
 * 默认配置
 */
const defaultConfig: RateLimitConfig = {
	windowMs: 60 * 1000, // 1分钟
	maxRequests: 100, // 每分钟100次
	keyPrefix: "ratelimit",
};

/**
 * 获取客户端IP
 */
function getClientIp(event: H3Event): string {
	const forwarded = getRequestHeader(event, "x-forwarded-for");
	if (forwarded) {
		return forwarded.split(",")[0].trim();
	}
	const realIp = getRequestHeader(event, "x-real-ip");
	if (realIp) {
		return realIp;
	}
	return event.node.req.socket?.remoteAddress || "unknown";
}

/**
 * 获取请求的频率限制key
 */
function getRateLimitKey(event: H3Event, prefix: string): string {
	const ip = getClientIp(event);
	const path = event.path;
	return `${prefix}:${ip}:${path}`;
}

/**
 * 检查频率限制
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
	event: H3Event,
	config: Partial<RateLimitConfig> = {},
): { allowed: boolean; remaining: number; resetTime: number } {
	const { windowMs, maxRequests, keyPrefix } = { ...defaultConfig, ...config };
	const key = getRateLimitKey(event, keyPrefix || "ratelimit");
	const now = Date.now();

	// 清理过期记录（每100次请求清理一次）
	if (rateLimitStore.size > 10000) {
		cleanupExpired();
	}

	const record = rateLimitStore.get(key);

	// 如果记录不存在或已过期，创建新记录
	if (!record || record.resetTime < now) {
		const newRecord: RateLimitRecord = {
			count: 1,
			resetTime: now + windowMs,
		};
		rateLimitStore.set(key, newRecord);
		return {
			allowed: true,
			remaining: maxRequests - 1,
			resetTime: newRecord.resetTime,
		};
	}

	// 增加计数
	record.count++;

	// 检查是否超过限制
	if (record.count > maxRequests) {
		return {
			allowed: false,
			remaining: 0,
			resetTime: record.resetTime,
		};
	}

	return {
		allowed: true,
		remaining: maxRequests - record.count,
		resetTime: record.resetTime,
	};
}

/**
 * 频率限制中间件
 * @param config 频率限制配置
 */
export function rateLimitMiddleware(config: Partial<RateLimitConfig> = {}) {
	return (event: H3Event) => {
		const result = checkRateLimit(event, config);

		// 设置响应头
		setResponseHeader(event, "X-RateLimit-Limit", String(config.maxRequests || defaultConfig.maxRequests));
		setResponseHeader(event, "X-RateLimit-Remaining", String(result.remaining));
		setResponseHeader(event, "X-RateLimit-Reset", String(Math.ceil(result.resetTime / 1000)));

		if (!result.allowed) {
			const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
			setResponseHeader(event, "Retry-After", String(retryAfter));

			throw createError({
				statusCode: 429,
				message: "请求过于频繁，请稍后再试",
				data: {
					retryAfter,
					limit: config.maxRequests || defaultConfig.maxRequests,
				},
			});
		}
	};
}

/**
 * 登录频率限制（更严格）
 * 5分钟内最多5次尝试
 */
export const loginRateLimit = {
	windowMs: 5 * 60 * 1000,
	maxRequests: 5,
	keyPrefix: "ratelimit:login",
};

/**
 * API频率限制（一般）
 * 1分钟内最多100次请求
 */
export const apiRateLimit = {
	windowMs: 60 * 1000,
	maxRequests: 100,
	keyPrefix: "ratelimit:api",
};

/**
 * 文件上传频率限制
 * 1分钟内最多10次
 */
export const uploadRateLimit = {
	windowMs: 60 * 1000,
	maxRequests: 10,
	keyPrefix: "ratelimit:upload",
};

/**
 * 重置特定IP的频率限制
 */
export function resetRateLimit(event: H3Event, prefix?: string): void {
	const ip = getClientIp(event);
	const keyPrefix = prefix || defaultConfig.keyPrefix;
	const key = `${keyPrefix}:${ip}`;
	rateLimitStore.delete(key);
}

/**
 * 重置所有频率限制
 */
export function resetAllRateLimits(): void {
	rateLimitStore.clear();
}
