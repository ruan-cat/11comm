import type { EndpointDefinition } from '../../shared/runtime/endpoint-registry.ts'
import type { CouponModuleRepository } from './repository.ts'
import { successResponse } from '../../shared/runtime/response-builder.ts'
import { couponMockRepository } from './repository.ts'

/** 创建 `coupon` 模块的共享 endpoint 定义。 */
export function createCouponEndpointDefinitions(
  repository: CouponModuleRepository = couponMockRepository,
): EndpointDefinition[] {
  return [
    {
      url: '/app/couponProperty.listCouponPropertyUserDetail',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.listCouponOrders({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        couponQrcode: asOptionalString(params.couponQrcode),
      }), '查询成功'),
    },
    {
      url: '/app/couponProperty.writeOffCouponPropertyUser',
      method: ['POST'],
      handler: ({ body }) => {
        const couponQrcode = asOptionalString(body?.couponQrcode)
        if (couponQrcode) {
          repository.writeOffCoupon(couponQrcode)
        }

        return successResponse({ success: true }, '核销成功')
      },
    },
    {
      url: '/app/integral.listIntegralSetting',
      method: ['GET', 'POST'],
      handler: () => successResponse(repository.listIntegralSettings(), '查询成功'),
    },
    {
      url: '/app/integral.useIntegral',
      method: ['POST'],
      handler: ({ body }) => {
        repository.useIntegral({
          communityId: String(body?.communityId || ''),
          ownerName: String(body?.ownerName || ''),
          ownerTel: String(body?.ownerTel || ''),
          integral: Number(body?.integral || 0),
          remark: asOptionalString(body?.remark),
        })

        return successResponse({ success: true }, '核销成功')
      },
    },
    {
      url: '/app/integral.listIntegralUserDetail',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.listIntegralLogs({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        ownerTel: asOptionalString(params.ownerTel),
      }), '查询成功'),
    },
    {
      url: '/app/reserveOrder.listReserveGoodsConfirmOrder',
      method: ['GET', 'POST'],
      handler: ({ params }) => successResponse(repository.listReserveOrders({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        reserveQrcode: asOptionalString(params.reserveQrcode),
      }), '查询成功'),
    },
    {
      url: '/app/reserveOrder.saveReserveGoodsConfirmOrder',
      method: ['POST'],
      handler: ({ body }) => {
        const timeId = asOptionalString(body?.timeId)
        if (timeId) {
          repository.saveReserveOrder(timeId)
        }

        return successResponse({ success: true }, '核销成功')
      },
    },
  ]
}

/** 默认共享的 coupon endpoint 集合。 */
export const couponEndpointDefinitions = createCouponEndpointDefinitions()

function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}
