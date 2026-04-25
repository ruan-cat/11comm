import type { Floor } from '../../../src/types/selector.ts'
import { COMMUNITY_OPTIONS } from '../../../src/constants/common.ts'
import { BUILDING_NAME_OPTIONS } from '../../../src/constants/floor.ts'
import { createPaginationResponse } from '../../shared/runtime/common-utils.ts'

export interface FloorModuleRepository {
  getFloorById: (floorId: string) => Floor | undefined
  getFloorList: (params: {
    communityId?: string
    floorNum?: string
    keyword?: string
    page: number
    row: number
  }) => ReturnType<typeof createPaginationResponse<Floor>>
}

/** 创建 `floor` 模块的 mock 内存仓储。 */
export function createFloorMockRepository(): FloorModuleRepository {
  return new FloorDatabase()
}

/** floor 模块的 mock 内存仓储实现。 */
class FloorDatabase implements FloorModuleRepository {
  private floors: Floor[] = []

  constructor() {
    this.initData()
  }

  getFloorById(floorId: string): Floor | undefined {
    const floor = this.floors.find(item => item.floorId === floorId)
    return floor ? cloneValue(floor) : undefined
  }

  getFloorList(params: {
    communityId?: string
    floorNum?: string
    keyword?: string
    page: number
    row: number
  }) {
    const filteredFloors = this.filterFloors(params)
    return cloneValue(createPaginationResponse(filteredFloors, params.page, params.row))
  }

  /** 初始化楼层数据。 */
  private initData() {
    if (this.floors.length > 0) {
      return
    }

    this.floors = this.generateFloorList()
  }

  /** 生成楼层列表。 */
  private generateFloorList(): Floor[] {
    const floors: Floor[] = []

    COMMUNITY_OPTIONS.forEach((community) => {
      for (let index = 1; index <= 30; index += 1) {
        const buildingItem = BUILDING_NAME_OPTIONS[Math.floor(Math.random() * BUILDING_NAME_OPTIONS.length)]
        floors.push({
          floorId: `F_${community.value}_${index.toString().padStart(3, '0')}`,
          floorNum: index.toString(),
          floorName: `${index}${buildingItem.label}`,
          communityId: String(community.value),
        })
      }
    })

    return floors
  }

  /** 根据查询条件筛选楼层。 */
  private filterFloors(params: {
    communityId?: string
    floorNum?: string
    keyword?: string
  }): Floor[] {
    return this.floors.filter((floor) => {
      const matchCommunity = !params.communityId || floor.communityId === params.communityId
      const matchFloorNum = !params.floorNum || floor.floorNum.includes(params.floorNum)
      const matchKeyword = !params.keyword || floor.floorName.includes(params.keyword) || floor.floorNum.includes(params.keyword)

      return matchCommunity && matchFloorNum && matchKeyword
    })
  }
}

/** 默认运行时共享使用的 floor 仓储实例。 */
export const floorMockRepository = createFloorMockRepository()

/** 克隆仓储返回值，避免外部引用直接修改内部状态。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
