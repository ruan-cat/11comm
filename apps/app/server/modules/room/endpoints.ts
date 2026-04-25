import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { RoomModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { roomMockRepository } from './repository.ts'

/** 创建 `room` 模块的共享 endpoint 定义。 */
export function createRoomEndpointDefinitions(
  repository: RoomModuleRepository = roomMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/room.queryRooms',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getRoomList({
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        floorId: asOptionalString(params.floorId),
        unitId: asOptionalString(params.unitId),
        roomNum: asOptionalString(params.roomNum),
        page: Number(params.page) || 1,
        row: Number(params.row) || 50,
      }), '查询成功'),
    },
    {
      url: '/app/room.queryRoomDetail',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const roomId = asOptionalString(params.roomId)
        if (!roomId) {
          return errorResponse('房间ID不能为空', '400')
        }

        const room = repository.getRoomById(roomId)
        if (!room) {
          return errorResponse('房屋不存在', '404')
        }

        return successResponse(room, '查询成功')
      },
    },
  ]
}

/** 默认共享 registry 使用的 room 端点集合。 */
export const roomEndpointDefinitions = createRoomEndpointDefinitions()

/** 将未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
