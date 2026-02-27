/**
 * 临时调试端点 — 排查 Cloudflare Worker 环境变量获取问题
 *
 * @description
 * 此端点仅用于临时调试，确认环境变量在运行时的实际可访问路径。
 * 问题排查完毕后必须删除此文件。
 *
 * 安全说明：仅返回变量键名和值的前6字符，不暴露完整的数据库连接字符串。
 */
import { defineHandler } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";

export default defineHandler(async (event) => {
	/** 安全截断：仅显示值的前6个字符 */
	const mask = (val: unknown): string => {
		if (val === undefined) return "[undefined]";
		if (val === null) return "[null]";
		if (typeof val === "string") return val.length > 0 ? `${val.substring(0, 6)}...` : "[empty string]";
		return `[${typeof val}]`;
	};

	const results: Record<string, unknown> = {};

	/** 1. 检查 event.context 的全部顶层 key */
	try {
		results["event.context keys"] = Object.keys(event.context || {});
	} catch {
		results["event.context keys"] = "[error]";
	}

	/** 2. 检查 event.context.cloudflare */
	try {
		const cf = (event.context as Record<string, unknown>).cloudflare as Record<string, unknown> | undefined;
		results["cloudflare exists"] = cf !== undefined;
		if (cf) {
			results["cloudflare keys"] = Object.keys(cf);
			const cfEnv = cf.env as Record<string, unknown> | undefined;
			if (cfEnv) {
				results["cloudflare.env keys"] = Object.keys(cfEnv);
				results["cf.env.comm_admin_11__DATABASE_URL"] = mask(cfEnv.comm_admin_11__DATABASE_URL);
				results["cf.env.DATABASE_URL"] = mask(cfEnv.DATABASE_URL);
			} else {
				results["cloudflare.env"] = "[undefined]";
			}
		}
	} catch {
		results["cloudflare check"] = "[error]";
	}

	/** 3. 检查 process.env 相关 key */
	try {
		const allKeys = Object.keys(process.env || {});
		results["process.env total keys"] = allKeys.length;
		results["process.env relevant keys"] = allKeys.filter(
			(k) => k.includes("DATABASE") || k.includes("comm_admin") || k.includes("NITRO") || k.includes("NEON"),
		);
		results["process.env.comm_admin_11__DATABASE_URL"] = mask(process.env.comm_admin_11__DATABASE_URL);
		results["process.env.DATABASE_URL"] = mask(process.env.DATABASE_URL);
	} catch {
		results["process.env check"] = "[error]";
	}

	/** 4. 检查 useRuntimeConfig */
	try {
		const config = useRuntimeConfig();
		results["runtimeConfig keys"] = Object.keys(config);
		results["runtimeConfig.databaseUrl"] = mask((config as Record<string, unknown>).databaseUrl);
	} catch {
		results["runtimeConfig check"] = "[error]";
	}

	return {
		success: true,
		code: 200,
		message: "环境变量调试信息",
		data: results,
	};
});
