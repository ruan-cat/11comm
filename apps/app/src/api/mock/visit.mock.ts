/**
 * 访客模块 Mock 接口。
 */

import type { AuditVisitParams, VisitDetail } from '../../types/visit'
import { createPaginationResponse, defineUniAppMock, formatDateTime, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 访客详情 mock 数据。 */
const visitDetails: VisitDetail[] = Array.from({ length: 12 }, (_, index) => {
  const state = index % 3 === 0 ? '0' : index % 3 === 1 ? '1' : '2'

  return {
    visitId: `VISIT_${(index + 1).toString().padStart(5, '0')}`,
    name: `访客${index + 1}`,
    phoneNumber: `1380000${(1000 + index).toString()}`,
    ownerName: `业主${index + 1}`,
    roomName: `${(index % 3) + 1}-${(index % 2) + 1}-${(101 + index).toString().slice(-3)}`,
    carNum: `粤A${(30000 + index).toString()}`,
    visitTime: formatDateTime(Date.now() + index * 7200000),
    state,
    stateName: state === '0' ? '待审核' : state === '1' ? '审核通过' : '已拒绝',
    taskId: state === '0' ? `TASK_V_${(index + 1).toString().padStart(4, '0')}` : undefined,
    departureTime: formatDateTime(Date.now() + (index + 2) * 7200000),
    visitCase: index % 2 === 0 ? '亲友来访' : '送货上门',
  }
})

export default defineUniAppMock([
  {
    url: '/app/visit.getVisit',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 10)
      const state = asOptionalString(params.state)
      const visitId = asOptionalString(params.visitId)
      const visits = visitDetails
        .filter(item => !state || item.state === state)
        .filter(item => !visitId || item.visitId === visitId)
        .map(({ departureTime: _departureTime, visitCase: _visitCase, ...record }) => record)

      return successResponse(createPaginationResponse(visits, page, row), '查询成功')
    },
  },
  {
    url: '/app/visit.getVisitDetail',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 1)
      const visitId = asOptionalString(params.visitId) || ''
      const details = visitDetails.filter(item => item.visitId === visitId)

      return successResponse(createPaginationResponse(details, page, row), '查询成功')
    },
  },
  {
    url: '/app/visit.auditVisit',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context) as Partial<AuditVisitParams>
      const target = visitDetails.find(item => item.visitId === params.visitId)

      if (target && params.state) {
        target.state = params.state
        target.stateName = params.state === '1' ? '审核通过' : '已拒绝'
      }

      return successResponse({ success: true }, '审核成功')
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
