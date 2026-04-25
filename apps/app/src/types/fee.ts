/**
 * 费用相关业务类型定义
 */

/** 费用状态枚举 */
export type FeeState = 'UNPAID' | 'PAID' | 'PARTIAL_PAID' | 'OVERDUE'

/** 费用类型枚举 */
export type FeeType = 'PROPERTY' | 'PARKING' | 'WATER' | 'ELECTRICITY' | 'GAS' | 'OTHER'

/** 基础费用信息 */
export interface Fee {
  /** 费用ID */
  feeId: string
  /** 费用名称 */
  feeName: string
  /** 费用类型 */
  feeType: FeeType
  /** 费用类型名称 */
  feeTypeCdName?: string
  /** 房间ID */
  roomId: string
  /** 房间名称 */
  roomName: string
  /** 小区ID */
  communityId: string
  /** 业主姓名 */
  ownerName: string
  /** 业主电话 */
  ownerTel: string
  /** 应收金额 */
  receivedAmount: number
  /** 实收金额 */
  paidAmount: number
  /** 欠费金额 */
  oweAmount: number
  /** 费用开始时间 */
  startTime: string
  /** 费用结束时间 */
  endTime: string
  /** 截止时间 */
  deadlineTime?: string
  /** 费用标识 */
  feeFlagName?: string
  /** 状态 */
  state: FeeState
  /** 状态名称 */
  stateName: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/** 费用列表查询参数 */
export interface FeeListParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  row: number
  /** 小区ID */
  communityId?: string
  /** 房间ID */
  roomId?: string
  /** 房间名称 */
  roomName?: string
  /** 费用类型 */
  feeType?: string
  /** 状态 */
  state?: string
  /** 业主姓名 */
  ownerName?: string
  /** 费用ID */
  feeId?: string
  /** 缴费对象ID（房间ID或其他对象ID） */
  payerObjId?: string
}

/** 费用列表响应 */
export interface FeeListResponse {
  /** 费用列表 */
  list: Fee[]
  /** 总数量 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页数量 */
  row: number
}

/** 费用详情项 */
export interface FeeDetail {
  /** 明细ID */
  detailId: string
  /** 费用ID */
  feeId: string
  /** 费用名称 */
  feeName: string
  /** 房间ID */
  roomId: string
  /** 房间名称 */
  roomName: string
  /** 小区ID */
  communityId: string
  /** 业主姓名 */
  ownerName: string
  /** 缴费金额 */
  receivedAmount: number
  /** 缴费时间 */
  payTime: string
  /** 缴费方式 */
  payMethod: string
  /** 缴费状态 */
  payState: string
  /** 缴费周期 */
  cycles?: string
  /** 创建时间 */
  createTime: string
}

/** 费用详情查询参数 */
export interface FeeDetailParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  row: number
  /** 小区ID */
  communityId: string
  /** 费用ID */
  feeId: string
}

/** 费用详情响应 */
export interface FeeDetailResponse {
  /** 费用详情列表 */
  list: FeeDetail[]
}

/** 欠费信息 */
export interface OweFee {
  /** 欠费ID */
  oweFeeId: string
  /** 费用ID */
  feeId: string
  /** 费用名称 */
  feeName: string
  /** 房间ID */
  roomId: string
  /** 房间名称 */
  roomName: string
  /** 小区ID */
  communityId: string
  /** 业主姓名 */
  ownerName: string
  /** 业主电话 */
  ownerTel: string
  /** 欠费金额 */
  oweAmount: number
  /** 欠费开始时间 */
  startTime: string
  /** 欠费结束时间 */
  endTime: string
  /** 欠费天数 */
  oweDays: number
  /** 滞纳金 */
  lateFee: number
  /** 总金额 */
  totalAmount: number
  /** 状态 */
  state: string
  /** 创建时间 */
  createTime: string
}

/** 欠费查询参数 */
export interface OweFeeParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  row: number
  /** 小区ID */
  communityId: string
  /** 房间ID */
  roomId?: string
  /** 业主ID */
  ownerId?: string
}

/** 欠费列表响应 */
export interface OweFeeListResponse {
  /** 欠费列表 */
  data: OweFee[]
  /** 总金额 */
  totalAmount: number
  /** 总数量 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页数量 */
  row: number
}
