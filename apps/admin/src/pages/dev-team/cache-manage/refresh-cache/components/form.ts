/**
 * @file 刷新缓存表单类型定义
 * @description Refresh cache form types
 */

import { cacheTypeOptions, refreshPolicyOptions, cacheStatusOptions } from "@01s-11comm/type";

/**
 * 刷新缓存表单数据类型
 * Refresh cache form data type
 */
export interface RefreshCacheFormVO {
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
}

/** 默认表单 Default form */
export const defaultForm: RefreshCacheFormVO = {
	cacheName: "",
	cacheKey: "",
	cacheType: "Redis",
	cacheGroup: "",
	expireTime: 3600,
	description: "",
	refreshPolicy: "定时刷新",
	status: "启用",
};

/**
 * 刷新缓存表单 props
 * @description Refresh cache form props
 */
export interface RefreshCacheFormProps {
	/** 表单数据 Form data */
	form: RefreshCacheFormVO;
	/** 表单组件重置时默认使用的对象 Default values for form reset */
	defaultValues: RefreshCacheFormVO;
}

/** 导出选项供表单使用 Export options for form use */
export { cacheTypeOptions, refreshPolicyOptions, cacheStatusOptions };
