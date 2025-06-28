import { useRequest } from "@/composables/use-request";
import type { ParamsQueryKey } from "@/composables/use-request/useRequestIn01s/main";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";
import type { JsonVO } from "@/composables/use-request/useRequestIn01s/types/JsonVO";

/** 费用汇总表查询参数 */
export interface ExpeSumQueryParams {
  timeBegin?: string;
  timeEnd?: string;
  ownerName?: string;
  buildNumber?: string;
  ownerPhone?: string;
}

/** 费用汇总表返回数据 */
export interface ExpeSumDTO {
  totalRoomCount: number;
  feeRoomCount: number;
  oweRoomCount: number;
  hisOweFee: number;
  curOweFee: number;
  curReceivableFee: number;
  curReceivedFee: number;
  hisReceivedFee: number;
  preReceivedFee: number;
}

/** 楼栋收费率查询参数 */
export interface BuildingRateQueryParams {
  pageIndex: number;
  pageSize: number;
  buildingName?: string;
  startDate?: string;
  endDate?: string;
  ownerName?: string;
  ownerNumber?: string;
  communityIds?: string;
  feeTypes?: string;
  roomNum?: string;
}

/** 楼栋收费率数据项 */
export interface BuildingRateDTO {
  feeTypes: string;
  ownerName: string;
  ownerNumber: string;
  communityId: string;
  buildRate: number;
  roomNum: string;
  startDate: string;
  endDate: string;
  curReceivableFee: number;
  curReceivedFee: number;
  buildingName: string;
}

/** 楼栋收费率分页数据 */
export interface BuildingRatePageDTO {
  pageIndex: number;
  pageSize: number;
  total: number;
  pages: number;
  rows: BuildingRateDTO[];
}

/** 费用项目费率数据项 */
export interface FeeItemRateDTO {
  feeTypes: string;
  ownerName: string;
  ownerNumber: string;
  communityId: string;
  itemRate: number;
  roomNum: string;
  startDate: string;
  endDate: string;
  curReceivableFee: number;
  curReceivedFee: number;
  buildingName: string;
}

/** 费用项目费率分页数据 */
export interface FeeItemRatePageDTO {
  pageIndex: number;
  pageSize: number;
  total: number;
  pages: number;
  rows: FeeItemRateDTO[];
}

/** 费用项目费率查询参数 */
export interface FeeItemRateQueryParams {
  pageIndex: number;
  pageSize: number;
  buildingName?: string;
  startDate?: string;
  endDate?: string;
  ownerName?: string;
  ownerNumber?: string;
  communityIds?: string;
  feeTypes?: string;
  roomNum?: string;
}

/** 导出费用汇总表查询参数 */
export interface ExpesumExportQueryParams {
  timeBegin?: string;
  timeEnd?: string;
  ownerName?: string;
  buildNumber?: string;
  ownerPhone?: string;
}

/**
 * 查询费用汇总表接口
 */
export function expesumQuery<T = JsonVO<ExpeSumDTO>>(options?: UseAxiosOptionsJsonVO<T>) {
  return useRequest<ParamsQueryKey, T, ExpeSumQueryParams>({
    url: "/c6-repomanage/expesum/expesumQuery",
    httpParamWay: "query",
    config: {
      method: "GET",
      params: {},
      data: {},
    },
    options,
  });
}

/**
 * 楼栋收费率查询接口
 */
export function expesumQueryBuildingRates<T = JsonVO<BuildingRatePageDTO>>(options?: UseAxiosOptionsJsonVO<T>) {
  return useRequest<ParamsQueryKey, T, BuildingRateQueryParams>({
    url: "/c6-repomanage/expesum/buildingRates",
    httpParamWay: "query",
    config: {
      method: "GET",
      params: {
        pageIndex: 1,
        pageSize: 10,
      },
      data: {
        pageIndex: 1,
        pageSize: 10,
      },
    },
    options,
  });
}

/**
 * 费用项目费率查询接口
 */
export function expesumQueryFeeItemRates<T = JsonVO<FeeItemRatePageDTO>>(options?: UseAxiosOptionsJsonVO<T>) {
  return useRequest<ParamsQueryKey, T, FeeItemRateQueryParams>({
    url: "/c6-repomanage/expesum/feeItemRates",
    httpParamWay: "query",
    config: {
      method: "GET",
      params: {
        pageIndex: 1,
        pageSize: 10,
      },
      data: {
        pageIndex: 1,
        pageSize: 10,
      },
    },
    options,
  });
}

/**
 * 导出费用汇总表接口
 */
export function expesumExport<T = void>(options?: UseAxiosOptionsJsonVO<T>) {
  return useRequest<ParamsQueryKey, T, ExpesumExportQueryParams>({
    url: "/c6-repomanage/expesum/expesumExport",
    httpParamWay: "query",
    config: {
      method: "GET",
      params: {},
      data: {},
      responseType: "blob",
    },
    options,
  });
} 