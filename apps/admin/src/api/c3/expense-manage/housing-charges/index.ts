import { useRequest } from "@/composables/use-request";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";
import type { ParamsQueryKey } from "@/composables/use-request/useRequestIn01s/main";
import type { AxiosRequestConfig } from "axios";

/**
 * 创建房屋费用参数
 */
interface AddHouseFeeDTO {
	/** 房屋号 */
	house_id: string;
	/** 费用类型 */
	fee_type: string;
	/** 收费项目 */
	charge_project: string;
	/** 开始时间 */
	start_time: string;
	/** 结束时间 */
	end_time: string;
	/** 金额 */
	amount: number;
	/** 配置id */
	config_id: string;
}

/**
 * 创建房屋费用
 * @description
 * 创建新的房屋费用信息
 */
export function addHouseFee<T = number>(options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig }) {
	return useRequest<ParamsQueryKey, T, AddHouseFeeDTO>({
		url: "/c3-housefeemgr/add-housefee",
		options,
		httpParamWay: "query",
		config: {
			method: "POST",
			data: {
				house_id: "",
				fee_type: "",
				charge_project: "",
				start_time: "",
				end_time: "",
				amount: 0,
				config_id: "",
			},
			...options.config,
		},
	});
}

/**
 * 变更房屋费用参数
 */
interface ModifyHouseFeeDTO {
	/** 费用id */
	fee_id: string;
	/** 建账时间 */
	create_time: string;
	/** 应收开始时间 */
	start_time: string;
	/** 应收结束时间 */
	end_time: string;
}

/**
 * 变更房屋费用
 * @description
 * 修改现有房屋费用信息
 */
export function modifyHouseFee<T = number>(options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig }) {
	return useRequest<ParamsQueryKey, T, ModifyHouseFeeDTO>({
		url: "/c3-housefeemgr/modify-housefee",
		options,
		httpParamWay: "query",
		config: {
			method: "POST",
			data: {
				fee_id: "",
				create_time: "",
				start_time: "",
				end_time: "",
			},
			...options.config,
		},
	});
}

/**
 * 取消房屋费用参数
 */
interface HouseFeeIdDTO {
	/** 费用id */
	fee_id: string;
}

/**
 * 取消房屋费用
 * @description
 * 删除指定的房屋费用信息
 */
export function deleteHouseFee<T = number>(options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig }) {
	return useRequest<ParamsQueryKey, T, HouseFeeIdDTO>({
		url: "/c3-housefeemgr/delete-housefee",
		options,
		httpParamWay: "query",
		config: {
			method: "DELETE",
			data: {
				fee_id: "",
			},
			...options.config,
		},
	});
}

/**
 * 缴纳房屋费用参数
 */
interface PayFeeDTO {
	/** 是否选择账户 */
	flag: boolean;
	/** 账户类型 */
	account_type: string;
	/** 账户名 */
	account_name: string;
	/** 账户金额 */
	account_amount: number;
	/** 费用id */
	fee_id: string;
	/** 缴费周期 */
	pay_fee_time: string;
	/** 缴费周期 */
	cycle: number;
	/** 实际缴费周期 */
	real_cycle: number;
	/** 收费开始时间 */
	pay_fee_start_time: string;
	/** 收费截至时间 */
	pay_fee_end_time: string;
	/** 缴费方式 */
	pay_fee_way: string;
	/** 实收款 */
	amount: number;
	/** 应缴金额 */
	amount_due: number;
	/** 应收款 */
	pay_amount: number;
	/** 备注 */
	remark: string;
	/** 社区id */
	community_id: string;
}

/**
 * 缴纳房屋费用
 * @description
 * 缴纳指定的房屋费用
 */
export function payHouseFee<T = number>(options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig }) {
	return useRequest<ParamsQueryKey, T, PayFeeDTO>({
		url: "/c3-housefeemgr/pay-fee",
		options,
		httpParamWay: "query",
		config: {
			method: "POST",
			data: {
				flag: false,
				account_type: "",
				account_name: "",
				account_amount: 0,
				fee_id: "",
				pay_fee_time: "",
				cycle: 0,
				real_cycle: 0,
				pay_fee_start_time: "",
				pay_fee_end_time: "",
				pay_fee_way: "",
				amount: 0,
				amount_due: 0,
				pay_amount: 0,
				remark: "",
				community_id: "",
			},
			...options.config,
		},
	});
}

