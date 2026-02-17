/**
 * @file 菜单管理模块 Schema
 * @description 定义菜单分组、目录及菜单项相关的表结构，前缀 dt_
 * @module menu-manage
 */

import { index, pgTable, text, integer, boolean, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { primaryId, timestamps } from "../../../common";

// ==========================================
// Part A: Database Table Definitions
// ==========================================

/** 菜单分组表 */
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

/** 菜单目录表 */
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

/** 菜单项表 */
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

// ==========================================
// Part B: Zod Runtime Schemas
// ==========================================

// --- dtMenuGroups ---
export const insertDtMenuGroupSchema = createInsertSchema(dtMenuGroups, {
	groupName: (schema) => schema.min(1, "分组名称不能为空"),
	groupCode: (schema) => schema.min(1, "分组编码不能为空"),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectDtMenuGroupSchema = createSelectSchema(dtMenuGroups);

export const updateDtMenuGroupSchema = z.object({
	id: z.string().uuid(),
	groupName: z.string().min(1, "分组名称不能为空").optional(),
	groupCode: z.string().min(1, "分组编码不能为空").optional(),
	groupIcon: z.string().optional().nullable(),
	sortOrder: z.number().int().optional(),
});

// --- dtMenuCatalogs ---
export const insertDtMenuCatalogSchema = createInsertSchema(dtMenuCatalogs, {
	catalogName: (schema) => schema.min(1, "目录名称不能为空"),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectDtMenuCatalogSchema = createSelectSchema(dtMenuCatalogs);

export const updateDtMenuCatalogSchema = z.object({
	id: z.string().uuid(),
	parentId: z.string().uuid().optional().nullable(),
	groupId: z.string().uuid().optional().nullable(),
	catalogName: z.string().min(1, "目录名称不能为空").optional(),
	catalogPath: z.string().optional().nullable(),
	catalogIcon: z.string().optional().nullable(),
	sortOrder: z.number().int().optional(),
});

// --- dtMenuItems ---
export const insertDtMenuItemSchema = createInsertSchema(dtMenuItems, {
	menuName: (schema) => schema.min(1, "菜单名称不能为空"),
	path: (schema) => schema.min(1, "路由路径不能为空"),
}).omit({
	id: true,
	createTime: true,
	updateTime: true,
});

export const selectDtMenuItemSchema = createSelectSchema(dtMenuItems);

export const updateDtMenuItemSchema = z.object({
	id: z.string().uuid(),
	catalogId: z.string().uuid().optional().nullable(),
	menuName: z.string().min(1, "菜单名称不能为空").optional(),
	path: z.string().min(1, "路由路径不能为空").optional(),
	componentPath: z.string().optional().nullable(),
	menuIcon: z.string().optional().nullable(),
	sortOrder: z.number().int().optional(),
	isVisible: z.boolean().optional(),
	isCache: z.boolean().optional(),
	isExternal: z.boolean().optional(),
	redirectPath: z.string().optional().nullable(),
});

// ==========================================
// Part C: TypeScript Types
// ==========================================

export type DtMenuGroup = typeof dtMenuGroups.$inferSelect;
export type NewDtMenuGroup = typeof dtMenuGroups.$inferInsert;
export type UpdateDtMenuGroup = z.infer<typeof updateDtMenuGroupSchema>;

export type DtMenuCatalog = typeof dtMenuCatalogs.$inferSelect;
export type NewDtMenuCatalog = typeof dtMenuCatalogs.$inferInsert;
export type UpdateDtMenuCatalog = z.infer<typeof updateDtMenuCatalogSchema>;

export type DtMenuItem = typeof dtMenuItems.$inferSelect;
export type NewDtMenuItem = typeof dtMenuItems.$inferInsert;
export type UpdateDtMenuItem = z.infer<typeof updateDtMenuItemSchema>;
