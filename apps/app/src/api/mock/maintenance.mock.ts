/**
 * 设备保养模块 Mock 接口。
 */

import type {
  MaintenanceSingleSubmitParams,
  MaintenanceTask,
  MaintenanceTaskDetail,
  MaintenanceTransferParams,
} from '../../types/maintenance'
import { MaintenanceStatusMap, MaintenanceStatusNameMap } from '../../types/maintenance'
import { createPaginationResponse, defineUniAppMock, errorResponse, formatDateTime, generateChineseName, successResponse } from './shared/utils'

interface MockContext {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

/** 设备名称库。 */
const machineNames = ['1号电梯', '2号电梯', '消防水泵', '生活水泵', '配电房设备', '门禁系统']

/** 保养项名称库。 */
const itemNames = ['外观检查', '运行状态检查', '润滑保养', '清洁保养', '紧固件检查', '安全装置检查']

/** 保养任务 mock 数据。 */
const maintenanceTasks: MaintenanceTask[] = Array.from({ length: 15 }, (_, index) => createMaintenanceTask(index + 1))

/** 保养任务详情项 mock 数据。 */
const maintenanceDetails = new Map<string, MaintenanceTaskDetail[]>(
  maintenanceTasks.map(task => [
    task.taskId,
    Array.from({ length: 5 }, (_, index) => createMaintenanceTaskDetail(task.taskId, index + 1)),
  ]),
)

export default defineUniAppMock([
  {
    url: '/app/maintenance.listMaintenanceTasks',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const params = getRequestParams(context)
      const communityId = asOptionalString(params.communityId) || 'COMM_001'
      const status = asOptionalString(params.status)
      const list = maintenanceTasks
        .filter(task => task.communityId === communityId)
        .filter(task => !status || task.status === status)

      return successResponse(createPaginationResponse(
        list,
        asPositiveNumber(params.page, 1),
        asPositiveNumber(params.row, 10),
      ))
    },
  },
  {
    url: '/app/maintenance.queryMaintenanceTask',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const taskId = asOptionalString(getRequestParams(context).taskId)
      if (!taskId) {
        return errorResponse('任务ID不能为空', '400')
      }

      const task = maintenanceTasks.find(item => item.taskId === taskId)
      if (!task) {
        return errorResponse('任务不存在', '404')
      }

      return successResponse({ task })
    },
  },
  {
    url: '/app/maintenance.listMaintenanceTaskDetails',
    method: ['GET', 'POST'],
    body: (context: MockContext = {}) => {
      const taskId = asOptionalString(getRequestParams(context).taskId)
      if (!taskId) {
        return errorResponse('任务ID不能为空', '400')
      }

      return successResponse({ items: maintenanceDetails.get(taskId) || [] })
    },
  },
  {
    url: '/app/maintenance.startMaintenanceTask',
    method: 'POST',
    body: (context: MockContext = {}) => changeTaskStatus(
      asOptionalString(context.body?.taskId),
      MaintenanceStatusMap.PENDING,
      MaintenanceStatusMap.PROCESSING,
      '开始保养成功',
      '开始任务失败',
    ),
  },
  {
    url: '/app/maintenance.completeMaintenanceTask',
    method: 'POST',
    body: (context: MockContext = {}) => changeTaskStatus(
      asOptionalString(context.body?.taskId),
      MaintenanceStatusMap.PROCESSING,
      MaintenanceStatusMap.COMPLETED,
      '保养完成',
      '完成任务失败',
    ),
  },
  {
    url: '/app/maintenance.submitMaintenanceSingle',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const success = submitSingle(normalizeSingleSubmitParams(context.body || {}))
      if (!success) {
        return errorResponse('提交失败', '400')
      }

      return successResponse({ success: true }, '提交成功')
    },
  },
  {
    url: '/app/maintenance.transferMaintenanceTask',
    method: 'POST',
    body: (context: MockContext = {}) => {
      const success = transferTask(normalizeTransferParams(context.body || {}))
      if (!success) {
        return errorResponse('流转失败', '400')
      }

      return successResponse({ success: true }, '流转成功')
    },
  },
])

