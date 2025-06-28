import type { ParamsBodyKey, UseAxiosOptionsJsonVO, ParamsQueryKey, ParamsPathKey } from "composables/use-request";
import type { PageDTO } from "src/types/PageDTO";
import { useRequest } from "composables/use-request";

/**
 * 图标录入数据模型
 */
export interface IconAddModel {
	/**
	 * 图标文件
	 */
	file?: File;

	/**
	 * 图标样式
	 */
	iconclas: string;

	/**
	 * 图标名称
	 */
	name: string;

	/**
	 * 图标类型: 1系统图标/2菜单图标/3桌面图标
	 */
	type: number;
}

/**
 * 图标录入接口
 * 上传内容包含图片文件， 故需要增加 `upType: UpType.file` 配置。
 */
export function sysmanagerIconsAdd<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, IconAddModel>({
		url: "/sysmanager/icons/add",
		options,
		httpParamWay: "body",
		upType: UpType.file,
		config: {
			method: "POST",
			data: {
				file: undefined,
				iconclas: "default",
				name: "",
				type: 1,
			},
		},
	});
}

/**
 * 图标列表数据模型
 */
export interface IconListModel {
	/**
	 * 图标后缀
	 */
	extend: string;

	/**
	 * 图标样式
	 */
	iconclas: string;

	/**
	 * 图标名称
	 */
	name: string;

	/**
	 * 图标类型
	 */
	type: number;

	/**
	 * 图标下载地址
	 */
	url: string;
}

/**
 * 图标查询参数
 */
export interface IconAllQueryParams {
	/**
	 * 图标名称
	 */
	name?: string;

	/**
	 * 查询页码
	 */
	pageIndex?: number;

	/**
	 * 查询条数
	 */
	pageSize?: number;
}

/**
 * 图标列表查询接口
 * @description
 * 查询系统中的图标列表
 */
export function sysmanagerIconsAll<T = PageDTO<IconListModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, IconAllQueryParams>({
		url: "/sysmanager/icons/all",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {
				name: undefined,
				pageIndex: 1,
				pageSize: 10,
			},
		},
	});
}

/**
 * 图标删除接口
 * @description 根据图标ID删除图标
 */
export function sysmanagerIconsDelete<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, { id: string }>({
		url: "/sysmanager/icons/delete",
		options,
		httpParamWay: "query",
		config: {
			method: "DELETE",
			data: {
				id: "",
			},
		},
	});
}

/**
 * 图标编辑参数
 */
export interface IconModifyParams {
	/**
	 * 图标文件
	 */
	file?: File;

	/**
	 * 图标ID
	 */
	id: string;

	/**
	 * 图标样式
	 */
	iconclas?: string;

	/**
	 * 图标名称
	 */
	name?: string;

	/**
	 * 图标类型: 1系统图标/2菜单图标/3桌面图标
	 */
	type?: number;

	/**
	 * 图标路径
	 */
	url?: string;
}

/**
 * 图标编辑接口
 * @description 编辑图标信息
 */
export function sysmanagerIconsModify<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, IconModifyParams>({
		url: "/sysmanager/icons/modify",
		options,
		httpParamWay: "query",
		upType: UpType.file,
		config: {
			method: "POST",
			data: {
				file: undefined,
				id: "",
				iconclas: undefined,
				name: undefined,
				type: undefined,
				url: undefined,
			},
		},
	});
}

/**
 * 图标名称列表数据模型
 */
export interface IconNameListModel {
	/**
	 * 图标样式
	 */
	iconclas: string;

	/**
	 * 唯一标识
	 */
	id: string;

	/**
	 * 图标名称
	 */
	name: string;
}

/**
 * 图标名称列表查询参数
 */
export interface IconNamesQueryParams {
	/**
	 * 图标类型: 1系统图标/2菜单图标/3桌面图标
	 */
	type?: number;
}

/**
 * 图标名称列表查询接口
 * @description 查询系统中的图标名称列表
 */
export function sysmanagerIconsNames<T = IconNameListModel[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, IconNamesQueryParams>({
		url: "/sysmanager/icons/names",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {
				type: undefined,
			},
		},
	});
}

/**
 * 图标编辑数据模型
 */
export interface IconEditModel {
	/**
	 * 图标文件
	 */
	file?: File;

	/**
	 * 图标样式
	 */
	iconclas: string;

	/**
	 * 图标名称
	 */
	name: string;

	/**
	 * 图标类型: 1系统图标/2菜单图标/3桌面图标
	 */
	type: number;

	/**
	 * 图标路径
	 */
	url: string;
}

/**
 * 根据id回显图标编辑数据接口
 * @description 根据图标ID获取图标详细信息，用于编辑回显
 */
export function sysmanagerIconsGetById<T = IconEditModel>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsPathKey, T, { id: string }>({
		url: "/sysmanager/icons/{id}",
		options,
		httpParamWay: "path",
		config: {
			url: "/sysmanager/icons/{id}",
			method: "GET",
		},
	});
}
