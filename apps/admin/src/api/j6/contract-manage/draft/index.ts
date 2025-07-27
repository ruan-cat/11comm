import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 房间信息模型
 */
export interface RoomInfoModel {
	/** 户型 */
	apartment: string;
	/** 户型名称 */
	apartmentName: string;
	/** 建筑面积 */
	builtUpArea: string;
	/** 结束时间 */
	endTime: string;
	/** 算费系数 */
	feeCoefficient: string;
	/** 楼ID */
	floorId: string;
	/** 楼编号 */
	floorNum: string;
	/** 层数 */
	layer: string;
	/** 联系方式 */
	link: string;
	/** 业主ID */
	ownerId: string;
	/** 业主姓名 */
	ownerName: string;
	/** 备注 */
	remark: string;
	/** 室内面积 */
	roomArea: string;
	/** 房屋ID */
	roomId: string;
	/** 房屋名称 */
	roomName: string;
	/** 房屋编号 */
	roomNum: string;
	/** 租金 */
	roomRent: string;
	/** 房屋类型 */
	roomSubType: string;
	/** 房屋类型名称 */
	roomSubTypeName: string;
	/** 房屋类型 */
	roomType: string;
	/** 室 */
	section: string;
	/** 开始时间 */
	startTime: string;
	/** 状态 */
	state: string;
	/** 状态名称 */
	stateName: string;
	/** 单元ID */
	unitId: string;
	/** 单元编号 */
	unitNum: string;
}

/**
 * 起草合同参数
 */
export interface AddContractParams {
	/** 甲方联系人 */
	aContracts: string;
	/** 甲方电话 */
	aLink: string;
	/** 合同金额 */
	amount: string;
	/** 是否需要审核 */
	audit: string;
	/** 乙方联系人 */
	bContracts: string;
	/** 乙方电话 */
	bLink: string;
	/** 合同编码 */
	contractCode: string;
	/** 合同名称 */
	contractName: string;
	/** 合同类型 */
	contractType: string;
	/** 结束时间 */
	endTime: string;
	/** 合同对象 */
	objId: string;
	/** 合同对象id */
	objType: string;
	/** 经办人 */
	operator: string;
	/** 经办人电话 */
	operatorLink: string;
	/** 甲方 */
	partyA: string;
	/** 乙方 */
	partyB: string;
	/** 房屋列表 */
	rooms: RoomInfoModel[];
	/** 签订时间 */
	signingTime: string;
	/** 员工名称 */
	staffName: string;
	/** 开始时间 */
	startTime: string;
	/** 模版id */
	tempfile: string;
}

/**
 * 删除合同参数
 */
export interface DeleteContractParams {
	/** 合同ID */
	contractId?: string;
}

/**
 * 打印合同参数
 */
export interface PrintContractParams {
	/** 合同id */
	contractId?: string;
	/** 合同类型id */
	contractTypeId?: string;
}

/**
 * 修改合同参数
 */
export interface ModifyContractParams {
	/** 甲方联系人 */
	aContracts: string;
	/** 甲方电话 */
	aLink: string;
	/** 合同金额 */
	amount: string;
	/** 是否需要审核 */
	audit: string;
	/** 乙方联系人 */
	bContracts: string;
	/** 乙方电话 */
	bLink: string;
	/** 合同工编码 */
	contractCode: string;
	/** 合同名称 */
	contractName: string;
	/** 合同类型 */
	contractType: string;
	/** 结束时间 */
	endTime: string;
	/** 合同对象id */
	objId: string;
	/** 合同对象类型 */
	objType: string;
	/** 经办人 */
	operator: string;
	/** 经办人电话 */
	operatorLink: string;
	/** 甲方 */
	partyA: string;
	/** 乙方 */
	partyB: string;
	/** 房屋列表 */
	rooms: RoomInfoModel[];
	/** 签订时间 */
	signingTime: string;
	/** 员工名称 */
	staffName: string;
	/** 开始时间 */
	startTime: string;
	/** 模版id */
	tempfile: string;
}

/**
 * 获取合同详情参数
 */
export interface GetContractDetailParams {
	/** 合同类型id */
	contractTypeId: string;
}

/**
 * 合同详情数据模型
 */
