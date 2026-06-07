/**
 * 活动模块 Mock 接口。
 */

import type { Activity, ActivityListParams, ActivityStatus, CreateActivityReq, UpdateActivityReq } from '../../types/activity'
import { createPaginationResponse, defineUniAppMock, errorResponse, formatDateTime, generateChineseName, generateId, stripHtmlTags, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 活动 mock 数据。 */
const activities: Activity[] = Array.from({ length: 24 }, (_, index) => createSeedActivity(index + 1))

export default defineUniAppMock([
  {
    url: '/app/activities.listActivitiess',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => successResponse(listActivities(normalizeActivityListParams(getRequestParams(context))), '获取活动成功'),
  },
  {
    url: '/app/activities.saveActivities',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const validationError = validateCreateActivityBody(context.body || {})
      if (validationError) {
        return validationError
      }

      return successResponse(createActivity(normalizeCreateActivityReq(context.body || {})), '创建活动成功')
    },
  },
  {
    url: '/app/activities.updateActivities',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const activitiesId = asOptionalString(context.body?.activitiesId)
      if (!activitiesId) {
        return errorResponse('活动ID不能为空', '400')
      }

      const updated = updateActivity(normalizeUpdateActivityReq(context.body || {}))
      if (!updated) {
        return errorResponse('活动不存在', '404')
      }

      return successResponse(updated, '更新活动成功')
    },
  },
  {
    url: '/app/activities.deleteActivities',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const activitiesId = asOptionalString(context.body?.activitiesId)
      if (!activitiesId) {
        return errorResponse('活动ID不能为空', '400')
      }

      const removed = removeActivity(activitiesId)
      if (!removed) {
        return errorResponse('活动不存在', '404')
      }

      return successResponse({ success: true }, '删除活动成功')
    },
  },
  {
    url: '/app/activities.increaseView',
    method: 'POST',
    body: (context: MockContext = {}) => updateActivityCounter(context.body?.activitiesId, 'viewCount', '浏览量增加成功'),
  },
  {
    url: '/app/activities.likeActivity',
    method: 'POST',
    body: (context: MockContext = {}) => updateActivityCounter(context.body?.activitiesId, 'likeCount', '点赞成功'),
  },
  {
    url: '/app/activities.updateStatus',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const activitiesId = asOptionalString(context.body?.activitiesId)
      const status = asActivityStatus(context.body?.status)
      if (!activitiesId || !status) {
        return errorResponse('活动ID和状态不能为空', '400')
      }

      const updated = getActivityById(activitiesId)
      if (!updated) {
        return errorResponse('活动不存在', '404')
      }

      updated.status = status
      updated.updateTime = formatDateTime()

      return successResponse({ ...updated }, '活动状态更新成功')
    },
  },
  {
    url: '/app/activities.updateLike',
    method: 'POST',
    body: (context: MockContext = {}) => updateActivityToggle(
      context.body?.activitiesId,
      context.body?.isLiked,
      context.body?.likeCount,
      'likeCount',
      '点赞成功',
      '取消点赞成功',
    ),
  },
  {
    url: '/app/activities.updateCollect',
    method: 'POST',
    body: (context: MockContext = {}) => updateActivityToggle(
      context.body?.activitiesId,
      context.body?.isCollected,
      context.body?.collectCount,
      'collectCount',
      '收藏成功',
      '取消收藏成功',
    ),
  },
])

/** 创建活动种子数据。 */
function createSeedActivity(index: number): Activity {
  const status = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'][(index - 1) % 4] as ActivityStatus
  const category = ['健康', '亲子', '文化', '环保', '安全', '邻里'][(index - 1) % 6]

  return {
    activitiesId: `ACT_${index.toString().padStart(3, '0')}`,
    title: `${category}社区活动${index}`,
    userName: generateChineseName(),
    avatar: `https://i.pravatar.cc/150?u=${index}`,
    startTime: formatDateTime(Date.now() + index * 3600000),
    endTime: formatDateTime(Date.now() + index * 3600000 + 7200000),
    context: `<p>${category}活动内容 ${index}</p>`,
    headerImg: `${category}_header_${index}.jpg`,
    src: `https://picsum.photos/800/400?random=${index}`,
    communityId: 'COMM_001',
    createTime: formatDateTime(Date.now() - index * 86400000),
    updateTime: formatDateTime(),
    status,
    viewCount: index * 10,
    likeCount: index,
    readCount: index * 8,
    collectCount: Math.floor(index / 2),
  }
}

/** 查询活动列表。 */
function listActivities(params: ActivityListParams) {
  let list = [...activities]

  if (params.communityId) {
    list = list.filter(item => item.communityId === params.communityId)
  }

  if (params.status) {
    list = list.filter(item => item.status === params.status)
  }

  if (params.activitiesId) {
    const activity = getActivityById(params.activitiesId)
    if (activity) {
      activity.viewCount += 1
      list = [activity]
    }
    else {
      list = []
    }
  }

  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    list = list.filter(item =>
      item.title.toLowerCase().includes(keyword)
      || stripHtmlTags(item.context, 200).toLowerCase().includes(keyword)
      || item.userName.toLowerCase().includes(keyword))
  }

  list.sort((left, right) => Date.parse(right.createTime) - Date.parse(left.createTime))

  const result = createPaginationResponse(list, params.page, params.row)

  return {
    activitiess: result.list,
    total: result.total,
    page: result.page,
    row: result.pageSize,
  }
}

