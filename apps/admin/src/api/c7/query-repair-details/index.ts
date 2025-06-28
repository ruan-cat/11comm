import { useRequest } from "@/composables/use-request";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";
import type { PageDTO } from "@/composables/use-request/useRequestIn01s/types/PageDTO";
import type { JsonVO } from "@/composables/use-request/useRequestIn01s/types/JsonVO";

/**
 * 报修明细数据项
 */
export interface RepairDetailsDTO {
  /** 工单号 */
  workOrderId: string;
  /** 报修类型 */
  repairType: string;
  /** 报修人 */
  requesterName: string;
  /** 报修位置 */
  requestLocation: string;
  /** 报修电话 */
  requesterTelephone: string;
  /** 工单状态 */
  workOrderStatus: string;
  /** 报修时间 */
  requestTime: string;
  /** 上一处理人 */
  previousProcessor: string;
  /** 当前处理人 */
  currentProcessor: string;
  /** 派单时间 */
  dispatchingTime: string;
  /** 处理时间 */
  handleTime: string;
  /** 处理人状态 */
  processorStatus: string;
  /** 报修内容 */
  requestContent: string;
}

/**
 * 报修明细分页数据
 */
export type RepairDetailsListPageDTO = PageDTO<RepairDetailsDTO>;

/**
 * 报修明细查询参数
 */
export interface QueryRepairDetailsParams {
  /** 查询页码 */
  pageIndex: number;
  /** 查询条数 */
  pageSize: number;
  /** 小区id */
  communityId: string;
  /** 开始时间 */
  start_time?: string;
  /** 结束时间 */
  end_time?: string;
}

/**
 * 获取报修明细列表
 * @param params 查询参数
 * @param options 请求配置选项
 * @returns 报修明细分页数据
 */
export function queryRepairDetails(
  params: QueryRepairDetailsParams,
  options?: UseAxiosOptionsJsonVO<JsonVO<RepairDetailsListPageDTO>>
) {
  return useRequest<"params", JsonVO<RepairDetailsListPageDTO>, QueryRepairDetailsParams>({
    url: "/c7-repomanage/query-repair-details",
    httpParamWay: "query",
    config: {
      method: "GET",
      params: {},
    },
    options,
  });
} 