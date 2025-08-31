import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 车位结构图显示对象
 */
export interface ParkingStructureData {
	/** 停车场编码 */
	areaNum?: string;
	/** 车牌号 */
	carNum?: string;
	/** 楼编号 */
	floorNum?: string;
	/** 车位编号 */
	num?: string;
	/** 欠费金额 */
	oweAmount?: number;
	/** 用户名字 */
	ownerName?: string;
	/** 房屋编号 */
	roomNum?: string;
	/** 单元id */
	unitId?: string;
	/** 单元编号 */
	unitNum?: string;
}

/**
 * 查询指定单元车位结构参数
 */
export interface QueryParkingStructureParams {
	/** 小区id */
	communityId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 单元id */
	unitId: string;
}

// ==================== 接口函数 ====================

/**
 * 获取指定单元车位结构
 * @description 获取指定单元下的车位结构信息
 */
export function queryParkingStructure<T = ParkingStructureData[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryParkingStructureParams>({
		url: "/j5-community/parking/query-parking",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				pageIndex: 1,
				pageSize: 10,
				unitId: "",
			},
		},
		options,
	});
}
