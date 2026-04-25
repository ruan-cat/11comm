import type {
  CouponWriteOffOrder,
  IntegralSetting,
  IntegralWriteOffLog,
  ReserveWriteOffOrder,
  UseIntegralParams,
} from '../../../src/types/coupon.ts'
import { createPaginationResponse, formatDateTime, generateChineseName, generateId, generatePhoneNumber } from '../../shared/runtime/common-utils.ts'

export interface CouponModuleRepository {
  listCouponOrders: (params: { couponQrcode?: string, page: number, row: number }) => ReturnType<typeof createPaginationResponse>
  listIntegralLogs: (params: { ownerTel?: string, page: number, row: number }) => ReturnType<typeof createPaginationResponse>
  listIntegralSettings: () => IntegralSetting[]
  listReserveOrders: (params: { page: number, reserveQrcode?: string, row: number }) => ReturnType<typeof createPaginationResponse>
  useIntegral: (data: UseIntegralParams) => boolean
  writeOffCoupon: (couponQrcode: string) => boolean
  saveReserveOrder: (timeId: string) => boolean
}

/** 创建 `coupon` 模块的 mock 内存仓储。 */
export function createCouponMockRepository(): CouponModuleRepository {
  return new CouponDatabase()
}

class CouponDatabase implements CouponModuleRepository {
  private readonly couponOrders: CouponWriteOffOrder[] = Array.from({ length: 42 }, (_, index) => ({
    uoId: `UO_${(index + 1).toString().padStart(5, '0')}`,
    couponQrcode: `CPN${(100000 + index).toString()}`,
    couponName: index % 2 === 0 ? '停车抵扣券' : '保洁服务券',
    value: index % 2 === 0 ? '30元' : '1次',
    userName: generateChineseName(),
    tel: generatePhoneNumber(),
    createTime: formatDateTime(Date.now() - index * 3600000),
    remark: index % 2 === 0 ? '停车缴费使用' : '家政服务预约',
  }))

  private readonly reserveOrders: ReserveWriteOffOrder[] = Array.from({ length: 36 }, (_, index) => ({
    orderId: `RO_${(index + 1).toString().padStart(5, '0')}`,
    reserveQrcode: `RSV${(200000 + index).toString()}`,
    goodsName: index % 2 === 0 ? '羽毛球场' : '会议室',
    quantity: (index % 3) + 1,
    appointmentTime: formatDateTime(Date.now() + (index % 7) * 86400000).slice(0, 10),
    hours: `${9 + (index % 6)}:00-${10 + (index % 6)}:00`,
    personName: generateChineseName(),
    personTel: generatePhoneNumber(),
    createTime: formatDateTime(Date.now() - index * 1800000),
  }))

  private readonly integralSettings: IntegralSetting[] = [
    { settingId: 'IS_001', settingName: '员工积分核销', onceMaxIntegral: 200 },
  ]

  private readonly integralLogs: IntegralWriteOffLog[] = Array.from({ length: 28 }, (_, index) => ({
    logId: `IL_${(index + 1).toString().padStart(5, '0')}`,
    ownerName: generateChineseName(),
    ownerTel: generatePhoneNumber(),
    integral: (index % 5 + 1) * 10,
    operatorName: '系统管理员',
    createTime: formatDateTime(Date.now() - index * 7200000),
    remark: '积分核销',
  }))

  listCouponOrders(params: { couponQrcode?: string, page: number, row: number }) {
    let list = [...this.couponOrders]
    if (params.couponQrcode) {
      const code = params.couponQrcode.trim()
      list = list.filter(item => item.couponQrcode.includes(code))
    }

    return createPaginationResponse(list, params.page, params.row)
  }

  writeOffCoupon(couponQrcode: string) {
    this.couponOrders.unshift({
      uoId: generateId('UO'),
      couponQrcode,
      couponName: '扫码核销券',
      value: '50元',
      userName: '扫码用户',
      tel: generatePhoneNumber(),
      createTime: formatDateTime(),
      remark: '扫码核销',
    })

    return true
  }

  listIntegralSettings() {
    return structuredClone(this.integralSettings)
  }

  useIntegral(data: UseIntegralParams) {
    this.integralLogs.unshift({
      logId: generateId('IL'),
      ownerName: data.ownerName || '未命名用户',
      ownerTel: data.ownerTel || '',
      integral: Number(data.integral || 0),
      operatorName: '当前员工',
      createTime: formatDateTime(),
      remark: data.remark || '积分核销',
    })

    return true
  }

  listIntegralLogs(params: { ownerTel?: string, page: number, row: number }) {
    let list = [...this.integralLogs]
    if (params.ownerTel) {
      const ownerTel = params.ownerTel.trim()
      list = list.filter(item => item.ownerTel.includes(ownerTel))
    }

    return createPaginationResponse(list, params.page, params.row)
  }

  listReserveOrders(params: { page: number, reserveQrcode?: string, row: number }) {
    let list = [...this.reserveOrders]
    if (params.reserveQrcode) {
      const code = params.reserveQrcode.trim()
      list = list.filter(item => item.reserveQrcode.includes(code))
    }

    return createPaginationResponse(list, params.page, params.row)
  }

  saveReserveOrder(timeId: string) {
    this.reserveOrders.unshift({
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

    return true
  }
}

/** 默认复用的 coupon mock 仓储实例。 */
export const couponMockRepository = createCouponMockRepository()