export interface ContractDetailDataModel {
	/** 甲方联系人 */
	aContacts: string;
	/** 甲方电话 */
	aLink: string;
	/** 合同金额 */
	amount: string;
	/** 是否需要审核 */
	audit: string;
	/** 乙方联系人 */
	bContacts: string;
	/** 乙方电话 */
	bLink: string;
	/** 合同编码 */
	contractCode: string;
	/** 合同id */
	contractId: string;
	/** 合同名称 */
	contractName: string;
	/** 合同类型 */
	contractType: string;
	/** 合同类型名称 */
	contractTypeName: string;
	/** 创建时间 */
	createTime: string;
	/** 结束时间 */
	endTime: string;
	/** 合同对象 */
	objId: string;
	/** 合同对象类型 */
	objType: string;
	/** 经办人 */
	operator: string;
	/** 经办人电话 */
	operatorLink: string;
	/** 甲方 */
	partyA: string;
	/** 乙方 */
	partyB: string;
	/** 签订时间 */
	signingTime: string;
	/** 创建时间 */
	startTime: string;
	/** 状态 */
	state: string;
	/** 状态名称 */
	stateName: string;
	/** 数据状态 */
	statusCd: string;
	/** 商户id */
	storeId: string;
}

/**
 * 获取合同列表参数
 */
export interface GetContractListParams {
	/** 合同编号 */
	contractCode?: string;
	/** 合同名称 */
	contractNameLike?: string;
	/** 合同类型 */
	contractType?: string;
	/** 查询页码 */
	pageIndex?: number;
	/** 查询条数 */
	pageSize?: number;
}

/**
 * 合同属性模型
 */
export interface ContractAttrModel {
	/** 属性id */
	attrId: string;
	/** 合同id */
	contractId: string;
	/** 属性规格 */
	specCd: string;
	/** 数据状态 */
	statusCd: string;
	/** 商户id */
	storeId: string;
	/** 属性值 */
	value: string;
}

/**
 * 合同列表数据模型
 */
export interface ContractListDataModel {
	/** 甲方联系人 */
	aContacts: string;
	/** 甲方电话 */
	aLink: string;
	/** 合同金额 */
	amount: number;
	/** 合同属性 */
	attrs: ContractAttrModel[];
	/** 是否需要审核 */
	audit: string;
	/** 乙方联系人 */
	bContacts: string;
	/** 乙方电话 */
	bLink: string;
	/** 合同编号 */
	contractCode: string;
	/** 合同编号 */
	contractId: string;
	/** 合同名称 */
	contractName: string;
	/** 合同类型 */
	contractType: string;
	/** 合同类型名 */
	contractTypeName: string;
	/** 创建时间 */
	createTime: string;
	/** 结束时间 */
	endTime: string;
	/** 合同对象id */
	objId: string;
	/** 合同对象类型 */
	objType: string;
	/** 经办人 */
	operator: string;
	/** 经办人电话 */
	operatorLink: string;
	/** 甲方名称 */
	partyA: string;
	/** 乙方名称 */
	partyB: string;
	/** 签订时间 */
	signingTime: string;
	/** 开始时间 */
	startTime: string;
	/** 状态 */
	state: string;
	/** 状态名 */
	stateName: string;
	/** 数据状态 */
	statusCd: string;
	/** 商户id */
	storeId: string;
}

/**
 * 获取合同修改记录参数
 */
export interface GetContractChangeRecordParams {
	/** 合同id */
	contractId?: string;
	/** 员工名称 */
	staffNameLike?: string;
	/** 查询页码 */
	pageIndex?: number;
	/** 查询条数 */
	pageSize?: number;
}

/**
 * 合同修改记录数据模型
 */
export interface ContractChangeRecordDataModel {
	/** 甲方联系人 */
	acontacts?: string;
	/** 甲方电话 */
	alink?: string;
	/** 合同金额 */
	amount?: number;
	/** 乙方联系人 */
	bcontacts?: string;
	/** 乙方电话 */
	blink?: string;
	/** 修改人id */
	changePerson?: string;
	/** 修改人名称 */
	changePersonName?: string;
	/** 合同编码 */
	contractCode: string;
	/** 合同ID（主键） */
	contractId: string;
	/** 变更后的合同名称 */
	contractName: string;
	/** 合同类型ID */
	contractType: string;
	/** 合同类型名称 */
	contractTypeName?: string;
	/** 创建时间 */
	createTime?: string;
	/** 合同结束时间（变更后） */
	endTime: string;
	/** 经办人 */
	operator: string;
	/** 经办人电话 */
	operatorLink: string;
	/** 甲方（变更后） */
	partyA: string;
	/** 乙方（变更后） */
	partyB: string;
	/** 计划id */
	planId?: string;
	/** 计划类型 */
	planType?: string;
	/** 计划类型名称 */
	planTypeName?: string;
	/** 计划备注 */
	remark?: string;
	/** 签订时间（变更后） */
	signingTime: string;
	/** 合同开始时间（变更后） */
	startTime: string;
	/** 计划状态 */
	state?: string;
	/** 计划状态名称 */
	stateName?: string;
	/** 状态 */
	statusCd?: string;
	/** 商户id */
	storeId?: string;
}

