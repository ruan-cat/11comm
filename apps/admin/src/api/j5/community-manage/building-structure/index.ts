import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 房间信息数据
 */
export interface BuildingRoomData {
	/** 层数 */
	layer?: string;
	/** 欠费 */
	oweAmount?: number;
	/** 业主ID */
	ownerId?: string;
	/** 业主名字 */
	ownerName?: string;
	/** 房间ID */
	roomId?: string;
	/** 房间编号 */
	roomNum?: string;
	/** 房子状态编码 */
	state?: string;
	/** 房子状态名称 */
	stateName?: string;
}

/**
 * 单元信息数据
 */
export interface BuildingUnitData {
	/** 房子列表 */
	buildingRoomVOList?: BuildingRoomData[];
	/** 楼id */
	floorId?: string;
	/** 单元id */
	unitId?: string;
	/** 单元编号 */
	unitNum?: string;
}

/**
 * 楼栋信息数据
 */
export interface BusinessFloorData {
	/** 单元列表 */
	buildingUnitDTOList?: BuildingUnitData[];
	/** 楼id */
	floorId?: string;
	/** 楼名称 */
	floorName?: string;
	/** 楼编号 */
	floorNum?: string;
}

/**
 * 完整楼栋结构数据
 */
export interface BuildingStructureData {
	/** 所属社区楼栋信息 */
	businessFloorDTOList?: BusinessFloorData[];
	/** 所属社区编号 */
	communityId?: string;
}

/**
 * 获取指定单元楼栋结构参数
 */
export interface QueryUnitBuildingParams {
	/** 小区id */
	communityId: string;
	/** 单元id */
	unitId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 获取所有结构参数
 */
export interface QueryAllStructureParams {
	/** 小区id */
	communityId: string;
}

/**
 * 获取指定社区楼栋结构参数
 */
export interface QueryFloorBuildingParams {
	/** 楼栋id */
	floorId: string;
}

/**
 * 获取指定小区结构参数
 */
export interface QueryCommunityStructureParams {
	/** 小区id */
	communityId: string;
}

// ==================== 接口函数 ====================

/**
 * 获取指定单元楼栋结构
 * @description 获取指定单元下的房间结构信息
 */
export function queryUnitBuildingStructure<T = BuildingRoomData[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryUnitBuildingParams>({
		url: "/j5-community/building/query-building-room",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				unitId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 获取一次性获取所有结构
 * @description 获取指定小区的完整楼栋结构信息
 */
export function queryAllBuildingStructure<T = BuildingStructureData>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryAllStructureParams>({
		url: "/j5-community/building/query-building-structure",
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

/**
 * 获取指定社区楼栋结构
 * @description 获取指定楼栋下的单元结构信息
 */
export function queryFloorBuildingStructure<T = BuildingUnitData[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryFloorBuildingParams>({
		url: "/j5-community/building/query-building-unit",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				floorId: "",
			},
		},
		options,
	});
}

/**
 * 获取指定小区结构
 * @description 获取指定小区下的楼栋结构信息
 */
export function queryCommunityStructure<T = BusinessFloorData[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryCommunityStructureParams>({
		url: "/j5-community/building/query-business-floor",
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
