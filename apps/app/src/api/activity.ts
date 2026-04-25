import type {
  Activity,
  ActivityListParams,
  ActivityListResponse,
  CreateActivityReq,
  UpdateActivityReq,
} from '@/types/activity'
import { http } from '@/http/alova'

/**
 * 活动管理相关 API 接口
 */

/** 获取活动详情 */
export function getActivityDetail(params: ActivityListParams) {
  return http.Get<ActivityListResponse>('/app/activities.listActivitiess', { params })
}

/** 获取活动列表 */
export function getActivityList(params: Omit<ActivityListParams, 'activitiesId'>) {
  return http.Get<ActivityListResponse>('/app/activities.listActivitiess', { params })
}

/** 创建活动 */
export function createActivity(data: CreateActivityReq) {
  return http.Post<Activity>('/app/activities.saveActivities', data)
}

/** 更新活动 */
export function updateActivity(data: UpdateActivityReq) {
  return http.Post<Activity>('/app/activities.updateActivities', data)
}

/** 删除活动 */
export function deleteActivity(activitiesId: string) {
  return http.Delete<{ success: boolean }>('/app/activities.deleteActivities', {
    params: { activitiesId },
  })
}

/** 增加活动浏览量 */
export function increaseActivityView(activitiesId: string) {
  return http.Post<{ success: boolean }>('/app/activities.increaseView', {
    activitiesId,
  })
}

/** 更新活动点赞状态响应类型 */
export interface UpdateActivityLikeResponse {
  activitiesId: string
  isLiked: boolean
  likeCount: number
  updateTime: string
}

/** 更新活动收藏状态响应类型 */
export interface UpdateActivityCollectResponse {
  activitiesId: string
  isCollected: boolean
  collectCount: number
  updateTime: string
}

/** 更新活动点赞状态 */
export function updateActivityLike(params: { activitiesId: string, isLiked: boolean, likeCount: number }) {
  return http.Post<UpdateActivityLikeResponse>('/app/activities.updateLike', params)
}

/** 更新活动收藏状态 */
export function updateActivityCollect(params: { activitiesId: string, isCollected: boolean, collectCount: number }) {
  return http.Post<UpdateActivityCollectResponse>('/app/activities.updateCollect', params)
}
