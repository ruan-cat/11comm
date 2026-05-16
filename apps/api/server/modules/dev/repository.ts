import { and, desc, eq, like, or, sql } from "drizzle-orm";
import {
	dtCacheConfigs,
	dtConfigs,
	dtDictionaries,
	dtDictionaryItems,
	dtConfigTypes,
	dtMenuCatalogs,
	dtMenuGroups,
	dtMenuItems,
} from "@01s-11comm/type";
import type { DbType } from "../../db";
import { formatDateTime } from "../../utils/format-date";
import type {
	AdminConfigCenterListItem,
	AdminDictionaryItemListItem,
	AdminDictionaryListItem,
	AdminDictionaryTypeListItem,
	AdminMenuCatalogListItem,
	AdminMenuGroupListItem,
	AdminMenuItemListItem,
	AdminRefreshCacheListItem,
	ListConfigCenterParams,
	ListDictionaryItemParams,
	ListDictionaryParams,
	ListDictionaryTypeParams,
	ListMenuCatalogParams,
	ListMenuGroupParams,
	ListMenuItemParams,
	ListRefreshCacheParams,
} from "./types";

export interface DevRepository {
	listRefreshCache: (params: ListRefreshCacheParams) => Promise<{ list: AdminRefreshCacheListItem[]; total: number }>;
	listConfigCenter: (params: ListConfigCenterParams) => Promise<{ list: AdminConfigCenterListItem[]; total: number }>;
	listDictionary: (params: ListDictionaryParams) => Promise<{ list: AdminDictionaryListItem[]; total: number }>;
	listDictionaryItem: (
		params: ListDictionaryItemParams,
	) => Promise<{ list: AdminDictionaryItemListItem[]; total: number }>;
	listDictionaryType: (
		params: ListDictionaryTypeParams,
	) => Promise<{ list: AdminDictionaryTypeListItem[]; total: number }>;
	listMenuCatalog: (params: ListMenuCatalogParams) => Promise<{ list: AdminMenuCatalogListItem[]; total: number }>;
	listMenuGroup: (params: ListMenuGroupParams) => Promise<{ list: AdminMenuGroupListItem[]; total: number }>;
	listMenuItem: (params: ListMenuItemParams) => Promise<{ list: AdminMenuItemListItem[]; total: number }>;
	createConfigCenter: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	getConfigCenterDetail: (id: string) => Promise<Record<string, unknown> | null>;
	updateConfigCenter: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	deleteConfigCenter: (id: string) => Promise<boolean>;
	createDictionary: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	getDictionaryDetail: (id: string) => Promise<Record<string, unknown> | null>;
	updateDictionary: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	deleteDictionary: (id: string) => Promise<boolean>;
	createDictionaryItem: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	getDictionaryItemDetail: (id: string) => Promise<Record<string, unknown> | null>;
	updateDictionaryItem: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	deleteDictionaryItem: (id: string) => Promise<boolean>;
	createDictionaryType: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	getDictionaryTypeDetail: (id: string) => Promise<Record<string, unknown> | null>;
	updateDictionaryType: (data: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
	deleteDictionaryType: (id: string) => Promise<boolean>;
}

export function createDevRepository(options: { db?: DbType } = {}): DevRepository {
	return options.db ? createDbDevRepository(options.db) : createInMemoryDevRepository();
}

export function createDbDevRepository(db: DbType): DevRepository {
	const fallback = createInMemoryDevRepository();

	return Object.assign(fallback, {
		async listRefreshCache(
			params: ListRefreshCacheParams,
		): Promise<{ list: AdminRefreshCacheListItem[]; total: number }> {
			const conditions = [];
			const keyword = params.cacheKey || params.cacheName || params.cacheCode;

			if (params.cacheId) {
				conditions.push(eq(dtCacheConfigs.id, params.cacheId));
			}
			if (keyword) {
				conditions.push(
					or(
						like(dtCacheConfigs.cacheCode, `%${keyword}%`),
						like(dtCacheConfigs.cacheName, `%${keyword}%`),
						like(dtCacheConfigs.cacheKey, `%${keyword}%`),
					),
				);
			}
			if (params.cacheType) {
				conditions.push(eq(dtCacheConfigs.cacheType, params.cacheType));
			}
			if (params.refreshPolicy) {
				conditions.push(eq(dtCacheConfigs.refreshStrategy, params.refreshPolicy));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(dtCacheConfigs)
				.where(where);
			const rows = await db
				.select()
				.from(dtCacheConfigs)
				.where(where)
				.orderBy(desc(dtCacheConfigs.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					cacheId: row.id,
					cacheCode: row.cacheCode,
					cacheName: row.cacheName,
					cacheKey: row.cacheKey,
					cacheType: row.cacheType ?? "",
					cacheGroup: row.cacheGroup ?? "",
					expireTime: row.expireTime ?? 0,
					description: row.description ?? "",
					refreshPolicy: row.refreshStrategy ?? "",
					status: row.status ?? "enabled",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listConfigCenter(
			params: ListConfigCenterParams,
		): Promise<{ list: AdminConfigCenterListItem[]; total: number }> {
			const conditions = [];
			if (params.configName) {
				conditions.push(like(dtConfigs.configName, `%${params.configName}%`));
			}
			if (params.configKey) {
				conditions.push(like(dtConfigs.configKey, `%${params.configKey}%`));
			}
			if (params.configType) {
				conditions.push(eq(dtConfigs.configType, params.configType));
			}
			if (params.status) {
				conditions.push(eq(dtConfigs.status, params.status as "enabled" | "disabled"));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(dtConfigs)
				.where(where);
			const rows = await db
				.select()
				.from(dtConfigs)
				.where(where)
				.orderBy(desc(dtConfigs.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					configName: row.configName,
					configType: row.configType,
					configKey: row.configKey,
					configValue: row.configValue,
					defaultValue: row.defaultValue,
					configDescription: row.configDescription,
					status: row.status,
					sortOrder: row.sortOrder,
					remark: row.remark,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
					createdBy: row.createdBy,
					updatedBy: row.updatedBy,
				})),
			};
		},

		async listDictionary(params: ListDictionaryParams): Promise<{ list: AdminDictionaryListItem[]; total: number }> {
			const conditions = [];
			if (params.dictionaryName) {
				conditions.push(like(dtDictionaries.dictionaryName, `%${params.dictionaryName}%`));
			}
			if (params.dictionaryCode) {
				conditions.push(like(dtDictionaries.dictionaryCode, `%${params.dictionaryCode}%`));
			}
			if (params.dictionaryType) {
				conditions.push(eq(dtDictionaries.dictionaryType, params.dictionaryType));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(dtDictionaries)
				.where(where);
			const rows = await db
				.select()
				.from(dtDictionaries)
				.where(where)
				.orderBy(desc(dtDictionaries.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					dictionaryName: row.dictionaryName,
					dictionaryCode: row.dictionaryCode,
					dictionaryType: row.dictionaryType,
					dictionaryDescription: row.dictionaryDescription,
					remark: row.remark,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listDictionaryItem(
			params: ListDictionaryItemParams,
		): Promise<{ list: AdminDictionaryItemListItem[]; total: number }> {
			const conditions = [];
			if (params.dictionaryId) {
				conditions.push(eq(dtDictionaryItems.dictionaryId, params.dictionaryId as any));
			}
			if (params.itemName) {
				conditions.push(like(dtDictionaryItems.itemLabel, `%${params.itemName}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(dtDictionaryItems)
				.where(where);
			const rows = await db
				.select()
				.from(dtDictionaryItems)
				.where(where)
				.orderBy(desc(dtDictionaryItems.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					dictionaryId: row.dictionaryId,
					itemName: row.itemLabel,
					itemCode: row.itemValue,
					itemValue: row.itemValue,
					sortOrder: row.sortOrder,
					remark: null,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listDictionaryType(
			params: ListDictionaryTypeParams,
		): Promise<{ list: AdminDictionaryTypeListItem[]; total: number }> {
			const conditions = [];
			if (params.typeName) {
				conditions.push(like(dtConfigTypes.typeName, `%${params.typeName}%`));
			}
			if (params.typeCode) {
				conditions.push(like(dtConfigTypes.typeCode, `%${params.typeCode}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(dtConfigTypes)
				.where(where);
			const rows = await db
				.select()
				.from(dtConfigTypes)
				.where(where)
				.orderBy(desc(dtConfigTypes.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					typeName: row.typeName,
					typeCode: row.typeCode,
					typeDescription: row.typeDescription,
					remark: null,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listMenuCatalog(params: ListMenuCatalogParams): Promise<{ list: AdminMenuCatalogListItem[]; total: number }> {
			const conditions = [];
			if (params.name) {
				conditions.push(like(dtMenuCatalogs.catalogName, `%${params.name}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(dtMenuCatalogs)
				.where(where);
			const rows = await db
				.select()
				.from(dtMenuCatalogs)
				.where(where)
				.orderBy(desc(dtMenuCatalogs.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					gid: row.groupId ?? "",
					groupType: "system",
					icon: row.catalogIcon ?? "",
					label: row.catalogName,
					name: row.catalogName,
					seq: String(row.sortOrder ?? 0),
					storeType: "property",
					typeText: "",
					storeTypeText: "",
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listMenuGroup(params: ListMenuGroupParams): Promise<{ list: AdminMenuGroupListItem[]; total: number }> {
			const conditions = [];
			if (params.groupName) {
				conditions.push(like(dtMenuGroups.groupName, `%${params.groupName}%`));
			}
			if (params.groupCode) {
				conditions.push(like(dtMenuGroups.groupCode, `%${params.groupCode}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(dtMenuGroups)
				.where(where);
			const rows = await db
				.select()
				.from(dtMenuGroups)
				.where(where)
				.orderBy(desc(dtMenuGroups.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					groupName: row.groupName,
					groupCode: row.groupCode,
					groupDescription: null,
					sortOrder: row.sortOrder,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},

		async listMenuItem(params: ListMenuItemParams): Promise<{ list: AdminMenuItemListItem[]; total: number }> {
			const conditions = [];
			if (params.catalogId) {
				conditions.push(eq(dtMenuItems.catalogId, params.catalogId as any));
			}
			if (params.menuName) {
				conditions.push(like(dtMenuItems.menuName, `%${params.menuName}%`));
			}

			const where = conditions.length > 0 ? and(...conditions) : undefined;
			const countResult = await db
				.select({ total: sql<number>`count(*)` })
				.from(dtMenuItems)
				.where(where);
			const rows = await db
				.select()
				.from(dtMenuItems)
				.where(where)
				.orderBy(desc(dtMenuItems.createTime))
				.limit(params.pageSize)
				.offset((params.pageIndex - 1) * params.pageSize);

			return {
				total: Number(countResult[0]?.total || 0),
				list: rows.map((row) => ({
					id: row.id,
					catalogId: row.catalogId,
					menuName: row.menuName,
					menuCode: null,
					menuPath: row.path,
					menuIcon: row.menuIcon,
					sortOrder: row.sortOrder,
					createTime: formatDateTime(row.createTime),
					updateTime: formatDateTime(row.updateTime),
				})),
			};
		},
		async createConfigCenter(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const [row] = await db
				.insert(dtConfigs)
				.values({
					configName: String(data.configName || ""),
					configKey: String(data.configKey || ""),
					configType: data.configType ? String(data.configType) : null,
					configValue: data.configValue ? String(data.configValue) : null,
					defaultValue: data.defaultValue ? String(data.defaultValue) : null,
					configDescription: data.configDescription ? String(data.configDescription) : null,
					sortOrder: data.sortOrder ? Number(data.sortOrder) : 0,
					status: (data.status as "enabled" | "disabled") || "enabled",
					remark: data.remark ? String(data.remark) : null,
					createdBy: data.createdBy ? String(data.createdBy) : null,
				})
				.returning();
			return row ?? null;
		},

		async getConfigCenterDetail(id: string): Promise<Record<string, unknown> | null> {
			const [row] = await db.select().from(dtConfigs).where(eq(dtConfigs.id, id)).limit(1);
			if (!row) return null;
			return {
				id: row.id,
				configName: row.configName,
				configType: row.configType,
				configKey: row.configKey,
				configValue: row.configValue,
				defaultValue: row.defaultValue,
				configDescription: row.configDescription,
				status: row.status,
				sortOrder: row.sortOrder,
				remark: row.remark,
				createdBy: row.createdBy,
				updatedBy: row.updatedBy,
				createTime: formatDateTime(row.createTime),
				updateTime: formatDateTime(row.updateTime),
			};
		},

		async updateConfigCenter(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const id = String(data.id || "");
			if (!id) return null;
			const updates: Record<string, unknown> = {};
			if (data.configName !== undefined) updates.configName = String(data.configName);
			if (data.configType !== undefined) updates.configType = data.configType ? String(data.configType) : null;
			if (data.configKey !== undefined) updates.configKey = String(data.configKey);
			if (data.configValue !== undefined) updates.configValue = data.configValue ? String(data.configValue) : null;
			if (data.defaultValue !== undefined) updates.defaultValue = data.defaultValue ? String(data.defaultValue) : null;
			if (data.configDescription !== undefined)
				updates.configDescription = data.configDescription ? String(data.configDescription) : null;
			if (data.sortOrder !== undefined) updates.sortOrder = Number(data.sortOrder);
			if (data.status !== undefined) updates.status = data.status;
			if (data.remark !== undefined) updates.remark = data.remark ? String(data.remark) : null;
			if (data.updatedBy !== undefined) updates.updatedBy = data.updatedBy ? String(data.updatedBy) : null;
			const [row] = await db.update(dtConfigs).set(updates).where(eq(dtConfigs.id, id)).returning();
			return row ?? null;
		},

		async deleteConfigCenter(id: string): Promise<boolean> {
			const result = await db.delete(dtConfigs).where(eq(dtConfigs.id, id)).returning({ id: dtConfigs.id });
			return result.length > 0;
		},

		async createDictionary(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const [row] = await db
				.insert(dtDictionaries)
				.values({
					dictionaryName: String(data.dictionaryName || ""),
					dictionaryCode: String(data.dictionaryCode || ""),
					dictionaryType: data.dictionaryType ? String(data.dictionaryType) : null,
					dictionaryDescription: data.dictionaryDescription ? String(data.dictionaryDescription) : null,
					remark: data.remark ? String(data.remark) : null,
				})
				.returning();
			return row ?? null;
		},

		async getDictionaryDetail(id: string): Promise<Record<string, unknown> | null> {
			const [row] = await db.select().from(dtDictionaries).where(eq(dtDictionaries.id, id)).limit(1);
			if (!row) return null;
			return {
				id: row.id,
				dictionaryName: row.dictionaryName,
				dictionaryCode: row.dictionaryCode,
				dictionaryType: row.dictionaryType,
				dictionaryDescription: row.dictionaryDescription,
				remark: row.remark,
				createTime: formatDateTime(row.createTime),
				updateTime: formatDateTime(row.updateTime),
			};
		},

		async updateDictionary(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const id = String(data.id || "");
			if (!id) return null;
			const updates: Record<string, unknown> = {};
			if (data.dictionaryName !== undefined) updates.dictionaryName = String(data.dictionaryName);
			if (data.dictionaryCode !== undefined) updates.dictionaryCode = String(data.dictionaryCode);
			if (data.dictionaryType !== undefined)
				updates.dictionaryType = data.dictionaryType ? String(data.dictionaryType) : null;
			if (data.dictionaryDescription !== undefined)
				updates.dictionaryDescription = data.dictionaryDescription ? String(data.dictionaryDescription) : null;
			if (data.remark !== undefined) updates.remark = data.remark ? String(data.remark) : null;
			const [row] = await db.update(dtDictionaries).set(updates).where(eq(dtDictionaries.id, id)).returning();
			return row ?? null;
		},

		async deleteDictionary(id: string): Promise<boolean> {
			const result = await db
				.delete(dtDictionaries)
				.where(eq(dtDictionaries.id, id))
				.returning({ id: dtDictionaries.id });
			return result.length > 0;
		},

		async createDictionaryItem(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const [row] = await db
				.insert(dtDictionaryItems)
				.values({
					dictionaryId: String(data.dictionaryId || ""),
					itemLabel: String(data.itemName || data.itemLabel || ""),
					itemValue: String(data.itemCode || data.itemValue || ""),
					sortOrder: data.sortOrder ? Number(data.sortOrder) : 0,
					isDefault: data.isDefault === true,
				})
				.returning();
			return row ?? null;
		},

		async getDictionaryItemDetail(id: string): Promise<Record<string, unknown> | null> {
			const [row] = await db.select().from(dtDictionaryItems).where(eq(dtDictionaryItems.id, id)).limit(1);
			if (!row) return null;
			return {
				id: row.id,
				dictionaryId: row.dictionaryId,
				itemName: row.itemLabel,
				itemCode: row.itemValue,
				itemValue: row.itemValue,
				sortOrder: row.sortOrder,
				isDefault: row.isDefault,
				createTime: formatDateTime(row.createTime),
				updateTime: formatDateTime(row.updateTime),
			};
		},

		async updateDictionaryItem(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const id = String(data.id || "");
			if (!id) return null;
			const updates: Record<string, unknown> = {};
			if (data.dictionaryId !== undefined) updates.dictionaryId = String(data.dictionaryId);
			if (data.itemName !== undefined || data.itemLabel !== undefined)
				updates.itemLabel = String(data.itemName || data.itemLabel);
			if (data.itemCode !== undefined || data.itemValue !== undefined)
				updates.itemValue = String(data.itemCode || data.itemValue);
			if (data.sortOrder !== undefined) updates.sortOrder = Number(data.sortOrder);
			if (data.isDefault !== undefined) updates.isDefault = data.isDefault === true;
			const [row] = await db.update(dtDictionaryItems).set(updates).where(eq(dtDictionaryItems.id, id)).returning();
			return row ?? null;
		},

		async deleteDictionaryItem(id: string): Promise<boolean> {
			const result = await db
				.delete(dtDictionaryItems)
				.where(eq(dtDictionaryItems.id, id))
				.returning({ id: dtDictionaryItems.id });
			return result.length > 0;
		},

		async createDictionaryType(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const [row] = await db
				.insert(dtConfigTypes)
				.values({
					typeName: String(data.typeName || ""),
					typeCode: String(data.typeCode || ""),
					typeDescription: data.typeDescription ? String(data.typeDescription) : null,
					sortOrder: data.sortOrder ? Number(data.sortOrder) : 0,
				})
				.returning();
			return row ?? null;
		},

		async getDictionaryTypeDetail(id: string): Promise<Record<string, unknown> | null> {
			const [row] = await db.select().from(dtConfigTypes).where(eq(dtConfigTypes.id, id)).limit(1);
			if (!row) return null;
			return {
				id: row.id,
				typeName: row.typeName,
				typeCode: row.typeCode,
				typeDescription: row.typeDescription,
				sortOrder: row.sortOrder,
				createTime: formatDateTime(row.createTime),
				updateTime: formatDateTime(row.updateTime),
			};
		},

		async updateDictionaryType(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
			const id = String(data.id || "");
			if (!id) return null;
			const updates: Record<string, unknown> = {};
			if (data.typeName !== undefined) updates.typeName = String(data.typeName);
			if (data.typeCode !== undefined) updates.typeCode = String(data.typeCode);
			if (data.typeDescription !== undefined)
				updates.typeDescription = data.typeDescription ? String(data.typeDescription) : null;
			if (data.sortOrder !== undefined) updates.sortOrder = Number(data.sortOrder);
			const [row] = await db.update(dtConfigTypes).set(updates).where(eq(dtConfigTypes.id, id)).returning();
			return row ?? null;
		},

		async deleteDictionaryType(id: string): Promise<boolean> {
			const result = await db.delete(dtConfigTypes).where(eq(dtConfigTypes.id, id)).returning({ id: dtConfigTypes.id });
			return result.length > 0;
		},
	}) satisfies Partial<DevRepository>;
}

class InMemoryDevRepository implements DevRepository {
	async listRefreshCache(): Promise<{ list: AdminRefreshCacheListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listConfigCenter(): Promise<{ list: AdminConfigCenterListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listDictionary(): Promise<{ list: AdminDictionaryListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listDictionaryItem(): Promise<{ list: AdminDictionaryItemListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listDictionaryType(): Promise<{ list: AdminDictionaryTypeListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listMenuCatalog(): Promise<{ list: AdminMenuCatalogListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listMenuGroup(): Promise<{ list: AdminMenuGroupListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async listMenuItem(): Promise<{ list: AdminMenuItemListItem[]; total: number }> {
		return { list: [], total: 0 };
	}
	async createConfigCenter(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { id: "mock-id", ...data };
	}
	async getConfigCenterDetail(): Promise<Record<string, unknown> | null> {
		return null;
	}
	async updateConfigCenter(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { ...data };
	}
	async deleteConfigCenter(): Promise<boolean> {
		return true;
	}
	async createDictionary(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { id: "mock-id", ...data };
	}
	async getDictionaryDetail(): Promise<Record<string, unknown> | null> {
		return null;
	}
	async updateDictionary(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { ...data };
	}
	async deleteDictionary(): Promise<boolean> {
		return true;
	}
	async createDictionaryItem(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { id: "mock-id", ...data };
	}
	async getDictionaryItemDetail(): Promise<Record<string, unknown> | null> {
		return null;
	}
	async updateDictionaryItem(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { ...data };
	}
	async deleteDictionaryItem(): Promise<boolean> {
		return true;
	}
	async createDictionaryType(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { id: "mock-id", ...data };
	}
	async getDictionaryTypeDetail(): Promise<Record<string, unknown> | null> {
		return null;
	}
	async updateDictionaryType(data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
		return { ...data };
	}
	async deleteDictionaryType(): Promise<boolean> {
		return true;
	}
}

export function createInMemoryDevRepository(): DevRepository {
	return new InMemoryDevRepository();
}
