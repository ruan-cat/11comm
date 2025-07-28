import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 费用项信息
 */
export interface ChargeItemDTO {
	/** 主键ID */
	config_id: string;
	/** 费用类型 */
	fee_type_cd: string;
	/** 收费项目 */
	chargeItem: string;
}

/**
 * 费用项列表
 */
export interface ChargeItemListDTO {
	/** 费用项列表 */
	chargeItemList: ChargeItemDTO[];
}

/**
 * 获取费用项名称列表查询参数
 */
export interface QueryChargeItemListParams {
	/** 小区ID */
	community_id: string;
	/** 费用类型 */
	feeType: string;
}

/**
 * 费用项详细信息
 */
export interface PayFeeDTO {
	/** 主键ID */
	config_id: string;
	/** 费用类型 */
	fee_type_cd: string;
	/** 收费项目 */
	fee_name: string;
	/** 费用标识 (一次性/周期性费用) */
	fee_flag: string;
	/** 付费类型 (预付费) */
	payment_cd: string;
	/** 缴费周期 */
	payment_cycle: number;
	/** 有效期 */
	validDate: string;
	/** 计算公式 */
	computing_formula: string;
	/** 计费单价 */
	square_price: string;
	/** 固定费用 */
	additional_amount: string;
	/** 是否支持账户抵扣 */
	deduct_from: string;
}

/**
 * 获取费用项列表查询参数
 */
export interface QueryFeeItemListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 小区ID */
	community_id?: string;
	/** 费用类型 */
	fee_type_cd?: string;
	/** 费用ID */
	feeId?: string;
	/** 收费项目 */
	chargeItem?: string;
	/** 费用标识 */
	fee_flag?: string;
	/** 付费类型 */
	payment_cd?: string;
	/** 是否支持账户抵扣 */
	deduct_from?: string;
}

/**
 * 费用项修改记录
 */
export interface FeeItemDTO {
	/** 费用类型 */
	fee_type_cd: string;
	/** 费用标识 */
	fee_flag: string;
	/** 缴费周期 */
	payment_cycle: string;
	/** 收费项目 */
	fee_name: string;
	/** 付费类型 */
	payment_cd: string;
	/** 预付费周期 */
	prepayment_period: string;
	/** 开始时间 */
	start_time: string;
	/** 结束时间 */
	end_time: string;
	/** 单位 */
	units: string;
	/** 是否支持账户抵扣 */
	deduct_from: string;
	/** 手机缴费 */
	pay_online: string;
	/** 进位方式 */
	scale: string;
	/** 保留小数位 */
	decimal_place: number;
	/** 计算公式 */
	computing_formula: string;
	/** 计费单价 */
	square_price: string;
	/** 固定费用 */
	additional_amount: string;
	/** 社区ID */
	community_id: string;
	/** 配置ID */
	config_id: string;
	/** 操作时间 */
	operation_Time: string;
	/** 操作人姓名 */
	user_name: string;
}

/**
 * 获取费用项修改记录查询参数
 */
export interface QueryFeeItemLogParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 配置ID */
	config_id: string;
}

/**
 * 添加费用项参数
 */
export interface FeeItemAddDTO {
	/** 费用类型 */
	fee_type_cd: string;
	/** 费用标识 */
	fee_flag: string;
	/** 缴费周期 */
	payment_cycle: string;
	/** 收费项目 */
	fee_name: string;
	/** 付费类型 */
	payment_cd: string;
	/** 预付费周期 */
	prepayment_period: string;
	/** 开始时间 */
	start_time: string;
	/** 结束时间 */
	end_time: string;
	/** 单位 */
	units: string;
	/** 是否支持账户抵扣 */
	deduct_from: string;
	/** 手机缴费 */
	pay_online: string;
	/** 进位方式 */
	scale: string;
	/** 保留小数位 */
	decimal_place: number;
	/** 计算公式 */
	computing_formula: string;
	/** 计费单价 */
	square_price: string;
	/** 固定费用 */
	additional_amount: string;
	/** 社区ID */
	community_id: string;
}

/**
 * 修改费用项参数
 */
export interface FeeItemModifyDTO extends FeeItemAddDTO {
	/** 配置ID */
	config_id: string;
}

/**
 * 删除费用项参数
 */
export interface FeeItemDeleteDTO {
	/** 配置ID */
	config_id: string;
}

/**
 * 折扣信息
 */
export interface FeeMgrDTO {
	/** 折扣类型 */
	discount_type: string;
	/** 打折名称 */
	discount_name: string;
	/** 缴费起始时间 */
	start_time: string;
	/** 缴费结束时间 */
	end_time: string;
	/** 折扣终止时间 */
	discount_end_time: string;
	/** 打折id */
	discount_id: string;
}

/**
 * 获取折扣信息查询参数
 */
export interface QueryDiscountListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 打折名称 */
	discount_name?: string;
	/** 折扣规则 */
	discount_rule?: string;
	/** 折扣类型 */
	discount_type?: string;
	/** 缴费起始时间 */
	start_time?: string;
	/** 缴费结束时间 */
	end_time?: string;
	/** 折扣终止时间 */
	discount_end_time?: string;
}

/**
 * 添加折扣参数
 */
export interface FeeMgrAddDTO {
	/** 折扣类型 */
	discount_type: string;
	/** 打折名称 */
	discount_name: string;
	/** 缴费起始时间 */
	start_time: string;
	/** 缴费结束时间 */
	end_time: string;
	/** 折扣终止时间 */
	discount_end_time: string;
}

/**
 * 删除折扣参数
 */
export interface FeeMgrDeleteDTO {
	/** 打折id */
	discount_id: string;
}

