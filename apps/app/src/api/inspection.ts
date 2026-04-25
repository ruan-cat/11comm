/**
 * 巡检模块 API 接口定义
 * 对应业务：巡检任务管理
 */

import type { PaginationParams, PaginationResponse } from '@/types/api'
import type {
  InspectionItemTitle,
  InspectionSubmitParams,
  InspectionTask,
  InspectionTaskDetail,
  InspectionTodayReport,
  InspectionTransferParams,
} from '@/types/inspection'
import { http } from '@/http/alova'

/** ==================== 查询接口 ==================== */

/** 1. 查询巡检任务列表 */
export function getInspectionTaskList(params: {
  page: number
  row: number
  moreState?: string
  isToday?: number
  canReexamine?: string
  planInsTime?: string
}) {
  return http.Get<PaginationResponse<InspectionTask>>('/app/inspection.listInspectionTasks', { params })
}

/** 2. 查询今日巡检统计 */
export function getInspectionTodayReport(params: {
  communityId?: string
  queryTime?: string
}) {
  return http.Get<InspectionTodayReport[]>('/app/inspection.getTodayReport', { params })
}

/** 3. 查询巡检任务详情 */
export function getInspectionTaskDetail(params: {
  communityId?: string
  taskId?: string
  planUserId?: string
  queryTime?: string
  inspectionId?: string
  state?: string
  qrCodeTime?: string
} & PaginationParams) {
  return http.Get<PaginationResponse<InspectionTaskDetail>>('/app/inspection.listInspectionTaskDetails', { params })
}

/** 4. 查询巡检项标题 */
export function getInspectionItemTitles(params: {
  communityId?: string
  itemId: string
} & PaginationParams) {
  return http.Get<PaginationResponse<InspectionItemTitle>>('/app/inspection.listInspectionItemTitles', { params })
}

/** 5. 查询员工列表 */
export function getStaffList(params?: {
  communityId?: string
}) {
  return http.Get<Array<{ userId: string, userName: string }>>('/app/staff.listStaffs', { params })
}

/** ==================== 操作接口 ==================== */

/** 6. 提交巡检结果 */
export function submitInspection(data: InspectionSubmitParams) {
  return http.Post<{ success: boolean }>('/app/inspection.submitInspection', data)
}

/** 7. 流转巡检任务 */
export function transferInspectionTask(data: InspectionTransferParams) {
  return http.Post<{ success: boolean }>('/app/inspection.transferTask', data)
}
