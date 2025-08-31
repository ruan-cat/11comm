import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 删除合同甲方参数
 */
export interface DeleteContractPartyaParams {
	/** 甲方ID */
	partyaId: string;
}

/**
 * 获取合同甲方列表参数
 */
export interface GetContractPartyaListParams {
	/** 查询页码 */
	pageIndex?: number;
	/** 查询条数 */
	pageSize?: number;
	/** 合同甲方名称（必填） */
	partyA: string;
	/** 甲方联系人 */
	aContacts?: string;
	/** 甲方电话（必填） */
	aLink: string;
}

/**
 * 合同甲方数据模型
 */
export interface ContractPartyaDataModel {
	/** 甲方联系人 */
	acontacts: string;
	/** 甲方电话 */
	alink: string;
	/** 合同甲方名称 */
	partyA: string;
	/** 合同甲方ID */
	partyaId: string;
	/** 合同甲方状态码 */
	statusCd: string;
	/** 商户id */
	storeId: string;
}

/**
 * 添加合同甲方参数
 */
export interface AddContractPartyaParams {
	/** 甲方 */
	partyA: string;
	/** 甲方联系人 */
	acontacts: string;
	/** 甲方电话 */
	alink: string;
}

/**
 * 修改合同甲方参数
 */
export interface UpdateContractPartyaParams {
	/** 甲方 */
	partyA: string;
	/** 甲方ID */
	partyaId: string;
	/** 甲方联系人 */
	aContacts: string;
	/** 甲方电话 */
	aLink: string;
}

// ==================== 接口函数 ====================

/**
 * 获取合同甲方名称列表
 *
 * @description
 * 该接口有异常 未开发完成
 *
 * https://app.apifox.com/link/project/6386631/apis/api-305749927
 */
export function getContractPartyaNameList<T = string[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, {}>({
		url: "/j6-contract/partya/query-contract-partya",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
		},
		options,
	});
}

/**
 * 删除合同甲方
 */
export function deleteContractPartya<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteContractPartyaParams>({
		url: "/j6-contract/partya/delete-contract-partya",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: {
				partyaId: "",
			},
		},
		options,
	});
}

/**
 * 获取合同甲方列表（条件+分页）
 *
 * @description
 * 警告 接口重名 无法对接接口
 */
export function getContractPartyaList<T = PageDTO<ContractPartyaDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetContractPartyaListParams>({
		url: "/j6-contract/partya/query-contract-partya",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				partyA: "",
				aContacts: "",
				aLink: "",
			},
		},
		options,
	});
}

/**
 * 添加合同甲方
 */
export function addContractPartya<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddContractPartyaParams>({
		url: "/j6-contract/partya/save-contract-partya",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				partyA: "",
				acontacts: "",
				alink: "",
			},
		},
		options,
	});
}

/**
 * 修改合同甲方
 */
export function updateContractPartya<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UpdateContractPartyaParams>({
		url: "/j6-contract/partya/update-contract-partya",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				partyA: "",
				partyaId: "",
				aContacts: "",
				aLink: "",
			},
		},
		options,
	});
}
