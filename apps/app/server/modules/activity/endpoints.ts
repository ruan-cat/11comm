import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { ActivityModuleRepository } from './repository.ts'
import { errorResponse, successResponse } from '../../shared/runtime/response-builder.ts'
import { activityMockRepository } from './repository.ts'

/** 创建 `activity` 模块的共享 endpoint 定义。 */
export function createActivityEndpointDefinitions(
  repository: ActivityModuleRepository = activityMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/activities.listActivitiess',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.list({
        page: Number(params.page) || 1,
        row: Number(params.row) || 15,
        communityId: String(params.communityId || ''),
        activitiesId: asOptionalString(params.activitiesId),
        keyword: asOptionalString(params.keyword),
        status: asOptionalString(params.status) as any,
      }), '获取活动成功'),
    },
    {
      url: '/app/activities.saveActivities',
      method: 'POST',
      handler: ({ body }) => {
        if (!asOptionalString(body?.title)) {
          return errorResponse('活动标题不能为空', '400')
        }
        if (!asOptionalString(body?.startTime)) {
          return errorResponse('活动开始时间不能为空', '400')
        }
        if (!asOptionalString(body?.context)) {
          return errorResponse('活动内容不能为空', '400')
        }

        return successResponse(repository.createActivity({
          title: String(body?.title || ''),
          context: String(body?.context || ''),
          startTime: String(body?.startTime || ''),
          endTime: String(body?.endTime || ''),
          headerImg: asOptionalString(body?.headerImg),
          communityId: asOptionalString(body?.communityId),
          status: asOptionalString(body?.status) as any,
        }), '创建活动成功')
      },
    },
    {
      url: '/app/activities.updateActivities',
      method: 'POST',
      handler: ({ body }) => {
        const activitiesId = asOptionalString(body?.activitiesId)
        if (!activitiesId) {
          return errorResponse('活动ID不能为空', '400')
        }

        const updated = repository.updateActivity({
          activitiesId,
          title: String(body?.title || ''),
          context: String(body?.context || ''),
          startTime: String(body?.startTime || ''),
          endTime: String(body?.endTime || ''),
          headerImg: asOptionalString(body?.headerImg),
          communityId: asOptionalString(body?.communityId),
          status: asOptionalString(body?.status) as any,
        })

        if (!updated) {
          return errorResponse('活动不存在', '404')
        }

        return successResponse(updated, '更新活动成功')
      },
    },
    {
      url: '/app/activities.deleteActivities',
      method: 'POST',
      handler: ({ body }) => {
        const activitiesId = asOptionalString(body?.activitiesId)
        if (!activitiesId) {
          return errorResponse('活动ID不能为空', '400')
        }

        const removed = repository.removeActivity(activitiesId)
        if (!removed) {
          return errorResponse('活动不存在', '404')
        }

        return successResponse({ success: true }, '删除活动成功')
      },
    },
    {
      url: '/app/activities.increaseView',
      method: 'POST',
      handler: ({ body }) => {
        const activitiesId = asOptionalString(body?.activitiesId)
        if (!activitiesId) {
          return errorResponse('活动ID不能为空', '400')
        }

        const success = repository.increaseView(activitiesId)
        if (!success) {
          return errorResponse('活动不存在', '404')
        }

        return successResponse({ success: true }, '浏览量增加成功')
      },
    },
    {
      url: '/app/activities.likeActivity',
      method: 'POST',
      handler: ({ body }) => {
        const activitiesId = asOptionalString(body?.activitiesId)
        if (!activitiesId) {
          return errorResponse('活动ID不能为空', '400')
        }

        const success = repository.increaseLike(activitiesId)
        if (!success) {
          return errorResponse('活动不存在', '404')
        }

        return successResponse({ success: true }, '点赞成功')
      },
    },
    {
      url: '/app/activities.updateStatus',
      method: 'POST',
      handler: ({ body }) => {
        const activitiesId = asOptionalString(body?.activitiesId)
        const status = asOptionalString(body?.status) as any
        if (!activitiesId || !status) {
          return errorResponse('活动ID和状态不能为空', '400')
        }

        const updated = repository.updateStatus(activitiesId, status)
        if (!updated) {
          return errorResponse('活动不存在', '404')
        }

        return successResponse(updated, '活动状态更新成功')
      },
    },
    {
      url: '/app/activities.updateLike',
      method: 'POST',
      handler: ({ body }) => {
        const activitiesId = asOptionalString(body?.activitiesId)
        if (!activitiesId) {
          return errorResponse('活动ID不能为空', '400')
        }

        if (typeof body?.isLiked !== 'boolean') {
          return errorResponse('点赞状态参数错误', '400')
        }

        if (typeof body?.likeCount !== 'number' || body.likeCount < 0) {
          return errorResponse('点赞数量参数错误', '400')
        }

        const updated = repository.updateLike(activitiesId, body.isLiked, Number(body.likeCount))
        if (!updated) {
          return errorResponse('活动不存在', '404')
        }

        return successResponse(updated, body.isLiked ? '点赞成功' : '取消点赞成功')
      },
    },
    {
      url: '/app/activities.updateCollect',
      method: 'POST',
      handler: ({ body }) => {
        const activitiesId = asOptionalString(body?.activitiesId)
        if (!activitiesId) {
          return errorResponse('活动ID不能为空', '400')
        }

        if (typeof body?.isCollected !== 'boolean') {
          return errorResponse('收藏状态参数错误', '400')
        }

        if (typeof body?.collectCount !== 'number' || body.collectCount < 0) {
          return errorResponse('收藏数量参数错误', '400')
        }

        const updated = repository.updateCollect(activitiesId, body.isCollected, Number(body.collectCount))
        if (!updated) {
          return errorResponse('活动不存在', '404')
        }

        return successResponse(updated, body.isCollected ? '收藏成功' : '取消收藏成功')
      },
    },
  ]
}

/** 默认共享的 activity endpoint 集合。 */
export const activityEndpointDefinitions = createActivityEndpointDefinitions()

function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
