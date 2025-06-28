import { useRequest } from "@/composables/use-request";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";
import type { PageDTO } from "@/composables/use-request/useRequestIn01s/types/PageDTO";
import type { JsonVO } from "@/composables/use-request/useRequestIn01s/types/JsonVO";

/**
 * 业主缴费明细数据项
 */
export interface OwnerPaymentDetailDTO {
  /** 业主 */
  ownerName: string;
  /** 房屋编号 */
  roomName: string;
  /** 费用项目名称 */
  configName: string;
  /** 不同月份费用 */
  pfMonth: number[];
  /** 合计费用 */
  totalAmount: number;
  /** 应收费用 */
  receivableAmount: number;
  /** 预收费用 */
  receivedAmount: number;
}

/**
 * 业主缴费明细分页数据
 */
export type OwnerPaymentPageDTO = PageDTO<OwnerPaymentDetailDTO>;

/**
 * 业主缴费明细查询参数
 */
export interface QueryOwnerPaymentDetailParams {
  /** 查询页码 */
  pageIndex: number;
  /** 查询条数 */
  pageSize: number;
  /** 收费大类 */
  feeTypeCd?: string;
  /** 费用项目名称 */
  configName?: string;
  /** 房屋编号 */
  roomName?: string;
  /** 业主 */
  ownerName?: string;
  /** 年份 */
  pfYear?: string;
}

/**
 * 获取业主缴费明细列表
 * @param params 查询参数
 * @param options 请求配置选项
 * @returns 业主缴费明细分页数据
 */
export function queryOwnerPaymentDetail(
  params: QueryOwnerPaymentDetailParams,
  options?: UseAxiosOptionsJsonVO<JsonVO<OwnerPaymentPageDTO>>
) {
  return useRequest<"params", JsonVO<OwnerPaymentPageDTO>, QueryOwnerPaymentDetailParams>({
    url: "/c7-repomanage/owner-payment-detail",
    httpParamWay: "query",
    config: {
      method: "GET",
      params: {},
    },
    options,
  });
} 