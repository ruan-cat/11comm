import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 删除成员车辆参数
 */
export interface DeleteMemberVehicleParams {
	/** 车辆ID */
	carId: string;
}

/**
 * 续租车位参数
 */
export interface RenewParkingSpaceLeaseParams {
	/** 车辆ID */
	carId: string;
	/** 结租时间 */
	endTime: string;
	/** 车位ID */
	psId: string;
	/** 备注 */
	remark?: string;
	/** 起租时间 */
	startTime: string;
}

/**
 * 车辆基础信息数据模型
 */
export interface VehicleBasicInfoDataModel {
	/** 车辆品牌 */
	carBrand?: string;
	/** 颜色 */
	carColor?: string;
	/** 车牌号 */
	carNumber?: string;
	/** 车辆类型 */
	carTypeName?: string;
	/** 结租时间 */
	endTime?: string;
	/** 车牌类型（出售车/月租车等） */
	leaseTypeName?: string;
	/** 停车场名称 */
	paName?: string;
	/** 车位编号 */
	parkingSpaceNum?: string;
	/** 备注 */
	remark?: string;
	/** 关联房屋 */
	room?: string;
	/** 起租时间 */
	startTime?: string;
	/** 车辆状态 */
	status?: string;
}

/**
 * 获取车辆基础信息参数
 */
export interface GetVehicleBasicInfoParams {
	/** 车辆ID */
	carId: string;
}

/**
 * 添加车辆参数
 */
export interface AddCarParams {
	/** 汽车品牌 */
	carBrand?: string;
	/** 颜色 */
	carColor?: string;
	/** 车牌号 */
	carNum: string;
	/** 车类型 9901 家用小汽车，9902 客车，9903 货车，9904 电动车，9905 三轮车，9906 信用期车辆 */
	carType: string;
	/** 社区id */
	communityId: string;
	/** 结租时间 */
	endTime?: string;
	/** 车牌类型 H 月租车，S 出售车，I 内部车，NM 免费车 */
	leaseType: string;
	/** 业主id */
	ownerId: string;
	/** 车位id */
	psId: string;
	/** 备注 */
	remark?: string;
	/** 起租时间 */
	startTime?: string;
}

/**
 * 添加成员车辆参数
 */
export interface AddMemberVehicleParams {
	/** 车辆品牌 */
	carBrand: string;
	/** 车辆颜色 */
	carColor: string;
	/** 汽车Id */
	carId?: string;
	/** 车牌号 */
	carNum: string;
	/** 车辆类型 */
	carType: string;
	/** 成员ID */
	memberId?: string;
	/** 备注 */
	remark?: string;
}

/**
 * 导出车辆数据参数
 */
export interface ExportVehicleParams {
	/** 车牌号 */
	carNum?: string;
	/** 主车辆 */
	carTypeCd: string;
	/** 社区id */
	communityId: string;
	/** 租赁类型 */
	leaseType?: string;
	/** 联系方式 */
	link?: string;
	/** 成员车牌号 */
	memberCarNum?: string;
	/** 业主名称 */
	name?: string;
	/** 车位编号 */
	num?: string;
	/** 车位状态 */
	valid?: number;
}

/**
 * 导入车辆参数
 */
export interface ImportVehicleParams {
	/** 文件 */
	file: File;
}

/**
 * 成员车辆数据模型
 */
export interface MemberVehicleDataModel {
	/** 车辆品牌 */
	carBrand?: string;
	/** 车辆颜色 */
	carColor?: string;
	/** 车牌号 */
	carNum?: string;
	/** 车辆类型 */
	carType?: string;
	/** 截止时间 */
	endTime?: string;
	/** 停车场编号 */
	paNum?: string;
	/** 车位编号 */
	psNum?: string;
	/** 房屋编号 */
	roomNum?: string;
	/** 起租时间 */
	startTime?: string;
	/** 车位状态 */
	state?: string;
	/** 用户名 */
	userName?: string;
	/** 电话 */
	userTel?: string;
}

/**
 * 获取成员车辆列表参数
 */
