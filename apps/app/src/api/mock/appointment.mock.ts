/**
 * 预约核销模块 Mock 接口。
 */

import type { AppointmentOrder, AppointmentOrderQueryParams } from '../../types/appointment'
import { createPaginationResponse, defineUniAppMock, formatDateTime, generatePhoneNumber, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 预约核销订单 mock 数据。 */
const appointmentOrders: AppointmentOrder[] = Array.from({ length: 30 }, (_, index) => {
  const baseDay = (index % 20) + 1
  const startHour = 8 + (index % 8)

  return {
    orderId: `ORDER_${(index + 1).toString().padStart(5, '0')}`,
    timeId: `HEXIAO_${100000 + index}`,
    spaceName: index % 2 === 0 ? '羽毛球馆' : '篮球场',
    appointmentDate: `2026-03-${baseDay.toString().padStart(2, '0')}`,
    hours: `${startHour.toString().padStart(2, '0')}:00-${(startHour + 1).toString().padStart(2, '0')}:00`,
    personName: index % 2 === 0 ? '张先生' : '李女士',
    personTel: generatePhoneNumber(),
    createTime: formatDateTime(Date.now() - index * 7200000),
    state: index % 3 === 0 ? 'CONFIRMED' : 'WAIT_CONFIRM',
  }
})

export default defineUniAppMock([
  {
    url: '/app/communitySpace.listCommunitySpaceConfirmOrder',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = normalizeListParams(getRequestParams(context))
      const list = params.timeId
        ? appointmentOrders.filter(item => item.timeId.includes(params.timeId || ''))
        : appointmentOrders

      return successResponse(createPaginationResponse(list, params.page, params.row), '查询成功')
    },
  },
  {
    url: '/app/communitySpace.saveCommunitySpaceConfirmOrder',
    method: ['POST'],
    body: (context: MockContext = {}) => {
      const timeId = asOptionalString(context.body?.timeId)
      if (timeId) {
        const target = appointmentOrders.find(item => item.timeId === timeId)
        if (target) {
          target.state = 'CONFIRMED'
          target.createTime = formatDateTime()
        }
      }

      return successResponse({ success: true }, '核销成功')
    },
  },
])

/** 把列表请求参数收敛为预约核销查询参数。 */
function normalizeListParams(params: Record<string, unknown>): AppointmentOrderQueryParams {
  return {
    page: asPositiveNumber(params.page, 1),
    row: asPositiveNumber(params.row, 10),
    communityId: asOptionalString(params.communityId) || '',
    timeId: asOptionalString(params.timeId),
  }
}

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
