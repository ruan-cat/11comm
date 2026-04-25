/**
 * 访客模块 API
 */

import type { PaginationResponse } from '@/types/api'
import type { AuditVisitParams, VisitDetail, VisitRecord } from '@/types/visit'
import { http } from '@/http/alova'

/** 查询访客列表 */
export function getVisit(params: {
  page: number
  row: number
  communityId: string
  state?: string
  visitId?: string
}) {
  return http.Get<PaginationResponse<VisitRecord>>('/app/visit.getVisit', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 查询访客详情 */
export function getVisitDetail(params: { page: number, row: number, visitId: string, communityId: string }) {
  return http.Get<PaginationResponse<VisitDetail>>('/app/visit.getVisitDetail', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 审核访客申请 */
export function auditVisit(data: AuditVisitParams) {
  return http.Post<{ success: boolean }>('/app/visit.auditVisit', data, {
    meta: { ignoreAuth: true },
  })
}
