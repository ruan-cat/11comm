import { useRequest } from "@/composables/use-request";

/**
 * 业主账户明细
 */
export interface OwnerDetailGetDTO {
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
 * 获取业主账户明细（条件+分页）
 * @description
 * 获取业主账户明细分页列表
 */
export function queryAllOwnerAccountDetail<T = PageDTO<OwnerDetailGetDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/comm-c2-owneraccount/owner-detail/query-all",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			data: {
				pageIndex: 1,
				pageSize: 10,
				acct_id: "",
			},
		},
	});
}

/**
 * 业主账户列表
 */
export interface OwnerListDTO {
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
 * 获取业主账户列表（分页+查询）
 * @description
 * 获取业主账户分页列表
 */
export function queryAllOwnerAccountList<T = PageDTO<OwnerListDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T>({
		url: "/comm-c2-owneraccount/owner-list-queryAll",
		options,
		httpParamWay: "query",
		config: {
			method: "get",
			data: {
				pageIndex: 1,
				pageSize: 10,
				name: "",
				id_card: "",
				link: "",
				community_id: "",
			},
		},
	});
}

/**
 * 预存参数
 */
export interface OwnerDetailAddDTO {
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
 * 预存
 * @description
 * 业主账户预存
 */
export function addOwnerDetail<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, OwnerDetailAddDTO>({
		url: "/comm-c2-owneraccount/owner-detail/add",
		options,
		httpParamWay: "body",
		config: {
			method: "post",
			data: {
				link: "",
				owner_name: "",
				receivable_amount: 0,
				prime_rate: "",
				obj_type: "",
				remark: "",
				community_id: "",
			},
		},
	});
}

/**
 * 撤销预存参数
 */
export interface OwnerDetailUndoDTO {
	/** 明细编号 */
	pre_detail_id: string;
	/** 备注（说明） */
	remark: string;
}

/**
 * 撤销预存
 * @description
 * 撤销业主账户预存
 */
export function undoOwnerDetail<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, OwnerDetailUndoDTO>({
		url: "/comm-c2-owneraccount/owner-detail/undo",
		options,
		httpParamWay: "body",
		config: {
			method: "post",
			data: {
				pre_detail_id: "",
				remark: "",
			},
		},
	});
}
