import { useRequest } from "@/composables/use-request";

/**
 * 获取下拉列表-单元 查询参数
 */
export interface UnitQueryParams {
	/** 小区ID */
	communityId: string;
	/** 楼栋ID */
	floorId: string;
}

/**
 * 单元数据项
 */
export interface UnitDTO {
	/** 单元ID */
	unitId: string;
	/** 单元编号 */
	unitNum: string;
}

/**
 * 获取下拉列表-单元接口
 * @description 获取下拉列表-单元
 * @param options useRequest 配置项
 * @returns useRequest 实例，data.value 为接口返回数据
 */
export function queryUnitList<T = UnitDTO[]>(options?: UseAxiosOptionsJsonVO<JsonVO<T>>) {
	return useRequest<ParamsQueryKey, JsonVO<T>, UnitQueryParams>({
		url: "/c7-repomanage/query-condition/unit",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				floorId: "",
			},
		},
		options,
	});
}
