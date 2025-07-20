import { useRequest } from "composables/use-request";

/**
 * 常用菜单信息
 */
export interface CommonMenuInfo {
	/** 图标id */
	icon: string;
	/** 菜单编号 */
	muId: string;
	/** 菜单名称 */
	name: string;
	/** 列顺序 */
	seq: string;
}

/**
 * 常用功能
 * @description
 * 获取常用菜单信息列表
 */
export function getCenterCommonMenu<T = CommonMenuInfo[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/dashboard/center/commonmenu",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {},
		},
	});
}
