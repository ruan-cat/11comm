/**
 * 删除成员车辆参数类型
 */
interface DeleteMemberVehicleParams {
	/** carId */
	carId: string;
}

/**
 * 续租车位参数类型
 */
interface RenewParkingSpaceLeaseParams {
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
 * 获取车辆基础信息视图对象
 */
interface VehicleBasicInfoViewModel {
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
 * 获取车辆基础信息参数类型
 */
interface GetVehicleBasicInfoParams {
	/** carId */
	carId: string;
}

/**
 * 添加车辆参数类型
 */
interface AddCarParams {
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
 * 添加成员车辆参数类型
 */
interface AddMemberVehicleParams {
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
 * 导出车辆数据参数类型
 */
interface ExportVehicleParams {
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
 * 导入车辆参数类型
 */
interface ImportVehicleParams {
	/** 文件 */
	file: File;
}

/**
 * 成员车辆模型
 */
interface MemberVehicleModel {
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
 * 获取成员车辆列表参数类型
 */
interface GetMemberVehicleListParams {
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
 * 修改车辆参数类型
 */
interface ModifyCarParams {
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
 * 修改成员车辆参数类型
 */
interface ModifyOwnerVehicleParams {
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
 * 车辆修改记录模型
 */
interface VehicleModifyRecordModel {
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
 * 获取车辆修改记录参数类型
 */
interface GetModifyRecordListParams {
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
 * 获取车辆列表视图模型
 */
interface GetCarListViewModel {
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
 * 获取车辆列表参数类型
 */
interface GetCarListParams {
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
 * 删除成员车辆接口
 * @description 删除指定的成员车辆
 */
export function deleteMemberVehicle<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteMemberVehicleParams>({
		url: "/j7-park/park-manage/owner-vehicle/delete-owner-vehicle",
		options,
		httpParamWay: "query",
		config: {
			method: "delete",
			params: {
				carId: "",
			},
		},
	});
}

/**
 * 续租车位接口
 * @description 续租指定车辆的车位
 */
export function renewParkingSpaceLease<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RenewParkingSpaceLeaseParams>({
		url: "/j7-park/park-manage/owner-vehicle/renew-parking-space-lease",
		options,
		httpParamWay: "body",
		config: {
			method: "put",
			data: {
				carId: "",
				endTime: "",
				psId: "",
				startTime: "",
			},
		},
	});
}

/**
 * 获取车辆基础信息接口
 * @description 根据车辆ID获取车辆基础信息
 */
export function getVehicleBasicInfo<T = VehicleBasicInfoViewModel>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetVehicleBasicInfoParams>({
		url: "/j7-park/park-manage/owner-vehicle/query-vehicle-info",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				carId: "",
			},
		},
	});
}

/**
 * 添加车辆接口
 * @description 添加新的业主车辆信息
 */
export function addCar<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddCarParams>({
		url: "/j7-park/park-manage/owner-vehicle/add-car",
		options,
		httpParamWay: "body",
		config: {
			method: "post",
			data: {
				carNum: "",
				carType: "",
				communityId: "",
				leaseType: "",
				ownerId: "",
				psId: "",
			},
		},
	});
}

/**
 * 添加成员车辆接口
 * @description 添加新的成员车辆信息
 */
export function addMemberVehicle<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, AddMemberVehicleParams>({
		url: "/j7-park/park-manage/owner-vehicle/add-member-vehicle",
		options,
		httpParamWay: "query",
		config: {
			method: "post",
			params: {
				carBrand: "",
				carColor: "",
				carNum: "",
				carType: "",
			},
		},
	});
}

/**
 * 导出车辆数据接口
 * @description 根据查询条件导出车辆数据，返回Excel文件的字节流
 */
export function exportVehicle<T = Record<string, string>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ExportVehicleParams>({
		url: "/j7-park/park-manage/owner-vehicle/export-vehicle",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				carTypeCd: "",
				communityId: "",
			},
		},
	});
}

/**
 * 导入车辆接口
 * @description 通过Excel文件导入车辆数据
 */
export function importVehicle<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ImportVehicleParams>({
		url: "/j7-park/park-manage/owner-vehicle/import-vehicle",
		options,
		httpParamWay: "body",
		upType: UpType.file,
		config: {
			method: "post",
			data: {
				file: null as any,
			},
		},
	});
}

/**
 * 获取成员车辆列表接口
 * @description 获取成员车辆列表（条件+分页）
 */
export function getMemberVehicleList<T = PageDTO<MemberVehicleModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetMemberVehicleListParams>({
		url: "/j7-park/park-manage/owner-vehicle/member-vehicle",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				carId: "",
				memberId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
	});
}

/**
 * 修改车辆接口
 * @description 修改车辆信息
 */
export function modifyCar<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyCarParams>({
		url: "/j7-park/park-manage/owner-vehicle/modify-car",
		options,
		httpParamWay: "body",
		config: {
			method: "put",
			data: {
				carId: "",
				carNum: "",
				carType: "",
				communityId: "",
				leaseType: "",
				memberId: "",
			},
		},
	});
}

/**
 * 修改成员车辆接口
 * @description 修改成员车辆信息
 */
export function modifyOwnerVehicle<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyOwnerVehicleParams>({
		url: "/j7-park/park-manage/owner-vehicle/modify-owner-vehicle",
		options,
		httpParamWay: "body",
		config: {
			method: "put",
			data: {
				carType: "",
				id: "",
			},
		},
	});
}

/**
 * 获取车辆修改记录接口
 * @description 获取车辆修改记录（条件+分页）
 */
export function getModifyRecordList<T = PageDTO<VehicleModifyRecordModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetModifyRecordListParams>({
		url: "/j7-park/park-manage/owner-vehicle/modify-record",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				carId: "",
				memberId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
	});
}

/**
 * 获取车辆列表接口
 * @description 获取车辆列表（条件+分页）
 */
export function getCarList<T = PageDTO<GetCarListViewModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetCarListParams>({
		url: "/j7-park/park-manage/owner-vehicle/query-all",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			params: {
				communityId: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
	});
}

/**
 * 释放车位接口
 * @description 通过车辆ID释放指定车位
 */
export function releaseParkingSpace<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, { carId: string }>({
		url: "/j7-park/park-manage/owner-vehicle/release-parking-space",
		options,
		httpParamWay: "query",
		config: {
			method: "put",
			params: {
				carId: "",
			},
		},
	});
}

/**
 * 删除车辆接口
 * @description 通过车辆ID删除指定车辆
 */
export function removeOwnerVehicle<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, { carId: string }>({
		url: "/j7-park/park-manage/owner-vehicle/remove-owner-vehicle",
		options,
		httpParamWay: "query",
		config: {
			method: "delete",
			params: {
				carId: "",
			},
		},
	});
}
