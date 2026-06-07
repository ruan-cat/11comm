/**
 * 楼层模块 Mock 接口。
 */

import type { Floor } from '../../types/selector'
import { createPaginationResponse, defineUniAppMock, errorResponse, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 楼层 mock 数据。 */
const floorMockData: Floor[] = [
  { floorId: 'F_COMM_001_001', floorNum: '1', floorName: '1号住宅楼', communityId: 'COMM_001' },
  { floorId: 'F_COMM_001_002', floorNum: '2', floorName: '2号住宅楼', communityId: 'COMM_001' },
  { floorId: 'F_COMM_001_003', floorNum: '3', floorName: '3号商业楼', communityId: 'COMM_001' },
  { floorId: 'F_COMM_002_001', floorNum: '1', floorName: '1号公寓楼', communityId: 'COMM_002' },
  { floorId: 'F_COMM_002_002', floorNum: '2', floorName: '2号公寓楼', communityId: 'COMM_002' },
  { floorId: 'F_COMM_003_001', floorNum: '1', floorName: '1号办公楼', communityId: 'COMM_003' },
]

export default defineUniAppMock([
  {
    url: '/app/floor.queryFloors',
    method: ['GET', 'POST'],
    body: (context: MockContext) => {
      const params = getRequestParams(context)
      const communityId = asOptionalString(params.communityId) || 'COMM_001'
      const floorNum = asOptionalString(params.floorNum)
      const keyword = asOptionalString(params.keyword)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 50)
      const floors = floorMockData.filter((floor) => {
        const matchCommunity = floor.communityId === communityId
        const matchFloorNum = !floorNum || floor.floorNum.includes(floorNum)
        const matchKeyword = !keyword || floor.floorName.includes(keyword) || floor.floorNum.includes(keyword)

        return matchCommunity && matchFloorNum && matchKeyword
      })

      return successResponse(createPaginationResponse(floors, page, row), '查询楼层列表成功')
    },
  },
  {
    url: '/app/floor.queryFloorDetail',
    method: ['GET', 'POST'],
    body: (context: MockContext) => {
      const params = getRequestParams(context)
      const floorId = asOptionalString(params.floorId)

      if (!floorId) {
        return errorResponse('楼层ID不能为空', '400')
      }

      const floor = floorMockData.find(item => item.floorId === floorId)

      if (!floor) {
        return errorResponse('楼层不存在', '404')
      }

      return successResponse(floor, '查询楼层详情成功')
    },
  },
])

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