/** 创建保养任务。 */
function createMaintenanceTask(index: number): MaintenanceTask {
  const status = [MaintenanceStatusMap.PENDING, MaintenanceStatusMap.PROCESSING, MaintenanceStatusMap.COMPLETED][(index - 1) % 3]
  const machineName = machineNames[index % machineNames.length]

  return {
    taskId: `MT_${String(index).padStart(3, '0')}`,
    taskName: `${machineName}定期保养`,
    machineName,
    machineId: `MACHINE_${String(index).padStart(3, '0')}`,
    planTime: formatDateTime(Date.now() + (index - 7) * 86400000),
    status,
    statusName: MaintenanceStatusNameMap[status],
    staffId: status !== MaintenanceStatusMap.PENDING ? `STAFF_${String(index).padStart(3, '0')}` : undefined,
    staffName: status !== MaintenanceStatusMap.PENDING ? generateChineseName() : undefined,
    communityId: 'COMM_001',
  }
}

/** 创建保养任务详情项。 */
function createMaintenanceTaskDetail(taskId: string, index: number): MaintenanceTaskDetail {
  const itemName = itemNames[index % itemNames.length]

  return {
    taskDetailId: `MTD_${taskId}_${String(index).padStart(2, '0')}`,
    taskId,
    itemName,
    itemContent: `${itemName}，记录设备状态并上传结果。`,
    result: index % 2 === 0 ? '正常' : undefined,
    remark: index % 3 === 0 ? '无异常' : undefined,
    photos: index % 4 === 0 ? [`https://picsum.photos/400/300?random=${taskId}_${index}`] : undefined,
  }
}

/** 变更保养任务状态。 */
function changeTaskStatus(
  taskId: string | undefined,
  requiredStatus: string,
  nextStatus: string,
  successMessage: string,
  failMessage: string,
) {
  if (!taskId) {
    return errorResponse('任务ID不能为空', '400')
  }

  const task = maintenanceTasks.find(item => item.taskId === taskId)
  if (!task || task.status !== requiredStatus) {
    return errorResponse(failMessage, '400')
  }

  task.status = nextStatus
  task.statusName = MaintenanceStatusNameMap[nextStatus]
  if (nextStatus === MaintenanceStatusMap.PROCESSING) {
    task.staffId = 'STAFF_001'
    task.staffName = generateChineseName()
  }

  return successResponse({ success: true }, successMessage)
}

/** 提交单个保养项。 */
function submitSingle(params: MaintenanceSingleSubmitParams): boolean {
  const details = maintenanceDetails.get(params.taskId)
  const detail = details?.find(item => item.taskDetailId === params.taskDetailId)

  if (!detail) {
    return false
  }

  detail.result = params.result
  detail.remark = params.remark
  detail.photos = params.photos

  return true
}

/** 流转保养任务。 */
function transferTask(params: MaintenanceTransferParams): boolean {
  const task = maintenanceTasks.find(item => item.taskId === params.taskId)
  if (!task) {
    return false
  }

  task.staffId = params.targetStaffId
  task.staffName = generateChineseName()

  return true
}

/** 把请求体收敛为单项提交参数。 */
function normalizeSingleSubmitParams(body: Record<string, unknown>): MaintenanceSingleSubmitParams {
  return {
    taskDetailId: asOptionalString(body.taskDetailId) || '',
    taskId: asOptionalString(body.taskId) || '',
    result: asOptionalString(body.result) || '',
    remark: asOptionalString(body.remark),
    photos: Array.isArray(body.photos) ? body.photos.map(item => `${item}`) : undefined,
  }
}

/** 把请求体收敛为任务流转参数。 */
function normalizeTransferParams(body: Record<string, unknown>): MaintenanceTransferParams {
  return {
    taskId: asOptionalString(body.taskId) || '',
    targetStaffId: asOptionalString(body.targetStaffId) || '',
    reason: asOptionalString(body.reason) || '',
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
