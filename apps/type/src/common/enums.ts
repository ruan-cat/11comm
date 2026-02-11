/**
 * @file Drizzle Schema 枚举定义
 * @description 集中定义所有业务枚举类型，确保全局唯一性
 */

import { pgEnum } from "drizzle-orm/pg-core";

/** 状态枚举 - 启用/禁用 */
export const statusEnum = pgEnum("status", ["enabled", "disabled"]);

/** 性别枚举 - 男/女 */
export const genderEnum = pgEnum("gender", ["male", "female"]);

/** 审核状态枚举 - 待审核/已通过/已拒绝 */
export const auditStatusEnum = pgEnum("audit_status", ["pending", "approved", "rejected"]);
