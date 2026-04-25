/**
 * 楼栋模块 API 接口定义
 * 对应业务：楼栋选择器相关功能
 *
 * @fileoverview 提供楼栋信息的查询接口，支持列表查询和详情查询
 */

import type { PaginationResponse } from '@/types/api'
import type { Floor, FloorQueryParams } from '@/types/selector'
import { http } from '@/http/alova'

/** ==================== 查询接口 ==================== */

/**
 * 查询楼栋列表（z-paging兼容格式）
 * @param params - 查询参数
 * @param params.communityId - 社区ID（可选）
 * @param params.floorNum - 楼栋编号（可选）
 * @param params.keyword - 搜索关键词（可选）
 * @param params.page - 页码（可选）
 * @param params.row - 每页数量（可选）
 * @returns 楼栋列表响应，包含 list 和 total
 * @example getFloorList({ communityId: 'COMM_001', page: 1, row: 10 })
 */
export function getFloorList(params: FloorQueryParams) {
  return http.Get<PaginationResponse<Floor>>('/app/floor.queryFloors', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}

/**
 * 查询楼栋详情
 * @param params - 查询参数
 * @param params.floorId - 楼栋ID
 * @returns 楼栋详情响应
 * @example getFloorDetail({ floorId: 'F_COMM_001_001' })
 */
export function getFloorDetail(params: { floorId: string }) {
  return http.Get<Floor>('/app/floor.queryFloorDetail', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}
