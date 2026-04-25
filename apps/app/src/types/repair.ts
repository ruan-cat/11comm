/**
 * 维修工单模块 - 完整业务类型定义
 * 包含所有维修工单流程相关的类型
 */

import type { PaginationParams, PriorityType } from './api'

// ==================== 枚举类型 ====================

/** 维修状态代码（旧版 statusCd） */
export type RepairStatus = string

/** 维修类型代码（旧版 repairType） */
export type RepairType = string

/** 维修对象类型 */
export type RepairObjType
  = | '001' // 业主房屋
    | '002' // 公共区域
    | '003' // 商铺
    | '004' // 公共设施

/** 维修渠道 */
export type RepairChannel
  = | 'OWNER' // 业主报修
    | 'STAFF' // 员工发现
    | 'PATROL' // 巡检发现
    | 'OTHER' // 其他渠道

/** 维修类型标志（是否用料/收费） */
export type MaintenanceType
  = | '1001' // 有偿用料
    | '1002' // 无偿用料
    | '1003' // 有偿不用料
    | '1004' // 无偿不用料

/** 派单操作类型 */
export type DispatchAction
  = | 'DISPATCH' // 派单
    | 'TRANSFER' // 转单
    | 'RETURN' // 退单
    | 'BACK' // 退单（与RETURN同义，兼容不同命名）
    | 'FINISH' // 办结

/** 支付方式 */
export type PaymentType
  = | 'CASH' // 现金
    | 'WECHAT' // 微信
    | 'ALIPAY' // 支付宝
    | 'BANK' // 银行卡
    | 'OTHER' // 其他

// ==================== 图片相关类型 ====================

/** 维修图片 */
export interface RepairPhoto {
  /** 图片URL（字段名可能是 photo 或 url） */
  photo?: string
  url?: string
}

// ==================== 维修师傅类型 ====================

/** 维修师傅信息 */
export interface RepairStaff {
  /** 师傅ID */
  staffId: string
  /** 师傅姓名 */
  staffName: string
  /** 擅长的维修类型列表 */
  repairTypes?: string[]
  /** 联系电话 */
  phone?: string
  /** 所属部门 */
  department?: string
}

// ==================== 维修物品/资源类型 ====================

/** 维修物品/资源 */
export interface RepairResource {
  /** 资源ID（自定义商品时可为空） */
  resId?: string
  /** 资源名称 */
  resName?: string
  /** 资源类型名称 */
  resTypeName?: string
  /** 资源类型ID */
  rstId?: string
  /** 规格名称 */
  specName?: string
  /** 价格 */
  price?: number
  /** 最低价格 */
  outLowPrice?: number
  /** 最高价格 */
  outHighPrice?: number
  /** 使用数量 */
  useNumber?: number
  /** 库存数量 */
  stock?: number
  /** 单位 */
  unit?: string
  /** 是否自定义商品 */
  isCustom?: boolean
  /** 自定义商品名称 */
  customGoodsName?: string
}

/** 资源类型配置 */
export interface ResourceStoreType {
  /** 类型ID */
  rstId: string
  /** 类型名称 */
  name: string
  /** 父级类型ID */
  parentRstId?: string
}

// ==================== 工单流转记录类型 ====================

/** 维修工单流转记录 */
export interface RepairStaffRecord {
  /** 流转记录ID（用于回复评价） */
  ruId?: string
  /** 师傅ID */
  staffId: string
  /** 师傅姓名 */
  staffName: string
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime?: string
  /** 状态码 */
  statusCd: string
  /** 状态名称 */
  statusName: string
  /** 处理意见 */
  context?: string
  /** 支付方式名称 */
  payTypeName?: string
}

// ==================== 维修工单核心类型 ====================

/** 维修工单完整信息 */
export interface RepairOrder {
  // ========== 基础信息 ==========
  /** 工单ID */
  repairId: string
  /** 工单标题 */
  title?: string
  /** 报修内容（旧版主字段） */
  context?: string

  // ========== 报修人信息 ==========
  /** 报修人姓名（旧版主字段） */
  repairName?: string
  /** 联系电话（旧版主字段） */
  tel?: string

