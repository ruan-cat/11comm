/**
 * @file Drizzle Schema 辅助函数
 * @description 提供通用的字段定义函数，用于保证 Schema 一致性
 */

import { text, timestamp, uuid } from "drizzle-orm/pg-core";

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
