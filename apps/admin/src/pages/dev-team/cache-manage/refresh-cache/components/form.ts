/**
 * @file 刷新缓存表单类型定义
 * @description Refresh cache form types
 */

import { type Mode } from "@/composables/use-mode";
import type { RefreshCacheFormVO } from "@01s-11comm/type";

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
	/** 表单模式 Form mode */
	mode?: Mode;
}
