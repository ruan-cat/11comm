/**
 * 单元模块 Mock 接口。
 */

import type { Unit } from '../../types/selector'
import { createPaginationResponse, defineUniAppMock, errorResponse, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 单元 mock 数据。 */
const unitMockData: Unit[] = createUnitMockData()

export default defineUniAppMock([
  {
    url: '/app/unit.queryUnits',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const communityId = asOptionalString(params.communityId) || 'COMM_001'
      const floorId = asOptionalString(params.floorId)
      const unitNum = asOptionalString(params.unitNum)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 10)
      const units = unitMockData.filter((unit) => {
        const matchCommunity = unit.communityId === communityId
        const matchFloor = !floorId || unit.floorId === floorId
        const matchUnitNum = !unitNum || unit.unitNum.includes(unitNum)

        return matchCommunity && matchFloor && matchUnitNum
      })

      return successResponse(createPaginationResponse(units, page, row), '查询成功')
    },
  },
  {
    url: '/app/unit.queryUnitDetail',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const unitId = asOptionalString(params.unitId)

      if (!unitId) {
        return errorResponse('单元ID不能为空', '400')
      }

      const unit = unitMockData.find(item => item.unitId === unitId)

      if (!unit) {
        return errorResponse('单元不存在', '404')
      }

      return successResponse(unit, '查询成功')
    },
  },
])

/** 生成兼容楼层选择器的单元数据。 */
function createUnitMockData(): Unit[] {
  const units: Unit[] = []
  const communities = ['COMM_001', 'COMM_002', 'COMM_003']

  communities.forEach((communityId) => {
    for (let floorIndex = 1; floorIndex <= 3; floorIndex += 1) {
      for (let unitIndex = 1; unitIndex <= 3; unitIndex += 1) {
        units.push(createMockUnit(communityId, floorIndex, unitIndex))
      }
    }
  })

  return units
}

/** 生成单个单元条目。 */
function createMockUnit(communityId: string, floorIndex: number, unitIndex: number): Unit {
  const floorId = `F_${communityId}_${floorIndex.toString().padStart(3, '0')}`

  return {
    unitId: `U_${communityId}_${floorIndex.toString().padStart(3, '0')}_${unitIndex.toString().padStart(2, '0')}`,
    unitNum: `${unitIndex}`,
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
