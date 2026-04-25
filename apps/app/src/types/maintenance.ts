/**
 * 设备保养模块类型定义
 */

/** 设备保养任务 */
export interface MaintenanceTask {
  /** 任务ID */
  taskId: string
  /** 任务名称 */
  taskName: string
  /** 设备名称 */
  machineName: string
  /** 设备ID */
  machineId: string
  /** 计划时间 */
  planTime: string
  /** 状态代码 */
  status: string
  /** 状态名称 */
  statusName: string
  /** 执行人ID */
  staffId?: string
  /** 执行人姓名 */
  staffName?: string
  /** 小区ID */
  communityId: string
}

/** 保养任务详情项 */
export interface MaintenanceTaskDetail {
  /** 详情ID */
  taskDetailId: string
  /** 任务ID */
  taskId: string
  /** 保养项名称 */
  itemName: string
  /** 保养内容 */
  itemContent: string
  /** 执行结果 */
  result?: string
  /** 备注 */
  remark?: string
  /** 照片列表 */
  photos?: string[]
}

/** 保养任务查询参数 */
export interface MaintenanceQueryParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  row: number
  /** 小区ID */
  communityId: string
  /** 状态筛选 */
  status?: string
}

/** 保养任务状态枚举 */
export const MaintenanceStatusMap = {
  /** 待保养 */
  PENDING: '10001',
  /** 保养中 */
  PROCESSING: '10002',
  /** 已完成 */
  COMPLETED: '10003',
} as const

/** 保养任务状态名称映射 */
export const MaintenanceStatusNameMap: Record<string, string> = {
  [MaintenanceStatusMap.PENDING]: '待保养',
  [MaintenanceStatusMap.PROCESSING]: '保养中',
  [MaintenanceStatusMap.COMPLETED]: '已完成',
}

/** 任务流转参数 */
export interface MaintenanceTransferParams {
  /** 任务ID */
  taskId: string
  /** 目标员工ID */
  targetStaffId: string
  /** 流转原因 */
  reason: string
}

/** 单项保养提交参数 */
export interface MaintenanceSingleSubmitParams {
  /** 详情ID */
  taskDetailId: string
  /** 任务ID */
  taskId: string
  /** 执行结果 */
  result: string
  /** 备注 */
  remark?: string
  /** 照片列表 */
  photos?: string[]
}
