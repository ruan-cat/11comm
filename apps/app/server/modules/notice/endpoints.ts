import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { NoticeModuleRepository } from './repository.ts'
import { successResponse } from '../../shared/runtime/response-builder.ts'
import { noticeMockRepository } from './repository.ts'

/** 创建 `notice` 模块的共享 endpoint 定义。 */
export function createNoticeEndpointDefinitions(
  repository: NoticeModuleRepository = noticeMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/notice.listNotices',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.listNotices({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: String(params.communityId || ''),
        noticeTypeCd: optionalString(params.noticeTypeCd),
        noticeId: optionalString(params.noticeId),
        titleLike: optionalString(params.titleLike),
      }), '查询成功'),
    },
  ]
}

/** 导出默认的 notice endpoint 集合。 */
export const noticeEndpointDefinitions = createNoticeEndpointDefinitions()

function optionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined
  }

  const text = `${value}`.trim()
  return text || undefined
}
