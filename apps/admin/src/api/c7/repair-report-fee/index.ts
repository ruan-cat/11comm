import { useRequest } from "@/composables/use-request";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";
import type { PageDTO } from "@/composables/use-request/useRequestIn01s/types/PageDTO";
import type { JsonVO } from "@/composables/use-request/useRequestIn01s/types/JsonVO";

/**
 * 未收情况数据项
 */
export interface AnalysisArrearsBasicDTO {
  /** 楼栋号 */
  buildingNum: string;
  /** 总未收金额 */
  totalArrear: number;
  /** 今年未收金额 */
  thisYearTotalArrear: number;
  /** 之前未收金额 */
  beforeTotalArrear: number;
}

/**
 * 未收情况分页数据
 */
export type AnalysisArrearsBasicListPageDTO = PageDTO<AnalysisArrearsBasicDTO>;

/**
 * 未收情况查询参数
 */
export interface QueryAnalysisArrearsBasicParams {
  /** 查询页码 */
  pageIndex: number;
  /** 查询条数 */
  pageSize: number;
  /** 收费类型编号 */
  feeType?: string;
  /** 楼栋号 */
  buildingNum?: string;
  /** 小区ID */
  communityId: string;
}

/**
 * 获取未收情况列表
 * @param params 查询参数
 * @param options 请求配置选项
 * @returns 未收情况分页数据
 */
export function queryAnalysisArrearsBasic(
  params: QueryAnalysisArrearsBasicParams,
  options?: UseAxiosOptionsJsonVO<JsonVO<AnalysisArrearsBasicListPageDTO>>
) {
  return useRequest<"params", JsonVO<AnalysisArrearsBasicListPageDTO>, QueryAnalysisArrearsBasicParams>({
    url: "/c7-repomanage/analysis-arrears/query-basic",
    httpParamWay: "query",
    config: {
      method: "GET",
      params: {},
    },
    options,
  });
} 