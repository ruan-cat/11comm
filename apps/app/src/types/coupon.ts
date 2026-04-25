/**
 * 优惠券核销模块类型定义
 */

/** 优惠券核销记录 */
export interface CouponWriteOffOrder {
  uoId: string
  couponQrcode: string
  couponName: string
  value: string
  userName: string
  tel: string
  createTime: string
  remark: string
}

/** 预约核销记录 */
export interface ReserveWriteOffOrder {
  orderId: string
  reserveQrcode: string
  goodsName: string
  quantity: number
  appointmentTime: string
  hours: string
  personName: string
  personTel: string
  createTime: string
}

/** 积分设置 */
export interface IntegralSetting {
  settingId: string
  settingName: string
  onceMaxIntegral: number
}

/** 积分核销记录 */
export interface IntegralWriteOffLog {
  logId: string
  ownerName: string
  ownerTel: string
  integral: number
  operatorName: string
  createTime: string
  remark?: string
}

/** 积分核销参数 */
export interface UseIntegralParams {
  communityId: string
  ownerName: string
  ownerTel: string
  integral: number
  remark?: string
}
