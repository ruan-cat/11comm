/**
 * 投诉模块类型定义
 *
 * 包含投诉单、投诉事件、投诉评价等核心数据结构
 *
 * 旧代码：gitee-example/api/complaint/complaint.js
 */

/** ==================== 常量定义 ==================== */

/**
 * 投诉类型编码
 * @description 区分投诉和建议
 */
export const ComplaintTypeCode = {
  /** 投诉 */
  COMPLAINT: '809001',
  /** 建议 */
  SUGGESTION: '809002',
} as const

/**
 * 投诉处理状态编码
 * @description 投诉单的处理结果状态
 */
export const ComplaintStateCode = {
  /** 无法处理 */
  CANNOT_HANDLE: '1200',
  /** 已处理 */
  HANDLED: '1100',
} as const

/**
 * 投诉事件类型
 * @description 投诉工单流转过程中的事件类型
 */
export const ComplaintEventType = {
  /** 投诉创建 */
  CREATE: '1000',
  /** 投诉处理 */
  HANDLE: '1001',
  /** 投诉评价 */
  APPRAISE: '2002',
  /** 评价回复 */
  REPLY: '3003',
} as const

/**
 * 投诉评价状态
 * @description 评价的处理状态
 */
export const ComplaintAppraiseState = {
  /** 待回复 */
  WAITING: 'W',
  /** 已回复 */
  COMPLETED: 'C',
} as const

/** ==================== 基础类型 ==================== */

/**
 * 投诉图片
 * @description 投诉单中的图片信息
 */
export interface ComplaintPhoto {
  /** 图片 ID */
  photoId?: string
  /** 投诉 ID */
  complaintId?: string
  /** 图片 URL 地址 */
  url?: string
  /** 图片 Base64 数据 */
  photo?: string
}

/**
 * 投诉单基础信息
 * @description 投诉工单的核心数据结构
 */
export interface Complaint {
  /** 投诉 ID */
  complaintId: string
  /** 小区 ID */
  communityId: string
  /** 门店 ID */
  storeId: string
  /** 用户 ID */
  userId: string
  /** 投诉类型编码 (809001-投诉, 809002-建议) */
  typeCd: string
  /** 投诉类型名称 */
  typeName: string
  /** 投诉人姓名 */
  complaintName: string
  /** 投诉人电话 */
  tel: string
  /** 房间 ID */
  roomId?: string
  /** 房间名称 (楼栋-单元-房间) */
  roomName?: string
  /** 楼栋编号 */
  floorNum?: string
  /** 单元编号 */
  unitNum?: string
  /** 房间编号 */
  roomNum?: string
  /** 投诉内容 */
  context: string
  /** 状态编码 */
  state?: string
  /** 状态名称 */
  stateName?: string
  /** 创建时间 */
  createTime: string
  /** 任务 ID (工作流任务ID) */
  taskId?: string
  /** 投诉图片列表 */
  photos?: ComplaintPhoto[]
}

/**
 * 投诉工单流转事件
 * @description 记录投诉单在处理过程中的流转记录
 */
export interface ComplaintEvent {
  /** 事件 ID */
  eventId: string
  /** 投诉 ID */
  complaintId: string
  /** 小区 ID */
  communityId: string
  /** 事件类型 (1000-创建, 1001-处理, 2002-评价, 3003-回复) */
  eventType: string
  /** 事件类型名称 */
  eventTypeName?: string
  /** 创建人 ID */
  createUserId?: string
  /** 创建人姓名 */
  createUserName?: string
  /** 创建时间 */
  createTime: string
  /** 备注/处理意见/评价内容 */
  remark?: string
}

/**
 * 投诉评价
 * @description 业主对投诉处理结果的评价
 */
export interface ComplaintAppraise {
  /** 评价 ID */
  appraiseId: string
  /** 投诉 ID */
  complaintId: string
  /** 小区 ID */
  communityId: string
  /** 评价内容 */
  context: string
  /** 评价分数 */
  score: string | number
  /** 评价状态 (W-待回复, C-已回复) */
  state: string
  /** 评价状态名称 */
  stateName?: string
  /** 回复内容 */
  replyContext?: string
  /** 创建时间 */
  createTime: string
  /** 创建人姓名 */
  createUserName?: string
}

/** ==================== API 请求参数 ==================== */

