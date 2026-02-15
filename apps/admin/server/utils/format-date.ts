import dayjs from "dayjs";

/**
 * 日期格式化工具函数
 * 用于将 DB 层的 Date 类型转换为前端展示用的 string 类型
 */

/** 标准日期时间格式 */
export const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

/** 标准日期格式 */
export const DATE_FORMAT = "YYYY-MM-DD";

/**
 * 格式化日期为标准日期时间字符串 (YYYY-MM-DD HH:mm:ss)
 * @param date - 日期对象、字符串或时间戳
 * @param fallback - 当日期无效时的返回值，默认为空字符串
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(date: Date | string | number | null | undefined, fallback: string = ""): string {
	if (!date) return fallback;
	const formatted = dayjs(date);
	return formatted.isValid() ? formatted.format(DATETIME_FORMAT) : fallback;
}

/**
 * 格式化日期为标准日期字符串 (YYYY-MM-DD)
 * @param date - 日期对象、字符串或时间戳
 * @param fallback - 当日期无效时的返回值，默认为空字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string | number | null | undefined, fallback: string = ""): string {
	if (!date) return fallback;
	const formatted = dayjs(date);
	return formatted.isValid() ? formatted.format(DATE_FORMAT) : fallback;
}
