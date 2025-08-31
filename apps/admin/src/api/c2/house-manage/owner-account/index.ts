import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 业主账户明细
 */
export interface OwnerAccountDetailItem {
	/** 明细编号 */
	detail_id?: string;
	/** 交易编号（交易单号） */
	order_id?: string;
	/** 业主名称 */
	owner_name?: string;
	/** 明细类型 */
	detail_type?: string;
	/** 账户金额 */
	amount?: number;
	/** 创建时间（交易时间） */
	create_time?: string;
	/** 备注（说明） */
	remark?: string;
	/** 明细类型中文映射 */
	detail_type_text?: string;
}

/**
 * 获取业主账户明细列表参数
 */
export interface QueryOwnerAccountDetailParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 账户ID */
	acct_id: string;
}

/**
 * 业主账户列表项
 */
export interface OwnerAccountListItem {
	/** 账户编号 */
	acct_id?: string;
	/** 账户名称 */
	name?: string;
	/** 身份证号 */
	id_card?: string;
	/** 手机号 */
	link?: string;
	/** 账户类型 */
	acct_type?: string;
	/** 账户金额 */
	amount?: number;
	/** 创建时间 */
	create_time?: string;
	/** 账户类型中文映射 */
	acct_type_text?: string;
}

/**
 * 获取业主账户列表参数
 */
export interface QueryOwnerAccountListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 小区ID */
	community_id: string;
	/** 账户名称 */
	name?: string;
	/** 身份证号 */
	id_card?: string;
	/** 手机号 */
	link?: string;
}

/**
 * 预存参数
 */
export interface AddOwnerDetailParams {
	/** 业主手机号 */
	link: string;
	/** 业主名称 */
	owner_name: string;
	/** 预存金额 */
	receivable_amount: number;
	/** 支付方式 */
	prime_rate: string;
	/** 账户类型 */
	obj_type: string;
	/** 备注（说明） */
	remark?: string;
	/** 小区ID */
	community_id: string;
}

/**
 * 撤销预存参数
 */
export interface UndoOwnerDetailParams {
	/** 明细编号 */
	pre_detail_id: string;
	/** 备注（说明） */
	remark: string;
}

/**
 * 根据手机号获取业主名称参数
 */
export interface GetOwnerNameByPhoneParams {
	/** 业主手机号 */
	link?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取业主账户明细列表（条件+分页）
 * @description 根据账户ID查询该账户的收支明细
 */
export function queryOwnerAccountDetailList<T = PageDTO<OwnerAccountDetailItem>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryOwnerAccountDetailParams>({
		url: "/comm-c2-owneraccount/owner-detail/query-all",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				acct_id: "",
			},
		},
		options,
	});
}

/**
 * 获取业主账户列表（分页+查询）
 * @description 获取业主账户分页列表
 */
export function queryOwnerAccountList<T = PageDTO<OwnerAccountListItem>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryOwnerAccountListParams>({
		url: "/comm-c2-owneraccount/owner-list-queryAll",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				community_id: "",
			},
		},
		options,
	});
}

/**
 * 预存
 * @description 业主账户预存
 */
export function addOwnerDetail<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, AddOwnerDetailParams>({
		url: "/comm-c2-owneraccount/owner-detail/add",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				link: "",
				owner_name: "",
				receivable_amount: 0,
				prime_rate: "",
				obj_type: "",
				community_id: "",
			},
		},
		options,
	});
}

/**
 * 撤销预存
 * @description 撤销业主账户预存
 */
export function undoOwnerDetail<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, UndoOwnerDetailParams>({
		url: "/comm-c2-owneraccount/owner-detail/undo",
		httpParamWay: "body",
		upType: UpType.json,
		config: {
			method: "POST",
			data: {
				pre_detail_id: "",
				remark: "",
			},
		},
		options,
	});
}

/**
 * 根据手机号获取业主名称
 * @description 预存-根据手机号获取业主名称
 */
export function getOwnerNameByPhone<T = PageDTO<{ owner_name: string }>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, GetOwnerNameByPhoneParams>({
		url: "/comm-c2-owneraccount/owner-detail/query-account-name",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {},
		},
		options,
	});
}
