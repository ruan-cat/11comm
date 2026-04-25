import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { OwnerModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { ownerMockRepository } from './repository.ts'

/** 创建 `owner` 模块的共享 endpoint 定义。 */
export function createOwnerEndpointDefinitions(
  repository: OwnerModuleRepository = ownerMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/owner.queryOwnerAndMembers',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.queryOwners({
        communityId: asOptionalString(params.communityId) || 'COMM_001',
        link: asOptionalString(params.link),
        memberId: asOptionalString(params.memberId),
        name: asOptionalString(params.name),
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        roomName: asOptionalString(params.roomName),
      }), '查询成功'),
    },
    {
      url: '/app/owner.saveRoomOwner',
      method: ['POST'],
      handler: ({ body }) => {
        if (!body?.name || !body?.link || !body?.communityId) {
          return errorResponse('参数不完整', '400')
        }

        const owner = repository.saveOwner(body as Parameters<OwnerModuleRepository['saveOwner']>[0])
        return successResponse({ memberId: owner.memberId }, '保存成功')
      },
    },
    {
      url: '/app/owner.editOwner',
      method: ['POST'],
      handler: ({ body }) => {
        if (!body?.memberId) {
          return errorResponse('memberId 不能为空', '400')
        }

        const owner = repository.updateOwner(body as Parameters<OwnerModuleRepository['updateOwner']>[0])
        if (!owner) {
          return errorResponse('业主不存在', '404')
        }

        return successResponse({ memberId: owner.memberId }, '修改成功')
      },
    },
    {
      url: '/app/owner.deleteOwner',
      method: ['POST'],
      handler: ({ body }) => {
        if (!body?.memberId) {
          return errorResponse('memberId 不能为空', '400')
        }

        const success = repository.deleteOwner(String(body.memberId))
        if (!success) {
          return errorResponse('业主不存在', '404')
        }

        return successResponse({ success: true }, '删除成功')
      },
    },
  ]
}

/** 默认共享 registry 使用的 owner 端点集合。 */
export const ownerEndpointDefinitions = createOwnerEndpointDefinitions()

/** 将未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
