import type { Activity, ActivityListParams, ActivityListResponse, ActivityStatus, CreateActivityReq, UpdateActivityReq } from '../../../src/types/activity.ts'
import { formatDateTime, generateChineseName, generateId, stripHtmlTags } from '../../shared/runtime/common-utils.ts'

export interface ActivityModuleRepository {
  addActivity: (activity: Activity) => boolean
  createActivity: (input: CreateActivityReq) => Activity
  getActivityById: (activitiesId: string) => Activity | undefined
  increaseLike: (activitiesId: string) => boolean
  increaseView: (activitiesId: string) => boolean
  list: (params: ActivityListParams) => ActivityListResponse
  removeActivity: (activitiesId: string) => boolean
  updateActivity: (input: UpdateActivityReq) => Activity | undefined
  updateCollect: (activitiesId: string, isCollected: boolean, collectCount: number) => Activity | null
  updateLike: (activitiesId: string, isLiked: boolean, likeCount: number) => Activity | null
  updateStatus: (activitiesId: string, status: ActivityStatus) => Activity | undefined
}

/** 创建 `activity` 模块的 mock 内存仓储。 */
export function createActivityMockRepository(): ActivityModuleRepository {
  return new ActivityDatabase()
}

class ActivityDatabase implements ActivityModuleRepository {
  private readonly activities: Activity[] = Array.from({ length: 30 }, (_, index) => this.createSeedActivity(index + 1))

  list(params: ActivityListParams): ActivityListResponse {
    let list = [...this.activities]

    if (params.communityId) {
      list = list.filter(item => item.communityId === params.communityId)
    }

    if (params.status) {
      list = list.filter(item => item.status === params.status)
    }

    if (params.activitiesId) {
      const activity = this.getActivityById(params.activitiesId)
      if (activity) {
        this.increaseView(params.activitiesId)
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

    const page = Math.max(1, Number(params.page) || 1)
    const row = Math.min(Math.max(1, Number(params.row) || 15), 100)
    const start = (page - 1) * row
    const end = start + row

    return {
      activitiess: list.slice(start, end),
      total: list.length,
      page,
      row,
    }
  }

  getActivityById(activitiesId: string) {
    return this.activities.find(activity => activity.activitiesId === activitiesId)
  }

  createActivity(input: CreateActivityReq) {
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

    this.activities.unshift(activity)
    return structuredClone(activity)
  }

  updateActivity(input: UpdateActivityReq) {
    const activity = this.getActivityById(input.activitiesId)
    if (!activity) {
      return undefined
    }

    Object.assign(activity, {
      ...input,
      updateTime: formatDateTime(),
    })

    return structuredClone(activity)
  }

  increaseView(activitiesId: string) {
    const activity = this.getActivityById(activitiesId)
    if (!activity) {
      return false
    }

    activity.viewCount += 1
    activity.updateTime = formatDateTime()
    return true
  }

  increaseLike(activitiesId: string) {
    const activity = this.getActivityById(activitiesId)
    if (!activity) {
      return false
    }

    activity.likeCount += 1
    activity.updateTime = formatDateTime()
    return true
  }

  updateLike(activitiesId: string, _isLiked: boolean, likeCount: number) {
    const activity = this.getActivityById(activitiesId)
    if (!activity) {
      return null
    }

    activity.likeCount = likeCount
    activity.updateTime = formatDateTime()
    return structuredClone(activity)
  }

  updateCollect(activitiesId: string, _isCollected: boolean, collectCount: number) {
    const activity = this.getActivityById(activitiesId)
    if (!activity) {
      return null
    }

    activity.collectCount = collectCount
    activity.updateTime = formatDateTime()
    return structuredClone(activity)
  }

  addActivity(activity: Activity) {
    this.activities.unshift(structuredClone(activity))
    return true
  }

  removeActivity(activitiesId: string) {
    const index = this.activities.findIndex(activity => activity.activitiesId === activitiesId)
    if (index === -1) {
      return false
    }

    this.activities.splice(index, 1)
    return true
  }

  updateStatus(activitiesId: string, status: ActivityStatus) {
    const activity = this.getActivityById(activitiesId)
    if (!activity) {
      return undefined
    }

    activity.status = status
    activity.updateTime = formatDateTime()
    return structuredClone(activity)
  }

  private createSeedActivity(index: number): Activity {
    const category = ['health', 'family', 'culture', 'environment', 'safety', 'social', 'festival', 'volunteer'][(index - 1) % 8]
    const status = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'][(index - 1) % 4] as ActivityStatus

    return {
      activitiesId: `ACT_${index.toString().padStart(3, '0')}`,
      title: `社区活动${index}`,
      userName: generateChineseName(),
      avatar: `https://i.pravatar.cc/150?u=${index}`,
      startTime: formatDateTime(Date.now() + index * 3600000),
      endTime: formatDateTime(Date.now() + index * 3600000 + 7200000),
      context: `<p>${category} 活动内容 ${index}</p>`,
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
}

/** 默认复用的 activity mock 仓储实例。 */
export const activityMockRepository = createActivityMockRepository()