/**
 * 选择合同列表参数
 */
export interface SelectContractListParams {
	/** 合同名称 */
	contractNameLike?: string;
	/** 查询页码 */
	pageIndex?: number;
	/** 查询条数 */
	pageSize?: number;
}

/**
 * 选择合同数据模型
 */
export interface SelectContractDataModel {
	/** 甲方联系人 */
	aContracts: string;
	/** 甲方电话 */
	aLink: string;
	/** 合同金额 */
	amount: string;
	/** 是否需要审核 */
	audit: string;
	/** 乙方联系人 */
	bContracts: string;
	/** 乙方电话 */
	bLink: string;
	/** 合同编码 */
	contractCode: string;
	/** 合同id */
	contractId: string;
	/** 合同名称 */
	contractName: string;
	/** 合同类型 */
	contractType: string;
	/** 合同类型名称 */
	contractTypeName: string;
	/** 创建时间 */
	createTime: string;
	/** 结束时间 */
	endTime: string;
	/** 合同对象id */
	objId: string;
	/** 合同对象类型 */
	objType: string;
	/** 经办人 */
	operator: string;
	/** 经办人电话 */
	operatorLink: string;
	/** 甲方 */
	partyA: string;
	/** 乙方 */
	partyB: string;
	/** 签订时间 */
	signingTime: string;
	/** 开始时间 */
	startTime: string;
	/** 开始用户 */
	startUserId: string;
	/** 状态 */
	state: string;
	/** 状态名称 */
	stateName: string;
	/** 数据状态 */
	statusCd: string;
	/** 商户id */
	storeId: string;
}

/**
 * 选择合同列表响应模型
 */
export interface SelectContractListResponseModel {
	/** 选择合同列表 */
	contractSelect: SelectContractDataModel[];
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
}

// ==================== 接口函数 ====================

/**
 * 起草合同
 */
export function addContract<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddContractParams>({
		url: "/j6-contract/draft/add-contract",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				aContracts: "",
				aLink: "",
				amount: "",
				audit: "",
				bContracts: "",
				bLink: "",
				contractCode: "",
				contractName: "",
				contractType: "",
				endTime: "",
				objId: "",
				objType: "",
				operator: "",
				operatorLink: "",
				partyA: "",
				partyB: "",
				rooms: [],
				signingTime: "",
				staffName: "",
				startTime: "",
				tempfile: "",
			},
		},
		options,
	});
}

/**
 * 删除合同
 */
export function deleteContract<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, DeleteContractParams>({
		url: "/j6-contract/draft/delete-contract",
		httpParamWay: "query",
		config: {
			method: "DELETE",
			params: {
				contractId: "",
			},
		},
		options,
	});
}

/**
 * 打印合同
 */
export function printContract<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, PrintContractParams>({
		url: "/j6-contract/draft/print",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				contractId: "",
				contractTypeId: "",
			},
		},
		options,
	});
}

/**
 * 修改合同
 */
export function modifyContract<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyContractParams>({
		url: "/j6-contract/draft/modify-contract",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				aContracts: "",
				aLink: "",
				amount: "",
				audit: "",
				bContracts: "",
				bLink: "",
				contractCode: "",
				contractName: "",
				contractType: "",
				endTime: "",
				objId: "",
				objType: "",
				operator: "",
				operatorLink: "",
				partyA: "",
				partyB: "",
				rooms: [],
				signingTime: "",
				staffName: "",
				startTime: "",
				tempfile: "",
			},
		},
		options,
	});
}

/**
 * 获取合同详情
 */
export function getContractDetail<T = ContractDetailDataModel>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetContractDetailParams>({
		url: "/j6-contract/draft/query-by-id",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				contractTypeId: "",
			},
		},
		options,
	});
}

/**
 * 获取合同列表（条件+分页）
 */
export function getContractList<T = PageDTO<ContractListDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetContractListParams>({
		url: "/j6-contract/draft/query-contract",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				contractCode: "",
				contractNameLike: "",
				contractType: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 获取合同修改记录（条件+分页）
 */
export function getContractChangeRecord<T = PageDTO<ContractChangeRecordDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetContractChangeRecordParams>({
		url: "/j6-contract/draft/query-contract-change-plan-by-id",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				contractId: "",
				staffNameLike: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 选择合同列表（条件+分页）
 */
export function selectContractList<T = SelectContractListResponseModel>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, SelectContractListParams>({
		url: "/j6-contract/draft/query-contract-select",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				contractNameLike: "",
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}
