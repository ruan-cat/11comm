/**
 * 投诉模块 Mock 接口。
 */

import type {
  Complaint,
  ComplaintAppraise,
  ComplaintAppraiseListResponse,
  ComplaintEvent,
  ComplaintEventListResponse,
  ComplaintHistoryListResponse,
  ComplaintListResponse,
  ComplaintPhoto,
} from '../../types/complaint'
import {
  createPaginationResponse,
  defineUniAppMock,
  errorResponse,
  formatDateTime,
  generateChineseName,
  generateId,
  generatePhoneNumber,
  generateTimeRange,
  successResponse,
} from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 投诉单 mock 数据。 */
const complaints: Complaint[] = Array.from({ length: 32 }, (_, index) => createComplaint(index + 1))

/** 投诉事件 mock 数据。 */
const complaintEvents: ComplaintEvent[] = []

/** 投诉评价 mock 数据。 */
const complaintAppraises: ComplaintAppraise[] = []

initComplaintRelations()

export default defineUniAppMock([
  {
    url: '/app/auditUser.listAuditComplaints',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)

      return successResponse(listAuditComplaints(
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 15),
      ), '获取待办投诉列表成功')
    },
  },
  {
    url: '/app/auditUser.listAuditHistoryComplaints',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)

      return successResponse(listAuditHistoryComplaints(
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 15),
      ), '获取投诉历史成功')
    },
  },
  {
    url: '/app/complaint',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const validationError = validateComplaintBody(context.body || {})
      if (validationError) {
        return validationError
      }

      const complaint = saveComplaint(context.body || {})

      return successResponse({ complaint }, '投诉提交成功')
    },
  },
  {
    url: '/app/complaint.auditComplaint',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const complaintId = asOptionalString(context.body?.complaintId)
      if (!complaintId) {
        return errorResponse('投诉ID不能为空', '400')
      }

      const contextText = asOptionalString(context.body?.context)
      const remark = asOptionalString(context.body?.remark)
      if (!contextText && !remark) {
        return errorResponse('请填写处理意见', '400')
      }

      const handled = auditComplaint({
        complaintId,
        context: contextText,
        remark,
        state: asOptionalString(context.body?.state),
      })

      if (!handled) {
        return errorResponse('投诉记录不存在', '404')
      }

      return successResponse({ success: true }, '投诉处理成功')
    },
  },
  {
    url: '/app/complaint.listComplaintEvent',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const complaintId = asOptionalString(params.complaintId)
      if (!complaintId) {
        return errorResponse('投诉ID不能为空', '400')
      }

      return successResponse(listComplaintEvent(
        complaintId,
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 100),
      ), '获取投诉事件成功')
    },
  },
  {
    url: '/app/complaintAppraise.listComplaintAppraise',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const complaintId = asOptionalString(params.complaintId)
      if (!complaintId) {
        return errorResponse('投诉ID不能为空', '400')
      }

      return successResponse(listComplaintAppraise(
        complaintId,
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 100),
      ), '获取投诉评价成功')
    },
  },
  {
    url: '/app/complaintAppraise.replyComplaintAppraise',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const appraiseId = asOptionalString(context.body?.appraiseId)
      if (!appraiseId) {
        return errorResponse('评价ID不能为空', '400')
      }

      const replyContext = asOptionalString(context.body?.replyContext)
      if (!replyContext) {
        return errorResponse('请填写回复内容', '400')
      }

      replyComplaintAppraise(appraiseId, replyContext)

      return successResponse({ success: true }, '回复评价成功')
    },
  },
])

/** 初始化投诉事件与评价关系。 */
function initComplaintRelations() {
  for (const complaint of complaints.slice(0, 12)) {
    complaintEvents.push(createCreateEvent(complaint))
    complaintEvents.push({
      eventId: generateId('EVENT'),
      complaintId: complaint.complaintId,
      communityId: complaint.communityId,
      eventType: '1001',
      eventTypeName: '处理',
      createUserId: complaint.userId,
      createUserName: '物业工作人员',
      createTime: formatDateTime(Date.now() - 3600000),
      remark: '已受理',
    })
    complaintAppraises.push({
      appraiseId: generateId('APPR'),
      complaintId: complaint.complaintId,
      communityId: complaint.communityId,
      context: '处理及时，服务满意',
      score: 5,
      state: 'C',
      stateName: '已回复',
      replyContext: '感谢反馈',
      createTime: generateTimeRange(-10, 0),
      createUserName: generateChineseName(),
    })
  }
}

/** 创建投诉单。 */
function createComplaint(index: number): Complaint {
  const complaintId = `COMP_${index.toString().padStart(3, '0')}`
  const typeCd = index % 3 === 0 ? '809002' : '809001'

  return {
    complaintId,
    communityId: 'COMM_001',
    storeId: 'STORE_001',
    userId: `USER_${index.toString().padStart(3, '0')}`,
    typeCd,
    typeName: typeCd === '809001' ? '投诉' : '建议',
    complaintName: generateChineseName(),
    tel: generatePhoneNumber(),
    roomId: `ROOM_${index}`,
    roomName: `${Math.floor(index / 2) + 1}栋1单元10${index % 10}`,
    floorNum: String((index % 10) + 1),
    unitNum: String((index % 4) + 1),
    roomNum: String(100 + index),
    context: `投诉内容 ${index}`,
    state: index % 2 === 0 ? '1100' : '1200',
    stateName: index % 2 === 0 ? '已处理' : '待处理',
    createTime: generateTimeRange(-30, 0),
    taskId: `TASK_${complaintId}`,
    photos: [],
  }
}

