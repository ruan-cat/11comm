/**
 * 优惠券核销模块 API
 */

import type { PaginationResponse } from '@/types/api'
import type {
  CouponWriteOffOrder,
  IntegralSetting,
  IntegralWriteOffLog,
  ReserveWriteOffOrder,
  UseIntegralParams,
} from '@/types/coupon'
import { http } from '@/http/alova'

/** 查询优惠券核销记录 */
export function listCouponPropertyUserDetail(params: {
  page: number
  row: number
  communityId: string
  couponQrcode?: string
}) {
  return http.Get<PaginationResponse<CouponWriteOffOrder>>('/app/couponProperty.listCouponPropertyUserDetail', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 核销优惠券 */
export function writeOffCouponPropertyUser(data: {
  couponQrcode: string
  communityId: string
  giftCount: number
}) {
  return http.Post<{ success: boolean }>('/app/couponProperty.writeOffCouponPropertyUser', data, {
    meta: { ignoreAuth: true },
  })
}

/** 查询积分核销配置 */
export function listIntegralSetting(params: { page: number, row: number, communityId: string }) {
  return http.Get<IntegralSetting[]>('/app/integral.listIntegralSetting', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 积分核销 */
export function useIntegral(data: UseIntegralParams) {
  return http.Post<{ success: boolean }>('/app/integral.useIntegral', data, {
    meta: { ignoreAuth: true },
  })
}

/** 查询积分核销记录 */
export function listIntegralUserDetail(params: {
  page: number
  row: number
  communityId: string
  ownerTel?: string
}) {
  return http.Get<PaginationResponse<IntegralWriteOffLog>>('/app/integral.listIntegralUserDetail', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 查询预约核销记录 */
export function listReserveGoodsConfirmOrder(params: {
  page: number
  row: number
  communityId: string
  reserveQrcode?: string
}) {
  return http.Get<PaginationResponse<ReserveWriteOffOrder>>('/app/reserveOrder.listReserveGoodsConfirmOrder', {
    params,
    meta: { ignoreAuth: true },
  })
}

/** 核销预约 */
export function saveReserveGoodsConfirmOrder(data: { timeId: string, communityId: string }) {
  return http.Post<{ success: boolean }>('/app/reserveOrder.saveReserveGoodsConfirmOrder', data, {
    meta: { ignoreAuth: true },
  })
}
