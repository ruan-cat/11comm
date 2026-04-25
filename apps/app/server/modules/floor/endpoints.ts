import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { FloorModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { floorMockRepository } from './repository.ts'

export interface FloorQueryParams {
  communityId?: string
  floorNum?: string
  keyword?: string
  page?: number
  row?: number
}

/** 创建 `floor` 模块的共享 endpoint 定义。 */
export function createFloorEndpointDefinitions(
  repository: FloorModuleRepository = floorMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/floor.queryFloors',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getFloorList({
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        floorNum: asOptionalString(params.floorNum),
        keyword: asOptionalString(params.keyword),
        page: Number(params.page) || 1,
        row: Number(params.row) || 50,
      }), '查询楼层列表成功'),
    },
    {
      url: '/app/floor.queryFloorDetail',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const floorId = asOptionalString(params.floorId)
        if (!floorId) {
          return errorResponse('楼层ID不能为空', '400')
        }

        const floor = repository.getFloorById(floorId)
        if (!floor) {
          return errorResponse('楼层不存在', '404')
        }

        return successResponse(floor, '查询楼层详情成功')
      },
    },
  ]
}

/** 默认共享 registry 使用的 floor 端点集合。 */
export const floorEndpointDefinitions = createFloorEndpointDefinitions()

/** 将未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
