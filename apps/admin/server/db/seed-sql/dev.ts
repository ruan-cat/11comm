import {
	dtConfigTypes,
	dtConfigs,
	dtConfigItems,
	dtDictionaries,
	dtDictionaryItems,
	dtMenuGroups,
	dtMenuCatalogs,
	dtMenuItems,
	dtCacheConfigs,
	type NewDtConfigType,
	type NewDtConfig,
	type NewDtConfigItem,
	type NewDtDictionaryItem,
	type NewDtMenuGroup,
	type NewDtMenuCatalog,
	type NewDtMenuItem,
} from "@01s-11comm/type";

import { mockDictionaryTypeData } from "../../api/dev-team/config-manage/type/mock-data";
import { mockConfigCenterData } from "../../api/dev-team/config-manage/center/mock-data";
import { mockConfigItemData } from "../../api/dev-team/config-manage/item/mock-data";
import { mockDictionaryData } from "../../api/dev-team/config-manage/dictionary/mock-data";
import { mockMenuGroupData } from "../../api/dev-team/menu-manage/group/mock-data";
import { mockMenuCatalogData } from "../../api/dev-team/menu-manage/catalog/mock-data";
import { mockMenuItemData } from "../../api/dev-team/menu-manage/item/mock-data";
import { mockRefreshCacheData } from "../../api/dev-team/cache-manage/refresh-cache/mock-data";

import { IdMapRegistry, SqlStatement, toFullSql, statusMap, generateUuid } from "./index";
import { getDb } from "../index";

/** 缓存状态值映射：中文标签 -> 英文枚举值 */
const cacheStatusMap: Record<string, string> = {
	启用: "enabled",
	禁用: "disabled",
	维护中: "maintenance",
};

/** 刷新策略值映射：中文标签 -> 英文枚举值 */
const refreshPolicyMap: Record<string, string> = {
	定时刷新: "scheduled",
	手动刷新: "manual",
	懒加载刷新: "lazy",
	事件触发刷新: "event",
	TTL过期刷新: "ttl",
	LRU淘汰刷新: "lru",
};

/** 缓存类型值映射：标签 -> 小写值 */
const cacheTypeMap: Record<string, string> = {
	Redis: "redis",
	Memory: "memory",
	Memcached: "memcached",
	Ehcache: "ehcache",
	Caffeine: "caffeine",
	"Guava Cache": "guava",
	Hazelcast: "hazelcast",
	Infinispan: "infinispan",
};

/**
 * 生成开发配置模块的 SQL
 */
