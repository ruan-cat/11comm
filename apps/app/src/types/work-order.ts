/**
 * 工作单模块类型定义
 * @description 定义工作单相关的接口和类型
 */

/** 工作单状态枚举 */
export enum WorkOrderStatus {
  /** 待处理 */
  PENDING = '10001',
  /** 处理中 */
  PROCESSING = '10002',
  /** 已完成 */
  COMPLETED = '10003',
  /** 已驳回 */
  REJECTED = '10004',
  /** 已取消 */
  CANCELLED = '10005',
}

/** 工作单状态名称映射 */
export const WorkOrderStatusName: Record<string, string> = {
  [WorkOrderStatus.PENDING]: '待处理',
  [WorkOrderStatus.PROCESSING]: '处理中',
  [WorkOrderStatus.COMPLETED]: '已完成',
  [WorkOrderStatus.REJECTED]: '已驳回',
  [WorkOrderStatus.CANCELLED]: '已取消',
}

/** 工作单类型枚举 */
export enum WorkOrderType {
  /** 日常工作 */
  DAILY = '1',
  /** 临时任务 */
  TEMPORARY = '2',
  /** 周期任务 */
  PERIODIC = '3',
}

/** 工作单类型名称映射 */
export const WorkOrderTypeName: Record<string, string> = {
  [WorkOrderType.DAILY]: '日常工作',
  [WorkOrderType.TEMPORARY]: '临时任务',
  [WorkOrderType.PERIODIC]: '周期任务',
}

/** 工作单优先级枚举 */
export enum WorkOrderPriority {
  /** 低 */
  LOW = '1',
  /** 中 */
  MEDIUM = '2',
  /** 高 */
  HIGH = '3',
  /** 紧急 */
  URGENT = '4',
}

/** 工作单优先级名称映射 */
export const WorkOrderPriorityName: Record<string, string> = {
  [WorkOrderPriority.LOW]: '低',
  [WorkOrderPriority.MEDIUM]: '中',
  [WorkOrderPriority.HIGH]: '高',
  [WorkOrderPriority.URGENT]: '紧急',
}

/**
 * 工作单信息接口
 * @description 工作单列表项数据结构
 */
export interface WorkOrder {
  /** 工作单ID */
  orderId: string
  /** 工作单编号 */
  orderNo: string
  /** 工作单标题 */
  title: string
  /** 工作单类型 */
  type: string
  /** 工作单类型名称 */
  typeName: string
  /** 工作单状态 */
  status: string
  /** 工作单状态名称 */
  statusName: string
  /** 优先级 */
  priority: string
  /** 优先级名称 */
  priorityName: string
  /** 工作内容描述 */
  content: string
  /** 执行人ID */
  staffId?: string
  /** 执行人姓名 */
  staffName?: string
  /** 创建人ID */
  creatorId: string
  /** 创建人姓名 */
  creatorName: string
  /** 计划开始时间 */
  planStartTime?: string
  /** 计划结束时间 */
  planEndTime?: string
  /** 实际开始时间 */
  actualStartTime?: string
  /** 实际结束时间 */
  actualEndTime?: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime?: string
  /** 小区ID */
  communityId: string
  /** 小区名称 */
  communityName?: string
  /** 是否抄送给我 */
  isCopyToMe?: boolean
}

/**
 * 工作单详情接口
 * @description 工作单详情数据结构，包含更多信息
 */
export interface WorkOrderDetail extends WorkOrder {
  /** 工作单附件列表 */
  attachments?: string[]
  /** 完成备注 */
  completeRemark?: string
  /** 完成照片 */
  completePhotos?: string[]
  /** 抄送人列表 */
  copyUsers?: WorkOrderCopyUser[]
  /** 操作记录 */
  operationLogs?: WorkOrderLog[]
  /** 结束时间 */
  endTime?: string
  /** 执行人列表 */
  staffs?: WorkOrderStaff[]
  /** 抄送执行人列表 */
  copyStaffs?: WorkOrderStaff[]
}

/**
 * 工作单执行人信息
 */
export interface WorkOrderStaff {
  /** 员工ID */
  staffId: string
  /** 员工姓名 */
  staffName?: string
}

/**
 * 工作单抄送人接口
 */
export interface WorkOrderCopyUser {
  /** 用户ID */
  userId: string
  /** 用户姓名 */
  userName: string
}

/**
 * 工作单操作记录接口
 */
export interface WorkOrderLog {
  /** 记录ID */
  logId: string
  /** 工作单ID */
  orderId: string
  /** 操作类型 */
  operationType: string
  /** 操作类型名称 */
  operationTypeName: string
  /** 操作人ID */
  operatorId: string
  /** 操作人姓名 */
  operatorName: string
  /** 操作时间 */
  operationTime: string
  /** 操作备注 */
  remark?: string
}

/**
 * 创建工作单请求参数
 */
export interface CreateWorkOrderParams {
  /** 工作单标题 */
  title: string
  /** 工作单类型 */
  type: string
  /** 优先级 */
  priority: string
  /** 工作内容描述 */
  content: string
  /** 执行人ID */
  staffId?: string
  /** 计划开始时间 */
  planStartTime?: string
  /** 计划结束时间 */
  planEndTime?: string
  /** 附件列表 */
  attachments?: string[]
  /** 抄送人ID列表 */
  copyUserIds?: string[]
  /** 小区ID */
  communityId: string
}

/**
 * 更新工作单请求参数
 */
export interface UpdateWorkOrderParams {
  /** 工作单ID */
  orderId: string
  /** 工作单标题 */
  title?: string
  /** 工作单类型 */
  type?: string
  /** 优先级 */
  priority?: string
  /** 工作内容描述 */
  content?: string
  /** 执行人ID */
  staffId?: string
  /** 计划开始时间 */
  planStartTime?: string
  /** 计划结束时间 */
  planEndTime?: string
  /** 附件列表 */
  attachments?: string[]
  /** 抄送人ID列表 */
  copyUserIds?: string[]
}

/**
 * 完成工作单请求参数
 */
export interface CompleteWorkOrderParams {
  /** 工作单ID */
  orderId: string
  /** 完成备注 */
  remark?: string
  /** 完成照片 */
  photos?: string[]
}

/**
 * 审核工作单请求参数
 */
export interface AuditWorkOrderParams {
  /** 工作单ID */
  orderId: string
  /** 审核结果：pass-通过，reject-驳回 */
  result: 'pass' | 'reject'
  /** 审核意见 */
  opinion?: string
}

/**
 * 工作任务接口
 * @description 工作单的处理人任务信息
 */
export interface WorkTask {
  /** 任务ID */
  taskId: string
  /** 工作单ID */
  workId: string
  /** 员工ID */
  staffId: string
  /** 员工姓名 */
  staffName: string
  /** 任务状态 */
  state: string
  /** 创建时间 */
  createTime: string
}

/**
 * 工作任务项接口
 * @description 工作单任务的具体执行项
 */
export interface WorkTaskItem {
  /** 任务项ID */
  itemId: string
  /** 工作单ID */
  workId: string
  /** 任务ID */
  taskId: string
  /** 内容 */
  content: string
  /** 员工ID */
  staffId?: string
  /** 员工姓名 */
  staffName?: string
  /** 状态：W-未办理，C-已完成，P-处理中 */
  state: string
  /** 备注 */
  remark?: string
  /** 完成时间 */
  finishTime?: string
  /** 附件URL列表 */
  pathUrls?: string[]
  /** 创建时间 */
  createTime: string
}
