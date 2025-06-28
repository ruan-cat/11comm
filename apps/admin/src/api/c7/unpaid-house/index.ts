import { useRequest } from "@/composables/use-request";
import type { UseAxiosOptionsJsonVO } from "@/composables/use-request/useRequestIn01s/tools";
import type { PageDTO } from "@/composables/use-request/useRequestIn01s/types/PageDTO";
import type { JsonVO } from "@/composables/use-request/useRequestIn01s/types/JsonVO";

/**
 * 未收费房屋数据项
 */
export interface UnpaidHouseDTO {
  /** 房屋ID */
  roomId: string;
  /** 楼栋编号 */
  floorNum: string;
  /** 单元编号 */
  unitNum: string;
  /** 房屋编号 */
  roomNum: string;
  /** 业主ID */
  ownerId?: string;
  /** 业主名称 */
  ownerName?: string;
  /** 联系电话 */
  link?: string;
}

/**
 * 未收费房屋分页数据
 */
export type UnpaidHousePageDTO = PageDTO<UnpaidHouseDTO>;

/**
 * 未收费房屋查询参数
 */
export interface QueryUnpaidHouseParams {
  /** 查询页码 */
  pageIndex: number;
  /** 查询条数 */
  pageSize: number;
  /** 楼栋ID */
  floorId?: string;
  /** 单元ID */
  unitId?: string;
  /** 房屋ID */
  roomId?: string;
  /** 业主名称 */
  ownerName?: string;
  /** 联系电话 */
  link?: string;
  /** 小区ID */
  communityId: string;
}

/**
 * 获取未收费房屋列表
 * @param params 查询参数
 * @param options 请求配置选项
 * @returns 未收费房屋分页数据
 */
export function queryUnpaidHouse(
  params: QueryUnpaidHouseParams,
  options?: UseAxiosOptionsJsonVO<JsonVO<UnpaidHousePageDTO>>
) {
  return useRequest<"params", JsonVO<UnpaidHousePageDTO>, QueryUnpaidHouseParams>({
    url: "/c7-repomanage/unpaid-house",
    httpParamWay: "query",
    config: {
      method: "GET",
      params: {},
    },
    options,
  });
} 