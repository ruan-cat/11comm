import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { AppointmentModuleRepository } from './repository.ts'
import { successResponse } from '../../shared/runtime/response-builder.ts'
import { appointmentMockRepository } from './repository.ts'

/** 创建 `appointment` 模块的共享 endpoint 定义。 */
export function createAppointmentEndpointDefinitions(
  repository: AppointmentModuleRepository = appointmentMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/communitySpace.listCommunitySpaceConfirmOrder',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.list({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: String(params.communityId || ''),
        timeId: asOptionalString(params.timeId),
      }), '查询成功'),
    },
    {
      url: '/app/communitySpace.saveCommunitySpaceConfirmOrder',
      method: ['POST'],
      handler: ({ body }) => {
        const timeId = asOptionalString(body?.timeId)
        if (timeId) {
          repository.confirm(timeId)
        }

        return successResponse({ success: true }, '核销成功')
      },
    },
  ]
}

/** 默认共享的 appointment endpoint 集合。 */
export const appointmentEndpointDefinitions = createAppointmentEndpointDefinitions()

function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
