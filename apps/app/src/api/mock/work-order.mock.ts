/**
 * 工作单模块 Mock 接口。
 */

import type {
  AuditWorkOrderParams,
  CompleteWorkOrderParams,
  CreateWorkOrderParams,
  UpdateWorkOrderParams,
  WorkOrder,
  WorkOrderDetail,
  WorkTask,
  WorkTaskItem,
} from '../../types/work-order'
import {
  WorkOrderPriorityName,
  WorkOrderStatus,
  WorkOrderStatusName,
  WorkOrderTypeName,
} from '../../types/work-order'
import { createPaginationResponse, defineUniAppMock, errorResponse, formatDateTime, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 工作单列表 mock 数据。 */
const workOrders: WorkOrder[] = [
  createWorkOrderRow('WO_001', '园区绿化修剪', WorkOrderStatus.PENDING, '1', '3'),
  createWorkOrderRow('WO_002', '公共区域清洁', WorkOrderStatus.PROCESSING, '2', '2'),
  createWorkOrderRow('WO_003', '消防设施检查', WorkOrderStatus.COMPLETED, '3', '4'),
]

/** 工作单详情 mock 数据。 */
const workOrderDetails = new Map<string, WorkOrderDetail>(
  workOrders.map(order => [
    order.orderId,
    {
      ...order,
      attachments: [`https://example.test/work-orders/${order.orderId}.jpg`],
      copyUsers: [{ userId: 'USER_COPY_001', userName: '抄送人' }],
      operationLogs: [{
        logId: `LOG_${order.orderId}`,
        orderId: order.orderId,
        operationType: 'create',
        operationTypeName: '创建工作单',
        operatorId: 'USER_001',
        operatorName: '系统管理员',
        operationTime: order.createTime,
        remark: '本地 mock 初始化',
      }],
    },
  ]),
)

/** 工作任务 mock 数据。 */
const workTasks: WorkTask[] = workOrders.map(order => ({
  taskId: `TASK_${order.orderId}`,
  workId: order.orderId,
  staffId: order.staffId || 'STAFF_001',
  staffName: order.staffName || '张工',
  state: order.status,
  createTime: order.createTime,
}))

/** 工作任务项 mock 数据。 */
const workTaskItems: WorkTaskItem[] = workOrders.map(order => ({
  itemId: `ITEM_${order.orderId}`,
  workId: order.orderId,
  taskId: `TASK_${order.orderId}`,
  content: `${order.title}执行项`,
  staffId: order.staffId,
  staffName: order.staffName,
  state: order.status === WorkOrderStatus.COMPLETED ? 'C' : 'W',
  createTime: order.createTime,
  pathUrls: [`https://example.test/work-orders/${order.orderId}-task.jpg`],
}))

export default defineUniAppMock([
  {
    url: '/app/workorder/todo/list',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 10)
      const status = asOptionalString(params.status)
      const type = asOptionalString(params.type)
      const keyword = asOptionalString(params.keyword)
      const list = filterWorkOrders(workOrders, { status, type, keyword, copyToMe: false })

      return successResponse(createPaginationResponse(list, page, row))
    },
  },
  {
    url: '/app/workorder/copy/list',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const page = asPositiveNumber(params.page, 1)
      const row = asPositiveNumber(params.row, 10)
      const status = asOptionalString(params.status)
      const keyword = asOptionalString(params.keyword)
      const list = filterWorkOrders(workOrders, { status, keyword, copyToMe: true })

      return successResponse(createPaginationResponse(list, page, row))
    },
  },
  {
    url: '/app/workorder/detail',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const orderId = asOptionalString(getRequestParams(context).orderId)

      if (!orderId) {
        return errorResponse('工作单ID不能为空', '400')
      }

      const order = workOrderDetails.get(orderId)
      if (!order) {
        return errorResponse('工作单不存在', '404')
      }

      return successResponse({ order })
    },
  },
  {
    url: '/app/workorder/create',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const body = (context.body || {}) as Partial<CreateWorkOrderParams>
      const validationError = validateCreateWorkOrderBody(body)
      if (validationError) {
        return validationError
      }

      const orderId = `WO_${String(workOrders.length + 1).padStart(3, '0')}`
      const order = createWorkOrderRow(orderId, body.title || '新建工作单', WorkOrderStatus.PENDING, body.type || '1', body.priority || '2')
      order.content = body.content || order.content
      order.communityId = body.communityId || order.communityId
      order.planStartTime = body.planStartTime
      order.planEndTime = body.planEndTime
      workOrders.unshift(order)
      workOrderDetails.set(orderId, { ...order, attachments: body.attachments })

      return successResponse({ orderId }, '创建成功')
    },
  },
  {
    url: '/app/workorder/update',
    method: 'POST',
    body: (context: MockContext = {}) => updateWorkOrder((context.body || {}) as Partial<UpdateWorkOrderParams>),
  },
  {
    url: '/app/workorder/start',
    method: 'POST',
    body: (context: MockContext = {}) => changeWorkOrderStatus(asOptionalString(context.body?.orderId), WorkOrderStatus.PROCESSING, '开始处理'),
  },
  {
    url: '/app/workorder/complete',
    method: 'POST',
    body: (context: MockContext = {}) => completeWorkOrder((context.body || {}) as Partial<CompleteWorkOrderParams>),
  },
  {
    url: '/app/workorder/audit',
    method: 'POST',
    body: (context: MockContext = {}) => auditWorkOrder((context.body || {}) as Partial<AuditWorkOrderParams>),
  },
  {
    url: '/app/workorder/cancel',
    method: 'POST',
    body: (context: MockContext = {}) => changeWorkOrderStatus(asOptionalString(context.body?.orderId), WorkOrderStatus.CANCELLED, '已取消'),
  },
  {
    url: '/app/workorder/task/list',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const workId = asOptionalString(params.workId)

      if (!workId) {
        return errorResponse('工作单ID不能为空', '400')
      }

      return successResponse(createPaginationResponse(
        workTasks.filter(task => task.workId === workId),
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 100),
      ), '获取任务列表成功')
    },
  },
  {
    url: '/app/workorder/task/items',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const workId = asOptionalString(params.workId)
      const states = asOptionalString(params.states)?.split(',').filter(Boolean) || []

      if (!workId) {
        return errorResponse('工作单ID不能为空', '400')
      }

      return successResponse(createPaginationResponse(
        workTaskItems
          .filter(item => item.workId === workId)
          .filter(item => states.length === 0 || states.includes(item.state)),
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 100),
      ), '获取任务项列表成功')
    },
  },
  {
    url: '/app/workorder/copy/finish',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const copyId = asOptionalString(context.body?.copyId)
      const itemId = asOptionalString(context.body?.itemId)

      if (!copyId) {
        return errorResponse('抄送ID不能为空', '400')
      }

      if (!itemId) {
        return errorResponse('任务项ID不能为空', '400')
      }

      const item = workTaskItems.find(taskItem => taskItem.itemId === itemId)
      if (item) {
        item.state = 'C'
        item.finishTime = formatDateTime()
      }

      return successResponse({ success: true }, '提交成功')
    },
  },
])

