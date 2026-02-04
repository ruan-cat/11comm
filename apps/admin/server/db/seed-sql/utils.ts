/**
 * @file 工具函数
 * @description 种子数据生成相关的通用工具函数
 */

/** 状态值映射：中文 -> 英文枚举 */
export const statusMap: Record<string, string> = {
	启用: "enabled",
	禁用: "disabled",
	operating: "enabled",
	disabled: "disabled",
	maintenance: "enabled",
	preparing: "enabled",
	// 添加默认值处理逻辑在调用处
};

/** 性别值映射 */
export const genderMap: Record<string, string> = {
	男: "male",
	女: "female",
};

/** 审核状态映射 */
export const auditStatusMap: Record<string, string> = {
	待审核: "pending",
	已通过: "approved",
	已拒绝: "rejected",
};

/** SQL 字符串转义 */
export function escapeSql(str: string): string {
	return str.replace(/'/g, "''");
}

/** 日期字符串转换为 SQL Timestamp 格式 */
export function toSqlTimestamp(dateStr: string): string {
	if (!dateStr) return "NULL";
	// 如果已经是 Date 对象
	if (dateStr instanceof Date) {
		return `'${(dateStr as Date).toISOString()}'::timestamp`;
	}
	return `'${dateStr}'::timestamp`;
}

/** 日期字符串转换为 SQL Date 格式 */
export function toSqlDate(dateStr: string): string {
	if (!dateStr) return "NULL";
	if (dateStr instanceof Date) {
		return `'${(dateStr as Date).toISOString().split("T")[0]}'::date`;
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
		// 使用正则替换对应的 $N，需要注意避免替换 $10 中的 $1 (虽然 loop 是顺序的，$10 不会先于 $1 出现，但 replaceAll 比较安全)
		// 简单的 replace 只替换第一个，这里应该是唯一的 $N，但 drizzle 生成的 sql 可能多次使用同一个参数吗？
		// Drizzle generated SQL currently uses unique placeholders like $1, $2 per value usage.
		// 简单的 replace 是可以的，但是必须确保 $1 不会匹配到 $10。
		// 使用 regex: \$1(?!\d) 来确保后面没有数字。
		const regex = new RegExp(`\\$${index + 1}(?!\\d)`, "g");
		result = result.replace(regex, value);
	});
	return result;
}
