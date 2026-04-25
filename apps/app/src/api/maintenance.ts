/**
 * 设备保养模块 API 接口定义
 * 对应业务：设备保养任务管理
 */

import type { PaginationResponse } from '@/types/api'
import type {
  MaintenanceQueryParams,
  MaintenanceSingleSubmitParams,
  MaintenanceTask,
  MaintenanceTaskDetail,
  MaintenanceTransferParams,
} from '@/types/maintenance'
import { http } from '@/http/alova'

/** ==================== 查询接口 ==================== */

/** 1. 查询设备保养任务列表 */
export function getMaintenanceList(params: MaintenanceQueryParams) {
  return http.Get<PaginationResponse<MaintenanceTask>>('/app/maintenance.listMaintenanceTasks', { params })
}

/** 2. 获取保养任务详情 */
export function getMaintenanceDetail(params: { taskId: string }) {
  return http.Get<{ task: MaintenanceTask }>('/app/maintenance.queryMaintenanceTask', { params })
}

/** 3. 获取保养任务详情项列表 */
export function getMaintenanceDetailItems(params: { taskId: string }) {
  return http.Get<{ items: MaintenanceTaskDetail[] }>('/app/maintenance.listMaintenanceTaskDetails', { params })
}

/** ==================== 操作接口 ==================== */

/** 4. 开始保养任务 */
export function startMaintenanceTask(data: { taskId: string }) {
  return http.Post<{ success: boolean }>('/app/maintenance.startMaintenanceTask', data)
}

/** 5. 完成保养任务 */
export function completeMaintenanceTask(data: { taskId: string }) {
  return http.Post<{ success: boolean }>('/app/maintenance.completeMaintenanceTask', data)
}

/** 6. 提交单项保养 */
export function submitMaintenanceSingle(data: MaintenanceSingleSubmitParams) {
  return http.Post<{ success: boolean }>('/app/maintenance.submitMaintenanceSingle', data)
}

/** 7. 任务流转 */
export function transferMaintenanceTask(data: MaintenanceTransferParams) {
  return http.Post<{ success: boolean }>('/app/maintenance.transferMaintenanceTask', data)
}
