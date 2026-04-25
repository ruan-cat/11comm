/**
 * 视频监控模块 API
 */

import type { PaginationResponse } from '@/types/api'
import type { MonitorArea, MonitorMachine, VideoPlayUrl } from '@/types/video'
import { http } from '@/http/alova'

/** 查询监控区域 */
export function listMonitorArea(params: { page: number, row: number, communityId: string }) {
  return http.Get<PaginationResponse<MonitorArea>>('/app/video.listMonitorArea', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 查询监控设备 */
export function listStaffMonitorMachine(params: {
  page: number
  row: number
  communityId: string
  maId?: string
  machineNameLike?: string
}) {
  return http.Get<PaginationResponse<MonitorMachine>>('/app/video.listStaffMonitorMachine', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 获取播放地址 */
export function getPlayVideoUrl(params: { communityId: string, machineId: string }) {
  return http.Get<VideoPlayUrl>('/app/video.getPlayVideoUrl', {
    params,
    meta: { ignoreAuth: true },
  })
}
