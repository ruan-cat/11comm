/**
 * 优惠券与积分核销模块 Mock 接口。
 */

import type {
  CouponWriteOffOrder,
  IntegralSetting,
  IntegralWriteOffLog,
  ReserveWriteOffOrder,
  UseIntegralParams,
} from '../../types/coupon'
import {
  createPaginationResponse,
  defineUniAppMock,
  formatDateTime,
  generateChineseName,
  generateId,
  generatePhoneNumber,
  successResponse,
} from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 优惠券核销记录 mock 数据。 */
const couponOrders: CouponWriteOffOrder[] = Array.from({ length: 24 }, (_, index) => {
  const id = (index + 1).toString().padStart(5, '0')

  return {
    uoId: `UO_${id}`,
    couponQrcode: `CPN${100000 + index}`,
    couponName: index % 2 === 0 ? '停车抵扣券' : '保洁服务券',
    value: index % 2 === 0 ? '30元' : '1次',
    userName: generateChineseName(),
    tel: generatePhoneNumber(),
    createTime: formatDateTime(Date.now() - index * 3600000),
    remark: index % 2 === 0 ? '停车缴费使用' : '家政服务预约',
  }
})

/** 预约核销记录 mock 数据。 */
const reserveOrders: ReserveWriteOffOrder[] = Array.from({ length: 18 }, (_, index) => {
  const id = (index + 1).toString().padStart(5, '0')

  return {
    orderId: `RO_${id}`,
    reserveQrcode: `RSV${200000 + index}`,
    goodsName: index % 2 === 0 ? '羽毛球场' : '会议室',
    quantity: (index % 3) + 1,
    appointmentTime: formatDateTime(Date.now() + (index % 7) * 86400000).slice(0, 10),
    hours: `${9 + (index % 6)}:00-${10 + (index % 6)}:00`,
    personName: generateChineseName(),
    personTel: generatePhoneNumber(),
    createTime: formatDateTime(Date.now() - index * 1800000),
  }
})

/** 积分核销配置 mock 数据。 */
const integralSettings: IntegralSetting[] = [
  { settingId: 'IS_001', settingName: '员工积分核销', onceMaxIntegral: 200 },
]

/** 积分核销记录 mock 数据。 */
const integralLogs: IntegralWriteOffLog[] = Array.from({ length: 16 }, (_, index) => ({
  logId: `IL_${(index + 1).toString().padStart(5, '0')}`,
  ownerName: generateChineseName(),
  ownerTel: generatePhoneNumber(),
  integral: (index % 5 + 1) * 10,
  operatorName: '系统管理员',
  createTime: formatDateTime(Date.now() - index * 7200000),
  remark: '积分核销',
}))

export default defineUniAppMock([
  {
    url: '/app/couponProperty.listCouponPropertyUserDetail',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const couponQrcode = asOptionalString(params.couponQrcode)
      const list = couponQrcode
        ? couponOrders.filter(item => item.couponQrcode.includes(couponQrcode))
        : couponOrders

      return successResponse(createPaginationResponse(
        list,
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 10),
      ), '查询成功')
    },
  },
  {
    url: '/app/couponProperty.writeOffCouponPropertyUser',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const couponQrcode = asOptionalString(context.body?.couponQrcode)
      if (couponQrcode) {
        couponOrders.unshift({
          uoId: generateId('UO'),
          couponQrcode,
          couponName: '扫码核销券',
          value: '50元',
          userName: '扫码用户',
          tel: generatePhoneNumber(),
          createTime: formatDateTime(),
          remark: '扫码核销',
        })
      }

      return successResponse({ success: true }, '核销成功')
    },
  },
  {
    url: '/app/integral.listIntegralSetting',
    method: ['GET', 'POST'],
    body: () => successResponse(integralSettings, '查询成功'),
  },
  {
    url: '/app/integral.useIntegral',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const data = normalizeUseIntegralParams(context.body || {})
      integralLogs.unshift({
        logId: generateId('IL'),
        ownerName: data.ownerName || '未命名用户',
        ownerTel: data.ownerTel,
        integral: Number(data.integral || 0),
        operatorName: '当前员工',
        createTime: formatDateTime(),
        remark: data.remark || '积分核销',
      })

      return successResponse({ success: true }, '核销成功')
    },
  },
  {
    url: '/app/integral.listIntegralUserDetail',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const ownerTel = asOptionalString(params.ownerTel)
      const list = ownerTel
        ? integralLogs.filter(item => item.ownerTel.includes(ownerTel))
        : integralLogs

      return successResponse(createPaginationResponse(
        list,
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 10),
      ), '查询成功')
    },
  },
  {
    url: '/app/reserveOrder.listReserveGoodsConfirmOrder',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const reserveQrcode = asOptionalString(params.reserveQrcode)
      const list = reserveQrcode
        ? reserveOrders.filter(item => item.reserveQrcode.includes(reserveQrcode))
        : reserveOrders

      return successResponse(createPaginationResponse(
        list,
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 10),
      ), '查询成功')
    },
  },
  {
    url: '/app/reserveOrder.saveReserveGoodsConfirmOrder',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const timeId = asOptionalString(context.body?.timeId)
      if (timeId) {
        reserveOrders.unshift({
          orderId: generateId('RO'),
          reserveQrcode: timeId,
          goodsName: '扫码预约服务',
          quantity: 1,
          appointmentTime: formatDateTime().slice(0, 10),
          hours: '09:00-10:00',
          personName: '扫码用户',
          personTel: generatePhoneNumber(),
          createTime: formatDateTime(),
        })
      }

      return successResponse({ success: true }, '核销成功')
    },
  },
])

/** 合并 Vite mock 的 query、body 与 params。 */
function getRequestParams(context: MockContext): Record<string, unknown> {
  return {
    ...(context.query || {}),
    ...(context.body || {}),
    ...(context.params || {}),
  }
}

/** 将未知值收敛为可选字符串。 */
function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}

/** 将未知值收敛为正数。 */
function asPositiveNumber(value: unknown, fallback: number): number {
  const numberValue = Number(asOptionalString(value))

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback
}

/** 把积分使用请求体收敛为业务参数。 */
function normalizeUseIntegralParams(body: Record<string, unknown>): UseIntegralParams {
  return {
    communityId: asOptionalString(body.communityId) || '',
    ownerName: asOptionalString(body.ownerName) || '',
    ownerTel: asOptionalString(body.ownerTel) || '',
    integral: Number(body.integral || 0),
    remark: asOptionalString(body.remark),
  }
}
