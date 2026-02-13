/**
 * @file 数据库错误处理工具
 * @description 统一处理 Postgres 数据库错误，返回标准化的 H3Error
 * @features
 * - 支持 NeonDbError 专用错误类
 * - 自动提取 hint、constraint、table 等详细信息
 * - Postgres 错误码映射
 */

import { createError } from "nitro/h3";
import { NeonDbError } from "@neondatabase/serverless";

/** Postgres 错误码映射 */
const ERROR_CODE_MAP: Record<string, { status: number; message: string }> = {
	// 唯一约束冲突
	"23505": {
		status: 409,
		message: "数据已存在，请勿重复创建",
	},
	// 外键约束冲突
	"23503": {
		status: 400,
		message: "关联数据不存在，请检查输入",
	},
	// 检查约束冲突
	"23502": {
		status: 400,
		message: "必填字段缺失",
	},
	// 事务回滚
	"40001": {
		status: 500,
		message: "数据操作冲突，请重试",
	},
};

/**
 * 从错误码获取状态码
 * @param code - Postgres 错误码
 * @returns HTTP 状态码
 */
function getStatusFromCode(code: string): number {
	return ERROR_CODE_MAP[code]?.status || 500;
}

/**
 * 从错误码获取默认消息
 * @param code - Postgres 错误码
 * @returns 错误消息
 */
function getMessageFromCode(code: string): string {
	return ERROR_CODE_MAP[code]?.message || "操作失败";
}

/**
 * 提取错误来源信息
 * @param error - 数据库错误对象
 * @returns 格式化的来源信息
 */
function extractSourceInfo(error: NeonDbError): string {
	const parts: string[] = [];
	if (error.table) parts.push(`表: ${error.table}`);
	if (error.column) parts.push(`列: ${error.column}`);
	if (error.constraint) parts.push(`约束: ${error.constraint}`);
	return parts.length > 0 ? ` (${parts.join(", ")})` : "";
}

/**
 * 处理 NeonDbError 专用错误类
 * @param error - Neon 数据库错误
 * @returns 增强的错误消息
 */
function handleNeonDbError(error: NeonDbError): { status: number; message: string; detail?: string } {
	const status = getStatusFromCode(error.code);
	let message = getMessageFromCode(error.code);

	// 优先使用 hint（数据库管理员提供的修复建议）
	if (error.hint) {
		message = error.hint;
	}

	// 添加详细的错误来源信息
	const sourceInfo = extractSourceInfo(error);
	const detail = error.detail ? `${error.detail}${sourceInfo}` : sourceInfo;

	return { status, message, detail: detail || undefined };
}

/**
 * 处理通用 Postgres 错误
 * @param error - 未知错误对象
 * @returns 错误信息
 */
function handleGenericError(error: unknown): { code?: string; message: string } {
	const pgCode = (error as any)?.cause?.code || (error as any)?.code;
	const message = (error as any)?.message || String(error);
	return { code: pgCode, message };
}

/**
 * 处理数据库错误并返回标准化的 H3Error
 * @param error - 数据库错误对象
 * @param defaultMessage - 默认错误消息
 * @returns 标准化 H3Error
 * @example
 * ```typescript
 * try {
 *   await db.insert(table).values(data);
 * } catch (error) {
 *   throw handleDbError(error, "创建失败");
 * }
 * ```
 */
export function handleDbError(error: unknown, defaultMessage: string = "操作失败"): ReturnType<typeof createError> {
	console.error("[Database Error]", error);

	// 优先处理 NeonDbError（Neon 驱动的专用错误类）
	if (error instanceof NeonDbError) {
		const { status, message, detail } = handleNeonDbError(error);

		console.error("[NeonDbError]", {
			code: error.code,
			detail: error.detail,
			hint: error.hint,
			table: error.table,
			column: error.column,
			constraint: error.constraint,
		});

		return createError({
			statusCode: status,
			message,
			cause: error,
			data: {
				// 额外信息用于调试
				pgCode: error.code,
				...(error.detail && { detail: error.detail }),
				...(error.hint && { hint: error.hint }),
				...(error.table && { table: error.table }),
				...(error.constraint && { constraint: error.constraint }),
			},
		});
	}

	// 处理通用 Postgres 错误
	const { code: pgCode, message: errorMessage } = handleGenericError(error);

	if (pgCode && ERROR_CODE_MAP[pgCode]) {
		const { status, message } = ERROR_CODE_MAP[pgCode];
		return createError({
			statusCode: status,
			message,
			cause: error,
		});
	}

	// 默认返回 500 错误
	return createError({
		statusCode: 500,
		message: defaultMessage,
		cause: error,
	});
}

/**
 * 解析数据库错误为用户友好的消息
 * @param error - 数据库错误对象
 * @returns 用户友好的错误消息
 * @example
 * ```typescript
 * const message = parseDbErrorMessage(error);
 * // => "数据已存在，请勿重复创建"
 * ```
 */
export function parseDbErrorMessage(error: unknown): string {
	// 优先处理 NeonDbError
	if (error instanceof NeonDbError) {
		// 优先使用 hint
		if (error.hint) {
			return error.hint;
		}
		// 其次使用 detail
		if (error.detail) {
			return error.detail;
		}
		// 最后使用错误码映射
		const mapped = getMessageFromCode(error.code);
		if (mapped !== "操作失败") {
			return mapped;
		}
	}

	// 处理通用错误
	const pgCode = (error as any)?.cause?.code || (error as any)?.code;
	if (pgCode && ERROR_CODE_MAP[pgCode]) {
		return ERROR_CODE_MAP[pgCode].message;
	}

	return "操作失败，请稍后重试";
}

/**
 * 检查错误是否为唯一约束冲突
 * @param error - 错误对象
 * @returns 是否为唯一约束冲突
 */
export function isUniqueConstraintError(error: unknown): boolean {
	if (error instanceof NeonDbError) {
		return error.code === "23505";
	}
	const pgCode = (error as any)?.cause?.code || (error as any)?.code;
	return pgCode === "23505";
}

/**
 * 检查错误是否为外键约束冲突
 * @param error - 错误对象
 * @returns 是否为外键约束冲突
 */
export function isForeignKeyError(error: unknown): boolean {
	if (error instanceof NeonDbError) {
		return error.code === "23503";
	}
	const pgCode = (error as any)?.cause?.code || (error as any)?.code;
	return pgCode === "23503";
}

/**
 * 导出 NeonDbError 用于类型检查
 */
export type { NeonDbError };
