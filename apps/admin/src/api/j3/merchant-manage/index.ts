import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 状态信息传输模型
 */
export interface ModifyMerchantAdminStatusParams {
	/** 状态，48001 商户正常状态，48002 限制商户登录 */
	status: string;
	/** 管理员ID */
	userId: string;
}

/**
 * 商户管理员查询参数
 */
export interface QueryMerchantAdminParams {
	/** 管理员名称 */
	name?: string;
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 物业名称 */
	storeName?: string;
	/** 电话 */
	tel?: string;
}

/**
 * 商户管理员信息传输模型
 */
export interface MerchantAdminDTO {
	/** 创建时间 */
	createTime?: string;
	/** 管理员ID */
	userId?: string;
	/** 管理员名称 */
	name?: string;
	/** 物业名称 */
	storeName?: string;
	/** 电话 */
	tel?: string;
	/** 状态 */
	status?: string;
	/** 状态文本 */
	statusText?: string;
}

/**
 * 商户信息查询参数
 */
export interface QueryMerchantParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 商户名称 */
	storeName?: string;
	/** 商户类型 */
	storeType?: string;
	/** 电话 */
	tel?: string;
}

/**
 * 商户信息传输模型
 */
export interface MerchantDTO {
	/** 商户地址 */
	address?: string;
	/** 企业法人 */
	corporate?: string;
	/** 成立日期 */
	establishDate?: string;
	/** 商户ID */
	storeId?: string;
	/** 商户名称 */
	storeName?: string;
	/** 商户类型 */
	storeType?: string;
	/** 电话 */
	tel?: string;
	/** 状态 */
	state?: string;
	/** 状态文本 */
	stateText?: string;
	/** 创建时间 */
	createTime?: string;
}

// ==================== 接口函数 ====================

/**
 * 限制登录接口
 * @description 修改商户管理员的登录状态
 */
export function modifyMerchantAdminStatus<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, ModifyMerchantAdminStatusParams>({
		url: "/j3-merchant/merchant-admin/modify-status",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "PUT",
			data: {
				status: "",
				userId: "",
			},
		},
		options,
	});
}

/**
 * 获取商户管理员列表接口
 * @description 获取商户管理员列表（条件+分页）
 */
export function queryMerchantAdminList<T = PageDTO<MerchantAdminDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryMerchantAdminParams>({
		url: "/j3-merchant/merchant-admin/query",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				name: "",
				pageIndex: 1,
				pageSize: 10,
				storeName: "",
				tel: "",
			},
		},
		options,
	});
}

/**
 * 获取商户列表接口
 * @description 获取商户列表（条件+分页）
 */
export function queryMerchantList<T = PageDTO<MerchantDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryMerchantParams>({
		url: "/j3-merchant/merchant-message/query",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				storeName: "",
				storeType: "",
				tel: "",
			},
		},
		options,
	});
}
