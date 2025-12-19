import type { OptionsType } from "../../../common";

/**
 * 刷新缓存列表数据
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
    cacheType: string;
    /** 缓存分组 Cache group */
    cacheGroup: string;
    /** 过期时间（秒） Expire time (seconds) */
    expireTime: number;
    /** 缓存描述 Description */
    description: string;
    /** 刷新策略 Refresh policy */
    refreshPolicy: string;
    /** 状态 Status */
    status: string;
    /** 创建时间 Create time */
    createTime: string;
    /** 最后更新时间 Update time */
    updateTime: string;
}

/**
 * 刷新缓存列表查询参数
 * Refresh cache query parameters
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
    cacheType?: string;
    /** 缓存分组 Cache group */
    cacheGroup?: string;
    /** 状态 Status */
    status?: string;
    /** 刷新策略 Refresh policy */
    refreshPolicy?: string;
    /** 当前页码 Current page */
    pageIndex: number;
    /** 每页大小 Page size */
    pageSize: number;
}

/** 缓存类型选项 Cache type options */
export const cacheTypeOptions: OptionsType = [
    { label: "Redis", value: "redis" },
    { label: "Memory", value: "memory" },
    { label: "Memcached", value: "memcached" },
    { label: "Ehcache", value: "ehcache" },
    { label: "Caffeine", value: "caffeine" },
    { label: "Guava Cache", value: "guava" },
    { label: "Hazelcast", value: "hazelcast" },
    { label: "Infinispan", value: "infinispan" },
];

/** 刷新策略选项 Refresh policy options */
export const refreshPolicyOptions: OptionsType = [
    { label: "定时刷新", value: "scheduled" },
    { label: "手动刷新", value: "manual" },
    { label: "懒加载刷新", value: "lazy" },
    { label: "事件触发刷新", value: "event" },
    { label: "TTL过期刷新", value: "ttl" },
    { label: "LRU淘汰刷新", value: "lru" },
];

/** 缓存状态选项 Cache status options */
export const cacheStatusOptions: OptionsType = [
    { label: "启用", value: "enabled" },
    { label: "禁用", value: "disabled" },
    { label: "维护中", value: "maintenance" },
];