import { useRequest } from "@/composables/use-request";
import type { ParamsQueryKey } from "@/composables/use-request/useRequestIn01s/main";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";
import type { PageDTO } from "@/composables/use-request/useRequestIn01s/types/PageDTO";

// ==================== 业主明细查询 ====================

/** 业主明细查询参数 */
export interface OwnerFeeDetaileQueryParams {
  /** 查询页码 */
  pageIndex: number;
  /** 查询条数 */
  pageSize: number;
  /** 开始时间 */
  start_time?: string;
  /** 结束时间 */
  end_time?: string;
  /** 房屋编号 */
  room_name?: string;
  /** 业主姓名 */
  name?: string;
  /** 手机号 */
  link?: string;
}

/** 业主明细数据 */
export interface OwnerExpedetDTO {
  /** 业主姓名 */
  name: string;
  /** 房屋编号 */
  room_name: string;
  /** 实收 */
  shishou: number;
  /** 欠费 */
  qianfei: number;
  /** 物业费 */
  wuye: number;
  /** 押金 */
  yajin: number;
  /** 停车费 */
  tingche: number;
  /** 煤气费 */
  meiqi: number;
  /** 取暖 */
  qunuan: number;
  /** 维修费 */
  weixiu: number;
  /** 服务费 */
  fuwu: number;
  /** 其他 */
  qita: number;
  /** 水费 */
  shuifei: number;
  /** 电费 */
  dianfei: number;
  /** 租金 */
  zujin: number;
  /** 公摊费 */
  gongtan: number;
}

/**
 * 业主明细查询接口
 * @description 查询业主费用明细信息
 */
export function queryOwnerDetail<T = OwnerExpedetDTO>(options?: UseAxiosOptionsJsonVO<PageDTO<T>>) {
  return useRequest<ParamsQueryKey, T, OwnerFeeDetaileQueryParams>({
    url: "/c6-repomanage/expedet/ownerFeeDetaileQuery",
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

// ==================== 房屋明细查询 ====================

/** 房屋明细查询参数 */
export interface BuildingFeeDetaileQueryParams {
  /** 查询页码 */
  pageIndex: number;
  /** 查询条数 */
  pageSize: number;
  /** 开始时间 */
  start_time?: string;
  /** 结束时间 */
  end_time?: string;
  /** 房屋编号 */
  room_name?: string;
  /** 业主姓名 */
  name?: string;
  /** 手机号 */
  link?: string;
}

/** 房屋明细数据 */
export interface BuildingExpedetDTO {
  /** 房屋编号 */
  room_name: string;
  /** 业主姓名 */
  name: string;
  /** 实收 */
  shishou: number;
  /** 欠费 */
  qianfei: number;
  /** 物业费 */
  wuye: number;
  /** 押金 */
  yajin: number;
  /** 停车费 */
  tingche: number;
  /** 煤气费 */
  meiqi: number;
  /** 取暖 */
  qunuan: number;
  /** 维修费 */
  weixiu: number;
  /** 服务费 */
  fuwu: number;
  /** 其他 */
  qita: number;
  /** 水费 */
  shuifei: number;
  /** 电费 */
  dianfei: number;
  /** 租金 */
  zujin: number;
  /** 公摊费 */
  gongtan: number;
}

/**
 * 房屋明细查询接口
 * @description 查询房屋费用明细信息
 */
export function queryBuildingDetail<T = BuildingExpedetDTO>(options?: UseAxiosOptionsJsonVO<PageDTO<T>>) {
  return useRequest<ParamsQueryKey, T, BuildingFeeDetaileQueryParams>({
    url: "/c6-repomanage/expedet/buildingFeeDetaileQuery",
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

// ==================== 合同明细查询 ====================

/** 合同费用明细查询参数 */
export interface ContractFeeDetaileQueryParams {
  /** 查询页码 */
  pageIndex: number;
  /** 查询条数 */
  pageSize: number;
  /** 开始时间 */
  start_time?: string;
  /** 结束时间 */
  end_time?: string;
  /** 合同编号 */
  contract_num?: string;
  /** 业主姓名 */
  name?: string;
  /** 手机号 */
  link?: string;
}

/** 合同费用明细数据 */
export interface ContractExpedetDTO {
  /** 合同编号 */
  contract_num: string;
  /** 业主姓名 */
  name: string;
  /** 实收 */
  shishou: number;
  /** 欠费 */
  qianfei: number;
  /** 物业费 */
  wuye: number;
  /** 押金 */
  yajin: number;
  /** 停车费 */
  tingche: number;
  /** 煤气费 */
  meiqi: number;
  /** 取暖 */
  qunuan: number;
  /** 维修费 */
  weixiu: number;
  /** 服务费 */
  fuwu: number;
  /** 其他 */
  qita: number;
  /** 水费 */
  shuifei: number;
  /** 电费 */
  dianfei: number;
  /** 租金 */
  zujin: number;
  /** 公摊费 */
  gongtan: number;
}

/**
 * 合同费用明细查询接口
 * @description 查询合同费用明细信息
 */
export function queryContractDetail<T = ContractExpedetDTO>(options?: UseAxiosOptionsJsonVO<PageDTO<T>>) {
  return useRequest<ParamsQueryKey, T, ContractFeeDetaileQueryParams>({
    url: "/c6-repomanage/expedet/contractFeeDetaileQuery",
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

// ==================== 车辆明细查询 ====================

/** 车辆明细查询参数 */
export interface CarFeeDetaileQueryParams {
  /** 查询页码 */
  pageIndex: number;
  /** 查询条数 */
  pageSize: number;
  /** 开始时间 */
  start_time?: string;
  /** 结束时间 */
  end_time?: string;
  /** 车牌号 */
  car_num?: string;
  /** 业主姓名 */
  name?: string;
  /** 手机号 */
  link?: string;
}

/** 车辆明细数据 */
export interface CarExpedetDTO {
  /** 车牌号 */
  car_num: string;
  /** 业主姓名 */
  name: string;
  /** 实收 */
  shishou: number;
  /** 欠费 */
  qianfei: number;
  /** 物业费 */
  wuye: number;
  /** 押金 */
  yajin: number;
  /** 停车费 */
  tingche: number;
  /** 煤气费 */
  meiqi: number;
  /** 取暖 */
  qunuan: number;
  /** 维修费 */
  weixiu: number;
  /** 服务费 */
  fuwu: number;
  /** 其他 */
  qita: number;
  /** 水费 */
  shuifei: number;
  /** 电费 */
  dianfei: number;
  /** 租金 */
  zujin: number;
  /** 公摊费 */
  gongtan: number;
}

/**
 * 车辆明细查询接口
 * @description 查询车辆费用明细信息
 */
export function queryCarDetail<T = CarExpedetDTO>(options?: UseAxiosOptionsJsonVO<PageDTO<T>>) {
  return useRequest<ParamsQueryKey, T, CarFeeDetaileQueryParams>({
    url: "/c6-repomanage/expedet/carFeeDetaileQuery",
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