/**
 * 查询投诉列表参数
 * @description 用于待办投诉列表和已办投诉列表查询
 */
export interface QueryComplaintListParams {
  /** 页码 */
  page: number
  /** 每页条数 */
  row: number
  /** 用户 ID */
  userId: string
  /** 门店 ID */
  storeId?: string
  /** 小区 ID */
  communityId: string
  /** 流程状态 (可选, START-进行中) */
  process?: string
}

/**
 * 保存投诉参数
 * @description 业主提交投诉时的表单数据
 */
export interface SaveComplaintParams {
  /** 投诉类型编码 */
  typeCd: string
  /** 投诉人姓名 */
  complaintName: string
  /** 投诉人电话 */
  tel: string
  /** 房间 ID */
  roomId: string
  /** 投诉内容 */
  context: string
  /** 图片列表 (Base64) */
  photos: Array<{ photo: string }>
  /** 用户 ID */
  userId: string
  /** 门店 ID */
  storeId: string
  /** 小区 ID */
  communityId: string
}

/**
 * 处理投诉参数
 * @description 物业人员处理投诉时的表单数据
 */
export interface HandleComplaintParams {
  /** 处理意见 */
  context: string
  /** 小区 ID */
  communityId: string
  /** 投诉 ID */
  complaintId: string
  /** 用户 ID (可选) */
  userId?: string
  /** 门店 ID (可选) */
  storeId?: string
  /** 任务 ID (可选) */
  taskId?: string
  /** 状态 (可选) */
  state?: string
}

/**
 * 审核投诉参数
 * @description 审核投诉单时的表单数据
 */
export interface AuditComplaintParams {
  /** 处理结果状态 (1100-已处理, 1200-无法处理) */
  state: string
  /** 处理意见 */
  remark: string
  /** 任务 ID */
  taskId: string
  /** 投诉 ID */
  complaintId: string
  /** 小区 ID */
  communityId: string
  /** 门店 ID */
  storeId: string
  /** 用户 ID */
  userId: string
}

/**
 * 查询投诉事件参数
 * @description 查询投诉工单流转记录
 */
export interface QueryComplaintEventParams {
  /** 投诉 ID */
  complaintId: string
  /** 小区 ID */
  communityId: string
  /** 页码 */
  page: number
  /** 每页条数 */
  row: number
}

/**
 * 查询投诉评价参数
 * @description 查询投诉评价列表
 */
export interface QueryComplaintAppraiseParams {
  /** 投诉 ID */
  complaintId: string
  /** 小区 ID */
  communityId: string
  /** 页码 */
  page: number
  /** 每页条数 */
  row: number
}

/**
 * 回复投诉评价参数
 * @description 物业人员回复业主评价
 */
export interface ReplyComplaintAppraiseParams {
  /** 评价 ID */
  appraiseId: string
  /** 小区 ID */
  communityId: string
  /** 回复内容 */
  replyContext: string
}

/** ==================== API 响应类型 ==================== */

/**
 * 投诉列表响应
 * @description 待办/已办投诉列表的 API 响应
 */
export interface ComplaintListResponse {
  /** 投诉列表数据 */
  data: Complaint[]
  /** 总记录数 */
  total?: number
  /** 当前页码 */
  page?: number
  /** 每页条数 */
  records?: number
}

/**
 * 用户侧投诉历史列表响应
 * @description 与 `listAuditHistoryComplaints` 等业务路径返回的 `complaints` 字段对齐
 */
export interface ComplaintHistoryListResponse {
  /** 投诉列表 */
  complaints: Complaint[]
  /** 总记录数 */
  total?: number
}

/**
 * 投诉事件列表响应
 * @description 投诉工单流转记录的 API 响应
 */
export interface ComplaintEventListResponse {
  /** 事件列表数据 */
  data: ComplaintEvent[]
  /** 总记录数 */
  total?: number
}

/**
 * 投诉评价列表响应
 * @description 投诉评价列表的 API 响应
 */
export interface ComplaintAppraiseListResponse {
  /** 评价列表数据 */
  data: ComplaintAppraise[]
  /** 总记录数 */
  total?: number
}

/**
 * 通用操作响应
 * @description 保存、处理、审核等操作的 API 响应
 */
export interface ComplaintOperationResponse {
  /** 操作是否成功 */
  success: boolean
  /** 响应消息 */
  message?: string
  /** 响应数据 (可选) */
  data?: any
}