/** 查询待办投诉，保持旧响应字段 data。 */
function listAuditComplaints(page: number, row: number): ComplaintListResponse {
  const result = createPaginationResponse(complaints.filter(item => item.taskId), page, row)

  return {
    data: result.list,
    total: result.total,
    page: result.page,
    records: result.pageSize,
  }
}

/** 查询历史投诉，保持旧响应字段 complaints。 */
function listAuditHistoryComplaints(page: number, row: number): ComplaintHistoryListResponse {
  const result = createPaginationResponse(complaints, page, row)

  return {
    complaints: result.list.map(item => ({
      ...item,
      createTime: item.createTime.slice(5, 10),
    })),
    total: result.total,
  }
}

/** 保存投诉并同步创建事件。 */
function saveComplaint(body: Record<string, unknown>): Complaint {
  const complaint: Complaint = {
    complaintId: generateId('COMP'),
    communityId: asOptionalString(body.communityId) || 'COMM_001',
    storeId: asOptionalString(body.storeId) || 'STORE_001',
    userId: asOptionalString(body.userId) || 'USER_001',
    typeCd: asOptionalString(body.typeCd) || '809001',
    typeName: asOptionalString(body.typeCd) === '809002' ? '建议' : '投诉',
    complaintName: asOptionalString(body.complaintName) || '',
    tel: asOptionalString(body.tel) || '',
    roomId: asOptionalString(body.roomId) || '',
    roomName: `房间-${asOptionalString(body.roomId) || ''}`,
    context: asOptionalString(body.context) || '',
    createTime: formatDateTime(),
    taskId: generateId('TASK'),
    photos: normalizeComplaintPhotos(body.photos),
  }

  complaints.unshift(complaint)
  complaintEvents.push(createCreateEvent(complaint))

  return complaint
}

/** 处理投诉并追加处理事件。 */
function auditComplaint(data: { complaintId: string, context?: string, remark?: string, state?: string }): boolean {
  const complaint = complaints.find(item => item.complaintId === data.complaintId)
  if (!complaint) {
    return false
  }

  complaintEvents.push({
    eventId: generateId('EVENT'),
    complaintId: complaint.complaintId,
    communityId: complaint.communityId,
    eventType: '1001',
    eventTypeName: '处理',
    createUserId: complaint.userId,
    createUserName: '物业工作人员',
    createTime: formatDateTime(),
    remark: data.context || data.remark,
  })

  if (data.state) {
    complaint.state = data.state
    complaint.stateName = data.state === '1100' ? '已处理' : '无法处理'
  }

  return true
}

/** 查询投诉流转事件。 */
function listComplaintEvent(complaintId: string, page: number, row: number): ComplaintEventListResponse {
  const result = createPaginationResponse(
    complaintEvents.filter(event => event.complaintId === complaintId),
    page,
    row,
  )

  return {
    data: result.list,
    total: result.total,
  }
}

/** 查询投诉评价。 */
function listComplaintAppraise(complaintId: string, page: number, row: number): ComplaintAppraiseListResponse {
  const result = createPaginationResponse(
    complaintAppraises.filter(appraise => appraise.complaintId === complaintId),
    page,
    row,
  )

  return {
    data: result.list,
    total: result.total,
  }
}

/** 回复投诉评价；旧 endpoint 对不存在评价也返回成功。 */
function replyComplaintAppraise(appraiseId: string, replyContext: string): boolean {
  const appraise = complaintAppraises.find(item => item.appraiseId === appraiseId)
  if (!appraise) {
    return false
  }

  appraise.state = 'C'
  appraise.stateName = '已回复'
  appraise.replyContext = replyContext

  return true
}

/** 创建投诉单创建事件。 */
function createCreateEvent(complaint: Complaint): ComplaintEvent {
  return {
    eventId: generateId('EVENT'),
    complaintId: complaint.complaintId,
    communityId: complaint.communityId,
    eventType: '1000',
    eventTypeName: '创建',
    createUserId: complaint.userId,
    createUserName: complaint.complaintName,
    createTime: complaint.createTime,
    remark: complaint.context,
  }
}

/** 校验投诉提交请求体。 */
function validateComplaintBody(body: Record<string, unknown>) {
  if (!asOptionalString(body.typeCd)) {
    return errorResponse('请选择投诉类型', '400')
  }

  if (!asOptionalString(body.complaintName)) {
    return errorResponse('请填写投诉人', '400')
  }

  if (!asOptionalString(body.tel)) {
    return errorResponse('请填写手机号', '400')
  }

  if (!asOptionalString(body.context)) {
    return errorResponse('请填写投诉内容', '400')
  }

  if (!asOptionalString(body.roomId)) {
    return errorResponse('请选择房屋信息', '400')
  }

  return undefined
}

/** 归一化投诉图片字段。 */
function normalizeComplaintPhotos(value: unknown): ComplaintPhoto[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item) => {
    const photo = typeof item === 'object' && item !== null && 'photo' in item
      ? asOptionalString((item as { photo?: unknown }).photo)
      : undefined

    return {
      photoId: generateId('PHOTO'),
      complaintId: '',
      photo,
      url: '',
    }
  })
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
