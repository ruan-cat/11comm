import { useRequest } from "@/composables/use-request";
import type { ParamsQueryKey } from "@/composables/use-request/useRequestIn01s/main";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";
import type { PageDTO } from "@/composables/use-request/useRequestIn01s/types/PageDTO";
import type { JsonVO } from "@/composables/use-request/useRequestIn01s/types/JsonVO";

/**
 * 出入类统计数据
 */
export interface AccessStatDTO {
	/** 进场车辆数 */
	vehicleEntryCount: number;
	/** 出场车辆数 */
	vehicleExitCount: number;
	/** 进场人员数 */
	personnelEntryCount: number;
	/** 人脸同步数 */
	faceSyncCount: number;
	/** 采购入库数 */
	purchaseInboundCount: number;
	/** 领用出库数 */
	requisitionOutboundCount: number;
	/** 采购入库金额 */
	purchaseInboundAmount: number;
	/** 已完成巡检单 */
	completedInspectionCount: number;
	/** 调拨数量 */
	allocationCount: number;
	/** 房屋装修数 */
	houseDecorationCount: number;
	/** 物品放行数 */
	itemReleaseCount: number;
	/** 房屋交付数 */
	houseDeliveryCount: number;
	/** 房屋退还数 */
	houseReturnCount: number;
	/** 业主绑定数 */
	ownerBindingCount: number;
	/** 缺勤数 */
	absenteeismCount: number;
}

/**
 * 出入类统计查询参数
 */
export interface AccessStatQueryParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 开始日期 */
	startDate?: string;
	/** 结束日期 */
	endDate?: string;
	/** 社区ID */
	communityId: string;
	/** 社区名称 */
	communityName?: string;
}

/**
 * 出入类统计查询接口
 * @description 根据查询条件获取出入类统计数据，支持分页查询
 */