/** 创建基础工作单行。 */
function createWorkOrderRow(orderId: string, title: string, status: string, type: string, priority: string): WorkOrder {
  return {
    orderId,
    orderNo: orderId.replace('WO_', 'WO202606'),
    title,
    type,
    typeName: WorkOrderTypeName[type],
    status,
    statusName: WorkOrderStatusName[status],
    priority,
    priorityName: WorkOrderPriorityName[priority],
    content: `${title}，请按时完成并上传处理结果。`,
    staffId: 'STAFF_001',
    staffName: '张工',
    creatorId: 'USER_001',
    creatorName: '系统管理员',
    planStartTime: formatDateTime(),
    planEndTime: formatDateTime(Date.now() + 86400000),
    createTime: formatDateTime(),
    communityId: 'COMM_001',
    communityName: '阳光花园小区',
    isCopyToMe: orderId !== 'WO_001',
  }
}

/** 按列表查询条件筛选工作单。 */
function filterWorkOrders(
  list: WorkOrder[],
  params: { copyToMe?: boolean, keyword?: string, status?: string, type?: string },
): WorkOrder[] {
  return list
    .filter(order => params.copyToMe === undefined || Boolean(order.isCopyToMe) === params.copyToMe)
    .filter(order => !params.status || order.status === params.status)
    .filter(order => !params.type || order.type === params.type)
    .filter(order => !params.keyword || order.title.includes(params.keyword) || order.content.includes(params.keyword))
}

