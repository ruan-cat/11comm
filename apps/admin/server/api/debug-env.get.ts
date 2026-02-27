/**
 * 临时调试端点 — 深入排查 Cloudflare Worker 环境变量路径
 *
 * @description
 * 调试完成后必须删除此文件。
 *
 * @remarks
 * v3 版本新增对 Nitro v3 官方路径 event.req.runtime?.cloudflare?.env 的深度探查。
 * 该路径来自 Nitro 官方仓库确认，是 Cloudflare Worker 环境下环境变量的正确挂载位置。
 */
import { defineHandler } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";

export default defineHandler(async (event) => {
	const mask = (val: unknown): string => {
		if (val === undefined) return "[undefined]";
		if (val === null) return "[null]";
		if (typeof val === "string") return val.length > 0 ? `${val.substring(0, 6)}...` : "[empty]";
		if (typeof val === "object") return `[object: ${Object.keys(val as Record<string, unknown>).join(", ")}]`;
		return `[${typeof val}]`;
	};

	const results: Record<string, unknown> = {};

	/** 0. event.req.runtime 探查 — Nitro v3 官方 Cloudflare 变量挂载路径 */
	try {
		// @ts-ignore — event.req.runtime 是 Nitro v3 Cloudflare 预设的运行时注入，TypeScript 无类型定义
		const reqRuntime = (event.req as any)?.runtime;
		if (reqRuntime !== undefined) {
			results["req.runtime exists"] = true;
			results["req.runtime keys"] = typeof reqRuntime === "object" ? Object.keys(reqRuntime) : typeof reqRuntime;

			const cfRuntime = reqRuntime?.cloudflare;
			if (cfRuntime !== undefined) {
				results["req.runtime.cloudflare exists"] = true;
				results["req.runtime.cloudflare keys"] =
					typeof cfRuntime === "object" ? Object.keys(cfRuntime) : typeof cfRuntime;

				const cfRuntimeEnv = cfRuntime?.env;
				if (cfRuntimeEnv !== undefined) {
					const envKeys = Object.keys(cfRuntimeEnv);
					results["req.runtime.cloudflare.env keys"] = envKeys;

					/** 筛选数据库相关 key */
					const dbKeys = envKeys.filter(
						(k) => k.includes("DATABASE") || k.includes("comm_admin") || k.includes("NITRO") || k.includes("NEON"),
					);
					results["req.runtime.cloudflare.env DB keys"] = dbKeys;
					for (const dk of dbKeys) {
						results[`req.runtime.cf.env.${dk}`] = mask((cfRuntimeEnv as Record<string, unknown>)[dk]);
					}
				} else {
					results["req.runtime.cloudflare.env"] = "[undefined — env 不存在]";
				}
			} else {
				results["req.runtime.cloudflare"] = "[undefined — cloudflare 属性不存在]";
			}
		} else {
			results["req.runtime"] = "[undefined — event.req.runtime 不存在]";
		}
	} catch (e: unknown) {
		results["req.runtime check"] = e instanceof Error ? `[error: ${e.message}]` : "[error]";
	}

	/** 1. event.context 全部 key */
	results["context keys"] = Object.keys(event.context || {});

	/** 2. event.context.nitro 深入探查 */
	try {
		const nitroCtx = (event.context as Record<string, unknown>).nitro;
		if (nitroCtx && typeof nitroCtx === "object") {
			const nitroKeys = Object.keys(nitroCtx as Record<string, unknown>);
			results["nitro keys"] = nitroKeys;
			for (const key of nitroKeys) {
				const val = (nitroCtx as Record<string, unknown>)[key];
				if (val && typeof val === "object") {
					const subKeys = Object.keys(val as Record<string, unknown>);
					results[`nitro.${key} keys`] = subKeys.length > 20 ? `[${subKeys.length} keys]` : subKeys;
					/** 检查是否包含数据库相关 key */
					const dbKeys = subKeys.filter(
						(k) => k.includes("DATABASE") || k.includes("comm_admin") || k.includes("NITRO") || k.includes("NEON"),
					);
					if (dbKeys.length > 0) {
						results[`nitro.${key} DB keys`] = dbKeys;
						for (const dk of dbKeys) {
							results[`nitro.${key}.${dk}`] = mask((val as Record<string, unknown>)[dk]);
						}
					}
				} else {
					results[`nitro.${key}`] = mask(val);
				}
			}
		}
	} catch {
		results["nitro check"] = "[error]";
	}

	/** 3. globalThis 探查 */
	try {
		const globalKeys = Object.keys(globalThis).filter(
			(k) => k.includes("env") || k.includes("ENV") || k.includes("__") || k.includes("cloudflare") || k.includes("cf"),
		);
		results["globalThis env-related keys"] = globalKeys;
	} catch {
		results["globalThis check"] = "[error]";
	}

	/** 4. 尝试 Cloudflare Workers 原生 env API */
	try {
		// @ts-ignore — cloudflare:workers 是 Cloudflare Worker 运行时模块，TypeScript 无类型定义
		const cfModule = await import("cloudflare:workers");
		if (cfModule && cfModule.env) {
			const envKeys = Object.keys(cfModule.env);
			results["cloudflare:workers env keys"] = envKeys;
			const dbKeys = envKeys.filter(
				(k) => k.includes("DATABASE") || k.includes("comm_admin") || k.includes("NITRO") || k.includes("NEON"),
			);
			for (const dk of dbKeys) {
				results[`cf:workers.env.${dk}`] = mask((cfModule.env as Record<string, unknown>)[dk]);
			}
		}
	} catch (e: unknown) {
		results["cloudflare:workers"] = e instanceof Error ? e.message : "[import failed]";
	}

	/** 5. process.env 和 runtimeConfig（保留之前的检查） */
	results["process.env total keys"] = Object.keys(process.env || {}).length;
	results["runtimeConfig.databaseUrl"] = mask((useRuntimeConfig() as Record<string, unknown>).databaseUrl);

	return { success: true, code: 200, message: "深度调试 v3", data: results };
});
