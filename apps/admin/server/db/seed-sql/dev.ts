import {
	dtConfigTypes,
	dtConfigs,
	dtConfigItems,
	dtDictionaries,
	dtDictionaryItems,
	dtMenuGroups,
	dtMenuCatalogs,
	dtMenuItems,
	dtCacheConfigs,
} from "@01s-11comm/type";

import { mockDictionaryTypeData } from "../../api/dev-team/config-manage/type/mock-data";
import { mockRefreshCacheData } from "../../api/dev-team/cache-manage/refresh-cache/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql, statusMap, generateUuid } from "./index";
import { getDb } from "../index";

/** 缓存状态值映射：中文标签 -> 英文枚举值 */
const cacheStatusMap: Record<string, string> = {
	启用: "enabled",
	禁用: "disabled",
	维护中: "maintenance",
};

/** 刷新策略值映射：中文标签 -> 英文枚举值 */
const refreshPolicyMap: Record<string, string> = {
	定时刷新: "scheduled",
	手动刷新: "manual",
	懒加载刷新: "lazy",
	事件触发刷新: "event",
	TTL过期刷新: "ttl",
	LRU淘汰刷新: "lru",
};

/** 缓存类型值映射：标签 -> 小写值 */
const cacheTypeMap: Record<string, string> = {
	Redis: "redis",
	Memory: "memory",
	Memcached: "memcached",
	Ehcache: "ehcache",
	Caffeine: "caffeine",
	"Guava Cache": "guava",
	Hazelcast: "hazelcast",
	Infinispan: "infinispan",
};

/**
 * 生成开发配置模块的 SQL
 */
export async function generateDevSql(idMap: IdMapRegistry): Promise<SqlStatement[]> {
	const db = await getDb();
	const statements: SqlStatement[] = [];

	// ==========================================
	// 1. 生成 dt_dictionaries (字典类型)
	// ==========================================
	console.log("正在生成 dt_dictionaries SQL...");
	const dictionaryRecords = mockDictionaryTypeData.map((item) => {
		const id = idMap.register("dt_dictionaries", item.typeCode);
		return {
			id,
			dictionaryCode: item.typeCode,
			dictionaryName: item.typeName,
			dictionaryType: item.typeCode,
			dictionaryDescription: item.typeDescription || null,
			remark: item.typeDescription,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (dictionaryRecords.length > 0) {
		const query = db.insert(dtDictionaries).values(dictionaryRecords).toSQL();
		statements.push({
			table: "dt_dictionaries",
			sql: toFullSql(query.sql, query.params),
			recordCount: dictionaryRecords.length,
		});
	}

	// ==========================================
	// 2. 生成 dt_cache_configs (缓存配置)
	// ==========================================
	console.log("正在生成 dt_cache_configs SQL...");
	const cacheConfigRecords = mockRefreshCacheData.map((item) => {
		const id = idMap.register("dt_cache_configs", item.cacheCode);
		return {
			id,
			cacheCode: item.cacheCode,
			cacheName: item.cacheName,
			cacheKey: item.cacheKey,
			cacheType: cacheTypeMap[item.cacheType] || item.cacheType.toLowerCase(),
			cacheGroup: item.cacheGroup,
			expireTime: item.expireTime,
			description: item.description,
			refreshStrategy: refreshPolicyMap[item.refreshPolicy] || item.refreshPolicy,
			status: cacheStatusMap[item.status] || "enabled",
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (cacheConfigRecords.length > 0) {
		const query = db.insert(dtCacheConfigs).values(cacheConfigRecords).toSQL();
		statements.push({
			table: "dt_cache_configs",
			sql: toFullSql(query.sql, query.params),
			recordCount: cacheConfigRecords.length,
		});
	}

	// Note: Skipping config types and menu groups for now
	// as they require more complex data mapping

	return statements;
}