  // ========== 维修位置信息 ==========
  /** 维修地址 */
  address?: string
  /** 报修位置名称 */
  repairObjName?: string
  /** 报修对象类型 */
  repairObjType?: RepairObjType
  /** 所属小区ID */
  communityId?: string
  /** 所属门店ID */
  storeId?: string

  // ========== 维修类型和状态 ==========
  /** 维修类型代码 */
  repairType?: RepairType
  /** 维修类型名称（显示用） */
  repairTypeName?: string
  /** 工单状态代码（旧版 statusCd） */
  statusCd?: RepairStatus
  /** 状态名称 */
  statusName?: string
  /** 优先级 */
  priority?: PriorityType
  /** 维修方式（100=抢单方式） */
  repairWay?: string
  /** 回访标识（001/002=定时任务处理，003=需要回访） */
  returnVisitFlag?: string

  // ========== 维修渠道和类型 ==========
  /** 报修渠道 */
  repairChannel?: RepairChannel
  /** 是否公共区域 */
  publicArea?: string
  /** 维修类型标志（是否用料/收费） */
  maintenanceType?: MaintenanceType

  // ========== 时间信息 ==========
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
  /** 预约时间 */
  appointmentTime?: string

  // ========== 维修师傅信息 ==========
  /** 当前维修师傅名称 */
  assignedWorker?: string | null
  /** 当前维修师傅ID */
  staffId?: string
  /** 前一个维修师傅ID */
  preStaffId?: string
  /** 前一个维修师傅名称 */
  preStaffName?: string

  // ========== 费用信息 ==========
  /** 预估费用 */
  estimatedCost?: number
  /** 实际费用 */
  actualCost?: number | null
  /** 总价 */
  totalPrice?: number
  /** 支付方式 */
  payType?: PaymentType
  /** 支付方式名称 */
  payTypeName?: string

  // ========== 图片信息 ==========
  /** 工单图片（通用字段） */
  images?: string[]
  /** 业主报修图片 */
  repairPhotos?: RepairPhoto[]
  /** 维修前图片 */
  beforePhotos?: RepairPhoto[]
  /** 维修后图片 */
  afterPhotos?: RepairPhoto[]

  // ========== 物品信息 ==========
  /** 使用的物品列表 */
  choosedGoodsList?: RepairResource[]
  /** 使用物品数量 */
  useNumber?: number

  // ========== 评价信息 ==========
  /** 评价信息 */
  evaluation?: {
    rating: number
    comment: string
    evaluateTime: string
  }

  // ========== 其他信息 ==========
  /** 处理意见 */
  remark?: string
  /** 用户ID */
  userId?: string
  /** 用户名称 */
  userName?: string
}

// ==================== 查询参数类型 ====================

/** 维修工单列表查询参数 */
export interface RepairListParams extends PaginationParams {
  /** 小区ID */
  communityId?: string
  /** 工单状态码（旧版 statusCd） */
  statusCd?: RepairStatus
  /** 维修类型 */
  repairType?: RepairType
  /** 关键词搜索 */
  keyword?: string
  /** 报修人姓名搜索（与后端实际字段对应） */
  repairName?: string
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
  /** 指派的维修工 */
  assignedWorker?: string
  /** 门店ID */
  storeId?: string
  /** 用户ID */
  userId?: string
  /** 请求来源 */
  reqSource?: string
}

/** 维修工单列表响应 */
export interface RepairListResponse {
  /** 工单列表 */
  ownerRepairs: RepairOrder[]
  /** 总数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页数量 */
  row: number
}

// ==================== 创建和更新类型 ====================

/** 创建维修工单请求 */
export interface CreateRepairReq {
  /** 维修标题 */
  title: string
  /** 报修人姓名 */
  repairName: string
  /** 报修类型代码 */
  repairType: string
  /** 报修类型名称 */
  repairTypeName?: string
  /** 预约时间 */
  appointmentTime: string
  /** 联系电话 */
  tel: string
  /** 报修内容 */
  context: string
  /** 维修地址/对象名称 */
  address: string
  /** 小区ID */
  communityId: string
  /** 报修对象类型 */
  repairObjType: RepairObjType
  /** 报修对象ID */
  repairObjId: string
  /** 报修渠道 */
  repairChannel?: RepairChannel
  /** 房屋ID */
  roomId?: string
  /** 图片ID列表 */
  photos?: string[]
}

