/**
 * 公告模块类型定义
 */

import type { PaginationParams, StatusType } from './api'

/** 公告类型 */
export type AnnouncementType = 'NOTICE' | 'EVENT' | 'MAINTENANCE' | 'URGENT'

/** 公告信息 */
export interface Announcement {
  announcementId: string
  title: string
  content: string
  type: AnnouncementType
  publisherName: string
  publishTime: string
  effectiveTime?: string
  expiryTime?: string
  status: StatusType
  isTop: boolean
  viewCount: number
  communityId: string
  attachments?: string[]
  targetAudience?: string[]
}

/** 公告列表查询参数 */
export interface AnnouncementListParams extends PaginationParams {
  communityId?: string
  type?: AnnouncementType
  status?: StatusType
  keyword?: string
  isTop?: boolean
}
