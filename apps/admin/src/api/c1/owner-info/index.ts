import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 业主基本信息
 */
export interface OwnerData {
	/** 业主id */
	ownerId: string;
	/** 业主姓名 */
	name: string;
	/** 图片src */
	fileRealName: string;
	/** 性别 */
	sex: string;
	/** 身份证号 */
	idCard: string;
	/** 联系方式 */
	link: string;
	/** 业主地址 */
	address: string;
	/** 房屋数 */
	houseNum: number;
	/** 业主成员数量 */
	memberNum: number;
	/** 车辆数 */
	carNumber: number;
	/** 投诉数 */
	complaintNum: number;
	/** 报修数 */
	repairNum: number;
	/** 欠费 */
	amountOwed: string;
	/** 报修名称 */
	contractNum: number;
	/** 门禁钥匙 */
	accessControlKey: string;
}

/**
 * 添加业主数据
 */
export interface OwnerAddData {
	/** 业主成员ID(必填) */
	memberId: string;
	/** 业主ID(必填) */
	ownerId: string;
	/** 业务ID(必填) */
	bId: string;
	/** 业主名称(必填) */
	name: string;
	/** 性别(必填) */
	sex: string;
	/** 年龄(可选) */
	age?: string;
	/** 联系人手机号（必填） */
	link: string;
	/** 用户ID(必填) */
	userId: string;
	/** 备注 */
	remark?: string;
	/** 创建时间(默认当前时间) */
	createTime?: string;
	/** 数据状态(默认0,可用) */
	statusCd?: string;
	/** 业主类型(默认1001,本人) */
	ownerTypeCd?: string;
	/** 小区ID(可选) */
	communityId?: string;
	/** 身份证号码(默认"-1") */
	idCard?: string;
	/** 业主成员状态(默认2000,审核完成) */
	state?: string;
	/** 业主标识(默认1,真实业主) */
	ownerFlag?: string;
	/** 家庭住址(可选) */
	address?: string;
	/** 创建人 */
	createBy?: string;
	/** 房屋编号 */
	roomNum?: string;
}

/**
 * 入住房屋数据
 */
export interface OwnerInfoAddData {
	/** 业主id */
	ownerId: string;
	/** 房间id */
	roomId: string;
	/** 用户id */
	userId: string;
	/** 备注 */
	remark?: string;
}

/**
 * 退出房屋数据
 */
export interface OwnerInfoData extends OwnerInfoAddData {
	/** 关系id */
	relId: string;
}

/**
 * 车辆信息
 */
export interface CarData {
	/** 车牌号 */
	carNum: string;
	/** 车辆类型 */
	leaseType: string;
	/** 车牌类型 */
	carType: string;
	/** 颜色 */
	carColor: string;
	/** 业主姓名 */
	name: string;
	/** 车位编号 */
	num: string;
	/** 有效时间 */
	validTime: string;
}

/**
 * 房屋信息
 */
export interface RoomData {
	/** 房屋编号 */
	roomNum: string;
	/** 楼层 */
	layer: string;
	/** 建筑面积 */
	builtUpArea: number;
	/** 状态 */
	state: string;
	/** 房屋类型 */
	roomType: string;
	/** 房租 */
	roomRent: number;
}

/**
 * 选择业主列表查询参数
 */
export interface QuerySelectOwnerParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 房屋编号 */
	roomNum?: string;
	/** 业主名称 */
	name?: string;
}

/**
 * 查询业主详细信息参数
 */
export interface QueryOwnerByIdParams {
	/** 业主ID */
	ownerId: string;
}

/**
 * 查询车辆信息参数
 */
export interface QueryCarParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 车牌号 */
	carNum?: string;
}

/**
 * 查询房屋信息参数
 */
export interface QueryRoomParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 房屋编号 */
	roomNum?: string;
}

/**
 * 获取业主列表参数
 */
export interface QueryOwnerListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 业主id */
	ownerId?: string;
	/** 业主姓名 */
	name?: string;
	/** 房屋编号 */
	roomNum?: string;
	/** 联系方式 */
	link?: string;
	/** 身份证号 */
	idCard?: string;
	/** 业主成员名称 */
	memberName?: string;
	/** 业主成员联系方式 */
	memberLink?: string;
}

