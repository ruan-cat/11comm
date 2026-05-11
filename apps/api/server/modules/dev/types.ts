/** 开发团队模块 - 类型定义 */

// --- RefreshCache / dtCacheConfigs ---

export interface AdminRefreshCacheListItem {
	cacheId: string;
	cacheCode: string;
	cacheName: string;
	cacheKey: string;
	cacheType: string;
	cacheGroup: string;
	expireTime: number;
	description: string;
	refreshPolicy: string;
	status: string;
	createTime: string;
	updateTime: string;
}

export interface ListRefreshCacheParams {
	pageIndex: number;
	pageSize: number;
	cacheId?: string;
	cacheCode?: string;
	cacheName?: string;
	cacheKey?: string;
	cacheType?: string;
	refreshPolicy?: string;
}

// --- ConfigCenter / dtConfigs ---

export interface AdminConfigCenterListItem {
	id: string;
	configName: string | null;
	configType: string | null;
	configKey: string | null;
	configValue: string | null;
	defaultValue: string | null;
	configDescription: string | null;
	status: string | null;
	sortOrder: number | null;
	remark: string | null;
	createTime: string;
	updateTime: string;
	createdBy: string | null;
	updatedBy: string | null;
}

export interface ListConfigCenterParams {
	pageIndex: number;
	pageSize: number;
	configName?: string;
	configType?: string;
	configKey?: string;
	status?: string;
}

// --- Dictionary / dtDictionaries ---

export interface AdminDictionaryListItem {
	id: string;
	dictionaryName: string | null;
	dictionaryCode: string | null;
	dictionaryType: string | null;
	dictionaryDescription: string | null;
	remark: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListDictionaryParams {
	pageIndex: number;
	pageSize: number;
	dictionaryName?: string;
	dictionaryCode?: string;
	dictionaryType?: string;
}

// --- DictionaryItem / dtDictionaryItems ---

export interface AdminDictionaryItemListItem {
	id: string;
	dictionaryId: string | null;
	itemName: string | null;
	itemCode: string | null;
	itemValue: string | null;
	sortOrder: number | null;
	remark: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListDictionaryItemParams {
	pageIndex: number;
	pageSize: number;
	dictionaryId?: string;
	itemName?: string;
	itemCode?: string;
}

// --- DictionaryType / dtDictionaryTypes ---

export interface AdminDictionaryTypeListItem {
	id: string;
	typeName: string | null;
	typeCode: string | null;
	typeDescription: string | null;
	remark: string | null;
	createTime: string;
	updateTime: string;
}

export interface ListDictionaryTypeParams {
	pageIndex: number;
	pageSize: number;
	typeName?: string;
	typeCode?: string;
}

// --- MenuCatalog / dtMenuCatalogs ---

export interface AdminMenuCatalogListItem {
	gid: string;
	groupType: string;
	icon: string;
	label: string;
	name: string;
	seq: string;
	storeType: string;
	typeText: string;
	storeTypeText: string;
	createTime: string;
	updateTime: string;
}

export interface ListMenuCatalogParams {
	pageIndex: number;
	pageSize: number;
	name?: string;
}

// --- MenuGroup / dtMenuGroups ---

export interface AdminMenuGroupListItem {
	id: string;
	groupName: string | null;
	groupCode: string | null;
	groupDescription: string | null;
	sortOrder: number | null;
	createTime: string;
	updateTime: string;
}

export interface ListMenuGroupParams {
	pageIndex: number;
	pageSize: number;
	groupName?: string;
	groupCode?: string;
}

// --- MenuItem / dtMenuItems ---

export interface AdminMenuItemListItem {
	id: string;
	catalogId: string | null;
	menuName: string | null;
	menuCode: string | null;
	menuPath: string | null;
	menuIcon: string | null;
	sortOrder: number | null;
	createTime: string;
	updateTime: string;
}

export interface ListMenuItemParams {
	pageIndex: number;
	pageSize: number;
	catalogId?: string;
	menuName?: string;
	menuCode?: string;
}
