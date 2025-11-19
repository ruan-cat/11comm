const _缓存类型 = [
	"Redis",
	"Memory",
	"Memcached",
	"Ehcache",
	"Caffeine",
	"Guava Cache",
	"Hazelcast",
	"Infinispan",
] as const;

const _刷新策略 = [
	"定时刷新",
	"手动刷新",
	"懒加载刷新",
	"事件触发刷新",
	"TTL过期刷新",
	"LRU淘汰刷新",
] as const;

const _缓存状态 = [
	"启用",
	"禁用",
	"维护中",
] as const;

// ==================== 联合类型定义 ====================

/** 缓存类型联合类型 */
export type 缓存类型 = (typeof _缓存类型)[number];

/** 刷新策略联合类型 */
export type 刷新策略 = (typeof _刷新策略)[number];

/** 缓存状态联合类型 */
export type 缓存状态 = (typeof _缓存状态)[number];

// ==================== 业务类型定义 ====================

/** 刷新缓存表单 VO */
export interface 刷新缓存表单_VO {
	/** 缓存名称 */
	缓存名称: string;
	/** 缓存键名 */
	缓存键名: string;
	/** 缓存类型 */
	缓存类型: 缓存类型;
	/** 缓存分组 */
	缓存分组: string;
	/** 过期时间（秒） */
	过期时间: number;
	/** 缓存描述 */
	缓存描述: string;
	/** 刷新策略 */
	刷新策略: 刷新策略;
	/** 状态 */
	状态: 缓存状态;
}

/** 默认表单 @description 对外导出用于其他场景使用 */
export const defaultForm: 刷新缓存表单_VO = {
	缓存名称: "",
	缓存键名: "",
	缓存类型: "Redis",
	缓存分组: "",
	过期时间: 3600,
	缓存描述: "",
	刷新策略: "定时刷新",
	状态: "启用",
};

/**
 * 刷新缓存表单 props
 * @description
 * 为了避免全局类型冲突 故设计较长的类型名称
 */
export interface RefreshCacheFormProps {
	/** 表单数据 */
	form: 刷新缓存表单_VO;
	/** 表单组件重置时默认使用的对象 */
	defaultValues: 刷新缓存表单_VO;
}