export interface GetMemberVehicleListParams {
	/** 车辆ID */
	carId: string;
	/** 成员ID */
	memberId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 修改车辆参数
 */
export interface ModifyCarParams {
	/** 汽车品牌 */
	carBrand?: string;
	/** 颜色 */
	carColor?: string;
	/** 汽车id */
	carId: string;
	/** 车牌号 */
	carNum: string;
	/** 车类型 9901 家用小汽车，9902 客车，9903 货车，9904 电动车，9905 三轮车，9906 信用期车辆 */
	carType: string;
	/** 社区id */
	communityId: string;
	/** 结租时间 */
	endTime?: string;
	/** 车牌类型 H 月租车，S 出售车，I 内部车，NM 免费车 */
	leaseType: string;
	/** 成员id */
	memberId: string;
	/** 备注 */
	remark?: string;
	/** 起租时间 */
	startTime?: string;
}

/**
 * 修改成员车辆参数
 */
export interface ModifyOwnerVehicleParams {
	/** 车辆品牌 */
	carBrand?: string;
	/** 车辆颜色 */
	carColor?: string;
	/** 车牌号 */
	carNum?: string;
	/** 车辆类型 */
	carType: string;
	/** 车辆id */
	id: string;
	/** 备注 */
	remark?: string;
}

/**
 * 车辆修改记录数据模型
 */
export interface VehicleModifyRecordDataModel {
	/** 车辆品牌 */
	carBrand?: string;
	/** 车辆颜色 */
	carColor?: string;
	/** 车牌号 */
	carNum?: string;
	/** 车辆类型 */
	carType?: string;
	/** 创建时间 */
	createTime?: string;
	/** 截止时间 */
	endTime?: string;
	/** 起租时间 */
	startTime?: string;
	/** 车位状态 */
	state?: string;
	/** 用户名 */
	userName?: string;
	/** 电话 */
	userTel?: string;
}

/**
 * 获取车辆修改记录参数
 */
export interface GetModifyRecordListParams {
	/** 车辆ID */
	carId: string;
	/** 成员ID */
	memberId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

/**
 * 车辆列表数据模型
 */
export interface CarListDataModel {
	/** 停车场编号 */
	areaNum?: string;
	/** 车颜色 */
	carColor?: string;
	/** 车辆ID */
	carId?: string;
	/** 车牌号 */
	carNum?: string;
	/** 9901 家用小汽车，9902 客车，9903 货车，9904 电动车，9905 三轮车，9906 信用期车辆 */
	carType?: string;
	/** 社区id */
	communityId?: string;
	/** 结组时间 */
	endTime?: string;
	/** 层数 */
	layer?: string;
	/** 车牌类型 H 月租车，S 出售车，I 内部车，NM 免费车 */
	leaseType?: string;
	/** 联系人手机号 */
	link?: string;
	/** 成员车辆统计 */
	memberCarNum?: string;
	/** 成员id */
	memberId?: string;
	/** 业主名称 */
	name?: string;
	/** 业主ID */
	ownerId?: string;
	/** 备注 */
	remark?: string;
	/** 房屋编号 */
	roomNum?: string;
	/** 车位编号 */
	spaceNum?: string;
	/** 起租时间 */
	startTime?: string;
	/** 状态 1001 正常状态，2002 车位释放欠费状态，3003 车位释放 */
	state?: string;
	/** 单元ID */
	unitId?: string;
}

/**
 * 获取车辆列表参数
 */
export interface GetCarListParams {
	/** 车牌号 */
	carNum?: string;
	/** 社区id */
	communityId: string;
	/** 车牌类型 H 月租车，S 出售车，I 内部车，NM 免费车 */
	leaseType?: string;
	/** 联系方式 */
	link?: string;
	/** 成员车牌号 */
	memberCarNum?: string;
	/** 业主名称 */
	name?: string;
	/** 车位编号 */
	num?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 车位状态 1 正常状态，2 无车位，3 到期 */
	valid?: number;
}

/**
 * 释放车位参数
 */
export interface ReleaseParkingSpaceParams {
	/** 车辆ID */
	carId: string;
}

/**
 * 删除车辆参数
 */
export interface RemoveOwnerVehicleParams {
	/** 车辆ID */
	carId: string;
}

// ==================== 接口函数 ====================

/**
 * 删除成员车辆
 */
export function deleteMemberVehicle<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteMemberVehicleParams>({
		url: "/j7-park/park-manage/owner-vehicle/delete-owner-vehicle",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				carId: "",
			},
		},
		options,
	});
}

