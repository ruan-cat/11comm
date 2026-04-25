import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { ProfileModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { profileMockRepository } from './repository.ts'

/** 创建 `profile` 模块的共享 endpoint 定义。 */
export function createProfileEndpointDefinitions(
  repository: ProfileModuleRepository = profileMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/profile.getUserProfile',
      method: ['GET', 'POST'],
      handler: () => successResponse(repository.getProfile(), '查询成功'),
    },
    {
      url: '/app/profile.listCommunities',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.listCommunities(optionalString(params.keyword)), '查询成功'),
    },
    {
      url: '/app/profile.changeCommunity',
      method: 'POST',
      handler: ({ body }) => {
        const communityId = optionalString(body?.communityId)
        if (!communityId) {
          return errorResponse('目标小区不存在', '404')
        }

        const success = repository.changeCommunity(communityId)
        if (!success) {
          return errorResponse('目标小区不存在', '404')
        }

        return successResponse({ success: true }, '切换成功')
      },
    },
    {
      url: '/app/profile.changePassword',
      method: 'POST',
      handler: ({ body }) => {
        const oldPwd = optionalString(body?.oldPwd)
        const newPwd = optionalString(body?.newPwd)
        if (!oldPwd || !newPwd) {
          return errorResponse('参数不完整', '400')
        }

        return successResponse({ success: repository.changePassword(oldPwd, newPwd) }, '修改成功')
      },
    },
    {
      url: '/app/profile.listAttendanceRecords',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(
        repository.listAttendanceRecords(optionalString(params.month) || currentMonth()),
        '查询成功',
      ),
    },
  ]
}

/** 导出默认的 profile endpoint 集合。 */
export const profileEndpointDefinitions = createProfileEndpointDefinitions()

function optionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined
  }

  const text = `${value}`.trim()
  return text || undefined
}

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7)
}