/**
 * 打印预存收据/小票参数
 */
export interface PrintParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 业主姓名 */
	ownerName: string;
	/** 业主id */
	ownerId: string;
	/** 联系方式 */
	link: string;
}

// ==================== 接口函数 ====================

/**
 * 入住房屋
 * @description 添加业主入住房屋信息
 */
export function addIntoHouse<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, OwnerInfoAddData>({
		url: "/OwnerInfo/add-IntoHouse",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				ownerId: "",
				roomId: "",
				userId: "",
				remark: "",
			},
		},
		options,
	});
}

/**
 * 选择业主列表
 * @description 分页查询可选择的业主列表
 */
export function querySelectOwnerList<T = PageDTO<OwnerData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QuerySelectOwnerParams>({
		url: "/owner/query",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				roomNum: "",
				name: "",
			},
		},
		options,
	});
}

/**
 * 查询所有业主详细信息
 * @description 根据业主ID查询业主详细信息
 */
export function queryOwnerById<T = OwnerData>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryOwnerByIdParams>({
		url: "/owner/query-by-id",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				ownerId: "",
			},
		},
		options,
	});
}

/**
 * 查询车辆信息
 * @description 分页查询车辆信息列表
 */
export function queryCar<T = PageDTO<CarData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryCarParams>({
		url: "/house/car/query-car",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				carNum: "",
			},
		},
		options,
	});
}

/**
 * 退出房屋
 * @description 修改业主退出房屋状态
 */
export function modifyOutHouse<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, OwnerInfoData>({
		url: "/OwnerInfo/modify-OutHouse",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				ownerId: "",
				roomId: "",
				userId: "",
				remark: "",
				relId: "",
			},
		},
		options,
	});
}

/**
 * 添加业主
 * @description 新增业主信息
 */
export function addOwner<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, OwnerAddData>({
		url: "/owner/add",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				memberId: "",
				ownerId: "",
				bId: "",
				name: "",
				sex: "",
				age: "",
				link: "",
				userId: "",
				remark: "",
				createTime: "",
				statusCd: "",
				ownerTypeCd: "",
				communityId: "",
				idCard: "",
				state: "",
				ownerFlag: "",
				address: "",
				createBy: "",
				roomNum: "",
			},
		},
		options,
	});
}

/**
 * 查询所有业主房屋信息
 * @description 分页查询房屋信息列表
 */
export function queryRoom<T = PageDTO<RoomData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryRoomParams>({
		url: "/room",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				roomNum: "",
			},
		},
		options,
	});
}

/**
 * 获取业主列表
 * @description 分页查询业主列表，支持多条件筛选
 */
export function queryOwnerList<T = PageDTO<OwnerData>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryOwnerListParams>({
		url: "/house/owner/query-owner",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				ownerId: "",
				name: "",
				roomNum: "",
				link: "",
				idCard: "",
				memberName: "",
				memberLink: "",
			},
		},
		options,
	});
}

/**
 * 打印预存收据
 * @description 导出业主预存收据
 */
export function exportRpt<T = void>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, PrintParams>({
		url: "/PrintInfo/export-Rpt",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				ownerName: "",
				ownerId: "",
				link: "",
			},
		},
		options,
	});
}

/**
 * 修改业主
 * @description 修改业主基本信息
 */
export function modifyOwner<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, OwnerData>({
		url: "/owner/modify",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				ownerId: "",
				name: "",
				fileRealName: "",
				sex: "",
				idCard: "",
				link: "",
				address: "",
				houseNum: 0,
				memberNum: 0,
				carNumber: 0,
				complaintNum: 0,
				repairNum: 0,
				amountOwed: "",
				contractNum: 0,
				accessControlKey: "",
			},
		},
		options,
	});
}

/**
 * 打印预存小票
 * @description 导出业主预存小票
 */
export function exportSlip<T = void>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, PrintParams>({
		url: "/PrintInfo/export-Slip",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				ownerName: "",
				ownerId: "",
				link: "",
			},
		},
		options,
	});
}

/**
 * 删除业主
 * @description 批量删除业主，支持多个业主ID
 */
export function removeOwner<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, string[]>({
		url: "/owner/remove",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "DELETE",
			data: [],
		},
		options,
	});
}
