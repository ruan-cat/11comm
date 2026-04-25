import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { WorkOrderModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { workOrderMockRepository } from './repository.ts'

/** 创建 `work-order` 模块的共享 endpoint 定义。 */
export function createWorkOrderEndpointDefinitions(
  repository: WorkOrderModuleRepository = workOrderMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/workorder/todo/list',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getTodoList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: String(params.communityId || 'COMM_001'),
        status: asOptionalString(params.status),
        type: asOptionalString(params.type),
        keyword: asOptionalString(params.keyword),
      })),
    },
    {
      url: '/app/workorder/copy/list',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getCopyList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: String(params.communityId || 'COMM_001'),
        status: asOptionalString(params.status),
        keyword: asOptionalString(params.keyword),
      })),
    },
    {
      url: '/app/workorder/detail',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const orderId = asOptionalString(params.orderId)
        if (!orderId) {
          return errorResponse('工作单ID不能为空', '400')
        }

        const order = repository.getDetail(orderId)
        if (!order) {
          return errorResponse('工作单不存在', '404')
        }

        return successResponse({ order })
      },
    },
    {
      url: '/app/workorder/create',
      method: 'POST',
      handler: ({ body }) => {
        const validationError = validateCreateWorkOrderBody(body || {})
        if (validationError) {
          return validationError
        }

        const orderId = repository.create(body as any)
        return successResponse({ orderId }, '创建成功')
      },
    },
    {
      url: '/app/workorder/update',
      method: 'POST',
      handler: ({ body }) => {
        if (!asOptionalString(body?.orderId)) {
          return errorResponse('工作单ID不能为空', '400')
        }

        const success = repository.update(body as any)
        if (!success) {
          return errorResponse('更新失败', '400')
        }

        return successResponse({ success: true }, '更新成功')
      },
    },
    {
      url: '/app/workorder/start',
      method: 'POST',
      handler: ({ body }) => {
        const orderId = asOptionalString(body?.orderId)
        if (!orderId) {
          return errorResponse('工作单ID不能为空', '400')
        }

        const success = repository.start(orderId)
        if (!success) {
          return errorResponse('开始处理失败', '400')
        }

        return successResponse({ success: true }, '开始处理')
      },
    },
    {
      url: '/app/workorder/complete',
      method: 'POST',
      handler: ({ body }) => {
        if (!asOptionalString(body?.orderId)) {
          return errorResponse('工作单ID不能为空', '400')
        }

        const success = repository.complete(body as any)
        if (!success) {
          return errorResponse('完成失败', '400')
        }

        return successResponse({ success: true }, '完成成功')
      },
    },
    {
      url: '/app/workorder/audit',
      method: 'POST',
      handler: ({ body }) => {
        if (!asOptionalString(body?.orderId)) {
          return errorResponse('工作单ID不能为空', '400')
        }

        const success = repository.audit(body as any)
        if (!success) {
          return errorResponse('审核失败', '400')
        }

        return successResponse({ success: true }, body?.result === 'pass' ? '审核通过' : '已驳回')
      },
    },
    {
      url: '/app/workorder/cancel',
      method: 'POST',
      handler: ({ body }) => {
        const orderId = asOptionalString(body?.orderId)
        if (!orderId) {
          return errorResponse('工作单ID不能为空', '400')
        }

        const success = repository.cancel(orderId, asOptionalString(body?.reason))
        if (!success) {
          return errorResponse('取消失败', '400')
        }

        return successResponse({ success: true }, '已取消')
      },
    },
    {
      url: '/app/workorder/task/list',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const workId = asOptionalString(params.workId)
        if (!workId) {
          return errorResponse('工作单ID不能为空', '400')
        }

        return successResponse(repository.getTaskList({
          workId,
          page: Number(params.page) || 1,
          row: Number(params.row) || 100,
        }), '获取任务列表成功')
      },
    },
    {
      url: '/app/workorder/task/items',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const workId = asOptionalString(params.workId)
        if (!workId) {
          return errorResponse('工作单ID不能为空', '400')
        }

        return successResponse(repository.getTaskItems({
          workId,
          states: asOptionalString(params.states),
          page: Number(params.page) || 1,
          row: Number(params.row) || 100,
        }), '获取任务项列表成功')
      },
    },
    {
      url: '/app/workorder/copy/finish',
      method: 'POST',
      handler: ({ body }) => {
        const copyId = asOptionalString(body?.copyId)
        const itemId = asOptionalString(body?.itemId)

        if (!copyId) {
          return errorResponse('抄送ID不能为空', '400')
        }

        if (!itemId) {
          return errorResponse('任务项ID不能为空', '400')
        }

        const success = repository.finishCopyWork({
          copyId,
          itemId,
          score: Number(body?.score) || 0,
          deductionMoney: Number(body?.deductionMoney) || 0,
          deductionReason: asOptionalString(body?.deductionReason) || '',
        })

        if (!success) {
          return errorResponse('提交失败', '400')
        }

        return successResponse({ success: true }, '提交成功')
      },
    },
  ]
}

/** 默认供 shared registry 直接注册的 work-order 端点集合。 */
export const workOrderEndpointDefinitions = createWorkOrderEndpointDefinitions()

/** work-order 当前没有 legacy URL 冲突，可直接进入 Nitro 优先层。 */
export const workOrderRuntimeEndpointDefinitions = workOrderEndpointDefinitions

/** 把未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}

/** 校验创建工作单的必填字段。 */
function validateCreateWorkOrderBody(body: Record<string, any>) {
  if (!asOptionalString(body.title)) {
    return errorResponse('工作单标题不能为空', '400')
  }

  if (!asOptionalString(body.type)) {
    return errorResponse('工作单类型不能为空', '400')
  }

  if (!asOptionalString(body.priority)) {
    return errorResponse('优先级不能为空', '400')
  }

  if (!asOptionalString(body.content)) {
    return errorResponse('工作内容不能为空', '400')
  }

  if (!asOptionalString(body.planStartTime) || !asOptionalString(body.planEndTime)) {
    return errorResponse('计划时间不能为空', '400')
  }

  if (!asOptionalString(body.communityId)) {
    return errorResponse('小区ID不能为空', '400')
  }

  return undefined
}
