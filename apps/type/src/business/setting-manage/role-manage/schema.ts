/**
 * @file 角色与权限管理模块 Schema
 * @description 定义角色、权限相关的表结构，前缀 sm_
 * @module role-manage
 */

import { index, pgTable, text, boolean, uniqueIndex, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { primaryId, timestamps } from "../../../common";
import { smStaff } from "../user-manage/schema";

// ==========================================
// Part A: Database Table Definitions
// ==========================================

/** 角色信息表 */
export const smRoles = pgTable(
	"sm_roles",
	{
		id: primaryId(),
		/** 角色名称 */
		roleName: varchar("role_name", { length: 100 }).notNull(),
		/** 角色编码 */
		code: varchar("code", { length: 50 }).notNull(),
		/** 角色描述 */
		description: text("description"),
		/** 是否启用 */
		isEnabled: boolean("is_enabled").default(true),
		...timestamps,
	},
	(table) => [uniqueIndex("sm_roles_code_idx").on(table.code), index("sm_roles_role_name_idx").on(table.roleName)],
);

/** 权限信息表 */
export const smPermissions = pgTable(
	"sm_permissions",
	{
		id: primaryId(),
		/** 权限名称 */
		permissionName: varchar("permission_name", { length: 100 }).notNull(),
		/** 权限编码 */
		permissionCode: varchar("permission_code", { length: 100 }).notNull(),
		/** 权限类型 */
		permissionType: varchar("permission_type", { length: 50 }),
		/** 资源路径 */
		resourcePath: text("resource_path"),
		...timestamps,
	},
	(table) => [
		index("sm_permissions_permission_code_idx").on(table.permissionCode),
		index("sm_permissions_permission_type_idx").on(table.permissionType),
	],
);

/** 角色权限关联表 */
export const smRolePermissions = pgTable(
	"sm_role_permissions",
	{
		id: primaryId(),
		/** 关联角色 ID */
		roleId: uuid("role_id")
			.references(() => smRoles.id)
			.notNull(),
		/** 关联权限 ID */
		permissionId: uuid("permission_id")
			.references(() => smPermissions.id)
			.notNull(),
		...timestamps,
	},
	(table) => [
		index("sm_role_permissions_role_id_idx").on(table.roleId),
		index("sm_role_permissions_permission_id_idx").on(table.permissionId),
	],
);

/** 员工角色关联表 */
export const smStaffRoles = pgTable(
	"sm_staff_roles",
	{
		id: primaryId(),
		/** 关联员工 ID */
		staffId: uuid("staff_id")
			.references(() => smStaff.id)
			.notNull(),
		/** 关联角色 ID */
		roleId: uuid("role_id")
			.references(() => smRoles.id)
			.notNull(),
		...timestamps,
	},
	(table) => [
		index("sm_staff_roles_staff_id_idx").on(table.staffId),
		index("sm_staff_roles_role_id_idx").on(table.roleId),
	],
);

/** 数据权限表 */
export const smDataPermissions = pgTable(
	"sm_data_permissions",
	{
		id: primaryId(),
		/** 关联角色 ID */
		roleId: uuid("role_id")
			.references(() => smRoles.id)
			.notNull(),
		/** 权限规则 */
		permissionRule: text("permission_rule"),
		/** 权限范围 */
		scope: varchar("scope", { length: 50 }),
		/** 数据过滤条件 */
		dataFilter: jsonb("data_filter"),

		...timestamps,
	},
	(table) => [index("sm_data_permissions_role_id_idx").on(table.roleId)],
);

import { varchar } from "drizzle-orm/pg-core";

// ==========================================
// Part B: Zod Runtime Schemas
// ==========================================

// --- smRoles ---
export const insertSmRoleSchema = createInsertSchema(smRoles, {
	roleName: (schema) => schema.min(1, "角色名称不能为空").max(100),
	code: (schema) => schema.min(1, "角色编码不能为空").max(50),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectSmRoleSchema = createSelectSchema(smRoles);

export const updateSmRoleSchema = z.object({
	id: z.string().uuid(),
	roleName: z.string().min(1, "角色名称不能为空").max(100).optional(),
	code: z.string().min(1, "角色编码不能为空").max(50).optional(),
	description: z.string().optional().nullable(),
	isEnabled: z.boolean().optional(),
});

// --- smPermissions ---
export const insertSmPermissionSchema = createInsertSchema(smPermissions, {
	permissionName: (schema) => schema.min(1, "权限名称不能为空").max(100),
	permissionCode: (schema) => schema.min(1, "权限编码不能为空").max(100),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectSmPermissionSchema = createSelectSchema(smPermissions);

export const updateSmPermissionSchema = z.object({
	id: z.string().uuid(),
	permissionName: z.string().min(1, "权限名称不能为空").max(100).optional(),
	permissionCode: z.string().min(1, "权限编码不能为空").max(100).optional(),
	permissionType: z.string().max(50).optional().nullable(),
	resourcePath: z.string().optional().nullable(),
});

// --- smRolePermissions ---
export const insertSmRolePermissionSchema = createInsertSchema(smRolePermissions).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectSmRolePermissionSchema = createSelectSchema(smRolePermissions);

export const updateSmRolePermissionSchema = z.object({
	id: z.string().uuid(),
	roleId: z.string().uuid().optional(),
	permissionId: z.string().uuid().optional(),
});

// --- smStaffRoles ---
export const insertSmStaffRoleSchema = createInsertSchema(smStaffRoles).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectSmStaffRoleSchema = createSelectSchema(smStaffRoles);

export const updateSmStaffRoleSchema = z.object({
	id: z.string().uuid(),
	staffId: z.string().uuid().optional(),
	roleId: z.string().uuid().optional(),
});

// --- smDataPermissions ---
export const insertSmDataPermissionSchema = createInsertSchema(smDataPermissions).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectSmDataPermissionSchema = createSelectSchema(smDataPermissions);

export const updateSmDataPermissionSchema = z.object({
	id: z.string().uuid(),
	roleId: z.string().uuid().optional(),
	permissionRule: z.string().optional().nullable(),
	scope: z.string().max(50).optional().nullable(),
	dataFilter: z.any().optional().nullable(),
});

// ==========================================
// Part C: TypeScript Types
// ==========================================

export type SmRole = typeof smRoles.$inferSelect;
export type NewSmRole = typeof smRoles.$inferInsert;
export type UpdateSmRole = z.infer<typeof updateSmRoleSchema>;

export type SmPermission = typeof smPermissions.$inferSelect;
export type NewSmPermission = typeof smPermissions.$inferInsert;
export type UpdateSmPermission = z.infer<typeof updateSmPermissionSchema>;

export type SmRolePermission = typeof smRolePermissions.$inferSelect;
export type NewSmRolePermission = typeof smRolePermissions.$inferInsert;
export type UpdateSmRolePermission = z.infer<typeof updateSmRolePermissionSchema>;

export type SmStaffRole = typeof smStaffRoles.$inferSelect;
export type NewSmStaffRole = typeof smStaffRoles.$inferInsert;
export type UpdateSmStaffRole = z.infer<typeof updateSmStaffRoleSchema>;

export type SmDataPermission = typeof smDataPermissions.$inferSelect;
export type NewSmDataPermission = typeof smDataPermissions.$inferInsert;
export type UpdateSmDataPermission = z.infer<typeof updateSmDataPermissionSchema>;