/** 更新工作单基础信息。 */
function updateWorkOrder(params: Partial<UpdateWorkOrderParams>) {
  const orderId = asOptionalString(params.orderId)

  if (!orderId) {
    return errorResponse('工作单ID不能为空', '400')
  }

  const order = workOrders.find(item => item.orderId === orderId)
  if (!order) {
    return errorResponse('更新失败', '400')
  }

  Object.assign(order, {
    title: params.title || order.title,
    type: params.type || order.type,
    priority: params.priority || order.priority,
    content: params.content || order.content,
    staffId: params.staffId || order.staffId,
    planStartTime: params.planStartTime || order.planStartTime,
    planEndTime: params.planEndTime || order.planEndTime,
    updateTime: formatDateTime(),
  })
  order.typeName = WorkOrderTypeName[order.type]
  order.priorityName = WorkOrderPriorityName[order.priority]

  return successResponse({ success: true }, '更新成功')
}

/** 变更工作单状态。 */
function changeWorkOrderStatus(orderId: string | undefined, status: string, message: string) {
  if (!orderId) {
    return errorResponse('工作单ID不能为空', '400')
  }

  const order = workOrders.find(item => item.orderId === orderId)
  if (!order) {
    return errorResponse(`${message}失败`, '400')
  }

  order.status = status
  order.statusName = WorkOrderStatusName[status]
  order.updateTime = formatDateTime()

  return successResponse({ success: true }, message)
}

/** 完成工作单。 */
function completeWorkOrder(params: Partial<CompleteWorkOrderParams>) {
  const response = changeWorkOrderStatus(asOptionalString(params.orderId), WorkOrderStatus.COMPLETED, '完成成功')
  const detail = params.orderId ? workOrderDetails.get(params.orderId) : undefined

  if (detail) {
    detail.completeRemark = params.remark
    detail.completePhotos = params.photos
    detail.actualEndTime = formatDateTime()
  }

  return response
}

/** 审核工作单。 */
function auditWorkOrder(params: Partial<AuditWorkOrderParams>) {
  const status = params.result === 'pass' ? WorkOrderStatus.PROCESSING : WorkOrderStatus.REJECTED
  return changeWorkOrderStatus(asOptionalString(params.orderId), status, params.result === 'pass' ? '审核通过' : '已驳回')
}

/** 校验创建工作单的必填字段。 */
function validateCreateWorkOrderBody(body: Partial<CreateWorkOrderParams>) {
  if (!asOptionalString(body.title)) {
    return errorResponse('工作单标题不能为空', '400')
  }

  if (!asOptionalString(body.type)) {
    return errorResponse('工作单类型不能为空', '400')
  }

  if (!asOptionalString(body.priority)) {
    return errorResponse('优先级不能为空', '400')
  }

  if (!asOptionalString(body.content)) {
    return errorResponse('工作内容不能为空', '400')
  }

  if (!asOptionalString(body.communityId)) {
    return errorResponse('小区ID不能为空', '400')
  }

  return undefined
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
