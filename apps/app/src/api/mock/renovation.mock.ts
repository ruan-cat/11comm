/**
 * 装修管理 Mock 接口
 */

import type {
  RenovationApplication,
  RenovationRecord,
  RenovationRecordMedia,
  SaveRenovationRecordPayload,
} from '../../types/property-management'
import { createPaginationResponse, defineUniAppMock, errorResponse, formatDateTime, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

const renovations: RenovationApplication[] = [
  {
    rId: 'REN_001',
    communityId: 'COMM_001',
    roomId: 'ROOM_0101',
    roomName: '1-1-101',
    userId: 'OWNER_001',
    personName: '陈业主',
    personTel: '13800002001',
    startTime: '2026-06-01 09:00:00',
    endTime: '2026-07-01 18:00:00',
    renovationCompany: '安心装修工程队',
    personMain: '刘工',
    personMainTel: '13800003001',
    isPostpone: 'N',
    remark: '厨房和卫生间翻新',
    state: 1000,
    stateName: '待审核',
    isViolation: 'N',
  },
  {
    rId: 'REN_002',
    communityId: 'COMM_001',
    roomId: 'ROOM_0202',
    roomName: '2-1-202',
    userId: 'OWNER_002',
    personName: '王业主',
    personTel: '13800002002',
    startTime: '2026-05-20 09:00:00',
    endTime: '2026-06-20 18:00:00',
    renovationCompany: '城市装饰服务部',
    personMain: '赵工',
    personMainTel: '13800003002',
    isPostpone: 'N',
    remark: '客厅地面维护',
    state: 3000,
    stateName: '施工中',
    isViolation: 'N',
  },
]

const renovationRecords: RenovationRecord[] = [
  {
    recordId: 'REN_RECORD_001',
    rId: 'REN_002',
    communityId: 'COMM_001',
    roomId: 'ROOM_0202',
    roomName: '2-1-202',
    state: 3000,
    stateName: '施工中',
    staffName: '张小明',
    remark: '现场围挡完整',
    createTime: '2026-06-02 10:00:00',
    isTrue: 'false',
  },
]

const renovationRecordMedia: RenovationRecordMedia[] = [
  {
    detailId: 'REN_MEDIA_001',
    recordId: 'REN_RECORD_001',
    relTypeCd: 19000,
    url: 'https://picsum.photos/seed/renovation-record/640/360',
    remark: '现场照片',
  },
]

/** 本地 mock 用固定装修数据断开旧内置 Nitro server 依赖。 */
export default defineUniAppMock([
  {
    url: '/app/roomRenovation/queryRoomRenovation',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 10)
      const roomName = asOptionalString(params.roomName)
      const state = asOptionalString(params.state)
      const list = renovations
        .filter(item => !roomName || item.roomName.includes(roomName))
        .filter(item => !state || `${item.state}` === state)

      return successResponse(createPaginationResponse(list, page, row), '查询成功')
    },
  },
  {
    url: '/app/roomRenovation/updateRoomToExamine',
    method: 'POST',
    body: (context: MockContext = {}) => updateRenovationState(context.body, '审核成功'),
  },
  {
    url: '/app/roomRenovation/saveRoomRenovationDetail',
    method: 'POST',
    body: (context: MockContext = {}) => updateRenovationState(context.body, '验收成功'),
  },
  {
    url: '/app/roomRenovation/updateRoomRenovationState',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const rId = asOptionalString(context.body?.rId)
      if (!rId) {
        return errorResponse('rId 不能为空', '400')
      }

      const renovation = renovations.find(item => item.rId === rId)
      if (!renovation) {
        return errorResponse('装修申请不存在', '404')
      }

      renovation.state = 5000
      renovation.stateName = '验收通过'

      return successResponse({ success: true }, '状态更新成功')
    },
  },
  {
    url: '/app/roomRenovation/queryRoomRenovationRecord',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const rId = asOptionalString(params.rId)
      if (!rId) {
        return errorResponse('rId 不能为空', '400')
      }

      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 10)
      const list = renovationRecords.filter(item => item.rId === rId)

      return successResponse(createPaginationResponse(list, page, row), '查询成功')
    },
  },
  {
    url: '/app/roomRenovation/queryRoomRenovationRecordDetail',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const recordId = asOptionalString(getRequestParams(context).recordId)
      if (!recordId) {
        return errorResponse('recordId 不能为空', '400')
      }

      return successResponse(
        renovationRecordMedia.filter(item => item.recordId === recordId),
        '查询成功',
      )
    },
  },
  {
    url: '/app/roomRenovation/updateRoomDecorationRecord',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const request = context.body as Partial<SaveRenovationRecordPayload>
      const rId = asOptionalString(request.rId)
      const roomId = asOptionalString(request.roomId)
      const roomName = asOptionalString(request.roomName)
      const communityId = asOptionalString(request.communityId)
      const remark = asOptionalString(request.remark)
      if (!rId || !roomId || !roomName || !communityId || !remark) {
        return errorResponse('参数不完整', '400')
      }

      if (!renovations.some(item => item.rId === rId)) {
        return errorResponse('装修申请不存在', '404')
      }

      renovationRecords.unshift({
        recordId: `REN_RECORD_${(renovationRecords.length + 1).toString().padStart(3, '0')}`,
        rId,
        communityId,
        roomId,
        roomName,
        state: Number(request.state) || 3000,
        stateName: asOptionalString(request.stateName) || '施工中',
        staffName: '本地 mock 员工',
        remark,
        createTime: formatDateTime(),
        isTrue: asOptionalString(request.isTrue) || 'false',
      })

      return successResponse({ success: true }, '添加成功')
    },
  },
  {
    url: '/app/roomRenovation/deleteRoomRenovationRecord',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const recordId = asOptionalString(context.body?.recordId)
      if (!recordId) {
        return errorResponse('recordId 不能为空', '400')
      }

      const index = renovationRecords.findIndex(item => item.recordId === recordId)
      if (index < 0) {
        return errorResponse('记录不存在', '404')
      }

      renovationRecords.splice(index, 1)

      return successResponse({ success: true }, '删除成功')
    },
  },
])

function updateRenovationState(body: Record<string, unknown> | undefined, message: string) {
  const rId = asOptionalString(body?.rId)
  const state = body?.state === undefined || body?.state === null ? undefined : Number(body.state)
  if (!rId || state === undefined || Number.isNaN(state)) {
    return errorResponse('参数不完整', '400')
  }

  const renovation = renovations.find(item => item.rId === rId)
  if (!renovation) {
    return errorResponse('装修申请不存在', '404')
  }

  renovation.state = state
  renovation.stateName = getRenovationStateName(state)

  return successResponse({ success: true }, message)
}

function getRenovationStateName(state: number): string {
  const stateMap: Record<number, string> = {
    1000: '待审核',
    2000: '审核不通过',
    3000: '施工中',
    4000: '待验收',
    5000: '验收通过',
    6000: '验收不通过',
  }

  return stateMap[state] || '未知状态'
}

function getRequestParams(context: MockContext): Record<string, unknown> {
  return {
    ...(context.query || {}),
    ...(context.body || {}),
    ...(context.params || {}),
  }
}

function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined
  }

  return `${value}`.trim()
}

function asPositiveNumber(value: unknown, fallback: number): number {
  const numberValue = Number(asOptionalString(value))

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback
}
