import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 终止合同参数
 */
export interface TerminateContractParams {
	/** 合同id */
	contractId?: string;
}

/**
 * 房间信息模型（续签合同用）
 */
export interface RenewContractRoomModel {
	/** 户型 */
	apartment: string;
	/** 户型名称 */
	apartmentName: string;
	/** 建筑面积 */
	builtUpArea: string;
	/** 合同编号 */
	contractId: string;
	/** 结束时间 */
	endTime: string;
	/** 算费系数 */
	feeCoefficient: string;
	/** 建筑面积 */
	floorArea: string;
	/** 楼ID */
	floorId: string;
	/** 楼编号 */
	floorNum: string;
	/** 层数 */
	layer: string;
	/** 业主id */
	ownerId: string;
	/** 业主名称 */
	ownerName: string;
	/** 备注 */
	remark: string;
	/** 房屋占地 */
	roomArea: string;
	/** 房屋id */
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
	/** 房屋状态 */
	state: string;
	/** 状态名称 */
	stateName: string;
	/** 数据状态 */
	statusCd: string;
	/** 商户id */
	storeId: string;
	/** 单元面积 */
	unitArea: string;
	/** 单元ID */
	unitId: string;
	/** 单元编号 */
	unitNum: string;
	/** 用户id */
	userId: string;
	/** 用户名称 */
	userName: string;
}

/**
 * 续签合同参数
 */
export interface RenewContractParams {
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
	/** 乙方 */
	bLink: string;
	/** 合同编码 */
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
	/** 父合同类型编码 */
	parentContractCode: string;
	/** 父合同类型名称 */
	parentContractName: string;
	/** 父状态名称 */
	parentStateName: string;
	/** 甲方 */
	partyA: string;
	/** 乙方 */
	partyB: string;
	/** 房屋列表 */
	rooms: RenewContractRoomModel[];
	/** 签订时间 */
	signingTime: string;
	/** 员工名称 */
	staffName: string;
	/** 开始时间 */
	startTime: string;
	/** 模版文件id */
	tempfile: string;
}

/**
 * 获取到期合同列表参数
 */
export interface GetExpiredContractListParams {
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
 * 到期合同数据模型
 */
export interface ExpiredContractDataModel {
	/** 甲方联系人 */
	aContacts?: string;
	/** 甲方电话 */
	aLink?: string;
	/** 合同金额 */
	amount?: string;
	/** 是否需要审核 */
	audit: string;
	/** 乙方联系人 */
	bContacts?: string;
	/** 乙方电话 */
	bLink?: string;
	/** 合同编码 */
	contractCode?: string;
	/** 合同id */
	contractId?: string;
	/** 合同名称 */
	contractName?: string;
	/** 父合同编号 */
	contractParentId?: string;
	/** 合同类型 */
	contractType?: string;
	/** 合同类型名称 */
	contractTypeName: string;
	/** 创建时间 */
	createTime: string;
	/** 结束时间 */
	endTime?: string;
	/** 合同对象编号 */
	objId: string;
	/** 合同对象类型 */
	objType: string;
	/** 经办人 */
	operator?: string;
	/** 经办人联系电话 */
	operatorLink?: string;
	/** 甲方 */
	partyA?: string;
	/** 乙方 */
	partyB?: string;
	/** 签订时间 */
	signingTime?: string;
	/** 开始时间 */
	startTime?: string;
	/** 合同状态编号 */
	state?: string;
	/** 状态名称 */
	stateName: string;
	/** 状态 */
	statusCd?: string;
	/** 商户id */
	storeId: string;
}

// ==================== 接口函数 ====================

/**
 * 终止合同
 */
export function terminateContract<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, TerminateContractParams>({
		url: "/j6-contract/expire/modify-to-end-expired-contract",
		httpParamWay: "query",
		config: {
			method: "POST",
			params: {
				contractId: "",
			},
		},
		options,
	});
}

/**
 * 续签合同
 */
export function renewContract<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, RenewContractParams>({
		url: "/j6-contract/expire/modify-to-renew-expired-contract",
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
				parentContractCode: "",
				parentContractName: "",
				parentStateName: "",
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
 * 获取到期合同列表（条件+分页）
 */
export function getExpiredContractList<T = PageDTO<ExpiredContractDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetExpiredContractListParams>({
		url: "/j6-contract/expire/query-expired-contract",
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
