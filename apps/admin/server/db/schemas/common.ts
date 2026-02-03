/**
 * @file 公共 Schema 模块
 * @description 提供通用的辅助函数、枚举类型和字段定义
 */

import { pgEnum, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** 通用主键字段 - UUID 类型，自动生成随机值 */
export const primaryId = () => uuid("id").defaultRandom().primaryKey();

/** 通用时间戳字段 - 包含创建时间和更新时间 */
export const timestamps = {
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
};

/** 软删除字段 - 删除时间戳 */
export const softDelete = {
	deletedAt: timestamp("deleted_at"),
};

/** 备注字段 - 文本类型 */
export const remarkField = () => text("remark");

/** 状态枚举 - 启用/禁用 */
export const statusEnum = pgEnum("status", ["enabled", "disabled"]);

/** 性别枚举 - 男/女 */
export const genderEnum = pgEnum("gender", ["male", "female"]);

/** 审核状态枚举 - 待审核/已通过/已拒绝 */
export const auditStatusEnum = pgEnum("audit_status", ["pending", "approved", "rejected"]);
