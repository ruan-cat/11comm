import type { Room } from '../../../src/types/selector.ts'
import { COMMUNITY_OPTIONS } from '../../../src/constants/common.ts'
import { createPaginationResponse } from '../../shared/runtime/common-utils.ts'

export interface RoomModuleRepository {
  getRoomById: (roomId: string) => Room | undefined
  getRoomList: (params: {
    communityId?: string
    floorId?: string
    page: number
    row: number
    roomNum?: string
    unitId?: string
  }) => ReturnType<typeof createPaginationResponse<Room>>
}

/** 创建 `room` 模块的 mock 内存仓储。 */
export function createRoomMockRepository(): RoomModuleRepository {
  return new RoomDatabase()
}

/** room 模块的 mock 内存仓储实现。 */
class RoomDatabase implements RoomModuleRepository {
  private rooms: Room[] = []

  constructor() {
    this.initData()
  }

  getRoomById(roomId: string): Room | undefined {
    const room = this.rooms.find(item => item.roomId === roomId)
    return room ? cloneValue(room) : undefined
  }

  getRoomList(params: {
    communityId?: string
    floorId?: string
    page: number
    row: number
    roomNum?: string
    unitId?: string
  }) {
    let filteredRooms = [...this.rooms]

    if (params.communityId) {
      filteredRooms = filteredRooms.filter(room => room.communityId === params.communityId)
    }

    if (params.floorId) {
      filteredRooms = filteredRooms.filter(room => room.floorId === params.floorId)
    }

    if (params.unitId) {
      filteredRooms = filteredRooms.filter(room => room.unitId === params.unitId)
    }

    if (params.roomNum) {
      filteredRooms = filteredRooms.filter(room => room.roomNum.includes(params.roomNum))
    }

    return cloneValue(createPaginationResponse(filteredRooms, params.page, params.row))
  }

  /** 初始化房屋数据。 */
  private initData() {
    COMMUNITY_OPTIONS.forEach((community) => {
      for (let floorIndex = 1; floorIndex <= 30; floorIndex += 1) {
        for (let unitIndex = 1; unitIndex <= 8; unitIndex += 1) {
          for (let roomIndex = 1; roomIndex <= 6; roomIndex += 1) {
            this.rooms.push(createMockRoom(String(community.value), floorIndex, unitIndex, roomIndex))
          }
        }
      }
    })
  }
}

/** 默认运行时共享使用的 room 仓储实例。 */
export const roomMockRepository = createRoomMockRepository()

/** 生成单个房屋数据。 */
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

/** 克隆仓储返回值，避免外部引用直接修改内部状态。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
