import { useRequest } from "@/composables/use-request";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";
import type { JsonVO } from "@/composables/use-request/useRequestIn01s/types/JsonVO";

/**
 * 报修统计数据项
 */
export interface QueryRepairStatisticsDTO {
  /** 公共区总数量 */
  public_count: number;
  /** 非公共区总数量 */
  private_count: number;
  /** 已派单数 */
  assigned_count: number;
  /** 回访数 */
  revisit_count: number;
  /** 未回访数 */
  unrevisit_count: number;
  /** 公共区未完成 */
  public_incomplete: number;
  /** 非公共区未完成 */
  private_incomplete: number;
  /** 维修应收 */
  repair_pay: number;
  /** 维修实收 */
  repair_payed: number;
  /** 非公区完成平均值 */
  private_incomplete_average: number;
  /** 公区完成平均值 */
  public_incomplete_average: number;
}

/**
 * 报修统计查询参数
 */
export interface QueryRepairStatisticsParams {
  /** 小区id */
  community_id: string;
  /** 开始时间 */
  start_time?: string;
  /** 结束时间 */
  end_time?: string;
}

/**
 * 获取报修统计列表
 * @param params 查询参数
 * @param options 请求配置选项
 * @returns 报修统计数据
 */
export function queryRepairStatistics(
  params: QueryRepairStatisticsParams,
  options?: UseAxiosOptionsJsonVO<JsonVO<QueryRepairStatisticsDTO>>
) {
  return useRequest<"params", JsonVO<QueryRepairStatisticsDTO>, QueryRepairStatisticsParams>({
    url: "/c7-repomanage/repair_report/query-repair-statistics",
    httpParamWay: "query",
    config: {
      method: "GET",
      params: {},
    },
    options,
  });
} 