/** 更新维修工单请求 */
export interface UpdateRepairReq extends Partial<CreateRepairReq> {
  /** 工单ID */
  repairId: string
}

// ==================== 派单相关类型 ====================

/** 派单/转单/退单请求 */
export interface DispatchRepairReq {
  /** 工单ID */
  repairId: string
  /** 师傅ID */
  staffId: string
  /** 师傅姓名 */
  staffName: string
  /** 操作类型 */
  action: DispatchAction
  /** 处理意见 */
  context: string
  /** 维修类型 */
  repairType?: string
  /** 小区ID */
  communityId?: string
  /** 附加图片 */
  photos?: RepairPhoto[]
  /** 用户ID */
  userId?: string
  /** 用户名称 */
  userName?: string
}

/** 办结工单请求 */
export interface FinishRepairReq {
  /** 工单ID */
  repairId: string
  /** 维修类型标志（1001/1002/1003/1004） */
  feeFlag: MaintenanceType
  /** 处理意见 */
  context: string
  /** 报修渠道 */
  repairChannel?: string
  /** 是否公共区域 */
  publicArea?: string
  /** 维修类型 */
  maintenanceType?: MaintenanceType
  /** 维修类型名称 */
  repairType?: string
  /** 操作类型 */
  action?: string
  /** 小区ID */
  communityId?: string
  /** 维修前图片 */
  beforeRepairPhotos?: RepairPhoto[]
  /** 维修后图片 */
  afterRepairPhotos?: RepairPhoto[]
  /** 报修对象类型 */
  repairObjType?: RepairObjType
  /** 用户ID */
  userId?: string
  /** 用户名称 */
  userName?: string
  /** 门店ID */
  storeId?: string
  /** 选择的物品列表 */
  choosedGoodsList?: RepairResource[]
  /** 总价 */
  totalPrice?: number
  /** 支付方式 */
  payType?: PaymentType
}

// ==================== 评价相关类型 ====================

/** 回访工单请求（业主评价） */
export interface AppraiseRepairReq {
  /** 工单ID */
  repairId: string
  /** 评分（1-5） */
  rating?: number
  /** 评价内容 */
  context: string
  /** 维修类型 */
  repairType?: string
  /** 报修渠道 */
  repairChannel?: string
  /** 是否公共区域 */
  publicArea?: string
  /** 小区ID */
  communityId?: string
  /** 用户ID */
  userId?: string
  /** 用户名称 */
  userName?: string
}

/** 回复评价请求 */
export interface ReplyAppraiseReq {
  /** 评价记录ID */
  ruId: string
  /** 工单ID */
  repairId: string
  /** 回复内容 */
  reply: string
  /** 回复内容（另一个字段名） */
  replyContext?: string
  /** 小区ID */
  communityId?: string
}

// ==================== 统计类型 ====================

/** 维修工单统计 */
export interface RepairStatistics {
  /** 总数 */
  total: number
  /** 按状态统计 */
  statusStats: Record<RepairStatus, number>
  /** 按类型统计 */
  typeStats: Record<string, number>
  /** 按月统计 */
  monthlyStats: Record<string, number>
  /** 平均响应时间 */
  avgResponseTime: string
  /** 满意度 */
  satisfactionRate: string
  /** 平均评分 */
  avgRating?: string
}

// ==================== 辅助类型 ====================

/** 字典项 */
export interface DictItem {
  /** 状态码 */
  statusCd: string
  /** 名称 */
  name: string
}

/** 查询师傅响应 */
export interface RepairStaffsResponse {
  /** 师傅列表 */
  staffs: RepairStaff[]
}

/** 查询物品响应 */
export interface RepairResourcesResponse {
  /** 物品列表 */
  resources: RepairResource[]
  /** 总数 */
  total: number
}

/** 工单详情响应 */
export interface RepairDetailResponse {
  /** 工单信息 */
  ownerRepair: RepairOrder
  /** 流转记录（可选） */
  staffRecords?: RepairStaffRecord[]
}
