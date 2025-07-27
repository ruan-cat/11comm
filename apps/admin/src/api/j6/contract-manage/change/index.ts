import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 查看变更明细参数
 */
export interface GetChangeDetailParams {
	/** 查询页码 */
	pageIndex?: number;
	/** 查询条数 */
	pageSize?: number;
	/** 变更id */
	planId?: string;
}

/**
 * 变更明细数据模型
 */
export interface ChangeDetailDataModel {
	/** 甲方联系人 */
	aContracts: string;
	/** 甲方电话 */
	aLink: string;
	/** 合同金额 */
	amount: string;
	/** 乙方联系人 */
	bContracts: string;
	/** 乙方金额 */
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
	/** 甲方 */
	partyA: string;
	/** 乙方 */
	partyB: string;
	/** 鉴定时间 */
	signingTime: string;
	/** 开始时间 */
	startTime: string;
	/** 合同编号 */
	contractId: string;
	/** 变更明细id */
	detailId: string;
	/** 合同变更id */
	planId: string;
	/** 合同变更类型 */
	planType: string;
	/** 合同变成类型名称 */
	planTypeName: string;
	/** 商户id */
	storeId: string;
}

/**
 * 获取合同变更列表参数
 */
export interface GetContractChangeListParams {
	/** 变更类型 */
	contractType?: "UPDATE" | "DELETE" | "ADD";
	/** 查询页码 */
	pageIndex?: number;
	/** 查询条数 */
	pageSize?: number;
	/** 合同名称 */
	contractName?: string;
	/** 合同类型 */
	contractCode?: string;
}

/**
 * 合同变更列表数据模型
 */
export interface ContractChangeListDataModel {
	/** 甲方联系人 */
	aContacts: string;
	/** 甲方电话 */
	aLink: string;
	/** 合同金额 */
	amount: string;
	/** 乙方联系人 */
	bContacts: string;
	/** 乙方电话 */
	bLink: string;
	/** 变更人 */
	changePerson: string;
	/** 变更名称 */
	changePersonName: string;
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
	/** 经办人 */
	operator: string;
	/** 经办人电话 */
	operatorLink: string;
	/** 甲方 */
	partyA: string;
	/** 乙方 */
	partyB: string;
	/** 合并变更计划id */
	planId: string;
	/** 变更类型 */
	planType: string;
	/** 变更类型名称 */
	planTypeName: string;
	/** 备注 */
	remark: string;
	/** 签订时间 */
	signingTime: string;
	/** 开始时间 */
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
 * 房间信息模型
 */
export interface RoomInfoModel {
	/** 户型 */
	apartment: string;
	/** 户型 */
	builtUpArea: string;
	/** 合同个数 */
	contractCount: string;
	/** 算费系数 */
	feeCoefficient: string;
	/** 楼ID */
	floorId: string;
	/** 楼编号 */
	floorNum: string;
	/** 层数 */
	layer: string;
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
	/** 房屋状态 */
	state: string;
	/** 房屋状态名称 */
	stateName: string;
	/** 单元ID */
	unitId: string;
	/** 单元编号 */
	unitNum: string;
}

/**
 * 主体变更参数
 */
export interface ModifyAssetChangeParams {
	/** 甲方联系人 */
	acontacts?: string;
	/** 甲方电话 */
	alink?: string;
	/** 合同金额 */
	amount?: number;
	/** 审核标识 */
	audit?: string;
	/** 乙方联系人 */
	bcontacts?: string;
	/** 乙方电话 */
	blink?: string;
	/** 变更备注 */
	changeRemark?: string;
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
	/** 合同结束时间（变更后） */
	endTime: string;
	/** 经办人 */
	operator: string;
	/** 经办人电话 */
	operatorLink: string;
	/** 审核流程参数 */
	param?: string;
	/** 甲方（变更后） */
	partyA: string;
	/** 乙方（变更后） */
	partyB: string;
	/** 计划类型 */
	planType?: string;
	/** 关联房间列表 */
	rooms?: RoomInfoModel[];
	/** 签订时间（变更后） */
	signingTime: string;
	/** 员工姓名（可选） */
	staffName?: string;
	/** 员工姓名（可选） */
	startTime: string;
}

// ==================== 接口函数 ====================

/**
 * 查看变更明细
 */
export function getChangeDetail<T = ChangeDetailDataModel[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetChangeDetailParams>({
		url: "/j6-contract/change/get-change-detail",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				planId: "",
			},
		},
		options,
	});
}

/**
 * 获取合同变更列表（条件+分页）
 */
export function getContractChangeList<T = ContractChangeListDataModel[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetContractChangeListParams>({
		url: "/j6-contract/change/get-contract-change",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				contractType: "UPDATE",
				pageIndex: 1,
				pageSize: 10,
				contractName: "",
				contractCode: "",
			},
		},
		options,
	});
}

/**
 * 主体变更--租期调整--资产变更
 */
export function modifyAssetChange<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyAssetChangeParams>({
		url: "/j6-contract/change/modify-asset-change",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				contractCode: "",
				contractId: "",
				contractName: "",
				contractType: "",
				endTime: "",
				operator: "",
				operatorLink: "",
				partyA: "",
				partyB: "",
				signingTime: "",
				startTime: "",
			},
		},
		options,
	});
}
