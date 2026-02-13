/**
 * @file 系统管理模块 Schema
 * @description 定义系统配置、注册协议及初始化相关的表结构，前缀 sm_
 * @module system-manage
 */

import { index, pgTable, text, varchar, uniqueIndex, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { primaryId, timestamps, statusEnum } from "../../../common";

// ==========================================
// Part A: Database Table Definitions
// ==========================================

/** 系统配置表 */
export const smSystemConfigs = pgTable(
	"sm_system_configs",
	{
		id: primaryId(),
		/** 配置键 */
		configKey: varchar("config_key", { length: 100 }).notNull(),
		/** 配置值 */
		configValue: text("config_value"),
		/** 配置类型 */
		configType: varchar("config_type", { length: 50 }),
		/** 配置描述 */
		configDescription: text("config_description"),
		/** 状态 */
		status: statusEnum("status").default("enabled"),

		...timestamps,
	},
	(table) => [
		uniqueIndex("sm_system_configs_config_key_idx").on(table.configKey),
		index("sm_system_configs_config_type_idx").on(table.configType),
	],
);

/** 注册协议表 */
export const smRegisterProtocols = pgTable(
	"sm_register_protocols",
	{
		id: primaryId(),
		/** 协议类型 */
		protocolType: varchar("protocol_type", { length: 50 }),
		/** 协议标题 */
		protocolTitle: varchar("protocol_title", { length: 200 }).notNull(),
		/** 协议内容 */
		protocolContent: text("protocol_content"),
		/** 版本号 */
		version: varchar("version", { length: 20 }),
		/** 状态 */
		status: statusEnum("status").default("enabled"),
		...timestamps,
	},
	(table) => [
		index("sm_register_protocols_protocol_type_idx").on(table.protocolType),
		index("sm_register_protocols_status_idx").on(table.status),
	],
);

/** 小区初始化配置表 */
export const smInitializeCells = pgTable(
	"sm_initialize_cells",
	{
		id: primaryId(),
		/** 初始化项目 */
		initItem: varchar("init_item", { length: 100 }).notNull(),
		/** 初始化状态 */
		initStatus: varchar("init_status", { length: 50 }),
		/** 配置参数 */
		configParams: jsonb("config_params"),

		...timestamps,
	},
	(table) => [
		index("sm_initialize_cells_init_item_idx").on(table.initItem),
		index("sm_initialize_cells_init_status_idx").on(table.initStatus),
	],
);

// ==========================================
// Part B: Zod Runtime Schemas
// ==========================================

// --- smSystemConfigs ---
export const insertSmSystemConfigSchema = createInsertSchema(smSystemConfigs, {
	configKey: (schema) => schema.min(1, "配置键不能为空"),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectSmSystemConfigSchema = createSelectSchema(smSystemConfigs);

export const updateSmSystemConfigSchema = z.object({
	id: z.string().uuid(),
	configKey: z.string().min(1, "配置键不能为空").optional(),
	configValue: z.string().optional().nullable(),
	configType: z.string().max(50).optional().nullable(),
	configDescription: z.string().optional().nullable(),
	status: z.enum(["enabled", "disabled"]).optional(),
});

// --- smRegisterProtocols ---
export const insertSmRegisterProtocolSchema = createInsertSchema(smRegisterProtocols, {
	protocolTitle: (schema) => schema.min(1, "协议标题不能为空").max(200),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectSmRegisterProtocolSchema = createSelectSchema(smRegisterProtocols);

export const updateSmRegisterProtocolSchema = z.object({
	id: z.string().uuid(),
	protocolType: z.string().max(50).optional().nullable(),
	protocolTitle: z.string().min(1, "协议标题不能为空").max(200).optional(),
	protocolContent: z.string().optional().nullable(),
	version: z.string().max(20).optional().nullable(),
	status: z.enum(["enabled", "disabled"]).optional(),
});

// --- smInitializeCells ---
export const insertSmInitializeCellSchema = createInsertSchema(smInitializeCells, {
	initItem: (schema) => schema.min(1, "初始化项目不能为空").max(100),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectSmInitializeCellSchema = createSelectSchema(smInitializeCells);

export const updateSmInitializeCellSchema = z.object({
	id: z.string().uuid(),
	initItem: z.string().min(1, "初始化项目不能为空").max(100).optional(),
	initStatus: z.string().max(50).optional().nullable(),
	configParams: z.any().optional().nullable(),
});

/** 密码修改记录表 */
export const smChangePasswordRecords = pgTable(
	"sm_change_password_records",
	{
		id: primaryId(),
		/** 用户名 */
		username: varchar("username", { length: 100 }).notNull(),
		/** 真实姓名 */
		realName: varchar("real_name", { length: 100 }),
		/** 所属部门 */
		department: varchar("department", { length: 100 }),
		/** 修改时间 */
		changeTime: varchar("change_time", { length: 50 }),
		/** 修改IP */
		changeIp: varchar("change_ip", { length: 50 }),
		/** 修改类型 */
		changeType: varchar("change_type", { length: 50 }),
		/** 操作人 */
		operator: varchar("operator", { length: 100 }),
		/** 状态 */
		status: varchar("status", { length: 50 }),
		/** 备注 */
		remark: text("remark"),
		...timestamps,
	},
	(table) => [
		index("sm_change_password_records_username_idx").on(table.username),
		index("sm_change_password_records_change_time_idx").on(table.changeTime),
	],
);

// ==========================================
// Part C: TypeScript Types
// ==========================================

export type SmSystemConfig = typeof smSystemConfigs.$inferSelect;
export type NewSmSystemConfig = typeof smSystemConfigs.$inferInsert;
export type UpdateSmSystemConfig = z.infer<typeof updateSmSystemConfigSchema>;

export type SmRegisterProtocol = typeof smRegisterProtocols.$inferSelect;
export type NewSmRegisterProtocol = typeof smRegisterProtocols.$inferInsert;
export type UpdateSmRegisterProtocol = z.infer<typeof updateSmRegisterProtocolSchema>;

export type SmInitializeCell = typeof smInitializeCells.$inferSelect;
export type NewSmInitializeCell = typeof smInitializeCells.$inferInsert;
export type UpdateSmInitializeCell = z.infer<typeof updateSmInitializeCellSchema>;

// --- smChangePasswordRecords ---
export const insertSmChangePasswordRecordSchema = createInsertSchema(smChangePasswordRecords, {
	username: (schema) => schema.min(1, "用户名不能为空").max(100),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectSmChangePasswordRecordSchema = createSelectSchema(smChangePasswordRecords);

export type SmChangePasswordRecord = typeof smChangePasswordRecords.$inferSelect;
export type NewSmChangePasswordRecord = typeof smChangePasswordRecords.$inferInsert;
