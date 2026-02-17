/**
 * @file 用户（员工）管理模块 Schema
 * @description 定义员工相关的表结构，前缀 sm_
 * @module user-manage
 */

import { index, pgTable, text, varchar, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { primaryId, timestamps, remarkField, genderEnum } from "../../../common";
import { smOrganizations } from "../organize-manage/schema";

// ==========================================
// Part A: Database Table Definitions
// ==========================================

/** 员工信息表 */
export const smStaff = pgTable(
	"sm_staff",
	{
		id: primaryId(),
		/** 关联组织 ID */
		orgId: uuid("org_id").references(() => smOrganizations.id),
		/** 员工编号 */
		employeeNumber: varchar("employee_number", { length: 50 }).notNull(),
		/** 姓名 */
		name: varchar("name", { length: 50 }).notNull(),
		/** 性别 */
		gender: genderEnum("gender"),
		/** 职位 */
		position: varchar("position", { length: 50 }),
		/** 邮箱 */
		email: varchar("email", { length: 100 }),
		/** 手机号 */
		phone: varchar("phone", { length: 20 }),
		/** 家庭住址 */
		homeAddress: text("home_address"),
		/** 头像 URL */
		avatarUrl: text("avatar_url"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [
		index("sm_staff_employee_number_idx").on(table.employeeNumber),
		index("sm_staff_name_idx").on(table.name),
		index("sm_staff_org_id_idx").on(table.orgId),
	],
);

// ==========================================
// Part B: Zod Runtime Schemas
// ==========================================

// --- smStaff ---
export const insertSmStaffSchema = createInsertSchema(smStaff, {
	employeeNumber: (schema) => schema.min(1, "员工编号不能为空").max(50),
	name: (schema) => schema.min(1, "姓名不能为空").max(50),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectSmStaffSchema = createSelectSchema(smStaff);

export const updateSmStaffSchema = z.object({
	id: z.string().uuid(),
	orgId: z.string().uuid().optional().nullable(),
	employeeNumber: z.string().min(1, "员工编号不能为空").max(50).optional(),
	name: z.string().min(1, "姓名不能为空").max(50).optional(),
	gender: z.enum(["male", "female"]).optional().nullable(),
	position: z.string().max(50).optional().nullable(),
	email: z.string().email().max(100).optional().nullable(),
	phone: z.string().max(20).optional().nullable(),
	homeAddress: z.string().optional().nullable(),
	avatarUrl: z.string().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// ==========================================
// Part C: TypeScript Types
// ==========================================

export type SmStaff = typeof smStaff.$inferSelect;
export type NewSmStaff = typeof smStaff.$inferInsert;
export type UpdateSmStaff = z.infer<typeof updateSmStaffSchema>;
