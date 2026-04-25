import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { ComplaintModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { complaintMockRepository } from './repository.ts'

/** 创建 `complaint` 模块的共享 endpoint 定义。 */
export function createComplaintEndpointDefinitions(
  repository: ComplaintModuleRepository = complaintMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/auditUser.listAuditComplaints',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.listAuditComplaints({
        page: Number(params.page) || 1,
        row: Number(params.row) || 15,
        process: asOptionalString(params.process),
      }), '获取待办投诉列表成功'),
    },
    {
      url: '/app/auditUser.listAuditHistoryComplaints',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.listAuditHistoryComplaints({
        page: Number(params.page) || 1,
        row: Number(params.row) || 15,
        process: asOptionalString(params.process),
      }), '获取投诉历史成功'),
    },
    {
      url: '/app/complaint',
      method: 'POST',
      handler: ({ body }) => {
        const validationError = validateComplaintBody(body || {})
        if (validationError) {
          return validationError
        }

        return successResponse(repository.saveComplaint(body || {}), '投诉提交成功')
      },
    },
    {
      url: '/app/complaint.auditComplaint',
      method: 'POST',
      handler: ({ body }) => {
        const complaintId = asOptionalString(body?.complaintId)
        if (!complaintId) {
          return errorResponse('投诉ID不能为空', '400')
        }

        if (!asOptionalString(body?.context) && !asOptionalString(body?.remark)) {
          return errorResponse('请填写处理意见', '400')
        }

        const handled = repository.auditComplaint({
          complaintId,
          context: asOptionalString(body?.context),
          remark: asOptionalString(body?.remark),
          state: asOptionalString(body?.state),
        })

        if (!handled) {
          return errorResponse('投诉记录不存在', '404')
        }

        return successResponse({ success: true }, '投诉处理成功')
      },
    },
    {
      url: '/app/complaint.listComplaintEvent',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const complaintId = asOptionalString(params.complaintId)
        if (!complaintId) {
          return errorResponse('投诉ID不能为空', '400')
        }

        return successResponse(repository.listComplaintEvent(
          complaintId,
          Number(params.page) || 1,
          Number(params.row) || 100,
        ), '获取投诉事件成功')
      },
    },
    {
      url: '/app/complaintAppraise.listComplaintAppraise',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const complaintId = asOptionalString(params.complaintId)
        if (!complaintId) {
          return errorResponse('投诉ID不能为空', '400')
        }

        return successResponse(repository.listComplaintAppraise(
          complaintId,
          Number(params.page) || 1,
          Number(params.row) || 100,
        ), '获取投诉评价成功')
      },
    },
    {
      url: '/app/complaintAppraise.replyComplaintAppraise',
      method: 'POST',
      handler: ({ body }) => {
        const appraiseId = asOptionalString(body?.appraiseId)
        if (!appraiseId) {
          return errorResponse('评价ID不能为空', '400')
        }

        const replyContext = asOptionalString(body?.replyContext)
        if (!replyContext) {
          return errorResponse('请填写回复内容', '400')
        }

        repository.replyComplaintAppraise(appraiseId, replyContext)
        return successResponse({ success: true }, '回复评价成功')
      },
    },
  ]
}

/** 默认共享的 complaint endpoint 集合。 */
export const complaintEndpointDefinitions = createComplaintEndpointDefinitions()

function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}

function validateComplaintBody(body: Record<string, any>) {
  if (!asOptionalString(body.typeCd)) {
    return errorResponse('请选择投诉类型', '400')
  }

  if (!asOptionalString(body.complaintName)) {
    return errorResponse('请填写投诉人', '400')
  }

  if (!asOptionalString(body.tel)) {
    return errorResponse('请填写手机号', '400')
  }

  if (!asOptionalString(body.context)) {
    return errorResponse('请填写投诉内容', '400')
  }

  if (!asOptionalString(body.roomId)) {
    return errorResponse('请选择房屋信息', '400')
  }

  return undefined
}
