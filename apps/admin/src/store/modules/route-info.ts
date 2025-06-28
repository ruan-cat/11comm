import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { merge } from "lodash-es";
import type { RouteRecordName } from "vue-router";
import { store, storageLocal, responsiveStorageNameSpace } from "../utils";

/** 路由信息数据类型 */
export interface RouteInfoData {
	/** 路由元信息 */
	meta?: {
		/** 激活路径 - 前驱页面的路由地址 */
		activePath?: string;
		/** 其他元信息 */
		[key: string]: any;
	};
	/** 其他路由信息 */
	[key: string]: any;
}

/** Store 状态类型 */
export interface RouteInfoState {
	/** 路由信息映射表，key 为路由名称，value 为路由信息 */
	routeInfoMap: Record<string, RouteInfoData>;
}

/** setRouteInfo 参数类型 */
export interface SetRouteInfoParams {
	/** 路由名称作为 key */
	key: RouteRecordName;
	/** 路由信息 */
	info: RouteInfoData;
}

/** 本地存储的 key */
const STORAGE_KEY = `${responsiveStorageNameSpace()}route-info`;

/**
 * 路由信息存储 Store
 * @description 基于路由名称的键值对存储工具，使用组合式 API 实现
 */
export const useRouteInfoStore = defineStore("route-info", () => {
	// 状态：路由信息映射表
	const routeInfoMap = ref<Record<string, RouteInfoData>>({});

	// 初始化：从本地存储加载数据
	function loadFromStorage() {
		const storedData = storageLocal().getItem<Record<string, RouteInfoData>>(STORAGE_KEY);
		if (storedData) {
			routeInfoMap.value = storedData;
		}
	}

	// 保存到本地存储
	function saveToStorage() {
		storageLocal().setItem(STORAGE_KEY, routeInfoMap.value);
	}

	// Getter：获取所有路由信息
	const getAllRouteInfo = computed(() => routeInfoMap.value);

	/**
	 * 设置路由信息
	 * @param params 包含 key 和 info 的参数对象
	 */
	function setRouteInfo(params: SetRouteInfoParams) {
		const { key, info } = params;

		if (!key) {
			console.warn("setRouteInfo: key 不能为空");
			return;
		}

		// 将 RouteRecordName 转为字符串 key
		const stringKey = String(key);

		// 如果已存在该路由信息，使用 merge 合并数据
		if (routeInfoMap.value[stringKey]) {
			routeInfoMap.value[stringKey] = merge({}, routeInfoMap.value[stringKey], info);
		} else {
			// 否则直接设置
			routeInfoMap.value[stringKey] = { ...info };
		}

		// 保存到本地存储
		saveToStorage();
	}

	/**
	 * 获取路由信息
	 * @param key 路由名称
	 * @returns 路由信息或 null
	 */
	function getRouteInfo(key: RouteRecordName): RouteInfoData | null {
		if (!key) {
			console.warn("getRouteInfo: key 不能为空");
			return null;
		}

		// 将 RouteRecordName 转为字符串 key
		const stringKey = String(key);

		// 从内存中获取数据
		return routeInfoMap.value[stringKey] || null;
	}

	/**
	 * 删除路由信息
	 * @param key 路由名称
	 */
	function removeRouteInfo(key: RouteRecordName) {
		if (!key) {
			console.warn("removeRouteInfo: key 不能为空");
			return;
		}

		// 将 RouteRecordName 转为字符串 key
		const stringKey = String(key);

		delete routeInfoMap.value[stringKey];
		saveToStorage();
	}

	/**
	 * 清空所有路由信息
	 */
	function clearAllRouteInfo() {
		routeInfoMap.value = {};
		saveToStorage();
	}

	// 初始化加载数据
	loadFromStorage();

	return {
		// 状态
		routeInfoMap,

		// Getters
		getAllRouteInfo,

		// Actions
		setRouteInfo,
		getRouteInfo,
		removeRouteInfo,
		clearAllRouteInfo,
	};
});

/**
 * 路由信息存储 Hook 函数
 * @description 用于在组件中便捷使用路由信息存储功能
 * @returns Store 实例
 */
export function useRouteInfoStoreHook() {
	return useRouteInfoStore(store);
}