/**
 * 续租车位
 */
export function renewParkingSpaceLease<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RenewParkingSpaceLeaseParams>({
		url: "/j7-park/park-manage/owner-vehicle/renew-parking-space-lease",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				carId: "",
				endTime: "",
				psId: "",
				startTime: "",
			},
		},
		options,
	});
}

/**
 * 获取车辆基础信息
 */
export function getVehicleBasicInfo<T = VehicleBasicInfoDataModel>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetVehicleBasicInfoParams>({
		url: "/j7-park/park-manage/owner-vehicle/query-vehicle-info",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				carId: "",
			},
		},
		options,
	});
}

/**
 * 添加车辆
 */
export function addCar<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddCarParams>({
		url: "/j7-park/park-manage/owner-vehicle/add-car",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				carNum: "",
				carType: "",
				communityId: "",
				leaseType: "",
				ownerId: "",
				psId: "",
			},
		},
		options,
	});
}

/**
 * 添加成员车辆
 */
export function addMemberVehicle<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddMemberVehicleParams>({
		url: "/j7-park/park-manage/owner-vehicle/add-member-vehicle",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				carBrand: "",
				carColor: "",
				carNum: "",
				carType: "",
			},
		},
		options,
	});
}

/**
 * 导出车辆数据
 */
export function exportVehicle<T = ArrayBuffer>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ExportVehicleParams>({
		url: "/j7-park/park-manage/owner-vehicle/export-vehicle",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				carTypeCd: "",
				communityId: "",
			},
		},
		options,
	});
}

/**
 * 导入车辆
 */
export function importVehicle<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ImportVehicleParams>({
		url: "/j7-park/park-manage/owner-vehicle/import-vehicle",
		httpParamWay: "body",
		upType: UpType.file,
		config: {
			method: "POST",
			data: {
				file: null as any,
			},
		},
		options,
	});
}

/**
 * 获取成员车辆列表（条件+分页）
 */
export function getMemberVehicleList<T = PageDTO<MemberVehicleDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetMemberVehicleListParams>({
		url: "/j7-park/park-manage/owner-vehicle/member-vehicle",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				carId: "",
				memberId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 修改车辆
 */
export function modifyCar<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyCarParams>({
		url: "/j7-park/park-manage/owner-vehicle/modify-car",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				carId: "",
				carNum: "",
				carType: "",
				communityId: "",
				leaseType: "",
				memberId: "",
			},
		},
		options,
	});
}

/**
 * 修改成员车辆
 */
export function modifyOwnerVehicle<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyOwnerVehicleParams>({
		url: "/j7-park/park-manage/owner-vehicle/modify-owner-vehicle",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				carType: "",
				id: "",
			},
		},
		options,
	});
}

/**
 * 获取车辆修改记录（条件+分页）
 */
export function getModifyRecordList<T = PageDTO<VehicleModifyRecordDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetModifyRecordListParams>({
		url: "/j7-park/park-manage/owner-vehicle/modify-record",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				carId: "",
				memberId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 获取车辆列表（条件+分页）
 */
export function getCarList<T = PageDTO<CarListDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetCarListParams>({
		url: "/j7-park/park-manage/owner-vehicle/query-all",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 释放车位
 */
export function releaseParkingSpace<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ReleaseParkingSpaceParams>({
		url: "/j7-park/park-manage/owner-vehicle/release-parking-space",
		httpParamWay: "query",
		config: {
			method: "PUT",
			params: {
				carId: "",
			},
		},
		options,
	});
}

/**
 * 删除车辆
 */
export function removeOwnerVehicle<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, RemoveOwnerVehicleParams>({
		url: "/j7-park/park-manage/owner-vehicle/remove-owner-vehicle",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				carId: "",
			},
		},
		options,
	});
}