export async function generateDevSql(idMap: IdMapRegistry): Promise<SqlStatement[]> {
	const db = await getDb();
	const statements: SqlStatement[] = [];

	// ==========================================
	// 1. 生成 dt_dictionaries (字典类型)
	// ==========================================
	console.log("正在生成 dt_dictionaries SQL...");
	// 使用 mockDictionaryData 生成字典类型
	const dictionaryRecords = mockDictionaryData.map((item) => {
		const id = idMap.register("dt_dictionaries", item.dictionaryCode);
		return {
			id,
			dictionaryCode: item.dictionaryCode,
			dictionaryName: item.dictionaryName,
			dictionaryType: item.dictionaryType,
			dictionaryDescription: item.dictionaryDescription || null,
			remark: item.remark,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (dictionaryRecords.length > 0) {
		const query = db
			.insert(dtDictionaries as any)
			.values(dictionaryRecords)
			.toSQL();
		statements.push({
			table: "dt_dictionaries",
			sql: toFullSql(query.sql, query.params),
			recordCount: dictionaryRecords.length,
		});
		console.log(`✅ 已生成 dt_dictionaries SQL，共 ${dictionaryRecords.length} 条记录`);
	}

	// ==========================================
	// 2. 生成 dt_cache_configs (缓存配置)
	// ==========================================
	console.log("正在生成 dt_cache_configs SQL...");
	const cacheConfigRecords = mockRefreshCacheData.map((item) => {
		const id = idMap.register("dt_cache_configs", item.cacheCode);
		return {
			id,
			cacheCode: item.cacheCode,
			cacheName: item.cacheName,
			cacheKey: item.cacheKey,
			cacheType: cacheTypeMap[item.cacheType] || item.cacheType.toLowerCase(),
			cacheGroup: item.cacheGroup,
			expireTime: item.expireTime,
			description: item.description,
			refreshStrategy: refreshPolicyMap[item.refreshPolicy] || item.refreshPolicy,
			status: cacheStatusMap[item.status] || "enabled",
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (cacheConfigRecords.length > 0) {
		const query = db
			.insert(dtCacheConfigs as any)
			.values(cacheConfigRecords)
			.toSQL();
		statements.push({
			table: "dt_cache_configs",
			sql: toFullSql(query.sql, query.params),
			recordCount: cacheConfigRecords.length,
		});
	}

	// ==========================================
	// 3. 生成 dt_config_types (配置类型)
	// ==========================================
	console.log("正在生成 dt_config_types SQL...");
	const configTypeRecords: NewDtConfigType[] = mockDictionaryTypeData.map((item) => {
		const id = idMap.register("dt_config_types", item.id);
		return {
			id,
			typeName: item.typeName,
			typeCode: item.typeCode,
			typeDescription: item.typeDescription || null,
			sortOrder: item.sortOrder || 0,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (configTypeRecords.length > 0) {
		const query = db
			.insert(dtConfigTypes as any)
			.values(configTypeRecords)
			.toSQL();
		statements.push({
			table: "dt_config_types",
			sql: toFullSql(query.sql, query.params),
			recordCount: configTypeRecords.length,
		});
		console.log(`✅ 已生成 dt_config_types SQL，共 ${configTypeRecords.length} 条记录`);
	}

	// ==========================================
	// 4. 生成 dt_configs (配置中心)
	// ==========================================
	console.log("正在生成 dt_configs SQL...");
	const configRecords: NewDtConfig[] = mockConfigCenterData.map((item) => {
		const id = idMap.register("dt_configs", item.id);
		return {
			id,
			configName: item.configName,
			configType: item.configType,
			configKey: item.configKey,
			configValue: item.configValue,
			defaultValue: item.defaultValue || null,
			configDescription: item.configDescription || null,
			sortOrder: item.sortOrder || 0,
			createdBy: item.createdBy || null,
			updatedBy: item.updatedBy || null,
			status: item.status === "enabled" ? "enabled" : "disabled",
			remark: item.remark || null,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (configRecords.length > 0) {
		const query = db
			.insert(dtConfigs as any)
			.values(configRecords)
			.toSQL();
		statements.push({
			table: "dt_configs",
			sql: toFullSql(query.sql, query.params),
			recordCount: configRecords.length,
		});
		console.log(`✅ 已生成 dt_configs SQL，共 ${configRecords.length} 条记录`);
	}

	// ==========================================
	// 5. 生成 dt_config_items (配置项)
	// ==========================================
	console.log("正在生成 dt_config_items SQL...");
	const configItemRecords: NewDtConfigItem[] = mockConfigItemData.map((item) => {
		const id = idMap.register("dt_config_items", item.id);
		// 尝试获取对应的配置类型ID
		const typeId = idMap.get("dt_config_types", item.typeId);

		return {
			id,
			typeId: typeId || null,
			itemName: item.itemName,
			itemKey: item.itemKey,
			dataType: item.dataType || null,
			validationRule: item.validationRule || null,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (configItemRecords.length > 0) {
		const query = db
			.insert(dtConfigItems as any)
			.values(configItemRecords)
			.toSQL();
		statements.push({
			table: "dt_config_items",
			sql: toFullSql(query.sql, query.params),
			recordCount: configItemRecords.length,
		});
		console.log(`✅ 已生成 dt_config_items SQL，共 ${configItemRecords.length} 条记录`);
	}

	// ==========================================
	// 6. 生成 dt_dictionary_items (字典项)
	// ==========================================
	console.log("正在生成 dt_dictionary_items SQL...");
	// 准备字典项数据 - 包含每个字典的选项
	const dictionaryItemsData = [
		// 性别字典项
		{
			dictionaryCode: "GENDER",
			items: [
				{ label: "男", value: "1", isDefault: true },
				{ label: "女", value: "2", isDefault: false },
				{ label: "未知", value: "0", isDefault: false },
			],
		},
		// 民族字典项
		{
			dictionaryCode: "NATION",
			items: [
				{ label: "汉族", value: "han", isDefault: true },
				{ label: "少数民族", value: "minority", isDefault: false },
			],
		},
		// 学历字典项
		{
			dictionaryCode: "EDUCATION",
			items: [
				{ label: "小学", value: "primary", isDefault: false },
				{ label: "初中", value: "junior", isDefault: false },
				{ label: "高中", value: "senior", isDefault: false },
				{ label: "大专", value: "college", isDefault: false },
				{ label: "本科", value: "bachelor", isDefault: true },
				{ label: "硕士", value: "master", isDefault: false },
				{ label: "博士", value: "doctor", isDefault: false },
			],
		},
		// 职业字典项
		{
			dictionaryCode: "PROFESSION",
			items: [
				{ label: "教师", value: "teacher", isDefault: false },
				{ label: "医生", value: "doctor", isDefault: false },
				{ label: "工程师", value: "engineer", isDefault: false },
				{ label: "律师", value: "lawyer", isDefault: false },
				{ label: "公务员", value: "civil_servant", isDefault: false },
				{ label: "其他", value: "other", isDefault: true },
			],
		},
		// 婚姻状况字典项
		{
			dictionaryCode: "MARITAL_STATUS",
			items: [
				{ label: "未婚", value: "single", isDefault: false },
				{ label: "已婚", value: "married", isDefault: true },
				{ label: "离异", value: "divorced", isDefault: false },
				{ label: "丧偶", value: "widowed", isDefault: false },
			],
		},
		// 血型字典项
		{
			dictionaryCode: "BLOOD_TYPE",
			items: [
				{ label: "A型", value: "A", isDefault: false },
				{ label: "B型", value: "B", isDefault: false },
				{ label: "O型", value: "O", isDefault: true },
				{ label: "AB型", value: "AB", isDefault: false },
			],
		},
		// 支付方式字典项
		{
			dictionaryCode: "PAYMENT_METHOD",
			items: [
				{ label: "现金", value: "cash", isDefault: false },
				{ label: "微信支付", value: "wechat", isDefault: true },
				{ label: "支付宝", value: "alipay", isDefault: false },
				{ label: "银行卡", value: "bank_card", isDefault: false },
			],
		},
		// 订单状态字典项
		{
			dictionaryCode: "ORDER_STATUS",
			items: [
				{ label: "待支付", value: "pending", isDefault: true },
				{ label: "已支付", value: "paid", isDefault: false },
				{ label: "已完成", value: "completed", isDefault: false },
				{ label: "已取消", value: "cancelled", isDefault: false },
			],
		},
		// 紧急程度字典项
		{
			dictionaryCode: "URGENCY",
			items: [
				{ label: "紧急", value: "urgent", isDefault: false },
				{ label: "高", value: "high", isDefault: false },
				{ label: "中", value: "medium", isDefault: true },
				{ label: "低", value: "low", isDefault: false },
			],
		},
		// 优先级字典项
		{
			dictionaryCode: "PRIORITY",
			items: [
				{ label: "紧急", value: "critical", isDefault: false },
				{ label: "重要", value: "important", isDefault: false },
				{ label: "普通", value: "normal", isDefault: true },
				{ label: "低", value: "low", isDefault: false },
			],
		},
		// 设备状态字典项
		{
			dictionaryCode: "DEVICE_STATUS",
			items: [
				{ label: "在线", value: "online", isDefault: true },
				{ label: "离线", value: "offline", isDefault: false },
				{ label: "维修中", value: "maintenance", isDefault: false },
				{ label: "已报废", value: "scrapped", isDefault: false },
			],
		},
		// 审批状态字典项
		{
			dictionaryCode: "APPROVAL_STATUS",
			items: [
				{ label: "待审批", value: "pending", isDefault: true },
				{ label: "已通过", value: "approved", isDefault: false },
				{ label: "已拒绝", value: "rejected", isDefault: false },
				{ label: "已撤回", value: "withdrawn", isDefault: false },
			],
		},
	];

	const dictionaryItemRecords: NewDtDictionaryItem[] = [];
	let itemIndex = 0;
	for (const dict of dictionaryItemsData) {
		const dictId = idMap.get("dt_dictionaries", dict.dictionaryCode);
		if (!dictId) continue;

		for (const item of dict.items) {
			const id = idMap.register("dt_dictionary_items", `${dict.dictionaryCode}-${item.value}`);
			dictionaryItemRecords.push({
				dictionaryId: dictId,
				itemLabel: item.label,
				itemValue: item.value,
				sortOrder: itemIndex++,
				isDefault: item.isDefault,
				createTime: new Date(),
				updateTime: new Date(),
			} as any);
		}
	}

	if (dictionaryItemRecords.length > 0) {
		const query = db
			.insert(dtDictionaryItems as any)
			.values(dictionaryItemRecords)
			.toSQL();
		statements.push({
			table: "dt_dictionary_items",
			sql: toFullSql(query.sql, query.params),
			recordCount: dictionaryItemRecords.length,
		});
		console.log(`✅ 已生成 dt_dictionary_items SQL，共 ${dictionaryItemRecords.length} 条记录`);
	}

	// ==========================================
	// 7. 生成 dt_menu_groups (菜单组)
	// ==========================================
	console.log("正在生成 dt_menu_groups SQL...");
	const menuGroupRecords: NewDtMenuGroup[] = mockMenuGroupData.map((item) => {
		const id = idMap.register("dt_menu_groups", item.groupId);
		return {
			id,
			groupName: item.groupName,
			groupCode: item.groupCode,
			groupIcon: item.icon || null,
			sortOrder: item.sortNo || 0,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (menuGroupRecords.length > 0) {
		const query = db
			.insert(dtMenuGroups as any)
			.values(menuGroupRecords)
			.toSQL();
		statements.push({
			table: "dt_menu_groups",
			sql: toFullSql(query.sql, query.params),
			recordCount: menuGroupRecords.length,
		});
		console.log(`✅ 已生成 dt_menu_groups SQL，共 ${menuGroupRecords.length} 条记录`);
	}

	// ==========================================
	// 8. 生成 dt_menu_catalogs (菜单目录)
	// ==========================================
	console.log("正在生成 dt_menu_catalogs SQL...");
	const menuCatalogRecords: NewDtMenuCatalog[] = mockMenuCatalogData.map((item) => {
		const id = idMap.register("dt_menu_catalogs", item.gid);
		// 尝试获取对应的菜单组ID
		const groupId = idMap.get("dt_menu_groups", `GROUP${item.gid.replace("MG", "")}`);

		return {
			id,
			parentId: null,
			groupId: groupId || null,
			catalogName: item.label,
			catalogPath: null,
			catalogIcon: item.icon || null,
			sortOrder: parseInt(item.seq) || 0,
			createTime: item.createTime ? new Date(item.createTime) : new Date(),
			updateTime: item.updateTime ? new Date(item.updateTime) : new Date(),
		};
	});

	if (menuCatalogRecords.length > 0) {
		const query = db
			.insert(dtMenuCatalogs as any)
			.values(menuCatalogRecords)
			.toSQL();
		statements.push({
			table: "dt_menu_catalogs",
			sql: toFullSql(query.sql, query.params),
			recordCount: menuCatalogRecords.length,
		});
		console.log(`✅ 已生成 dt_menu_catalogs SQL，共 ${menuCatalogRecords.length} 条记录`);
	}

	// ==========================================
	// 9. 生成 dt_menu_items (菜单项)
	// ==========================================
	console.log("正在生成 dt_menu_items SQL...");
	// 过滤出 menuType 为 menu 或 button 的菜单项
	const menuItemRecords: NewDtMenuItem[] = mockMenuItemData
		.filter((item) => item.menuType === "menu" || item.menuType === "button")
		.map((item) => {
			const id = idMap.register("dt_menu_items", item.menuId);
			// 尝试找到对应的目录ID
			let catalogId = null;
			// 根据父级菜单名称查找目录
			const parentMenuMap: Record<string, string> = {
				根菜单: "MG001",
				系统管理: "MG001",
				监控管理: "MG001",
				系统工具: "MG001",
				日志管理: "MG001",
				系统设置: "MG001",
			};
			const groupId = parentMenuMap[item.parentMenu] || "MG001";
			catalogId = idMap.get("dt_menu_catalogs", groupId);

			// 处理布尔值
			const isVisible = item.isHidden === "false";
			const isCache = item.isCached === "true";
			const isExternal = item.isExternal === "true";

			return {
				id,
				catalogId: catalogId || null,
				menuName: item.menuName,
				path: item.routePath || "",
				componentPath: item.componentPath || null,
				menuIcon: item.icon || null,
				sortOrder: item.sortNo || 0,
				isVisible,
				isCache,
				isExternal,
				redirectPath: null,
				createTime: item.createTime ? new Date(item.createTime) : new Date(),
				updateTime: new Date(),
			};
		});

	if (menuItemRecords.length > 0) {
		const query = db
			.insert(dtMenuItems as any)
			.values(menuItemRecords)
			.toSQL();
		statements.push({
			table: "dt_menu_items",
			sql: toFullSql(query.sql, query.params),
			recordCount: menuItemRecords.length,
		});
		console.log(`✅ 已生成 dt_menu_items SQL，共 ${menuItemRecords.length} 条记录`);
	}

	return statements;
}
