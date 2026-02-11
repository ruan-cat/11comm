/**
 * @file 字典与配置管理模块 Schema
 * @description 定义数据字典、系统配置相关的表结构，前缀 dt_
 * @module dictionary-manage
 */

import { index, pgTable, text, integer, boolean, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { primaryId, timestamps, remarkField, statusEnum } from "../../../common";

// ==========================================
// Part A: Database Table Definitions
// ==========================================

/** 配置类型表 */
export const dtConfigTypes = pgTable("dt_config_types", {
	id: primaryId(),
	/** 类型名称 */
	typeName: text("type_name").notNull(),
	/** 类型编码 */
	typeCode: text("type_code").notNull(),
	/** 类型描述 */
	typeDescription: text("type_description"),
	/** 排序序号 */
	sortOrder: integer("sort_order").default(0),
	...timestamps,
});

/** 配置中心表 */
export const dtConfigs = pgTable(
	"dt_configs",
	{
		id: primaryId(),
		/** 配置名称 */
		configName: text("config_name").notNull(),
		/** 配置类型 */
		configType: text("config_type"),
		/** 配置键（唯一） */
		configKey: text("config_key").notNull(),
		/** 配置值 */
		configValue: text("config_value"),
		/** 默认值 */
		defaultValue: text("default_value"),
		/** 配置描述 */
		configDescription: text("config_description"),
		/** 排序序号 */
		sortOrder: integer("sort_order").default(0),
		/** 创建人 */
		createdBy: text("created_by"),
		/** 更新人 */
		updatedBy: text("updated_by"),
		/** 状态 */
		status: statusEnum("status").default("enabled"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [uniqueIndex("dt_configs_config_key_idx").on(table.configKey)],
);

/** 配置项定义表 */
export const dtConfigItems = pgTable("dt_config_items", {
	id: primaryId(),
	/** 关联的配置类型ID */
	typeId: uuid("type_id")
		.notNull()
		.references(() => dtConfigTypes.id),
	/** 配置项名称 */
	itemName: text("item_name").notNull(),
	/** 配置项键 */
	itemKey: text("item_key").notNull(),
	/** 数据类型 */
	dataType: text("data_type"),
	/** 验证规则 */
	validationRule: text("validation_rule"),
	...timestamps,
});

/** 数据字典表 */
export const dtDictionaries = pgTable(
	"dt_dictionaries",
	{
		id: primaryId(),
		/** 字典名称 */
		dictionaryName: text("dictionary_name").notNull(),
		/** 字典编码（唯一） */
		dictionaryCode: text("dictionary_code").notNull(),
		/** 字典类型 */
		dictionaryType: text("dictionary_type"),
		/** 字典描述 */
		dictionaryDescription: text("dictionary_description"),
		/** 备注 */
		remark: remarkField(),
		...timestamps,
	},
	(table) => [uniqueIndex("dt_dictionaries_dictionary_code_idx").on(table.dictionaryCode)],
);

/** 字典项表 */
export const dtDictionaryItems = pgTable("dt_dictionary_items", {
	id: primaryId(),
	/** 关联的字典ID */
	dictionaryId: uuid("dictionary_id")
		.notNull()
		.references(() => dtDictionaries.id),
	/** 字典项标签 */
	itemLabel: text("item_label").notNull(),
	/** 字典项值 */
	itemValue: text("item_value").notNull(),
	/** 排序序号 */
	sortOrder: integer("sort_order").default(0),
	/** 是否默认 */
	isDefault: boolean("is_default").default(false),
	...timestamps,
});

/** 缓存配置表 */
export const dtCacheConfigs = pgTable("dt_cache_configs", {
	id: primaryId(),
	/** 缓存键 */
	cacheKey: text("cache_key").notNull(),
	/** 缓存类型 */
	cacheType: text("cache_type"),
	/** 过期时间（秒） */
	expireTime: integer("expire_time"),
	/** 刷新策略 */
	refreshStrategy: text("refresh_strategy"),
	...timestamps,
});

// ==========================================
// Part B: Zod Runtime Schemas
// ==========================================

// --- dtConfigTypes ---
export const insertDtConfigTypeSchema = createInsertSchema(dtConfigTypes, {
	typeName: (schema) => schema.min(1, "类型名称不能为空"),
	typeCode: (schema) => schema.min(1, "类型编码不能为空"),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectDtConfigTypeSchema = createSelectSchema(dtConfigTypes);

export const updateDtConfigTypeSchema = z.object({
	id: z.string().uuid(),
	typeName: z.string().min(1, "类型名称不能为空").optional(),
	typeCode: z.string().min(1, "类型编码不能为空").optional(),
	typeDescription: z.string().optional().nullable(),
	sortOrder: z.number().int().optional(),
});

// --- dtConfigs ---
export const insertDtConfigSchema = createInsertSchema(dtConfigs, {
	configName: (schema) => schema.min(1, "配置名称不能为空"),
	configKey: (schema) => schema.min(1, "配置键不能为空"),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectDtConfigSchema = createSelectSchema(dtConfigs);

export const updateDtConfigSchema = z.object({
	id: z.string().uuid(),
	configName: z.string().min(1, "配置名称不能为空").optional(),
	configType: z.string().optional().nullable(),
	configKey: z.string().min(1, "配置键不能为空").optional(),
	configValue: z.string().optional().nullable(),
	defaultValue: z.string().optional().nullable(),
	configDescription: z.string().optional().nullable(),
	sortOrder: z.number().int().optional(),
	createdBy: z.string().optional().nullable(),
	updatedBy: z.string().optional().nullable(),
	status: z.enum(["enabled", "disabled"]).optional(),
	remark: z.string().optional().nullable(),
});

// --- dtConfigItems ---
export const insertDtConfigItemSchema = createInsertSchema(dtConfigItems, {
	itemName: (schema) => schema.min(1, "配置项名称不能为空"),
	itemKey: (schema) => schema.min(1, "配置项键不能为空"),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectDtConfigItemSchema = createSelectSchema(dtConfigItems);

export const updateDtConfigItemSchema = z.object({
	id: z.string().uuid(),
	typeId: z.string().uuid().optional(),
	itemName: z.string().min(1, "配置项名称不能为空").optional(),
	itemKey: z.string().min(1, "配置项键不能为空").optional(),
	dataType: z.string().optional().nullable(),
	validationRule: z.string().optional().nullable(),
});

// --- dtDictionaries ---
export const insertDtDictionarySchema = createInsertSchema(dtDictionaries, {
	dictionaryName: (schema) => schema.min(1, "字典名称不能为空"),
	dictionaryCode: (schema) => schema.min(1, "字典编码不能为空"),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectDtDictionarySchema = createSelectSchema(dtDictionaries);

export const updateDtDictionarySchema = z.object({
	id: z.string().uuid(),
	dictionaryName: z.string().min(1, "字典名称不能为空").optional(),
	dictionaryCode: z.string().min(1, "字典编码不能为空").optional(),
	dictionaryType: z.string().optional().nullable(),
	dictionaryDescription: z.string().optional().nullable(),
	remark: z.string().optional().nullable(),
});

// --- dtDictionaryItems ---
export const insertDtDictionaryItemSchema = createInsertSchema(dtDictionaryItems, {
	itemLabel: (schema) => schema.min(1, "字典项标签不能为空"),
	itemValue: (schema) => schema.min(1, "字典项值不能为空"),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectDtDictionaryItemSchema = createSelectSchema(dtDictionaryItems);

export const updateDtDictionaryItemSchema = z.object({
	id: z.string().uuid(),
	dictionaryId: z.string().uuid().optional(),
	itemLabel: z.string().min(1, "字典项标签不能为空").optional(),
	itemValue: z.string().min(1, "字典项值不能为空").optional(),
	sortOrder: z.number().int().optional(),
	isDefault: z.boolean().optional(),
});

// --- dtCacheConfigs ---
export const insertDtCacheConfigSchema = createInsertSchema(dtCacheConfigs, {
	cacheKey: (schema) => schema.min(1, "缓存键不能为空"),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const selectDtCacheConfigSchema = createSelectSchema(dtCacheConfigs);

export const updateDtCacheConfigSchema = z.object({
	id: z.string().uuid(),
	cacheKey: z.string().min(1, "缓存键不能为空").optional(),
	cacheType: z.string().optional().nullable(),
	expireTime: z.number().int().optional().nullable(),
	refreshStrategy: z.string().optional().nullable(),
});

// ==========================================
// Part C: TypeScript Types
// ==========================================

export type DtConfigType = typeof dtConfigTypes.$inferSelect;
export type NewDtConfigType = typeof dtConfigTypes.$inferInsert;
export type UpdateDtConfigType = z.infer<typeof updateDtConfigTypeSchema>;

export type DtConfig = typeof dtConfigs.$inferSelect;
export type NewDtConfig = typeof dtConfigs.$inferInsert;
export type UpdateDtConfig = z.infer<typeof updateDtConfigSchema>;

export type DtConfigItem = typeof dtConfigItems.$inferSelect;
export type NewDtConfigItem = typeof dtConfigItems.$inferInsert;
export type UpdateDtConfigItem = z.infer<typeof updateDtConfigItemSchema>;

export type DtDictionary = typeof dtDictionaries.$inferSelect;
export type NewDtDictionary = typeof dtDictionaries.$inferInsert;
export type UpdateDtDictionary = z.infer<typeof updateDtDictionarySchema>;

export type DtDictionaryItem = typeof dtDictionaryItems.$inferSelect;
export type NewDtDictionaryItem = typeof dtDictionaryItems.$inferInsert;
export type UpdateDtDictionaryItem = z.infer<typeof updateDtDictionaryItemSchema>;

export type DtCacheConfig = typeof dtCacheConfigs.$inferSelect;
export type NewDtCacheConfig = typeof dtCacheConfigs.$inferInsert;
export type UpdateDtCacheConfig = z.infer<typeof updateDtCacheConfigSchema>;
