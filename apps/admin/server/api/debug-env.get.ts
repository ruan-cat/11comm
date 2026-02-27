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
	results["event.context keys"] = Object.keys(event.context || {});

	/** 2. 检查 event.context.cloudflare */
	const cf = (event.context as any).cloudflare;
	results["event.context.cloudflare exists"] = cf !== undefined;
	if (cf) {
		results["event.context.cloudflare keys"] = Object.keys(cf);
		if (cf.env) {
			const envKeys = Object.keys(cf.env);
			results["cloudflare.env keys"] = envKeys;
			results["cloudflare.env.comm_admin_11__DATABASE_URL"] = mask(cf.env.comm_admin_11__DATABASE_URL);
			results["cloudflare.env.DATABASE_URL"] = mask(cf.env.DATABASE_URL);
		}
	}

	/** 3. 检查 process.env 相关 key */
	const relevantProcessEnvKeys = Object.keys(process.env || {}).filter(
		(k) => k.includes("DATABASE") || k.includes("comm_admin") || k.includes("NITRO") || k.includes("NEON"),
	);
	results["process.env relevant keys"] = relevantProcessEnvKeys;
	results["process.env.comm_admin_11__DATABASE_URL"] = mask(process.env.comm_admin_11__DATABASE_URL);
	results["process.env.DATABASE_URL"] = mask(process.env.DATABASE_URL);

	/** 4. 检查 useRuntimeConfig */
	try {
		const { useRuntimeConfig } = await import("nitro/runtime-config");
		const config = useRuntimeConfig();
		results["runtimeConfig keys"] = Object.keys(config);
		results["runtimeConfig.databaseUrl"] = mask(config.databaseUrl);
	} catch (e: any) {
		results["runtimeConfig error"] = e.message;
	}

	/** 5. 检查 import.meta.env */
	try {
		const metaEnv = import.meta.env || {};
		const relevantMetaKeys = Object.keys(metaEnv).filter(
			(k) => k.includes("DATABASE") || k.includes("comm_admin") || k.includes("NITRO"),
		);
		results["import.meta.env relevant keys"] = relevantMetaKeys;
	} catch {
		results["import.meta.env"] = "[not available]";
	}

	return {
		success: true,
		code: 200,
		message: "环境变量调试信息",
		data: results,
	};
});
