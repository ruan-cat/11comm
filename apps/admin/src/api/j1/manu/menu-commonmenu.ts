import { useRequest } from "@/composables/use-request";

/** 添加常用菜单请求参数 */
export interface AddCommonMenuParams {
	/** 菜单ID */
	mid: string;
	/** 图标ID */
	icon: string;
	/** 列顺序 */
	seq: string;
}

/** 删除常用菜单请求参数 */
export interface RemoveCommonMenuParams {
	/** 菜单编号 */
	muId: string;
}

/** 获取常用菜单列表请求参数 */
export interface QueryCommonMenuListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 菜单编号 */
	muId?: string;
	/** 菜单名称 */
	name?: string;
	/** 列顺序 */
	seq?: number;
}

/** 常用菜单数据对象 */
export interface CommonMenuData {
	/** 菜单编号 */
	muId: string;
	/** 菜单名称 */
	name: string;
	/** 图标ID */
	icon: string;
	/** 菜单链接地址 */
	url: string;
	/** 列顺序 */
	seq: number;
}

/** 可选菜单下拉列表数据对象 */
export interface OptionalMenuData {
	/** 菜单ID */
	mid: string;
	/** 模块-菜单名称 */
	mixName: string;
}

/**
 * 添加常用菜单
 * @description 将指定菜单添加到常用菜单列表
 */
export function addCommonMenu<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddCommonMenuParams>({
		url: "/j1-menumana/commonmenu/add",
		httpParamWay: "body",
		options,
		config: {
			method: "POST",
			data: {
				mid: "",
				icon: "",
				seq: "",
			},
		},
	});
}

/**
 * 获取常用菜单列表（条件+分页）
 * @description 分页查询常用菜单列表，支持条件筛选
 */
export function queryCommonMenuList<T = PageDTO<CommonMenuData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryCommonMenuListParams>({
		url: "/j1-menumana/commonmenu/queryall",
		httpParamWay: "query",
		options,
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
			},
		},
	});
}

/**
 * 获取可选菜单下拉列表
 * @description 获取可以添加为常用菜单的菜单选项列表
 */
export function queryOptionalMenuList<T = OptionalMenuData[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/j1-menumana/commonmenu/queryname",
		httpParamWay: "query",
		options,
		config: {
			method: "GET",
		},
	});
}

/**
 * 删除常用菜单
 * @description 从常用菜单列表中删除指定菜单
 */
export function removeCommonMenu<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, RemoveCommonMenuParams>({
		url: "/j1-menumana/commonmenu/remove",
		httpParamWay: "query",
		options,
		config: {
			method: "PUT",
			params: {
				muId: "",
			},
		},
	});
}