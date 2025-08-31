import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 新增合同类型参数
 */
export interface AddContractTypeParams {
	/** 审计号 */
	audit: string;
	/** 审计名 */
	auditName: string;
	/** 描述 */
	remark: string;
	/** 合同类型名 */
	typeName: string;
}

/**
 * 合同扩展信息参数
 */
export interface ContractExtendInfoParams {
	/** 合同类型ID */
	contractTypeId: string;
	/** 查询显示 */
	listShow: boolean;
	/** 是否必填 */
	required: boolean;
	/** 规格ID */
	specCd?: string;
	/** 说明 */
	specHoldplace?: string;
	/** 规格名称 */
	specName: string;
	/** 是否展示 */
	specShow: boolean;
	/** 规格类型 */
	specType: "input" | "select";
	/** 值类型 */
	specValueType: "字符串" | "整数" | "金额" | "日期" | "时间";
}

/**
 * 删除合同类型扩展信息参数
 */
export interface DeleteContractTypeExtendParams {
	/** 合同类型id */
	contractTypeId: string;
}

/**
 * 合同类型名称数据模型
 */
export interface ContractTypeNameDataModel {
	/** 合同类型编号 */
	contractTypeId: string;
	/** 合同类型名称 */
	typeName: string;
}

/**
 * 修改合同类型模板参数
 */
export interface ModifyContractTemplateParams {
	/** 合同模板内容 */
	context: string;
	/** 合同类型编号 */
	contractTypeId: string;
}

/**
 * 获取合同类型列表参数
 */
export interface GetContractTypeListParams {
	/** 审核状态 */
	audit?: string;
	/** 查询页码 */
	pageIndex?: number;
	/** 查询条数 */
	pageSize?: number;
	/** 合同类型名称 */
	typeName?: string;
}

/**
 * 合同类型数据模型
 */
export interface ContractTypeDataModel {
	/** 审核状态 */
	audit: string;
	/** 审核状态名称 */
	auditName: string;
	/** 合同类型编号 */
	contractTypeId: string;
	/** 创建时间 */
	createTime: string;
	/** 备注 */
	remark: string;
	/** 数据状态 */
	statusCd: string;
	/** 商户ID */
	storeId: string;
	/** 合同类型名称 */
	typeName: string;
}

/**
 * 获取合同类型模板参数
 */
export interface GetContractTemplateParams {
	/** 合同类型ID */
	contractTypeId?: string;
}

/**
 * 合同类型模板数据模型
 */
export interface ContractTemplateDataModel {
	/** 模板内容 */
	context: string;
	/** 合同类型ID */
	contractTypeId: string;
	/** 状态值 */
	statusCd: string;
	/** 商户ID */
	storeId: string;
	/** 模板ID */
	templateId: string;
}

/**
 * 获取合同类型扩展信息列表参数
 */
export interface GetContractTypeExtendInfoListParams {
	/** 合同类型号 */
	contractTypeId?: string;
	/** 查询页码 */
	pageIndex?: number;
	/** 查询条数 */
	pageSize?: number;
	/** 规格ID */
	specCd?: string;
	/** 合同类型拓展名 */
	specName?: string;
	/** 规格是否展示 */
	specShow?: string;
}

/**
 * 合同类型扩展信息数据模型
 */
export interface ContractTypeExtendInfoDataModel {
	/** 合同类型号 */
	contractTypeId: string;
	/** 是否查询显示 */
	listShow: string;
	/** 总页数 */
	records: number;
	/** 是否必填 */
	required: string;
	/** 规格id */
	specCd: string;
	/** 说明 */
	specHoldplace: string;
	/** 规格名称 */
	specName: string;
	/** 规格是否显示 */
	specShow: string;
	/** 规格类型 */
	specType: string;
	/** 规格值类型 */
	specValueType: string;
	/** 数据状态 */
	statusCd: string;
	/** 商户号 */
	storeId: string;
}

