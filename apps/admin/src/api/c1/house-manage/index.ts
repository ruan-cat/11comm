import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 单元数据
 */
export interface UnitData {
	/** 业务ID */
	bId: string;
	/** 单元编号 */
	unitNum: string;
	/** 楼ID */
	floorId: string;
	/** 总层数 */
	layerCount: number;
	/** 电梯状态 */
	lift: string;
	/** 用户ID */
	userId: string;
	/** 备注 */
	remark: string;
	/** 数据状态 */
	statusCd: string;
	/** 单元面积 */
	unitArea: string;
	/** 单元ID */
	unitId: string;
	/** 创建时间 */
	createTime: string;
}

/**
 * 楼栋数据
 */
export interface FloorData {
	/** 楼栋ID */
	floorId: string;
	/** 业务ID */
	bId: string;
	/** 楼栋编号 */
	floorNum: string;
	/** 楼栋名称 */
	name: string;
	/** 用户ID */
	userId: string;
	/** 备注 */
	remark: string;
	/** 创建时间 */
	createTime: string;
	/** 小区ID */
	communityId: string;
	/** 数据状态 */
	statusCd: string;
	/** 楼栋面积 */
	floorArea: string;
	/** 序号 */
	seq: number;
}

/**
 * 房屋详细信息
 */
export interface HouseDetailData {
	/** 房屋id */
	houseId: string;
	/** 房屋编号 */
	houseNum: string;
	/** 单元号 */
	unitId: string;
	/** 楼栋号 */
	floorNum: string;
	/** 业主名称 */
	ownerName: string;
	/** 业主电话 */
	ownerPhone: string;
	/** 房屋类型 */
	houseType: string;
	/** 建筑面积 */
	builtArea: number;
	/** 室内面积 */
	innerArea: number;
	/** 租金 */
	rentAmount: number;
	/** 房屋状态 */
	houseStatus: string;
	/** 入住时间 */
	checkInDate: string;
}

/**
 * 房屋添加数据
 */
export interface HouseAddData {
	/** 楼栋ID */
	bId: string;
	/** 房屋编号 */
	roomNum: string;
	/** 单元ID */
	unitId: string;
	/** 层数 */
	layer: string;
	/** 建筑面积 */
	builtUpArea: number;
	/** 算费系数 */
	feeCoefficient?: number;
	/** 备注 */
	remark?: string;
	/** 房屋状态 */
	state: string;
	/** 房屋类型 */
	roomType: string;
	/** 室内面积 */
	roomArea: number;
}

/**
 * 房屋修改数据
 */
export interface HouseModifyData {
	/** 房屋编号 */
	roomNum: string;
	/** 单元ID */
	unitId: string;
	/** 层数 */
	layer: string;
	/** 建筑面积 */
	builtUpArea: number;
	/** 算费系数 */
	feeCoefficient?: number;
	/** 备注 */
	remark: string;
	/** 房屋类型 */
	roomType: string;
	/** 室内面积 */
	roomArea: number;
	/** 房屋户型 */
	section: number;
	/** 户型厅 */
	apartment: string;
	/** 建筑面积(租金) */
	roomRent: number;
	/** 房屋ID */
	roomId: string;
}

/**
 * 房屋选择数据
 */
export interface HouseSelectData {
	/** 房屋id */
	houseId: string;
	/** 房屋号 */
	roomNum: string;
	/** 楼栋号 */
	floorNum: string;
	/** 单元号 */
	unitNum: string;
	/** 楼层 */
	layerNum: string;
}

/**
 * 房屋列表数据
 */
export interface HouseListData {
	/** 房屋id */
	houseId: string;
	/** 房屋编号 */
	roomNum: string;
	/** 楼栋号 */
	floorNum: string;
	/** 单元号 */
	unitNum: string;
	/** 数据状态 */
	statusCd: string;
	/** 业主数量 */
	ownerCount: number;
	/** 车辆数量 */
	carCount: number;
	/** 投诉数量 */
	complaintCount: number;
}

/**
 * 房屋名称数据
 */
export interface HouseNameData {
	/** 房屋名称 */
	houseNum: string;
	/** 业主名称 */
	ownerName: string;
	/** 楼栋号 */
	floorNum: string;
	/** 单元号 */
	unitNum: string;
}

