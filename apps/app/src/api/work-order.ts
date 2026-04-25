/**
 * 工作单模块 API
 * @description 工作单相关的接口定义
 */

import type { PaginationResponse } from '@/types/api'
import type {
  AuditWorkOrderParams,
  CompleteWorkOrderParams,
  CreateWorkOrderParams,
  UpdateWorkOrderParams,
  WorkOrder,
  WorkOrderDetail,
  WorkTask,
  WorkTaskItem,
} from '@/types/work-order'
import { http } from '@/http/alova'

/**
 * 获取待办工作单列表
 * @param params 查询参数
 * @returns 工作单列表分页数据
 */
export function getWorkOrderTodoList(params: {
  page: number
  row: number
  communityId: string
  status?: string
  type?: string
  keyword?: string
}) {
  return http.Get<PaginationResponse<WorkOrder>>('/app/workorder/todo/list', {
    params,
  })
}

/**
 * 获取抄送工作单列表
 * @param params 查询参数
 * @returns 工作单列表分页数据
 */
export function getWorkOrderCopyList(params: {
  page: number
  row: number
  communityId: string
  status?: string
  keyword?: string
}) {
  return http.Get<PaginationResponse<WorkOrder>>('/app/workorder/copy/list', {
    params,
  })
}

/**
 * 获取工作单详情
 * @param params 查询参数
 * @returns 工作单详情
 */
export function getWorkOrderDetail(params: { orderId: string }) {
  return http.Get<{ order: WorkOrderDetail }>('/app/workorder/detail', {
    params,
  })
}

/**
 * 创建工作单
 * @param data 创建参数
 * @returns 创建结果
 */
export function createWorkOrder(data: CreateWorkOrderParams) {
  return http.Post<{ orderId: string }>('/app/workorder/create', data)
}

/**
 * 更新工作单
 * @param data 更新参数
 * @returns 更新结果
 */
export function updateWorkOrder(data: UpdateWorkOrderParams) {
  return http.Post<{ success: boolean }>('/app/workorder/update', data)
}

/**
 * 开始处理工作单
 * @param data 请求参数
 * @returns 操作结果
 */
export function startWorkOrder(data: { orderId: string }) {
  return http.Post<{ success: boolean }>('/app/workorder/start', data)
}

/**
 * 完成工作单
 * @param data 完成参数
 * @returns 完成结果
 */
export function completeWorkOrder(data: CompleteWorkOrderParams) {
  return http.Post<{ success: boolean }>('/app/workorder/complete', data)
}

/**
 * 审核工作单
 * @param data 审核参数
 * @returns 审核结果
 */
export function auditWorkOrder(data: AuditWorkOrderParams) {
  return http.Post<{ success: boolean }>('/app/workorder/audit', data)
}

/**
 * 取消工作单
 * @param data 请求参数
 * @returns 操作结果
 */
export function cancelWorkOrder(data: { orderId: string, reason?: string }) {
  return http.Post<{ success: boolean }>('/app/workorder/cancel', data)
}

/**
 * 获取工作任务列表
 * @param params 查询参数
 * @returns 任务列表
 */
export function getWorkTaskList(params: {
  workId: string
  page: number
  row: number
}) {
  return http.Get<PaginationResponse<WorkTask>>('/app/workorder/task/list', {
    params,
  })
}

/**
 * 获取工作任务项列表
 * @param params 查询参数
 * @returns 任务项列表
 */
export function getWorkTaskItems(params: {
  workId: string
  states?: string
}) {
  return http.Get<PaginationResponse<WorkTaskItem>>('/app/workorder/task/items', {
    params,
  })
}

/**
 * 完成抄送工作单处理
 * @param data 处理参数
 * @returns 操作结果
 */
export function finishWorkCopy(data: {
  copyId: string
  itemId: string
  score: number
  deductionMoney: number
  deductionReason: string
}) {
  return http.Post<{ success: boolean }>('/app/workorder/copy/finish', data)
}
