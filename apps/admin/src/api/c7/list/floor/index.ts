import { useRequest } from "@/composables/use-request";

/**
 * 获取下拉列表-楼栋 查询参数
 */
export interface FloorQueryParams {
	/** 小区ID */
	communityId: string;
}

/**
 * 楼栋数据项
 */
export interface FloorDTO {
	/** 楼栋ID */
	floorId: string;
	/** 楼栋编号 */
	floorNum: string;
}

/**
 * 获取下拉列表-楼栋接口
 * @description 获取下拉列表-楼栋
 * @param options useRequest 配置项
 * @returns useRequest 实例，data.value 为接口返回数据
 */
export function queryFloorList<T = FloorDTO[]>(options?: UseAxiosOptionsJsonVO<JsonVO<T>>) {
	return useRequest<ParamsQueryKey, JsonVO<T>, FloorQueryParams>({
		url: "/c7-repomanage/query-condition/floor",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
			},
		},
		options,
	});
}