/**
 * 查询楼栋信息参数
 */
export interface QueryFloorParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 楼栋编号 */
	floorNum?: string;
	/** 楼栋名称 */
	name?: string;
	/** 小区ID */
	communityId?: string;
}

/**
 * 查询单元参数
 */
export interface QueryUnitParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 楼ID */
	floorId: string;
	/** 单元编号 */
	unitNum?: string;
}

/**
 * 查询某小区的单元参数
 */
export interface QueryCommunityUnitParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 小区ID */
	communityId: string;
	/** 楼编号 */
	floorNum?: string;
	/** 单元编号 */
	unitNum?: string;
}

/**
 * 获取房屋详细信息参数
 */
export interface GetHouseDetailParams {
	/** 房屋id */
	houseId: string;
}

/**
 * 选择房屋列表参数
 */
export interface QueryHouseSelectParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 楼栋号 */
	floorNum?: string;
	/** 单元号 */
	unitNum?: string;
	/** 房屋号 */
	roomNum?: string;
}

/**
 * 获取房屋列表参数
 */
export interface QueryHouseListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 房屋id */
	houseId?: string;
	/** 房屋状态 */
	statusCd?: string;
	/** 楼栋号 */
	floorNum: string;
	/** 单元号 */
	unitNum?: string;
}

/**
 * 获取房屋名称列表参数
 */
export interface QueryHouseNameParams {
	/** 楼栋号 */
	floorNum?: string;
	/** 单元号 */
	unitNum?: string;
}

/**
 * 下载房产文件参数
 */
export interface DownloadFileParams {
	/** 文件名 */
	filename: string;
}

/**
 * 上传文件数据
 */
export interface UploadFileData {
	/** 上传的文件 */
	file: File;
}

// ==================== 接口函数 ====================

/**
 * 新增一条单元数据
 * @description 新增单元信息
 */
export function addUnit<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UnitData>({
		url: "/unit/add-unit",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				bId: "",
				unitNum: "",
				floorId: "",
				layerCount: 0,
				lift: "",
				userId: "",
				remark: "",
				statusCd: "",
				unitArea: "",
				unitId: "",
				createTime: "",
			},
		},
		options,
	});
}

/**
 * 查询楼栋信息
 * @description 分页查询楼栋信息列表
 */
export function queryFloor<T = PageDTO<FloorData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryFloorParams>({
		url: "/floor/query",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				floorNum: "",
				name: "",
				communityId: "",
			},
		},
		options,
	});
}

/**
 * 新增房屋信息
 * @description 新增房屋信息
 */
export function addHouse<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, HouseAddData>({
		url: "/add-house",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				bId: "",
				roomNum: "",
				unitId: "",
				layer: "",
				builtUpArea: 0,
				feeCoefficient: 0,
				remark: "",
				state: "",
				roomType: "",
				roomArea: 0,
			},
		},
		options,
	});
}

/**
 * 获取单元
 * @description 分页查询指定楼栋的单元列表
 */
export function queryUnit<T = PageDTO<UnitData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryUnitParams>({
		url: "/unit/query",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				floorId: "",
				unitNum: "",
			},
		},
		options,
	});
}

/**
 * 获取房屋详细信息
 * @description 根据房屋ID获取房屋详细信息
 */
export function getHouseDetail<T = HouseDetailData>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetHouseDetailParams>({
		url: "/house/detail",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				houseId: "",
			},
		},
		options,
	});
}

/**
 * 导入房产文件
 * @description 上传房产文件进行导入
 */
export function uploadFile<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UploadFileData>({
		url: "/house/file/upload",
		httpParamWay: "body",
		upType: UpType.file,
		config: {
			method: "POST",
			data: {
				file: new File([], ""),
			},
		},
		options,
	});
}

/**
 * 修改一条单元数据
 * @description 修改单元信息
 */
export function modifyUnit<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UnitData>({
		url: "/unit/modify-unit",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				bId: "",
				unitNum: "",
				floorId: "",
				layerCount: 0,
				lift: "",
				userId: "",
				remark: "",
				statusCd: "",
				unitArea: "",
				unitId: "",
				createTime: "",
			},
		},
		options,
	});
}

