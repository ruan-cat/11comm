import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { InspectionModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { inspectionMockRepository } from './repository.ts'

/** 创建 `inspection` 模块的共享 endpoint 定义。 */
export function createInspectionEndpointDefinitions(
  repository: InspectionModuleRepository = inspectionMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/inspection.listInspectionTasks',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getTaskList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        moreState: asOptionalString(params.moreState),
        isToday: params.isToday ? Number(params.isToday) : undefined,
        canReexamine: asOptionalString(params.canReexamine),
        planInsTime: asOptionalString(params.planInsTime),
      })),
    },
    {
      url: '/app/inspection.getTodayReport',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getTodayReport({
        communityId: asOptionalString(params.communityId),
        queryTime: asOptionalString(params.queryTime),
      })),
    },
    {
      url: '/app/inspection.listInspectionTaskDetails',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getTaskDetail({
        communityId: asOptionalString(params.communityId),
        taskId: asOptionalString(params.taskId),
        planUserId: asOptionalString(params.planUserId),
        queryTime: asOptionalString(params.queryTime),
        inspectionId: asOptionalString(params.inspectionId),
        state: asOptionalString(params.state),
        qrCodeTime: asOptionalString(params.qrCodeTime),
        page: Number(params.page) || 1,
        row: Number(params.row) || 100,
      })),
    },
    {
      url: '/app/inspection.listInspectionItemTitles',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const itemId = asOptionalString(params.itemId)
        if (!itemId) {
          return errorResponse('巡检项ID不能为空', '400')
        }

        return successResponse(repository.getItemTitles({
          communityId: asOptionalString(params.communityId),
          itemId,
          page: Number(params.page) || 1,
          row: Number(params.row) || 100,
        }))
      },
    },
    {
      url: '/app/inspection.submitInspection',
      method: 'POST',
      handler: ({ body }) => {
        const success = repository.submitInspection(body as any)
        if (!success) {
          return errorResponse('提交失败', '400')
        }

        return successResponse({ success: true }, '提交成功')
      },
    },
    {
      url: '/app/staff.listStaffs',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getStaffList({
        communityId: asOptionalString(params.communityId),
      })),
    },
    {
      url: '/app/inspection.transferTask',
      method: 'POST',
      handler: ({ body }) => {
        const success = repository.transferTask(body as any)
        if (!success) {
          return errorResponse('流转失败', '400')
        }

        return successResponse({ success: true }, '流转成功')
      },
    },
  ]
}

/** 默认供 shared registry 直接注册的 inspection 端点集合。 */
export const inspectionEndpointDefinitions = createInspectionEndpointDefinitions()

/** inspection 当前没有 legacy URL 冲突，可直接进入 Nitro 优先层。 */
export const inspectionRuntimeEndpointDefinitions = inspectionEndpointDefinitions

/** 把未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
