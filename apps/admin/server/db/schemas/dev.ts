/**
 * @file 开发团队模块 Schema
 * @description 开发团队相关的数据库表定义，包括配置中心、数据字典、菜单管理、缓存配置等
 */

import { index, pgTable, text, integer, boolean, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { primaryId, timestamps, remarkField, statusEnum } from "./common";

/**
 * 配置类型表
 * @description 定义配置项的类型分类
 */
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

/**
 * 配置中心表
 * @description 系统配置项管理
 */
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

/**
 * 配置项定义表
 * @description 配置项的具体定义，关联配置类型
 */
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

/**
 * 数据字典表
 * @description 系统数据字典定义
 */
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

/**
 * 字典项表
 * @description 数据字典的具体项目
 */
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

/**
 * 菜单分组表
 * @description 菜单的顶级分组
 */
export const dtMenuGroups = pgTable("dt_menu_groups", {
	id: primaryId(),
	/** 分组名称 */
	groupName: text("group_name").notNull(),
	/** 分组编码 */
	groupCode: text("group_code").notNull(),
	/** 分组图标 */
	groupIcon: text("group_icon"),
	/** 排序序号 */
	sortOrder: integer("sort_order").default(0),
	...timestamps,
});

/**
 * 菜单目录表
 * @description 菜单目录，支持多级嵌套
 */
export const dtMenuCatalogs = pgTable("dt_menu_catalogs", {
	id: primaryId(),
	/** 父级目录ID（自引用） */
	parentId: uuid("parent_id").references((): any => dtMenuCatalogs.id),
	/** 关联的菜单分组ID */
	groupId: uuid("group_id").references(() => dtMenuGroups.id),
	/** 目录名称 */
	catalogName: text("catalog_name").notNull(),
	/** 目录路径 */
	catalogPath: text("catalog_path"),
	/** 目录图标 */
	catalogIcon: text("catalog_icon"),
	/** 排序序号 */
	sortOrder: integer("sort_order").default(0),
	...timestamps,
});

/**
 * 菜单项表
 * @description 具体的菜单项定义
 */
export const dtMenuItems = pgTable(
	"dt_menu_items",
	{
		id: primaryId(),
		/** 关联的目录ID */
		catalogId: uuid("catalog_id").references(() => dtMenuCatalogs.id),
		/** 菜单名称 */
		menuName: text("menu_name").notNull(),
		/** 路由路径 */
		path: text("path").notNull(),
		/** 组件路径 */
		componentPath: text("component_path"),
		/** 菜单图标 */
		menuIcon: text("menu_icon"),
		/** 排序序号 */
		sortOrder: integer("sort_order").default(0),
		/** 是否可见 */
		isVisible: boolean("is_visible").default(true),
		/** 是否缓存 */
		isCache: boolean("is_cache").default(false),
		/** 是否外链 */
		isExternal: boolean("is_external").default(false),
		/** 重定向路径 */
		redirectPath: text("redirect_path"),
		...timestamps,
	},
	(table) => [index("dt_menu_items_path_idx").on(table.path)],
);

/**
 * 缓存配置表
 * @description 系统缓存配置管理
 */
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
