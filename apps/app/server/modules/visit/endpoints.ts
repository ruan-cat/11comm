import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { VisitModuleRepository } from './repository.ts'
import { successResponse } from '../../shared/runtime/response-builder.ts'
import { visitMockRepository } from './repository.ts'

/** 创建 `visit` 模块的共享 endpoint 定义。 */
export function createVisitEndpointDefinitions(
  repository: VisitModuleRepository = visitMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/visit.getVisit',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getVisitList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        state: asOptionalString(params.state),
        visitId: asOptionalString(params.visitId),
      }), '查询成功'),
    },
    {
      url: '/app/visit.getVisitDetail',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getVisitDetailList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 1,
        visitId: asOptionalString(params.visitId) || '',
      }), '查询成功'),
    },
    {
      url: '/app/visit.auditVisit',
      method: ['POST'],
      handler: ({ body }) => {
        repository.auditVisit((body || {}) as Parameters<VisitModuleRepository['auditVisit']>[0])
        return successResponse({ success: true }, '审核成功')
      },
    },
  ]
}

/** 默认共享 registry 使用的 visit 端点集合。 */
export const visitEndpointDefinitions = createVisitEndpointDefinitions()

/** 将未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
