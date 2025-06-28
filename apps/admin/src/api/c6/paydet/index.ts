import { useRequest } from "@/composables/use-request";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";

/**
 * 缴费明细数据项
 */
export interface PayDetDTO {
    /** 订单号 */
    orderNumber: string;
    /** 房号 / 业主 */
    houseNumberOrOwner: string;
    /** 费用类型 > 费用项 */
    expenseTypeAndItem: string;
    /** 费用状态 */
    expenseStatus: string;
    /** 支付方式 */
    paymentMethod: string;
    /** 缴费时间段 */
    paymentPeriod: string;
    /** 缴费时间 */
    paymentTime: string;
    /** 收银员 */
    cashier: string;
    /** 应缴 / 应收金额(元) */
    dueReceivableAmount: number;
    /** 实收金额(元) */
    actualReceivedAmount: number;
    /** 账户抵扣(元) */
    accountDeduction: number;
    /** 优惠/减免金额(元) */
    discountWaiverAmount: number;
    /** 赠送金额(元) */
    giftAmount: number;
    /** 滞纳金(元) */
    latePaymentFee: number;
    /** 面积(平方米) */
    area: number;
    /** 车位 */
    parkingSpace: string;
    /** 说明 */
    remark: string;
}

/**
 * 缴费明细查询参数
 */
export interface PayDetQueryParams {
    /** 查询页码 */
    pageIndex: number;
    /** 查询条数 */
    pageSize: number;
    /** 选择缴费开始时间 */
    paymentStartTime?: string;
    /** 选择缴费结束时间 */
    paymentEndTime?: string;
    /** 选择支付方式 */
    paymentMethod?: string;
    /** 选择费用状态 */
    expenseStatus?: string;
    /** 房屋编号或者车牌号 */
    houseOrPlateNumber?: string;
    /** 选择费用类型 */
    expenseType?: string;
    /** 选择收费项 */
    chargeItem?: string;
    /** 选择收费开始时间 */
    chargeStartTime?: string;
    /** 选择收费结束时间 */
    chargeEndTime?: string;
}

/**
 * 缴费明细查询接口
 * @description 查询缴费明细数据，支持多条件筛选和分页
 * @param params 查询参数
 * @param options useRequest 配置项
 * @returns useRequest 实例，data.value 为接口返回数据
 *
 * @example
 * // 查询所有缴费明细
 * const { execute, data } = queryPayDet({
 * 	pageIndex: 1,
 * 	pageSize: 10
 * });
 *
 * // 查询指定条件的缴费明细
 * const { execute, data } = queryPayDet({
 * 	pageIndex: 1,
 * 	pageSize: 10,
 * 	paymentStartTime: "2024-01-01",
 * 	paymentEndTime: "2024-01-31",
 * 	paymentMethod: "微信支付",
 * 	expenseStatus: "已缴费",
 * 	houseOrPlateNumber: "1001",
 * 	expenseType: "物业费",
 * 	chargeItem: "月度物业费",
 * 	chargeStartTime: "2024-01-01",
 * 	chargeEndTime: "2024-01-31"
 * });
 */
export function queryPayDet(
    params: PayDetQueryParams,
    options?: UseAxiosOptionsJsonVO<PayDetDTO[]>
) {
    return useRequest<"params", PayDetDTO[], PayDetQueryParams>({
        url: "/c6-repomanage/paydet/paydetQuery",
        httpParamWay: "query",
        config: {
            method: "GET",
            params,
        },
        options,
    });
} 