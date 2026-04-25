/**
 * 抄表模块 API
 */

import type { PaginationResponse } from '@/types/api'
import type {
  FeeConfigItem,
  FeeTypeItem,
  FloorShareMeter,
  FloorShareReading,
  MeterReading,
  MeterTypeItem,
} from '@/types/meter'
import { http } from '@/http/alova'

/** 查询抄表记录 */
export function listMeterWaters(params: { page: number, row: number, communityId: string, roomNum?: string }) {
  return http.Get<PaginationResponse<MeterReading>>('/app/meter.listMeterWaters', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 查询费用类型 */
export function queryFeeTypes() {
  return http.Get<FeeTypeItem[]>('/app/meter.queryFeeTypes', {
    meta: { ignoreAuth: true },
  })
}

/** 查询费用项 */
export function queryFeeConfigs(params: { feeTypeCd: string, communityId: string }) {
  return http.Get<FeeConfigItem[]>('/app/meter.queryFeeTypesItems', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 查询抄表类型 */
export function listMeterType(params: { page: number, row: number, communityId: string }) {
  return http.Get<MeterTypeItem[]>('/app/meter.listMeterType', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 查询上期读数 */
export function queryPreMeterWater(params: { communityId: string, objId: string, meterType: string }) {
  return http.Get<{ curDegrees: number, curReadingTime: string }>('/app/meter.queryPreMeterWater', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 保存抄表 */
export function saveMeterWater(data: {
  communityId: string
  configId: string
  objId: string
  objName: string
  meterType: string
  preDegrees: number
  curDegrees: number
  preReadingTime: string
  curReadingTime: string
  remark?: string
}) {
  return http.Post<{ success: boolean }>('/app/meter.saveMeterWater', data, {
    meta: { ignoreAuth: true },
  })
}

/** 查询公摊抄表记录 */
export function listFloorShareReadings(params: { page: number, row: number, communityId: string }) {
  return http.Get<PaginationResponse<FloorShareReading>>('/app/meter.listFloorShareReading', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 查询公摊表 */
export function listFloorShareMeters(params: { page: number, row: number, communityId: string, fsmId?: string }) {
  return http.Get<PaginationResponse<FloorShareMeter>>('/app/meter.listFloorShareMeter', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 保存公摊抄表 */
export function saveFloorShareReading(data: {
  communityId: string
  fsmId: string
  preDegrees: number
  curDegrees: number
  preReadingTime: string
  curReadingTime: string
  remark?: string
}) {
  return http.Post<{ success: boolean }>('/app/meter.saveFloorShareReading', data, {
    meta: { ignoreAuth: true },
  })
}

/** 审核公摊抄表 */
export function auditFloorShareReading(data: {
  state: 'C' | 'F'
  auditRemark: string
  readingId: string
  communityId: string
}) {
  return http.Post<{ success: boolean }>('/app/meter.auditFloorShareReading', data, {
    meta: { ignoreAuth: true },
  })
}
