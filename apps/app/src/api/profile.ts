/**
 * 我的模块 API
 */

import type {
  AttendanceDayRecord,
  AttendanceQueryParams,
  CommunityInfo,
  ProfileInfo,
} from '@/types/profile'
import { http } from '@/http/alova'

/** 查询当前用户信息 */
export function getProfileInfo() {
  return http.Get<ProfileInfo>('/app/profile.getUserProfile', {
    meta: { ignoreAuth: true },
  })
}

/** 查询可切换小区 */
export function listProfileCommunities(params: { keyword?: string }) {
  return http.Get<CommunityInfo[]>('/app/profile.listCommunities', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 切换当前小区 */
export function changeCurrentCommunity(data: { communityId: string }) {
  return http.Post<{ success: boolean }>('/app/profile.changeCommunity', data, {
    meta: { ignoreAuth: true },
  })
}

/** 修改密码 */
export function changeProfilePassword(data: { oldPwd: string, newPwd: string }) {
  return http.Post<{ success: boolean }>('/app/profile.changePassword', data, {
    meta: { ignoreAuth: true },
  })
}

/** 查询员工考勤 */
export function queryAttendanceRecords(params: AttendanceQueryParams) {
  return http.Get<AttendanceDayRecord[]>('/app/profile.listAttendanceRecords', {
    params,
    meta: { ignoreAuth: true },
  })
}
