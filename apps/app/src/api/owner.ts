/**
 * 业主管理 API
 */

import type { PaginationResponse } from '@/types/api'
import type {
  OwnerMember,
  OwnerQueryParams,
  SaveOwnerPayload,
  UpdateOwnerPayload,
} from '@/types/property-management'
import { http } from '@/http/alova'

/** 查询业主列表 */
export function queryOwnerAndMembers(params: OwnerQueryParams) {
  return http.Get<PaginationResponse<OwnerMember>>('/app/owner.queryOwnerAndMembers', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}

/** 保存业主 */
export function saveRoomOwner(data: SaveOwnerPayload) {
  return http.Post<{ memberId: string }>('/app/owner.saveRoomOwner', data, {
    meta: {
      ignoreAuth: true,
    },
  })
}

/** 修改业主 */
export function updateRoomOwner(data: UpdateOwnerPayload) {
  return http.Post<{ memberId: string }>('/app/owner.editOwner', data, {
    meta: {
      ignoreAuth: true,
    },
  })
}

/** 删除业主 */
export function deleteOwner(data: { memberId: string, communityId: string }) {
  return http.Post<{ success: boolean }>('/app/owner.deleteOwner', data, {
    meta: {
      ignoreAuth: true,
    },
  })
}