/**
 * 修改房屋信息
 * @description 修改房屋信息
 */
export function modifyHouse<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, HouseModifyData>({
		url: "/modify-house",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				roomNum: "",
				unitId: "",
				layer: "",
				builtUpArea: 0,
				feeCoefficient: 0,
				remark: "",
				roomType: "",
				roomArea: 0,
				section: 0,
				apartment: "",
				roomRent: 0,
				roomId: "",
			},
		},
		options,
	});
}

/**
 * 查询某小区的单元
 * @description 分页查询指定小区的单元列表
 */
export function queryCommunityUnit<T = PageDTO<UnitData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryCommunityUnitParams>({
		url: "/unit/query-community-unit",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				communityId: "",
				floorNum: "",
				unitNum: "",
			},
		},
		options,
	});
}

/**
 * 选择房屋列表
 * @description 分页查询可选择的房屋列表
 */
export function queryHouseSelect<T = PageDTO<HouseSelectData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryHouseSelectParams>({
		url: "/house/select",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				floorNum: "",
				unitNum: "",
				roomNum: "",
			},
		},
		options,
	});
}

/**
 * 下载房产文件
 * @description 根据文件名下载房产文件
 */
export function downloadFile<T = void>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DownloadFileParams>({
		url: "/house/file/download",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				filename: "",
			},
		},
		options,
	});
}

/**
 * 删除单元数据支持批量
 * @description 批量删除单元数据
 */
export function removeUnit<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, string[]>({
		url: "/unit/delete-unit",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "DELETE",
			data: [],
		},
		options,
	});
}

/**
 * 新增楼栋
 * @description 新增楼栋信息
 */
export function addFloor<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, FloorData>({
		url: "/floor/add-floor",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				floorId: "",
				bId: "",
				floorNum: "",
				name: "",
				userId: "",
				remark: "",
				createTime: "",
				communityId: "",
				statusCd: "",
				floorArea: "",
				seq: 0,
			},
		},
		options,
	});
}

/**
 * 删除房屋信息
 * @description 批量删除房屋信息
 */
export function removeHouse<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, string[]>({
		url: "/delete-house",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "DELETE",
			data: [],
		},
		options,
	});
}

/**
 * 删除楼栋支持批量
 * @description 批量删除楼栋信息
 */
export function removeFloor<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, string[]>({
		url: "/floor/delete-by-id",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "DELETE",
			data: [],
		},
		options,
	});
}

/**
 * 获取房屋列表
 * @description 分页查询房屋列表
 */
export function queryHouseList<T = PageDTO<HouseListData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryHouseListParams>({
		url: "/house/list",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				houseId: "",
				statusCd: "",
				floorNum: "",
				unitNum: "",
			},
		},
		options,
	});
}

/**
 * 退房，出售房产(输入房屋编号)
 * @description 批量退房和出售房产
 */
export function removeHouseByHouseId<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, string[]>({
		url: "/house/home/delete-by-house_id",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "DELETE",
			data: [],
		},
		options,
	});
}

/**
 * 修改楼栋信息
 * @description 修改楼栋信息
 */
export function modifyFloor<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, FloorData>({
		url: "/floor/modify-floor",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				floorId: "",
				bId: "",
				floorNum: "",
				name: "",
				userId: "",
				remark: "",
				createTime: "",
				communityId: "",
				statusCd: "",
				floorArea: "",
				seq: 0,
			},
		},
		options,
	});
}

/**
 * 获取房屋名称列表
 * @description 根据楼栋号和单元号获取房屋名称列表
 */
export function queryHouseName<T = HouseNameData[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryHouseNameParams>({
		url: "/house/name",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				floorNum: "",
				unitNum: "",
			},
		},
		options,
	});
}

/**
 * 交房，购入房产
 * @description 交房和购入房产操作
 */
export function addHouseHome<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, HouseAddData>({
		url: "/house/home/post",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				bId: "",
				roomNum: "",
				unitId: "",
				layer: "",
				builtUpArea: 0,
				feeCoefficient: 0,
				remark: "",
				state: "",
				roomType: "",
				roomArea: 0,
			},
		},
		options,
	});
}