/**
 * 删除合同类型参数
 */
export interface DeleteContractTypeParams {
	/** 合同类型号 */
	contractTypeId: string;
}

/**
 * 修改合同类型参数
 */
export interface UpdateContractTypeParams {
	/** 审计号 */
	audit: string;
	/** 审计名 */
	auditName: string;
	/** 描述 */
	remark: string;
	/** 合同类型名 */
	typeName: string;
}

// ==================== 接口函数 ====================

/**
 * 新增合同类型
 */
export function addContractType<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddContractTypeParams>({
		url: "/j6-contract/type/add-contract-type",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				audit: "",
				auditName: "",
				remark: "",
				typeName: "",
			},
		},
		options,
	});
}

/**
 * 添加合同扩展信息
 */
export function addContractExtendInfo<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ContractExtendInfoParams>({
		url: "/j6-contract/type/add-extend-info",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				contractTypeId: "",
				listShow: false,
				required: false,
				specCd: "",
				specHoldplace: "",
				specName: "",
				specShow: false,
				specType: "input",
				specValueType: "字符串",
			},
		},
		options,
	});
}

/**
 * 删除合同类型扩展信息
 */
export function deleteContractTypeExtend<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteContractTypeExtendParams>({
		url: "/j6-contract/type/delete-contract-type-extend",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: {
				contractTypeId: "",
			},
		},
		options,
	});
}

/**
 * 获取合同类型名称列表
 */
export function getContractTypeNameList<T = ContractTypeNameDataModel[]>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, {}>({
		url: "/j6-contract/type/list-contract-type-names",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
		},
		options,
	});
}

/**
 * 修改合同扩展信息
 */
export function modifyContractExtendInfo<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ContractExtendInfoParams>({
		url: "/j6-contract/type/modify-extend-info",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				contractTypeId: "",
				listShow: false,
				required: false,
				specCd: "",
				specHoldplace: "",
				specName: "",
				specShow: false,
				specType: "input",
				specValueType: "字符串",
			},
		},
		options,
	});
}

/**
 * 修改合同类型模板
 */
export function modifyContractTemplate<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyContractTemplateParams>({
		url: "/j6-contract/type/modify-template",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				context: "",
				contractTypeId: "",
			},
		},
		options,
	});
}

/**
 * 获取合同类型列表（条件+分页）
 */
export function getContractTypeList<T = PageDTO<ContractTypeDataModel>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetContractTypeListParams>({
		url: "/j6-contract/type/query-contract-types",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				audit: "",
				pageIndex: 1,
				pageSize: 10,
				typeName: "",
			},
		},
		options,
	});
}

/**
 * 获取合同类型模板
 */
export function getContractTemplate<T = ContractTemplateDataModel>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetContractTemplateParams>({
		url: "/j6-contract/type/query-template",
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
 * 获取合同类型扩展信息列表（条件+分页）
 */
export function getContractTypeExtendInfoList<T = PageDTO<ContractTypeExtendInfoDataModel>>(
	options: UseAxiosOptionsJsonVO<T>,
) {
	return useRequest<ParamsQueryKey, T, GetContractTypeExtendInfoListParams>({
		url: "/j6-contract/type/queryAll-contract-type-info",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				contractTypeId: "",
				pageIndex: 1,
				pageSize: 10,
				specCd: "",
				specName: "",
				specShow: "",
			},
		},
		options,
	});
}

/**
 * 删除合同类型
 */
export function deleteContractType<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, DeleteContractTypeParams>({
		url: "/j6-contract/type/remove-contract-type",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: {
				contractTypeId: "",
			},
		},
		options,
	});
}

/**
 * 修改合同类型
 */
export function updateContractType<T = boolean>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UpdateContractTypeParams>({
		url: "/j6-contract/type/update-contract-type",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				audit: "",
				auditName: "",
				remark: "",
				typeName: "",
			},
		},
		options,
	});
}
