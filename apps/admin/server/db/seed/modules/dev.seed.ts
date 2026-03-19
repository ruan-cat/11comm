import {
	dtDictionaries,
	dtDictionaryItems,
	dtCacheConfigs,
	dtConfigTypes,
	dtConfigs,
	dtConfigItems,
	dtMenuGroups,
	dtMenuCatalogs,
	dtMenuItems,
} from "@01s-11comm/type";
import { defineSeed, sid, rows } from "../helpers";

export default defineSeed({
	name: "dev",
	dependencies: [],
	async seed(db) {
		// ── Dictionaries ──────────────────────────────────────────────
		await db.insert(dtDictionaries).values(
			rows([
				{
					id: sid("dictionary", "GENDER"),
					dictionaryName: "性别",
					dictionaryCode: "GENDER",
					dictionaryType: "system",
					dictionaryDescription: "性别字典",
				},
				{
					id: sid("dictionary", "NATION"),
					dictionaryName: "民族",
					dictionaryCode: "NATION",
					dictionaryType: "system",
					dictionaryDescription: "民族字典",
				},
				{
					id: sid("dictionary", "EDUCATION"),
					dictionaryName: "学历",
					dictionaryCode: "EDUCATION",
					dictionaryType: "business",
					dictionaryDescription: "学历字典",
				},
				{
					id: sid("dictionary", "PAYMENT_METHOD"),
					dictionaryName: "支付方式",
					dictionaryCode: "PAYMENT_METHOD",
					dictionaryType: "business",
					dictionaryDescription: "支付方式字典",
				},
				{
					id: sid("dictionary", "ORDER_STATUS"),
					dictionaryName: "订单状态",
					dictionaryCode: "ORDER_STATUS",
					dictionaryType: "business",
					dictionaryDescription: "订单状态字典",
				},
			]),
		);

		// ── Dictionary Items ──────────────────────────────────────────
		await db.insert(dtDictionaryItems).values(
			rows([
				// GENDER
				{
					id: sid("dict-item", "GENDER-male"),
					dictionaryId: sid("dictionary", "GENDER"),
					itemLabel: "男",
					itemValue: "male",
					sortOrder: 1,
				},
				{
					id: sid("dict-item", "GENDER-female"),
					dictionaryId: sid("dictionary", "GENDER"),
					itemLabel: "女",
					itemValue: "female",
					sortOrder: 2,
				},
				{
					id: sid("dict-item", "GENDER-unknown"),
					dictionaryId: sid("dictionary", "GENDER"),
					itemLabel: "未知",
					itemValue: "unknown",
					sortOrder: 0,
				},
				// NATION
				{
					id: sid("dict-item", "NATION-han"),
					dictionaryId: sid("dictionary", "NATION"),
					itemLabel: "汉族",
					itemValue: "han",
					sortOrder: 1,
				},
				{
					id: sid("dict-item", "NATION-minority"),
					dictionaryId: sid("dictionary", "NATION"),
					itemLabel: "少数民族",
					itemValue: "minority",
					sortOrder: 2,
				},
				{
					id: sid("dict-item", "NATION-other"),
					dictionaryId: sid("dictionary", "NATION"),
					itemLabel: "其他",
					itemValue: "other",
					sortOrder: 3,
				},
				// EDUCATION
				{
					id: sid("dict-item", "EDUCATION-bachelor"),
					dictionaryId: sid("dictionary", "EDUCATION"),
					itemLabel: "本科",
					itemValue: "bachelor",
					sortOrder: 1,
				},
				{
					id: sid("dict-item", "EDUCATION-master"),
					dictionaryId: sid("dictionary", "EDUCATION"),
					itemLabel: "硕士",
					itemValue: "master",
					sortOrder: 2,
				},
				{
					id: sid("dict-item", "EDUCATION-doctor"),
					dictionaryId: sid("dictionary", "EDUCATION"),
					itemLabel: "博士",
					itemValue: "doctor",
					sortOrder: 3,
				},
				// PAYMENT_METHOD
				{
					id: sid("dict-item", "PAYMENT_METHOD-cash"),
					dictionaryId: sid("dictionary", "PAYMENT_METHOD"),
					itemLabel: "现金",
					itemValue: "cash",
					sortOrder: 1,
				},
				{
					id: sid("dict-item", "PAYMENT_METHOD-wechat"),
					dictionaryId: sid("dictionary", "PAYMENT_METHOD"),
					itemLabel: "微信",
					itemValue: "wechat",
					sortOrder: 2,
				},
				{
					id: sid("dict-item", "PAYMENT_METHOD-alipay"),
					dictionaryId: sid("dictionary", "PAYMENT_METHOD"),
					itemLabel: "支付宝",
					itemValue: "alipay",
					sortOrder: 3,
				},
				// ORDER_STATUS
				{
					id: sid("dict-item", "ORDER_STATUS-pending"),
					dictionaryId: sid("dictionary", "ORDER_STATUS"),
					itemLabel: "待支付",
					itemValue: "pending",
					sortOrder: 1,
				},
				{
					id: sid("dict-item", "ORDER_STATUS-paid"),
					dictionaryId: sid("dictionary", "ORDER_STATUS"),
					itemLabel: "已支付",
					itemValue: "paid",
					sortOrder: 2,
				},
				{
					id: sid("dict-item", "ORDER_STATUS-completed"),
					dictionaryId: sid("dictionary", "ORDER_STATUS"),
					itemLabel: "已完成",
					itemValue: "completed",
					sortOrder: 3,
				},
			]),
		);

		// ── Cache Configs ─────────────────────────────────────────────
		await db.insert(dtCacheConfigs).values(
			rows([
				{
					id: sid("cache-config", "user-info"),
					cacheCode: "USER_INFO",
					cacheName: "用户信息缓存",
					cacheKey: "cache:user:info:*",
					cacheType: "Redis",
					cacheGroup: "user",
					expireTime: 3600,
					status: "enabled",
					refreshStrategy: "manual",
				},
				{
					id: sid("cache-config", "product"),
					cacheCode: "PRODUCT",
					cacheName: "商品缓存",
					cacheKey: "cache:product:*",
					cacheType: "Redis",
					cacheGroup: "product",
					expireTime: 7200,
					status: "enabled",
					refreshStrategy: "manual",
				},
				{
					id: sid("cache-config", "system-config"),
					cacheCode: "SYSTEM_CONFIG",
					cacheName: "系统配置缓存",
					cacheKey: "cache:system:config:*",
					cacheType: "Memory",
					cacheGroup: "system",
					expireTime: 86400,
					status: "enabled",
					refreshStrategy: "manual",
				},
			]),
		);

		// ── Config Types ──────────────────────────────────────────────
		await db.insert(dtConfigTypes).values(
			rows([
				{
					id: sid("config-type", "system"),
					typeName: "系统配置",
					typeCode: "system",
					typeDescription: "系统级别配置项",
					sortOrder: 1,
				},
				{
					id: sid("config-type", "database"),
					typeName: "数据库配置",
					typeCode: "database",
					typeDescription: "数据库相关配置项",
					sortOrder: 2,
				},
				{
					id: sid("config-type", "cache"),
					typeName: "缓存配置",
					typeCode: "cache",
					typeDescription: "缓存相关配置项",
					sortOrder: 3,
				},
			]),
		);

		// ── Configs ───────────────────────────────────────────────────
		await db.insert(dtConfigs).values(
			rows([
				{
					id: sid("config", "system-name"),
					configName: "系统名称",
					configKey: "system.name",
					configValue: "智慧社区管理系统",
					configDescription: "系统显示名称",
					status: "enabled",
					sortOrder: 1,
				},
				{
					id: sid("config", "system-version"),
					configName: "系统版本",
					configKey: "system.version",
					configValue: "v2.1.0",
					configDescription: "当前系统版本号",
					status: "enabled",
					sortOrder: 2,
				},
				{
					id: sid("config", "cache-expire-time"),
					configName: "缓存过期时间",
					configKey: "cache.expire.time",
					configValue: "3600",
					configDescription: "默认缓存过期时间（秒）",
					status: "enabled",
					sortOrder: 3,
				},
			]),
		);

		// ── Config Items ──────────────────────────────────────────────
		await db.insert(dtConfigItems).values(
			rows([
				{
					id: sid("config-item", "app-name"),
					itemName: "应用名称",
					itemKey: "app.name",
					typeId: sid("config-type", "system"),
					dataType: "string",
				},
				{
					id: sid("config-item", "db-pool-size"),
					itemName: "连接池大小",
					itemKey: "db.pool.size",
					typeId: sid("config-type", "database"),
					dataType: "number",
				},
				{
					id: sid("config-item", "cache-ttl"),
					itemName: "缓存TTL",
					itemKey: "cache.ttl",
					typeId: sid("config-type", "cache"),
					dataType: "number",
				},
			]),
		);

		// ── Menu Groups ───────────────────────────────────────────────
		await db.insert(dtMenuGroups).values(
			rows([
				{
					id: sid("menu-group", "system"),
					groupName: "系统管理",
					groupCode: "SYSTEM",
					groupIcon: "mdi:cog",
					sortOrder: 1,
				},
				{
					id: sid("menu-group", "property"),
					groupName: "物业管理",
					groupCode: "PROPERTY",
					groupIcon: "mdi:domain",
					sortOrder: 2,
				},
				{
					id: sid("menu-group", "operation"),
					groupName: "运营管理",
					groupCode: "OPERATION",
					groupIcon: "mdi:store",
					sortOrder: 3,
				},
			]),
		);

		// ── Menu Catalogs ─────────────────────────────────────────────
		await db.insert(dtMenuCatalogs).values(
			rows([
				{
					id: sid("menu-catalog", "home"),
					catalogName: "首页",
					catalogIcon: "mdi:home",
					groupId: sid("menu-group", "system"),
					sortOrder: 1,
				},
				{
					id: sid("menu-catalog", "settings"),
					catalogName: "设置",
					catalogIcon: "mdi:cog-outline",
					groupId: sid("menu-group", "system"),
					sortOrder: 2,
				},
				{
					id: sid("menu-catalog", "merchant"),
					catalogName: "商户",
					catalogIcon: "mdi:store-outline",
					groupId: sid("menu-group", "operation"),
					sortOrder: 3,
				},
			]),
		);

		// ── Menu Items ────────────────────────────────────────────────
		await db.insert(dtMenuItems).values(
			rows([
				{
					id: sid("menu-item", "dashboard"),
					menuName: "仪表盘",
					path: "/dashboard",
					componentPath: "pages/dashboard/index",
					catalogId: sid("menu-catalog", "home"),
					sortOrder: 1,
					isVisible: true,
					isCache: true,
					isExternal: false,
				},
				{
					id: sid("menu-item", "user-manage"),
					menuName: "用户管理",
					path: "/system/user",
					componentPath: "pages/system/user/index",
					catalogId: sid("menu-catalog", "settings"),
					sortOrder: 1,
					isVisible: true,
					isCache: true,
					isExternal: false,
				},
				{
					id: sid("menu-item", "role-manage"),
					menuName: "角色管理",
					path: "/system/role",
					componentPath: "pages/system/role/index",
					catalogId: sid("menu-catalog", "settings"),
					sortOrder: 2,
					isVisible: true,
					isCache: true,
					isExternal: false,
				},
				{
					id: sid("menu-item", "merchant-list"),
					menuName: "商户列表",
					path: "/operation/merchant",
					componentPath: "pages/operation/merchant/index",
					catalogId: sid("menu-catalog", "merchant"),
					sortOrder: 1,
					isVisible: true,
					isCache: true,
					isExternal: false,
				},
				{
					id: sid("menu-item", "merchant-audit"),
					menuName: "商户审核",
					path: "/operation/merchant/audit",
					componentPath: "pages/operation/merchant/audit/index",
					catalogId: sid("menu-catalog", "merchant"),
					sortOrder: 2,
					isVisible: true,
					isCache: true,
					isExternal: false,
				},
			]),
		);
	},
});
