import { v5 as uuidv5 } from "uuid";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type * as schema from "../schema";

const SEED_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

export type SeedDb = NeonHttpDatabase<typeof schema>;

export interface SeedModule {
	name: string;
	dependencies: string[];
	seed: (db: SeedDb) => Promise<void>;
}

/**
 * 确定性 seed ID — 相同的 (scope, key) 永远生成相同的 UUID
 *
 * @example sid("community", "sunshine") → 固定 UUID
 * @example sid("notice", "greenery")   → 固定 UUID
 */
export function sid(scope: string, key: string): string {
	return uuidv5(`${scope}:${key}`, SEED_NAMESPACE);
}

export function defineSeed(module: SeedModule): SeedModule {
	return module;
}

/**
 * 包装 seed 数据行，绕过 Drizzle v0.42 中 defaultRandom().primaryKey() 及 nullable 列
 * 被排除在 InferInsertModel 之外的问题。
 *
 * 原理：泛型 identity 函数保留原始类型但打破 "fresh object literal" 标记，
 * 使 .values() 接收时使用结构兼容性检查（允许额外属性）而非严格的 excess property check。
 */
export function rows<const T extends Record<string, unknown>[]>(data: T): T {
	return data;
}
