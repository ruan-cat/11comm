/**
 * 活动模块类型定义
 */

import type { PaginationParams } from './api'

/**
 * 活动状态枚举
 * @description
 * - UPCOMING: 即将开始 - 活动还未开始，可以报名
 * - ONGOING: 进行中 - 活动正在进行，可以立即报名
 * - COMPLETED: 已结束 - 活动已结束，无法报名
 * - CANCELLED: 已取消 - 活动已取消，无法报名
 */
export type ActivityStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'

/** 活动基础信息 */
export interface Activity {
  activitiesId: string
  title: string
  userName: string
  avatar?: string
  startTime: string
  endTime: string
  context: string
  headerImg?: string
  src?: string
  communityId: string
  createTime: string
  updateTime: string
  status: ActivityStatus
  viewCount: number
  likeCount: number
  readCount: number
  collectCount: number
  formattedStartTime?: string
  formattedCreateTime?: string
  formattedEndTime?: string
}

/** 活动列表查询参数 */
export interface ActivityListParams extends PaginationParams {
  activitiesId?: string
  communityId: string
  status?: ActivityStatus
  keyword?: string
  startDate?: string
  endDate?: string
}

/** 活动列表响应 */
export interface ActivityListResponse {
  activitiess: Activity[]
  total: number
  page: number
  row: number
}

/** 创建活动请求 */
export interface CreateActivityReq {
  title: string
  context: string
  startTime: string
  endTime: string
  headerImg?: string
  communityId?: string
  status?: ActivityStatus
}

/** 更新活动请求 */
export interface UpdateActivityReq extends CreateActivityReq {
  activitiesId: string
}
