import type { OptionsType } from "../../../common";

/**
 * @description 缓存类型
 * Cache type
 */
export type CacheType =
	| "Redis"
	| "Memory"
	| "Memcached"
	| "Ehcache"
	| "Caffeine"
	| "Guava Cache"
	| "Hazelcast"
	| "Infinispan";

/**
 * @description 刷新策略
 * Refresh strategy
 */
export type RefreshStrategy =
	| "定时刷新"
	| "手动刷新"
	| "懒加载刷新"
	| "事件触发刷新"
	| "TTL过期刷新"
	| "LRU淘汰刷新";

/**
 * @description 缓存状态
 * Cache status
 */
export type CacheStatus = "启用" | "禁用" | "维护中";

/**
 * @description 刷新缓存列表数据
 * Refresh cache list item
 */
export interface RefreshCacheListItem {
	/** 缓存ID Cache ID */
	cacheId: string;
	/** 缓存编码 Cache code */
	cacheCode: string;
	/** 缓存名称 Cache name */
	cacheName: string;
	/** 缓存键名 Cache key */
	cacheKey: string;
	/** 缓存类型 Cache type */
	cacheType: CacheType;
	/** 缓存分组 Cache group */
	cacheGroup: string;
	/** 过期时间（秒） Expiration time (seconds) */
	expirationTime: number;
	/** 缓存描述 Cache description */
	cacheDescription: string;
	/** 刷新策略 Refresh strategy */
	refreshStrategy: RefreshStrategy;
	/** 状态 Status */
	status: CacheStatus;
	/** 创建时间 Creation time */
	createTime: string;
	/** 最后更新时间 Last update time */
	lastUpdateTime: string;
}

/**
 * @description 刷新缓存列表查询参数
 * Refresh cache list query parameters
 */
export interface RefreshCacheQueryParams {
	/** 缓存ID Cache ID */
	cacheId?: string;
	/** 缓存编码 Cache code */
	cacheCode?: string;
	/** 缓存名称 Cache name */
	cacheName?: string;
	/** 缓存键名 Cache key */
	cacheKey?: string;
	/** 缓存类型 Cache type */
	cacheType?: CacheType;
	/** 缓存分组 Cache group */
	cacheGroup?: string;
	/** 状态 Status */
	status?: CacheStatus;
	/** 刷新策略 Refresh strategy */
	refreshStrategy?: RefreshStrategy;
	/** 当前页码 Current page (1-based) */
	pageIndex: number;
	/** 每页大小 Page size */
	pageSize: number;
}

/**
 * @description 缓存类型选项
 * Cache type options
 */
export const cacheTypeOptions: OptionsType = [
	{ label: "Redis", value: "Redis" },
	{ label: "Memory", value: "Memory" },
	{ label: "Memcached", value: "Memcached" },
	{ label: "Ehcache", value: "Ehcache" },
	{ label: "Caffeine", value: "Caffeine" },
	{ label: "Guava Cache", value: "Guava Cache" },
	{ label: "Hazelcast", value: "Hazelcast" },
	{ label: "Infinispan", value: "Infinispan" },
];

/**
 * @description 刷新策略选项
 * Refresh strategy options
 */
export const refreshStrategyOptions: OptionsType = [
	{ label: "定时刷新", value: "定时刷新" },
	{ label: "手动刷新", value: "手动刷新" },
	{ label: "懒加载刷新", value: "懒加载刷新" },
	{ label: "事件触发刷新", value: "事件触发刷新" },
	{ label: "TTL过期刷新", value: "TTL过期刷新" },
	{ label: "LRU淘汰刷新", value: "LRU淘汰刷新" },
];

/**
 * @description 缓存状态选项
 * Cache status options
 */
export const cacheStatusOptions: OptionsType = [
	{ label: "启用", value: "启用" },
	{ label: "禁用", value: "禁用" },
	{ label: "维护中", value: "维护中" },
];

