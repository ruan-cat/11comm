/**
 * 公告模块类型定义
 */

/** 公告信息 */
export interface NoticeItem {
  noticeId: string
  title: string
  context: string
  startTime: string
  timeStr?: string
  noticeTypeCd: string
  communityId: string
}

/** 公告列表查询参数 */
export interface NoticeListParams {
  page: number
  row: number
  communityId: string
  noticeTypeCd?: string
  noticeId?: string
  titleLike?: string
}

/** 公告列表响应结构 */
export interface NoticeListResponse {
  notices: NoticeItem[]
  total: number
  page: number
  row: number
}
