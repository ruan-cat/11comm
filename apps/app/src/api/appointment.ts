/**
 * 预约核销模块 API
 */

import type { PaginationResponse } from '@/types/api'
import type { AppointmentOrder, AppointmentOrderQueryParams } from '@/types/appointment'
import { http } from '@/http/alova'

/** 查询预约核销订单 */
export function listCommunitySpaceConfirmOrder(params: AppointmentOrderQueryParams) {
  return http.Get<PaginationResponse<AppointmentOrder>>('/app/communitySpace.listCommunitySpaceConfirmOrder', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 核销预约订单 */
export function saveCommunitySpaceConfirmOrder(data: { timeId: string, communityId: string }) {
  return http.Post<{ success: boolean }>('/app/communitySpace.saveCommunitySpaceConfirmOrder', data, {
    meta: { ignoreAuth: true },
  })
}
