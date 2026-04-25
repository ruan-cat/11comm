/**
 * 物品放行模块 API
 */

import type { PaginationResponse } from '@/types/api'
import type {
  AuditItemReleaseParams,
  ItemReleaseComment,
  ItemReleaseDetail,
  ItemReleaseResource,
  ItemReleaseTask,
} from '@/types/item-release'
import { http } from '@/http/alova'

/** 查询待办放行任务 */
export function queryUndoItemRelease(params: { page: number, row: number, communityId: string }) {
  return http.Get<PaginationResponse<ItemReleaseTask>>('/app/itemRelease.queryUndoItemReleaseV2', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 查询已办放行任务 */
export function queryFinishItemRelease(params: { page: number, row: number, communityId: string }) {
  return http.Get<PaginationResponse<ItemReleaseTask>>('/app/itemRelease.queryFinishItemReleaseV2', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 查询放行详情 */
export function getItemRelease(params: { page: number, row: number, irId: string, communityId: string }) {
  return http.Get<PaginationResponse<ItemReleaseDetail>>('/app/itemRelease.getItemRelease', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 查询放行物品明细 */
export function getItemReleaseRes(params: { page: number, row: number, irId: string, communityId: string }) {
  return http.Get<PaginationResponse<ItemReleaseResource>>('/app/itemRelease.getItemReleaseRes', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 查询放行审批记录 */
export function queryItemReleaseComment(params: {
  page: number
  row: number
  id: string
  flowId: string
  communityId: string
}) {
  return http.Get<PaginationResponse<ItemReleaseComment>>('/app/itemRelease.queryOaWorkflowUser', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 审核放行申请 */
export function auditItemRelease(data: AuditItemReleaseParams) {
  return http.Post<{ success: boolean }>('/app/itemRelease.auditItemRelease', data, {
    meta: { ignoreAuth: true },
  })
}
