/**
 * 物品放行模块 Mock 接口。
 */

import type {
  AuditItemReleaseParams,
  ItemReleaseComment,
  ItemReleaseDetail,
  ItemReleaseResource,
  ItemReleaseTask,
} from '../../types/item-release'
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

/** 待审核物品放行任务。 */
const undoTasks: ItemReleaseTask[] = []

/** 已完成物品放行任务。 */
const finishTasks: ItemReleaseTask[] = []

/** 物品放行详情。 */
const releaseDetails = new Map<string, ItemReleaseDetail>()

/** 物品明细。 */
const releaseResources = new Map<string, ItemReleaseResource[]>()

/** 审批流转记录。 */
const releaseComments = new Map<string, ItemReleaseComment[]>()

initItemReleaseData()

export default defineUniAppMock([
  {
    url: '/app/itemRelease.queryUndoItemReleaseV2',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)

      return successResponse(createPaginationResponse(
        undoTasks,
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 10),
      ), '查询成功')
    },
  },
  {
    url: '/app/itemRelease.queryFinishItemReleaseV2',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)

      return successResponse(createPaginationResponse(
        finishTasks,
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 10),
      ), '查询成功')
    },
  },
  {
    url: '/app/itemRelease.getItemRelease',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const irId = asOptionalString(params.irId)
      const detail = irId ? releaseDetails.get(irId) : undefined

      return successResponse(createPaginationResponse(
        detail ? [detail] : [],
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 1),
      ), '查询成功')
    },
  },
  {
    url: '/app/itemRelease.getItemReleaseRes',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const irId = asOptionalString(params.irId)

      return successResponse(createPaginationResponse(
        irId ? releaseResources.get(irId) || [] : [],
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 20),
      ), '查询成功')
    },
  },
  {
    url: '/app/itemRelease.queryOaWorkflowUser',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const id = asOptionalString(params.id)

      return successResponse(createPaginationResponse(
        id ? releaseComments.get(id) || [] : [],
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 20),
      ), '查询成功')
    },
  },
  {
    url: '/app/itemRelease.auditItemRelease',
    method: 'POST',
    body: (context: MockContext = {}) => {
      auditItemRelease(normalizeAuditParams(context.body || {}))

      return successResponse({ success: true }, '审核完成')
    },
  },
])

/** 初始化物品放行内存数据。 */
function initItemReleaseData() {
  for (let index = 1; index <= 12; index += 1) {
    createItemReleaseTask(index, false)
  }

  for (let index = 1; index <= 8; index += 1) {
    createItemReleaseTask(index, true)
  }
}

/** 创建物品放行任务并同步详情、资源和流转记录。 */
function createItemReleaseTask(index: number, finished: boolean) {
  const id = index.toString().padStart(5, '0')
  const irId = finished ? `IR_F_${id}` : `IR_${id}`
  const flowId = finished ? `FLOW_F_${id}` : `FLOW_${id}`
  const typeName = index % 2 === 0 ? '住户搬家放行' : '装修物料放行'
  const detail: ItemReleaseDetail = {
    irId,
    flowId,
    typeName,
    applyCompany: index % 2 === 0 ? '阳光物业服务中心' : '阳光装修服务部',
    applyPerson: generateChineseName(),
    applyTel: generatePhoneNumber(),
    idCard: `4401011990${(index + 10).toString().padStart(2, '0')}0012`,
    carNum: `粤B${12000 + index}`,
    passTime: formatDateTime(Date.now() + (finished ? -1 : 1) * (index % 7) * 3600000),
    remark: finished ? '历史放行记录' : '放行申请说明',
    createUserId: `USER_${id}`,
  }
  const resources: ItemReleaseResource[] = [
    {
      resId: generateId('RES'),
      resName: index % 2 === 0 ? '木质衣柜' : '水泥',
      amount: (index % 3) + 1,
    },
  ]

  releaseDetails.set(irId, detail)
  releaseResources.set(irId, resources)
  releaseComments.set(irId, [
    {
      staffName: '申请人',
      context: '提交放行申请',
      endTime: formatDateTime(Date.now() - 3600000),
    },
    {
      staffName: '物业前台',
      context: finished ? '审核通过' : '待审核',
      endTime: finished ? formatDateTime(Date.now() - 1800000) : undefined,
    },
  ])

  const task: ItemReleaseTask = {
    irId,
    flowId,
    taskId: finished ? undefined : `TASK_${id}`,
    typeName,
    stateName: finished ? '已办结' : '待审核',
    passTime: detail.passTime,
    amount: resources.reduce((sum, item) => sum + item.amount, 0),
    action: finished ? 'View' : 'Audit',
  }

  if (finished) {
    finishTasks.push(task)
  }
  else {
    undoTasks.push(task)
  }
}

/** 审核物品放行并把待办移动到已办。 */
function auditItemRelease(data: AuditItemReleaseParams): boolean {
  const index = undoTasks.findIndex(item => item.irId === data.irId)
  if (index < 0) {
    return true
  }

  const task = undoTasks[index]
  undoTasks.splice(index, 1)
  finishTasks.unshift({
    ...task,
    stateName: data.auditCode === '1100' ? '已办结' : '已拒绝',
    action: 'View',
  })

  const detail = releaseDetails.get(data.irId)
  if (detail) {
    detail.remark = data.auditMessage
  }

  releaseComments.set(data.irId, [
    ...(releaseComments.get(data.irId) || []),
    {
      staffName: '审批人',
      context: data.auditMessage || (data.auditCode === '1100' ? '审核通过' : '审核拒绝'),
      endTime: formatDateTime(),
    },
  ])

  return true
}

/** 把审核请求体收敛为物品放行审核参数。 */
function normalizeAuditParams(body: Record<string, unknown>): AuditItemReleaseParams {
  return {
    irId: asOptionalString(body.irId) || '',
    flowId: asOptionalString(body.flowId) || '',
    taskId: asOptionalString(body.taskId) || '',
    auditCode: asOptionalString(body.auditCode) === '1200' ? '1200' : '1100',
    auditMessage: asOptionalString(body.auditMessage) || '',
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
