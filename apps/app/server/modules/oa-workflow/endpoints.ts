import type {
  OaWorkflowAuditReq,
  SaveOaWorkflowFormDataReq,
  UpdateOaWorkflowFormDataReq,
} from '../../../src/types/oa-workflow.ts'
import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { OaWorkflowModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { oaWorkflowMockRepository } from './repository.ts'

/** 创建 `oa-workflow` 模块的共享 endpoint 定义。 */
export function createOaWorkflowEndpointDefinitions(
  repository: OaWorkflowModuleRepository = oaWorkflowMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/oa/workflow/query',
      method: ['GET', 'POST'],
      handler: () => successResponse({ data: repository.getWorkflowFlows() }, '查询成功'),
    },
    {
      url: '/app/oa/workflow/form/query',
      method: ['GET', 'POST'],
      handler: ({ params }) => {
        const flowId = asOptionalString(params.flowId)
        const form = flowId ? repository.getForm(flowId) : undefined
        if (!form) {
          return errorResponse('流程或表单不存在', '404')
        }

        return successResponse({ data: [form] }, '查询成功')
      },
    },
    {
      url: '/app/oa/workflow/form/data/query',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getFormData({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        flowId: asOptionalString(params.flowId) || '',
        id: asOptionalString(params.id),
      }), '查询成功'),
    },
    {
      url: '/app/oa/workflow/form/save',
      method: 'POST',
      handler: ({ body }) => {
        const requestData = body as SaveOaWorkflowFormDataReq
        if (!requestData.flowId) {
          return errorResponse('flowId 不能为空', '400')
        }

        if (!requestData.formData || Object.keys(requestData.formData).length === 0) {
          return errorResponse('表单内容不能为空', '400')
        }

        const saved = repository.saveFormData(requestData)
        if (!saved) {
          return errorResponse('流程不存在', '404')
        }

        return successResponse(saved, '提交成功')
      },
    },
    {
      url: '/app/oa/workflow/form/update',
      method: 'POST',
      handler: ({ body }) => {
        const success = repository.updateFormData(body as UpdateOaWorkflowFormDataReq)
        if (!success) {
          return errorResponse('记录不存在', '404')
        }

        return successResponse({ success: true }, '保存成功')
      },
    },
    {
      url: '/app/oa/workflow/task/undo/query',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getUndoList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        flowId: asOptionalString(params.flowId) || '',
      }), '查询成功'),
    },
    {
      url: '/app/oa/workflow/task/his/query',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.getFinishList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        flowId: asOptionalString(params.flowId) || '',
      }), '查询成功'),
    },
    {
      url: '/app/oa/workflow/user/query',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse({
        data: repository.getComments(asOptionalString(params.id) || ''),
      }, '查询成功'),
    },
    {
      url: '/app/oa/workflow/image/run',
      method: ['GET', 'POST'],
      handler: () => successResponse({
        data: repository.getWorkflowImage(),
      }, '查询成功'),
    },
    {
      url: '/app/oa/workflow/task/next',
      method: ['GET', 'POST'],
      handler: () => successResponse({
        data: repository.getNextTask(),
      }, '查询成功'),
    },
    {
      url: '/app/oa/workflow/audit',
      method: 'POST',
      handler: ({ body }) => {
        const success = repository.submitAudit(body as OaWorkflowAuditReq)
        if (!success) {
          return errorResponse('记录不存在', '404')
        }

        return successResponse({ success: true }, '提交成功')
      },
    },
    {
      url: '/app/oa/workflow/undo/next-deal-user',
      method: ['GET', 'POST'],
      handler: () => successResponse({
        data: repository.getNextTask(),
      }, '查询成功'),
    },
    {
      url: '/app/oa/workflow/undo/audit',
      method: 'POST',
      handler: ({ body }) => {
        const success = repository.submitAudit(body as OaWorkflowAuditReq)
        if (!success) {
          return errorResponse('记录不存在', '404')
        }

        return successResponse({ success: true }, '提交成功')
      },
    },
  ]
}

/** 默认供 shared registry 直接注册的 oa-workflow 端点集合。 */
export const oaWorkflowEndpointDefinitions = createOaWorkflowEndpointDefinitions()

/** oa-workflow 当前没有 legacy URL 冲突，可直接进入 Nitro 优先层。 */
export const oaWorkflowRuntimeEndpointDefinitions = oaWorkflowEndpointDefinitions

/** 把未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
