/**
 * 物业申请相关业务类型定义
 */

/** 申请状态枚举 */
export type ApplicationState = '0' | '1' | '2' | '3' | '4' | '5' | '6'

/** 验房状态枚举 */
export type CheckState = '2' | '3'

/** 审批状态枚举 */
export type ReviewState = '4' | '5'

/** 折扣类型枚举 */
export type DiscountType = '3003'

/** 返还方式枚举 */
export type ReturnWay = '1001' | '1002'

/** 详情类型枚举 */
export type DetailType = '1001'

/** 关联类型枚举 */
export type RelationTypeCd = '19000' | '21000'

/** 基础物业申请信息 */
export interface PropertyApplication {
  /** 申请ID */
  ardId: string
  /** 申请类型 */
  applyType: string
  /** 申请类型名称 */
  applyTypeName: string
  /** 房间ID */
  roomId: string
  /** 房间名称 */
  roomName: string
  /** 小区ID */
  communityId: string
  /** 创建人姓名 */
  createUserName: string
  /** 创建人电话 */
  createUserTel: string
  /** 创建备注 */
  createRemark: string
  /** 验房备注 */
  checkRemark: string
  /** 审核备注 */
  reviewRemark: string
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime: string
  /** 费用ID */
  feeId: string
  /** 状态 */
  state: ApplicationState
  /** 状态名称 */
  stateName: string
  /** 图片URL列表 */
  urls: string[]
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/** 物业申请列表项 */
export interface PropertyApplicationItem extends PropertyApplication {
  /** 用于列表显示的简化信息 */
}

/** 物业申请列表参数 */
export interface PropertyApplicationListParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  row: number
  /** 小区ID */
  communityId: string
  /** 房间名称（筛选） */
  roomName?: string
  /** 状态（筛选） */
  state?: string
}

/** 物业申请详情参数 */
export interface PropertyApplicationDetailParams {
  /** 页码（固定为1） */
  page: number
  /** 每页数量（固定为1） */
  row: number
  /** 小区ID */
  communityId: string
  /** 申请ID */
  ardId: string
}

/** 验房更新请求参数 */
export interface CheckUpdateRequest {
  /** 申请ID */
  ardId: string
  /** 小区ID */
  communityId: string
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime: string
  /** 创建备注 */
  createRemark: string
  /** 验房状态 */
  state: CheckState
  /** 验房备注 */
  checkRemark: string
  /** 照片文件ID列表 */
  photos: string[]
}

/** 审批更新请求参数 */
export interface ReviewUpdateRequest {
  /** 申请ID */
  ardId: string
  /** 小区ID */
  communityId: string
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime: string
  /** 创建备注 */
  createRemark: string
  /** 审批状态 */
  state: ReviewState
  /** 审批备注 */
  reviewRemark: string
  /** 折扣类型 */
  discountType: DiscountType
  /** 折扣ID */
  discountId?: string
  /** 返还方式 */
  returnWay?: ReturnWay
  /** 选中的费用项ID列表 */
  selectedFees: string[]
  /** 费用ID */
  feeId: string
  /** 房间ID */
  roomId: string
  /** 验房备注 */
  checkRemark: string
  /** 费用项列表 */
  fees: FeeDetail[]
  /** 配置ID */
  configId: string
  /** 折扣列表 */
  discounts: FeeDiscount[]
}

/** 字典信息项 */
export interface DictInfo {
  /** 状态编码 */
  statusCd: string
  /** 状态名称 */
  name: string
  /** 值 */
  value?: string
}

/** 字典查询参数 */
export interface DictQueryParams {
  /** 字典名称 */
  name: string
  /** 字典类型 */
  type: string
}

/** 费用折扣信息 */
export interface FeeDiscount {
  /** 折扣ID */
  discountId: string
  /** 折扣名称 */
  discountName: string
  /** 折扣类型 */
  discountType: string
  /** 折扣金额 */
  discountAmount: number
  /** 小区ID */
  communityId: string
}

/** 费用折扣查询参数 */
export interface FeeDiscountParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  row: number
  /** 折扣类型 */
  discountType: DiscountType
  /** 小区ID */
  communityId: string
}

/** 费用详情项 */
export interface FeeDetail {
  /** 明细ID */
  detailId: string
  /** 费用名称 */
  feeName: string
  /** 收费金额 */
  receivedAmount: number
  /** 创建时间 */
  createTime: string
  /** 是否选中 */
  checked?: boolean
  /** 费用ID */
  feeId?: string
  /** 房间ID */
  roomId?: string
  /** 小区ID */
  communityId?: string
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

/** 申请跟踪记录 */
export interface ApplicationRecord {
  /** 记录ID */
  ardrId: string
  /** 申请ID */
  applicationId: string
  /** 房间ID */
  roomId: string
  /** 房间名称 */
  roomName: string
  /** 状态 */
  state: string
  /** 状态名称 */
  stateName: string
  /** 备注 */
  remark: string
  /** 创建人姓名 */
  createUserName: string
  /** 创建时间 */
  createTime: string
  /** 小区ID */
  communityId: string
}

/** 申请跟踪记录列表参数 */
export interface ApplicationRecordListParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  row: number
  /** 小区ID */
  communityId: string
  /** 申请ID */
  applicationId: string
  /** 房间名称 */
  roomName: string
  /** 房间ID */
  roomId: string
}

/** 申请跟踪记录详情项 */
export interface ApplicationRecordDetail {
  /** 记录ID */
  ardrId: string
  /** 申请ID */
  applicationId: string
  /** 房间ID */
  roomId: string
  /** 房间名称 */
  roomName: string
  /** 关联类型编码 */
  relTypeCd: RelationTypeCd
  /** 文件URL */
  url: string
  /** 备注 */
  remark: string
  /** 创建时间 */
  createTime: string
  /** 文件类型 */
  fileType?: string
  /** 文件大小 */
  fileSize?: number
}

/** 申请跟踪记录详情查询参数 */
export interface ApplicationRecordDetailParams {
  /** 页码 */
  page: number
  /** 每页数量 */
  row: number
  /** 小区ID */
  communityId: string
  /** 记录ID */
  ardrId: string
  /** 房间名称 */
  roomName: string
}

/** 保存申请跟踪记录请求参数 */
export interface SaveApplicationRecordRequest {
  /** 申请ID */
  applicationId: string
  /** 房间ID */
  roomId: string
  /** 房间名称 */
  roomName: string
  /** 状态 */
  state: string
  /** 状态名称 */
  stateName: string
  /** 照片文件ID列表 */
  photos: string[]
  /** 视频名称 */
  videoName: string
  /** 备注 */
  remark: string
  /** 详情类型 */
  detailType: DetailType
  /** 小区ID */
  communityId: string
  /** 审核备注 */
  examineRemark: string
  /** 是否违规 */
  isTrue: string
}

/** 删除申请跟踪记录请求参数 */
export interface DeleteApplicationRecordRequest {
  /** 记录ID */
  ardrId: string
  /** 小区ID */
  communityId: string
  /** 房间名称 */
  roomName: string
  /** 申请ID */
  applicationId: string
  /** 房间ID */
  roomId: string
  /** 状态 */
  state: string
  /** 状态名称 */
  stateName: string
}