/** 创建活动。 */
function createActivity(input: CreateActivityReq): Activity {
  const activity: Activity = {
    activitiesId: generateId('ACT'),
    title: input.title,
    userName: generateChineseName(),
    avatar: `https://i.pravatar.cc/150?u=${generateId('AVATAR')}`,
    startTime: input.startTime,
    endTime: input.endTime || formatDateTime(Date.now() + 7200000),
    context: input.context,
    headerImg: input.headerImg,
    src: input.headerImg ? `/file?fileId=${input.headerImg}` : `https://picsum.photos/800/400?random=${generateId('ACT')}`,
    communityId: input.communityId || 'COMM_001',
    createTime: formatDateTime(),
    updateTime: formatDateTime(),
    status: input.status || 'UPCOMING',
    viewCount: 0,
    likeCount: 0,
    readCount: 0,
    collectCount: 0,
  }

  activities.unshift(activity)

  return { ...activity }
}

/** 更新活动基础信息。 */
function updateActivity(input: UpdateActivityReq): Activity | undefined {
  const activity = getActivityById(input.activitiesId)
  if (!activity) {
    return undefined
  }

  Object.assign(activity, {
    ...input,
    updateTime: formatDateTime(),
  })

  return { ...activity }
}

/** 删除活动。 */
function removeActivity(activitiesId: string): boolean {
  const index = activities.findIndex(activity => activity.activitiesId === activitiesId)
  if (index === -1) {
    return false
  }

  activities.splice(index, 1)

  return true
}

/** 增加活动计数。 */
function updateActivityCounter(value: unknown, field: 'likeCount' | 'viewCount', message: string) {
  const activitiesId = asOptionalString(value)
  if (!activitiesId) {
    return errorResponse('活动ID不能为空', '400')
  }

  const activity = getActivityById(activitiesId)
  if (!activity) {
    return errorResponse('活动不存在', '404')
  }

  activity[field] += 1
  activity.updateTime = formatDateTime()

  return successResponse({ success: true }, message)
}

/** 更新活动点赞或收藏状态。 */
function updateActivityToggle(
  idValue: unknown,
  toggleValue: unknown,
  countValue: unknown,
  field: 'collectCount' | 'likeCount',
  enabledMessage: string,
  disabledMessage: string,
) {
  const activitiesId = asOptionalString(idValue)
  if (!activitiesId) {
    return errorResponse('活动ID不能为空', '400')
  }

  if (typeof toggleValue !== 'boolean') {
    return errorResponse('状态参数错误', '400')
  }

  const count = Number(countValue)
  if (!Number.isFinite(count) || count < 0) {
    return errorResponse('数量参数错误', '400')
  }

  const activity = getActivityById(activitiesId)
  if (!activity) {
    return errorResponse('活动不存在', '404')
  }

  activity[field] = count
  activity.updateTime = formatDateTime()

  return successResponse({ ...activity }, toggleValue ? enabledMessage : disabledMessage)
}

/** 根据 ID 查找活动。 */
function getActivityById(activitiesId: string): Activity | undefined {
  return activities.find(activity => activity.activitiesId === activitiesId)
}

/** 校验活动创建请求。 */
function validateCreateActivityBody(body: Record<string, unknown>) {
  if (!asOptionalString(body.title)) {
    return errorResponse('活动标题不能为空', '400')
  }

  if (!asOptionalString(body.startTime)) {
    return errorResponse('活动开始时间不能为空', '400')
  }

  if (!asOptionalString(body.context)) {
    return errorResponse('活动内容不能为空', '400')
  }

  return undefined
}

/** 归一化活动列表查询参数。 */
function normalizeActivityListParams(params: Record<string, unknown>): ActivityListParams {
  return {
    page: asPositiveNumber(params.page, 1),
    row: asPositiveNumber(params.row, 15),
    communityId: asOptionalString(params.communityId) || '',
    activitiesId: asOptionalString(params.activitiesId),
    keyword: asOptionalString(params.keyword),
    status: asActivityStatus(params.status),
  }
}

/** 归一化活动创建请求。 */
function normalizeCreateActivityReq(body: Record<string, unknown>): CreateActivityReq {
  return {
    title: asOptionalString(body.title) || '',
    context: asOptionalString(body.context) || '',
    startTime: asOptionalString(body.startTime) || '',
    endTime: asOptionalString(body.endTime) || '',
    headerImg: asOptionalString(body.headerImg),
    communityId: asOptionalString(body.communityId),
    status: asActivityStatus(body.status),
  }
}

/** 归一化活动更新请求。 */
function normalizeUpdateActivityReq(body: Record<string, unknown>): UpdateActivityReq {
  return {
    ...normalizeCreateActivityReq(body),
    activitiesId: asOptionalString(body.activitiesId) || '',
  }
}

/** 将未知值收敛为活动状态。 */
function asActivityStatus(value: unknown): ActivityStatus | undefined {
  const text = asOptionalString(value)
  return text === 'UPCOMING' || text === 'ONGOING' || text === 'COMPLETED' || text === 'CANCELLED'
    ? text
    : undefined
}

/** 合并 Vite mock 的 query、body 与 params。 */
function getRequestParams(context: MockContext): Record<string, unknown> {
  return {
    ...(context.query || {}),
    ...(context.body || {}),
    ...(context.params || {}),
  }
}

/** 将未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}

/** 将未知值收敛为正数。 */
function asPositiveNumber(value: unknown, fallback: number): number {
  const numberValue = Number(asOptionalString(value))

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback
}
