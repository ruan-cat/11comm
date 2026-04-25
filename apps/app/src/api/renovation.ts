/**
 * 装修管理 API
 */

import type { PaginationResponse } from '@/types/api'
import type {
  RenovationApplication,
  RenovationExaminePayload,
  RenovationQueryParams,
  RenovationRecord,
  RenovationRecordMedia,
  RenovationRecordQueryParams,
  SaveRenovationRecordPayload,
} from '@/types/property-management'
import { http } from '@/http/alova'

/** 查询装修申请列表 */
export function queryRoomRenovation(params: RenovationQueryParams) {
  return http.Get<PaginationResponse<RenovationApplication>>('/app/roomRenovation/queryRoomRenovation', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}

/** 提交装修审核 */
export function updateRoomToExamine(data: RenovationExaminePayload) {
  return http.Post<{ success: boolean }>('/app/roomRenovation/updateRoomToExamine', data, {
    meta: {
      ignoreAuth: true,
    },
  })
}

/** 提交装修验收 */
export function saveRoomRenovationDetail(data: RenovationExaminePayload) {
  return http.Post<{ success: boolean }>('/app/roomRenovation/saveRoomRenovationDetail', data, {
    meta: {
      ignoreAuth: true,
    },
  })
}

/** 装修完成 */
export function updateRoomRenovationState(data: { rId: string, communityId: string }) {
  return http.Post<{ success: boolean }>('/app/roomRenovation/updateRoomRenovationState', data, {
    meta: {
      ignoreAuth: true,
    },
  })
}

/** 查询装修跟踪记录 */
export function queryRoomRenovationRecord(params: RenovationRecordQueryParams) {
  return http.Get<PaginationResponse<RenovationRecord>>('/app/roomRenovation/queryRoomRenovationRecord', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}

/** 查询装修跟踪记录详情 */
export function queryRoomRenovationRecordDetail(params: {
  page: number
  row: number
  communityId: string
  recordId: string
  roomName?: string
  roomId?: string
}) {
  return http.Get<RenovationRecordMedia[]>('/app/roomRenovation/queryRoomRenovationRecordDetail', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}

/** 添加装修跟踪记录 */
export function updateRoomDecorationRecord(data: SaveRenovationRecordPayload) {
  return http.Post<{ success: boolean }>('/app/roomRenovation/updateRoomDecorationRecord', data, {
    meta: {
      ignoreAuth: true,
    },
  })
}

/** 删除装修跟踪记录 */
export function deleteRoomRenovationRecord(data: { recordId: string, communityId: string }) {
  return http.Post<{ success: boolean }>('/app/roomRenovation/deleteRoomRenovationRecord', data, {
    meta: {
      ignoreAuth: true,
    },
  })
}