/**
 * 费用项基础信息查询参数
 */
export interface FeeMgrGetDTO {
	/** 编号 */
	fee_id: string;
	/** 费用类型 */
	fee_type: string;
	/** 收费项目 */
	fee_project: string;
	/** 费用标识 */
	fee_flag: string;
	/** 催缴类型 */
	urge_type: string;
	/** 付费类型 */
	pay_type: string;
	/** 付费周期 */
	pay_cycle: string;
	/** 有效期 */
	valid_time: string;
	/** 公式 */
	pay_formula: string;
	/** 计费单价 */
	pay_price: string;
	/** 计费附加 */
	pay_extra: string;
	/** 账户抵扣 */
	account_deduction: string;
}

/**
 * 费用项基础信息返回类型
 */
export interface FeeItemInfoDTO {
	/** 编号 */
	fee_id?: string;
	/** 费用类型 */
	fee_type?: string;
	/** 收费项目 */
	fee_project?: string;
	/** 费用标识 */
	fee_flag?: string;
	/** 催缴类型 */
	urge_type?: string;
	/** 付费类型 */
	pay_type?: string;
	/** 付费周期 */
	pay_cycle?: string;
	/** 有效期 */
	valid_time?: string;
	/** 公式 */
	pay_formula?: string;
	/** 计费单价 */
	pay_price?: string;
	/** 计费附加 */
	pay_extra?: string;
	/** 账户抵扣 */
	account_deduction?: string;
}

// ==================== 接口函数 ====================

/**
 * 获取费用项名称列表
 * @description 根据小区ID和费用类型获取费用项名称列表
 */
export function queryChargeItemList<T = ChargeItemListDTO>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryChargeItemListParams>({
		url: "/c3-expensesetting/query-feeitemname",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				community_id: "",
				feeType: "",
			},
		},
		options,
	});
}

/**
 * 获取费用项列表
 * @description 分页获取费用项列表，支持条件查询
 */
export function queryFeeItemList<T = PageDTO<PayFeeDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryFeeItemListParams>({
		url: "/c3-expensesetting/query-feeitem-page",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 获取费用项修改记录
 * @description 分页获取费用项修改记录，支持条件查询
 */
export function queryFeeItemLog<T = PageDTO<FeeItemDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryFeeItemLogParams>({
		url: "/c3-expensesetting/query-feemodifyrecord-page",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				config_id: "",
			},
		},
		options,
	});
}

/**
 * 添加费用项
 * @description 添加新的费用项信息
 */
export function addFeeItem<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, FeeItemAddDTO>({
		url: "/c3-expensesetting/insert-fee",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				fee_type_cd: "",
				fee_flag: "",
				payment_cycle: "",
				fee_name: "",
				payment_cd: "",
				prepayment_period: "",
				start_time: "",
				end_time: "",
				units: "",
				deduct_from: "",
				pay_online: "",
				scale: "",
				decimal_place: 2,
				computing_formula: "",
				square_price: "",
				additional_amount: "",
				community_id: "",
			},
		},
		options,
	});
}

/**
 * 修改费用项
 * @description 修改现有费用项信息
 */
export function modifyFeeItem<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, FeeItemModifyDTO>({
		url: "/c3-expensesetting/modify-fee",
		httpParamWay: "body",
		config: {
			method: "PUT",
			data: {
				fee_type_cd: "",
				fee_flag: "",
				payment_cycle: "",
				fee_name: "",
				payment_cd: "",
				prepayment_period: "",
				start_time: "",
				end_time: "",
				units: "",
				deduct_from: "",
				pay_online: "",
				scale: "",
				decimal_place: 2,
				computing_formula: "",
				square_price: "",
				additional_amount: "",
				community_id: "",
				config_id: "",
			},
		},
		options,
	});
}

/**
 * 删除费用项
 * @description 删除指定的费用项
 */
export function deleteFeeItem<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, FeeItemDeleteDTO>({
		url: "/c3-expensesetting/delete-fee",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: {
				config_id: "",
			},
		},
		options,
	});
}

/**
 * 获取折扣信息
 * @description 分页获取折扣信息，支持条件查询
 */
export function queryDiscountList<T = PageDTO<FeeMgrDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryDiscountListParams>({
		url: "/c3-expensesetting/query-discount-page",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
			},
		},
		options,
	});
}

/**
 * 添加折扣
 * @description 添加新的折扣信息
 */
export function addDiscount<T = FeeMgrDTO>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, FeeMgrAddDTO>({
		url: "/c3-expensesetting/insert-discount",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				discount_type: "",
				discount_name: "",
				start_time: "",
				end_time: "",
				discount_end_time: "",
			},
		},
		options,
	});
}

/**
 * 删除折扣
 * @description 删除指定的折扣信息
 */
export function deleteDiscount<T = FeeMgrDTO>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, FeeMgrDeleteDTO>({
		url: "/c3-expensesetting/delete-discount",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: {
				discount_id: "",
			},
		},
		options,
	});
}

/**
 * 获取费用项基础信息
 * @description 获取费用项的基础信息
 */
export function getFeeItemInfo<T = FeeItemInfoDTO>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, FeeMgrGetDTO>({
		url: "/c3-expensesetting/query-feeiteminfo",
		httpParamWay: "body",
		config: {
			method: "POST",
			data: {
				fee_id: "",
				fee_type: "",
				fee_project: "",
				fee_flag: "",
				urge_type: "",
				pay_type: "",
				pay_cycle: "",
				valid_time: "",
				pay_formula: "",
				pay_price: "",
				pay_extra: "",
				account_deduction: "",
			},
		},
		options,
	});
}
