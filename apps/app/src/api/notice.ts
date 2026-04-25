/**
 * 公告模块 API
 */

import type { NoticeListParams, NoticeListResponse } from '@/types/notice'
import { http } from '@/http/alova'

/** 查询公告列表/详情 */
export function queryNotices(params: NoticeListParams) {
  return http.Get<NoticeListResponse>('/app/notice.listNotices', {
    params,
    meta: { ignoreAuth: true },
  })
}