/**
 * 房屋费用信息
 */
interface HouseFeeMgrDTO {
	/** 费用id */
	fee_id: string;
	/** 费用项目 */
	fee_name: string;
	/** 费用标识 */
	fee_flag: string;
	/** 费用类型 */
	fee_type: string;
	/** 应收金额 */
	fee_pay: number;
	/** 建帐时间 */
	makeTime: string;
	/** 计费起始时间 */
	startTime: string;
	/** 计费结束时间 */
	endTime: string;
	/** 状态 */
	status: string;
	/** 业主id */
	owner_id: string;
	/** 业主名称 */
	ownerNameLike: string;
	/** 房屋号 */
	roomNum: string;
	/** 业主联系方式 */
	owner_phone: string;
	/** 费用批次 */
	fee_order: string;
}

/**
 * 获取房屋费用列表
 * @description
 * 分页获取房屋费用列表，支持条件查询
 */
export function queryHouseFeeList<T = PageDTO<HouseFeeMgrDTO>>(
	options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig },
) {
	return useRequest<ParamsQueryKey, T, PageDTO<HouseFeeMgrDTO>>({
		url: "/c3-housefeemgr/query-housefee-page",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {
				pageIndex: 1,
				pageSize: 10,
				communityId: "",
				roomNum: "",
				status: "",
				ownerNameLike: "",
			},
			...options.config,
		},
	});
}

/**
 * 获取房屋费用详情
 * @description
 * 根据费用id获取房屋费用详细信息
 */
export function getHouseFeeDetail<T = HouseFeeMgrDTO>(
	options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig },
) {
	return useRequest<ParamsQueryKey, T, HouseFeeMgrDTO>({
		url: "/c3-housefeemgr/query-housefeedetail",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {
				fee_id: "",
			},
			...options.config,
		},
	});
}

/**
 * 获取房屋费用项信息
 * @description
 * 根据房屋号获取费用项信息列表
 */
export function getHouseFeeItems<T = PageDTO<HouseFeeMgrDTO>>(
	options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig },
) {
	return useRequest<ParamsQueryKey, T, PageDTO<HouseFeeMgrDTO>>({
		url: "/c3-housefeemgr/query-housefeeitem",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {
				pageIndex: 1,
				pageSize: 10,
				communityId: "",
				roomNum: "",
			},
			...options.config,
		},
	});
}

/**
 * 缴纳记录信息
 */
interface RemitFeeDTO {
	/** 编号 */
	detail_id: string;
	/** 费用项 */
	receipt_id: string;
	/** 收费对象 */
	pay_obj: string;
	/** 周期(单位:月) */
	cycle: number;
	/** 应收/实收(单位:元) */
	receive_received: string;
	/** 缴费方式 */
	pay_path: string;
	/** 缴费起始段 */
	pay_period: string;
	/** 缴费时间 */
	pay_time: string;
	/** 收银员 */
	receive_id: string;
	/** 状态 */
	status_cd: string;
	/** 备注 */
	remark: string;
	/** 操作 */
	opt: string;
}

/**
 * 获取缴纳记录
 * @description
 * 分页获取缴纳记录列表，支持条件查询
 */
export function getPaymentRecords<T = PageDTO<RemitFeeDTO>>(
	options: UseAxiosOptionsJsonVO<T> & { config?: AxiosRequestConfig },
) {
	return useRequest<ParamsQueryKey, T, PageDTO<RemitFeeDTO>>({
		url: "/c3-housefeemgr/query-paymentrecord-page",
		options,
		httpParamWay: "query",
		config: {
			method: "GET",
			data: {
				pageIndex: 1,
				pageSize: 10,
				detail_id: "",
				receipt_id: "",
				pay_obj: "",
				cycle: 0,
				receive_received: "",
				pay_path: "",
				pay_period: "",
				pay_time: "",
				receive_id: "",
				status_cd: "",
				remark: "",
				opt: "",
			},
			...options.config,
		},
	});
}
