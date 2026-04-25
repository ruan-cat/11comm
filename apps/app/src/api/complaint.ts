/**
 * 投诉模块 API 接口定义
 *
 * 对应业务：投诉处理流程管理
 * 旧代码：gitee-example/api/complaint/complaint.js
 */

import type { PaginationResponse } from '@/types/api'
import type {
  AuditComplaintParams,
  ComplaintAppraise,
  ComplaintEvent,
  ComplaintHistoryListResponse,
  ComplaintListResponse,
  ComplaintOperationResponse,
  HandleComplaintParams,
  QueryComplaintAppraiseParams,
  QueryComplaintEventParams,
  QueryComplaintListParams,
  ReplyComplaintAppraiseParams,
  SaveComplaintParams,
} from '@/types/complaint'
import { http } from '@/http/alova'

/** ==================== 查询接口 ==================== */

/**
 * 1. 查询待办投诉列表
 * @description 查询需要处理的投诉工单列表
 * @example getTodoComplaintList({ page: 1, row: 15, userId: 'xxx', communityId: 'xxx' })
 */
export function getTodoComplaintList(params: QueryComplaintListParams) {
  return http.Get<ComplaintListResponse>('/app/auditUser.listAuditComplaints', { params })
}

/**
 * 2. 查询已办投诉列表
 * @description 查询已完成处理的投诉工单列表
 * @example getFinishComplaintList({ page: 1, row: 15, userId: 'xxx', communityId: 'xxx' })
 */
export function getFinishComplaintList(params: QueryComplaintListParams) {
  return http.Get<ComplaintListResponse>('/app/auditUser.listAuditHistoryComplaints', { params })
}

/**
 * 3. 查询投诉历史列表（用户侧）
 * @description 查询用户自己提交的投诉历史
 * @example getUserComplaintHistory({ page: 1, row: 15, userId: 'xxx', communityId: 'xxx', process: 'START' })
 */
export function getUserComplaintHistory(params: QueryComplaintListParams) {
  return http.Get<ComplaintHistoryListResponse>('/app/auditUser.listAuditHistoryComplaints', { params })
}

/**
 * 4. 查询投诉工单流转记录
 * @description 获取投诉单的处理流转时间轴数据
 * @example getComplaintEvents({ complaintId: 'xxx', communityId: 'xxx', page: 1, row: 100 })
 */
export function getComplaintEvents(params: QueryComplaintEventParams) {
  return http.Get<PaginationResponse<ComplaintEvent>>('/app/complaint.listComplaintEvent', { params })
}

/**
 * 5. 查询投诉评价列表
 * @description 获取投诉单的评价记录
 * @example getComplaintAppraises({ complaintId: 'xxx', communityId: 'xxx', page: 1, row: 100 })
 */
export function getComplaintAppraises(params: QueryComplaintAppraiseParams) {
  return http.Get<PaginationResponse<ComplaintAppraise>>('/app/complaintAppraise.listComplaintAppraise', { params })
}

/** ==================== 创建和更新接口 ==================== */

/**
 * 6. 保存投诉（业主提交投诉）
 * @description 业主发起投诉工单
 * @example saveComplaint({ typeCd: '809001', complaintName: '张三', tel: '13800138000', roomId: 'xxx', context: '投诉内容', photos: [], userId: 'xxx', storeId: 'xxx', communityId: 'xxx' })
 */
export function saveComplaint(data: SaveComplaintParams) {
  return http.Post<ComplaintOperationResponse>('/app/complaint', data)
}

/** ==================== 工单处理接口 ==================== */

/**
 * 7. 处理投诉（简单处理）
 * @description 物业人员直接处理投诉工单，提交处理意见
 * @example handleComplaint({ context: '处理意见', communityId: 'xxx', complaintId: 'xxx' })
 */
export function handleComplaint(data: HandleComplaintParams) {
  return http.Post<ComplaintOperationResponse>('/app/complaint.auditComplaint', data)
}

/**
 * 8. 审核投诉（审核处理）
 * @description 审核投诉工单，选择处理结果（已处理/无法处理）
 * @example auditComplaint({ state: '1100', remark: '处理意见', taskId: 'xxx', complaintId: 'xxx', communityId: 'xxx', storeId: 'xxx', userId: 'xxx' })
 */
export function auditComplaint(data: AuditComplaintParams) {
  return http.Post<ComplaintOperationResponse>('/app/complaint.auditComplaint', data)
}

/**
 * 9. 回复投诉评价
 * @description 物业人员回复业主的投诉评价
 * @example replyComplaintAppraise({ appraiseId: 'xxx', communityId: 'xxx', replyContext: '回复内容' })
 */
export function replyComplaintAppraise(data: ReplyComplaintAppraiseParams) {
  return http.Post<ComplaintOperationResponse>('/app/complaintAppraise.replyComplaintAppraise', data)
}
