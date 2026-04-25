import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { UnitModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { unitMockRepository } from './repository.ts'

/** 创建 `unit` 模块的共享 endpoint 定义。 */
export function createUnitEndpointDefinitions(
  repository: UnitModuleRepository = unitMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/unit.queryUnits',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getUnitList({
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        floorId: asOptionalString(params.floorId),
        unitNum: asOptionalString(params.unitNum),
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
      }), '查询成功'),
    },
    {
      url: '/app/unit.queryUnitDetail',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const unitId = asOptionalString(params.unitId)
        if (!unitId) {
          return errorResponse('单元ID不能为空', '400')
        }

        const unit = repository.getUnitById(unitId)
        if (!unit) {
          return errorResponse('单元不存在', '404')
        }

        return successResponse(unit, '查询成功')
      },
    },
  ]
}

/** 默认共享 registry 使用的 unit 端点集合。 */
export const unitEndpointDefinitions = createUnitEndpointDefinitions()

/** 将未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
