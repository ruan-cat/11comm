/**
 * 房屋模块 Mock 接口。
 */

import type { Room } from '../../types/selector'
import { createPaginationResponse, defineUniAppMock, errorResponse, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 房屋 mock 数据。 */
const roomMockData: Room[] = createRoomMockData()

export default defineUniAppMock([
  {
    url: '/app/room.queryRooms',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const communityId = asOptionalString(params.communityId) || 'COMM_001'
      const floorId = asOptionalString(params.floorId)
      const unitId = asOptionalString(params.unitId)
      const roomNum = asOptionalString(params.roomNum)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 50)
      const rooms = roomMockData.filter((room) => {
        const matchCommunity = room.communityId === communityId
        const matchFloor = !floorId || room.floorId === floorId
        const matchUnit = !unitId || room.unitId === unitId
        const matchRoomNum = !roomNum || room.roomNum.includes(roomNum)

        return matchCommunity && matchFloor && matchUnit && matchRoomNum
      })

      return successResponse(createPaginationResponse(rooms, page, row), '查询成功')
    },
  },
  {
    url: '/app/room.queryRoomDetail',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const roomId = asOptionalString(params.roomId)

      if (!roomId) {
        return errorResponse('房间ID不能为空', '400')
      }

      const room = roomMockData.find(item => item.roomId === roomId)

      if (!room) {
        return errorResponse('房屋不存在', '404')
      }

      return successResponse(room, '查询成功')
    },
  },
])

/** 生成兼容楼层、单元选择器的房屋数据。 */
function createRoomMockData(): Room[] {
  const rooms: Room[] = []
  const communities = ['COMM_001', 'COMM_002', 'COMM_003']

  communities.forEach((communityId) => {
    for (let floorIndex = 1; floorIndex <= 3; floorIndex += 1) {
      for (let unitIndex = 1; unitIndex <= 3; unitIndex += 1) {
        for (let roomIndex = 1; roomIndex <= 4; roomIndex += 1) {
          rooms.push(createMockRoom(communityId, floorIndex, unitIndex, roomIndex))
        }
      }
    }
  })

  return rooms
}

/** 生成单个房屋条目。 */
function createMockRoom(communityId: string, floorIndex: number, unitIndex: number, roomIndex: number): Room {
  const floorId = `F_${communityId}_${floorIndex.toString().padStart(3, '0')}`
  const unitId = `U_${communityId}_${floorIndex.toString().padStart(3, '0')}_${unitIndex.toString().padStart(2, '0')}`
  const roomNum = `${unitIndex}${roomIndex.toString().padStart(2, '0')}`

  return {
    roomId: `R_${communityId}_${floorIndex.toString().padStart(3, '0')}_${unitIndex.toString().padStart(2, '0')}_${roomIndex.toString().padStart(2, '0')}`,
    roomNum,
    unitId,
    floorId,
    communityId,
  }
}

/** 合并 Vite mock 的 query、body 与 params。 */
function getRequestParams(context: MockContext): Record<string, unknown> {
  return {
    ...(context.query || {}),
    ...(context.body || {}),
    ...(context.params || {}),
  }
}

/** 将未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}

/** 将未知值收敛为正数。 */
function asPositiveNumber(value: unknown, fallback: number): number {
  const numberValue = Number(asOptionalString(value))

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback
}
