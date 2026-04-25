/**
 * 房屋模块 API 接口定义
 * 对应业务：房屋选择器相关功能
 *
 * @fileoverview 提供房屋信息的查询接口，支持列表查询和详情查询
 */

import type { PaginationResponse } from '@/types/api'
import type { Room, RoomQueryParams } from '@/types/selector'
import { http } from '@/http/alova'

/** ==================== 查询接口 ==================== */

/**
 * 查询房屋列表（z-paging兼容格式）
 * @param params - 查询参数
 * @param params.communityId - 社区ID（可选）
 * @param params.floorId - 楼栋ID（可选）
 * @param params.unitId - 单元ID（可选）
 * @param params.roomNum - 房间号（可选）
 * @param params.page - 页码（可选）
 * @param params.row - 每页数量（可选）
 * @returns 房屋列表响应，包含 list 和 total
 * @example getRoomList({ floorId: 'F_COMM_001_001', unitId: 'U_001_01', page: 1, row: 10 })
 */
export function getRoomList(params: RoomQueryParams) {
  return http.Get<PaginationResponse<Room>>('/app/room.queryRooms', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}

/**
 * 查询房屋详情
 * @param params - 查询参数
 * @param params.roomId - 房屋ID
 * @returns 房屋详情响应
 * @example getRoomDetail({ roomId: 'R_001_01_01' })
 */
export function getRoomDetail(params: { roomId: string }) {
  return http.Get<Room>('/app/room.queryRoomDetail', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}

/**
 * 查询房屋信息（支持多条件查询）
 * @param params - 查询参数
 * @param params.page - 页码
 * @param params.row - 每页数量
 * @param params.communityId - 小区ID
 * @param params.floorNum - 楼栋号
 * @param params.unitNum - 单元号
 * @param params.roomNum - 房间号
 * @returns 房屋信息响应
 * @example getRoomInfo({ page: 1, row: 1, communityId: 'COMM_001', floorNum: '1', unitNum: '1', roomNum: '101' })
 */
export function getRoomInfo(params: {
  page: number
  row: number
  communityId: string
  floorNum?: string
  unitNum?: string
  roomNum?: string
}) {
  return http.Get<{
    rooms: Array<{
      roomId: string
      floorNum?: string
      unitNum?: string
      roomNum?: string
      builtUpArea?: string
      ownerName?: string
      link?: string
    }>
  }>('/app/room.queryRooms', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}
