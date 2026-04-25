/**
 * 物业申请相关API接口定义
 * 使用Alova现代化HTTP客户端
 */

import type { PaginationResponse } from '@/types/api'
import type {
  ApplicationRecord,
  ApplicationRecordDetail,
  ApplicationRecordDetailParams,
  ApplicationRecordListParams,
  CheckUpdateRequest,
  DeleteApplicationRecordRequest,
  DictInfo,
  DictQueryParams,
  FeeDetail,
  FeeDetailParams,
  FeeDiscount,
  FeeDiscountParams,
  PropertyApplication,
  PropertyApplicationDetailParams,
  PropertyApplicationListParams,
  ReviewUpdateRequest,
  SaveApplicationRecordRequest,
} from '@/types/property-application'
import { http } from '@/http/alova'

/**
 * 查询物业申请列表
 * @param params 查询参数
 * @returns 物业申请列表响应
 */
export function getPropertyApplicationList(params: PropertyApplicationListParams) {
  return http.Get<PaginationResponse<PropertyApplication>>('/app/applyRoomDiscount/queryApplyRoomDiscount', {
    params,
  })
}

/**
 * 查询物业申请详情
 * @param params 查询参数
 * @returns 物业申请列表响应（包含单个申请详情）
 */
export function getPropertyApplicationDetail(params: PropertyApplicationDetailParams) {
  return http.Get<PaginationResponse<PropertyApplication>>('/app/applyRoomDiscount/queryApplyRoomDiscount', {
    params,
  })
}

/**
 * 提交验房操作
 * @param data 验房更新数据
 * @returns 操作结果
 */
export function submitCheckUpdate(data: CheckUpdateRequest) {
  return http.Post<void>('/app/applyRoomDiscount/updateApplyRoomDiscount', data)
}

/**
 * 提交审核操作
 * @param data 审核更新数据
 * @returns 操作结果
 */
export function submitReviewUpdate(data: ReviewUpdateRequest) {
  return http.Post<void>('/app/applyRoomDiscount/updateReviewApplyRoomDiscount', data)
}

/**
 * 查询字典表信息
 * @param params 字典查询参数
 * @returns 字典信息列表
 */
export function queryDictInfo(params: DictQueryParams) {
  return http.Get<DictInfo[]>('/callComponent/core/list', {
    params,
  })
}

/**
 * 查询费用折扣列表
 * @param params 查询参数
 * @returns 费用折扣列表
 */
export function getFeeDiscountList(params: FeeDiscountParams) {
  return http.Get<FeeDiscount[]>('/app/feeDiscount/queryFeeDiscount', {
    params,
  })
}

/**
 * 查询费用详情
 * @param params 查询参数
 * @returns 费用详情响应
 */
export function getFeeDetailList(params: FeeDetailParams) {
  return http.Get<{ feeDetails: FeeDetail[] }>('/app/fee.queryFeeDetail', {
    params,
  })
}

/**
 * 查询申请跟踪记录列表
 * @param params 查询参数
 * @returns 跟踪记录列表响应
 */
export function getApplicationRecordList(params: ApplicationRecordListParams) {
  return http.Get<PaginationResponse<ApplicationRecord>>('/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord', {
    params,
  })
}

/**
 * 查询申请跟踪记录详情
 * @param params 查询参数
 * @returns 跟踪记录详情列表
 */
export function getApplicationRecordDetailList(params: ApplicationRecordDetailParams) {
  return http.Get<ApplicationRecordDetail[]>('/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail', {
    params,
  })
}

/**
 * 保存申请跟踪记录
 * @param data 跟踪记录数据
 * @returns 操作结果
 */
export function saveApplicationRecord(data: SaveApplicationRecordRequest) {
  return http.Post<void>('/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord', data)
}

/**
 * 删除申请跟踪记录
 * @param data 删除请求参数
 * @returns 操作结果
 */
export function deleteApplicationRecord(data: DeleteApplicationRecordRequest) {
  return http.Post<void>('/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord', data)
}
