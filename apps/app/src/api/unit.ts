/**
 * 单元模块 API 接口定义
 * 对应业务：楼栋单元管理
 *
 * @fileoverview 提供单元信息的查询接口，支持列表查询和详情查询
 */

import type { PaginationResponse } from '@/types/api'
import type { Unit, UnitQueryParams } from '@/types/selector'
import { http } from '@/http/alova'

/** ==================== 查询接口 ==================== */

/**
 * 查询单元列表（z-paging兼容格式）
 * @param params - 查询参数
 * @param params.communityId - 社区ID（可选）
 * @param params.floorId - 楼栋ID（可选）
 * @param params.unitNum - 单元编号（可选）
 * @param params.page - 页码（可选）
 * @param params.row - 每页数量（可选）
 * @returns 单元列表响应，包含 list 和 total
 * @example getUnitList({ floorId: 'F_COMM_001_001', page: 1, row: 10 })
 */
export function getUnitList(params: UnitQueryParams) {
  return http.Get<PaginationResponse<Unit>>('/app/unit.queryUnits', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}

/**
 * 查询单元详情
 * @param params - 查询参数
 * @param params.unitId - 单元ID
 * @returns 单元详情响应
 * @example getUnitDetail({ unitId: 'U_COMM_001_001_01' })
 */
export function getUnitDetail(params: { unitId: string }) {
  return http.Get<Unit>('/app/unit.queryUnitDetail', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}
