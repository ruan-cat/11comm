import { useRequest } from "@/composables/use-request";

// ==================== 类型定义 ====================

/**
 * 预约订单信息
 */
export interface OrderDTO {
	/** 订单编号 */
	cspId?: string;
	/** 场馆名 */
	venueName?: string;
	/** 场地名 */
	spaceName?: string;
	/** 预约人名字 */
	personName?: string;
	/** 预约人电话 */
	personTel?: string;
	/** 预约日期 */
	appointmentTime?: string;
	/** 预约时间段 */
	times?: string;
	/** 应收金额 */
	receivableAmount?: string;
	/** 实收金额 */
	receivedAmount?: string;
	/** 支付方式：1为现金 2为微信 3为支付宝 */
	payWay?: string;
	/** 支付方式名称 */
	payWayName?: string;
	/** 场馆场地预约订单状态：S为预约成功 F为预约失败 W为待审核 F为待支付 CL为已取消 */
	state?: string;
	/** 状态名称 */
	stateName?: string;
	/** 创建时间 */
	createTime?: string;
	/** 备注 */
	remark?: string;
}

/**
 * 获取预约订单列表查询参数
 */
export interface QueryOrderListParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 社区id */
	communityId: string;
	/** 场地id */
	spaceId?: string;
	/** 场馆场地预约订单状态：S为预约成功 F为预约失败 W为待审核 F为待支付 CL为已取消 */
	state?: string;
	/** 预约人名字 */
	personName?: string;
	/** 预约人电话 */
	personTel?: string;
	/** 预约日期 */
	appointmentTime?: string;
}

/**
 * 订单ID参数
 */
export interface OrderIdDTO {
	/** 订单编号 */
	cspId: string;
}

// ==================== 接口函数 ====================

/**
 * 获取预约订单列表（条件+分页）
 * @description 分页获取场地预约订单列表，支持多条件查询
 */
export function queryOrderList<T = PageDTO<OrderDTO>>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, QueryOrderListParams>({
		url: "/c3-paceapp/query-order-page",
		httpParamWay: "query",
		config: {
			method: "GET",
			params: {
				pageIndex: 1,
				pageSize: 10,
				communityId: "",
			},
		},
		options,
	});
}

/**
 * 取消预约
 * @description 根据订单编号取消预约订单
 */
export function removeOrder<T = string>(options: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsBodyKey, T, OrderIdDTO>({
		url: "/c3-paceapp/remove-order",
		httpParamWay: "body",
		config: {
			method: "DELETE",
			data: {
				cspId: "",
			},
		},
		options,
	});
}
