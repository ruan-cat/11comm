/**
 * @file 工具函数
 * @description 种子数据生成相关的通用工具函数
 */

/** 状态枚举类型 */
export type StatusEnum = "enabled" | "disabled";

/** 审核状态枚举类型 */
export type AuditStatusEnum = "pending" | "approved" | "rejected";

/** 性别枚举类型 */
export type GenderEnum = "male" | "female";

/** 状态值映射：中文 -> 英文枚举（严格类型） */
const statusMapInternal: Record<string, StatusEnum> = {
	启用: "enabled",
	禁用: "disabled",
	operating: "enabled",
	disabled: "disabled",
	maintenance: "enabled",
	preparing: "enabled",
	正常: "enabled",
	筹建中: "disabled",
	已交付: "enabled",
	enabled: "enabled",
	// 默认情况在函数中处理
};

/** 性别值映射（严格类型） */
const genderMapInternal: Record<string, GenderEnum> = {
	男: "male",
	女: "female",
	male: "male",
	female: "female",
};

/** 审核状态映射（严格类型） */
const auditStatusMapInternal: Record<string, AuditStatusEnum> = {
	待审核: "pending",
	已通过: "approved",
	已拒绝: "rejected",
	待验收: "pending",
	验收成功: "approved",
	验收失败: "rejected",
	审核不通过: "rejected",
	装修中: "approved",
	pending: "pending",
	approved: "approved",
	rejected: "rejected",
};

/**
 * 安全地转换状态值
 * @param value 输入的状态值
 * @param defaultValue 默认值（如果未找到映射）
 * @returns 标准的状态枚举值
 */
export function toStatusEnum(value: string | undefined | null, defaultValue: StatusEnum = "enabled"): StatusEnum {
	if (!value) return defaultValue;
	const mapped = statusMapInternal[value];
	return mapped ?? defaultValue;
}

/**
 * 安全地转换审核状态值
 * @param value 输入的审核状态值
 * @param defaultValue 默认值（如果未找到映射）
 * @returns 标准的审核状态枚举值
 */
export function toAuditStatusEnum(
	value: string | undefined | null,
	defaultValue: AuditStatusEnum = "pending",
): AuditStatusEnum {
	if (!value) return defaultValue;
	const mapped = auditStatusMapInternal[value];
	return mapped ?? defaultValue;
}

/**
 * 安全地转换性别值
 * @param value 输入的性别值
 * @returns 标准的性别枚举值，如果未找到映射返回 null
 */
export function toGenderEnum(value: string | undefined | null): GenderEnum | null {
	if (!value) return null;
	const mapped = genderMapInternal[value];
	return mapped ?? null;
}

/** 兼容性导出：保留原有的 Map 供查看（但不应用于类型转换） */
export const statusMap = statusMapInternal;
export const auditStatusMap = auditStatusMapInternal;
export const genderMap = genderMapInternal;

/** SQL 字符串转义 */
export function escapeSql(str: string): string {
	return str.replace(/'/g, "''");
}

/** 日期字符串转换为 SQL Timestamp 格式 */
export function toSqlTimestamp(dateStr: string | Date): string {
	if (!dateStr) return "NULL";
	// 如果已经是 Date 对象
	if (dateStr instanceof Date) {
		return `'${dateStr.toISOString()}'::timestamp`;
	}
	return `'${dateStr}'::timestamp`;
}

/** 日期字符串转换为 SQL Date 格式 */
export function toSqlDate(dateStr: string | Date): string {
	if (!dateStr) return "NULL";
	if (dateStr instanceof Date) {
		return `'${dateStr.toISOString().split("T")[0]}'::date`;
	}
	return `'${dateStr}'::date`;
}

/**
 * 将参数化 SQL 转换为完整 SQL
 * @param sql 参数化 SQL (包含 $1, $2...)
 * @param params 参数数组
 */
export function toFullSql(sql: string, params: unknown[]): string {
	let result = sql;
	params.forEach((param, index) => {
		let value: string;
		if (param === null || param === undefined) {
			value = "NULL";
		} else if (typeof param === "string") {
			value = `'${escapeSql(param)}'`;
		} else if (param instanceof Date) {
			value = `'${param.toISOString()}'::timestamp`;
		} else if (typeof param === "object") {
			value = `'${JSON.stringify(param)}'::jsonb`;
		} else {
			value = String(param);
		}
		const regex = new RegExp(`\\$${index + 1}(?!\\d)`, "g");
		result = result.replace(regex, value);
	});
	return result;
}
