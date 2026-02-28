/**
 * @file 认证相关 Schema
 * @description 定义用户认证相关的表结构和类型
 * @module auth
 */

import { index, pgTable, text, varchar, uuid, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { primaryId, timestamps } from "../../common";

// ==========================================
// Part A: Database Table Definitions
// ==========================================

/**
 * Neon Auth 用户映射表
 * @description 用于关联 Neon Auth 用户 ID 与业务表中的用户记录
 */
export const authUserMapping = pgTable(
	"auth_user_mapping",
	{
		id: primaryId(),
		/** Neon Auth 用户 ID */
		neonAuthId: uuid("neon_auth_id").notNull().unique(),
		/** 员工 ID（关联 sm_staff 表） */
		staffId: uuid("staff_id"),
		/** 业主 ID（关联 pph_owners 表） */
		ownerId: uuid("owner_id"),
		/** 角色：staff | owner */
		userType: varchar("user_type", { length: 20 }).notNull(),
		/** 是否已迁移 */
		migrated: boolean("migrated").default(false),
		/** 迁移时间 */
		migratedAt: timestamp("migrated_at"),
		...timestamps,
	},
	(table) => [
		index("auth_user_mapping_neon_auth_id_idx").on(table.neonAuthId),
		index("auth_user_mapping_staff_id_idx").on(table.staffId),
		index("auth_user_mapping_owner_id_idx").on(table.ownerId),
	],
);

/**
 * 角色定义表
 * @description 定义系统角色及其权限
 */
export const authRoles = pgTable(
	"auth_roles",
	{
		id: primaryId(),
		/** 角色名称 */
		roleName: varchar("role_name", { length: 50 }).notNull(),
		/** 角色编码 */
		roleCode: varchar("role_code", { length: 50 }).notNull().unique(),
		/** 角色描述 */
		description: text("description"),
		/** 权限码列表（JSON 数组） */
		permissions: text("permissions").default("[]"),
		/** 是否为系统角色（不可删除） */
		isSystem: boolean("is_system").default(false),
		/** 是否启用 */
		enabled: boolean("enabled").default(true),
		...timestamps,
	},
	(table) => [index("auth_roles_role_code_idx").on(table.roleCode)],
);

/**
 * 用户角色关联表
 * @description 关联用户与角色
 */
export const authUserRoles = pgTable(
	"auth_user_roles",
	{
		id: primaryId(),
		/** 关联 auth_user_mapping 表的 ID */
		userMappingId: uuid("user_mapping_id")
			.references(() => authUserMapping.id)
			.notNull(),
		/** 关联 auth_roles 表的 ID */
		roleId: uuid("role_id")
			.references(() => authRoles.id)
			.notNull(),
		...timestamps,
	},
	(table) => [
		index("auth_user_roles_user_mapping_id_idx").on(table.userMappingId),
		index("auth_user_roles_role_id_idx").on(table.roleId),
	],
);

// ==========================================
// Part B: Zod Runtime Schemas
// ==========================================

// --- authUserMapping ---
export const insertAuthUserMappingSchema = createInsertSchema(authUserMapping, {
	neonAuthId: (schema) => schema,
	userType: (schema) => schema,
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
	migratedAt: true,
});

export const selectAuthUserMappingSchema = createSelectSchema(authUserMapping);

export const updateAuthUserMappingSchema = z.object({
	id: z.string().uuid(),
	neonAuthId: z.string().uuid().optional(),
	staffId: z.string().uuid().optional().nullable(),
	ownerId: z.string().uuid().optional().nullable(),
	userType: z.enum(["staff", "owner"]).optional(),
	migrated: z.boolean().optional(),
	migratedAt: z.date().optional(),
});

// --- authRoles ---
export const insertAuthRolesSchema = createInsertSchema(authRoles, {
	roleName: (schema) => schema.min(1, "角色名称不能为空").max(50),
	roleCode: (schema) => schema.min(1, "角色编码不能为空").max(50),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectAuthRolesSchema = createSelectSchema(authRoles);

export const updateAuthRolesSchema = z.object({
	id: z.string().uuid(),
	roleName: z.string().min(1).max(50).optional(),
	description: z.string().optional(),
	permissions: z.string().optional(),
	isSystem: z.boolean().optional(),
	enabled: z.boolean().optional(),
});

// --- authUserRoles ---
export const insertAuthUserRolesSchema = createInsertSchema(authUserRoles).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectAuthUserRolesSchema = createSelectSchema(authUserRoles);

export const updateAuthUserRolesSchema = z.object({
	id: z.string().uuid(),
	userMappingId: z.string().uuid().optional(),
	roleId: z.string().uuid().optional(),
});

// ==========================================
// Part C: TypeScript Types
// ==========================================

export type AuthUserMapping = typeof authUserMapping.$inferSelect;
export type NewAuthUserMapping = typeof authUserMapping.$inferInsert;
export type UpdateAuthUserMapping = z.infer<typeof updateAuthUserMappingSchema>;

export type AuthRoles = typeof authRoles.$inferSelect;
export type NewAuthRoles = typeof authRoles.$inferInsert;
export type UpdateAuthRoles = z.infer<typeof updateAuthRolesSchema>;

export type AuthUserRoles = typeof authUserRoles.$inferSelect;
export type NewAuthUserRoles = typeof authUserRoles.$inferInsert;
export type UpdateAuthUserRoles = z.infer<typeof updateAuthUserRolesSchema>;

// ==========================================
// Part D: Role Enum
// ==========================================

/**
 * 系统角色枚举
 */
// ==========================================
// Part E: Sensitive Data Mask Configuration
// ==========================================

/**
 * 敏感字段掩码配置
 * @description 定义需要掩码处理的字段及其掩码规则
 */
export const sensitiveFieldConfig = {
	/** 需要掩码的字段及其掩码规则 */
	fields: {
		/** 身份证号：显示前3位和后4位 */
		idCard: { maskStart: 3, maskEnd: 4, maskChar: "*" },
		/** 手机号：显示前3位和后4位 */
		phone: { maskStart: 3, maskEnd: 4, maskChar: "*" },
		/** 银行卡号：显示前4位和后4位 */
		bankCard: { maskStart: 4, maskEnd: 4, maskChar: "*" },
		/** 邮箱：显示 @ 前的第1位和后2位 */
		email: { maskStart: 1, maskEnd: 2, maskChar: "*", separator: "@" },
		/** 家庭地址：掩码中间部分 */
		address: { maskStart: 6, maskEnd: 0, maskChar: "*" },
		/** 真实姓名：掩码中间字符（2字及以上） */
		realName: { maskMiddle: true, maskChar: "*" },
		/** 密码：不返回此字段 */
		password: { hidden: true },
		/** 支付密码：不返回此字段 */
		payPassword: { hidden: true },
		/** 授权令牌：显示前6位 */
		token: { maskStart: 6, maskEnd: 0, maskChar: "*" },
	},
	/** 模块与字段映射 */
	moduleFields: {
		staff: ["idCard", "phone", "address", "realName"],
		owner: ["idCard", "phone", "address", "bankCard", "realName"],
		user: ["phone", "email", "realName"],
	},
} as const;

export type SensitiveFieldConfig = typeof sensitiveFieldConfig;

export const systemRoleEnum = [
	"super_admin", // 超级管理员
	"org_admin", // 组织管理员
	"community_admin", // 小区管理员
	"staff", // 物业员工
	"owner", // 业主/住户
] as const;

export type SystemRole = (typeof systemRoleEnum)[number];

/**
 * 角色权限码定义
 */
export const rolePermissions: Record<SystemRole, string[]> = {
	super_admin: ["*"], // 拥有所有权限
	org_admin: [
		"community:read",
		"community:create",
		"community:update",
		"community:delete",
		"staff:read",
		"staff:create",
		"staff:update",
		"staff:delete",
		"house:read",
		"house:create",
		"house:update",
		"expense:read",
		"expense:create",
		"expense:approve",
		"repair:read",
		"repair:update",
		"patrol:read",
		"patrol:create",
		"patrol:update",
		"parking:read",
		"parking:create",
		"parking:update",
		"contract:read",
		"contract:create",
		"contract:update",
	],
	community_admin: [
		"community:read",
		"staff:read",
		"staff:create",
		"staff:update",
		"house:read",
		"house:update",
		"expense:read",
		"expense:create",
		"expense:approve",
		"repair:read",
		"repair:update",
		"patrol:read",
		"patrol:create",
		"patrol:update",
		"parking:read",
		"parking:create",
		"parking:update",
		"contract:read",
		"contract:create",
	],
	staff: [
		"community:read",
		"house:read",
		"expense:read",
		"expense:create",
		"repair:read",
		"repair:update",
		"patrol:read",
		"patrol:create",
		"patrol:update",
		"parking:read",
		"parking:create",
	],
	owner: ["house:read", "expense:read", "expense:pay", "repair:create", "repair:read", "parking:read"],
};
