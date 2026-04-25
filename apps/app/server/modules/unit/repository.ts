import type { Unit } from '../../../src/types/selector.ts'
import { COMMUNITY_OPTIONS } from '../../../src/constants/common.ts'
import { createPaginationResponse } from '../../shared/runtime/common-utils.ts'

export interface UnitModuleRepository {
  getUnitById: (unitId: string) => Unit | undefined
  getUnitList: (params: {
    communityId?: string
    floorId?: string
    page: number
    row: number
    unitNum?: string
  }) => ReturnType<typeof createPaginationResponse<Unit>>
  getUnitsByFloorId: (floorId: string) => Unit[]
}

/** 创建 `unit` 模块的 mock 内存仓储。 */
export function createUnitMockRepository(): UnitModuleRepository {
  return new UnitDatabase()
}

/** unit 模块的 mock 内存仓储实现。 */
class UnitDatabase implements UnitModuleRepository {
  private units: Unit[] = []

  constructor() {
    this.initData()
  }

  getUnitById(unitId: string): Unit | undefined {
    const unit = this.units.find(item => item.unitId === unitId)
    return unit ? cloneValue(unit) : undefined
  }

  getUnitList(params: {
    communityId?: string
    floorId?: string
    page: number
    row: number
    unitNum?: string
  }) {
    let filteredUnits = [...this.units]

    if (params.communityId) {
      filteredUnits = filteredUnits.filter(unit => unit.communityId === params.communityId)
    }

    if (params.floorId) {
      filteredUnits = filteredUnits.filter(unit => unit.floorId === params.floorId)
    }

    if (params.unitNum) {
      const keyword = params.unitNum.toLowerCase()
      filteredUnits = filteredUnits.filter(unit => unit.unitNum.toLowerCase().includes(keyword))
    }

    return cloneValue(createPaginationResponse(filteredUnits, params.page, params.row))
  }

  getUnitsByFloorId(floorId: string): Unit[] {
    return cloneValue(this.units.filter(unit => unit.floorId === floorId))
  }

  /** 初始化单元数据。 */
  private initData() {
    COMMUNITY_OPTIONS.forEach((community) => {
      for (let floorIndex = 1; floorIndex <= 30; floorIndex += 1) {
        for (let unitIndex = 1; unitIndex <= 8; unitIndex += 1) {
          this.units.push(createMockUnit(String(community.value), floorIndex, unitIndex))
        }
      }
    })
  }
}

/** 默认运行时共享使用的 unit 仓储实例。 */
export const unitMockRepository = createUnitMockRepository()

/** 生成单个单元数据。 */
function createMockUnit(communityId: string, floorIndex: number, unitIndex: number): Unit {
  const floorId = `F_${communityId}_${floorIndex.toString().padStart(3, '0')}`

  return {
    unitId: `U_${communityId}_${floorIndex.toString().padStart(3, '0')}_${unitIndex.toString().padStart(2, '0')}`,
    unitNum: `${unitIndex}`,
    floorId,
    communityId,
  }
}

/** 克隆仓储返回值，避免外部引用直接修改内部状态。 */
function cloneValue<T>(value: T): T {
  return structuredClone(value)
}