export function datastatQueryAccess<T = PageDTO<AccessStatDTO>>(options?: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, AccessStatQueryParams>({
		url: "/c6-repomanage/datastat/accessQuery",
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
 * 费用统计查询参数
 */
export interface ExpenseStatQueryParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 开始日期 */
	startDate?: string;
	/** 结束日期 */
	endDate?: string;
	/** 社区ID */
	communityId: string;
	/** 费用类型 */
	feeType?: string;
}

/**
 * 费用统计数据
 */
export interface ExpenseStatDTO {
	/** 应收金额 */
	receivableAmount: number;
	/** 实收金额 */
	receivedAmount: number;
	/** 欠费金额 */
	oweAmount: number;
	/** 费用类型 */
	feeType: string;
	/** 费用类型名称 */
	feeTypeName: string;
}

/**
 * 费用统计查询接口
 * @description 根据查询条件获取费用统计数据，支持分页查询
 */
export function datastatQueryExpense<T = PageDTO<ExpenseStatDTO>>(options?: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ExpenseStatQueryParams>({
		url: "/c6-repomanage/datastat/expenseQuery",
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
 * 工单统计查询参数
 */
export interface WorkOrderStatQueryParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 开始日期 */
	startDate?: string;
	/** 结束日期 */
	endDate?: string;
	/** 社区ID */
	communityId: string;
	/** 工单类型 */
	workOrderType?: string;
}

/**
 * 工单统计数据
 */
export interface WorkOrderStatDTO {
	/** 工单总数 */
	totalCount: number;
	/** 待处理数 */
	pendingCount: number;
	/** 处理中数 */
	processingCount: number;
	/** 已完成数 */
	completedCount: number;
	/** 工单类型 */
	workOrderType: string;
	/** 工单类型名称 */
	workOrderTypeName: string;
}

/**
 * 工单统计查询接口
 * @description 根据查询条件获取工单统计数据，支持分页查询
 */
export function datastatQueryWorkOrder<T = PageDTO<WorkOrderStatDTO>>(options?: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, WorkOrderStatQueryParams>({
		url: "/c6-repomanage/datastat/workOrderQuery",
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
 * 其他统计查询参数
 */
export interface OtherStatQueryParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 开始日期 */
	startDate?: string;
	/** 结束日期 */
	endDate?: string;
	/** 社区ID */
	communityId: string;
}

/**
 * 其他统计数据
 */
export interface OtherStatDTO {
	/** 投诉建议数 */
	complaintCount: number;
	/** 公告数 */
	announcementCount: number;
	/** 活动数 */
	activityCount: number;
	/** 访客数 */
	visitorCount: number;
	/** 装修申请数 */
	decorationCount: number;
}

/**
 * 其他统计查询接口
 * @description 根据查询条件获取其他统计数据，支持分页查询
 */
export function datastatQueryOther<T = PageDTO<OtherStatDTO>>(options?: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, OtherStatQueryParams>({
		url: "/c6-repomanage/datastat/otherQuery",
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
 * 收据查询参数
 */
export interface ReceiptsQueryParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 开始日期 */
	startDate?: string;
	/** 结束日期 */
	endDate?: string;
	/** 社区ID */
	communityId: string;
	/** 收据编号 */
	receiptNo?: string;
	/** 业主姓名 */
	ownerName?: string;
	/** 业主手机号 */
	ownerPhone?: string;
}

/**
 * 收据数据
 */
export interface ReceiptsDTO {
	/** 收据编号 */
	receiptNo: string;
	/** 收据金额 */
	receiptAmount: number;
	/** 收据状态 */
	receiptStatus: string;
	/** 收据状态名称 */
	receiptStatusName: string;
	/** 收据时间 */
	receiptTime: string;
	/** 业主姓名 */
	ownerName: string;
	/** 业主手机号 */
	ownerPhone: string;
	/** 房屋编号 */
	roomNo: string;
}

/**
 * 收据查询接口
 * @description 根据查询条件获取收据数据，支持分页查询
 */
export function datastatQueryReceipts<T = PageDTO<ReceiptsDTO>>(options?: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ReceiptsQueryParams>({
		url: "/c6-repomanage/datastat/receiptsQuery",
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
 * 收据明细查询参数
 */
export interface ReceiptsDetailQueryParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 开始日期 */
	startDate?: string;
	/** 结束日期 */
	endDate?: string;
	/** 社区ID */
	communityId: string;
	/** 收据编号 */
	receiptNo?: string;
	/** 费用类型 */
	feeType?: string;
	/** 业主姓名 */
	ownerName?: string;
	/** 业主手机号 */
	ownerPhone?: string;
}

/**
 * 收据明细数据
 */
export interface ReceiptsDetailDTO {
	/** 收据编号 */
	receiptNo: string;
	/** 费用类型 */
	feeType: string;
	/** 费用类型名称 */
	feeTypeName: string;
	/** 费用金额 */
	feeAmount: number;
	/** 收据时间 */
	receiptTime: string;
	/** 业主姓名 */
	ownerName: string;
	/** 业主手机号 */
	ownerPhone: string;
	/** 房屋编号 */
	roomNo: string;
	/** 费用周期 */
	feePeriod: string;
}

/**
 * 收据明细查询接口
 * @description 根据查询条件获取收据明细数据，支持分页查询
 */
export function datastatQueryReceiptsDetail<T = PageDTO<ReceiptsDetailDTO>>(options?: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, ReceiptsDetailQueryParams>({
		url: "/c6-repomanage/datastat/receiptsDetailQuery",
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
 * 工单查询参数
 */
export interface WorkOrderQueryParams {
	/** 查询页码 */
	pageIndex: number;
	/** 查询条数 */
	pageSize: number;
	/** 开始日期 */
	startDate?: string;
	/** 结束日期 */
	endDate?: string;
	/** 社区ID */
	communityId: string;
	/** 工单类型 */
	workOrderType?: string;
	/** 工单状态 */
	workOrderStatus?: string;
	/** 业主姓名 */
	ownerName?: string;
	/** 业主手机号 */
	ownerPhone?: string;
}

/**
 * 工单数据
 */
export interface WorkOrderDTO {
	/** 工单编号 */
	workOrderNo: string;
	/** 工单类型 */
	workOrderType: string;
	/** 工单类型名称 */
	workOrderTypeName: string;
	/** 工单状态 */
	workOrderStatus: string;
	/** 工单状态名称 */
	workOrderStatusName: string;
	/** 工单时间 */
	workOrderTime: string;
	/** 业主姓名 */
	ownerName: string;
	/** 业主手机号 */
	ownerPhone: string;
	/** 房屋编号 */
	roomNo: string;
	/** 工单内容 */
	workOrderContent: string;
}

/**
 * 工单查询接口
 * @description 根据查询条件获取工单数据，支持分页查询
 */
export function datastatQueryWorkOrderDetail<T = PageDTO<WorkOrderDTO>>(options?: UseAxiosOptionsJsonVO<T>) {
	return useRequest<ParamsQueryKey, T, WorkOrderQueryParams>({
		url: "/c6-repomanage/datastat/workOrderQuery",
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
