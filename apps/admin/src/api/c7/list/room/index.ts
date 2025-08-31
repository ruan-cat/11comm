import { useRequest } from "@/composables/use-request";

/**
 * 获取下拉列表-房屋 查询参数
 */
export interface RoomQueryParams {
	/** 小区ID */
	communityId: string;
	/** 单元ID */
	unitId?: string;
}

/**
 * 房屋数据项
 */
export interface RoomDTO {
	/** 房屋ID */
	roomId: string;
	/** 房屋编号 */
	roomNum: string;
}

/**
 * 获取下拉列表-房屋接口
 * @description 获取下拉列表-房屋
 * @param options useRequest 配置项
 * @returns useRequest 实例，data.value 为接口返回数据
 */
export function queryRoomList<T = RoomDTO[]>(options?: UseAxiosOptionsJsonVO<JsonVO<T>>) {
	return useRequest<ParamsQueryKey, JsonVO<T>, RoomQueryParams>({
		url: "/c7-repomanage/query-condition/room",
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
