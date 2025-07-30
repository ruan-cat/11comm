import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 添加房屋产权数据对象
 */
export interface AddPropertyData {
	/** 地址 */
	address: string;
	/** 身份证反面照片 */
	backIdCardImage: File;
	/** 小区Id */
	communityId: string;
	/** 购房合同图片上传 */
	contractImages: File[];
	/** 楼栋名 */
	floorName: string;
	/** 身份证正面照片 */
	frontIdCardImage: File;
	/** 维修基金是否缴费 */
	fundIsPaid: string;
	/** 身份证号 */
	idCard: string;
	/** 联系方式 */
	link: string;
	/** 姓名 */
	name: string;
	/** 对象ID */
	objId: string;
	/** 房屋编号 */
	roomNum: string;
	/** 契税是否缴费 */
	taxIsPaid: string;
	/** 单元编号 */
	unitNum: string;
}

/**
 * 审核房屋产权数据对象
 */
export interface CheckPropertyData {
	/** 产权登记Id */
	prrId: string;
	/** 房屋编号 */
	roomNum: string;
	/** 审核状态 */
	state: string;
	/** 备注 */
	remark?: string;
}

/**
 * 房屋产权删除数据对象
 */
export interface DeletePropertyData {
	/** 产权登记Id */
	prrId: string;
}

/**
 * 房屋产权详情模型
 */
export interface PropertyDetailModel {
	/** 创建时间 */
	createTime: string;
	/** 文件真实名称 */
	fileRealName: string;
	/** 是否缴费 true 是 false 否 */
	isTrue: string;
	/** 产权登记Id */
	prrdId: string;
	/** 材料类型 001身份证 002购房合同 003维修基金 004契税 */
	securities: string;
	/** 数据状态 0有效的,1无效的 */
	statusCd: string;
	/** 图片URL地址 */
	url: string;
}

/**
 * 房屋产权传输模型
 */
export interface PropertyTransferModel {
	/** 地址 */
	address: string;
	/** 小区Id */
	communityId: string;
	/** 楼栋名 */
	floorName: string;
	/** 身份证号 */
	idCard: string;
	/** 联系方式 */
	link: string;
	/** 姓名 */
	name: string;
	/** 对象ID */
	objId: string;
	/** 房屋产权ID */
	prrId: string;
	/** 房屋编号 */
	roomNum: string;
	/** 单元编号 */
	unitNum: string;
}

/**
 * 查询房屋产权详情参数
 */
export interface QueryPropertyDetailParams {
	/** 小区ID */
	communityId: string;
	/** 楼栋 */
	floorNum: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 产权登记ID */
	prrId: string;
	/** 房屋编号 */
	roomNum: string;
	/** 单元 */
	unitNum: string;
}

/**
 * 查询房屋产权列表参数
 */
export interface QueryPropertyListParams {
	/** 小区ID */
	communityId: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 地址 */
	address?: string;
	/** 楼栋 */
	floorNum?: string;
	/** 身份证号 */
	idCard?: string;
	/** 联系方式 */
	link?: string;
	/** 姓名 */
	name?: string;
	/** 房屋ID */
	roomId?: string;
	/** 房屋编号 */
	roomNum?: string;
	/** 状态 */
	state?: string;
	/** 单元 */
	unitNum?: string;
}

/**
 * 房屋产权列表模型
 */
export interface PropertyListModel {
	/** 地址 */
	address: string;
	/** 身份证号 */
	idCard: string;
	/** 联系方式 */
	link: string;
	/** 姓名 */
	name: string;
	/** 房屋产权ID */
	prrId: string;
	/** 房屋ID */
	roomId: string;
	/** 房屋编号 */
	roomNum: string;
	/** 状态 */
	state: string;
}

/**
 * 文件上传数据
 */
export interface UploadFileData {
	/** 上传图片 */
	file: File;
}

// ==================== 接口函数 ====================

/**
 * 添加房屋产权
 * @description 添加新的房屋产权信息，包含文件上传
 */
export function addProperty<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddPropertyData>({
		url: "/j5-community/property/add-property",
		httpParamWay: "body",
		upType: UpType.file,
		config: {
			method: "POST",
			data: {
				address: "",
				backIdCardImage: new File([], ""),
				communityId: "",
				contractImages: [],
				floorName: "",
				frontIdCardImage: new File([], ""),
				fundIsPaid: "",
				idCard: "",
				link: "",
				name: "",
				objId: "",
				roomNum: "",
				taxIsPaid: "",
				unitNum: "",
			},
		},
		options,
	});
}

/**
 * 审核房屋产权
 * @description 审核房屋产权状态
 */
export function checkProperty<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, CheckPropertyData>({
		url: "/j5-community/property/check-property",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				prrId: "",
				roomNum: "",
				state: "",
				remark: "",
			},
		},
		options,
	});
}

/**
 * 删除房屋产权
 * @description 根据产权登记ID删除房屋产权
 */
export function deleteProperty<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeletePropertyData>({
		url: "/j5-community/property/delete-by-prrId",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "DELETE",
			data: {
				prrId: "",
			},
		},
		options,
	});
}

/**
 * 修改附件项
 * @description 修改房屋产权的附件信息
 */
export function modifyFileRel<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, PropertyDetailModel>({
		url: "/j5-community/property/modify-file-rel",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				createTime: "",
				fileRealName: "",
				isTrue: "",
				prrdId: "",
				securities: "",
				statusCd: "",
				url: "",
			},
		},
		options,
	});
}

/**
 * 修改房屋产权
 * @description 修改房屋产权基本信息
 */
export function modifyProperty<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, PropertyTransferModel>({
		url: "/j5-community/property/modify-property",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				address: "",
				communityId: "",
				floorName: "",
				idCard: "",
				link: "",
				name: "",
				objId: "",
				prrId: "",
				roomNum: "",
				unitNum: "",
			},
		},
		options,
	});
}

/**
 * 获取房屋产权详情
 * @description 获取指定房屋产权的详细信息
 */
export function queryPropertyDetail<T = PageDTO<PropertyDetailModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryPropertyDetailParams>({
		url: "/j5-community/property/query-property-detail",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				floorNum: "",
				pageIndex: 1,
				pageSize: 10,
				prrId: "",
				roomNum: "",
				unitNum: "",
			},
		},
		options,
	});
}

/**
 * 获取房屋产权列表（条件+分页）
 * @description 根据条件查询房屋产权列表
 */
export function queryPropertyList<T = PageDTO<PropertyListModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryPropertyListParams>({
		url: "/j5-community/property/query-property-list",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				communityId: "",
				pageIndex: 1,
				pageSize: 10,
				address: "",
				floorNum: "",
				idCard: "",
				link: "",
				name: "",
				roomId: "",
				roomNum: "",
				state: "",
				unitNum: "",
			},
		},
		options,
	});
}

/**
 * 上传产权详情里的图片
 * @description 上传房屋产权相关的图片文件
 */
export function uploadPropertyImage<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UploadFileData>({
		url: "/j5-community/property/upload",
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
