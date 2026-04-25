import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { ItemReleaseModuleRepository } from './repository.ts'
import { createPaginationResponse } from '../../shared/runtime/common-utils.ts'
import { successResponse } from '../../shared/runtime/response-builder.ts'
import { itemReleaseMockRepository } from './repository.ts'

/** 创建 `item-release` 模块的共享 endpoint 定义。 */
export function createItemReleaseEndpointDefinitions(
  repository: ItemReleaseModuleRepository = itemReleaseMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/itemRelease.queryUndoItemReleaseV2',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.queryUndoItemRelease({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
      }), '查询成功'),
    },
    {
      url: '/app/itemRelease.queryFinishItemReleaseV2',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.queryFinishItemRelease({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
      }), '查询成功'),
    },
    {
      url: '/app/itemRelease.getItemRelease',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(createPaginationResponse(
        repository.getItemRelease(String(params.irId || '')),
        Number(params.page) || 1,
        Number(params.row) || 1,
      ), '查询成功'),
    },
    {
      url: '/app/itemRelease.getItemReleaseRes',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(createPaginationResponse(
        repository.getItemReleaseRes(String(params.irId || '')),
        Number(params.page) || 1,
        Number(params.row) || 20,
      ), '查询成功'),
    },
    {
      url: '/app/itemRelease.queryOaWorkflowUser',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(createPaginationResponse(
        repository.queryOaWorkflowUser(String(params.id || '')),
        Number(params.page) || 1,
        Number(params.row) || 20,
      ), '查询成功'),
    },
    {
      url: '/app/itemRelease.auditItemRelease',
      method: 'POST',
      handler: ({ body }) => {
        repository.auditItemRelease({
          irId: String(body?.irId || ''),
          flowId: String(body?.flowId || ''),
          taskId: String(body?.taskId || ''),
          auditCode: String(body?.auditCode || '1100') as '1100' | '1200',
          auditMessage: String(body?.auditMessage || ''),
        })

        return successResponse({ success: true }, '审核完成')
      },
    },
  ]
}

/** 默认共享的 item-release endpoint 集合。 */
export const itemReleaseEndpointDefinitions = createItemReleaseEndpointDefinitions()
