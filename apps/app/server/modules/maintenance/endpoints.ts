import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { MaintenanceModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { maintenanceMockRepository } from './repository.ts'

/** 创建 `maintenance` 模块的共享 endpoint 定义。 */
export function createMaintenanceEndpointDefinitions(
  repository: MaintenanceModuleRepository = maintenanceMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/maintenance.listMaintenanceTasks',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getTaskList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: String(params.communityId || 'COMM_001'),
        status: asOptionalString(params.status),
      })),
    },
    {
      url: '/app/maintenance.queryMaintenanceTask',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const taskId = asOptionalString(params.taskId)
        if (!taskId) {
          return errorResponse('任务ID不能为空', '400')
        }

        const task = repository.getTaskDetail(taskId)
        if (!task) {
          return errorResponse('任务不存在', '404')
        }

        return successResponse({ task })
      },
    },
    {
      url: '/app/maintenance.listMaintenanceTaskDetails',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const taskId = asOptionalString(params.taskId)
        if (!taskId) {
          return errorResponse('任务ID不能为空', '400')
        }

        return successResponse({ items: repository.getTaskDetailItems(taskId) })
      },
    },
    {
      url: '/app/maintenance.startMaintenanceTask',
      method: 'POST',
      handler: ({ body }) => {
        const taskId = asOptionalString(body?.taskId)
        if (!taskId) {
          return errorResponse('任务ID不能为空', '400')
        }

        const success = repository.startTask(taskId)
        if (!success) {
          return errorResponse('开始任务失败', '400')
        }

        return successResponse({ success: true }, '开始保养成功')
      },
    },
    {
      url: '/app/maintenance.completeMaintenanceTask',
      method: 'POST',
      handler: ({ body }) => {
        const taskId = asOptionalString(body?.taskId)
        if (!taskId) {
          return errorResponse('任务ID不能为空', '400')
        }

        const success = repository.completeTask(taskId)
        if (!success) {
          return errorResponse('完成任务失败', '400')
        }

        return successResponse({ success: true }, '保养完成')
      },
    },
    {
      url: '/app/maintenance.submitMaintenanceSingle',
      method: 'POST',
      handler: ({ body }) => {
        const success = repository.submitSingle(body as any)
        if (!success) {
          return errorResponse('提交失败', '400')
        }

        return successResponse({ success: true }, '提交成功')
      },
    },
    {
      url: '/app/maintenance.transferMaintenanceTask',
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

/** 默认供 shared registry 直接注册的 maintenance 端点集合。 */
export const maintenanceEndpointDefinitions = createMaintenanceEndpointDefinitions()

/** maintenance 当前没有 legacy URL 冲突，可直接进入 Nitro 优先层。 */
export const maintenanceRuntimeEndpointDefinitions = maintenanceEndpointDefinitions

/** 把未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
